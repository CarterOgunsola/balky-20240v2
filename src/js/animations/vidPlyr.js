// vidPlyr.js
import Plyr from "plyr"; // Assuming Plyr is installed via npm

/**
 * Initialize all Plyr video players
 */
export function initializeVideoPlayers() {
  // Select all elements with the class 'plyr_component'
  const plyrComponents = document.querySelectorAll(".plyr_component");

  plyrComponents.forEach((component) => {
    // Select the video element within the component
    const videoElement = component.querySelector(".plyr_video");

    // Create Plyr settings
    const player = new Plyr(videoElement, {
      controls: ["play", "progress", "current-time", "mute", "fullscreen"],
      resetOnEnd: true,
    });

    // Custom video cover click handler
    const cover = component.querySelector(".plyr_cover");
    cover.addEventListener("click", () => {
      player.play();
    });

    player.on("ended", () => {
      component.classList.remove("hide-cover");
    });

    // Pause other playing videos when this one starts playing
    player.on("play", () => {
      document.querySelectorAll(".plyr_component").forEach((cmp) => {
        cmp.classList.remove("hide-cover");
      });
      component.classList.add("hide-cover");

      const prevPlayingComponent = document.querySelector(
        ".plyr--playing:not(.plyr_component) .plyr_pause-trigger"
      );
      if (prevPlayingComponent) {
        prevPlayingComponent.click();
      }
    });

    // Pause the video when the pause trigger is clicked
    const pauseTrigger = component.querySelector(".plyr_pause-trigger");
    pauseTrigger.addEventListener("click", () => {
      player.pause();
    });

    // Exit full screen when the video ends
    player.on("ended", () => {
      if (player.fullscreen.active) {
        player.fullscreen.exit();
      }
    });

    // Set video to contain instead of cover when in full screen mode
    player.on("enterfullscreen", () => {
      component.classList.add("contain-video");
    });
    player.on("exitfullscreen", () => {
      component.classList.remove("contain-video");
    });
  });
}

export default initializeVideoPlayers;
