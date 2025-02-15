// splitTextUtil.js
import SplitType from "split-type";

export function splitText(el, type = "words") {
  const splitInstance = new SplitType(el, { types: type });

  switch (type) {
    case "chars":
      wrapElements(splitInstance.words, "word");
      wrapElements(splitInstance.chars, "char");
      injectCss(el, type);
      return splitInstance.chars;
    case "words":
      wrapElements(splitInstance.words, "word");
      injectCss(el, type);
      return splitInstance.words;
    case "lines":
      wrapElements(splitInstance.lines, "line");
      injectCss(el, type);
      return splitInstance.lines;
    default:
      wrapElements(splitInstance.words, "word");
      injectCss(el, type);
      return splitInstance.words;
  }
}

function wrapElements(elements, type) {
  elements.forEach((el) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add(type);
    wrapper.style.display = type === "line" ? "block" : "inline-block";
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  });
}

function injectCss(el, type) {
  const style = document.createElement("style");

  let styleString = "";

  if (type === "lines") {
    styleString = `
      [data-split-type="lines"] .line {
        overflow: hidden;
      }
    `;
  } else if (type === "words") {
    styleString = `
      [data-split-type="words"] .word {
        overflow: hidden;
      }
    `;
  } else if (type === "chars") {
    styleString = `
      [data-split-type="chars"] .char {
        overflow: hidden;
      }
    `;
  }

  style.textContent = styleString;
  document.head.append(style);
}
