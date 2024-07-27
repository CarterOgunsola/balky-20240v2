import * as THREE from "three";
import { GUI } from "dat.gui";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

class Sketch {
  constructor(options) {
    this.showGUI = options.showGUI || false; // Flag to control GUI
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.img = this.container.querySelector("img");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    var frustumSize = 1;
    var aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.OrthographicCamera(
      frustumSize / -2,
      frustumSize / 2,
      frustumSize / 2,
      frustumSize / -2,
      -1000,
      1000
    );
    this.camera.position.set(0, 0, 2);

    this.time = 0;

    this.mouse = { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 };

    this.isPlaying = true;
    this.settings();
    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();

    if (this.showGUI) {
      this.setupGUI(); // Initialize GUI if flag is true
    }

    this.mouseEvents();
  }

  getValue(val) {
    return parseFloat(this.container.getAttribute("data-" + val));
  }

  mouseEvents() {
    this.container.addEventListener("mousemove", (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = (e.clientX - rect.left) / this.width;
      this.mouse.y = (e.clientY - rect.top) / this.height;

      this.mouse.vX = this.mouse.x - this.mouse.prevX;
      this.mouse.vY = this.mouse.y - this.mouse.prevY;

      this.mouse.prevX = this.mouse.x;
      this.mouse.prevY = this.mouse.y;
    });
  }

  settings() {
    this.settings = {
      grid: this.getValue("grid") || 34,
      mouse: this.getValue("mouse") || 0.25,
      strength: this.getValue("strength") || 1,
      relaxation: this.getValue("relaxation") || 0.9,
      aspectRatio: this.getValue("aspectratio") || 1,
      rgbStrength: this.getValue("rgbstrength") || 0.01,
      rgbOpacity: this.getValue("rgbopacity") || 0.5,
    };
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.imageAspect = 1 / this.settings.aspectRatio;

    let a1, a2;
    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    this.camera.updateProjectionMatrix();
    this.regenerateGrid();
  }

  regenerateGrid() {
    this.size = this.settings.grid;

    const width = this.size;
    const height = this.size;

    const size = width * height;
    const data = new Float32Array(4 * size); // Use 4 for RGBAFormat
    const color = new THREE.Color(0xffffff);

    for (let i = 0; i < size; i++) {
      let r = Math.random() * 255 - 125;
      let r1 = Math.random() * 255 - 125;

      const stride = i * 4; // Use 4 for RGBAFormat

      data[stride] = r;
      data[stride + 1] = r1;
      data[stride + 2] = r;
      data[stride + 3] = 255; // Alpha channel
    }

    this.texture = new THREE.DataTexture(
      data,
      width,
      height,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    this.texture.magFilter = this.texture.minFilter = THREE.NearestFilter;
    this.texture.needsUpdate = true;

    if (this.material) {
      this.material.uniforms.uDataTexture.value = this.texture;
    }
  }

  addObjects() {
    this.regenerateGrid();
    let textureLoader = new THREE.TextureLoader();
    textureLoader.load(this.img.src, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBAFormat;
      texture.needsUpdate = true;
      this.material.uniforms.uTexture.value = texture;
    });

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
        uTexture: { value: null },
        uDataTexture: { value: this.texture },
        rgbStrength: { value: this.settings.rgbStrength },
        rgbOpacity: { value: this.settings.rgbOpacity },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);

    this.resize();
  }

  updateDataTexture() {
    let data = this.texture.image.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] *= this.settings.relaxation;
      data[i + 1] *= this.settings.relaxation;
    }

    let gridMouseX = this.size * this.mouse.x;
    let gridMouseY = this.size * (1 - this.mouse.y);
    let maxDist = this.size * this.settings.mouse;
    let aspect = this.height / this.width;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let distance = (gridMouseX - i) ** 2 / aspect + (gridMouseY - j) ** 2;
        let maxDistSq = maxDist ** 2;

        if (distance < maxDistSq) {
          let index = 4 * (i + this.size * j);

          let power = maxDist / Math.sqrt(distance);
          power = clamp(power, 0, 10);

          data[index] += this.settings.strength * 100 * this.mouse.vX * power;
          data[index + 1] -=
            this.settings.strength * 100 * this.mouse.vY * power;
        }
      }
    }

    this.mouse.vX *= 0.9;
    this.mouse.vY *= 0.9;
    this.texture.needsUpdate = true;
  }

  setupGUI() {
    this.gui = new GUI();
    this.gui
      .add(this.settings, "grid", 10, 100)
      .onChange(() => this.regenerateGrid());
    this.gui.add(this.settings, "mouse", 0.01, 1);
    this.gui.add(this.settings, "strength", 0.1, 10);
    this.gui.add(this.settings, "relaxation", 0.1, 1);
    this.gui
      .add(this.settings, "aspectRatio", 0.5, 2)
      .onChange(() => this.resize());
    this.gui.add(this.settings, "rgbStrength", 0.001, 0.1).onChange((value) => {
      this.material.uniforms.rgbStrength.value = value;
    });
    this.gui.add(this.settings, "rgbOpacity", 0.1, 1).onChange((value) => {
      this.material.uniforms.rgbOpacity.value = value;
    });
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    this.updateDataTexture();
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

function initializeWebGLEffects() {
  document
    .querySelectorAll('[data-webgl="grid-effect"]')
    .forEach((container) => {
      new Sketch({ dom: container, showGUI: false }); // Set to false to hide GUI
    });
}

export default initializeWebGLEffects;
