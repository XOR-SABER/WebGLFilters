// strategy/factory class for palette
import { Palette } from "./Palette";

type Parser = (fileName: string, fileString: string) => Palette
export class PaletteFactory {
    private JSONParser: Parser = (fileName: string, fileString: string) => {

        // TODO:
        return {
            name: "",
            names: [],
            rgba: [],
            buffer: new Uint8Array([1, 1, 1, 1]),
            size: 0
        };
    };

    private ASEParser: Parser = (fileName: string, fileString: string) => {

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

        // TODO: 
        return {
            name: "",
            names: [],
            rgba: [],
            buffer: new Uint8Array([1, 1, 1, 1]),
            size: 0
        };
    }

    private GPLParser: Parser = (fileName: string, fileString: string) => {

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

