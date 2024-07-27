import "../styles/index.css";
import { showBody } from "./animations/starter";
import pageLoadAnimation from "./animations/pageload";
import { StaggerText } from "./animations/splitAnimation";
import NavLinkAnimations from "./animations/nav";
import { gridImgClick } from "./animations/imageScale";
import { initClientLogoAnimation } from "./animations/clientLogo";
import { initializeMarquee } from "./animations/marquee";
import initializeWebGLEffects from "./animations/webglEffect";
// Import the swiper initialization but do not run it immediately
import { initSwipers } from "./animations/workpage/workSlide";
import { initCmsSwiper } from "./animations/workcms/cmsImgSlide";
import { initProjectNavHover } from "./animations/workcms/projectNav";
import { initCursorHover } from "./animations/workcms/cursorHover";
import { initSimulation } from "./animations/about/simulation";
import { initHeadline } from "./animations/about/headline";
import { imgScrollScale } from "./animations/imgScrollScale";
import { genAnimation } from "./animations/genAnimation";
import { utahTime } from "./animations/utahTime";
import { initLoadTransition } from "./animations/loadTransition";
//import Math from "./animations/about/Math";
// import RGBShiftEffect from "./animations/about/RGBShiftEffect";
// import { initWipeEffect } from "./animations/imgWhipe";

// Function to check the current page
const isWorkPage = () => window.location.pathname === "/work";
const isAboutPage = () => window.location.pathname === "/about";

// Mandatory scripts to load first
window.addEventListener("DOMContentLoaded", () => {
  new StaggerText("data-a-split");

  initLoadTransition();
  // Page load animation
  pageLoadAnimation();

  // General scripts for all pages
  NavLinkAnimations();
  gridImgClick();
  initClientLogoAnimation();
  initializeMarquee();
  initializeWebGLEffects();
  initCmsSwiper();
  initProjectNavHover();
  initCursorHover();
  imgScrollScale();
  genAnimation();
  utahTime();

  // initWipeEffect();

  // Scripts specific to the /work page
  if (isWorkPage()) {
    initSwipers();
  }

  // Scripts specific to the /work page
  if (isAboutPage()) {
    initSimulation();
    initHeadline();
    // document.addEventListener("DOMContentLoaded", () => {
    //   const containerElement = document.querySelector(".tag-canvas");

    //   const observer = new IntersectionObserver((entries, observer) => {
    //     entries.forEach((entry) => {
    //       if (entry.isIntersecting) {
    //         initSimulation();
    //         observer.disconnect();
    //       }
    //     });
    //   }, {});

    //   observer.observe(containerElement);
    // });

    //RGBShiftEffect starts here
    // Initialize RGBShiftEffect
    // const container = document.getElementById("container");
    // const itemsWrapper = container;
    // const rgbShiftEffect = new RGBShiftEffect(container, itemsWrapper);
    //RGBShiftEffect ends here
  }
});

console.log("Hello Balky!");
