var randomNumber1 = Math.random();
randomNumber1*=6;
randomNumber1 = Math.floor(randomNumber1)+1;

var n = "./images/dice" + randomNumber1 +".png"

document.querySelector("img.img1").src = n;



var randomNumber2 = Math.random();
randomNumber2*=6;
randomNumber2 = Math.floor(randomNumber2)+1;

var n2 = "./images/dice" + randomNumber2 +".png"

document.querySelector("img.img2").src = n2;

if(randomNumber1  >randomNumber2)
    document.querySelector("h1").innerHTML = "Player 1 Wins";
else if(randomNumber1 < randomNumber2)
    document.querySelector("h1").innerHTML = "Player 2 Wins";
else
    document.querySelector("h1").innerHTML = "DRAW";