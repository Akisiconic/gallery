(() => {
  const gallery      = document.getElementById('gallery');
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lightboxImg');
  const lbCaption    = document.getElementById('lightboxCaption');
  const lbClose      = document.getElementById('lightboxClose');
  const lbPrev       = document.getElementById('lightboxPrev');
  const lbNext       = document.getElementById('lightboxNext');
  const lbBackdrop   = document.getElementById('lightboxBackdrop');
  const filterBtns   = document.querySelectorAll('.filter-btn');

  let allItems       = Array.from(document.querySelectorAll('.gallery-item'));
  let visibleItems   = allItems; // items currently shown (after filter)
  let currentIndex   = 0;       // index within visibleItems

  // ── Stagger-reveal items on load ──────────────────────────
  allItems.forEach((item, i) => {
    setTimeout(() => item.classList.add('visible'), i * 60);
  });

  // ── Filtering ─────────────────────────────────────────────
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      visibleItems = [];

      allItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        if (match) {
          item.classList.remove('hidden');
          // re-trigger entrance animation
          item.classList.remove('visible');
          visibleItems.push(item);
        } else {
          item.classList.add('hidden');
          item.classList.remove('visible');
        }
      });

      // stagger the newly visible items
      visibleItems.forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), i * 60);
      });
    });
  });

  // ── Open lightbox ─────────────────────────────────────────
  gallery.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (!item || item.classList.contains('hidden')) return;

    currentIndex = visibleItems.indexOf(item);
    showSlide(currentIndex);
    openLightbox();
  });

  function openLightbox() {
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function showSlide(index) {
    const item    = visibleItems[index];
    const img     = item.querySelector('img');
    const title   = item.querySelector('.overlay-title').textContent;
    const category = item.querySelector('.overlay-category').textContent;

    // load a larger version of the same Unsplash image
    lbImg.src = img.src.replace(/w=600&h=400/, 'w=1200&h=800');
    lbImg.alt  = img.alt;
    lbCaption.textContent = `${category} — ${title}`;

    lbPrev.style.visibility = index > 0                     ? 'visible' : 'hidden';
    lbNext.style.visibility = index < visibleItems.length - 1 ? 'visible' : 'hidden';
  }

  // ── Navigation ────────────────────────────────────────────
  lbPrev.addEventListener('click', () => {
    if (currentIndex > 0) showSlide(--currentIndex);
  });

  lbNext.addEventListener('click', () => {
    if (currentIndex < visibleItems.length - 1) showSlide(++currentIndex);
  });

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);

  // ── Keyboard support ──────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   { if (currentIndex > 0) showSlide(--currentIndex); }
    if (e.key === 'ArrowRight')  { if (currentIndex < visibleItems.length - 1) showSlide(++currentIndex); }
  });
})();
