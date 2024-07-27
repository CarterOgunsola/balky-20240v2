import Swiper from "swiper";
import "swiper/swiper-bundle.css";
import {
  Navigation,
  Pagination,
  Scrollbar,
  Mousewheel,
  EffectFade,
  FreeMode,
  Parallax,
} from "swiper/modules";

export function initCmsSwiper() {
  const cmsImgSwiper = new Swiper(".swiper.is-work-cms", {
    modules: [Navigation, FreeMode, Parallax],
    direction: "horizontal",
    freeMode: true,
    slidesPerView: "auto",
    loop: false,
    loopFillGroupWithBlank: true,
    speed: 800,
    grabCursor: true,
    parallax: true,
    on: {
      touchStart: () => {
        document
          .querySelectorAll(".swiper-slide.is-work-cms")
          .forEach((slide) => {
            slide.classList.add("is--scaling");
          });
      },
      touchMove: () => {
        document
          .querySelectorAll(".swiper-slide.is-work-cms")
          .forEach((slide) => {
            slide.classList.add("is--scaling");
          });
      },
      touchEnd: () => {
        document
          .querySelectorAll(".swiper-slide.is-work-cms")
          .forEach((slide) => {
            slide.classList.remove("is--scaling");
          });
      },
    },
  });
}
