import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';


import * as create360Viewer from '360-image-viewer';
import * as dragDrop from 'drag-drop';

const decimalDigits = 3;

var mobile = false;         // if being run on a phone
var autoSpin = false;       // whether to rotate the view
var panUp = true;           // initial vertical scroll direction
var shift = false;          // if the shift key is pressed
var tilt = false;           // if mobile is in tilt mode

var portrait = 0;           // orientation of phone (0-vertical, 1-cw, 2-upside down, 3-ccw)
var initMouse = [0, 0]      // initial cursor position
var currMouse = [0, 0]      // current cursor position
var currAcc = [0, 0, 0]     // current acceleration
var initRot = [0, 0, 0]     // current rotation
var currRot = [0, 0, 0]     // current rotation
var rotSpeed = [0, 0, 0]    // movement in each axis (To be deleted)
var currPos = [0, 0]        // current position
var canvasSize = [0, 0]     // current canvas size
var scalingFactors;         // holds scaling factors
// var xFactor;
// var yFactor;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  constructor(public navCtrl: NavController, public platform: Platform) {
    mobile = this.platform.is('mobileweb');
  }
}

window.onload = () => {
  // Desktop setup
  if (!mobile) {
    document.getElementById("spin").style.display = "";
    mouseSetup();

    // To be deleted
    (<HTMLElement>document.getElementsByClassName("info2")[0]).style.display = "";
    scalingFactors = [0.000065, 0.000050];
  }
  // Mobile browser setup
  else {
    // Set up tilt controls if supported
    if ("ondeviceorientation" in window) {
      document.getElementById("tilt").style.display = "";
      rotSetup();
      accSetup();
    }
    
    // To be deleted
    document.getElementsByClassName("display")[0].addEventListener("click", () => {
      alert(initRot.join("\n"));
    });

    scalingFactors = [0.00003, 0.00003];
  }

  // Setup canvas and drop region
  const dropRegion = document.querySelector('#drop-region');
 
  // Get a canvas of some sort, e.g. fullscreen or embedded in a site
  const canvas = createCanvas({
    canvas: document.querySelector('#canvas'),
  });

  // Load your image
  const image = new Image();

  image.onload = () => {
    // Setup the 360 viewer
    const viewer = create360Viewer({ 
      image: image, 
      canvas: canvas,
      damping: 0.25,
      zoom: true,       // Need to change in ~/node_modules/360-image-viewer/index.js
      pinching: true,   // Need to change in ~/node_modules/360-image-viewer/index.js
      distanceBounds: [0, 1.05],
    });

    if (!mobile)
      setupDragDrop(canvas, viewer);
    
    // Start canvas render loop
    viewerSetup(viewer);
    viewer.start();
    
    viewer.on('tick', (dt) => {
      // To be deleted
      if (!mobile) {
        let theta = roundDecimal(viewer.controls.theta, decimalDigits);
        let phi = roundDecimal(viewer.controls.phi, decimalDigits);
        currPos = [theta, phi];
        document.getElementById("position").innerHTML = "<p>" + currPos.join("</p><p>") + "</p>";
      }

      if (shift && !mobile) {
        cursorScrolling();
      } else if (tilt && mobile && !viewer.controls.dragging) {
          tiltScrolling();
      } else if (autoSpin && !viewer.controls.dragging) {
          autoSpinning(dt);
      } 
    });

    // Handle automatic scrolling
    function autoSpinning(dt) {
      dt = dt < 20 ? dt : 16.8;   // Makes sure dt doesn't become too high
      viewer.controls.theta -= dt * 0.00005; // Horizontal movement
      // Determine when to switch vertical direction
      panUp = viewer.controls.phi >= 0.6 * Math.PI ? false : panUp;
      panUp = viewer.controls.phi <= 0.48 * Math.PI ? true : panUp;
      viewer.controls.phi += dt * 0.00005 * (panUp ? 1 : -1); // Vertical movement
    }

    // Handle cursor-guided scrolling
    function cursorScrolling() {
      let xdiff = initMouse[0] - currMouse[0];
      let ydiff = initMouse[1] - currMouse[1];
      viewer.controls.theta += Math.sign(xdiff) * Math.pow(xdiff, 2) * scalingFactors[0] / (canvasSize[0] / 2);
      viewer.controls.phi += Math.sign(ydiff) * Math.pow(ydiff, 2) * scalingFactors[1] / (canvasSize[1] / 2);
    }

    // Handle gyroscope-guided scrolling
    function tiltScrolling() {
      let xdiff = roundDecimal(smallestDiff(initRot[2], currRot[2], 90), decimalDigits); // z axis
      let ydiff = roundDecimal(smallestDiff(initRot[1], currRot[1], 90), decimalDigits); // y axis
      // swap if landscape orientation
      if (portrait % 2 != 0) {
        let temp = xdiff;
        xdiff = ydiff;
        ydiff = temp;
      } 

      // Negate values as necessary
      if (portrait != 0) {
        if (portrait > 1)
          ydiff = -ydiff;
        if (portrait < 3)
          xdiff = -xdiff;
      }

      // // Negate values as necessary
      // if (portrait == 3) {
      //   ydiff = -ydiff;
      // } else if (portrait == 2) {
      //   xdiff = -xdiff;
      //   ydiff = -ydiff;
      // } else if (portrait == 1) {
      //   xdiff = -xdiff;
      // }
      
      rotSpeed = [0, ydiff, xdiff];
      viewer.controls.theta += Math.sign(xdiff) * Math.pow(xdiff, 2) * scalingFactors[0] // (canvasSize[0] / 4);
      viewer.controls.phi += Math.sign(ydiff) * Math.pow(ydiff, 2) * scalingFactors[1] // (canvasSize[1] / 4);
      // To be deleted
      document.getElementById("position2").innerHTML = "<p>" + rotSpeed.join("</p><p>") + "</p>";
    }

    // returns the smallest angle difference between init and curr within the range [-deg, deg]
    function smallestDiff(init, curr, deg) {
      let deg2 = 2 * deg;
      let diff = (init % deg - curr % deg + deg2) % deg2;
      return diff > deg ? diff - deg2 : diff;
    }

    // Setup drag and drop for uploading new photos on desktop
    function setupDragDrop (canvas, viewer) {
      dragDrop(canvas, {
        onDragEnter: () => {
          (<HTMLDivElement>dropRegion).style.display = '';
        },
        onDragLeave: () => {
          (<HTMLDivElement>dropRegion).style.display = 'none';
        },
        onDrop: (files) => {
          var img = new Image();
          img.onload = () => {
            viewer.texture(img);
          };
          img.onerror = () => {
            alert('Could not load image!');
          };
          img.crossOrigin = 'Anonymous';
          img.src = URL.createObjectURL(files[0]);
        }
      });
    }
  };

  image.src = "../../assets/imgs/pano.jpg";
}

// Utility to create a device pixel scaled canvas
function createCanvas (opt = <any>{}) {
  // default to full screen (no width/height specified)
  const viewport = opt.viewport || [ 0, 0 ];

  const canvas = opt.canvas || document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = `${viewport[0]}px`;
  canvas.style.left = `${viewport[1]}px`;

  // Resize the canvas with the proper device pixel ratio
  const resizeCanvas = () => {
    // default to fullscreen if viewport width/height is unspecified
    const width = typeof viewport[2] === 'number' ? viewport[2] : window.innerWidth;
    const height = typeof viewport[3] === 'number' ? viewport[3] : window.innerHeight;
    const dpr = window.devicePixelRatio;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvasSize = [width, height];

    if (mobile)
      recalculateOrientation();
  };

  // Ensure the grab cursor appears even when the mouse is outside the window
  const setupGrabCursor = () => {
    canvas.addEventListener('mousedown', () => {
      document.documentElement.classList.remove('grabbing');
      document.documentElement.classList.add('grabbing');
    });
    window.addEventListener('mouseup', () => {
      document.documentElement.classList.remove('grabbing');
    });
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  if (!mobile)
    setupGrabCursor();
  return canvas;
}

function recalculateOrientation() {
  // If taller than wide, vertical (0-vertical, 1-cw, 2-upside down, 3-ccw)
  portrait = canvasSize[1] > canvasSize[0] ? (currAcc[1] >= 0 ? 0 : 2)
                                           : (currAcc[0] >= 0 ? 3 : 1);
  if (tilt)
    toggleTilt();
}

function viewerSetup(viewer) {
  // Personal Preference
  invertDrag();

  // Set up key handlers
  if (!mobile) { 
    document.body.onkeydown = checkKeyDown;
    document.body.onkeyup = checkKeyUp;
  }

  // Set up checkbox handlers
  document.getElementById("invert").onchange = invertDrag;
  document.getElementById("toggle").onchange = toggleSpin;

  // Set up button handlers
  mobile ? document.getElementById("tilt").onclick = toggleTilt
         : document.getElementById("spin").onclick = toggleSpinKeyDown;
  document.getElementById("left").onclick = moveLeft;
  document.getElementById("right").onclick = moveRight;

  // Calls helper methods based on which keys pressed
  function checkKeyDown(e) {
    e = e || window.event;
    switch (e.keyCode) {
      // shift
      case 16: shiftOn(); break;
      // space
      case 32: toggleSpinKeyDown(); break;
      // left arrow
      case 37: moveLeft(); break;
      // up arrow
      case 38: moveUp(); break;
      // right arrow
      case 39: moveRight(); break;
      // down arrow
      case 40: moveDown(); break;
    }
  }
  
  // Calls helper methods based on which keys released
  function checkKeyUp(e) {
    e = e || window.event;
    switch (e.keyCode) {
      // shift
      case 16: shiftOff(); break;
    }
  }

  ///////////////////////////////////////
  // Helper Functions
  ///////////////////////////////////////

  const PI2 = 2 * Math.PI;  // Stores the twice the value of pi (1 full rotation)

  // Makes a full rotation left in 12 steps
  function moveLeft() {
    viewer.controls.theta += PI2 / 12;
  }
  // Makes a full rotation right in 12 steps
  function moveRight() {
    viewer.controls.theta -= PI2 / 12;
  }
  // Makes a half rotation up in 15 steps
  function moveUp() {
    viewer.controls.phi += Math.PI / 15;
  }
  // Makes a half rotation down in 15 steps
  function moveDown() {
    viewer.controls.phi -= Math.PI / 15;
  }

  // Inverts the controls for dragging
  function invertDrag() {
    viewer.controls.rotateSpeed = -viewer.controls.rotateSpeed;
  }
}

// Activates shift controls
function shiftOn() {
  shift = true;
  initMouse = currMouse;
}

// Deactivates shift controls
function shiftOff() {
  shift = false;
}

// Toggles auto spin triggered by a keypress
function toggleSpinKeyDown() {
  (<HTMLInputElement>document.getElementById("toggle")).checked = 
          !(<HTMLInputElement>document.getElementById("toggle")).checked;
  toggleSpin();
}

// Toggles auto spin
function toggleSpin() {
  autoSpin = !autoSpin;
}

// Toggles the tilt controls, sets the HTML button text
function toggleTilt() {
  tilt = !tilt;
  tilt ? document.getElementById("tilt").innerHTML = "Stop"
       : document.getElementById("tilt").innerHTML = "Tilt"
  if (tilt)
    initRot = currRot;
}

// Read and cache mouse position
// Used for shift controls on desktop
function mouseSetup() {
  document.addEventListener("mousemove", (e) => {
    let x = e.clientX;
    let y = e.clientY;
    currMouse = [x, y];
  });
}

// Read and cache the rotation values
// Used for tilt controls on mobile
function rotSetup() {
  window.addEventListener("deviceorientation", (e) => {
    let alpha = roundDecimal(e.alpha, decimalDigits);
    let beta = roundDecimal(e.beta, decimalDigits);
    let gamma = roundDecimal(e.gamma, decimalDigits);
    currRot = [alpha, beta, gamma];
    // To be deleted
    document.getElementById("position").innerHTML = "<p>" + currRot.join("</p><p>") + "</p>";
  })
}

// Read and cache the acceleration values
// Used for detecting orientation on mobile
function accSetup() {
  window.addEventListener("devicemotion", (e) => {
    let xAcc = roundDecimal(e.accelerationIncludingGravity.x, decimalDigits);
    let yAcc = roundDecimal(e.accelerationIncludingGravity.y, decimalDigits);
    let zAcc = roundDecimal(e.accelerationIncludingGravity.z, decimalDigits);
    currAcc = [xAcc, yAcc, zAcc];
    // To be deleted
    // document.getElementById("position").innerHTML = "<p>" + [xAcc, yAcc, zAcc].join("</p><p>") + "</p>";
  })
}

// Rounds num to at most dig decimal places
function roundDecimal(num, dig) {
  return Math.trunc(num * Math.pow(10, dig)) / Math.pow(10, dig);
}
