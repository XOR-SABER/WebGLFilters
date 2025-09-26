import { HTMLElements } from "./HtmlElements";

export interface ImageFileResult {
    imageBitMap: ImageBitmap,
    fileName: string,
    width: number,
    height: number,
};

export interface TextFileResult {
    fileName: string,
    fileString: string,
};

export class FileHandler {
    public static readImage(file: File, html: HTMLElements): Promise<ImageFileResult> {
        return new Promise((resolve, reject) => {
            html.logError('');
            html.setStatus('Loading image..');

            createImageBitmap(file, { imageOrientation: "from-image" })
                .then((bmp) => {
                    const result: ImageFileResult = {
                        imageBitMap: bmp,
                        fileName: file.name,
                        width: bmp.width,
                        height: bmp.height
                    };

                    // Preview the original file
                    html.orgImgElem.src = URL.createObjectURL(file);

                    // Enable run button
                    html.runBtn.disabled = false;
                    html.setStatus(
                        `Image loaded: ${bmp.width}x${bmp.height}. Click "Run Shader".`
                    );

                    html.toggleHiddenOriginalCol(false);
                    resolve(result);
                })
                .catch((e) => {
                    html.runBtn.disabled = true;
                    html.ErrorCallBack("@ handleFileIO :\n" + e);
                    reject(e);
                });
        });
    };

    public static readFile(file: File, HTML: HTMLElements): Promise<TextFileResult> {
        return new Promise((resolve, reject) => {
            HTML.logError('');
            HTML.setStatus('Loading text file..');

            // Wrap FileReader in a temporary promise
            const readerPromise = new Promise<string>((res, rej) => {
                const reader = new FileReader();

                reader.onload = () => res(reader.result as string);
                reader.onerror = () => rej(reader.error);

                reader.readAsText(file);
            });

            readerPromise
                .then((text) => {
                    const result: TextFileResult = {
                        fileName: file.name,
                        fileString: text
                    };

                    HTML.setStatus(`File loaded: ${file.name} (${file.size} bytes)`);
                    resolve(result);
                })
                .catch((e) => {
                    HTML.runBtn.disabled = true;
                    HTML.ErrorCallBack("@ handleFileIO :\n" + e);
                    reject(e);
                });
        });
    };
};