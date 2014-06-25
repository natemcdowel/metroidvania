me.socketObjectEntity = me.ObjectEntity.extend({
	/**
	 * Socket function<br>
	 * socketObjects is sent in an interval in index.html
	 *
	 */
	updateSocketEntity : function () {
		var foundGUID = false;
		// If not host
		if (clientid > 0) {
			for(var i = 0; i < socketObjects.length; i++) {
				//  If the object has already been created from host
		 		if (socketObjects[i].GUID == this.GUID) {
		 			if (socketObjects[i].dead) {
						socketObjects.splice(i,1);
		 				me.game.remove(this);
		 			}
		 			if (this.pos) {
			 			this.pos.x = socketObjects[i].pos.x;
			 			this.pos.y = socketObjects[i].pos.y;
			 			this.vel = socketObjects[i].vel;
			 			// this.renderable.setCurrentAnimation(socketObjects[i].currentAnim);
			 			foundGUID = true;
			 			return;
		 			}
		 		}
	 		}
		}
		// If hosting game
		else if (clientid == 0 && this.settings.sendSocket) {
			if (this.dead == true) {
				var i = this.checkGUID(this);
				socketObjects.splice(i,1);
				me.game.remove(this);
			}
			this.socketPrepSend();
		}
	},

	/**
	 * Socket function - Updates this object information to socketObjects <br>
	 * socketObjects is sent in an interval in index.html
	 *
	 */
	socketPrepSend: function() {
		// Find matching GUID from socketObjects
	 	var i = this.checkGUID(this);

	 	if (i) {
	 		if (this.dead) {
	 			socketObjects[i].dead = this.dead;
	 		}
		 	if (this.pos && this.pos) {
		 		socketObjects[i].pos = this.pos;
		 	}
		 	if (this.vel) {
		 		socketObjects[i].vel = this.vel;
		 	}
		 	// if (this.settings) {
		 	// 	socketObjects[i].settings = this.settings;
		 	// }
		 	// if (this.renderable && this.renderable.current && this.renderable.current.name) {
		 	// 	socketObjects[i].currentAnim = this.renderable.current.name;
		 	// }
	 	}
	},

	/**
	 * Socket function - Initializes this object information to socketObjects <br>
	 * Only used for host (clientid == 0)
	 *
	 */
	socketInit: function() {
	 	var socketObject = {};
	 	socketObject.pos = {};
	 	socketObject.GUID = this.GUID;

	 	// If this GUID is not in socketObjects yet (From any other clients)
	 	if (!this.checkGUID(socketObject) && !this.dead) {
	 		if (this.pos && this.pos) {
		 		socketObject.pos = this.pos;
		 	}
		 	if (this.vel) {
		 		socketObject.vel = this.vel;
		 	}
		 	if (this.settings) {
		 		socketObject.settings = this.settings;
		 	}
		 	if (this.renderable.current.name) {
		 		socketObject.currentAnim = this.renderable.current.name;
		 	}

		 	// If host, object will be passed by Interval Loop
		 	if (clientid == 0) {
		 		socketObjects.push(socketObject);
		 	}
		 	// If client, obejct will be added immediately
		 	else {
		 		socketResponse('slaveaddobject',socketObject);
		 	}
 		}
	},

	socketRemoveObject: function() {
		if (clientid > 0) {
			this.dead = true;
			socketResponse('slaveupdateobjects',{dead:true, GUID:this.GUID});
		}
	}
});

/**
 * An enemy entity
 * follow a horizontal path defined by the box size in Tiled
 */

var AllEnemyEntity = me.socketObjectEntity.extend({
	/**
	 * constructor
	 */
	init: function (x, y, settings) {

		settings.sendSocket = true;
		// call the parent constructor
		this.parent(x, y , settings);

		// make it collidable
		this.collidable = true;
		this.hitpoints = 2;
		this.strength = 5;
		this.xp = 10;

		this.tag = new me.Font("Verdana", 14, "yellow");
        this.tag.bold();
		this.fontsize = 0;
		this.hpY = 0;

		this.type = me.game.ENEMY_OBJECT;
		this.timer = me.timer.getTime();
		this.i = 0;
		this.enemy = new Object();
		if (clientid == 0) {
			this.socketInit();
		}
	},

	draw : function(context) {
        this.parent(context);
        // if (this.inViewport)
        if (this.alive && this.pos) {
        	var self = this;
        	this.context = context;
	        this.tag = new me.Font("Verdana", this.fontsize, "yellow");
	        this.tag.draw(this.context, this.takendamage , this.pos.x + 80, this.pos.y+150+this.hpY);
    	}

    	if (this.pos && this.pos.x <= 0){
			me.game.remove(this)
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
				this.socketRemoveObject();
				playerInfo.xp += this.xp;
				this.alive = false;
				this.collidable = false;
				me.game.HUD.updateItemValue("experience", this.xp);
				this.renderable.flicker(5, function(){me.game.remove(self)});
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
	}
});


/**
 * A Skull enemy entity
 *
 */
var SkullEnemyEntity = AllEnemyEntity.extend({
    init: function(x, y, settings, direction) {
    	this.rotate = 3;
		this.hitpoints = 2;
		settings.entityName = 'SkullEnemyEntity';

		// call the constructor
	    this.parent(x, y, settings);

	     // apply gravity setting if specified
		this.gravity = settings.gravity || me.sys.gravity;
		this.renderable.animationspeed = 2;
		this.renderable.addAnimation ("head", [0,1,2]);
		this.renderable.setCurrentAnimation("head");

		// walking & jumping speed
		this.vel.x = -9;
	    this.collidable = true;
		this.timer = me.timer.getTime();
		this.i = 1;
	},

	update : function () {

		// this.rotate += 10;
		// this.renderable.angle = Number.prototype.degToRad (this.rotate);

		var self = this;
		if (clientid == 0) {
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

			if (this.renderable.flickerTimer != null && this.renderable.flickerTimer < 30) {
				me.game.HUD.removeItem("hit");
			}
		}
		else {
			this.computeVelocity(this.vel);
			this.pos.add(this.vel);

			if (this.pos.x <= 0){
				me.game.remove(this)
			}
		}
		this.updateSocketEntity();
		this.updateMovement();
		this.parent();
		return true;
	},
});

/**
 * A Skeleton enemy
 * follow a horizontal path defined by the box size in Tiled
 */
var SkeletonEnemyEntity = AllEnemyEntity.extend({
	/**
	 * constructor
	 */
	init: function (x, y, settings) {

		// this.checkplayers();
		settings.sendSocket = true;
		settings.entityName = 'SkeletonEnemyEntity';
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

		this.renderable.addAnimation ("skeleton", [0,1,2]);
		this.renderable.addAnimation ("throwhead", [3,4]);
		this.renderable.addAnimation ("dead", [6,7,8]);
		this.renderable.addAnimation ("zombie", [0,1,2,3,4,5]);

		if (settings.customcollision == true) {
			this.updateColRect(80,80, 140,100);
		}

		// // set default one
		this.renderable.setCurrentAnimation(settings.image);

		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);

		// make it collidable
		this.collidable = true;
		this.hitpoints = 6;

		this.type = me.game.ENEMY_OBJECT;
		this.timer = me.timer.getTime();
		this.alive = true;

		this.vel.x = 10;
		this.vel.y = .1;
		this.walkLeft = false;
		this.shot = settings.shot;
		this.shot = true;

	},

	checkplayers : function () {

		var self = this;

		socketResponse('checkmapserver',clientid);
		socket.on('checkmapclient', function (users) {

			if (typeof users[1] != 'undefined') {
				if(users[0][4] != users[1][4]) {
					samemap = false;
					// console.log(samemap)
				}
				else {
					samemap = true;
					// console.log(samemap)
				}
			}
		});

	},

	update : function () {

		var self = this;

		//Setting enemy position through SOCKET if 2nd to map
		// if (samemap == true && clientid == 1) {
			// socket.on('updateenemies', function (enemy) {
			// 	self.pos.x = enemy.x
			// });
		// }


		if (clientid == 0) {
			if (this.walkLeft && this.pos.x <= this.startX) {
				if (this.vel.x == 0) this.vel.x = 4;
				this.vel.x = this.accel.x * me.timer.tick;
				// this.renderable.setCurrentAnimation("throwhead","walk");

				if (this.shot == true) {
					var shot = new ShotEntity( this.pos.x, this.pos.y-10, { image: "skeleton", spritewidth: 240, spriteheight: 240, direction: 'left', animframe: 5 });
			        me.game.add(shot, this.z);
			        me.game.sort();
		    	}

				this.walkLeft = false;
				this.flipX(false);
			} else if (!this.walkLeft && this.pos.x >= this.endX) {
				if (this.vel.x == 0) this.vel.x = 4;
				this.vel.x = -this.accel.x * me.timer.tick;
				// this.renderable.setCurrentAnimation("throwhead","walk");

				if (this.shot == true) {
					var shot = new ShotEntity( this.pos.x, this.pos.y-10, { image: "skeleton", spritewidth: 240, spriteheight: 240, direction: 'right', animframe: 5 });
			        me.game.add(shot, this.z);
			        me.game.sort();
		    	}

				this.walkLeft = true;
				this.flipX(true);
			}
		}

		// check & update movement
		this.updateSocketEntity();
		this.updateMovement();
		this.parent();
		return true;
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
		// if (clientid == 0 || settings.GUID) {
			settings.entityName = 'CrowEnemyEntity'
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

			this.hitpoints = 9;
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
		// }
	},

		/**
	 * manage the enemy movement
	 */
	update : function () {

		var self = this;
		if (clientid == 0) {
			// do nothing if not visible
			if (!this.inViewport) {
				return false;
			}

			if (this.alive)	{
				if (this.hurt) {
					// this.pos.x = 0;
					// this.pos.y = 0;
				}
	    		else if (me.timer.getTime() > self.timer+2000) {
	    			self.moveTo();
	    		}
			} else {
				this.vel.x = 0;
			}
		}
		// else {
		// 	this.computeVelocity(this.vel);
		// 	this.pos.add(this.vel);

		// 	if (this.pos.x <= 0){
		// 		me.game.remove(this)
		// 	}
		// }
		this.updateSocketEntity();
		this.computeVelocity(this.vel);
		this.pos.add(this.vel);
		this.parent();
		return true;
		// return true if we moved of if flickering
		// return (this.parent() || this.vel.x != 0 || this.vel.y != 0);
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

		// If client is Hosting or GUID has been sent (Retrieved from)
		if (client == 0 || settings.GUID) {
			settings.entityName = 'BatEnemyEntity';
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
		}
	},

});

var ShotEntity = AllEnemyEntity.extend({

    init: function(x, y, settings) {

    	this.rotate = 1;

		// call the constructor
	    this.parent(x, y, settings);

	     // apply gravity setting if specified
		this.gravity = settings.gravity || me.sys.gravity;
		this.hitpoints = 1;
		this.renderable.addAnimation ("head", [settings.animframe]);
		this.renderable.setCurrentAnimation("head");
		this.direction = settings.direction;

		// Finding player position, which way to shoot
		var player = me.game.getEntityByName("mainPlayer")[0];

		// walking & jumping speed
		if (this.direction == 'left') this.vel.x = -24; //this.setVelocity(settings.velX || -15, settings.velY || 0);
		else this.vel.x = 24;

	     this.collidablxe = true;
	     this.updateColRect(101,30, 140,30);


	},

	update : function () {

		// this.rotate += 25;
		// this.renderable.angle = Number.prototype.degToRad (this.rotate);

		this.updateMovement();

		if (!this.inViewport || this.vel.x == 0){
			this.alive = false;
			me.game.remove(this)
		}

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
		this.vel.x = .1;
		this.vel.y = -5;

	    this.collidable = true;
	    this.updateColRect(110,30, 140,30);
	    this.shot = false

	},

	update : function () {

		// Raising from ground
		if (this.pos.y < 1100) {
			this.vel.y = 0;
		}

		if(this.renderable.current.name == 'risen' && this.shot == false) {

			var self = this;
			var player = me.game.getEntityByName("mainPlayer")[0];

			if (this.pos.x < player.pos.x) this.direction = 'right';
			else this.direction = 'left';

			// Coffin Door flies off
			var shot = new ShotEntity( this.pos.x, this.pos.y, { image: "coffin", spritewidth: 240, spriteheight: 240, direction: this.direction, animframe: 2});
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

		if (me.timer.getTime() > this.timer+3500 && this.risen == false) {

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


// Abstracted Factory for all enemies
var EnemyFactoryEntity = AllEnemyEntity.extend({

	init: function(x, y, settings, direction) {
		if (clientid == 0) {
			this.timer = me.timer.getTime();
			this.enemyClass = settings.enemyClass;
			settings.entityName = this.enemyClass;
			this.objectName = window[this.enemyClass]
			this.image = settings.image;
			this.delay = settings.delay;
			this.spritewidth = settings.spritewidth;
			this.spriteheight = settings.spriteheight;
		}
	},

	update : function () {
		if (me.timer.getTime() > this.timer+this.delay) {
			var player = me.game.getEntityByName("mainPlayer")[0];
			var enemy = new this.objectName( player.pos.x+1000, player.pos.y, { image: this.image, spritewidth: this.spritewidth, spriteheight: this.spriteheight });
		    me.game.add(enemy, this.z-1);
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



