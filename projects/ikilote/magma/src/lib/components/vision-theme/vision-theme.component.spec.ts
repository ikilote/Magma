import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { Mocked } from 'vitest';

import { MagmaVisionTheme } from './vision-theme.component';

import { VISION_THEMES, VisionTheme, VisionThemeType } from '../../services/vision-theme';

describe('MagmaVisionTheme', () => {
    let component: MagmaVisionTheme;
    let fixture: ComponentFixture<MagmaVisionTheme>;
    let visionThemeServiceMock: Mocked<VisionTheme>;
    let activeList: VisionThemeType[];
    let currentTheme: VisionThemeType;

    beforeEach(async () => {
        currentTheme = 'none';
        activeList = [];

        visionThemeServiceMock = {
            theme: vi.fn(() => currentTheme),
            activeThemes: vi.fn(() => activeList),
            availableThemes: VISION_THEMES,
            set: vi.fn((value: VisionThemeType) => {
                activeList = value === 'none' ? [] : [value];
                currentTheme = value;
            }),
            current: vi.fn(() => currentTheme),
            next: vi.fn(() => {
                const keys = VISION_THEMES.map(t => t.key);
                const idx = keys.indexOf(currentTheme);
                currentTheme = keys[(idx + 1) % keys.length];
                activeList = currentTheme === 'none' ? [] : [currentTheme];
            }),
            previous: vi.fn(),
            toggle: vi.fn((value: VisionThemeType) => {
                if (activeList.includes(value)) {
                    activeList = activeList.filter(k => k !== value);
                } else {
                    activeList.push(value);
                }
                currentTheme = activeList.length > 0 ? activeList[activeList.length - 1] : 'none';
            }),
            add: vi.fn((value: VisionThemeType) => {
                if (!activeList.includes(value) && value !== 'none') {
                    activeList.push(value);
                    currentTheme = value;
                }
            }),
            remove: vi.fn((value: VisionThemeType) => {
                activeList = activeList.filter(k => k !== value);
                currentTheme = activeList.length > 0 ? activeList[activeList.length - 1] : 'none';
            }),
            isActive: vi.fn((value: VisionThemeType) => activeList.includes(value)),
            clear: vi.fn(() => {
                activeList = [];
                currentTheme = 'none';
            }),
            themeChange$: { next: vi.fn(), subscribe: vi.fn() },
            activeThemesChange$: { next: vi.fn(), subscribe: vi.fn() },
        } as unknown as Mocked<VisionTheme>;

        await TestBed.configureTestingModule({
            imports: [MagmaVisionTheme, OverlayModule],
            providers: [{ provide: VisionTheme, useValue: visionThemeServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(MagmaVisionTheme);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture?.destroy();
        TestBed.resetTestingModule();
    });

    /** Helper: opens the overlay and triggers change detection. */
    function openDropdown() {
        component.open();
        fixture.detectChanges();
    }

    /** Helper: queries items in the CDK overlay container. */
    function getOverlayItems(): HTMLButtonElement[] {
        const container = document.querySelector('.cdk-overlay-container');
        if (!container) {
            return [];
        }
        return Array.from(container.querySelectorAll('.vision-theme-item'));
    }

    /** Helper: queries the dropdown list element. */
    function getOverlayList(): HTMLElement | null {
        const container = document.querySelector('.cdk-overlay-container');
        return container?.querySelector('.vision-theme-list') ?? null;
    }

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display current label as Default', () => {
        expect(component.currentLabel()).toBe('Default');
    });

    it('should be compact by default', () => {
        expect(fixture.nativeElement.classList.contains('compact')).toBe(false);
    });

    it('should show label when not compact', () => {
        fixture.componentRef.setInput('compact', false);
        fixture.detectChanges();
        const label = fixture.nativeElement.querySelector('.label');
        expect(label).toBeTruthy();
        expect(label.textContent.trim()).toBe('Default');
    });

    it('should hide label when compact', () => {
        fixture.componentRef.setInput('compact', true);
        fixture.detectChanges();
        const label = fixture.nativeElement.querySelector('.label');
        expect(label).toBeFalsy();
    });

    it('should have has-theme class when themes are active', () => {
        activeList = ['protanopia'];
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('has-theme')).toBe(true);
    });

    it('should not have has-theme class when no themes active', () => {
        activeList = [];
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('has-theme')).toBe(false);
    });

    it('should have proper accessibility attributes on trigger button', () => {
        const button = fixture.nativeElement.querySelector('button');
        expect(button.getAttribute('aria-label')).toContain('Vision accessibility theme');
        expect(button.getAttribute('aria-haspopup')).toBe('listbox');
        expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('should set aria-expanded to true when open', () => {
        openDropdown();
        const button = fixture.nativeElement.querySelector('button');
        expect(button.getAttribute('aria-expanded')).toBe('true');
    });

    // ── Overlay rendering tests ─────────────────────────────────────────────

    describe('dropdown overlay (single mode)', () => {
        it('should render theme items when opened', () => {
            openDropdown();
            const items = getOverlayItems();
            expect(items.length).toBe(6);
        });

        it('should render listbox role with aria-label', () => {
            openDropdown();
            const list = getOverlayList();
            expect(list).toBeTruthy();
            expect(list!.getAttribute('role')).toBe('listbox');
            expect(list!.getAttribute('aria-label')).toBe('Vision themes');
        });

        it('should render each item with role=option', () => {
            openDropdown();
            const items = getOverlayItems();
            for (const item of items) {
                expect(item.getAttribute('role')).toBe('option');
            }
        });

        it('should mark the active item with aria-selected=true', () => {
            activeList = ['protanopia'];
            currentTheme = 'protanopia';
            openDropdown();
            const items = getOverlayItems();
            expect(items[0].getAttribute('aria-selected')).toBe('false');
            expect(items[1].getAttribute('aria-selected')).toBe('true');
        });

        it('should display item labels and descriptions', () => {
            openDropdown();
            const items = getOverlayItems();
            const firstLabel = items[0].querySelector('.item-label');
            const firstDesc = items[0].querySelector('.item-desc');
            expect(firstLabel?.textContent?.trim()).toBe('Default');
            expect(firstDesc?.textContent?.trim()).toContain('Standard color palette');
        });

        it('should call set() when clicking an item', () => {
            vi.spyOn(component.themeChange, 'emit');
            openDropdown();
            const items = getOverlayItems();
            items[1].click(); // protanopia
            fixture.detectChanges();

            expect(visionThemeServiceMock.set).toHaveBeenCalledWith('protanopia');
            expect(component.themeChange.emit).toHaveBeenCalledWith('protanopia');
            expect(component['isOpen']()).toBe(false);
        });

        it('should not show checkboxes in single mode', () => {
            openDropdown();
            const checkboxes = document.querySelectorAll('.cdk-overlay-container .checkbox');
            expect(checkboxes.length).toBe(0);
        });

        it('should not show Clear all button in single mode', () => {
            openDropdown();
            const clearBtn = document.querySelector('.cdk-overlay-container .clear-btn');
            expect(clearBtn).toBeFalsy();
        });

        it('should not have multiple class on list in single mode', () => {
            openDropdown();
            const list = getOverlayList();
            expect(list!.classList.contains('multiple')).toBe(false);
        });
    });

    // ── Multiple mode overlay tests ─────────────────────────────────────────

    describe('dropdown overlay (multiple mode)', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('multiple', true);
            fixture.detectChanges();
        });

        it('should filter out none from selectable themes', () => {
            openDropdown();
            const items = getOverlayItems();
            expect(items.length).toBe(5);
            const labels = Array.from(items).map(i => i.querySelector('.item-label')?.textContent?.trim());
            expect(labels).not.toContain('Default');
            expect(labels).toContain('Protanopia');
            expect(labels).toContain('Deuteranopia');
            expect(labels).toContain('Tritanopia');
            expect(labels).toContain('Achromatopsia');
            expect(labels).toContain('High Contrast');
        });

        it('should have multiple class and aria-multiselectable on list', () => {
            openDropdown();
            const list = getOverlayList();
            expect(list!.classList.contains('multiple')).toBe(true);
            expect(list!.getAttribute('aria-multiselectable')).toBe('true');
        });

        it('should show checkboxes for each item', () => {
            openDropdown();
            const checkboxes = document.querySelectorAll(
                '.cdk-overlay-container .vision-theme-item input[type="checkbox"]',
            );
            expect(checkboxes.length).toBe(5);
        });

        it('should show checked checkbox for active themes', () => {
            activeList = ['protanopia'];
            openDropdown();
            const checkboxes = document.querySelectorAll<HTMLInputElement>(
                '.cdk-overlay-container .vision-theme-item input[type="checkbox"]',
            );
            expect(checkboxes[0].checked).toBe(true);
            expect(checkboxes[1].checked).toBe(false);
        });

        it('should toggle theme and keep dropdown open on item click', () => {
            vi.spyOn(component.themesChange, 'emit');
            openDropdown();
            const items = getOverlayItems();
            items[0].click(); // protanopia
            fixture.detectChanges();

            expect(visionThemeServiceMock.toggle).toHaveBeenCalledWith('protanopia');
            expect(component.themesChange.emit).toHaveBeenCalled();
            expect(component['isOpen']()).toBe(true);
        });

        it('should show Clear all button when themes are active', () => {
            activeList = ['protanopia', 'high-contrast'];
            openDropdown();
            const clearBtn = document.querySelector('.cdk-overlay-container .clear-btn');
            expect(clearBtn).toBeTruthy();
            expect(clearBtn?.textContent?.trim()).toBe('Clear all');
        });

        it('should not show Clear all button when no themes active', () => {
            activeList = [];
            openDropdown();
            const clearBtn = document.querySelector('.cdk-overlay-container .clear-btn');
            expect(clearBtn).toBeFalsy();
        });

        it('should call clear and close when clicking Clear all', () => {
            vi.spyOn(component.themesChange, 'emit');
            activeList = ['protanopia'];
            openDropdown();
            const clearBtn = document.querySelector('.cdk-overlay-container .clear-btn') as HTMLElement;
            clearBtn.click();
            fixture.detectChanges();

            expect(visionThemeServiceMock.clear).toHaveBeenCalled();
            expect(component.themesChange.emit).toHaveBeenCalledWith([]);
            expect(component['isOpen']()).toBe(false);
        });

        it('should show comma-separated labels when multiple active', () => {
            fixture.componentRef.setInput('compact', false);
            activeList = ['protanopia', 'high-contrast'];
            fixture.detectChanges();
            expect(component.currentLabel()).toBe('Protanopia, High Contrast');
        });

        it('should show Default label when no themes active', () => {
            fixture.componentRef.setInput('compact', false);
            activeList = [];
            fixture.detectChanges();
            expect(component.currentLabel()).toBe('Default');
        });
    });

    // ── Single mode logic ───────────────────────────────────────────────────

    describe('single mode logic', () => {
        it('should select a theme, emit themeChange, and close', () => {
            vi.spyOn(component.themeChange, 'emit');
            component.open();
            component.selectTheme('protanopia');

            expect(visionThemeServiceMock.set).toHaveBeenCalledWith('protanopia');
            expect(component.themeChange.emit).toHaveBeenCalledWith('protanopia');
            expect(component['isOpen']()).toBe(false);
        });

        it('should expose all themes in the resolved list', () => {
            expect(component['resolvedThemes']().length).toBe(6);
        });

        it('should report isActive correctly for none', () => {
            expect(component.isActive('none')).toBe(true);
            activeList = ['protanopia'];
            expect(component.isActive('none')).toBe(false);
        });

        it('should report isActive correctly for a theme', () => {
            activeList = ['protanopia'];
            expect(component.isActive('protanopia')).toBe(true);
            expect(component.isActive('tritanopia')).toBe(false);
        });
    });

    // ── Multiple mode logic ─────────────────────────────────────────────────

    describe('multiple mode logic', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('multiple', true);
            fixture.detectChanges();
        });

        it('should toggle theme and NOT close dropdown', () => {
            vi.spyOn(component.themesChange, 'emit');
            component.open();
            component.selectTheme('protanopia');

            expect(visionThemeServiceMock.toggle).toHaveBeenCalledWith('protanopia');
            expect(component['isOpen']()).toBe(true);
            expect(component.themesChange.emit).toHaveBeenCalled();
        });

        it('should clear all and close when selecting none', () => {
            vi.spyOn(component.themesChange, 'emit');
            activeList = ['protanopia', 'high-contrast'];
            component.open();
            component.selectTheme('none');

            expect(visionThemeServiceMock.clear).toHaveBeenCalled();
            expect(component.themesChange.emit).toHaveBeenCalledWith([]);
            expect(component['isOpen']()).toBe(false);
        });

        it('should filter out none from selectable themes', () => {
            const selectable = component['selectableThemes']();
            expect(selectable.find(t => t.key === 'none')).toBeUndefined();
            expect(selectable.length).toBe(5);
        });
    });

    // ── Customization ───────────────────────────────────────────────────────

    describe('customization', () => {
        it('should accept custom themes via input', () => {
            const customThemes: any[] = [
                { key: 'none', label: 'Par défaut', description: 'Standard.' },
                { key: 'my-custom', label: 'Mon thème', description: 'Personnalisé.' },
            ];
            fixture.componentRef.setInput('themes', customThemes);
            fixture.detectChanges();
            expect(component['resolvedThemes']().length).toBe(2);
            expect(component['resolvedThemes']()[1].label).toBe('Mon thème');
        });

        it('should render custom themes in the overlay', () => {
            const customThemes: any[] = [
                { key: 'none', label: 'Off', description: 'Disabled.' },
                { key: 'custom-a', label: 'Custom A', description: 'First.' },
                { key: 'custom-b', label: 'Custom B', description: 'Second.' },
            ];
            fixture.componentRef.setInput('themes', customThemes);
            fixture.detectChanges();
            openDropdown();
            const items = getOverlayItems();
            expect(items.length).toBe(3);
            const labels = Array.from(items).map(i => i.querySelector('.item-label')?.textContent?.trim());
            expect(labels).toContain('Custom A');
            expect(labels).toContain('Custom B');
        });

        it('should use custom ariaLabel', () => {
            fixture.componentRef.setInput('ariaLabel', "Thème d'accessibilité");
            fixture.detectChanges();
            const button = fixture.nativeElement.querySelector('button');
            expect(button.getAttribute('aria-label')).toContain("Thème d'accessibilité");
        });

        it('should use custom listAriaLabel in overlay', () => {
            fixture.componentRef.setInput('listAriaLabel', 'Thèmes visuels');
            fixture.detectChanges();
            openDropdown();
            const list = getOverlayList();
            expect(list!.getAttribute('aria-label')).toBe('Thèmes visuels');
        });

        it('should display label from custom themes when not compact', () => {
            const customThemes: any[] = [
                { key: 'none', label: 'Défaut', description: 'Standard.' },
                { key: 'protanopia', label: 'Daltonisme rouge-vert', description: 'Pour la protanopie.' },
            ];
            fixture.componentRef.setInput('themes', customThemes);
            fixture.componentRef.setInput('compact', false);
            fixture.detectChanges();
            const label = fixture.nativeElement.querySelector('.label');
            expect(label.textContent.trim()).toBe('Défaut');
        });
    });
});
