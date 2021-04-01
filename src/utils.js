import { gl } from "./gl.js";

export function compile(src, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(src);
        throw new Error(gl.getShaderInfoLog(shader));
    } else {
        return shader;
    }
}

export function link(...shaders) {
    const program = gl.createProgram();
    for (const shader of shaders) {
        gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
    } else {
        return program;
    }
}

export function init_gl() {
}

export function get_image(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = `${url}?${Math.random()}`; // to prevent caching
        img.onload = () => {
            resolve(img);
        };
    });
}
