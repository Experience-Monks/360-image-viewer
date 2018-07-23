import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import * as create360Viewer from '360-image-viewer';
import * as getMaxTextureSize from './getMaxTextureSize';
import * as dragDrop from 'drag-drop';
import * as noSleep from 'nosleep.js';

const decimalDigits = 3;    // number of decimal places to round values
const imagePath = "../../assets/imgs/"
const defaultPicture = "pano_7000.jpg"
const awake = new noSleep();
const maxTextureSize = getMaxTextureSize();

let mobile = false;         // if being run on a mobile device
let tablet = false;         // if being run on a tablet
let autoSpin = false;       // whether to rotate the view
let panUp = true;           // initial vertical spin direction
let shift = false;          // if the shift key is held
let tilt = false;           // if mobile is in tilt mode
let scalingFactors;         // holds scaling factors

let initMouse = [0, 0]      // initial cursor position
let currMouse = [0, 0]      // current cursor position

let portrait = 0;           // orientation of phone (0-vertical, 1-cw, 2-upside down, 3-ccw)
let canvasSize = [0, 0]     // current canvas size
let currAcc = [0, 0, 0]     // current acceleration
let initRot = [0, 0, 0]     // current rotation
let currRot = [0, 0, 0]     // current rotation

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  constructor(public navCtrl: NavController, public platform: Platform) {
    mobile = this.platform.is('mobileweb');
    if (mobile) tablet = this.platform.is('tablet');
    scalingFactors = mobile ? [0.00003, 0.00003]
                            : [0.000065, 0.000050]
  }
}
window.onload = () => {
  // Desktop setup
  if (!mobile) {
    Array.from(document.querySelectorAll(".desktop.icon")).forEach(element => {
      (<HTMLElement>element).style.display = "";
    });
    (<HTMLElement>document.querySelector(".right.info")).style.display = "";
    mouseSetup();
  }
  // Mobile browser setup
  else {
    // Set up tilt controls if supported
    if ("ondeviceorientation" in window) {
      Array.from(document.querySelectorAll(".mobile.icon")).forEach(element => {
        (<HTMLElement>element).style.display = "";
      });
      rotSetup();
      accSetup();
    }
  }
  
  // Get a canvas of some sort, e.g. fullscreen or embedded in a site
  const canvas = createCanvas({
    canvas: document.querySelector('#canvas'),
  });

  // Create and set up image
  const image = new Image();
  image.src = imagePath + defaultPicture;
  
  image.onload = () => {
    // Resize default image if necessary
    if (resizeImg(image))
      return
    
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
      if (shift && !mobile) {
        cursorScrolling();
      } else if (tilt && mobile && !viewer.controls.dragging) {
        tiltScrolling();
      } else if (autoSpin && !viewer.controls.dragging) {
        autoSpinning(dt);
      }
    });

    // General setup
    (<HTMLElement>document.querySelector("#upload")).onchange = uploadPhoto;

    // Handle automatic scrolling
    function autoSpinning(dt) {
      dt = dt < 20 ? dt : 16.8;   // Makes sure dt doesn't become too high
      viewer.controls.theta -= dt * 0.00005; // Horizontal movement
      // Determine when to switch vertical direction
      panUp = viewer.controls.phi >= 0.6 * Math.PI ? false : 
             (viewer.controls.phi <= 0.48 * Math.PI ? true : panUp)
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
      // 0: x=x, y=y, 1: x=-y, y=x, 2: x=-x, y=-y, 3: x=y, y=-x
      if (portrait != 0) {
        if (portrait > 1)
          ydiff = -ydiff;
        if (portrait < 3)
          xdiff = -xdiff;
      }

      viewer.controls.theta += Math.sign(xdiff) * Math.pow(xdiff, 2) * scalingFactors[0];
      viewer.controls.phi += Math.sign(ydiff) * Math.pow(ydiff, 2) * scalingFactors[1];
    }

    // returns the smallest angle difference between init and curr within the range [-deg, deg]
    function smallestDiff(init, curr, deg) {
      let deg2 = 2 * deg;
      let diff = (init % deg - curr % deg + deg2) % deg2;
      return diff > deg ? diff - deg2 : diff;
    }

    // Setup drag and drop for uploading new photos on desktop
    function setupDragDrop(canvas, viewer) {
      const dropRegion = document.querySelector('#drop-region');
      dragDrop(canvas, {
        onDragEnter: () => {
          (<HTMLDivElement>dropRegion).style.display = '';
        },
        onDragLeave: () => {
          (<HTMLDivElement>dropRegion).style.display = 'none';
        },
        onDrop: (files) => {
          let img = new Image();
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

    // Sets the uploaded image to be viewed
    function uploadPhoto() {
      if (this.files && this.files[0]) {
        let img = new Image();
        img.onload = () => {
          if (resizeImg(img))
            return;
          viewer.texture(img);
        };
        img.onerror = () => {
          alert('Could not load image!');
        };
        img.crossOrigin = 'Anonymous';
        img.src = URL.createObjectURL(this.files[0]);
      }
      if (tilt) toggleTilt();
      if (autoSpin) toggleSpin();
    }

    // returns a URL to an image of img resized to maxTextureSize
    function resizeImg(img) {
      if (img.width > maxTextureSize || img.height > maxTextureSize) {	
        alert("Resizing image to fit screen.")
        let cvs = document.createElement("canvas");
        let ctx = cvs.getContext("2d");
        let scalingFactor = maxTextureSize / (img.width >= img.height ? img.width : img.height);
        cvs.width = img.width * scalingFactor;
        cvs.height = img.height * scalingFactor;
        ctx.scale(scalingFactor, scalingFactor);
        ctx.drawImage(img, 0, 0);
        img.src = cvs.toDataURL()
        return true;
      }
      return false;
    }
  };
}

// Utility to create a device pixel scaled canvas
function createCanvas(opt = <any>{}) {
  // default to full screen (no width/height specified)
  const viewport = opt.viewport || [0, 0];

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

// Calculates the orientation of the mobile device
function recalculateOrientation() {
  // If taller than wide, vertical (0-vertical, 1-cw, 2-upside down, 3-ccw)
  portrait = canvasSize[1] > canvasSize[0] ? (currAcc[1] >= 0 ? 0 : 2)
                                           : (currAcc[0] >= 0 ? 3 : 1);
  // workaround for the horizontal SONY tablet
  if (tablet)
    portrait = (portrait + 1) % 4
  if (tilt)
    toggleTilt();
}

// Set up movement controls for the viewer
function viewerSetup(viewer) {
  // Personal Preference
  invertDrag();

  // Set up key handlers
  if (!mobile) {
    document.body.onkeydown = checkKeyDown;
    document.body.onkeyup = checkKeyUp;
  }

  // Set up button handlers
  (<HTMLImageElement>document.querySelector((mobile ? ".mobile" : ".desktop") + ".icon#spin")).onclick = toggleSpin;
  mobile ? (<HTMLImageElement>document.querySelector("#tilt")).onclick = toggleTilt
         : (<HTMLImageElement>document.querySelector("#invert")).onclick = invertDrag;
  (<HTMLImageElement>document.querySelector("#left")).onclick = moveLeft;
  (<HTMLImageElement>document.querySelector("#right")).onclick = moveRight;

  // Calls helper methods based on which keys pressed
  function checkKeyDown(e) {
    e = e || window.event;
    switch (e.keyCode) {
      // shift
      case 16: shiftOn(); break;
      // space
      case 32: toggleSpin(); break;
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

// Toggles auto spin
function toggleSpin() {
  if (tilt) toggleTilt();

  autoSpin = !autoSpin;
  let spinButton = <HTMLImageElement>document.querySelector(
                   (mobile ? ".mobile" : ".desktop") + ".icon#spin");
  spinButton.src = imagePath + (autoSpin ? "stop.png" : "rotate.png");
  if (autoSpin) {
    awake.enable();
  } else if (mobile && !autoSpin && !tilt) {
    awake.disable();
  }
}

// Toggles the tilt controls
function toggleTilt() {
  if (autoSpin) toggleSpin();

  tilt = !tilt;
  let tiltButton = <HTMLImageElement>document.querySelector("#tilt")
  if (tilt) {
    tiltButton.src = imagePath + "iphone.png";
    initRot = currRot;
    awake.enable();
  } else {
    tiltButton.src = imagePath + "tilt.png";
  }
  if (mobile && !autoSpin && !tilt) {
    awake.disable();
  }
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
  })
}

// Rounds num to at most dig decimal places
function roundDecimal(num, dig) {
  return Math.trunc(num * Math.pow(10, dig)) / Math.pow(10, dig);
}
