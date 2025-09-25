import { HTMLElements } from "../HtmlElements";
import { Palette } from "./Palette";

// Render the Palette to the HTML  
export const renderPalette = (palette: Palette, HTML: HTMLElements) => {
    if (!HTML.paletteGridElem) {
        HTML.ErrorCallBack("@ renderPalette: #palette-grid not found in DOM");
        return;
    }
    HTML.paletteGridElem.setAttribute("data-palette", "");
    HTML.paletteGridElem.innerHTML = "";

    const title = document.createElement("div");
    title.className = "pv-title";
    title.textContent = palette.name;
    HTML.paletteGridElem.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "pv-grid";
    HTML.paletteGridElem.appendChild(grid);

    for (let i = 0; i < palette.names.length; i++) {
        const name = palette.names[i];
        const [r, g, b, a] = palette.rgba[i];

        const item = document.createElement("button");
        item.type = "button";
        item.className = "pv-item";
        item.title = `${name} — rgba(${r}, ${g}, ${b}, ${a})`;
        item.style.background = `rgba(${r}, ${g}, ${b}, ${a / 255})`;

        item.addEventListener("click", async () => {
            const css = `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
            try { await navigator.clipboard.writeText(css); } catch { }
        });

        grid.appendChild(item);
    }
    HTML.toggleHiddenPaletteView(false);
};

// Clear the Palette
export const clearPalette = (HTML: HTMLElements) => {
    if (!HTML.paletteGridElem) {
        HTML.ErrorCallBack("@ clearPalette: #palette-grid not found in DOM");
        return;
    }
    HTML.paletteGridElem.innerHTML = "";
    HTML.paletteGridElem.removeAttribute("data-palette");

    HTML.toggleHiddenPaletteView(true);
};