/* ============================================
   Anirudh Parupalli — Portfolio JS
   GSAP scroll animations · counters · particles · lightbox
   ============================================ */

(() => {
  'use strict';

  // ------------------------------------------
  // 1. Lucide icons + footer year
  // ------------------------------------------
  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function setYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ------------------------------------------
  // 2. Sticky nav + mobile menu
  // ------------------------------------------
  function initNav() {
    const nav = document.getElementById('nav');
    const onScroll = () => {
      if (!nav) return;
      if (window.scrollY > 24) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
      // Close on link tap
      mobileMenu.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
      });
    }
  }

  // ------------------------------------------
  // 3. Scroll-triggered reveals (GSAP if available, otherwise IntersectionObserver)
  // ------------------------------------------
  function initReveals() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    const useGSAP =
      window.gsap &&
      window.ScrollTrigger &&
      typeof window.gsap.fromTo === 'function';

    if (useGSAP) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      items.forEach((el) => {
        const delay = parseFloat(el.dataset.revealDelay || '0');
        // Mark visible immediately so the CSS doesn't keep it hidden if scrollTrigger lags
        el.classList.add('is-visible');
        window.gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    } else {
      // Fallback
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-visible');
              obs.unobserve(e.target);
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
      );
      items.forEach((el) => obs.observe(el));
    }
  }

  // ------------------------------------------
  // 4. Animated counters
  // ------------------------------------------
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.dataset.target || '0', 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const value = Math.floor(easeOut(t) * target);
        el.textContent = value.toLocaleString() + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString() + suffix;
      };
      requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => obs.observe(el));
  }

  // ------------------------------------------
  // 5. Particle background canvas
  // ------------------------------------------
  function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles, raf;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const COUNT = Math.max(40, Math.min(80, Math.floor(window.innerWidth / 18)));

    function resize() {
      w = canvas.width = window.innerWidth * window.devicePixelRatio;
      h = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    }
    resize();

    function makeParticles() {
      particles = Array.from({ length: COUNT }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: (Math.random() * 1.4 + 0.4) * window.devicePixelRatio,
        c: Math.random() > 0.5 ? '#22d3ee' : '#a78bfa',
        a: Math.random() * 0.5 + 0.2,
      }));
    }
    makeParticles();

    function step() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // Draw connecting lines between near particles
      ctx.globalAlpha = 0.15;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i],
            b = particles[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          const max = 140 * window.devicePixelRatio;
          if (dist < max) {
            ctx.strokeStyle = a.c;
            ctx.globalAlpha = (1 - dist / max) * 0.15;
            ctx.lineWidth = 0.5 * window.devicePixelRatio;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(step);
    }
    step();

    let resizeT;
    window.addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        cancelAnimationFrame(raf);
        resize();
        makeParticles();
        step();
      }, 200);
    });
  }

  // ------------------------------------------
  // 6. Lightbox for PDFs / images
  // ------------------------------------------
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const titleEl = document.getElementById('lightboxTitle');
    const bodyEl = document.getElementById('lightboxBody');
    const closeBtn = document.getElementById('lightboxClose');
    const downloadEl = document.getElementById('lightboxDownload');
    if (!lightbox) return;

    const openLightbox = (src, title) => {
      if (!src) return;
      titleEl.textContent = title || 'Document';
      bodyEl.innerHTML = '';
      const ext = src.split('.').pop().toLowerCase();
      let el;
      if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
        el = document.createElement('img');
        el.src = src;
        el.alt = title || 'Document preview';
      } else {
        // PDF or other — embed in iframe
        el = document.createElement('iframe');
        el.src = src + '#toolbar=0&navpanes=0';
        el.title = title || 'Document preview';
      }
      bodyEl.appendChild(el);
      downloadEl.href = src;
      downloadEl.setAttribute('download', '');
      lightbox.classList.remove('hidden');
      lightbox.classList.add('opening');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('opening');
      bodyEl.innerHTML = '';
      document.body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });

    // Wire up all elements with data-pdf
    document.querySelectorAll('[data-pdf]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(el.dataset.pdf, el.dataset.title);
      });
    });

    return { open: openLightbox };
  }

  // ------------------------------------------
  // 7. Conference chip external links
  // ------------------------------------------
  function initConferenceLinks() {
    document.querySelectorAll('.conf-chip[data-link]').forEach((el) => {
      el.addEventListener('click', () => {
        const url = el.dataset.link;
        if (url) window.open(url, '_blank', 'noopener');
      });
      el.setAttribute('role', 'link');
      el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const url = el.dataset.link;
          if (url) window.open(url, '_blank', 'noopener');
        }
      });
    });
  }

  // ------------------------------------------
  // 8. Build reviewer-certificate grid dynamically
  // ------------------------------------------
  function buildReviewCertGrid() {
    const grid = document.getElementById('reviewCertGrid');
    if (!grid) return;

    const certs = [
      { file: 'jgrec-anirudh-parupalli.pdf', title: 'JGREC Reviewer Certificate', org: 'Journal of Global Research in Electronics and Communications', accent: 'cyan' },
      { file: 'anirudh-jgrma-certificate.pdf', title: 'JGRMA Reviewer Certificate', org: 'Journal of Global Research in Mathematical Archives', accent: 'violet' },
      { file: 'tc-bdai2025-anirudh-parupalli.pdf', title: 'BDAI 2025 Reviewer', org: 'International Conference on Big Data & AI', accent: 'cyan' },
      { file: 'icicnct-2025-revviewer-certificate2.jpg', title: 'ICICNCT 2025 Reviewer', org: 'Computing, Networking & Communications', accent: 'violet' },
      { file: 'ssitcon--2025-reviewer-certificate49.jpg', title: 'SSITCON 2025 Reviewer', org: 'Smart Systems & Intelligent Computing', accent: 'cyan' },
      { file: 'certificate-anirudh-parupalli.pdf', title: 'Reviewer Certificate', org: 'International Conference Reviewer', accent: 'violet' },
      { file: 'mr.-anirudh-parupalli.pdf', title: 'Mr. Anirudh Parupalli', org: 'Reviewer Recognition', accent: 'cyan' },
      { file: 'reviewer-certificate.pdf', title: 'Reviewer Certificate', org: 'International Recognition', accent: 'violet' },
      { file: 'anirudh-parupalli-1.pdf', title: 'Anirudh Parupalli — Reviewer', org: 'Conference Recognition', accent: 'cyan' },
      { file: '011.pdf', title: 'Reviewer Certificate #011', org: 'International Conference', accent: 'violet' },
      { file: '046-anirudh-parupalli.pdf', title: 'Reviewer Certificate #046', org: 'International Conference', accent: 'cyan' },
      { file: '28.png', title: 'Reviewer Certificate', org: 'International Recognition', accent: 'violet' },
    ];

    const html = certs
      .map((c, i) => {
        const isCyan = c.accent === 'cyan';
        const iconColor = isCyan ? 'text-cyan2-400' : 'text-violet2-400';
        const monoColor = iconColor;
        return `
          <div class="cert-card glass-card rounded-2xl overflow-hidden cursor-pointer group" data-pdf="assets/reviews/${c.file}" data-title="${c.title}" data-reveal data-reveal-delay="${(i % 4) * 0.05}">
            <div class="aspect-[4/3] flex items-center justify-center relative overflow-hidden bg-ink-800">
              <div class="absolute inset-0 bg-gradient-to-br ${isCyan ? 'from-cyan2-500/20 to-violet2-500/15' : 'from-violet2-500/20 to-cyan2-500/15'}"></div>
              <i data-lucide="award" class="w-14 h-14 ${iconColor} relative"></i>
            </div>
            <div class="p-4">
              <div class="text-[10px] font-mono ${monoColor} mb-1 uppercase tracking-wider">Reviewer</div>
              <div class="font-semibold text-sm leading-tight">${c.title}</div>
              <div class="text-xs text-slate-400 mt-1 line-clamp-2">${c.org}</div>
            </div>
          </div>`;
      })
      .join('');

    grid.innerHTML = html;
  }

  // ------------------------------------------
  // 9. Smooth-scroll for anchor links
  // ------------------------------------------
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length <= 1) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  // ------------------------------------------
  // INIT
  // ------------------------------------------
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(() => {
    setYear();
    buildReviewCertGrid();   // build before initIcons so new icons get rendered
    initIcons();
    initNav();
    initSmoothScroll();
    initConferenceLinks();
    initLightbox();
    initCounters();
    initReveals();
    initParticles();
  });
})();
