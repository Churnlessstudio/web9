// ── Nav scroll effect ──────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
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
  item.querySelector('.faq__question').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Contact form ──────────────────────────────────────────
const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.style.display = 'none';
  success.classList.add('visible');
  window.scrollTo({ top: success.offsetTop - 100, behavior: 'smooth' });
});

// ── Intersection observer — fade-in on scroll ─────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.service-card, .problem__card, .testimonial, .step, .pricing-card, .faq__item, .metric'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Inject visible class styles
const style = document.createElement('style');
style.textContent = `
  .service-card.visible, .problem__card.visible, .testimonial.visible,
  .step.visible, .pricing-card.visible, .faq__item.visible, .metric.visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  .pricing-card--featured.visible {
    transform: scale(1.02) translateY(0) !important;
  }
`;
document.head.appendChild(style);
