import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    containClasses,
    getParentElementByClass,
} from '../../../../projects/ikilote/magma/src/public-api';
import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-dom',
    templateUrl: './demo-dom.component.html',
    styleUrls: ['./demo-dom.component.scss'],
    imports: [ReactiveFormsModule, CodeTabsComponent, MagmaInput, MagmaInputText, MagmaInputElement],
})
export class DemoDomComponent {
    codeTsGetParentElementByClass = `@Component({ ... })
export class TestComponent {
    classList: DOMTokenList | undefined;

    getParentElementByClass(element: EventTarget | null, cssClass: string) {
        console.log(element, cssClass, getParentElementByClass(element as HTMLElement, cssClass));
        this.classList = getParentElementByClass(element as HTMLElement, cssClass)?.classList;
    }
}`;

    codeTsContainClasses = `@Component({ ... })
export class TestComponent {
    valid = false;

    containClasses(element: EventTarget | null, cssClasses: string[]) {
        this.valid = containClasses(element as HTMLElement, cssClasses);
    }
}`;

    classList: DOMTokenList | undefined;
    valid = false;

    getParentElementByClass(element: EventTarget | null, cssClass: string) {
        console.log(element, cssClass, getParentElementByClass(element as HTMLElement, cssClass));
        this.classList = getParentElementByClass(element as HTMLElement, cssClass)?.classList;
    }

    containClasses(element: EventTarget | null, cssClasses: string[]) {
        this.valid = containClasses(element as HTMLElement, cssClasses);
    }
}
