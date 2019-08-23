import * as PIXI from "pixi.js";

let app = new PIXI.Application({
  width: 256,
  height: 256,
  antialias: true,
  transparent: false,
  resolution: 1
});

app.renderer.backgroundColor = 0x061639;
app.renderer.autoResize = true;

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);


const loader = new PIXI.Loader();

loader
  .add("assets/images/box.png")

document.body.appendChild(app.view);

export {app, loader}