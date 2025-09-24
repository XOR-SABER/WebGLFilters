// Class to hold HTML Elements of a page.. 
// Singleton because we only have one page, might as well manage the state globally
export class HTMLElements {
    // HTMLInputElements
    public fileIO: HTMLInputElement = fetchDoc<HTMLInputElement>('#file');

    // HTMLButtonElement
    public runBtn: HTMLButtonElement = fetchDoc<HTMLButtonElement>('#run');

    // HTMLImageElements
    public orgImgElem: HTMLImageElement = fetchDoc<HTMLImageElement>('#original');

    // HTMLAnchorElements
    public downloadBtn: HTMLAnchorElement = fetchDoc<HTMLAnchorElement>('#download');

    // HTMLElements
    public logElem: HTMLElement = fetchDoc<HTMLElement>('#log');
    public statusElem: HTMLElement = fetchDoc<HTMLElement>('#status');
    public paletteGrid: HTMLElement = fetchDoc<HTMLElement>('#palette-grid');
    public originalCol: HTMLElement = fetchDoc<HTMLElement>('#original-col');
    public processedCol: HTMLElement = fetchDoc<HTMLElement>('#processed-col');
    public paletteGridElem: HTMLElement = fetchDoc<HTMLElement>("#palette-grid");
    public paletteViewElem: HTMLElement = fetchDoc<HTMLElement>('#palette-view');

    // HTMLSelectElements
    public filterSelector: HTMLSelectElement = fetchDoc<HTMLSelectElement>('#mode');

    // Toggles for visibility 
    public toggleHiddenOriginalCol = (b: boolean) => (b) ? this.originalCol.classList.add("hidden") : this.originalCol.classList.remove("hidden")
    public toggleHiddenProcessedCol = (b: boolean) => (b) ? this.processedCol.classList.add("hidden") : this.processedCol.classList.remove("hidden")
    public toggleHiddenPaletteView = (b: boolean) => (b) ? this.paletteViewElem.classList.add("hidden") : this.paletteViewElem.classList.remove("hidden")

    // Setting status and log Error logs
    public setStatus = (m: string) => this.statusElem.textContent = m;
    public logError = (m: string) => this.logElem.textContent = m || '';

    // Error call back for HTML Elements
    public ErrorCallBack = (m: string) => {
        this.logError(m);
        throw new Error(m);
    }

    // Singleton getInstance function
    public static getInstance(): HTMLElements {
        if (!this.instance) this.instance = new HTMLElements();
        return this.instance
    }

    // Instance of HTMLElements
    private static instance: HTMLElements;
    
    // On page load.. hide the following.. 
    private constructor() {
        this.toggleHiddenOriginalCol(true);
        this.toggleHiddenPaletteView(true);
        this.toggleHiddenProcessedCol(true);

        // Default filter is none selected.. 
        this.filterSelector.selectedIndex = 0
    }
}

// Fetches from the document using the query selector
export const fetchDoc = <Type>(selector: string): Type => {
    return document.querySelector(selector) as Type
}

// Type for error callbacks.. 
export type OnError = (msg: string) => void;