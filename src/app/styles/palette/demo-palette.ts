/** Values shipped by the library, and the reset target. */
export const DEFAULTS = {
    primaryH: 210,
    primaryS: 15,
    primarySsoft: 5,
    neutralH: 0,
    neutralS: 0,
    alertH: 0,
    warnH: 15,
    successH: 120,
};

type KnobName = keyof typeof DEFAULTS;

type KnobValues = Record<KnobName, number>;

/** A preset theme that maps to the library knobs. */
export interface PaletteTheme {
    name: string;
    description: string;
    values: KnobValues;
}

/** Classic color-palette-based themes. */
export const THEMES: PaletteTheme[] = [
    {
        name: 'Ocean',
        description: 'Cool blue tones with pure grey neutrals — the library default.',
        values: DEFAULTS,
    },
    {
        name: 'Forest',
        description: 'Earthy green primary with warm-tinted neutrals.',
        values: {
            primaryH: 150,
            primaryS: 20,
            primarySsoft: 8,
            neutralH: 90,
            neutralS: 4,
            alertH: 0,
            warnH: 30,
            successH: 145,
        },
    },
    {
        name: 'Sunset',
        description: 'Warm orange-red primary, analogous warm neutrals.',
        values: {
            primaryH: 20,
            primaryS: 25,
            primarySsoft: 10,
            neutralH: 20,
            neutralS: 5,
            alertH: 350,
            warnH: 40,
            successH: 160,
        },
    },
    {
        name: 'Lavender',
        description: 'Soft purple primary with subtle violet neutrals.',
        values: {
            primaryH: 270,
            primaryS: 18,
            primarySsoft: 7,
            neutralH: 260,
            neutralS: 3,
            alertH: 0,
            warnH: 30,
            successH: 150,
        },
    },
    {
        name: 'Rose',
        description: 'Pink-tinted interface with delicate warm neutrals.',
        values: {
            primaryH: 340,
            primaryS: 20,
            primarySsoft: 8,
            neutralH: 340,
            neutralS: 3,
            alertH: 0,
            warnH: 25,
            successH: 160,
        },
    },
    {
        name: 'Teal',
        description: 'Cyan-green primary, cool neutrals — modern SaaS feel.',
        values: {
            primaryH: 180,
            primaryS: 22,
            primarySsoft: 8,
            neutralH: 200,
            neutralS: 4,
            alertH: 0,
            warnH: 30,
            successH: 140,
        },
    },
    {
        name: 'Slate',
        description: 'Desaturated blue-grey — professional and understated.',
        values: {
            primaryH: 220,
            primaryS: 8,
            primarySsoft: 3,
            neutralH: 220,
            neutralS: 5,
            alertH: 0,
            warnH: 20,
            successH: 130,
        },
    },
    {
        name: 'Gold',
        description: 'Amber/gold primary with warm stone neutrals — luxury feel.',
        values: {
            primaryH: 45,
            primaryS: 30,
            primarySsoft: 12,
            neutralH: 40,
            neutralS: 5,
            alertH: 0,
            warnH: 20,
            successH: 150,
        },
    },
    {
        name: 'Monochrome',
        description: 'Zero saturation everywhere — pure grayscale.',
        values: {
            primaryH: 0,
            primaryS: 0,
            primarySsoft: 0,
            neutralH: 0,
            neutralS: 0,
            alertH: 0,
            warnH: 30,
            successH: 120,
        },
    },
    {
        name: 'Nord',
        description: 'Inspired by the Nord palette — arctic blue with muted saturation.',
        values: {
            primaryH: 213,
            primaryS: 20,
            primarySsoft: 8,
            neutralH: 220,
            neutralS: 6,
            alertH: 355,
            warnH: 35,
            successH: 140,
        },
    },
    {
        name: 'Dracula',
        description: 'Deep blood-red accent with dark warm-red neutrals — gothic mood.',
        values: {
            primaryH: 0,
            primaryS: 25,
            primarySsoft: 10,
            neutralH: 0,
            neutralS: 8,
            alertH: 0,
            warnH: 30,
            successH: 135,
        },
    },
    {
        name: 'Solarized',
        description: 'Inspired by the Solarized palette — yellow-tinged neutrals, cyan accent.',
        values: {
            primaryH: 175,
            primaryS: 22,
            primarySsoft: 8,
            neutralH: 45,
            neutralS: 6,
            alertH: 0,
            warnH: 18,
            successH: 120,
        },
    },
];

/** A palette variable exposed as a slider. */
export interface PaletteKnob {
    name: KnobName;
    /** CSS custom property it drives. */
    variable: string;
    label: string;
    min: number;
    max: number;
    /** Unit appended to the value, e.g. '%' for saturations. */
    unit: '' | '%';
}
