/** Labels for the main css-var-editor component. */
export interface CssVarEditorLabels {
    search: string;
    searchPlaceholder: string;
    resetAll: string;
    copyChanges: string;
    noResults: string;
}

export const DEFAULT_EDITOR_LABELS: CssVarEditorLabels = {
    search: 'Search',
    searchPlaceholder: 'Search a variable...',
    resetAll: 'Reset all',
    copyChanges: 'Copy changes',
    noResults: 'No variables found.',
};

/** Labels for the css-var-item component. */
export interface CssVarItemLabels {
    reset: string;
    typedMode: string;
    textMode: string;
}

export const DEFAULT_ITEM_LABELS: CssVarItemLabels = {
    reset: 'Reset',
    typedMode: 'Typed mode',
    textMode: 'Text mode',
};

/** Labels for the shadow editor. */
export interface ShadowEditorLabels {
    copy: string;
    layer: string;
    addLayer: string;
    x: string;
    y: string;
    blur: string;
    spread: string;
    color: string;
    inset: string;
}

export const DEFAULT_SHADOW_LABELS: ShadowEditorLabels = {
    copy: 'Copy',
    layer: 'Layer',
    addLayer: '+ Add layer',
    x: 'X',
    y: 'Y',
    blur: 'Blur',
    spread: 'Spread',
    color: 'Color',
    inset: 'Inset',
};

/** Labels for the gradient editor. */
export interface GradientEditorLabels {
    copy: string;
    angle: string;
    stop: string;
    addStop: string;
    color: string;
    position: string;
}

export const DEFAULT_GRADIENT_LABELS: GradientEditorLabels = {
    copy: 'Copy',
    angle: 'Angle',
    stop: 'Stop',
    addStop: '+ Add stop',
    color: 'Color',
    position: 'Position',
};

/** Labels for the border editor. */
export interface BorderEditorLabels {
    copy: string;
    width: string;
    radius: string;
    color: string;
    preview: string;
}

export const DEFAULT_BORDER_LABELS: BorderEditorLabels = {
    copy: 'Copy',
    width: 'Width',
    radius: 'Radius',
    color: 'Color',
    preview: 'Preview',
};

/** Labels for the color-mix editor. */
export interface ColorMixEditorLabels {
    copy: string;
    color1: string;
    color2: string;
    mix: string;
}

export const DEFAULT_COLOR_MIX_LABELS: ColorMixEditorLabels = {
    copy: 'Copy',
    color1: 'Color 1',
    color2: 'Color 2',
    mix: 'Mix',
};

/** Labels for the filter editor. */
export interface FilterEditorLabels {
    copy: string;
    reset: string;
    preview: string;
    brightness: string;
    contrast: string;
    saturate: string;
    grayscale: string;
    sepia: string;
    hueRotate: string;
    invert: string;
    blur: string;
    opacity: string;
}

export const DEFAULT_FILTER_LABELS: FilterEditorLabels = {
    copy: 'Copy',
    reset: 'Reset',
    preview: 'Filter preview',
    brightness: 'Brightness',
    contrast: 'Contrast',
    saturate: 'Saturate',
    grayscale: 'Grayscale',
    sepia: 'Sepia',
    hueRotate: 'Hue rotate',
    invert: 'Invert',
    blur: 'Blur',
    opacity: 'Opacity',
};

/** Labels for the transform editor. */
export interface TransformEditorLabels {
    copy: string;
    reset: string;
    preview: string;
    translateX: string;
    translateY: string;
    scaleX: string;
    scaleY: string;
    rotation: string;
    skewX: string;
    skewY: string;
}

export const DEFAULT_TRANSFORM_LABELS: TransformEditorLabels = {
    copy: 'Copy',
    reset: 'Reset',
    preview: 'Preview',
    translateX: 'Translate X',
    translateY: 'Translate Y',
    scaleX: 'Scale X',
    scaleY: 'Scale Y',
    rotation: 'Rotation',
    skewX: 'Skew X',
    skewY: 'Skew Y',
};

/** Labels for the typography editor. */
export interface TypographyEditorLabels {
    copy: string;
    sampleText: string;
    fontFamily: string;
    size: string;
    lineHeight: string;
    letterSpacing: string;
    color: string;
}

export const DEFAULT_TYPOGRAPHY_LABELS: TypographyEditorLabels = {
    copy: 'Copy',
    sampleText: 'Sample text',
    fontFamily: 'Font family',
    size: 'Size',
    lineHeight: 'Line height',
    letterSpacing: 'Letter spacing',
    color: 'Color',
};
