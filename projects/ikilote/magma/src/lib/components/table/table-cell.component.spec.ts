import { ChangeDetectorRef, Directive, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagmaTableCell } from './table-cell.component';
import { MagmaTableRow } from './table-row.component';

@Directive({})
class MockHost {
    table = { over: jasmine.createSpy('over') };
    inputs = () => [{}];
}

describe('MagmaTableCell', () => {
    let component: MagmaTableCell;
    let fixture: ComponentFixture<MagmaTableCell>;
    let mockCdRef: Partial<ChangeDetectorRef>;
    let mockElementRef: Partial<ElementRef>;

    beforeEach(async () => {
        mockCdRef = {
            detectChanges: jasmine.createSpy('detectChanges'),
        };

        mockElementRef = {
            nativeElement: document.createElement('td'),
        };

        await TestBed.configureTestingModule({
            imports: [MagmaTableCell],
            providers: [
                { provide: ChangeDetectorRef, useValue: mockCdRef },
                { provide: ElementRef, useValue: mockElementRef },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaTableCell);
        component = fixture.componentInstance;
        component.host = new MockHost() as unknown as MagmaTableRow; // mock host
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set baseline class based on input', () => {
        fixture.componentRef.setInput('baseline', true);
        fixture.detectChanges();
        expect(component.el.nativeElement.classList.contains('baseline')).toBeTrue();
    });

    it('should call table.over on mouseover', () => {
        component.row = 1;
        component.index = 2;
        component.mouseOver();
        expect(component.host?.table?.over).toHaveBeenCalledWith(1, 2);
    });

    it('should initialize hover and hoverLink signals', () => {
        expect(component.hover()).toBeFalse();
        expect(component.hoverLink()).toBeFalse();
    });

    it('should update hover signal', () => {
        component.hover.set(true);
        expect(component.hover()).toBeTrue();
    });

    it('should initialize hover and hoverLink signals', () => {
        expect(component.hover()).toBeFalse();
        expect(component.hoverLink()).toBeFalse();
    });

    it('should update hover signal', () => {
        component.hover.set(true);
        expect(component.hover()).toBeTrue();
    });

    it('should update index in ngAfterViewChecked', () => {
        const mockInputs = [{}, {}, component];
        (component.host as any).inputs = () => mockInputs;
        component.ngAfterViewChecked();
        expect(component.index).toBe(2);
        //  expect(mockCdRef.detectChanges).toHaveBeenCalled();
    });

    it('should get table from host', () => {
        expect(component['table']).toBe((component.host as any).table);
    });

    it('should add hover class when hover signal is true', () => {
        component.hover.set(true);
        fixture.detectChanges();
        expect(component.el.nativeElement.classList.contains('hover')).toBeTrue();
    });

    it('should add hover class when hover signal is true', () => {
        component.hover.set(true);
        fixture.detectChanges();
        expect(component.el.nativeElement.classList.contains('hover')).toBeTrue();
    });
});
