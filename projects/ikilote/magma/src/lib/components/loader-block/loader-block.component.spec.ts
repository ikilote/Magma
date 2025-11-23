import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MagmaLoaderBlock } from './loader-block.component';
import { MagmaLoaderTile } from './loader-tile.component';

@Component({
    template: `
        <mg-loader-block>
            <mg-loader-tile></mg-loader-tile>
        </mg-loader-block>
    `,
    imports: [MagmaLoaderBlock, MagmaLoaderTile],
})
class TestHostComponent {}

describe('MagmaLoaderBlock', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaLoaderBlock, TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('should project mg-loader-tile inside ng-content', () => {
        const loaderTile = fixture.debugElement.query(By.css('mg-loader-tile'));
        expect(loaderTile).toBeTruthy();
    });

    it('should have the correct DOM structure', () => {
        const loaderBlock = fixture.debugElement.query(By.css('mg-loader-block'));
        expect(loaderBlock).toBeTruthy();
        const loaderTile = loaderBlock.query(By.css('mg-loader-tile'));
        expect(loaderTile).toBeTruthy();
    });
});

@Component({
    template: `
        <mg-loader-block>
            <mg-loader-tile></mg-loader-tile>
            <mg-loader-tile></mg-loader-tile>
            <mg-loader-tile></mg-loader-tile>
        </mg-loader-block>
    `,
    imports: [MagmaLoaderBlock, MagmaLoaderTile],
})
class TestHostComponent2 {}

describe('MagmaLoaderBlock', () => {
    let fixture: ComponentFixture<TestHostComponent2>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaLoaderBlock, TestHostComponent2],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent2);
        fixture.detectChanges();
    });

    it('should project multiple mg-loader-tile elements inside ng-content', () => {
        const loaderTiles = fixture.debugElement.queryAll(By.css('mg-loader-tile'));
        expect(loaderTiles.length).toBe(3);
    });
});
