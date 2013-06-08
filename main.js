/* -----

	main 
	
	------*/
	

var game = {

	// game assets
	assets : [	

		{name: "title_screen",		type:"image",	src: "data/gfx/gui/title_screen.png"},
		{name: "SkyBackground",		type:"image",	src: "data/gfx/background/SkyBackground.png"},
		{name: "CrossBackground",		type:"image",	src: "data/gfx/background/CrossBackground.png"},
		{name: "CaveBackground",		type:"image",	src: "data/gfx/background/CaveBackground.png"},
		{name: "CaveBackgroundBack",		type:"image",	src: "data/gfx/background/CaveBackgroundBack.png"},

		// {name: "metatiles35x35",		type:"image",	src: "data/gfx/metatiles35x35.png"},
		// {name: "Forestground@4x",		type:"image",	src: "data/gfx/Forestground@4x.png"},
		{name: "tileset",		type:"image",	src: "data/gfx/tileset.png"},

		{name: "atascii",		type:"image",	src: "data/gfx/atascii_24px.png"},
		{name: "background",	type:"image",	src: "data/gfx/background.png"},
		{name: "04",			type: "audio",	src: "data/audio/",	channel : 1},
		{name: "06",			type: "audio",	src: "data/audio/",	channel : 1},
		{name: "35",			type: "audio",	src: "data/audio/",	channel : 1},
		{name: "12",			type: "audio",	src: "data/audio/",	channel : 1},

		// Menu Sounds
		{name: "17",			type: "audio",	src: "data/audio/",	channel : 1},
		{name: "18",			type: "audio",	src: "data/audio/",	channel : 1},
		{name: "24",			type: "audio",	src: "data/audio/",	channel : 1},

		// Sec Weapons
		{name: "29",			type: "audio",	src: "data/audio/",	channel : 1},
		{name: "26",			type: "audio",	src: "data/audio/",	channel : 1},

		// Music
		{name: "distant_thunder_and_light_rain",			type: "audio",	src: "data/audio/",	channel : 2},
		{name: "cave1",			type: "audio",	src: "data/audio/music/",	channel : 2},
		{name: "battle1.2",			type: "audio",	src: "data/audio/music/",	channel : 2},
		{name: "riff4",			type: "audio",	src: "data/audio/music/",	channel : 2},

		

		// level map
		{name: "map1",			type: "tmx",	src: "data/map/map1.tmx"},
		{name: "map2",			type: "tmx",	src: "data/map/map2.tmx"},
		{name: "map3",			type: "tmx",	src: "data/map/map3.tmx"}, 
		{name: "map4",			type: "tmx",	src: "data/map/map4.tmx"}, 

		// Lower tier 
		{name: "map1-1",			type: "tmx",	src: "data/map/map1-1.tmx"},
		{name: "map2-1",			type: "tmx",	src: "data/map/map2-1.tmx"},

		// Even lower tier
		{name: "map1-2",			type: "tmx",	src: "data/map/map1-2.tmx"},
		{name: "map2-2",			type: "tmx",	src: "data/map/map2-2.tmx"},
		{name: "map3-2",			type: "tmx",	src: "data/map/map3-2.tmx"},
		// {name: "map3-1",			type: "tmx",	src: "data/map/map3-1.tmx"},
		// Lower yet

		// UI 
		{name: "secweaponoverlay",		type:"image",	src: "data/gfx/weapons and items/Inventory@4x.png"},
		{name: "secweaponoverlayleft",		type:"image",	src: "data/gfx/weapons and items/InventoryLeft@4x.png"},

		// Environment
		{name: "rain",		type:"image",	src: "data/gfx/objects/rain.png"},
		{name: "texture",		type:"image",	src: "data/gfx/texture.png"}, 
		{name: "torches",		type:"image",	src: "data/gfx/objects/Breakable@4x.png"}, 
		{name: "pickups",		type:"image",	src: "data/gfx/weapons and items/Life@4x.png"},   
		{name: "Cave@4x",		type:"image",	src: "data/gfx/Cave@4x.png"},
		{name: "firedeath",		type:"image",	src: "data/gfx/effects/Fire4@4x.png"},

		// Player
		{name: "sword",		type: "image",	src: "data/gfx/sword.png"}, 
		{name: "simon",		type:"image",	src: "data/gfx/players/testattack5@4x.png"}, 
		{name: "simontwohandedsword",		type:"image",	src: "data/gfx/players/TwoHandedSword@4x.png"}, 

		// Weapons
		{name: "throwingweapons",		type:"image",	src: "data/gfx/weapons and items/Throwing Weapons@4x.png"}, 
		{name: "twohandedsword",		type:"image",	src: "data/gfx/weapons and items/Twohandedswordsprite@4x.png"}, 

		// NPCs
		{name: "Shopkeeper",		type:"image",	src: "data/gfx/shops and npcs/Shop@4x.png"}, 
		{name: "Oldman",		type:"image",	src: "data/gfx/shops and npcs/Old Man@4x.png"},
		{name: "Teleport",		type:"image",	src: "data/gfx/shops and npcs/Teleport@4x.png"},

		// Enemies
		{name: "flyingdemon",		type:"image",	src: "data/gfx/enemies/Demon@4x.png"},
		{name: "rat",		type:"image",	src: "data/gfx/enemies/Rat@4x.png"},
		{name: "coffin",		type:"image",	src: "data/gfx/enemies/Coffin@4x.png"},
		{name: "skeleton",		type:"image",	src: "data/gfx/enemies/Skeleton2@4x.png"},
		{name: "skeletonhead",		type:"image",	src: "data/gfx/enemies/Skeleton@4x.png"},
		{name: "crow",		type:"image",	src: "data/gfx/enemies/Crow@4x.png"}, 
		{name: "bat",		type:"image",	src: "data/gfx/enemies/Giant Bat@4x.png"}, 
		{name: "skull",		type:"image",	src: "data/gfx/enemies/Skull@4x.png"}, 
		{name: "zombie",		type:"image",	src: "data/gfx/enemies/Zombie@4x.png"}, 
		{name: "skeletonsword",		type:"image",	src: "data/gfx/enemies/Skeleton Sword@4x.png"},  
		{name: "cavebat",		type:"image",	src: "data/gfx/enemies/Bat@4x.png"}, 

	],  

	
	/* ---
	
		Initialize the application
		
		---										*/

		
	onload: function()
	{
		// init the video
		// me.sys.useNativeAnimFrame = true;

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
		me.audio.init("mp3");
		
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

		// add our enemy entity in the entity pool
		// me.entityPool.add("BatEntity", BatEnemyEntity);
		me.entityPool.add("WeatherFactory", WeatherFactoryEntity);
		me.entityPool.add("SkeletonEntity", SkeletonEnemyEntity);
		me.entityPool.add("PathEnemyEntity", SkeletonEnemyEntity);
		me.entityPool.add("CrowEntity", CrowEnemyEntity);
		me.entityPool.add("SkullEntity", SkullEnemyEntity);
		me.entityPool.add("EnemyFactory", EnemyFactoryEntity);
		me.entityPool.add("BossFactory", BossFactoryEntity); 								
		
		// Pickups
		me.entityPool.add("PickupEntity", PickupEntity); 							
		me.entityPool.add("BreakableEntity", BreakableEntity);

		// HUD
		// me.entityPool.add("SecWeapon", SecondWeaponDisplay);

		// add our player entity in the entity pool
		me.entityPool.add("mainPlayer", PlayerEntity,999); 
		me.entityPool.add("npcEntity", npcEntity,100); 
		me.entityPool.add("secondPlayer", Player2Entity); 

		// Weapons
		me.entityPool.add("sword", weaponEntity);   
		me.entityPool.add("secSword", secondWeaponEntity);  

		
		// set the "Play/Ingame" Screen Object
    	me.state.set(me.state.PAUSE, new CustomLoadingScreen()); 
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());
		
		// set the fade transition effect
		me.state.transition("fade","#FFFFFF", 250);

		// switch to PLAY state
		me.state.change(me.state.PLAY);

	}
};

/* game initialization */
var PlayScreen = me.ScreenObject.extend( {

	// we just defined what to be done on reset
	// no need to do somehting else
	onResetEvent: function() {
		// load a level
		me.levelDirector.loadLevel("map1-2");

		// add a default HUD to the game mngr
		me.game.addHUD(0,0,1280, 720);
		
		// add a new HUD item 
		me.game.HUD.addItem("score", new ScoreObject(0,30,'HP: ', playerInfo.hitpoints));
		me.game.HUD.addItem("experience", new ScoreObject(0,60,'XP: ', 0));
		me.game.HUD.addItem("lvl", new ScoreObject(0,90,'LVL: ', 1)); 
		me.game.HUD.addItem("hearts", new ScoreObject(0,120,'HEARTS: ', playerInfo.hearts)); 
		me.game.HUD.addItem("secondWeapon", new InventoryDisplay(1100,0, {width: 100, height: 100, type:'secweapons'})); 
		me.game.HUD.addItem("secondWeapon", new InventoryDisplay(0,0, {width: 100, height: 100, type:'primaryweapons'}));  
		// me.game.HUD.addItem("primaryWeapon", new InventoryDisplay(1000,10, {width: 150, height: 100, type:'primaryweapons'})); 


		// me.game.HUD.addItem("score", new ScoreObject(00,790));  
		
		// play some music
		me.audio.playTrack("battle1.2");

	}

});

 /* Bootstrap */
window.onReady(function onReady() {
	game.onload();
});

