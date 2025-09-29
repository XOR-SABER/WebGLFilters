import { createPaletteTexture, createTextureFromBitmap } from "../GL/GLHelpers"
import { defaultPalette, Palette } from "../Palettes/Palette";
import { clearPalette, renderPalette } from "../Palettes/PaletteElements";
import { GLShader, setupShaders, setupVAO } from "../GL/GLShader"
import { HTMLElements, fetchDoc } from "../Application/HtmlElements";
import { ImageFileResult } from "../Application/FileHandler";
import { PaletteFactory } from "../Palettes/PalletteFactory";

// Singleton manager class for the GLcanvas
export class GLManagement {
    // Member variables

    // Public
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
            let selectedPalette = this.programPalettes[this.paletteIdx];
            console.log(this.programPalettes[this.paletteIdx]);
            console.log(this.paletteIdx)
            console.log(this.programPalettes)
            if (selectedPalette == undefined && shaderSelect == 1) {
                html.setStatus("Please select a palette");
                return;
            }
            let palette: WebGLTexture | null = null;

            gl.useProgram(shader.program);
            gl.bindVertexArray(shader.vao);

            if (selectedPalette) {
                palette = createPaletteTexture(selectedPalette as Palette, gl, this.html.ErrorCallBack);
                gl.activeTexture(gl.TEXTURE1)
                gl.bindTexture(gl.TEXTURE_2D, palette);
                if (shader.uniforms["u_palette"]) gl.uniform1i(shader.uniforms["u_palette"], 1);
                if (shader.uniforms["u_paletteSize"]) gl.uniform1i(shader.uniforms["u_paletteSize"], selectedPalette.size);
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
            if (selectedPalette) gl.deleteTexture(palette)
        } catch (e) {
            html.ErrorCallBack("@ runProg : \n" + e);
        }
    }

    public setImageProperties(result: ImageFileResult): void {
        this.imageBitmap = result.imageBitMap;
        this.canvas.width = result.width;
        this.canvas.height = result.height;
    }

    public addPalette(result: Palette): void {
        this.programPalettes[1] = (result);
        renderPalette(this.programPalettes[this.paletteIdx], this.html)
    }

    public setShaderSelection(idx: number): void {
        const html = this.html;
        if (idx < 0) {
            html.setStatus("Please Select a filter to use")
        }
        if (idx == 1 && this.programPalettes) {
            html.toggleHiddenPaletteView(false);
            // renderPalette(this.selectedPalette as Palette, this.html)
        } else html.toggleHiddenPaletteView(true);

        this.shaderSelect = idx;
    }

    public setPalette(idx: number): void {
        const html = this.html;
        this.paletteIdx = idx;
        clearPalette(html);
        if (this.programPalettes[this.paletteIdx] == undefined) {
            html.setStatus("Please upload a palette");
            return;
        }
        renderPalette(this.programPalettes[this.paletteIdx], this.html)
    }

    // Private
    private shaderSelect: number = -1;
    private programPalettes: Palette[] = [];
    private paletteIdx: number = -1;
    private static instance: GLManagement;
    private html: HTMLElements = HTMLElements.getInstance() as HTMLElements;
    private paletteFactory: PaletteFactory = new PaletteFactory();

    // Methods
    public static getInstance(): GLManagement {
        if (!GLManagement.instance) GLManagement.instance = new GLManagement();
        return GLManagement.instance;
    }

    // On Dom load.. 
    private constructor() {
        const gl = this.gl;
        const html = this.html;
        const f = this.paletteFactory;

        if (!gl) {
            html.setStatus('WebGL is not supported in this browser, this app will not work. Please use a browser that allows WebGL');
            html.runBtn.disabled = true;
        }
        const p = f.CreateDefaultPalette(defaultPalette, html);
        this.programPalettes.push(p);
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