// import * as THREE from "three";

// export function glitchHover() {
//   const vertexShader = `
//     uniform vec2 uOffset;
//     varying vec2 vUv;

//     float M_PI = 3.141529;

//     vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset){
//         position.x = position.x + (sin(uv.y * M_PI) * offset.x);
//         position.y = position.y + (sin(uv.x * M_PI) * offset.y);
//         return position;
//     }

//     void main(){
//         vUv = uv;
//         vec3 newPosition = deformationCurve(position, uv, uOffset);
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
//     }
//   `;

//   // -- FRAGMENT SHADER WITH "COVER" UV ADJUSTMENT
//   const fragmentShader = `
//     uniform sampler2D uTexture;
//     uniform float uAlpha;
//     uniform float uPlaneAspect; // plane ratio (width/height)
//     uniform float uImageAspect; // image ratio (width/height)
//     varying vec2 vUv;

//     void main(){
//         // Basic approach:
//         // 1) Compare planeAspect & imageAspect
//         // 2) Scale UV so texture "covers" the plane, cropping any overflow.
//         // If image is "wider" than plane, scale Y (uv.y). If narrower, scale X (uv.x).
//         vec2 uv = vUv;
//         float ratio = uImageAspect / uPlaneAspect;

//         // If ratio > 1 => the image is relatively wide => scale on Y
//         // If ratio < 1 => the image is relatively tall => scale on X
//         if(ratio > 1.0) {
//             // image is wide => we make the image "taller" so it overflows top/bottom
//             uv.y = uv.y * ratio - (ratio - 1.0) * 0.5;
//         } else {
//             // image is tall => we make the image "wider" so it overflows left/right
//             float invRatio = 1.0 / ratio;
//             uv.x = uv.x * invRatio - (invRatio - 1.0) * 0.5;
//         }

//         // sample
//         vec3 color = texture2D(uTexture, uv).rgb;
//         gl_FragColor = vec4(color, uAlpha);
//     }
//   `;

//   function lerp(start, end, t) {
//     return start * (1 - t) + end * t;
//   }

//   let targetX = 0;
//   let targetY = 0;

//   class WebGL {
//     constructor() {
//       this.container = document.body;
//       this.links = [...document.querySelectorAll('[glitch-hover="item"]')];
//       this.scene = new THREE.Scene();
//       this.perspective = 1000;
//       this.sizes = new THREE.Vector2(0, 0);
//       this.offset = new THREE.Vector2(0, 0);

//       // Default plane is 250 x 350 => aspect = 250/350 = ~0.714...
//       const PLANE_WIDTH = 250.0;
//       const PLANE_HEIGHT = 350.0;
//       const planeAspect = PLANE_WIDTH / PLANE_HEIGHT;

//       // Prepare the uniforms
//       this.uniforms = {
//         uTexture: { value: null },
//         uAlpha: { value: 0.0 },
//         uOffset: { value: new THREE.Vector2(0.0, 0.0) },
//         uPlaneAspect: { value: planeAspect },
//         uImageAspect: { value: 1.0 }, // will adjust upon hover
//       };

//       // Load textures
//       this.textures = this.links
//         .map((link) => {
//           const img = link.querySelector('[glitch-hover="img-wrap"] img');
//           if (img) {
//             return new THREE.TextureLoader().load(img.src);
//           } else {
//             console.error("Image not found in link:", link);
//             return null;
//           }
//         })
//         .filter((texture) => texture !== null);

//       // On hover, switch textures and also set correct image aspect
//       this.links.forEach((link, idx) => {
//         if (this.textures[idx]) {
//           const tex = this.textures[idx];
//           link.addEventListener("mouseenter", () => {
//             this.uniforms.uTexture.value = tex;
//             // The loaded texture has an image with width, height
//             const imageWidth = tex.image.width;
//             const imageHeight = tex.image.height;
//             const imageAspect = imageWidth / imageHeight;
//             this.uniforms.uImageAspect.value = imageAspect;
//             // fade in
//             this.uniforms.uAlpha.value = 1.0;
//           });

//           link.addEventListener("mouseleave", () => {
//             // fade out
//             this.uniforms.uAlpha.value = 0.0;
//           });
//         }
//       });

//       this.addEventListeners();
//       this.setUpCamera();
//       this.createMesh();
//       this.render();
//     }

//     get viewport() {
//       const width = window.innerWidth;
//       const height = window.innerHeight;
//       const aspectRatio = width / height;
//       return { width, height, aspectRatio };
//     }

//     addEventListeners() {
//       window.addEventListener("resize", this.onWindowResize.bind(this));
//       window.addEventListener("mousemove", this.handleMouseMove.bind(this));
//     }

//     setUpCamera() {
//       const fov =
//         (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) /
//         Math.PI;
//       this.camera = new THREE.PerspectiveCamera(
//         fov,
//         this.viewport.aspectRatio,
//         0.1,
//         1000
//       );
//       this.camera.position.set(0, 0, this.perspective);

//       this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//       this.renderer.setSize(this.viewport.width, this.viewport.height);
//       this.renderer.setPixelRatio(window.devicePixelRatio);
//       this.renderer.domElement.style.position = "fixed";
//       this.renderer.domElement.style.top = "0";
//       this.renderer.domElement.style.left = "0";
//       this.container.appendChild(this.renderer.domElement);
//     }

//     createMesh() {
//       this.geometry = new THREE.PlaneGeometry(1, 1, 20, 20);
//       this.material = new THREE.ShaderMaterial({
//         uniforms: this.uniforms,
//         vertexShader: vertexShader,
//         fragmentShader: fragmentShader,
//         transparent: true,
//       });

//       this.mesh = new THREE.Mesh(this.geometry, this.material);

//       // Scale the mesh to 250 x 350
//       this.sizes.set(250, 350);
//       this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

//       this.scene.add(this.mesh);
//     }

//     handleMouseMove(e) {
//       targetX = e.clientX;
//       targetY = e.clientY;
//     }

//     onWindowResize() {
//       this.camera.aspect = this.viewport.aspectRatio;
//       this.camera.fov =
//         (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) /
//         Math.PI;
//       this.renderer.setSize(this.viewport.width, this.viewport.height);
//       this.camera.updateProjectionMatrix();
//     }

//     render() {
//       // Smooth follow
//       this.offset.x = lerp(this.offset.x, targetX, 0.1);
//       this.offset.y = lerp(this.offset.y, targetY, 0.1);

//       // pass small glitch offset
//       this.uniforms.uOffset.value.set(
//         (targetX - this.offset.x) * 0.0005,
//         -(targetY - this.offset.y) * 0.0005
//       );

//       // position plane around mouse
//       this.mesh.position.set(
//         this.offset.x - this.viewport.width / 2,
//         this.viewport.height / 2 - this.offset.y,
//         0
//       );

//       this.renderer.render(this.scene, this.camera);
//       window.requestAnimationFrame(this.render.bind(this));
//     }
//   }

//   new WebGL();
// }

import * as THREE from "three";

export function glitchHover() {
  const vertexShader = `
    uniform vec2 uOffset;
    varying vec2 vUv;

    float M_PI = 3.141529;

    vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset){
        position.x = position.x + (sin(uv.y * M_PI) * offset.x);
        position.y = position.y + (sin(uv.x * M_PI) * offset.y);
        return position;
    }

    void main(){
        vUv = uv;
        vec3 newPosition = deformationCurve(position, uv, uOffset);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;

  // -- FRAGMENT SHADER WITH "COVER" UV ADJUSTMENT
  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform float uAlpha;
    uniform float uPlaneAspect; 
    uniform float uImageAspect; 
    varying vec2 vUv;

    void main(){
        vec2 uv = vUv;
        float ratio = uImageAspect / uPlaneAspect;

        if(ratio > 1.0) {
            // image is wider than plane, scale Y
            uv.y = uv.y * ratio - (ratio - 1.0) * 0.5;
        } else {
            // image is taller than plane, scale X
            float invRatio = 1.0 / ratio;
            uv.x = uv.x * invRatio - (invRatio - 1.0) * 0.5;
        }

        vec3 color = texture2D(uTexture, uv).rgb;
        gl_FragColor = vec4(color, uAlpha);
    }
  `;

  function lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  let targetX = 0;
  let targetY = 0;

  class WebGL {
    constructor() {
      this.container = document.body;
      this.links = [...document.querySelectorAll('[glitch-hover="item"]')];
      this.scene = new THREE.Scene();
      this.perspective = 1000;
      this.sizes = new THREE.Vector2(0, 0);
      this.offset = new THREE.Vector2(0, 0);

      // Default plane size
      const defaultWidth = 250.0;
      const defaultHeight = 350.0;
      const planeAspect = defaultWidth / defaultHeight;

      this.uniforms = {
        uTexture: { value: null },
        uAlpha: { value: 0.0 },
        uOffset: { value: new THREE.Vector2(0.0, 0.0) },
        uPlaneAspect: { value: planeAspect },
        uImageAspect: { value: 1.0 },
      };

      // Load each link's texture
      this.textures = this.links
        .map((link) => {
          const img = link.querySelector('[glitch-hover="img-wrap"] img');
          if (img) {
            return new THREE.TextureLoader().load(img.src);
          }
          console.error("Image not found in link:", link);
          return null;
        })
        .filter((t) => t);

      this.links.forEach((link, idx) => {
        if (!this.textures[idx]) return;
        const tex = this.textures[idx];

        link.addEventListener("mouseenter", () => {
          // optional custom data-width/height
          const dataWidth =
            parseFloat(link.getAttribute("data-width")) || defaultWidth;
          const dataHeight =
            parseFloat(link.getAttribute("data-height")) || defaultHeight;

          // scale plane
          this.mesh.scale.set(dataWidth, dataHeight, 1);
          // update planeAspect
          this.uniforms.uPlaneAspect.value = dataWidth / dataHeight;
          // set texture
          this.uniforms.uTexture.value = tex;
          // set imageAspect
          const imageWidth = tex.image.width;
          const imageHeight = tex.image.height;
          this.uniforms.uImageAspect.value = imageWidth / imageHeight;
          // fade in
          this.uniforms.uAlpha.value = 1.0;
        });

        link.addEventListener("mouseleave", () => {
          // fade out
          this.uniforms.uAlpha.value = 0.0;
        });
      });

      this.addEventListeners();
      this.setUpCamera();
      this.createMesh();
      this.render();
    }

    get viewport() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;
      return { width, height, aspectRatio };
    }

    addEventListeners() {
      window.addEventListener("resize", this.onWindowResize.bind(this));
      window.addEventListener("mousemove", this.handleMouseMove.bind(this));
    }

    setUpCamera() {
      const fov =
        (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) /
        Math.PI;
      this.camera = new THREE.PerspectiveCamera(
        fov,
        this.viewport.aspectRatio,
        0.1,
        1000
      );
      this.camera.position.set(0, 0, this.perspective);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(this.viewport.width, this.viewport.height);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      // Make sure the canvas doesn't block pointer interactions
      this.renderer.domElement.style.position = "fixed";
      this.renderer.domElement.style.top = "0";
      this.renderer.domElement.style.left = "0";
      // This allows clicks to pass through the canvas
      this.renderer.domElement.style.pointerEvents = "none";

      this.container.appendChild(this.renderer.domElement);
    }

    createMesh() {
      this.geometry = new THREE.PlaneGeometry(1, 1, 20, 20);
      this.material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
      });

      this.mesh = new THREE.Mesh(this.geometry, this.material);

      // Default scale
      const defaultWidth = 250;
      const defaultHeight = 350;
      this.mesh.scale.set(defaultWidth, defaultHeight, 1);

      this.scene.add(this.mesh);
    }

    handleMouseMove(e) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    onWindowResize() {
      this.camera.aspect = this.viewport.aspectRatio;
      this.camera.fov =
        (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) /
        Math.PI;
      this.renderer.setSize(this.viewport.width, this.viewport.height);
      this.camera.updateProjectionMatrix();
    }

    render() {
      // Smooth follow effect
      this.offset.x = lerp(this.offset.x, targetX, 0.1);
      this.offset.y = lerp(this.offset.y, targetY, 0.1);

      // subtle glitch offset
      this.uniforms.uOffset.value.set(
        (targetX - this.offset.x) * 0.0005,
        -(targetY - this.offset.y) * 0.0005
      );

      // position plane
      this.mesh.position.set(
        this.offset.x - this.viewport.width / 2,
        this.viewport.height / 2 - this.offset.y,
        0
      );

      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.render.bind(this));
    }
  }

  new WebGL();
}
