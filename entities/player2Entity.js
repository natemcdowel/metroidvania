/************************************************************************************/
/*																					*/
/*		a player 2 entity    														*/
/*																					*/
/************************************************************************************/

var Player2Entity = me.ObjectEntity.extend({
	init: function(x, y, settings) {

		// call the constructor
		this.parent(x, y , settings);

		// walking & jumping speed
		this.setVelocity(12, 25);

		this.setFriction(1.2,0);

		this.gravity = 2

		// update the hit box
		this.updateColRect(20,32, -1,0);
		this.dying = false;

		this.mutipleJump = 1;

		// set the display around our position
		// me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

		// enable keyboard
		me.input.bindKey(me.input.KEY.A,	 "2left");
		me.input.bindKey(me.input.KEY.D, "2right");
		me.input.bindKey(me.input.KEY.W,	"2jump", true);
		me.input.bindKey(me.input.KEY.UP,	"2up");
		me.input.bindKey(me.input.KEY.DOWN,	"2down");


		// define a basic walking animatin
		this.renderable.addAnimation ("walk",  [0,1,2]);
		this.renderable.addAnimation ("stand",  [0]);
		this.renderable.addAnimation ("crouch",  [3]);
		this.renderable.addAnimation ("jumpup",  [4]);
		this.renderable.addAnimation ("jumpdown", [5]);
		this.renderable.addAnimation ("attack",  [7,8,9,10], 1);
		this.renderable.addAnimation ("jumpattack",  [9,10],1);
		this.renderable.addAnimation ("crouchattack",  [11,12,13,14],1);
		this.renderable.addAnimation ("hurt",  [16,17,18]);

		this.renderable.animationspeed = 2;
		// set as default
		this.renderable.setCurrentAnimation("walk");

		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);

	},


	/* -----

		update the player pos

	------			*/
	update : function () {

		socket.on('updateclientpos', function (users) {

			if (typeof users[1] != 'undefined') {
				// Player x, y, map
				if (clientid == 0) {
					player2Action = users[1][0];
					playerX = users[1][2];
					playerY = users[1][3];
					playerVelX = users[1][5];
					playerVelY = users[1][6];
					currentAnim = users[1][7];

				}
				if (clientid == 1) {
					player2Action = users[0][0];
					playerX = users[0][2];
					playerY = users[0][3];
					playerVelX = users[0][5];
					playerVelY = users[0][6];
					currentAnim = users[0][7];
				}
				users = users;
			}
		});

		if (typeof player2Action != 'undefined') {

			if (currentAnim != '') this.renderable.setCurrentAnimation(currentAnim);

			// if (playerX == this.pos.x && playerY == this.pos.y) this.renderable.setCurrentAnimation("stand");
			// else this.renderable.setCurrentAnimation("walk");

			if (player2Action == 'left') {
				this.flipX(true);
				this.updateColRect(130,60, 140,100);
			}
			if (player2Action == 'right') {
				this.flipX(false);
				this.updateColRect(50,60, 140,100);
			}
			// if (playerVelY < 0) this.renderable.setCurrentAnimation("jumpup");
			// if (playerVelY > 0) this.renderable.setCurrentAnimation("jumpdown");
		}
			// console.log(playerMap + ' | ' + me.levelDirector.getCurrentLevelId())

			// if (playerMap != me.levelDirector.getCurrentLevelId()) {
			// 	console.log('not on the same level')
			// 	this.visible = false
			// }




			// if ((left == true && clientid != globalClientIndex) || me.input.isKeyPressed('2left')) 	{

			// 		// alert(globalClientIndex);

			// 		this.vel.x -= this.accel.x * me.timer.tick;
			// 		this.flipX(true);
			// 		left = false;

			// } else if ((right == true && clientid != globalClientIndex) || me.input.isKeyPressed('2right')) {
			// 	this.vel.x += this.accel.x * me.timer.tick;
			// 	this.flipX(false);
			// 	right = false;
			// }

			// if ((up == true && clientid != globalClientIndex)|| me.input.isKeyPressed('2jump')) {

			// 	// reset the dblJump flag if off the ground
			// 	this.mutipleJump = (this.vel.y === 0)?1:this.mutipleJump;

			// 	if (this.mutipleJump<=1) {
			// 		// easy 'math' for double jump
			// 		this.vel.y -= (this.maxVel.y * this.mutipleJump++) * me.timer.tick;
			// 		me.audio.play("2jump", false);
			// 	}
			// 	up = false;
			// }


		// check for collision with environment
		// this.updateMovement();

		// // check if we fell into a hole
		// if (!this.inViewport && (this.pos.y > me.video.getHeight())) {
		// 	// if yes reset the game
		// 	me.game.remove(this);
		// 	me.game.viewport.fadeIn('#fff', 150, function(){
		// 		me.audio.play("die", false);
		// 		me.levelDirector.reloadLevel();
		// 		me.game.viewport.fadeOut('#fff', 150);
		// 	});
		// 	return true;
		// }

		// // check for collision with sthg
		// var res = me.game.collide(this);

		// if (res) {
		// 	switch (res.obj.type) {
		// 		case me.game.ENEMY_OBJECT : {
		// 			if ((res.y>0) && this.falling) {
		// 				// jump
		// 				this.vel.y -= this.maxVel.y * me.timer.tick;
		// 			} else {
		// 				this.hurt();
		// 			}
		// 			break;
		// 		}

		// 		case "spikeObject" :{
		// 			// jump & die
		// 			this.vel.y -= this.maxVel.y * me.timer.tick;
		// 			this.hurt();
		// 			break;
		// 		}

		// 		default : break;
		// 	}
		// }

		// // check if we moved (a "stand" animation would definitely be cleaner)
		// if (this.vel.x!=0 || this.vel.y!=0 || (this.renderable&&this.renderable.isFlickering())) {
		// 	this.parent();
		// 	return true;
		// }
		// if (socketUpdated == false) {

		// 	console.log('socketno')
		// 	playerXlast = playerX;
		// 	playerYlast = playerX;;

		// 	this.pos.x = playerXlast;
		// 	this.pos.y = playerYlast;
		// }
		// if (socketUpdated == true) {
		// 	alert('yes')
			// console.log('socketyes')

		// }


		//Checking map against other player to see if they are in map
		socketResponse('checkmapserver',clientid);
		socket.on('checkmapclient', function (users) {


			if (typeof users[1] != 'undefined') {
				if(users[0][4] != users[1][4]) {

					visiblePlayer = false;

				}
				else {visiblePlayer = true;}
			}
		});

		this.visible = visiblePlayer;


		this.pos.x = playerX;
		this.pos.y = playerY;
		// console.log(player2Action)

		// check for collision with environment
		this.updateMovement();

		this.parent();
		return true;
	},


	/**
	 * ouch
	 */
	hurt : function () {
		// if (!this.renderable.flickering)
		// {
		// 	this.renderable.flicker(45);
		// 	// flash the screen
		// 	me.game.viewport.fadeIn("#FFFFFF", 75);
		// 	me.audio.play("die", false);
		// }
	}
});