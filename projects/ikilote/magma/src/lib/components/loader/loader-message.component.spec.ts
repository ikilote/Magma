import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaLoaderMessage } from './loader-message.component';

@Component({
    template: `
        <mg-loader-message>
            <div class="custom-content">Loading...</div>
        </mg-loader-message>
    `,
    imports: [MagmaLoaderMessage],
})
class TestHostComponent {}

describe('MagmaLoaderMessage', () => {
    let fixture: ComponentFixture<MagmaLoaderMessage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('should project content inside ng-content', () => {
        const projectedContent = fixture.debugElement.query(By.css('.custom-content'));
        expect(projectedContent).toBeTruthy();
        expect(projectedContent.nativeElement.textContent).toContain('Loading...');
    });

    it('should have the correct DOM structure', () => {
        const loaderMessage = fixture.debugElement.query(By.css('mg-loader-message'));
        expect(loaderMessage).toBeTruthy();
        const content = loaderMessage.query(By.css('.custom-content'));
        expect(content).toBeTruthy();
    });
});
