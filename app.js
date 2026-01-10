(function () {
  // Small date/time text (top right)
  const el = document.getElementById("dateTime");
  const accessLabel = document.getElementById("accessLabel");

  function pad(n){ return String(n).padStart(2,"0"); }
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

  function tick(){
    const d = new Date();
    const txt = `${months[d.getMonth()]} ${pad(d.getDate())}, ${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    if (el) el.textContent = txt;
  }
  tick();
  setInterval(tick, 1000);

  // Simple access label (read-only demo)
  // You can change access by adding ?role=ceo OR ?role=mantle OR ?role=gm to URL
  const params = new URLSearchParams(window.location.search);
  const role = (params.get("role") || "ceo").toLowerCase();

  const map = {
    ceo: "CEO",
    mantle: "MANTLE",
    gm: "GENERALS"
  };
  if (accessLabel) accessLabel.textContent = map[role] || "CEO";
})();
