import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaLoaderMessage } from './loader-message.component';
import { MagmaLoader } from './loader.component';

import { MagmaSpinner } from '../spinner/spinner.component';

@Component({
    template: `
        <mg-loader>
            <mg-spinner />
            <mg-loader-message>Loading...</mg-loader-message>
            <div class="ignore"></div>
        </mg-loader>
    `,
    imports: [MagmaLoader, MagmaSpinner, MagmaLoaderMessage],
})
class TestHostComponent {}

describe('MagmaLoader', () => {
    let fixture: ComponentFixture<MagmaLoader>;
    let component: MagmaLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();

        fixture = TestBed.createComponent(MagmaLoader);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should not be loading by default', () => {
        expect(component.loading()).toBeFalse();
        expect(fixture.nativeElement.classList.contains('loading')).toBeFalse();
    });

    it('should set loading to true when start() is called', () => {
        component.start();
        fixture.detectChanges();
        expect(component.loading()).toBeTrue();
        expect(fixture.nativeElement.classList.contains('loading')).toBeTrue();
    });

    it('should set loading to false when stop() is called', () => {
        component.start();
        fixture.detectChanges();
        component.stop();
        fixture.detectChanges();
        expect(component.loading()).toBeFalse();
        expect(fixture.nativeElement.classList.contains('loading')).toBeFalse();
    });

    it('should add/remove loading class based on loading state', () => {
        component.start();
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('loading')).toBeTrue();

        component.stop();
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('loading')).toBeFalse();
    });
});

describe('MagmaLoader', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let loader: MagmaLoader;

    beforeEach(async () => {
        hostFixture = TestBed.createComponent(TestHostComponent);
        loader = hostFixture.debugElement.query(By.directive(MagmaLoader)).componentInstance;

        hostFixture.detectChanges();
    });

    it('should project content when loading is true', () => {
        loader.start();
        hostFixture.detectChanges();

        const spinner = hostFixture.debugElement.query(By.css('mg-spinner'));
        const loaderMessage = hostFixture.debugElement.query(By.css('mg-loader-message'));
        const ignore = hostFixture.debugElement.query(By.css('.ignore'));

        expect(spinner).toBeTruthy();
        expect(loaderMessage).toBeTruthy();
        expect(loaderMessage.nativeElement.textContent).toContain('Loading...');
        expect(ignore).toBeNull();
    });

    it('should not project content when loading is false', () => {
        loader.stop();
        hostFixture.detectChanges();

        const spinner = hostFixture.debugElement.query(By.css('mg-spinner'));
        const loaderMessage = hostFixture.debugElement.query(By.css('mg-loader-message'));
        const ignore = hostFixture.debugElement.query(By.css('.ignore'));

        expect(spinner).toBeNull();
        expect(loaderMessage).toBeNull();
        expect(ignore).toBeNull();
    });
});
