/* ============================================
   SIMON ZEÏER — script.js
   ============================================ */

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile menu
function toggleMenu() {
  document.getElementById('navMobile').classList.toggle('open');
}

// Waveform SVG animation
(function drawWave() {
  const wave = document.getElementById('wave');
  if (!wave) return;
  const w = 1400, h = 200, amp = 60, freq = 0.012;
  let offset = 0;

  function render() {
    let pts = [];
    for (let x = 0; x <= w; x += 4) {
      const y = h / 2
        + Math.sin(x * freq + offset) * amp * 0.6
        + Math.sin(x * freq * 2.3 + offset * 1.4) * amp * 0.3
        + Math.sin(x * freq * 0.5 + offset * 0.7) * amp * 0.4;
      pts.push(`${x},${y}`);
    }
    wave.setAttribute('points', pts.join(' '));
    offset += 0.012;
    requestAnimationFrame(render);
  }
  render();
})();

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

// Add reveal class to sections
document.querySelectorAll('.work-card, .video-wrap, .about-text, .about-visual, .section-header').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Contact form feedback
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', function(e) {
    const btn = form.querySelector('.btn-send span');
    btn.textContent = 'Envoi en cours…';
  });
}

// Show status message after form submission
const params = new URLSearchParams(window.location.search);
const status = params.get('status');
if (status === 'success') {
  const msg = document.createElement('div');
  msg.style.cssText = 'position:fixed;bottom:32px;right:32px;z-index:999;background:#0f0e0c;border:1px solid rgba(100,80,255,0.4);color:#b48c50;font-family:"Syncopate",sans-serif;font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;padding:16px 24px;';
  msg.textContent = 'Message envoyé ✓';
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 5000);
  // Nettoyer l'URL
  history.replaceState({}, '', window.location.pathname);
} else if (status === 'error') {
  const msg = document.createElement('div');
  msg.style.cssText = 'position:fixed;bottom:32px;right:32px;z-index:999;background:#0f0e0c;border:1px solid rgba(200,60,60,0.4);color:#c84040;font-family:"Syncopate",sans-serif;font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;padding:16px 24px;';
  msg.textContent = 'Erreur — réessayez';
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 5000);
  history.replaceState({}, '', window.location.pathname);
}


// Spectrum visualizer
(function spectrum() {
  const canvas = document.getElementById('spectrumCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const BARS = 48;
  const gold = 'rgba(100,80,255,';

  // Each bar has its own phase, speed and base height
  const bars = Array.from({ length: BARS }, (_, i) => ({
    phase:  Math.random() * Math.PI * 2,
    speed:  0.018 + Math.random() * 0.025,
    base:   0.18 + Math.random() * 0.35,
    amp:    0.12 + Math.random() * 0.28,
  }));

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const barW = W / BARS;
    const gap  = barW * 0.28;

    bars.forEach((b, i) => {
      // Organic movement: mix two sine waves
      const h = (b.base + b.amp * Math.sin(b.phase + t * b.speed)
                        + b.amp * 0.4 * Math.sin(b.phase * 1.7 + t * b.speed * 0.6)) * H;
      const x = i * barW + gap / 2;
      const w = barW - gap;
      const y = H - h;

      // Gradient: brighter at top
      const grad = ctx.createLinearGradient(0, y, 0, H);
      grad.addColorStop(0, gold + '0.85)');
      grad.addColorStop(0.5, gold + '0.45)');
      grad.addColorStop(1,   gold + '0.1)');

      ctx.fillStyle = grad;
      ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.round(h));
    });

    // Subtle horizontal base line
    ctx.strokeStyle = gold + '0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H - 1);
    ctx.lineTo(W, H - 1);
    ctx.stroke();

    t++;
    requestAnimationFrame(draw);
  }
  draw();
})();

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--gold)'
      : '';
  });
}, { passive: true });
