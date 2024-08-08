import { splitText } from "../../utils/splitText";
import gsap from "gsap";

export const homeLoad = () => {
  const pageLoadTrigger = document.querySelector(".page_load_trigger");

  // Function to split text into lines based on the data attribute
  const splitTextElements = () => {
    document.querySelectorAll("[data-home-split]").forEach((el) => {
      const splitType = "lines"; // Always split into lines
      splitText(el, splitType);
    });
  };

  // Function to set the initial state of elements
  const setInitialState = () => {
    gsap.set("[data-home-split='hero-text'] .line", { y: 105 });
    gsap.set("[data-home-split='hero-pg'] .line", { y: 100 });
    gsap.set("[data-home-load='hero-scroll']", { opacity: 0, y: 50 });
    gsap.set("[data-home-load='hero-vid']", {
      opacity: 0.8,
      y: "14%",
      scale: 0.9,
    });
  };

  // Function to define GSAP animations
  const animateElements = () => {
    const tl = gsap.timeline();

    // Animating hero-text lines from y: 100 to y: 0
    tl.to("[data-home-split='hero-text'] .line", {
      y: 0,
      duration: 1.4,
      stagger: 0.1,
      ease: "expo.out",
    })

      // Animating hero-pg lines from y: 100 to y: 0 with overlap
      .to(
        "[data-home-split='hero-pg'] .line",
        {
          y: 0,
          duration: 1.4,
          stagger: 0.01,
          ease: "expo.out",
        },
        "-=1.4"
      )

      // Animating hero-scroll opacity and y position
      .to(
        "[data-home-load='hero-scroll']",
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
        },
        "-=0.9"
      )

      // Animating hero-vid opacity and y position
      .to(
        "[data-home-load='hero-vid']",
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scale: 1,
          ease: "expo.out",
        },
        "-=1"
      );

    console.log("Home page load animation triggered");
  };

  // Split text elements on page load
  splitTextElements();
  // Set initial state of elements on page load
  setInitialState();

  // Add event listener to trigger the animations
  pageLoadTrigger.addEventListener("click", () => {
    animateElements();
  });
};
