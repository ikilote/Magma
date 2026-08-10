import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
    MagmaBadge,
    MagmaBadgeLabel,
    MagmaBadgeLabelLuminosity,
    MagmaBadgeSize,
    MagmaBadgeTheme,
} from './badge.component';

describe('MagmaBadge', () => {
    let component: MagmaBadge;
    let fixture: ComponentFixture<MagmaBadge>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaBadge],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaBadge);
        component = fixture.componentInstance;
        fixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        fixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should default to luminosity', () => {
        expect(component.luminosity()).toBe('dark');
    });

    it('should default to neutral theme', () => {
        expect(component.theme()).toBe('neutral');
    });

    it('should default to large size', () => {
        expect(component.size()).toBe('large');
    });
});

@Component({
    template: `<mg-badge>5</mg-badge>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaBadge],
})
class TestHostSimpleComponent {}

@Component({
    template: `<mg-badge [luminosity]="luminosity" [theme]="theme" [size]="size">{{ content }}</mg-badge>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaBadge],
})
class TestHostFullComponent {
    theme: MagmaBadgeTheme = 'neutral';
    size: MagmaBadgeSize = 'large';
    luminosity: MagmaBadgeLabelLuminosity = 'dark';
    content = '3';
}

describe('MagmaBadge usage', () => {
    describe('simple content', () => {
        let hostFixture: ComponentFixture<TestHostSimpleComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestHostSimpleComponent],
            }).compileComponents();

            hostFixture = TestBed.createComponent(TestHostSimpleComponent);
            hostFixture.changeDetectorRef.detectChanges();
        });

        afterEach(() => {
            hostFixture?.destroy();
            TestBed.resetTestingModule();
        });

        it('should project content', () => {
            expect(hostFixture.nativeElement.textContent).toContain('5');
        });

        it('should apply default classes', () => {
            const badgeEl = hostFixture.nativeElement.querySelector('mg-badge');
            expect(badgeEl.classList.contains('badge-label-dark')).toBe(true);
            expect(badgeEl.classList.contains('badge-neutral')).toBe(true);
            expect(badgeEl.classList.contains('badge-large')).toBe(true);
        });
    });

    describe('with options', () => {
        let hostFixture: ComponentFixture<TestHostFullComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestHostFullComponent],
            }).compileComponents();

            hostFixture = TestBed.createComponent(TestHostFullComponent);
            hostFixture.changeDetectorRef.detectChanges();
        });

        afterEach(() => {
            hostFixture?.destroy();
            TestBed.resetTestingModule();
        });

        it('should apply circle luminosity class', () => {
            hostFixture.componentInstance.luminosity = 'dark';
            hostFixture.changeDetectorRef.detectChanges();

            const badgeEl = hostFixture.nativeElement.querySelector('mg-badge');
            expect(badgeEl.classList.contains('badge-label-dark')).toBe(true);
        });

        it('should apply dot luminosity class', () => {
            hostFixture.componentInstance.luminosity = 'light';
            hostFixture.changeDetectorRef.detectChanges();

            const badgeEl = hostFixture.nativeElement.querySelector('mg-badge');
            expect(badgeEl.classList.contains('badge-label-light')).toBe(true);
        });

        it('should apply primary theme class', () => {
            hostFixture.componentInstance.theme = 'primary';
            hostFixture.changeDetectorRef.detectChanges();

            const badgeEl = hostFixture.nativeElement.querySelector('mg-badge');
            expect(badgeEl.classList.contains('badge-primary')).toBe(true);
        });

        it('should apply alert theme class', () => {
            hostFixture.componentInstance.theme = 'alert';
            hostFixture.changeDetectorRef.detectChanges();

            const badgeEl = hostFixture.nativeElement.querySelector('mg-badge');
            expect(badgeEl.classList.contains('badge-alert')).toBe(true);
        });

        it('should apply small size class', () => {
            hostFixture.componentInstance.size = 'small';
            hostFixture.changeDetectorRef.detectChanges();

            const badgeEl = hostFixture.nativeElement.querySelector('mg-badge');
            expect(badgeEl.classList.contains('badge-small')).toBe(true);
        });

        it('should project dynamic content', () => {
            hostFixture.componentInstance.content = '99';
            hostFixture.changeDetectorRef.detectChanges();

            expect(hostFixture.nativeElement.textContent).toContain('99');
        });
    });
});

@Component({
    template: `<mg-badge theme="success"><mg-badge-label>version</mg-badge-label>1.2.0</mg-badge>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaBadge, MagmaBadgeLabel],
})
class TestHostTwoPartComponent {}

@Component({
    template: `<mg-badge [color]="color">Custom</mg-badge>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaBadge],
})
class TestHostColorComponent {
    color: string | undefined = '#8b5cf6';
}

describe('MagmaBadge two-part', () => {
    let hostFixture: ComponentFixture<TestHostTwoPartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostTwoPartComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostTwoPartComponent);
        hostFixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should render the label part', () => {
        const label = hostFixture.nativeElement.querySelector('.badge-label');
        expect(label).toBeTruthy();
        expect(label.textContent).toContain('version');
    });

    it('should render the value part', () => {
        const value = hostFixture.nativeElement.querySelector('.badge-value');
        expect(value).toBeTruthy();
        expect(value.textContent).toContain('1.2.0');
    });

    it('should have both parts visible', () => {
        const label = hostFixture.nativeElement.querySelector('.badge-label');
        const value = hostFixture.nativeElement.querySelector('.badge-value');
        expect(label.textContent.trim()).toBe('version');
        expect(value.textContent.trim()).toBe('1.2.0');
    });
});

describe('MagmaBadge custom color', () => {
    let hostFixture: ComponentFixture<TestHostColorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostColorComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostColorComponent);
        hostFixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should set --badge-background style when color is provided', () => {
        const badge = hostFixture.nativeElement.querySelector('mg-badge') as HTMLElement;
        expect(badge.style.getPropertyValue('--badge-background')).toBe('#8b5cf6');
    });

    it('should not set style when color is undefined', () => {
        hostFixture.componentInstance.color = undefined;
        hostFixture.changeDetectorRef.detectChanges();

        const badge = hostFixture.nativeElement.querySelector('mg-badge') as HTMLElement;
        expect(badge.style.getPropertyValue('--badge-background')).toBe('');
    });
});
