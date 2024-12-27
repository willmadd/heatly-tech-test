export const vertexShaderSource = `
attribute vec3 vertPosition;
attribute vec2 vertTexCoord;
attribute vec3 vertColor;
attribute float isTextured;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

varying vec2 fragTexCoord;
varying vec3 fragColor;
varying float fragIsTextured;

void main() {
  fragTexCoord = vertTexCoord;
  fragColor = vertColor;
  fragIsTextured = isTextured;
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(vertPosition, 1.0);
}
`;
