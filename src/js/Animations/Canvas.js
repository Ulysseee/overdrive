import gsap, { Circ } from 'gsap'

import Animation from './Animation.js'

export default class extends Animation {
	constructor({ element }) {
		super({ element })

    gsap.set(this.element, {
      opacity: 0,
		})
    this.bindUi()
	}

	bindUi() {
		this.ui = {}
	}

	animateIn() {
		this.revealMain = gsap.timeline().to(this.element, {
      opacity: 0.25,
			duration: 0.8,
			delay: 0.4,
			ease: Circ.easeOut
		})
	}

  destroy() {}
}
