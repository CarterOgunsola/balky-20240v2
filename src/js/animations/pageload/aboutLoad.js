import { splitText } from "../../utils/splitText";
import gsap from "gsap";

export const aboutLoad = () => {
  const pageLoadTrigger = document.querySelector(".page_load_trigger");

  // Function to split text into lines based on the data attribute
  const splitTextElements = () => {
    document.querySelectorAll("[data-about-split]").forEach((el) => {
      const splitType = "lines"; // Always split into lines
      splitText(el, splitType);
    });
  };

  // Function to set the initial state of elements
  const setInitialState = () => {
    gsap.set("[data-about-split='hero-pg'] .line", { y: 100 });
    gsap.set("[data-about-load='hero-toggle']", { y: "100%" });
    gsap.set("[data-about-load='hero-canvas']", { opacity: 0 });
  };

  // Function to define GSAP animations
  const animateElements = () => {
    const tl = gsap.timeline();

    // Animating hero-pg lines from y: 100 to y: 0
    tl.to(
      "[data-about-split='hero-pg'] .line",
      {
        y: 0,
        duration: 1.6,
        stagger: 0.06,
        ease: "expo.out",
      },
      "-=0.2"
    )

      // Animating hero-toggle y position
      .to(
        "[data-about-load='hero-toggle']",
        {
          y: "0%",
          duration: 1.4,
          ease: "expo.out",
        },
        "-=1"
      )

      // Animating hero-canvas opacity
      .to(
        "[data-about-load='hero-canvas']",
        {
          opacity: 1,
          duration: 4,
          ease: "expo.out",
        },
        "-=1.2"
      );

    console.log("About page load animation triggered");
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
