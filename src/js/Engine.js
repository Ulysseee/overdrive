import { Renderer, Camera, Transform, Orbit, Post, Vec2, Vec3 } from 'ogl'
import Experience from './Experience'

import brightPassFragment from '@shaders/post/brightPass.frag'
import blurFragment from '@shaders/post/blur.frag'
import compositeFragment from '@shaders/post/composite.frag'

import { lerp, clamp, average } from '@utils/Maths';

export default class Engine {
	constructor() {
		this.Experience = new Experience()
		this.canvas = this.Experience.canvas
		this.sizes = this.Experience.sizes
    this.debug = this.Experience.debug
    this.compositePass = null
    this.dftStrength = 0

    this.createRenderer()
    this.createComposer()
    this.createCamera()
    this.createScene()
    this.initPasses()
    this.resize()
    if(this.debug) this.setDebug()
	}

  setDebug() {
    const f = this.debug.gui.addFolder({
      title: 'Bloom',
      expanded: true
    })
		f.addInput(this.compositePass, 'enabled');
		f.addInput(this.compositePass.uniforms.uBloomStrength, 'value', { label: "uBloomStrength", step: 0.001, min: 0, max: 1 });
		f.addInput(this.brightPass.uniforms.uThreshold, 'value', { label:"uThreshold", step: 0.001, min: 0, max: 1 });

    this.setControls()
  }

	createRenderer() {
    this.renderer = new Renderer();
    this.gl = this.renderer.gl;
    document.querySelector('#app').appendChild(this.gl.canvas);
 	}

  createComposer() {
    // Create composite post at full resolution, and bloom at reduced resolution
    this.postComposite = new Post(this.gl);
    // `targetOnly: true` prevents post from rendering to canvas
    this.postBloom = new Post(this.gl, { dpr: 0.5, targetOnly: true });

    // Create uniforms for passes
    this.resolution = { value: new Vec2() };
    this.bloomResolution = { value: new Vec2() };
  }

  createCamera () {
    this.camera = new Camera(this.gl, { fov: 50, near: 0.1, far: 500 })
    this.camera.position.x = 0
    this.camera.position.y = -4
    this.camera.position.z = 120
  }

  setControls() {
    this.controls = new Orbit(this.camera, {
        target: new Vec3(0, 0, 0),
        zoomStyle: 'Dolly'
    });
  }

  createScene() {
    this.scene = new Transform()
  }

  initPasses() {
    // Add Bright pass - filter the scene to only the bright parts we want to blur
    this.brightPass = this.postBloom.addPass({
        fragment: brightPassFragment,
        uniforms: {
            uThreshold: { value: 0.8 },
        },
    });
    // Add gaussian blur passes
    const horizontalPass = this.postBloom.addPass({
        fragment: blurFragment,
        uniforms: {
            uResolution: this.bloomResolution,
            uDirection: { value: new Vec2(2, 0) },
        },
    });
    const verticalPass = this.postBloom.addPass({
        fragment: blurFragment,
        uniforms: {
            uResolution: this.bloomResolution,
            uDirection: { value: new Vec2(0, 2) },
        },
    });
    // Re-add the gaussian blur passes several times to the array to get smoother results
    for (let i = 0; i < 5; i++) {
        this.postBloom.passes.push(horizontalPass, verticalPass);
    }

    // Add final composite pass
    this.compositePass = this.postComposite.addPass({
        fragment: compositeFragment,
        uniforms: {
            uResolution: this.resolution,
            tBloom: this.postBloom.uniform,
            uBloomStrength: { value: 0 },
        },
    });
  }

	resize() {
    this.renderer.setSize(this.sizes.width, this.sizes.height)

    // Update Post Classes
    this.postComposite.resize();
    this.postBloom.resize();

    // Update uniforms
    this.resolution.value.set(this.sizes.width, this.sizes.height);
    this.bloomResolution.value.set(this.postBloom.options.width, this.postBloom.options.height);

    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height
    })
	}

  onBeat(audio) {
    const avr = average(audio.values)
    this.compositePass.uniforms.uBloomStrength.value = avr
  }

	update() {
    if (this.debug) this.controls.update()

    this.compositePass.uniforms.uBloomStrength.value = lerp(
      clamp(this.compositePass.uniforms.uBloomStrength.value, 0.01, 1),
      this.dftStrength,
      0.05
    )

    // Disable compositePass pass, so this post will just render the scene for now
    this.compositePass.enabled = false;
    // `targetOnly` prevents post from rendering to the canvas
    this.postComposite.targetOnly = true;
    // This renders the scene to postComposite.uniform.value
    this.postComposite.render({ scene: this.scene, camera: this.camera });

    // This render the bloom effect's bright and blur passes to postBloom.fbo.read
    // Passing in a `texture` argument avoids the post initially rendering the scene
    this.postBloom.render({ texture: this.postComposite.uniform.value, targetOnly: true });

    // Re-enable composite pass
    this.compositePass.enabled = true;
    // Allow post to render to canvas upon its last pass
    this.postComposite.targetOnly = false;

    // This renders to canvas, compositing the bloom pass on top
    // pass back in its previous render of the scene to avoid re-rendering
    this.postComposite.render({ texture: this.postComposite.uniform.value });
	}
}
