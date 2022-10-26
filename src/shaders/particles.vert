precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float uTime;
uniform float uFrequency;
uniform float uAmp;
uniform float uScale;

attribute vec3 position;
attribute vec3 color;
attribute float random;

varying vec3 vPos;
varying vec3 vColor;
varying float vNoise;
varying float vRandom;
varying float vCenter;

#include perlin.glsl;
#include simplex.glsl;

void main() {
  vPos = position;
  vRandom = random;
  vColor = color;

  vec3 newPos = position;
  
  float center = distance(position.xy, vec2(40.));

  float noise = pnoise( vec3(position.xy * uFrequency, uTime * 0.5 ));
  noise = noise * (uAmp * 5.);
  newPos.z += noise;
  vNoise = noise * center;


  vCenter = center;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );;
  // gl_PointSize = 4. + sin(uTime + noise + random);
  // gl_PointSize = 1. * smoothstep(1., 2., uScale);
  gl_PointSize = 1. * uScale;
}
