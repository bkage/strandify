strandifyMain=function(){
	//GENERAL USER OPTIONS (like save,reset etc)
	var config={
		saveGame:function(){
			var data={
				dataBackpack:backpack,
				dataPlayerStatus:playerStatus,
				dataWorldStatus:worldStatus
			}
			$.cookie('saveData',JSON.stringify(data));
			helpers.message('Game saved')
		},
		loadGame:function(){
			
			if(typeof $.cookie('saveData')!=='undefined'){
				var loadedData=JSON.parse($.cookie('saveData'));	
				backpack=loadedData.dataBackpack;
				playerStatus=loadedData.dataPlayerStatus;
				worldStatus=loadedData.dataWorldStatus;

				gui.init();

				helpers.message('Game loaded');
			}
			else{
				helpers.message('No save games found')
			}

			
		}

	};	
};