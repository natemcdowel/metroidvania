GAME OBJECTS
--------------

INIT of object

- settings.sendSocket = true;
- settings.entityName = 'SkullEnemyEntity';
- if (clientid == host) {
   this.socketInit();
  }

REMOVE of object
- this.socketRemoveObject();

UPDATE loop of object
- if (clientid == host) {
		// Host controls logic for behavior of object
  }
  else {
    // Slave simply reads position from socketObjects
  }

- this.updateSocketEntity();



PLAYER OBJECTS
---------------