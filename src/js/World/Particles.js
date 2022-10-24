import { Geometry, Program, Mesh } from 'ogl';
import Experience from '../Experience.js'

import particleFrag from '@shaders/particles.frag'
import particleVert from '@shaders/particles.vert'

export default class Particles {
	constructor() {
		this.Experience = new Experience()
    this.gl = this.Experience.engine.gl
		this.scene = this.Experience.engine.scene
    this.time = this.Experience.time

    this._nbParticles = 50000

		this.bindData()
		this.populateAttributes()
		this.createParticles()
	}

	bindData() {
		this._data = {
			position: new Float32Array(this._nbParticles * 3),
			color: new Float32Array(this._nbParticles * 3),
			random: new Float32Array(this._nbParticles * 1)
		}
	}

	populateAttributes() {
		for (let i = 0; i < this._nbParticles; i++) {
			const x = Math.random() * 100 - 50
			const y = Math.random() * 100 - 50
			const z = Math.random() * 4 - 2

			const r = 1
			const g = 1
			const b = 1

      this._data.position.set([x, y, z], i * 3);
      this._data.color.set([r, g, b], i * 3);
      this._data.random.set([Math.random()], i * 1);
		}
	}

	createParticles() {
		const geometry = new Geometry(this.gl, {
        position: { size: 3, data: this._data.position },
        color: { size: 3, data: this._data.color },
        random: { size: 1, data: this._data.random },
    });

    this.particlesMat = new Program(this.gl, {
      vertex: particleVert,
      fragment: particleFrag,
      uniforms: {
          uTime: { value: this.time.delta * 0.001 },
      },
      transparent: true,
      // depthTest: false,
    });

    this.particles = new Mesh(this.gl, { mode: this.gl.POINTS, geometry, program: this.particlesMat });
    this.particles.setParent(this.scene);
	}

	update() {
		this.particlesMat.uniforms.uTime.value += this.time.delta * 0.001
	}
}
