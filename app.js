(function () {
  function pad(n) { return String(n).padStart(2, "0"); }

  function monthAbbr(m) {
    // 0-based month
    const M = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    return M[m] || "JAN";
  }

  function dayAbbr(d) {
    const D = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    return D[d] || "SUN";
  }

  function format12h(date) {
    let h = date.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    const mm = pad(date.getMinutes());
    return `${h}:${mm} ${ampm}`;
  }

  function tick() {
    const now = new Date();

    // Example: THU, JAN 08 2026 • 11:48 AM
    const dateText = `${dayAbbr(now.getDay())}, ${monthAbbr(now.getMonth())} ${pad(now.getDate())} ${now.getFullYear()}`;
    const timeText = format12h(now);

    const d = document.getElementById("tcDateText");
    const t = document.getElementById("tcTimeText");
    if (d) d.textContent = dateText;
    if (t) t.textContent = timeText;
  }

  document.addEventListener("DOMContentLoaded", () => {
    tick();
    setInterval(tick, 1000); // keeps it automatic
  });
})();
