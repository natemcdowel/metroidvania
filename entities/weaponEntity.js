/************************************************************************************/
/*																					*/
/*		Main weapon entity															*/
/*																					*/
/************************************************************************************/

var weaponEntity = me.ObjectEntity.extend({	


	init: function (x, y, settings) {

		mainPlayer = me.game.getEntityByName('mainPlayer')

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

/************************************************************************************/
/*																					*/
/*		Secondary weapon entity														*/
/*																					*/
/************************************************************************************/
var secondWeaponEntity = me.ObjectEntity.extend({	

    init: function(x, y, settings, direction) {

		
		// call the constructor
	    this.parent(x, y, settings);

	    var mainPlayer = me.game.getEntityByName('mainPlayer')[0]

	     // apply gravity setting if specified
		this.gravity = settings.gravity || me.sys.gravity;
		this.collidable = true;
		this.weapon = 'sword';

		this.renderable.addAnimation ("dagger", [0]); 
		this.renderable.addAnimation ("axe", [2]);  

		this.renderable.setCurrentAnimation(mainPlayer.secWeapon);

		if (mainPlayer.secWeapon == 'dagger') {
			// walking & jumping speed
			if (direction == 'right') {
				this.vel.x = 35; 
				this.flipX(false);
			}
			else {
				this.pos.x += 100; 
				this.vel.x = -35;
				this.flipX(true);
			}
		}

		if (mainPlayer.secWeapon == 'axe') {

			// this.setFriction(1.2,0); 
			this.gravity = 2.2

			// walking & jumping speed
			if (direction == 'right') {
				this.vel.x = 18; 
				this.vel.y = -38;
				this.flipX(false);
			}
			else {
				this.pos.x += 100; 
				this.vel.y = -38;
				this.vel.x = -18;
				this.flipX(true);
			}
		}
	     this.rotate = 10;
	     this.updateColRect(20,32, 100,0);  


	},

	update : function () {

		this.rotate += 35;
		this.renderable.angle = Number.prototype.degToRad (this.rotate);

		var res = me.game.collide(this);
		if (res) {
			if (res.obj.type == me.game.ENEMY_OBJECT)
			me.game.remove(this)
		}

		this.computeVelocity(this.vel);
		this.pos.add(this.vel);
		// this.updateMovement();

		if (this.vel.x == 0 || this.pos.x < 40 || this.pos.x > (me.game.currentLevel.width - 80)) me.game.remove(this)
		return false;
	},
});



