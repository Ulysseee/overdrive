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

varying vec3 vColor;
varying vec3 vPos;
varying float vRandom;
varying float vNoise;
varying float vFrequency;
varying float vAmp;

#include perlin.glsl;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec3 newPos = position;
  float noise = pnoise( vec3(position.xy * uFrequency, uTime * 0.5 ));
  noise = noise * (uAmp * 5.);
  newPos.z += noise;

  vPos = position;
  vRandom = random;
  vNoise = noise;
  vFrequency = uFrequency;
  vAmp = uAmp;
  vColor = hsv2rgb(vec3( 0.3 + uFrequency * 10., 0.8 + noise, 1.) * vNoise);

  gl_PointSize = 1. * uScale;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );;
}
