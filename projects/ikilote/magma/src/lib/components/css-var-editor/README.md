# CSS Var Editor

A suite of Angular standalone components for visually editing CSS variables and generating CSS values in real time.

## Structure

```
css-var-editor/
├── css-var-editor.component.*      Main editor with tabs
├── css-var-item.component.*        Individual CSS variable editor
├── css-var-editor.labels.ts        Centralized i18n labels (English defaults)
├── README.md
└── editors/
    ├── shadow-editor.component.*   Box-shadow builder (multi-layer)
    ├── gradient-editor.component.* Gradient builder (linear/radial/conic)
    ├── border-editor.component.*   Border + border-radius builder
    ├── color-mix-editor.component.* color-mix() builder
    ├── filter-editor.component.*   CSS filter chain builder
    ├── transform-editor.component.* CSS transform builder
    └── typography-editor.component.* Typography properties builder
```

## Usage

### Main editor

Reads all CSS custom properties from stylesheets and groups them by prefix.

```html
<!-- All variables -->
<mg-css-var-editor />

<!-- Filtered to --button-* variables only -->
<mg-css-var-editor filter="--button" />

<!-- Custom selector and labels -->
<mg-css-var-editor selector="body" [labels]="myLabels" />
```

### Standalone editors

Each editor can be used independently. They all emit a `valueChange` output with the generated CSS string.

```html
<mg-shadow-editor (valueChange)="onShadow($event)" />
<mg-gradient-editor (valueChange)="onGradient($event)" />
<mg-border-editor (valueChange)="onBorder($event)" />
<mg-color-mix-editor (valueChange)="onColorMix($event)" />
<mg-filter-editor (valueChange)="onFilter($event)" />
<mg-transform-editor (valueChange)="onTransform($event)" />
<mg-typography-editor (valueChange)="onTypography($event)" />
```

## Components

### `mg-css-var-editor`

Main component with 8 tabs: Variables, Shadow, Gradient, Border, Color Mix, Filter, Transform, Typography.

| Input      | Type                 | Default          | Description                         |
| ---------- | -------------------- | ---------------- | ----------------------------------- |
| `selector` | `string`             | `'body'`         | CSS selector to read variables from |
| `filter`   | `string`             | `''`             | Prefix filter (e.g. `'--button'`)   |
| `labels`   | `CssVarEditorLabels` | English defaults | Override UI labels                  |

### `mg-css-var-item`

Edits a single CSS variable. Auto-detects value type (color, percentage, length, number, text) and renders the appropriate input.

| Input      | Type               | Default          | Description          |
| ---------- | ------------------ | ---------------- | -------------------- |
| `variable` | `CssVariable`      | required         | The variable to edit |
| `labels`   | `CssVarItemLabels` | English defaults | Override UI labels   |

| Output        | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| `valueChange` | `string` | Emitted when the value changes |
| `reset`       | `void`   | Emitted when the user resets   |

Features:

- Auto-detection of value type with appropriate input (range for %, number for numeric, text for the rest)
- Toggle between typed mode and free text mode (to enter `var(--xxx)`, `calc(...)`, etc.)
- Unit selector via `<select>` in `mg-input-after` for length values (px, em, rem, vh, vw, %)
- Color preview swatch

### `mg-shadow-editor`

Multi-layer box-shadow builder with live preview.

Each layer has: offset X/Y, blur, spread, color, inset toggle, and a unit selector.

### `mg-gradient-editor`

Gradient builder supporting `linear-gradient`, `radial-gradient`, and `conic-gradient`.

Configurable angle and unlimited color stops with position.

### `mg-border-editor`

Border and border-radius builder with 9 border styles (solid, dashed, dotted, double, groove, ridge, inset, outset, none).

Unit selectors for width and radius.

### `mg-color-mix-editor`

`color-mix()` builder with 7 color spaces (srgb, hsl, hwb, lch, oklch, lab, oklab).

Visual preview showing both input colors and the mixed result.

### `mg-filter-editor`

CSS filter chain builder with 9 filters: brightness, contrast, saturate, grayscale, sepia, hue-rotate, invert, blur, opacity.

Each filter can be toggled on/off independently.

### `mg-transform-editor`

CSS transform builder: translate (X/Y with unit selector), scale (X/Y), rotate, skew (X/Y).

Live preview on a box element.

### `mg-typography-editor`

Typography properties builder: font-family, font-size (with unit selector), font-weight (9 levels from Thin to Black), line-height, letter-spacing (with unit selector), color.

Live text preview with customizable sample text.

## Internationalization

All UI labels default to English and can be overridden via the `labels` input on each component.

Label interfaces and defaults are exported from `css-var-editor.labels.ts`:

- `CssVarEditorLabels` / `DEFAULT_EDITOR_LABELS`
- `CssVarItemLabels` / `DEFAULT_ITEM_LABELS`
- `ShadowEditorLabels` / `DEFAULT_SHADOW_LABELS`
- `GradientEditorLabels` / `DEFAULT_GRADIENT_LABELS`
- `BorderEditorLabels` / `DEFAULT_BORDER_LABELS`
- `ColorMixEditorLabels` / `DEFAULT_COLOR_MIX_LABELS`
- `FilterEditorLabels` / `DEFAULT_FILTER_LABELS`
- `TransformEditorLabels` / `DEFAULT_TRANSFORM_LABELS`
- `TypographyEditorLabels` / `DEFAULT_TYPOGRAPHY_LABELS`

Example override:

```typescript
const frLabels: CssVarEditorLabels = {
    search: 'Rechercher',
    searchPlaceholder: 'Rechercher une variable...',
    resetAll: 'Tout réinitialiser',
    copyChanges: 'Copier les modifications',
    noResults: 'Aucune variable trouvée.',
};
```

```html
<mg-css-var-editor [labels]="frLabels" />
```

## Design decisions

- All components are **standalone** (no NgModule)
- Uses Magma's existing `mg-input`, `mg-input-text`, `mg-input-number`, `mg-input-range` components
- Uses `mg-input-after` for unit display and unit selectors (not `mg-input-suffix`)
- CSS uses `:host` as the layout container — no wrapper divs
- Styles rely on Magma's global CSS variables and button/input styles
- `ChangeDetectionStrategy.OnPush` on all components
- Angular signals (`signal`, `computed`, `input`, `output`) throughout
- Live preview: changes are applied via `document.documentElement.style.setProperty`
- Export: generates a `:root { ... }` block with only modified variables
- Each editor has a "Copy" button using `navigator.clipboard.writeText`
