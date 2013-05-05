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
				this.updateColRect(-108,150, 20,25);
			}
			if (clientData[0] == 'right') {

				if (mainPlayer[0].crouchAttack == true) {
					console.log('worked')
					this.updateColRect(10,150, 60,25);
					mainPlayer[0].crouchAttack = false
				} 	 	
				else this.updateColRect(103,150, 20,25);
			}
			self.collidable = false;
		// }
	},

	update : function () {

		this.updateColRect(0,0, 0,0);
		mainPlayer = me.game.getEntityByName('mainPlayer')
		this.pos.x = mainPlayer[0].pos.x;
		this.pos.y = mainPlayer[0].pos.y;

		if (mainPlayer[0].attack == true) { 
			this.attack(); 
		}

		// COLLISIONS with various objects
		var res = me.game.collide(this);
		// console.log(res);
		
		if (res) {
			switch (res.obj.type) {	
				case me.game.ENEMY_OBJECT : {
					// if ((res.y>0) && this.falling) {
					// 	// jump
					// 	this.vel.y -= this.maxVel.y * me.timer.tick;
					// } else {
					// 	this.hurt();
					// 	this.enemyhit();
					// }
					// break;
					// alert('test')
				}
				
				case "spikeObject" :{
					// jump & die
					this.vel.y -= this.maxVel.y * me.timer.tick;
					// this.hurt();

					break;
				}

				default : break;
			}
		}
	}
});