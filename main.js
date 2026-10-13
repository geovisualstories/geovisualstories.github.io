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
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

let currentImages = [];
let currentIndex  = 0;

function showImage(index) {
  currentIndex = index;
  lightboxImg.src = currentImages[index].src;
  lightboxImg.alt = currentImages[index].alt || '';
  lightboxCaption.textContent = currentImages[index].caption || '';

  // Show/hide nav arrows
  const multi = currentImages.length > 1;
  lightboxPrev.style.display = multi ? 'flex' : 'none';
  lightboxNext.style.display = multi ? 'flex' : 'none';
  lightboxCounter.style.display = multi ? 'block' : 'none';
  if (multi) {
    lightboxCounter.textContent = `${index + 1} / ${currentImages.length}`;
  }
}

function openLightbox(images, startIndex = 0) {
  currentImages = images;
  showImage(startIndex);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
  currentImages = [];
}

function prevImage() {
  const newIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  showImage(newIndex);
}

function nextImage() {
  const newIndex = (currentIndex + 1) % currentImages.length;
  showImage(newIndex);
}

// Wire up each project card
document.querySelectorAll('.project-card').forEach(card => {
  // Multi-image: data-imgs='[{"src":"...","caption":"..."},...]'
  // Single image: data-img="..." data-caption="..."
  let images = [];

  if (card.dataset.imgs) {
    try {
      images = JSON.parse(card.dataset.imgs);
    } catch(e) {
      console.warn('Could not parse data-imgs', e);
    }
  } else if (card.dataset.img) {
    const cardImg = card.querySelector('img');
    images = [{
      src:     card.dataset.img,
      alt:     cardImg ? cardImg.alt : '',
      caption: card.dataset.caption || ''
    }];
  }

  if (!images.length) return;

  card.addEventListener('click', e => {
    e.preventDefault(); // keep .project-image-link from navigating to the raw image
    openLightbox(images, 0);
  });
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(images, 0);
    }
  });
});

// Lightbox controls
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev)  lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
if (lightboxNext)  lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });

const lightboxBackdrop = document.getElementById('lightboxBackdrop');
if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

// Keyboard: Escape closes, arrow keys navigate
document.addEventListener('keydown', e => {
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  prevImage();
  if (e.key === 'ArrowRight') nextImage();
});

// Touch swipe support
let touchStartX = 0;
if (lightbox) {
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextImage() : prevImage();
    }
  }, { passive: true });
}
