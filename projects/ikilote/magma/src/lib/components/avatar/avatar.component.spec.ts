import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagmaAvatar } from './avatar.component';

describe('MagmaAvatar', () => {
    let component: MagmaAvatar;
    let fixture: ComponentFixture<MagmaAvatar>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MagmaAvatar],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaAvatar);
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

    it('should default to medium size', () => {
        expect(component.size()).toBe('medium');
    });

    it('should default to empty alt', () => {
        expect(component.alt()).toBe('');
    });

    it('should default to empty initials', () => {
        expect(component.initials()).toBe('');
    });

    it('should default to undefined src', () => {
        expect(component.src()).toBeUndefined();
    });

    it('should have imageFailed as false initially', () => {
        expect(component.imageFailed()).toBe(false);
    });

    it('should set imageFailed to true on onImageError', () => {
        component.onImageError();
        expect(component.imageFailed()).toBe(true);
    });
});

@Component({
    template: `<mg-avatar [initials]="'AB'" />`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaAvatar],
})
class TestHostInitialsComponent {}

@Component({
    template: `<mg-avatar [src]="src" [initials]="'JD'" [size]="size" [alt]="'User avatar'" />`,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaAvatar],
})
class TestHostFullComponent {
    src: string | undefined = 'https://example.com/avatar.jpg';
    size: 'small' | 'medium' | 'large' = 'medium';
}

describe('MagmaAvatar usage', () => {
    describe('with initials only', () => {
        let hostFixture: ComponentFixture<TestHostInitialsComponent>;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [TestHostInitialsComponent],
            }).compileComponents();

            hostFixture = TestBed.createComponent(TestHostInitialsComponent);
            hostFixture.changeDetectorRef.detectChanges();
        });

        afterEach(() => {
            hostFixture?.destroy();
            TestBed.resetTestingModule();
        });

        it('should display initials when no src', () => {
            const initialsEl = hostFixture.nativeElement.querySelector('.initials');
            expect(initialsEl).toBeTruthy();
            expect(initialsEl.textContent.trim()).toBe('AB');
        });

        it('should not display img when no src', () => {
            const imgEl = hostFixture.nativeElement.querySelector('img');
            expect(imgEl).toBeNull();
        });
    });

    describe('with image', () => {
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

        it('should display img when src is set', () => {
            const imgEl = hostFixture.nativeElement.querySelector('img');
            expect(imgEl).toBeTruthy();
            expect(imgEl.getAttribute('src')).toBe('https://example.com/avatar.jpg');
        });

        it('should set alt attribute on img', () => {
            const imgEl = hostFixture.nativeElement.querySelector('img');
            expect(imgEl.getAttribute('alt')).toBe('User avatar');
        });

        it('should not display initials when image is loaded', () => {
            const initialsEl = hostFixture.nativeElement.querySelector('.initials');
            expect(initialsEl).toBeNull();
        });

        it('should apply size class to host', () => {
            const avatarEl = hostFixture.nativeElement.querySelector('mg-avatar');
            expect(avatarEl.classList.contains('avatar-medium')).toBe(true);
        });

        it('should change size class when input changes', () => {
            hostFixture.componentInstance.size = 'large';
            hostFixture.changeDetectorRef.detectChanges();

            const avatarEl = hostFixture.nativeElement.querySelector('mg-avatar');
            expect(avatarEl.classList.contains('avatar-large')).toBe(true);
        });

        it('should show initials on image error', () => {
            const imgEl = hostFixture.nativeElement.querySelector('img');
            imgEl.dispatchEvent(new Event('error'));
            hostFixture.changeDetectorRef.detectChanges();

            const initialsEl = hostFixture.nativeElement.querySelector('.initials');
            expect(initialsEl).toBeTruthy();
            expect(initialsEl.textContent.trim()).toBe('JD');
        });

        it('should hide img on image error', () => {
            const imgEl = hostFixture.nativeElement.querySelector('img');
            imgEl.dispatchEvent(new Event('error'));
            hostFixture.changeDetectorRef.detectChanges();

            const imgAfter = hostFixture.nativeElement.querySelector('img');
            expect(imgAfter).toBeNull();
        });

        it('should show initials when src is cleared', () => {
            hostFixture.componentInstance.src = undefined;
            hostFixture.changeDetectorRef.detectChanges();

            const initialsEl = hostFixture.nativeElement.querySelector('.initials');
            expect(initialsEl).toBeTruthy();
        });
    });
});
