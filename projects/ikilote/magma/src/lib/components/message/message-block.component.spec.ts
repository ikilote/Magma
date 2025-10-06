import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaBlockMessage } from './message-block.component';

describe('MagmaBlockMessage', () => {
    let fixture: ComponentFixture<MagmaBlockMessage>;
    let component: MagmaBlockMessage;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaBlockMessage],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaBlockMessage);
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
        <mg-message-block [type]="'info'">
            <div class="custom-content">This is a message</div>
        </mg-message-block>
    `,
    imports: [MagmaBlockMessage],
})
class TestHostComponent {}

describe('MagmaBlockMessage', () => {
    let fixture: ComponentFixture<MagmaBlockMessage>;
    let component: MagmaBlockMessage;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaBlockMessage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should project content inside ng-content', () => {
        const hostFixture = TestBed.createComponent(TestHostComponent);
        hostFixture.detectChanges();

        const customContent = hostFixture.debugElement.query(By.css('.custom-content'));
        expect(customContent).toBeTruthy();
        expect(customContent.nativeElement.textContent).toContain('This is a message');
    });
});
