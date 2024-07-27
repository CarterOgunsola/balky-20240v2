import { gsap } from "gsap";
import SplitType from "split-type";
import { Observe } from "../utils/observe";

class TextAnimation extends Observe {
  constructor(item) {
    const config = {
      margin: item.dataset.obsM || "10px",
      threshold: +item.dataset.obsT || 0,
      once: item.dataset.obsOnce === "true",
      aSplit: item.dataset.aSplit || "word",
      aDuration: item.dataset.aDuration ?? 1.9,
      aEach: item.dataset.aEach ?? 0.05,
      aDelay: item.dataset.aDelay ?? 0,
      aEase: item.dataset.aEase ?? "expo.out",
      aFrom: item.dataset.aFrom ?? "start",
    };

    super({ element: item, config });
    this.config = config;
    this.item = item;
    this.animated = returnSplit(item);

    this.a = { y: "120%", x: "0%" };
    gsap.set(this.animated, { y: this.a.y });
  }

  animateIn() {
    this.animation?.kill();
    this.animation = gsap.to(this.animated, {
      y: "0%",
      delay: this.config.aDelay,
      duration: this.config.aDuration,
      stagger: {
        each: this.config.aEach,
        from: this.config.aFrom,
      },
      ease: this.config.aEase,
    });
  }

  animateOut() {
    this.animation?.kill();
    this.animation = gsap.set(this.animated, { y: this.a.y });
  }
}

class StaggerText {
  constructor(selector) {
    this.selector = selector;
    this.reference = [...document.querySelectorAll(`[${selector}]`)];
    if (!this.reference) return;
    this.injectCss();
    this.init();
  }

  init() {
    this.animations = this.reference.map((item) => new TextAnimation(item));
  }

  injectCss() {
    const style = document.createElement("style");
    const styleString = `[${this.selector}] > div { overflow: hidden; }`;
    style.textContent = styleString;
    document.head.append(style);
  }
}

export { StaggerText };

function returnSplit(el) {
  switch (el.dataset.aSplit) {
    case "char":
      return splitChars(splitWords(el));
    case "word":
      return splitWords(splitWords(el));
    case "line":
      return splitLines(splitLines(el));
    default:
      return splitWords(splitWords(el));
  }
}

function splitChars(el) {
  return new SplitType(el, { types: "chars" }).chars;
}

function splitWords(el) {
  return new SplitType(el, { types: "words" }).words;
}

function splitLines(el) {
  return new SplitType(el, { types: "lines" }).lines;
}
