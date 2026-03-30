import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { Mocked } from 'vitest';

import { MagmaLightDark } from './light-dark.component';

import { MagmaClickEnterDirective } from '../../directives/click-enter.directive';
import { LightDark, PreferenceInterfaceTheme } from '../../services/light-dark';

describe('MagmaLightDark', () => {
    let component: MagmaLightDark;
    let fixture: ComponentFixture<MagmaLightDark>;
    let lightDarkServiceMock: Mocked<LightDark>;

    beforeEach(async () => {
        lightDarkServiceMock = {
            isLight: vi.fn().mockName('LightDark.isLight'),
            toggleTheme: vi.fn().mockName('LightDark.toggleTheme'),
            changeThemeClass: vi.fn().mockName('LightDark.changeThemeClass'),
            currentTheme: () => 'light' as PreferenceInterfaceTheme,
        } as unknown as Mocked<LightDark>;

        await TestBed.configureTestingModule({
            imports: [MagmaLightDark, MagmaClickEnterDirective],
            providers: [{ provide: LightDark, useValue: lightDarkServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaLightDark);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(async () => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set clickEnter.disabled based on compact input', () => {
        fixture.componentRef.setInput('compact', false);
        fixture.changeDetectorRef.detectChanges();
        expect(component['clickEnter'].disabled).toBe(true);
        expect(fixture.nativeElement.classList.contains('compact')).toBe(false);

        fixture.componentRef.setInput('compact', true);
        fixture.changeDetectorRef.detectChanges();
        expect(component['clickEnter'].disabled).toBe(false);
        expect(fixture.nativeElement.classList.contains('compact')).toBe(true);
    });

    it('should apply compact class if input is true', () => {
        fixture.componentRef.setInput('compact', true);
        fixture.changeDetectorRef.detectChanges();
        expect(fixture.nativeElement.classList.contains('compact')).toBe(true);
        expect(component['clickEnter'].disabled).toBe(false);

        fixture.componentRef.setInput('compact', false);
        fixture.changeDetectorRef.detectChanges();
        expect(fixture.nativeElement.classList.contains('compact')).toBe(false);
        expect(component['clickEnter'].disabled).toBe(true);
    });

    it('should update clickEnter.disabled when compact input changes', () => {
        fixture.componentRef.setInput('compact', false);
        fixture.changeDetectorRef.detectChanges();
        expect(component['clickEnter'].disabled).toBe(true);

        component.ngOnChanges({
            compact: {
                currentValue: true,
                previousValue: false,
                firstChange: false,
                isFirstChange: () => false,
            },
        } as SimpleChanges);
        expect(component['clickEnter'].disabled).toBe(false);
    });

    it('should detect click only on toggle element when compact if input is false', () => {
        vi.spyOn(component.change, 'emit');
        fixture.componentRef.setInput('compact', false);
        fixture.changeDetectorRef.detectChanges();
        expect(component['clickEnter'].disabled).toBe(true);
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
        fixture.changeDetectorRef.detectChanges();
        component.click();

        expect(lightDarkServiceMock.toggleTheme).toHaveBeenCalled();
        expect(lightDarkServiceMock.changeThemeClass).toHaveBeenCalled();
    });

    it('should click on component should be call lightDarkService if input is true', () => {
        fixture.componentRef.setInput('compact', true);
        fixture.changeDetectorRef.detectChanges();
        fixture.nativeElement.click();

        expect(lightDarkServiceMock.toggleTheme).toHaveBeenCalled();
        expect(lightDarkServiceMock.changeThemeClass).toHaveBeenCalled();
    });

    it('should emit change event with current theme on click', () => {
        vi.spyOn(component.change, 'emit');
        component.click();
        fixture.changeDetectorRef.detectChanges();
        expect(component.change.emit).toHaveBeenCalled();
    });
});
