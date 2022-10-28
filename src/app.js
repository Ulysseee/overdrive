import '@scss/main.scss'

import config from '@utils/config'
import Experience from '@js/Experience'
import Title from '@js/Animations/Title'
import Canvas from '@js/Animations/Canvas'

window.addEventListener('DOMContentLoaded', () => {
	const app = new App();
	app.launch();
})

class App {
	constructor() {
		this.ui = {
			app: document.querySelector('#app'),
			title: document.querySelectorAll('[data-animation="title"]'),
		}
	}

	launch() {
    this.helloThere()
		this.experience = new Experience(this.emitter)
    this.setAnimations()
	}

  helloThere() {
		let ua = navigator.userAgent.toLowerCase()
		if (ua.indexOf('chrome') > -1 || ua.indexOf('firefox') > -1) {
			window.console.log.apply(console, config.credit)
		} else
			window.console.log('Site by Ulysse Gravier - https://ulyssegravier.fr/')
	}

  setAnimations() {
		this.ui.title.forEach((element) => new Title({ element }))
    new Canvas({ element: this.experience.engine.gl.canvas })
	}
}
