import Experience from '../Experience'

import Particles from './Particles'

export default class World {
	constructor() {
		this.Experience = new Experience()
		this.scene = this.Experience.scene
		this.camera = this.Experience.camera

    this.particles = new Particles()
	}

	update() {
		if (this.particles) this.particles.update()
	}

  onBeat(audio) {
    console.log('beat')
    if (this.particles) this.particles.onBeat(audio)
  }

	destroy() {}
}
