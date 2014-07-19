/**
 * Socket client main loop
 *
 *
 */

var socketHost = location.href
		, socket = io.connect(socketHost)
		, clientLoopMilliseconds = 50
		, socketObjects = []
		, tickedSocketObjects = []
		, numberOfSavedTicks = 6
		, enemyZ = 100
		, hostObject = {}
		, host = 0;

/**
 * Socket listeners (These relay messages back to server.js)
 *
 *
 */

socket.on('assignid', function (id) {
	clientid = id;
});

// socket.on('removeplayer', function (clientid) {
// 	playerX.splice(clientid, 1);
// 	playerY.splice(clientid, 1);
// });

// Updates ALL socketObjects with each server loop iteration
socket.on('updateobjects', function (objects) {
	if (objects.length > 0 && clientid != host) {
		socketObjects = objects;

		// Push to a timestamped array of socketObject snapshots
		if (tickedSocketObjects.length <= numberOfSavedTicks) {
			tickedSocketObjects.push(socketObjects);
		}
		else {
			tickedSocketObjects.push(socketObjects);
			tickedSocketObjects.splice(0,1);
		}

	}
});

// Updates Host object directly
socket.on('updatehostobject', function (serverObject) {
	if (clientid == host) {
		// !!! Game Engine Logic !!! //
		// console.log(serverObject);
		if (serverObject.clientid != clientid  || !serverObject.clientid && serverObject.clientid !== 0) {
			console.log(serverObject);
			var hostObject = me.game.editEntityByGUID(serverObject.GUID, serverObject);
		}
	}
});

socket.on('addhostobject', function(serverObject) {
	console.log(serverObject);
	if (clientid == host) {
		// Is the object already in the game?
		var foundHostObj = false;
		if (me.game.getEntityByGUID(serverObject.GUID) !== null) {
			foundHostObj = true;
		}

		// If the object has not been added to non-host client
		if (foundHostObj == false && serverObject.settings.entityName) {
			if (serverObject.clientid && serverObject.clientid != clientid) {
				console.log(serverObject);
				addObjectToClient(serverObject);
			}
		}
	}
});


/**
 * Helper functions
 *
 *
 */
 // Passing input from browser to socket.io server
var socketResponse = function(type, data) {
	var socket = io.connect(socketHost);
 	socket.emit(type, data);
};

// Updates some socketObjects keys
var updateSocketObjectKeys = function(object, i) {
  for (key in object) {
    if (socketObjects[i][key]) {
      socketObjects[i][key] = object[key];
    }
  }
  return true;
};

// Updates some Entity keys
var updateHostEntityKeys = function(serverObject) {
	for (key in serverObject) {
    if (hostObject) {
      hostObject[key] = serverObject[key];
    }
  }
  return true;
};

var addObjectToClient = function(serverObject) {
	var hostedEntity = new window[serverObject.settings.entityName](
			serverObject.pos.x,
			serverObject.pos.y,
			{
				image: serverObject.settings.image,
				spritewidth: serverObject.settings.spritewidth,
				spriteheight: serverObject.settings.spriteheight,
				GUID: serverObject.GUID
			}
	);
 	me.game.add(hostedEntity, enemyZ++);
	me.game.sort();
}

/**
 * Main client loop for updating engine objects from array of 'socketObjects'
 *
 *
 */
var initClientLoop = function(){
	// setInterval(function(){
	// 	console.log(socketObjects);
	// },2500);

	setInterval(function(){
		var foundGameObj = [];
		// If Host, update all socketObjects to server
		if (socketObjects.length > 0 && clientid == host) {
			socketResponse('updateobjects', socketObjects);

			// Check if we should remove from host
			for(var i = 0; i < socketObjects.length; i++) {
				// Checking if we should remove object
				if (socketObjects[i].dead == true) {
					socketObjects.splice(i,1);
				}
			}
		}

		// If Slave, read objects from Servexr and add to game if not added yet
		if (socketObjects && clientid != host && me.state.ready) {
			for(var i = 0; i < socketObjects.length; i++) {

				foundGameObj[i] = false;
				// !!! Game Engine Logic !!! //
				if (me.game.getEntityByGUID(socketObjects[i].GUID) !== null) {
					foundGameObj[i] = true;
				}

				// If the object has not been added to non-host client
				if (foundGameObj[i] == false && socketObjects[i].settings.entityName && !socketObjects[i].dead) {
					// !!! Game Engine Logic !!! //
					var hostedEntity = new window[socketObjects[i].settings.entityName]( socketObjects[i].pos.x, socketObjects[i].pos.y, { image: socketObjects[i].settings.image, spritewidth: socketObjects[i].settings.spritewidth, spriteheight: socketObjects[i].settings.spriteheight, GUID: socketObjects[i].GUID});
		 			me.game.add(hostedEntity, enemyZ++);
					me.game.sort();
				}
			}
	  }
  },
  clientLoopMilliseconds); // Set milliseconds to update from socketObjects
};

/**
 * Kick things off
 *
 *
 */
initClientLoop();