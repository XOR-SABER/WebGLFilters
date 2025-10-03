// I might as well define it in here.. for ease of use.. 
export const defaultPalette = `{
"paletteName": "Wplace Palette",
  "entries": [
        { "name": "BLACK", "rgba": [0, 0, 0, 255] },
        { "name": "DARK_GRAY", "rgba": [60, 60, 60, 255] },
        { "name": "GRAY", "rgba": [120, 120, 120, 255] },
        { "name": "MEDIUM_GRAY", "rgba": [170, 170, 170, 255] },
        { "name": "LIGHT_GRAY", "rgba": [210, 210, 210, 255] },
        { "name": "WHITE", "rgba": [255, 255, 255, 255] },
        { "name": "DEEP_RED", "rgba": [96, 0, 24, 255] },
        { "name": "DARK_RED", "rgba": [165, 14, 30, 255] },
        { "name": "RED", "rgba": [237, 28, 36, 255] },
        { "name": "LIGHT_RED", "rgba": [250, 128, 114, 255] },
        { "name": "DARK_ORANGE", "rgba": [228, 92, 26, 255] },
        { "name": "ORANGE", "rgba": [255, 127, 39, 255] },
        { "name": "GOLD", "rgba": [246, 170, 9, 255] },
        { "name": "YELLOW", "rgba": [249, 221, 59, 255] },
        { "name": "LIGHT_YELLOW", "rgba": [255, 250, 188, 255] },
        { "name": "DARK_GOLDENROD", "rgba": [156, 132, 49, 255] },
        { "name": "GOLDENROD", "rgba": [197, 173, 49, 255] },
        { "name": "LIGHT_GOLDENROD", "rgba": [232, 212, 95, 255] },
        { "name": "DARK_OLIVE", "rgba": [74, 107, 58, 255] },
        { "name": "OLIVE", "rgba": [90, 148, 74, 255] },
        { "name": "LIGHT_OLIVE", "rgba": [132, 197, 115, 255] },
        { "name": "DARK_GREEN", "rgba": [14, 185, 104, 255] },
        { "name": "GREEN", "rgba": [19, 230, 123, 255] },
        { "name": "LIGHT_GREEN", "rgba": [135, 255, 94, 255] },
        { "name": "DARK_TEAL", "rgba": [12, 129, 110, 255] },
        { "name": "TEAL", "rgba": [16, 174, 166, 255] },
        { "name": "LIGHT_TEAL", "rgba": [19, 225, 190, 255] },
        { "name": "DARK_CYAN", "rgba": [15, 121, 159, 255] },
        { "name": "CYAN", "rgba": [96, 247, 242, 255] },
        { "name": "LIGHT_CYAN", "rgba": [187, 250, 242, 255] },
        { "name": "DARK_BLUE", "rgba": [40, 80, 158, 255] },
        { "name": "BLUE", "rgba": [64, 147, 228, 255] },
        { "name": "LIGHT_BLUE", "rgba": [125, 199, 255, 255] },
        { "name": "DARK_INDIGO", "rgba": [77, 49, 184, 255] },
        { "name": "INDIGO", "rgba": [107, 80, 246, 255] },
        { "name": "LIGHT_INDIGO", "rgba": [153, 177, 251, 255] },
        { "name": "DARK_SLATE_BLUE", "rgba": [74, 66, 132, 255] },
        { "name": "SLATE_BLUE", "rgba": [122, 113, 196, 255] },
        { "name": "LIGHT_SLATE_BLUE", "rgba": [181, 174, 241, 255] },
        { "name": "DARK_PURPLE", "rgba": [120, 12, 153, 255] },
        { "name": "PURPLE", "rgba": [170, 56, 185, 255] },
        { "name": "LIGHT_PURPLE", "rgba": [224, 159, 249, 255] },
        { "name": "DARK_PINK", "rgba": [203, 0, 122, 255] },
        { "name": "PINK", "rgba": [236, 31, 128, 255] },
        { "name": "LIGHT_PINK", "rgba": [243, 141, 169, 255] },
        { "name": "DARK_PEACH", "rgba": [155, 82, 73, 255] },
        { "name": "PEACH", "rgba": [209, 128, 120, 255] },
        { "name": "LIGHT_PEACH", "rgba": [250, 182, 164, 255] },
        { "name": "DARK_BROWN", "rgba": [104, 70, 52, 255] },
        { "name": "BROWN", "rgba": [149, 104, 42, 255] },
        { "name": "LIGHT_BROWN", "rgba": [219, 164, 99, 255] },
        { "name": "DARK_TAN", "rgba": [123, 99, 82, 255] },
        { "name": "TAN", "rgba": [156, 132, 107, 255] },
        { "name": "LIGHT_TAN", "rgba": [214, 181, 148, 255] },
        { "name": "DARK_BEIGE", "rgba": [209, 128, 81, 255] },
        { "name": "BEIGE", "rgba": [248, 178, 119, 255] },
        { "name": "LIGHT_BEIGE", "rgba": [255, 197, 165, 255] },
        { "name": "DARK_STONE", "rgba": [109, 100, 63, 255] },
        { "name": "STONE", "rgba": [148, 140, 107, 255] },
        { "name": "LIGHT_STONE", "rgba": [205, 197, 158, 255] },
        { "name": "DARK_SLATE", "rgba": [51, 57, 65, 255] },
        { "name": "SLATE", "rgba": [109, 117, 141, 255] },
        { "name": "LIGHT_SLATE", "rgba": [179, 185, 209, 255] },
        { "name": "TRANSPARENT", "rgba": [0, 0, 0, 0] }
    ]
}`;

// Just defining a struct to hold our palettes. 
export type RGBA = [number, number, number, number];
export interface Palette {
    name: string;
    names: string[];
    rgba: RGBA[];
    buffer: Uint8Array;
    size: number;
    paletteSlot?: number;
}

// The empty palette for returning empties
export const EmptyPalette: Palette = {
    name: "",
    names: [],
    rgba: [],
    buffer: new Uint8Array([]),
    size: 0,
};

// Checking for empties
export const CheckEmptyPalette = (p: Palette): boolean =>
    p.name === "" && p.names.length === 0 && p.rgba.length === 0 &&
    p.buffer.length === 0 && p.size === 0;