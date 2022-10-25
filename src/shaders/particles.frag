precision highp float;
uniform float uTime;

varying float vNoise;
varying vec3 vColor;
varying vec3 vPos;
varying float vRandom;

#include perlin.glsl;

void main() {
  float perlinNoise = pnoise( vPos + uTime * 0.5 );

  float r = sin((perlinNoise + uTime) * vRandom);
  float g = perlinNoise;
  float b = 0.;

  vec3 color = vec3(r, g, b);
  color += perlinNoise;

  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = step(0.5, strength);
  strength = 1.0 - strength;

  if(strength < .1) {
    discard;
  }

  gl_FragColor = vec4(vNoise,vNoise,vNoise, 1.);
  // gl_FragColor = vec4(color, 1.);
}
