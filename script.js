/* ═══════════════════════════════════════════════════════════
   KHADERSHA BIRTHDAY — script.js
   Premium Interactive Birthday Experience
═══════════════════════════════════════════════════════════ */

'use strict';

// ─── STATE ────────────────────────────────────────────────
const state = {
  currentPage:    0,         // 0-indexed
  totalPages:     5,
  galleryIndex:   0,
  letterOpened:   false,
  candlesBlown:   false,
  celebrating:    false,
  musicPlaying:   false,
  fireworksAnim:  null,
  countdownTimer: null,
};

// ─── DOM REFERENCES ───────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const loadingScreen  = $('#loading-screen');
const loadingBar     = $('#loading-bar');
const mainWrapper    = $('#main-wrapper');
const pages          = $$('.page');
const progressDots   = $$('.progress-dot');
const musicToggle    = $('#music-toggle');
const audio          = $('#birthday-audio');

// ─── 1. LOADING ANIMATION ─────────────────────────────────
(function initLoading() {
  initLoadingStars();

  let progress = 0;
  const steps = [15, 35, 58, 75, 90, 100];
  let stepIdx = 0;

  const interval = setInterval(() => {
    if (stepIdx >= steps.length) { clearInterval(interval); return; }
    progress = steps[stepIdx++];
    loadingBar.style.width = progress + '%';
    if (progress === 100) {
      setTimeout(finishLoading, 600);
    }
  }, 420);
})();

function finishLoading() {
  loadingScreen.classList.add('fade-out');
  setTimeout(() => {
    loadingScreen.style.display = 'none';
    mainWrapper.classList.remove('hidden');
    showPage(0);
    $('#progress-indicator').classList.add('visible');
    musicToggle.classList.add('visible');
    startCountdown();
    initParticles();
    initStarsCanvas('stars-canvas');
  }, 1000);
}

// Loading screen mini-stars
function initLoadingStars() {
  const canvas = $('#loading-stars');
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    a: Math.random(),
    speed: Math.random() * 0.008 + 0.003,
  }));

  let animId;
  function drawLoadingStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.speed;
      if (s.a > 1) s.a = 0;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,216,121,${s.a * 0.6})`;
      ctx.fill();
    });
    animId = requestAnimationFrame(drawLoadingStars);
  }
  drawLoadingStars();
  // Stop when loading ends
  setTimeout(() => cancelAnimationFrame(animId), 5000);
}

// ─── 2. COUNTDOWN ─────────────────────────────────────────
function startCountdown() {
  // Explicitly set midnight IST (UTC+05:30) so countdown is correct worldwide
  const birthdayDate = new Date('2026-11-03T00:00:00+05:30');

  function tick() {
    const now  = new Date();
    const diff = birthdayDate - now;

    if (diff <= 0) {
      // Birthday is now!
      $('#cd-days').textContent  = '00';
      $('#cd-hours').textContent = '00';
      $('#cd-mins').textContent  = '00';
      $('#cd-secs').textContent  = '00';
      const box = $('#countdown-box');
      box.innerHTML = '<div style="font-family:var(--font-serif);color:var(--gold-glow);font-size:1.1rem;text-align:center;padding:0.5rem;">🎉 Today is the Day! Happy Birthday, Annaya! 🎉</div>';
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    $('#cd-days').textContent  = String(days).padStart(2, '0');
    $('#cd-hours').textContent = String(hours).padStart(2, '0');
    $('#cd-mins').textContent  = String(mins).padStart(2, '0');
    $('#cd-secs').textContent  = String(secs).padStart(2, '0');
  }

  tick();
  state.countdownTimer = setInterval(tick, 1000);
}

// ─── 3. STARS CANVAS ──────────────────────────────────────
// Track active animation frame IDs per canvas to prevent stacking RAF loops
const starAnimFrames = {};

function initStarsCanvas(canvasId) {
  const canvas = $('#' + canvasId);
  if (!canvas) return;

  // Cancel any existing loop for this canvas before starting a new one
  if (starAnimFrames[canvasId]) {
    cancelAnimationFrame(starAnimFrames[canvasId]);
    starAnimFrames[canvasId] = null;
  }

  const ctx = canvas.getContext('2d');

  // Size canvas via its parent (position:absolute makes offsetWidth=0)
  function resize() {
    const parent = canvas.parentElement;
    canvas.width  = parent ? parent.clientWidth  : window.innerWidth;
    canvas.height = parent ? parent.clientHeight : window.innerHeight;
  }
  resize();

  // Use a named handler so we can remove it on cleanup
  const resizeHandler = () => resize();
  window.addEventListener('resize', resizeHandler);

  const stars = Array.from({ length: 200 }, () => ({
    x:     Math.random() * canvas.width,
    y:     Math.random() * canvas.height,
    r:     Math.random() * 1.8 + 0.4,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.005 + 0.002,
    type:  Math.random() < 0.15 ? 'cross' : 'dot',
  }));

  function drawStar(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const inner = r * 0.35;
      if (i === 0) ctx.moveTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
      ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
      ctx.lineTo(x + inner * Math.cos(angle + Math.PI / 4), y + inner * Math.sin(angle + Math.PI / 4));
    }
    ctx.closePath();
    ctx.fill();
  }

  let tick = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tick++;
    stars.forEach(s => {
      s.phase += s.speed;
      const alpha = (Math.sin(s.phase) + 1) / 2;
      ctx.fillStyle = `rgba(245,216,121,${alpha * 0.5})`;
      if (s.type === 'cross') {
        drawStar(ctx, s.x, s.y, s.r * 2.5);
      } else {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    starAnimFrames[canvasId] = requestAnimationFrame(draw);
  }
  draw();
  // Cleanup resize listener if this canvas is ever destroyed
  canvas._resizeCleanup = () => window.removeEventListener('resize', resizeHandler);
}

// ─── 4. PARTICLES ─────────────────────────────────────────
function initParticles() {
  const container = $('#particles');
  if (!container) return;
  const colors = ['#f5d879', '#e8be55', '#c9982a', '#ffcfef', '#a8d8ea'];

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left      = Math.random() * 100 + '%';
    p.style.top       = Math.random() * 100 + '%';
    p.style.width     = (Math.random() * 5 + 2) + 'px';
    p.style.height    = p.style.width;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration  = (Math.random() * 6 + 4) + 's';
    p.style.animationDelay     = (Math.random() * 8) + 's';
    p.style.borderRadius       = Math.random() < 0.4 ? '0' : '50%';
    container.appendChild(p);
  }
}

// ─── 5. PAGE NAVIGATION ───────────────────────────────────
function showPage(idx, direction = 'forward') {
  if (idx < 0 || idx >= state.totalPages) return;

  const prev = state.currentPage;
  const prevPage = pages[prev];
  const nextPage = pages[idx];

  // Exit animation on previous page
  if (prevPage && prevPage !== nextPage) {
    prevPage.classList.remove('active');
    prevPage.classList.add(direction === 'forward' ? 'exit-up' : 'exit-down');
    setTimeout(() => prevPage.classList.remove('exit-up', 'exit-down'), 700);
  }

  state.currentPage = idx;

  // Slight delay for stagger effect
  requestAnimationFrame(() => {
    nextPage.classList.add('active');
    nextPage.classList.remove('exit-up', 'exit-down');
  });

  // Update progress dots
  progressDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === idx);
  });

  // Per-page initializers
  onPageEnter(idx);
}

function onPageEnter(idx) {
  switch (idx) {
    case 0:
      initStarsCanvas('stars-canvas');
      break;
    case 1:
      initStarsCanvas('memories-canvas');
      showMemory(state.galleryIndex);
      break;
    case 2:
      initStarsCanvas('letter-canvas');
      break;
    case 3:
      initStarsCanvas('timeline-canvas');
      animateTimeline();
      break;
    case 4:
      initFireworks();
      spawnBalloons();
      if (!state.celebrating) {
        state.celebrating = true;
        setTimeout(() => spawnConfetti(), 800);
      }
      break;
  }
}

// ─── 6. GALLERY ───────────────────────────────────────────
const polaroids = $$('.polaroid');
const thumbs    = $$('.thumb');

function showMemory(idx) {
  polaroids.forEach((p, i) => {
    p.classList.toggle('active', i === idx);
  });
  thumbs.forEach((t, i) => {
    t.classList.toggle('active', i === idx);
    t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
  });
  $('#gallery-counter').textContent = `${idx + 1} / ${polaroids.length}`;
  state.galleryIndex = idx;
}

$('#btn-next').addEventListener('click', () => {
  const next = (state.galleryIndex + 1) % polaroids.length;
  showMemory(next);
});
$('#btn-prev').addEventListener('click', () => {
  const prev = (state.galleryIndex - 1 + polaroids.length) % polaroids.length;
  showMemory(prev);
});

thumbs.forEach(t => {
  t.addEventListener('click', () => showMemory(Number(t.dataset.idx)));
});

// Touch swipe for gallery
let touchStartX = 0;
$('#gallery-track').addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });
$('#gallery-track').addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) {
    dx < 0
      ? showMemory((state.galleryIndex + 1) % polaroids.length)
      : showMemory((state.galleryIndex - 1 + polaroids.length) % polaroids.length);
  }
});

// ─── 7. LETTER / ENVELOPE ─────────────────────────────────
const envelope      = $('#envelope');
const letterReveal  = $('#letter-reveal');
const btnOpenLetter = $('#btn-open-letter');
const btnToTimeline = $('#btn-to-timeline');

function openLetter() {
  if (state.letterOpened) return;
  state.letterOpened = true;

  envelope.classList.add('opening');
  btnOpenLetter.disabled = true;
  btnOpenLetter.style.opacity = '0.4';

  setTimeout(() => {
    envelope.style.display = 'none';
    letterReveal.hidden = false;
    letterReveal.removeAttribute('hidden');
    btnOpenLetter.style.display = 'none';
    btnToTimeline.classList.add('visible');
    // Typewriter-style line animation already handled by CSS
    animateLetterLines();
  }, 500);
}

btnOpenLetter.addEventListener('click', openLetter);
envelope.addEventListener('click', openLetter);
envelope.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') openLetter();
});

function animateLetterLines() {
  const paras = $$('.letter-text p', letterReveal);
  paras.forEach((p, i) => {
    p.style.opacity   = '0';
    p.style.transform = 'translateY(10px)';
    p.style.transition = 'opacity 0.5s, transform 0.5s';
    setTimeout(() => {
      p.style.opacity   = '1';
      p.style.transform = 'translateY(0)';
    }, 150 + i * 180);
  });
}

// ─── 8. TIMELINE ANIMATION ────────────────────────────────
function animateTimeline() {
  const items = $$('.timeline-item');
  items.forEach((item, i) => {
    item.style.opacity   = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.5s, transform 0.5s';
    setTimeout(() => {
      item.style.opacity   = '1';
      item.style.transform = 'translateX(0)';
    }, 200 + i * 200);
  });
}

// ─── 9. CANDLE BLOW ───────────────────────────────────────
// ─── 9. CANDLE BLOW ───────────────────────────────────────
const cake = $('#birthday-cake');

if (cake) {
  cake.addEventListener('click', blowCandles);
  cake.addEventListener('keydown', e => {
    if (e.key === 'Enter') blowCandles();
  });
}

function blowCandles() {
  if (!cake || state.candlesBlown) return;

  state.candlesBlown = true;
  cake.classList.add('blown');

  const hint = $('#cake-hint');
  if (hint) {
    hint.textContent = '🎉 Woohoo! Make a wish!';
  }

  const flames = $$('.flame');

  flames.forEach((f, i) => {
    setTimeout(() => {
      f.classList.add('out');
    }, i * 120);
  });

  setTimeout(() => {
    spawnConfetti(60);
    launchGoldFireworks();
  }, 700);

  setTimeout(() => cake.classList.remove('blown'), 400);
}
// ─── 10. FIREWORKS CANVAS ─────────────────────────────────
function initFireworks() {
  const canvas = $('#fireworks-canvas');
  if (!canvas || starAnimations['fireworks-canvas-running']) return;
  starAnimations['fireworks-canvas-running'] = true;

  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];

  class FireworkParticle {
    constructor(x, y, color) {
      this.x   = x;
      this.y   = y;
      this.vx  = (Math.random() - 0.5) * 8;
      this.vy  = (Math.random() - 0.5) * 8 - 2;
      this.alpha = 1;
      this.r   = Math.random() * 3 + 1;
      this.color = color;
      this.gravity = 0.12;
      this.decay = Math.random() * 0.012 + 0.008;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.98;
      this.alpha -= this.decay;
    }
    draw(ctx) {
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    dead() { return this.alpha <= 0; }
  }

  function burst(x, y) {
    const colors = ['#f5d879','#e8be55','#ff6b9d','#a29bfe','#74b9ff','#fd79a8','#fdcb6e','#00cec9'];
    const count  = 60 + Math.floor(Math.random() * 40);
    const color  = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < count; i++) {
      particles.push(new FireworkParticle(x, y, color));
    }
  }

  // Auto-launch fireworks periodically
  let lastBurst = 0;
  function autoLaunch(ts) {
    if (ts - lastBurst > 1200) {
      const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
      const y = Math.random() * canvas.height * 0.5 + 60;
      burst(x, y);
      lastBurst = ts;
    }
  }

  function loop(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    autoLaunch(ts);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (particles[i].dead()) particles.splice(i, 1);
    }
    state.fireworksAnim = requestAnimationFrame(loop);
  }
  state.fireworksAnim = requestAnimationFrame(loop);

  // Click to launch firework on canvas
  canvas.style.pointerEvents = 'all';
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    burst(e.clientX - rect.left, e.clientY - rect.top);
  });
}

function launchGoldFireworks() {
  const canvas = $('#fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const colors = ['#f5d879','#e8be55','#ffeaa0','#c9982a'];
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.35;
  const particles = [];

  class P {
    constructor() {
      this.x = cx + (Math.random()-0.5)*40;
      this.y = cy + (Math.random()-0.5)*40;
      this.vx = (Math.random()-0.5)*12;
      this.vy = (Math.random()-0.5)*12 - 3;
      this.a = 1;
      this.r = Math.random()*4+1;
      this.c = colors[Math.floor(Math.random()*colors.length)];
      this.g = 0.15;
      this.d = Math.random()*0.015+0.007;
    }
    update() { this.x+=this.vx; this.y+=this.vy; this.vy+=this.g; this.vx*=0.97; this.a-=this.d; }
    draw()   { ctx.globalAlpha=this.a; ctx.fillStyle=this.c; ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; }
  }

  for(let i=0;i<120;i++) particles.push(new P());

  function draw() {
    particles.forEach(p => { p.update(); p.draw(); });
    particles.filter(p => p.a > 0);
    if (particles.some(p => p.a > 0)) requestAnimationFrame(draw);
  }
  draw();
}

// ─── 11. BALLOONS ─────────────────────────────────────────
function spawnBalloons() {
  const container = $('#balloons');
  const emojis    = ['🎈','🎈','🎈','🎀','🎊','🎉'];
  container.innerHTML = '';

  for (let i = 0; i < 12; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    b.style.left     = Math.random() * 95 + '%';
    b.style.fontSize = (2.5 + Math.random() * 1.5) + 'rem';
    const duration   = 6 + Math.random() * 8;
    const delay      = Math.random() * 6;
    b.style.animationDuration = duration + 's';
    b.style.animationDelay    = delay + 's';
    container.appendChild(b);
  }
}

// ─── 12. CONFETTI ─────────────────────────────────────────
function spawnConfetti(count = 80) {
  const container = $('#confetti-container');
  if (!container) return;
  const colors = ['#f5d879','#e8be55','#ff6b9d','#a29bfe','#74b9ff','#fd79a8','#00cec9','#6c5ce7'];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left          = Math.random() * 100 + '%';
    piece.style.background    = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width         = (5 + Math.random() * 6) + 'px';
    piece.style.height        = (5 + Math.random() * 6) + 'px';
    piece.style.borderRadius  = Math.random() < 0.5 ? '50%' : '2px';
    piece.style.animationDuration  = (3 + Math.random() * 4) + 's';
    piece.style.animationDelay     = (Math.random() * 2) + 's';
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 8000);
  }
}

// ─── 13. MUSIC ────────────────────────────────────────────
musicToggle.addEventListener('click', toggleMusic);

function toggleMusic() {
  if (!state.musicPlaying) {
    audio.play().then(() => {
      state.musicPlaying = true;
      musicToggle.classList.add('playing');
      musicToggle.querySelector('.music-label').textContent = 'Playing';
    }).catch(() => {
      // Autoplay blocked — show notice
      musicToggle.querySelector('.music-label').textContent = 'No audio';
    });
  } else {
    audio.pause();
    state.musicPlaying = false;
    musicToggle.classList.remove('playing');
    musicToggle.querySelector('.music-label').textContent = 'Music';
  }
}

// ─── 14. PROGRESS DOT CLICK ───────────────────────────────
progressDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    const dir = i > state.currentPage ? 'forward' : 'backward';
    showPage(i, dir);
  });
});

// ─── 15. PAGE NAVIGATION BUTTONS ──────────────────────────
$('#btn-begin').addEventListener('click',        () => showPage(1));
$('#btn-to-letter').addEventListener('click',    () => showPage(2));
$('#btn-to-timeline').addEventListener('click',  () => showPage(3));
$('#btn-to-celebration').addEventListener('click', () => showPage(4));

$('#btn-replay').addEventListener('click', () => {
  // Reset state
  state.galleryIndex  = 0;
  state.letterOpened  = false;
  state.candlesBlown  = false;
  state.celebrating   = false;

  // Reset envelope/letter
  const env = $('#envelope');
  const reveal = $('#letter-reveal');
  env.classList.remove('opening');
  env.style.display   = '';
  env.style.opacity   = '1';
  reveal.hidden = true;
  $('#btn-open-letter').style.display = '';
  $('#btn-open-letter').style.opacity = '1';
  $('#btn-open-letter').disabled = false;
  $('#btn-to-timeline').classList.remove('visible');

  // Reset candles
  $$('.flame').forEach(f => f.classList.remove('out'));
  const hint = $('#cake-hint');
  if (hint) hint.textContent = '🌬 Click the cake to blow out candles!';

  showPage(0, 'backward');
});

// ─── 16. KEYBOARD NAVIGATION ──────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    if (state.currentPage < state.totalPages - 1) showPage(state.currentPage + 1);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    if (state.currentPage > 0) showPage(state.currentPage - 1, 'backward');
  }
  // Gallery arrow keys when on page 2
  if (state.currentPage === 1) {
    if (e.key === 'ArrowRight') showMemory((state.galleryIndex + 1) % polaroids.length);
    if (e.key === 'ArrowLeft')  showMemory((state.galleryIndex - 1 + polaroids.length) % polaroids.length);
  }
});

// ─── 17. WINDOW RESIZE ────────────────────────────────────
window.addEventListener('resize', () => {
  // Reinit canvases on resize is handled inside each canvas init via their own resize listeners
});

// ─── 18. TOUCH SWIPE FOR PAGE NAV ─────────────────────────
let pageTouchStartY = 0;
let pageTouchStartX = 0;
document.addEventListener('touchstart', e => {
  pageTouchStartY = e.changedTouches[0].clientY;
  pageTouchStartX = e.changedTouches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', e => {
  // Only navigate pages if NOT on gallery (gallery handles its own swipe)
  if (state.currentPage === 1) return;

  const dy = e.changedTouches[0].clientY - pageTouchStartY;
  const dx = e.changedTouches[0].clientX - pageTouchStartX;

  // Only trigger if mostly vertical swipe
  if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 60) {
    if (dy < 0 && state.currentPage < state.totalPages - 1) {
      showPage(state.currentPage + 1);
    } else if (dy > 0 && state.currentPage > 0) {
      showPage(state.currentPage - 1, 'backward');
    }
  }
}, { passive: true });

// ─── 19. CELEBATION CANVAS STARS ─────────────────────────
// (Handled via initFireworks on page enter)

// ─── 20. EASTER EGG: Click name for burst ─────────────────
document.addEventListener('DOMContentLoaded', () => {
  const nameEl = $('#main-name');
  if (nameEl) {
    nameEl.style.cursor = 'pointer';
    nameEl.addEventListener('click', () => {
      initParticles();
    });
  }
});

console.log('%c🎂 Happy Birthday, Khadersha Annaya! 🎂', 'color:#f5d879;font-size:18px;font-family:Georgia;font-style:italic;');
console.log('%c Made with ❤️ by Your Sister', 'color:#e8be55;font-size:13px;');
