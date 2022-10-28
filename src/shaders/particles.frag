precision highp float;
uniform float uTime;

varying vec3 vColor;
varying vec3 vPos;
varying float vRandom;
varying float vCenter;
varying float vNoise;
varying float vFrequency;
varying float vAmp;

#include perlin.glsl;

void main() {
  float perlinNoise = pnoise( vPos + uTime * 0.5 );

  float r = sin((vNoise) * vRandom);
  float g = vNoise;
  // float b = 1.;
  float b = 1. * sin(vAmp * uTime);
  
  // float r = sin((vNoise + uTime) * vRandom);
  // float g = perlinNoise;
  // float b = 0.;

  // float r = vNoise * vAmp;
  // float g = vNoise; 
  // float b = vNoise;

  vec3 color = vec3(r, g, b);
  // color *= vNoise;
  // color += vNoise;

  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = step(0.5, strength);
  strength = 1.0 - strength;

  if(strength < .1) { discard; }

  gl_FragColor = vec4(vNoise,vNoise,vNoise, 1.);
  // gl_FragColor = vec4(color, 1.);
  gl_FragColor = vec4(vColor, 1.);
}
