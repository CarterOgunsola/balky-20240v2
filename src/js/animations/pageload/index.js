import { splitText } from "../../utils/splitText";
import gsap from "gsap";

// Function to handle page load animation
function pageLoadAnimation() {
  const textElements = document.querySelectorAll("[data-page-load-split]");
  textElements.forEach((el) => {
    const splitType = el.dataset.splitType || "words";
    const splitContent = splitText(el, splitType);

    // Example animation using GSAP
    gsap.from(splitContent, {
      opacity: 0,
      y: 100,
      stagger: 0.05,
      duration: 1,
      ease: "power3.out",
    });
  });
}

// Run page load animation
window.addEventListener("load", () => {
  pageLoadAnimation();
});

export default pageLoadAnimation;
