"use strict";
import "../css/style.scss";

import * as PIXI from "pixi.js";
import {
  app,
  loader
} from "./pixi_init"

// import arr from "./array"
import arrayModule from "./array";
let arr = arrayModule([5, 1, 3, 7, 4, 6, 2], PIXI, app);

import bubbleSort from "./bubble_sort";
import selectionSort from "./selection_sort";


// loader.load(setup);

// function setup() {

// let cat = PIXI.Sprite.from("assets/images/box.png");
// app.stage.addChild(cat);


let isActive = true;
let drawDialog = () => {
  if (!isActive)
    return;
  let dialogBackground = new PIXI.Graphics();

  dialogBackground.beginFill(0x000000);
  dialogBackground.drawRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );
  dialogBackground.endFill();
  app.stage.addChild(dialogBackground);

  dialogBackground.alpha = 0.3;

  // dialogBackground.buttonMode = true;

  dialogBackground.interactive = true;
  dialogBackground.hitArea = new PIXI.Rectangle(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  dialogBackground.on('mousedown', () => {
    dialogBackground.alpha = 0;
    dialogBackground.interactive = false;
  })
};

arr.drawRects();
drawDialog();


// bubbleSort(arr);
selectionSort(arr);

//   if (min !== i) {
//     arr.swap(i, min);
//   }
// }

let fps = 60;
// setInterval(logic, fps);
animate();

// function logic() {
// arr.swap(1, 3);
// arr.swap(1, 3);
// }

function animate() {
  app.renderer.render(app.stage);

  arr.draw();

  requestAnimationFrame(animate);
}




let pauseButton = document.querySelector("#pause");
pauseButton.onclick =  () => {
  arr._animationValues.animationPaused = !arr._animationValues.animationPaused;

  if(arr._animationValues.animationPaused)
    pauseButton.value = "Play"
  else
    pauseButton.value = "Pause"
}
