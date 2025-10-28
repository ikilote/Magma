import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagmaTableGroup } from './table-group.component';
import { MagmaTable, MagmaTableData } from './table.component';

describe('MagmaTable', () => {
    let component: MagmaTable;
    let fixture: ComponentFixture<MagmaTable>;
    let mockCell: MagmaTableData;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [MagmaTable] }).compileComponents();

        fixture = TestBed.createComponent(MagmaTable);
        component = fixture.componentInstance;
        fixture.detectChanges();

        mockCell = {
            cell: { hover: { set: jasmine.createSpy() }, hoverLink: { set: jasmine.createSpy() } },
        } as unknown as MagmaTableData;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set baseline class based on input', () => {
        fixture.componentRef.setInput('baseline', true);
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('baseline')).toBeTrue();
    });

    it('should set hoverLink for thead and tfoot cells when hover or hoverCol is true', () => {
        component._data = {
            thead: [[mockCell]],
            tbody: [],
            tfoot: [[mockCell]],
        };
        fixture.componentRef.setInput('hover', true);
        component.over(0, 0);
        expect(component._data.thead[0][0].cell.hoverLink.set).toHaveBeenCalledWith(true);
        expect(component._data.tfoot[0][0].cell.hoverLink.set).toHaveBeenCalledWith(true);
    });

    it('should set hover for tbody cells when hover or hoverCell is true', () => {
        component._data = {
            thead: [],
            tbody: [
                [{ cell: { hover: { set: jasmine.createSpy() }, hoverLink: { set: jasmine.createSpy() } } } as any],
            ],
            tfoot: [],
        };
        fixture.componentRef.setInput('hover', true);
        component.over(0, 0);
        expect(component._data.tbody[0][0].cell.hover.set).toHaveBeenCalledWith(true);
    });

    it('should set hoverLink for tbody cells when hoverRow and hoverCol are true', () => {
        component._data = {
            thead: [],
            tbody: [
                [{ cell: { hover: { set: jasmine.createSpy() }, hoverLink: { set: jasmine.createSpy() } } } as any],
            ],
            tfoot: [],
        };
        fixture.componentRef.setInput('hoverRow', true);
        fixture.componentRef.setInput('hoverCol', true);
        component.over(0, 0);
        expect(component._data.tbody[0][0].cell.hoverLink.set).toHaveBeenCalledWith(true);
    });

    it('should set hoverLink for tbody cells when hoverCol are true', () => {
        component._data = {
            thead: [],
            tbody: [
                [{ cell: { hover: { set: jasmine.createSpy() }, hoverLink: { set: jasmine.createSpy() } } } as any],
            ],
            tfoot: [],
        };
        fixture.componentRef.setInput('hoverCol', true);
        component.over(0, 0);
        expect(component._data.tbody[0][0].cell.hoverLink.set).toHaveBeenCalledWith(true);
    });

    it('should set hoverLink for tbody cells when hoverRow are true', () => {
        component._data = {
            thead: [],
            tbody: [
                [{ cell: { hover: { set: jasmine.createSpy() }, hoverLink: { set: jasmine.createSpy() } } } as any],
            ],
            tfoot: [],
        };
        fixture.componentRef.setInput('hoverRow', true);
        component.over(0, 0);
        expect(component._data.tbody[0][0].cell.hoverLink.set).toHaveBeenCalledWith(true);
    });

    it('should set hoverLink for tbody cells when hoverCell are true', () => {
        component._data = {
            thead: [],
            tbody: [
                [{ cell: { hover: { set: jasmine.createSpy() }, hoverLink: { set: jasmine.createSpy() } } } as any],
            ],
            tfoot: [],
        };
        fixture.componentRef.setInput('hoverCell', true);
        component.over(0, 0);
        expect(component._data.tbody[0][0].cell.hover.set).toHaveBeenCalledWith(true);
    });

    it('should clear hover and hoverLink for all cells', () => {
        component._data = {
            thead: [
                [{ cell: { hover: { set: jasmine.createSpy() }, hoverLink: { set: jasmine.createSpy() } } } as any],
            ],
            tbody: [
                [{ cell: { hover: { set: jasmine.createSpy() }, hoverLink: { set: jasmine.createSpy() } } } as any],
            ],
            tfoot: [
                [{ cell: { hover: { set: jasmine.createSpy() }, hoverLink: { set: jasmine.createSpy() } } } as any],
            ],
        };
        component.clearOver();
        component._data.thead.forEach(row =>
            row.forEach(cell => {
                expect(cell.cell.hover.set).toHaveBeenCalledWith(false);
                expect(cell.cell.hoverLink.set).toHaveBeenCalledWith(false);
            }),
        );
        component._data.tbody.forEach(row =>
            row.forEach(cell => {
                expect(cell.cell.hover.set).toHaveBeenCalledWith(false);
                expect(cell.cell.hoverLink.set).toHaveBeenCalledWith(false);
            }),
        );
        component._data.tfoot.forEach(row =>
            row.forEach(cell => {
                expect(cell.cell.hover.set).toHaveBeenCalledWith(false);
                expect(cell.cell.hoverLink.set).toHaveBeenCalledWith(false);
            }),
        );
    });

    it('should set host for each group in ngAfterViewChecked', () => {
        const mockGroups = [{ host: null }, { host: null }] as unknown as MagmaTableGroup[];
        (component as any).inputs = () => mockGroups;
        component.ngAfterViewChecked();
        mockGroups.forEach(group => {
            expect(group.host).toBe(component);
        });
    });

    it('should not throw if inputs is empty', () => {
        (component as any).inputs = () => [];
        expect(() => component.ngAfterViewChecked()).not.toThrow();
    });
});
