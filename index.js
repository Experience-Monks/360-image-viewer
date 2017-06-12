const createSphere = require('primitive-sphere');
const createControls = require('orbit-controls');
const createCamera = require('perspective-camera');
const createRegl = require('regl');

// Generate some vertex data for a UV sphere
// This can be re-used instead of computed each time
const sphere = createSphere(1, {
  segments: 64
});

module.exports = create360Viewer;
function create360Viewer (canvas, image) {
  // Create a new regl instance
  const regl = createRegl({
    canvas: canvas
  });

  // Our perspective camera will hold projection/view matrices
  const camera = createCamera({
    fov: 40 * Math.PI / 180,
    near: 0.01,
    far: 1000
  })

  // The mouse/touch input controls for the orbiting in 360
  const controls = createControls({
    canvas: canvas,
    parent: window,
    rotateSpeed: 0.15,
    damping: 0.275,
    zoom: false,
    pinch: false,
    distance: 0
  });

  // We create a new "mesh" that represents our 360 textured sphere
  const drawMesh = regl({
    // The uniforms for this shader
    uniforms: {
      // Creates a GPU texture from our Image
      map: regl.texture({
        data: image,
        mag: 'linear',
        min: 'linear'
      }),
      // Camera matrices will have to be passed into this mesh
      projection: regl.prop('projection'),
      view: regl.prop('view')
    },
    // The fragment shader
    frag: [
      'precision highp float;',
      'uniform sampler2D map;',
      'uniform vec4 color;',
      'varying vec2 vUv;',
      'void main() {',
      '  vec2 uv = 1.0 - vUv;',
      '  gl_FragColor = texture2D(map, uv);',
      '}',
    ].join('\n'),
    // The vertex shader
    vert: [
      'precision highp float;',
      'attribute vec3 position;',
      'attribute vec2 uv;',
      'uniform mat4 projection;',
      'uniform mat4 view;',
      'varying vec2 vUv;',
      'void main() {',
      '  vUv = uv;',
      '  gl_Position = projection * view * vec4(position.xyz, 1.0);',
      '}'
    ].join('\n'),
    // The attributes of the mesh, position and uv (texture coordinate)
    attributes: {
      position: regl.buffer(sphere.positions),
      uv: regl.buffer(sphere.uvs)
    },
    // The indices of the mesh
    elements: regl.elements(sphere.cells)
  });

  const frame = regl.frame(ev => {
    const viewportWidth = ev.viewportWidth;
    const viewportHeight = ev.viewportHeight;

    // clear contents of the drawing buffer
    regl.clear({
      color: [ 0, 0, 0, 1 ],
      depth: 1
    });

    // update input controls and copy into our perspective camera
    controls.update();
    controls.copyInto(camera.position, camera.direction, camera.up);

    // update camera viewport and matrices
    camera.viewport = [ 0, 0, viewportWidth, viewportHeight ];
    camera.update();

    // draw our 360 sphere with the new camera matrices
    drawMesh({
      projection: camera.projection,
      view: camera.view
    });
  });

  // Setup an API for the user
  regl.stop = frame.cancel;
  regl.canvas = canvas;

  return regl;
}
