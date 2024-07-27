export class Observe {
  constructor({ element, config }) {
    this.element = element;
    this.config = {
      root: null,
      margin: config?.margin || "10px",
      threshold: config?.threshold || 0,
      once: config.once,
    };
    this.init();
    this.start();
  }

  init() {
    this.in = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) this.isIn();
        });
      },
      {
        rootMargin: this.config.margin,
        threshold: this.config.threshold,
      },
    );

    this.out = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) this.isOut();
        });
      },
      {
        rootMargin: "0px",
        threshold: 0,
      },
    );
  }

  start() {
    this.in.observe(this.element);
    this.out.observe(this.element);
  }

  stop() {
    this.in.unobserve(this.element);
    this.out.unobserve(this.element);
  }

  isIn() {
    this.animateIn();
    if (this.config.once) this.stop();
  }

  isOut() {
    this.animateOut();
  }
}
