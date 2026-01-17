// TitanCore Dashboard - menu + time
(function () {
  // Live time
  const el = document.getElementById("sysTime");
  function tick() {
    if (!el) return;
    const d = new Date();
    el.textContent = d.toLocaleString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  tick();
  setInterval(tick, 1000);

  // Dropdown menus (simple, reliable)
  const btns = document.querySelectorAll("[data-drop]");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-drop");
      const panel = document.getElementById(id);
      if (!panel) return;

      // close others (keeps it clean)
      document.querySelectorAll(".drop").forEach((d) => {
        if (d !== panel) d.style.display = "none";
      });

      panel.style.display = (panel.style.display === "block") ? "none" : "block";
    });
  });

  // Click outside to close dropdowns
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t.closest(".moduleBlock") || t.closest(".roleBlock") || t.closest(".drop")) return;
    document.querySelectorAll(".drop").forEach((d) => d.style.display = "none");
  });
})();
