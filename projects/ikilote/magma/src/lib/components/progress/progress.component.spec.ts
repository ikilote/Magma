import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaProgress } from './progress.component';

import { FileSizePipeParams } from '../../pipes/file-size.pipe';

describe('MagmaProgress', () => {
    let component: MagmaProgress;
    let fixture: ComponentFixture<MagmaProgress>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaProgress],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaProgress);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

@Component({
    template: ` <mg-progress [loaded]="loaded" [total]="total" [sizeFormat]="sizeFormat" /> `,
    imports: [MagmaProgress],
})
class TestWrapperComponent {
    loaded?: number;
    total?: number;
    sizeFormat: FileSizePipeParams = { format: 'decimal', language: 'en' };
}

describe('MagmaProgress usage', () => {
    let fixture: ComponentFixture<TestWrapperComponent>;
    let progressComponent: MagmaProgress;
    let debugElement: DebugElement;
    let wrapperComponent: TestWrapperComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaProgress],
        }).compileComponents();

        fixture = TestBed.createComponent(TestWrapperComponent);
        wrapperComponent = fixture.componentInstance;
        debugElement = fixture.debugElement;
        progressComponent = debugElement.query(By.directive(MagmaProgress)).componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(progressComponent).toBeTruthy();
    });

    it('should display determined progress bar if loaded and total are defined', () => {
        wrapperComponent.loaded = 50;
        wrapperComponent.total = 100;
        fixture.detectChanges();
        const progressBar = debugElement.query(By.css('.progress:not(.undetermined)'));
        const progressBarUndetermined = debugElement.query(By.css('.progress.undetermined'));
        const progressWidth = progressBar.nativeElement.style.getPropertyValue('--progress');
        expect(progressWidth).toBe('50');
        expect(progressBar).toBeDefined();
        expect(progressBarUndetermined).toBeNull();
    });

    it('should display loaded text if loaded is defined', () => {
        wrapperComponent.loaded = 50;
        wrapperComponent.total = undefined;
        fixture.detectChanges();
        const progressBar = debugElement.query(By.css('.progress:not(.undetermined)'));
        const progressBarUndetermined = debugElement.query(By.css('.progress.undetermined'));
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toContain('50\u00A0B');
        expect(progressBar).toBeNull();
        expect(progressBarUndetermined).toBeDefined();
    });

    it('should display full progress text if loaded and total are defined', () => {
        wrapperComponent.loaded = 50;
        wrapperComponent.total = 100;
        fixture.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toContain('50\u00A0B  /  100\u00A0B');
    });

    it('should not display progress text if neither loaded nor total is defined', () => {
        wrapperComponent.loaded = undefined;
        wrapperComponent.total = undefined;
        fixture.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toBe('');
    });

    it('should display only total text if loaded is undefined but total is defined', () => {
        wrapperComponent.loaded = undefined;
        wrapperComponent.total = 100;
        fixture.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toContain('100\u00A0B');
    });

    it('should format progress text according to sizeFormat (1)', () => {
        wrapperComponent.loaded = 1024;
        wrapperComponent.total = 2048;
        wrapperComponent.sizeFormat = { format: 'binary', language: 'en' };
        fixture.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toContain('1,024\u00A0B  /  2,048\u00A0B');
    });

    it('should format progress text according to sizeFormat (2)', () => {
        wrapperComponent.loaded = 1024 * 1024;
        wrapperComponent.total = 2048 * 1024;
        wrapperComponent.sizeFormat = { format: 'binary', language: 'en' };
        fixture.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toContain('1,024\u00A0KiB  /  2,048\u00A0KiB');
    });
});
