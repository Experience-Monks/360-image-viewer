const create360Viewer = require('../');
const getMaxTextureSize = require('./getMaxTextureSize');

// Get a canvas of some sort, e.g. fullscreen or embedded in a site
const canvas = createCanvas({
  // without this, the canvas defaults to full-screen
  viewport: [ 20, 20, 500, 256 ]
});
document.body.appendChild(canvas);

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

  // Start canvas render loop
  viewer.start();

  // For desktop, let's rotate the camera every frame while
  // the user isn't interacting.
  let isDragging = false;
  canvas.addEventListener('mousedown', () => {
    isDragging = true;
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  viewer.on('tick', (dt) => {
    if (!isDragging) {
      viewer.theta -= dt * 0.0001;
    }
  });
};

// Utility to create a device pixel scaled canvas
function createCanvas (opt = {}) {
  // default to full screen (no width/height specified)
  const viewport = opt.viewport || [ 0, 0 ];

  const canvas = document.createElement('canvas');
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
  // Choose a large texture size based on our GPU
  const maxTextureSize = getMaxTextureSize();
  let imageUrl = 'pano_2048.jpg';
  if (maxTextureSize >= 8192) imageUrl = 'pano_8192.jpg';
  else if (maxTextureSize >= 4096) imageUrl = 'pano_4096.jpg';
  return imageUrl;
}