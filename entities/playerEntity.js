

/************************************************************************************/
/*																					*/
/*		Main player entity															*/
/*																					*/
/************************************************************************************/

var PlayerEntity = me.ObjectEntity.extend({
	init: function(x, y, settings) {


		// Set position from Tiled if first
		if (levelDirection == '' && nextScreenY == '') y = settings.startX;
		else y = nextScreenY;

		// Canvas helper for Draw
	    this.tag = new me.Font("Verdana", 14, "white");
        this.tag.bold();


		console.log(me.game.currentLevel.width);
		console.log(me.game.currentLevel.height+ '--' + lastLevelHeight)

		if (lastLevelHeight != '' && lastLevelHeight != me.game.currentLevel.height) {

			if (lastLevelHeight > me.game.currentLevel.height) var mapHeightOffset = lastLevelHeight - me.game.currentLevel.height;
			else if (lastLevelHeight < me.game.currentLevel.height) var mapHeightOffset = me.game.currentLevel.height - lastLevelHeight;
			console.log(mapHeightOffset)
		}

		// y = 1232;
		// Check if player reached screen and set position accordingly to new screen
		if (levelDirection == 'teleport') {

			x = nextScreenX;
			y = nextScreenY;
			levelDirection == '';
		}
		else {
			if (levelDirection == 'west') {
				// if (lastLevelHeight != me.game.currentLevel.height) y = nextScreenY - mapHeightOffset;
				//else
				y = nextScreenY;
				x = me.game.currentLevel.width - 250;
			}
			if (levelDirection == 'east') {
				// if (lastLevelHeight != me.game.currentLevel.height) y = nextScreenY + mapHeightOffset;
				//else
				y = nextScreenY;
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
		}

		// call the constructor
		this.parent(x, y , settings);



		// Weapon delay
		this.cooldown = true;

		var socketArray = Array();
		socketArray[0] = clientid;
		socketArray[1] = me.levelDirector.getCurrentLevelId();

		me.audio.stopTrack();

		// Song logic
		// me.audio.playTrack("riff4");
		// setTimeout(function(){
		// 	if (me.levelDirector.getCurrentLevelId() == 'map1-1') { me.audio.stopTrack(); me.audio.playTrack("cave1"); }
		// 	if (me.levelDirector.getCurrentLevelId() == 'map3') { me.audio.stopTrack(); me.audio.playTrack("distant_thunder_and_light_rain"); }
		// 	if (me.levelDirector.getCurrentLevelId() == 'map1') {  me.audio.stopTrack(); me.audio.playTrack("battle1"); }
		// },500);

		// Setting our map in server
		socketResponse('changemapserver', socketArray);

		// walking & jumping speed
		this.setVelocity(12, 34);
		this.setFriction(1.2,0);
		this.gravity = 2.2
		this.collidable = false;

		// Player variables
		this.dying = false;
		this.hitpoints = playerInfo.hitpoints;
		me.game.xp = playerInfo.xp;
		me.game.lvl = playerInfo.lvl;
		me.game.strength = playerInfo.strength;
		this.secWeapon = 'axe';
		if (!this.mainweapon) this.mainweapon = 'whip';

		console.log(me.game.strength)

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
		this.jumpDelay = false;
		this.mainweaponDelay = false;

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
		me.input.bindKey(me.input.KEY.Q, "weaponchange");

		// Animations
		this.changeimage();

		// Sword animations
		this.renderable.addAnimation ("twohandedswordattack",  [0,1,2,3], 2);

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

    changeimage : function() {

    	if (this.mainweapon == 'twohandedsword') {
	    	this.renderable.image = me.loader.getImage('simontwohandedsword');
			this.renderable.addAnimation ("walk",  [0,1,2,3,4,2], 2);
			this.renderable.addAnimation ("stand",  [5]);
			this.renderable.addAnimation ("crouch",  [6]);
			this.renderable.addAnimation ("secondattack",  [22,23,24],1);
			this.renderable.addAnimation ("jumpdown", [14]);
			this.renderable.addAnimation ("jumpup", [17]);
			this.renderable.addAnimation ("turnright", [34,33]);
			this.renderable.addAnimation ("turnleft", [32,31]);
			this.renderable.addAnimation ("attack",  [7,8,9,10], 1);
			this.renderable.addAnimation ("jumpattack",  [9,10],1);
			this.renderable.addAnimation ("crouchattack",  [11,12,13,14],1);
			this.renderable.addAnimation ("hurt",  [17]);
    	}
    	else if (this.mainweapon == 'whip' || !this.mainweapon) {
    		this.renderable.image = me.loader.getImage('simon');
			this.renderable.addAnimation ("walk",  [0,1,2,3,4,2], 2);
			this.renderable.addAnimation ("stand",  [5]);
			this.renderable.addAnimation ("crouch",  [6]);
			this.renderable.addAnimation ("secondattack",  [22,23,24],1);
			this.renderable.addAnimation ("jumpdown", [14]);
			this.renderable.addAnimation ("jumpup", [17]);
			this.renderable.addAnimation ("turnright", [34,33]);
			this.renderable.addAnimation ("turnleft", [32,31]);
			this.renderable.addAnimation ("attack",  [7,8,9,10], 1);
			this.renderable.addAnimation ("jumpattack",  [9,10],1);
			this.renderable.addAnimation ("crouchattack",  [11,12,13,14],1);
			this.renderable.addAnimation ("hurt",  [17]);
    	}
    },

	/* -----

		update the player pos

	------			*/
	update : function () {

		var self = this;
		// console.log(this.pos.x + ' -- ' + this.pos.y)
		// this.changeimage('simontwohandedsword','twohandedswordattack')

		this.menu(self);

		this.move(self)

		this.socket(self)

		// Setting which way we want to go if map is changing
		if (this.pos.y > me.game.currentLevel.height - 300 ) {
			levelDirectionY = 'south';
		}
		else if (this.pos.y < 150 ) {
			levelDirectionY = 'north';
		}
		else {
			levelDirectionY = '';
		}

		if (this.pos.x < 200) {
			lastLevelHeight = me.game.currentLevel.height;
			levelDirection = 'west';
		}
		if (this.pos.x > 1100) {
			lastLevelHeight = me.game.currentLevel.height;
			levelDirection = 'east';
		}

		nextScreenY = this.pos.y
		nextScreenX = this.pos.x
		nextScreenVelX = this.vel.x;

		//  Updating Hit Box
		if (clientData[0] == 'left') {
			// Smaller box for crouching
			if (this.renderable.isCurrentAnimation('crouchattack') || this.renderable.isCurrentAnimation('crouch')) this.updateColRect(130,60, 170,70);
			else this.updateColRect(130,60, 140,100);
		}
		else if (clientData[0] == 'right') {
			if (this.renderable.isCurrentAnimation('crouchattack') || this.renderable.isCurrentAnimation('crouch')) this.updateColRect(50,60, 170,70);
		    else this.updateColRect(50,60, 140,100);
		}

		// check for collision with environment
		this.updateMovement();
		this.collision();

		// Check for LEVEL UP!
		if (playerInfo.xp > lvlcap[playerInfo.lvl]) {
			this.level();
		}

		this.parent();
		return true;

	},

	menu : function (self) {

		if (me.input.isKeyPressed('menu') && (!me.game.HUD.HUDItems.dialogueShopBox) && (!me.game.HUD.HUDItems.dialogueBlockerBox)) {
			// Create menu
			if (this.mainMenuPosition == -1) {
				me.audio.play("18", false);
				this.mainMenuPosition = 1;
				me.game.HUD.addItem("mainmenu", new MenuObject(600,600,'MENU', this.mainMenuPosition));
				me.game.HUD.z = Infinity;
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
		if (this.renderable.flickerTimer < 85 && (!me.game.HUD.HUDItems.mainmenu) && (!me.game.HUD.HUDItems.dialogueShopBox) && (!me.game.HUD.HUDItems.dialogueBlockerBox)) {

			// Change main weapon
			if (me.input.isKeyPressed('weaponchange') && this.mainweaponDelay == false) {

				this.mainweaponDelay = true;
				for(i=0; i < playerInfo.weapons.length; i++) {

					console.log(playerInfo.weapons)
					if (this.mainweapon == playerInfo.weapons[i]) {

						if (i == playerInfo.weapons.length-1) i = 0;
						else i++

						this.mainweapon = playerInfo.weapons[i];
						this.changeimage();
						me.game.HUD.removeItem("primaryWeapon");
						me.game.HUD.addItem("primaryWeapon", new InventoryDisplay(0,0, {width: 100, height: 100, type:'primaryweapons'}));
						break;

					}
				}
				setTimeout(function(){
				    self.mainweaponDelay = false;
				},370);

			}
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

			// // If pressed jump
			// if (me.input.isKeyPressed('jump') && self.jumpDelay == false) {

			// 	if (this.vel.y < 0)this.renderable.setCurrentAnimation("jumpdown");
			// 	this.mutipleJump = (this.vel.y === 0)?1:this.mutipleJump;
			// 	if (this.mutipleJump<=1) {  // 2 for double jump
			// 		this.vel.y -= (this.maxVel.y * this.mutipleJump++) * me.timer.tick;
			// 		self.jumpDelay = true;
			// 	}
			// 	setTimeout(function(){
			//         self.jumpDelay = false;
			// 	},250);
			// }

			// Reduce jump force toward zero
			this.jumpForce *= 0.65;

			if (me.input.isKeyPressed('jump')) {

				if (this.vel.y < 0)this.renderable.setCurrentAnimation("jumpup");
			    // make sure we are not already jumping or falling
			    if (!this.jumping && !this.falling) {
			        // set the current jump force to the maximum defined value
			        this.maxVel.y *= 0.65;
			        this.jumpForce = this.maxVel.y;

			        // set the jumping flag
			        this.jumping = true;
			    }
			}
			else {
			    this.jumpForce = 0;
			    this.maxVel.y = 35;
			    // reset the jumping flag
			    this.jumping = false;
			}

			// update current vel with the jump force value
			// gravity will then do the rest
			this.vel.y -= this.jumpForce * me.timer.tick;

			// If crouching
			if (me.input.isKeyPressed('down') && !me.input.isKeyPressed('right') && !me.input.isKeyPressed('left') && !this.renderable.isCurrentAnimation('crouchattack')) {
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
				else if (me.input.isKeyPressed('up') && this.weaponDelay == false && playerInfo.hearts > 0) {

					self.weaponDelay = true;
					var secondWeapon = new secondWeaponEntity( self.pos.x, self.pos.y+120, { image: "throwingweapons", spritewidth: 120, spriteheight: 120 }, clientData[0]);
				    me.game.add(secondWeapon, self.z);
				    me.game.sort();
				    this.renderable.setCurrentAnimation("secondattack","stand");
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
			if (this.vel.x == 0 && this.vel.y == 0 && !this.renderable.isCurrentAnimation('attack') && !this.renderable.isCurrentAnimation('crouchattack') && !this.renderable.isCurrentAnimation('crouch') && !this.renderable.isCurrentAnimation('secondattack')) {
				this.renderable.setCurrentAnimation("stand");
			}

			// // In the air
			// if (this.vel.y > 0 || this.vel.y < 0 && this.vel.y == 0 && !this.renderable.isCurrentAnimation('attack') && !this.renderable.isCurrentAnimation('crouchattack') && !this.renderable.isCurrentAnimation('crouch') && !this.renderable.isCurrentAnimation('secondattack')) {
			// 	this.renderable.setCurrentAnimation("jumpdown");
			// }
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

		playerInfo.lvl += 1;
		playerInfo.strength += .6;
		playerInfo.hitpoints += 20;
		me.game.HUD.updateItemValue("lvl", 1);
		me.game.HUD.updateItemValue("experience", 0);
		me.game.HUD.setItemValue("score", playerInfo.hitpoints);

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
			var tween = new me.Tween(this).to({fontsize: 25, hpY: -160}, 1600).onComplete(function(){
				var tween = new me.Tween(this)
			    .to({
			        fontsize: 0,
			        hpY: 0,
			    }, 0)
			    .start();})
		    .start();

		    this.headmessage = res.obj.strength;
			playerInfo.hitpoints -= res.obj.strength;
			me.game.HUD.setItemValue("score", playerInfo.hitpoints);

			// DEATH!
			if (playerInfo.hitpoints <= 1) {

				playerInfo.hitpoints = lvlMaxHealth[playerInfo.lvl];
				me.game.HUD.updateItemValue("score", playerInfo.hitpoints+20);
				nextScreenY = '';
				me.game.HUD.removeItem("mainmenu");
				// me.levelDirector.reloadLevel();
			}
			this.maxVel.x = 12;
		}
	},

});


