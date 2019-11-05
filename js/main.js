"use strict";

// Font Awesome 5 (Free)
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

import "../css/style.scss";

import * as PIXI from "pixi.js";
import {
  app
} from "./pixi_init"

import 'jquery';

import Modal from './modal'

const modal = new Modal($('#modal-overlay'));

import arrayModule from "./array";

let arr = arrayModule([...Array(6).keys()].map(x => x+1), PIXI, app, {
  modal
});

import bubbleSort from "./bubble_sort";
import selectionSort from "./selection_sort";
import quickSort from "./quick_sort";

import ui from "./ui"

ui({
  changeMode,
  play,
  pause
})


// loader.load(setup);

// function setup() {

// let cat = PIXI.Sprite.from("assets/images/box.png");
// app.stage.addChild(cat);


// {
  // let isActive = true;
  // let drawDialog = () => {
  //   if (!isActive)
  //     return;

  //   let dialogGroup = new PIXI.Graphics();

  //   let dialogBackground = new PIXI.Graphics();

  //   dialogBackground.beginFill(0x000000);
  //   dialogBackground.drawRect(
  //     0,
  //     0,
  //     window.innerWidth,
  //     window.innerHeight
  //   );
  //   dialogBackground.endFill();

  //   dialogBackground.alpha = 0.3;

  //   // dialogBackground.buttonMode = true;

  //   dialogBackground.interactive = true;
  //   dialogBackground.hitArea = new PIXI.Rectangle(
  //     0,
  //     0,
  //     window.innerWidth,
  //     window.innerHeight
  //   );

  //   // dialogBackground.on('mousedown', () => {
  //   //   dialogBackground.alpha = 0;
  //   //   dialogBackground.interactive = false;
  //   // })

  //   let x=300;
  //   let y=150;

  //   let dialog = new PIXI.Graphics();
  //   dialog.beginFill(0xffffff);
  //   dialog.drawRect(
  //     (window.innerWidth-x)/2,
  //     (window.innerHeight-y)/2,
  //     x,
  //     y
  //   );
  //   dialog.endFill();

  //   dialogGroup.addChild(dialogBackground);
  //   dialogGroup.addChild(dialog);

  //   app.stage.addChild(dialogGroup);
  // };
// }

arr.drawRects();
arr.shuffle();
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
      play();
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

function play(){
  arr._animationValues.animationPaused = false;
  arr.changeMode("Play");
}

function pause(){
  arr._animationValues.animationPaused = true;
  arr.changeMode("Edit");
}

function changeMode(mode) {
  arr.changeMode(mode);
  if(mode=="Play")
    play();
  else
    pause();
}

let animationSpeedRange = $("#animationSpeed");
animationSpeedRange.on("input change", () => {
  arr.animationSpeed = parseFloat(animationSpeedRange.val());
  $("#animationSpeedOutput").val(animationSpeedRange.val());
});