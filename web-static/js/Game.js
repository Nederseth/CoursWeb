var Game = function(){
	var self = this;
	var sleep = 1;
	this.localTime = 0;
	this.globalTime = 0;

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

	player = new Player();
	camera = new Camera(player);

	player.setPosition(3530, 1770);
	player.init();
	
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
	var soundList = {};
	
	this.assetManager = new AssetManager();
	this.assetManager.startLoading(imageList, soundList);

	requestAnimFrame(
		function loop() {
			self.mainLoop();
			requestAnimFrame(loop);
		}					
	);
};
Game.prototype.mainLoop = function(){
	var now = Date.now();
	var globalTimeDelta = now - this.globalTime;
	var localTimeDelta = Math.min(50, globalTimeDelta);
	this.localTime += localTimeDelta;
	
	this.graphics.canvas = this.canvas;
	this.graphics.drawTimeMillis = now;
	
	this.graphics.clearRect(0,0,this.canvas.width,this.canvas.height);
	
	if(!this.assetManager.isDoneLoading()){
		this.assetManager.renderLoadingProgress(this.graphics);
	}else{
		this.graphics.save();
		camera.render(this.graphics);
		this.graphics.drawImage(this.assetManager.getImage("background"),0,0);
		this.graphics.restore();
	}
	
	player.update(localTimeDelta / 1000);
};