# @ikilote/magma

[![npm version](https://badge.fury.io/js/@ikilote%2Fmagma.svg)](https://badge.fury.io/js/@ikilote%2Fmagma) [![Downloads](https://img.shields.io/npm/dm/@ikilote%2Fmagma.svg)](https://www.npmjs.com/package/@ikilote%2Fmagma) [![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://git.ikilote.net/angular/magma/-/blob/main/LICENSE.md)

Magma is a component library for my personal projects, because I don't want to copy/paste.

It will evolve mainly according to my projects. But people want to use it and help, no worries.

## Component

- Color picker
- Context-menu
    - List in options
    - Circle in options
- Dialog
- Tabs

# Demo

See : [Demo](https://magma.ikilote.net/)

# For start

```sh
npm i @ikilote/magma
```

Add in `style.css`

```css
@import '@angular/cdk/overlay-prebuilt.css';
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
