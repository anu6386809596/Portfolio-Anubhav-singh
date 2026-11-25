// ===== ELEMENTS =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const links = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');

// ===== MOBILE MENU =====
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
links.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== SCROLL EVENTS: sticky navbar, active link, back-to-top =====
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  navbar.classList.toggle('scrolled', scrollY > 50);
  backToTop.classList.toggle('show', scrollY > 400);

  sections.forEach(section => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${section.id}"]`);
      if (active) active.classList.add('active');
    }
  });
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== DARK / LIGHT THEME (saved in localStorage) =====
function setTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

try {
  setTheme(localStorage.getItem('theme') || 'dark');
} catch (e) {
  setTheme('dark');
}

themeToggle.addEventListener('click', () => {
  const newTheme = document.body.classList.contains('light') ? 'dark' : 'light';
  setTheme(newTheme);
  try { localStorage.setItem('theme', newTheme); } catch (e) {}
});

// ===== TYPING EFFECT =====
const words = ['Web Developer', 'Frontend Developer', 'Problem Solver', 'Quick Learner'];
const typingEl = document.getElementById('typing');
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const word = words[wordIndex];
  typingEl.textContent = word.substring(0, charIndex);

  if (!deleting && charIndex < word.length) {
    charIndex++;
    setTimeout(type, 100);
  } else if (deleting && charIndex > 0) {
    charIndex--;
    setTimeout(type, 50);
  } else {
    deleting = !deleting;
    if (!deleting) wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, deleting ? 1500 : 300);
  }
}
type();

// ===== SCROLL REVEAL + SKILL BARS + COUNTERS =====
function animateCounter(el) {
  const target = +el.dataset.target;
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 50));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current;
  }, 30);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('visible');

    const fill = el.querySelector('.skill-fill');
    if (fill) fill.style.width = fill.dataset.width + '%';

    el.querySelectorAll('.counter').forEach(animateCounter);

    observer.unobserve(el);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== PROJECT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hide', !show);
    });
  });
});

// ===== CONTACT FORM VALIDATION =====
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

function showError(input, message) {
  const group = input.parentElement;
  group.classList.toggle('invalid', message !== '');
  group.querySelector('.error').textContent = message;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let valid = true;

  if (name.value.trim() === '') { showError(name, 'Please enter your name'); valid = false; }
  else showError(name, '');

  if (!emailPattern.test(email.value.trim())) { showError(email, 'Please enter a valid email'); valid = false; }
  else showError(email, '');

  if (message.value.trim().length < 10) { showError(message, 'Message must be at least 10 characters'); valid = false; }
  else showError(message, '');

  if (valid) {
    formSuccess.textContent = `Thank you, ${name.value.trim()}! Your message has been sent.`;
    form.reset();
    setTimeout(() => (formSuccess.textContent = ''), 4000);
  }
});

// ===== FOOTER YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();
