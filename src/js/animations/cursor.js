import { gsap } from "gsap";

export function customCursor() {
  const cursorItem = document.querySelector("[cursor]");
  const cursorParagraph = cursorItem.querySelector("p");
  const targets = document.querySelectorAll("[data-cursor]");
  const xOffset = 6;
  const yOffset = 80;
  let cursorIsOnRight = false;
  let currentTarget = null;
  let lastText = "";

  // Position cursor relative to actual cursor position on page load
  gsap.set(cursorItem, { xPercent: xOffset, yPercent: yOffset });

  // Use GSAP quickTo for a more performant tween on the cursor
  const xTo = gsap.quickTo(cursorItem, "x", { ease: "power3" });
  const yTo = gsap.quickTo(cursorItem, "y", { ease: "power3" });

  // Function to get the width of the cursor element including a buffer
  const getCursorEdgeThreshold = () => {
    return cursorItem.offsetWidth + 16; // Cursor width + 16px margin
  };

  // On mousemove, call the quickTo functions to move the cursor
  window.addEventListener("mousemove", (e) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const cursorX = e.clientX;
    const cursorY = e.clientY + scrollY; // Adjust for scroll position

    // Default offsets
    let xPercent = xOffset;
    let yPercent = yOffset;

    // Adjust X offset dynamically based on cursor width
    const cursorEdgeThreshold = getCursorEdgeThreshold();
    if (cursorX > windowWidth - cursorEdgeThreshold) {
      cursorIsOnRight = true;
      xPercent = -100;
    } else {
      cursorIsOnRight = false;
    }

    // Adjust Y offset if in the bottom 10% of the current viewport
    if (cursorY > scrollY + windowHeight * 0.9) {
      yPercent = -120;
    }

    if (currentTarget) {
      const newText = currentTarget.getAttribute("data-cursor");
      if (newText !== lastText) {
        cursorParagraph.innerHTML = newText;
        lastText = newText;

        // Recalculate edge awareness whenever the text changes
        const cursorEdgeThreshold = getCursorEdgeThreshold();
      }
    }

    gsap.to(cursorItem, {
      xPercent: xPercent,
      yPercent: yPercent,
      duration: 0.9,
      ease: "power3",
    });
    xTo(cursorX);
    yTo(cursorY - scrollY);
  });

  // Add a mouseenter listener for each link that has a data-cursor attribute
  targets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      currentTarget = target; // Set the current target

      const newText = target.getAttribute("data-cursor");

      if (newText !== lastText) {
        cursorParagraph.innerHTML = newText;
        lastText = newText;
      }
    });
  });
}
