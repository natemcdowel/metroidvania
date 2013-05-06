/* -----

	main 
	
	------*/
	

var game = {

	// game assets
	assets : [	
		{name: "tileset",		type:"image",	src: "data/gfx/Forestground@4x.png"},
		{name: "tileset",		type:"image",	src: "data/gfx/tileset.png"},
		{name: "atascii",		type:"image",	src: "data/gfx/atascii_24px.png"},
		{name: "background",	type:"image",	src: "data/gfx/background.png"},
		{name: "cling",			type: "audio",	src: "data/audio/",	channel : 2},
		// {name: "die",			type: "audio",	src: "data/audio/04.wav"},
		// {name: "enemykill",		type: "audio",	src: "data/audio/04.wav"},
		{name: "jump",			type: "audio",	src: "data/audio/",	channel : 2},
		// {name: "DST-GameForest",type: "audio",	src: "data/audio/",	channel : 1},
		// level map
		{name: "map1",			type: "tmx",	src: "data/map/map1.tmx"},
		{name: "map2",			type: "tmx",	src: "data/map/map2.tmx"},
		{name: "map3",			type: "tmx",	src: "data/map/map3.tmx"}, 

		// Lower tier
		{name: "map1-1",			type: "tmx",	src: "data/map/map1-1.tmx"},
		{name: "map2-1",			type: "tmx",	src: "data/map/map2-1.tmx"},
		// {name: "map3-1",			type: "tmx",	src: "data/map/map3-1.tmx"},

		// texturePacker
		// {name: "texture",		type: "tps",	src: "data/gfx/goblin.json"},
		{name: "simon",		type:"image",	src: "data/gfx/attack@4x.png"}, 
		{name: "skeleton",		type:"image",	src: "data/gfx/Skeleton3@4x.png"},
		{name: "skeletonhead",		type:"image",	src: "data/gfx/Skeleton3@4x.png"},
		{name: "crow",		type:"image",	src: "data/gfx/Crow@4x.png"}, 
		{name: "bat",		type:"image",	src: "data/gfx/Bat.png"},
		{name: "symph",		type:"image",	src: "data/gfx/sword.png"}, 
		{name: "goblin",		type:"image",	src: "data/gfx/gobl.png"},   
		{name: "lameenemy",		type:"image",	src: "data/gfx/lameenemyspr.png"},   
		{name: "texture",		type: "tps",	src: "data/gfx/texture.json"},
		{name: "texture",		type:"image",	src: "data/gfx/texture.png"}, 
		 
	],  

	
	/* ---
	
		Initialize the application
		
		---										*/

		
	onload: function()
	{
		// init the video
		// me.sys.useNativeAnimFrame = true;
		// me.sys.fps = 30;
		if (!me.video.init('screen', 1280, 720, true, 'auto')) { 
			alert("Sorry but your browser does not support html 5 canvas. Please try with another one!");
			return;
		}
		// disable interpolation when scaling
		me.video.setImageSmoothing(false);

        me.debug.renderHitBox = true;
		
		// install the debug panel plugin
		//me.plugin.register(debugPanel, "debug");
		
		// initialize the "sound engine"
		me.audio.init("mp3,ogg");
		
		// set all ressources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all ressources to be loaded
		me.loader.preload(game.assets);
		
		// load everything & display a loading screen
		me.state.change(me.state.LOADING);

		// Debugger
		me.debug.renderHitBox;
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										*/
	loaded: function ()	{

		// set the "Play/Ingame" Screen Object
    	me.state.set(me.state.MENU, new TitleScreen());
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());
		
		// set the fade transition effect
		me.state.transition("fade","#FFFFFF", 250);

		// add our enemy entity in the entity pool
		// me.entityPool.add("BatEntity", BatEnemyEntity);
		me.entityPool.add("SkeletonEntity", SkeletonEnemyEntity);
		// me.entityPool.add("CrowEntity", CrowEnemyEntity);
		// var coin2 = me.entityPool.add("CoinEntity", CoinEntity); 

		// add our player entity in the entity pool
		me.entityPool.add("mainPlayer", PlayerEntity); 
		me.entityPool.add("sword", weaponEntity);   
		me.entityPool.add("secondPlayer", Player2Entity); 
		
		// switch to PLAY state
		me.state.change(me.state.PLAY);
		    // display the menu title
   		 // me.state.change(me.state.MENU);

	}
};

/* game initialization */
var PlayScreen = me.ScreenObject.extend( {

	// we just defined what to be done on reset
	// no need to do somehting else
	onResetEvent: function() {
		// load a level
		me.levelDirector.loadLevel("map1");
		
		// add a default HUD to the game mngr
		// me.game.addHUD(0,560,800,40);

		// add a default HUD to the game mngr
		me.game.addHUD(0,0,1280, 720);
		
		// add a new HUD item 
		me.game.HUD.addItem("score", new ScoreObject(0,00,'HP: ', 50));
		me.game.HUD.addItem("experience", new ScoreObject(0,30,'XP: ', 0));
		me.game.HUD.addItem("lvl", new ScoreObject(0,60,'LVL: ', 1)); 

		// me.game.HUD.addItem("score", new ScoreObject(00,790));  
		
		// play some music
		// me.audio.playTrack("DST-GameForest");

	}

});

 /* Bootstrap */
window.onReady(function onReady() {
	game.onload();
});

