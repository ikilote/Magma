import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { MagmaPagination } from './paginate.component';

describe('MagmaPagination', () => {
    let fixture: ComponentFixture<MagmaPagination>;
    let component: MagmaPagination;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaPagination],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaPagination);
        component = fixture.componentInstance;

        // Définir les inputs requis
        fixture.componentRef.setInput('page', 1);
        fixture.componentRef.setInput('total', 100);
        fixture.componentRef.setInput('size', 10);
        fixture.componentRef.setInput('base', '/test');

        fixture.detectChanges();
    });

    it('should show total if showTotal is true', () => {
        fixture.componentRef.setInput('showTotal', true);
        fixture.componentRef.setInput('textTotal', 'Test: %');
        fixture.componentRef.setInput('total', 100);
        fixture.detectChanges();

        const totalDiv = fixture.debugElement.query(By.css('.total'));
        expect(totalDiv).toBeTruthy();
        expect(totalDiv.nativeElement.textContent).toContain('Test: 100');
    });

    it('should not show total if showTotal is false', () => {
        fixture.componentRef.setInput('showTotal', false);
        fixture.detectChanges();

        const totalDiv = fixture.debugElement.query(By.css('.total'));
        expect(totalDiv).toBeNull();
    });

    it('should generate correct pages for small total', () => {
        fixture.componentRef.setInput('total', 25);
        fixture.componentRef.setInput('size', 5);
        fixture.detectChanges();
        component.ngDoCheck();

        expect(component.pages.length).toBe(5);
        expect(component.pages.every(p => !p.separator)).toBeTrue();
    });

    it('should generate pages with separators for large total', () => {
        fixture.componentRef.setInput('total', 1000);
        fixture.componentRef.setInput('size', 10);
        fixture.componentRef.setInput('page', 5);
        fixture.detectChanges();
        component.ngDoCheck();

        const separators = component.pages.filter(p => p.separator);
        expect(separators.length).toBe(1);
    });

    it('should set correct title and aria-label for page links', () => {
        fixture.componentRef.setInput('textPage', 'Page %p of %t');
        fixture.componentRef.setInput('total', 100);
        fixture.componentRef.setInput('size', 10);
        fixture.detectChanges();
        component.ngDoCheck();

        const links = fixture.debugElement.queryAll(By.css('a'));
        expect(links.length).toBe(7); // [1][2][3][4][…][8][9][10]

        const firstLink = links[0];
        expect(firstLink.nativeElement.getAttribute('title')).toContain('Page 1 of 10');
        expect(firstLink.nativeElement.getAttribute('aria-label')).toContain('Page 1 of 10');
    });

    it('should set aria-current="page" for current page', () => {
        fixture.componentRef.setInput('page', 3);
        fixture.detectChanges();
        component.ngDoCheck();

        const currentLink = fixture.debugElement.query(By.css('a[aria-current="page"]'));
        expect(currentLink).toBeTruthy();
        expect(currentLink.nativeElement.textContent).toContain('3');
    });

    it('should update current page on link click', () => {
        spyOn(component, 'update');
        const links = fixture.debugElement.queryAll(By.css('a'));
        const secondLink = links[1];
        secondLink.nativeElement.click();

        fixture.detectChanges();

        expect(component.update).toHaveBeenCalledWith(2, true);
    });

    it('should update current page on link click', () => {
        const links = fixture.debugElement.queryAll(By.css('a'));
        const secondLink = links[1];
        secondLink.nativeElement.click();

        fixture.detectChanges();
        expect(component.currentPage).toBe(2);
    });

    it('should update current page and pages array', () => {
        component.update(3, false);
        fixture.detectChanges();

        expect(component.currentPage).toBe(3);
        expect(component.pages.find(p => p.current)).toEqual(jasmine.objectContaining({ page: 3 }));
    });

    it('should return correct query params for page', () => {
        fixture.componentRef.setInput('queryParams', { sort: 'asc' });
        fixture.detectChanges();

        const params = component.pageQueryParams(2);
        expect(params).toEqual({ page: 2, sort: 'asc' });
    });

    it('should update page on external update event', fakeAsync(() => {
        fixture.componentRef.setInput('linkId', 'test-link');
        fixture.detectChanges();

        const spy = spyOn(component, 'update');
        MagmaPagination['onPageUpdate'].next({ id: 'test-link', page: 4, component: {} as MagmaPagination });
        tick();
        fixture.detectChanges();

        expect(spy).toHaveBeenCalledWith(4, false);
    }));

    it('should update page on external update event', () => {
        const spy = spyOn(MagmaPagination['onPageUpdate'], 'next');

        fixture.detectChanges();

        component.update(2, false);
        expect(spy).not.toHaveBeenCalled();

        component.update(3, true);
        expect(spy).not.toHaveBeenCalled();

        fixture.componentRef.setInput('linkId', 'test-link');
        fixture.detectChanges();

        component.update(4, false);
        expect(spy).not.toHaveBeenCalled();

        component.update(5, true);
        expect(spy).toHaveBeenCalled();
    });

    it('should be uid', () => {
        expect(component['uid']()).toMatch(/page-\d+/);
    });

    // Edge cases

    it('should be empty', () => {
        fixture.componentRef.setInput('total', 0);
        fixture.detectChanges();
        component.ngDoCheck();

        const size = component.pages.length;
        expect(size).toBe(0);
    });

    it('should update page with invalide value', () => {
        component.ngOnChanges({
            page: {
                currentValue: 0,
                previousValue: 1,
                firstChange: false,
                isFirstChange: () => false,
            },
        } as SimpleChanges);
        component.ngDoCheck();

        fixture.detectChanges();
        expect(component.currentPage).toBe(1);

        component.ngOnChanges({
            page: {
                currentValue: 50,
                previousValue: 1,
                firstChange: false,
                isFirstChange: () => false,
            },
        } as SimpleChanges);
        component.ngDoCheck();

        fixture.detectChanges();
        expect(component.currentPage).toBe(10);
    });

    it('should update size with invalide value', () => {
        fixture.componentRef.setInput('size', 0);
        fixture.detectChanges();
        component.ngDoCheck();

        const currentPage = component.currentPage;
        expect(currentPage).toBe(1);
    });
});
