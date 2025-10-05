import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaLoaderTile } from './loader-tile.component';

@Component({
    template: `
        <mg-loader-tile size="100px">
            <div class="custom-content">Loading...</div>
        </mg-loader-tile>
    `,
    imports: [MagmaLoaderTile],
})
class TestHostComponent {}

describe('MagmaLoaderTile', () => {
    let fixture: ComponentFixture<MagmaLoaderTile>;
    let component: MagmaLoaderTile;

    beforeEach(async () => {
        fixture = TestBed.createComponent(MagmaLoaderTile);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should return null for width and height if size is not set', () => {
        expect(component.width()).toBeNull();
        expect(component.height()).toBeNull();
    });

    it('should compute width and height for a simple size', () => {
        fixture.componentRef.setInput('size', '100px');
        fixture.detectChanges();

        expect(component.width()).toBe('0 0 100px');
        expect(component.height()).toBe('100px');
    });

    it('should compute width and height for "flex" size', () => {
        fixture.componentRef.setInput('size', 'flex');
        fixture.detectChanges();

        expect(component.width()).toBe('1 1 0');
        expect(component.height()).toBeNull();
    });

    it('should project content inside ng-content', () => {
        const hostFixture = TestBed.createComponent(TestHostComponent);
        hostFixture.detectChanges();

        const customContent = hostFixture.debugElement.query(By.css('.custom-content'));
        expect(customContent).toBeTruthy();
        expect(customContent.nativeElement.textContent).toContain('Loading...');
    });
});
