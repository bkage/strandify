(function(){
		'use strict';
		
		//BACKPACK STRUCTURE
		var backpack={
			
			capacity:10,
			items:[]
				
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
		var apple=new item('Apple',0.2,'food',1),
		wood=new item('Wood',2,'materials',2);
		
		var objects=[apple,wood];
			
		//ACTIONS
		var actions={
				getItem:function(itemId){
						var quantityRand=getRandomIntInclusive(0,5);
						for(var single in objects){
								if(objects[single].itemId===itemId){
									objects[single].addToBackpack(quantityRand);
								}
						}
				}
		}
		
		//BINDING TO UI
		//this binds buttons from UI to functions
		var bind={
			init:function(){
				
				this.getApple();
				this.getWood();
				this.myItems();
				
				
				this.update();
			},
			rebind:function(){	//Rebind dynamic buttons on event
				this.dropObjectFromBackpack();	
				
			},
			update:function(){
				$('.actions button, .items button').click(function(){
						strandify.updateBackpack();
						bind.rebind();
				})	;
			},
			getApple:function(){
					$('#getApple').click(function(){
							actions.getItem(1);
					});
			},
			getWood:function(){
					$('#getWood').click(function(){
						actions.getItem(2);	
					});
			},
			myItems:function(){
					$('#myItems').click(function(){
						helpers.message(JSON.stringify(backpack));
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
						
						strandify.updateBackpack();
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
		
		
		
		//GENERAL APP
		var strandify={
				
			init:function(){
					this.showBackpack();
					console.log('init Backpack show successfull');
					bind.init();
					console.log('binding UI successfull');
					
					console.log('App loaded successfully!');
			},
			showBackpack:function(){
				//show capacity
				$('.backpack .capacity span').html(parseFloat(JSON.stringify(backpack.capacity)).toFixed(2));
				
			},
			updateBackpack:function(){
					$('.backpack .items table tr').each(function(){
						var objectItem=helpers.getItemFromBackpack(parseInt($(this).attr('data-item-id')));
						//remove all existing elements
						if($(this).hasClass('single')){
								$(this).remove();
						}
						
					});
					//show capacity
					backpack.capicity=parseFloat(backpack.capacity).toFixed(2);
					$('.backpack .capacity span').html(parseFloat(JSON.stringify(backpack.capacity)).toFixed(2));
					//append new item's list
					for(var item in backpack.items){
						item=backpack.items[item];
						
						$('.backpack .items table').append('<tr class="single" data-item-id="'+item.itemId+'"><td>'+item.name+'</td><td>'+item.weight+'</td><td>'+item.quantity+'</td><td><button class="remove" data-item-id='+item.itemId+' data-quantity=5>Drop 5</button><button class="remove" data-item-id='+item.itemId+' data-quantity=1>Drop 1</button></td></tr>');
					}
					
			}
			
		};
		
		//APP START
		strandify.init();
			
	//HELP GENERAL FUNCTIONS
	function getRandomIntInclusive(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}());