import { createPaletteTexture, createTextureFromBitmap } from "../GL/GLHelpers"
import { createPalette, defaultPalette, Palette } from "../Palettes/Palette";
import { renderPalette, clearPalette } from "../Palettes/PaletteElements";
import { GLShader, setupShaders, setupVAO } from "../GL/GLShader"
import { HTMLElements, fetchDoc } from "../HtmlElements";

// Singleton manager class for the GLcanvas
export class GLManagement {
    // Member variables

    // public
    public canvas: HTMLCanvasElement = fetchDoc<HTMLCanvasElement>('#glcanvas') as HTMLCanvasElement;
    public gl: WebGL2RenderingContext = this.canvas.getContext('webgl2') as WebGL2RenderingContext;
    public imageBitmap: ImageBitmap | null = null;
    public shaderProgs: GLShader[] = []

    public runProg(): void {
        const gl = this.gl
        const html = this.html
        const shaderSelect = this.shaderSelect;
        const shader = this.shaderProgs[shaderSelect];

        if (!this.imageBitmap) {
            html.setStatus("Please upload an image first.");
            return;
        }

        if (shaderSelect < 0) {
            html.setStatus("Please select a filter first");
            return;
        }

        try {
            if (!shader || !shader.uniforms) throw new Error("Program not initialized");
            const tex = createTextureFromBitmap(this.imageBitmap, gl, this.html.ErrorCallBack);
            let palette: WebGLTexture | null = null;

            gl.useProgram(shader.program);
            gl.bindVertexArray(shader.vao);

            if (this.selectedPalette) {
                palette = createPaletteTexture(this.selectedPalette as Palette, gl, this.html.ErrorCallBack);
                gl.activeTexture(gl.TEXTURE1)
                gl.bindTexture(gl.TEXTURE_2D, palette);
                if (shader.uniforms["u_palette"]) gl.uniform1i(shader.uniforms["u_palette"], 1);
                if (shader.uniforms["u_paletteSize"]) gl.uniform1i(shader.uniforms["u_paletteSize"], this.selectedPalette.size);
            }

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            // set the source image.. 
            if (shader.uniforms["u_image"]) gl.uniform1i(shader.uniforms["u_image"], 0);

            gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.bindVertexArray(null);
            this.canvas.toBlob(
                (blob) => {
                    if (!blob) return;
                    const url = URL.createObjectURL(blob);
                    html.downloadBtn.href = url;
                    html.downloadBtn.classList.remove("hidden");
                },
                "image/png"
            );

            html.setStatus("Done! Shader result shown. Download available.");
            html.toggleHiddenProcessedCol(false);
            gl.deleteTexture(tex);
            if (this.selectedPalette) gl.deleteTexture(palette)
        } catch (e) {
            html.ErrorCallBack("@ runProg : \n" + e);
        }
    }

    public handleFileIO(file: File): Promise<ImageBitmap> {
        const html = this.html
        return new Promise((resolve, reject) => {
            html.logError('');
            html.setStatus('Loading image..');

            createImageBitmap(file, { imageOrientation: "from-image" })
                .then((bmp) => {
                    this.imageBitmap = bmp;

                    // Preview the original file
                    html.orgImgElem.src = URL.createObjectURL(file);

                    // Resize canvas
                    this.canvas.width = bmp.width;
                    this.canvas.height = bmp.height;

                    // Enable run button
                    html.runBtn.disabled = false;
                    html.setStatus(
                        `Image loaded: ${bmp.width}x${bmp.height}. Click "Run Shader".`
                    );

                    html.toggleHiddenOriginalCol(false);
                    resolve(bmp);
                })
                .catch((e) => {
                    this.imageBitmap = null;
                    html.runBtn.disabled = true;
                    html.ErrorCallBack("@ handleFileIO :\n" + e);
                    reject(e);
                });
        });
    }

    public setShaderSelection(idx: number) {
        const html = this.html;
        if (idx < 0) {
            html.setStatus("Please Select a filter to use")
        }
        if (idx == 1 && this.selectedPalette) {
            html.toggleHiddenPaletteView(false);
            renderPalette(this.selectedPalette as Palette, this.html)
        } else html.toggleHiddenPaletteView(true);

        this.shaderSelect = idx;
    }

    // private
    private shaderSelect: number = -1;
    private selectedPalette: Palette | null = null;
    private static instance: GLManagement;
    private html: HTMLElements = HTMLElements.getInstance() as HTMLElements;
    public static getInstance(): GLManagement {
        if (!GLManagement.instance) GLManagement.instance = new GLManagement();
        return GLManagement.instance;
    }

    // On Dom load.. 
    private constructor() {
        const gl = this.gl;
        const html = this.html;

        if (!gl) {
            html.setStatus('WebGL is not supported in this browser, this app will not work. Please use a browser that allows WebGL');
            html.runBtn.disabled = true;
        }

        this.selectedPalette = createPalette(defaultPalette, html.ErrorCallBack);

        this.shaderProgs = setupShaders(gl, html.ErrorCallBack);

        // quad buffer
        const quadBuffer = gl.createBuffer();
        if (!quadBuffer) throw new Error("createBuffer failed");


        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1, -1, 1, -1, -1, 1, // tri 1
                1, -1, 1, 1, -1, 1, // tri 2
            ]),
            gl.STATIC_DRAW
        );

        this.shaderProgs.forEach(element => {
            setupVAO(gl, element, quadBuffer as WebGLBuffer, html.ErrorCallBack);
        });
    }
};