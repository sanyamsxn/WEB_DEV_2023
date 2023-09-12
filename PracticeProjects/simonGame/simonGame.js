var userClickedPattern = [];
var gamePattern = [];
var buttonColors = ["red", "blue", "green", "yellow"];

var level=0;
var started = false;
var score=0;

$(document).keydown(function(){
    if(!started){
        $("#level-title").text("Level "+ level);
        nextSequence();
        started=true;
    }
})


$(".btn").on("click", function(e){
    var userChosenColor = e.currentTarget.id;
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length-1);
})

function checkAnswer(currentLevel){
    if(userClickedPattern[currentLevel]===gamePattern[currentLevel]){
        score++;
        console.log(score);
        if(userClickedPattern.length===gamePattern.length){
            setTimeout(function(){
                nextSequence();
            },1000)
        }
    }
    else{
        var audio = new Audio("./sounds/wrong.mp3");
        audio.play();
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        },1000);
        $("#level-title").text("Game Over, Press any Key to Restart");
        startOver();
    }
}

function nextSequence(){
    userClickedPattern=[];
    level++;
    $("#level-title").text("Level " + level);

    var random = Math.floor(Math.random()*4);
    var randomColorChosen = buttonColors[random];
    gamePattern.push(randomColorChosen);
    var n = "#" + randomColorChosen;
    $(n).fadeOut(100).fadeIn(100);

    
  }



  function playSound(name){
    switch(name){
        case "blue":
            var audio = new Audio("./sounds/blue.mp3");
            audio.play();
            break;
        case "green":
            var audio = new Audio("./sounds/green.mp3");
            audio.play();
            break;
        case "red":
            var audio = new Audio("./sounds/red.mp3");
            audio.play();
            break;
        case "yellow":
            var audio = new Audio("./sounds/yellow.mp3");
            audio.play();
            break;
        default:
            var audio = new Audio("./sounds/wrong.mp3");
            audio.play();
            break;
    }
  }


  function animatePress(currentColor){
    var n = "#" + currentColor;
    $(n).addClass("pressed");
    setTimeout(function(){
        $(n).removeClass("pressed");
    }, 100)
  }
  
  function startOver(){
    score=0;
    level=0;
    started=false;
    gamePattern=[];
  }


