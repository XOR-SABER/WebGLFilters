import { ImageFileResult, TextFileResult } from "../Application/FileHandler";
import { FileResult, isImageFileResult, PaletteParsers } from "./PaletteParsers";
import { HTMLElements } from "../Application/HtmlElements";
import { EmptyPalette, Palette} from "./Palette";


// Classes: 
export class PaletteFactory {
    private parsers: PaletteParsers = new PaletteParsers();
    // Public Methods
    public CreatePalette(result: FileResult, html:HTMLElements): Palette {
        if (isImageFileResult(result)) {
            const res = result as ImageFileResult;
            // TODO: Add Image Palette Loading
            return EmptyPalette;
        }
        const res: TextFileResult = result as TextFileResult;
        const extension: string = res.fileName.includes(".")
            ? res.fileName.split(".").pop()!.toLowerCase()
            : "";

        const parser = this.parsers.getParser(extension);
        if (parser == undefined) {
            

        }


        // Just return a empty palette
        return EmptyPalette;
    }
};

