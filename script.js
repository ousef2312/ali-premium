/* ═══════════════════════════════════════════════════════════════
   SALOON ALI — Premium Script
   Gold Dust Particles · Cinematic GSAP Intro
   Cursor Glow · Mouse Parallax · Vanilla Tilt
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. GOLD DUST PARTICLE SYSTEM
   ───────────────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = [
    'rgba(196,163,90,',
    'rgba(232,201,122,',
    'rgba(245,224,160,',
    'rgba(180,140,70,',
  ];

  class Particle {
    constructor(immediate) { this.spawn(immediate); }

    spawn(immediate) {
      this.x      = Math.random() * (W || window.innerWidth);
      this.y      = immediate ? Math.random() * (H || window.innerHeight) : (H || window.innerHeight) + 12;
      this.radius = Math.random() * 1.6 + 0.3;
      this.speedY = Math.random() * 0.55 + 0.18;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.alpha  = 0;
      this.maxA   = Math.random() * 0.55 + 0.12;
      this.life   = 0;
      this.maxL   = Math.random() * 320 + 180;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    update() {
      this.y    -= this.speedY;
      this.x    += this.speedX;
      this.life++;
      const t = this.life / this.maxL;
      if      (t < 0.18) this.alpha = (t / 0.18) * this.maxA;
      else if (t > 0.75) this.alpha = ((1 - t) / 0.25) * this.maxA;
      else               this.alpha = this.maxA;
      if (this.life >= this.maxL) this.spawn(false);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha.toFixed(3) + ')';
      ctx.fill();
    }
  }

  const particles = [];
  const COUNT = Math.min(100, Math.floor(window.innerWidth * 0.065));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle(true));

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ─────────────────────────────────────────────────────────────
   2. CUSTOM CURSOR GLOW
   ───────────────────────────────────────────────────────────── */
(function initCursor() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  /* Only on devices with a real pointer */
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let mouseX = -200, mouseY = -200;
  let curX   = -200, curY   = -200;
  let raf;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    mouseX = mouseY = -300;
  });

  function animate() {
    // Smooth lag follow
    curX += (mouseX - curX) * 0.11;
    curY += (mouseY - curY) * 0.11;
    glow.style.left = curX + 'px';
    glow.style.top  = curY + 'px';
    raf = requestAnimationFrame(animate);
  }
  raf = requestAnimationFrame(animate);

  // Swell on interactive elements
  const interactives = document.querySelectorAll('a, button, [role="button"]');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => glow.classList.add('hovered'));
    el.addEventListener('mouseleave', () => glow.classList.remove('hovered'));
  });
})();


/* ─────────────────────────────────────────────────────────────
   3. MOUSE PARALLAX ON BACKGROUND ORBS
   ───────────────────────────────────────────────────────────── */
(function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  let ticking = false;
  document.addEventListener('mousemove', e => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const xPct = (e.clientX / window.innerWidth  - 0.5) * 2;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
      orbs.forEach((orb, i) => {
        const strength = (i + 1) * 22;
        orb.style.transform =
          `translate(${xPct * strength}px, ${yPct * strength}px)`;
      });
      ticking = false;
    });
  }, { passive: true });
})();


/* ─────────────────────────────────────────────────────────────
   4. GSAP CINEMATIC PAGE LOAD ANIMATION
   ───────────────────────────────────────────────────────────── */
window.addEventListener('load', function () {
  if (typeof gsap === 'undefined') {
    // Fallback: show everything instantly
    document.querySelectorAll('.hero, .link-card').forEach(el => {
      el.style.opacity  = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  /* Reveal hero container */
  tl.to('#hero', { opacity: 1, duration: 0.01 }, 0)

  /* Logo drops from above with spring */
    .from('#logoContainer', {
      y: -90,
      opacity: 0,
      scale: 0.8,
      duration: 1.1,
      ease: 'back.out(1.6)'
    }, 0.1)

  /* Arabic title slides in from right */
    .from('#titleAr', {
      x: -70,
      opacity: 0,
      duration: 0.9
    }, 0.55)

  /* Latin tracking line */
    .from('#titleLat', {
      x: -40,
      opacity: 0,
      letterSpacing: '20px',
      duration: 0.8
    }, 0.7)

  /* Subtitle */
    .from('#subtitle', {
      y: 20,
      opacity: 0,
      duration: 0.65
    }, 0.88)

  /* Divider expands */
    .from('#heroDivider', {
      scaleX: 0,
      opacity: 0,
      duration: 0.55,
      transformOrigin: 'center center'
    }, 1.0)

  /* Cards cascade up with stagger */
    .to('.link-card', {
      y: 0,
      opacity: 1,
      duration: 0.65,
      stagger: 0.1,
      ease: 'power2.out'
    }, 1.1);
});


/* ─────────────────────────────────────────────────────────────
   5. VANILLA TILT — 3D CARD EFFECT
   ───────────────────────────────────────────────────────────── */
window.addEventListener('load', function () {
  if (typeof VanillaTilt === 'undefined') return;
  /* Only init on non-touch devices */
  if (window.matchMedia('(hover: none)').matches) return;

  VanillaTilt.init(document.querySelectorAll('.link-card[data-tilt]'), {
    max:           10,
    speed:         500,
    glare:         true,
    'max-glare':   0.12,
    perspective:   900,
    scale:         1.025,
    gyroscope:     false,
  });
});


/* ─────────────────────────────────────────────────────────────
   6. CARD ACTIVE PRESS MICRO-INTERACTION (Mobile)
   ───────────────────────────────────────────────────────────── */
(function initMobilePress() {
  document.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('touchstart', () => {
      card.style.transform = 'scale(0.97)';
    }, { passive: true });

    card.addEventListener('touchend', () => {
      card.style.transform = '';
    }, { passive: true });
  });
})();
