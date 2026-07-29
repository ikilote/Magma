# CSS variables — @ikilote/magma

> Generated from `projects/ikilote/magma/src/assets/styles/css-var.css` by `npm run generate:css-doc`.
> Do not edit by hand: your changes would be overwritten.

**369 variables** across 35 sections.

## How to override

Every variable is a plain CSS custom property, so any selector with higher
specificity wins. The most common cases:

```css
/* Retint the whole library */
body {
    --primaryH: 280;
}

/* Override one component, globally */
body {
    --dialog-background: #fdfdfd;
}

/* Override one instance only */
.my-dialog {
    --dialog-background: #fdfdfd;
}
```

Light and dark values are set on `body` / `body.light-mode` and `body.dark-mode`
respectively; the remaining variables are scope-independent.

## Contents

- [palettes light](#palettes-light) · 16
- [loader-tile (light)](#loader-tile-light) · 1
- [palettes dark](#palettes-dark) · 16
- [loader-tile (dark)](#loader-tile-dark) · 1
- [palettes](#palettes) · 59
- [global](#global) · 7
- [context-menu](#context-menu) · 12
- [ellipsis-button](#ellipsis-button) · 4
- [default button](#default-button) · 17
- [primary button](#primary-button) · 12
- [warn button](#warn-button) · 12
- [link](#link) · 3
- [dialog](#dialog) · 7
- [input](#input) · 23
- [item content-box](#item-content-box) · 12
- [color-picker](#color-picker) · 14
- [datetime-picker](#datetime-picker) · 15
- [tabs](#tabs) · 6
- [scrollbar](#scrollbar) · 3
- [message types](#message-types) · 25
- [message inline](#message-inline) · 10
- [message floating](#message-floating) · 6
- [grid](#grid) · 1
- [block](#block) · 5
- [table](#table) · 5
- [tooltip](#tooltip) · 5
- [page](#page) · 5
- [walkthrough](#walkthrough) · 1
- [click-enter](#click-enter) · 4
- [spinner](#spinner) · 1
- [loader](#loader) · 5
- [loader-tile (base)](#loader-tile-base) · 1
- [contrib-calendar](#contrib-calendar) · 10
- [window](#window) · 21
- [select2](#select2) · 24

## palettes light

Lightness steps for light mode. Set on `body` / `body.light-mode`.

Scope: `body.light-mode`.

| Variable     | Default | Description                                                                                |
| ------------ | ------- | ------------------------------------------------------------------------------------------ |
| `--primaryH` | `190`   | Base hue (0-360) for the whole palette. **This is the single knob to retint the library.** |
| `--L000`     | `100%`  | L000.                                                                                      |
| `--L010`     | `95%`   | L010.                                                                                      |
| `--L025`     | `90%`   | L025.                                                                                      |
| `--L050`     | `85%`   | L050.                                                                                      |
| `--L100`     | `80%`   | L100.                                                                                      |
| `--L200`     | `70%`   | L200.                                                                                      |
| `--L300`     | `60%`   | L300.                                                                                      |
| `--L400`     | `50%`   | L400.                                                                                      |
| `--L500`     | `40%`   | L500.                                                                                      |
| `--L600`     | `30%`   | L600.                                                                                      |
| `--L700`     | `20%`   | L700.                                                                                      |
| `--L800`     | `10%`   | L800.                                                                                      |
| `--L900`     | `5%`    | L900.                                                                                      |
| `--L950`     | `2%`    | L950.                                                                                      |
| `--L990`     | `0%`    | L990.                                                                                      |

## loader-tile (light)

Loader tile skeleton (`mg-loader-tile`, `mg-loader-block`).

Scope: `body.light-mode`.

| Variable                         | Default | Description                   |
| -------------------------------- | ------- | ----------------------------- |
| `--loading-item-animation-color` | `0 0 0` | Loading item animation color. |

## palettes dark

Lightness steps for dark mode. Set on `body.dark-mode`.

Scope: `body.dark-mode`.

| Variable     | Default | Description                                                                                |
| ------------ | ------- | ------------------------------------------------------------------------------------------ |
| `--primaryH` | `210`   | Base hue (0-360) for the whole palette. **This is the single knob to retint the library.** |
| `--L000`     | `0%`    | L000.                                                                                      |
| `--L010`     | `3%`    | L010.                                                                                      |
| `--L025`     | `4%`    | L025.                                                                                      |
| `--L050`     | `5%`    | L050.                                                                                      |
| `--L100`     | `6%`    | L100.                                                                                      |
| `--L200`     | `10%`   | L200.                                                                                      |
| `--L300`     | `20%`   | L300.                                                                                      |
| `--L400`     | `35%`   | L400.                                                                                      |
| `--L500`     | `40%`   | L500.                                                                                      |
| `--L600`     | `50%`   | L600.                                                                                      |
| `--L700`     | `60%`   | L700.                                                                                      |
| `--L800`     | `70%`   | L800.                                                                                      |
| `--L900`     | `80%`   | L900.                                                                                      |
| `--L950`     | `95%`   | L950.                                                                                      |
| `--L990`     | `100%`  | L990.                                                                                      |

## loader-tile (dark)

Loader tile skeleton (`mg-loader-tile`, `mg-loader-block`).

Scope: `body.dark-mode`.

| Variable                         | Default       | Description                   |
| -------------------------------- | ------------- | ----------------------------- |
| `--loading-item-animation-color` | `255 255 255` | Loading item animation color. |

## palettes

Color palette derived from a single hue plus lightness steps. Override `--primaryH` to retint the whole library.

| Variable       | Default                                  | Description |
| -------------- | ---------------------------------------- | ----------- |
| `--primary050` | `hsl(var(--primaryH), 5%, var(--L050))`  | Primary050. |
| `--primary100` | `hsl(var(--primaryH), 15%, var(--L100))` | Primary100. |
| `--primary200` | `hsl(var(--primaryH), 15%, var(--L200))` | Primary200. |
| `--primary300` | `hsl(var(--primaryH), 15%, var(--L300))` | Primary300. |
| `--primary400` | `hsl(var(--primaryH), 15%, var(--L400))` | Primary400. |
| `--primary500` | `hsl(var(--primaryH), 15%, var(--L500))` | Primary500. |
| `--primary600` | `hsl(var(--primaryH), 15%, var(--L600))` | Primary600. |
| `--primary700` | `hsl(var(--primaryH), 15%, var(--L700))` | Primary700. |
| `--primary800` | `hsl(var(--primaryH), 15%, var(--L800))` | Primary800. |
| `--primary900` | `hsl(var(--primaryH), 15%, var(--L900))` | Primary900. |
| `--primary950` | `hsl(var(--primaryH), 5%, var(--L950))`  | Primary950. |
| `--neutral000` | `hsl(0, 0%, var(--L000))`                | Neutral000. |
| `--neutral010` | `hsl(0, 0%, var(--L010))`                | Neutral010. |
| `--neutral025` | `hsl(0, 0%, var(--L025))`                | Neutral025. |
| `--neutral050` | `hsl(0, 0%, var(--L050))`                | Neutral050. |
| `--neutral100` | `hsl(0, 0%, var(--L100))`                | Neutral100. |
| `--neutral200` | `hsl(0, 0%, var(--L200))`                | Neutral200. |
| `--neutral300` | `hsl(0, 0%, var(--L300))`                | Neutral300. |
| `--neutral400` | `hsl(0, 0%, var(--L400))`                | Neutral400. |
| `--neutral500` | `hsl(0, 0%, var(--L500))`                | Neutral500. |
| `--neutral600` | `hsl(0, 0%, var(--L600))`                | Neutral600. |
| `--neutral700` | `hsl(0, 0%, var(--L700))`                | Neutral700. |
| `--neutral800` | `hsl(0, 0%, var(--L800))`                | Neutral800. |
| `--neutral900` | `hsl(0, 0%, var(--L900))`                | Neutral900. |
| `--neutral950` | `hsl(0, 0%, var(--L950))`                | Neutral950. |
| `--neutral990` | `hsl(0, 0%, var(--L990))`                | Neutral990. |
| `--alert050`   | `hsl(0, 5%, var(--L050))`                | Alert050.   |
| `--alert100`   | `hsl(0, 15%, var(--L100))`               | Alert100.   |
| `--alert200`   | `hsl(0, 25%, var(--L200))`               | Alert200.   |
| `--alert300`   | `hsl(0, 45%, var(--L300))`               | Alert300.   |
| `--alert400`   | `hsl(0, 55%, var(--L400))`               | Alert400.   |
| `--alert500`   | `hsl(0, 75%, var(--L500))`               | Alert500.   |
| `--alert600`   | `hsl(0, 65%, var(--L600))`               | Alert600.   |
| `--alert700`   | `hsl(0, 55%, var(--L700))`               | Alert700.   |
| `--alert800`   | `hsl(0, 45%, var(--L800))`               | Alert800.   |
| `--alert900`   | `hsl(0, 25%, var(--L900))`               | Alert900.   |
| `--alert950`   | `hsl(0, 5%, var(--L950))`                | Alert950.   |
| `--warn050`    | `hsl(15, 5%, var(--L050))`               | Warn050.    |
| `--warn100`    | `hsl(15, 15%, var(--L100))`              | Warn100.    |
| `--warn200`    | `hsl(15, 25%, var(--L200))`              | Warn200.    |
| `--warn300`    | `hsl(15, 45%, var(--L300))`              | Warn300.    |
| `--warn400`    | `hsl(15, 55%, var(--L400))`              | Warn400.    |
| `--warn500`    | `hsl(15, 75%, var(--L500))`              | Warn500.    |
| `--warn600`    | `hsl(15, 65%, var(--L600))`              | Warn600.    |
| `--warn700`    | `hsl(15, 55%, var(--L700))`              | Warn700.    |
| `--warn800`    | `hsl(15, 45%, var(--L800))`              | Warn800.    |
| `--warn900`    | `hsl(15, 25%, var(--L900))`              | Warn900.    |
| `--warn950`    | `hsl(15, 5%, var(--L950))`               | Warn950.    |
| `--success050` | `hsl(120, 5%, var(--L050))`              | Success050. |
| `--success100` | `hsl(120, 15%, var(--L100))`             | Success100. |
| `--success200` | `hsl(120, 25%, var(--L200))`             | Success200. |
| `--success300` | `hsl(120, 45%, var(--L300))`             | Success300. |
| `--success400` | `hsl(120, 55%, var(--L400))`             | Success400. |
| `--success500` | `hsl(120, 55%, var(--L500))`             | Success500. |
| `--success600` | `hsl(120, 65%, var(--L600))`             | Success600. |
| `--success700` | `hsl(120, 55%, var(--L700))`             | Success700. |
| `--success800` | `hsl(120, 45%, var(--L800))`             | Success800. |
| `--success900` | `hsl(120, 25%, var(--L900))`             | Success900. |
| `--success950` | `hsl(120, 5%, var(--L950))`              | Success950. |

## global

Cross-component values.

| Variable                      | Default                                                                                                             | Description                                                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--transparency-checkerboard` | `conic-gradient( #ccc 0.25turn, #aaa 0.25turn 0.5turn, #ccc 0.5turn 0.75turn, #aaa 0.75turn )`                      | Conventional grey checkerboard signalling an alpha channel. Deliberately outside the palette: retinting it would break the "this is transparent" convention. Tile size is set at the usage site. |
| `--background`                | `var(--neutral010)`                                                                                                 | Background.                                                                                                                                                                                      |
| `--text-color`                | `var(--primary950)`                                                                                                 | Text color.                                                                                                                                                                                      |
| `--color-mode-border-color`   | `var(--primary950)`                                                                                                 | Color mode border color.                                                                                                                                                                         |
| `--font-family`               | `'Roboto', 'Segoe UI', Geneva, Verdana, sans-serif`                                                                 | Font family.                                                                                                                                                                                     |
| `--font-mono`                 | `'Roboto Mono', 'FreeMono', 'Liberation Mono', 'Ubuntu Mono', 'Courier New', 'Droid Sans Mono', Courier, monospace` | Font mono.                                                                                                                                                                                       |
| `--input-focus-color`         | `var(--neutral950)`                                                                                                 | Input focus color.                                                                                                                                                                               |

## context-menu

Context menu container and items (`context-menu`).

| Variable                               | Default               | Description                         |
| -------------------------------------- | --------------------- | ----------------------------------- |
| `--context-menu-background`            | `var(--primary200)`   | Context menu background.            |
| `--context-menu-border`                | `none`                | Context menu border.                |
| `--context-menu-border-color`          | `transparent`         | Context menu border color.          |
| `--context-menu-box-shadow`            | `2px 2px 5px #0005`   | Context menu box shadow.            |
| `--context-menu-border-radius`         | `6px`                 | Context menu border radius.         |
| `--context-menu-item-background`       | `var(--primary300)`   | Context menu item background.       |
| `--context-menu-item-background-hover` | `var(--primary400)`   | Context menu item background hover. |
| `--context-menu-item-gap`              | `10px`                | Context menu item gap.              |
| `--context-menu-item-margin`           | `2px`                 | Context menu item margin.           |
| `--context-menu-item-radius`           | `4px`                 | Context menu item radius.           |
| `--context-menu-item-padding`          | `10px 20px 10px 10px` | Context menu item padding.          |
| `--context-menu-item-shadow-color`     | `#0008`               | Context menu item shadow color.     |

## ellipsis-button

Ellipsis (kebab) button and its dropdown list (`mg-ellipsis-button`).

| Variable                           | Default             | Description                     |
| ---------------------------------- | ------------------- | ------------------------------- |
| `--ellipsis-list-shadow-color`     | `#0005`             | Ellipsis list shadow color.     |
| `--context-button-list-background` | `var(--primary200)` | Context button list background. |
| `--ellipsis-item-background`       | `var(--primary300)` | Ellipsis item background.       |
| `--ellipsis-item-hover-background` | `var(--primary400)` | Ellipsis item hover background. |

## default button

Default button variant (`button`, `.mg-button`).

| Variable                               | Default                         | Description                         |
| -------------------------------------- | ------------------------------- | ----------------------------------- |
| `--button-disabled-opacity`            | `0.25`                          | Button disabled opacity.            |
| `--button-default-border-radius`       | `5px`                           | Button default border radius.       |
| `--button-default-border-width`        | `2px`                           | Button default border width.        |
| `--button-default-padding`             | `10px`                          | Button default padding.             |
| `--button-default-margin`              | `0 5px`                         | Button default margin.              |
| `--button-default-border-color`        | `var(--neutral300)`             | Button default border color.        |
| `--button-default-background`          | `var(--neutral200)`             | Button default background.          |
| `--button-default-box-shadow`          | `0 0 1px var(--neutral500)`     | Button default box shadow.          |
| `--button-default-color`               | `var(--neutral950)`             | Button default color.               |
| `--button-default-hover-border-color`  | `var(--neutral100)`             | Button default hover border color.  |
| `--button-default-hover-background`    | `var(--neutral300)`             | Button default hover background.    |
| `--button-default-hover-box-shadow`    | `0 0 6px var(--neutral300)`     | Button default hover box shadow.    |
| `--button-default-focus-border-color`  | `var(--input-focus-color)`      | Button default focus border color.  |
| `--button-default-active-border-color` | `var(--neutral100)`             | Button default active border color. |
| `--button-default-active-background`   | `var(--neutral400)`             | Button default active background.   |
| `--button-default-active-box-shadow`   | `0 0 6px var(--neutral500)`     | Button default active box shadow.   |
| `--button-default-active-padding`      | `var(--button-default-padding)` | Button default active padding.      |

## primary button

Primary button variant.

| Variable                               | Default                         | Description                         |
| -------------------------------------- | ------------------------------- | ----------------------------------- |
| `--button-primary-border-color`        | `var(--primary300)`             | Button primary border color.        |
| `--button-primary-background`          | `var(--primary400)`             | Button primary background.          |
| `--button-primary-box-shadow`          | `0 0 1px var(--primary050)`     | Button primary box shadow.          |
| `--button-primary-color`               | `var(--primary950)`             | Button primary color.               |
| `--button-primary-hover-border-color`  | `var(--primary100)`             | Button primary hover border color.  |
| `--button-primary-hover-background`    | `var(--primary400)`             | Button primary hover background.    |
| `--button-primary-hover-box-shadow`    | `0 0 6px var(--primary300)`     | Button primary hover box shadow.    |
| `--button-primary-focus-border-color`  | `var(--input-focus-color)`      | Button primary focus border color.  |
| `--button-primary-active-border-color` | `var(--primary100)`             | Button primary active border color. |
| `--button-primary-active-background`   | `var(--primary500)`             | Button primary active background.   |
| `--button-primary-active-box-shadow`   | `0 0 6px var(--primary500)`     | Button primary active box shadow.   |
| `--button-primary-active-padding`      | `var(--button-default-padding)` | Button primary active padding.      |

## warn button

Warning / destructive button variant.

| Variable                            | Default                         | Description                      |
| ----------------------------------- | ------------------------------- | -------------------------------- |
| `--button-warn-border-color`        | `var(--alert300)`               | Button warn border color.        |
| `--button-warn-background`          | `var(--alert200)`               | Button warn background.          |
| `--button-warn-box-shadow`          | `0 0 1px var(--alert050)`       | Button warn box shadow.          |
| `--button-warn-color`               | `var(--alert950)`               | Button warn color.               |
| `--button-warn-hover-border-color`  | `var(--alert100)`               | Button warn hover border color.  |
| `--button-warn-hover-background`    | `var(--alert400)`               | Button warn hover background.    |
| `--button-warn-hover-box-shadow`    | `0 0 6px var(--alert300)`       | Button warn hover box shadow.    |
| `--button-warn-focus-border-color`  | `var(--alert500)`               | Button warn focus border color.  |
| `--button-warn-active-border-color` | `var(--alert100)`               | Button warn active border color. |
| `--button-warn-active-background`   | `var(--alert500)`               | Button warn active background.   |
| `--button-warn-active-box-shadow`   | `0 0 6px var(--alert500)`       | Button warn active box shadow.   |
| `--button-warn-active-padding`      | `var(--button-default-padding)` | Button warn active padding.      |

## link

Anchor and text-link styling.

| Variable                    | Default                    | Description              |
| --------------------------- | -------------------------- | ------------------------ |
| `--link-color`              | `var(--primary700)`        | Link color.              |
| `--link-hover-color`        | `var(--primary950)`        | Link hover color.        |
| `--link-focus-border-color` | `var(--input-focus-color)` | Link focus border color. |

## dialog

Modal dialog (`mg-dialog`).

| Variable                                 | Default                                                 | Description                           |
| ---------------------------------------- | ------------------------------------------------------- | ------------------------------------- |
| `--dialog-backdrop-background`           | `color-mix(in hsl, var(--primary050) 60%, transparent)` | Dialog backdrop background.           |
| `--dialog-backdrop-background-no-filter` | `color-mix(in hsl, var(--primary050) 70%, transparent)` | Dialog backdrop background no filter. |
| `--dialog-background`                    | `var(--neutral200)`                                     | Dialog background.                    |
| `--dialog-shadow-color`                  | `color-mix(in hsl, var(--neutral050) 30%, transparent)` | Dialog shadow color.                  |
| `--dialog-close-shadow-color`            | `var(--neutral500)`                                     | Dialog close shadow color.            |
| `--dialog-close-background`              | `var(--neutral300)`                                     | Dialog close background.              |
| `--dialog-close-background-hover`        | `var(--neutral500)`                                     | Dialog close background hover.        |

## input

Shared input styling: text, number, date, password, select, textarea, checkbox, radio, range.

| Variable                            | Default                                                       | Description                      |
| ----------------------------------- | ------------------------------------------------------------- | -------------------------------- |
| `--input-border-color`              | `var(--primary600)`                                           | Input border color.              |
| `--input-background`                | `var(--primary200)`                                           | Input background.                |
| `--input-background-affix`          | `var(--primary300)`                                           | Input background affix.          |
| `--input-background-transparent`    | `color-mix(in hsl, var(--input-background) 60%, transparent)` | Input background transparent.    |
| `--input-item-color`                | `var(--primary400)`                                           | Input item color.                |
| `--input-item-active-color`         | `var(--primary700)`                                           | Input item active color.         |
| `--input-focus-border-color`        | `var(--input-focus-color)`                                    | Input focus border color.        |
| `--input-color-shadow`              | `var(--neutral050)`                                           | Input color shadow.              |
| `--input-checked-color`             | `var(--primary500)`                                           | Input checked color.             |
| `--input-textarea-min-height`       | `33px`                                                        | Input textarea min height.       |
| `--input-textarea-max-height`       | `500px`                                                       | Input textarea max height.       |
| `--input-textarea-limit-size`       | `16px`                                                        | Input textarea limit size.       |
| `--input-textarea-limit-background` | `var(--neutral400)`                                           | Input textarea limit background. |
| `--input-textarea-limit-color`      | `var(--primary600)`                                           | Input textarea limit color.      |
| `--input-textarea-limit-border`     | `1px solid var(--neutral400)`                                 | Input textarea limit border.     |
| `--input-error-color`               | `var(--alert700)`                                             | Input error color.               |
| `--input-border-radius`             | `3px`                                                         | Input border radius.             |
| `--input-border-width`              | `1px`                                                         | Input border width.              |
| `--input-padding`                   | `5px 3px`                                                     | Input padding.                   |
| `--input-font-size`                 | `16px`                                                        | Input font size.                 |
| `--input-line-height`               | `21px`                                                        | Input line height.               |
| `--input-mark-top`                  | `-2px`                                                        | Input mark top.                  |
| `--input-placeholder-color`         | `var(--primary600)`                                           | Input placeholder color.         |

## item content-box

Content-box and tile layouts.

| Variable                        | Default             | Description                  |
| ------------------------------- | ------------------- | ---------------------------- |
| `--content-title-text-color`    | `var(--neutral990)` | Content title text color.    |
| `--content-box-border`          | `var(--neutral300)` | Content box border.          |
| `--content-box-background`      | `var(--neutral200)` | Content box background.      |
| `--content-box-color`           | `var(--neutral100)` | Content box color.           |
| `--content-box-text-background` | `#000000bf`         | Content box text background. |
| `--content-box-over-text`       | `#fff`              | Content box over text.       |
| `--tile-add-file-background`    | `var(--neutral200)` | Tile add file background.    |
| `--tile-add-file-color`         | `var(--neutral700)` | Tile add file color.         |
| `--tile-info-text-color`        | `#fff`              | Tile info text color.        |
| `--tile-info-border-color`      | `#fff`              | Tile info border color.      |
| `--tile-info-border-color2`     | `#000`              | Tile info border color2.     |
| `--tile-info-background`        | `#fff5`             | Tile info background.        |

## color-picker

Color picker (`color-picker`), including the HSL gradient zone and the palette grid.

| Variable                                             | Default                       | Description                                       |
| ---------------------------------------------------- | ----------------------------- | ------------------------------------------------- |
| `--color-picker-embedded-background`                 | `var(--neutral050)`           | Color picker embedded background.                 |
| `--color-picker-embedded-shadow-color`               | `#0005`                       | Color picker embedded shadow color.               |
| `--color-picker-color-view-border`                   | `1px solid var(--neutral990)` | Color picker color view border.                   |
| `--color-picker-color-view-background`               | `var(--background)`           | Color picker color view background.               |
| `--color-picker-color-cursor-zone-outline`           | `1px solid var(--neutral990)` | Color picker color cursor zone outline.           |
| `--color-picker-color-cursor-zone-offset`            | `-3px`                        | Color picker color cursor zone offset.            |
| `--color-picker-color-range-track-border`            | `1px solid var(--neutral990)` | Color picker color range track border.            |
| `--color-picker-color-range-thumb-border`            | `1px solid var(--neutral990)` | Color picker color range thumb border.            |
| `--color-picker-color-palette-item-by-line`          | `9`                           | Color picker color palette item by line.          |
| `--color-picker-color-palette-item-height`           | `30px`                        | Color picker color palette item height.           |
| `--color-picker-color-palette-item-border`           | `1px solid var(--neutral990)` | Color picker color palette item border.           |
| `--color-picker-color-palette-item-border-hover`     | `1px solid var(--neutral500)` | Color picker color palette item border hover.     |
| `--color-picker-color-palette-item-outline-selected` | `3px solid #040404`           | Color picker color palette item outline selected. |
| `--color-picker-color-palette-item-outline-offset`   | `-1px`                        | Color picker color palette item outline offset.   |

## datetime-picker

Date and time picker (`datetime-picker`).

| Variable                                           | Default             | Description                                     |
| -------------------------------------------------- | ------------------- | ----------------------------------------------- |
| `--datetime-picker-embedded-background`            | `var(--neutral050)` | Datetime picker embedded background.            |
| `--datetime-picker-embedded-shadow-color`          | `#0005`             | Datetime picker embedded shadow color.          |
| `--datetime-picker-head-background`                | `var(--neutral100)` | Datetime picker head background.                |
| `--datetime-picker-day-color`                      | `var(--neutral500)` | Datetime picker day color.                      |
| `--datetime-picker-day-background`                 | `var(--neutral100)` | Datetime picker day background.                 |
| `--datetime-picker-day-current-month-background`   | `var(--neutral200)` | Datetime picker day current month background.   |
| `--datetime-picker-day-current-month-color`        | `var(--neutral800)` | Datetime picker day current month color.        |
| `--datetime-picker-day-weekend-current-month-text` | `var(--primary600)` | Datetime picker day weekend current month text. |
| `--datetime-picker-day-today-background`           | `var(--neutral300)` | Datetime picker day today background.           |
| `--datetime-picker-day-today-text`                 | `var(--primary700)` | Datetime picker day today text.                 |
| `--datetime-picker-day-selected-background`        | `var(--primary500)` | Datetime picker day selected background.        |
| `--datetime-picker-day-selected-color`             | `var(--neutral000)` | Datetime picker day selected color.             |
| `--datetime-picker-day-selectable-background`      | `var(--primary400)` | Datetime picker day selectable background.      |
| `--datetime-picker-day-selectable-color`           | `var(--neutral950)` | Datetime picker day selectable color.           |
| `--datetime-picker-day-disabled-background`        | `transparent`       | Datetime picker day disabled background.        |

## tabs

Tab list and panels (`mg-tabs`, `mg-tab-title`, `mg-tab-content`).

| Variable                    | Default             | Description              |
| --------------------------- | ------------------- | ------------------------ |
| `--tabs-line-color`         | `var(--neutral400)` | Tabs line color.         |
| `--tab-border-color`        | `var(--neutral400)` | Tab border color.        |
| `--tab-text-color`          | `var(--neutral600)` | Tab text color.          |
| `--tab-select-border-color` | `var(--neutral600)` | Tab select border color. |
| `--tab-text-border-color`   | `var(--neutral950)` | Tab text border color.   |
| `--tab-hover-border-color`  | `var(--neutral950)` | Tab hover border color.  |

## scrollbar

Custom scrollbar appearance.

| Variable                  | Default             | Description            |
| ------------------------- | ------------------- | ---------------------- |
| `--scrollbar-color`       | `var(--primary400)` | Scrollbar color.       |
| `--scrollbar-color-hover` | `var(--primary600)` | Scrollbar color hover. |
| `--scrollbar-width`       | `thin`              | Scrollbar width.       |

## message types

| Variable                                | Default             | Description                          |
| --------------------------------------- | ------------------- | ------------------------------------ |
| `--info-message-color`                  | `var(--neutral900)` | Info message color.                  |
| `--info-message-border-color`           | `var(--neutral700)` | Info message border color.           |
| `--info-message-background`             | `var(--neutral200)` | Info message background.             |
| `--info-message-box-shadow-color`       | `var(--neutral000)` | Info message box shadow color.       |
| `--info-message-progress-background`    | `var(--neutral900)` | Info message progress background.    |
| `--success-message-color`               | `var(--success900)` | Success message color.               |
| `--success-message-border-color`        | `var(--success500)` | Success message border color.        |
| `--success-message-background`          | `var(--success200)` | Success message background.          |
| `--success-message-box-shadow-color`    | `var(--neutral000)` | Success message box shadow color.    |
| `--success-message-progress-background` | `var(--success500)` | Success message progress background. |
| `--warn-message-color`                  | `var(--warn900)`    | Warn message color.                  |
| `--warn-message-border-color`           | `var(--warn500)`    | Warn message border color.           |
| `--warn-message-background`             | `var(--warn200)`    | Warn message background.             |
| `--warn-message-box-shadow-color`       | `var(--neutral000)` | Warn message box shadow color.       |
| `--warn-message-progress-background`    | `var(--warn500)`    | Warn message progress background.    |
| `--error-message-color`                 | `var(--alert900)`   | Error message color.                 |
| `--error-message-border-color`          | `var(--alert500)`   | Error message border color.          |
| `--error-message-background`            | `var(--alert200)`   | Error message background.            |
| `--error-message-box-shadow-color`      | `var(--neutral000)` | Error message box shadow color.      |
| `--error-message-progress-background`   | `var(--alert500)`   | Error message progress background.   |
| `--tip-message-color`                   | `var(--primary900)` | Tip message color.                   |
| `--tip-message-border-color`            | `var(--primary500)` | Tip message border color.            |
| `--tip-message-background`              | `var(--primary200)` | Tip message background.              |
| `--tip-message-box-shadow-color`        | `var(--neutral000)` | Tip message box shadow color.        |
| `--tip-message-progress-background`     | `var(--primary500)` | Tip message progress background.     |

## message inline

| Variable                 | Default                          | Description           |
| ------------------------ | -------------------------------- | --------------------- |
| `--message-color`        | `var(--primary950)`              | Message color.        |
| `--message-border-color` | `var(--primary500)`              | Message border color. |
| `--message-background`   | `var(--primary050)`              | Message background.   |
| `--message-border-width` | `1px`                            | Message border width. |
| `--message-border-style` | `solid`                          | Message border style. |
| `--message-radius`       | `3px`                            | Message radius.       |
| `--message-shadow`       | `0 0 12px 2px var(--neutral200)` | Message shadow.       |
| `--message-margin`       | `12px`                           | Message margin.       |
| `--message-gap`          | `12px`                           | Message gap.          |
| `--message-marquee-size` | `20px`                           | Message marquee size. |

## message floating

| Variable                                 | Default                                   | Description                           |
| ---------------------------------------- | ----------------------------------------- | ------------------------------------- |
| `--floating-message-border-color`        | `var(--info-message-border-color)`        | Floating message border color.        |
| `--floating-message-background`          | `var(--info-message-background)`          | Floating message background.          |
| `--floating-message-box-shadow-color`    | `var(--info-message-box-shadow-color)`    | Floating message box shadow color.    |
| `--floating-message-progress-background` | `var(--info-message-progress-background)` | Floating message progress background. |
| `--info-message-top`                     | `50px`                                    | Info message top.                     |
| `--info-message-max-width`               | `300px`                                   | Info message max width.               |

## grid

Grid helper classes.

| Variable              | Default | Description        |
| --------------------- | ------- | ------------------ |
| `--grid-cell-padding` | `6px`   | Grid cell padding. |

## block

Block component (`mg-block`) and its variants.

| Variable             | Default                          | Description       |
| -------------------- | -------------------------------- | ----------------- |
| `--block-radius`     | `3px`                            | Block radius.     |
| `--block-border`     | `1px solid var(--primary500)`    | Block border.     |
| `--block-shadow`     | `0 0 24px 2px var(--primary200)` | Block shadow.     |
| `--block-margin`     | `12px`                           | Block margin.     |
| `--block-background` | `var(--neutral025)`              | Block background. |

## table

Table component (`table[mg]`).

| Variable                          | Default             | Description                    |
| --------------------------------- | ------------------- | ------------------------------ |
| `--table-header-background`       | `var(--neutral100)` | Table header background.       |
| `--table-header-background-hover` | `var(--neutral200)` | Table header background hover. |
| `--table-header-sortable-cell`    | `var(--neutral300)` | Table header sortable cell.    |
| `--table-line-hover-background`   | `var(--neutral300)` | Table line hover background.   |
| `--table-selected-text`           | `var(--alert800)`   | Table selected text.           |

## tooltip

Tooltip directive (`[mgTooltip]`).

| Variable                 | Default                                                 | Description           |
| ------------------------ | ------------------------------------------------------- | --------------------- |
| `--tooltip-text-color`   | `var(--neutral950)`                                     | Tooltip text color.   |
| `--tooltip-background`   | `color-mix(in hsl, var(--primary200) 93%, transparent)` | Tooltip background.   |
| `--tooltip-shadow-color` | `var(--neutral000)`                                     | Tooltip shadow color. |
| `--tooltip-border-color` | `var(--primary200)`                                     | Tooltip border color. |
| `--tooltip-cursor`       | `help`                                                  | Tooltip cursor.       |

## page

Page-level layout helpers.

| Variable                         | Default             | Description                   |
| -------------------------------- | ------------------- | ----------------------------- |
| `--page-item-text-color`         | `var(--neutral900)` | Page item text color.         |
| `--page-item-border-color`       | `var(--neutral500)` | Page item border color.       |
| `--page-item-current-test-color` | `var(--primary700)` | Page item current test color. |
| `--page-item-current-background` | `var(--primary200)` | Page item current background. |
| `--page-item-hover-background`   | `var(--neutral300)` | Page item hover background.   |

## walkthrough

Walkthrough / product tour (`mg-walkthrough`).

| Variable                 | Default              | Description           |
| ------------------------ | -------------------- | --------------------- |
| `--walkthrough-backdrop` | `rgba(0, 0, 0, 0.7)` | Walkthrough backdrop. |

## click-enter

Click-enter directive (`[clickEnter]`) focus and hover feedback.

| Variable                               | Default             | Description                         |
| -------------------------------------- | ------------------- | ----------------------------------- |
| `--click-enter-hover-background`       | `none`              | Click enter hover background.       |
| `--click-enter-hover-cursor`           | `pointer`           | Click enter hover cursor.           |
| `--click-enter-hover-filter`           | `brightness(0.8)`   | Click enter hover filter.           |
| `--click-enter-block-hover-background` | `var(--neutral200)` | Click enter block hover background. |

## spinner

Spinner component (`mg-spinner`).

| Variable          | Default             | Description    |
| ----------------- | ------------------- | -------------- |
| `--spinner-color` | `var(--neutral950)` | Spinner color. |

## loader

Loader component (`mg-loader`) and its progress bar.

| Variable                           | Default                                                 | Description                     |
| ---------------------------------- | ------------------------------------------------------- | ------------------------------- |
| `--loader-background`              | `color-mix(in hsl, var(--neutral050) 23%, transparent)` | Loader background.              |
| `--loader-text-color`              | `var(--neutral950)`                                     | Loader text color.              |
| `--loader-text-shadow-color`       | `var(--neutral000)`                                     | Loader text shadow color.       |
| `--loader-progress-background`     | `#0b0b0b80`                                             | Loader progress background.     |
| `--loader-progress-bar-background` | `#fff`                                                  | Loader progress bar background. |

## loader-tile (base)

Loader tile skeleton (`mg-loader-tile`, `mg-loader-block`).

| Variable               | Default             | Description         |
| ---------------------- | ------------------- | ------------------- |
| `--loading-item-color` | `var(--primary200)` | Loading item color. |

## contrib-calendar

Contribution calendar (`mg-contrib-calendar`).

| Variable                             | Default             | Description                       |
| ------------------------------------ | ------------------- | --------------------------------- |
| `--contrib-calendar-day-font-size`   | `12px`              | Contrib calendar day font size.   |
| `--contrib-calendar-day-background`  | `var(--neutral050)` | Contrib calendar day background.  |
| `--contrib-calendar-month-font-size` | `12px`              | Contrib calendar month font size. |
| `--contrib-calendar-tile-size`       | `15px`              | Contrib calendar tile size.       |
| `--contrib-calendar-tile-color-even` | `var(--neutral100)` | Contrib calendar tile color even. |
| `--contrib-calendar-tile-color-odd`  | `var(--neutral200)` | Contrib calendar tile color odd.  |
| `--contrib-calendar-tile-color-lvl1` | `var(--success300)` | Contrib calendar tile color lvl1. |
| `--contrib-calendar-tile-color-lvl2` | `var(--success400)` | Contrib calendar tile color lvl2. |
| `--contrib-calendar-tile-color-lvl3` | `var(--success500)` | Contrib calendar tile color lvl3. |
| `--contrib-calendar-tile-color-lvl4` | `var(--success600)` | Contrib calendar tile color lvl4. |

## window

| Variable                            | Default                       | Description                      |
| ----------------------------------- | ----------------------------- | -------------------------------- |
| `--window-min-width`                | `150px`                       | Window min width.                |
| `--window-min-height`               | `150px`                       | Window min height.               |
| `--window-background`               | `var(--dialog-background)`    | Window background.               |
| `--window-shadow-color`             | `var(--dialog-shadow-color)`  | Window shadow color.             |
| `--window-content-border`           | `none`                        | Window content border.           |
| `--window-content-border-color`     | `transparent`                 | Window content border color.     |
| `--window-bar-padding`              | `0 0 0 5px`                   | Window bar padding.              |
| `--window-bar-height`               | `auto`                        | Window bar height.               |
| `--window-bar-color`                | `inherit`                     | Window bar color.                |
| `--window-bar-font-weight`          | `normal`                      | Window bar font weight.          |
| `--window-bar-button-background`    | `var(--neutral400)`           | Window bar button background.    |
| `--window-bar-button-border`        | `none`                        | Window bar button border.        |
| `--window-bar-button-border-color`  | `transparent`                 | Window bar button border color.  |
| `--window-bar-button-box-shadow`    | `none`                        | Window bar button box shadow.    |
| `--window-bar-button-focus-outline` | `2px solid var(--neutral900)` | Window bar button focus outline. |
| `--window-bar-button-focus-offset`  | `1px`                         | Window bar button focus offset.  |
| `--window-bar-button-size`          | `24px`                        | Window bar button size.          |
| `--window-bar-button-gap`           | `3px`                         | Window bar button gap.           |
| `--window-bar-button-padding`       | `2px`                         | Window bar button padding.       |
| `--window-bar-background`           | `var(--neutral300)`           | Window bar background.           |
| `--window-bar-background-active`    | `var(--neutral400)`           | Window bar background active.    |

## select2

Styling passed through to the `ng-select2-component` dependency.

| Variable                                       | Default                           | Description                                 |
| ---------------------------------------------- | --------------------------------- | ------------------------------------------- |
| `--select2-selection-focus-border-color`       | `var(--input-focus-border-color)` | Select2 selection focus border color.       |
| `--select2-selection-text-color`               | `var(--text-color)`               | Select2 selection text color.               |
| `--select2-selection-background`               | `var(--input-background)`         | Select2 selection background.               |
| `--select2-selection-border-color`             | `var(--input-border-color)`       | Select2 selection border color.             |
| `--select2-selection-disabled-background`      | `var(--input-background)`         | Select2 selection disabled background.      |
| `--select2-selection-disabled-border-color`    | `var(--input-border-color)`       | Select2 selection disabled border color.    |
| `--select2-single-height`                      | `auto`                            | Select2 single height.                      |
| `--select2-dropdown-background`                | `var(--input-background)`         | Select2 dropdown background.                |
| `--select2-dropdown-border-color`              | `var(--input-border-color)`       | Select2 dropdown border color.              |
| `--select2-option-text-color`                  | `var(--text-color)`               | Select2 option text color.                  |
| `--select2-option-selected-text-color`         | `var(--text-color)`               | Select2 option selected text color.         |
| `--select2-option-selected-background`         | `var(--primary500)`               | Select2 option selected background.         |
| `--select2-option-highlighted-text-color`      | `var(--text-color)`               | Select2 option highlighted text color.      |
| `--select2-option-highlighted-background`      | `var(--primary400)`               | Select2 option highlighted background.      |
| `--select2-search-border-color`                | `var(--input-border-color)`       | Select2 search border color.                |
| `--select2-search-background`                  | `var(--text-color)`               | Select2 search background.                  |
| `--select2-selection-line-height`              | `31px`                            | Select2 selection line height.              |
| `--select2-selection-readonly-background`      | `var(--input-background)`         | Select2 selection readonly background.      |
| `--select2-selection-choice-line-height`       | `25px`                            | Select2 selection choice line height.       |
| `--select2-selection-choice-background`        | `var(--primary300)`               | Select2 selection choice background.        |
| `--select2-selection-choice-border-color`      | `var(--primary500)`               | Select2 selection choice border color.      |
| `--select2-selection-choice-text-color`        | `var(--text-color)`               | Select2 selection choice text color.        |
| `--select2-selection-choice-close-color`       | `var(--primary800)`               | Select2 selection choice close color.       |
| `--select2-selection-choice-hover-close-color` | `var(--primary950)`               | Select2 selection choice hover close color. |
