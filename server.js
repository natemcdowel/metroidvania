
var express = require('express')
  , http = require('http')
  , app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/'));
server.listen(3000, '0.0.0.0');

var serverLoopMilliseconds = 50
  , clientid = ''
  , users = Array()
  , socketObjects = []
  , i = 0;


/**
 * Server utility functions
 *
 *
 */
var checkGUID = function(object, destroy) {
  for(var i = 0; i < socketObjects.length; i++) {
    if (socketObjects[i].GUID == object.GUID) {
      return i;
    }
  }
  return false;
};

// Update some socketObjects keys
var updateSocketObjectKeys = function(object, i) {
  for (key in object) {
    if (socketObjects[i]) {
      if (socketObjects[i][key] == true && key === 'dead'){
        return false;
      }
      else {
       socketObjects[i][key] = object[key];
      }
    }
  }
  return true;
};

io.sockets.on('connection', function (socket) {

  // Creating player array
  socket.emit('assignid',i);
  users[i] = Array();
  users[i][0] = '';
  users[i][1] = i;
  users[i][2] = 75;
  users[i][3] = 100;
  users[i][4] = 8;
  i++

  // Player data stored in server
  // socket.on('keypress', function (data) {
  //   // Storing users current map screen
  //   users[data[1]][0]=data[0];
  //   users[data[1]][1]=data[1];
  //   users[data[1]][2]=data[2];
  //   users[data[1]][3]=data[3];
  //   users[data[1]][5]=data[5];
  //   users[data[1]][6]=data[6];
  //   users[data[1]][7]=data[7];
  // });

  // Enemy Data stored in server from Host client
  socket.on('updateobjects', function (objects) {
    socketObjects = objects;
    socketObjects.timestamp = new Date();
  });

  // Updates an object sent from a slave client
  socket.on('slaveupdateobjects', function (object) {
    // Update socketObject Keys
    var i = checkGUID(object);
    if (i || i === 0) {
      updateSocketObjectKeys(object,i);
    }
    // Send updated object to host
    io.sockets.emit('updatehostobject', object);
  });

  // Adds an object sent from a slave client
  socket.on('slaveaddobject', function (object) {
    // if (object.player) {
    //   object.GUID = object.GUID+clientid;
    // }
    io.sockets.emit('addhostobject', object);
  });

  // Checks for players on current map screen
  socket.on('checkmapserver', function (clientid) {
    socket.emit('checkmapclient', users);
  });

  // Changes map in server for selectec clientid
  socket.on('changemapserver', function (socketArray) {
    // Setting map into appropriate player
    users[socketArray[0]][4] = socketArray[1];
  });

  // Listens for clients leaving game
  socket.on('leave', function (userName) {
    var l = users.length;
    for (var i = 0; i < l; i++) {
      if (users[i][3] == userName) {
        clientid = i;
      }
    }
    users.splice(clientid, 1);
    io.sockets.emit('getplayers', users);
    io.sockets.emit('removeplayer', clientid);
    io.sockets.emit('playermove', '45', clientid); // To update without keypress on client
  });

  // Updates player positions to client every so often
  // MAIN LOOP
  setInterval(function(){
    // io.sockets.emit('updateclientpos',users);
    io.sockets.emit('updateobjects',socketObjects);
  }, serverLoopMilliseconds);
});
