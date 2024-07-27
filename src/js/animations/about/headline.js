import gsap from "gsap";
import SplitType from "split-type";

export function initHeadline() {
  // Function to split text into characters
  function splitText() {
    document
      .querySelectorAll('[data-element="headline"]')
      .forEach((headline) => {
        new SplitType(headline, { types: "chars" });
      });
  }

  // Initialize the text splitting
  splitText();

  const headlines = document.querySelectorAll('[data-element="headline"]');
  const headlineWrapper = document.querySelector(
    '[data-element="headline-wrapper"]'
  );
  let currentHeadlineIndex = 0;

  // Function to set initial positions of the headlines
  function setInitialPositions() {
    headlines.forEach((headline, index) => {
      if (index !== currentHeadlineIndex) {
        gsap.set(headline, { y: 100, autoAlpha: 0 });
      } else {
        gsap.set(headline, { y: 0, autoAlpha: 1 });
      }
    });
  }

  // Initialize positions
  setInitialPositions();

  function animateHeadlines() {
    const currentHeadline = headlines[currentHeadlineIndex];
    const nextHeadlineIndex = (currentHeadlineIndex + 1) % headlines.length;
    const nextHeadline = headlines[nextHeadlineIndex];

    // Split the text of the next headline
    splitText();

    // Animate current headline out and next headline in
    const tl = gsap.timeline({
      onComplete: () => {
        // Update the current headline index
        currentHeadlineIndex = nextHeadlineIndex;
        // Call the function again for the next iteration
        animateHeadlines();
      },
    });

    tl.to(currentHeadline, {
      y: -100,
      autoAlpha: 0,
      duration: 1.25,
      ease: "power3.inOut",
      delay: 0.5, // Add delay before animating out
      onComplete: () => {
        gsap.set(currentHeadline, { y: 100 });
      },
    }).fromTo(
      nextHeadline,
      { y: 100, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1.25,
        ease: "power3.inOut",
        delay: 0.5, // Add delay before animating in
      },
      0
    );
  }

  // Start the animation loop
  animateHeadlines();
}
