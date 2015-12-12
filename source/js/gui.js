define('gui',['helpers'],function(helpers){


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
		}	
});