
/**
 * Lamps and Such, Break for hearts
 */
var BreakableEntity = me.ObjectEntity.extend({	

	init: function(x, y, settings, direction) {
		
		this.parent(x, y, settings);
		this.renderable.addAnimation ("burn", [0,1,2],2);
		this.renderable.addAnimation ("break", [3,4],2);
		this.renderable.setCurrentAnimation("burn");
		this.collidable = true;
		this.destroyed = false;
		this.item = settings.item

	},

	onCollision : function (res, obj) {
		// res.y >0 means touched by something on the bottom
		// which mean at top position for this one
		// if (this.alive && (res.y > 0) && obj.falling) {

		var self = this;
		
		if (this.alive && obj.weapon == 'sword') {

			me.audio.play("06", false);
			this.renderable.setCurrentAnimation("break",function() { me.game.remove(self)});

			// Spawning Pickup
			if (!this.destroyed) {

				// If specific drop set from Tiled 
				if (this.item) var pickup = new PickupEntity( self.pos.x, self.pos.y-50, { image: "throwingweapons", spritewidth: 100, spriteheight: 100 },false,this.item); 
				else var pickup = new PickupEntity( self.pos.x, self.pos.y-50, { image: "pickups", spritewidth: 90, spriteheight: 55 }); 

			    me.game.add(pickup, self.z-1);
			    me.game.sort();
			    this.destroyed = true;
			}
		}
	},

	update : function () {

		// this.updateMovement();
		this.parent()
		return true;

	}
}); 


/**
 * Lamps and Such, Break for hearts
 */
var PickupEntity = me.ObjectEntity.extend({	

	init: function(x, y, settings, enemy,item) {
		
		this.parent(x, y, settings);

		this.renderable.addAnimation ("largeheart", [0]);
		this.renderable.addAnimation ("health", [1]);
		this.renderable.addAnimation ("smallheart", [2]);
		
		// What do we drop?
		if (enemy) this.renderable.setCurrentAnimation("smallheart");
		// if (item)
		else this.renderable.setCurrentAnimation("largeheart");

		this.alive = true;
		this.collidable = true;

	},

	onCollision : function (res, obj) {
		// res.y >0 means touched by something on the bottom
		// which mean at top position for this one
		// if (this.alive && (res.y > 0) && obj.falling) {

		
		var self = this;

		if (obj.type == 'player' && this.alive) {
			
			me.game.remove(self) 
			me.audio.play("12");
			this.alive = false;
		}
	
	},

	update : function () {


		this.updateMovement();
	
		this.parent()
		return true;

	}
}); 


/**
 * a coin (collectable) entiry
 */
var CoinEntity = me.CollectableEntity.extend({	
	/** 
	 * constructor
	 */
	init: function (x, y, settings) {
		
		// call the parent constructorx
		this.parent(x, y , settings);

		// add the coin sprite as renderable
		this.renderable = game.texture.createSpriteFromName("coin.png");
		
		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);
		var count = me.game.getEntityByGUID(this.GUID)
				
	},		
	

	/** 
	 * collision handling
	 */
	onCollision : function () {
		// do something when collide
		me.audio.play("cling", false);
		// give some score
		me.game.HUD.updateItemValue("score", 250);
		
		//avoid further collision and delete it
		this.collidable = false;
		coinid = this.GUID;
		socketResponse('destroy',coinid);    
	// me.game.remove(this); 	
		// console.log(Player2Entity)  
	},

	update : function () {

		socket.on('destroys', function (data) { 
			coinid = data;
		}); 

		if(coinid == this.GUID) 
		me.game.remove(this);

	}
	
}); 


var inventoryEntity = me.CollectableEntity.extend({	
	/** 
	 * constructor
	 */
	init: function (x, y, settings) {
		
		// call the parent constructor
		this.parent(x, y , settings);

		// add the coin sprite as renderable
		this.renderable = game.texture.createSpriteFromName("coin.png");
		
		// set the renderable position to bottom center
		this.anchorPoint.set(0.5, 1.0);
		var count = me.game.getEntityByGUID(this.GUID)
		
		
	},		
	

	/** 
	 * collision handling
	 */
	onCollision : function () {
		// do something when collide
		me.audio.play("cling", false);
		// give some score
		me.game.HUD.updateItemValue("score", 250);
		
		//avoid further collision and delete it
		this.collidable = false;
		coinid = this.GUID;
		socketResponse('destroy',coinid);    
	// me.game.remove(this); 	
		// console.log(Player2Entity)  
	},

	update : function () {

		socket.on('destroys', function (data) { 
			coinid = data;
		}); 

		if(coinid == this.GUID) 
		me.game.remove(this);

	}
	
}); 



/** 
 * a GUI object 
 * display score on screen
 */
var ScoreObject = me.HUD_Item.extend( {	
	/** 
	 * constructor
	 */
	init: function(x, y, name, value) {
		// call the parent constructor
		this.parent(x, y);
		// create a font

		this.name = name;
		// this.font = new me.BitmapFont("atascii", {x:24});
		this.font = new me.Font("Impact", 20, "yellow");
		this.value = value;
	},
	/**
	 * draw the score
	 */
	draw : function (context, x, y) {
		
		if (typeof this.value == 'undefined') this.value = '';
		this.font.draw (context, this.name+this.value, this.pos.x +x, this.pos.y+y);
	}
});


/** 
 * a GUI object 
 * Menu
 */
var MenuObject = me.HUD_Item.extend( {	
	/** 
	 * constructor
	 */
	init: function(x, y, name, menuposition) {
		// call the parent constructor
		this.parent(x, y);


		// 		// enable keyboard
		// me.input.bindKey(me.input.KEY.LEFT,	 "left");
		// me.input.bindKey(me.input.KEY.RIGHT, "right"); 
		// me.input.bindKey(me.input.KEY.UP,	"jump", true); 
		// me.input.bindKey(me.input.KEY.X,	"attack"); 
		// me.input.bindKey(me.input.KEY.DOWN,	"down");
		// me.input.bindKey(me.input.KEY.ENTER, "menu");

		this.name = name;
		this.menuoptions = ['Back to Game','Inventory','Host Game','Join Game','Quit Game'];
		// this.font = new me.BitmapFont("atascii", {x:24});
		this.font = new me.Font("Impact", 20, "yellow");
		this.image = me.loader.getImage("sword"); 
		this.x = 230;
		this.y = 60;
		this.yOffset = 0;
		this.width = 800;
		this.height = 600;
		this.menuposition = menuposition;

	
	},
	/**
	 * draw the score
	 */
	draw : function (context, menuposition) {


		
		// If the first time it was created
		if (typeof this.context == 'undefined') {
			this.context = context;
		}
		
		// Main box 
		this.context.fillStyle = "black";
		this.context.globalAlpha=0.7; // Half opacity
		this.context.fillRect(this.x, this.y, this.width, this.height); 

		var yOffset = 0; 
		menuSelected = 0;


		// Menu Options

		for(i=0; i<this.menuoptions.length; i++) { 


			yOffset += 60;

			if (i == this.menuposition) {
				this.context.font="40px Impact";
				this.context.fillStyle = 'yellow';
			}
			else {
				this.context.font="40px Impact";
				this.context.fillStyle = 'white';
			}
	
			this.context.fillText(this.menuoptions[i],this.x+30, this.y+yOffset); 
		};

	},

	update : function (context) {

	
	}

});


var textEntity = me.ObjectEntity.extend({
	init: function (x, y, settings){
		
		this.parent(x, y, settings);
		this.testText = new me.Font("Verdana", 14, "white");

	},

	draw: function draw(context){
		this.parent(context);

		
		testText.draw(context, "hello", 100, 50);

		me.game.sort();
	}
});