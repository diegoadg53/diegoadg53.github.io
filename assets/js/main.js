// Idioma (ES/EN), visor de imágenes, aparición suave e índice activo.
(function () {
  const root = document.documentElement;

  // ---- Idioma ----
  function getStored() { try { return localStorage.getItem('lang'); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem('lang', v); } catch (e) { /* sin almacenamiento */ } }
  function setLang(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    document.querySelectorAll('.lang-toggle button').forEach(b =>
      b.setAttribute('aria-pressed', String(b.dataset.setLang === lang)));
    const t = document.querySelector('meta[name="title-' + lang + '"]');
    if (t) document.title = t.content;
  }
  const initial = getStored() || ((navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en');
  setLang(initial);
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-set-lang]');
    if (!b) return;
    setLang(b.dataset.setLang);
    store(b.dataset.setLang);
  });

  // ---- Visor de imágenes ----
  const dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.innerHTML = '<button type="button" aria-label="Cerrar">×</button><img alt=""><p></p>' +
    '<p><a class="open-full" target="_blank" rel="noopener"><span lang="es">Abrir en tamaño completo ↗</span><span lang="en">Open full size ↗</span></a></p>';
  document.body.appendChild(dlg);
  const dImg = dlg.querySelector('img'), dCap = dlg.querySelector('p'), dFull = dlg.querySelector('.open-full');
  dlg.querySelector('button').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  document.addEventListener('click', e => {
    const img = e.target.closest('[data-zoom] img, img[data-zoom]');
    if (!img || typeof dlg.showModal !== 'function') return;
    dImg.src = img.currentSrc || img.src;
    dImg.alt = img.alt;
    dFull.href = img.getAttribute('src');
    const fig = img.closest('figure');
    const cap = fig && fig.querySelector('figcaption');
    dCap.textContent = cap ? cap.innerText.trim() : img.alt;
    dlg.showModal();
  });

  // ---- Aparición suave ----
  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('in'));
  }

  // ---- Índice activo (página de caso) ----
  const tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map();
    tocLinks.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) map.set(s, a); });
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          tocLinks.forEach(a => a.classList.remove('active'));
          map.get(en.target).classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    map.forEach((_, s) => spy.observe(s));
  }

  // ---- Año en el pie ----
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
