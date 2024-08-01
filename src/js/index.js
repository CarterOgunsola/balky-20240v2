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
import { initializeVideoPlayers } from "./animations/vidPlyr";
//import Math from "./animations/about/Math";
// import RGBShiftEffect from "./animations/about/RGBShiftEffect";
// import { initWipeEffect } from "./animations/imgWhipe";

// Function to check the current page
const isWorkPage = () => window.location.pathname === "/work";
const isAboutPage = () => window.location.pathname === "/about";
const isContactPage = () => window.location.pathname === "/contact";

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
  initializeVideoPlayers();

  // initWipeEffect();

  // Scripts specific to the /work page
  if (isWorkPage()) {
    initSwipers();
  }

  // Scripts specific to the /about page
  if (isAboutPage()) {
    initSimulation();
    initHeadline();
  }

  // Scripts specific to the /contact page
  if (isContactPage()) {
    initHeadline();
  }
});

console.log("Hello Balky!");
