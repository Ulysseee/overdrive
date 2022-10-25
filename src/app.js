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
		}
	}

	launch() {
		this.experience = new Experience(this.emitter)
	}
}
