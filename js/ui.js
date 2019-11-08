"use strict";

import 'jquery';

let context = null;

let modes = [
  "Edit",
  "Play"
]
let activeModeIndex = 0;


$(document).ready(function () {
  console.log(context.editMode);
  init();

  $("#headerPop").click(e => {
    $("#header").stop(true, false).toggleClass("visible");
    $("#header").stop(true, false).fadeToggle();

    positionateMainMenu();
  })

  $("#optionsPop").click(e => {
    $("#options").stop(true, false).fadeToggle();
  })

  $("#pause").click(e => {
    context.pause();
  })

  $("#play").click(e => {
    context.play();
  })
});

function init() {
  $("#header").addClass("visible");
  positionateMainMenu();
}

function changeModeUI(activeMode) {
  context.changeMode(modes[activeMode]);
  if(modes[activeMode] != "Play")
    context.pause();
}

function positionateMainMenu() {
  if ($("#header").hasClass("visible"))
    $("#mainMenu").stop(true, false).animate({
      top: 50
    });
  else
    $("#mainMenu").stop(true, false).animate({
      top: 0
    });
}

export default function (ctx) {
  context = ctx
}