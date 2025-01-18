import { gsap } from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

const config = {
  zIndex: 10,
  returnDelay: 500, // milliseconds
  imgScaleUp: 1.2,
  imgScaleDown: 1,
  imgScaleDuration: 0.4, // seconds
  mainAnimationDuration: 0.8, // seconds
  ease: "power2.inOut",
  blackAndWhiteDuration: 0.5, // seconds,
};

let activeElement = null;
let previousActiveElement = null;
let returnTimeout = null;
let isAnimating = false; // Flag to track animation status

export function gridImgClick() {
  const mainElements = document.querySelectorAll('[data-scale-img="main"]');
  const wrapper = document.querySelector('[data-scale-img="wrapper"]');

  if (!wrapper) {
    console.error("Wrapper element not found");
    return;
  }

  mainElements.forEach((main) => {
    main.addEventListener("click", (event) => {
      // Prevent activating another element during animation
      if (isAnimating) return;

      event.stopPropagation(); // Prevent click event from propagating to the document
      if (returnTimeout) {
        clearTimeout(returnTimeout);
        returnTimeout = null;
      }

      const target = document.querySelector('[data-scale-img="target"]');
      if (!target) {
        console.error("Target element not found");
        return;
      }

      // Handle active element logic
      if (activeElement === main) {
        returnToOriginal(activeElement, wrapper);
        activeElement = null;
        return; // Already active, revert back to original state
      }

      if (activeElement) {
        previousActiveElement = activeElement;
        returnToOriginal(previousActiveElement, wrapper, true);
      }

      activeElement = main;
      const img = main.querySelector('[data-scale-img="img"]');
      if (!img) {
        console.error("Image element not found inside main element");
        return;
      }

      gsap.set(main, { zIndex: config.zIndex + 1 }); // Set the active element above others
      if (previousActiveElement && previousActiveElement !== main) {
        gsap.set(previousActiveElement, { zIndex: config.zIndex });
      }

      wrapper.classList.add("is--active");

      const state = Flip.getState(main);
      isAnimating = true; // Set animation flag to true

      const tl = gsap.timeline();

      tl.to(img, {
        scale: config.imgScaleUp,
        duration: config.imgScaleDuration,
        ease: config.ease,
      }).to(img, {
        scale: config.imgScaleDown,
        duration: config.imgScaleDuration,
        ease: config.ease,
      });

      Flip.fit(main, target, { scale: true });

      Flip.from(state, {
        duration: config.mainAnimationDuration,
        ease: config.ease,
        scale: true,
        onComplete: () => {
          isAnimating = false; // Reset animation flag
          gsap.set(img, { scale: config.imgScaleDown });
        },
      });

      gsap.to(mainElements, {
        filter: "grayscale(0%)",
        duration: config.blackAndWhiteDuration,
        ease: config.ease,
        onComplete: () => {
          gsap.to(main, { filter: "none" });
        },
      });
    });
  });

  document.addEventListener("click", () => {
    if (activeElement && !isAnimating) {
      returnToOriginal(activeElement, wrapper);
      activeElement = null;
    }
  });

  wrapper.addEventListener("click", () => {
    if (activeElement && !isAnimating) {
      returnToOriginal(activeElement, wrapper);
      activeElement = null;
    }
  });
}

function returnToOriginal(element, wrapper, keepHighZIndex = false) {
  const state = Flip.getState(element);
  const img = element.querySelector('[data-scale-img="img"]');
  isAnimating = true; // Set animation flag to true

  // Ensure the wrapper class is removed after the return animation completes
  gsap.to(wrapper, {
    // delay: config.returnDelay / 3000, // Convert milliseconds to seconds
    delay: 0.05, // Convert milliseconds to seconds
    onComplete: () => {
      wrapper.classList.remove("is--active");
    },
  });

  // Reset styles for the returning element
  gsap.set(element, { clearProps: "all" });

  if (img) {
    gsap.set(img, { scale: config.imgScaleDown });
  }

  // Animate back to original position using Flip
  Flip.from(state, {
    // duration: config.mainAnimationDuration,
    duration: config.mainAnimationDuration / 1.2,
    ease: config.ease,
    scale: true,
    onComplete: () => {
      isAnimating = false; // Reset animation flag
      if (!keepHighZIndex) {
        gsap.set(element, { zIndex: "" });
      } else {
        setTimeout(() => {
          gsap.set(element, { zIndex: "" });
        }, config.mainAnimationDuration * 1000);
      }
    },
  });

  // Temporarily increase z-index of the returning element
  gsap.set(element, { zIndex: config.zIndex + 1 });
}
