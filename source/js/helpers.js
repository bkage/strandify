define('helpers',['bind'],function(bind){

	strandifyMain=function(){
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
	};
});