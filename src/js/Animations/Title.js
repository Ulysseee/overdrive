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
    this.element.addEventListener('mouseenter', this.enter.bind(this))
    this.element.addEventListener('mouseleave', this.leave.bind(this))
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
			y: '130%',
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
    this.killTweans()
    
    this.enterTl = gsap.timeline()
      .to(this.splitedMainHeader.chars, {
        y: '-130%',
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
    this.killTweans()

    this.leavetl = gsap.timeline()
      .to(this.splitedSubHeader.chars, {
        y: '130%',
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
        stagger: { from: "start", each: 0.03 },
				ease: Circ.easeIn
			})
	}

  killTweans() {
    if(gsap.isTweening(this.splitedMainHeader.chars) || gsap.isTweening(this.splitedSubHeader.chars) || gsap.isTweening(this.splitedMainHeader.words) || gsap.isTweening(this.splitedSubHeader.words)) {
      gsap.killTweensOf(this.splitedMainHeader.chars)
      gsap.killTweensOf(this.splitedMainHeader.words)
      gsap.killTweensOf(this.splitedSubHeader.chars)
      gsap.killTweensOf(this.splitedSubHeader.words)
    }
  }

  destroy() {
    this.element.removeEventListener('mouseenter', this.enter)
    this.element.removeEventListener('mouseleave', this.leave)
    this.element.removeEventListener('click', this.reveal)
    this.element.remove()
    this.leavetl = null
    this.enterTl = null
  }
}
