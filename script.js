// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Mobile nav toggle
const navToggle = document.querySelector('.nav__toggle');
const navMobile = document.querySelector('[data-nav-mobile]');
if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMobile.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll reveal with Intersection Observer
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Simple hero canvas water particles / network
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const isDarkTheme =
    document.documentElement.getAttribute('data-theme') === 'dark' ||
    window.matchMedia?.('(prefers-color-scheme: dark)').matches;

  const PARTICLE_COLOR_START = isDarkTheme
    ? 'rgba(34, 211, 238, 0.35)'
    : 'rgba(5, 150, 105, 0.35)';
  const PARTICLE_COLOR_MID = isDarkTheme
    ? 'rgba(56, 189, 248, 0.2)'
    : 'rgba(13, 148, 136, 0.2)';
  const PARTICLE_COLOR_END = isDarkTheme
    ? 'rgba(34, 211, 238, 0)'
    : 'rgba(5, 150, 105, 0)';

  const ctx = canvas.getContext('2d');
  const particles = [];
  const PARTICLE_COUNT = 70;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.7,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        r: Math.random() * 2 + 1,
      });
    }
  }

  function update() {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -50) p.x = canvas.width + 50;
      if (p.x > canvas.width + 50) p.x = -50;
      if (p.y < -50) p.y = canvas.height * 0.7 + 50;
      if (p.y > canvas.height * 0.7 + 50) p.y = -50;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.globalAlpha = 0.5;

    // particles
    particles.forEach((p) => {
      const gradient = ctx.createRadialGradient(
        p.x,
        p.y,
        0,
        p.x,
        p.y,
        p.r * 3
      );
      gradient.addColorStop(0, PARTICLE_COLOR_START);
      gradient.addColorStop(0.6, PARTICLE_COLOR_MID);
      gradient.addColorStop(1, PARTICLE_COLOR_END);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // connections
    ctx.lineWidth = 0.4;
    particles.forEach((p, i) => {
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = 1 - dist / 120;
          ctx.strokeStyle = isDarkTheme
            ? `rgba(34, 211, 238, ${alpha * 0.25})`
            : `rgba(5, 150, 105, ${alpha * 0.25})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    });

    ctx.restore();
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  resize();
  initParticles();
  loop();
  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
}

// Typing effect for hero focus line
const typingEl = document.getElementById('typing-text');
const PHRASES = [
  'Isotope hydrology',
  'Tracer studies',
  'GIS environmental monitoring',
  'Climate resilience',
  'QA/QC workflows (R)',
  'δ¹⁸O & δ²H',
];
if (typingEl) {
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const phrase = PHRASES[phraseIndex];
    if (isDeleting) {
      typingEl.textContent = phrase.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % PHRASES.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 50);
    } else {
      typingEl.textContent = phrase.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === phrase.length) {
        isDeleting = true;
        setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 80);
    }
  }
  setTimeout(tick, 600);
}

// Placeholder handlers (CV and LinkedIn link)
document.querySelector('[data-cv-link]')?.addEventListener('click', (e) => {
  const href = e.currentTarget.getAttribute('href');
  if (href === '#') {
    e.preventDefault();
    alert('Attach your CV file or URL to this button.');
  }
});

document.querySelector('[data-linkedin]')?.addEventListener('click', (e) => {
  const href = e.currentTarget.getAttribute('href');
  if (href === '#') {
    e.preventDefault();
    alert('Replace this with your actual LinkedIn profile URL.');
  }
});

