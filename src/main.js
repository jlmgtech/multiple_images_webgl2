import { gl } from "./gl.js";
import { compile, link, get_image } from "./utils.js";
import { vsrc, fsrc } from "./shaders.js";

export default async function main() {

    // these are the images we'll use
    const img1 = await get_image("cat1.png");
    const img2 = await get_image("cat2.png");

    // create program from shaders in shaders.js
    const program = link(
        compile(vsrc, gl.VERTEX_SHADER),
        compile(fsrc, gl.FRAGMENT_SHADER),
    );

    // get all positions
    const a_position = gl.getAttribLocation(program, "a_position");
    const u_texunit0 = gl.getUniformLocation(program, "u_texunit0");
    const u_texunit1 = gl.getUniformLocation(program, "u_texunit1");
    const u_texsize0 = gl.getUniformLocation(program, "u_texsize0");
    const u_texsize1 = gl.getUniformLocation(program, "u_texsize1");
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // a single quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0,0, 1,0, 0,1,
        0,1, 1,0, 1,1,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

    // create a texture for cat1.png
    const texture0 = texture_from_img(img1, 0);
    const texture1 = texture_from_img(img2, 1);

    // run this at 60fps (or close to it)
    function render(elapsed) {
        const uptime_seconds = elapsed * 0.001;

        // clear the canvas
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.useProgram(program);
        gl.bindVertexArray(vao);

        // set the texture units
        gl.uniform1i(u_texunit0, 0);
        gl.uniform1i(u_texunit1, 1);

        // bind textures
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture0);
        gl.activeTexture(gl.TEXTURE0 + 1);
        gl.bindTexture(gl.TEXTURE_2D, texture1);

        // set the "texsize" for each of the images independently
        gl.uniform1f(u_texsize0, (1 + Math.sin(uptime_seconds)) / 2);
        gl.uniform1f(u_texsize1, 1 / (uptime_seconds % 3));

        // and draw
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // rinse and repeat
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function texture_from_img(img, texunit=0) {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + texunit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    // texture settings
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return texture;
}
