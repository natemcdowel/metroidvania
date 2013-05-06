

/************************************************************************************/
/*																					*/
/*		Main player entity															*/
/*																					*/
/************************************************************************************/

var PlayerEntity = me.ObjectEntity.extend({	
	init: function(x, y, settings) { 

		y = nextScreenY;

		console.log(me.game.currentLevel.width)
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
		this.setVelocity(6, 22); 
		
		this.setFriction(0.4,0); 

		 
		// update the hit box
		// this.updateColRect(20,32, -1,0); 
		this.dying = false;
		this.hitpoints = 50;
		this.xp = 0;
		this.lvl = 1;
		this.strength = 1;



		this.mutipleJump = 0;

		
		// set the display around our position 
		me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

		// if (settings.animationspeed) {
		// 	this.renderable.animationspeed = settings.animationspeed; 
		// }

		this.renderable.animationspeed = 6;
				
		// enable keyboard
		me.input.bindKey(me.input.KEY.LEFT,	 "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right"); 
		me.input.bindKey(me.input.KEY.UP,	"jump", true); 
		me.input.bindKey(me.input.KEY.X,	"attack"); 
		me.input.bindKey(me.input.KEY.DOWN,	"down");
		
		// define a basic walking animatin
		this.renderable.addAnimation ("walk",  [0,1,2]); 
		this.renderable.addAnimation ("crouch",  [3]);
		this.renderable.addAnimation ("jumpup",  [4]);
		this.renderable.addAnimation ("jumpdown", [5]);
		this.renderable.addAnimation ("attack",  [7,8,9,10]);
		this.renderable.addAnimation ("crouchattack",  [11,12,13,14]);
		this.renderable.addAnimation ("hurt",  [16,17,18]);


		// set as default
		this.renderable.setCurrentAnimation("walk"); 
		// this.renderable.animationspeed = 1;
		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0); 
		this.attackFinished = true;

		console.log(this)

	},

	
	/* -----

		update the player pos
		
	------			*/
	update : function () { 

		var self = this;

		// console.log(this.pos.x + ' -- ' + this.pos.y)

		// Updating hit box every frame
		if (self.vel.x < 0) this.updateColRect(0,70, -1,100); 
		if (self.vel.x > 0) this.updateColRect(110,70, -1,100); 
		// if (self.attackFinished == false) this.updateColRect(65,0, -1,0); 
		this.attack = false;

		// Movement
		if (this.renderable.flickerTimer < 70) {
			if (me.input.isKeyPressed('down')) { 

				this.renderable.setCurrentAnimation("crouch");
				if (me.input.isKeyPressed('attack')) { 
					
					if (self.vel.x != 0) {
						if (clientData[0] == 'left') self.vel.x = -.5;  
						if (clientData[0] == 'right') self.vel.x = .5;
					}
					this.renderable.setCurrentAnimation("crouchattack");
					this.crouchAttack = true;
					this.attack = true;

					// console.log(clientData[0])
				}
			}
			else if (me.input.isKeyPressed('attack'))	{ 

				this.attack = true;  
				self.attackFinished = false;

				// setTimeout(function(){self.attackFinished = true;},400);

			} 
			// Attacking
			if (!self.attackFinished) {

				// this.updateColRect(25,75, -1,0); 


				// Which direction movement
				if (clientData[0] == 'left') self.vel.x = -.5;  
				if (clientData[0] == 'right') self.vel.x = .5;
				if (self.vel.x > 0) this.updateColRect(0,70, -1,100); 
				if (self.vel.x < 0) this.updateColRect(110,70, -1,100); 
				self.renderable.setCurrentAnimation("attack", function() {

					self.renderable.setAnimationFrame();
					self.attackFinished = true;
				});
			}
			else if (me.input.isKeyPressed('left'))	{ 

				this.renderable.setCurrentAnimation("walk");

				// Loading next/previous level if at the end of the screen
				if (this.pos.x < 200) {levelDirection = 'west';}
				if (this.pos.x > 1100) {levelDirection = 'east';}
				if (this.pos.y > 1232) {levelDirection = 'south';}
				nextScreenX = this.pos.x
				nextScreenY = this.pos.y

				// Chopping up client data to be passed to server
	    		clientData[0] = 'left';
	    		clientData[1] = clientid; 
	    		clientData[2] = this.pos.x; 
	    		clientData[3] = this.pos.y;

				this.vel.x -= this.accel.x * me.timer.tick;
				this.flipX(true);

			} else if (me.input.isKeyPressed('right')) {

				this.renderable.setCurrentAnimation("walk");

				// Loading next/previous level if at the end of the screen
				if (this.pos.x < 200) {levelDirection = 'west';}
				if (this.pos.x > 1100) {levelDirection = 'east';}
				if (this.pos.y > 1232) {levelDirection = 'south';}
				nextScreenX = this.pos.x
				nextScreenY = this.pos.y

	    		clientData[0] = 'right';
	    		clientData[1] = clientid; 
	    		clientData[2] = this.pos.x; 
	    		clientData[3] = this.pos.y;

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
	    		clientData[1] = clientid; 
	    		clientData[2] = this.pos.x;
	    		clientData[3] = this.pos.y;

				// reset the dblJump flag if off the ground
				this.mutipleJump = (this.vel.y === 0)?1:this.mutipleJump;
				
				if (this.mutipleJump<=1) {  // 2 for double jump

					// easy 'math' for double jump
					this.vel.y -= (this.maxVel.y * this.mutipleJump++) * me.timer.tick;
					// me.audio.play("jump", false);
				}
			} 
			// Jumping
			else if (this.vel.y > 0) {
				this.renderable.setCurrentAnimation("jumpdown"); 
				if (me.input.isKeyPressed('attack'))	{ 
					this.renderable.setCurrentAnimation("attack");
					this.attack = true;
				}
			}
			else if (this.vel.y < 0) {
				this.renderable.setCurrentAnimation("jumpup")
				if (me.input.isKeyPressed('attack'))	{ 
					this.renderable.setCurrentAnimation("attack");
					this.attack = true;
				}
			}	
			if (this.vel.x == 0 && this.vel.y == 0) this.renderable.setCurrentAnimation("walk")
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
		if (this.xp > lvlcap[this.lvl]) {
			this.level();
		}
		console.log(this.xp)
		// check if we moved (a "stand" animation would definitely be cleaner)
		if (this.vel.x!=0 || this.vel.y!=0 || (this.renderable&&this.renderable.isFlickering())) {
			this.parent();
			return true;
		}

		return false;
	},

	/**
	 * Bigger, Faster, Stronger
	 */

	level : function () {

		me.game.HUD.addItem("levelup", new ScoreObject((this.pos.x+25) - me.game.viewport.pos.x,(this.pos.y-30) - me.game.viewport.pos.y,'LEVEL UP'));
		this.lvl += 1; 
		this.strength += .2; 
		this.hitpoints += 20;
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
			this.maxVel.x = 6;
		}
	},

});


