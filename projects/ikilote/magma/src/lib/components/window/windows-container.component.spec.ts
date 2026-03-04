import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagmaWindow } from './window.component';
import { MagmaWindowsContainer } from './windows-container.component';

// We create a Mock of MagmaWindow to be used as contentChildren
@Component({
    selector: 'mg-window',
    template: '',
    standalone: true,
    providers: [{ provide: MagmaWindow, useExisting: MockMagmaWindowComponent }],
})
class MockMagmaWindowComponent {
    index = 0;
    resizerHost = {
        set: jasmine.createSpy('set'),
    };
}

describe('MagmaWindowsContainer', () => {
    let component: MagmaWindowsContainer;
    let fixture: ComponentFixture<MagmaWindowsContainer>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaWindowsContainer, MockMagmaWindowComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaWindowsContainer);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Dimension Management', () => {
        it('should update element dimensions after content check', () => {
            // Setup: Mock native element dimensions
            const element = fixture.nativeElement;
            Object.defineProperty(element, 'offsetWidth', { value: 1024 });
            Object.defineProperty(element, 'offsetHeight', { value: 768 });

            component.ngAfterContentChecked();

            expect(component.widthElementNumber).toBe(1024);
            expect(component.heightElementNumber).toBe(768);
        });
    });

    describe('Windows Management', () => {
        let mockWin1: MockMagmaWindowComponent;
        let mockWin2: MockMagmaWindowComponent;
        let mockWin3: MockMagmaWindowComponent;

        beforeEach(() => {
            mockWin1 = new MockMagmaWindowComponent();
            mockWin2 = new MockMagmaWindowComponent();
            mockWin3 = new MockMagmaWindowComponent();

            // Mock the contentChildren signal
            spyOn(component as any, 'windows').and.returnValue([mockWin1, mockWin2, mockWin3]);
        });

        it('should initialize windows with host and index', () => {
            component.ngAfterContentChecked();

            expect(mockWin1.resizerHost.set).toHaveBeenCalledWith(component);
            expect(mockWin1.index).toBe(0);
            expect(mockWin2.index).toBe(1);
            expect(mockWin3.index).toBe(2);
        });

        it('should bring a selected window to the front (highest index)', () => {
            // Initial indices: 0, 1, 2
            mockWin1.index = 0;
            mockWin2.index = 1;
            mockWin3.index = 2;

            // Select the first window (index 0)
            component.select(mockWin1 as any);

            // Windows with index > selected should decrement
            // Window 2: 1-1 = 0
            // Window 3: 2-1 = 1
            // Selected Window: length - 1 = 2
            expect(mockWin2.index).toBe(0);
            expect(mockWin3.index).toBe(1);
            expect(mockWin1.index).toBe(2);
        });

        it('should not throw error on remove if window exists', () => {
            const winArray = [mockWin1, mockWin2];
            spyOn(winArray, 'indexOf').and.returnValue(0);
            spyOn(winArray, 'slice');

            (component as any).windows.and.returnValue(winArray);

            expect(() => component.remove(mockWin1 as any)).not.toThrow();
        });
    });
});
