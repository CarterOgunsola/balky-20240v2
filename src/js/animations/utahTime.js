export function utahTime() {
  const elements = document.querySelectorAll('[data-time="utah"]');

  const getTimeInUtah = () => {
    const now = new Date();
    const options = {
      timeZone: "America/Denver",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    const formatter = new Intl.DateTimeFormat([], options);
    return formatter.format(now);
  };

  elements.forEach((element) => {
    const updateTime = () => {
      const timeString = getTimeInUtah();
      const [hours, minutes, seconds] = timeString.split(":");
      element.innerHTML = `${hours}<span class="colon" id="colon1">:</span>${minutes}<span class="colon" id="colon2">:</span>${seconds}`;
    };

    setInterval(updateTime, 1000);

    // Initial update to avoid delay
    updateTime();
  });

  setInterval(() => {
    const colon1 = document.querySelectorAll("#colon1");
    colon1.forEach((colon) => {
      colon.classList.toggle("hidden");
    });
  }, 500);

  setTimeout(() => {
    setInterval(() => {
      const colon2 = document.querySelectorAll("#colon2");
      colon2.forEach((colon) => {
        colon.classList.toggle("hidden");
      });
    }, 500);
  }, 250);
}
