import '@scss/main.scss'

import config from '@utils/config'
import Experience from '@js/Experience';

window.addEventListener('DOMContentLoaded', () => {
	const app = new App();
	app.launch();
})

class App {
	constructor() {
		this.ui = {
			app: document.querySelector('#app'),
			webgl: document.querySelector('canvas.webgl')
		}
	}

	launch() {
		this.helloThere()
		this.experience = new Experience()
	}

	helloThere() {
		let ua = navigator.userAgent.toLowerCase()
		if (ua.indexOf('chrome') > -1 || ua.indexOf('firefox') > -1) {
			window.console.log.apply(console, config.credit)
		} else
			window.console.log('Site by Ulysse Gravier - https://ulyssegravier.fr/')
	}
}
