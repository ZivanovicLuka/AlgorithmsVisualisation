import 'jquery';

function positionateMainMenu() {
  if($("#header").hasClass("visible"))
    $("#mainMenu").stop(true,false).animate({top: 50});
  else
    $("#mainMenu").stop(true,false).animate({top: 0});
}

$( document ).ready(function() {
  $("#header").addClass("visible");
  positionateMainMenu();

  $("#headerPop").click( e => {
    $("#header").stop(true, false).toggleClass("visible");
    $("#header").stop(true, false).fadeToggle();

    positionateMainMenu();
  })

  $("#optionsPop").click( e => {
    $("#options").stop(true, false).fadeToggle();
  })
});