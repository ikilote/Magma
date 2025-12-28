import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Type, input } from '@angular/core';

import { MagmaContextMenu } from './context-menu.directive';

import { MagmaClickEnterDirective } from '../../directives/click-enter.directive';
import { MagmaLimitFocusDirective } from '../../directives/limit-focus.directive';

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

type ContextMenuItemInputs<T> = { context?: MagmaContextMenu<T> } & Record<string, any>;

type ContextMenuItemComponentBase<T> = {
    component: Type<any>;
    inputs?: ContextMenuItemInputs<T>;
};

export type ContextMenuItem<T> =
    | RequireOnlyOne<ContextMenuItemBase<T>, 'iconText' | 'icon'>
    | ContextMenuItemComponentBase<T>;

export interface ContextMenuData<T> {
    contextMenu: ContextMenuItem<T>[];
    data: T;
}

export type ContextMenuMode = 'default' | 'bubble' | undefined;

@Component({
    selector: 'context-menu',
    templateUrl: './context-menu.component.html',
    styleUrl: './context-menu.component.scss',
    host: {
        '[class.default]': 'mode() === "default"',
        '[class.bubble]': 'mode() === "bubble"',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgComponentOutlet, MagmaClickEnterDirective, MagmaLimitFocusDirective],
})
export class MagmaContextMenuComponent<T> {
    // input

    readonly items = input.required<ContextMenuData<T>>();
    readonly mode = input<ContextMenuMode>('default');
    readonly context = input<MagmaContextMenu<T>>();

    active(item: RequireOnlyOne<ContextMenuItemBase<T>, 'iconText' | 'icon'>) {
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

    protected withContext(inputs?: ContextMenuItemInputs<T>) {
        return { ...inputs, ...{ context: this.context() } };
    }

    protected typeItem(context: ContextMenuItem<T>): RequireOnlyOne<ContextMenuItemBase<T>, 'iconText' | 'icon'> {
        return context as RequireOnlyOne<ContextMenuItemBase<T>, 'iconText' | 'icon'>;
    }

    protected typeComponent(context: ContextMenuItem<T>): ContextMenuItemComponentBase<T> {
        return context as ContextMenuItemComponentBase<T>;
    }
}
