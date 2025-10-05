import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagmaLightDark } from './light-dark.component';

import { MagmaClickEnterDirective } from '../../directives/click-enter.directive';
import { LightDark, PreferenceInterfaceTheme } from '../../services/light-dark';

describe('MagmaLightDark', () => {
    let component: MagmaLightDark;
    let fixture: ComponentFixture<MagmaLightDark>;
    let lightDarkServiceMock: jasmine.SpyObj<LightDark>;

    beforeEach(async () => {
        lightDarkServiceMock = jasmine.createSpyObj('LightDark', ['isLight', 'toggleTheme', 'changeThemeClass'], {
            currentTheme: () => 'light' as PreferenceInterfaceTheme,
        });

        await TestBed.configureTestingModule({
            imports: [MagmaClickEnterDirective],
            providers: [{ provide: LightDark, useValue: lightDarkServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaLightDark);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set clickEnter.disabled based on compact input', () => {
        fixture.componentRef.setInput('compact', false);
        fixture.detectChanges();
        expect(component['clickEnter'].disabled).toBeTrue();
        expect(fixture.nativeElement.classList.contains('compact')).toBeFalse();

        fixture.componentRef.setInput('compact', true);
        fixture.detectChanges();
        expect(component['clickEnter'].disabled).toBeFalse();
        expect(fixture.nativeElement.classList.contains('compact')).toBeTrue();
    });

    it('should apply compact class if input is true', () => {
        fixture.componentRef.setInput('compact', true);
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('compact')).toBeTrue();
        expect(component['clickEnter'].disabled).toBeFalse();

        fixture.componentRef.setInput('compact', false);
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('compact')).toBeFalse();
        expect(component['clickEnter'].disabled).toBeTrue();
    });

    it('should update clickEnter.disabled when compact input changes', () => {
        fixture.componentRef.setInput('compact', false);
        fixture.detectChanges();
        expect(component['clickEnter'].disabled).toBeTrue();

        component.ngOnChanges({
            compact: {
                currentValue: true,
                previousValue: false,
                firstChange: false,
                isFirstChange: () => false,
            },
        } as SimpleChanges);
        expect(component['clickEnter'].disabled).toBeFalse();
    });

    it('should detect click only on toggle element when compact if input is false', () => {
        spyOn(component.change, 'emit');
        fixture.componentRef.setInput('compact', false);
        fixture.detectChanges();
        expect(component['clickEnter'].disabled).toBeTrue();
        fixture.nativeElement.click();

        expect(lightDarkServiceMock.toggleTheme).not.toHaveBeenCalled();
        expect(lightDarkServiceMock.changeThemeClass).not.toHaveBeenCalled();

        fixture.nativeElement.querySelector('.toggle')?.click();

        expect(lightDarkServiceMock.toggleTheme).toHaveBeenCalled();
        expect(lightDarkServiceMock.changeThemeClass).toHaveBeenCalled();
        expect(component.change.emit).toHaveBeenCalled();
    });

    it('should click should be call lightDarkService', () => {
        fixture.componentRef.setInput('compact', true);
        fixture.detectChanges();
        component.click();

        expect(lightDarkServiceMock.toggleTheme).toHaveBeenCalled();
        expect(lightDarkServiceMock.changeThemeClass).toHaveBeenCalled();
    });

    it('should click on component should be call lightDarkService if input is true', () => {
        fixture.componentRef.setInput('compact', true);
        fixture.detectChanges();
        fixture.nativeElement.click();

        expect(lightDarkServiceMock.toggleTheme).toHaveBeenCalled();
        expect(lightDarkServiceMock.changeThemeClass).toHaveBeenCalled();
    });

    it('should emit change event with current theme on click', () => {
        spyOn(component.change, 'emit');
        component.click();
        fixture.detectChanges();
        expect(component.change.emit).toHaveBeenCalled();
    });
});
