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
    document.querySelectorAll('a[data-cv]').forEach(a => {
      a.href = 'assets/docs/CV_DiegoDuarte_' + (lang === 'en' ? 'EN' : 'ES') + '.pdf';
    });
    // Textos alternativos, etiquetas e imágenes con versión en inglés
    const swap = (sel, attr, data) => document.querySelectorAll(sel).forEach(el => {
      if (!el.dataset[data + 'Es']) el.dataset[data + 'Es'] = el.getAttribute(attr) || '';
      el.setAttribute(attr, lang === 'en' ? el.dataset[data + 'En'] : el.dataset[data + 'Es']);
    });
    swap('[data-alt-en]', 'alt', 'alt');
    swap('[data-label-en]', 'aria-label', 'label');
    swap('img[data-src-en]', 'src', 'src');
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
    let text = cap ? cap.innerText.trim() : img.alt;
    if (img.hasAttribute('data-credit') && !/Autodesk/.test(text)) {
      text += root.getAttribute('data-lang') === 'en'
        ? ' · Autodesk Inventor screenshot, courtesy of Autodesk, Inc.'
        : ' · Captura de Autodesk Inventor, cortesía de Autodesk, Inc.';
    }
    dCap.textContent = text;
    dlg.showModal();
  });

  // ---- Visor de video (YouTube, se carga solo al hacer clic) ----
  const vbox = document.createElement('dialog');
  vbox.className = 'vbox';
  vbox.innerHTML = '<button class="vclose" type="button" aria-label="Cerrar">×</button><div class="frame16"></div>' +
    '<a target="_blank" rel="noopener"><span lang="es">Abrir en YouTube ↗</span><span lang="en">Open on YouTube ↗</span></a>';
  document.body.appendChild(vbox);
  const vFrame = vbox.querySelector('.frame16'), vLink = vbox.querySelector('a');
  function closeVideo() { vFrame.innerHTML = ''; if (vbox.open) vbox.close(); }
  vbox.querySelector('.vclose').addEventListener('click', closeVideo);
  vbox.addEventListener('click', e => { if (e.target === vbox) closeVideo(); });
  vbox.addEventListener('close', () => { vFrame.innerHTML = ''; });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-video]');
    if (!b) return;
    const id = b.dataset.video;
    const url = 'https://www.youtube.com/watch?v=' + id;
    if (typeof vbox.showModal !== 'function') { window.open(url, '_blank', 'noopener'); return; }
    vbox.classList.toggle('vertical', b.hasAttribute('data-vertical'));
    vFrame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
      '?autoplay=1&rel=0&modestbranding=1" title="Video del proyecto" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    vLink.href = url;
    vbox.showModal();
  });

  // ---- Filtros de proyectos ----
  const fButtons = document.querySelectorAll('[data-filter]');
  fButtons.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    fButtons.forEach(x => x.setAttribute('aria-pressed', String(x === btn)));
    document.querySelectorAll('.gcard[data-cat]').forEach(card => {
      const show = f === 'all' || card.dataset.cat.split(' ').includes(f);
      card.hidden = !show;
      if (show) card.classList.add('in');
    });
  }));

  // ---- Videos en bucle: reproducir solo cuando se ven ----
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver(entries => entries.forEach(en => {
      const v = en.target;
      if (en.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); }
      else v.pause();
    }), { threshold: 0.25 });
    document.querySelectorAll('video[autoplay][loop]').forEach(v => vio.observe(v));
  }

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
