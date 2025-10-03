import { compressToUTF16, decompressFromUTF16 } from "lz-string";
import { Palette } from "./Palette";
import { HTMLElements } from "../Application/HtmlElements";

// App constants
const LOCAL_STORAGE_MAX_BYTES = 5_000_000; // advisory budget
const MAX_NUM_PALETTES_SLOTS = 64;
const KEY = (slot: number) => `pal:${slot}`; // avoid collisions with other data

// Tracks bytes actually stored (compressed, UTF-16)
let numberOfBytesUsed = 0;

// ---- helpers ----
const compressedPalette = (palette: Palette): string =>
    compressToUTF16(JSON.stringify(palette));

// bytes localStorage uses for a JS string (UTF-16 code units * 2 bytes)
const utf16StoredBytes = (s: string): number => s.length * 2;

// Remove only our keys
const clearLocal = (): void => {
    for (let i = 0; i < MAX_NUM_PALETTES_SLOTS; i++) {
        localStorage.removeItem(KEY(i));
    }
    numberOfBytesUsed = 0;
};

// Find the first free slot
const getPaletteSlot = (): number => {
    for (let i = 0; i < MAX_NUM_PALETTES_SLOTS; i++) {
        if (localStorage.getItem(KEY(i)) === null) return i;
    }
    return -1;
};

const sendToLocal = (palette: Palette, html: HTMLElements): void => {
    // pick a slot
    const slot = getPaletteSlot();
    if (slot === -1) {
        html.ErrorCallBack("@ sendToLocal : Out of slots, MAX_NUM_PALETTES_SLOTS = 64");
        return;
    }

    palette.paletteSlot = slot;

    const compressed = compressedPalette(palette);
    const additionalBytes = utf16StoredBytes(compressed);

    if (numberOfBytesUsed + additionalBytes > LOCAL_STORAGE_MAX_BYTES) {
        html.ErrorCallBack("@ sendToLocal : Out of Memory, only 5 MB");
        return;
    }

    try {
        localStorage.setItem(KEY(slot), compressed);
    } catch {
        html.ErrorCallBack("@ sendToLocal : QUOTA_EXCEEDED");
        return;
    }

    numberOfBytesUsed += additionalBytes;
};

const removeFromLocal = (palette: Palette, html: HTMLElements): void => {
    if (palette.paletteSlot == null) {
        html.ErrorCallBack("@ removeFromLocal : Palette does not have slot");
        return;
    }

    const key = KEY(palette.paletteSlot);
    const stored = localStorage.getItem(key);
    if (stored === null) {
        html.ErrorCallBack("@ removeFromLocal : Could not find item");
        return;
    }

    const decompressed = decompressFromUTF16(stored);
    if (decompressed == null) {
        html.ErrorCallBack("@ removeFromLocal : Corrupted stored data");
        return;
    }

    const original = JSON.stringify(palette);
    if (decompressed !== original) {
        html.ErrorCallBack("@ removeFromLocal : Attempt to remove non matching palette");
        return;
    }

    numberOfBytesUsed -= utf16StoredBytes(stored);
    if (numberOfBytesUsed < 0) numberOfBytesUsed = 0;

    localStorage.removeItem(key);
};

const getFromLocal = (html: HTMLElements): Palette[] => {
    const list: Palette[] = [];

    numberOfBytesUsed = 0;

    for (let i = 0; i < MAX_NUM_PALETTES_SLOTS; i++) {
        const key = KEY(i);
        const item = localStorage.getItem(key);
        if (item === null) continue;

        const json = decompressFromUTF16(item);
        if (json == null) {
            html.ErrorCallBack("@ getFromLocal : Corrupted Palette or Unrecognized Object");
            continue;
        }

        try {
            const palette: Palette = JSON.parse(json);
            list.push(palette);
            numberOfBytesUsed += utf16StoredBytes(item); // count what we actually stored
        } catch {
            html.ErrorCallBack("@ getFromLocal : Corrupted Palette JSON");
        }
    }

    return list;
};
