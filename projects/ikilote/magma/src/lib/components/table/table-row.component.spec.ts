import { ChangeDetectorRef, Directive, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagmaTableCell } from './table-cell.component';
import { MagmaTableGroup } from './table-group.component';
import { MagmaTableRow } from './table-row.component';
import { MagmaTable } from './table.component';

@Directive({})
class MockHost {
    inputs = () => [{}];
    _data = [[]];
}

describe('MagmaTableRow', () => {
    let component: MagmaTableRow;
    let fixture: ComponentFixture<MagmaTableRow>;
    let mockHost: MagmaTableGroup;
    let mockTable: MagmaTable;
    let mockCdRef: Partial<ChangeDetectorRef>;
    let mockElementRef: Partial<ElementRef>;

    beforeEach(async () => {
        mockHost = new MockHost() as unknown as MagmaTableGroup;
        mockHost;

        mockTable = {} as unknown as MagmaTable;

        mockCdRef = {
            detectChanges: jasmine.createSpy('detectChanges'),
        };

        mockElementRef = {
            nativeElement: document.createElement('tr'),
        };

        await TestBed.configureTestingModule({
            imports: [MagmaTableRow],
            providers: [
                { provide: ChangeDetectorRef, useValue: mockCdRef },
                { provide: ElementRef, useValue: mockElementRef },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaTableRow);
        component = fixture.componentInstance;
        component.host = mockHost;
        component.table = mockTable as MagmaTable;
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

    it('should initialize index and _data in ngAfterViewInit', () => {
        const mockCells = [
            { index: 0, el: { nativeElement: { textContent: 'Cell 1' } }, cd: { detectChanges: jasmine.createSpy() } },
            { index: 1, el: { nativeElement: { textContent: 'Cell 2' } }, cd: { detectChanges: jasmine.createSpy() } },
        ] as unknown as MagmaTableCell[];

        (component as any).inputs = () => mockCells;

        component.ngAfterViewInit();
        expect(component._data).toEqual([
            { cell: mockCells[0], row: component, textContent: 'Cell 1' },
            { cell: mockCells[1], row: component, textContent: 'Cell 2' },
        ]);
        mockCells.forEach(cell => expect(cell.cd.detectChanges).toHaveBeenCalled());
    });

    it('should update index and link cells in ngAfterViewChecked', () => {
        const mockCells = [
            {
                host: undefined,
                table: null,
                row: null,
                index: 0,
                el: { nativeElement: { textContent: 'Cell 1' } },
                cd: { detectChanges: jasmine.createSpy() },
            },
            {
                host: undefined,
                table: null,
                row: null,
                index: 0,
                el: { nativeElement: { textContent: 'Cell 2' } },
                cd: { detectChanges: jasmine.createSpy() },
            },
        ] as unknown as MagmaTableCell[];

        (component as any).inputs = () => mockCells;
        (component.host as any).inputs = () => [component];

        component.ngAfterViewChecked();
        mockCells.forEach(cell => {
            expect(cell.host).toEqual(component);
            expect(cell.table).toEqual(mockTable);
            expect(cell.row).toEqual(component.index);
        });
    });

    it('should not throw if host is not defined', () => {
        component.host = undefined;
        expect(() => component.ngAfterViewInit()).not.toThrow();
    });

    it('should not throw if inputs is empty', () => {
        (component as any).inputs = () => [];
        expect(() => component.ngAfterViewInit()).not.toThrow();
    });
});
