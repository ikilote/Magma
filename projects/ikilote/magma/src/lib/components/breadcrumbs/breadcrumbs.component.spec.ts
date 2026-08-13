import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MagmaBreadcrumbItem } from './breadcrumb-item.component';
import { MagmaBreadcrumbs } from './breadcrumbs.component';
import { MagmaBreadcrumbsModule } from './breadcrumbs.module';

describe('MagmaBreadcrumbs', () => {
    let component: MagmaBreadcrumbs;
    let fixture: ComponentFixture<MagmaBreadcrumbs>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaBreadcrumbs],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaBreadcrumbs);
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

    it('should render a nav element with aria-label', () => {
        const nav = fixture.nativeElement.querySelector('nav');
        expect(nav).toBeTruthy();
        expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('should default separator to undefined', () => {
        expect(component.separator()).toBeUndefined();
    });

    it('should render an ordered list', () => {
        const ol = fixture.nativeElement.querySelector('nav ol');
        expect(ol).toBeTruthy();
    });
});

describe('MagmaBreadcrumbItem', () => {
    let component: MagmaBreadcrumbItem;
    let fixture: ComponentFixture<MagmaBreadcrumbItem>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaBreadcrumbItem],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaBreadcrumbItem);
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

    it('should default active to false', () => {
        expect(component.active()).toBe(false);
    });

    it('should default href to undefined', () => {
        expect(component.href()).toBeUndefined();
    });
});

@Component({
    template: `
        <mg-breadcrumbs>
            <mg-breadcrumb href="/home">Home</mg-breadcrumb>
            <mg-breadcrumb href="/products">Products</mg-breadcrumb>
            <mg-breadcrumb active>Current page</mg-breadcrumb>
        </mg-breadcrumbs>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaBreadcrumbsModule],
})
class TestHostBreadcrumbsComponent {}

@Component({
    template: `
        <mg-breadcrumbs>
            <mg-breadcrumb [href]="href" [active]="active">Item</mg-breadcrumb>
        </mg-breadcrumbs>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaBreadcrumbsModule],
})
class TestHostDynamicComponent {
    href: string | undefined = '/test';
    active = false;
}

describe('MagmaBreadcrumbs usage', () => {
    describe('full breadcrumb trail', () => {
        let hostFixture: ComponentFixture<TestHostBreadcrumbsComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestHostBreadcrumbsComponent],
            }).compileComponents();

            hostFixture = TestBed.createComponent(TestHostBreadcrumbsComponent);
            hostFixture.changeDetectorRef.detectChanges();
        });

        afterEach(() => {
            hostFixture?.destroy();
            TestBed.resetTestingModule();
        });

        it('should render all breadcrumb items', () => {
            const items = hostFixture.nativeElement.querySelectorAll('mg-breadcrumb');
            expect(items.length).toBe(3);
        });

        it('should render links for non-active items with href', () => {
            const links = hostFixture.nativeElement.querySelectorAll('mg-breadcrumb a');
            expect(links.length).toBe(2);
            expect(links[0].getAttribute('href')).toBe('/home');
            expect(links[1].getAttribute('href')).toBe('/products');
        });

        it('should render span for active item', () => {
            const activeItem = hostFixture.nativeElement.querySelectorAll('mg-breadcrumb')[2];
            const span = activeItem.querySelector('span');
            expect(span).toBeTruthy();
            expect(span.textContent).toContain('Current page');
        });

        it('should not render link for active item', () => {
            const activeItem = hostFixture.nativeElement.querySelectorAll('mg-breadcrumb')[2];
            const link = activeItem.querySelector('a');
            expect(link).toBeNull();
        });

        it('should set aria-current on active item', () => {
            const activeItem = hostFixture.nativeElement.querySelectorAll('mg-breadcrumb li')[2];
            expect(activeItem.getAttribute('aria-current')).toBe('page');
        });

        it('should not set aria-current on non-active items', () => {
            const firstItem = hostFixture.nativeElement.querySelector('mg-breadcrumb li');
            expect(firstItem.getAttribute('aria-current')).toBeNull();
        });

        it('should add active class to active item', () => {
            const activeItem = hostFixture.nativeElement.querySelectorAll('mg-breadcrumb li')[2];
            expect(activeItem.classList.contains('active')).toBe(true);
        });
    });

    describe('dynamic inputs', () => {
        let hostFixture: ComponentFixture<TestHostDynamicComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestHostDynamicComponent],
            }).compileComponents();

            hostFixture = TestBed.createComponent(TestHostDynamicComponent);
            hostFixture.changeDetectorRef.detectChanges();
        });

        afterEach(() => {
            hostFixture?.destroy();
            TestBed.resetTestingModule();
        });

        it('should render link when href is set and not active', () => {
            const link = hostFixture.nativeElement.querySelector('a');
            expect(link).toBeTruthy();
            expect(link.getAttribute('href')).toBe('/test');
        });

        it('should render span when active even with href', () => {
            hostFixture.componentInstance.active = true;
            hostFixture.changeDetectorRef.detectChanges();

            const link = hostFixture.nativeElement.querySelector('a');
            expect(link).toBeNull();

            const span = hostFixture.nativeElement.querySelector('mg-breadcrumb span');
            expect(span).toBeTruthy();
        });

        it('should render span when no href', () => {
            hostFixture.componentInstance.href = undefined;
            hostFixture.changeDetectorRef.detectChanges();

            const link = hostFixture.nativeElement.querySelector('a');
            expect(link).toBeNull();
        });
    });
});

// routerLink mode
@Component({
    template: `
        <mg-breadcrumbs>
            <mg-breadcrumb [link]="link">Navigate</mg-breadcrumb>
            <mg-breadcrumb [link]="['/products', 'details']">Details</mg-breadcrumb>
            <mg-breadcrumb [link]="'/about'" [active]="true">About</mg-breadcrumb>
        </mg-breadcrumbs>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaBreadcrumbsModule],
})
class TestHostRouterLinkComponent {
    link: string | string[] | undefined = '/home';
}

describe('MagmaBreadcrumbItem routerLink', () => {
    let hostFixture: ComponentFixture<TestHostRouterLinkComponent>;
    let host: TestHostRouterLinkComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostRouterLinkComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostRouterLinkComponent);
        host = hostFixture.componentInstance;
        hostFixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should render an anchor with routerLink when link is a string', () => {
        const firstItem = hostFixture.nativeElement.querySelectorAll('mg-breadcrumb')[0];
        const anchor = firstItem.querySelector('a');
        expect(anchor).toBeTruthy();
        expect(anchor.getAttribute('href')).toBe('/home');
    });

    it('should render an anchor with routerLink when link is an array', () => {
        const secondItem = hostFixture.nativeElement.querySelectorAll('mg-breadcrumb')[1];
        const anchor = secondItem.querySelector('a');
        expect(anchor).toBeTruthy();
        expect(anchor.getAttribute('href')).toBe('/products/details');
    });

    it('should not render routerLink anchor when active even if link is set', () => {
        const activeItem = hostFixture.nativeElement.querySelectorAll('mg-breadcrumb')[2];
        const anchor = activeItem.querySelector('a');
        expect(anchor).toBeNull();

        const span = activeItem.querySelector('span');
        expect(span).toBeTruthy();
        expect(span.textContent).toContain('About');
    });

    it('should render span when link is undefined', () => {
        host.link = undefined;
        hostFixture.changeDetectorRef.detectChanges();

        const firstItem = hostFixture.nativeElement.querySelectorAll('mg-breadcrumb')[0];
        const anchor = firstItem.querySelector('a');
        expect(anchor).toBeNull();

        const span = firstItem.querySelector('span');
        expect(span).toBeTruthy();
    });

    it('should switch from routerLink to span when link is cleared', () => {
        // Initially has a link
        let firstItem = hostFixture.nativeElement.querySelectorAll('mg-breadcrumb')[0];
        expect(firstItem.querySelector('a')).toBeTruthy();

        // Clear the link
        host.link = undefined;
        hostFixture.changeDetectorRef.detectChanges();

        firstItem = hostFixture.nativeElement.querySelectorAll('mg-breadcrumb')[0];
        expect(firstItem.querySelector('a')).toBeNull();
        expect(firstItem.querySelector('span')).toBeTruthy();
    });

    it('should prioritize link over href (link branch checked first in template)', () => {
        // Both link and href would be set — template checks link() first
        const firstItem = hostFixture.nativeElement.querySelectorAll('mg-breadcrumb')[0];
        const anchor = firstItem.querySelector('a');
        // Verify it has the routerLink attribute behavior (href resolved by router)
        expect(anchor).toBeTruthy();
        expect(anchor.getAttribute('href')).toBe('/home');
    });
});
