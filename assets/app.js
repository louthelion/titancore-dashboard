function pad(n){ return String(n).padStart(2,'0'); }

function renderTime(){
  const now = new Date();
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const dayName = days[now.getDay()];
  const mon = months[now.getMonth()];
  const d = now.getDate();
  const y = now.getFullYear();

  let h = now.getHours();
  const m = pad(now.getMinutes());
  const s = pad(now.getSeconds());
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12; if(h === 0) h = 12;

  const dateStr = `${dayName}, ${mon} ${d}, ${y}`;
  const timeStr = `${pad(h)}:${m}:${s} ${ampm}`;

  const dateEl = document.querySelector("[data-date]");
  const timeEl = document.querySelector("[data-time]");
  if(dateEl) dateEl.textContent = dateStr;
  if(timeEl) timeEl.textContent = timeStr;
}

document.addEventListener("DOMContentLoaded", () => {
  renderTime();
  setInterval(renderTime, 1000);

  // highlight active nav link
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a => {
    const href = a.getAttribute("href");
    if(href === path) a.classList.add("active");
  });
});
