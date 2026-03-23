/* =========================================================
   CHURNLESS STUDIOS — Main JS
   ========================================================= */

// ── Particle / Network Canvas (hero background) ──────────
(function () {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let W, H, nodes, animId;

  const NODE_COUNT = 80;
  const CONNECT_DIST = 160;
  const SPEED = 0.3;
  const NODE_COLOR = 'rgba(91,110,245,';
  const LINE_COLOR = 'rgba(91,110,245,';

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r: Math.random() * 1.5 + 0.5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // move
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = LINE_COLOR + alpha + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    // dots
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = NODE_COLOR + '0.6)';
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    createNodes();
    if (animId) cancelAnimationFrame(animId);
    draw();
  }

  window.addEventListener('resize', () => {
    resize();
    createNodes();
  }, { passive: true });

  init();
})();

// ── Nav scroll class ──────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ── Mobile hamburger ──────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── FAQ accordion ─────────────────────────────────────────
document.querySelectorAll('.faq__item').forEach(item => {
  item.querySelector('.faq__q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Contact form ──────────────────────────────────────────
const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
form.addEventListener('submit', e => {
  e.preventDefault();
  form.style.display = 'none';
  success.classList.add('visible');
});

// ── Stat counter animation ────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── Intersection Observer (fade-up + counters) ────────────
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Fade-up elements
document.querySelectorAll(
  '.solution-card, .problem__item, .result-card, .hiw__step, ' +
  '.pricing-card, .industry-item, .stat-item, .faq__item'
).forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = (i % 4) * 80 + 'ms';
  fadeObserver.observe(el);
});

// Counter numbers
document.querySelectorAll('.stat-item__num[data-target]').forEach(el => {
  counterObserver.observe(el);
});
