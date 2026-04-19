/* ===================================================================
   PilotDezzy – Portfolio Script
   Dark/Light Toggle · Scroll Reveal · Interactions
=================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Dark / Light Mode ──────────────────────────────────────────
  const html     = document.documentElement;
  const toggle   = document.getElementById('theme-toggle');
  const iconSun  = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');

  // Default: dark.  Stored preference overrides.
  const stored = localStorage.getItem('pd-theme');
  if (stored === 'light') {
    html.classList.add('light');
  } else {
    html.classList.remove('light');
  }
  updateToggleIcons();

  toggle.addEventListener('click', () => {
    html.classList.toggle('light');
    const isLight = html.classList.contains('light');
    localStorage.setItem('pd-theme', isLight ? 'light' : 'dark');
    updateToggleIcons();
  });

  function updateToggleIcons() {
    const isLight = html.classList.contains('light');
    if (iconSun && iconMoon) {
      iconSun.style.opacity  = isLight ? '0.4' : '1';
      iconMoon.style.opacity = isLight ? '1' : '0.4';
    }
  }

  // ── Scroll Reveal (IntersectionObserver) ────────────────────────
  const reveals  = document.querySelectorAll('.reveal');
  let revealDelay = 0;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger tiles that come into view together
        const delay = entry.target.dataset.delay || 0;
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach((el, i) => {
    // Assign stagger delays per row position
    el.dataset.delay = (i % 4) * 80;
    revealObserver.observe(el);
  });

  // ── Tilt Effect on Tiles (Desktop only) ─────────────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
      tile.addEventListener('mousemove', (e) => {
        const rect = tile.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        tile.style.transform = `perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
      });
      tile.addEventListener('mouseleave', () => {
        tile.style.transform = '';
      });
    });
  }

  // ── Typing Effect for Slogan ────────────────────────────────────
  const sloganEl = document.getElementById('slogan');
  if (sloganEl) {
    const fullText = sloganEl.dataset.text || sloganEl.textContent;
    sloganEl.textContent = '';
    sloganEl.style.borderRight = '2px solid var(--accent)';
    let charIndex = 0;

    function typeChar() {
      if (charIndex < fullText.length) {
        sloganEl.textContent += fullText[charIndex];
        charIndex++;
        setTimeout(typeChar, 55 + Math.random() * 40);
      } else {
        // Blink cursor for a while, then remove
        setTimeout(() => {
          sloganEl.style.borderRight = 'none';
        }, 2500);
      }
    }

    // Start typing after hero is visible (small delay)
    setTimeout(typeChar, 800);
  }

  // ── Initialize Lucide Icons ─────────────────────────────────────
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ── Year in footer ──────────────────────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
