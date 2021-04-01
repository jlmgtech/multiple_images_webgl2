// this must be imported AFTER window.onload
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);
export const gl = canvas.getContext("webgl2");
