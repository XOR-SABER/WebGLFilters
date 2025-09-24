import colorSpaceURL from "../Shaders/colorSpace.fs.glsl"
import defaultVertURL from "../Shaders/default.vs.glsl"
import invertFragURL from "../Shaders/invert.fs.glsl"
import { OnError } from "../HtmlElements";

// Class for GLShaders.. really just a struct 
export class GLShader {
  public program: WebGLProgram;
  public uniforms: Record<string, WebGLUniformLocation | null> = {};
  public vao: WebGLVertexArrayObject | null = null;
  public attributes: Record<string, GLint | null> = {};
  public constructor(vsSrc: string = '', fsSrc: string = '', gl: WebGL2RenderingContext, onError?: OnError) {
    this.program = createShaderProgram(vsSrc, fsSrc, gl, onError)
  }
};

// Gets the uniform from the shader
const getUniform = (gl: WebGL2RenderingContext, prog: GLShader, name: string, onError?: OnError) => {
  const loc = gl.getUniformLocation(prog.program, name);
  if (loc === null) {
    onError && onError("@ getUniform : uniform " + name + " not found or optimized out");
  }
  prog.uniforms[name] = loc;
};

// Gets the attribute from the shader
const getAttrib = (gl: WebGL2RenderingContext, prog: GLShader, name: string, onError?: OnError) => {
  const loc = gl.getAttribLocation(prog.program, name);
  if (loc === -1) {
    onError && onError("@ getAttrib : attribute " + name + " not found or optimized out");
  }
  prog.attributes[name] = loc;
};

// Create a shader program
const createShaderProgram = (vsSrc: string = '', fsSrc: string = '', gl: WebGL2RenderingContext, onError?: OnError) => {
  // IF we are not loading custom shaders.. 
  if (vsSrc.length == 0) vsSrc = defaultVertURL;
  if (fsSrc.length == 0) fsSrc = invertFragURL;

  const vs: WebGLShader = compileShader(vsSrc, gl.VERTEX_SHADER, gl, onError);
  const fs: WebGLShader = compileShader(fsSrc, gl.FRAGMENT_SHADER, gl, onError);

  const pg: WebGLProgram | null = gl.createProgram();
  if (!pg) onError?.("@ createShaderProgram : gl.createProgram:");

  const program: WebGLProgram = pg as WebGLProgram;

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) ?? "Unknown shader error";
    gl.deleteProgram(program);
    onError?.("@ createShaderProgram : gl.linkProgram:\n" + info);
  }

  return program;
}

// Compile shader helper 
const compileShader = (src: string, type: number, gl: WebGL2RenderingContext, onError?: OnError) => {
  const sh: WebGLShader | null = gl.createShader(type);
  if (!sh) onError?.("@ compileShader : gl.createShaderFailed");

  const shader: WebGLShader = sh as WebGLShader;
  gl.shaderSource(shader, src);
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) ?? "Unknown shader error";
    gl.deleteShader(shader);
    onError?.("@ compileShader : gl.compileShader:\n" + info)
  }

  return shader;
}

// Set up the vertex array objects 
export const setupVAO = (gl: WebGL2RenderingContext, prog: GLShader, quadBuffer: WebGLBuffer, onError?: OnError): void => {
  const vao = gl.createVertexArray();
  if (!vao) {
    onError && onError("@ setupVAO : failed to create VAO");
    return;
  }

  gl.bindVertexArray(vao);
  gl.useProgram(prog.program);

  const posLoc = prog.attributes["a_position"] as number;
  if (posLoc === undefined || posLoc === -1) {
    onError && onError("@ getAttrib : attribute a_position not found or optimized out");
  } else {
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
  }

  gl.bindVertexArray(null);
  prog.vao = vao;
};

// Setup shaders for the program
export const setupShaders = (gl: WebGL2RenderingContext, onError?: OnError): GLShader[] => {
  // ColorSpace
  const colorSpaceProg = new GLShader('', colorSpaceURL, gl, onError);
  gl.useProgram(colorSpaceProg.program);
  getUniform(gl, colorSpaceProg, "u_image", onError);
  getUniform(gl, colorSpaceProg, "u_palette", onError);
  getUniform(gl, colorSpaceProg, "u_paletteSize", onError);
  getAttrib(gl, colorSpaceProg, "a_position", onError);


  gl.uniform1i(colorSpaceProg.uniforms['u_image'], 0);
  gl.uniform1i(colorSpaceProg.uniforms['u_palette'], 1);

  // Invert
  const invertProg = new GLShader('', '', gl, onError);
  gl.useProgram(invertProg.program);
  getUniform(gl, invertProg, "u_image", onError);
  getAttrib(gl, invertProg, "a_position", onError);

  gl.uniform1i(invertProg.uniforms['u_image'], 0);
  gl.useProgram(null)
  return [invertProg, colorSpaceProg];
}
