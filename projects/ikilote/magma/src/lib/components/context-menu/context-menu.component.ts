import { ChangeDetectionStrategy, Component, HostListener, input } from '@angular/core';

import { MagmaContextMenu } from './context-menu.directive';

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
    {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
    }[Keys];

type ContextMenuItemBase<T> = {
    iconText?: string;
    icon?: string;
    label?: string;
    action: (arg: T) => void;
};

export type ContextMenuItem<T> = RequireOnlyOne<ContextMenuItemBase<T>, 'iconText' | 'icon'>;

export interface ContextMenuData<T> {
    contextMenu: ContextMenuItem<T>[];
    data: T;
}

export type ContextMenuMode = 'default' | 'bubble' | undefined;

@Component({
    selector: 'context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss'],
    host: {
        '[class.default]': 'mode() === "default"',
        '[class.bubble]': 'mode() === "bubble"',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MagmaContextMenuComponent<T> {
    // input

    readonly items = input.required<ContextMenuData<T>>();
    readonly mode = input<ContextMenuMode>('default');

    active(item: ContextMenuItem<T>) {
        item.action(this.items().data);
        MagmaContextMenu._overlayRef!.dispose();
        MagmaContextMenu._overlayRef = undefined;
    }

    @HostListener('contextmenu', ['$event'])
    @HostListener('auxclick', ['$event'])
    onContextMenuContext(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
    }
}
