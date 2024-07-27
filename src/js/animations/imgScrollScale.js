import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function imgScrollScale() {
  const scaleImgItems = document.querySelectorAll(".scale_img_item");

  if (scaleImgItems.length === 0) return;

  gsap.set(scaleImgItems, { scale: 0 });

  const animateScale = () => {
    gsap.to(scaleImgItems, {
      scale: 1,
      duration: 1.6,
      ease: "expo.out",
      stagger: {
        each: 0.02,
        from: "random",
      },
    });
  };

  const resetScale = () => {
    gsap.set(scaleImgItems, { scale: 0 });
  };

  ScrollTrigger.create({
    trigger: ".img_scale_main",
    delay: 0.2,
    start: "top 100%", // Adjust this value to control when the animation starts
    onEnter: animateScale,
    onEnterBack: animateScale,
    onLeave: resetScale,
    onLeaveBack: resetScale,
    markers: false, // Remove or set to false in production
  });
}
