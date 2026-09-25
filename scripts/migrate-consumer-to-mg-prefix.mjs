#!/usr/bin/env node
/**
 * Migration helper for apps that consume @ikilote/magma.
 * ────────────────────────────────────────────────────────────────────────────
 * Magma 3.x prefixes every CSS custom property and every generic CSS class it
 * ships with `mg-` to avoid clashing with an app's own tokens and classes.
 * This script helps a consuming app move to the new names.
 *
 *   node migrate-consumer-to-mg-prefix.mjs --app /path/to/app             # dry run
 *   node migrate-consumer-to-mg-prefix.mjs --app /path/to/app --write     # apply vars
 *   node migrate-consumer-to-mg-prefix.mjs --app /path/to/app --classes --write
 *
 * Options:
 *   --app <dir>    Root of the app to migrate (required). Only <app>/src is touched.
 *   --magma <dir>  Root of the magma repo (to read the canonical variable list).
 *                  Defaults to ../ relative to this script.
 *   --write        Apply changes. Without it, the script only reports (dry run).
 *   --classes      Also rewrite generic CSS classes (chip, primary, warn, button,
 *                  status, tooltip, sort-*). OFF by default because these names
 *                  are generic and most apps have their OWN classes with the same
 *                  name. Read the class report first.
 *
 * Design — why it is split in two:
 *
 *   CSS variables (safe, ON by default)
 *     Magma's ~570 variable names are specific (`--dialog-background`,
 *     `--primary500`, …). We replace `--name` → `--mg-name` for those names only
 *     (a whitelist read from css-var.css), token-safe and longest-first so
 *     `--color-primary` never eats `--color-primary-hover`, and app-only vars
 *     (`--color-section`, …) are untouched.
 *     Collisions: if the app DEFINES a variable that shares a Magma name (its own
 *     `--color-primary: …`), the definition is NOT changed and is reported.
 *     Decide per case: override of a Magma token (rename to `--mg-…`) or an
 *     independent variable (leave it — but note it no longer overrides Magma).
 *
 *   CSS classes (risky, OFF by default)
 *     `button`, `buttons`, `status`, `primary`, `warn`, … collide constantly with
 *     an app's own classes. By default the script only REPORTS where these appear
 *     in class contexts, and flags names the app also defines in its own CSS
 *     (a strong hint the occurrence is the app's class, not Magma's). Pass
 *     --classes to rewrite them inside class="…", [class.x], [ngClass],
 *     classList.*, and panelClass — after you've reviewed the report.
 */
import fs from 'node:fs';
import path from 'node:path';

// ── args ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = name => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
};
const APP = getArg('--app');
const WRITE = args.includes('--write');
const DO_CLASSES = args.includes('--classes');
// By default --classes skips class names the app also defines in its own CSS
// (those are almost certainly the app's classes, not Magma's). --force-classes
// prefixes them anyway (rarely what you want).
const FORCE_CLASSES = args.includes('--force-classes');
const MAGMA = getArg('--magma') ?? path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

if (!APP) {
    console.error(
        'Usage: node migrate-consumer-to-mg-prefix.mjs --app <dir> [--magma <dir>] [--classes [--force-classes]] [--write]',
    );
    process.exit(1);
}
const APP_SRC = path.join(APP, 'src');
if (!fs.existsSync(APP_SRC)) {
    console.error(`No src/ directory found under ${APP}`);
    process.exit(1);
}

// ── canonical names ──────────────────────────────────────────────────────────
const CSS_VAR_SOURCE = path.join(MAGMA, 'projects/ikilote/magma/src/assets/styles/css-var.css');
const css = fs.readFileSync(CSS_VAR_SOURCE, 'utf8');
// css-var.css is already migrated (names look like `--mg-foo`); strip the prefix
// to recover the OLD names an app would still be using.
const varNames = new Set();
for (const m of css.matchAll(/^\s*--mg-([a-zA-Z0-9-]+)\s*:/gm)) varNames.add(m[1]);
if (varNames.size === 0) {
    console.error('Could not read any --mg- variables from css-var.css. Is --magma pointing at the migrated repo?');
    process.exit(1);
}
const escape = n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const varAll = [...varNames].sort((a, b) => b.length - a.length);
// Regex to DETECT the app's own definitions of a Magma-named variable.
const varDefRe = new RegExp(`(?<![\\w-])--(?!mg-)(${varAll.map(escape).join('|')})\\s*:`, 'g');

// Generic classes Magma renamed. Keep in sync with style.css / directives.
const CLASS_NAMES = [
    'chip',
    'chips',
    'primary',
    'warn',
    'button',
    'buttons',
    'tooltip',
    'tooltip-panel',
    'sort-cell',
    'sort-asc',
    'sort-desc',
    'status',
    'status-success',
    'status-warning',
    'status-danger',
    'status-info',
    'status-neutral',
    'status-offline',
    'status-pulse',
].sort((a, b) => b.length - a.length);
const classAlt = CLASS_NAMES.map(escape).join('|');
const classToken = new RegExp(`(?<![\\w-])(${classAlt})(?![\\w-])`, 'g');
// A generic class used as a selector in the app's own CSS (`.button`, `&.button`).
const classSelectorRe = new RegExp(`(?<![\\w.-])\\.(${classAlt})(?![\\w-])`, 'g');

// ── walk the app ─────────────────────────────────────────────────────────────
const EXT = new Set(['.css', '.scss', '.ts', '.html']);
const SKIP = new Set(['node_modules', 'dist', '.angular', '.git']);
const files = [];
(function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
            if (!SKIP.has(e.name)) walk(path.join(dir, e.name));
        } else if (EXT.has(path.extname(e.name))) {
            files.push(path.join(dir, e.name));
        }
    }
})(APP_SRC);

// First pass: discover
//   (a) generic class names the app defines in its OWN CSS, and
//   (b) Magma variable names the app DEFINES itself (collisions).
// Collisions are excluded from the variable rewrite entirely: if the app owns
// `--color-primary`, then both its definition AND every usage in the app refer
// to the app's variable, not Magma's — rewriting either would break the app.
const appOwnedClasses = new Map(); // class -> Set(files)
const collisions = new Map(); // varName -> [files]
for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const rel = path.relative(APP, file);
    for (const m of text.matchAll(varDefRe)) {
        if (!collisions.has(m[1])) collisions.set(m[1], []);
        if (!collisions.get(m[1]).includes(rel)) collisions.get(m[1]).push(rel);
    }
    if (file.endsWith('.css') || file.endsWith('.scss')) {
        for (const m of text.matchAll(classSelectorRe)) {
            if (!appOwnedClasses.has(m[1])) appOwnedClasses.set(m[1], new Set());
            appOwnedClasses.get(m[1]).add(rel);
        }
    }
}

// Build the variable-rewrite regex over Magma names the app does NOT define.
const rewritableVars = varAll.filter(n => !collisions.has(n));
const varRe = rewritableVars.length
    ? new RegExp(`(?<![\\w-])--(?!mg-)(${rewritableVars.map(escape).join('|')})(?![\\w-])`, 'g')
    : null;

// ── class rewriting (only when --classes) ────────────────────────────────────
// `skip` is the set of class names to leave alone (app-owned, unless --force-classes).
function rewriteClasses(text, skip) {
    const usage = new Map(); // class -> count
    const one = (_m, n) => {
        if (skip.has(n)) return n;
        usage.set(n, (usage.get(n) || 0) + 1);
        return `mg-${n}`;
    };
    const bump = body => body.replace(classToken, one);
    let out = text;
    out = out.replace(/(\bclass\s*=\s*")([^"]*)(")/g, (_m, a, b, c) => a + bump(b) + c);
    out = out.replace(/(\bclass\s*=\s*')([^']*)(')/g, (_m, a, b, c) => a + bump(b) + c);
    out = out.replace(/(\[class\.)([\w-]+)(\])/g, (_m, a, name, c) => a + name.replace(classToken, one) + c);
    out = out.replace(/(\[(?:ngClass|class)\]\s*=\s*")([^"]*)(")/g, (_m, a, b, c) => a + bump(b) + c);
    out = out.replace(/(\[(?:ngClass|class)\]\s*=\s*')([^']*)(')/g, (_m, a, b, c) => a + bump(b) + c);
    out = out.replace(
        /(classList\.(?:add|remove|toggle|contains|replace)\(\s*)('[^']*'|"[^"]*")/g,
        (_m, a, lit) => a + lit.replace(classToken, one),
    );
    out = out.replace(/(panelClass\s*:\s*)('[^']*'|"[^"]*")/g, (_m, a, lit) => a + lit.replace(classToken, one));
    return { out, usage };
}

// Report of class occurrences (dry insight, always computed).
function scanClasses(text) {
    const usage = new Map();
    const count = body => {
        for (const m of body.matchAll(classToken)) usage.set(m[1], (usage.get(m[1]) || 0) + 1);
    };
    for (const m of text.matchAll(/\bclass\s*=\s*"([^"]*)"/g)) count(m[1]);
    for (const m of text.matchAll(/\bclass\s*=\s*'([^']*)'/g)) count(m[1]);
    for (const m of text.matchAll(/\[class\.([\w-]+)\]/g)) count(m[1]);
    for (const m of text.matchAll(/\[(?:ngClass|class)\]\s*=\s*"([^"]*)"/g)) count(m[1]);
    for (const m of text.matchAll(/panelClass\s*:\s*('[^']*'|"[^"]*")/g)) count(m[1]);
    return usage;
}

// ── run ──────────────────────────────────────────────────────────────────────
// Classes to leave alone during rewrite: the ones the app defines itself, unless
// the user forces them with --force-classes.
const skipClasses = FORCE_CLASSES ? new Set() : new Set(appOwnedClasses.keys());

let varReplacements = 0;
let classReplacements = 0;
const changedFiles = [];
const classReport = new Map(); // class -> count across app

for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    const rel = path.relative(APP, file);

    const varCount = varRe ? (original.match(varRe) || []).length : 0;
    let updated = varRe ? original.replace(varRe, (_m, n) => `--mg-${n}`) : original;
    let clsCount = 0;

    if (file.endsWith('.html') || file.endsWith('.ts')) {
        for (const [name, n] of scanClasses(original)) classReport.set(name, (classReport.get(name) || 0) + n);
        if (DO_CLASSES) {
            const r = rewriteClasses(updated, skipClasses);
            updated = r.out;
            clsCount = [...r.usage.values()].reduce((a, b) => a + b, 0);
        }
    }

    if (updated !== original) {
        varReplacements += varCount;
        classReplacements += clsCount;
        changedFiles.push({ file: rel, vars: varCount, classes: clsCount });
        if (WRITE) fs.writeFileSync(file, updated, 'utf8');
    }
}

// ── report ───────────────────────────────────────────────────────────────────
const mode = WRITE ? 'APPLIED' : 'DRY RUN (no files written; pass --write to apply)';
console.log(`\nMagma mg- prefix migration — ${mode}`);
console.log(`App: ${APP}`);
console.log(`Class rewriting: ${DO_CLASSES ? 'ON (--classes)' : 'OFF (report only; pass --classes to enable)'}`);
console.log(`Scanned ${files.length} files under src/.\n`);

console.log(`Files changed: ${changedFiles.length}`);
console.log(`  CSS variable replacements: ${varReplacements}`);
if (DO_CLASSES) console.log(`  CSS class replacements:    ${classReplacements}`);
console.log('');
for (const c of changedFiles) {
    console.log(`  ${c.file}  (vars: ${c.vars}${DO_CLASSES ? `, classes: ${c.classes}` : ''})`);
}

if (collisions.size) {
    console.log('\n⚠ Variable collisions — the app DEFINES these Magma-named variables (NOT changed):');
    for (const [name, list] of [...collisions].sort()) {
        console.log(`  --${name}  →  review: override Magma token (rename to --mg-${name}) or keep independent?`);
        for (const f of list) console.log(`      ${f}`);
    }
}

if (classReport.size) {
    console.log('\nGeneric Magma classes found in the app (in class contexts):');
    console.log('  count  class            note');
    for (const [name, n] of [...classReport].sort((a, b) => b[1] - a[1])) {
        const owned = appOwnedClasses.get(name);
        const note = owned
            ? `⚠ app also defines .${name} in ${[...owned].length} CSS file(s) — likely the APP's own class, DO NOT prefix`
            : 'no app CSS selector — likely Magma; safe to prefix';
        console.log(`  ${String(n).padStart(5)}  ${name.padEnd(15)}  ${note}`);
    }
    if (!DO_CLASSES) {
        console.log('\n  Classes were NOT rewritten. Review the notes above, then re-run with --classes --write.');
        console.log('  With --classes, names the app defines in its own CSS (⚠) are skipped automatically;');
        console.log("  prefix those by hand only where the element is actually Magma's. Use --force-classes");
        console.log('  to override that safety (rarely wanted).');
    } else if (skipClasses.size) {
        console.log(`\n  Skipped app-owned classes (not prefixed): ${[...skipClasses].sort().join(', ')}`);
        console.log("  Prefix these by hand where the element is actually Magma's, or use --force-classes.");
    }
}

console.log('\nAlways review the diff before committing.\n');
