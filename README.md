# @ikilote/magma

[![npm version](https://badge.fury.io/js/@ikilote%2Fmagma.svg)](https://badge.fury.io/js/@ikilote%2Fmagma) [![Downloads](https://img.shields.io/npm/dm/@ikilote%2Fmagma.svg)](https://www.npmjs.com/package/@ikilote%2Fmagma) ![MIT license](https://test.ikilote.net/badge-custom.php?label=license&value=MIT&valueBgColor=007ec6) ![Angular 20.0](https://test.ikilote.net/badge-custom.php?label=Angular&value=20.0&valueBgColor=e05d44)

Magma is a component library for my personal projects, because I don't want to copy/paste.

It will evolve mainly according to my projects. But people want to use it and help, no worries.

## Included in Magma

### Components

- Block
- Color picker
- Context-menu
    - List in options
    - Circle in options
- Contrib calendar
- Dialog
- Info-message
- Input
    - Checkbox
    - Color
    - Date
    - Number
    - Password
    - Radio
    - Range
    - Select
    - Text
    - Textarea
- Light-dark
- Loader
- Loader-block
- Message
- Paginate
- Progress
- Spinner
- Table
- Tabs
- Walkthrough

### Services

- FormBuilderExtended
- Logger

### Pipes

- classList
- fileSize
- math
- numFormat
- repeatFor

### Directive

- Click Enter
- Click Outside
- Limit-focus
- ngInit
- ngModelChange debounced
- Sortable
- Stop Propagation
- Tooltip
- Textarea autosize

### Utils

- Clipboard
- Coercion
- Cookies
- Date
- DOM
- Email
- Enum
- File
- Json
- Number
- Object
- Subscriptions

### Styles

- Buttons
- Links
- Input
- Grid
    - Responsive
- Palette

# Demo

See : [Demo](https://magma.ikilote.net/)

# For start

Install in project:

```sh
npm i @ikilote/magma colorjs.io ng-select2-component
```

Required in `package.json`

- `@angular/common`: `^20.0.0`
- `@angular/core`: `^20.0.0`
- `@angular/cdk`: `^20.0.0`
- `colorjs.io`: `^0.5.2`
- `ng-select2-component`: `^17.2.7`

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

## Test

### Linux

Required for start test

```sh
export CHROME_BIN=chromium
```

test for lib

```sh
npm run test:lib
```

## License

Like Angular, this module is released under the permissive MIT license. Your contributions are always welcome.
