/**
 * An enemy entity
 * follow a horizontal path defined by the box size in Tiled
 */

var PathEnemyEntity = me.ObjectEntity.extend({	
	/**
	 * constructor
	 */
	init: function (x, y, settings) {
		// call the parent constructor
		this.parent(x, y , settings);
		
		// apply gravity setting if specified
		this.gravity = settings.gravity || me.sys.gravity;
		
		// set start/end position
		this.startX = x;
		this.endX   = x + settings.width - settings.spritewidth
		this.pos.x  = x + settings.width - settings.spritewidth;
		
		this.walkLeft = false;

		// walking & jumping speed
		this.setVelocity(settings.velX || 1, settings.velY || 6);
		
		// make it collidable
		this.collidable = true;
		this.hitpoints = 10;

		this.type = me.game.ENEMY_OBJECT;
		this.timer = me.timer.getTime();

	},
		
	
	/**
	 * manage the enemy movement
	 */
	update : function () {


		var self = this;
		// do nothing if not visible
		if (!this.inViewport) {
			return false;
		}
		
		if (this.alive)	{

			// console.log(me.timer.getTime()+' --- '+self.timer)

			if (this.hurt) {

				this.vel.x = 0;
				this.vel.y = 0;
			}
    		else if (me.timer.getTime() > self.timer+2000) {

    			// console.log('player')
    			
    			self.moveTo();
    			
    		}
    		// else if (me.timer.getTime() > self.timer+5000)  {

    		// 	console.log('normal')
    		// 	self.timer = me.timer.getTime();
    		// 	// self.timer = me.timer.getTime();
    		// 	self.moveToPlayer(500, 800);
    		// 	// console.log('no timer')
    		// }
			// if (this.walkLeft && this.pos.x <= this.startX) {
			// 	this.vel.x = this.accel.x * me.timer.tick;
			// 	this.walkLeft = false;
			// 	this.flipX(true);
			// } else if (!this.walkLeft && this.pos.x >= this.endX) {
			// 	this.vel.x = -this.accel.x * me.timer.tick;
			// 	this.walkLeft = true;
			// 	this.flipX(false);
			// }
		} else {
			this.vel.x = 0;
		}
		
		// check & update movement
		this.updateMovement();
		
		// return true if we moved of if flickering
		return (this.parent() || this.vel.x != 0 || this.vel.y != 0);
	},


	moveTo : function (x, y) {

		// Go to specified position
		if (typeof x != 'undefined') {
	        var xDir = x - this.pos.x; 
	        var yDir = y - this.pos.y;
	        // console.log(x + ' -- ' + y)
		}
		else {
		//get player entity
			var player = me.game.getEntityByName("mainPlayer")[0];

			if (player.pos.x > this.pos.x) this.flipX(true);
			else this.flipX(false);
			//create vector based on player's postion
	        var xDir = player.pos.x - this.pos.x; 
	        var yDir = player.pos.y - this.pos.y;
    	}

        //Decide distance
        xDir = (Math.abs(xDir) < 8) ? 0 : xDir.clamp(-1,1);
        yDir = (Math.abs(yDir) < 8) ? 0 : yDir.clamp(-1,1);
        
        this.vel.x = this.accel.x * xDir;

        this.vel.y = this.accel.y * yDir;

	},
	/**
	 * collision handle
	 */
	onCollision : function (res, obj) {
		// res.y >0 means touched by something on the bottom
		// which mean at top position for this one
		// if (this.alive && (res.y > 0) && obj.falling) {

		var self = this;
		console.log(obj)

		if (this.alive && obj.weapon == 'sword') {
			// make it dead
			
			// and not collidable anymore
			
			// set dead animation
			
			// make it flicker and call destroy once timer finished

			
			


			this.hurting();

			

			
			
		}
	},

	/**
	 * ouch
	 */
	hurting : function () {

		if (!this.renderable.flickering)
		{	
			var self = this;


			this.hitpoints -= 1;
			this.hurt = true;
			setTimeout(function(){self.hurt = false;},1000);

			// flash the screen
			if (this.hitpoints <= 0) {
				
				this.alive = false; 
				this.collidable = false;
				this.renderable.flicker(45, function(){me.game.remove(self)});
			}
			else {

				me.game.HUD.updateItemValue("score", 1);
				me.audio.play("enemykill", false);
				this.renderable.flicker(45);
			}
		}
	},
});



/**
 * A Crow enemy entity
 * 
 */
var CrowEnemyEntity = PathEnemyEntity.extend({	
	/**
	 * constructor
	 */
	init: function (x, y, settings) {
		// parent constructor
		this.parent(x, y, settings);

		// custom animation speed ?
		if (settings.animationspeed) {
			this.renderable.animationspeed = settings.animationspeed; 
		}

		// walking animatin
		this.renderable.addAnimation ("walk", [0,1,2]);
		// dead animatin
		this.renderable.addAnimation ("dead", [2]);
		
		// set default one
		this.renderable.setCurrentAnimation("walk");

		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);		
	},

});

/**
 * A Crow enemy entity
 * 
 */
var BatEnemyEntity = PathEnemyEntity.extend({	
	/**
	 * constructor
	 */
	init: function (x, y, settings) {
		// parent constructor
		this.parent(x, y, settings);

		// custom animation speed ?
		if (settings.animationspeed) {
			this.renderable.animationspeed = settings.animationspeed; 
		}

		// walking animatin
		this.renderable.addAnimation ("walk", [0,1,2]);
		// dead animatin
		this.renderable.addAnimation ("dead", [2]);
		
		// set default one
		this.renderable.setCurrentAnimation("walk");

		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);		
	},

});

/**
 * An Fly enemy entity
 * follow a horizontal path defined by the box size in Tiled
 */
var SkeletonEnemyEntity = PathEnemyEntity.extend({	
	/**
	 * constructor
	 */
	init: function (x, y, settings) {

		// parent constructor
		this.parent(x, y, settings);

		// custom animation speed ?
		if (settings.animationspeed) {
			this.renderable.animationspeed = settings.animationspeed; 
		}

		// // walking animatin
		this.renderable.addAnimation ("walk", [0,1,2]);
		// dead animatin
		this.renderable.addAnimation ("dead", [2]);
		
		// // set default one
		this.renderable.setCurrentAnimation("walk");

		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);		
	},
	update : function () {

		// do nothing if not visible
		if (!this.inViewport) {
			return false;
		}
		
		if (this.alive)	{
			if (this.walkLeft && this.pos.x <= this.startX) {
				this.vel.x = this.accel.x * me.timer.tick;
				this.walkLeft = false;
				this.flipX(false);
			} else if (!this.walkLeft && this.pos.x >= this.endX) {
				this.vel.x = -this.accel.x * me.timer.tick;
				this.walkLeft = true;
				this.flipX(true);
			}
		} else {
			this.vel.x = 0;
		}
		
		// check & update movement
		this.updateMovement();
		
		// return true if we moved of if flickering
		return (this.parent() || this.vel.x != 0 || this.vel.y != 0);
	},
});