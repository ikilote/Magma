import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
    MagmaInput,
    MagmaInputElement,
    MagmaInputText,
    containClasses,
    deepActiveElement,
    deepClosest,
    deepContains,
    deepQuerySelector,
    getParentElementByClass,
} from '@ikilote/magma';

import { CodeTabsComponent } from '../../demo/code-tabs.component';

@Component({
    selector: 'demo-dom',
    templateUrl: './demo-dom.component.html',
    styleUrl: './demo-dom.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ReactiveFormsModule, CodeTabsComponent, MagmaInput, MagmaInputText, MagmaInputElement],
})
export class DemoDomComponent {
    codeTsGetParentElementByClass = `import { getParentElementByClass } from '@ikilote/magma';

@Component({ ... })
export class TestComponent {
    classList: DOMTokenList | undefined;

    getParentElementByClass(element: EventTarget | null, cssClass: string) {
        this.classList = getParentElementByClass(element as HTMLElement, cssClass)?.classList;
    }
}`;

    codeHtmlGetParentElementByClass = `<mg-input-text value="test-3" #input />

<div (click)="getParentElementByClass($event.target, input.getValue() ?? '')">
  <div class="test-a zone">
    <span class="test-1 foo bar">…</span>
    <span class="test-3 foo bar">…</span>
  </div>
</div>

<p>Classes: {{ classList }}</p>`;

    codeTsContainClasses = `import { containClasses } from '@ikilote/magma';

@Component({ ... })
export class TestComponent {
    valid = false;

    containClasses(element: EventTarget | null, cssClasses: string[]) {
        this.valid = containClasses(element as HTMLElement, cssClasses);
    }
}`;

    codeHtmlContainClasses = `<mg-input-text value="foo,bar" #input2 />

<div (click)="containClasses($event.target, $any(input2.getValue())?.split(',') ?? '')">
  <span class="test-1 foo bar">…</span>
  <span class="test-2 abc azerry">…</span>
</div>

<p>Contains all classes: {{ valid }}</p>`;

    codeTsDeepActiveElement = `import { deepActiveElement } from '@ikilote/magma';

// Instead of document.activeElement (stops at shadow host):
const active = deepActiveElement();

// Or starting from a specific shadow root:
const active = deepActiveElement(myHost.shadowRoot);`;

    codeHtmlDeepActiveElement = `<!-- Call deepActiveElement() when focus enters each element -->
<button id="btn-a" (focus)="checkDeepActiveElement()">Button A</button>
<button id="btn-b" (focus)="checkDeepActiveElement()">Button B</button>
<input id="input-c" placeholder="Input C" (focus)="checkDeepActiveElement()" />`;

    codeTsDeepContains = `import { deepContains } from '@ikilote/magma';

// Instead of container.contains(target) (stops at shadow boundary):
const isInside = deepContains(container, target);`;

    codeHtmlDeepContains = `<!-- Pass the clicked element to check if it's inside the container -->
<div #containsContainer (click)="checkDeepContains($event.target)">
  <span class="child">child element</span>
</div>`;

    codeTsDeepClosest = `import { deepClosest } from '@ikilote/magma';

// Instead of element.closest(selector) (stops at shadow boundary):
const ancestor = deepClosest(element, '.my-class');`;

    codeHtmlDeepClosest = `<!-- Pass the clicked element and the CSS selector to match -->
<div (click)="checkDeepClosest($event.target, '.zone')" class="zone">
  <div class="inner">
    <span class="leaf">leaf</span>
  </div>
</div>`;

    codeTsDeepQuerySelector = `import { deepQuerySelector } from '@ikilote/magma';

// Instead of document.querySelector(selector) (cannot pierce shadow roots):
const el = deepQuerySelector<HTMLInputElement>('#my-input');

// Or starting from a specific root:
const el = deepQuerySelector('#my-input', myContainer);`;

    codeHtmlDeepQuerySelector = `<!-- Search within a scoped container using a template ref -->
<div #querySelectorZone>
  <span id="deep-target">#deep-target</span>
  <span id="other">other</span>
</div>

<button (click)="checkDeepQuerySelector(qsInput.getValue() ?? '')">
  Run deepQuerySelector()
</button>`;

    classList: DOMTokenList | undefined;
    valid = false;

    // deepActiveElement demo
    activeElementResult: string = '–';

    // deepContains demo
    readonly containsContainer = viewChild<ElementRef<HTMLElement>>('containsContainer');
    containsResult: boolean | null = null;

    // deepClosest demo
    closestResult: string = '–';

    // deepQuerySelector demo
    readonly querySelectorZone = viewChild<ElementRef<HTMLElement>>('querySelectorZone');
    querySelectorResult: string = '–';

    getParentElementByClass(element: EventTarget | null, cssClass: string) {
        console.log(element, cssClass, getParentElementByClass(element as HTMLElement, cssClass));
        this.classList = getParentElementByClass(element as HTMLElement, cssClass)?.classList;
    }

    containClasses(element: EventTarget | null, cssClasses: string[]) {
        this.valid = containClasses(element as HTMLElement, cssClasses);
    }

    checkDeepActiveElement() {
        const active = deepActiveElement();
        console.log(active);
        this.activeElementResult = active
            ? `<${active.tagName.toLowerCase()}${active.id ? ' id="' + active.id + '"' : ''}${active.className ? ' class="' + active.className + '"' : ''}>`
            : 'null';
    }

    checkDeepContains(target: EventTarget | null) {
        const container = this.containsContainer()?.nativeElement;
        if (container && target instanceof Element) {
            this.containsResult = deepContains(container, target);
        }
    }

    checkDeepClosest(target: EventTarget | null, selector: string) {
        if (target instanceof Element) {
            const found = deepClosest(target, selector);
            this.closestResult = found
                ? `<${found.tagName.toLowerCase()}${found.id ? ' id="' + found.id + '"' : ''}${found.className ? ' class="' + found.className + '"' : ''}>`
                : 'null (not found)';
        }
    }

    checkDeepQuerySelector(selector: string) {
        const found = deepQuerySelector(selector, this.querySelectorZone()?.nativeElement ?? document);
        this.querySelectorResult = found
            ? `<${found.tagName.toLowerCase()}${found.id ? ' id="' + found.id + '"' : ''}${found.className ? ' class="' + found.className + '"' : ''}>`
            : 'null (not found)';
    }
}
