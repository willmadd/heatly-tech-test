export const fragmentShaderSource = `
precision mediump float;

varying vec2 fragTexCoord;
varying vec3 fragColor;
varying float fragIsTextured;

uniform sampler2D sampler;

void main() {
  if (fragIsTextured > 0.5) {
    gl_FragColor = texture2D(sampler, fragTexCoord);
  } else {
    gl_FragColor = vec4(fragColor, 1.0);
  }
}
`;
