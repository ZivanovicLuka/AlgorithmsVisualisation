import 'jquery';

$( document ).ready(function() {
  $("#headerPop").click( e => {
    $("#header").stop(true, false).toggleClass("clicked");
    $("#header").stop(true, false).fadeToggle();

    if($("#header").hasClass("clicked"))
      $("#mainMenu").stop(true,false).animate({top: 50});
    else
      $("#mainMenu").stop(true,false).animate({top: 0});
  })
  $("#optionsPop").click( e => {
    $("#options").stop(true, false).fadeToggle();
  })
});