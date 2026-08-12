import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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

    it('should display labels from value', () => {
        const labels = hostFixture.nativeElement.querySelectorAll('.tag-label');
        expect(labels[0].textContent).toContain('angular');
    });

    it('should respect removable=false', () => {
        const buttons = hostFixture.nativeElement.querySelectorAll('.tag button');
        // Only 2 buttons (rxjs is not removable)
        expect(buttons.length).toBe(2);
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
