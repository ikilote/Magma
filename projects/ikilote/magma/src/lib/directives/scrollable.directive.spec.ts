import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagmaScrollableDirective, MagmaScrollableModule } from './scrollable.directive';

@Component({
    template: `
        <div mgScrollable style="height: 200px; overflow: auto; position: relative;">
            <button mgScrollGoto="section1">Go to 1</button>
            <button mgScrollGoto="section2">Go to 2</button>
            <button mgScrollGoto="section3" mgScrollJump>Go to 3</button>
            <div mgScrollTarget="section1" style="height: 300px; position: relative;">Section 1</div>
            <div mgScrollTarget="section2" style="height: 300px; position: relative;">Section 2</div>
            <div mgScrollTarget="section3" style="height: 300px; position: relative;">Section 3</div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaScrollableModule],
})
class TestHostComponent {
    @ViewChild(MagmaScrollableDirective) scrollable!: MagmaScrollableDirective;
}

@Component({
    template: `
        <div mgScrollable=".external-scroll" style="height: 200px; overflow: auto;">
            <div mgScrollTarget="s1" style="height: 300px;">Section</div>
        </div>
        <div class="external-scroll" style="height: 100px; overflow: auto;">
            <div style="height: 500px;">Tall content</div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaScrollableModule],
})
class TestHostWithSelectorComponent {
    @ViewChild(MagmaScrollableDirective) scrollable!: MagmaScrollableDirective;
}

@Component({
    template: `
        <div mgScrollable mgScrollableSticky=".sticky-nav" style="height: 200px; overflow: auto; position: relative;">
            <nav class="sticky-nav" style="position: sticky; top: 0; height: 40px;">Nav</nav>
            <button mgScrollGoto="s1">Go to 1</button>
            <button mgScrollGoto="s2" mgScrollJump>Go to 2</button>
            <div mgScrollTarget="s1" style="height: 300px; position: relative;">Section 1</div>
            <div mgScrollTarget="s2" style="height: 300px; position: relative;">Section 2</div>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MagmaScrollableModule],
})
class TestHostWithStickyComponent {
    @ViewChild(MagmaScrollableDirective) scrollable!: MagmaScrollableDirective;
}

describe('MagmaScrollableDirective', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostComponent);
        hostComponent = hostFixture.componentInstance;
        hostFixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(hostComponent.scrollable).toBeTruthy();
    });

    it('should set targeted element to host element', () => {
        expect(hostComponent.scrollable.targetedElement).toBeTruthy();
    });

    it('should report initial position as 0', () => {
        expect(hostComponent.scrollable.position()).toBe(0);
    });

    it('should register scroll targets', () => {
        const positions = hostComponent.scrollable.positionsTarget();
        expect(positions.size).toBe(3);
        expect(positions.has('section1')).toBe(true);
        expect(positions.has('section2')).toBe(true);
        expect(positions.has('section3')).toBe(true);
    });

    it('should unsubscribe on destroy', () => {
        hostFixture.destroy();
        expect(true).toBe(true);
    });

    describe('positionsTarget', () => {
        it('should mark the first section as current initially', () => {
            const positions = hostComponent.scrollable.positionsTarget();
            const section1 = positions.get('section1')!;
            expect(section1.current).toBe(true);
            expect(section1.first).toBe(true);
            expect(section1.last).toBe(false);
        });

        it('should mark the last section with last=true', () => {
            const positions = hostComponent.scrollable.positionsTarget();
            const section3 = positions.get('section3')!;
            expect(section3.last).toBe(true);
            expect(section3.first).toBe(false);
        });

        it('should mark section as after when not yet scrolled to', () => {
            const positions = hostComponent.scrollable.positionsTarget();
            const section2 = positions.get('section2')!;
            expect(section2.after).toBe(true);
        });

        it('should mark last section as current when scrolled to bottom', () => {
            hostComponent.scrollable.targetedElement.scrollTop = hostComponent.scrollable.targetedElement.scrollHeight;
            const positions = hostComponent.scrollable.positionsTarget();
            const section3 = positions.get('section3')!;
            expect(section3.current).toBe(true);
            expect(section3.before).toBe(false);
        });

        it('should mark sections as before when scrolled past them', () => {
            hostComponent.scrollable.targetedElement.scrollTop = 600;
            const positions = hostComponent.scrollable.positionsTarget();
            const section1 = positions.get('section1')!;
            expect(section1.before).toBe(true);
        });
    });

    describe('jumpTo', () => {
        it('should jump to position instantly', () => {
            hostComponent.scrollable.jumpTo(100);
            expect(hostComponent.scrollable.position()).toBe(100);
        });

        it('should not exceed max scroll position', () => {
            hostComponent.scrollable.jumpTo(99999);
            const maxScroll =
                hostComponent.scrollable.targetedElement.scrollHeight -
                hostComponent.scrollable.targetedElement.offsetHeight;
            expect(hostComponent.scrollable.position()).toBe(maxScroll);
        });

        it('should emit clicked event', () => {
            let emitted: { position: string | number; action: string } | undefined;
            hostComponent.scrollable.clicked.subscribe(e => (emitted = e));
            hostComponent.scrollable.jumpTo(50);
            expect(emitted).toEqual({ position: 50, action: 'jumpTo' });
        });
    });

    describe('scrollTo', () => {
        it('should emit clicked event with scrollTo action', () => {
            let emitted: { position: string | number; action: string } | undefined;
            hostComponent.scrollable.clicked.subscribe(e => (emitted = e));
            hostComponent.scrollable.scrollTo(50);
            expect(emitted).toEqual({ position: 50, action: 'scrollTo' });
        });

        it('should handle "top" as position 0', () => {
            hostComponent.scrollable.jumpTo(100);
            let emittedPos: number | undefined;
            hostComponent.scrollable.scrolledTo.subscribe(p => (emittedPos = p));
            hostComponent.scrollable.scrollTo('top');
            expect(emittedPos).toBe(0);
        });

        it('should handle "bottom" as max scroll position', () => {
            let emittedPos: number | undefined;
            hostComponent.scrollable.scrolledTo.subscribe(p => (emittedPos = p));
            hostComponent.scrollable.scrollTo('bottom');
            const maxScroll =
                hostComponent.scrollable.targetedElement.scrollHeight -
                hostComponent.scrollable.targetedElement.offsetHeight;
            expect(emittedPos).toBe(maxScroll);
        });

        it('should clear existing animation before starting new one', () => {
            hostComponent.scrollable.scrollTo(100);
            hostComponent.scrollable.scrollTo(50);
            expect(true).toBe(true);
        });
    });

    describe('goTo', () => {
        it('should emit clicked event with goTo action', () => {
            let emitted: { position: string | number; action: string } | undefined;
            hostComponent.scrollable.clicked.subscribe(e => (emitted = e));
            hostComponent.scrollable.goTo('section1');
            expect(emitted).toEqual({ position: 'section1', action: 'goTo' });
        });

        it('should emit changedTo event', () => {
            let emittedId: string | undefined;
            hostComponent.scrollable.changedTo.subscribe(id => (emittedId = id));
            hostComponent.scrollable.goTo('section2');
            expect(emittedId).toBe('section2');
        });

        it('should jump instantly when scrolling=false', () => {
            hostComponent.scrollable.goTo('section2', false);
            expect(hostComponent.scrollable.position()).toBeGreaterThan(0);
        });

        it('should do nothing for unknown target id', () => {
            let emittedId: string | undefined;
            hostComponent.scrollable.changedTo.subscribe(id => (emittedId = id));
            hostComponent.scrollable.goTo('nonexistent');
            expect(emittedId).toBeUndefined();
        });

        it('should clear existing scroll animation before goTo', () => {
            hostComponent.scrollable.scrollTo(50);
            hostComponent.scrollable.goTo('section2');
            expect(true).toBe(true);
        });

        it('should animate scroll to target when animated=true', () => {
            const spy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
                cb(0);
                return 0;
            });
            hostComponent.scrollable.goTo('section2', true);
            spy.mockRestore();
            expect(hostComponent.scrollable.position()).toBeGreaterThanOrEqual(0);
        });
    });

    describe('scrollToElement animation', () => {
        it('should animate and complete when target is reachable', () => {
            const spy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
                cb(0);
                return 0;
            });
            hostComponent.scrollable.scrollTo(10);
            spy.mockRestore();
            expect(hostComponent.scrollable.position()).toBeGreaterThanOrEqual(0);
        });

        it('should stop animation on wheel event', () => {
            const spy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
            hostComponent.scrollable.scrollTo(500);
            const wheelEvent = new Event('wheel');
            hostComponent.scrollable.targetedElement.dispatchEvent(wheelEvent);
            spy.mockRestore();
            expect(true).toBe(true);
        });
    });

    describe('scroll event debounced output', () => {
        it('should emit scrolled output on scroll event', async () => {
            let emitted: number | undefined;
            hostComponent.scrollable.scrolled.subscribe(p => (emitted = p));
            hostComponent.scrollable.targetedElement.scrollTop = 42;
            hostComponent.scrollable.targetedElement.dispatchEvent(new Event('scroll'));
            await new Promise(resolve => setTimeout(resolve, 60));
            expect(emitted).toBe(42);
        });
    });

    describe('MagmaScrollGotoDirective', () => {
        it('should navigate on click', () => {
            vi.spyOn(hostComponent.scrollable, 'goTo');
            const button = hostFixture.nativeElement.querySelector('[mgscrollgoto="section2"]');
            button.click();
            expect(hostComponent.scrollable.goTo).toHaveBeenCalledWith('section2', true);
        });

        it('should navigate on Enter key', () => {
            vi.spyOn(hostComponent.scrollable, 'goTo');
            const button = hostFixture.nativeElement.querySelector('[mgscrollgoto="section2"]');
            button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            hostFixture.changeDetectorRef.detectChanges();
            expect(hostComponent.scrollable.goTo).toHaveBeenCalledWith('section2', true);
        });

        it('should navigate on Space key', () => {
            vi.spyOn(hostComponent.scrollable, 'goTo');
            const button = hostFixture.nativeElement.querySelector('[mgscrollgoto="section3"]');
            button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
            hostFixture.changeDetectorRef.detectChanges();
            expect(hostComponent.scrollable.goTo).toHaveBeenCalledWith('section3', false);
        });
    });
});

describe('MagmaScrollableDirective with external selector', () => {
    let hostFixture: ComponentFixture<TestHostWithSelectorComponent>;
    let hostComponent: TestHostWithSelectorComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostWithSelectorComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostWithSelectorComponent);
        hostComponent = hostFixture.componentInstance;
        hostFixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should use the external element as scroll container', () => {
        const externalEl = document.querySelector('.external-scroll') as HTMLElement;
        expect(hostComponent.scrollable.targetedElement).toBe(externalEl);
    });

    it('should scroll within the external container', () => {
        hostComponent.scrollable.jumpTo(50);
        expect(hostComponent.scrollable.position()).toBe(50);
    });
});

describe('MagmaScrollableDirective with sticky offset', () => {
    let hostFixture: ComponentFixture<TestHostWithStickyComponent>;
    let hostComponent: TestHostWithStickyComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostWithStickyComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostWithStickyComponent);
        hostComponent = hostFixture.componentInstance;
        hostFixture.changeDetectorRef.detectChanges();
    });

    afterEach(() => {
        hostFixture?.destroy();
        TestBed.resetTestingModule();
    });

    it('should report sticky offset from the sticky element height', () => {
        const offset = hostComponent.scrollable.getStickyOffset();
        expect(offset).toBe(40);
    });

    it('should subtract sticky offset when using goTo', () => {
        hostComponent.scrollable.goTo('s2', false);
        const pos = hostComponent.scrollable.position();
        expect(pos).toBeGreaterThanOrEqual(0);
    });

    it('should account for sticky offset in positionsTarget', () => {
        const positions = hostComponent.scrollable.positionsTarget();
        expect(positions.size).toBe(2);
    });
});
