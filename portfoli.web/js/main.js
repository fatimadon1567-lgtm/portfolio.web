/**
 * main.js
 * Core UI interactions: navbar, typewriter, counters, skill bars, scroll reveal
 */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll effect ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ---- Mobile nav toggle ----
  const toggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ---- Typewriter effect ----
  const typeEl = document.getElementById('typewriter');
  if (typeEl) {
    const words = [
      'Web Development',
      'Python & AI',
      'Creative Coding',
      '3D Experiences',
      'Problem Solving'
    ];
    let wordIdx = 0, charIdx = 0, deleting = false;

    function type() {
      const current = words[wordIdx];
      if (deleting) {
        typeEl.textContent = current.substring(0, charIdx--);
        if (charIdx < 0) {
          deleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          setTimeout(type, 400);
          return;
        }
      } else {
        typeEl.textContent = current.substring(0, charIdx++);
        if (charIdx > current.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
      }
      setTimeout(type, deleting ? 60 : 100);
    }
    setTimeout(type, 1000);
  }

  // ---- Counter animation ----
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target + '+';
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  }

  // ---- Skill bar animation ----
  function animateSkillBars(container) {
    container.querySelectorAll('.skill-fill').forEach(bar => {
      const width = bar.dataset.width;
      if (width) bar.style.width = width + '%';
    });
  }

  // ---- Scroll reveal ----
  const revealEls = document.querySelectorAll(
    '.skill-card, .interest-card, .project-card, .timeline-item, .contact-item, .about-text, .skills-section, .timeline-section'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => observer.observe(el));

  // ---- Counter observer ----
  const counterEls = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));

  // ---- Skill bar observer ----
  const skillSections = document.querySelectorAll('.skills-section, .skills-preview');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars(entry.target);
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  skillSections.forEach(el => skillObserver.observe(el));

  // ---- 3D card tilt on mouse move ----
  const card3d = document.querySelector('.hero-3d-card');
  if (card3d) {
    card3d.addEventListener('mousemove', (e) => {
      const rect = card3d.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card3d.querySelector('.card-inner').style.transform =
        `rotateY(${x * 20}deg) rotateX(${-y * 15}deg) translateY(-10px)`;
    });
    card3d.addEventListener('mouseleave', () => {
      card3d.querySelector('.card-inner').style.transform = '';
    });
  }

  // ---- Skill card tilt ----
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ---- AJAX Contact Form ----
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msgEl = document.getElementById('form-message');
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      try {
        const data = new FormData(form);
        const res = await fetch(form.action, { method: 'POST', body: data });
        const json = await res.json();

        msgEl.style.display = 'block';
        if (json.success) {
          msgEl.className = 'form-message success';
          msgEl.textContent = json.message || 'Message sent successfully!';
          form.reset();
        } else {
          msgEl.className = 'form-message error';
          msgEl.textContent = json.message || 'Something went wrong. Please try again.';
        }
      } catch {
        msgEl.style.display = 'block';
        msgEl.className = 'form-message error';
        msgEl.textContent = 'Network error. Please try again later.';
      }

      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      setTimeout(() => { msgEl.style.display = 'none'; }, 5000);
    });
  }

});
