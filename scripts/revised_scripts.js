/* =============================================
   Mason Yuen — Revised Scripts (Bootstrap-friendly)
   Works with revised_index.html
   Safe to include alongside Bootstrap 5 bundle
   ============================================= */

// Helper: feature detect reduced motion
const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =====================================================
// 1) Navbar quality-of-life (Bootstrap collapse aware)
// =====================================================
(() => {
  const nav = document.getElementById('primaryNav');
  if (!nav) return;

  // Close mobile menu after clicking a link (Bootstrap collapse)
  nav.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      const collapse = bootstrap.Collapse.getOrCreateInstance(nav, { toggle: false });
      collapse.hide();
    });
  });
})();

// =====================================================
// 2) Smooth internal scrolling (respects reduced motion)
// =====================================================
(() => {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      // only intercept same-page anchors
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      // update URL hash without jumping
      history.replaceState(null, '', hash);
    });
  });
})();

// =====================================================
// 3) Active section highlighting on scroll
// =====================================================
(() => {
  const sections = ['#home', '#about', '#projects', '#experience', '#contact']
    .map(id => document.querySelector(id))
    .filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll('.navbar a.nav-link'));
  if (!sections.length || !navLinks.length) return;

  const inView = (el) => {
    const r = el.getBoundingClientRect();
    return r.top <= (window.innerHeight * 0.35) && r.bottom >= (window.innerHeight * 0.35);
  };

  const tick = () => {
    let current = null;
    for (const s of sections) { if (inView(s)) { current = '#' + s.id; break; } }
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === current));
  };

  document.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick);
  tick();
})();

// =====================================================
// 4) Image lightbox (Bootstrap modal #lightbox)
//    Any element with [data-bs-image] will populate #lightboxImg
// =====================================================
(() => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.addEventListener('show.bs.modal', (event) => {
    const trigger = event.relatedTarget;
    const src = trigger && trigger.getAttribute('data-bs-image');
    const img = document.getElementById('lightboxImg');
    if (src && img) img.src = src;
  });
})();

// =====================================================
// 5) Case study modal content (matches HTML map)
//    Elements carry data-case="..." to choose content
// =====================================================
(() => {
  const caseModal = document.getElementById('caseStudyModal');
  if (!caseModal) return;
  caseModal.addEventListener('show.bs.modal', (event) => {
    const trigger = event.relatedTarget;
    const which = trigger ? trigger.getAttribute('data-case') : null;
    const title = caseModal.querySelector('[data-cs-title]');
    const body = caseModal.querySelector('[data-cs-body]');
    const linkDemo = caseModal.querySelector('[data-cs-demo]');
    const linkGit = caseModal.querySelector('[data-cs-git]');

    const map = {
      wordhunt: {
        title: 'Word Hunt Solver — Case Study',
        bullets: [
          '<strong>Problem:</strong> Exhaustive word search on a 4×4 grid.',
          '<strong>Approach:</strong> Trie for O(L) lookups; DFS with pruning/backtracking; visited-mask dedupe.',
          '<strong>Result:</strong> Sub‑second solves with a 50k dictionary on mid‑range CPU.'
        ],
        demo: '#', git: '#'
      }
    };

    const content = map[which] || { title: 'Project', bullets: [], demo: '#', git: '#' };
    if (title) title.textContent = content.title;
    if (body) body.innerHTML = '<ul class="mb-0">' + content.bullets.map(b => '<li class="mb-2">' + b + '</li>').join('') + '</ul>';
    if (linkDemo) linkDemo.href = content.demo;
    if (linkGit) linkGit.href = content.git;
  });
})();

// =====================================================
// 6) Cursor spotlight + gradient button tracking
//    Preserves your original uniqueness
// =====================================================
(() => {
  // Spotlight on <body> based on cursor
  document.body.addEventListener('mousemove', e => {
    const rect = document.body.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    document.body.style.setProperty('--x', x + 'px');
    document.body.style.setProperty('--y', y + 'px');
  });

  // Gradient tracking for buttons
  const trackBtns = () => document.querySelectorAll('.mouse-cursor-gradient-tracking, .btn-gradient');
  const handle = (btn) => (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn.style.setProperty('--x', x + 'px');
    btn.style.setProperty('--y', y + 'px');
  };
  const wire = () => trackBtns().forEach(b => b.addEventListener('mousemove', handle(b)));
  wire();
})();

// =====================================================
// 7) GitHub repo loader (kept here so HTML stays clean)
// =====================================================
(async () => {
  const username = 'myuen1015'; // change if needed
  const listEl = document.getElementById('ghRepos');
  const viewAll = document.getElementById('viewAllRepos');
  if (!listEl) return;
  try {
    if (viewAll) viewAll.href = `https://github.com/${username}`;
    const resp = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    if (!resp.ok) throw new Error('GitHub API error');
    const repos = (await resp.json())
      .filter(r => !r.fork)
      .filter(r => (r.description || '').toLowerCase() !== '');
    const featured = repos
      .filter(r => !/portfolio|resume|dotfiles|config|test/i.test(r.name))
      .slice(0, 6);
    listEl.innerHTML = featured.map(r => `
      <div class="col">
        <article class="card h-100 shadow-soft">
          <div class="card-body d-flex flex-column">
            <div class="d-flex align-items-start justify-content-between gap-2 mb-2">
              <h4 class="h6 m-0">${r.name}</h4>
              ${r.language ? `<span class="badge text-bg-secondary">${r.language}</span>` : ''}
            </div>
            <p class="text-body-secondary small mb-3">${r.description || ''}</p>
            <div class="mt-auto d-flex gap-2">
              <a class="btn btn-sm btn-outline-light" href="${r.html_url}" target="_blank" rel="noopener">GitHub</a>
              ${r.homepage ? `<a class="btn btn-sm btn-outline-light" href="${r.homepage}" target="_blank" rel="noopener">Demo</a>` : ''}
            </div>
          </div>
        </article>
      </div>
    `).join('');
  } catch (e) {
    listEl.innerHTML = `<div class="col"><div class="alert alert-warning">Couldn't load GitHub projects right now. Check <a class="alert-link" target="_blank" rel="noopener" href="https://github.com/${username}">your profile</a>.</div></div>`;
  }
})();

// Mouse-position glow for skill cards
(() => {
  const cards = document.querySelectorAll('.skill-card');
  if (!cards.length) return;
  const update = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
  };
  cards.forEach(c => {
    c.addEventListener('mousemove', update);
    c.addEventListener('mouseleave', () => {
      c.style.removeProperty('--mx');
      c.style.removeProperty('--my');
    });
  });
})();


/* =====================================================
   Compatibility note for your original JS
   - Your previous code toggled a custom off-canvas nav using .fa-bars and .fa-x,
     which is no longer needed with Bootstrap's collapse navbar.
   - Your previous lightbox clicked any IMG inside .image-placer; we now rely on
     [data-bs-image] on the image or button to populate Bootstrap #lightbox.
   ===================================================== */
