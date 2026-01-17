// TitanCore Executive Control Center — Global JS

function formatDateTime(d){
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const mon = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();

  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2,"0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12; if(h === 0) h = 12;

  return `${mon} ${day}, ${year} • ${h}:${m} ${ampm}`;
}

function tickClock(){
  const el = document.querySelector("[data-datetime]");
  if(!el) return;
  el.textContent = formatDateTime(new Date());
}
setInterval(tickClock, 1000);
window.addEventListener("DOMContentLoaded", tickClock);

// Mini-menu behavior (Dashboard home)
window.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll("[data-mini-trigger]");
  const miniPanels = document.querySelectorAll("[data-mini-panel]");

  function closeAll(){
    miniPanels.forEach(p => p.classList.remove("active"));
  }

  triggers.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-mini-trigger");
      const panel = document.querySelector(`[data-mini-panel="${id}"]`);
      if(!panel) return;

      const isOpen = panel.classList.contains("active");
      closeAll();
      if(!isOpen) panel.classList.add("active");
    });
  });

  // click outside closes mini menus
  document.addEventListener("click", (e) => {
    const inside = e.target.closest("[data-mini-panel]") || e.target.closest("[data-mini-trigger]");
    if(!inside) closeAll();
  });
});
