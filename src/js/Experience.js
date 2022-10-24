
import config from '@utils/config'
import Debug from '@utils/Debug'
import Sizes from '@utils/Sizes'
import Time from '@utils/Time'

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

		this.sizes.on('resize', () => {
			this.resize()
		})

		this.update()
	}

	setDebug() {
		if (config.gui) {
			this.debug = new Debug()
		}
	}

	update() {
		if (this.world) this.world.update()

		if (this.engine) this.engine.update()

		if (this.debug) this.debug.stats.update()

		window.requestAnimationFrame(() => {
			this.update()
		})
	}

	resize() {
		this.engine.resize()
	}

	destroy() {}
}
