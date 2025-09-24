import { Palette } from "../Palette"
import { OnError } from "../HtmlElements";

// Create the texture from image bitmap
export const createTextureFromBitmap = (bmp: ImageBitmap, gl: WebGL2RenderingContext, onError?: OnError): WebGLTexture => {
    const texture: WebGLTexture = gl.createTexture();
    if (!texture) onError?.("@ createTextureFromBitmap : gl.createTexture:");

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return texture;
}

// Creating a texture for the Palette to allow reads from it like a buffer. 
export const createPaletteTexture = (palette: Palette, gl: WebGL2RenderingContext, onError?: OnError): WebGLTexture => {
    const texture: WebGLTexture = gl.createTexture();
    if (!texture) onError?.("@ createPaletteTexture : gl.createTexture:");

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, palette.buffer.length / 4, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, palette.buffer);

    return texture;
}

