export const vsrc = `
#version 300 es

in vec4 a_position;
out vec4 uvcoords;

void main() {
    uvcoords = a_position;
    uvcoords.y = 1.0 - uvcoords.y; // flip y axis, cuz images be upside down for whatever reason
    gl_Position = a_position;
}
`.trim();

export const fsrc = `
#version 300 es
precision mediump float;

in vec4 uvcoords;
uniform sampler2D u_texunit0; // texunit image location
uniform sampler2D u_texunit1; // texunit image location
uniform float u_texsize0; // size for first image
uniform float u_texsize1; // size for second image
out vec4 color;

void main() {
    vec2 image1_size = uvcoords.xy / u_texsize0;
    vec2 image2_size = uvcoords.xy / u_texsize1;
    color = (texture(u_texunit0, image1_size) * texture(u_texunit1, image2_size));
}
`.trim();
