import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let mockMatchMedia: any;

    beforeEach(async () => {
        // Mock matchMedia for LightDark service
        mockMatchMedia = {
            matches: false,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        };

        if (!window.matchMedia) {
            (window as any).matchMedia = vi.fn().mockReturnValue(mockMatchMedia);
        } else {
            vi.spyOn(window, 'matchMedia').mockReturnValue(mockMatchMedia);
        }

        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(async () => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });
});
