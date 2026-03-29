import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import Color from 'colorjs.io';
import type { Mocked } from 'vitest';

import { MagmaColorPickerComponent, magmaColorPickerPalette } from './color-picker.component';

import { Logger } from '../../services/logger';
import { MagmaTabs } from '../tabs/tabs.component';

describe('MagmaColorPickerComponent', () => {
    let component: MagmaColorPickerComponent;
    let fixture: ComponentFixture<MagmaColorPickerComponent>;
    let loggerSpy: Mocked<Logger>;

    beforeEach(async () => {
        loggerSpy = {
            log: vi.fn().mockName('Logger.log'),
        } as unknown as Mocked<Logger>;

        await TestBed.configureTestingModule({
            imports: [MagmaColorPickerComponent],
            providers: [{ provide: Logger, useValue: loggerSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaColorPickerComponent);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(async () => {
        // Wait for async operations to complete
        await new Promise(resolve => setTimeout(resolve, 100));
        fixture?.destroy();
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
        expect(component['hexa']).toBe('#f00');
        expect(component['hsla']).toBe('hsl(0 100% 50%)');
        // 'NG0953: Unexpected emit for destroyed `OutputRef`. The owning directive/component is destroyed.'
    });

    it('should emit colorChange when color is updated', () => {
        vi.spyOn(component.colorChange, 'emit');
        component['updateHex']('#ff0000');
        expect(component.colorChange.emit).toHaveBeenCalledWith('#f00');
    });

    it('should update position and color on click', () => {
        const mockEvent = { layerX: 50, layerY: 50, stopPropagation: vi.fn() };
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

    it('should update color when tab changes to HSL', async () => {
        vi.useFakeTimers();
        component['hexa'] = '#ff0000';
        component.tabChange('hsl');
        vi.advanceTimersByTime(10);
        expect(component['hexa']).toBe('#f00');
        vi.useRealTimers();
    });

    it('should update hexa when a palette color is clicked', () => {
        component['updateHex']('#00ff00');
        expect(component['hexa']).toBe('#0f0');
    });

    it('should force alpha to 1 if alpha input is false', () => {
        fixture.componentRef.setInput('alpha', false);
        component['updateHex']('#ff000080');
        expect(component['rangeAlpha']).toBe(1);
    });

    it('should change alpha input to true is false with input', () => {
        fixture.componentRef.setInput('alpha', true);
        fixture.componentRef.setInput('color', '#ff000000');
        expect(component['rangeAlpha']).toBe(1);

        fixture.changeDetectorRef.detectChanges();
        fixture.componentRef.setInput('alpha', false);
        expect(component['rangeAlpha']).toBe(0);
        // 'NG0953: Unexpected emit for destroyed `OutputRef`. The owning directive/component is destroyed.'
    });

    it('should change alpha input to true is false with ngOnChanges', () => {
        fixture.componentRef.setInput('alpha', true);
        fixture.componentRef.setInput('color', '#ff000000');
        expect(component['rangeAlpha']).toBe(1);
        fixture.changeDetectorRef.detectChanges();

        const mockChange = { alpha: { currentValue: false } };
        component.ngOnChanges(mockChange as unknown as SimpleChanges);

        expect(component['hexa']).toBe('#f00');
        expect(component['rangeAlpha']).toBe(1);
        // 'NG0953: Unexpected emit for destroyed `OutputRef`. The owning directive/component is destroyed.'
    });

    it('should change alpha input to true is false with ngOnChanges with invalid hexa', () => {
        fixture.componentRef.setInput('color', '#ff000000');
        fixture.componentRef.setInput('alpha', true);
        fixture.changeDetectorRef.detectChanges();
        // force remove hexa
        component['hexa'] = '';

        const mockChange = { alpha: { currentValue: false } };
        component.ngOnChanges(mockChange as unknown as SimpleChanges);

        expect(component['hexa']).toBe('#f00');
        expect(component['rangeAlpha']).toBe(1);
        // 'NG0953: Unexpected emit for destroyed `OutputRef`. The owning directive/component is destroyed.'
    });

    it('should not update color if readonly is true', () => {
        fixture.componentRef.setInput('alpha', true);
        const mockEvent = { layerX: 50, layerY: 50, stopPropagation: vi.fn() };
        component['click'](mockEvent as unknown as MouseEvent);
        expect(component['rangeLight']).toBe(16);
    });

    it('should change color input with invalide color', () => {
        const mockChange = { color: { currentValue: '###' } };
        component.ngOnChanges(mockChange as unknown as SimpleChanges);
        expect(loggerSpy.log).toHaveBeenCalled();
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

    it('should convert color correctly (alpha)', () => {
        component['updateHex']('#ff0000ff');
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

    it('should update HSL values and position correctly (2)', () => {
        const color = new Color('#ccc');
        component.zone().nativeElement.style = 'width:100px; height: 100px';
        component['updateWithHLS'](color);
        expect(component['rangeHue']).toBeGreaterThan(0);
        expect(component['pos'].x).toBe(18);
        expect(component['pos'].y).toBe(90);
    });

    describe('updateWithHLS (edge tests)', () => {
        let mockColor: any;

        beforeEach(() => {
            // Mock the native element dimensions to ensure consistent coordinate calculations
            // (110 - 10) results in a 100px working area for easier assertions
            component.zone().nativeElement.style = 'width:110px; height: 110px';

            // Spy on the final side-effect method
            vi.spyOn(component as any, 'updateColor');
        });

        it('should handle null hue (h) by defaulting to 0', () => {
            mockColor = {
                toGamut: () => mockColor,
                to: () => ({ h: null, s: 0.5, l: 0.5, alpha: 1 }),
            };

            (component as any).updateWithHLS(mockColor);

            // 360 - 0 = 360
            expect(component['rangeHue']).toBe(360);
            expect((component as any).updateColor).toHaveBeenCalled();
        });

        it('should handle null saturation (s) by defaulting to 0', () => {
            mockColor = {
                toGamut: () => mockColor,
                to: () => ({ h: 180, s: null, l: 50, alpha: 1 }),
            };

            (component as any).updateWithHLS(mockColor);

            // 100 - 0 = 100
            expect(component['rangeSature']).toBe(100);
            // Formula: 100 - (100 * 0.5) / (100 - 0 / 2) = 100 - 50 = 50
            expect(component['rangeLight']).toBe(50);
        });

        it('should handle null lightness (l) by defaulting to 0', () => {
            mockColor = {
                toGamut: () => mockColor,
                to: () => ({ h: 180, s: 50, l: null, alpha: 1 }),
            };

            (component as any).updateWithHLS(mockColor);

            // 100 - (100 * 0) / (...) = 100
            expect(component['rangeLight']).toBe(100);
            // X position calculation: ((110 - 10) * 100) / 100 = 100
            expect(component['pos'].x).toBe(100);
        });

        it('should use default values (0) when all HSL properties are missing or undefined', () => {
            mockColor = {
                toGamut: () => mockColor,
                to: () => ({ h: undefined, s: undefined, l: undefined, alpha: 0 }),
            };

            (component as any).updateWithHLS(mockColor);

            expect(component['rangeHue']).toBe(360);
            expect(component['rangeAlpha']).toBe(0);
            expect(component['rangeSature']).toBe(100);
            expect(component['rangeLight']).toBe(100);
        });
    });

    it('should start drag', () => {
        expect(component['startDrag']).toBe(false);

        component['dragStart']();
        expect(component['startDrag']).toBe(true);
    });

    describe('Palette && Datalist', () => {
        it('should use default palette if none provided', () => {
            const defaultPalette = component['_palette']();
            expect(defaultPalette).toEqual(magmaColorPickerPalette);
        });

        it('should use custom palette if provided', () => {
            const customPalette = ['#ff0000', '#00ff00', '#0000ff'];
            fixture.componentRef.setInput('palette', customPalette);

            fixture.changeDetectorRef.detectChanges();
            expect(component['_palette']()).toEqual(['#f00', '#0f0', '#00f']);
        });

        it('should display datalist colors if provided', async () => {
            const datalist = ['#ff0000', '#00ff00'];
            fixture.componentRef.setInput('datalist', datalist);
            fixture.changeDetectorRef.detectChanges();

            // select tab palette
            const tabs = fixture.debugElement.query(By.directive(MagmaTabs));
            (tabs.componentInstance as MagmaTabs).update('palette');
            fixture.changeDetectorRef.detectChanges();
            await fixture.whenStable();

            // palette size
            const content = fixture.debugElement.query(By.css('#tab-content-palette'));
            expect(content.nativeElement.querySelectorAll('button').length).toBe(
                magmaColorPickerPalette.length + datalist.length,
            );
        });

        it('should update hexa when clicking a palette color', async () => {
            const customPalette = ['#ff0000', '#00ff00'];
            fixture.componentRef.setInput('palette', customPalette);
            fixture.changeDetectorRef.detectChanges();

            // select tab palette
            const tabs = fixture.debugElement.query(By.directive(MagmaTabs));
            (tabs.componentInstance as MagmaTabs).update('palette');
            fixture.changeDetectorRef.detectChanges();
            await fixture.whenStable();

            // palette select
            const button = fixture.nativeElement.querySelector('.base button:first-child');
            button.click();
            fixture.changeDetectorRef.detectChanges();
            await fixture.whenStable();
            
            expect(component['hexa']).toBe('#f00');
        });

        it('should update hexa when clicking a datalist color', async () => {
            const datalist = ['#ff0000', '#00ff00'];
            fixture.componentRef.setInput('datalist', datalist);
            fixture.changeDetectorRef.detectChanges();

            // select tab palette
            const tabs = fixture.debugElement.query(By.directive(MagmaTabs));
            (tabs.componentInstance as MagmaTabs).update('palette');
            fixture.changeDetectorRef.detectChanges();
            await fixture.whenStable();

            // palette select
            const button = fixture.nativeElement.querySelector('.datalist button:last-child');
            button.click();
            expect(component['hexa']).toBe('#0f0');
        });

        it('should apply correct style to color buttons', async () => {
            const customPalette = ['#ff0000', '#00ff00'];
            fixture.componentRef.setInput('palette', customPalette);

            fixture.changeDetectorRef.detectChanges();

            // select tab palette
            const tabs = fixture.debugElement.query(By.directive(MagmaTabs));
            (tabs.componentInstance as MagmaTabs).update('palette');
            fixture.changeDetectorRef.detectChanges();
            await fixture.whenStable();

            // test color var
            const buttons = fixture.nativeElement.querySelectorAll('.base button');
            expect(buttons[0].style.getPropertyValue('--color')).toBe('#f00');
        });

        it('should add .selected class to the active color button', async () => {
            const customPalette = ['#ff0000', '#00ff00'];
            fixture.componentRef.setInput('palette', customPalette);
            fixture.changeDetectorRef.detectChanges();

            // select tab palette
            const tabs = fixture.debugElement.query(By.directive(MagmaTabs));
            (tabs.componentInstance as MagmaTabs).update('palette');
            fixture.changeDetectorRef.detectChanges();
            await fixture.whenStable();

            // select color
            component['updateHex'](customPalette[0]);
            fixture.changeDetectorRef.detectChanges();

            const buttons = fixture.nativeElement.querySelectorAll('.base button');
            expect(buttons[0].classList).toContain('selected');
        });

        it('should not display datalist section if empty', async () => {
            fixture.componentRef.setInput('datalist', []);
            fixture.changeDetectorRef.detectChanges();

            // select tab palette
            const tabs = fixture.debugElement.query(By.directive(MagmaTabs));
            (tabs.componentInstance as MagmaTabs).update('palette');
            fixture.changeDetectorRef.detectChanges();
            await fixture.whenStable();

            // no datalist
            const palettes = fixture.nativeElement.querySelectorAll('.palette');
            expect(palettes.length).toBe(1);
            const data = fixture.nativeElement.querySelector('.data');
            expect(data).toBeNull();
        });
    });
});
