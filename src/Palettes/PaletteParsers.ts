import { ImageFileResult, TextFileResult } from "../Application/FileHandler";
import { HTMLElements } from "../Application/HtmlElements";
import { EmptyPalette, Palette, RGBA } from "./Palette";

export type FileResult = TextFileResult | ImageFileResult;
export type Parser = (result: FileResult, html: HTMLElements) => Palette

// Interface:
// intermediate type for palette
interface PaletteEntry {
    name: string
    rgba: RGBA;
}

// Helpers:
// Checks if the value is a Uint8
const isUint8 = (v: unknown): v is number =>
    Number.isInteger(v) && (v as number) >= 0 && (v as number) <= 255;

// Checks if the value is a RGBA
const isRGBA = (x: unknown): x is RGBA =>
    Array.isArray(x) && x.length === 4 && x.every(isUint8);

const createBuffer = (rgba: RGBA, buff: Uint8Array, idx: number): Uint8Array => {
    const stride = idx * 4;
    buff[stride + 0] = rgba[0];
    buff[stride + 1] = rgba[1];
    buff[stride + 2] = rgba[2];
    buff[stride + 3] = rgba[3];
    return buff;
}

// Type check for imageFileResult
export const isImageFileResult = (v: FileResult): v is ImageFileResult =>
    v != null &&
    typeof v === "object" &&
    "imageBitMap" in v;

// Type check for textFileResult
export const isTextFileResult = (v: FileResult): v is TextFileResult =>
    v != null &&
    typeof v === "object" &&
    "fileString" in v;

// Classes: 
export class PaletteParsers {
    // Private Methods
    private JSONParser: Parser = (result: FileResult, html: HTMLElements) => {
        if (!isTextFileResult(result))
            html.ErrorCallBack("@JSONParser : A image result was passed, This should not happen.");
        const res = result as TextFileResult;
        let raw: any;
        let paletteName: string = "";

        // Attempt to parse
        try {
            raw = JSON.parse(res.fileString);
        } catch (e: any) {
            html.ErrorCallBack("@JSONParser : JSON is invalid");
        }

        // Validate JSON
        if (typeof raw !== "object" || raw === null)
            html.ErrorCallBack("@JSONParser : JSON must be an object with paletteName and entries");
        if (!raw.paletteName) paletteName = res.fileName;
        else paletteName = raw.paletteName;
        if (raw.paletteName && typeof raw.paletteName !== "string")
            html.ErrorCallBack("@JSONParser : paletteName must be a string");
        if (!raw.entries)
            html.ErrorCallBack("@JSONParser : Palette must have entries");
        if (!Array.isArray(raw.entries))
            html.ErrorCallBack("@JSONParser : entries must be an array");
        if (raw.entries.length === 0)
            html.ErrorCallBack("@JSONParser : entries array is empty");

        // Build the Palette
        const entries: PaletteEntry[] = raw.entries as PaletteEntry[];
        const size = entries.length;
        const names: string[] = new Array(size);
        const rgba: RGBA[] = new Array(size);
        const buffer: Uint8Array = new Uint8Array(size * 4);

        for (let i = 0; i < size; i++) {
            const entry = entries[i];
            names[i] = entry.name;
            const rgbaCheck = entry.rgba;
            if (!isRGBA(rgbaCheck)) html.ErrorCallBack("@JSONParser : entry is not a RGBA value");
            rgba[i] = rgbaCheck as RGBA
        }

        return { name: paletteName, names, rgba, buffer, size };
    };

    private ASEParser: Parser = (result: FileResult, html: HTMLElements) => {
        if (!isTextFileResult(result))
            html.ErrorCallBack("@ASEParser : A image result was passed, This should not happen.");
        const res = result as TextFileResult;



        // This seems like a issue bounty for github, because I don't have the time to do it 
        // TODO:
        html.ErrorCallBack("@ASEParser : This code is incomplete.. We cannot parse .ASE files yet, please export to another format");

        return EmptyPalette;
    }

    private HEXParser: Parser = (result: FileResult, html: HTMLElements) => {
        if (!isTextFileResult(result))
            html.ErrorCallBack("@HEXParser : A image result was passed, This should not happen.");
        const res = result as TextFileResult;
        // TODO:
        return EmptyPalette;
    }

    private IMGParser: Parser = (result: FileResult, html: HTMLElements) => {
        if (!isTextFileResult(result))
            html.ErrorCallBack("@IMGParser : A image result was passed, This should not happen.");
        const res = result as TextFileResult;

        // TODO: 
        return EmptyPalette;
    }

    private PaintParser: Parser = (result: FileResult, html: HTMLElements) => {
        if (!isTextFileResult(result))
            html.ErrorCallBack("@PaintParser : A image result was passed, This should not happen.");
        const res = result as TextFileResult;

        // TODO: 
        return EmptyPalette;
    }

    private GPLParser: Parser = (result: FileResult, html: HTMLElements) => {
        if (!isTextFileResult(result))
            html.ErrorCallBack("@GPLParser : A image result was passed, This should not happen.");
        const res = result as TextFileResult;
        const lines = res.fileString.trim().split(/\r?\n/);
        if (lines[0] !== "GIMP Palette")
            html.ErrorCallBack("@GPLParser  : A file invalid, does not start with 'GIMP Palette' Marker.");
        let tmp: string[] = lines[1].split(/:\s*/);
        if (tmp.length != 2)
            html.ErrorCallBack("@GPLParser : A file invalid, does not have a palette name.");
        // we can skip 2
        const name: string = tmp[1];
        tmp = lines[3].split(/:\s*/);
        if (tmp.length != 2)
            html.ErrorCallBack("@GPLParser : A file invalid, does not have a number of colors in the palette.");
        const size = parseInt(tmp[1]);
        const rgba: RGBA[] = new Array(size);
        let buffer: Uint8Array = new Uint8Array(size * 4);
        for (let i = 0; i < size; i++) {
            const current = lines[4 + i];
            const numbers = current.split(/\s+/);
            const rgbaCheck = [parseInt(numbers[0]), parseInt(numbers[1]), parseInt(numbers[2]), 255];
            if (!isRGBA(rgbaCheck)) html.ErrorCallBack("@GPLParser : entry is not a RGBA value");
            rgba[i] = rgbaCheck as RGBA
            buffer = createBuffer(rgba[i], buffer, i)
        }

        return { name: name, names: [], rgba, buffer, size };
    }

    private JASCParser: Parser = (result: FileResult, html: HTMLElements) => {
        if (!isTextFileResult(result))
            html.ErrorCallBack("@JASCParser : A image result was passed, This should not happen.");
        const res = result as TextFileResult;
        const lines = res.fileString.trim().split(/\r?\n/);
        if (lines[0] !== "JASC-PAL")
            html.ErrorCallBack("@JASCParser : A file invalid, does not start with JASC-PAL Marker.");
        if (lines[1] !== "0100")
            html.ErrorCallBack("@JASCParser : A file invalid, not correct version 0100.");
        const size = parseInt(lines[2]);
        const rgba: RGBA[] = new Array(size);
        let buffer: Uint8Array = new Uint8Array(size * 4);
        for (let i = 0; i < size; i++) {
            const currentLine = lines[3 + i];
            const numbers = currentLine.split(/\s+/);
            const rgbaCheck = [parseInt(numbers[0]), parseInt(numbers[1]), parseInt(numbers[2]), 255];
            if (!isRGBA(rgbaCheck)) html.ErrorCallBack("@JASCParser : entry is not a RGBA value");
            rgba[i] = rgbaCheck as RGBA
            buffer = createBuffer(rgba[i], buffer, i)
        }

        return { name: "", names: [], rgba, buffer, size };
    }

    private readonly parserByExt = new Map<string, Parser>([
        ["json", this.JSONParser],
        ["ase", this.ASEParser],
        ["hex", this.HEXParser],
        ["gpl", this.GPLParser],
        ["pal", this.JASCParser],
        ["txt", this.PaintParser], // for now
    ]);

    public getParser = (ext: string): Parser | undefined => this.parserByExt.get(ext);

};