(function () {
  function fmtTime(d) {
    const days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

    const day = days[d.getDay()];
    const mon = months[d.getMonth()];
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();

    let h = d.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12; if (h === 0) h = 12;
    const mm = String(d.getMinutes()).padStart(2, "0");

    return `${day} • ${mon} ${dd} ${yyyy} • ${h}:${mm} ${ampm}`;
  }

  function tick() {
    const el = document.getElementById("tcTime");
    if (el) el.textContent = fmtTime(new Date());
  }

  tick();
  setInterval(tick, 1000);
})();
