import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagmaBlock } from './block.component';

describe('MagmaBlock', () => {
    let component: MagmaBlock;
    let fixture: ComponentFixture<MagmaBlock>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaBlock],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaBlock);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

@Component({
    template: `<mg-block>Content</mg-block>`,
    imports: [MagmaBlock],
})
class TestHostComponent {}

describe('MagmaBlock usage', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaBlock, TestHostComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostComponent);
        hostFixture.detectChanges();
    });

    it('should create', () => {
        const componentFixture = TestBed.createComponent(MagmaBlock);
        expect(componentFixture.componentInstance).toBeTruthy();
    });

    it('should project content', () => {
        const compiled = hostFixture.nativeElement;
        expect(compiled.textContent).toContain('Content');
    });
});
