// ── Year ──────────────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Mobile nav toggle ─────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Fade-in on scroll ─────────────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-in-up');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  fadeEls.forEach(el => observer.observe(el));
} else {
  fadeEls.forEach(el => el.classList.add('visible'));
}

// ── Lightbox ──────────────────────────────────────────────────
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose   = document.getElementById('lightboxClose');

function openLightbox(imgSrc, caption, altText) {
  lightboxImg.src = imgSrc;
  lightboxImg.alt = altText || '';
  lightboxCaption.textContent = caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

document.querySelectorAll('.project-card').forEach(card => {
  const imgSrc  = card.dataset.img;
  const caption = card.dataset.caption;
  const altText = card.querySelector('img') ? card.querySelector('img').alt : '';

  card.addEventListener('click', () => openLightbox(imgSrc, caption, altText));

  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(imgSrc, caption, altText);
    }
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});
