
import config from '@utils/config'
import Debug from '@utils/Debug'
import Sizes from '@utils/Sizes'
import Time from '@utils/Time'

import Audio from '@js/Audio'
import Engine from '@js/Engine'
import World from '@js/World/World'

import audioFile from '../../BeeGeesX50Cent.mp3'

export default class Experience {
	constructor() {
		if (Experience._instance) {
			return Experience._instance
		}

		Experience._instance = this

		this.config = config

		this.setDebug()
		this.sizes = new Sizes()
		this.time = new Time()
		this.engine = new Engine()
		this.world = new World()

		this.sizes.on('resize', () => {
			this.resize()
		})
    document.querySelector('#audio').addEventListener('click', this.startAudio.bind(this)) 
		this.update()
	}

	setDebug() {
		if (config.gui) {
			this.debug = new Debug()
		}
	}
  startAudio() {
    this.audio = new Audio()
    this.audio.start( {
      onBeat: this.onBeat.bind(this),
      live: false,
      src: audioFile
    })
  }

  onBeat() {
		if (this.engine) this.engine.onBeat(this.audio)
    if (this.world) this.world.onBeat(this.audio)
  }

	update() {
    if (this.audio) this.audio.update()
		if (this.world) this.world.update()
		if (this.engine) this.engine.update()
		if (this.debug) this.debug.stats.update()

    // if (this.audio) console.log(this.audio.volume)

		window.requestAnimationFrame(() => {
			this.update()
		})
	}

	resize() {
		this.engine.resize()
	}

	destroy() {}
}
