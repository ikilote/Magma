# Changelog of @ikilote/magma

## 0.2.0 (2025-02-16)

### ✅ New

- **table mg**:
    - new component (directive) with:
        - grid hover,
        - sticky header,
        - baseline
- **mg-input**:
    - Add `placeholderAnimated` attribute:
        - timers for character
        - delay
        - repeat time
        - multiple placeholder
    - `input-number`:
        - try to fix mobile #12

### 🎦 Demo

- Fix float mobile menu #11
- Fix strange break scrolling on demo #11
- Add `Table` page

## 0.1.10 (2025-02-14)

### ✅ New

- **mg-input**:
    - `input-number`: add forceMinMax parameter #5
- Add `s`mall, `m`edium, `l`arge & e`x`tra-large in grid #8

### 🐞 Fix

- **mg-input**:
    - Fix `input-number` arrows for Chromium & Webkit #10

### 🎦 Demo

- Add mobile menu #8

## 0.1.9 (2025-02-12)

### ✅ New

- **mg-input**:
    - Add of for `input-number`: `min`, `max`, `formater`, `noDecimal`, `noNegative`

### 🐞 Fix

- **mg-input**:
    - Fix select2 CSS
    - No spellcheck on password
    - Fix label click for all elements except radio&checkbox #3

### 🎦 Demo

- **mg-input**: Improve demo for inputs
- **palette**: Add demo page #6

## 0.1.8 (2025-02-08)

### ✅ New

- **mg-input**:
    - Add disabled & readonly attributs #2
    - Add error by tag
    - Improve error border #2
    - Improve checkbox & radio
    - Add access to all parameters for error messages keyword

### 🐞 Fix

- **mg-input**: pixel alignment

## 0.1.7 (2025-02-07)

### ✅ New

- **mg-input**: Add validateForm to update and show form error messages
- **info-message** : Add component

### 🎦 Demo

- **info-message** : Add demo & code generator

## 0.1.6 (2025-02-04)

### ✅ New

- **mg-input**: add all Select2 attributes

### 🐞 Fix

- Improve color for inputs

### 🎦 Demo

- Fix color in demo dark theme

## 0.1.5 (2025-02-03)

### ✅ New

- **mg-input**:
    - Add `height` definitions for `textarea`
    - Add `placeholder` for `text`, `textarea`, `password`, `number` & `select`

### 🐞 Fix

- Fix form value change
- Align grid on baseline

### 🎦 Demo

- Improve demo for inputs

## 0.1.4 (2025-02-02)

### ✅ New

- **light-dark**: detect browser prefers-color-scheme

### 🐞 Fix

- Fix affix for password
- Fix width for text/password/textarea

### 🎦 Demo

- Add favicon

## 0.1.3 (2025-02-01)

### ✅ New

- **mg-input**:
    - Add `clearCross` to delete for `text`
    - Add of `password` component with `eye` to see
    - Add of `maxlength` for `text` and `textarea`
    - Add of `autosize` for `textarea`
    - Improve labels for checkboxes only

### 🐞 Fix

- **mg-input**:
    - Fix color grid
    - Fix select align
- Fix grid with flexbox
- Fix radio/checkbox wrap

### 🎦 Demo

- Update of input code generator
- All pages with the grid system

## 0.1.2 (2025-02-01)

### ✅ New

- Add minimal grid system with flexbox

### 🐞 Fix

- Fix with of input
- Remove unnecessary CSS

### 🎦 Demo

- Add page for the grid system

## 0.1.1 (2025-01-30)

### ✅ New

- **mg-input**:
    - Add Textarea component
    - Better interface for error messages
    - Add error message with {tag}
    - Improve validation
    - Add in-list and custom validation
- **context menu** :
    - add component item

### 🐞 Fix

- fix focus for input:number
- fix validation for input:radio

### 🎦 Demo

- Use `mg-input` for all components pages
- Page for examples for validators

## 0.1.0 (2025-01-25)

### ✅ New

- Add `mg-input` component with:
    - Color
    - Checkbox
    - Number
    - Radio
    - Select
    - Text
- Add pipe:
    - numFormat
- Add services:
    - FormBuilderExtended: for show error message in `mg-input`
    - Logger: for add logger

### 🐞 Fix

- Color picker : fix Webkit

### 🎦 Demo

- Add input pages
    - generator
    - alignment
- Improuve page with new input component

## 0.0.5 (2025-01-09)

### ✅ New

- Add light-dark component
    - simple mode
    - compact mode
- Add Classicone font

### 🎦 Demo

- Add light-dark page
- Add icons page
- Add light-dark mode in themenu

## 0.0.4 (2025-01-08)

### 🐞 Fix

- Color picker:
    - Fix alpha in popup
    - Fix with Chromium
- Context menu:
    - Fix shadow position for bubble context menu
- Fix CDK overlay with Chromium

### 🎦 Demo

- Add home page

## 0.0.3 (2025-01-06)

### ✅ New

- Add color picker
    - component mode
    - popup mode

### 🎦 Demo

- Add color picker page
- Add styles pages

## 0.0.2 (2024-12-28)

### 🐞 Fix

- fix tab selection
- rename tags/classes
- more CSS include

### 🎦 Demo

- Add demo with code generator

## 0.0.1 (2024-12-27)

### ✅ New

- Add components form Classement project
    - Context-menu
        - List in options
        - Circle in options
    - Dialog
    - Tabs
