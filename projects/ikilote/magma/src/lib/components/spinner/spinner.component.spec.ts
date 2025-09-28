import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaSpinner } from './spinner.component';

describe('MagmaSpinner', () => {
    let component: MagmaSpinner;
    let fixture: ComponentFixture<MagmaSpinner>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaSpinner],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaSpinner);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have 12 div elements', () => {
        const divs = fixture.debugElement.queryAll(By.css('div'));
        expect(divs.length).toBe(12);
    });

    it('should apply default styles if no inputs are provided', () => {
        const hostElement = fixture.nativeElement;
        expect(hostElement.style.getPropertyValue('--height')).toBe('');
        expect(hostElement.style.getPropertyValue('--width')).toBe('');
        expect(hostElement.style.getPropertyValue('--radius')).toBe('');
    });
});

@Component({
    template: `<mg-spinner [size]="size" [tickWidth]="tickWidth" [radius]="radius"></mg-spinner>`,
    imports: [MagmaSpinner],
})
class TestHostComponent {
    size = 100;
    tickWidth = 10;
    radius = 50;
}

describe('MagmaSpinner usage', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let spinnerElement: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaSpinner, TestHostComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostComponent);
        hostFixture.detectChanges();
        spinnerElement = hostFixture.debugElement.query(By.directive(MagmaSpinner)).nativeElement;
    });

    it('should create', () => {
        const spinnerComponent = hostFixture.debugElement.query(By.directive(MagmaSpinner)).componentInstance;
        expect(spinnerComponent).toBeTruthy();
    });

    it('should have 12 div elements', () => {
        const divs = hostFixture.debugElement.queryAll(By.css('mg-spinner div'));
        expect(divs.length).toBe(12);
    });

    it('should apply custom styles based on host component inputs', () => {
        expect(spinnerElement.style.getPropertyValue('--height')).toBe('100px');
        expect(spinnerElement.style.getPropertyValue('--width')).toBe('10px');
        expect(spinnerElement.style.getPropertyValue('--radius')).toBe('50px');
    });

    it('should update styles when host component inputs change', () => {
        hostFixture.componentInstance.size = 200;
        hostFixture.componentInstance.tickWidth = 20;
        hostFixture.componentInstance.radius = 100;
        hostFixture.detectChanges();

        expect(spinnerElement.style.getPropertyValue('--height')).toBe('200px');
        expect(spinnerElement.style.getPropertyValue('--width')).toBe('20px');
        expect(spinnerElement.style.getPropertyValue('--radius')).toBe('100px');
    });
});
