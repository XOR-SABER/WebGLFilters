import { HTMLElements } from "../Application/HtmlElements";
import { Palette, RGBA } from "./Palette";

type Parser = (fileName: string, fileString: string) => Palette
// intermediate type for palette
interface PaletteEntry {
    name: string
    rgba: RGBA;
}
// Helper function to make things a bit easier

// Checks if the value is a Uint8
const isUint8 = (v: unknown): v is number =>
    Number.isInteger(v) && (v as number) >= 0 && (v as number) <= 255;

// Checks if the value is a RGBA
const isRGBA = (x: unknown): x is RGBA =>
    Array.isArray(x) && x.length === 4 && x.every(isUint8);

export class PaletteFactory {

    private html: HTMLElements = HTMLElements.getInstance() as HTMLElements;

    private JSONParser: Parser = (fileName: string, fileString: string) => {
        const html: HTMLElements = this.html;
        let raw: any;
        let tmpName: string = "";

        // Attempt to parse
        try {
            raw = JSON.parse(fileString);
        } catch (e: any) {
            html.ErrorCallBack("@JSONParser : JSON is invalid");
        }

        // Validate JSON
        if (typeof raw !== "object" || raw === null)
            html.ErrorCallBack("@JSONParser : JSON must be an object with paletteName and entries");
        if (!raw.paletteName) tmpName = fileName;
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

        return { name: raw.paletteName, names, rgba, buffer, size };
    };

    private ASEParser: Parser = (fileName: string, fileString: string) => {
        const html: HTMLElements = this.html;
        const raw: string = fileString;



        // TODO:
        return {
            name: "",
            names: [],
            rgba: [],
            buffer: new Uint8Array([1, 1, 1, 1]),
            size: 0
        };
    }
    
    private HEXParser: Parser = (fileName: string, fileString: string) => {
        const html: HTMLElements = this.html;
        const raw: string = fileString;
        // TODO:
        return {
            name: "",
            names: [],
            rgba: [],
            buffer: new Uint8Array([1, 1, 1, 1]),
            size: 0
        };
    }

    private IMGParser: Parser = (fileName: string, fileString: string) => {
        const html: HTMLElements = this.html;
        const raw: string = fileString;
        // TODO: 
        return {
            name: "",
            names: [],
            rgba: [],
            buffer: new Uint8Array([1, 1, 1, 1]),
            size: 0
        };
    }

    private PaintParser: Parser = (fileName: string, fileString: string) => {
        const html: HTMLElements = this.html;
        const raw: string = fileString;

        return {
            name: "",
            names: [],
            rgba: [],
            buffer: new Uint8Array([1, 1, 1, 1]),
            size: 0
        };
    }

    private GPLParser: Parser = (fileName: string, fileString: string) => {
        const html: HTMLElements = this.html;
        const raw: string = fileString;
        // TODO: 
        return {
            name: "",
            names: [],
            rgba: [],
            buffer: new Uint8Array([1, 1, 1, 1]),
            size: 0
        };
    }

    private JASCParser: Parser = (fileName: string, fileString: string) => {
        const html: HTMLElements = this.html;
        const raw: string = fileString;
        // TODO: 
        return {
            name: "",
            names: [],
            rgba: [],
            buffer: new Uint8Array([1, 1, 1, 1]),
            size: 0
        };
    }

    private registry: Parser[] = [this.JSONParser, this.ASEParser, this.HEXParser, this.IMGParser, this.PaintParser, this.GPLParser, this.JASCParser];

    constructor(fileName: string, fileString: string) {

    }
};

