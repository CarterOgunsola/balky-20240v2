// src/js/animations/about/simulation.js
import Matter from "matter-js";

export function initSimulation() {
  const { Engine, Render, Events, MouseConstraint, Mouse, World, Bodies } =
    Matter;

  const GRAVITY_X = -0.4;
  const GRAVITY_Y = 0.1;

  const engine = Engine.create();
  const world = engine.world;

  engine.world.gravity.y = GRAVITY_Y;
  engine.world.gravity.x = GRAVITY_X;

  const containerElement = document.querySelector(".tag-canvas");
  if (!containerElement) {
    console.error("Container element not found");
    return;
  }

  let containerWidth = containerElement.clientWidth + 2;
  let containerHeight = containerElement.clientHeight + 2;

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

  const createStaticBoundary = (x, y, width, height, options) => {
    return Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      ...options,
    });
  };

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

  const createTag = (text, width, height, url) => ({
    text,
    width,
    height,
    url,
  });

  const baseTags = [
    createTag(
      "B",
      214.4,
      284,
      "https://uploads-ssl.webflow.com/664668a37ea0579ad7c8e569/6671d0a5392ce8923e0202e2_B.svg"
    ),
    createTag(
      "A",
      267.2,
      284,
      "https://uploads-ssl.webflow.com/664668a37ea0579ad7c8e569/6671d0a502ea4848a1274be9_A.svg"
    ),
    createTag(
      "L",
      175.6,
      284,
      "https://uploads-ssl.webflow.com/664668a37ea0579ad7c8e569/6671d0a5f6cb4831eba1db0d_L.svg"
    ),
    createTag(
      "K",
      234,
      284,
      "https://uploads-ssl.webflow.com/664668a37ea0579ad7c8e569/6671d0a5464359cfc10df5b2_k.svg"
    ),
    createTag(
      "Y",
      243.2,
      284,
      "https://uploads-ssl.webflow.com/664668a37ea0579ad7c8e569/669c14378b54150bedb63f77_balky-y.svg"
    ),
    createTag(
      ".",
      56.8,
      55.6,
      "https://uploads-ssl.webflow.com/664668a37ea0579ad7c8e569/669c1437d80044ae7c9877ae_b-dot.svg"
    ),
  ];

  const tags = [];
  const duplicationFactor = 1.5;
  for (let i = 0; i < duplicationFactor; i++) {
    baseTags.forEach((tag) => tags.push({ ...tag }));
  }

  const getRandomPosition = (maxWidth, maxHeight) => ({
    x: Math.random() * maxWidth,
    y: Math.random() * maxHeight,
  });
  const getRandomVelocity = () => ({
    x: (Math.random() - 0.5) * 10,
    y: (Math.random() - 0.5) * 10,
  });

  const tagBodies = tags.map((tag) => {
    const position = getRandomPosition(containerWidth, containerHeight / 2);
    const velocity = getRandomVelocity();
    return Bodies.rectangle(position.x, position.y, tag.width, tag.height, {
      chamfer: { radius: 20 },
      render: { sprite: { texture: tag.url, xScale: 1, yScale: 1 } },
      velocity: { x: velocity.x, y: velocity.y },
    });
  });

  World.add(engine.world, [ground, wallLeft, wallRight, roof, ...tagBodies]);

  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: { stiffness: 0.2, render: { visible: false } },
  });

  World.add(world, mouseConstraint);
  render.mouse = mouse;

  const removeEventListeners = () => {
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
  };

  removeEventListeners();

  let click = false;
  const onMouseDown = () => (click = true);
  const onMouseMove = () => (click = false);
  const onMouseUp = () => console.log(click ? "click" : "drag");

  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  Events.on(mouseConstraint, "mouseup", (event) => {
    const mouseConstraint = event.source;
    const bodies = engine.world.bodies;
    if (!mouseConstraint.bodyB) {
      for (let body of bodies) {
        if (
          click &&
          Matter.Bounds.contains(body.bounds, mouseConstraint.mouse.position)
        ) {
          const bodyUrl = body.render.sprite.texture;
          if (bodyUrl) {
            window.open(bodyUrl, "_blank");
          }
          break;
        }
      }
    }
  });

  Engine.run(engine);
  Render.run(render);

  const resizeCanvas = () => {
    containerWidth = containerElement.clientWidth + 2;
    containerHeight = containerElement.clientHeight + 2;
    render.canvas.width = containerWidth * render.options.pixelRatio;
    render.canvas.height = containerHeight * render.options.pixelRatio;
    render.canvas.style.width = `${containerWidth}px`;
    render.canvas.style.height = `${containerHeight}px`;
    render.options.width = containerWidth;
    render.options.height = containerHeight;
  };

  window.addEventListener("resize", () => {
    resizeCanvas();
    // You may need to reposition and resize the bodies
  });

  // Cleanup event listeners when simulation is stopped or reinitialized
  return () => {
    document.removeEventListener("mousedown", onMouseDown);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    removeEventListeners();
    window.removeEventListener("resize", resizeCanvas);
  };
}
