# @ikilote/magma

[![npm version](https://badge.fury.io/js/@ikilote%2Fmagma.svg)](https://badge.fury.io/js/@ikilote%2Fmagma) [![Downloads](https://img.shields.io/npm/dm/@ikilote%2Fmagma.svg)](https://www.npmjs.com/package/@ikilote%2Fmagma) [![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://git.ikilote.net/angular/magma/-/blob/main/LICENSE.md) ![Angular 19.0](https://img.shields.io/badge/Angular-19.0-red)

Magma is a component library for my personal projects, because I don't want to copy/paste.

It will evolve mainly according to my projects. But people want to use it and help, no worries.

## Included in Magma

### Components

- Color picker
- Context-menu
    - List in options
    - Circle in options
- Dialog
- Input
    - Color
    - Checkbox
    - Number
    - Radio
    - Select
    - Text
    - Textarea
- Light-dark
- Tabs

### Services

- FormBuilderExtended
- Logger

### Pipes

- NumFormat

### Styles

- Buttons
- Input
- Grid

# Demo

See : [Demo](https://magma.ikilote.net/)

# For start

Install in project:

```sh
npm i @ikilote/magma
```

Required in `package.json`

- `@angular/common`: `^19.0.0`
- `@angular/core`: `^19.0.0`
- `@angular/cdk`: `^19.0.0`
- `colorjs.io`: `^0.5.2`
- `ng-select2-component`: `^17.1.0`

Add in `style.css`

```css
@import '@angular/cdk/overlay-prebuilt.css';

@import '../node_modules/@ikilote/magma/assets/styles/font-icon.css';
@import '../node_modules/@ikilote/magma/assets/styles/css-var.css';
@import '../node_modules/@ikilote/magma/assets/styles/style.css';
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Publishing the library

```
npm run build:lib
npm run publish:lib
```

## Update Demo

```
npm run build:demo
```

## License

Like Angular, this module is released under the permissive MIT license. Your contributions are always welcome.
