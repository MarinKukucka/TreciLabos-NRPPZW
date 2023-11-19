let canvas, ctx, spaceship, asteroids, startTime, currentTime, spaceshipImg, asteroidImg;
let bestTime = localStorage.getItem("bestTime") || 0;
let stop = false;

//Inicijalizacija canvasa, svemirskog broda i asteroida (početak igre)
function init(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    spaceshipImg = new Image();
    spaceshipImg.src = "Spaceship.png"

    asteroidImg = new Image();
    asteroidImg.src = "Asteroid.png"

    //Definicija objekta svemirskog broda, tj. igrača, a sadrži trenutnu poziciju i dimenzije
    spaceship = {
        x: canvas.width / 2,    
        y: canvas.height / 2,
        width: 50,
        height: 50
    };

    asteroids = []
    generateAsteroids();

    setInterval(generateAsteroids, 2000);

    window.addEventListener("keydown", spaceshipMovement);

    startTime = new Date().getTime();

    requestAnimationFrame(run);
}

//Generiranje asteroida
function generateAsteroids(){
    for(let i = 0; i < 40; i++){
        const side = Math.floor(Math.random() * 4);

        let x, y;
        if(side === 0){         //Stvaranje asteroida iznad polja
            x = Math.random() * canvas.width;
            y = -Math.random() * canvas.height;
        }
        else if(side === 1){    //Stvaranje asteroida ispod polja
            x = Math.random() * canvas.width;
            y = canvas.height + Math.random() * canvas.height;
        }
        else if(side === 2){    //Stvaranje asteroida lijevo od polja
            x = -Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        }
        else{                   //Stvaranje asteroida desno od polja
            x = canvas.width + Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        }

        //Definicija objekta asteroida, a sadrži trenutnu poziciju, dimenzije i brzinu
        const asteroid = {
            x: x,
            y: y,
            width: 70,
            height: 70,
            speed: {
                x: (Math.random() - 0.5) * 5,
                y: (Math.random() - 0.5) * 5
            }
        }

        asteroids.push(asteroid);
    }
}

function run(){
    if(!stop){      //Igra se nastavalja te se iscrtava prozor i pomiču se svemirski brod i asteroidi te se provjerava je li došlo do sudara među njima 
        draw();

        spaceshipMovement();

        asteroidMovement();

        checkForCollision();

        requestAnimationFrame(run);
    }
    else{           //Igra je gotova te ako je ostvareno novo najbolje vrijeme, ono se ažurira
        if(currentTime > bestTime){
            localStorage.setItem("bestTime", currentTime);
        }
    }
}

//Iscrtavanje svemirskog broda, asteroida, trenutnog vremena i najboljeg vremena sa relevantnim parametrima
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
   
    //Crtanje svemirskog broda
    ctx.drawImage(spaceshipImg, spaceship.x - spaceship.width / 2, spaceship.y - spaceship.height / 2, spaceship.width, spaceship.height)

    //Crtanje asteroida
    for(let i = 0; i < asteroids.length; i++){
        ctx.drawImage(asteroidImg, asteroids[i].x - asteroids[i].width / 2, asteroids[i].y - asteroids[i].height / 2, asteroids[i].width, asteroids[i].height);
    }

    currentTime = new Date().getTime() - startTime;

    //Ispisivanje trenutnog i najboljeg vremena
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Time: " + Math.floor(currentTime / 60000) + ":" + (currentTime / 1000 % 60).toFixed(3), canvas.width - 250, 30);
    ctx.fillText("Best time: " + Math.floor(bestTime / 60000) + ":" + (bestTime / 1000 % 60).toFixed(3), canvas.width - 250, 60);
}

//Kretanje svemirskog broda s obzirom na pritisnutu strelicu
function spaceshipMovement(event){
    if(event && event.key === "ArrowUp" && spaceship.y - 30 > 0){                       //Pomicanje svemirskog broda prema gore
        spaceship.y -= 15;
    }
    else if(event && event.key === "ArrowDown" && spaceship.y + 30 < canvas.height){    //Pomicanje svemirskog broda prema dolje
        spaceship.y += 15;
    }
    else if(event && event.key === "ArrowLeft" && spaceship.x - 15 > 0){                //Pomicanje svemirskog broda prema lijevo
        spaceship.x -= 15;
    }
    else if(event && event.key === "ArrowRight" && spaceship.x + 15 < canvas.width){    //Pomicanje svemirskog broda prema desno
        spaceship.x += 15;
    }
}

//Kretanje asteroida
function asteroidMovement(){
    for(let i = 0; i < asteroids.length; i++){
        asteroids[i].x += asteroids[i].speed.x;
        asteroids[i].y += asteroids[i].speed.y;
    }
}

//Provjera je li došlo do sudara svemirskog broda i jednog od asteroida
function checkForCollision(){
    for(let i = 0; i < asteroids.length; i++){
        if(spaceship.x - spaceship.width / 2 < asteroids[i].x + asteroids[i].width / 2 - 20 &&
           spaceship.x + spaceship.width / 2 > asteroids[i].x - asteroids[i].width / 2 + 20 &&
           spaceship.y - spaceship.height / 2 < asteroids[i].y + asteroids[i].height / 2 - 20 &&
           spaceship.y + spaceship.height / 2 > asteroids[i].y - asteroids[i].height / 2 + 20){
            stop = true;
           }
    }
}

window.onload = init;