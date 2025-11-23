import { Palette, getPaletteList } from './css';

describe('getPaletteList', () => {
    let customElement: HTMLElement;
    let shadowRoot: ShadowRoot;
    let shadowHost: HTMLElement;
    let divElement: HTMLElement;
    let parentElement: HTMLElement;

    beforeEach(() => {
        document.body.style.setProperty('--palette', 'red, blue, yellow');

        // standard
        parentElement = document.createElement('div');
        divElement = document.createElement('div');
        divElement.setAttribute('id', 'div-element');
        divElement.style.setProperty('--div-palette', '#DDD, #EEE, #FFF');
        parentElement.appendChild(divElement);
        document.body.appendChild(parentElement);

        // shadow dom
        shadowHost = document.createElement('div');
        shadowRoot = shadowHost.attachShadow({ mode: 'open' });
        customElement = document.createElement('div');
        customElement.setAttribute('id', 'custom-element');
        customElement.style.setProperty('--custom-palette', '#AAA, #BBB, #CCC');
        shadowRoot.appendChild(customElement);
        document.body.appendChild(shadowHost);
    });
    afterEach(() => {
        document.body.removeChild(shadowHost);
        document.body.removeChild(parentElement);
        document.body.removeAttribute('style');
    });

    it('should return the default palette from body', () => {
        const result = getPaletteList();
        expect(result).toEqual(['red', 'blue', 'yellow']);
    });

    it('should return the palette from a custom element using custom cssVar', () => {
        const result = getPaletteList({
            selector: '#div-element',
            cssVar: '--div-palette',
        });
        expect(result).toEqual(['#DDD', '#EEE', '#FFF']);
    });

    it('should return the default palette if custom element does not define a custom cssVar', () => {
        const result = getPaletteList({
            selector: '#div-element',
        });
        expect(result).toEqual(['red', 'blue', 'yellow']);
    });

    it('should return undefined if the custom selector is not found', () => {
        const result = getPaletteList({
            selector: '#non-existent',
            cssVar: '--div-palette',
        });
        expect(result).toBeUndefined();
    });

    it('should return the palette from a custom element using a custom root', () => {
        const result = getPaletteList({
            selector: '#div-element',
            root: parentElement,
            cssVar: '--div-palette',
        });
        expect(result).toEqual(['#DDD', '#EEE', '#FFF']);
    });

    it('should split colors using a custom regex separator (e.g. slash)', () => {
        divElement.style.setProperty('--div-palette', '#AAA / #BBB / #CCC');
        const result = getPaletteList({
            selector: '#div-element',
            root: parentElement,
            cssVar: '--div-palette',
            colorSeparator: /\s*\/\s*/,
        });
        expect(result).toEqual(['#AAA', '#BBB', '#CCC']);
    });

    it('should return the palette from a Shadow DOM element', () => {
        const result = getPaletteList({
            selector: '#custom-element',
            root: shadowRoot,
            cssVar: '--custom-palette',
        });
        expect(result).toEqual(['#AAA', '#BBB', '#CCC']);
    });

    it('should split colors in Shadow DOM using a custom regex separator (e.g. slash)', () => {
        customElement.style.setProperty('--custom-palette', '#AAA / #BBB / #CCC');
        const result = getPaletteList({
            selector: '#custom-element',
            root: shadowRoot,
            cssVar: '--custom-palette',
            colorSeparator: /\s*\/\s*/,
        });
        expect(result).toEqual(['#AAA', '#BBB', '#CCC']);
    });

    it('should split colors in Shadow DOM using a custom string separator (e.g. slash)', () => {
        customElement.style.setProperty('--custom-palette', '#AAA / #BBB / #CCC');
        const result = getPaletteList({
            selector: '#custom-element',
            root: shadowRoot,
            cssVar: '--custom-palette',
            colorSeparator: '/',
        });
        expect(result).toEqual(['#AAA ', ' #BBB ', ' #CCC']);
    });

    it('should return undefined if CSS var is empty', () => {
        document.body.style.setProperty('--palette', '');
        const result = getPaletteList();
        expect(result).toBeUndefined();
    });
});

describe('Palette', () => {
    describe('static', () => {
        beforeEach(() => {
            document.body.style.setProperty('--palette', '#FFF, #000, #FF1234');
        });

        afterEach(() => {
            document.body.style.removeProperty('--palette');
            Palette.globalClear();
        });

        it('should return the global palette', () => {
            const palette = Palette.globalPalette;
            expect(palette).toEqual(['#FFF', '#000', '#FF1234']);
        });

        it('should clear the global palette cache', () => {
            Palette.globalPalette;
            Palette.globalClear();
            expect(Palette.globalPalette).toEqual(['#FFF', '#000', '#FF1234']);
        });

        it('should clear the global palette cache', () => {
            Palette.globalPalette;
            document.body.style.setProperty('--palette', 'blue, red, green');
            expect(Palette.globalPalette).toEqual(['#FFF', '#000', '#FF1234']);
        });
    });

    describe('instance', () => {
        let element: HTMLElement;

        beforeEach(() => {
            element = document.createElement('div');
            element.style.setProperty('--palette', '#FFF, #000, #FF1234');
            document.body.appendChild(element);
        });

        afterEach(() => {
            document.body.removeChild(element);
        });

        it('should return the palette for a specific element', () => {
            const palette = new Palette({ selector: element });
            expect(palette.palette).toEqual(['#FFF', '#000', '#FF1234']);
        });

        it('should filter out empty values', () => {
            element.style.setProperty('--palette', '#FFF, , #FF1234');
            const palette = new Palette({ selector: element });
            expect(palette.palette).toEqual(['#FFF', '#FF1234']);
        });

        it('should clear the instance palette cache and recalculate on next access', () => {
            const palette = new Palette({ selector: element });
            palette.palette;
            palette.clear();
            expect(palette.palette).toEqual(['#FFF', '#000', '#FF1234']);
        });

        it('should recalculate the palette after cache clear and DOM update', () => {
            const palette = new Palette({ selector: element });
            palette.palette;
            palette.clear();
            palette.palette;
            element.style.setProperty('--palette', '#FFF, , #FF1234');
            expect(palette.palette).toEqual(['#FFF', '#000', '#FF1234']);
        });

        it('should filter out empty values from the palette list', () => {
            const emptyElement = document.createElement('div');
            emptyElement.style.setProperty('--palette', '#FFF,,#000,,');
            document.body.appendChild(emptyElement);
            const palette = new Palette({ selector: emptyElement });
            expect(palette.palette).toEqual(['#FFF', '#000']);
            document.body.removeChild(emptyElement);
        });
    });
});
