strandifyMain=function(){
	//ACTIONS
	var actions={
			getItem:function(itemId){
					var quantityRand=getRandomIntInclusive(0,5);
					for(var single in objects){
							if(objects[single].itemId===itemId){
								objects[single].addToBackpack(quantityRand);
							}
					}
			},
			searchApple:function(){
				var staminaCost=5;
				if(playerStatus.stamina>=staminaCost){
					this.getItem(1);
					playerStatus.stamina-=staminaCost;	
					gui.updatePlayerStatus();
				}
				else{
					helpers.message('You don\'t have enought stamina. Get some rest.');
				}
			},
			chopWood:function(){
				var staminaCost=10;
				if(playerStatus.stamina>=staminaCost){
					this.getItem(2);
					playerStatus.stamina-=staminaCost;	
					gui.updatePlayerStatus();
				}
				else{
					helpers.message('You don\'t have enought stamina. Get some rest.');
				}
			},
			goToSleep:function(){
				playerStatus.stamina=playerStatus.maxStamina;
				worldStatus.day+=1;
				helpers.message('You slept well');

				gui.updatePlayerStatus();
				gui.updateWorldStatus();
			}
	}
};