import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaEllipsisButton } from './ellipsis-button.component';
import { MagmaEllipsisButtonModule } from './ellipsis-button.module';
import { MagmaEllipsisItemComponent } from './ellipsis-item.component';

@Component({
    selector: 'app-host-component',
    template: `
        <mg-ellipsis-button>
            <mg-ellipsis-content>Menu</mg-ellipsis-content>
            <mg-ellipsis-item (clickEnter)="onAction('1')">Action 1</mg-ellipsis-item>
            <mg-ellipsis-item (clickEnter)="onAction('2')">Action 2</mg-ellipsis-item>
        </mg-ellipsis-button>
    `,
    imports: [MagmaEllipsisButtonModule],
})
class HostComponent {
    onAction(value: string): void {}
}

describe('MagmaEllipsisButton (integration)', () => {
    let fixture: ComponentFixture<HostComponent>;
    let hostComponent: HostComponent;
    let ellipsisButtonElement: MagmaEllipsisButton;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        hostComponent = fixture.componentInstance;
        ellipsisButtonElement = fixture.debugElement.query(By.directive(MagmaEllipsisButton)).componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(hostComponent).toBeTruthy();
    });

    it('should open and close the menu when clicking the button', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('button'));
        expect(button).toBeTruthy();

        button.triggerEventHandler('click', null);
        fixture.detectChanges();

        tick();
        document.querySelector('.cdk-overlay-ellipsis-backdrop')?.dispatchEvent(new Event('click'));
        tick();

        fixture.detectChanges();

        // @ts-expect-error
        expect(ellipsisButtonElement.isOpen()).toBeFalse();
    }));

    it('should trigger actions when clicking on items', () => {
        spyOn(hostComponent, 'onAction');

        const button = fixture.debugElement.query(By.css('button'));
        button.triggerEventHandler('click', null);
        fixture.detectChanges();

        const items = fixture.debugElement.queryAll(By.directive(MagmaEllipsisItemComponent));
        expect(items.length).toBe(2);

        items[0].triggerEventHandler('clickEnter', null);
        fixture.detectChanges();

        expect(hostComponent.onAction).toHaveBeenCalledWith('1');
    });

    it('should focus the button after closing the menu', fakeAsync(() => {
        const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
        spyOn(buttonElement, 'focus');

        const button = fixture.debugElement.query(By.css('button'));
        button.triggerEventHandler('click', null);
        fixture.detectChanges();

        tick();
        document.querySelector('.cdk-overlay-ellipsis-backdrop')?.dispatchEvent(new Event('click'));
        tick();

        fixture.detectChanges();

        expect(buttonElement.focus).toHaveBeenCalled();
    }));
});
