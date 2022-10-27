import gsap, { Circ } from 'gsap'

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

		this.bindData()
    this.bindUi()
		this.setDebug()
		this.sizes = new Sizes()
		this.time = new Time()
		this.engine = new Engine()
		this.world = new World()

    this.bindEvents()
		this.update()
	}

  bindData() {
    this.data = { beat: false, play: false}
  }

  bindUi() {
    this._ui = {
      reveal: document.querySelector('#reveal'),
      play: document.querySelector('#play'),
      resume: document.querySelector('.controls__cta__up'),
      suspend: document.querySelector('.controls__cta__down'),
    }
  } 

  bindEvents() {
    this.sizes.on('resize', () => this.resize())
    this._ui.reveal.addEventListener('click', this.startAudio.bind(this)) 
    this._ui.play.addEventListener('click', this.handleAudio.bind(this)) 
  }

	setDebug() {
		if (config.gui) this.debug = new Debug()
	}

  startAudio() {
    gsap.to(this._ui.resume, { y: '110%' } )
    gsap.to(this._ui.suspend, { y: 0 } )
    
    setTimeout(() => {      
      this._ui.play.classList.toggle('dft-hide');
      gsap.to(this._ui.play, { opacity: 1, duration: 0.5 } )
      this.audio = new Audio()
      this.audio.start( {
        onBeat: this.onBeat.bind(this),
        live: false,
        src: '/BeeGeesX50Cent.mp3',
      })
      this.data.play = true
    }, 400);
  }

  handleAudio() {
    if(this.data.play) {
      gsap.to(this._ui.resume, { y: 0, duration: 0.3, ease: Circ.easeOut } )
      gsap.to(this._ui.suspend, { y: '-110%', duration: 0.3, ease: Circ.easeOut } )
      this.data.play = false
      this.audio.pause()
      this.world.pause()
    } else {
      gsap.to(this._ui.resume, { y: '110%', duration: 0.3, ease: Circ.easeOut } )
      gsap.to(this._ui.suspend, { y: 0, duration: 0.3, ease: Circ.easeOut } )
      this.data.play = true
      this.audio.play()
    }
  }

  onBeat() {
    this.data.beat = true
		if (this.engine) this.engine.onBeat(this.audio)
    if (this.world) this.world.onBeat(this.audio)
    this.data.beat = false
  }

	update() {
    if (this.audio && this.data.play) this.audio.update()
		if (this.world) this.world.update(this.data.play)
		if (this.engine) this.engine.update()
		if (this.debug) this.debug.stats.update()

		window.requestAnimationFrame(() => {
			this.update()
		})
	}

	resize() {
		this.engine.resize()
	}
}
