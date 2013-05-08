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
		// if (self.cooldown == true) {

			// self.collidable = true;
			self.cooldown = false;

			setTimeout(function(){self.cooldown = true},700);
			// Which side is the player attacking?	
			if (clientData[0] == 'left') {
				
				if (mainPlayer[0].crouchAttack == true) {
					// console.log('worked')
					this.updateColRect(-13,145, 185,25);
					mainPlayer[0].crouchAttack = false
				} 	
				else {
					this.updateColRect(-13,145, 150,25);
				} 	
			}
			if (clientData[0] == 'right') {

				if (mainPlayer[0].crouchAttack == true) {
					// console.log('worked')
					this.updateColRect(103,145, 185,25);
					mainPlayer[0].crouchAttack = false
				} 	 	
				else this.updateColRect(103,145, 150,25);
			}
			self.collidable = false;
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

		// COLLISIONS with various objects
		var res = me.game.collide(this);

		// this.computeVelocity(this.vel);
		// this.pos.add(this.vel);

	}
});