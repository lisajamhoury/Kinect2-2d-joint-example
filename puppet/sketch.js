//Components.utils.import("resource://gre/modules/Geometry.jsm");

var savedDrawingStrokes = new Array();

// We'll use a global variable to hold on to our id from PeerJS
var peer_id = null;
var peer = null;
var my_stream = null;

var modelWidth = 10;
var modelHeight = 13;
var kinectJoints = [];

var canvas = null;
var context = null;

var mousedown = false;

var x = -1;
var y = -1;

var px = -1;
var py = -1;

let liveData = false;

// recorded data variables
let sentTime = Date.now();
let currentFrame = 0;
//let recorded_skeleton;
let recorded_data_file = "./recorded_skeleton.json";

var color =
  "rgb(" +
  Math.floor(Math.random() * 128 + 127) +
  "," +
  Math.floor(Math.random() * 128 + 127) +
  "," +
  Math.floor(Math.random() * 128 + 127) +
  ")";

function init() {
  initCanvas();
  //initSocket();
  //initPeerJS();
  //initKinectron();
  initThreeJS();
  //initRecognizer();
}

window.addEventListener("load", init);

function initKinectron() {
  //var kinectronIpAddress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron();

  // Connect to the microstudio
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Connect remote to application
  kinectron.makeConnection();
  //kinectron.startMultiFrame(["color", "depth"], changeCanvas);

  kinectron.startTrackedBodies(gotBodies);
}

function gotBodies(data) {
  //console.log(data);
  //debugger;
  // var cw = canvas.width;
  // var ch = canvas.height;

  var cw = modelWidth;
  var ch = modelHeight;
  // debugger;

  if (canvas !== null) {
    joints[0].position.set(
      data.joints[3].cameraX * cw,
      data.joints[2].cameraY * ch,
      0
    );
    joints[1].position.set(
      data.joints[0].cameraX * cw,
      data.joints[1].cameraY * ch,
      0
    );
    joints[2].position.set(
      data.joints[23].cameraX * cw,
      data.joints[23].cameraY * ch,
      0
    );
    joints[3].position.set(
      data.joints[9].cameraX * cw,
      data.joints[9].cameraY * ch,
      0
    );
    joints[4].position.set(
      data.joints[21].cameraX * cw,
      data.joints[21].cameraY * ch,
      0
    );
    joints[5].position.set(
      data.joints[5].cameraX * cw,
      data.joints[5].cameraY * ch,
      0
    );
    joints[6].position.set(
      data.joints[19].cameraX * cw,
      data.joints[19].cameraY * ch,
      0
    );
    joints[7].position.set(
      data.joints[17].cameraX * cw,
      data.joints[17].cameraY * ch,
      0
    );
    joints[8].position.set(
      data.joints[15].cameraX * cw,
      data.joints[15].cameraY * ch,
      0
    );
    joints[9].position.set(
      data.joints[13].cameraX * cw,
      data.joints[13].cameraY * ch,
      0
    );
  }

  // }

  //function initSocket() {

  // socket = io.connect('/');

  // socket.on('connect', function() {
  // 	console.log("Socket Connected");
  // 	if (peer_id != null) {
  // 		socket.emit('peer_id', peer_id);
  // 	}
  // });

  // socket.on('kinect', function (data) {
  // 	if (canvas != null) {

  // 		kinectJoints[data.position] = {x: (data.x)*modelWidth,
  // 							y: (data.y)*modelHeight};

  // 		// Map jointsCat array to kinectJoints array, positions are different
  // 		if (data.position == 3) {
  // 			joints[0].position.set(kinectJoints[data.position].x, kinectJoints[data.position].y, 0);
  // 		} else if (data.position == 0) {
  // 			joints[1].position.set(kinectJoints[data.position].x, kinectJoints[data.position].y, 0);
  // 		} else if (data.position == 23) {
  // 			joints[2].position.set(kinectJoints[data.position].x, kinectJoints[data.position].y, 0);
  // 		} else if (data.position == 9) {
  // 			joints[3].position.set(kinectJoints[data.position].x, kinectJoints[data.position].y, 0);
  // 		}  else if (data.position == 21) {
  // 			joints[4].position.set(kinectJoints[data.position].x, kinectJoints[data.position].y, 0);
  // 		} else if (data.position == 5) {
  // 			joints[5].position.set(kinectJoints[data.position].x, kinectJoints[data.position].y, 0);
  // 		} else if (data.position == 19) {
  // 			joints[6].position.set(kinectJoints[data.position].x, kinectJoints[data.position].y, 0);
  // 		} else if (data.position == 17) {
  // 			joints[7].position.set(kinectJoints[data.position].x, kinectJoints[data.position].y, 0);
  // 		} else if (data.position == 15) {
  // 			joints[8].position.set(kinectJoints[data.position].x, kinectJoints[data.position].y, 0);
  // 		} else if (data.position == 13) {
  // 			joints[9].position.set(kinectJoints[data.position].x, kinectJoints[data.position].y, 0);
  // 		}
  // 	}
  // });

  // Receive mouse
  // socket.on('mouse', function (data) {
  // 	//console.log(data);
  // 	if (data.mousedown) {
  // 		//console.log("drawing from other user");
  // 		draw(data.startX, data.startY, data.endX, data.endY, data.color);
  // 	} else {
  // 		// ACTOR
  // 		//drawPointer(data.startX, data.startY);
  // 	}
  // });

  // socket.on('clear', function (data) {
  // 	clearCanvas();
  // });

  // socket.on('actor_peer_id', function(data) {
  // 	// Can't place a call with a null media stream, shoot our peer_id back out so that the actor calls us
  // 	if (peer != null && peer_id != null) {
  // 		socket.emit('peer_id', peer_id);

  // 		console.log("actor_peer_id placing call");
  // 		var outgoing_call = peer.call(data);
  // 		outgoing_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
  // 			// And attach it to a video object
  // 			var audioElement = document.getElementById('remoteaudio');
  // 			audioElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
  // 			audioElement.play();
  // 		});

  // 	}
  // });

  // socket.on('backgroundimage', function(data) {
  // 	loadBackgroundImage(data);
  // });
}

// function sendmouse(startX, startY, endX, endY, color, mousedown) {
// 		socket.emit('mouse',{ startX: startX, startY: startY, endX: endX, endY: endY, color: color, mousedown: mousedown });
// }

function initCanvas() {
  canvas = document.getElementById("drawingcanvas");
  context = canvas.getContext("2d");

  //context.fillStyle="rgba(255, 0, 0, 0.5)";
  //context.fillRect(0,0,canvas.width,canvas.height);

  canvas.addEventListener("touchstart", function(evt) {
    // Get the canvas bounding rect
    var canvasRect = canvas.getBoundingClientRect();

    // Now calculate the mouse position values
    py = evt.touches[0].clientY - canvasRect.top;
    px = evt.touches[0].clientX - canvasRect.left;

    points = new Array();
    points.push(new Point(px, py));

    mousedown = true;
  });

  canvas.addEventListener("mousedown", function(evt) {
    // Get the canvas bounding rect
    var canvasRect = canvas.getBoundingClientRect();

    // Now calculate the mouse position values
    py = evt.clientY - canvasRect.top; // minus the starting point of the canvas rect
    px = evt.clientX - canvasRect.left; // minus the starting point of the canvas rect on the x axis

    points = [];
    var point = { x: px, y: py };
    points.push(point);
    //points.push(new Point(px, py));

    mousedown = true;
  });

  window.addEventListener("touchend", function(evt) {
    if (mousedown) {
      strokes.push(points);
    }
    mousedown = false;
  });

  window.addEventListener("touchcancel", function(evt) {
    mousedown = false;
  });

  window.addEventListener("touchleave", function(evt) {
    if (mousedown) {
      strokes.push(points);
    }
    mousedown = false;
  });

  // Do this on window in case they drag outside of canvas
  window.addEventListener("mouseup", function(evt) {
    if (mousedown) {
      strokes.push(points);
    }
    mousedown = false;
  });

  canvas.addEventListener("touchmove", function(evt) {
    //evt.clientX is x but in the entire window, not the canvas
    //evt.clientY is y

    // Get the canvas bounding rect
    var canvasRect = canvas.getBoundingClientRect();

    // Now calculate the mouse position values
    y = evt.touches[0].clientY - canvasRect.top;
    x = evt.touches[0].clientX - canvasRect.left;

    //console.log("mousemove " + evt.clientX + " " + evt.clientY);

    if (mousedown) {
      //console.log("mousemove x:" + x + " y:" + y);

      draw(px, py, x, y, color);
      sendmouse(px, py, x, y, color, mousedown);
      px = x;
      py = y;

      points.push(new Point(px, py));
    } else {
      // Send the mouse position
      sendmouse(x, y, x, y, color, mousedown);
    }

    //joints[0].position.set((x-(canvas.width/2))/canvas.width*modelWidth, y/canvas.height*modelHeight, 0);
  });

  canvas.addEventListener(
    "mousemove",
    function(evt) {
      //evt.clientX is x but in the entire window, not the canvas
      //evt.clientY is y

      // Get the canvas bounding rect
      var canvasRect = canvas.getBoundingClientRect();

      // Now calculate the mouse position values
      y = evt.clientY - canvasRect.top; // minus the starting point of the canvas rect
      x = evt.clientX - canvasRect.left; // minus the starting point of the canvas rect on the x axis

      //console.log("mousemove " + evt.clientX + " " + evt.clientY);

      if (mousedown) {
        //console.log("mousemove x:" + x + " y:" + y);

        draw(px, py, x, y, color);
        //sendmouse(px, py, x, y, color, mousedown);
        px = x;
        py = y;

        points.push(new Point(px, py));
      } else {
        // Send the mouse position
        //sendmouse(x, y, x, y, color, mousedown);
      }

      //joints[0].position.set((x-(canvas.width/2))/canvas.width*modelWidth, y/canvas.height*modelHeight, 0);
    },
    false
  );
}

function draw(startX, startY, endX, endY, drawcolor) {
  //console.log("Drawing: " + startX + " " + startY + " " + endX + " " + endY);
  context.beginPath();
  context.strokeStyle = drawcolor;
  context.moveTo(startX, startY);
  context.lineWidth = 5;
  context.lineTo(endX, endY);
  context.stroke();
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  //context.fillStyle="rgba(255, 0, 0, 0.5)";
  //context.fillRect(0,0,canvas.width,canvas.height);
}

function clearDrawing() {
  clearCanvas();
  clearSaved();

  //socket.emit('clear', {});
}

function saveDrawing() {
  savedDrawingStrokes = strokes.slice();
  //console.log(savedDrawingStrokes);

  //socket.emit('saveddrawing', savedDrawingStrokes);
}

function drawSaved() {
  // This should append?
  strokes = savedDrawingStrokes.slice();

  for (var s = 0; s < strokes.length; s++) {
    for (var p = 1; p < strokes[s].length; p++) {
      draw(
        strokes[s][p - 1].X,
        strokes[s][p - 1].Y,
        strokes[s][p].X,
        strokes[s][p].Y,
        color
      );
    }
  }
}

function clearSaved() {
  savedDrawingStrokes = new Array();
}

function loadBackgroundImage(imageUrl) {
  var backDiv = document.getElementById("background");
  while (backDiv.firstChild) {
    backDiv.removeChild(backDiv.firstChild);
  }

  var image = document.createElement("img");
  image.setAttribute("src", imageUrl);
  backDiv.appendChild(image);
}

// function initPeerJS() {

// 	// Register for an API Key:	http://peerjs.com/peerserver
// 	//peer = new Peer({key: 'uohu08l7r6swcdi'});
// 	var peer = new Peer({host: '104.131.82.13', port: 9000, path: '/'});

// 	// Get an ID from the PeerJS server
// 	peer.on('open', function(id) {
// 	  console.log('My peer ID is: ' + id);
// 	  peer_id = id;
// 	  if (socket != null) {
// 		socket.emit('peer_id', peer_id);
// 	  }
// 	});

// 	peer.on('call', function(incoming_call) {
// 		console.log("Got a call!");
// 		incoming_call.answer(null); // Answer the call with our stream from getUserMedia
// 		incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
// 			var audioElement = document.getElementById('remoteaudio');
// 			audioElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
// 			audioElement.play();

// 		});
// 	});
// }
