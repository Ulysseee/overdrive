import gsap, { Power1 } from 'gsap';
import { Geometry, Program, Mesh } from 'ogl';
import Experience from '../Experience.js'

import particleFrag from '@shaders/particles.frag'
import particleVert from '@shaders/particles.vert'

import { clamp, lerp, average } from '@utils/Maths.js';

export default class Particles {
	constructor() {
		this.Experience = new Experience()
    this.gl = this.Experience.engine.gl
		this.scene = this.Experience.engine.scene
    this.time = this.Experience.time
    this.debug = this.Experience.debug
    this.isPlaying = this.Experience.data.play

    this._nbParticles = 40000

		this.bindData()
		this.populateAttributes()
		this.createParticles()
    this.setDebug()
	}

	bindData() {
		this._data = {
			position: new Float32Array(this._nbParticles * 3),
			color: new Float32Array(this._nbParticles * 3),
			random: new Float32Array(this._nbParticles * 1),

      dftScale: 1,
      dftFrequency: 0.05,
      dftAmp: 1,
      dftParticlesScale: 1,
		}
	}

  setDebug() {
    if(this.debug) {
			const f = this.debug.gui.addFolder({
				title: 'Particles',
				expanded: true
			})
			f.addInput(this, '_nbParticles', { label: "Particles number", step: 1, min: 0, max: 80000 })    
			f.addInput(this.particlesMat.uniforms.uFrequency, 'value', { label: "Frequency", step: 0.01, min: 0, max: 1 });
			f.addInput(this.particlesMat.uniforms.uAmp, 'value', { label: "Amplitude", step: 0.1, min: 0, max: 50 });
			f.addInput(this.particlesMat.uniforms.uScale, 'value', { label: "Scale", step: 0.1, min: 0, max: 10 });
    }
  }

	populateAttributes() {
		for (let i = 0; i < this._nbParticles; i++) {
      const angle = Math.random() * Math.PI * 2 // Random angle
      // const radius = 15 + Math.random() * 35 // Random radius
      const radius = Math.random() * 50         // Random radius
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
		this.geometry = new Geometry(this.gl, {
        position: { size: 3, data: this._data.position },
        color: { size: 3, data: this._data.color },
        random: { size: 1, data: this._data.random },
    });

    this.particlesMat = new Program(this.gl, {
      vertex: particleVert,
      fragment: particleFrag,
      uniforms: {
          uTime: { type: 'f', value: this.time.delta * 0.001 },
          uFrequency: { type: 'f', value: this._data.dftFrequency },
          uAmp: { type: 'f', value: this._data.dftAmp },
          uScale: { type: 'f', value: this._data.dftScale }
      },
      transparent: true,
    });

    this.particles = new Mesh(this.gl, { mode: this.gl.POINTS, geometry: this.geometry, program: this.particlesMat });
    this.particles.rotation.x -= Math.PI/3
    this.particles.setParent(this.scene);
	}

  onBeat(audio) {
    const avr = average(audio.values)
    let particleScale = clamp(avr + 1, 1, 1.5)
    // this.particles.scale.set(particleScale, particleScale, particleScale)
    
    // this.particlesMat.uniforms.uScale.value = audio.values[2] * 5
    this.particlesMat.uniforms.uScale.value = avr * 5
    if (audio.values[2] > 1) this.particlesMat.uniforms.uFrequency.value = clamp(audio.values[2] / 10, this._data.dftFrequency, 0.1)
    this.particlesMat.uniforms.uAmp.value = clamp(audio.volume, this._data.dftAmp, 6)
  }

  pause() {
    gsap.to(this.particles.rotation, { duration: 0.5, z: this.particles.rotation.z - 0.175, ease: Power1.easeOut })
  }

	update(isPlaying) {
    const { dftParticlesScale, dftFrequency, dftScale, dftAmp } = this._data
    const { uFrequency, uScale, uAmp } = this.particlesMat.uniforms
    this.particlesMat.uniforms.uTime.value += this.time.delta * 0.001

    if (isPlaying) {
      this.particles.rotation.z -= this.time.delta * 0.0008
      // this.particles.rotation.x -= Math.cos(this.time.delta * 0.0005)
      // this.particles.rotation.x -= Math.sin(this.time.delta * 0.0005)
    }

    this.particles.scale.set(
      lerp( this.particles.scale.x, dftParticlesScale, 0.1),
      lerp( this.particles.scale.y, dftParticlesScale, 0.1),
      lerp( this.particles.scale.z, dftParticlesScale, 0.1)
    )

    // UPDATE UNIFORMS
    uFrequency.value = lerp( uFrequency.value, dftFrequency, 0.1 )
    uScale.value = lerp( uScale.value, dftScale, 0.05 )
    uAmp.value = lerp( uAmp.value, dftAmp, 0.04 )

    // console.log(uFrequency.value)
    // console.log(uFrequency.value)
	}
}
