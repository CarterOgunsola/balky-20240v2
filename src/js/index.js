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
import workScroll from "./animations/workpage/workScroll";
import { glitchHover } from "./animations/glitchHover";
//start of page_load_triggers
import { homeLoad } from "./animations/pageload/homeLoad";
import { aboutLoad } from "./animations/pageload/aboutLoad";
import { customCursor } from "./animations/cursor";
import { windowScroll } from "./utils/windowScroll";
//end of page_load_triggers
//import Math from "./animations/about/Math";
// import RGBShiftEffect from "./animations/about/RGBShiftEffect";
// import { initWipeEffect } from "./animations/imgWhipe";

// Function to check the current page
const isHomePage = () => window.location.pathname === "/";
const isWorkPage = () => window.location.pathname === "/work";
const isWorkCmsPage = () => window.location.pathname.startsWith("/work/");
const isAboutPage = () => window.location.pathname === "/about";
const isContactPage = () => window.location.pathname === "/contact";

// Mandatory scripts to load first
window.addEventListener("DOMContentLoaded", () => {
  // Instant scroll before any other operations
  window.scrollTo(0, 0); // Instant version

  new StaggerText("data-a-split");
  initLoadTransition();
  // Page load animation
  //pageLoadAnimation();

  // General scripts for all pages

  NavLinkAnimations();

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
  customCursor();

  // initWipeEffect();

  // Scripts specific to the /home page
  if (isHomePage()) {
    homeLoad();
    gridImgClick();
  }

  // Scripts specific to the /work page
  if (isWorkPage()) {
    // initSwipers();
    // workScroll();
  }

  // Scripts specific to the /work/:slug page
  if (isWorkCmsPage()) {
    glitchHover();
  }

  // Scripts specific to the /about page
  if (isAboutPage()) {
    aboutLoad();
    initSimulation();
    initHeadline();
    glitchHover();
  }

  // Scripts specific to the /contact page
  if (isContactPage()) {
    initHeadline();
    glitchHover();
  }

  UnicornStudio.init();
  console.log("🚀 Crafted with passion by Balky Studio");
});

// Add popstate listener for back/forward navigation
window.addEventListener("popstate", () => {
  window.scrollTo(0, 0);
});
