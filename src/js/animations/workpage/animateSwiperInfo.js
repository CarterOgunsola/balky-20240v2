import gsap from "gsap";
import { splitText } from "../../utils/splitText";

function animateSwiperInfoIn(el) {
  const infoNameElement = el.querySelector('[data-element="info-name"]');
  const infoBtnElement = el.querySelector('[data-element="info-btn"]');

  if (infoNameElement) {
    const chars = splitText(infoNameElement, "chars");
    gsap.fromTo(
      chars,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.01, duration: 0.8, ease: "power2.inOut" },
    );
  }

  if (infoBtnElement) {
    gsap.fromTo(
      infoBtnElement,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, delay: 0.1, duration: 0.8, ease: "power2.inOut" },
    );
  }
}

function animateSwiperInfoOut(el) {
  const chars = el.querySelectorAll('[data-element="info-name"] .char');
  const infoBtnElement = el.querySelector('[data-element="info-btn"]');

  if (chars.length > 0) {
    gsap.to(chars, {
      y: 100,
      opacity: 0,
      stagger: 0.01,
      duration: 0.3,
      ease: "power2.in",
    });
  }

  if (infoBtnElement) {
    gsap.to(infoBtnElement, {
      y: 100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });
  }
}

export { animateSwiperInfoIn, animateSwiperInfoOut };
