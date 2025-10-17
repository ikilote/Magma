import {
    AfterContentInit,
    AfterViewChecked,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    contentChildren,
    input,
    output,
    signal,
    viewChild,
} from '@angular/core';

import { MagmaTabContent } from './tab-content.component';
import { MagmaTabTitle } from './tab-title.component';

@Component({
    selector: 'mg-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaTabs implements AfterContentInit, AfterViewChecked {
    // content/view

    readonly titles = contentChildren(MagmaTabTitle);
    readonly content = contentChildren(MagmaTabContent);
    readonly tablist = viewChild.required<ElementRef<HTMLElement>>('tablist');
    readonly tabpanel = viewChild.required<ElementRef<HTMLDivElement>>('tabpanel');

    // input

    readonly returnTabsLabel = input('Return to tabs');

    // output

    readonly tabChange = output<string>();

    readonly prev = signal(false);
    readonly next = signal(false);

    updateInterval?: any;

    ngAfterContentInit(): void {
        if (this.titles()?.length) {
            const ids: Record<string, boolean> = {};
            let selected = false;
            this.titles().forEach(e => {
                const id = e.id();
                if (id) {
                    ids[id] = e.selected();
                    if (ids[id]) {
                        selected = true;
                    }
                }
            });
            if (!selected) {
                const first = this.titles()[0];
                first.selected.set(true);
                ids[first.id()!] = true;
            }

            this.content()!.forEach(e => {
                const id = e.id();
                if (id) {
                    e.selected.set(ids[id]);
                }
            });
        }
    }

    ngAfterViewChecked(): void {
        const div = this.tablist().nativeElement;
        const clientWidth = div.clientWidth;
        const scrollWidth = div.scrollWidth;
        const scrollLeft = div.scrollLeft;

        if (clientWidth < scrollWidth) {
            if (scrollLeft > 15 && !this.prev()) {
                this.prev.set(true);
            } else if (scrollLeft === 0 && this.prev()) {
                this.prev.set(false);
            }
            if (scrollLeft + clientWidth < scrollWidth - 15 && !this.next()) {
                this.next.set(true);
            } else if (scrollLeft + clientWidth === scrollWidth && this.next()) {
                this.next.set(false);
            }
        } else {
            if (this.prev()) {
                this.prev.set(false);
            }
            if (this.next()) {
                this.next.set(false);
            }
        }

        if (this.titles()?.length) {
            this.titles().forEach(e => {
                e.tabs ??= this;
            });
        }
    }

    update(id: string, emit: boolean = true) {
        this.titles()?.forEach(e => {
            if (e.id()) {
                e.selected.set(e.id() === id);
            }
        });
        this.ngAfterContentInit();
        if (emit) {
            this.tabChange.emit(id);
        }
    }

    returnTabs() {
        this.titles().forEach(e => {
            if (e.selected()) {
                e.element.nativeElement.focus();
            }
        });
    }

    moveTabs(update: boolean, dist?: number) {
        if (update && dist) {
            this.tablist().nativeElement.scrollLeft += dist;
            this.updateInterval = setInterval(() => {
                this.tablist().nativeElement.scrollLeft += dist;
            }, 50);
        } else {
            clearInterval(this.updateInterval);
            this.updateInterval = undefined;
        }
    }
}
