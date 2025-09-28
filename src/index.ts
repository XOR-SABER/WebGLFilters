import { PaletteFactory } from "./Palettes/PalletteFactory";
import { HTMLElements } from "./Application/HtmlElements";
import { FileHandler } from "./Application/FileHandler";
import { GLManagement } from "./GL/GLManagement";

import "./style.css";


const application = () => {
    // Just get our singletons.. 
    const manager = GLManagement.getInstance();
    const html = HTMLElements.getInstance();
    const paletteFactory = new PaletteFactory(); 
    // File IO stuff
    html.fileIO.addEventListener("change", async () => {
        html.toggleHiddenProcessedCol(true);
        const f = html.fileIO.files?.[0];
        if (!f) return;
        const result = await FileHandler.readImage(f, html);
        manager.setImageProperties(result);

    });

    html.paletteFileIO.addEventListener("change", async () => {
        const f = html.paletteFileIO.files?.[0];
        if (!f) return;
        const result = await FileHandler.readFile(f, html);
        console.log(result);

        const palette = paletteFactory.CreatePalette(result, html);
        console.log(palette);
    })

    html.runBtn.addEventListener("click", () => manager.runProg());

    html.filterSelector.addEventListener('change', (event) => {
        const selection = event.target as HTMLSelectElement;
        manager.setShaderSelection(selection.selectedIndex - 1);
    });

    html.paletteSelector.addEventListener('change', (event) => {
        const selection = event.target as HTMLSelectElement;
        if (selection.value === "Custom") html.toggleHiddenPaletteFileUpload(false);
        else html.toggleHiddenPaletteFileUpload(true);
    });
}

// A way to load the main function when the DOM loads.. 
document.addEventListener("DOMContentLoaded", application);