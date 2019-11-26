function constrain(val, min, max) {
	if (val > max) {
		val = max;
	}
	if (val < min) {
		val = min;
	}
	return val;
}

class Player {
	constructor(id) {
		this.id = id;
		this.velocityX = 0;
		this.velocityY = 0;
		this.accelX = 0;
		this.accelY = 1; //gravity

		this.maxAccelX = 10;
		this.maxVelX = 40;
		this.maxVelY = 100;

		this.rep = document.getElementById(this.id);
		this.rep.style.left = '0px';
	}

	update() {
		this.velocityX = constrain(this.velocityX + this.accelX, -1*this.maxVelX, this.maxVelX);
		this.velocityY = constrain(this.velocityY + this.accelY, -1*this.maxVelY, this.maxVelY);
		console.log("accel: " + this.accelX + "\tvel: " + this.velocityX);

		this.velocityX = Math.floor(this.velocityX/2);
		this.accelX = 0;

		this.rep.style.left = parseInt(this.rep.style.left) + this.velocityX + 'px';
		this.rep.style.top = constrain(parseInt(this.rep.style.top) + this.velocityY, 0, base_y) + 'px';
	}
}

let base_y = Math.floor($(window).height() /2);

let player = new Player('player');
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
			player.velocityY = -20;
		}
	}
	if (keys[65]) {
		player.accelX = -20;
	}
	if (keys[68]) {
		player.accelX = 20;
	}
}

function main() {
	//console.log(keys);
	checkKeys();
	player.update();
	requestAnimationFrame(main);
}

main();