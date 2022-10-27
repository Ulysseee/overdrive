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
varying float vCenter;
varying float vNoise;
varying float vFrequency;
varying float vAmp;

#include perlin.glsl;
#include simplex.glsl;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


void main() {
  vPos = position;
  vRandom = random;
  // vColor = color;

  vec3 newPos = position;
  
  float center = distance(position.xy, vec2(40.));

  float noise = pnoise( vec3(position.xy * uFrequency, uTime * 0.5 ));
  noise = noise * (uAmp * 5.);
  newPos.z += noise;
  vNoise = noise * center;


  vNoise = noise;
  vCenter = center;
  vFrequency = uFrequency;
  vAmp = uAmp;
  // vColor = hsv2rgb(vec3( 0.3 + noise, 0.8 + noise, 0.8));
  vColor = hsv2rgb(vec3( 0.3 + uFrequency * 10., 0.8 + noise, 1.) * vNoise);
  // vColor = hsv2rgb(vec3( uFrequency * 10., .5, 0.8));

  gl_PointSize = 1. * uScale;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );;
  // gl_PointSize = 4. + sin(uTime + noise + random);
  // gl_PointSize = 1. * smoothstep(1., 2., uScale);
}
