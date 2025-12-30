(function () {
  function pad(n){ return String(n).padStart(2,'0'); }

  function tick(){
    const d = new Date();
    const weekday = d.toLocaleDateString(undefined, { weekday:'long' });
    const month = d.toLocaleDateString(undefined, { month:'short' });
    const day = d.getDate();
    const year = d.getFullYear();

    let h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if(h === 0) h = 12;

    const dateEl = document.getElementById('sysDate');
    const timeEl = document.getElementById('sysTime');

    if(dateEl) dateEl.textContent = `${weekday} • ${month} ${day}, ${year}`;
    if(timeEl) timeEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)} ${ampm}`;
  }

  tick();
  setInterval(tick, 1000);
})();
