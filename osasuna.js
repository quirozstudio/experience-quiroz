const body = document.body;
const intro = document.querySelector('#norteIntro');
const enter = document.querySelector('#norteEnter');
const skip = document.querySelector('#norteSkip');
const header = document.querySelector('#norteHeader');
const soundButton = document.querySelector('#norteSound');
const progress = document.querySelector('#norteProgress');
const letterButton = document.querySelector('#openLetter');
const letterCopy = document.querySelector('#letterCopy');

const osasunaAudio = new Audio('./assets/osasuna-demo/cantico-osasuna.mp4');
osasunaAudio.preload = 'auto';
osasunaAudio.volume = 0.88;

let introTimer;
let audioFadeTimer;
let audioFadeFrame;
let soundActive = false;

function createAmbience() {
  window.clearTimeout(audioFadeTimer);
  cancelAnimationFrame(audioFadeFrame);
  if (osasunaAudio.ended) osasunaAudio.currentTime = 0;
  osasunaAudio.volume = 0.88;
  osasunaAudio.play().catch(() => {
    soundActive = false;
    soundButton.classList.add('is-muted');
    soundButton.setAttribute('aria-pressed', 'false');
  });
  soundActive = true;
  soundButton.hidden = false;
  soundButton.classList.remove('is-muted');
  soundButton.setAttribute('aria-pressed', 'true');
}

function stopAmbience(fade = 0.8) {
  window.clearTimeout(audioFadeTimer);
  cancelAnimationFrame(audioFadeFrame);
  if (osasunaAudio.paused) return;
  const initialVolume = osasunaAudio.volume;
  const startedAt = performance.now();
  const duration = fade * 1000;

  const fadeAudio = (now) => {
    const amount = Math.min(1, (now - startedAt) / duration);
    osasunaAudio.volume = initialVolume * (1 - amount);
    if (amount < 1) {
      audioFadeFrame = requestAnimationFrame(fadeAudio);
      return;
    }
    osasunaAudio.pause();
    osasunaAudio.currentTime = 0;
  };
  audioFadeFrame = requestAnimationFrame(fadeAudio);
  soundActive = false;
  soundButton.classList.add('is-muted');
  soundButton.setAttribute('aria-pressed', 'false');
}

function finishIntro({ skipped = false } = {}) {
  window.clearTimeout(introTimer);
  if (skipped) stopAmbience(0.4);
  intro.classList.add('is-finished');
  body.classList.remove('norte-intro-open');
  window.setTimeout(() => { intro.hidden = true; }, 850);
}

enter.addEventListener('click', () => {
  enter.disabled = true;
  intro.classList.add('is-playing');
  createAmbience();
  introTimer = window.setTimeout(finishIntro, 4400);
  audioFadeTimer = window.setTimeout(() => stopAmbience(5), 15000);
});
skip.addEventListener('click', () => finishIntro({ skipped: true }));

soundButton.addEventListener('click', () => {
  if (soundActive) stopAmbience(0.5);
  else createAmbience();
});

const canvas = document.querySelector('#norteEnergy');
const context = canvas.getContext('2d');
let particles = [];
let animationFrame;

function sizeCanvas() {
  const ratio = Math.min(devicePixelRatio, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function seedParticles() {
  const amount = Math.min(80, Math.floor(innerWidth / 9));
  particles = Array.from({ length: amount }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    radius: 0.4 + Math.random() * 1.5,
    speed: 0.15 + Math.random() * 0.75,
    drift: (Math.random() - 0.5) * 0.3,
    alpha: 0.12 + Math.random() * 0.6
  }));
}

function drawParticles() {
  context.clearRect(0, 0, innerWidth, innerHeight);
  particles.forEach((particle) => {
    particle.y -= particle.speed;
    particle.x += particle.drift;
    if (particle.y < -5) {
      particle.y = innerHeight + 5;
      particle.x = Math.random() * innerWidth;
    }
    context.fillStyle = `rgba(227,28,56,${particle.alpha})`;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();
  });
  animationFrame = requestAnimationFrame(drawParticles);
}

sizeCanvas();
seedParticles();
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) drawParticles();
window.addEventListener('resize', () => { sizeCanvas(); seedParticles(); });

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

function updateScroll() {
  header.classList.toggle('is-scrolled', scrollY > 24);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.height = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
}
updateScroll();
window.addEventListener('scroll', updateScroll, { passive: true });

letterButton.addEventListener('click', () => {
  const shouldOpen = letterCopy.hidden;
  letterCopy.hidden = !shouldOpen;
  letterCopy.classList.toggle('is-open', shouldOpen);
  letterButton.setAttribute('aria-expanded', String(shouldOpen));
  letterButton.querySelector('span').textContent = shouldOpen ? 'Cerrar la carta' : 'Leer la carta';
  letterButton.querySelector('i').textContent = shouldOpen ? '−' : '＋';
  if (shouldOpen) letterCopy.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && soundActive) stopAmbience(0.25);
});
