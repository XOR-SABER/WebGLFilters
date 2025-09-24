#version 300 es
precision mediump float;

uniform sampler2D u_image;

in vec2 v_uv;
out vec4 outColor;

void main() {
    vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
    vec4 c = texture(u_image, uv);

    outColor = vec4(1.0 - c.rgb, c.a);
}
