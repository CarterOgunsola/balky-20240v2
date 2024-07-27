import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(MorphSVGPlugin);

export function initClientLogoAnimation() {
  const defaultSVG = document.querySelector("#client-logo-default");

  document.querySelectorAll("[data-client-name]").forEach((client) => {
    client.addEventListener("mouseenter", () => handleHover(client));
    client.addEventListener("mouseleave", () => handleHoverOut());
  });

  function handleHover(client) {
    moveBox(client);
    morphSVG(client.getAttribute("data-client-name"));
  }

  function handleHoverOut() {
    resetBox();
    morphSVG("default");
  }

  function moveBox(client) {
    const targetClientRect = client.getBoundingClientRect();
    const containerRect = document
      .querySelector(".client_component_wrap")
      .getBoundingClientRect();

    gsap.to("[data-logo-box]", {
      duration: 0.5,
      y: targetClientRect.top - containerRect.top,
    });
  }

  function resetBox() {
    gsap.to("[data-logo-box]", {
      duration: 0.5,
      y: 0,
    });
  }

  function morphSVG(clientName) {
    const targetSVG = document.querySelector(
      `[data-client-logo="${clientName}"]`,
    );
    const targetPath = targetSVG
      ? targetSVG.querySelector("path").getAttribute("d")
      : defaultSVG.querySelector("path").getAttribute("d");
    const defaultPath = defaultSVG.querySelector("path").getAttribute("d");

    gsap.to(defaultSVG.querySelector("path"), {
      duration: 0.5,
      morphSVG: targetPath,
    });
  }
}
