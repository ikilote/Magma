# Changelog of @ikilote/magma

## 1.5.0 (2026-03-07)

### 🐞 Fix

- **Color picker**: fix color-view
- **Datetime-picker**: fix init date
- **Input**: fix setTimeout for checkbox

### ✅ New

- **Window**
    - `mg-window` component
        - `mg-window-container` container for windows
        - `position` : initial position
        - `bar` : title bar with close and fullscreen buttons
        - `size` : initial size and limits
        - resizable or not
    - `Windows` service to create windows with parameters
        - `position` : initial position
        - `bar` : title bar with close and fullscreen buttons
        - `size` : initial size and limits
        - resizable or not
- **string** pipe to use string methods

### 🎦 Demo

- Add page for **mg-window** component
- Add page for **MagmaWindows** wervice
- Add page for **string** pipe

## 1.4.0 (2026-02-15)

### 🫢 Breaking

Modify the CSS variable numbering:

> ```css
> /* PRIMARY */
> --primary0 → --primary950
> --primary1 → --primary900
> --primary2 → --primary800
> --primary3 → --primary700
> --primary4 → --primary600
> --primary5 → --primary500
> --primary6 → --primary400
> --primary7 → --primary300
> --primary8 → --primary200
> --primary9 → --primary100
> --primaryA → --primary050
> --primaryB → --primary000
>
> /* NEUTRAL */
> --neutral  → --neutral990
> --neutral0 → --neutral950
> --neutral1 → --neutral900
> --neutral2 → --neutral800
> --neutral3 → --neutral700
> --neutral4 → --neutral600
> --neutral5 → --neutral500
> --neutral6 → --neutral400
> --neutral7 → --neutral300
> --neutral8 → --neutral200
> --neutral9 → --neutral100
> --neutralA → --neutral050
> --neutralB → --neutral000
>
> /* ALERT */
> --alert0 → --alert950
> --alert1 → --alert900
> --alert2 → --alert800
> --alert3 → --alert700
> --alert4 → --alert600
> --alert5 → --alert500
> --alert6 → --alert400
> --alert7 → --alert300
> --alert8 → --alert200
> --alert9 → --alert100
> --alertA → --alert050
>
> /* SUCCESS */
> --success0 → --success950
> --success1 → --success900
> --success2 → --success800
> --success3 → --success700
> --success4 → --success600
> --success5 → --success500
> --success6 → --success400
> --success7 → --success300
> --success8 → --success200
> --success9 → --success100
> --successA → --success050
>
> /* WARN */
> --warn0 → --warn950
> --warn1 → --warn900
> --warn2 → --warn800
> --warn3 → --warn700
> --warn4 → --warn600
> --warn5 → --warn500
> --warn6 → --warn400
> --warn7 → --warn300
> --warn8 → --warn200
> --warn9 → --warn100
> --warnA → --warn050
> ```

Migration assistance: [migrate-colors.js](https://git.ikilote.net/-/project/58/uploads/4b9ee6e7fc521066c7dbb7ced1561cab/migrate-colors.js)

### 🐞 Fix

- Improve contrast with **light theme**
- **input**:
    - fix alignment class
    - **Input-date**:
        - improve invalide date
        - improve focus
        - fix milli with keyboard
    - **radio/checkbox** :
        - Chromium: fix align (radio/checkbox)
        - **RTL**: fix column mode
- **Focus limit** with a multiple contexts

## 1.3.0 (2026-02-01)

### 🫢 Breaking

- **input-date**: has been completely rewritten based on Firefox.
- **input** : `arrayValue` is remove for **checkbox**. See `typeValue` & `returnValue`

### ✅ New

- **Datetime picker**: new component
    - can be used as a component or a directive
    - is used for **input-date**
- **RTL/LTR**: is now supported without breaking the component rendering
- **input**:
    - for **checkbox**, new parameter :
        - add `typeValue`:
            - `default`: one value (`returnValue`) / multiple values (array of `returnValue`)
            - `value`: one value (`returnValue`) / multiple values (array of `returnValue`)
            - `array`: force array of `returnValue`
        - add `returnValue`:
            - `default`: one value (`boolean`) / multiple values (`value`)
            - `value`: force `value`
            - `boolean`: force `boolean`
- **pipes**
    - `string`: to asset string methods
- **Utils**
    - `getWeek()` : calculate week number (ISO and other)

### 🐞 Fix

- **pipes**
    - `number`: support langage with string pattern

### 🎦 Demo

- add button **RTL/LTR** in menu

## 1.2.0 (2025-12-29)

> Note: replace `styleUrls` by `styleUrl`

### ✅ New

- **New component**:
    - `ellipsis-button` : new component

### 🐞 Fix

- **input-number**: fix number position with arrows

## 1.1.1 (2025-12-24)

### 🐞 Fix

- **tooltip**: fix animation (causes `mouseleave`) and cursor

## 1.1.0 (2025-12-22)

**Up to Angular 21**

### 🎦 Demo

- Demo with **zoneless**
- Update to `@ikilote/json2html` `1.0.0`

## 1.0.0 (2025-11-25)

> This version of Magma marks the beginning of 100% test coverage, which has allowed all expected problems to be fixed.

### ℹ️ Information

- Add cover tests across the entire library
- All `@host` instances have been removed due to recursive dependency issues in some cases, notably Karma tests.

### ✅ New

- **component**:
    - `context-menu` : add `AbstractContextMenuComponent` (Directive) abstract class for component menu
    - `contrib-calendar` :
        - add `steps` table param to define colors
        - add `firstDayOfWeek` param (Monday, Sunday or Saturday; Monday by default )
        - add `mg-contrib-calendar-desc` tag
    - `expansion` :
        - new component with `open` & `disabled` params
        - include: `mg-expansion-header` & `mg-expansion-content` tags
    - `input`
        - **color**: expose `inputDirective` to get the `MagmaColorPicker`
        - **textarea**: add `displayLimit` parameter
    - `walkthrough`: add `overlayComponent` access on `<mg-walkthrough>`
- **directives**:
    - `tooltip`: add `mgTooltipDescribedBy`
- **service**:
    - `cache`: add `clearAll()` method
- **tools**:
    - **date**: add `addDuration()` function
    - **dom**: `containClasses()` accept `SVGSVGElement`
    - **file**:
        - `downloadFile()` return DOM element
        - `blobToBase64()` add error on reject
    - **subscriptions**: add `length()`
    - **text**: add `unescapedString()` function (remove accents and case), replace old `normalizeFileName()`

### 🐞 Fix

- **components**:
    - `color-picker`: fix palette update and init
    - `input` :
        - `onError` & `forId`: change to signal
        - `placeholderAnimated`: separator is `|` by default
        - **checkbox**: update all other checkboxes value in the group
        - **color**:
            - fix keyboard navigation
            - fix color on mouse over
        - **number**: improve edge values
    - `paginate`: fix `currentPage` on DOM update
    - `tab`: fix content id and tab id
    - `walkthrough`: change to `OnPush`
- **directives**:
    - `limitFocus`: expose `focusRules` (css rules)
    - `ngModelChangeDebounced` : fix `ngModelChangeDebounceTime` update value
    - `sortable`:
        - rules now are required
        - improve test sorting with array
    - `stop-propagation`: improve propagation stop
    - `tooltip` : rewrite directive with CDK
- **pipes**:
    - `classList`: remove empty classes in list
    - `fileSize`: fix decimal
    - `math`: test if function exist
    - `repeat-for`: round number of repeat
- **service**:
    - `FormBuilderExtended` :
        - rewrite to accept Group, Array & Record
        - fix custom validation
        - add `array()` method for fix Array
- **tools**:
    - **array**: `flattenedListItems()` fix with invalid value
    - **coercion**:`numberAttributeOrUndefined()` fix with invalid value
    - **css**:`getPaletteList()` fix with empty value
    - **enum**:`enumToMap()` fix
    - **file**: `normalizeFileName()` change to remove all non-ASCII characters
    - **number**: `randomNumber()` fix with invalid or impossible value
    - **object**: `objectsAreSame()` improve with array and null in the object structure
    - **other**:
        - `isEmpty()`: add **Set** & **Map** support and ignore date
        - `regexpSlash()` support escape character

### 🎦 Demo

- Add coverage link on **Readme**
- Add pages for:
    - `mg-expansion`
    - `FormBuilderExtended`
- Update pages for:
    - `contrib-calendar`
    - `date` utils
    - `text` utils

---

## 0.9.2 (2025-09-07)

### ✅ New

- **pipe**:
    - `arrayFilter`
    - `strReplace`
- **service**:
    - `MagmaCache`: with id, group name and end of life
- **utils**:
    - `flattenedListItems()`
    - `getPaletteList()`
    - `isEmpty()`
    - `regexpSlash()`

## 0.9.1 (2025-09-06)

### ✅ New

- **Contrib-calendar**:
    - no default `lang` in signal
    - add `min`/`max` parameters
- **Tabs**:
    - `tab-content`: `id` required

### 🐞 Fix

- **Input**:
    - **number**: remove `z-index`
    - **select**: improve alignment with affixes or not

### 🎦 Demo

- **Menu**: fix menu in mobile
- **Input**: page merge
- Add `import` and `ts` code for all components

## 0.9.0 (2025-09-04)

### ✅ New

- **New components**:
    - Add `contrib-calendar` component
    - Input : add `input-date`

### 🐞 Fix

- **Dialog**: fix focus when clicking outside the dialog

### 🎦 Demo

- **Contrib-calendar**: add page

## 0.8.7 (2025-08-31)

### ✅ New

- **Tab**: Add a button to scroll through tabs when they are too long

### 🐞 Fix

- **Message**: improve corner
- **Dialog**: propagation when no backdrop click
- **Color picker**: cursor color & position

### 🎦 Demo

- **Message**: improve page

## 0.8.6 (2025-08-15)

### ✅ New

- **Message**:
    - add component:
        - simple
        - sub-block
- **Utils**:
    - add for enum
        - `enumToValueList()`
        - `enumToKeyList()`
        - `enumToKeyValue()`
        - `enumToObject()`
        - `enumToMap()`

### 📦 Packages

- Update **bowser**

## 0.8.5 (2025-08-10)

### ✅ New

- **logger**:
    - add method
- **Utils**:
    - add limit parameter for `normalizeFileName()`

## 0.8.4 (2025-08-10)

### ✅ New

- **logger**:
    - add prefix

### 🐞 Fix

- **sort**:
    - fix regression with alternative value

## 0.8.3 (2025-08-08)

### ✅ New

- **utils**:
    - add `objectAssignNested()` util method

### 🐞 Fix

- **click-enter**:
    - fix background style if not a block

## 0.8.2 (2025-07-19)

### ✅ New

- **sort-rule**:
    - improve with string rule or multiple rules
        - rule
        - rule list
        - string (see: `MagmaSortRules` type)
- **utils**:
    - add `sortWithRule()` util method
- **info-message**:
    - possible to use a component, in addition to a string
    - add type style:
        - `tip`
        - `warn`
        - `success`
- **css variable**
    - add `--warn0`~`--warnA`
- **stop-propagation**
    - add `stopClick`

### 🐞 Fix

- **limit-focus**:
    - improve with `tabindex="-1"`
    - add textarea, select and tabindex

### 🎦 Demo

- Info-messages: improve page
- limitFocus: improve page
- Sortable: update page
- Update to **Angular** `20.1`

## 0.8.1 (2025-06-25)

### 🫢 Breaking

- Loader: rewrite with sub components (spinner, loader-message & progress)
- Progress: fix undetermined progression

### ✅ New

- Add progress component

### 🐞 Fix

- LimitFocus: remove `display:none` & `visibility:hidden`

### 🎦 Demo

- Progress: add demo
- Loader: improve page

## 0.8.0 (2025-06-22)

### ✅ New

- Add spinner component
- Add loader component
- Add loader-block component
- Add fileSize pipe

### 🐞 Fix

- Focus more visible

### 🎦 Demo

- Update `@ikilote/json2html` for demo for webComponentSelfClosing
- Add button to copy the code

## 0.7.1 (2025-06-16)

### ✅ New

- Add stop-propagation directive

### 🐞 Fix

- Fix focus on style for Light-dark

### 🎦 Demo

- Remove unnecessary end tag in demo

## 0.7.0 (2025-06-15)

### ✅ New

- Add focus trap for **contextMenu**
- Add keyboard navigation for **tabs** (with arrow & return button to tabs)
- Improve **dialog** with keyboard
- Improve **walkthrough** with keyboard
- **Paginate**: update the component to display the total items

### 🐞 Fix

- `limitFocus`: change first focused element
- Fix paginate update (for perf & focus)
- No focus for `tabindex="-1"`

### 🎦 Demo

- Replace menu to aside/nav in demo
- Improve Tabs demo
- Improve Dialog demo
- Improve Paginate demo

## 0.6.0 (2025-05-30)

### ✅ New

- **Walkthrough**: add action on `start` et change scroll rules

### 📦 Packages

- Update to Angular `20.0`

## 0.5.3 (2025-05-06)

### ✅ New

- Add `classList`, `math` & `repeatFor` pipes

### 🐞 Fix

- Fix input:textarea for CSS grid

### 🎦 Demo

- add pipes pages

## 0.5.2 (2025-05-02)

### ✅ New

- Add focus color var

### 🐞 Fix

- Disabled button: cursor default
- Dialog: fix starting-style for position fixed

### 🎦 Demo

- fix menu

## 0.5.1 (2025-05-01)

### ✅ New

- Add **click-enter** directive and use MagmaClickEnterDirective

### 🐞 Fix

- Fix **button** disabled & add links in demo

### 🎦 Demo

- Simplification of the menu template
- Use `click-enter`
- Change theme for code

## 0.5.0 (2025-04-26)

### ✅ New

- **block**: new component #19
- **walkthrough**: new component #21
- **limitFocus** & **limitFocusFirst**: new directive #21

### 🐞 Fix

- Fix export component with module for :
    - `MagmaTableModule`
    - `MagmaTabsModule`
    - `MagmaSortableModule`

### 📦 Packages

- Update to **ng-select2-component** to `17.2.5`

## 0.4.3 (2025-03-28)

### 🐞 Fix

- Fix overflow issues for mg-input (select)

## 0.4.2 (2025-03-27)

### ✅ New

- **input-textarea**: add monospace mode
- Util: add `jsonParse` function to parse json with `ExceptionJsonParse`

### 📦 Packages

- Add **bowser**

## 0.4.1 (2025-03-23)

### ✅ New

- Add keyboard selection for tabs

### 🐞 Fix

- Fix info-message action zone

## 0.4.0 (2025-03-22)

### ✅ New

- Add focus tabulation in **dialog** #18
- Improve datalist for **input**: #17
    - color: `string[]`
    - text: `string[], {label?: string, value: string}[]`
    - range: `number[]`
    - number: `number[], {label?: string, value: number}[]`
- **input-select**: mapping for `nativeKeyboard` form **select2** #16

### 📦 Packages

- Update to **ng-select2-component** to `17.2.1`

## 0.3.8 (2025-03-14)

### 🐞 Fix

- Fix `pointer-event` on `info-messages` panel
- Fix `clearField` update value

## 0.3.7 (2025-03-11)

### ✅ New

- Add `alignMode` for radio & checkbox
- Add CSS var for checkbox & radio top position

### 🐞 Fix

- Placeholder: start animation when field is empty
- `input-number`: fix empty value & placeholder
- Color piker: fix color cursor position on init

## 0.3.6 (2025-03-08)

### 🫢 Breaking

- Rename sort class

### ✅ New

- Add type for `input-text`
- Support mg-input for sort directive
- Get inputElement for all mg-input components

### 🐞 Fix

- Fix input line-height

## 0.3.5 (2025-03-05)

### 🐞 Fix

- Fix `undefined` display value for inputs
- Fix `input-error` & `input-desc` in block
- Fix `input-prefix` & `input-suffix` has nowrap
- Fix color picker in {x,y} space with negative position

### 🎦 Demo

- Add `datalist` in generator for: `color`, `number`, `text` & `range`

## 0.3.4 (2025-03-03)

### ✅ New

- Add `palette` and `texts` attributes for **color picker** (component, directive & input)
- `compact`class for **tabs**
- Add `datalist` for: `color`, `number`, `text` & `range`

### 🐞 Fix

- Fix `undefined` display value for inputs

## 0.3.3 (2025-03-02)

### ✅ New

- Add `input-before` & `input-after` for **input** component
- Add `input-range` component #9

### 🐞 Fix

- Fix `input-select` with **overlay** mode

## 0.3.2 (2025-03-01)

### 🫢 Breaking

- Rename `MagmaPaginationComponent` to `MagmaPagination`

### ✅ New

- Add `mg-input-textarea-desc` component
- Add **clear** button for **color picker** (component, directive & input)

### 🐞 Fix

- Fix `writeValue` for `input-select`

## 0.3.1 (2025-02-27)

### 🐞 Fix

- Replace `@github/textarea-autosize` by `autosize` because github package doesn't work with textarea outside the
  viewport.

### 🎦 Demo

- Added demo pages for: `sortable`, `objectNestedValue`

## 0.3.0 (2025-02-26)

### ✅ New

- Add Component
    - `mg-paginate`
- Add Directives
    - `clickOutside`
    - `ngModelChangeDebounced`
    - `ngInit`
    - `sort-rule`
    - `tooltip`
- Add Utils
    - `clipboard`
    - `cookies`
    - `date`
    - `dom`
    - `email`
    - `file`
    - `json`
    - `number`
    - `object`
    - `subscriptions`
    - `text`

### 🐞 Fix

- `input`
    - Fix number blur value
    - Fix `getValue()`

### 🎦 Demo

- Added most of the corresponding demo pages

## 0.2.1 (2025-02-21)

### ✅ New

- Move light-dark actions into a service

### 🐞 Fix

- Fix checkbox & radio padding without label

## 0.2.0 (2025-02-16)

### ✅ New

- **table mg**:
    - new component (directive) with:
        - grid hover,
        - sticky header,
        - baseline
- **mg-input**:
    - Add `placeholderAnimated` attribute: #1
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
