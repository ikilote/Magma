import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { vi } from 'vitest';

import { MagmaTagList, MagmaTagListModule } from './tag-list.component';

describe('MagmaTagList', () => {
    let component: MagmaTagList;
    let fixture: ComponentFixture<MagmaTagList>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaTagList],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaTagList);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have aria role list', () => {
        expect(fixture.nativeElement.getAttribute('role')).toBe('list');
    });

    it('should show the inline input by default', () => {
        const input = fixture.nativeElement.querySelector('input');
        expect(input).toBeTruthy();
    });

    it('should start with empty resolvedTags', () => {
        expect(component.resolvedTags().length).toBe(0);
    });
});

// Data-driven mode
@Component({
    template: `<mg-tag-list
        [tags]="tags"
        [readOnly]="readOnly"
        [allowClick]="allowClick"
        [proposals]="proposals"
        [placeholder]="placeholder"
        (tagsChange)="onTagsChange($event)"
        (tagClick)="onTagClick($event)"
    />`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaTagListModule],
})
class TestDataDrivenComponent {
    tags = ['Angular', 'TypeScript', 'RxJS'];
    readOnly = false;
    allowClick = false;
    proposals: string[] = [];
    placeholder = 'Add...';

    lastTags?: string[];
    lastClick?: string;

    onTagsChange(tags: string[]) {
        this.lastTags = tags;
    }
    onTagClick(value: string) {
        this.lastClick = value;
    }
}

describe('MagmaTagList data-driven', () => {
    let hostFixture: ComponentFixture<TestDataDrivenComponent>;
    let host: TestDataDrivenComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestDataDrivenComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestDataDrivenComponent);
        host = hostFixture.componentInstance;
        hostFixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should display tags as list items', () => {
        const items = hostFixture.nativeElement.querySelectorAll('.tag');
        expect(items.length).toBe(3);
    });

    it('should display tag label text', () => {
        const first = hostFixture.nativeElement.querySelector('.tag .tag-label');
        expect(first.textContent).toContain('Angular');
    });

    it('should show remove button for each tag', () => {
        const buttons = hostFixture.nativeElement.querySelectorAll('.tag button');
        expect(buttons.length).toBe(3);
    });

    it('should emit tagsChange on remove', () => {
        const button = hostFixture.nativeElement.querySelector('.tag button');
        button.click();
        hostFixture.changeDetectorRef.detectChanges();

        expect(host.lastTags).toBeDefined();
        expect(host.lastTags!.length).toBe(2);
        expect(host.lastTags!.includes('Angular')).toBe(false);
    });

    it('should emit tagsChange on add via Enter', () => {
        const input = hostFixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.value = 'Signals';
        input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
        hostFixture.changeDetectorRef.detectChanges();

        expect(host.lastTags).toBeDefined();
        expect(host.lastTags!.includes('Signals')).toBe(true);
        expect(host.lastTags!.length).toBe(4);
    });

    it('should not add duplicate tags', () => {
        const input = hostFixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.value = 'Angular';
        input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
        hostFixture.changeDetectorRef.detectChanges();

        expect(host.lastTags).toBeUndefined();
    });

    it('should not add empty value', () => {
        const input = hostFixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.value = '   ';
        input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
        hostFixture.changeDetectorRef.detectChanges();

        expect(host.lastTags).toBeUndefined();
    });

    it('should clear input after adding', () => {
        const input = hostFixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.value = 'Signals';
        input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
        hostFixture.changeDetectorRef.detectChanges();

        expect(input.value).toBe('');
    });

    describe('readOnly', () => {
        it('should hide remove buttons', () => {
            host.readOnly = true;
            hostFixture.changeDetectorRef.detectChanges();
            const buttons = hostFixture.nativeElement.querySelectorAll('.tag button');
            expect(buttons.length).toBe(0);
        });

        it('should hide the input', () => {
            host.readOnly = true;
            hostFixture.changeDetectorRef.detectChanges();
            const input = hostFixture.nativeElement.querySelector('input');
            expect(input).toBeNull();
        });
    });

    describe('allowClick', () => {
        it('should not emit tagClick when false', () => {
            const tag = hostFixture.nativeElement.querySelector('.tag');
            tag.click();
            expect(host.lastClick).toBeUndefined();
        });

        it('should emit tagClick when true', () => {
            host.allowClick = true;
            hostFixture.changeDetectorRef.detectChanges();
            const tag = hostFixture.nativeElement.querySelector('.tag');
            tag.click();
            expect(host.lastClick).toBe('Angular');
        });

        it('should add clickable class', () => {
            host.allowClick = true;
            hostFixture.changeDetectorRef.detectChanges();
            const tag = hostFixture.nativeElement.querySelector('.tag');
            expect(tag.classList.contains('clickable')).toBe(true);
        });
    });

    describe('proposals', () => {
        it('should not show datalist by default', () => {
            const datalist = hostFixture.nativeElement.querySelector('datalist');
            expect(datalist).toBeNull();
        });

        it('should show datalist with proposals', () => {
            host.proposals = ['Node.js', 'Deno'];
            hostFixture.changeDetectorRef.detectChanges();
            const datalist = hostFixture.nativeElement.querySelector('datalist');
            expect(datalist).toBeTruthy();
            expect(datalist.querySelectorAll('option').length).toBe(2);
        });
    });
});

// Declarative mode
@Component({
    template: `
        <mg-tag-list [readOnly]="readOnly" (tagsChange)="lastTags = $event">
            <mg-tag value="angular">Angular</mg-tag>
            <mg-tag value="typescript">TypeScript</mg-tag>
            <mg-tag value="rxjs" removable="false">RxJS</mg-tag>
        </mg-tag-list>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaTagListModule],
})
class TestDeclarativeComponent {
    readOnly = false;
    lastTags?: string[];
}

describe('MagmaTagList declarative mode', () => {
    let hostFixture: ComponentFixture<TestDeclarativeComponent>;
    let host: TestDeclarativeComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestDeclarativeComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestDeclarativeComponent);
        host = hostFixture.componentInstance;
        hostFixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should render declared tags', () => {
        const items = hostFixture.nativeElement.querySelectorAll('.tag');
        expect(items.length).toBe(3);
    });

    it('should display labels from projected content', () => {
        const labels = hostFixture.nativeElement.querySelectorAll('.tag-label');
        expect(labels[0].textContent).toContain('Angular');
    });

    it('should respect removable=false', () => {
        const buttons = hostFixture.nativeElement.querySelectorAll('.tag button');
        // Only 2 buttons (rxjs is not removable)
        expect(buttons.length).toBe(2);
    });

    it('should emit tagsChange including declared tags on add via Enter', () => {
        const input = hostFixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.value = 'Signals';
        input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
        hostFixture.changeDetectorRef.detectChanges();

        expect(host.lastTags).toBeDefined();
        expect(host.lastTags!).toContain('angular');
        expect(host.lastTags!).toContain('typescript');
        expect(host.lastTags!).toContain('rxjs');
        expect(host.lastTags!).toContain('Signals');
        expect(host.lastTags!.length).toBe(4);
    });

    it('should not allow adding a value that matches a declared tag', () => {
        const input = hostFixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.value = 'angular';
        input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
        hostFixture.changeDetectorRef.detectChanges();

        // Should not emit because 'angular' already exists as a declared tag
        expect(host.lastTags).toBeUndefined();
    });

    it('should display dynamically added tags alongside declared tags', () => {
        const input = hostFixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.value = 'Signals';
        input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
        hostFixture.changeDetectorRef.detectChanges();

        const items = hostFixture.nativeElement.querySelectorAll('.tag');
        expect(items.length).toBe(4);

        const labels = hostFixture.nativeElement.querySelectorAll('.tag-label');
        const labelTexts = Array.from(labels).map((l: any) => l.textContent.trim());
        expect(labelTexts).toContain('Signals');
    });
});

// MagmaTagItem mode
@Component({
    template: `<mg-tag-list
        [tags]="tags"
        [allowClick]="allowClick"
        (tagsChange)="onTagsChange($event)"
        (tagClick)="onTagClick($event)"
    />`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaTagListModule],
})
class TestTagItemComponent {
    tags: (string | { value: string; label: string; removable: boolean })[] = [
        { value: 'ng', label: 'Angular', removable: true },
        { value: 'ts', label: 'TypeScript', removable: true },
        { value: 'rx', label: 'RxJS', removable: false },
    ];
    allowClick = false;

    lastTags?: string[];
    lastClick?: string;

    onTagsChange(tags: string[]) {
        this.lastTags = tags;
    }
    onTagClick(value: string) {
        this.lastClick = value;
    }
}

describe('MagmaTagList MagmaTagItem mode', () => {
    let hostFixture: ComponentFixture<TestTagItemComponent>;
    let host: TestTagItemComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestTagItemComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestTagItemComponent);
        host = hostFixture.componentInstance;
        hostFixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should display tags with their labels', () => {
        const labels = hostFixture.nativeElement.querySelectorAll('.tag-label');
        expect(labels[0].textContent).toContain('Angular');
        expect(labels[1].textContent).toContain('TypeScript');
        expect(labels[2].textContent).toContain('RxJS');
    });

    it('should respect removable=false on MagmaTagItem', () => {
        const buttons = hostFixture.nativeElement.querySelectorAll('.tag button');
        // Only 2 remove buttons (RxJS is not removable)
        expect(buttons.length).toBe(2);
    });

    it('should emit correct values on remove with MagmaTagItem objects', () => {
        const button = hostFixture.nativeElement.querySelector('.tag button');
        button.click();
        hostFixture.changeDetectorRef.detectChanges();

        expect(host.lastTags).toBeDefined();
        expect(host.lastTags!.length).toBe(2);
        expect(host.lastTags!.includes('ng')).toBe(false);
        expect(host.lastTags!.includes('ts')).toBe(true);
        expect(host.lastTags!.includes('rx')).toBe(true);
    });

    it('should emit tagClick with value when allowClick is true', () => {
        host.allowClick = true;
        hostFixture.changeDetectorRef.detectChanges();

        const tag = hostFixture.nativeElement.querySelector('.tag');
        tag.click();

        expect(host.lastClick).toBe('ng');
    });

    it('should not emit tagClick when allowClick is false', () => {
        const tag = hostFixture.nativeElement.querySelector('.tag');
        tag.click();

        expect(host.lastClick).toBeUndefined();
    });
});

// CVA mode
@Component({
    template: `<mg-tag-list [formControl]="ctrl" />`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaTagListModule, ReactiveFormsModule],
})
class TestCVAComponent {
    ctrl = new FormControl<string[]>(['Vue', 'React']);
}

describe('MagmaTagList ControlValueAccessor', () => {
    let hostFixture: ComponentFixture<TestCVAComponent>;
    let host: TestCVAComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestCVAComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestCVAComponent);
        host = hostFixture.componentInstance;
        hostFixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should render initial form value', () => {
        const items = hostFixture.nativeElement.querySelectorAll('.tag');
        expect(items.length).toBe(2);
    });

    it('should update form value on add', () => {
        const input = hostFixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.value = 'Svelte';
        input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
        hostFixture.changeDetectorRef.detectChanges();

        expect(host.ctrl.value).toContain('Svelte');
        expect(host.ctrl.value!.length).toBe(3);
    });

    it('should update form value on remove', () => {
        const button = hostFixture.nativeElement.querySelector('.tag button');
        button.click();
        hostFixture.changeDetectorRef.detectChanges();

        expect(host.ctrl.value!.length).toBe(1);
        expect(host.ctrl.value!.includes('Vue')).toBe(false);
    });

    it('should respond to programmatic value changes', () => {
        host.ctrl.setValue(['Next.js', 'Nuxt']);
        hostFixture.changeDetectorRef.detectChanges();

        const items = hostFixture.nativeElement.querySelectorAll('.tag');
        expect(items.length).toBe(2);
    });
});

// Programmatic add() method
describe('MagmaTagList programmatic add()', () => {
    let component: MagmaTagList;
    let fixture: ComponentFixture<MagmaTagList>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaTagList],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaTagList);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should add a string tag programmatically', () => {
        const result = component.add('Angular');
        expect(result).toBe(true);
        expect(component.resolvedTags().length).toBe(1);
        expect(component.resolvedTags()[0].value).toBe('Angular');
    });

    it('should add a MagmaTagItem programmatically', () => {
        const result = component.add({ value: 'ng', label: 'Angular', removable: true });
        expect(result).toBe(true);
        expect(component.resolvedTags().length).toBe(1);
        expect(component.resolvedTags()[0].value).toBe('ng');
    });

    it('should return false and not add when readOnly', () => {
        fixture.componentRef.setInput('readOnly', true);
        fixture.changeDetectorRef.detectChanges();

        const result = component.add('Angular');
        expect(result).toBe(false);
        expect(component.resolvedTags().length).toBe(0);
    });

    it('should return false and not add when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.changeDetectorRef.detectChanges();

        const result = component.add('Angular');
        expect(result).toBe(false);
        expect(component.resolvedTags().length).toBe(0);
    });

    it('should not add duplicate values', () => {
        component.add('Angular');
        const result = component.add('Angular');
        expect(result).toBe(false);
        expect(component.resolvedTags().length).toBe(1);
    });

    it('should not add empty string', () => {
        const result = component.add('');
        expect(result).toBe(false);
        expect(component.resolvedTags().length).toBe(0);
    });

    it('should emit tagsChange on successful add', () => {
        let emitted: string[] | undefined;
        component.tagsChange.subscribe(tags => (emitted = tags));

        component.add('Angular');

        expect(emitted).toEqual(['Angular']);
    });
});

// Disabled state
@Component({
    template: `<mg-tag-list [tags]="tags" [disabled]="true" (tagsChange)="onTagsChange($event)" />`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaTagListModule],
})
class TestDisabledComponent {
    tags = ['Angular', 'TypeScript'];
    lastTags?: string[];

    onTagsChange(tags: string[]) {
        this.lastTags = tags;
    }
}

describe('MagmaTagList disabled state', () => {
    let hostFixture: ComponentFixture<TestDisabledComponent>;
    let _host: TestDisabledComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestDisabledComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestDisabledComponent);
        _host = hostFixture.componentInstance;
        hostFixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should hide remove buttons when disabled', () => {
        const buttons = hostFixture.nativeElement.querySelectorAll('.tag button');
        expect(buttons.length).toBe(0);
    });

    it('should hide the input when disabled', () => {
        const input = hostFixture.nativeElement.querySelector('input');
        expect(input).toBeNull();
    });

    it('should add disabled class to host', () => {
        const host = hostFixture.nativeElement.querySelector('mg-tag-list');
        expect(host.classList.contains('disabled')).toBe(true);
    });
});

// onBlur and onEnter edge cases
describe('MagmaTagList onBlur and edge cases', () => {
    let component: MagmaTagList;
    let fixture: ComponentFixture<MagmaTagList>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaTagList],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaTagList);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should call onTouched on blur', () => {
        const touchedSpy = vi.fn();
        component.registerOnTouched(touchedSpy);

        component.onBlur();

        expect(touchedSpy).toHaveBeenCalled();
    });

    it('should do nothing on onEnter when readOnly', () => {
        fixture.componentRef.setInput('readOnly', true);
        fixture.changeDetectorRef.detectChanges();

        let emitted = false;
        component.tagsChange.subscribe(() => (emitted = true));

        component.onEnter();
        expect(emitted).toBe(false);
    });

    it('should do nothing on onEnter when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.changeDetectorRef.detectChanges();

        let emitted = false;
        component.tagsChange.subscribe(() => (emitted = true));

        component.onEnter();
        expect(emitted).toBe(false);
    });

    it('should do nothing on onEnter when input is hidden (hideInput)', () => {
        fixture.componentRef.setInput('hideInput', true);
        fixture.changeDetectorRef.detectChanges();

        let emitted = false;
        component.tagsChange.subscribe(() => (emitted = true));

        component.onEnter();
        expect(emitted).toBe(false);
    });

    it('should not emit on remove when readOnly', () => {
        component.add('Angular');

        fixture.componentRef.setInput('readOnly', true);
        fixture.changeDetectorRef.detectChanges();

        let emitted = false;
        component.tagsChange.subscribe(() => (emitted = true));

        component.remove('Angular');
        expect(emitted).toBe(false);
    });

    it('should not emit on remove when disabled', () => {
        component.add('Angular');

        fixture.componentRef.setInput('disabled', true);
        fixture.changeDetectorRef.detectChanges();

        let emitted = false;
        component.tagsChange.subscribe(() => (emitted = true));

        component.remove('Angular');
        expect(emitted).toBe(false);
    });

    it('should handle writeValue with null', () => {
        component.writeValue(null);
        expect(component.resolvedTags().length).toBe(0);
    });

    it('should register onChange callback', () => {
        const changeFn = vi.fn();
        component.registerOnChange(changeFn);

        component.add('test');

        expect(changeFn).toHaveBeenCalledWith(['test']);
    });
});
