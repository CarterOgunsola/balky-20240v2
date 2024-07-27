export function initCursorHover() {
  const cursorDot = document.querySelector(".cursor_dot");
  const showCursorElements = document.querySelectorAll(
    '[data-element="show-cursor"]'
  );

  showCursorElements.forEach((element) => {
    element.addEventListener("mouseover", () => {
      cursorDot.classList.add("is--active");
    });

    element.addEventListener("mouseout", () => {
      cursorDot.classList.remove("is--active");
    });
  });
}
