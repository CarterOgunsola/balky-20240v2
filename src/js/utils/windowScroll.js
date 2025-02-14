export function windowScroll() {
  window.scrollTo(0, 0);
}

// Initialize scroll restoration
if (typeof window !== "undefined") {
  if (window.history.scrollRestoration) {
    window.history.scrollRestoration = "manual";
  }
}
