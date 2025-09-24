import "./style.css";
import { GLManagement } from "./GL/GLManagement";
import { HTMLElements } from "./HtmlElements";

const application = () => {
    // Just get our singletons.. 
    const manager = GLManagement.getInstance();
    const html = HTMLElements.getInstance();
    html.fileIO.addEventListener("change", async () => {
        html.toggleHiddenProcessedCol(true);
        const f = html.fileIO.files?.[0];
        if (f) void manager.handleFileIO(f); // fire-and-forget
    });

    html.runBtn.addEventListener("click", () => manager.runProg());

    html.filterSelector.addEventListener('change', (event) => {
        const selection = event.target as HTMLSelectElement;
        manager.setShaderSelection(selection.selectedIndex - 1);
    })
}

// A way to load the main function when the DOM loads.. 
document.addEventListener("DOMContentLoaded", application);