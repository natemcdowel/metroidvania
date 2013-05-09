

/************************************************************************************/
/*																					*/
/*		Main player entity															*/
/*																					*/
/************************************************************************************/

var PlayerEntity = me.ObjectEntity.extend({	
	init: function(x, y, settings) { 

		y = nextScreenY;

		console.log(me.game.currentLevel.width)
		console.log(me.game.currentLevel.height)
		// y = 1232;
		// Check if player reached screen and set position accordingly to new screen
		if (levelDirection == 'west') {
			x = me.game.currentLevel.width - 300;
		}
		if (levelDirection == 'east') {
			x = 100; 
		}
		if (levelDirection == 'south') {
			y = 100;
			x = nextScreenX;
		}
		if (levelDirection == 'north') {
			y = 1100;
			x = nextScreenX;
		}

		// call the constructor
		this.parent(x, y , settings); 

		// Weapon delay
		this.cooldown = true;
		
		var socketArray = Array(); 
		socketArray[0] = clientid;
		socketArray[1] = me.levelDirector.getCurrentLevelId();

		// Setting our map in server 
		socketResponse('changemapserver', socketArray);  

		// walking & jumping speed 
		this.setVelocity(12, 25); 
		
		this.setFriction(1.2,0); 

		this.gravity = 2
		// update the hit box
		// this.updateColRect(20,32, -1,0); 
		this.dying = false;
		this.hitpoints = 50;
		this.collidable = false;
		// this.xp = 0;
		// this.lvl = 1;
		// this.strength = 1;

		me.game.xp = 0;
		me.game.lvl = 1;
		me.game.strength = 1;



		this.mutipleJump = 0;

		
		// set the display around our position 
		me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

		// if (settings.animationspeed) {
		// 	this.renderable.animationspeed = settings.animationspeed; 
		// }

		this.renderable.animationspeed = 2;
				
		// enable keyboard
		me.input.bindKey(me.input.KEY.LEFT,	 "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right"); 
		me.input.bindKey(me.input.KEY.UP,	"jump", true); 
		me.input.bindKey(me.input.KEY.X,	"attack"); 
		me.input.bindKey(me.input.KEY.DOWN,	"down");
		
		// define a basic walking animatin
		this.renderable.addAnimation ("walk",  [0,1,2]); 
		this.renderable.addAnimation ("stand",  [0]); 
		this.renderable.addAnimation ("crouch",  [3]);
		this.renderable.addAnimation ("jumpup",  [4]);
		this.renderable.addAnimation ("jumpdown", [5]);
		this.renderable.addAnimation ("attack",  [7,8,9,10]);
		this.renderable.addAnimation ("jumpattack",  [9,10]);
		this.renderable.addAnimation ("crouchattack",  [11,12,13,14]);
		this.renderable.addAnimation ("hurt",  [16,17,18]);


		// set as default
		this.renderable.setCurrentAnimation("walk"); 
		// this.renderable.animationspeed = 1;
		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0); 
		if (clientData[0] == 'right')this.updateColRect(110,60, 130,100);
		this.attackFinished = true;

		this.angle -= 90;

	},

	
	/* -----

		update the player pos
		
	------			*/
	update : function () { 

		var self = this;

		// console.log(this.pos.x + ' -- ' + this.pos.y)
		this.attack = false;

		var keys = { length: 0 };

		document.onkeydown = function(e){
		    if(!keys[e.keyCode])   {
		        keys[e.keyCode] = true;
		        keys.length++;
		    }
		}

		document.onkeyup = function(e){
		    if(keys[e.keyCode])   {
		        keys[e.keyCode] = false;
		        keys.length--;
		    }
		}

		// Movement
		if (this.renderable.flickerTimer < 70) {
			if (me.input.isKeyPressed('attack'))	{ 
				this.attack = true;  
				self.attackFinished = false;
			} 
			// Attacking
			if (!self.attackFinished) {

				// Which direction movement
				if (clientData[0] == 'left') self.vel.x = -1.5;  
				if (clientData[0] == 'right') self.vel.x = 1.5;

				if (me.input.isKeyPressed('down')) {
					self.renderable.setCurrentAnimation("crouchattack", function() {
							self.renderable.setAnimationFrame();
							self.attackFinished = true;
					});
				}
				else {
					self.renderable.setCurrentAnimation("attack", function() {

						self.renderable.setAnimationFrame();
						self.attackFinished = true;
					});
				}
			}
			else if (self.attackFinished && me.input.isKeyPressed('down')) {

				this.renderable.setCurrentAnimation("crouch");

			}
			else if (me.input.isKeyPressed('left'))	{ 

				// Offset for flipping character
				if (clientData[0] == 'right') {
					this.pos.x -= 70;
				}
				
				this.renderable.setCurrentAnimation("walk");

				// Loading next/previous level if at the end of the screen
				if (this.pos.x < 200) {levelDirection = 'west';}
				if (this.pos.x > 1100) {levelDirection = 'east';}
				if (this.pos.y > 1232) {levelDirection = 'south';}
				nextScreenX = this.pos.x
				nextScreenY = this.pos.y

				// Chopping up client data to be passed to server
	    		clientData[0] = 'left';

				this.vel.x -= this.accel.x * me.timer.tick;
				this.flipX(true);

			} 
			else if (me.input.isKeyPressed('right')) {

				// Offset for flipping character
				if (clientData[0] == 'left') {
					this.pos.x += 70;
				}

				this.renderable.setCurrentAnimation("walk");

				// Loading next/previous level if at the end of the screen
				if (this.pos.x < 200) {levelDirection = 'west';}
				if (this.pos.x > 1100) {levelDirection = 'east';}
				if (this.pos.y > 1232) {levelDirection = 'south';}
				nextScreenX = this.pos.x
				nextScreenY = this.pos.y
	    		clientData[0] = 'right';

				// socketResponse('keypress',clientData);  
				this.vel.x += this.accel.x * me.timer.tick;
				this.flipX(false);
			}
			if (me.input.isKeyPressed('jump')) { 
				
				// Loading next/previous level if at the end of the screen
				if (this.pos.x < 200) {levelDirection = 'west';}
				if (this.pos.x > 1100) {levelDirection = 'east';}
				if (this.pos.y > 1232) {levelDirection = 'south';}
				nextScreenX = this.pos.x
				nextScreenY = this.pos.y
	    		clientData[0] = 'up';
				// reset the dblJump flag if off the ground
				this.mutipleJump = (this.vel.y === 0)?1:this.mutipleJump;
				if (this.mutipleJump<=1) {  // 2 for double jump
					this.vel.y -= (this.maxVel.y * this.mutipleJump++) * me.timer.tick;
				}
			} 
			if (this.vel.y > 0 || this.vel.y < 0) {  // Jumping		
				if (this.vel.x < 0) this.vel.x -= this.accel.x * me.timer.tick;
				if (this.vel.x > 0) this.vel.x += this.accel.x * me.timer.tick;
				if (me.input.isKeyPressed('attack'))	{ 
					this.renderable.setCurrentAnimation("attack",function() {
						if (this.vel.y < 0) this.renderable.setCurrentAnimation("jumpup");
						if (this.vel.y > 0) this.renderable.setCurrentAnimation("jumpdown");
						if (this.vel.x < 0) this.vel.x -= this.accel.x * me.timer.tick;
						if (this.vel.x > 0) this.vel.x += this.accel.x * me.timer.tick;
					});
					this.attack = true;
				}
				else {
						if (this.vel.y < 0) this.renderable.setCurrentAnimation("jumpup");
						if (this.vel.y > 0) this.renderable.setCurrentAnimation("jumpdown");
				}
			}
			if (this.vel.x == 0 && this.vel.y == 0 && !me.input.isKeyPressed('crouch')) this.renderable.setCurrentAnimation("stand");

			// if ((this.vel.y > 0 || this.vel.y < 0) && this.vel.x == 0) this.vel.x = .1;
		}

		
		//  End movement


		clientData[1] = clientid; 
		clientData[2] = this.pos.x;
		clientData[3] = this.pos.y;
		socketResponse('keypress',clientData); 

		// Setting which way we want to go if map is changing
		if (this.vel.y > 0 && this.pos.y > 1230 ) {
			levelDirection = 'south';
		} 
		if (this.vel.y > 0 && this.pos.y < 150 ) {
			levelDirection = 'north'; 
		} 

				//  Updating Hit Box
		if (clientData[0] == 'left')  this.updateColRect(130,60, 140,100); 
		else if (clientData[0] == 'right')this.updateColRect(50,60, 140,100);  

		// check for collision with environment
		this.updateMovement();
		
		// check if we fell into a hole
		if (!this.inViewport && (this.pos.y > me.video.getHeight())) {
			// if yes reset the game
			me.game.remove(this);
			me.game.viewport.fadeIn('#fff', 150, function(){
				me.audio.play("die", false);
				me.levelDirector.reloadLevel();
				me.game.viewport.fadeOut('#fff', 150);
			});
			return true;
		}
		
		// COLLISIONS with various objects
		var res = me.game.collide(this);
		// console.log(res);
		
		if (res) {
			switch (res.obj.type) {	
				case me.game.ENEMY_OBJECT : {
					if ((res.y>0) && this.falling && !this.renderable.flickering) {
						// jump
						this.vel.y -= this.maxVel.y * me.timer.tick;
					} else {
		
						this.hurt(res);
					}
					break;
				}
				default : break;
			}
		}
		
		// Check for LEVEL UP!
		if (me.game.xp > lvlcap[me.game.lvl]) {
			this.level();
		}



		// check if we moved (a "stand" animation would definitely be cleaner)
		if (this.vel.x!=0 || this.vel.y!=0 || (this.renderable&&this.renderable.isFlickering())) {
			this.parent();
			return true;
		}
		else {
			return false;
		}
	},

	/**
	 * Bigger, Faster, Stronger
	 */

	level : function () {

		me.game.HUD.addItem("levelup", new ScoreObject((this.pos.x+25) - me.game.viewport.pos.x,(this.pos.y-30) - me.game.viewport.pos.y,'LEVEL UP'));
		me.game.lvl += 1; 
		me.game.strength += .6; 
		me.game.hitpoints += 20;
		me.game.HUD.updateItemValue("lvl", 1);
		me.game.HUD.updateItemValue("experience", 0);
		me.game.HUD.updateItemValue("score", 20);
		setTimeout(function(){me.game.HUD.removeItem("levelup");},2500);
	},

	/**
	 * ouch
	 */
	hurt : function (res) {
		if (!this.renderable.flickering)
		{	
			this.renderable.setCurrentAnimation("hurt", "walk");
			this.renderable.flicker(100);

			if (this.vel.x >= 0) {
				// this.maxVel.x = 20;
				this.vel.x = -80;
				this.vel.y = -15;
			}
			else  {
				this.maxVel.x = 20;
				this.vel.x = 80;
				this.vel.y = -15;
			}

			me.game.HUD.updateItemValue("score", -res.obj.strength);
			this.hitpoints -= res.obj.strength;

			// DEATH!
			if (this.hitpoints <= 1) {

				me.game.HUD.updateItemValue("score", 50);
				me.levelDirector.reloadLevel();
			}
			this.maxVel.x = 12;
		}
	},

});


