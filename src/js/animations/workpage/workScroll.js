import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const workScroll = () => {
  gsap.registerPlugin(ScrollTrigger);

  const click = document.getElementById("click");
  const mainImage = document.querySelector(".image_contain img");
  const firstWorkItem = document.querySelector(".work_item");
  const boxContentNum = document.querySelector(".box_content_num p");
  const boxContentName = document.querySelector(".box_content_name p");

  const updateImages = (currentItem) => {
    const allWorkItems = document.querySelectorAll(".work_item");
    allWorkItems.forEach((item) => item.classList.remove("active"));
    currentItem.classList.add("active");

    const workImage = currentItem.querySelector(".work_img");
    const workNum = currentItem.querySelector(".work_link_num .eyebrow");
    const workName = currentItem.querySelector(".work_link .h2"); // More specific selector

    if (workImage && mainImage) {
      mainImage.src = workImage.src;
      mainImage.srcset = workImage.srcset;
      mainImage.sizes = workImage.sizes;
    }

    if (workNum && boxContentNum) {
      boxContentNum.textContent = workNum.textContent;
    }

    if (workName && boxContentName) {
      boxContentName.textContent = workName.textContent;
    }

    if (click) {
      click.currentTime = 0;
      click.play().catch(() => {});
    }
  };

  // Set initial image and content
  if (mainImage && firstWorkItem) {
    const firstImage = firstWorkItem.querySelector(".work_img");
    if (firstImage) {
      mainImage.src = firstImage.src;
      mainImage.srcset = firstImage.srcset;

      // Simulate initial click
      updateImages(firstWorkItem);
    }
  }

  const workItems = document.querySelectorAll(".work_item");

  workItems.forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: "top center",
      end: "bottom center",
      onEnter: () => updateImages(item),
      onEnterBack: () => updateImages(item),
      toggleActions: "play none none reverse",
      scrub: 1,
    });
  });
};

export default workScroll;
