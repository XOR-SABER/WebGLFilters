#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 out_color;

uniform sampler2D u_image;     // source image (RGBA8)
uniform sampler2D u_palette;   // N x 1 palette (RGBA8, NEAREST)
uniform int u_paletteSize;     // N

#ifndef MAX_PAL
#define MAX_PAL 1024           // safety cap for loop unrolling
#endif

void main() {
  vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
  vec4 src = texture(u_image, uv).rgba;

  float best = 1e30;
  int bestIdx = 0;

  // over palette using squared Euclidean distance in sRGB
  for (int i = 0; i < MAX_PAL; ++i) {
    if (i >= u_paletteSize) break;
    vec4 pal = texelFetch(u_palette, ivec2(i, 0), 0).rgba;
    vec4 d = src - pal;
    float dist2 = dot(d, d);
    if (dist2 < best) {
      best = dist2;
      bestIdx = i;
    }
  }

  out_color = texelFetch(u_palette, ivec2(bestIdx, 0), 0);
}
