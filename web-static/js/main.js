function start(){
	console.log("ok");

	//var win = new Window('main-window', document.getElementById("gui"));
	var win = new Window('main-window', document.getElementById("gui"));
	
	var infoPage = new InfoPage();
	
	$("#gui").append($("<div>").button().html("Menu").click(function(){
		$(win.root).toggle('fade',200);
	}));
	$(win.root).hide();
	
	try{
		win.addPage("info", infoPage);
		win.addPage("description", new Page("<strong>hello</strong> world"));
		win.addPage("equipement", new Page("lorem ipsum"));
	}catch(e){
		console.log("New Exception : " + e);
	}
	
	infoPage.refreshData({
		xp: 23,
		hp: 100,
		power: 42,
		playerName: "Ulrich",
		playerTitle: "Samouraï",
		playerProgress: 0.8
	});
}