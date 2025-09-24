import { HTMLElements, fetchDoc } from "../HtmlElements"

function setupDOM() {
    document.body.innerHTML = `
    <input id="file" />
    <button id="run"></button>
    <img id="original" />
    <a id="download"></a>
    <div id="log"></div>
    <div id="status"></div>
    <div id="palette-grid"></div>
    <div id="original-col"></div>
    <div id="processed-col"></div>
    <div id="palette-view"></div>
    <select id="mode">
      <option>None</option>
      <option>Filter</option>
    </select>
  `;
}

describe("HTMLElements singleton", () => {
    beforeEach(() => {
        setupDOM();
        (HTMLElements as any).instance = undefined; // reset singleton
    });

    it("should always return the same singleton instance", () => {
        const a = HTMLElements.getInstance();
        const b = HTMLElements.getInstance();
        expect(a).toBe(b);
    });

    it("should create singleton instance with correct elements", () => {
        const elements = HTMLElements.getInstance();
        expect(elements.fileIO).toBeInstanceOf(HTMLInputElement);
        expect(elements.runBtn).toBeInstanceOf(HTMLButtonElement);
        expect(elements.orgImgElem).toBeInstanceOf(HTMLImageElement);
        expect(elements.downloadBtn).toBeInstanceOf(HTMLAnchorElement);
        expect(elements.logElem).toBeInstanceOf(HTMLElement);
        expect(elements.statusElem).toBeInstanceOf(HTMLElement);
        expect(elements.filterSelector).toBeInstanceOf(HTMLSelectElement);
    });

    it("should set default filter selector index to 0", () => {
        const elements = HTMLElements.getInstance();
        expect(elements.filterSelector.selectedIndex).toBe(0);
    });

    it("should hide original, processed, and palette on init", () => {
        const elements = HTMLElements.getInstance();
        expect(elements.originalCol.classList.contains("hidden")).toBe(true);
        expect(elements.processedCol.classList.contains("hidden")).toBe(true);
        expect(elements.paletteViewElem.classList.contains("hidden")).toBe(true);
    });

    it("toggleHiddenOriginalCol should add/remove hidden", () => {
        const elements = HTMLElements.getInstance();
        elements.toggleHiddenOriginalCol(false);
        expect(elements.originalCol.classList.contains("hidden")).toBe(false);
        elements.toggleHiddenOriginalCol(true);
        expect(elements.originalCol.classList.contains("hidden")).toBe(true);
    });

    it("toggleHiddenProcessedCol should add/remove hidden", () => {
        const elements = HTMLElements.getInstance();
        elements.toggleHiddenProcessedCol(false);
        expect(elements.processedCol.classList.contains("hidden")).toBe(false);
        elements.toggleHiddenProcessedCol(true);
        expect(elements.processedCol.classList.contains("hidden")).toBe(true);
    });

    it("toggleHiddenPaletteView should add/remove hidden", () => {
        const elements = HTMLElements.getInstance();
        elements.toggleHiddenPaletteView(false);
        expect(elements.paletteViewElem.classList.contains("hidden")).toBe(false);
        elements.toggleHiddenPaletteView(true);
        expect(elements.paletteViewElem.classList.contains("hidden")).toBe(true);
    });

    it("setStatus should update status text", () => {
        const elements = HTMLElements.getInstance();
        elements.setStatus("Hello");
        expect(elements.statusElem.textContent).toBe("Hello");
    });

    it("logError should set log text", () => {
        const elements = HTMLElements.getInstance();
        elements.logError("Something went wrong");
        expect(elements.logElem.textContent).toBe("Something went wrong");
    });

    it("logError with empty string should clear log", () => {
        const elements = HTMLElements.getInstance();
        elements.logError("");
        expect(elements.logElem.textContent).toBe("");
    });

    it("ErrorCallBack should throw and log", () => {
        const elements = HTMLElements.getInstance();
        expect(() => elements.ErrorCallBack("fatal error")).toThrow("fatal error");
        expect(elements.logElem.textContent).toBe("fatal error");
    });

    it("fetchDoc should return typed element", () => {
        setupDOM();
        const btn = fetchDoc<HTMLButtonElement>("#run");
        expect(btn).toBeInstanceOf(HTMLButtonElement);
    });

    it("fetchDoc should return null if selector missing (unsafe cast)", () => {
        const missing = fetchDoc<HTMLElement>("#does-not-exist");
        expect(missing).toBeNull();
    });
});
