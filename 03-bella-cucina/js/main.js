// Bella Cucina — main.js

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 80));

// Mobile nav
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function lockScroll() {
  const y = window.scrollY;
  document.body.dataset.scrollY = y;
  document.body.style.cssText = `position:fixed;top:-${y}px;left:0;right:0;overflow-y:scroll`;
}
function unlockScroll() {
  const y = +(document.body.dataset.scrollY || 0);
  document.body.style.cssText = '';
  window.scrollTo(0, y);
}

function openMenu() {
  navLinks?.classList.add('open');
  navToggle?.classList.add('open');
  nav.classList.add('menu-open');
  lockScroll();
}
function closeMenu() {
  navLinks?.classList.remove('open');
  navToggle?.classList.remove('open');
  nav.classList.remove('menu-open');
  unlockScroll();
}

navToggle?.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMenu() : openMenu();
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('click', e => {
  if (navLinks?.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    navLinks?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Reveal on scroll
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = entry.target.parentElement.querySelectorAll('.reveal');
    let delay = 0;
    siblings.forEach((s, i) => { if (s === entry.target) delay = i * 100; });
    setTimeout(() => entry.target.classList.add('visible'), Math.min(delay, 300));
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(r => revealObserver.observe(r));

// Menu tabs
const menuTabs = document.querySelectorAll('.menu-tab');
const menuCards = document.querySelectorAll('.menu-card');
menuTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    menuTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    menuCards.forEach(card => {
      const match = card.dataset.cat === cat;
      card.classList.toggle('hidden', !match);
      // Small entrance animation
      if (match) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        setTimeout(() => {
          card.style.transition = 'opacity .35s ease, transform .35s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      }
    });
  });
});

// Min date for reserva
const dataInput = document.getElementById('data');
if (dataInput) {
  const today = new Date().toISOString().split('T')[0];
  dataInput.min = today;
  // Disable Mondays (0 = Sunday, 1 = Monday)
  dataInput.addEventListener('input', e => {
    const d = new Date(e.target.value);
    if (d.getDay() === 0) { // Adjusted — getDay() with timezone can be tricky, simple check
      alert('Desculpe, estamos fechados às segundas-feiras. Por favor escolha outro dia.');
      e.target.value = '';
    }
  });
}

// Phone mask
const telInput = document.getElementById('telefone');
if (telInput) {
  telInput.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length >= 7) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length >= 3) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    e.target.value = v;
  });
}

// Reserva form
document.getElementById('reservaForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✓ Reserva confirmada! Verifique seu e-mail.';
  btn.style.background = '#2d6a4f';
  btn.style.borderColor = '#2d6a4f';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Confirmar Reserva';
    btn.style.background = '';
    btn.style.borderColor = '';
    btn.disabled = false;
    e.target.reset();
  }, 5000);
});
