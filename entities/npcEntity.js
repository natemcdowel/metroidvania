/**
 * An NPC entity
 * 
 */

 var npcEntity = me.ObjectEntity.extend({	

 	init: function (x, y, settings) {
 		// call the parent constructor
		this.parent(x, y , settings);

		this.collidable = true;
		this.menuposition = 0;
		this.shown = false;
		this.renderable.addAnimation ("shopkeeper", [0,1,2]);
		this.renderable.setCurrentAnimation("shopkeeper");

		// enable keyboard
		me.input.bindKey(me.input.KEY.LEFT,	 "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right"); 
		me.input.bindKey(me.input.KEY.Z,	"jump"); 
		me.input.bindKey(me.input.KEY.UP,	"up"); 
		me.input.bindKey(me.input.KEY.X,	"attack"); 
		me.input.bindKey(me.input.KEY.DOWN,	"down");
		me.input.bindKey(me.input.KEY.ENTER, "menu");
 	},

 	/**
	 * collision handle
	 */
	onCollision : function (res, obj) {
		// res.y >0 means touched by something on the bottom
		// which mean at top position for this one
		// if (this.alive && (res.y > 0) && obj.fallingx) {

		var self = this;
		if (obj.type == 'player' && me.input.isKeyPressed('up')) {


			if (this.shown == false) {
				me.game.HUD.addItem("dialogueBox", new dialogueBox(400,10, {width: 540, height: 400}, this.menuposition)); 
				me.game.sort();
				this.shown = true;
				console.log(this.shown)
			}		
		} 
	},

 	update : function () {

		var self = this;

		// Save Menu
		if (this.shown == true) { 
			if (me.input.isKeyPressed('down') && this.menuposition != 1) {
				me.audio.play("24", false);
				this.menuposition++
				me.game.HUD.removeItem("dialogueBox");
				me.game.HUD.addItem("dialogueBox", new dialogueBox(400,10, {width: 540, height: 400}, this.menuposition));
				me.game.sort(); 
			}
			if (me.input.isKeyPressed('up') && this.menuposition != 0) {
				me.audio.play("24", false);
				this.menuposition--
				me.game.HUD.removeItem("dialogueBox");
				me.game.HUD.addItem("dialogueBox", new dialogueBox(400,10, {width: 540, height: 400}, this.menuposition));
				me.game.sort(); 
			}
			if (me.input.isKeyPressed('attack')) {
				if (this.menuposition == 0) {
					me.audio.play("17", false);
					this.saveText();
					me.game.HUD.removeItem("dialogueBox");
					setTimeout(function(){ self.shown = false; },200); 
				}
				// Close game
				else if (this.menuposition == 1) {
					me.audio.play("24", false);
					me.game.HUD.removeItem("dialogueBox");
					setTimeout(function(){ self.shown = false; },200); 
				}
			}
		}

		// check & update movement
		this.updateMovement();
		this.parent()
		return true;
	},

	saveText : function () {

		var player = me.game.getEntityByName("mainPlayer")[0];
		player.fontsize = 0;

		// Animates hitpoints above player
		var tween = new me.Tween(player).to({fontsize: 30, hpY: -50}, 1600).onComplete(function(){		   
			var tween = new me.Tween(player)
		    .to({
		        fontsize: 0,
		        hpY: 0,
		    }, 600)
		    .start();})
	    .start();

	    player.headmessage = 'GAME SAVED';
	},
 });