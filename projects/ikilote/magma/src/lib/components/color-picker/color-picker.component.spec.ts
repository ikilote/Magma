import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import Color from 'colorjs.io';

import { MagmaColorPickerComponent } from './color-picker.component';

import { Logger } from '../../services/logger';

describe('MagmaColorPickerComponent', () => {
    let component: MagmaColorPickerComponent;
    let fixture: ComponentFixture<MagmaColorPickerComponent>;
    let loggerSpy: jasmine.SpyObj<Logger>;

    beforeEach(async () => {
        loggerSpy = jasmine.createSpyObj('Logger', ['log']);

        await TestBed.configureTestingModule({
            imports: [MagmaColorPickerComponent],

            providers: [{ provide: Logger, useValue: loggerSpy }],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(MagmaColorPickerComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(MagmaColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(component['rangeHue']).toBe(0);
        expect(component['rangeAlpha']).toBe(1);
        expect(component['hexa']).toBe('');
    });

    it('should update color when input color changes', () => {
        fixture.componentRef.setInput('color', '#ff0000');
        component.ngOnChanges({
            color: {
                currentValue: '#ff0000',
                previousValue: '',
                firstChange: true,
                isFirstChange: () => true,
            },
        });
        expect(component['hexa']).not.toBe('');
        expect(component['hsla']).toContain('hsl');
    });

    it('should emit colorChange when color is updated', () => {
        spyOn(component.colorChange, 'emit');
        component['updateHex']('#ff0000');
        expect(component.colorChange.emit).toHaveBeenCalledWith('#f00');
    });

    it('should update position and color on click', () => {
        const mockEvent = { layerX: 50, layerY: 50, stopPropagation: jasmine.createSpy() };
        component.zone().nativeElement.style = 'width:100px; height: 100px';
        component['click'](mockEvent as unknown as MouseEvent);
        expect(component['rangeLight']).toBe(56);
        expect(component['rangeSature']).toBe(56);
    });

    it('should update color on drag end', () => {
        const mockEvent = { source: { _dragRef: { _activeTransform: { x: 50, y: 50 } } } };
        component.zone().nativeElement.style = 'width:100px; height: 100px';
        component['dragEnd'](mockEvent as unknown as CdkDragEnd<any>);
        expect(component['rangeLight']).toBe(56);
        expect(component['rangeSature']).toBe(56);
    });

    it('should update color when tab changes to HSL', fakeAsync(() => {
        component['hexa'] = '#ff0000';
        component.tabChange('hsl');
        tick(10);
        expect(component['hexa']).toBe('#f00');
    }));

    it('should update hexa when a palette color is clicked', () => {
        component['updateHex']('#00ff00');
        expect(component['hexa']).toBe('#0f0');
    });

    it('should force alpha to 1 if alpha input is false', () => {
        fixture.componentRef.setInput('alpha', false);
        component['updateHex']('#ff000080');
        expect(component['rangeAlpha']).toBe(1);
    });

    it('should not update color if readonly is true', () => {
        fixture.componentRef.setInput('alpha', true);
        const mockEvent = { layerX: 50, layerY: 50, stopPropagation: jasmine.createSpy() };
        component['click'](mockEvent as unknown as MouseEvent);
        expect(component['rangeLight']).toBe(16);
    });

    it('should clear all values', () => {
        component['hexa'] = '#ff0000';
        component.clear();
        expect(component['hexa']).toBe('');
        expect(component['rangeHue']).toBe(0);
        expect(component['rangeAlpha']).toBe(1);
    });

    it('should convert color correctly', () => {
        component['updateHex']('#ff0000');
        expect(component['hsla']).toBe('hsl(0 100% 50%)');
        expect(component['rgba']).toBe('rgb(100% 0% 0%)');
    });

    it('should convert incorrect color', () => {
        component['updateHex']('///');
        expect(component['hsla']).toBe('');
        expect(component['rgba']).toBe('');
        expect(loggerSpy.log).toHaveBeenCalled();
    });

    it('should update HSL values and position correctly', () => {
        const color = new Color('#ff0000');
        component.zone().nativeElement.style = 'width:100px; height: 100px';
        component['updateWithHLS'](color);
        expect(component['rangeHue']).toBeGreaterThan(0);
        expect(component['pos'].x).toBe(0);
        expect(component['pos'].y).toBe(0);
    });
});
