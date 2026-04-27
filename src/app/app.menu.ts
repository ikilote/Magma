export type Menu = {
    groupName?: string;
    items: {
        routerLink: string;
        label: string;
        keys: string[];
        status?: 'new' | 'update';
    }[];
}[];

export const menu: Menu = [
    {
        items: [
            {
                routerLink: '/',
                label: 'Home',
                keys: ['start', 'welcome', 'dashboard'],
            },
            {
                routerLink: '/home',
                label: 'Installation',
                keys: ['install', 'setup', 'getting started'],
            },
        ],
    },
    {
        groupName: 'Components',
        items: [
            {
                routerLink: '/component/block',
                label: 'Block',
                keys: ['container', 'card', 'layout'],
            },
            {
                routerLink: '/component/color-picker',
                label: 'Color picker',
                keys: ['palette', 'swatch', 'color selector'],
            },
            {
                routerLink: '/component/context-menu',
                label: 'Context menu',
                keys: ['right click', 'menu', 'contextmenu'],
            },
            {
                routerLink: '/component/contrib-calendar',
                label: 'Contrib calendar',
                keys: ['calendar', 'date picker', 'calendar component', 'contrib calendar'],
            },
            {
                routerLink: '/component/datetime-picker',
                label: 'Datetime picker',
                keys: ['date time', 'schedule', 'date picker'],
            },
            {
                routerLink: '/component/dialog',
                label: 'Dialog',
                keys: ['dialog', 'modal', 'popup', 'window'],
            },
            {
                routerLink: '/component/ellipsis-button',
                label: 'Ellipsis button',
                keys: ['more', 'options', 'three dots'],
            },
            {
                routerLink: '/component/expansion-panel',
                label: 'Expansion panel',
                keys: ['accordion', 'panel', 'collapse'],
            },
            {
                routerLink: '/component/info-messages',
                label: 'Info-messages',
                keys: ['notifications', 'alerts', 'info'],
            },
            {
                routerLink: '/component/input',
                label: 'Inputs',
                keys: ['form fields', 'input', 'text field'],
            },
            {
                routerLink: '/component/light-dark',
                label: 'Light-dark',
                keys: ['light dark', 'theme', 'dark mode', 'light mode'],
            },
            {
                routerLink: '/component/loader',
                label: 'Loader',
                keys: ['loader', 'loading', 'spinner', 'progress indicator'],
            },
            {
                routerLink: '/component/loader-block',
                label: 'Loader-block',
                keys: ['block loader', 'loading block'],
            },
            { routerLink: '/component/message', label: 'Message', keys: ['toast', 'notification', 'alert'] },
            {
                routerLink: '/component/paginate',
                label: 'Paginate',
                keys: ['pagination', 'pages', 'page navigation'],
            },
            {
                routerLink: '/component/progress',
                label: 'Progress',
                keys: ['progress bar', 'loading bar', 'indicator'],
            },
            {
                routerLink: '/component/spinner',
                label: 'Spinner',
                keys: ['loading spinner', 'loader', 'busy indicator'],
            },
            {
                routerLink: '/component/table',
                label: 'Table',
                keys: ['grid', 'datatable', 'data table'],
            },
            {
                routerLink: '/component/tabs',
                label: 'Tabs',
                keys: ['tabbed', 'navigation', 'tab'],
            },
            {
                routerLink: '/component/walkthrough',
                label: 'Walkthrough',
                keys: ['tour', 'guide', 'onboarding'],
            },
            {
                routerLink: '/component/window',
                label: 'Window',
                status: 'new',
                keys: ['popup window', 'dialog window'],
            },
        ],
    },
    {
        groupName: 'Directives',
        items: [
            {
                routerLink: '/directive/click-enter',
                label: 'Click Enter',
                keys: ['enter key', 'keyboard enter'],
            },
            {
                routerLink: '/directive/click-outside',
                label: 'Click Outside',
                keys: ['outside click', 'blur click', 'close on outside click'],
            },
            {
                routerLink: '/directive/limit-focus',
                label: 'Limit-focus',
                keys: ['focus trap', 'focus control', 'focus limit'],
            },
            {
                routerLink: '/directive/ng-init',
                label: 'ngInit',
                keys: ['ng init', 'initialize', 'init directive', 'initialization'],
            },
            {
                routerLink: '/directive/ng-model-change-debounced',
                label: 'ngModelChange debounced',
                keys: ['ngmodelchange', 'debounced', 'debounce', 'model change', 'change detection'],
            },
            {
                routerLink: '/directive/sortable',
                label: 'Sortable',
                keys: ['sort', 'reorder'],
            },
            {
                routerLink: '/directive/stop-propagation',
                label: 'Stop Propagation',
                keys: ['event stop', 'propagation'],
            },
            {
                routerLink: '/directive/tooltip',
                label: 'Tooltip',
                keys: ['hover tip', 'hint', 'help text'],
            },
            {
                routerLink: '/directive/textarea-autosize',
                label: 'Textarea autosize',
                keys: ['autosize', 'auto resize', 'expand textarea'],
            },
        ],
    },
    {
        groupName: 'Pipes',
        items: [
            {
                routerLink: '/pipe/array-filter',
                label: 'arrayFilter',
                keys: ['array filter', 'filter array', 'filter', 'array'],
            },
            {
                routerLink: '/pipe/class-list',
                label: 'classList',
                keys: ['class list', 'css classes', 'class names', 'html classes'],
            },
            {
                routerLink: '/pipe/file-size',
                label: 'fileSize',
                keys: ['file size', 'filesize', 'size', 'format size'],
            },
            { routerLink: '/pipe/math', label: 'math', keys: ['math', 'numbers', 'calculation', 'compute'] },
            {
                routerLink: '/pipe/num-format',
                label: 'numFormat',
                keys: ['number format', 'num format', 'format', 'numeric format'],
            },
            {
                routerLink: '/pipe/repeat-for',
                label: 'repeatFor',
                keys: ['repeat for', 'repeat', 'loop', 'iteration'],
            },
            {
                routerLink: '/pipe/str-replace',
                label: 'strReplace',
                keys: ['str replace', 'replace string', 'string replace', 'replace'],
            },
            {
                routerLink: '/pipe/string',
                label: 'string',
                status: 'new',
                keys: ['text', 'string pipe', 'format text'],
            },
        ],
    },
    {
        groupName: 'Services',
        items: [
            { routerLink: '/service/cache', label: 'Cache', keys: ['cache', 'storage', 'memory', 'cache service'] },
            {
                routerLink: '/service/form-builder-extended',
                label: 'FormBuilderExtended',
                keys: ['form builder', 'form builder extended', 'form', 'form service'],
            },
            {
                routerLink: '/service/windows',
                label: 'Windows',
                status: 'new',
                keys: ['window service', 'popup windows', 'window utilities'],
            },
        ],
    },
    {
        groupName: 'Utils',
        items: [
            { routerLink: '/utils/array', label: 'Array', keys: ['array', 'arrays', 'list', 'collection'] },
            {
                routerLink: '/utils/clipboard',
                label: 'Clipboard',
                keys: ['copy paste', 'clipboard utils', 'clipboard helper'],
            },
            {
                routerLink: '/utils/coercion',
                label: 'Coercion',
                keys: ['type conversion', 'convert', 'cast'],
            },
            {
                routerLink: '/utils/cookies',
                label: 'Cookies',
                keys: ['browser cookies', 'cookie', 'storage'],
            },
            {
                routerLink: '/utils/css',
                label: 'CSS',
                keys: ['styles', 'style', 'stylesheet'],
            },
            {
                routerLink: '/utils/date',
                label: 'Date',
                keys: ['datetime', 'time', 'date utilities'],
            },
            {
                routerLink: '/utils/dom',
                label: 'DOM',
                keys: ['document object model', 'web dom', 'html dom'],
            },
            {
                routerLink: '/utils/email',
                label: 'Email',
                keys: ['e-mail', 'mail', 'address', 'email utils'],
            },
            {
                routerLink: '/utils/enum',
                label: 'Enum',
                keys: ['enumeration', 'constants', 'enum utils'],
            },
            {
                routerLink: '/utils/file',
                label: 'File',
                keys: ['filesystem', 'file utils', 'file operations'],
            },
            {
                routerLink: '/utils/json',
                label: 'Json',
                keys: ['json parse', 'json stringify', 'json utils'],
            },
            {
                routerLink: '/utils/number',
                label: 'Number',
                keys: ['numeric', 'number utils', 'math'],
            },
            {
                routerLink: '/utils/object',
                label: 'Object',
                keys: ['objects', 'key value', 'object utils'],
            },
            {
                routerLink: '/utils/text',
                label: 'Text',
                keys: ['string', 'text utils', 'text operations'],
            },
            {
                routerLink: '/utils/subscriptions',
                label: 'Subscriptions',
                keys: ['observable', 'rxjs', 'subscription utils'],
            },
            {
                routerLink: '/utils/other',
                label: 'Other',
                keys: ['misc', 'miscellaneous', 'utilities'],
            },
        ],
    },
    {
        groupName: 'Styles',
        items: [
            {
                routerLink: '/style/buttons-links',
                label: 'Buttons & Links',
                keys: ['buttons', 'links', 'buttons links', 'ui buttons'],
            },
            {
                routerLink: '/style/icons',
                label: 'Icons',
                keys: ['glyphs', 'symbols', 'icon set'],
            },
            {
                routerLink: '/style/inputs',
                label: 'Inputs',
                keys: ['form inputs', 'fields', 'input styles'],
            },
            {
                routerLink: '/style/grid',
                label: 'Grid',
                keys: ['layout', 'row column', 'grid system'],
            },
            {
                routerLink: '/style/palette',
                label: 'Palette',
                keys: ['colors', 'color palette', 'theme colors'],
            },
        ],
    },
];
