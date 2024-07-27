import gsap from "gsap";

const navLink = ".nav_link_item";
const navLinkTextRel = ".nav_link_text_rel";
const navLinkTextAb = ".nav_link_text_ab";

// Handle mouse enter hover
const handleMouseEnter = (event) => {
  const navTextRel = event.currentTarget.querySelector(navLinkTextRel);
  const navTextAb = event.currentTarget.querySelector(navLinkTextAb);

  // Rollover animation for both navText
  gsap.to(navTextRel, {
    yPercent: -120,
    rotation: 3,
    duration: 0.7,
    ease: "expo.out",
  });

  gsap.fromTo(
    navTextAb,
    {
      yPercent: 100,
      rotation: -3,
    },
    {
      yPercent: 0,
      rotation: 0,
      duration: 0.7,
      ease: "expo.out",
    }
  );
};

// Handle mouse leave hover
const handleMouseLeave = (event) => {
  const navTextRel = event.currentTarget.querySelector(navLinkTextRel);
  const navTextAb = event.currentTarget.querySelector(navLinkTextAb);

  // Reverse rollover animation for both
  gsap.fromTo(
    navTextRel,
    {
      yPercent: -120,
      rotation: 3,
    },
    {
      yPercent: 0,
      rotation: 0,
      duration: 0.7,
      ease: "expo.out",
    }
  );

  gsap.to(navTextAb, {
    yPercent: 120,
    rotation: -3,
    duration: 0.7,
    ease: "expo.out",
  });
};

// Setup function to add event listeners to all nav links
const NavLinkAnimations = () => {
  document.querySelectorAll(navLink).forEach((link) => {
    link.addEventListener("mouseenter", handleMouseEnter);
    link.addEventListener("mouseleave", handleMouseLeave);
  });
};

// Export the setup function
export default NavLinkAnimations;
