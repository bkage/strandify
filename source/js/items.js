strandifyMain=function(){


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
};