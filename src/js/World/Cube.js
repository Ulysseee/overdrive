import { Box, Program, Mesh } from 'ogl';
import Experience from '../Experience.js'

export default class Cube {
	constructor() {
		this.Experience = new Experience()
    this.gl = this.Experience.engine.gl
		this.scene = this.Experience.engine.scene
    this.time = this.Experience.time

    this.createCube()
	}

  createCube() {
    const geometry = new Box(this.gl);
    this.program = new Program(this.gl, {
        vertex: /* glsl */ `
            attribute vec3 position;

            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;

            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragment: /* glsl */ `
            void main() {
                gl_FragColor = vec4(1.0);
            }
        `,
    });

    this.cube = new Mesh(this.gl, { geometry, program: this.program });
    this.cube.setParent(this.scene);
  }

	update() {
    this.cube.rotation.y -= this.time.delta * 0.001;
    this.cube.rotation.x += this.time.delta * 0.001;
	}
}
