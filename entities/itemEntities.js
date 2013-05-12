
/**
 * a coin (collectable) entiry
 */
var CoinEntity = me.CollectableEntity.extend({	
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
	init: function(x, y, name, value) {
		// call the parent constructor
		this.parent(x, y);


				// enable keyboard
		me.input.bindKey(me.input.KEY.LEFT,	 "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right"); 
		me.input.bindKey(me.input.KEY.UP,	"jump", true); 
		me.input.bindKey(me.input.KEY.X,	"attack"); 
		me.input.bindKey(me.input.KEY.DOWN,	"down");
		me.input.bindKey(me.input.KEY.ENTER, "menu");

		this.name = name;
		this.menuoptions = ['Back to Game','Inventory','Quit Game'];
		// this.font = new me.BitmapFont("atascii", {x:24});
		this.font = new me.Font("Impact", 20, "yellow");
		this.image = me.loader.getImage("sword"); 
		this.x = 250;
		this.y = 60;
		this.yOffset = 0;
		this.width = 800;
		this.height = 600;
	
	},
	/**
	 * draw the score
	 */
	draw : function (context, x, y) {
		
		// Main box
		context.fillStyle = "black";
		context.globalAlpha=0.4; // Half opacity
		context.fillRect(this.x, this.y, this.width, this.height); 

		// Menu Options

		for(i=0; i<this.menuoptions.length; i++) { 

			this.yOffset += 60;
			context.font="40px Impact";
			context.fillStyle = 'white';
			context.fillText(this.menuoptions[i],this.x, this.y+this.yOffset); 
		};



    	console.log(me.game.HUD)

	},

});
