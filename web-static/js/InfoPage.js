
var InfoPage = function(){
	Page.call(this, "");
	
	this.attributeList = {};
	
	// Objet JQuery => un dollar ($) devant un objet pour savoir que c'est un objet JQuery (c'est juste une convention)
	this.$playerPreview = $("<div/>").addClass("player-preview");
	this.append(this.$playerPreview);

	this.$playerName = $("<div>").addClass("player-name").append("nom");
	this.append(this.$playerName);
	
	this.$playerTitle = $("<div>").addClass("player-title").append("title");
	this.append(this.$playerTitle);

	this.$playerProgress = $('<div class="player-progress"/>');
	this.$playerProgressIndic = $('<div class="player-progress-indic"/>');
	this.$playerProgress.append(this.$playerProgressIndic);
	this.append(this.$playerProgress);
	
	
	this.$attributeContainer = $("<dl>");
	this.append(this.$attributeContainer);
	
	this.addAttribute("xp", "XP");
	this.addAttribute("hp", "HP");
	this.addAttribute("power", "Puissance");
};
InfoPage.prototype = new Page();

InfoPage.prototype.refreshData = function(playerData){
	for(var id in playerData){
		if(id == "name"){
			$(".player-name").html(playerData[id]);
		}else if(id == "title"){
			$(".player-title").html(playerData[id]);
		}else if(id ==  "progress"){
			//$(".player-progress-indic").css('width', (playerData[id] * 100));
			$(".player-progress-indic").css('width', (playerData[id] * 100)+"%");
		}else{
			this.attributeList[id].html(playerData[id]).effect('pulsate',{times:5, duration: 300});
		}
	}
};

InfoPage.prototype.addAttribute = function(id, label){
	//id = classe du dd
	//label => dt
	
	var $dt = $("<dt>").append(label);
	this.$attributeContainer.append($dt);
	var $dd = $("<dd>").addClass(id).append(15);
	this.$attributeContainer.append($dd);
	
	this.attributeList[id] = $dd;
};