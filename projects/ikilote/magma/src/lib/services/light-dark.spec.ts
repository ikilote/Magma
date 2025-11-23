import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LightDark } from './light-dark';

describe('LightDark', () => {
    let service: LightDark;
    let mockRenderer: jasmine.SpyObj<Renderer2>;
    let mockRendererFactory: jasmine.SpyObj<RendererFactory2>;
    let mockMatchMedia: any;

    beforeEach(() => {
        // Create mocks for Renderer2 and RendererFactory2
        mockRenderer = jasmine.createSpyObj('Renderer2', ['addClass', 'removeClass']);
        mockRendererFactory = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
        mockRendererFactory.createRenderer.and.returnValue(mockRenderer);

        // Mock matchMedia and its addEventListener
        mockMatchMedia = {
            matches: false,
            addEventListener: jasmine.createSpy('addEventListener'),
        };
        spyOn(window, 'matchMedia').and.returnValue(mockMatchMedia);

        // Manually create the service and inject the mocks
        service = TestBed.inject(LightDark);
        (service as any).rendererFactory = mockRendererFactory;
        (service as any).renderer = mockRenderer;
    });

    describe('init', () => {
        it('should set browserLightDark based on prefers-color-scheme: dark', () => {
            mockMatchMedia.matches = true;
            service.init();
            expect((service as any).browserLightDark).toBe('dark');
        });

        it('should set browserLightDark based on prefers-color-scheme: light', () => {
            mockMatchMedia.matches = false;
            service.init();
            expect((service as any).browserLightDark).toBe('light');
        });

        it('should set userLightDark if provided', () => {
            service.init('dark');
            expect((service as any).userLightDark).toBe('dark');
        });

        it('should call changeThemeClass on init', () => {
            spyOn(service as any, 'changeThemeClass');
            service.init();
            expect((service as any).changeThemeClass).toHaveBeenCalled();
        });

        it('should only initialize once', () => {
            spyOn(service as any, 'changeThemeClass');
            service.init();
            service.init();
            expect((service as any).changeThemeClass).toHaveBeenCalledTimes(1);
        });

        it('should update browserLightDark and call changeThemeClass when system theme changes: dark', () => {
            spyOn(service as any, 'changeThemeClass');
            service.init();

            // Get the callback function from addEventListener
            const listener = mockMatchMedia.addEventListener.calls.mostRecent().args[1];

            // Simulate a change event
            const mockEvent = { matches: true };
            listener(mockEvent);

            expect((service as any).browserLightDark).toBe('dark');
            expect((service as any).changeThemeClass).toHaveBeenCalled();
        });

        it('should update browserLightDark and call changeThemeClass when system theme changes: light', () => {
            spyOn(service as any, 'changeThemeClass');
            service.init();

            // Get the callback function from addEventListener
            const listener = mockMatchMedia.addEventListener.calls.mostRecent().args[1];

            // Simulate a change event
            const mockEvent = { matches: false };
            listener(mockEvent);

            expect((service as any).browserLightDark).toBe('light');
            expect((service as any).changeThemeClass).toHaveBeenCalled();
        });
    });

    describe('set', () => {
        it('should set userLightDark and call changeThemeClass', () => {
            spyOn(service as any, 'changeThemeClass');
            service.set('dark');
            expect((service as any).userLightDark).toBe('dark');
            expect((service as any).changeThemeClass).toHaveBeenCalled();
        });
    });

    describe('currentTheme', () => {
        it('should return userLightDark if set', () => {
            (service as any).userLightDark = 'dark';
            expect(service.currentTheme()).toBe('dark');
        });

        it('should return browserLightDark if userLightDark is not set', () => {
            (service as any).browserLightDark = 'light';
            expect(service.currentTheme()).toBe('light');
        });

        it('should return "light" as default', () => {
            expect(service.currentTheme()).toBe('light');
        });
    });

    describe('changeThemeClass', () => {
        it('should add "light-mode" class if current theme is light', () => {
            spyOn(service, 'isLight').and.returnValue(true);
            service.changeThemeClass();
            expect(mockRenderer.addClass).toHaveBeenCalledWith(document.body, 'light-mode');
            expect(mockRenderer.removeClass).toHaveBeenCalledWith(document.body, 'dark-mode');
        });

        it('should add "dark-mode" class if current theme is dark', () => {
            spyOn(service, 'isLight').and.returnValue(false);
            service.changeThemeClass();
            expect(mockRenderer.addClass).toHaveBeenCalledWith(document.body, 'dark-mode');
            expect(mockRenderer.removeClass).toHaveBeenCalledWith(document.body, 'light-mode');
        });
    });

    describe('toggleTheme', () => {
        it('should toggle userLightDark from light to dark', () => {
            spyOn(service, 'isLight').and.returnValue(true);
            service.toggleTheme();
            expect((service as any).userLightDark).toBe('dark');
        });

        it('should toggle userLightDark from dark to light', () => {
            spyOn(service, 'isLight').and.returnValue(false);
            service.toggleTheme();
            expect((service as any).userLightDark).toBe('light');
        });
    });

    describe('isLight', () => {
        it('should return true if current theme is light', () => {
            spyOn(service, 'currentTheme').and.returnValue('light');
            expect(service.isLight()).toBeTrue();
        });

        it('should return false if current theme is dark', () => {
            spyOn(service, 'currentTheme').and.returnValue('dark');
            expect(service.isLight()).toBeFalse();
        });
    });
});
