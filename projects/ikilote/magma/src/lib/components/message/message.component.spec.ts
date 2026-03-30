import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaBlockMessage } from './message-block.component';
import { MagmaMessage } from './message.component';

describe('MagmaMessage', () => {
    let fixture: ComponentFixture<MagmaMessage>;
    let component: MagmaMessage;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaMessage],
        }).compileComponents();
        
        fixture = TestBed.createComponent(MagmaMessage);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(async () => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    it('should apply "info" class when type is "info"', () => {
        fixture.componentRef.setInput('type', 'info');
        fixture.changeDetectorRef.detectChanges();
        expect(fixture.nativeElement.classList.contains('info')).toBe(true);
        expect(fixture.nativeElement.classList.contains('success')).toBe(false);
        expect(fixture.nativeElement.classList.contains('warn')).toBe(false);
        expect(fixture.nativeElement.classList.contains('error')).toBe(false);
        expect(fixture.nativeElement.classList.contains('tip')).toBe(false);
    });

    it('should apply "success" class when type is "success"', () => {
        fixture.componentRef.setInput('type', 'success');
        fixture.changeDetectorRef.detectChanges();
        expect(fixture.nativeElement.classList.contains('success')).toBe(true);
    });

    it('should apply "warn" class when type is "warn"', () => {
        fixture.componentRef.setInput('type', 'warn');
        fixture.changeDetectorRef.detectChanges();
        expect(fixture.nativeElement.classList.contains('warn')).toBe(true);
    });

    it('should apply "error" class when type is "error"', () => {
        fixture.componentRef.setInput('type', 'error');
        fixture.changeDetectorRef.detectChanges();
        expect(fixture.nativeElement.classList.contains('error')).toBe(true);
    });

    it('should apply "tip" class when type is "tip"', () => {
        fixture.componentRef.setInput('type', 'tip');
        fixture.changeDetectorRef.detectChanges();
        expect(fixture.nativeElement.classList.contains('tip')).toBe(true);
    });

    it('should not apply any class when type is not set', () => {
        expect(fixture.nativeElement.classList.contains('info')).toBe(false);
        expect(fixture.nativeElement.classList.contains('success')).toBe(false);
        expect(fixture.nativeElement.classList.contains('warn')).toBe(false);
        expect(fixture.nativeElement.classList.contains('error')).toBe(false);
        expect(fixture.nativeElement.classList.contains('tip')).toBe(false);
    });

    it('should update classes when type changes', () => {
        fixture.componentRef.setInput('type', 'info');
        fixture.changeDetectorRef.detectChanges();
        expect(fixture.nativeElement.classList.contains('info')).toBe(true);

        fixture.componentRef.setInput('type', 'error');
        fixture.changeDetectorRef.detectChanges();
        expect(fixture.nativeElement.classList.contains('error')).toBe(true);
    });
});

@Component({
    template: `
        <mg-message [type]="'info'">
            <div class="default-content">Default message</div>
            <mg-message-block type="success">Block message</mg-message-block>
        </mg-message>
    `,
    imports: [MagmaMessage, MagmaBlockMessage],
})
class TestHostComponent {}

describe('MagmaMessage - Content Projection', () => {
    let fixture: ComponentFixture<MagmaMessage>;
    let component: MagmaMessage;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaMessage);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(async () => {
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
        TestBed.resetTestingModule();
    });

    it('should project default content inside default ng-content', () => {
        const hostFixture = TestBed.createComponent(TestHostComponent);
        hostFixture.changeDetectorRef.detectChanges();

        const defaultContent = hostFixture.debugElement.query(By.css('.block .default-content'));
        expect(defaultContent).toBeTruthy();
        expect(defaultContent.nativeElement.textContent).toContain('Default message');
    });

    it('should project mg-message-block inside select ng-content', () => {
        const hostFixture = TestBed.createComponent(TestHostComponent);
        hostFixture.changeDetectorRef.detectChanges();

        const messageBlock = hostFixture.debugElement.query(By.css('mg-message-block.success'));
        expect(messageBlock).toBeTruthy();
        expect(messageBlock.nativeElement.textContent).toContain('Block message');
    });
});
