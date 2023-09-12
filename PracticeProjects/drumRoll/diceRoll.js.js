
for(var i=0; i<document.querySelectorAll("button").length; i++){
    document.querySelectorAll("button")[i].addEventListener("click",function (){
        var character = this.innerHTML;

        makeSound(character);
        animate(character);
    })
}


document.addEventListener("keydown", function(e){
    var keyPressed  = e.key;
    makeSound(keyPressed);
    animate(keyPressed);
    
})


function makeSound(key){
    switch(key) {
        case "w":
                var audio = new Audio("sounds/crash.mp3");
                audio.play();
                break;
        case "a":
                var audio = new Audio("sounds/kick-bass.mp3");
                audio.play();
                break;
        case "s":
                var audio = new Audio("sounds/snare.mp3");
                audio.play();
                break;
        case "d":
                var audio = new Audio("sounds/tom-1.mp3");
                audio.play();
                break;
        case "j":
                var audio = new Audio("sounds/tom-2.mp3");
                audio.play();
                break;
        case "k":
                    var audio = new Audio("sounds/tom-3.mp3");
                    audio.play();
                    break;
        case "l":
                var audio = new Audio("sounds/tom-4.mp3");
                audio.play();
                break;
        default:console.log("Not included in these instruments");
    }
}

function animate(key){
    var activeBtn = document.querySelector("."+key);
    activeBtn.classList.add("pressed");

    setTimeout(function(){
        activeBtn.classList.remove("pressed");
    }, 100);         //remove that class after 0.1 sec
}