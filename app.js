// app.js
(function () {
  // ====== Clock ======
  function pad(n) { return String(n).padStart(2, "0"); }

  function updateClock() {
    const d = new Date();
    const dateStr = d.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" });
    const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

    const elDate = document.getElementById("sysDate");
    const elTime = document.getElementById("sysTime");
    if (elDate) elDate.textContent = dateStr;
    if (elTime) elTime.textContent = timeStr;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ====== Hash jump + highlight (THIS fixes your mini-menu problem) ======
  function jumpToHash() {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const id = decodeURIComponent(hash.slice(1));
    const el = document.getElementById(id);
    if (!el) return;

    // Wait a moment so iPhone Safari layout is ready
    setTimeout(() => {
      try {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e) {
        el.scrollIntoView();
      }

      // flash highlight
      el.classList.remove("hashFlash");
      void el.offsetWidth; // reflow
      el.classList.add("hashFlash");
      setTimeout(() => el.classList.remove("hashFlash"), 1400);
    }, 120);
  }

  window.addEventListener("hashchange", jumpToHash);
  window.addEventListener("load", jumpToHash);
})();
