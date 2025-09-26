import { HTMLElements } from "../Application/HtmlElements";
import { FileHandler } from "../Application/FileHandler";

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
    <div id="palette-file-upload"></div>
    <select id="filter-mode"><option>None</option></select>
    <select id="palette-selector"><option>None</option></select>
  `;
}

const g: any = globalThis as any;
const origCreateImageBitmap = g.createImageBitmap;
const origCreateObjectURL = URL.createObjectURL;
const origFileReader = g.FileReader;

class FR {
    result: string | ArrayBuffer | null = null;
    error: any = null;
    onload: any = null;
    onerror: any = null;
    readAsText(_f: File) { }
}

const bmp = (w: number, h: number) => ({ width: w, height: h }) as unknown as ImageBitmap;


describe("FileHandler Adapter", () => {
    beforeEach(() => {
        setupDOM();
        (HTMLElements as any).instance = undefined;
        g.createImageBitmap = jest.fn();
        URL.createObjectURL = jest.fn(() => "blob://u");
        g.FileReader = FR;
    });

    afterEach(() => {
        jest.clearAllMocks();
        g.createImageBitmap = origCreateImageBitmap;
        URL.createObjectURL = origCreateObjectURL;
        g.FileReader = origFileReader;
    });

    it("@ FileHandler readImage: success", async () => {
        const html = HTMLElements.getInstance();
        const toggleSpy = jest.spyOn(html, "toggleHiddenOriginalCol");
        (g.createImageBitmap as jest.Mock).mockResolvedValue(bmp(640, 480));

        const file = new File(["x"], "pic.png", { type: "image/png" });
        const res = await FileHandler.readImage(file, html);

        expect(res.fileName).toBe("pic.png");
        expect(res.width).toBe(640);
        expect(res.height).toBe(480);
        expect(html.orgImgElem.src).toBe("blob://u");
        expect(html.runBtn.disabled).toBe(false);
        expect(html.statusElem.textContent).toContain("Image loaded: 640x480");
        expect(toggleSpy).toHaveBeenCalledWith(false);
    });

    it("@ FileHandler readImage: error path disables button and calls ErrorCallBack", async () => {
        const html = HTMLElements.getInstance();
        const errSpy = jest.spyOn(html, "ErrorCallBack").mockImplementation((() => undefined) as never);
        (g.createImageBitmap as jest.Mock).mockRejectedValue(new Error("boom"));

        await expect(FileHandler.readImage(new File(["x"], "bad.png"), html)).rejects.toThrow("boom");

        expect(html.runBtn.disabled).toBe(true);
        expect(errSpy).toHaveBeenCalled();
    });

    it("@ FileHandler readFile: success", async () => {
        const html = HTMLElements.getInstance();
        g.FileReader = class extends FR {
            readAsText() {
                setTimeout(() => {
                    this.result = "hello world";
                    this.onload?.({});
                }, 0);
            }
        };

        const res = await FileHandler.readFile(new File(["hello world"], "hello.txt"), html);
        expect(res.fileName).toBe("hello.txt");
        expect(res.fileString).toBe("hello world");
        expect(html.statusElem.textContent).toContain("File loaded: hello.txt (11 bytes)");
    });

    it("@ FileHandler readFile: onerror rejects; sync-throw rejects; disables button & calls ErrorCallBack", async () => {
        const html = HTMLElements.getInstance();
        const errSpy = jest.spyOn(html, "ErrorCallBack").mockImplementation((() => undefined) as never);

        // onerror path
        g.FileReader = class extends FR {
            readAsText() {
                setTimeout(() => {
                    this.error = new Error("reader-fail");
                    this.onerror?.({});
                }, 0);
            }
        };
        await expect(FileHandler.readFile(new File(["data"], "nope.txt"), html)).rejects.toBeInstanceOf(Error);
        expect(html.runBtn.disabled).toBe(true);
        expect(errSpy).toHaveBeenCalled();

        // sync-throw path
        (html.runBtn as HTMLButtonElement).disabled = false; // reset
        g.FileReader = class extends FR {
            readAsText() {
                throw new Error("sync-throw");
            }
        };
        await expect(FileHandler.readFile(new File(["x"], "throw.txt"), html)).rejects.toThrow("sync-throw");
        expect(html.runBtn.disabled).toBe(true);
        expect(errSpy).toHaveBeenCalled();
    });
});