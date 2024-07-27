import Swiper from "swiper";
import "swiper/swiper-bundle.css";
import {
  Navigation,
  Pagination,
  Scrollbar,
  Mousewheel,
  EffectFade,
  Parallax,
} from "swiper/modules";
import { splitText } from "../../utils/splitText";
import gsap from "gsap";
import Flip from "gsap/Flip";

gsap.registerPlugin(Flip);

const animationConfig = {
  outY: "80%",
  outOpacity: 0.2,
  inY: "0%",
  inOpacity: 1,
  stagger: 0.004,
  duration: 0.8,
  ease: "power3.out",
};

export function initSwipers() {
  const { outY, outOpacity, inY, inOpacity, stagger, duration, ease } =
    animationConfig;

  const infoSwiper = new Swiper(".swiper.is-info", {
    modules: [
      Navigation,
      Pagination,
      Scrollbar,
      Mousewheel,
      Parallax,
      EffectFade,
    ],
    slidesPerView: 1,
    centeredSlides: true,
    speed: 0,
    effect: "fade",
    fadeEffect: { crossFade: true },
    loop: false,
    allowTouchMove: false,
  });

  const mainSwiper = new Swiper(".swiper.is-main", {
    modules: [Navigation, Pagination, Scrollbar, Mousewheel, Parallax],
    slidesPerView: "auto",
    centeredSlides: true,
    direction: "vertical",
    spaceBetween: 16,
    loop: false,
    allowTouchMove: true,
    grabCursor: true,
    loopFillGroupWithBlank: true,
    mousewheel: { invert: false, forceToAxis: true },
    slideActiveClass: "is-active",
    slideDuplicateActiveClass: "is-active",
    speed: 800,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    parallax: true,
    resistance: true,
  });

  const animateChars = (chars, yValue, opacityValue) => {
    gsap.to(chars, {
      y: yValue,
      opacity: opacityValue,
      stagger,
      duration,
      ease,
    });
  };

  const updateActiveThumb = (index) => {
    const thumbItems = document.querySelectorAll(".thumb_cms_item");
    thumbItems.forEach((item, i) => {
      if (i === index) item.classList.add("is--active");
      else item.classList.remove("is--active");
    });
  };

  const moveCorners = (target) => {
    const corners = document.querySelector(".thumb_corners");
    const state = Flip.getState(corners);
    target.appendChild(corners);
    Flip.from(state, { duration: 0.5, ease: "power1.inOut" });
  };

  let isClicking = false;

  mainSwiper.on("slideChange", function () {
    const activeIndex = mainSwiper.realIndex;
    infoSwiper.slideTo(activeIndex);
    updateActiveThumb(activeIndex);

    infoSwiper.slides.forEach((slide) => {
      if (!slide.classList.contains("swiper-slide-active")) {
        const chars = slide.querySelectorAll(".char");
        animateChars(chars, outY, outOpacity);
      }
    });

    const activeSlide = infoSwiper.slides[infoSwiper.activeIndex];
    const activeChars = activeSlide.querySelectorAll(".char");
    animateChars(activeChars, inY, inOpacity);
  });

  const initialActiveIndex = mainSwiper.realIndex;
  infoSwiper.slideTo(initialActiveIndex);
  updateActiveThumb(initialActiveIndex);

  const elementsToSplit = document.querySelectorAll('[data-split-type="char"]');
  elementsToSplit.forEach((el) => {
    const chars = splitText(el, "chars");
    gsap.set(chars, { y: outY, opacity: outOpacity });
  });

  const activeSlide = infoSwiper.slides[infoSwiper.activeIndex];
  const activeChars = activeSlide.querySelectorAll(".char");
  animateChars(activeChars, inY, inOpacity);

  const divs = document.querySelectorAll(".thumb_cms_item [data-swiper-name]");
  const setupEventListeners = () => {
    divs.forEach((div, index) => {
      div.addEventListener("click", () => handleClick(div));
      div.parentElement.addEventListener("mouseenter", () =>
        moveCorners(div.parentElement)
      );
      div.parentElement.addEventListener("mouseleave", () =>
        handleMouseLeave()
      );
    });
  };

  setupEventListeners();

  const handleClick = (div) => {
    const swiperName = div.getAttribute("data-swiper-name");
    const targetSlideIndex = [...mainSwiper.slides].findIndex(
      (slide) => slide.getAttribute("data-swiper-name") === swiperName
    );

    if (targetSlideIndex !== -1) {
      isClicking = true;
      mainSwiper.slideTo(targetSlideIndex);
      moveCorners(div.parentElement);
      setTimeout(() => {
        isClicking = false;
      }, 500);
    }
  };

  const handleMouseLeave = () => {
    const activeThumb = document.querySelector(".thumb_cms_item.is--active");
    if (activeThumb) moveCorners(activeThumb);
  };

  const observer = new MutationObserver((mutations) => {
    if (!isClicking) {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" &&
          mutation.target.classList.contains("is--active")
        ) {
          moveCorners(mutation.target);
        }
      });
    }
  });

  const thumbItems = document.querySelectorAll(".thumb_cms_item");
  thumbItems.forEach((item) => {
    observer.observe(item, { attributes: true, attributeFilter: ["class"] });
  });

  const initialActiveThumb = document.querySelector(
    ".thumb_cms_item.is--active"
  );
  if (initialActiveThumb) moveCorners(initialActiveThumb);
}
