me.socketObjectEntity = me.ObjectEntity.extend({
	/**
	 * Socket function<br>
	 * socketObjects is sent in an interval in socketClient.js
	 *
	 */

	interpolateSocketObject : function () {

		// Even Frame
		if (this.interpolatedFrame) {
			this.interpolatedFrame = false;
			this.socketObjects = tickedSocketObjects[4];
		}
		// Odd Frame
		else {
			this.interpolatedFrame = true;
			this.socketObjectsLateFrame = tickedSocketObjects[3];
			this.socketObjectsEarlyFrame = tickedSocketObjects[4];
			this.socketObjects = this.socketObjectsLateFrame;

			i = this.checkGUIDOverride(this, this.socketObjectsLateFrame);
			z = this.checkGUIDOverride(this, this.socketObjectsEarlyFrame);

			if (i && z) {
				this.middle = {};
				this.middle.x = this.socketObjectsLateFrame[i].pos.x - this.socketObjectsEarlyFrame[z].pos.x;
				this.middle.y = this.socketObjectsLateFrame[i].pos.y - this.socketObjectsEarlyFrame[z].pos.y;

				if (this.socketObjects[z] && this.socketObjects[z].pos) {
					 this.socketObjects[z].pos.x = this.socketObjectsLateFrame[i].pos.x - this.middle.x;
					 this.socketObjects[z].pos.y = this.socketObjectsLateFrame[i].pos.y - this.middle.y;
				}
			}
		}
	},

	updateSocketEntity : function() {
		if (clientid != host) {
			this.interpolateSocketObject();
			this.updateSocketObjectSlave();
		}
		else if (clientid == host && this.settings.sendSocket) {
			this.updateSocketObjectHost();
		}
	},

	updateSocketObjectSlave : function () {
		var foundGUID = false
			,	i = this.checkGUID(this);

		//  If the object has already been created from host
 		if (i && this.socketObjects[i]) {
 			if (this.socketObjects[i].dead) {
				this.socketObjects.splice(i,1);
 				this.remove();
 				return;
 			}
 			if (this.pos) {
	 			this.pos.x = this.socketObjects[i].pos.x;
	 			this.pos.y = this.socketObjects[i].pos.y;
	 			this.vel = this.socketObjects[i].vel;
	 			// this.renderable.setCurrentAnimation(socketObjects[i].currentAnim);
	 			foundGUID = true;
	 			return;
 			}
 		}
 		else if (!i) {
 			this.remove();
 		}
	},

	updateSocketObjectHost : function() {
		var i = this.checkGUID(this);
		if (!i) {
			this.remove();
		}
		if (this.dead == true) {
			socketObjects.splice(i,1);
			this.remove();
		}
		this.socketPrepSend();
	},

	/**
	 * Socket function - Updates this object information to socketObjects <br>
	 * socketObjects is sent in an interval in index.html
	 *
	 */
	socketPrepSend: function() {
		// Find matching GUID from socketObjects
	 	var i = this.checkGUID(this);

	 	if (i) {
	 		if (this.dead) {
	 			socketObjects[i].dead = this.dead;
	 		}
		 	if (this.pos && this.pos) {
		 		socketObjects[i].pos = this.pos;
		 	}
		 	if (this.vel) {
		 		socketObjects[i].vel = this.vel;
		 	}
		 	// if (this.settings) {
		 	// 	socketObjects[i].settings = this.settings;
		 	// }
		 	// if (this.renderable && this.renderable.current && this.renderable.current.name) {
		 	// 	socketObjects[i].currentAnim = this.renderable.current.name;
		 	// }
	 	}
	},

	/**
	 * Socket function - Initializes this object information to socketObjects <br>
	 * Only used for host (clientid == 0)
	 *
	 */
	socketInit: function() {
		this.interpolatedFrame = false;
	 	var socketObject = {};
			 	socketObject.GUID = this.GUID;

	 	// If this GUID is not in socketObjects yet (From any other clients)
	 	if (!this.checkGUID(socketObject) && !this.dead) {
	 		if (this.pos && this.pos) {
		 		socketObject.pos = this.pos;
		 	}
		 	if (this.vel) {
		 		socketObject.vel = this.vel;
		 	}
		 	if (this.settings) {
		 		socketObject.settings = this.settings;
		 	}
		 	if (this.renderable.current.name) {
		 		socketObject.currentAnim = this.renderable.current.name;
		 	}

		 	// If host, object will be passed by Interval Loop
		 	if (clientid == host) {
		 		socketObjects.push(socketObject);
		 	}
		 	// If client, obejct will be added immediately
		 	else {
		 		socketResponse('slaveaddobject',socketObject);
		 	}
 		}
	},

	socketRemoveObject: function() {
		if (clientid != host) {
			this.dead = true;
			socketResponse('slaveupdateobjects',{dead:true, GUID:this.GUID});
		}
	},

	destroy : function() {
		// free some property objects
		if (this.renderable) {
			this.renderable.destroy.apply(this.renderable, arguments);
			this.renderable = null;
		}
		this.onDestroyEvent.apply(this, arguments);
		this.pos = null;
		this.collisionBox = null;
		if (clientid == host && this.settings.sendSocket) {
			var i = this.checkGUID(this, true);
			if (socketObjects[i]) {
				socketObjects[i].dead = true;
			}
		}
	},

	checkGUID: function(thisEntity) {
 		for(var i = 0; i < socketObjects.length; i++) {
	 		if (socketObjects[i].GUID == thisEntity.GUID) {
	 			return i;
	 		}
	 	}
	 	return false;
	},

	checkGUIDOverride: function(thisEntity, overriddenSocketObjects) {
		for(var i = 0; i < overriddenSocketObjects.length; i++) {
	 		if (overriddenSocketObjects[i].GUID == thisEntity.GUID) {
	 			return i;
	 		}
	 	}
	},

	remove : function() {
		me.game.remove(this);
	}
})