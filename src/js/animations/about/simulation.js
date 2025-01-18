import Matter from "matter-js";

export function initSimulation() {
  const {
    Engine,
    Render,
    Events,
    MouseConstraint,
    Mouse,
    World,
    Bodies,
    Runner,
    Bounds,
    Body, // We'll need Body for scaling
  } = Matter;

  const GRAVITY_X = -0.4;
  const GRAVITY_Y = 0.1;

  let oldWidth, oldHeight; // for scaling references

  const engine = Engine.create();
  const world = engine.world;
  engine.gravity.x = GRAVITY_X;
  engine.gravity.y = GRAVITY_Y;

  const containerElement = document.querySelector(".tag-canvas");
  if (!containerElement) {
    console.error("Container element not found");
    return;
  }

  let containerWidth = containerElement.clientWidth + 2;
  let containerHeight = containerElement.clientHeight + 2;
  // Keep track of these for scaling
  oldWidth = containerWidth;
  oldHeight = containerHeight;

  const render = Render.create({
    element: containerElement,
    engine: engine,
    options: {
      width: containerWidth,
      height: containerHeight,
      pixelRatio: 2,
      background: "transparent",
      wireframes: false,
    },
  });

  let boundaries = [];

  const createStaticBoundary = (x, y, width, height, options) => {
    return Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      ...options,
    });
  };

  const createBoundaries = () => {
    boundaries.forEach((body) => World.remove(world, body));
    boundaries = [];

    const ground = createStaticBoundary(
      containerWidth / 2 + 160,
      containerHeight + 80,
      containerWidth + 320,
      160,
      { render: { fillStyle: "#1A1A1A" } }
    );
    const wallLeft = createStaticBoundary(
      -80,
      containerHeight / 2,
      160,
      containerHeight,
      {}
    );
    const wallRight = createStaticBoundary(
      containerWidth + 80,
      containerHeight / 2,
      160,
      containerHeight,
      {}
    );
    const roof = createStaticBoundary(
      containerWidth / 2 + 160,
      -80,
      containerWidth + 320,
      160,
      {}
    );

    boundaries.push(ground, wallLeft, wallRight, roof);
    World.add(world, boundaries);
  };

  // set up boundaries
  createBoundaries();

  const createTag = (text, width, height, url) => ({
    text,
    width,
    height,
    url,
  });

  const preloadImages = (tags) => {
    return Promise.all(
      tags.map(
        (tag) =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => {
              console.error(`Failed to load image: ${tag.url}`);
              reject(new Error(`Image load error for ${tag.url}`));
            };
            img.src = tag.url;
          })
      )
    );
  };

  // Sample tags
  const baseTags = [
    createTag(
      "B",
      214.4,
      284,
      "https://cdn.jsdelivr.net/gh/CarterOgunsola/balky-20240v2@master/src/assets/balky/b-balky.svg"
    ),
    createTag(
      "A",
      267.2,
      284,
      "https://cdn.jsdelivr.net/gh/CarterOgunsola/balky-20240v2@master/src/assets/balky/a-balky.svg"
    ),
    createTag(
      "L",
      175.6,
      284,
      "https://cdn.jsdelivr.net/gh/CarterOgunsola/balky-20240v2@master/src/assets/balky/l-balky.svg"
    ),
    createTag(
      "K",
      234,
      284,
      "https://cdn.jsdelivr.net/gh/CarterOgunsola/balky-20240v2@master/src/assets/balky/k-balky.svg"
    ),
    createTag(
      "Y",
      243.2,
      284,
      "https://cdn.jsdelivr.net/gh/CarterOgunsola/balky-20240v2@master/src/assets/balky/y-balky.svg"
    ),
    createTag(
      ".",
      56.8,
      55.6,
      "https://cdn.jsdelivr.net/gh/CarterOgunsola/balky-20240v2@master/src/assets/balky/dot-balky.svg"
    ),
  ];

  // Duplicate tags if you want more
  const tags = [];
  const duplicationFactor = 1.5;
  for (let i = 0; i < duplicationFactor; i++) {
    baseTags.forEach((tag) => {
      tags.push({ ...tag });
    });
  }

  const getRandomPosition = (maxWidth, maxHeight) => ({
    x: Math.random() * maxWidth,
    y: Math.random() * maxHeight,
  });
  const getRandomVelocity = () => ({
    x: (Math.random() - 0.5) * 10,
    y: (Math.random() - 0.5) * 10,
  });

  // Keep reference of all created tag bodies
  let tagBodies = [];

  preloadImages(tags)
    .then(() => {
      tagBodies = tags.map((tag) => {
        const position = getRandomPosition(containerWidth, containerHeight / 2);
        const velocity = getRandomVelocity();
        return Bodies.rectangle(position.x, position.y, tag.width, tag.height, {
          chamfer: { radius: 20 },
          render: { sprite: { texture: tag.url, xScale: 1, yScale: 1 } },
          velocity: { x: velocity.x, y: velocity.y },
        });
      });

      World.add(world, tagBodies);
      Runner.run(engine);
      Render.run(render);
    })
    .catch((error) => {
      console.error("Failed to load images:", error);
    });

  // Mouse constraints
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
  });
  World.add(world, mouseConstraint);
  render.mouse = mouse;

  // Remove default matter wheel events
  const removeEventListeners = () => {
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
  };
  removeEventListeners();

  // Simple click detection
  let click = false;
  const onMouseDown = () => (click = true);
  const onMouseMove = () => (click = false);
  const onMouseUp = () => console.log(click ? "click" : "drag");

  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  const resizeCanvas = () => {
    oldWidth = render.options.width;
    oldHeight = render.options.height;

    containerWidth = containerElement.clientWidth + 2;
    containerHeight = containerElement.clientHeight + 2;

    render.canvas.width = containerWidth * render.options.pixelRatio;
    render.canvas.height = containerHeight * render.options.pixelRatio;
    render.canvas.style.width = `${containerWidth}px`;
    render.canvas.style.height = `${containerHeight}px`;
    render.options.width = containerWidth;
    render.options.height = containerHeight;
  };

  // Option 1 (SIMPLE): Re-randomize positions or re-init everything on resize
  // Option 2 (SCALING): Scale all existing bodies so they fit within new container

  const scaleBodiesToFit = () => {
    // If old width or old height is 0, skip
    if (!oldWidth || !oldHeight) return;

    const scaleX = containerWidth / oldWidth;
    const scaleY = containerHeight / oldHeight;

    // For each body, scale the body geometry and reposition
    tagBodies.forEach((body) => {
      // Scale body shape
      Body.scale(body, scaleX, scaleY);

      // Reposition body according to scale
      const newX = body.position.x * scaleX;
      const newY = body.position.y * scaleY;
      Body.setPosition(body, { x: newX, y: newY });
    });
  };

  const handleResize = () => {
    resizeCanvas();
    // Optionally we can scale bodies to new container
    scaleBodiesToFit();
    // Then re-create boundaries
    createBoundaries();
  };

  window.addEventListener("resize", handleResize);

  // Cleanup
  return () => {
    document.removeEventListener("mousedown", onMouseDown);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    removeEventListeners();
    window.removeEventListener("resize", handleResize);
  };
}
