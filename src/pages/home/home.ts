import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';


import * as create360Viewer from '360-image-viewer';
import * as dragDrop from 'drag-drop';

const decimalDigits = 3;

var mobile = false;

var autoSpin = false;       // whether to rotate the view
var panUp = true;           // initial vertical scroll direction
var shift = false;          // if the shift key is pressed
var tilt = false;           // if mobile is in tilt mode
var initMouse = [0, 0]      // initial cursor position
var currMouse = [0, 0]      // current cursor position
// var currAcc = [0, 0, 0, 0]  // current acceleration
var initRot = [0, 0, 0]     // current rotation
var currRot = [0, 60, 0]     // current rotation
var currPos = [0, 0]        // current position
var canvasSize = [0, 0]     // current canvas size

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  constructor(public navCtrl: NavController, public platform: Platform) {
    mobile = this.platform.is('mobileweb') ? true : false;
    // if (mobile)
    //   rotationSetup();
  }
}

window.onload = () => {
  alert(mobile ? "mobile!" : "computer!");
  if (!mobile) {
    document.getElementById("tilt").style.display = "none";
    (<HTMLElement>document.getElementsByClassName("info2")[0]).style.display = "";
  }
  else {
    document.getElementById("spin").style.display = "none";
    document.getElementsByClassName("display")[0].addEventListener("click", () => {
      alert(initRot.join("\n"));
    });
  }

  // if (mobile) {
    
  // }
  
  const dropRegion = document.querySelector('#drop-region');
 
  // Get a canvas of some sort, e.g. fullscreen or embedded in a site
  const canvas = createCanvas({
    canvas: document.querySelector('#canvas'),
    // without this, the canvas defaults to full-screen
    // viewport: [ 20, 20, 500, 256 ]
  });

  // Load your image
  const image = new Image();

  image.onload = () => {
    // Setup the 360 viewer
    const viewer = create360Viewer({ 
      image: image, 
      canvas: canvas,
      damping: 0.2,
      zoom: true,       // Need to change in index.js
      pinching: true,   // Need to change in index.js
      distanceBounds: [0, 1.05],
    });

    setupDragDrop(canvas, viewer);
    
    // Start canvas render loop
    viewer.start();

    viewerSetup(viewer);

    let xFactor = 0.000065;
    let yFactor = 0.000050;

    viewer.on('tick', (dt) => {
      // To be deleted
      if (!mobile) {
        let theta =  Math.trunc(viewer.controls.theta * Math.pow(10, decimalDigits)) / Math.pow(10, decimalDigits);
        let phi = Math.trunc(viewer.controls.phi * Math.pow(10, decimalDigits)) / Math.pow(10, decimalDigits);
        currPos = [theta, phi];
        document.getElementById("position").innerHTML = "<p>" + currPos.join("</p><p>") + "</p>";
      };

      if (shift && !mobile) {
        cursorScrolling();
      } else if (tilt && mobile) {
          tiltScrolling();
      } else if (autoSpin && !viewer.controls.dragging) {
          autoSpinning(dt);
      } 
    });

    // Handle gyroscope-guided scrolling
    function tiltScrolling() {
      let xdiff = initRot[2] - currRot[2]; // z axis
      let ydiff = initRot[1] - currRot[1]; // y axis
      viewer.controls.theta += Math.sign(xdiff) * Math.pow(xdiff, 2) * xFactor / (canvasSize[0] / 2);
      viewer.controls.phi += Math.sign(ydiff) * Math.pow(ydiff, 2) * yFactor / (canvasSize[1] / 2);
    }

    // Handle cursor-guided scrolling
    function cursorScrolling() {
      let xdiff = initMouse[0] - currMouse[0];
      let ydiff = initMouse[1] - currMouse[1];
      viewer.controls.theta += Math.sign(xdiff) * Math.pow(xdiff, 2) * xFactor / (canvasSize[0] / 2);
      viewer.controls.phi += Math.sign(ydiff) * Math.pow(ydiff, 2) * yFactor / (canvasSize[1] / 2);
    }

    // Handle automatic scrolling
    function autoSpinning(dt) {
      dt = dt < 20 ? dt : 16.8;   // Makes sure dt doesn't become too high
      viewer.controls.theta -= dt * 0.00005; // Sideways movement
      // Determine when to switch vertical direction
      panUp = viewer.controls.phi >= 0.6 * Math.PI ? false : panUp;
      panUp = viewer.controls.phi <= 0.48 * Math.PI ? true : panUp;
      viewer.controls.phi += dt * 0.00005 * (panUp ? 1 : -1); // Vertical movement
    }

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
  setupGrabCursor();
  return canvas;
}

function viewerSetup(viewer) {
  // Personal Preference
  invertDrag();

  // Set up key handlers
  if (!mobile) { 
    document.body.onkeydown = checkKeyDown;
    document.body.onkeyup = checkKeyUp;
    document.addEventListener("mousemove", mouseHandler);
  }

  // Set up checkbox handlers
  document.getElementById("invert").addEventListener("change", invertDrag);
  document.getElementById("toggle").addEventListener("change", toggleSpin);

  // Set up button handlers
  if (!mobile)
    document.getElementById("spin").addEventListener("click", toggleSpinKeyDown);
    else
    document.getElementById("tilt").addEventListener("click", toggleTilt);

  document.getElementById("left").addEventListener("click", moveLeft);
  document.getElementById("right").addEventListener("click", moveRight);

  // Calls helper methods based on which keys pressed
  function checkKeyDown(e) {
    e = e || window.event;
    switch (e.keyCode) {
      // shift
      case 16: shiftDown(); break;
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
      case 16: shiftUp(); break;
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
  // Toggles auto spin on key down
  function toggleSpinKeyDown() {
    (<HTMLInputElement>document.getElementById("toggle")).checked = 
            !(<HTMLInputElement>document.getElementById("toggle")).checked;
    toggleSpin();
  }
  // Toggles auto spin
  function toggleSpin() {
    autoSpin = !autoSpin;
  }
  // Triggers when shift is held down
  function shiftDown() {
    shift = true;
    initMouse = currMouse;
  }
  // Triggers when shift is released
  function shiftUp() {
    shift = false;
  }
  // Constantly caching the mouse's position
  function mouseHandler(event) {
    let x = event.clientX;
    let y = event.clientY;
    currMouse = [x, y];
  }
  // Inverts the controls for dragging
  function invertDrag() {
    viewer.controls.rotateSpeed = -viewer.controls.rotateSpeed;
  }
}

function toggleTilt() {
  tilt = !tilt;
  window.removeEventListener("deviceorientation", rotationSetup);
  tilt ? window.addEventListener("deviceorientation", rotationSetup) 
       : window.removeEventListener("deviceorientation", rotationSetup);
  if (tilt)
    initRot = currRot;
}

function rotationSetup(e) {
  let alpha = Math.trunc(e.alpha * Math.pow(10, decimalDigits)) / Math.pow(10, decimalDigits);
  let beta = Math.trunc(e.beta * Math.pow(10, decimalDigits)) / Math.pow(10, decimalDigits);
  let gamma = Math.trunc(e.gamma * Math.pow(10, decimalDigits)) / Math.pow(10, decimalDigits);
  currRot = [alpha, beta, gamma];
  document.getElementById("position").innerHTML = "<p>" + currRot.join("</p><p>") + "</p>";
}

// function accSetup() {
//   window.addEventListener("devicemotion", (e) => {
//     let xAcc = Math.trunc(e.acceleration.x * Math.pow(10, decimalDigits)) / Math.pow(10, decimalDigits);
//     let yAcc = Math.trunc(e.acceleration.y * Math.pow(10, decimalDigits)) / Math.pow(10, decimalDigits);
//     let zAcc = Math.trunc(e.acceleration.z * Math.pow(10, decimalDigits)) / Math.pow(10, decimalDigits);
//     currAcc = [xAcc, yAcc, zAcc];
//     document.getElementById("position").innerHTML = "<p>" + [xAcc, yAcc, zAcc].join("</p><p>") + "</p>";
//   })
// }
