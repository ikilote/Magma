import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        // Clean up overlay and fixture
        fixture?.destroy();
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it('should create', () => {
        expect(hostComponent).toBeTruthy();
    });

    it('should open and close the menu when clicking the button', async () => {
        vi.useFakeTimers();
        const button = fixture.debugElement.query(By.css('button'));
        expect(button).toBeTruthy();

        button.triggerEventHandler('click', null);
        fixture.changeDetectorRef.detectChanges();
        vi.advanceTimersByTime(100);

        document.querySelector('.cdk-overlay-ellipsis-backdrop')?.dispatchEvent(new Event('click'));
        fixture.changeDetectorRef.detectChanges();
        vi.advanceTimersByTime(100);

        // @ts-expect-error
        expect(ellipsisButtonElement.isOpen()).toBe(false);
        vi.useRealTimers();
    });

    it('should trigger actions when clicking on items', () => {
        vi.spyOn(hostComponent, 'onAction');

        const button = fixture.debugElement.query(By.css('button'));
        button.triggerEventHandler('click', null);
        fixture.changeDetectorRef.detectChanges();

        const items = fixture.debugElement.queryAll(By.directive(MagmaEllipsisItemComponent));
        expect(items.length).toBe(2);

        items[0].triggerEventHandler('clickEnter', null);
        fixture.changeDetectorRef.detectChanges();

        expect(hostComponent.onAction).toHaveBeenCalledWith('1');
    });

    it('should focus the button after closing the menu', async () => {
        const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
        vi.spyOn(buttonElement, 'focus');

        const button = fixture.debugElement.query(By.css('button'));
        button.triggerEventHandler('click', null);
        fixture.changeDetectorRef.detectChanges();
        await fixture.whenStable();

        document.querySelector('.cdk-overlay-ellipsis-backdrop')?.dispatchEvent(new Event('click'));

        fixture.changeDetectorRef.detectChanges();
        await fixture.whenStable();

        // Wait for setTimeout in close() to execute
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(buttonElement.focus).toHaveBeenCalled();
    });
});
