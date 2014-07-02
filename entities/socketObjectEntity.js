me.socketObjectEntity = me.ObjectEntity.extend({
	/**
	 * Socket function<br>
	 * socketObjects is sent in an interval in socketClient.js
	 *
	 */

	interpolateSocketObject : function () {

		if (this.interpolatedFrame) {
			this.interpolatedFrame = false;
			this.socketObjects = tickedSocketObjects[4];
		}
		else {
			this.interpolatedFrame = true;
			this.socketObjectsLateFrame = tickedSocketObjects[3];
			this.socketObjectsEarlyFrame = tickedSocketObjects[4];
			this.socketObjects = this.socketObjectsEarlyFrame;

			i = this.checkGUIDOverride(this, this.socketObjectsLateFrame);
			z = this.checkGUIDOverride(this, this.socketObjectsEarlyFrame);

			if (i && z) {
				this.middleX = this.socketObjectsLateFrame[i].pos.x - this.socketObjectsEarlyFrame[z].pos.x;
				this.middleY = this.socketObjectsLateFrame[i].pos.y - this.socketObjectsEarlyFrame[z].pos.y;

				if (this.socketObjects[z] && this.socketObjects[z].pos) {
					this.socketObjects[z].pos.x = this.socketObjectsLateFrame[i].pos.x - this.middleX;
					this.socketObjects[z].pos.y = this.socketObjectsLateFrame[i].pos.y - this.middleY;
				}
			}
		}
	},

	updateSocketEntity : function() {
		if (clientid > 0) {
			this.interpolateSocketObject();
			this.updateSocketObjectSlave();
		}
		else if (clientid == 0 && this.settings.sendSocket) {
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
 				me.game.remove(this);
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
 			me.game.remove(this);
 		}
	},

	updateSocketObjectHost : function() {
		var i = this.checkGUID(this);
		if (!i) {
			me.game.remove(this);
		}
		if (this.dead == true) {
			socketObjects.splice(i,1);
			me.game.remove(this);
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
			 	socketObject.pos = {};
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
		 	if (clientid == 0) {
		 		socketObjects.push(socketObject);
		 	}
		 	// If client, obejct will be added immediately
		 	else {
		 		socketResponse('slaveaddobject',socketObject);
		 	}
 		}
	},

	socketRemoveObject: function() {
		if (clientid > 0) {
			this.dead = true;
			socketResponse('slaveupdateobjects',{dead:true, GUID:this.GUID});
		}
	}
});