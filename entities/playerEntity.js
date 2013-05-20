

/************************************************************************************/
/*																					*/
/*		Main player entity															*/
/*																					*/
/************************************************************************************/

var PlayerEntity = me.ObjectEntity.extend({	
	init: function(x, y, settings) { 

		// Remove menu if it is up
		
		y = nextScreenY;

	    this.tag = new me.Font("Verdana", 14, "white");
        this.tag.bold();

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
		if (levelDirectionY == 'south' ) {
			y = 40;
			x = nextScreenX;
		}
		if (levelDirectionY == 'north') {
			y = 900;
			x = nextScreenX;
			settings.velY = -20;
		}

		// call the constructor
		this.parent(x, y , settings); 
		this.setVelocity(12, 27); 

		// Weapon delay
		this.cooldown = true;
		
		var socketArray = Array(); 
		socketArray[0] = clientid;
		socketArray[1] = me.levelDirector.getCurrentLevelId();

		me.audio.stopTrack();

		// Song logic
		setTimeout(function(){ 
			if (me.levelDirector.getCurrentLevelId() == 'map1-1') { me.audio.stopTrack(); me.audio.playTrack("cave1"); }
			if (me.levelDirector.getCurrentLevelId() == 'map3') { me.audio.stopTrack(); me.audio.playTrack("distant_thunder_and_light_rain"); }
			if (me.levelDirector.getCurrentLevelId() == 'map1') {  me.audio.stopTrack(); me.audio.playTrack("battle1"); }
		},500);

		// Setting our map in server 
		socketResponse('changemapserver', socketArray);  

		// walking & jumping speed 
		
		this.setFriction(1.2,0); 
		this.gravity = 2.2

		// Player variables
		this.dying = false;
		this.hitpoints = 50;
		this.collidable = false;
		me.game.xp = 0;
		me.game.lvl = 1;
		me.game.strength = 3;
		this.mutipleJump = 0;
		this.type = 'player';
		this.attackFinished = true;
		this.fontsize = 0;
		this.hpY = 0;

		// Menus
		this.mainMenuPosition = -1;
		this.mainMenuPositionLength = 4

		// Delay variables
		this.menuDelay = false;
		this.weaponDelay = false;
		
		// set the display around our position 
		me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);
		this.renderable.animationspeed = 2;


				
		// enable keyboard
		me.input.bindKey(me.input.KEY.LEFT,	 "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right"); 
		me.input.bindKey(me.input.KEY.Z,	"jump"); 
		me.input.bindKey(me.input.KEY.UP,	"up"); 
		me.input.bindKey(me.input.KEY.X,	"attack"); 
		me.input.bindKey(me.input.KEY.DOWN,	"down");
		me.input.bindKey(me.input.KEY.ENTER, "menu");
		
		// Animations
		this.renderable.addAnimation ("walk",  [0,1,2,3,4,3,2,1], 2); 
		this.renderable.addAnimation ("stand",  [0]); 
		this.renderable.addAnimation ("crouch",  [3]);
		this.renderable.addAnimation ("secondattack",  [4]);
		this.renderable.addAnimation ("jumpdown", [5]);
		this.renderable.addAnimation ("attack",  [7,8,9,10], 1);
		// this.renderable.addAnimation ("attack",  [20,21,22,23], 1);
		this.renderable.addAnimation ("jumpattack",  [9,10],1);
		this.renderable.addAnimation ("crouchattack",  [11,12,13,14],1);
		this.renderable.addAnimation ("hurt",  [16,17,18]);

		// set as default
		this.renderable.setCurrentAnimation("walk"); 
		this.anchorPoint.set(0.5, 1.0); 
		this.updateColRect(110,60, 130,100);

		if (typeof settings.velY != 'undefined') this.vel.y = settings.velY;
		if (typeof nextScreenVelX != '') this.vel.x = nextScreenVelX;
	},


	/* -----

		Draw HP and other information
		
	------			*/
    draw : function(context) {
        this.parent(context);

        if (this.pos) {
	        this.tag = new me.Font("Verdana", this.fontsize, "#DC143C");
	        this.tag.draw(context, this.headmessage ,this.pos.x + 80, this.pos.y+150+this.hpY);
    	}
    },

	/* -----

		update the player pos
		
	------			*/
	update : function () { 

		var self = this;

		// Changing 
		

		this.menu(self);

		this.move(self)

		this.socket(self)

		// Setting which way we want to go if map is changing
		if (this.pos.y > 1100 ) {
			levelDirectionY = 'south';
		} 
		else if (this.pos.y < 150 ) {
			levelDirectionY = 'north'; 
		} 
		else {
			levelDirectionY = '';
		}

		if (this.pos.x < 200) {
			levelDirection = 'west';
		}
		if (this.pos.x > 1100) {
			levelDirection = 'east';
		}

		nextScreenY = this.pos.y
		nextScreenX = this.pos.x
		nextScreenVelX = this.vel.x;

		//  Updating Hit Box
		if (clientData[0] == 'left') this.updateColRect(130,60, 140,100); 
		else if (clientData[0] == 'right') this.updateColRect(50,60, 140,100);  

		// check for collision with environment
		this.updateMovement();
		this.collision();
		
		// Check for LEVEL UP!
		if (me.game.xp > lvlcap[me.game.lvl]) {
			this.level();
		}

		this.parent();
		return true;

	}, 

	menu : function (self) {

		if (me.input.isKeyPressed('menu')) {	

			
			// Create menu
			if (this.mainMenuPosition == -1) {
				this.mainMenuPosition = 1;
				me.game.HUD.addItem("mainmenu", new MenuObject(600,600,'MENU', this.mainMenuPosition)); 
				me.game.sort();
				setTimeout(function(){ self.menuDelay = false; },100);
			}

		}

		// In the menu
		if (self.mainMenuPosition != -1) {
			// Up Key
			if(me.input.isKeyPressed('up') && !self.menuDelay) {

				if (this.mainMenuPosition >= 1) this.mainMenuPosition--
				self.menuDelay = true;
				me.game.HUD.removeItem("mainmenu");
				me.game.HUD.addItem("mainmenu", new MenuObject(600,600,'MENU',this.mainMenuPosition)); 
				setTimeout(function(){ self.menuDelay = false; },100);
			} 
			// Down Key
			else if(me.input.isKeyPressed('down') && !self.menuDelay) {
				if ( this.mainMenuPosition < this.mainMenuPositionLength && this.mainMenuPosition >= 0) this.mainMenuPosition++
				self.menuDelay = true;
				me.game.HUD.removeItem("mainmenu");
				me.game.HUD.addItem("mainmenu", new MenuObject(600,600,'MENU',this.mainMenuPosition)); 
				setTimeout(function(){ self.menuDelay = false; },100);
			}	

			// Exit Menu
			else if(me.input.isKeyPressed('menu') && !self.menuDelay) {

				if (this.mainMenuPosition == 0) {

					me.game.HUD.removeItem("mainmenu");
					setTimeout(function(){ self.mainMenuPosition = -1; },200); 
				}
				// Close game
				else if (this.mainMenuPosition == 4) {
					JavaScript:window.open('', '_self', '');window.close(); 
				}
			}
		} 
		///////// End Menu //////////
	},

	collision : function () {

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
	},

	socket : function () {

		// Sending information to SOCKET.io
		clientData[1] = clientid; 
		clientData[2] = this.pos.x;
		clientData[3] = this.pos.y;
		clientData[5] = this.vel.x;
		clientData[6] = this.vel.y;
		clientData[7] = this.renderable.current.name;  
		socketResponse('keypress',clientData); 

	},

	move : function () {

		var self = this;

			///////// Movements /////////
		if (this.renderable.flickerTimer < 85 && (!me.game.HUD.HUDItems.mainmenu)) {
			// If pressing left and not attacking
			if (me.input.isKeyPressed('left') && (!this.renderable.isCurrentAnimation('attack') && !this.renderable.isCurrentAnimation('crouchattack')))	{ 
				// Walk animation if not jumping
				if (!this.vel.y > 0 || !this.vel.y < 0) self.renderable.setCurrentAnimation("walk")
				this.vel.x -= this.accel.x * me.timer.tick;
				this.flipX(true);
				// Offset for flipping character
				if (clientData[0] == 'right') {
					this.pos.x -= 70;
				}
				clientData[0] = 'left';
			}
			
			// If pressing right and not attacking
			if (me.input.isKeyPressed('right') && (!this.renderable.isCurrentAnimation('attack') && !this.renderable.isCurrentAnimation('crouchattack'))) {	
				// Walk animation if not jumping
				if (!this.vel.y > 0 || !this.vel.y < 0) self.renderable.setCurrentAnimation("walk")
				this.vel.x += this.accel.x * me.timer.tick;
				this.flipX(false);
				// Offset for flipping character
				if (clientData[0] == 'left') {
					this.pos.x += 70;
				}
				clientData[0] = 'right';
			}

						// In the air
			// if (this.vel.y > 0 || this.vel.y < 0) {
			// 	if (this.vel.x < 0) this.vel.x -= this.accel.x * me.timer.tick;
			// 	if (this.vel.x > 0) this.vel.x += this.accel.x * me.timer.tick;
			// }

			// If pressed jump
			if (me.input.isKeyPressed('jump')) { 
				this.renderable.setCurrentAnimation("jumpdown");
				this.mutipleJump = (this.vel.y === 0)?1:this.mutipleJump;
				if (this.mutipleJump<=1) {  // 2 for double jump
					this.vel.y -= (this.maxVel.y * this.mutipleJump++) * me.timer.tick;
				}
			}

			// If crouching
			if (me.input.isKeyPressed('down') && !me.input.isKeyPressed('right') && !me.input.isKeyPressed('left')) {
				this.renderable.setCurrentAnimation("crouch");
			}


			//////// Attacking /////////
			if (me.input.isKeyPressed('attack')) {

				// When crouching
				if (me.input.isKeyPressed('down')) {
					this.renderable.setCurrentAnimation("crouchattack","crouch");
				}
				// In the air
				else if (this.vel.y > 0 || this.vel.y < 0) {
					if (this.vel.x < 0) this.vel.x -= this.accel.x * me.timer.tick;
					if (this.vel.x > 0) this.vel.x += this.accel.x * me.timer.tick;
					this.renderable.setCurrentAnimation("attack","stand");
				}
				// Secondary Attack
				else if (me.input.isKeyPressed('up') && this.weaponDelay == false) {

					self.weaponDelay = true;
					var secondWeapon = new secondWeaponEntity( self.pos.x, self.pos.y+120, { image: "throwingweapons", spritewidth: 100, spriteheight: 100 }, clientData[0]); 
				    me.game.add(secondWeapon, self.z);  
				    me.game.sort();  

					setTimeout(function(){ 
				        self.weaponDelay = false;
					},370);

				}
				// Any other time
				else if (this.weaponDelay == false){
				this.renderable.setCurrentAnimation("attack","stand");

				}

				// Telling sword to swing (sword collision)
				var weapon = me.game.getEntityByName("sword")[0];
				weapon.attack();
			}

			// If standing still and not attacking
			if (this.vel.x == 0 && this.vel.y == 0 && !this.renderable.isCurrentAnimation('attack') && !this.renderable.isCurrentAnimation('crouchattack') && !this.renderable.isCurrentAnimation('crouch')) {
				this.renderable.setCurrentAnimation("stand");
			}
			//////// End Attacking /////////
		}
		//////// End movements /////////

	},

	/**
	 * Bigger, Faster, Stronger
	 */

	level : function () {

		
		this.fontsize = 0;
		// Animates hitpoints above player
		var tween = new me.Tween(this).to({fontsize: 20, hpY: -50}, 1600).onComplete(function(){		   
			var tween = new me.Tween(this)
		    .to({
		        fontsize: 0,
		        hpY: 0,
		    }, 600)
		    .start();})
	    .start();

	    this.headmessage = 'Level Up!';

		me.game.lvl += 1; 
		me.game.strength += .6; 
		me.game.hitpoints += 20;
		me.game.HUD.updateItemValue("lvl", 1);
		me.game.HUD.updateItemValue("experience", 0);
		me.game.HUD.updateItemValue("score", 20);

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

			// Animates hitpoints above player
			var tween = new me.Tween(this).to({fontsize: 40, hpY: -160}, 1600).onComplete(function(){		   
				var tween = new me.Tween(this)
			    .to({
			        fontsize: 0,
			        hpY: 0,
			    }, 0)
			    .start();})
		    .start();

		    this.headmessage = res.obj.strength;    
			this.hitpoints -= res.obj.strength;

			// DEATH!
			if (this.hitpoints <= 1) {

				me.game.HUD.updateItemValue("score", 50);
				nextScreenY = '';
				me.game.HUD.removeItem("mainmenu");
				me.levelDirector.reloadLevel();
			}
			this.maxVel.x = 12;
		}
	},

});


