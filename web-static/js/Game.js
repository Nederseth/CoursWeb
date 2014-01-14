var Game = function(){
	var self = this;
	var sleep = 0;
	this.localTime = 0;
	this.globalTime = 0;

	this.loadEndTime;
	this.alphaScene = 0;
	
	//var win = new Window('main-window', document.getElementById("gui"));
	var win = new Window('main-window', document.getElementById("gui"));
	
	infoPage = new InfoPage();
	try{
		win.addPage("info", infoPage);
		win.addPage("description", new Page("<strong>hello</strong> world"));
		win.addPage("equipement", new Page("lorem ipsum"));
	}catch(e){
		console.log("New Exception : " + e);
	}
	
	infoPage.refreshData({
		name: "Johnny",
		title: "be good",
		xp: 200,
		hp: 643,
		power: 65,
		progress: 0.8
	});
	$scene = $("#main-scene");

	$("#gui").append($("<div>").button().css({position: "absolute", top:"5px", left:"5px"}).append("Menu").click(function(){
		//$(win.root).toggle('fade', 200);
		if($(win.root).hasClass("visible")){
			$(win.root).removeClass("visible");
		}else{
			$(win.root).addClass("visible");
		}
	}));
	//$(win.root).hide();
	
	this.canvas = $(".scene-view")[0];
	this.graphics = this.canvas.getContext("2d");
	
	this.graphics.fillStyle = "rgba(255,0,0,0.5)";
	this.graphics.fillRect(0,0, this.canvas.width, this.canvas.height);
	
	this.graphics.strokeStyle = "blue";
	this.graphics.strokeRect(this.canvas.width/2 -50, this.canvas.height/2 -50,100,100);
	
	var sleep = 2;
	var baseURL = "/CoursWeb-static/img/getImage.php?url=";
	var imageList = {
		"background": baseURL + "forest.jpg&sleep=" + sleep,
		"player-idle": baseURL + "sprite/idle-1-2-1.png&sleep=" + sleep,
		"player-attack": baseURL + "sprite/attack-1-2-1.png&sleep=" + sleep,
		"player-move": baseURL + "sprite/move-1-2-1.png&sleep=" + sleep,
		"mob-idle": baseURL + "sprite/idle-1.png&sleep=" + sleep,
		"mob-damage": baseURL + "sprite/damage-1.png&sleep=" + sleep,
		"mob-attack": baseURL + "sprite/attack-1.png&sleep=" + sleep,
		"mob-death": baseURL + "sprite/death-1.png&sleep=" + sleep
	}
	var baseURL = "/CoursWeb-static/sound/";
	var soundList = {
		"music": baseURL + "Kalimba.mp3",
		"test": baseURL + "test.wav"
	};
	
	this.assetManager = new AssetManager();
	this.assetManager.startLoading(imageList, soundList);

	player = new Player(this.assetManager);
	ennemi = new Ennemy(this.assetManager);
	camera = new Camera(player);

	player.setPosition(3530, 1770);
	player.init();
	
	this.mobList = [];
	
	var handlerTimeOut = function(){
		console.log("New Kankrelat !");
		self.popMob();
		if(self.mobList.length < 200){
			setTimeout(handlerTimeOut,500);
		}
	}
	
	/*var handlerInterval = function(){
		console.log("Hello Interval");
	}*/
	
	setTimeout(handlerTimeOut,500);
	/*setInterval(function(){
		console.log("OK");
	},2000);*/
	
	requestAnimFrame(
		function loop() {
			self.mainLoop();
			requestAnimFrame(loop);
		}					
	);
};

Game.prototype.popMob = function(){
	var En = new Ennemy(this.assetManager);
	this.mobList.push(En);
	
	this.mobList.sort(function(a,b){
		return a.y - b.y;
	});
}

Game.prototype.mainLoop = function(){
	var now = Date.now();
	var globalTimeDelta = now - this.globalTime;
	var localTimeDelta = Math.min(50, globalTimeDelta);
	this.localTime += localTimeDelta;
	
	this.graphics.canvas = this.canvas;
	this.graphics.drawTimeMillis = now;
	
	this.graphics.clearRect(0,0,this.canvas.width,this.canvas.height);
	
	if(this.assetManager.isDoneLoading()){
		if(!this.loadEndTime){
			this.loadEndTime = Date.now();
			var music = this.assetManager.getSound("music");
			music.loop = true;
			music.volume = 0.1;
			//music.play();
			//console.log(this.globalTime +" = "+ this.localTime);
		}
	}
	
	if(this.alphaScene < 1){
		this.assetManager.renderLoadingProgress(this.graphics);
	}
	
	if(this.loadEndTime){
		this.graphics.save();
		this.alphaScene = tween(0,1,this.loadEndTime,2000, "easeInOutSine");
		this.graphics.globalAlpha = this.alphaScene;
		camera.render(this.graphics);
		this.graphics.drawImage(this.assetManager.getImage("background"),0,0);
		
		player.update(localTimeDelta / 1000);
		//player.render(this.graphics);
		
		var playerFlag = false;
		for(var idx in this.mobList){

			if(this.mobList[idx].y < player.y)
				this.mobList[idx].render(this.graphics);
			else{
				if(!playerFlag){
					player.render(this.graphics);
					playerFlag = true;
				}
				this.mobList[idx].render(this.graphics);
			}
		}
		if(!playerFlag){
			player.render(this.graphics);
			playerFlag = true;
		}
		
		this.graphics.restore();
	}
	
};

var TWEEN_FACTOR = 1.5;
var TWEEN_EXPO_FACTOR = 4;
function tween(from, to, startTime, duration, easing){
	var now = Date.now();
	var t = (now-startTime) / duration;
	t = Math.max(0,Math.min(1,t));
	
	if(typeof(easing) != "undefined"){
		switch(easing){
			
			case "easeOut":
				t = Math.pow(t,1/TWEEN_FACTOR);
				break;
			case "easeIn":
				t = Math.pow(t,TWEEN_FACTOR);
				break;
			case "easeOutExpo":
				t = Math.pow(t,1/TWEEN_EXPO_FACTOR);
				break;
			case "easeInExpo":
				t = Math.pow(t,TWEEN_EXPO_FACTOR);
				break;
			case "easeOutSine":
				t = Math.sin(t * Math.PI / 2);
				break;
			case "easeInSine":
				t = Math.sin((t-1) * Math.PI / 2) + 1;
				break;
			case "easeInOutSine":
				t = Math.sin((t-0.5) * Math.PI) / 2 + 0.5;
				break;
		}
	}
	
	return from + t*(to-from);
}