import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagmaCard } from './card.component';

describe('MagmaCard', () => {
    let component: MagmaCard;
    let fixture: ComponentFixture<MagmaCard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaCard],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaCard);
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

    it('should default to horizontal orientation', () => {
        expect(component.orientation()).toBe('horizontal');
    });

    it('should default to 1/3 ratio', () => {
        expect(component.ratio()).toBe('1 / 3');
    });

    it('should not have image by default', () => {
        expect(component.image()).toBeUndefined();
    });

    it('should default imageZoom to false', () => {
        expect(component.imageZoom()).toBe(false);
    });
});

@Component({
    template: `<mg-card>Simple content</mg-card>`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaCard],
})
class TestHostSimpleComponent {}

@Component({
    template: `
        <mg-card
            [image]="'url(test.jpg)'"
            [orientation]="orientation"
            [ratio]="ratio"
            [imageZoom]="imageZoom"
            [cardHeight]="cardHeight"
            [imgHeight]="imgHeight"
        >
            <h3>Title</h3>
            <p>Body content</p>
        </mg-card>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaCard],
})
class TestHostFullComponent {
    orientation: 'horizontal' | 'vertical' = 'horizontal';
    ratio: '1 / 3' | '1 / 2' | '2 / 3' = '1 / 3';
    imageZoom = false;
    cardHeight: number | undefined = undefined;
    imgHeight: string | undefined = undefined;
}

describe('MagmaCard usage', () => {
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
            expect(hostFixture.nativeElement.textContent).toContain('Simple content');
        });

        it('should not show image area when no image is set', () => {
            const imageEl = hostFixture.nativeElement.querySelector('.card-image');
            expect(imageEl).toBeNull();
        });
    });

    describe('with image and options', () => {
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

        it('should show image area when image is set', () => {
            const imageEl = hostFixture.nativeElement.querySelector('.card-image');
            expect(imageEl).toBeTruthy();
        });

        it('should render card-image-inner inside card-image', () => {
            const innerEl = hostFixture.nativeElement.querySelector('.card-image .card-image-inner');
            expect(innerEl).toBeTruthy();
        });

        it('should project header content', () => {
            expect(hostFixture.nativeElement.textContent).toContain('Title');
        });

        it('should project body content', () => {
            expect(hostFixture.nativeElement.textContent).toContain('Body content');
        });

        it('should add has-image class to host', () => {
            const cardEl = hostFixture.nativeElement.querySelector('mg-card');
            expect(cardEl.classList.contains('has-image')).toBe(true);
        });

        it('should not add vertical class in horizontal mode', () => {
            const cardEl = hostFixture.nativeElement.querySelector('mg-card');
            expect(cardEl.classList.contains('vertical')).toBe(false);
        });

        it('should add vertical class when orientation is vertical', () => {
            hostFixture.componentInstance.orientation = 'vertical';
            hostFixture.changeDetectorRef.detectChanges();

            const cardEl = hostFixture.nativeElement.querySelector('mg-card');
            expect(cardEl.classList.contains('vertical')).toBe(true);
        });

        it('should set --card-image CSS variable', () => {
            const cardEl = hostFixture.nativeElement.querySelector('mg-card') as HTMLElement;
            expect(cardEl.style.getPropertyValue('--card-image')).toBe('url(test.jpg)');
        });

        it('should set --card-ratio CSS variable', () => {
            const cardEl = hostFixture.nativeElement.querySelector('mg-card') as HTMLElement;
            expect(cardEl.style.getPropertyValue('--card-ratio')).toBe('1 / 3');
        });

        it('should update ratio CSS variable when input changes', () => {
            hostFixture.componentInstance.ratio = '1 / 2';
            hostFixture.changeDetectorRef.detectChanges();

            const cardEl = hostFixture.nativeElement.querySelector('mg-card') as HTMLElement;
            expect(cardEl.style.getPropertyValue('--card-ratio')).toBe('1 / 2');
        });

        it('should not set --card-height when cardHeight is undefined', () => {
            const cardEl = hostFixture.nativeElement.querySelector('mg-card') as HTMLElement;
            expect(cardEl.style.getPropertyValue('--card-height')).toBe('');
        });

        it('should set --card-height CSS variable when cardHeight is provided', () => {
            hostFixture.componentInstance.cardHeight = 300;
            hostFixture.changeDetectorRef.detectChanges();

            const cardEl = hostFixture.nativeElement.querySelector('mg-card') as HTMLElement;
            expect(cardEl.style.getPropertyValue('--card-height')).toBe('300px');
        });

        it('should update --card-height when cardHeight changes', () => {
            hostFixture.componentInstance.cardHeight = 200;
            hostFixture.changeDetectorRef.detectChanges();

            hostFixture.componentInstance.cardHeight = 400;
            hostFixture.changeDetectorRef.detectChanges();

            const cardEl = hostFixture.nativeElement.querySelector('mg-card') as HTMLElement;
            expect(cardEl.style.getPropertyValue('--card-height')).toBe('400px');
        });

        it('should not set --card-img-height when imgHeight is undefined', () => {
            const cardEl = hostFixture.nativeElement.querySelector('mg-card') as HTMLElement;
            expect(cardEl.style.getPropertyValue('--card-img-height')).toBe('');
        });

        it('should set --card-img-height CSS variable when imgHeight is provided', () => {
            hostFixture.componentInstance.imgHeight = '250px';
            hostFixture.changeDetectorRef.detectChanges();

            const cardEl = hostFixture.nativeElement.querySelector('mg-card') as HTMLElement;
            expect(cardEl.style.getPropertyValue('--card-img-height')).toBe('250px');
        });

        it('should accept a percentage value for imgHeight', () => {
            hostFixture.componentInstance.imgHeight = '40%';
            hostFixture.changeDetectorRef.detectChanges();

            const cardEl = hostFixture.nativeElement.querySelector('mg-card') as HTMLElement;
            expect(cardEl.style.getPropertyValue('--card-img-height')).toBe('40%');
        });

        it('should not add image-zoom class by default', () => {
            const cardEl = hostFixture.nativeElement.querySelector('mg-card');
            expect(cardEl.classList.contains('image-zoom')).toBe(false);
        });

        it('should add image-zoom class when imageZoom is true', () => {
            hostFixture.componentInstance.imageZoom = true;
            hostFixture.changeDetectorRef.detectChanges();

            const cardEl = hostFixture.nativeElement.querySelector('mg-card');
            expect(cardEl.classList.contains('image-zoom')).toBe(true);
        });

        it('should remove image-zoom class when imageZoom is set back to false', () => {
            hostFixture.componentInstance.imageZoom = true;
            hostFixture.changeDetectorRef.detectChanges();

            hostFixture.componentInstance.imageZoom = false;
            hostFixture.changeDetectorRef.detectChanges();

            const cardEl = hostFixture.nativeElement.querySelector('mg-card');
            expect(cardEl.classList.contains('image-zoom')).toBe(false);
        });
    });
});
