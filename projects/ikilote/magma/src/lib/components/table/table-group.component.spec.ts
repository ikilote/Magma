import { Directive, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagmaTableGroup } from './table-group.component';
import { MagmaTableRow } from './table-row.component';
import { MagmaTable } from './table.component';

@Directive({})
class MockHost {
    _data = { thead: [], tbody: [], tfoot: [] };
    table = { over: vi.fn() };
    clearOver = vi.fn();
    inputs = () => [{}];
}

describe('MagmaTableGroup', () => {
    let component: MagmaTableGroup;
    let fixture: ComponentFixture<MagmaTableGroup>;
    let mockHost: MagmaTable;
    let mockElementRef: Partial<ElementRef>;

    beforeEach(async () => {
        mockHost = new MockHost() as unknown as MagmaTable; // mock host

        mockElementRef = {
            nativeElement: document.createElement('tbody'),
        };

        await TestBed.configureTestingModule({
            imports: [MagmaTableGroup],
            providers: [
                { provide: MagmaTable, useValue: mockHost },
                { provide: ElementRef, useValue: mockElementRef },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaTableGroup);
        component = fixture.componentInstance;
        component.host = mockHost;
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

    it('should set sticky class based on input', () => {
        fixture.componentRef.setInput('sticky', true);
        fixture.changeDetectorRef.detectChanges();
        expect(component['el'].nativeElement.classList.contains('sticky')).toBe(true);
    });

    it('should set baseline class based on input', () => {
        fixture.componentRef.setInput('baseline', true);
        fixture.changeDetectorRef.detectChanges();
        expect(component['el'].nativeElement.classList.contains('baseline')).toBe(true);
    });

    it('should call host.clearOver on mouseout', () => {
        component.mouseOut();
        expect(component.host?.clearOver).toHaveBeenCalled();
    });

    it('should set host and table for each row in ngAfterViewChecked', () => {
        const mockRows = [
            { host: undefined, table: null },
            { host: undefined, table: null },
        ] as unknown as MagmaTableRow[];

        (component as any)['inputs'] = () => mockRows;

        component.ngAfterViewChecked();
        mockRows.forEach(row => {
            expect(row.host).toEqual(component);
            expect(row.table).toEqual(component.host);
        });
    });

    it('should not override existing host and table in ngAfterViewChecked', () => {
        const existingHost = { test: 'host' } as any;
        const existingTable = { test: 'table' } as any;
        const mockRows = [{ host: existingHost, table: existingTable }] as unknown as MagmaTableRow[];

        (component as any)['inputs'] = () => mockRows;

        component.ngAfterViewChecked();
        // Should not override existing values due to ??= operator
        expect(mockRows[0].host).toEqual(existingHost);
        expect(mockRows[0].table).toEqual(existingTable);
    });

    ['thead', 'tbody', 'tfoot'].forEach(e => {
        it('should set _data based on tagName (' + e + ')', () => {
            mockElementRef.nativeElement = document.createElement(e);
            fixture = TestBed.createComponent(MagmaTableGroup);
            component = fixture.componentInstance;
            expect(component._data).toEqual((mockHost._data as any)[e]);
        });
    });

    it('should not throw on mouseOut when host is undefined', () => {
        component.host = undefined;
        expect(() => component.mouseOut()).not.toThrow();
    });

    it('should not set table on rows when host is undefined in ngAfterViewChecked', () => {
        const mockRows = [{ host: undefined, table: null }] as unknown as MagmaTableRow[];
        (component as any)['inputs'] = () => mockRows;
        component.host = undefined;
        expect(() => component.ngAfterViewChecked()).not.toThrow();
        // host is set via ??= but table should remain null since host is undefined
        expect(mockRows[0].table).toBeNull();
    });
});
