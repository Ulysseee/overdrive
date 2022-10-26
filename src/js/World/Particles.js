import { Geometry, Program, Mesh, Vec2 } from 'ogl';
import Experience from '../Experience.js'

import particleFrag from '@shaders/particles.frag'
import particleVert from '@shaders/particles.vert'

import { average } from '@utils/Maths.js';

export default class Particles {
	constructor() {
		this.Experience = new Experience()
    this.gl = this.Experience.engine.gl
		this.scene = this.Experience.engine.scene
    this.time = this.Experience.time
    this.debug = this.Experience.debug

    this._nbParticles = 10000

		this.bindData()
		this.populateAttributes()
		this.createParticles()
    this.setDebug()
	}

	bindData() {
		this._data = {
			position: new Float32Array(this._nbParticles * 3),
			color: new Float32Array(this._nbParticles * 3),
			random: new Float32Array(this._nbParticles * 1)
		}
	}

  setDebug() {
    if(this.debug) {
			const f = this.debug.gui.addFolder({
				title: 'Particles',
				expanded: true
			})
			f.addInput(this.particlesMat.uniforms.uFrequency, 'value', { label: "Frequency", step: 0.01, min: 0, max: 1 });
			f.addInput(this.particlesMat.uniforms.uAmp, 'value', { label: "Amplitude", step: 1, min: 0, max: 50 });
			f.addInput(this.particlesMat.uniforms.uScale, 'value', { label: "Scale", step: 0.1, min: 0, max: 10 });
    }
  }

	populateAttributes() {
		for (let i = 0; i < this._nbParticles; i++) {
			// const x = Math.random() * 100 - 50
			// const y = Math.random() * 100 - 50
      // const x = (Math.random() * 100 - 50) * Math.cos(Math.PI + i * 0.1)
			// const y = (Math.random() * 100 - 50) * Math.sin(Math.PI + i * 0.1)
			// const z = Math.random() * 4 - 2
      const angle = Math.random() * Math.PI * 2 // Random angle
      // const radius = 15 + Math.random() * 35    // Random radius
      const radius = Math.random() * 50    // Random radius
      const x = Math.cos(angle) * radius        // Get the x position using cosinus
      const y = Math.sin(angle) * radius        // Get the z position using sinus

			const r = 1
			const g = 1
			const b = 1

      this._data.position.set([x, y, 0], i * 3);
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
          uTime: { type: 'float', value: this.time.delta * 0.001 },
          uFrequency: { value: 0.05 },
          uAmp: { value: 1 },
          uScale: { value: 1 }
      },
      transparent: true,
      // depthTest: false,
    });

    this.particles = new Mesh(this.gl, { mode: this.gl.POINTS, geometry, program: this.particlesMat });
    this.particles.setParent(this.scene);
	}

  onBeat(audio) {
    const avr = average(audio.values)
    console.log('AVR', avr)
    // this.particlesMat.uniforms.uScale.value = audio.values[2] * 5
    this.particlesMat.uniforms.uScale.value = avr * 10
    this.particlesMat.uniforms.uAmp.value = audio.volume
    // gsap.to(this.particlesMat.uniforms.uScale, { value: average })
  }

	update() {
    this.particles.rotation.z -= this.time.delta * 0.0001;
    // this.particles.rotation.x += time;

		this.particlesMat.uniforms.uTime.value += this.time.delta * 0.001
	}
}
