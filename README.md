# @ikilote/magma

[![npm version](https://badge.fury.io/js/@ikilote%2Fmagma.svg)](https://badge.fury.io/js/@ikilote%2Fmagma)
[![Downloads](https://img.shields.io/npm/dm/@ikilote%2Fmagma.svg)](https://www.npmjs.com/package/@ikilote%2Fmagma)
[![MIT license](https://test.ikilote.net/badge-custom.php?label=license&value=MIT&valueBgColor=007ec6)](https://git.ikilote.net/angular/magma/-/blob/main/LICENSE.md)
[![Angular 21.0](https://test.ikilote.net/badge-custom.php?label=Angular&value=21.0&valueBgColor=e05d44)](https://angular.dev/)

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
- Datetime picker
- Dialog
- Ellipsis button
- Expansion panel
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

- Cache
- FormBuilderExtended
- Logger

### Pipes

- arrayFilter
- classList
- fileSize
- math
- numFormat
- repeatFor
- strRelace
- string

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

- Array
- Clipboard
- Coercion
- CSS
- Cookies
- Date
- DOM
- Email
- Enum
- File
- Json
- Number
- Object
- Text
- Subscriptions

### Styles

- Buttons
- Links
- Input
- Grid
    - Responsive
- Palette
- LTR & RTL

# Demo

See : [Demo](https://magma.ikilote.net/)

# For start

Install in project:

```sh
npm i @ikilote/magma
```

Required in `package.json`

- `@angular/common`: `^21.0.0`
- `@angular/core`: `^21.0.0`
- `@angular/cdk`: `^21.0.0`

Add in `style.css`

```css
@import '@angular/cdk/overlay-prebuilt.css';

@import '../node_modules/@ikilote/magma/assets/styles/font-icon.css';
@import '../node_modules/@ikilote/magma/assets/styles/css-var.css';
@import '../node_modules/@ikilote/magma/assets/styles/style.css';
```

## Supported versions of Angular

| Magma | Angular |
| ----: | ------: |
| 1.1.x |    21.0 |
| 1.0.0 |    20.x |

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

Test for lib

```sh
npm run test:lib
```

Update coverage badges:

```sh
npm run update-coverage-badges
```

## Coverage

[![Statements 100% (2367/2367)](https://test.ikilote.net/badge-custom.php?label=Statements&value=100%25&valueBgColor=4D9221)](https://magma.ikilote.net/coverage/ikilote/magma/)
[![Branches 100% (1070/1070)](https://test.ikilote.net/badge-custom.php?label=Branches&value=100%25&valueBgColor=4D9221)](https://magma.ikilote.net/coverage/ikilote/magma/)
[![Functions 100% (572/572)](https://test.ikilote.net/badge-custom.php?label=Functions&value=100%25&valueBgColor=4D9221)](https://magma.ikilote.net/coverage/ikilote/magma/)
[![Lines 100% (2300/2300)](https://test.ikilote.net/badge-custom.php?label=Lines&value=100%25&valueBgColor=4D9221)](https://magma.ikilote.net/coverage/ikilote/magma/)

## License

Like Angular, this module is released under the permissive MIT license. Your contributions are always welcome.
