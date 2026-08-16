import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { Mocked } from 'vitest';

import { VisionTheme, VisionThemeType } from './vision-theme';

describe('VisionTheme', () => {
    let service: VisionTheme;
    let mockRenderer: Mocked<Renderer2>;
    let mockRendererFactory: Mocked<RendererFactory2>;

    beforeEach(() => {
        mockRenderer = {
            addClass: vi.fn().mockName('Renderer2.addClass'),
            removeClass: vi.fn().mockName('Renderer2.removeClass'),
        } as unknown as Mocked<Renderer2>;
        mockRendererFactory = {
            createRenderer: vi.fn().mockName('RendererFactory2.createRenderer'),
        } as unknown as Mocked<RendererFactory2>;
        mockRendererFactory.createRenderer.mockReturnValue(mockRenderer);

        TestBed.configureTestingModule({
            providers: [VisionTheme, { provide: RendererFactory2, useValue: mockRendererFactory }],
        });

        service = TestBed.inject(VisionTheme);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        TestBed.resetTestingModule();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should default to none', () => {
        expect(service.current()).toBe('none');
        expect(service.theme()).toBe('none');
        expect(service.activeThemes()).toEqual([]);
    });

    describe('set() — single mode', () => {
        it('should set a theme and add CSS class', () => {
            service.set('protanopia');
            expect(service.current()).toBe('protanopia');
            expect(service.activeThemes()).toEqual(['protanopia']);
            expect(mockRenderer.addClass).toHaveBeenCalledWith(document.body, 'theme-protanopia');
        });

        it('should remove previous theme class when setting a new one', () => {
            service.set('protanopia');
            mockRenderer.removeClass.mockClear();

            service.set('tritanopia');
            expect(mockRenderer.removeClass).toHaveBeenCalledWith(document.body, 'theme-protanopia');
            expect(mockRenderer.addClass).toHaveBeenCalledWith(document.body, 'theme-tritanopia');
            expect(service.activeThemes()).toEqual(['tritanopia']);
        });

        it('should remove all theme classes when set to none', () => {
            service.set('high-contrast');
            mockRenderer.removeClass.mockClear();

            service.set('none');
            expect(mockRenderer.removeClass).toHaveBeenCalledWith(document.body, 'theme-high-contrast');
            expect(service.current()).toBe('none');
            expect(service.activeThemes()).toEqual([]);
        });

        it('should emit themeChange$ on change', () => {
            const emitted: VisionThemeType[] = [];
            service.themeChange$.subscribe(v => emitted.push(v));

            service.set('protanopia');
            service.set('none');

            expect(emitted).toEqual(['protanopia', 'none']);
        });

        it('should emit activeThemesChange$ on change', () => {
            const emitted: VisionThemeType[][] = [];
            service.activeThemesChange$.subscribe(v => emitted.push(v));

            service.set('protanopia');
            service.set('none');

            expect(emitted).toEqual([['protanopia'], []]);
        });
    });

    describe('next() / previous()', () => {
        it('should cycle forward with next()', () => {
            expect(service.current()).toBe('none');
            service.next();
            expect(service.current()).toBe('protanopia');
            service.next();
            expect(service.current()).toBe('tritanopia');
            service.next();
            expect(service.current()).toBe('high-contrast');
            service.next();
            expect(service.current()).toBe('none');
        });

        it('should cycle backward with previous()', () => {
            expect(service.current()).toBe('none');
            service.previous();
            expect(service.current()).toBe('high-contrast');
            service.previous();
            expect(service.current()).toBe('tritanopia');
        });
    });

    describe('add() / remove() / toggle() — multi mode', () => {
        it('should add a theme without removing existing ones', () => {
            service.add('protanopia');
            service.add('high-contrast');

            expect(service.activeThemes()).toEqual(['protanopia', 'high-contrast']);
            expect(mockRenderer.addClass).toHaveBeenCalledWith(document.body, 'theme-protanopia');
            expect(mockRenderer.addClass).toHaveBeenCalledWith(document.body, 'theme-high-contrast');
        });

        it('should not add a theme twice', () => {
            service.add('protanopia');
            service.add('protanopia');
            expect(service.activeThemes()).toEqual(['protanopia']);
        });

        it('should not add none', () => {
            service.add('none');
            expect(service.activeThemes()).toEqual([]);
        });

        it('should remove a specific theme', () => {
            service.add('protanopia');
            service.add('high-contrast');
            service.remove('protanopia');

            expect(service.activeThemes()).toEqual(['high-contrast']);
            expect(mockRenderer.removeClass).toHaveBeenCalledWith(document.body, 'theme-protanopia');
        });

        it('should set theme signal to last remaining after remove', () => {
            service.add('protanopia');
            service.add('high-contrast');
            service.remove('high-contrast');

            expect(service.theme()).toBe('protanopia');
        });

        it('should set theme signal to none when all removed', () => {
            service.add('protanopia');
            service.remove('protanopia');

            expect(service.theme()).toBe('none');
            expect(service.activeThemes()).toEqual([]);
        });

        it('should toggle: add if not present', () => {
            service.toggle('tritanopia');
            expect(service.isActive('tritanopia')).toBe(true);
        });

        it('should toggle: remove if present', () => {
            service.add('tritanopia');
            service.toggle('tritanopia');
            expect(service.isActive('tritanopia')).toBe(false);
        });

        it('should report isActive correctly', () => {
            expect(service.isActive('protanopia')).toBe(false);
            service.add('protanopia');
            expect(service.isActive('protanopia')).toBe(true);
        });

        it('should emit activeThemesChange$ on add/remove', () => {
            const emitted: VisionThemeType[][] = [];
            service.activeThemesChange$.subscribe(v => emitted.push([...v]));

            service.add('protanopia');
            service.add('high-contrast');
            service.remove('protanopia');

            expect(emitted).toEqual([['protanopia'], ['protanopia', 'high-contrast'], ['high-contrast']]);
        });
    });

    describe('clear()', () => {
        it('should remove all active themes', () => {
            service.add('protanopia');
            service.add('high-contrast');
            service.clear();

            expect(service.activeThemes()).toEqual([]);
            expect(service.theme()).toBe('none');
        });
    });

    it('should expose available themes metadata', () => {
        expect(service.availableThemes.length).toBe(4);
        expect(service.availableThemes[0].key).toBe('none');
        expect(service.availableThemes[1].key).toBe('protanopia');
        expect(service.availableThemes[2].key).toBe('tritanopia');
        expect(service.availableThemes[3].key).toBe('high-contrast');
    });
});
