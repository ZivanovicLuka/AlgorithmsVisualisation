"use strict";

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

arr.drawRects();
arr.shuffle();

animate();

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