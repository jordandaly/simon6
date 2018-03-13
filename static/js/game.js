//variables
userSeq = [];
simonSeq = [];
const NUM_OF_LEVELS = 25;
var id, color, level, userHighScore;
var strict = false;
var error = false;
var gameOn = false //switch to turn game on or off 
var boardSound = [
  "https://www.soundjay.com/button/button-3.mp3", //green
  "http://www.soundjay.com/button/sounds/button-09.mp3", //yellow
  "http://www.soundjay.com/button/sounds/button-10.mp3", //orange 
  "http://www.soundjay.com/button/sounds/button-7.mp3", //red  
  "https://www.soundjay.com/button/button-1.mp3", //purple
  "https://www.soundjay.com/button/button-5.mp3"  //blue
];
var errorSound = "https://www.soundjay.com/button/button-4.mp3";
var winSound = "https://www.soundjay.com/human/applause-8.mp3";

//1- start board sequence
$(document).ready(function() {
  $(".display").text("");
  $(".score").text("");
  $(".start").click(function() {
    error = false;
    level = 0;
    level++;
    userHighScore = 0;
    simonSeq = []
    userSeq = [];
    simonSequence();
  })
  
  //user pad listener
  $(".pad").click(function() {
    id = $(this).attr("id");
    color = $(this).attr("class").split(" ")[1];
    userSequence();
  });
  
  //strict mode listener
  $(".strict").click(function() {
    console.log("strict before click:"+strict);
    if(strict) {
        strict = false; 
    $(".strict").removeClass("bold");
    }
    else {
        strict = true; 
    $(".strict").addClass("bold");  
    }
    console.log("strict after click:"+strict);
  })
  
  //listener for switch button
  $(".switch").click(function() {    
    gameOn = (gameOn == false) ? true : false;
    console.log("gameOn:"+gameOn);
    if(gameOn) {
      $(".inner-switch").addClass("inner-inactive");
      $(".switch").addClass("outter-active");
      $(".on").addClass("bold");
      $(".off").removeClass("bold");
      $(".display").text("00")
      $(".score").text("00")
    }
    else {
      $(".inner-switch").removeClass("inner-inactive");
      $(".switch").removeClass("outter-active");
      $(".off").addClass("bold");
      $(".on").removeClass("bold");
      $(".display").text("");
      $(".score").text("");
    }    
  })
})

//user sequence
function userSequence() {
  userSeq.push(id);
    console.log(id+" "+color);
    addClassSound(id, color);
    //check user sequence
    if(!checkUserSeq()) {
        if (userHighScore < (level-1)){
            userHighScore = level-1;
        }
      console.log("user high score:"+userHighScore);
      //if playing strict mode reset everything lol
      if(strict) {
        console.log("strict");
        simonSeq = [];
        level = 1;
      }   
      error = true;   
      displayError();
      userSeq = [];      
      simonSequence();
      
    }
    //checking end of sequence
    else if(userSeq.length == simonSeq.length && userSeq.length < NUM_OF_LEVELS) {
      if (level > userHighScore){
      userHighScore = level;
      }
      level++;
      userSeq = [];
      error = false;
      console.log("start simon")
      simonSequence();
    }
    //checking for winners
    if(userSeq.length == NUM_OF_LEVELS) {
      userHighScore = NUM_OF_LEVELS;
      displayWinner();
      resetGame();
    }     
  
}

/* simon sequence */
function simonSequence() {
  console.log("level "+level);
  console.log("userHighScore "+userHighScore);
  $(".display").text(level);
  $(".score").text(userHighScore);
  if(!error) {
    getRandomNum();
  }
  if(error && strict) {
    getRandomNum();
  }  
  var i = 0;
  var myInterval = setInterval(function() {
    id = simonSeq[i];
    color = $("#"+id).attr("class");
    color = color.split(" ")[1];
    console.log(id+" "+color);
    addClassSound(id, color);
    i++;
    if(i == simonSeq.length) {
      clearInterval(myInterval);
    } 
  }, 1000);  
}

//generate random number
function getRandomNum() {
  var random = Math.floor(Math.random() * 6);
  simonSeq.push(random);
}

/* add temporary class and sound  */
function addClassSound(id, color) {
  $("#"+id).addClass(color+"-active");
  playSound(id)
  setTimeout(function(){
    $("#"+id).removeClass(color+"-active");
  }, 500);
}

/* checking user seq against simon's */
function checkUserSeq() {
  for(var i = 0; i < userSeq.length; i++) {
    if(userSeq[i] != simonSeq[i]) {      
      return false;
    }
  }
  return true;
}

/* display error  */
function displayError() {
  console.log("error");  
  playErrorSound()
  var counter = 0;
  var myError = setInterval(function() {
    $(".display").text("Err");
    counter++;
    if(counter == 3) {
      $(".display").text(level);
      clearInterval(myError);
      userSeq = [];
      counter = 0;
    }
  }, 500);
}

//display winner 
function displayWinner() {
    playWinSound()
  var count = 0;
  var winInterval = setInterval(function() { 
    count++;
    $(".display").text("Win");
    if(count == 5) {
      clearInterval(winInterval);
      $(".display").text("00");
      count = 0;
    }
  }, 500);
}

/* play board sound */
function playSound(id) {
  var sound = new Audio(boardSound[id]);
  sound.play();
}

/* play error sound */
function playErrorSound() {
  var sound = new Audio(errorSound);
  sound.play();
}

/* play win sound */
function playWinSound() {
  var sound = new Audio(winSound);
  sound.play();
}

/* reset game */
function resetGame() {
  userSeq = [];
  simonSeq = [];
  level = 0;
  $(".display").text("00");
}

