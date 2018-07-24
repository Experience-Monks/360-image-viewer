const getContext = require('get-canvas-context');
const DEFAULT_SIZE = 1024;

module.exports = function () {
  const gl = getContext('webgl');
  return gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : DEFAULT_SIZE;
};
