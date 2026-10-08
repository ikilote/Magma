import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaProgress, ProgressDisplayFormat } from './progress.component';

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
        fixture.changeDetectorRef.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

@Component({
    template: `
        <mg-progress
            [loaded]="loaded"
            [total]="total"
            [sizeFormat]="sizeFormat"
            [displayFormat]="displayFormat"
            [unit]="unit"
            [numberFormatPattern]="numberFormatPattern"
            [numberFormatDecimalSymbol]="numberFormatDecimalSymbol"
            [numberFormatSeparator]="numberFormatSeparator"
        />
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaProgress],
})
class TestWrapperComponent {
    loaded?: number;
    total?: number;
    sizeFormat: FileSizePipeParams = { format: 'decimal', language: 'en' };
    displayFormat: ProgressDisplayFormat = 'size';
    unit = '';
    numberFormatPattern = '#,###';
    numberFormatDecimalSymbol = '';
    numberFormatSeparator = '';
}

describe('MagmaProgress usage', () => {
    let fixture: ComponentFixture<TestWrapperComponent>;
    let progressComponent: MagmaProgress;
    let debugElement: DebugElement;
    let wrapperComponent: TestWrapperComponent;

    beforeEach(async () => {
        TestBed.resetTestingModule();
        await TestBed.configureTestingModule({
            imports: [MagmaProgress, TestWrapperComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestWrapperComponent);
        wrapperComponent = fixture.componentInstance;
        debugElement = fixture.debugElement;
        progressComponent = debugElement.query(By.directive(MagmaProgress)).componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    it('should create', () => {
        expect(progressComponent).toBeTruthy();
    });

    it('should display determined progress bar if loaded and total are defined', () => {
        wrapperComponent.loaded = 50;
        wrapperComponent.total = 100;
        fixture.changeDetectorRef.detectChanges();
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
        fixture.changeDetectorRef.detectChanges();
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
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toContain('50\u00A0B  /  100\u00A0B');
    });

    it('should not display progress text if neither loaded nor total is defined', () => {
        wrapperComponent.loaded = undefined;
        wrapperComponent.total = undefined;
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toBe('');
    });

    it('should display only total text if loaded is undefined but total is defined', () => {
        wrapperComponent.loaded = undefined;
        wrapperComponent.total = 100;
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toContain('100\u00A0B');
    });

    it('should format progress text according to sizeFormat (1)', () => {
        wrapperComponent.loaded = 1024;
        wrapperComponent.total = 2048;
        wrapperComponent.sizeFormat = { format: 'binary', language: 'en' };
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toContain('1,024\u00A0B  /  2,048\u00A0B');
    });

    it('should format progress text according to sizeFormat (2)', () => {
        wrapperComponent.loaded = 1024 * 1024;
        wrapperComponent.total = 2048 * 1024;
        wrapperComponent.sizeFormat = { format: 'binary', language: 'en' };
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toContain('1,024\u00A0KiB  /  2,048\u00A0KiB');
    });

    // --- displayFormat: 'percent' ---

    it('should display percentage when displayFormat is percent', () => {
        wrapperComponent.displayFormat = 'percent';
        wrapperComponent.loaded = 32;
        wrapperComponent.total = 100;
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toBe('32\u00A0%');
    });

    it('should display nothing in percent mode if total is undefined', () => {
        wrapperComponent.displayFormat = 'percent';
        wrapperComponent.loaded = 32;
        wrapperComponent.total = undefined;
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toBe('');
    });

    it('should round percentage to nearest integer', () => {
        wrapperComponent.displayFormat = 'percent';
        wrapperComponent.loaded = 1;
        wrapperComponent.total = 3;
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toBe('33\u00A0%');
    });

    // --- displayFormat: 'raw' ---

    it('should display raw loaded / total when displayFormat is raw', () => {
        wrapperComponent.displayFormat = 'raw';
        wrapperComponent.loaded = 3;
        wrapperComponent.total = 10;
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toBe('3 / 10');
    });

    it('should display raw values with unit suffix', () => {
        wrapperComponent.displayFormat = 'raw';
        wrapperComponent.loaded = 3;
        wrapperComponent.total = 10;
        wrapperComponent.unit = 'étapes';
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toBe('3 / 10\u00A0étapes');
    });

    it('should display only loaded with unit in raw mode when total is undefined', () => {
        wrapperComponent.displayFormat = 'raw';
        wrapperComponent.loaded = 5;
        wrapperComponent.total = undefined;
        wrapperComponent.unit = 'items';
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toBe('5\u00A0items');
    });

    it('should display only total with unit in raw mode when loaded is undefined', () => {
        wrapperComponent.displayFormat = 'raw';
        wrapperComponent.loaded = undefined;
        wrapperComponent.total = 10;
        wrapperComponent.unit = 'items';
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toBe('10\u00A0items');
    });

    it('should display empty string in raw mode when neither loaded nor total is defined', () => {
        wrapperComponent.displayFormat = 'raw';
        wrapperComponent.loaded = undefined;
        wrapperComponent.total = undefined;
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toBe('');
    });

    // --- numberFormatPattern / numberFormatDecimalSymbol / numberFormatSeparator ---

    it('should format percent with custom grouping separator', () => {
        wrapperComponent.displayFormat = 'percent';
        wrapperComponent.loaded = 1000;
        wrapperComponent.total = 1000;
        wrapperComponent.numberFormatSeparator = '\u00A0';
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toBe('100\u00A0%');
    });

    it('should format raw values with custom grouping separator', () => {
        wrapperComponent.displayFormat = 'raw';
        wrapperComponent.loaded = 1000;
        wrapperComponent.total = 10000;
        wrapperComponent.numberFormatSeparator = '\u00A0';
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toBe('1\u00A0000 / 10\u00A0000');
    });

    it('should format raw values with custom pattern and decimal symbol', () => {
        wrapperComponent.displayFormat = 'raw';
        wrapperComponent.loaded = 1234;
        wrapperComponent.total = 5678;
        wrapperComponent.numberFormatPattern = '#,###.0';
        wrapperComponent.numberFormatDecimalSymbol = ',';
        wrapperComponent.numberFormatSeparator = '\u00A0';
        fixture.changeDetectorRef.detectChanges();
        const progressText = debugElement.query(By.css('.progress-text')).nativeElement.textContent;
        expect(progressText.trim()).toBe('1\u00A0234,0 / 5\u00A0678,0');
    });
});
