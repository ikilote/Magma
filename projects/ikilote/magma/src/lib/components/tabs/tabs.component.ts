import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    contentChildren,
    input,
    output,
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
export class MagmaTabs implements AfterContentInit {
    // contentChildren

    readonly titles = contentChildren(MagmaTabTitle);
    readonly content = contentChildren(MagmaTabContent);

    // input

    readonly returnTabsLabel = input('Return to tabs');

    // output

    readonly tabChange = output<string>();

    readonly tabpanel = viewChild<ElementRef<HTMLDivElement>>('tabpanel');

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
}
