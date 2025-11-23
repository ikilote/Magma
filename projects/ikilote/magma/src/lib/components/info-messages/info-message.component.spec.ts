import { NgComponentOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InfoMessageComponent } from './info-message.component';

import { MagmaMessageType } from '../../services/messages';

@Component({ selector: 'app-test-dynamic', template: '<div>Dynamic Component: {{ title() }}</div>' })
class TestDynamicComponent {
    title = input<string>();
}

describe('InfoMessageComponent', () => {
    let fixture: ComponentFixture<InfoMessageComponent>;
    let component: InfoMessageComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgComponentOutlet, InfoMessageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(InfoMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should display string message', () => {
        const message = {
            message: 'Hello World',
            type: MagmaMessageType.info,
            time: '1s',
        };
        fixture.componentRef.setInput('message', message);
        fixture.detectChanges();

        const messageDiv = fixture.debugElement.query(By.css('.message'));
        expect(messageDiv.nativeElement.textContent).toContain('Hello World');
    });

    it('should display dynamic component via NgComponentOutlet', () => {
        const dynamicMessage = {
            message: {
                component: TestDynamicComponent,
                input: { title: 'Test' },
            },
            type: 'info',
        };
        fixture.componentRef.setInput('message', dynamicMessage);
        fixture.detectChanges();

        const dynamicComponent = fixture.debugElement.query(By.css('app-test-dynamic'));
        expect(dynamicComponent.nativeElement.textContent).toContain('Dynamic Component: Test');
    });

    it('should apply correct host classes based on message type', () => {
        const message = {
            message: 'Hello World',
            type: MagmaMessageType.info,
            time: '1s',
        };
        fixture.componentRef.setInput('message', message);
        fixture.detectChanges();

        expect(fixture.nativeElement.classList.contains('info')).toBeTrue();
    });

    it('should emit destruct output on close', () => {
        spyOn(component.destruct, 'emit');
        const message = {
            message: 'Hello World',
            type: MagmaMessageType.info,
            time: '1s',
        };

        fixture.componentRef.setInput('message', message);
        fixture.detectChanges();

        component.close();
        expect(component.destruct.emit).toHaveBeenCalledWith(message);
    });

    it('should call click on animationend', () => {
        spyOn(component, 'click');
        const progressDiv = fixture.debugElement.query(By.css('.progress'));
        progressDiv.triggerEventHandler('animationend', null);
        fixture.detectChanges();

        expect(component.click).toHaveBeenCalled();
    });

    it('should call click to close', fakeAsync(() => {
        spyOn(component, 'close');
        component.click();
        fixture.detectChanges();
        expect(fixture.nativeElement.classList[0]).toEqual('close');
        tick(700);
        expect(component.close).toHaveBeenCalled();
    }));

    it('should correct value for withContext', fakeAsync(() => {
        expect(component.withContext()).toEqual({ context: component } as any);
        expect(component.withContext({ test: 1 })).toEqual({ test: 1, context: component } as any);
    }));
});
