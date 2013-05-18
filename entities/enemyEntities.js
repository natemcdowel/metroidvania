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

		this.tag = new me.Font("Verdana", 14, "yellow");
        this.tag.bold();
		this.fontsize = 0;
		this.hpY = 0;

		this.type = me.game.ENEMY_OBJECT;
		this.timer = me.timer.getTime();
		this.i = 0;

	},

	draw : function(context) {
        this.parent(context);

        // if (this.inViewport)
        // console.log(this.pos.x)
        if (this.alive && this.pos.x > 20) {

        	this.context = context;
	        this.tag = new me.Font("Verdana", this.fontsize, "yellow");
	        this.tag.draw(this.context, this.takendamage , this.pos.x + 80, this.pos.y+150+this.hpY);
    	}
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

			// Animates hitpoints above player
			var tween = new me.Tween(this).to({fontsize: 40, hpY: -160}, 700).onComplete(function(){		   
				var tween = new me.Tween(this)
			    .to({
			    	globalAlpha: 0,
			        fontsize: 0,
			        hpY: 0
			    }, 0)
			    .start();})
		    .start();

			var player = me.game.getEntityByName("mainPlayer")[0];
			var self = this;
			this.takendamage = Math.ceil(me.game.strength * 1);
			this.hitpoints -= Math.ceil(me.game.strength * 1);
			this.hurt = true;
			this.i++; 
			setTimeout(function(){self.hurt = false;},1000);


			// flash the screen
			if (this.hitpoints <= 0) {
			
				me.game.xp += this.xp;
				this.alive = false; 
				this.collidable = false;
				me.game.HUD.updateItemValue("experience", this.xp);
				this.renderable.flicker(25, function(){me.game.remove(self)});
				me.audio.play("04", false);

				// Drop item
				var pickup = new PickupEntity( self.pos.x, self.pos.y-20, { image: "pickups", spritewidth: 110, spriteheight: 65 }, true); 
			    me.game.add(pickup, self.z-1);
			    me.game.sort();

			}
			else {
				
				this.renderable.flicker(25);
				me.audio.play("06", false);
			}
		}
	},
});



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
	
		this.hitpoints = 10;
		// walking & jumping speed
		this.setVelocity(settings.velX || 1, settings.velY || 6);
		this.updateColRect(80,80, 70,100);

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
				this.pos.x = 0;
				this.pos.y = 0;
			}
    		else if (me.timer.getTime() > self.timer+2000) {
    			self.moveTo();
    		}
		} else {
			this.vel.x = 0;
		}

		// Removes BORDERLANDS style hit point 
		if (this.renderable.flickerTimer < 50) {
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
		settings.width = 550;

		// set start/end position
		this.startX = x;
		this.endX   = x + settings.width - settings.spritewidth
		this.pos.x  = x + settings.width - settings.spritewidth;
		
		// walking & jumping speed
		this.setVelocity(settings.velX || 4, settings.velY || 6);

        // walking animating
		this.renderable.addAnimation ("walk", [0,1,2]);
		
		// throw head
		this.renderable.addAnimation ("throwhead", [3,4]);

		// Death
		this.renderable.addAnimation ("dead", [6,7,8]);

		// // set default one
		this.renderable.setCurrentAnimation("walk");

		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);		
		this.updateColRect(80,80, 140,100);

		// make it collidable
		this.collidable = true;
		this.hitpoints = 5;

		this.type = me.game.ENEMY_OBJECT;
		this.timer = me.timer.getTime();
		this.alive = true;

		this.vel.x = 10;
		this.vel.y = .1;
		this.walkLeft = false;
	},



	update : function () {

		// do nothing if not visible
		// if (!this.inViewport) {
		// 	return false;
		// }
		

		if (this.alive)	{
			// if (this.hurt) {
			// 	this.vel.x = 0;
			// 	this.vel.y = 0;
				
			// 	this.walkLeft = false;
			// }
			if (this.walkLeft && this.pos.x <= this.startX) {
				console.log(this.hurt)
				if (this.vel.x == 0) this.vel.x = 4;
				this.vel.x = this.accel.x * me.timer.tick;
				this.renderable.setCurrentAnimation("throwhead","walk");

				var shot = new ShotEntity( this.pos.x, this.pos.y-10, { image: "skeleton", spritewidth: 240, spriteheight: 240 }, 5); 
		        me.game.add(shot, this.z); 
		        me.game.sort();

				this.walkLeft = false;
				this.flipX(false);
			} else if (!this.walkLeft && this.pos.x >= this.endX) {
				console.log(this.hurt)
				if (this.vel.x == 0) this.vel.x = 4;
				this.vel.x = -this.accel.x * me.timer.tick;
				this.renderable.setCurrentAnimation("throwhead","walk");

				var shot = new ShotEntity( this.pos.x, this.pos.y-10, { image: "skeleton", spritewidth: 240, spriteheight: 240 }, 5); 
		        me.game.add(shot, this.z); 
		        me.game.sort();

				this.walkLeft = true;
				this.flipX(true);
			}
		} 
		else {
			this.renderable.setCurrentAnimation("dead");
		}
		
		// Removes BORDERLANDS style hit point 
		if (this.renderable.flickerTimer < 10) {
			me.game.HUD.removeItem("hit");
		}

		// check & update movement
		this.updateMovement();
		
		// return true if we moved of if flickering
		// return (this.parent() || this.vel.x != 0 || this.vel.y != 0);
		this.parent()
		return true;
	},
});


var ShotEntity = AllEnemyEntity.extend({

    init: function(x, y, settings, animframe) {

    	this.rotate = 1;
		
		// call the constructor
	    this.parent(x, y, settings);

	     // apply gravity setting if specified
		this.gravity = settings.gravity || me.sys.gravity;
		this.hitpoints = 1;
		this.renderable.addAnimation ("head", [animframe]);
		this.renderable.setCurrentAnimation("head");

		// Finding player position, which way to shoot
		var player = me.game.getEntityByName("mainPlayer")[0];

		// walking & jumping speed
		if (player.pos.x < this.pos.x) this.vel.x = -24; //this.setVelocity(settings.velX || -15, settings.velY || 0);
		else this.vel.x = 24;

	     this.collidable = true;
	     this.updateColRect(110,30, 140,30);


	},

	update : function () {

		// this.rotate += 25;
		// this.renderable.angle = Number.prototype.degToRad (this.rotate);

		this.updateMovement();

		if (!this.inViewport || this.vel.x == 0){ 
			this.alive = false;
			me.game.remove(this)
		}
		return true;
	},
});

/**
 * A Skull enemy entity
 * 
 */
var SkullEnemyEntity = AllEnemyEntity.extend({	
    init: function(x, y, settings, direction) {

    	this.rotate = 3;
		this.hitpoints = 10;

		// call the constructor
	    this.parent(x, y, settings);

	     // apply gravity setting if specified
		this.gravity = settings.gravity || me.sys.gravity;

				// set the renderable position to bottom center
		// this.anchorPoint.set(0.5, 1.0);		
		
		// set start/end position
		// this.startX = x;
		// this.endX   = x + settings.width - settings.spritewidth
		// this.pos.x  = x + settings.width - settings.spritewidth;

		this.renderable.animationspeed = 2;
		this.renderable.addAnimation ("head", [3,4,5]); 

		this.renderable.setCurrentAnimation("head");

		// walking & jumping speed
		this.vel.x = -9; //this.setVelocity(settings.velX || -15, settings.velY || 0);
	    this.collidable = true;

	    this.timer = me.timer.getTime();
		this.i = 1;


	},

	update : function () {

		// this.rotate += 10;
		// this.renderable.angle = Number.prototype.degToRad (this.rotate);

		var self = this;

		if (me.timer.getTime() > self.timer+1200) {
			
			self.i++
			self.timer = me.timer.getTime()

		} 

		if (!this.hurt ) {

			if (this.vel.x == 0) {
				this.vel.x = -9;
			}
			if (self.i % 2 == 0) {
				self.vel.y -= .13;
			}
			if (self.i % 2 == 1) {
				self.vel.y += .1;  
			}
		}
		else if (this.hurt) {
			this.vel.x = 0;
			this.vel.y = 0;
		}

		this.computeVelocity(this.vel);
		this.pos.add(this.vel);

		if (this.pos.x <= 0){
			me.game.remove(this)

		} 

		if (this.renderable.flickerTimer < 30) {
			me.game.HUD.removeItem("hit");
		}
		// return (this.parent() || this.vel.x != 0 || this.vel.y != 0);
		this.parent()
		return true;
	},
});

var CoffinEntity = AllEnemyEntity.extend({

    init: function(x, y, settings, direction) {

    	
		// call the constructor
	    this.parent(x, y, settings);

		this.hitpoints = 1;

		this.renderable.addAnimation ("rise",  [10,9,8,7,6,5], 2); 
		this.renderable.addAnimation ("risen",  [5], 2); 
		this.renderable.addAnimation ("dooroffempty",  [0], 2); 
		this.renderable.addAnimation ("dooroffskeleton",  [3], 2); 

		this.renderable.setCurrentAnimation("rise","risen");

		// walking & jumping speed
		// if (direction) this.vel.x = -1; //this.setVelocity(settings.velX || -15, settings.velY || 0);
		this.vel.x = .1;
		this.vel.y = -5;

	    this.collidable = true;
	    this.updateColRect(110,30, 140,30);
	    this.shot = false



	},

	update : function () {



		if (this.pos.y < 1100) {
			this.vel.y = 0;

		}

		if(this.renderable.current.name == 'risen' && this.shot == false) {

			var self = this;

			// Coffin Door flies off
			var shot = new ShotEntity( this.pos.x, this.pos.y, { image: "coffin", spritewidth: 240, spriteheight: 240 },2); 
			me.game.add(shot, this.z-1);
		    me.game.sort();
		    this.shot = true;

		    // Skeleton comes out
		    this.renderable.setCurrentAnimation("dooroffempty");
		    var skeleton = new SkeletonEnemyEntity( this.pos.x-330, this.pos.y, { image: "skeleton", spritewidth: 240, spriteheight: 240, animationspeed: 10, gravity: 0 }); 
		    me.game.add(skeleton, this.z+1);
		    me.game.sort();

		     setTimeout(function(){me.game.remove(self);},5000);
		}

		if (this.vel.x == 0) me.game.remove(this)

		// this.updateMovement();
		this.parent();
		return true;
	},
});


var BossFactoryEntity = AllEnemyEntity.extend({	

	init: function(x, y, settings, direction) {
		
		this.timer = me.timer.getTime();
		this.risen = false;

	},

	update : function () {

		if (me.timer.getTime() > this.timer+6000 && this.risen == false) {

			var player = me.game.getEntityByName("mainPlayer")[0];
			this.minX = player.pos.x-700
			this.maxX = player.pos.x+700
			if (this.minX < 100) this.minX=100;

			
			var coffin = new CoffinEntity( Math.floor(Math.random() * (this.maxX - this.minX + 1)) + this.minX, 1090, { image: "coffin", spritewidth: 240, spriteheight: 240 }); 
		    me.game.add(coffin, this.z-1);
		    me.game.sort();
		    this.timer = me.timer.getTime();

		}
	}, 
}); 



var EnemyFactoryEntity = AllEnemyEntity.extend({	

	init: function(x, y, settings, direction) {
		this.timer = me.timer.getTime();
	},

	update : function () {

		if (me.timer.getTime() > this.timer+4000) {
			var player = me.game.getEntityByName("mainPlayer")[0];
			var skull = new SkullEnemyEntity( player.pos.x+1000, player.pos.y, { image: "skull", spritewidth: 100, spriteheight: 100 }); 
		    me.game.add(skull, this.z-1);
		    me.game.sort();
		    this.timer = me.timer.getTime();
		}
	}, 
}); 


var WeatherFactoryEntity = AllEnemyEntity.extend({	

	init: function() {
		this.min = 0;
		this.max = 4200;

		this.minY = 200;
		this.maxY = 500;
		this.timer = me.timer.getTime();
	},

	update : function () {

		var player = me.game.getEntityByName("mainPlayer")[0];
		this.minX = player.pos.x-1250
		this.maxX = player.pos.x+1250
		for (var i = 0; i < 6; i++) {
			me.game.add(new DropletParticle(Math.floor(Math.random() * (this.maxX - this.minX + 1)) + this.minX, Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY, 10, 5), 10);
		}
		me.game.sort();
		return false;
	}, 

}); 



