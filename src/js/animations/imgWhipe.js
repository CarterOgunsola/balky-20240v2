// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// export function initWipeEffect() {
//   const wipeElements = document.querySelectorAll('[data-element="img-wipe"]');

//   wipeElements.forEach((element) => {
//     gsap.fromTo(
//       element,
//       { height: "100%" },
//       {
//         height: "0%",
//         duration: 1,
//         ease: "power2.inOut",
//         scrollTrigger: {
//           trigger: element,
//           start: "top 75%", // Adjust as necessary
//           once: true, // Ensure the animation happens only once
//           toggleActions: "play none none none", // Play animation on enter
//         },
//       }
//     );
//   });
// }
