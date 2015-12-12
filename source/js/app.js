(function(){
		'use strict';
		
		
		//BACKPACK STRUCTURE
		var backpack={
			
			capacity:10,
			maxCapacity:10,
			items:[]
				 
		};

		//PLAYER STATUS
		var playerStatus={
			hp:40,
			maxHp:40,
			stamina:100, 
			maxStamina:100
		};

		//WORLD STATUS
		var worldStatus={
			day:1
		};

		//STRUCTURES 
		var playerStructures={

		};
		
		//ITEMS CONSTRUCT
		function item(itemName, itemWeight, itemCategory, itemId){
				this.name=itemName;
				this.weight=itemWeight;
				this.category=itemCategory;
				this.itemId=itemId;
				this.quantity=0;
				
				this.addToBackpack=function(quantity){
					if(quantity===0){
						helpers.message('No '+itemName+' found');
						return false;
					}
					if(this.weight*quantity<=backpack.capacity && backpack.capacity>=this.weight){
							
						//search for same elements and group. If not found push to array
						if(helpers.searchBackpackFor(itemId)===false){
							backpack.items.push(this);
						}
						backpack.capacity-=this.weight*quantity;
						helpers.message(quantity+' '+itemName+' added');
						this.quantity+=quantity;
						return true;
					}	
					else{
							helpers.message('No more space in storage for '+quantity+' '+itemName);
							return false;
					}
					
				}
				this.removeFromBackpack=function(quantity){
						var searcher=helpers.searchBackpackFor(this.itemId);
						if(searcher){	//search for this object in backpack
							//if quantity in backpack is less then we want to remove, then zero it
							if(backpack.items[searcher].quantity>quantity){
							backpack.items[searcher].quantity-=quantity;
							}
							else{
								backpack.items[searcher].quantity=0;
							}
							if(backpack.items[searcher].quantity<=0) {
									backpack.items.splice(searcher,1);
							}
						}
						else{
								helpers.message('You have no '+this.name+' in backpack');
						}
				}
		}

		//GENERAL OBJECTS
		/*Constructor:

			object_name --> typeoff string
			object_weight --> typeoff number
			object_category --> typeoff string
			object_itemId --> typeoff number

		*/
		var apple=new item('Apple',0.2,'food',1),
		wood=new item('Wood',2,'raw',2),
		stone=new item('Stone',5,'raw',3);
		
		var objects=[apple,wood,stone];

		//STRUCTURE LIST
		var structureList={
			bonfire:{
				materialCost:[
					{
						materialId:1,
						quantity:5
					},
				],
			}
		};



		//STRUCTURES BUILER
		var builder={
			build:function(buildingStructure){
				console.log(typeof playerStructures.bonfire);
				if(typeof playerStructures.bonfire!=undefined){	//check if already built
					var building=true;	//building state
					
					for(var single in buildingStructure.materialCost){	//check for available materials
						
						var singleMaterial=buildingStructure.materialCost[single];	//iteration alias
						var backpackItem=helpers.getItemFromBackpack(singleMaterial.materialId);	//materials to compare

						if(singleMaterial.quantity>backpackItem.quantity || backpackItem===false){
							building=false;	//deny building state
							helpers.message('Not enough '+backpackItem.name);
						}
						else{	//remove materials from backpack
							var backpackItemIndex=helpers.searchBackpackFor(singleMaterial.materialId);
							backpack.items[backpackItemIndex].quantity-=singleMaterial.quantity;
						}
					}
					if(building){
						playerStructures.bonfire=true;
						helpers.message('building complete');
					}
					
				}
			},
		};



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
				},
		}
		
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
				this.buildBonfire();
				
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
			buildBonfire:function(){
				$('#buildBonfire').click(function(){
					builder.build(structureList.bonfire);
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
		
		//HELPER FUNCTIONS
		//general develop helper functions
		var helpers={
			message:function(myMessage){
				$('.messages ul').prepend('<li>'+myMessage+'</li>');
			},
			searchBackpackFor:function(itemId){	//search backpack for itemId. If found return it's index
					for(var single in backpack.items){
							if(backpack.items[single].itemId===itemId){
									return single;
							}
					}
					return false;
			},
			getItemFromBackpack:function(itemId){
				for(var single in backpack.items){
					if(backpack.items[single].itemId===itemId){
						return backpack.items[single];
					}
				}
				return false;
			}
		};	
		
		//GUI FUNCTIONS
		var gui={
			init:function(){
				this.updateBackpack();
				this.updateWorldStatus();
				this.updatePlayerStatus();
			},
			updateBackpack:function(){

					$('.backpack .items table tr').each(function(){		//group and remove duplicates. Function removes same records
						var objectItem=helpers.getItemFromBackpack(parseInt($(this).attr('data-item-id')));
						//remove all existing elements
						if($(this).hasClass('single')){
								$(this).remove();
						}
						
					});
					//show capacity
					$('.backpack .capacity span').html(parseFloat(JSON.stringify(backpack.capacity)).toFixed(2));
					//append new item's list
					for(var item in backpack.items){
						item=backpack.items[item];
						
						$('.backpack .items table').append('<tr class="single" data-item-id="'+item.itemId+'"><td>'+item.name+'</td><td>'+item.weight+'</td><td>'+item.quantity+'</td><td><button class="remove" data-item-id='+item.itemId+' data-quantity=5>Drop 5</button><button class="remove" data-item-id='+item.itemId+' data-quantity=1>Drop 1</button></td></tr>');
					}
					
			},
			updateWorldStatus:function(){
				$('#world-day span').html(worldStatus.day);
			},
			updatePlayerStatus:function(){
				$('#player-hp span').html(playerStatus.hp);
				$('#player-stamina span').html(playerStatus.stamina);
			}
		};	

		//GENERAL APP
		var strandify={
				
			init:function(){
					gui.updateBackpack();
					bind.init();
					console.log('binding UI successfull');
					gui.init();
					console.log('GUI loaded successfully');

					console.log('App loaded successfully!');
					helpers.message('You wake up in the island. Stranded...')
			}
			
			
		};
		//APP START
		strandify.init();
		
		
			
	//HELP GENERAL FUNCTIONS
	function getRandomIntInclusive(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}());