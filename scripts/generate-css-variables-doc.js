const fs = require('fs');

/**
 * Generates CSS-VARIABLES.md from the single source of truth, css-var.css.
 *
 * The file is parsed rather than hand-maintained so the reference cannot drift
 * from the implementation. Run it after adding or renaming a variable:
 *
 *     npm run generate:css-doc
 *
 * Section titles come from the `/* MARK: ... *\/` comments already present in
 * css-var.css. Descriptions come from SECTION_DOC below (prose written once per
 * section) plus a name-derived fallback per variable.
 */

const SOURCE = 'projects/ikilote/magma/src/assets/styles/css-var.css';
const TARGET = 'CSS-VARIABLES.md';

/** Prose describing what each MARK section covers. */
const SECTION_DOC = {
    palettes:
        'Color palette derived from a single hue plus lightness steps. Override `--primaryH` to retint the whole library.',
    'palettes light': 'Lightness steps for light mode. Set on `body` / `body.light-mode`.',
    'palettes dark': 'Lightness steps for dark mode. Set on `body.dark-mode`.',
    global: 'Cross-component values.',
    'context-menu': 'Context menu container and items (`context-menu`).',
    'ellipsis-button': 'Ellipsis (kebab) button and its dropdown list (`mg-ellipsis-button`).',
    'default button': 'Default button variant (`button`, `.mg-button`).',
    'primary button': 'Primary button variant.',
    'warn button': 'Warning / destructive button variant.',
    link: 'Anchor and text-link styling.',
    dialog: 'Modal dialog (`mg-dialog`).',
    input: 'Shared input styling: text, number, date, password, select, textarea, checkbox, radio, range.',
    'item content-box': 'Content-box and tile layouts.',
    'color-picker': 'Color picker (`color-picker`), including the HSL gradient zone and the palette grid.',
    'datetime-picker': 'Date and time picker (`datetime-picker`).',
    tabs: 'Tab list and panels (`mg-tabs`, `mg-tab-title`, `mg-tab-content`).',
    scrollbar: 'Custom scrollbar appearance.',
    message: 'Inline and block messages (`mg-message`, `mg-block-message`, `mg-info-message`).',
    grid: 'Grid helper classes.',
    block: 'Block component (`mg-block`) and its variants.',
    table: 'Table component (`table[mg]`).',
    tooltip: 'Tooltip directive (`[mgTooltip]`).',
    page: 'Page-level layout helpers.',
    walkthrough: 'Walkthrough / product tour (`mg-walkthrough`).',
    'click-enter': 'Click-enter directive (`[clickEnter]`) focus and hover feedback.',
    spinner: 'Spinner component (`mg-spinner`).',
    loader: 'Loader component (`mg-loader`) and its progress bar.',
    'loader-tile': 'Loader tile skeleton (`mg-loader-tile`, `mg-loader-block`).',
    'contrib-calendar': 'Contribution calendar (`mg-contrib-calendar`).',
    select2: 'Styling passed through to the `ng-select2-component` dependency.',
};

/** Variables whose purpose is not obvious from the name alone. */
const NOTES = {
    primaryH: 'Base hue (0-360) for the whole palette. **This is the single knob to retint the library.**',
    transparency_checkerboard:
        'Conventional grey checkerboard signalling an alpha channel. Deliberately outside the palette: retinting it would break the "this is transparent" convention. Tile size is set at the usage site.',
};

function parse(css) {
    const lines = css.split('\n');
    const sections = [];
    let scope = 'base';
    let current = null;
    let pending = null; // multi-line declaration being accumulated

    for (const raw of lines) {
        const line = raw.trim();

        // A declaration opened on a previous line: keep accumulating until `;`.
        if (pending) {
            pending.value += ' ' + line;
            if (line.endsWith(';')) {
                pending.value = normalise(pending.value.slice(0, -1));
                current.vars.push(pending);
                pending = null;
            }
            continue;
        }

        if (line.startsWith('body')) {
            scope = line.includes('dark-mode') ? 'dark' : line.includes('light-mode') ? 'light' : 'base';
            continue;
        }

        if (line.startsWith('/*') && !line.includes('MARK:')) continue;

        const mark = line.match(/^\/\* MARK: (.+?) \*\/$/);
        if (mark) {
            current = { name: mark[1], scope, vars: [] };
            sections.push(current);
            continue;
        }

        const decl = line.match(/^--([a-zA-Z0-9-]+):\s*(.*)$/);
        if (decl && current) {
            const value = decl[2];
            if (value.endsWith(';')) {
                current.vars.push({ name: decl[1], value: normalise(value.slice(0, -1)) });
            } else {
                pending = { name: decl[1], value };
            }
        }
    }
    return sections;
}

/** Collapses whitespace so multi-line values fit in a table cell. */
function normalise(value) {
    return value.replace(/\s+/g, ' ').trim();
}

/** Unique anchor per section, disambiguated by scope when names repeat. */
function anchorOf(section, index, sections) {
    const base = section.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const homonyms = sections.filter(s => s.name === section.name);
    if (homonyms.length === 1) return base;
    return `${base}-${section.scope}`;
}

/** Display title, disambiguated the same way as the anchor. */
function titleOf(section, sections) {
    const homonyms = sections.filter(s => s.name === section.name);
    if (homonyms.length === 1) return section.name;
    return `${section.name} (${section.scope})`;
}

/** Turns `--button-primary-hover-background` into `Button primary hover background`. */
function describe(name) {
    const note = NOTES[name] ?? NOTES[name.replace(/-/g, '_')];
    if (note) return note;
    const words = name.replace(/-/g, ' ');
    return words.charAt(0).toUpperCase() + words.slice(1) + '.';
}

function render(sections) {
    const total = sections.reduce((n, s) => n + s.vars.length, 0);

    const out = [];
    out.push('# CSS variables — @ikilote/magma');
    out.push('');
    out.push('> Generated from `' + SOURCE + '` by `npm run generate:css-doc`.');
    out.push('> Do not edit by hand: your changes would be overwritten.');
    out.push('');
    out.push(`**${total} variables** across ${sections.length} sections.`);
    out.push('');
    out.push('## How to override');
    out.push('');
    out.push('Every variable is a plain CSS custom property, so any selector with higher');
    out.push('specificity wins. The most common cases:');
    out.push('');
    out.push('```css');
    out.push('/* Retint the whole library */');
    out.push('body {');
    out.push('    --primaryH: 280;');
    out.push('}');
    out.push('');
    out.push('/* Override one component, globally */');
    out.push('body {');
    out.push('    --dialog-background: #fdfdfd;');
    out.push('}');
    out.push('');
    out.push('/* Override one instance only */');
    out.push('.my-dialog {');
    out.push('    --dialog-background: #fdfdfd;');
    out.push('}');
    out.push('```');
    out.push('');
    out.push('Light and dark values are set on `body` / `body.light-mode` and `body.dark-mode`');
    out.push('respectively; the remaining variables are scope-independent.');
    out.push('');
    out.push('## Contents');
    out.push('');
    sections.forEach((s, i) => {
        out.push(`- [${titleOf(s, sections)}](#${anchorOf(s, i, sections)}) · ${s.vars.length}`);
    });
    out.push('');

    for (const s of sections) {
        out.push(`## ${titleOf(s, sections)}`);
        out.push('');
        if (SECTION_DOC[s.name]) {
            out.push(SECTION_DOC[s.name]);
            out.push('');
        }
        if (s.scope !== 'base') {
            out.push(`Scope: \`body${s.scope === 'dark' ? '.dark-mode' : '.light-mode'}\`.`);
            out.push('');
        }
        out.push('| Variable | Default | Description |');
        out.push('| --- | --- | --- |');
        for (const v of s.vars) {
            const value = v.value.replace(/\|/g, '\\|');
            out.push(`| \`--${v.name}\` | \`${value}\` | ${describe(v.name)} |`);
        }
        out.push('');
    }

    return out.join('\n');
}

const css = fs.readFileSync(SOURCE, 'utf8');
const sections = parse(css);
const markdown = render(sections);
fs.writeFileSync(TARGET, markdown, 'utf8');

const total = sections.reduce((n, s) => n + s.vars.length, 0);
console.log(`${TARGET} written: ${total} variables, ${sections.length} sections.`);
