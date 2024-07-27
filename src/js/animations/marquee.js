import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// MARQUEE POWER-UP
export function initializeMarquee() {
  // attribute value checker
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
    if (attrVal === "true" && defaultValType === "boolean") return true;
    if (attrVal === "false" && defaultValType === "boolean") return false;
    if (isNaN(attrVal) && defaultValType === "string") return attrVal;
    if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
    return defaultVal;
  }

  // marquee component
  document
    .querySelectorAll("[tr-marquee-element='component']")
    .forEach((componentEl) => {
      const panelEls = componentEl.querySelectorAll(
        "[tr-marquee-element='panel']",
      );
      const triggerHoverEl = componentEl.querySelector(
        "[tr-marquee-element='triggerhover']",
      );
      const triggerClickEl = componentEl.querySelector(
        "[tr-marquee-element='triggerclick']",
      );

      let speedSetting = attr(
          100,
          componentEl.getAttribute("tr-marquee-speed"),
        ),
        verticalSetting = attr(
          false,
          componentEl.getAttribute("tr-marquee-vertical"),
        ),
        reverseSetting = attr(
          false,
          componentEl.getAttribute("tr-marquee-reverse"),
        ),
        scrollDirectionSetting = attr(
          false,
          componentEl.getAttribute("tr-marquee-scrolldirection"),
        ),
        scrollScrubSetting = attr(
          false,
          componentEl.getAttribute("tr-marquee-scrollscrub"),
        ),
        moveDistanceSetting = -100,
        timeScaleSetting = 1,
        pausedStateSetting = false;

      if (reverseSetting) moveDistanceSetting = 100;

      let marqueeTimeline = gsap.timeline({
        repeat: -1,
        onReverseComplete: () => marqueeTimeline.progress(1),
      });

      if (verticalSetting) {
        speedSetting = panelEls[0].offsetHeight / speedSetting;
        marqueeTimeline.fromTo(
          panelEls,
          { yPercent: 0 },
          {
            yPercent: moveDistanceSetting,
            ease: "none",
            duration: speedSetting,
          },
        );
      } else {
        speedSetting = panelEls[0].offsetWidth / speedSetting;
        marqueeTimeline.fromTo(
          panelEls,
          { xPercent: 0 },
          {
            xPercent: moveDistanceSetting,
            ease: "none",
            duration: speedSetting,
          },
        );
      }

      let scrubObject = { value: 1 };
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (!pausedStateSetting) {
            if (scrollDirectionSetting && timeScaleSetting !== self.direction) {
              timeScaleSetting = self.direction;
              marqueeTimeline.timeScale(self.direction);
            }
            if (scrollScrubSetting) {
              let v = self.getVelocity() * 0.006;
              v = gsap.utils.clamp(-60, 60, v);
              let scrubTimeline = gsap.timeline({
                onUpdate: () => marqueeTimeline.timeScale(scrubObject.value),
              });
              scrubTimeline.fromTo(
                scrubObject,
                { value: v },
                { value: timeScaleSetting, duration: 0.5 },
              );
            }
          }
        },
      });

      function pauseMarquee(isPausing) {
        pausedStateSetting = isPausing;
        let pauseObject = { value: 1 };
        let pauseTimeline = gsap.timeline({
          onUpdate: () => marqueeTimeline.timeScale(pauseObject.value),
        });
        if (isPausing) {
          pauseTimeline.fromTo(
            pauseObject,
            { value: timeScaleSetting },
            { value: 0, duration: 0.5 },
          );
          triggerClickEl?.classList.add("is-paused");
        } else {
          pauseTimeline.fromTo(
            pauseObject,
            { value: 0 },
            { value: timeScaleSetting, duration: 0.5 },
          );
          triggerClickEl?.classList.remove("is-paused");
        }
      }

      if (window.matchMedia("(pointer: fine)").matches) {
        triggerHoverEl?.addEventListener("mouseenter", () =>
          pauseMarquee(true),
        );
        triggerHoverEl?.addEventListener("mouseleave", () =>
          pauseMarquee(false),
        );
      }

      triggerClickEl?.addEventListener("click", function () {
        if (!triggerClickEl.classList.contains("is-paused")) {
          pauseMarquee(true);
        } else {
          pauseMarquee(false);
        }
      });
    });
}

// Initialize the marquee when the DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
  initializeMarquee();
});
