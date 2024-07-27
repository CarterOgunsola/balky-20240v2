// Import GSAP library
import { gsap } from "gsap";

// Function to initialize hover animations
export function initProjectNavHover() {
  // Select all project-nav elements
  const projectNavs = document.querySelectorAll('[data-element="project-nav"]');

  // Iterate through each project-nav element
  projectNavs.forEach((nav) => {
    // Select the project-nav-img element inside the current project-nav
    const navImg = nav.querySelector('[data-element="project-nav-img"]');

    // Select the project-nav-text element inside the current project-nav
    const navText = nav.querySelector('[data-element="project-nav-text"]');

    // Get the class name from the data-element-class attribute
    const className = navText
      ? navText.getAttribute("data-element-class")
      : null;

    // Add hover in animation
    nav.addEventListener("mouseenter", () => {
      // Animate the height of navImg
      gsap.fromTo(
        navImg,
        { height: "0rem", y: "100%" },
        { height: "auto", y: "0%", duration: 0.7, ease: "expo.out" }
      );

      // Add the class to navText if it exists and has a class name
      if (navText && className) {
        navText.classList.add(className);
      }
    });

    // Add hover out animation
    nav.addEventListener("mouseleave", () => {
      // Animate the height of navImg
      gsap.to(navImg, {
        height: "0rem",
        y: "100%",
        duration: 0.5,
        ease: "expo.out",
      });

      // Remove the class from navText if it exists and has a class name
      if (navText && className) {
        navText.classList.remove(className);
      }
    });
  });
}
