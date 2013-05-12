/************************************************************************************/
/*																					*/
/*		Main weapon entity															*/
/*																					*/
/************************************************************************************/

var weaponEntity = me.ObjectEntity.extend({	


	init: function (x, y, settings) {

		mainPlayer = me.game.getEntityByName('mainPlayer')
		// console.log(mainPlayer[0].pos.x)

		this.parent(mainPlayer[0].pos.x+10, mainPlayer[0].pos.y, settings);
		
		// make it collidable
		this.collidable = false;
		this.weapon = 'sword';
		this.cooldown = true;
		
	},

	attack : function () {

			var self = this;

			// Which side is the player attacking?	
			if (clientData[0] == 'left') {
				
				if (mainPlayer[0].renderable.isCurrentAnimation('crouchattack')) {
					this.updateColRect(-13,145, 185,25);
				} 	
				else if (mainPlayer[0].renderable.isCurrentAnimation('attack')) {
					this.updateColRect(-13,145, 150,25);
				} 	
			}
			if (clientData[0] == 'right') {

				if (mainPlayer[0].renderable.isCurrentAnimation('crouchattack')) {
					this.updateColRect(103,145, 185,25);
				} 	 	
				else if (mainPlayer[0].renderable.isCurrentAnimation('attack')) {
					this.updateColRect(103,145, 150,25);
				}
			}

		// COLLISIONS with various objects
		var res = me.game.collide(this);
		console.log(res)
		if (!res) {
			// console.log('worked')
			// me.audio.play("35", false); 
		}
		// }
	},

	update : function () {

		this.updateColRect(4000,0, 4000,0);
		mainPlayer = me.game.getEntityByName('mainPlayer')
		this.pos.x = mainPlayer[0].pos.x;
		this.pos.y = mainPlayer[0].pos.y;

		if (mainPlayer[0].attack == true) { 
			this.attack(); 
		}


		// this.computeVelocity(this.vel);
		// this.pos.add(this.vel);

	}
});