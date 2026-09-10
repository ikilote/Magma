/**
 * A single menu item definition (used in JSON mode).
 */
export interface MagmaMenuItemDef {
    /** Display label. */
    label?: string;
    /** Optional icon class or ligature name. */
    icon?: string;
    /** Action invoked when the item is clicked. */
    action?: () => void;
    /** Render a visual separator instead of a clickable item. */
    separator?: boolean;
    /** When true, the item is rendered but not interactive. */
    disabled?: boolean;
    /** Nested sub-menu items. */
    children?: MagmaMenuItemDef[];
}

/**
 * A top-level menu entry (used in JSON mode).
 */
export interface MagmaMenuDef {
    /** Display label for the top-level menu trigger. */
    label?: string;
    /** Optional icon. */
    icon?: string;
    /** Items inside this menu. */
    items?: MagmaMenuItemDef[];
    /** Render a vertical separator instead of a menu trigger. */
    separator?: boolean;
}
