define('bind',['config'],function(config){


	strandifyMain=function(){
		//BINDING TO UI
			//this binds buttons from UI to functions
			var bind={
				init:function(){
					
					this.getApple();
					this.getWood();
					this.goToSleep();
					this.saveGame();
					this.loadGame();
					this.showGameOptions();
					
					this.update();
				},
				rebind:function(){	//Rebind dynamic buttons on event
					this.dropObjectFromBackpack();	
					
				},
				update:function(){
					$('.actions button, .items button').click(function(){
							gui.updateBackpack();
							bind.rebind();
					})	;
				},
				getApple:function(){
						$('#getApple').click(function(){
								actions.searchApple();
						});
				},
				getWood:function(){
						$('#getWood').click(function(){
							actions.chopWood();	
						});
				},
				goToSleep:function(){
					$('#goToSleep').click(function(){
						actions.goToSleep();
					});
				},
				saveGame:function(){
					$('#saveGame').click(function(){
						config.saveGame();
					});
				},
				loadGame:function(){
					$('#loadGame').click(function(){
						config.loadGame();
					});
				},
				showGameOptions:function(){
					$('.game-options-drop').click(function(){
						$('.game-options').stop(true).slideToggle();
					});
				},
				dropObjectFromBackpack:function(){
						$('.remove').click(function(){
							var itemToDropId=parseInt($(this).attr('data-item-id')),
							quantity=parseInt($(this).attr('data-quantity')),
							itemToDrop=helpers.getItemFromBackpack(itemToDropId);
							
							//Restore quantity
							//if there are less elements then dropping, restore only quantiity of elements
							if(quantity>itemToDrop.quantity){
									backpack.capacity+=itemToDrop.quantity*itemToDrop.weight;
							}
							else{
									backpack.capacity+=quantity*itemToDrop.weight;
							}
							itemToDrop.removeFromBackpack(quantity);
							
							helpers.message(itemToDrop.name+' dropped');
							
							gui.updateBackpack();
							bind.rebind();
							
						});
				}
			};	
	};
});