"use strict";

// Font Awesome 5 (Free)
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid' 
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands' 

import "../css/style.scss";

import * as PIXI from "pixi.js";
import {
  app,
  loader
} from "./pixi_init"

import 'jquery';


import arrayModule from "./array";
let arr = arrayModule([5, 1, 3, 4, 6, 2], PIXI, app);
// let arr = arrayModule([1,4,5,2], PIXI, app);


import bubbleSort from "./bubble_sort";
import selectionSort from "./selection_sort";
import quickSort from "./quick_sort";

import "./ui"


// loader.load(setup);

// function setup() {

// let cat = PIXI.Sprite.from("assets/images/box.png");
// app.stage.addChild(cat);


{
// let isActive = true;
// let drawDialog = () => {
//   if (!isActive)
//     return;
//   let dialogBackground = new PIXI.Graphics();

//   dialogBackground.beginFill(0x000000);
//   dialogBackground.drawRect(
//     0,
//     0,
//     window.innerWidth,
//     window.innerHeight
//   );
//   dialogBackground.endFill();
//   app.stage.addChild(dialogBackground);

//   dialogBackground.alpha = 0.3;

//   // dialogBackground.buttonMode = true;

//   dialogBackground.interactive = true;
//   dialogBackground.hitArea = new PIXI.Rectangle(
//     0,
//     0,
//     window.innerWidth,
//     window.innerHeight
//   );

//   dialogBackground.on('mousedown', () => {
//     dialogBackground.alpha = 0;
//     dialogBackground.interactive = false;
//   })
// };
}

arr.drawRects();
// drawDialog();

let headerDom = document.querySelector("#header");
let algorithmsDom = headerDom.querySelector("#algorithms");
let dataDom = headerDom.querySelector("#data");

let algorithms = [{
    name: "Bubble sort",
    id: "bubbleSort",
    f: bubbleSort
  },
  {
    name: "Selection sort",
    id: "selectionSort",
    f: selectionSort
  },
  {
    name: "Quick sort",
    id: "quickSort",
    f: quickSort
  }
]

let shuffleButton = document.createElement("button");
shuffleButton.innerText = "Shuffle";
shuffleButton.setAttribute("id", "shuffle");
shuffleButton.addEventListener("click",
    e => {
      arr.shuffle();
    }
  );
dataDom.appendChild(shuffleButton);

algorithms.forEach(algorithm => {
  let algorithmButton = document.createElement("button");
  algorithmButton.setAttribute("id", algorithm.id);
  algorithmButton.innerText = algorithm.name;

  algorithmButton.addEventListener("click",
    () => {
      algorithm.f(arr)
      if(arr._animationValues.animationPaused === true)
        togglePlay();
    }
  );

  algorithmsDom.appendChild(algorithmButton)
})

animate();

function animate() {
  app.renderer.render(app.stage);

  arr.draw();

  requestAnimationFrame(animate);
}


function togglePlay() {
  arr._animationValues.animationPaused = !arr._animationValues.animationPaused;

  if (arr._animationValues.animationPaused)
    pauseButton.innerText = "Play"
  else
    pauseButton.innerText = "Pause"
}

let animationSpeedRange = $("#animationSpeed");
animationSpeedRange.on("input change", () =>
{ 
  arr.animationSpeed = parseFloat(animationSpeedRange.val());
  $("#animationSpeedOutput").val(animationSpeedRange.val());
});

let pauseButton = document.querySelector("#pause");
pauseButton.onclick = () => {
  togglePlay();
}