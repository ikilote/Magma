# CSS variables — @ikilote/magma

> Generated from `projects/ikilote/magma/src/assets/styles/css-var.css` by `npm run generate:css-doc`.
> Do not edit by hand: your changes would be overwritten.

**595 variables** across 49 sections.

## How to override

Every variable is a plain CSS custom property, so any selector with higher
specificity wins. The most common cases:

```css
/* Retint the whole library */
body {
    --mg-primaryH: 280;
}

/* Override one component, globally */
body {
    --mg-dialog-background: #fdfdfd;
}

/* Override one instance only */
.my-dialog {
    --mg-dialog-background: #fdfdfd;
}
```

Light and dark values are set on `body` / `body.light-mode` and `body.dark-mode`
respectively; the remaining variables are scope-independent.

## Contents

- [palettes light](#palettes-light) · 23
- [loader-tile (light)](#loader-tile-light) · 1
- [palettes dark](#palettes-dark) · 23
- [loader-tile (dark)](#loader-tile-dark) · 1
- [palettes](#palettes) · 59
- [global](#global) · 10
- [spacing scale](#spacing-scale) · 12
- [generic](#generic) · 3
- [context-menu](#context-menu) · 12
- [menubar](#menubar) · 37
- [ellipsis-button](#ellipsis-button) · 4
- [vision-theme](#vision-theme) · 39
- [primary button](#primary-button) · 12
- [warn button](#warn-button) · 12
- [link](#link) · 3
- [breadcrumbs](#breadcrumbs) · 8
- [chip](#chip) · 14
- [dialog](#dialog) · 8
- [cookie-consent](#cookie-consent) · 14
- [input](#input) · 20
- [item content-box](#item-content-box) · 12
- [color-picker](#color-picker) · 13
- [datetime-picker](#datetime-picker) · 15
- [tabs](#tabs) · 6
- [scrollbar](#scrollbar) · 3
- [message types](#message-types) · 25
- [message inline](#message-inline) · 10
- [message floating](#message-floating) · 9
- [block](#block) · 5
- [card](#card) · 8
- [table](#table) · 5
- [tooltip](#tooltip) · 5
- [badge](#badge) · 21
- [page](#page) · 5
- [expansion-panel](#expansion-panel) · 2
- [walkthrough](#walkthrough) · 1
- [click-enter](#click-enter) · 4
- [spinner](#spinner) · 1
- [card-3d](#card-3d) · 23
- [loader](#loader) · 5
- [loader-tile (base)](#loader-tile-base) · 1
- [contrib-calendar](#contrib-calendar) · 7
- [avatar](#avatar) · 6
- [window](#window) · 19
- [tag-list](#tag-list) · 12
- [status](#status) · 19
- [light-dark](#light-dark) · 9
- [timeline](#timeline) · 7
- [select2](#select2) · 22

## palettes light

Lightness steps for light mode. Set on `body` / `body.light-mode`.

Scope: `body.light-mode`.

| Variable            | Default | Description                                                                                |
| ------------------- | ------- | ------------------------------------------------------------------------------------------ |
| `--mg-primaryH`     | `190`   | Base hue (0-360) for the whole palette. **This is the single knob to retint the library.** |
| `--mg-primaryS`     | `15%`   | PrimaryS.                                                                                  |
| `--mg-primarySsoft` | `5%`    | PrimarySsoft.                                                                              |
| `--mg-neutralH`     | `0`     | NeutralH.                                                                                  |
| `--mg-neutralS`     | `0%`    | NeutralS.                                                                                  |
| `--mg-alertH`       | `0`     | AlertH.                                                                                    |
| `--mg-warnH`        | `15`    | WarnH.                                                                                     |
| `--mg-successH`     | `120`   | SuccessH.                                                                                  |
| `--mg-L000`         | `100%`  | L000.                                                                                      |
| `--mg-L010`         | `95%`   | L010.                                                                                      |
| `--mg-L025`         | `90%`   | L025.                                                                                      |
| `--mg-L050`         | `85%`   | L050.                                                                                      |
| `--mg-L100`         | `75%`   | L100.                                                                                      |
| `--mg-L200`         | `65%`   | L200.                                                                                      |
| `--mg-L300`         | `55%`   | L300.                                                                                      |
| `--mg-L400`         | `45%`   | L400.                                                                                      |
| `--mg-L500`         | `35%`   | L500.                                                                                      |
| `--mg-L600`         | `25%`   | L600.                                                                                      |
| `--mg-L700`         | `20%`   | L700.                                                                                      |
| `--mg-L800`         | `10%`   | L800.                                                                                      |
| `--mg-L900`         | `5%`    | L900.                                                                                      |
| `--mg-L950`         | `2%`    | L950.                                                                                      |
| `--mg-L990`         | `0%`    | L990.                                                                                      |

## loader-tile (light)

Loader tile skeleton (`mg-loader-tile`, `mg-loader-block`).

Scope: `body.light-mode`.

| Variable                            | Default | Description                   |
| ----------------------------------- | ------- | ----------------------------- |
| `--mg-loading-item-animation-color` | `0 0 0` | Loading item animation color. |

## palettes dark

Lightness steps for dark mode. Set on `body.dark-mode`.

Scope: `body.dark-mode`.

| Variable            | Default | Description                                                                                |
| ------------------- | ------- | ------------------------------------------------------------------------------------------ |
| `--mg-primaryH`     | `210`   | Base hue (0-360) for the whole palette. **This is the single knob to retint the library.** |
| `--mg-primaryS`     | `15%`   | PrimaryS.                                                                                  |
| `--mg-primarySsoft` | `5%`    | PrimarySsoft.                                                                              |
| `--mg-neutralH`     | `0`     | NeutralH.                                                                                  |
| `--mg-neutralS`     | `0%`    | NeutralS.                                                                                  |
| `--mg-alertH`       | `0`     | AlertH.                                                                                    |
| `--mg-warnH`        | `15`    | WarnH.                                                                                     |
| `--mg-successH`     | `120`   | SuccessH.                                                                                  |
| `--mg-L000`         | `0%`    | L000.                                                                                      |
| `--mg-L010`         | `3%`    | L010.                                                                                      |
| `--mg-L025`         | `4%`    | L025.                                                                                      |
| `--mg-L050`         | `5%`    | L050.                                                                                      |
| `--mg-L100`         | `6%`    | L100.                                                                                      |
| `--mg-L200`         | `10%`   | L200.                                                                                      |
| `--mg-L300`         | `20%`   | L300.                                                                                      |
| `--mg-L400`         | `35%`   | L400.                                                                                      |
| `--mg-L500`         | `40%`   | L500.                                                                                      |
| `--mg-L600`         | `50%`   | L600.                                                                                      |
| `--mg-L700`         | `60%`   | L700.                                                                                      |
| `--mg-L800`         | `70%`   | L800.                                                                                      |
| `--mg-L900`         | `80%`   | L900.                                                                                      |
| `--mg-L950`         | `95%`   | L950.                                                                                      |
| `--mg-L990`         | `100%`  | L990.                                                                                      |

## loader-tile (dark)

Loader tile skeleton (`mg-loader-tile`, `mg-loader-block`).

Scope: `body.dark-mode`.

| Variable                            | Default       | Description                   |
| ----------------------------------- | ------------- | ----------------------------- |
| `--mg-loading-item-animation-color` | `255 255 255` | Loading item animation color. |

## palettes

Color palette derived from a single hue plus lightness steps. Override `--mg-primaryH` to retint the whole library.

| Variable          | Default                                                           | Description |
| ----------------- | ----------------------------------------------------------------- | ----------- |
| `--mg-primary050` | `hsl(var(--mg-primaryH), var(--mg-primarySsoft), var(--mg-L050))` | Primary050. |
| `--mg-primary100` | `hsl(var(--mg-primaryH), var(--mg-primaryS), var(--mg-L100))`     | Primary100. |
| `--mg-primary200` | `hsl(var(--mg-primaryH), var(--mg-primaryS), var(--mg-L200))`     | Primary200. |
| `--mg-primary300` | `hsl(var(--mg-primaryH), var(--mg-primaryS), var(--mg-L300))`     | Primary300. |
| `--mg-primary400` | `hsl(var(--mg-primaryH), var(--mg-primaryS), var(--mg-L400))`     | Primary400. |
| `--mg-primary500` | `hsl(var(--mg-primaryH), var(--mg-primaryS), var(--mg-L500))`     | Primary500. |
| `--mg-primary600` | `hsl(var(--mg-primaryH), var(--mg-primaryS), var(--mg-L600))`     | Primary600. |
| `--mg-primary700` | `hsl(var(--mg-primaryH), var(--mg-primaryS), var(--mg-L700))`     | Primary700. |
| `--mg-primary800` | `hsl(var(--mg-primaryH), var(--mg-primaryS), var(--mg-L800))`     | Primary800. |
| `--mg-primary900` | `hsl(var(--mg-primaryH), var(--mg-primaryS), var(--mg-L900))`     | Primary900. |
| `--mg-primary950` | `hsl(var(--mg-primaryH), var(--mg-primarySsoft), var(--mg-L950))` | Primary950. |
| `--mg-neutral000` | `hsl(var(--mg-neutralH), var(--mg-neutralS), var(--mg-L000))`     | Neutral000. |
| `--mg-neutral010` | `hsl(var(--mg-neutralH), var(--mg-neutralS), var(--mg-L010))`     | Neutral010. |
| `--mg-neutral025` | `hsl(var(--mg-neutralH), var(--mg-neutralS), var(--mg-L025))`     | Neutral025. |
| `--mg-neutral050` | `hsl(var(--mg-neutralH), var(--mg-neutralS), var(--mg-L050))`     | Neutral050. |
| `--mg-neutral100` | `hsl(var(--mg-neutralH), var(--mg-neutralS), var(--mg-L100))`     | Neutral100. |
| `--mg-neutral200` | `hsl(var(--mg-neutralH), var(--mg-neutralS), var(--mg-L200))`     | Neutral200. |
| `--mg-neutral300` | `hsl(var(--mg-neutralH), var(--mg-neutralS), var(--mg-L300))`     | Neutral300. |
| `--mg-neutral400` | `hsl(var(--mg-neutralH), var(--mg-neutralS), var(--mg-L400))`     | Neutral400. |
| `--mg-neutral500` | `hsl(var(--mg-neutralH), var(--mg-neutralS), var(--mg-L500))`     | Neutral500. |
| `--mg-neutral600` | `hsl(var(--mg-neutralH), var(--mg-neutralS), var(--mg-L600))`     | Neutral600. |
| `--mg-neutral700` | `hsl(var(--mg-neutralH), var(--mg-neutralS), var(--mg-L700))`     | Neutral700. |
| `--mg-neutral800` | `hsl(var(--mg-neutralH), var(--mg-neutralS), var(--mg-L800))`     | Neutral800. |
| `--mg-neutral900` | `hsl(var(--mg-neutralH), var(--mg-neutralS), var(--mg-L900))`     | Neutral900. |
| `--mg-neutral950` | `hsl(var(--mg-neutralH), var(--mg-neutralS), var(--mg-L950))`     | Neutral950. |
| `--mg-neutral990` | `hsl(var(--mg-neutralH), var(--mg-neutralS), var(--mg-L990))`     | Neutral990. |
| `--mg-alert050`   | `hsl(var(--mg-alertH), 5%, var(--mg-L050))`                       | Alert050.   |
| `--mg-alert100`   | `hsl(var(--mg-alertH), 15%, var(--mg-L100))`                      | Alert100.   |
| `--mg-alert200`   | `hsl(var(--mg-alertH), 25%, var(--mg-L200))`                      | Alert200.   |
| `--mg-alert300`   | `hsl(var(--mg-alertH), 45%, var(--mg-L300))`                      | Alert300.   |
| `--mg-alert400`   | `hsl(var(--mg-alertH), 55%, var(--mg-L400))`                      | Alert400.   |
| `--mg-alert500`   | `hsl(var(--mg-alertH), 75%, var(--mg-L500))`                      | Alert500.   |
| `--mg-alert600`   | `hsl(var(--mg-alertH), 65%, var(--mg-L600))`                      | Alert600.   |
| `--mg-alert700`   | `hsl(var(--mg-alertH), 55%, var(--mg-L700))`                      | Alert700.   |
| `--mg-alert800`   | `hsl(var(--mg-alertH), 45%, var(--mg-L800))`                      | Alert800.   |
| `--mg-alert900`   | `hsl(var(--mg-alertH), 25%, var(--mg-L900))`                      | Alert900.   |
| `--mg-alert950`   | `hsl(var(--mg-alertH), 5%, var(--mg-L950))`                       | Alert950.   |
| `--mg-warn050`    | `hsl(var(--mg-warnH), 5%, var(--mg-L050))`                        | Warn050.    |
| `--mg-warn100`    | `hsl(var(--mg-warnH), 15%, var(--mg-L100))`                       | Warn100.    |
| `--mg-warn200`    | `hsl(var(--mg-warnH), 25%, var(--mg-L200))`                       | Warn200.    |
| `--mg-warn300`    | `hsl(var(--mg-warnH), 45%, var(--mg-L300))`                       | Warn300.    |
| `--mg-warn400`    | `hsl(var(--mg-warnH), 55%, var(--mg-L400))`                       | Warn400.    |
| `--mg-warn500`    | `hsl(var(--mg-warnH), 75%, var(--mg-L500))`                       | Warn500.    |
| `--mg-warn600`    | `hsl(var(--mg-warnH), 65%, var(--mg-L600))`                       | Warn600.    |
| `--mg-warn700`    | `hsl(var(--mg-warnH), 55%, var(--mg-L700))`                       | Warn700.    |
| `--mg-warn800`    | `hsl(var(--mg-warnH), 45%, var(--mg-L800))`                       | Warn800.    |
| `--mg-warn900`    | `hsl(var(--mg-warnH), 25%, var(--mg-L900))`                       | Warn900.    |
| `--mg-warn950`    | `hsl(var(--mg-warnH), 5%, var(--mg-L950))`                        | Warn950.    |
| `--mg-success050` | `hsl(var(--mg-successH), 5%, var(--mg-L050))`                     | Success050. |
| `--mg-success100` | `hsl(var(--mg-successH), 15%, var(--mg-L100))`                    | Success100. |
| `--mg-success200` | `hsl(var(--mg-successH), 25%, var(--mg-L200))`                    | Success200. |
| `--mg-success300` | `hsl(var(--mg-successH), 45%, var(--mg-L300))`                    | Success300. |
| `--mg-success400` | `hsl(var(--mg-successH), 55%, var(--mg-L400))`                    | Success400. |
| `--mg-success500` | `hsl(var(--mg-successH), 55%, var(--mg-L500))`                    | Success500. |
| `--mg-success600` | `hsl(var(--mg-successH), 65%, var(--mg-L600))`                    | Success600. |
| `--mg-success700` | `hsl(var(--mg-successH), 55%, var(--mg-L700))`                    | Success700. |
| `--mg-success800` | `hsl(var(--mg-successH), 45%, var(--mg-L800))`                    | Success800. |
| `--mg-success900` | `hsl(var(--mg-successH), 25%, var(--mg-L900))`                    | Success900. |
| `--mg-success950` | `hsl(var(--mg-successH), 5%, var(--mg-L950))`                     | Success950. |

## global

Cross-component values.

| Variable                         | Default                                                                                                             | Description                                                                                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--mg-transparency-checkerboard` | `conic-gradient( #ccc 0.25turn, #aaa 0.25turn 0.5turn, #ccc 0.5turn 0.75turn, #aaa 0.75turn )`                      | Conventional grey checkerboard signalling an alpha channel. Deliberately outside the palette: retinting it would break the "this is transparent" convention. Tile size is set at the usage site. |
| `--mg-background`                | `var(--mg-neutral010)`                                                                                              | Background.                                                                                                                                                                                      |
| `--mg-text-color`                | `var(--mg-primary950)`                                                                                              | Text color.                                                                                                                                                                                      |
| `--mg-font-family`               | `'Roboto', 'Segoe UI', Geneva, Verdana, sans-serif`                                                                 | Font family.                                                                                                                                                                                     |
| `--mg-font-mono`                 | `'Roboto Mono', 'FreeMono', 'Liberation Mono', 'Ubuntu Mono', 'Courier New', 'Droid Sans Mono', Courier, monospace` | Font mono.                                                                                                                                                                                       |
| `--mg-font-extra`                | `2.3em`                                                                                                             | Font extra.                                                                                                                                                                                      |
| `--mg-font-large`                | `1.35em`                                                                                                            | Font large.                                                                                                                                                                                      |
| `--mg-font-medium`               | `1em`                                                                                                               | Font medium.                                                                                                                                                                                     |
| `--mg-font-small`                | `0.85em`                                                                                                            | Font small.                                                                                                                                                                                      |
| `--mg-font-very-small`           | `0.75em`                                                                                                            | Font very small.                                                                                                                                                                                 |

## spacing scale

| Variable                      | Default                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Description             |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `--mg-space-3xs`              | `0.125rem; /* 2px */ --mg-space-2xs: 0.25rem; /* 4px */ --mg-space-xs: 0.375rem; /* 6px */ --mg-space-sm: 0.5rem; /* 8px */ --mg-space-md: 0.625rem; /* 10px */ --mg-space-lg: 0.75rem; /* 12px */ --mg-space-xl: 1rem; /* 16px */ --mg-space-2xl: 1.25rem; /* 20px */ --mg-space-3xl: 1.5rem; /* 24px */ --mg-space-4xl: 1.875rem; /* 30px */ /* MARK: semantic layer */ /* Role-based tokens shared across all components. Override these to retheme globally without touching per-component variables. Each component variable below defaults to one of these roles` | Space 3xs.              |
| `--mg-color-surface`          | `var(--mg-neutral010)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Color surface.          |
| `--mg-color-surface-raised`   | `var(--mg-neutral050)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Color surface raised.   |
| `--mg-color-surface-sunken`   | `var(--mg-neutral100)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Color surface sunken.   |
| `--mg-color-on-surface`       | `var(--mg-neutral990)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Color on surface.       |
| `--mg-color-on-surface-muted` | `var(--mg-neutral600)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Color on surface muted. |
| `--mg-color-border`           | `var(--mg-neutral500)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Color border.           |
| `--mg-color-border-strong`    | `var(--mg-neutral700)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Color border strong.    |
| `--mg-color-primary`          | `var(--mg-primary300)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Color primary.          |
| `--mg-color-on-primary`       | `var(--mg-neutral000)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Color on primary.       |
| `--mg-color-primary-hover`    | `var(--mg-primary500)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Color primary hover.    |
| `--mg-color-focus-ring`       | `var(--mg-primary500)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Color focus ring.       |

## generic

| Variable                 | Default                  | Description        |
| ------------------------ | ------------------------ | ------------------ |
| `--mg-separator-opacity` | `0.2`                    | Separator opacity. |
| `--mg-separator-margin`  | `var(--mg-space-xl) 0`   | Separator margin.  |
| `--mg-separator-color`   | `var(--mg-color-border)` | Separator color.   |

## context-menu

Context menu container and items (`context-menu`).

| Variable                                  | Default                                                                        | Description                         |
| ----------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------- |
| `--mg-context-menu-background`            | `var(--mg-color-surface-raised)`                                               | Context menu background.            |
| `--mg-context-menu-border`                | `none`                                                                         | Context menu border.                |
| `--mg-context-menu-border-color`          | `transparent`                                                                  | Context menu border color.          |
| `--mg-context-menu-box-shadow`            | `2px 2px 5px #0005`                                                            | Context menu box shadow.            |
| `--mg-context-menu-border-radius`         | `6px`                                                                          | Context menu border radius.         |
| `--mg-context-menu-item-background`       | `var(--mg-primary200)`                                                         | Context menu item background.       |
| `--mg-context-menu-item-background-hover` | `var(--mg-primary300)`                                                         | Context menu item background hover. |
| `--mg-context-menu-item-gap`              | `var(--mg-space-md)`                                                           | Context menu item gap.              |
| `--mg-context-menu-item-margin`           | `var(--mg-space-3xs)`                                                          | Context menu item margin.           |
| `--mg-context-menu-item-radius`           | `4px`                                                                          | Context menu item radius.           |
| `--mg-context-menu-item-padding`          | `var(--mg-space-md) var(--mg-space-2xl) var(--mg-space-md) var(--mg-space-md)` | Context menu item padding.          |
| `--mg-context-menu-item-shadow-color`     | `#0008`                                                                        | Context menu item shadow color.     |

## menubar

| Variable                                  | Default                                                                               | Description                         |
| ----------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------- |
| `--mg-menubar-background`                 | `var(--mg-block-background)`                                                          | Menubar background.                 |
| `--mg-menubar-border`                     | `1px solid transparent`                                                               | Menubar border.                     |
| `--mg-menubar-text-color`                 | `inherit`                                                                             | Menubar text color.                 |
| `--mg-menubar-font-size`                  | `0.9rem`                                                                              | Menubar font size.                  |
| `--mg-menubar-trigger-padding`            | `var(--mg-space-2xs) var(--mg-space-md)`                                              | Menubar trigger padding.            |
| `--mg-menubar-trigger-gap`                | `var(--mg-space-xs)`                                                                  | Menubar trigger gap.                |
| `--mg-menubar-trigger-radius`             | `var(--mg-block-radius, 4px)`                                                         | Menubar trigger radius.             |
| `--mg-menubar-trigger-border`             | `1px solid transparent`                                                               | Menubar trigger border.             |
| `--mg-menubar-trigger-border-color`       | `transparent`                                                                         | Menubar trigger border color.       |
| `--mg-menubar-trigger-box-shadow`         | `none`                                                                                | Menubar trigger box shadow.         |
| `--mg-menubar-trigger-background`         | `transparent`                                                                         | Menubar trigger background.         |
| `--mg-menubar-hover-background`           | `var(--mg-primary200)`                                                                | Menubar hover background.           |
| `--mg-menubar-trigger-hover-border`       | `var(--mg-menubar-trigger-border)`                                                    | Menubar trigger hover border.       |
| `--mg-menubar-trigger-hover-border-color` | `var(--mg-menubar-trigger-border-color)`                                              | Menubar trigger hover border color. |
| `--mg-menubar-trigger-hover-box-shadow`   | `var(--mg-menubar-trigger-box-shadow)`                                                | Menubar trigger hover box shadow.   |
| `--mg-menubar-trigger-hover-background`   | `var(--mg-menubar-hover-background)`                                                  | Menubar trigger hover background.   |
| `--mg-menubar-trigger-open-border`        | `var(--mg-menubar-trigger-hover-border)`                                              | Menubar trigger open border.        |
| `--mg-menubar-trigger-open-border-color`  | `var(--mg-menubar-trigger-hover-border-color)`                                        | Menubar trigger open border color.  |
| `--mg-menubar-trigger-open-box-shadow`    | `var(--mg-menubar-trigger-hover-box-shadow)`                                          | Menubar trigger open box shadow.    |
| `--mg-menubar-trigger-open-background`    | `var(--mg-menubar-trigger-hover-background)`                                          | Menubar trigger open background.    |
| `--mg-menubar-dropdown-background`        | `var(--mg-block-background)`                                                          | Menubar dropdown background.        |
| `--mg-menubar-dropdown-border`            | `var(--mg-block-border)`                                                              | Menubar dropdown border.            |
| `--mg-menubar-dropdown-border-color`      | `var(--mg-primary500)`                                                                | Menubar dropdown border color.      |
| `--mg-menubar-dropdown-radius`            | `var(--mg-block-radius, 4px)`                                                         | Menubar dropdown radius.            |
| `--mg-menubar-dropdown-shadow`            | `2px 2px 8px var(--block-shadow-color)`                                               | Menubar dropdown shadow.            |
| `--mg-menubar-dropdown-padding`           | `var(--mg-space-2xs) 0`                                                               | Menubar dropdown padding.           |
| `--mg-menubar-dropdown-min-width`         | `10rem; /* 160px */ --mg-menubar-item-padding: var(--mg-space-xs) var(--mg-space-lg)` | Menubar dropdown min width.         |
| `--mg-menubar-item-gap`                   | `var(--mg-space-sm)`                                                                  | Menubar item gap.                   |
| `--mg-menubar-item-hover-background`      | `var(--mg-primary300)`                                                                | Menubar item hover background.      |
| `--mg-menubar-item-hover-color`           | `var(--mg-neutral950)`                                                                | Menubar item hover color.           |
| `--mg-menubar-item-disabled-opacity`      | `0.45`                                                                                | Menubar item disabled opacity.      |
| `--mg-menubar-item-arrow-opacity`         | `0.7`                                                                                 | Menubar item arrow opacity.         |
| `--mg-menubar-item-arrow-size`            | `0.65em`                                                                              | Menubar item arrow size.            |
| `--mg-menubar-separator`                  | `1px solid var(--mg-primary500)`                                                      | Menubar separator.                  |
| `--mg-menubar-separator-margin`           | `var(--mg-space-2xs) var(--mg-space-sm)`                                              | Menubar separator margin.           |
| `--mg-menubar-bar-separator`              | `1px solid var(--mg-primary500)`                                                      | Menubar bar separator.              |
| `--mg-menubar-bar-separator-margin`       | `var(--mg-space-2xs) var(--mg-space-3xs)`                                             | Menubar bar separator margin.       |

## ellipsis-button

Ellipsis (kebab) button and its dropdown list (`mg-ellipsis-button`).

| Variable                              | Default                          | Description                     |
| ------------------------------------- | -------------------------------- | ------------------------------- |
| `--mg-ellipsis-list-shadow-color`     | `#0005`                          | Ellipsis list shadow color.     |
| `--mg-context-button-list-background` | `var(--mg-color-surface-raised)` | Context button list background. |
| `--mg-ellipsis-item-background`       | `var(--mg-primary300)`           | Ellipsis item background.       |
| `--mg-ellipsis-item-hover-background` | `var(--mg-primary400)`           | Ellipsis item hover background. |

## vision-theme

| Variable                                    | Default                                                                                | Description                           |
| ------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------- |
| `--mg-vision-theme-button-border-width`     | `1px`                                                                                  | Vision theme button border width.     |
| `--mg-vision-theme-button-border-radius`    | `20px`                                                                                 | Vision theme button border radius.    |
| `--mg-vision-theme-button-gap`              | `var(--mg-space-xs)`                                                                   | Vision theme button gap.              |
| `--mg-vision-theme-button-padding`          | `var(--mg-space-2xs) var(--mg-space-md)`                                               | Vision theme button padding.          |
| `--mg-vision-theme-button-compact-padding`  | `var(--mg-space-2xs) var(--mg-space-sm)`                                               | Vision theme button compact padding.  |
| `--mg-vision-theme-label-font-size`         | `var(--mg-font-small)`                                                                 | Vision theme label font size.         |
| `--mg-vision-theme-icon-size`               | `1.125rem; /* 18px */ --mg-vision-theme-focus-outline-width: 2px`                      | Vision theme icon size.               |
| `--mg-vision-theme-focus-outline-offset`    | `2px`                                                                                  | Vision theme focus outline offset.    |
| `--mg-vision-theme-list-box-shadow`         | `2px 2px 8px var(--mg-ellipsis-list-shadow-color)`                                     | Vision theme list box shadow.         |
| `--mg-vision-theme-list-border-radius`      | `6px`                                                                                  | Vision theme list border radius.      |
| `--mg-vision-theme-list-padding`            | `var(--mg-space-3xs)`                                                                  | Vision theme list padding.            |
| `--mg-vision-theme-list-min-width`          | `13.75rem; /* 220px */ --mg-vision-theme-list-separator-margin: var(--mg-space-3xs) 0` | Vision theme list min width.          |
| `--mg-vision-theme-item-margin`             | `var(--mg-space-3xs)`                                                                  | Vision theme item margin.             |
| `--mg-vision-theme-item-border-radius`      | `4px`                                                                                  | Vision theme item border radius.      |
| `--mg-vision-theme-item-padding`            | `var(--mg-space-md) var(--mg-space-2xl) var(--mg-space-md) var(--mg-space-md)`         | Vision theme item padding.            |
| `--mg-vision-theme-item-gap`                | `var(--mg-space-sm)`                                                                   | Vision theme item gap.                |
| `--mg-vision-theme-item-content-gap`        | `var(--mg-space-3xs)`                                                                  | Vision theme item content gap.        |
| `--mg-vision-theme-item-background`         | `var(--mg-primary050)`                                                                 | Vision theme item background.         |
| `--mg-vision-theme-item-hover-background`   | `var(--mg-ellipsis-item-hover-background)`                                             | Vision theme item hover background.   |
| `--mg-vision-theme-item-active-font-weight` | `600`                                                                                  | Vision theme item active font weight. |
| `--mg-vision-theme-item-desc-opacity`       | `0.7`                                                                                  | Vision theme item desc opacity.       |
| `--mg-vision-theme-clear-btn-opacity`       | `0.8`                                                                                  | Vision theme clear btn opacity.       |
| `--mg-vision-theme-checkbox-size`           | `1.625rem; /* 26px */ /* MARK: default button */ --mg-button-disabled-opacity: 0.25`   | Vision theme checkbox size.           |
| `--mg-button-default-border-radius`         | `5px`                                                                                  | Button default border radius.         |
| `--mg-button-default-border-width`          | `2px`                                                                                  | Button default border width.          |
| `--mg-button-default-padding`               | `var(--mg-space-md)`                                                                   | Button default padding.               |
| `--mg-button-default-margin`                | `0 var(--mg-space-2xs)`                                                                | Button default margin.                |
| `--mg-button-default-border-color`          | `var(--mg-neutral300)`                                                                 | Button default border color.          |
| `--mg-button-default-background`            | `var(--mg-color-surface-raised)`                                                       | Button default background.            |
| `--mg-button-default-box-shadow`            | `0 0 1px var(--mg-neutral500)`                                                         | Button default box shadow.            |
| `--mg-button-default-color`                 | `var(--mg-neutral950)`                                                                 | Button default color.                 |
| `--mg-button-default-hover-border-color`    | `var(--mg-neutral100)`                                                                 | Button default hover border color.    |
| `--mg-button-default-hover-background`      | `var(--mg-neutral300)`                                                                 | Button default hover background.      |
| `--mg-button-default-hover-box-shadow`      | `0 0 6px var(--mg-neutral300)`                                                         | Button default hover box shadow.      |
| `--mg-button-default-focus-border-color`    | `var(--mg-input-focus-color)`                                                          | Button default focus border color.    |
| `--mg-button-default-active-border-color`   | `var(--mg-neutral100)`                                                                 | Button default active border color.   |
| `--mg-button-default-active-background`     | `var(--mg-neutral400)`                                                                 | Button default active background.     |
| `--mg-button-default-active-box-shadow`     | `0 0 6px var(--mg-neutral500)`                                                         | Button default active box shadow.     |
| `--mg-button-default-active-padding`        | `var(--mg-button-default-padding)`                                                     | Button default active padding.        |

## primary button

Primary button variant.

| Variable                                  | Default                            | Description                         |
| ----------------------------------------- | ---------------------------------- | ----------------------------------- |
| `--mg-button-primary-border-color`        | `var(--mg-primary300)`             | Button primary border color.        |
| `--mg-button-primary-background`          | `var(--mg-color-primary)`          | Button primary background.          |
| `--mg-button-primary-box-shadow`          | `0 0 1px var(--mg-primary050)`     | Button primary box shadow.          |
| `--mg-button-primary-color`               | `var(--mg-primary950)`             | Button primary color.               |
| `--mg-button-primary-hover-border-color`  | `var(--mg-primary100)`             | Button primary hover border color.  |
| `--mg-button-primary-hover-background`    | `var(--mg-color-primary-hover)`    | Button primary hover background.    |
| `--mg-button-primary-hover-box-shadow`    | `0 0 6px var(--mg-primary300)`     | Button primary hover box shadow.    |
| `--mg-button-primary-focus-border-color`  | `var(--mg-input-focus-color)`      | Button primary focus border color.  |
| `--mg-button-primary-active-border-color` | `var(--mg-primary100)`             | Button primary active border color. |
| `--mg-button-primary-active-background`   | `var(--mg-primary500)`             | Button primary active background.   |
| `--mg-button-primary-active-box-shadow`   | `0 0 6px var(--mg-primary500)`     | Button primary active box shadow.   |
| `--mg-button-primary-active-padding`      | `var(--mg-button-default-padding)` | Button primary active padding.      |

## warn button

Warning / destructive button variant.

| Variable                               | Default                            | Description                      |
| -------------------------------------- | ---------------------------------- | -------------------------------- |
| `--mg-button-warn-border-color`        | `var(--mg-alert300)`               | Button warn border color.        |
| `--mg-button-warn-background`          | `var(--mg-alert200)`               | Button warn background.          |
| `--mg-button-warn-box-shadow`          | `0 0 1px var(--mg-alert050)`       | Button warn box shadow.          |
| `--mg-button-warn-color`               | `var(--mg-alert950)`               | Button warn color.               |
| `--mg-button-warn-hover-border-color`  | `var(--mg-alert100)`               | Button warn hover border color.  |
| `--mg-button-warn-hover-background`    | `var(--mg-alert400)`               | Button warn hover background.    |
| `--mg-button-warn-hover-box-shadow`    | `0 0 6px var(--mg-alert300)`       | Button warn hover box shadow.    |
| `--mg-button-warn-focus-border-color`  | `var(--mg-alert500)`               | Button warn focus border color.  |
| `--mg-button-warn-active-border-color` | `var(--mg-alert100)`               | Button warn active border color. |
| `--mg-button-warn-active-background`   | `var(--mg-alert500)`               | Button warn active background.   |
| `--mg-button-warn-active-box-shadow`   | `0 0 6px var(--mg-alert500)`       | Button warn active box shadow.   |
| `--mg-button-warn-active-padding`      | `var(--mg-button-default-padding)` | Button warn active padding.      |

## link

Anchor and text-link styling.

| Variable                       | Default                       | Description              |
| ------------------------------ | ----------------------------- | ------------------------ |
| `--mg-link-color`              | `var(--mg-primary800)`        | Link color.              |
| `--mg-link-hover-color`        | `var(--mg-neutral990)`        | Link hover color.        |
| `--mg-link-focus-border-color` | `var(--mg-input-focus-color)` | Link focus border color. |

## breadcrumbs

| Variable                              | Default                      | Description                     |
| ------------------------------------- | ---------------------------- | ------------------------------- |
| `--mg-breadcrumbs-gap`                | `var(--mg-space-sm)`         | Breadcrumbs gap.                |
| `--mg-breadcrumbs-font-size`          | `0.9em`                      | Breadcrumbs font size.          |
| `--mg-breadcrumbs-separator`          | `'/'`                        | Breadcrumbs separator.          |
| `--mg-breadcrumbs-separator-color`    | `var(--mg-neutral600)`       | Breadcrumbs separator color.    |
| `--mg-breadcrumbs-link-color`         | `var(--mg-link-color)`       | Breadcrumbs link color.         |
| `--mg-breadcrumbs-link-hover-color`   | `var(--mg-link-hover-color)` | Breadcrumbs link hover color.   |
| `--mg-breadcrumbs-active-color`       | `var(--mg-neutral950)`       | Breadcrumbs active color.       |
| `--mg-breadcrumbs-active-font-weight` | `600`                        | Breadcrumbs active font weight. |

## chip

| Variable                        | Default                                 | Description               |
| ------------------------------- | --------------------------------------- | ------------------------- |
| `--mg-chip-background`          | `var(--mg-color-surface-raised)`        | Chip background.          |
| `--mg-chip-color`               | `var(--mg-text-color)`                  | Chip color.               |
| `--mg-chip-border-color`        | `var(--mg-color-border)`                | Chip border color.        |
| `--mg-chip-border-radius`       | `16px`                                  | Chip border radius.       |
| `--mg-chip-padding`             | `var(--mg-space-xs) var(--mg-space-lg)` | Chip padding.             |
| `--mg-chip-font-size`           | `var(--mg-font-small)`                  | Chip font size.           |
| `--mg-chip-hover-background`    | `var(--mg-color-primary)`               | Chip hover background.    |
| `--mg-chip-hover-color`         | `var(--mg-color-on-primary)`            | Chip hover color.         |
| `--mg-chip-hover-border-color`  | `var(--mg-color-primary-hover)`         | Chip hover border color.  |
| `--mg-chip-hover-padding`       | `var(--mg-chip-padding)`                | Chip hover padding.       |
| `--mg-chip-active-background`   | `var(--mg-color-primary-hover)`         | Chip active background.   |
| `--mg-chip-active-color`        | `var(--mg-color-on-primary)`            | Chip active color.        |
| `--mg-chip-active-border-color` | `var(--mg-color-primary-hover)`         | Chip active border color. |
| `--mg-chip-active-padding`      | `var(--mg-chip-padding)`                | Chip active padding.      |

## dialog

Modal dialog (`mg-dialog`).

| Variable                                    | Default                                                    | Description                           |
| ------------------------------------------- | ---------------------------------------------------------- | ------------------------------------- |
| `--mg-dialog-backdrop-filter`               | `blur(2px)`                                                | Dialog backdrop filter.               |
| `--mg-dialog-backdrop-background`           | `color-mix(in hsl, var(--mg-primary050) 60%, transparent)` | Dialog backdrop background.           |
| `--mg-dialog-backdrop-background-no-filter` | `color-mix(in hsl, var(--mg-primary050) 70%, transparent)` | Dialog backdrop background no filter. |
| `--mg-dialog-background`                    | `var(--mg-color-surface-raised)`                           | Dialog background.                    |
| `--mg-dialog-shadow-color`                  | `#0005`                                                    | Dialog shadow color.                  |
| `--mg-dialog-close-shadow-color`            | `var(--mg-neutral300)`                                     | Dialog close shadow color.            |
| `--mg-dialog-close-background`              | `var(--mg-neutral100)`                                     | Dialog close background.              |
| `--mg-dialog-close-background-hover`        | `var(--mg-neutral300)`                                     | Dialog close background hover.        |

## cookie-consent

| Variable                                            | Default                                                              | Description                                   |
| --------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------- |
| `--mg-cookie-consent-banner-background`             | `var(--mg-dialog-background)`                                        | Cookie consent banner background.             |
| `--mg-cookie-consent-banner-padding`                | `var(--mg-space-2xl)`                                                | Cookie consent banner padding.                |
| `--mg-cookie-consent-actions-gap`                   | `var(--mg-space-sm)`                                                 | Cookie consent actions gap.                   |
| `--mg-cookie-consent-presentation-margin`           | `0 0 var(--mg-space-lg)`                                             | Cookie consent presentation margin.           |
| `--mg-cookie-consent-separator-opacity`             | `0.2`                                                                | Cookie consent separator opacity.             |
| `--mg-cookie-consent-separator-margin`              | `var(--mg-space-xl) 0`                                               | Cookie consent separator margin.              |
| `--mg-cookie-consent-separator-color`               | `var(--mg-color-border)`                                             | Cookie consent separator color.               |
| `--mg-cookie-consent-option-gap`                    | `var(--mg-space-2xs) var(--mg-space-2xl)`                            | Cookie consent option gap.                    |
| `--mg-cookie-consent-option-margin-bottom`          | `var(--mg-space-xl)`                                                 | Cookie consent option margin bottom.          |
| `--mg-cookie-consent-option-toggle-width`           | `5rem; /* 80px */ --mg-cookie-consent-option-label-font-weight: 600` | Cookie consent option toggle width.           |
| `--mg-cookie-consent-option-desc-color`             | `var(--mg-neutral700)`                                               | Cookie consent option desc color.             |
| `--mg-cookie-consent-option-desc-font-size`         | `var(--mg-font-small)`                                               | Cookie consent option desc font size.         |
| `--mg-cookie-consent-dialog-actions-margin-top`     | `var(--mg-space-xl)`                                                 | Cookie consent dialog actions margin top.     |
| `--mg-cookie-consent-dialog-actions-padding-bottom` | `var(--mg-space-xl)`                                                 | Cookie consent dialog actions padding bottom. |

## input

Shared input styling: text, number, date, password, select, textarea, checkbox, radio, range.

| Variable                            | Default                                                                                                                                                                                   | Description                   |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `--mg-input-border-color`           | `var(--mg-color-border)`                                                                                                                                                                  | Input border color.           |
| `--mg-input-background`             | `var(--mg-primary050)`                                                                                                                                                                    | Input background.             |
| `--mg-input-background-affix`       | `var(--mg-primary100)`                                                                                                                                                                    | Input background affix.       |
| `--mg-input-background-transparent` | `color-mix(in hsl, var(--mg-input-background) 60%, transparent)`                                                                                                                          | Input background transparent. |
| `--mg-input-item-color`             | `var(--mg-primary400)`                                                                                                                                                                    | Input item color.             |
| `--mg-input-item-active-color`      | `var(--mg-primary700)`                                                                                                                                                                    | Input item active color.      |
| `--mg-input-focus-color`            | `var(--mg-neutral950)`                                                                                                                                                                    | Input focus color.            |
| `--mg-input-focus-border-color`     | `var(--mg-input-focus-color)`                                                                                                                                                             | Input focus border color.     |
| `--mg-input-color-shadow`           | `var(--mg-neutral050)`                                                                                                                                                                    | Input color shadow.           |
| `--mg-input-checked-color`          | `var(--mg-primary500)`                                                                                                                                                                    | Input checked color.          |
| `--mg-input-textarea-min-height`    | `2.0625rem; /* 33px */ --mg-input-textarea-max-height: 31.25rem; /* 500px */ --mg-input-textarea-limit-size: 1rem; /* 16px */ --mg-input-textarea-limit-background: var(--mg-neutral400)` | Input textarea min height.    |
| `--mg-input-textarea-limit-color`   | `var(--mg-primary600)`                                                                                                                                                                    | Input textarea limit color.   |
| `--mg-input-textarea-limit-border`  | `1px solid var(--mg-neutral400)`                                                                                                                                                          | Input textarea limit border.  |
| `--mg-input-error-color`            | `var(--mg-alert700)`                                                                                                                                                                      | Input error color.            |
| `--mg-input-border-radius`          | `3px`                                                                                                                                                                                     | Input border radius.          |
| `--mg-input-border-width`           | `1px`                                                                                                                                                                                     | Input border width.           |
| `--mg-input-padding`                | `var(--mg-space-2xs) var(--mg-space-3xs)`                                                                                                                                                 | Input padding.                |
| `--mg-input-font-size`              | `1rem; /* 16px */ --mg-input-line-height: 1.3125rem; /* 21px */ --mg-input-mark-top: -2px`                                                                                                | Input font size.              |
| `--mg-input-placeholder-color`      | `var(--mg-color-on-surface-muted)`                                                                                                                                                        | Input placeholder color.      |
| `--mg-input-picker-icon-color`      | `var(--mg-neutral800)`                                                                                                                                                                    | Input picker icon color.      |

## item content-box

Content-box and tile layouts.

| Variable                           | Default                | Description                  |
| ---------------------------------- | ---------------------- | ---------------------------- |
| `--mg-content-title-text-color`    | `var(--mg-neutral990)` | Content title text color.    |
| `--mg-content-box-border`          | `var(--mg-neutral300)` | Content box border.          |
| `--mg-content-box-background`      | `var(--mg-neutral200)` | Content box background.      |
| `--mg-content-box-color`           | `var(--mg-neutral100)` | Content box color.           |
| `--mg-content-box-text-background` | `#000000bf`            | Content box text background. |
| `--mg-content-box-over-text`       | `#fff`                 | Content box over text.       |
| `--mg-tile-add-file-background`    | `var(--mg-neutral200)` | Tile add file background.    |
| `--mg-tile-add-file-color`         | `var(--mg-neutral700)` | Tile add file color.         |
| `--mg-tile-info-text-color`        | `#fff`                 | Tile info text color.        |
| `--mg-tile-info-border-color`      | `#fff`                 | Tile info border color.      |
| `--mg-tile-info-border-color2`     | `#000`                 | Tile info border color2.     |
| `--mg-tile-info-background`        | `#fff5`                | Tile info background.        |

## color-picker

Color picker (`color-picker`), including the HSL gradient zone and the palette grid.

| Variable                                                | Default                                                                                            | Description                                       |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `--mg-color-picker-embedded-background`                 | `var(--mg-color-surface-raised)`                                                                   | Color picker embedded background.                 |
| `--mg-color-picker-embedded-shadow-color`               | `#0005`                                                                                            | Color picker embedded shadow color.               |
| `--mg-color-picker-color-view-border`                   | `1px solid var(--mg-neutral990)`                                                                   | Color picker color view border.                   |
| `--mg-color-picker-color-view-background`               | `var(--mg-background)`                                                                             | Color picker color view background.               |
| `--mg-color-picker-color-cursor-zone-outline`           | `1px solid var(--mg-neutral990)`                                                                   | Color picker color cursor zone outline.           |
| `--mg-color-picker-color-cursor-zone-offset`            | `-3px`                                                                                             | Color picker color cursor zone offset.            |
| `--mg-color-picker-color-range-track-border`            | `1px solid var(--mg-neutral990)`                                                                   | Color picker color range track border.            |
| `--mg-color-picker-color-range-thumb-border`            | `1px solid var(--mg-neutral990)`                                                                   | Color picker color range thumb border.            |
| `--mg-color-picker-color-palette-item-by-line`          | `9`                                                                                                | Color picker color palette item by line.          |
| `--mg-color-picker-color-palette-item-height`           | `1.875rem; /* 30px */ --mg-color-picker-color-palette-item-border: 1px solid var(--mg-neutral990)` | Color picker color palette item height.           |
| `--mg-color-picker-color-palette-item-border-hover`     | `1px solid var(--mg-neutral500)`                                                                   | Color picker color palette item border hover.     |
| `--mg-color-picker-color-palette-item-outline-selected` | `3px solid #040404`                                                                                | Color picker color palette item outline selected. |
| `--mg-color-picker-color-palette-item-outline-offset`   | `-1px`                                                                                             | Color picker color palette item outline offset.   |

## datetime-picker

Date and time picker (`datetime-picker`).

| Variable                                              | Default                          | Description                                     |
| ----------------------------------------------------- | -------------------------------- | ----------------------------------------------- |
| `--mg-datetime-picker-embedded-background`            | `var(--mg-color-surface-raised)` | Datetime picker embedded background.            |
| `--mg-datetime-picker-embedded-shadow-color`          | `#0005`                          | Datetime picker embedded shadow color.          |
| `--mg-datetime-picker-head-background`                | `var(--mg-neutral100)`           | Datetime picker head background.                |
| `--mg-datetime-picker-day-color`                      | `var(--mg-neutral500)`           | Datetime picker day color.                      |
| `--mg-datetime-picker-day-background`                 | `var(--mg-neutral100)`           | Datetime picker day background.                 |
| `--mg-datetime-picker-day-current-month-background`   | `var(--mg-neutral200)`           | Datetime picker day current month background.   |
| `--mg-datetime-picker-day-current-month-color`        | `var(--mg-neutral800)`           | Datetime picker day current month color.        |
| `--mg-datetime-picker-day-weekend-current-month-text` | `var(--mg-primary600)`           | Datetime picker day weekend current month text. |
| `--mg-datetime-picker-day-today-background`           | `var(--mg-neutral300)`           | Datetime picker day today background.           |
| `--mg-datetime-picker-day-today-text`                 | `var(--mg-primary700)`           | Datetime picker day today text.                 |
| `--mg-datetime-picker-day-selected-background`        | `var(--mg-primary500)`           | Datetime picker day selected background.        |
| `--mg-datetime-picker-day-selected-color`             | `var(--mg-neutral000)`           | Datetime picker day selected color.             |
| `--mg-datetime-picker-day-selectable-background`      | `var(--mg-primary400)`           | Datetime picker day selectable background.      |
| `--mg-datetime-picker-day-selectable-color`           | `var(--mg-neutral950)`           | Datetime picker day selectable color.           |
| `--mg-datetime-picker-day-disabled-background`        | `transparent`                    | Datetime picker day disabled background.        |

## tabs

Tab list and panels (`mg-tabs`, `mg-tab-title`, `mg-tab-content`).

| Variable                       | Default                            | Description              |
| ------------------------------ | ---------------------------------- | ------------------------ |
| `--mg-tabs-line-color`         | `var(--mg-neutral400)`             | Tabs line color.         |
| `--mg-tab-border-color`        | `var(--mg-neutral400)`             | Tab border color.        |
| `--mg-tab-text-color`          | `var(--mg-color-on-surface-muted)` | Tab text color.          |
| `--mg-tab-select-border-color` | `var(--mg-neutral600)`             | Tab select border color. |
| `--mg-tab-text-border-color`   | `var(--mg-color-on-surface)`       | Tab text border color.   |
| `--mg-tab-hover-border-color`  | `var(--mg-neutral950)`             | Tab hover border color.  |

## scrollbar

Custom scrollbar appearance.

| Variable                     | Default                   | Description            |
| ---------------------------- | ------------------------- | ---------------------- |
| `--mg-scrollbar-color`       | `var(--mg-color-primary)` | Scrollbar color.       |
| `--mg-scrollbar-color-hover` | `var(--mg-primary600)`    | Scrollbar color hover. |
| `--mg-scrollbar-width`       | `thin`                    | Scrollbar width.       |

## message types

| Variable                                   | Default                | Description                          |
| ------------------------------------------ | ---------------------- | ------------------------------------ |
| `--mg-info-message-color`                  | `var(--mg-neutral900)` | Info message color.                  |
| `--mg-info-message-border-color`           | `var(--mg-neutral700)` | Info message border color.           |
| `--mg-info-message-background`             | `var(--mg-neutral200)` | Info message background.             |
| `--mg-info-message-box-shadow-color`       | `var(--mg-neutral000)` | Info message box shadow color.       |
| `--mg-info-message-progress-background`    | `var(--mg-neutral900)` | Info message progress background.    |
| `--mg-success-message-color`               | `var(--mg-success900)` | Success message color.               |
| `--mg-success-message-border-color`        | `var(--mg-success500)` | Success message border color.        |
| `--mg-success-message-background`          | `var(--mg-success200)` | Success message background.          |
| `--mg-success-message-box-shadow-color`    | `var(--mg-neutral000)` | Success message box shadow color.    |
| `--mg-success-message-progress-background` | `var(--mg-success500)` | Success message progress background. |
| `--mg-warn-message-color`                  | `var(--mg-warn900)`    | Warn message color.                  |
| `--mg-warn-message-border-color`           | `var(--mg-warn500)`    | Warn message border color.           |
| `--mg-warn-message-background`             | `var(--mg-warn200)`    | Warn message background.             |
| `--mg-warn-message-box-shadow-color`       | `var(--mg-neutral000)` | Warn message box shadow color.       |
| `--mg-warn-message-progress-background`    | `var(--mg-warn500)`    | Warn message progress background.    |
| `--mg-error-message-color`                 | `var(--mg-alert900)`   | Error message color.                 |
| `--mg-error-message-border-color`          | `var(--mg-alert500)`   | Error message border color.          |
| `--mg-error-message-background`            | `var(--mg-alert200)`   | Error message background.            |
| `--mg-error-message-box-shadow-color`      | `var(--mg-neutral000)` | Error message box shadow color.      |
| `--mg-error-message-progress-background`   | `var(--mg-alert500)`   | Error message progress background.   |
| `--mg-tip-message-color`                   | `var(--mg-primary900)` | Tip message color.                   |
| `--mg-tip-message-border-color`            | `var(--mg-primary500)` | Tip message border color.            |
| `--mg-tip-message-background`              | `var(--mg-primary200)` | Tip message background.              |
| `--mg-tip-message-box-shadow-color`        | `var(--mg-neutral000)` | Tip message box shadow color.        |
| `--mg-tip-message-progress-background`     | `var(--mg-primary500)` | Tip message progress background.     |

## message inline

| Variable                    | Default                             | Description           |
| --------------------------- | ----------------------------------- | --------------------- |
| `--mg-message-color`        | `var(--mg-primary950)`              | Message color.        |
| `--mg-message-border-color` | `var(--mg-primary500)`              | Message border color. |
| `--mg-message-background`   | `var(--mg-primary050)`              | Message background.   |
| `--mg-message-border-width` | `1px`                               | Message border width. |
| `--mg-message-border-style` | `solid`                             | Message border style. |
| `--mg-message-radius`       | `3px`                               | Message radius.       |
| `--mg-message-shadow`       | `0 0 12px 2px var(--mg-neutral200)` | Message shadow.       |
| `--mg-message-margin`       | `var(--mg-space-lg)`                | Message margin.       |
| `--mg-message-gap`          | `var(--mg-space-lg)`                | Message gap.          |
| `--mg-message-marquee-size` | `var(--mg-space-2xl)`               | Message marquee size. |

## message floating

| Variable                                    | Default                                                                             | Description                           |
| ------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------- |
| `--mg-floating-message-border-color`        | `var(--mg-info-message-border-color)`                                               | Floating message border color.        |
| `--mg-floating-message-border-width`        | `1px`                                                                               | Floating message border width.        |
| `--mg-floating-message-background`          | `var(--mg-info-message-background)`                                                 | Floating message background.          |
| `--mg-floating-message-box-shadow-color`    | `var(--mg-info-message-box-shadow-color)`                                           | Floating message box shadow color.    |
| `--mg-floating-message-progress-background` | `var(--mg-info-message-progress-background)`                                        | Floating message progress background. |
| `--mg-info-message-offset-block`            | `0px`                                                                               | Info message offset block.            |
| `--mg-info-message-offset-inline`           | `0px`                                                                               | Info message offset inline.           |
| `--mg-info-message-progress-time-default`   | `3s`                                                                                | Info message progress time default.   |
| `--mg-info-message-max-width`               | `18.75rem; /* 300px */ /* MARK: grid */ --mg-grid-cell-padding: var(--mg-space-xs)` | Info message max width.               |

## block

Block component (`mg-block`) and its variants.

| Variable                | Default                             | Description       |
| ----------------------- | ----------------------------------- | ----------------- |
| `--mg-block-radius`     | `3px`                               | Block radius.     |
| `--mg-block-border`     | `1px solid var(--mg-primary500)`    | Block border.     |
| `--mg-block-shadow`     | `0 0 24px 2px var(--mg-primary200)` | Block shadow.     |
| `--mg-block-margin`     | `var(--mg-space-lg)`                | Block margin.     |
| `--mg-block-background` | `var(--mg-color-surface)`           | Block background. |

## card

| Variable                  | Default                                          | Description         |
| ------------------------- | ------------------------------------------------ | ------------------- |
| `--mg-card-shadow`        | `var(--mg-block-shadow)`                         | Card shadow.        |
| `--mg-card-border`        | `var(--mg-block-border)`                         | Card border.        |
| `--mg-card-radius`        | `var(--mg-block-radius)`                         | Card radius.        |
| `--mg-card-background`    | `var(--mg-block-background)`                     | Card background.    |
| `--mg-card-padding`       | `var(--mg-space-xl)`                             | Card padding.       |
| `--mg-card-ratio`         | `1 / 3`                                          | Card ratio.         |
| `--mg-card-img-height`    | `6.25rem; /* 100px */ --mg-card-zoom-scale: 1.1` | Card img height.    |
| `--mg-card-zoom-duration` | `0.3s`                                           | Card zoom duration. |

## table

Table component (`table[mg]`).

| Variable                             | Default                          | Description                    |
| ------------------------------------ | -------------------------------- | ------------------------------ |
| `--mg-table-header-background`       | `var(--mg-color-surface-sunken)` | Table header background.       |
| `--mg-table-header-background-hover` | `var(--mg-neutral200)`           | Table header background hover. |
| `--mg-table-header-sortable-cell`    | `var(--mg-neutral300)`           | Table header sortable cell.    |
| `--mg-table-line-hover-background`   | `var(--mg-neutral300)`           | Table line hover background.   |
| `--mg-table-selected-text`           | `var(--mg-alert800)`             | Table selected text.           |

## tooltip

Tooltip directive (`[mgTooltip]`).

| Variable                    | Default                          | Description           |
| --------------------------- | -------------------------------- | --------------------- |
| `--mg-tooltip-text-color`   | `var(--mg-color-on-surface)`     | Tooltip text color.   |
| `--mg-tooltip-background`   | `var(--mg-color-surface-raised)` | Tooltip background.   |
| `--mg-tooltip-shadow-color` | `var(--mg-neutral000)`           | Tooltip shadow color. |
| `--mg-tooltip-border-color` | `var(--mg-color-border)`         | Tooltip border color. |
| `--mg-tooltip-cursor`       | `help`                           | Tooltip cursor.       |

## badge

| Variable                            | Default                                  | Description                   |
| ----------------------------------- | ---------------------------------------- | ----------------------------- |
| `--mg-badge-radius`                 | `12px`                                   | Badge radius.                 |
| `--mg-badge-padding`                | `var(--mg-space-3xs) var(--mg-space-md)` | Badge padding.                |
| `--mg-badge-small-font-size`        | `var(--mg-font-very-small)`              | Badge small font size.        |
| `--mg-badge-small-padding`          | `1px var(--mg-space-xs)`                 | Badge small padding.          |
| `--mg-badge-large-font-size`        | `var(--mg-font-small)`                   | Badge large font size.        |
| `--mg-badge-large-padding`          | `var(--mg-space-3xs) var(--mg-space-md)` | Badge large padding.          |
| `--mg-badge-font-size-small`        | `var(--mg-font-very-small)`              | Badge font size small.        |
| `--mg-badge-neutral-background`     | `var(--mg-neutral300)`                   | Badge neutral background.     |
| `--mg-badge-neutral-color`          | `contrast-color(var(--mg-neutral300))`   | Badge neutral color.          |
| `--mg-badge-primary-background`     | `var(--mg-primary500)`                   | Badge primary background.     |
| `--mg-badge-primary-color`          | `contrast-color(var(--mg-primary500))`   | Badge primary color.          |
| `--mg-badge-success-background`     | `var(--mg-success500)`                   | Badge success background.     |
| `--mg-badge-success-color`          | `contrast-color(var(--mg-success500))`   | Badge success color.          |
| `--mg-badge-warning-background`     | `var(--mg-warn500)`                      | Badge warning background.     |
| `--mg-badge-warning-color`          | `contrast-color(var(--mg-warn500))`      | Badge warning color.          |
| `--mg-badge-alert-background`       | `var(--mg-alert500)`                     | Badge alert background.       |
| `--mg-badge-alert-color`            | `contrast-color(var(--mg-alert500))`     | Badge alert color.            |
| `--mg-badge-info-background`        | `var(--mg-primary200)`                   | Badge info background.        |
| `--mg-badge-info-color`             | `contrast-color(var(--mg-primary200))`   | Badge info color.             |
| `--mg-badge-background-label-dark`  | `black 50%`                              | Badge background label dark.  |
| `--mg-badge-background-label-light` | `white 50%`                              | Badge background label light. |

## page

Page-level layout helpers.

| Variable                            | Default                | Description                   |
| ----------------------------------- | ---------------------- | ----------------------------- |
| `--mg-page-item-text-color`         | `var(--mg-neutral900)` | Page item text color.         |
| `--mg-page-item-border-color`       | `var(--mg-neutral500)` | Page item border color.       |
| `--mg-page-item-current-test-color` | `var(--mg-primary700)` | Page item current test color. |
| `--mg-page-item-current-background` | `var(--mg-primary200)` | Page item current background. |
| `--mg-page-item-hover-background`   | `var(--mg-neutral300)` | Page item hover background.   |

## expansion-panel

| Variable                          | Default                                                              | Description                 |
| --------------------------------- | -------------------------------------------------------------------- | --------------------------- |
| `--mg-expansion-panel-padding`    | `var(--mg-space-2xs)`                                                | Expansion panel padding.    |
| `--mg-expansion-panel-arrow-size` | `1.25rem; /* 20px */ --mg-expansion-panel-transition-duration: 0.5s` | Expansion panel arrow size. |

## walkthrough

Walkthrough / product tour (`mg-walkthrough`).

| Variable                    | Default              | Description           |
| --------------------------- | -------------------- | --------------------- |
| `--mg-walkthrough-backdrop` | `rgba(0, 0, 0, 0.7)` | Walkthrough backdrop. |

## click-enter

Click-enter directive (`[clickEnter]`) focus and hover feedback.

| Variable                                  | Default                          | Description                         |
| ----------------------------------------- | -------------------------------- | ----------------------------------- |
| `--mg-click-enter-hover-background`       | `var(--mg-color-surface-raised)` | Click enter hover background.       |
| `--mg-click-enter-hover-cursor`           | `pointer`                        | Click enter hover cursor.           |
| `--mg-click-enter-hover-filter`           | `brightness(0.8)`                | Click enter hover filter.           |
| `--mg-click-enter-block-hover-background` | `var(--mg-neutral200)`           | Click enter block hover background. |

## spinner

Spinner component (`mg-spinner`).

| Variable             | Default                   | Description    |
| -------------------- | ------------------------- | -------------- |
| `--mg-spinner-color` | `var(--mg-color-primary)` | Spinner color. |

## card-3d

| Variable                        | Default                                                                                                                                                                                               | Description               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `--mg-card3d-foil-colors`       | `hsl(0, 100%, 60%) 0%, hsl(55, 100%, 58%) 14%, hsl(110, 100%, 52%) 28%, hsl(170, 100%, 52%) 42%, hsl(225, 100%, 62%) 57%, hsl(275, 100%, 62%) 71%, hsl(315, 100%, 62%) 85%, hsl(360, 100%, 60%) 100%` | Card3d foil colors.       |
| `--mg-card3d-foil-texture`      | `repeating-linear-gradient( 45deg, hsla(0, 0%, 100%, 0.25) 0px, hsla(0, 0%, 100%, 0) 2px, hsla(0, 0%, 100%, 0) 4px, hsla(0, 0%, 100%, 0.25) 6px )`                                                    | Card3d foil texture.      |
| `--mg-card3d-foil-texture-size` | `12px 12px`                                                                                                                                                                                           | Card3d foil texture size. |
| `--mg-card3d-glare-opacity`     | `1`                                                                                                                                                                                                   | Card3d glare opacity.     |
| `--mg-card3d-foil-opacity`      | `0.85`                                                                                                                                                                                                | Card3d foil opacity.      |
| `--mg-card3d-sheen-opacity`     | `0.9`                                                                                                                                                                                                 | Card3d sheen opacity.     |
| `--mg-card3d-glare-blend`       | `color-dodge`                                                                                                                                                                                         | Card3d glare blend.       |
| `--mg-card3d-foil-blend`        | `color-dodge`                                                                                                                                                                                         | Card3d foil blend.        |
| `--mg-card3d-sheen-blend`       | `overlay`                                                                                                                                                                                             | Card3d sheen blend.       |
| `--mg-card3d-pointer-x`         | `50%`                                                                                                                                                                                                 | Card3d pointer x.         |
| `--mg-card3d-pointer-y`         | `50%`                                                                                                                                                                                                 | Card3d pointer y.         |
| `--mg-card3d-bg-x`              | `50%`                                                                                                                                                                                                 | Card3d bg x.              |
| `--mg-card3d-bg-y`              | `50%`                                                                                                                                                                                                 | Card3d bg y.              |
| `--mg-card3d-intensity`         | `0`                                                                                                                                                                                                   | Card3d intensity.         |
| `--mg-card3d-sheen-angle`       | `90deg`                                                                                                                                                                                               | Card3d sheen angle.       |
| `--mg-card3d-sheen-pos`         | `50%`                                                                                                                                                                                                 | Card3d sheen pos.         |
| `--mg-card3d-sheen-width`       | `30%`                                                                                                                                                                                                 | Card3d sheen width.       |
| `--mg-card3d-sheen-intensity`   | `0`                                                                                                                                                                                                   | Card3d sheen intensity.   |
| `--mg-card3d-mask`              | `none`                                                                                                                                                                                                | Card3d mask.              |
| `--mg-card3d-mask-size`         | `100% 100%`                                                                                                                                                                                           | Card3d mask size.         |
| `--mg-card3d-mask-position`     | `center`                                                                                                                                                                                              | Card3d mask position.     |
| `--mg-card3d-mask-repeat`       | `no-repeat`                                                                                                                                                                                           | Card3d mask repeat.       |
| `--mg-card3d-mask-mode`         | `alpha`                                                                                                                                                                                               | Card3d mask mode.         |

## loader

Loader component (`mg-loader`) and its progress bar.

| Variable                              | Default                                                    | Description                     |
| ------------------------------------- | ---------------------------------------------------------- | ------------------------------- |
| `--mg-loader-background`              | `color-mix(in hsl, var(--mg-neutral050) 23%, transparent)` | Loader background.              |
| `--mg-loader-text-color`              | `var(--mg-color-on-surface)`                               | Loader text color.              |
| `--mg-loader-text-shadow-color`       | `var(--mg-neutral000)`                                     | Loader text shadow color.       |
| `--mg-loader-progress-background`     | `#0b0b0b80`                                                | Loader progress background.     |
| `--mg-loader-progress-bar-background` | `#fff`                                                     | Loader progress bar background. |

## loader-tile (base)

Loader tile skeleton (`mg-loader-tile`, `mg-loader-block`).

| Variable                  | Default                | Description         |
| ------------------------- | ---------------------- | ------------------- |
| `--mg-loading-item-color` | `var(--mg-primary200)` | Loading item color. |

## contrib-calendar

Contribution calendar (`mg-contrib-calendar`).

| Variable                                | Default                                                                                                                                  | Description                       |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `--mg-contrib-calendar-day-font-size`   | `0.75rem; /* 12px */ --mg-contrib-calendar-day-background: var(--mg-color-surface-raised)`                                               | Contrib calendar day font size.   |
| `--mg-contrib-calendar-month-font-size` | `0.75rem; /* 12px */ --mg-contrib-calendar-tile-size: 0.9375rem; /* 15px */ --mg-contrib-calendar-tile-color-even: var(--mg-neutral100)` | Contrib calendar month font size. |
| `--mg-contrib-calendar-tile-color-odd`  | `var(--mg-neutral200)`                                                                                                                   | Contrib calendar tile color odd.  |
| `--mg-contrib-calendar-tile-color-lvl1` | `var(--mg-success300)`                                                                                                                   | Contrib calendar tile color lvl1. |
| `--mg-contrib-calendar-tile-color-lvl2` | `var(--mg-success400)`                                                                                                                   | Contrib calendar tile color lvl2. |
| `--mg-contrib-calendar-tile-color-lvl3` | `var(--mg-success500)`                                                                                                                   | Contrib calendar tile color lvl3. |
| `--mg-contrib-calendar-tile-color-lvl4` | `var(--mg-success600)`                                                                                                                   | Contrib calendar tile color lvl4. |

## avatar

| Variable                       | Default                                                                                                                                                                                                 | Description              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `--mg-avatar-radius`           | `50%`                                                                                                                                                                                                   | Avatar radius.           |
| `--mg-avatar-color`            | `var(--mg-primary950)`                                                                                                                                                                                  | Avatar color.            |
| `--mg-avatar-size-small`       | `1.75rem; /* 28px */ --mg-avatar-size-medium: 2.5rem; /* 40px */ --mg-avatar-size-large: 3.5rem; /* 56px */ --mg-avatar-size-extra: 5rem; /* 80px */ --mg-avatar-font-size-small: var(--mg-font-small)` | Avatar size small.       |
| `--mg-avatar-font-size-medium` | `var(--mg-font-medium)`                                                                                                                                                                                 | Avatar font size medium. |
| `--mg-avatar-font-size-large`  | `var(--mg-font-large)`                                                                                                                                                                                  | Avatar font size large.  |
| `--mg-avatar-font-size-extra`  | `var(--mg-font-extra)`                                                                                                                                                                                  | Avatar font size extra.  |

## window

| Variable                               | Default                                                                                                                      | Description                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `--mg-window-min-width`                | `9.375rem; /* 150px */ --mg-window-min-height: 9.375rem; /* 150px */ --mg-window-background: var(--mg-color-surface-raised)` | Window min width.                |
| `--mg-window-shadow-color`             | `var(--mg-dialog-shadow-color)`                                                                                              | Window shadow color.             |
| `--mg-window-content-border`           | `none`                                                                                                                       | Window content border.           |
| `--mg-window-content-border-color`     | `transparent`                                                                                                                | Window content border color.     |
| `--mg-window-bar-padding`              | `0 0 0 var(--mg-space-2xs)`                                                                                                  | Window bar padding.              |
| `--mg-window-bar-height`               | `auto`                                                                                                                       | Window bar height.               |
| `--mg-window-bar-color`                | `inherit`                                                                                                                    | Window bar color.                |
| `--mg-window-bar-font-weight`          | `normal`                                                                                                                     | Window bar font weight.          |
| `--mg-window-bar-button-background`    | `var(--mg-neutral400)`                                                                                                       | Window bar button background.    |
| `--mg-window-bar-button-border`        | `none`                                                                                                                       | Window bar button border.        |
| `--mg-window-bar-button-border-color`  | `transparent`                                                                                                                | Window bar button border color.  |
| `--mg-window-bar-button-box-shadow`    | `none`                                                                                                                       | Window bar button box shadow.    |
| `--mg-window-bar-button-focus-outline` | `2px solid var(--mg-neutral900)`                                                                                             | Window bar button focus outline. |
| `--mg-window-bar-button-focus-offset`  | `1px`                                                                                                                        | Window bar button focus offset.  |
| `--mg-window-bar-button-size`          | `1.5rem; /* 24px */ --mg-window-bar-button-gap: var(--mg-space-3xs)`                                                         | Window bar button size.          |
| `--mg-window-bar-button-color`         | `var(--mg-neutral950)`                                                                                                       | Window bar button color.         |
| `--mg-window-bar-button-padding`       | `var(--mg-space-3xs)`                                                                                                        | Window bar button padding.       |
| `--mg-window-bar-background`           | `var(--mg-neutral300)`                                                                                                       | Window bar background.           |
| `--mg-window-bar-background-active`    | `var(--mg-neutral400)`                                                                                                       | Window bar background active.    |

## tag-list

| Variable                            | Default                                                        | Description                   |
| ----------------------------------- | -------------------------------------------------------------- | ----------------------------- |
| `--mg-tag-list-gap`                 | `var(--mg-space-xs)`                                           | Tag list gap.                 |
| `--mg-tag-item-radius`              | `15px`                                                         | Tag item radius.              |
| `--mg-tag-item-background`          | `var(--mg-primary100)`                                         | Tag item background.          |
| `--mg-tag-item-padding`             | `var(--mg-space-3xs) 0 var(--mg-space-3xs) var(--mg-space-md)` | Tag item padding.             |
| `--mg-tag-item-min-height`          | `1.625rem; /* 26px */ --mg-tag-item-color: inherit`            | Tag item min height.          |
| `--mg-tag-item-font-size`           | `inherit`                                                      | Tag item font size.           |
| `--mg-tag-item-hover-background`    | `var(--mg-primary050)`                                         | Tag item hover background.    |
| `--mg-tag-item-remove-color`        | `currentColor`                                                 | Tag item remove color.        |
| `--mg-tag-item-remove-color-hover`  | `var(--mg-alert500)`                                           | Tag item remove color hover.  |
| `--mg-tag-input-border-color`       | `var(--mg-primary100)`                                         | Tag input border color.       |
| `--mg-tag-input-background`         | `transparent`                                                  | Tag input background.         |
| `--mg-tag-input-focus-border-color` | `var(--mg-primary300)`                                         | Tag input focus border color. |

## status

| Variable                        | Default                                                     | Description               |
| ------------------------------- | ----------------------------------------------------------- | ------------------------- |
| `--mg-status-gap`               | `var(--mg-space-xs)`                                        | Status gap.               |
| `--mg-status-font-size`         | `0.85em`                                                    | Status font size.         |
| `--mg-status-dot-size`          | `0.5rem; /* 8px */ --mg-status-color: var(--mg-text-color)` | Status dot size.          |
| `--mg-status-dot-color`         | `currentColor`                                              | Status dot color.         |
| `--mg-status-success-dot-color` | `hsl(var(--mg-successH, 120) 60% 40%)`                      | Status success dot color. |
| `--mg-status-success-color`     | `hsl(var(--mg-successH, 120) 60% 30%)`                      | Status success color.     |
| `--mg-status-warning-dot-color` | `hsl(var(--mg-warnH, 15) 80% 50%)`                          | Status warning dot color. |
| `--mg-status-warning-color`     | `hsl(var(--mg-warnH, 15) 80% 35%)`                          | Status warning color.     |
| `--mg-status-danger-dot-color`  | `hsl(var(--mg-alertH, 0) 70% 50%)`                          | Status danger dot color.  |
| `--mg-status-danger-color`      | `hsl(var(--mg-alertH, 0) 70% 40%)`                          | Status danger color.      |
| `--mg-status-info-dot-color`    | `hsl(var(--mg-primaryH, 200) 60% 45%)`                      | Status info dot color.    |
| `--mg-status-info-color`        | `hsl(var(--mg-primaryH, 200) 60% 35%)`                      | Status info color.        |
| `--mg-status-neutral-dot-color` | `hsl(var(--mg-neutralH, 0) var(--mg-neutralS, 0%) 50%)`     | Status neutral dot color. |
| `--mg-status-neutral-color`     | `var(--mg-text-color)`                                      | Status neutral color.     |
| `--mg-status-offline-dot-color` | `hsl(var(--mg-neutralH, 0) var(--mg-neutralS, 0%) 65%)`     | Status offline dot color. |
| `--mg-status-offline-color`     | `hsl(var(--mg-neutralH, 0) var(--mg-neutralS, 0%) 50%)`     | Status offline color.     |
| `--mg-status-pulse-duration`    | `2s`                                                        | Status pulse duration.    |
| `--mg-status-pulse-opacity-max` | `1`                                                         | Status pulse opacity max. |
| `--mg-status-pulse-opacity-min` | `0.4`                                                       | Status pulse opacity min. |

## light-dark

| Variable                                | Default                                                                                                                                                              | Description                       |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `--mg-light-dark-border-color`          | `var(--mg-primary950)`                                                                                                                                               | Light dark border color.          |
| `--mg-light-dark-gap`                   | `var(--mg-space-2xs)`                                                                                                                                                | Light dark gap.                   |
| `--mg-light-dark-icon-size`             | `1.25rem; /* 20px */ --mg-light-dark-toggle-width: 2.5rem; /* 40px */ --mg-light-dark-toggle-height: 1.25rem; /* 20px */ --mg-light-dark-toggle-border-radius: 20px` | Light dark icon size.             |
| `--mg-light-dark-thumb-size`            | `1rem; /* 16px */ --mg-light-dark-thumb-margin: var(--mg-space-3xs)`                                                                                                 | Light dark thumb size.            |
| `--mg-light-dark-transition-duration`   | `0.5s`                                                                                                                                                               | Light dark transition duration.   |
| `--mg-light-dark-compact-border-radius` | `20px`                                                                                                                                                               | Light dark compact border radius. |
| `--mg-light-dark-compact-padding-x`     | `var(--mg-space-3xs)`                                                                                                                                                | Light dark compact padding x.     |
| `--mg-light-dark-compact-height`        | `1.5rem; /* 24px */ --mg-light-dark-compact-icon-offset: -3rem; /* -48px */ --mg-light-dark-focus-outline-width: 3px`                                                | Light dark compact height.        |
| `--mg-light-dark-focus-outline-offset`  | `1px`                                                                                                                                                                | Light dark focus outline offset.  |

## timeline

| Variable                       | Default                                                                                                                                    | Description              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| `--mg-timeline-axis-size`      | `5rem; /* 80px */ --mg-timeline-tick-size: 3.75rem; /* 60px */ --mg-timeline-track-size: 2.5rem; /* 40px */ --mg-timeline-bar-radius: 4px` | Timeline axis size.      |
| `--mg-timeline-bar-gap`        | `var(--mg-space-3xs)`                                                                                                                      | Timeline bar gap.        |
| `--mg-timeline-axis-font-size` | `var(--mg-font-small)`                                                                                                                     | Timeline axis font size. |
| `--mg-timeline-item-font-size` | `var(--mg-font-very-small)`                                                                                                                | Timeline item font size. |
| `--mg-timeline-item-color`     | `var(--mg-primary200)`                                                                                                                     | Timeline item color.     |
| `--mg-timeline-axis-color`     | `var(--mg-color-on-surface-muted)`                                                                                                         | Timeline axis color.     |
| `--mg-timeline-grid-color`     | `var(--mg-color-border)`                                                                                                                   | Timeline grid color.     |

## select2

Styling passed through to the `ng-select2-component` dependency.

| Variable                                       | Default                                                                                     | Description                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `--select2-selection-focus-border-color`       | `var(--mg-input-focus-border-color)`                                                        | Select2 selection focus border color.       |
| `--select2-selection-text-color`               | `var(--mg-text-color)`                                                                      | Select2 selection text color.               |
| `--select2-selection-background`               | `var(--mg-input-background)`                                                                | Select2 selection background.               |
| `--select2-selection-border-color`             | `var(--mg-input-border-color)`                                                              | Select2 selection border color.             |
| `--select2-selection-disabled-background`      | `var(--mg-input-background)`                                                                | Select2 selection disabled background.      |
| `--select2-selection-disabled-border-color`    | `var(--mg-input-border-color)`                                                              | Select2 selection disabled border color.    |
| `--select2-single-height`                      | `auto`                                                                                      | Select2 single height.                      |
| `--select2-dropdown-background`                | `var(--mg-input-background)`                                                                | Select2 dropdown background.                |
| `--select2-dropdown-border-color`              | `var(--mg-input-border-color)`                                                              | Select2 dropdown border color.              |
| `--select2-option-text-color`                  | `var(--mg-text-color)`                                                                      | Select2 option text color.                  |
| `--select2-option-selected-text-color`         | `var(--mg-text-color)`                                                                      | Select2 option selected text color.         |
| `--select2-option-selected-background`         | `var(--mg-primary500)`                                                                      | Select2 option selected background.         |
| `--select2-option-highlighted-text-color`      | `var(--mg-text-color)`                                                                      | Select2 option highlighted text color.      |
| `--select2-option-highlighted-background`      | `var(--mg-primary400)`                                                                      | Select2 option highlighted background.      |
| `--select2-search-border-color`                | `var(--mg-input-border-color)`                                                              | Select2 search border color.                |
| `--select2-search-background`                  | `var(--mg-text-color)`                                                                      | Select2 search background.                  |
| `--select2-selection-line-height`              | `1.8125rem; /* 31px */ --select2-selection-readonly-background: var(--mg-input-background)` | Select2 selection line height.              |
| `--select2-selection-choice-line-height`       | `1.5625rem; /* 25px */ --select2-selection-choice-background: var(--mg-primary300)`         | Select2 selection choice line height.       |
| `--select2-selection-choice-border-color`      | `var(--mg-primary500)`                                                                      | Select2 selection choice border color.      |
| `--select2-selection-choice-text-color`        | `var(--mg-text-color)`                                                                      | Select2 selection choice text color.        |
| `--select2-selection-choice-close-color`       | `var(--mg-primary800)`                                                                      | Select2 selection choice close color.       |
| `--select2-selection-choice-hover-close-color` | `var(--mg-primary950)`                                                                      | Select2 selection choice hover close color. |
