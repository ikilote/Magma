import { Directive, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagmaTableGroup } from './table-group.component';
import { MagmaTableRow } from './table-row.component';
import { MagmaTable } from './table.component';

@Directive({})
class MockHost {
    _data = { thead: [], tbody: [], tfoot: [] };
    table = { over: jasmine.createSpy('over') };
    clearOver = jasmine.createSpy('clearOver');
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
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set sticky class based on input', () => {
        fixture.componentRef.setInput('sticky', true);
        fixture.detectChanges();
        expect(component['el'].nativeElement.classList.contains('sticky')).toBeTrue();
    });

    it('should set baseline class based on input', () => {
        fixture.componentRef.setInput('baseline', true);
        fixture.detectChanges();
        expect(component['el'].nativeElement.classList.contains('baseline')).toBeTrue();
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

    ['thead', 'tbody', 'tfoot'].forEach(e => {
        it('should set _data based on tagName (' + e + ')', () => {
            mockElementRef.nativeElement = document.createElement(e);
            fixture = TestBed.createComponent(MagmaTableGroup);
            component = fixture.componentInstance;
            expect(component._data).toEqual((mockHost._data as any)[e]);
        });
    });
});
