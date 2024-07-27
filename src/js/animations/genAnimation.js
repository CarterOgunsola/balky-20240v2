import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const animationTypes = {
  "move-up": (element) => ({
    y: 0,
    opacity: 1,
  }),
  "move-up-fade": (element) => ({
    y: 0,
    opacity: 1,
  }),
  "move-up-scale": (element) => ({
    y: 0,
    scale: 1,
    opacity: 1,
  }),
  "move-up-scale-fade": (element) => ({
    y: 0,
    scale: 1,
    opacity: 1,
  }),
};

const initialStates = {
  "move-up": {
    y: 50,
    opacity: 0,
  },
  "move-up-fade": {
    y: 50,
    opacity: 0,
  },
  "move-up-scale": {
    y: 50,
    scale: 0.9,
    opacity: 0,
  },
  "move-up-scale-fade": {
    y: 50,
    scale: 0.9,
    opacity: 0,
  },
};

export function genAnimation() {
  const elements = document.querySelectorAll("[data-gen-animation]");

  elements.forEach((element) => {
    const animationType = element.getAttribute("data-gen-animation");
    const reset = element.getAttribute("data-reset") === "true";

    if (animationType && animationTypes[animationType]) {
      // Set the initial state of the element
      gsap.set(element, initialStates[animationType]);

      const animationConfig = animationTypes[animationType](element);

      const animate = () => {
        gsap.to(element, {
          ...animationConfig,
          duration: 1.4,
          ease: "expo.out",
        });
      };

      const resetAnimation = () => {
        gsap.set(element, initialStates[animationType]);
      };

      ScrollTrigger.create({
        trigger: element,
        start: "top bottom", // Adjust this value to control when the animation starts
        onEnter: animate,
        onEnterBack: animate,
        onLeave: reset ? resetAnimation : null,
        onLeaveBack: reset ? resetAnimation : null,
        markers: false, // Remove or set to false in production
      });
    }
  });
}
