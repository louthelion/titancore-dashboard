(function () {
  const DAY = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const MON = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

  function formatClock(d){
    const day = DAY[d.getDay()];
    const mon = MON[d.getMonth()];
    const dd = String(d.getDate()).padStart(2,"0");
    const yyyy = d.getFullYear();

    let h = d.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12; if (h === 0) h = 12;
    const m = String(d.getMinutes()).padStart(2,"0");

    return `${day} · ${mon} ${dd} ${yyyy} · ${h}:${m} ${ampm}`;
  }

  function tick(){
    const now = new Date();
    document.querySelectorAll("[data-clock]").forEach(el=>{
      el.textContent = formatClock(now);
    });
  }

  function setActiveMenu(){
    const path = (location.pathname || "/").toLowerCase();
    document.querySelectorAll(".menu-btn").forEach(a=>{
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (!href) return;
      if (href === path || (href === "/index.html" && (path === "/" || path === "/index.html"))) {
        a.classList.add("active");
      } else {
        a.classList.remove("active");
      }
    });
  }

  tick();
  setActiveMenu();
  setInterval(tick, 1000);
})();
