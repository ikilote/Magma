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

    it('should update styles when host component inputs change', () => {
        fixture.componentRef.setInput('size', 200);
        fixture.componentRef.setInput('tickWidth', 20);
        fixture.componentRef.setInput('radius', 100);
        fixture.detectChanges();

        const hostElement = fixture.nativeElement;
        expect(hostElement.style.getPropertyValue('--height')).toBe('200px');
        expect(hostElement.style.getPropertyValue('--width')).toBe('20px');
        expect(hostElement.style.getPropertyValue('--radius')).toBe('100px');
    });
});
