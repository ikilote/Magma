import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaBlockMessage } from './message-block.component';
import { MagmaMessage } from './message.component';

describe('MagmaMessage', () => {
    let fixture: ComponentFixture<MagmaMessage>;
    let component: MagmaMessage;

    beforeEach(async () => {
        fixture = TestBed.createComponent(MagmaMessage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should apply "info" class when type is "info"', () => {
        fixture.componentRef.setInput('type', 'info');
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('info')).toBeTrue();
        expect(fixture.nativeElement.classList.contains('success')).toBeFalse();
        expect(fixture.nativeElement.classList.contains('warn')).toBeFalse();
        expect(fixture.nativeElement.classList.contains('error')).toBeFalse();
        expect(fixture.nativeElement.classList.contains('tip')).toBeFalse();
    });

    it('should apply "success" class when type is "success"', () => {
        fixture.componentRef.setInput('type', 'success');
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('success')).toBeTrue();
    });

    it('should apply "warn" class when type is "warn"', () => {
        fixture.componentRef.setInput('type', 'warn');
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('warn')).toBeTrue();
    });

    it('should apply "error" class when type is "error"', () => {
        fixture.componentRef.setInput('type', 'error');
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('error')).toBeTrue();
    });

    it('should apply "tip" class when type is "tip"', () => {
        fixture.componentRef.setInput('type', 'tip');
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('tip')).toBeTrue();
    });

    it('should not apply any class when type is not set', () => {
        expect(fixture.nativeElement.classList.contains('info')).toBeFalse();
        expect(fixture.nativeElement.classList.contains('success')).toBeFalse();
        expect(fixture.nativeElement.classList.contains('warn')).toBeFalse();
        expect(fixture.nativeElement.classList.contains('error')).toBeFalse();
        expect(fixture.nativeElement.classList.contains('tip')).toBeFalse();
    });

    it('should update classes when type changes', () => {
        fixture.componentRef.setInput('type', 'info');
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('info')).toBeTrue();

        fixture.componentRef.setInput('type', 'error');
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('error')).toBeTrue();
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

describe('MagmaMessage', () => {
    let fixture: ComponentFixture<MagmaMessage>;
    let component: MagmaMessage;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaMessage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should project default content inside default ng-content', () => {
        const hostFixture = TestBed.createComponent(TestHostComponent);
        hostFixture.detectChanges();

        const defaultContent = hostFixture.debugElement.query(By.css('.block .default-content'));
        expect(defaultContent).toBeTruthy();
        expect(defaultContent.nativeElement.textContent).toContain('Default message');
    });

    it('should project mg-message-block inside select ng-content', () => {
        const hostFixture = TestBed.createComponent(TestHostComponent);
        hostFixture.detectChanges();

        const messageBlock = hostFixture.debugElement.query(By.css('mg-message-block.success'));
        expect(messageBlock).toBeTruthy();
        expect(messageBlock.nativeElement.textContent).toContain('Block message');
    });
});
