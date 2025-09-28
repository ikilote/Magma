import { regexpSlash } from './other';

export interface PaletteParams {
    /** CSS var name. Default : `Palette.cssVar` (`'--palette'`). */
    cssVar?: string;
    /** selector selector to choose the reference element or the target element (root is ignored).
     * Default : ` Palette.contextSelector` (`'body'`). */
    selector?: string | HTMLElement;
    /** root element which serves as a reference for the selector. Default `Palette.root` (`document`).\
     * If the element ref is in a ShadowDom MFE :
     *
     * ```ts
     * export class AppShadowDOM{
     *     private readonly hostElement = inject(ElementRef<HTMLElement>);
     *     shadowRoot: DocumentFragment;
     *
     *     constructor() {
     *         this.shadowRoot = this.hostElement.nativeElement.getRootNode();
     *     }
     *
     * }
     * ```
     *  */
    root?: Document | HTMLElement | DocumentFragment;
    /** colorSeparator color cutting rule (default : `/\s*,\s*‎/`) */
    colorSeparator?: string | RegExp;
}

/**
 * Allows you to slice the values ​​of a CSS variable (--palette) to create a list of colors.
 *
 * Example: `--palette: #FFF, #000, #FF1234` → `['#FFF', '#000', '#FF1234']`
 *
 * @returns an array of string color
 */
export function getPaletteList(params?: PaletteParams) {
    params ??= {};
    params.cssVar ??= Palette.cssVar;
    params.selector ??= Palette.contextSelector;
    params.root ??= Palette.root;
    params.colorSeparator ??= Palette.colorSeparator;

    const element =
        params.selector instanceof HTMLElement ? params.selector : params.root.querySelector(params.selector);

    const value = element
        ? getComputedStyle(element)
              .getPropertyValue(params.cssVar)
              .split(regexpSlash(params.colorSeparator))
              .filter(e => e)
        : undefined;
    return value && value?.length > 0 ? value : undefined;
}

export class Palette {
    // STATIC

    static cssVar = '--palette';
    static contextSelector: string | HTMLElement = 'body';
    static root: Document | HTMLElement | DocumentFragment = document;
    static colorSeparator: string | RegExp = /\s*,\s*/;

    private static _globalPalette: string[] | undefined;

    static get globalPalette(): string[] | undefined {
        Palette._globalPalette ??= getPaletteList();
        return this._globalPalette;
    }

    static globalClear() {
        Palette._globalPalette = undefined;
    }

    // NO STATIC

    private _palette: string[] | undefined = undefined;

    constructor(private params?: PaletteParams) {}

    get palette(): string[] | undefined {
        this._palette ??= getPaletteList(this.params);
        return this._palette;
    }

    clear() {
        this._palette = undefined;
    }
}
