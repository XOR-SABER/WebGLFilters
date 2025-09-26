import { ImageFileResult, TextFileResult } from "../Application/FileHandler";
import { HTMLElements } from "../Application/HtmlElements";
import { EmptyPalette, Palette, RGBA } from "./Palette";

export type FileResult = TextFileResult | ImageFileResult;
type Parser = (result: FileResult, html: HTMLElements) => Palette

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
            if (!isRGBA(entry.rgba)) html.ErrorCallBack("@createPalette : entry is not a RGBA value");
            rgba[i] = entry.rgba;

            // Build the buffer
            const tmp = i * 4;
            buffer[tmp + 0] = entry.rgba[0];
            buffer[tmp + 1] = entry.rgba[1];
            buffer[tmp + 2] = entry.rgba[2];
            buffer[tmp + 3] = entry.rgba[3];
        }

        return { name: paletteName, names, rgba, buffer, size };
    };

    private ASEParser: Parser = (result: FileResult, html: HTMLElements) => {
        if (!isTextFileResult(result))
            html.ErrorCallBack("@ASEParser : A image result was passed, This should not happen.");
        const res = result as TextFileResult;


        // TODO:
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

        // TODO: 
        return EmptyPalette;
    }

    private JASCParser: Parser = (result: FileResult, html: HTMLElements) => {
        if (!isTextFileResult(result))
            html.ErrorCallBack("@JASCParser : A image result was passed, This should not happen.");
        const res = result as TextFileResult;

        // TODO: 
        return EmptyPalette;
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