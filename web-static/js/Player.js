var Player = function(){
	var self = this;
	Character.call(this);
	
	this.keyList = {};
	
	// TODO bind event
	$(document).keyup(function(e){
		//console.log(e.which);
		self.onKeyUp(e.which);
	});
	
	$(document).keydown(function(e){
		self.onKeyDown(e.which);
	});
	
	this.speed = {
		x: 600,
		y: 200
	};

	/*this.spriteList = {
		"idle-left": new Sprite(this.$elm, "idle-left", "/CoursWeb-static/img/sprite/revert-idle-1-2-1.png", 2048, 256, 16, 2, true),
		"idle-right": new Sprite(this.$elm, "idle-right", "/CoursWeb-static/img/sprite/idle-1-2-1.png", 2048, 256, 16, 2, true),
		"attack-left": new Sprite(this.$elm, "attack-left", "/CoursWeb-static/img/sprite/revert-attack-1-2-1.png", 2048, 128, 16, 1, false),
		"attack-right": new Sprite(this.$elm, "attack-right", "/CoursWeb-static/img/sprite/attack-1-2-1.png", 2048, 128, 16, 1, false),
		"move-left": new Sprite(this.$elm, "move-left", "/CoursWeb-static/img/sprite/revert-move-1-2-1.png", 896, 128, 7, 1, true),
		"move-right": new Sprite(this.$elm, "move-right", "/CoursWeb-static/img/sprite/move-1-2-1.png", 896, 128, 7, 1, true)
	};

	this.spriteList["move-left"].frameCount = 6;
	this.spriteList["move-right"].frameCount = 6;
	this.revertDirection = false;
	this.setSprite("idle");*/
};
Player.MIN_Y = 1455;
Player.MAX_Y = 1920;
Player.MIN_SCALE = 0.5;
Player.MAX_SCALE = 1.3;

Player.prototype = new Character();
Player.prototype.init = function(){
};
Player.prototype.setPosition = function(x, y){
	var lastY = this.y;
	Character.prototype.setPosition.call(this, x, y);
	
	if(this.y != lastY){
		var factor = (y - Player.MIN_Y) / (Player.MAX_Y - Player.MIN_Y);
		this.setScale(factor * (Player.MAX_SCALE - Player.MIN_SCALE) + Player.MIN_SCALE);
	}
};

Player.prototype.setScale = function(scale){
        this.scale = scale;
        for(var i in this.spriteList){
                this.spriteList[i].setScale(this.scale);
        }
};

Player.prototype.update = function(deltaTime){
	var move = {x: 0, y: 0};
	
	//console.log(this.keyList);
	
	for(var i in this.keyList){
		if (this.keyList[i]){
			switch(i){
				case "37": /*gauche*/
				move.x = - this.speed.x;
				this.revertDirection = true;
				break;
				case "38": /*haut*/
				move.y = -this.speed.y;
				break;
				case "39": /*droite*/
				move.x = this.speed.x;
				this.revertDirection = false;
				break;
				case "40": /*bas*/
				move.y = this.speed.y;
				break;
			}
		}
	}
	this.move(move.x * deltaTime * this.scale, move.y * deltaTime * this.scale);
	if(move.x != 0 || move.y != 0){
		//this.setSprite ("move");
	}else{
		//this.setSprite ("idle");
	}
	
	// Q (113|81)

	// S (115|83)

	// D (100|68)

	// Z (122|90)


	// this.move(xDistance, yDistance)
	// this.setSprite (move, idle)
};

Player.prototype.onKeyDown = function(k){
	this.keyList[k] = true;
};
Player.prototype.onKeyUp = function(k){
	this.keyList[k] = false;
};