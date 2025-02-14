import { gsap } from "gsap";
import { windowScroll } from "../utils/windowScroll";

export function initLoadTransition() {
  // Check if it's the first visit
  const isFirstVisit = !sessionStorage.getItem("firstVisit");
  sessionStorage.setItem("firstVisit", "false");

  const pageLoader = document.querySelector(".page_loader");
  const brandLogo = document.querySelector('[data-page-load="brand-logo"]');
  const imgWraps = document.querySelectorAll(".page_loader_img_wrap");
  const loaderWrap = document.querySelector(".page_loader_wrap");
  const pageLoadTrigger = document.querySelector(".page_load_trigger");

  // Function to animate elements for the first visit
  const firstVisitAnimation = () => {
    gsap.set(pageLoader, { display: "block" });
    gsap.set(loaderWrap, { position: "absolute", top: 0, bottom: "auto" }); // Set to top

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("firstVisit", "false");
        pageLoader.style.display = "none";
      },
    });

    tl.to(brandLogo, { yPercent: 0, duration: 0.5 }, 0)
      .to(
        imgWraps,
        { scale: 1, duration: 1.6, stagger: 0.1, ease: "expo.out" },
        "-=0.2"
      )
      .to(
        brandLogo,
        { yPercent: -100, duration: 1, ease: "expo.inOut" },
        "-=0.8"
      )
      .to(
        imgWraps,
        { scale: 0, duration: 1, stagger: 0.1, ease: "expo.out" },
        "-=0.3"
      )
      .to(loaderWrap, { height: "0%", duration: 1, ease: "expo.out" }, "-=0.5")
      .add(() => {
        pageLoadTrigger.click();
      }, "-=0.751");
  };

  // Function to animate elements for page-to-page transitions
  const pageToPageTransition = (href) => {
    // Add immediate scroll reset
    window.scrollTo(0, 0);

    gsap.set(pageLoader, { display: "block" });
    gsap.set(brandLogo, { yPercent: 100 });
    gsap.set(imgWraps, { scale: 0 });
    gsap.set(loaderWrap, {
      position: "absolute",
      bottom: 0,
      top: "auto",
      height: "0%",
    }); // Set to bottom

    const tl = gsap.timeline({
      onComplete: () => {
        window.location.href = href;
      },
    });

    tl.to(loaderWrap, { height: "100%", duration: 0.8, ease: "expo.out" }, 0)
      .to(brandLogo, { yPercent: 0, duration: 1, ease: "expo.inOut" }, "-=1")
      .add(() => {
        pageLoadTrigger.click();
      }, "-=0.751");
  };

  // Event listener for internal link clicks
  document.querySelectorAll("a:not(.excluded-class)").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (
        link.hostname === window.location.hostname &&
        !href.includes("#") &&
        link.getAttribute("target") !== "_blank"
      ) {
        e.preventDefault();
        pageToPageTransition(href);
      }
    });
  });

  // On page load, determine which animation to run
  if (isFirstVisit) {
    firstVisitAnimation();
  } else {
    // Animation for back button navigation
    gsap.set(pageLoader, { display: "block" });
    gsap.set(loaderWrap, { position: "absolute", top: 0, bottom: "auto" });
    gsap.set(brandLogo, { yPercent: 0 });

    // INSTANT SCROLL BEFORE ANIMATION
    window.scrollTo(0, 0);

    const tl = gsap.timeline();
    tl.to(brandLogo, { yPercent: -100, duration: 1, ease: "expo.inOut" }, 0)
      .to(loaderWrap, { height: "0%", duration: 1, ease: "expo.out" }, "-=0.5")
      .set(pageLoader, { display: "none" })
      .add(() => {
        pageLoadTrigger.click();
      }, "-=0.751");
  }

  window.onpageshow = function (event) {
    if (event.persisted) {
      location.reload();
    }
  };
}
