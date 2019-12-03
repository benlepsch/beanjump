function constrain(val, min, max) { // used in moving player around
	if (val > max) {
		val = max;
	}
	if (val < min) {
		val = min;
	}
	return val;
}

class VegetableManager {
	constructor() {
		this.veggies = []; // holds Vegetable objects
		this.onVeg = 0; // indexes vegetables
		this.begin = new Date().getTime();
		this.cooldown = 0;
	}

	add() {
		let dt = Math.round((new Date().getTime() - this.begin)/1000); // delta milliseconds to seconds, used for generating cooldown

		this.veggies[this.onVeg] = new Vegetable(this.onVeg);
		
		// need to set a type
		// this will vary based on how long the game has been going on. 0-10 seconds only onions, then peppers and onions until 20 seconds, then all three.

		// then set a new cooldown
		// oh god
		// so at max i want maybe a couple every 60 frames/1 second, so cooldown between 30-60?
		// at the start idk dude maybe cooldown of 300-500 or something
		// but how do i scale that
		
		this.onVeg ++;
	}

	// decide if a new veg is to be added
	isTime() {
		// i'm going to add a cooldown here
		// like
		// depending on the time since the start of the game it will pick a random number of game ticks to loop thru until it spawns another veggie
		// then when cooldown = 0 it spawns a veg and pick a new number
		if (this.cooldown == 0) {
			return true;
		} else {
			return false;
		}
	}
}

class Vegetable {
	constructor(id) {
		this.id = id;
		
	}
}

// handle player movement basically
class Player {
	constructor(id) {
		this.id = id;
		this.velocityX = 0;
		this.velocityY = 0;
		this.accelX = 0;
		this.accelY = 1.5; //gravity

		this.maxAccelX = 10;
		this.maxVelX = 25;
		this.maxVelY = 28;

		this.rep = document.getElementById(this.id);
		this.rep.style.left = '0px';
	}

	update() {
		this.velocityX = constrain(this.velocityX + this.accelX, -1*this.maxVelX, this.maxVelX);
		this.velocityY = constrain(this.velocityY + this.accelY, -1*this.maxVelY, this.maxVelY);
		console.log("accel: " + this.accelX + "\tvel: " + this.velocityX);

		this.velocityX = this.velocityX < 0 ? Math.ceil(this.velocityX/2) : Math.floor(this.velocityX/2);
		this.accelX = 0;

		// if it's going off the left side of the screen or if it's going to go off the left side of the screen
		if ((parseInt(this.rep.style.left) <= 0 && this.velocityX < 0) || (parseInt(this.rep.style.left) + this.velocityX < 0)) {
			this.rep.style.left = '0px';
			this.velocityX = 0;
			this.accelX = 0;
		}

		// if it's going off the right side or if it's going to go off the right side
		if ((parseInt(this.rep.style.left) + this.rep.clientWidth > $(window).width()) || (parseInt(this.rep.style.left) + this.rep.clientWidth + this.velocityX > $(window).width())) {
			this.rep.style.left = $(window).width() - this.rep.clientWidth + 'px';
			this.velocityX = 0;
			this.accelX = 0;
		}

		this.rep.style.left = parseInt(this.rep.style.left) + this.velocityX + 'px';
		this.rep.style.top = constrain(parseInt(this.rep.style.top) + this.velocityY, 0, base_y) + 'px';
	}
}

// determine where to draw the ground
let base_y = Math.floor($(window).height()*2 /3);

let player = new Player('player');
let vm = new VegetableManager();

// set up background
let sky = document.getElementById('sky');
let ground = document.getElementById('ground');

sky.style.width = $(window).width() + 'px';
sky.style.height = $(window).height() + 'px';
sky.style.top = '0px';
sky.style.left = '0px';

console.log($(window).width());

ground.style.width = $(window).width() + 'px';
ground.style.height = $(window).height() - (base_y + player.rep.clientHeight) + 'px';
ground.style.top = base_y + player.rep.clientHeight + 'px';
ground.style.left = '0px';

let keys = {};

player.rep.style.top = base_y + 'px';

window.onkeydown = function(e) {
    let key = e.keyCode ? e.keyCode : e.which;
		keys[key] = true;
}

window.onkeyup = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
	keys[key] = false;
}

function checkKeys() {
	if (keys[87]) {
		if (parseInt(player.rep.style.top) == base_y) {
			player.velocityY = -1 * player.maxVelY;
		}
	}
	if (keys[65]) {
		player.accelX = -20;
	}
	if (keys[68]) {
		player.accelX = 20;
	}
}

//runs the game at a specified fps
//dont touch i dont know how it works

let fpsInterval, then, startTime, elapsed;
function startGame(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    runGame();
}

function runGame() {
    requestAnimationFrame(runGame);
    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
		then = now - (elapsed % fpsInterval);
		checkKeys();
		player.update();
    }
}

startGame(60);