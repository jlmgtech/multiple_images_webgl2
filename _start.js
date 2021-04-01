window.addEventListener("load", async () => {
    console.log("starting");
    await import("/src/gl.js");
    const main = await import("/src/main.js");
    main.default();
});
