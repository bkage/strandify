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
		var playerStructures=[

		];

		
		
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

							//Restore capacity
							//if there are less elements then dropping, restore only quantiity of elements
							if(quantity<=this.quantity){
									backpack.capacity+=quantity*this.weight;
							}
							else{
									backpack.capacity+=this.quantity*this.weight;
							}

							//if quantity in backpack is less then we want to remove, then zero it
							if(backpack.items[searcher].quantity>quantity){
								backpack.items[searcher].quantity-=quantity;
							}
							else{
								backpack.items[searcher].quantity=0;
							}
							//remove from backpack.items array
							if(backpack.items[searcher].quantity<=0) {	
									backpack.items.splice(searcher,1);
							}

							helpers.message(this.name+' dropped');
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
		function singleStructure(buildingName,buildingId,materialArray){
			this.name=buildingName;
			this.structureId=buildingId;
			this.materialCost=materialArray;
		}

		var bonfire=new singleStructure('bonfire',1,[{materialId:2,quantity:2}]),
		woodenStorage=new singleStructure('Wooden storage',2,[{materialId:2,quantity:5}]);

		var structureList=[bonfire,woodenStorage];



		//STRUCTURES BUILER
		var builder={
			build:function(buildingStructure,staminaCost){
				if(playerStructures.indexOf(buildingStructure.name)===-1){	//check if already built
					var building=true;	//building state
					if(staminaCost<=playerStatus.stamina){
						for(var index in buildingStructure.materialCost){	//check for available materials
							
							var singleMaterial=buildingStructure.materialCost[index];	//iteration alias
							var backpackItem=helpers.getItemFromBackpack(singleMaterial.materialId);	//materials to compare

							if(singleMaterial.quantity>backpackItem.quantity || backpackItem===false){
								building=false;	//deny building state
								helpers.message('Not enough ');
							}
							else{	//remove materials from backpack

								var backpackItemIndex=helpers.searchBackpackFor(singleMaterial.materialId);
								backpack.items[backpackItemIndex].removeFromBackpack(singleMaterial.quantity);
							}
						}
						if(building){	//enought materials, check for stamina

								playerStructures.push(buildingStructure.name);	//add building to playerStructure array
								gui.updatePlayerStructures();
								
								playerStatus.stamina-=staminaCost;
								gui.updatePlayerStatus();

								gui.updateBackpack();

								helpers.message('building complete');
							
						}
					}
					else{
						helpers.message('Not enough stamina. Need '+staminaCost);
					}
					
				}
				else{
					helpers.message('You already have '+buildingStructure.name);
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
					dataWorldStatus:worldStatus,
					dataStructures:playerStructures,
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
					playerStructures=loadedData.dataStructures;

					gui.init();
					bind.rebind();

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
				this.buildWoodenStorage();

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
					var index=structureList.indexOf(bonfire);
					builder.build(bonfire,30);
				});
			},
			buildWoodenStorage:function(){
				$('#buildWoodenStorage').click(function(){
					var index=structureList.indexOf(woodenStorage);
					builder.build(structureList[index],50);
				});
			},
			dropObjectFromBackpack:function(){
					$('.remove').click(function(){
						var itemToDropId=parseInt($(this).attr('data-item-id')),
						quantity=parseInt($(this).attr('data-quantity')),
						itemToDrop=helpers.getItemFromBackpack(itemToDropId);
						
						itemToDrop.removeFromBackpack(quantity);
						
						
						
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
			},
			searchForStructureIndex:function(structureId){	//function returns index in array structureList
				for(var index in structureList){
							if(structureList[index].structureId===structureId){
									return index;
							}
					}
					return false;
			},
		};	
		
		//GUI FUNCTIONS
		var gui={
			init:function(){
				this.updateBackpack();
				this.updateWorldStatus();
				this.updatePlayerStatus();
				this.updatePlayerStructures();
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
			},
			updatePlayerStructures:function(){
				var _=$('.structures-list');
				_.find('li').remove();	//remove all structures

				for(var index in playerStructures){
					_.append('<li>'+playerStructures[index]+'</li>');	//append all
				}
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