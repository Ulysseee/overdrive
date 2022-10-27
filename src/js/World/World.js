import Experience from '../Experience'

import Particles from './Particles'

export default class World {
	constructor() {
		this.Experience = new Experience()
		this.scene = this.Experience.scene 
		this.camera = this.Experience.camera

    this.particles = new Particles()
	}
  
  onBeat(audio) {
    // console.log('beat')
    if (this.particles) this.particles.onBeat(audio)
  }

  pause() {
    if (this.particles) this.particles.pause()
  }

	update(isPlaying) {
		if (this.particles) this.particles.update(isPlaying)
	}

	destroy() {}
}
