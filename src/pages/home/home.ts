import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { create360Viewer } from '360-image-viewer';
import { dragDrop } from 'drag-drop';
// import { canvasFit } from 'canvas-fit';
// const create360Viewer = require('360-image-viewer');
// const canvasFit = require('canvas-fit');

var mobile = false;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  constructor(public navCtrl: NavController, public platform: Platform) {}
  check() {
    mobile = this.platform.is('mobileweb') ? true : false;
    alert(mobile ? "mobile!" : "desktop!")
  }

}

// const create360Viewer = require('../');
// const getMaxTextureSize = require('./getMaxTextureSize');
// const dragDrop = require('drag-drop');

const dropRegion = document.querySelector('#drop-region');

var autoSpin = false;     // whether to always rotate the view
var panUp = true;         // initial vertical scroll direction
var shift = false;        // if the shift key is pressed
var initMouse = [0, 0]    // initial cursor position
var currMouse = [0, 0]    // current cursor position
var focus = true;       // if the document has focus

// Get a canvas of some sort, e.g. fullscreen or embedded in a site
const canvas = createCanvas({
  canvas: document.querySelector('#canvas'),
  // without this, the canvas defaults to full-screen
  // viewport: [ 20, 20, 500, 256 ]
});

// Get the max image size possible
const imageUrl = getImageURL();

// Load your image
const image = new Image();
image.src = imageUrl;
image.onload = () => {
  // Setup the 360 viewer
  const viewer = create360Viewer({
    image: image,
    canvas: canvas
  });

  setupDragDrop(canvas, viewer);

  // Start canvas render loop
  viewer.start();

  viewerSetup(viewer);

  viewer.on('tick', (dt) => {
    var txt = "";
    txt += viewer.controls.theta;
    txt += " ";
    txt += viewer.controls.phi;
    document.getElementById("position").innerHTML = txt;

    if (shift) {
      // Handle cursor-guided scrolling
      viewer.controls.theta += (initMouse[0] - currMouse[0]) * 0.000065;
      viewer.controls.phi += (initMouse[1] - currMouse[1]) * 0.000035;
    } else if (focus){
        
        // Handle auto scrolling
        if (autoSpin && !viewer.controls.dragging) {
          dt = dt < 20 ? dt : 16.8;
          viewer.controls.theta -= dt * 0.00005;
          panUp = viewer.controls.phi >= 0.6 * Math.PI ? false : panUp;
          panUp = viewer.controls.phi <= 0.48 * Math.PI ? true : panUp;
          viewer.controls.phi += dt * 0.00005 * (panUp ? 1 : -1);
          // if (viewer.controls.phi >= 0.61 * Math.PI || viewer.controls.phi <= 0.479 * Math.PI) {
          //   console.log("i'm not supposed be here: " + (viewer.controls.phi / Math.PI));
          //   viewer.controls.phi = 0.57 * Math.PI;
          // }
        }
      } 
      // else {
      //   console.log("i've lost focus");
      // }
  });
};

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

function getImageURL () {
  return "./assets/imgs/pano.png";
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

function viewerSetup(viewer) {

  // Determine when document has focus
  document.addEventListener("visibilitychange", function() {
    focus = !focus;
    console.log(focus ? "gained focus" : "lost focus");
  })

  // Set up key handlers
  document.body.onkeydown = checkKeyDown;
  document.body.onkeyup = checkKeyUp;
  document.addEventListener("mousemove", mouseHandler);
  document.getElementById("invert").addEventListener("change", invertDrag);
  document.getElementById("toggle").addEventListener("change", toggleSpin);

  // Set up button handlers
  document.getElementById("spin").addEventListener("click", toggleSpinKeyDown);
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
    var x = event.clientX;
    var y = event.clientY;
    currMouse = [x, y];
  }
  // Inverts the controls for dragging
  function invertDrag() {
    viewer.controls.rotateSpeed = -viewer.controls.rotateSpeed;
  }
}