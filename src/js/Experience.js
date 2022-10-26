
import config from '@utils/config'
import Debug from '@utils/Debug'
import Sizes from '@utils/Sizes'
import Time from '@utils/Time'

import Audio from '@js/Audio'
import Engine from '@js/Engine'
import World from '@js/World/World'

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

		this.bindData()
    this.bindUi()
    this.bindEvents()
		this.update()
	}

  bindData() {
    this._data = { beat: false, play: true}
  }

  bindUi() {
    this._ui = {
      audio: document.querySelector('#audio'),
      play: document.querySelector('#play'),
    }
  } 

  bindEvents() {
    this.sizes.on('resize', () => this.resize())
    this._ui.audio.addEventListener('click', this.startAudio.bind(this)) 
    this._ui.play.addEventListener('click', this.handleAudio.bind(this)) 
  }

	setDebug() {
		if (config.gui) this.debug = new Debug()
	}

  startAudio() {
    Object.values(this._ui).forEach(el => el.classList.toggle('dft-hide'));
    this.audio = new Audio()
    this.audio.start( {
      onBeat: this.onBeat.bind(this),
      live: false,
      src: '../../BeeGeesX50Cent.mp3',
    })
  }

  handleAudio() {
    // this.audio.pause()
    if(this._data.play) {
      this._data.play = false
      this.audio.pause()
    } else {
      this._data.play = true
      this.audio.play()
    }
    console.log(this._data.play)
  }

  onBeat() {
    this.beat = true
		if (this.engine) this.engine.onBeat(this.audio)
    if (this.world) this.world.onBeat(this.audio)
    this.beat = false
  }

	update() {
    if (this.audio && this._data.play) this.audio.update()
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
