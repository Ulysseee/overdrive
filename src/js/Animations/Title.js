import gsap, { Power3, Circ } from 'gsap'
import SplitType from 'split-type'

import Animation from './Animation.js'

export default class extends Animation {
	constructor({ element }) {
		super({ element })

		this.bindUi()
		this.splitText()
	}

	bindUi() {
		this.ui = {
			h1: this.element.querySelector('.title__up'),
			h2: this.element.querySelector('.title__down')
		}
	}

  bindEvents() {
    this.element.addEventListener('mouseenter', this.enter.bind(this), true)
    this.element.addEventListener('mouseleave', this.leave.bind(this), true)
    this.element.addEventListener('click', this.reveal.bind(this))
  }

	splitText() {
		this.splitedMainHeader = new SplitType(this.ui.h1, {
			types: 'words, chars',
			tagName: 'span'
		})
		this.splitedSubHeader = new SplitType(this.ui.h2, {
			types: 'words, chars',
			tagName: 'span'
		})
		gsap.set([this.splitedMainHeader.chars, this.splitedSubHeader.chars], {
			y: '110%',
			rotate: 40,
		})
    gsap.set(this.splitedMainHeader.chars, {
			opacity: 0,
		})
	}

	animateIn() {
		this.revealMain = gsap.timeline({
			onComplete: () => this.bindEvents()
		}).to(this.splitedMainHeader.chars, {
			y: 0,
			rotate: 0,
      opacity: 1,
			duration: 0.8,
			stagger: 0.03,
			delay: this.delay ? this.delay : 0,
			ease: Circ.easeOut
		})
	}

  enter() {
    gsap.killTweensOf(this.splitedMainHeader.chars)
		gsap.killTweensOf(this.splitedSubHeader.chars)
    
    this.enterTl = gsap.timeline()
      .to(this.splitedMainHeader.chars, {
        y: '-110%',
        rotate: -40,
        duration: 0.4,
        stagger: { from: "start", each: 0.01 },
        ease: Circ.easeOut
      }).to(this.splitedSubHeader.chars, {
        y: 0,
        rotate: 0,
        duration: 0.4,
        stagger: { from: "start", each: 0.01 },
        delay: -0.5,
        ease: Circ.easeOut
      })
  }

  leave() {
    gsap.killTweensOf(this.splitedMainHeader.chars)
		gsap.killTweensOf(this.splitedSubHeader.chars)

    this.leavetl = gsap.timeline()
      .to(this.splitedSubHeader.chars, {
        y: '110%',
        rotate: 40,
        duration: 0.4,
        stagger: { from: "start", each: 0.01 },
        ease: Circ.easeOut
      })
      .to(this.splitedMainHeader.chars, {
        y: 0,
        rotate: 0,
        duration: 0.4,
        stagger: { from: "start", each: 0.01 },
        delay: -0.5,
        ease: Circ.easeOut
      })
  }

	reveal() {
    console.log(this, 'reveal')
    
    gsap.to(document.querySelector('.webgl'), {
      opacity: 1,
      duration: 0.4,
      delay: 0.2,
      ease: Circ.easeIn
    })

		this.reveal = gsap.timeline({
			onComplete: () => this.destroy()
    })
			.to(this.splitedSubHeader.words, {
				y: '-115%',
				duration: 0.2,
				ease: Circ.easeIn
			})
	}

  destroy() {
    this.element.removeEventListener('mouseenter', this.enter, true)
    this.element.removeEventListener('mouseleave', this.leave, true)
    this.element.removeEventListener('click', this.reveal, true)
    this.element.remove()
    this.leavetl = null
    this.enterTl = null
  }
}
