var Player = function(assetManager){
	var self = this;
	Character.call(this);
	this.assetManager = assetManager;
	
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
	
	this.centerX = 64;
	this.centerY = 120;

	this.createSprite("idle", assetManager.getImage("player-idle"), 2048, 256, 16, 2, true);
	this.createSprite("attack", assetManager.getImage("player-attack"), 2048, 128, 16, 1, false);
	this.createSprite("move", assetManager.getImage("player-move"), 896, 128, 7, 1, true);
	
	for(var i in this.spriteList){
		this.spriteList[i].setCenter(this.centerX,this.centerY);
	}
	/*this.spriteList = {
		"idle-left": new Sprite(this.$elm, "idle-left", "/CoursWeb-static/img/sprite/revert-idle-1-2-1.png", 2048, 256, 16, 2, true),
		"idle-right": new Sprite(this.$elm, "idle-right", "/CoursWeb-static/img/sprite/idle-1-2-1.png", 2048, 256, 16, 2, true),
		"attack-left": new Sprite(this.$elm, "attack-left", "/CoursWeb-static/img/sprite/revert-attack-1-2-1.png", 2048, 128, 16, 1, false),
		"attack-right": new Sprite(this.$elm, "attack-right", "/CoursWeb-static/img/sprite/attack-1-2-1.png", 2048, 128, 16, 1, false),
		"move-left": new Sprite(this.$elm, "move-left", "/CoursWeb-static/img/sprite/revert-move-1-2-1.png", 896, 128, 7, 1, true),
		"move-right": new Sprite(this.$elm, "move-right", "/CoursWeb-static/img/sprite/move-1-2-1.png", 896, 128, 7, 1, true)
	};*/

	this.spriteList["move"].frameCount = 6;
	this.revertDirection = false;
	this.setSprite("idle");
};
Player.MIN_Y = 1500;
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
				/*case "96":
				this.setSprite ("attack");*/
			}
		}
	}
	this.move(move.x * deltaTime * this.scale, move.y * deltaTime * this.scale);
	if(move.x != 0 || move.y != 0){
		this.setSprite ("move");
	}else{
		this.setSprite ("idle");
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
	
	if(k==32){
		this.setSprite ("attack");
		var sound = this.assetManager.getSound("test");
		for(var idx in game.mobList){
			var distance = Math.sqrt(Math.pow(this.x-game.mobList[idx].x,2)+Math.pow(this.y-game.mobList[idx].y,2));
			if(distance < 50){
				game.mobList[idx].setSprite("death");
				sound.play();
			}
		}
	}
};
Player.prototype.onKeyUp = function(k){
	this.keyList[k] = false;
};