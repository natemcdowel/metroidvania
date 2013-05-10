/**
 * An enemy entity
 * follow a horizontal path defined by the box size in Tiled
 */

var AllEnemyEntity = me.ObjectEntity.extend({	
	/**
	 * constructor
	 */
	init: function (x, y, settings) {
		// call the parent constructor
		this.parent(x, y , settings);
		
		// make it collidable
		this.collidable = true;
		this.hitpoints = 8;
		this.strength = 5;
		this.xp = 10;

		this.type = me.game.ENEMY_OBJECT;
		this.timer = me.timer.getTime();

	},


	moveTo : function (x, y) {

		// Go to specified position
		if (typeof x != 'undefined') {
	        var xDir = x - this.pos.x; 
	        var yDir = y - this.pos.y;
		}
		else {
		//get player entity
			var player = me.game.getEntityByName("mainPlayer")[0];

			if (player.pos.x > this.pos.x) this.flipX(true);
			else this.flipX(false);
			//create vector based on player's postion
	        var xDir = player.pos.x - this.pos.x; 
	        var yDir = (player.pos.y+140) - this.pos.y;
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
		if (this.alive && obj.weapon == 'sword') {
			this.hurting();
		}
	},

	/**
	 * ouch
	 */
	hurting : function () {

		if (!this.renderable.flickering)
		{	
			var player = me.game.getEntityByName("mainPlayer")[0];
			var self = this;
			this.hitpoints -= Math.ceil(me.game.strength * 1);
			this.hurt = true;
			setTimeout(function(){self.hurt = false;},1000);

			me.game.HUD.addItem("hit", new ScoreObject((this.pos.x+25) - me.game.viewport.pos.x,(this.pos.y-30) - me.game.viewport.pos.y,Math.ceil(me.game.strength * 1), 1));
			// flash the screen
			if (this.hitpoints <= 0) {

				
				me.game.xp += this.xp;
				this.alive = false; 
				this.collidable = false;
				me.game.HUD.updateItemValue("experience", this.xp);
				this.renderable.flicker(45, function(){me.game.remove(self)});
				me.audio.play("04", false);

			}
			else {
				
				this.renderable.flicker(45);
				me.audio.play("06", false);
			}
		}
	},
});



/**


/**
 * A Crow enemy entity
 * 
 */
var CrowEnemyEntity = AllEnemyEntity.extend({	
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
		
		// apply gravity setting if specified
		this.gravity = settings.gravity || me.sys.gravity;
		
		//set start/end position
		this.startX = x;
		this.endX   = x + settings.width - settings.spritewidth
		this.pos.x  = x + settings.width - settings.spritewidth;
	

		// walking & jumping speed
		this.setVelocity(settings.velX || 1, settings.velY || 6);

		// walking animation
		this.renderable.addAnimation ("walk", [0,1,2]);
		// dead animatin
		this.renderable.addAnimation ("dead", [2]);
		
		// set default one
		this.renderable.setCurrentAnimation("walk");

		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);		
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
			if (this.hurt) {
				this.vel.x = 0;
				this.vel.y = 0;
			}
    		else if (me.timer.getTime() > self.timer+2000) {
    			self.moveTo();
    		}
		} else {
			this.vel.x = 0;
		}

		// Removes BORDERLANDS style hit point 
		if (this.renderable.flickerTimer < 10) {
			me.game.HUD.removeItem("hit");
		}
		
		// check & update movement
		this.updateMovement();
		
		// return true if we moved of if flickering
		return (this.parent() || this.vel.x != 0 || this.vel.y != 0);
	},

});

/**
 * A Crow enemy entity
 * 
 */
var BatEnemyEntity = AllEnemyEntity.extend({	
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
var SkeletonEnemyEntity = AllEnemyEntity.extend({	
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
		
		// walking & jumping speed
		this.setVelocity(settings.velX || 4, settings.velY || 6);

				// // walking animatin
		this.renderable.addAnimation ("walk", [0,1,2]);
		// dead animatin
		this.renderable.addAnimation ("throwhead", [3,4]);
		
		// // set default one
		this.renderable.setCurrentAnimation("walk");

		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);		
		this.updateColRect(10,80, 0,100);

		// make it collidable
		this.collidable = true;
		this.hitpoints = 3;

		this.type = me.game.ENEMY_OBJECT;
		this.timer = me.timer.getTime();

		this.vel.x = 20;
	},

	update : function () {

		// do nothing if not visible
		if (!this.inViewport) {
			return false;
		}
		
		if (this.alive)	{
			if (this.hurt) {
				this.vel.x = 0;
				this.vel.y = 0;
			}
			if (this.walkLeft && this.pos.x <= this.startX) {
				this.vel.x = this.accel.x * me.timer.tick;
				this.renderable.setCurrentAnimation("throwhead","walk");

				var shot = new ShotEntity( this.pos.x, this.pos.y-10, { image: "skeletonhead", spritewidth: 100, spriteheight: 100 }, this.walkLeft); 
		        me.game.add(shot, this.z); 
		        me.game.sort();

				this.walkLeft = false;
				this.flipX(false);
			} else if (!this.walkLeft && this.pos.x >= this.endX) {
				this.vel.x = -this.accel.x * me.timer.tick;
				this.renderable.setCurrentAnimation("throwhead","walk");

				var shot = new ShotEntity( this.pos.x, this.pos.y-10, { image: "skeletonhead", spritewidth: 100, spriteheight: 100 }, this.walkLeft); 
		        me.game.add(shot, this.z); 
		        me.game.sort();

				this.walkLeft = true;
				this.flipX(true);
			}
		} else {
			this.vel.x = 0;
		}
		
		// Removes BORDERLANDS style hit point 
		if (this.renderable.flickerTimer < 10) {
			me.game.HUD.removeItem("hit");
		}

		// check & update movement
		this.updateMovement();
		
		// return true if we moved of if flickering
		return (this.parent() || this.vel.x != 0 || this.vel.y != 0);
	},
});


var ShotEntity = AllEnemyEntity.extend({

    init: function(x, y, settings, direction) {

    	this.rotate = 3;
		
		// call the constructor
	    this.parent(x, y, settings);

	     // apply gravity setting if specified
		this.gravity = settings.gravity || me.sys.gravity;
		this.hitpoints = 1;

				// set the renderable position to bottom center
		// this.anchorPoint.set(0.5, 1.0);		
		
		// set start/end position
		// this.startX = x;
		// this.endX   = x + settings.width - settings.spritewidth
		// this.pos.x  = x + settings.width - settings.spritewidth;
		this.renderable.addAnimation ("head", [5]);

		this.renderable.setCurrentAnimation("head");

		// walking & jumping speed
		if (direction) this.vel.x = -7; //this.setVelocity(settings.velX || -15, settings.velY || 0);
		else this.vel.x = 7;

	     this.collidable = true;
	     this.updateColRect(20,32, -1,0); 


	},

	update : function () {

		this.rotate += 10;
		this.renderable.angle = Number.prototype.degToRad (this.rotate);

		this.updateMovement();

		if (this.vel.x == 0) me.game.remove(this)
		return false;
	},
});