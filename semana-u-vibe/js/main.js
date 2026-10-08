/* Semana U-Vibe — comportamiento de la página (depende de data.js) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const svg = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  /* Enlaces configurables (inscripción) */
  document.querySelectorAll('[data-link]').forEach(a => { a.href = CONFIG.links[a.dataset.link]; });
  $('#year').textContent = new Date().getFullYear();

  /* Menú móvil */
  const burger = $('#burger'), menu = $('#menu');
  burger.onclick = () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };
  menu.addEventListener('click', e => { if (e.target.closest('a, [data-open-chat]')) { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });
  addEventListener('scroll', () => $('#nav').classList.toggle('scrolled', scrollY > 20), { passive: true });

  /* Contenido estático generado desde data.js */
  $('#steps').innerHTML = STEPS.map((s, n) =>
    `<li class="reveal"><div class="ico">${svg(s.i)}</div><small>Paso ${n + 1}</small><h3>${s.t}</h3><p>${s.d}</p></li>`).join('');
  $('#benefits').innerHTML = BENEFITS.map(b =>
    `<article class="benefit reveal"><div class="ico">${svg(b.i)}</div><div><h3>${b.t}</h3><p>${b.d}</p></div></article>`).join('');

  /* Categorías (botones tipo tarjeta, activan/desactivan filtro) */
  let activeCat = '';
  const catsEl = $('#cats');
  catsEl.innerHTML = CATEGORIES.map(c => {
    const n = ACTIVITIES.filter(a => a.cat === c.id).length;
    return `<button type="button" class="cat" data-cat="${esc(c.id)}" aria-pressed="false"><div class="ico">${svg(c.i)}</div><h3>${esc(c.id)}</h3><span>${n} actividades</span></button>`;
  }).join('');
  catsEl.addEventListener('click', e => {
    const b = e.target.closest('.cat'); if (!b) return;
    activeCat = activeCat === b.dataset.cat ? '' : b.dataset.cat;   // clic de nuevo = quitar filtro
    catsEl.querySelectorAll('.cat').forEach(x => x.setAttribute('aria-pressed', x.dataset.cat === activeCat));
    render();
  });

  /* Filtrado: los campos vacíos se ignoran; se aplica al pulsar Buscar */
  const grid = $('#grid'), count = $('#count');
  function render() {
    const t = norm($('#f-text').value.trim()), d = $('#f-day').value, h = $('#f-hours').value, c = $('#f-campus').value;
    const list = ACTIVITIES.filter(a =>
      (!activeCat || a.cat === activeCat) && (!t || norm(a.name).includes(t)) &&
      (!d || a.day === d) && (!h || a.hours === +h) && (!c || a.campus === c));
    count.textContent = `${list.length} actividad${list.length === 1 ? '' : 'es'} encontrada${list.length === 1 ? '' : 's'}`;
    const ico = n => `<span class="act__ico" aria-hidden="true"><svg viewBox="0 0 24 24">${ICONS[n]}</svg></span>`;
    const meta = (icon, label, value) =>
      `<li>${ico(icon)}<span><small>${label}</small>${esc(value)}</span></li>`;
    grid.innerHTML = list.length ? list.map(a => `
      <article class="act">
        <div class="act__media">
          <img src="${esc(a.img || RUBRO_IMG[a.cat] || '')}" alt="" width="640" height="360" loading="lazy">
          <span class="act__cat">${esc(a.cat)}</span>
        </div>
        <div class="act__body">
          <h3>${esc(a.name)}</h3>
          <ul class="act__meta">
            ${meta("calendar", "Día", a.day)}
            ${meta("clock", "Hora", a.time)}
            ${meta("pin", "Lugar", a.place)}
            ${meta("building", "Campus", a.campus)}
          </ul>
          <div class="act__foot">
            <span class="act__hours">${ico("clock")}${a.hours} horas</span>
            <span class="act__seats"><b>${a.seats}</b> cupos</span>
          </div>
        </div>
      </article>`).join('')
      : '<p class="empty">No encontramos actividades con esos filtros. Prueba quitando alguno.</p>';
  }
  $('#filters').addEventListener('submit', e => { e.preventDefault(); render(); });
  $('#filters').addEventListener('reset', () => { activeCat = ''; catsEl.querySelectorAll('.cat').forEach(x => x.setAttribute('aria-pressed', false)); setTimeout(render); });
  render();

  /* Resalta la sección visible en el menú */
  const links = [...menu.querySelectorAll('a[href^="#"]:not([data-link])')];
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['inicio', 'actividades', 'beneficios'].forEach(id => spy.observe($('#' + id)));

  /* Aparición al hacer scroll + contador de cifras */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, p = el.dataset.prefix || '', s = el.dataset.suffix || '';
    if (reduce) return;
    const t0 = performance.now();
    (function tick(t) { const k = Math.min((t - t0) / 1400, 1); el.textContent = p + Math.round(end * (1 - Math.pow(1 - k, 3))) + s; if (k < 1) requestAnimationFrame(tick); })(t0);
  }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  /* Globo del chatbot: aparece un momento al cargar */
  const fab = $('.fab'); setTimeout(() => fab.classList.add('hint'), 2500); setTimeout(() => fab.classList.remove('hint'), 7500);
})();
