/* ===========================
   Navigation Toggle
=========================== */
const navToggle = document.querySelector('.nav-toggle');
const navClose  = document.querySelector('.nav-close');
const navMenu   = document.querySelector('.nav-menu');

if (navToggle && navClose && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
  });

  navClose.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });

  // Close on nav link click (mobile)
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ===========================
   Lightbox
=========================== */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const backdrop      = document.querySelector('.lightbox-backdrop');

document.querySelectorAll('.lightbox-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const src = btn.dataset.src;
    if (lightbox && lightboxImg && src) {
      lightboxImg.src = src;
      lightbox.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
    }
  });
});

function closeLightbox() {
  if (lightbox) {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
  }
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (backdrop)      backdrop.addEventListener('click', closeLightbox);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox && !lightbox.hasAttribute('hidden')) {
    closeLightbox();
  }
});

/* ===========================
   Gradient-tracking button
=========================== */
const gradBtn = document.querySelector('.mouse-cursor-gradient-tracking');
if (gradBtn) {
  gradBtn.addEventListener('mousemove', e => {
    const rect = gradBtn.getBoundingClientRect();
    gradBtn.style.setProperty('--x', (e.clientX - rect.left) + 'px');
    gradBtn.style.setProperty('--y', (e.clientY - rect.top)  + 'px');
  });
}

/* ===========================
   Body spotlight
=========================== */
document.body.addEventListener('mousemove', e => {
  document.body.style.setProperty('--x', e.clientX + 'px');
  document.body.style.setProperty('--y', e.clientY + 'px');
});

/* ===========================
   Scroll Progress Bar
=========================== */
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrollTop  = document.documentElement.scrollTop;
    const docHeight  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });
}

/* ===========================
   Scroll To Top
=========================== */
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===========================
   Scroll Reveal
=========================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.revealDelay || 0;
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, Number(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ===========================
   Footer Year
=========================== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
