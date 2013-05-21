/************************************************************************************/
/*                                                                                  */
/*      Menu or Title Screen Entity                                                 */
/*                                                                                  */
/************************************************************************************/

var CustomLoadingScreen = me.ScreenObject.extend(
{
   // constructor
   init: function()
   {
      // pass true to the parent constructor
      // as we draw our progress bar in the draw function
      this.parent(true);
      // a font logo
      this.logo = new me.Font('century gothic', 32, 'white');
      // flag to know if we need to refresh the display
      this.invalidate = false;
      // load progress in percent
      this.loadPercent = 0;
      // setup a callback
      me.loader.onProgress = this.onProgressUpdate.bind(this);

        // enable keyboard
      me.input.bindKey(me.input.KEY.LEFT,  "left");
      me.input.bindKey(me.input.KEY.RIGHT, "right"); 
      me.input.bindKey(me.input.KEY.UP,   "jump", true); 
      me.input.bindKey(me.input.KEY.X,    "attack"); 
      me.input.bindKey(me.input.KEY.DOWN, "down");
      me.input.bindKey(me.input.KEY.ENTER, "menu");

   },

   // will be fired by the loader each time a resource is loaded
   onProgressUpdate: function(progress)
   {
      this.loadPercent = progress;
      this.invalidate = true;
   },


   // make sure the screen is only refreshed on load progress
   update: function()
   {    

       if (me.input.isKeyPressed('menu')) {
            me.game.remove(this)
      }

      if (this.invalidate===true)
      {
         // clear the flag
         this.invalidate = false;
         // and return true
         return true;
      }
      // else return false
      return false;
   },

   // on destroy event
   onDestroyEvent : function ()
   {
      // "nullify" all fonts
      this.logo = null;
   },

   //   draw function
   draw : function(context)
   {
      console.log(me.state.x)
      // clear the screen
      me.video.clearSurface (context, "black");

      // measure the logo size
      logo_width = this.logo.measureText(context,"awesome loading screen ").width;

      console.log(context)
      // draw our text somewhere in the middle
      this.logo.draw(context,
                     "awesome loading screen",
                     ((me.video.getWidth() - logo_width) / 2),
                     (me.video.getHeight() + 60) / 2);

      // display a progressive loading bar
      var width = Math.floor(this.loadPercent * me.video.getWidth());

      // draw the progress bar
      context.strokeStyle = "silver";
      context.strokeRect(0, (me.video.getHeight() / 2) + 40, me.video.getWidth(), 6);
      context.fillStyle = "#89b002";
      context.fillRect(2, (me.video.getHeight() / 2) + 42, width-4, 2);
   },
});


/************************************************************************************/
/*                                                                                  */
/*      GUI entity                                                          */
/*                                                                                  */
/************************************************************************************/

// create a basic GUI Object
var myButton = me.GUI_Object.extend(
{   
   init:function(x, y)
   {    

      console.log('worked')
      settings = {}
      settings.image = "sword";
      settings.spritewidth = 128; 
      settings.spriteheight = 398;
      // parent constructor
      this.parent(x, y, settings);

 
   },
    
   // output something in the console
   // when the object is clicked
   onClick:function()
   {
      console.log("clicked!");
      // don't propagate the event
      return true;
   }
}); 



var DropletParticle = me.AnimationSheet.extend(
{
    // distance = from point x original
        // altitude = from point y original       
    init: function(x, y, distance, altitude)
    {
        // Class Constructor
        this.parent(x, y, me.loader.getImage("rain"), 2, 4);

        // Calculate Random Launch Angle
        var launch = Number.prototype.random(20, 35);
        
        // Set Initial Particle Velocity
                // Number.prototype.random(-1, 1) => Particle Screen Side (value negative is left and positive is right)
        this.vel = new me.Vector2d(-Math.sin(Number.prototype.degToRad(launch)) * distance * Number.prototype.random(-1, 1), -Math.cos(Number.prototype.degToRad(launch)) * altitude);          
        // Add Single Animation
        this.addAnimation("particle", [0]);
        this.setCurrentAnimation("particle");
        this.vel.y = 20;

    },
        
    update: function()
    {       
        // console.log(this.pos.y + '--' + me.sys.gravity)
        // Check if the Limits of Particles in Game Screen
        if ((this.pos.y > 0) && (this.pos.y < 1350) && (this.pos.x > 0))
        {
            // Set Particle Position
            this.vel.y += 1.3;
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;           
            
            this.parent(); 
            return true;
        }
        else {
    
            // Remove Particle
            me.game.remove(this, true);
        }
        return false;
    }
});