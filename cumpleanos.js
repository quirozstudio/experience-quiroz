const birthdayBody = document.body;
const birthdayIntro = document.querySelector('#birthdayIntro');
const birthdayEnter = document.querySelector('#birthdayEnter');
const birthdaySkip = document.querySelector('#birthdaySkip');
const birthdayHeader = document.querySelector('#birthdayHeader');
const birthdayProgress = document.querySelector('#birthdayProgress');

let birthdayIntroTimer;

function playBirthdayChime() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const notes = [261.63, 329.63, 392, 523.25];
  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + index * 0.16;
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.085, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.1);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 1.15);
  });
}

function finishBirthdayIntro() {
  window.clearTimeout(birthdayIntroTimer);
  birthdayIntro.classList.add('is-finished');
  birthdayBody.classList.remove('birthday-intro-open');
  window.setTimeout(() => { birthdayIntro.hidden = true; }, 900);
}

birthdayEnter.addEventListener('click', () => {
  birthdayEnter.disabled = true;
  birthdayIntro.classList.add('is-playing');
  playBirthdayChime();
  birthdayIntroTimer = window.setTimeout(finishBirthdayIntro, 3900);
});
birthdaySkip.addEventListener('click', finishBirthdayIntro);

const birthdayObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      birthdayObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((element) => birthdayObserver.observe(element));

function updateBirthdayScroll() {
  birthdayHeader.classList.toggle('is-scrolled', scrollY > 24);
  const maximum = document.documentElement.scrollHeight - innerHeight;
  birthdayProgress.style.height = `${maximum > 0 ? (scrollY / maximum) * 100 : 0}%`;
}
updateBirthdayScroll();
window.addEventListener('scroll', updateBirthdayScroll, { passive: true });

const timelineStories = [
  'El día en que una nueva historia empezó sin saber todavía todo lo bueno que traería consigo.',
  'La época de preguntar por qué, imaginar mundos enteros y convertir cualquier rincón en una aventura.',
  'Llegaron las primeras decisiones importantes, las personas elegidas y el valor de empezar a ser una misma.',
  'Treinta años después: más segura, más libre y todavía capaz de sorprenderse con todo lo que queda por vivir.'
];

const yearButtons = [...document.querySelectorAll('.birthday-year')];
const timelineStory = document.querySelector('#birthdayTimelineStory');
yearButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = Number(button.dataset.year);
    yearButtons.forEach((item, index) => {
      item.classList.toggle('is-active', index === selected);
      item.setAttribute('aria-pressed', String(index === selected));
    });
    timelineStory.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'ease' });
    timelineStory.textContent = timelineStories[selected];
  });
});

const reasons = [
  'Porque sabes escuchar incluso cuando nadie encuentra las palabras.',
  'Porque haces hogar en cualquier mesa donde te sientas.',
  'Porque recuerdas los detalles que los demás olvidamos.',
  'Porque tu risa siempre llega antes que cualquier problema.',
  'Porque nunca preguntas si puedes ayudar: simplemente apareces.',
  'Porque haces que un martes cualquiera termine siendo una historia.',
  'Porque has aprendido a elegirte sin dejar de cuidar a los demás.',
  'Porque contigo las conversaciones importantes no tienen prisa.',
  'Porque sigues mirando el mundo con curiosidad.',
  'Porque todavía te emocionan las pequeñas primeras veces.',
  'Porque sabes celebrar las victorias ajenas como propias.',
  'Porque has cambiado muchas veces sin dejar de ser tú.',
  'Porque tu valentía casi siempre parece tranquila.',
  'Porque sabes pedir perdón y también perdonarte.',
  'Porque guardas fotografías que nadie más habría conservado.',
  'Porque haces mejores las sobremesas.',
  'Porque siempre tienes una canción para cada momento.',
  'Porque no necesitas tener todas las respuestas para seguir adelante.',
  'Porque tus abrazos nunca llegan a medias.',
  'Porque has construido amistades que ya son familia.',
  'Porque sabes cuándo hablar y cuándo quedarte cerca en silencio.',
  'Porque sigues encontrando motivos para empezar de nuevo.',
  'Porque has convertido los errores en dirección.',
  'Porque haces espacio para que los demás sean ellos mismos.',
  'Porque cuidas de la gente sin hacer ruido.',
  'Porque has aprendido a decir que no cuando también era quererte.',
  'Porque incluso cansada sigues viendo belleza.',
  'Porque todavía quedan lugares que descubrir contigo.',
  'Porque estos treinta años solo son el principio.',
  'Porque el mundo es un poco más amable desde que estás en él.'
];
let reasonIndex = 0;
const reasonNumber = document.querySelector('#birthdayReasonNumber');
const reasonText = document.querySelector('#birthdayReasonText');

function showReason(nextIndex) {
  reasonIndex = (nextIndex + reasons.length) % reasons.length;
  reasonNumber.textContent = `${String(reasonIndex + 1).padStart(2, '0')} / 30`;
  reasonText.textContent = reasons[reasonIndex];
  reasonText.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'ease' });
}
document.querySelector('#birthdayReasonPrev').addEventListener('click', () => showReason(reasonIndex - 1));
document.querySelector('#birthdayReasonNext').addEventListener('click', () => showReason(reasonIndex + 1));

document.querySelectorAll('.birthday-voice__button').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.birthday-voice');
    const transcript = card.querySelector('p');
    const isOpening = transcript.hidden;
    document.querySelectorAll('.birthday-voice p').forEach((item) => { item.hidden = true; });
    document.querySelectorAll('.birthday-voice__button').forEach((item) => {
      item.querySelector('i').textContent = '▶';
      item.querySelector('b').textContent = 'Escuchar mensaje';
    });
    transcript.hidden = !isOpening;
    if (isOpening) {
      transcript.textContent = button.dataset.message;
      button.querySelector('i').textContent = 'Ⅱ';
      button.querySelector('b').textContent = 'Leyendo mensaje';
    }
  });
});

const wishSection = document.querySelector('#birthdayWish');
const wishButton = document.querySelector('#makeBirthdayWish');
const wishMessage = document.querySelector('#birthdayWishMessage');
const confettiCanvas = document.querySelector('#birthdayConfetti');
const confettiContext = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiFrame;

function launchConfetti() {
  const ratio = Math.min(devicePixelRatio, 2);
  confettiCanvas.width = innerWidth * ratio;
  confettiCanvas.height = innerHeight * ratio;
  confettiContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  const colors = ['#f2a29b', '#d8b978', '#f6e8d5', '#8f557f'];
  confettiParticles = Array.from({ length: 130 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 120,
    y: innerHeight * 0.48,
    vx: (Math.random() - 0.5) * 13,
    vy: -4 - Math.random() * 10,
    gravity: 0.18 + Math.random() * 0.12,
    size: 3 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI
  }));
  const draw = () => {
    confettiContext.clearRect(0, 0, innerWidth, innerHeight);
    confettiParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += particle.gravity;
      particle.rotation += 0.08;
      confettiContext.save();
      confettiContext.translate(particle.x, particle.y);
      confettiContext.rotate(particle.rotation);
      confettiContext.fillStyle = particle.color;
      confettiContext.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
      confettiContext.restore();
    });
    confettiParticles = confettiParticles.filter((particle) => particle.y < innerHeight + 30);
    if (confettiParticles.length) confettiFrame = requestAnimationFrame(draw);
    else confettiContext.clearRect(0, 0, innerWidth, innerHeight);
  };
  draw();
}

wishButton.addEventListener('click', () => {
  wishSection.classList.add('wish-made');
  wishMessage.hidden = false;
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) launchConfetti();
});

const letterButton = document.querySelector('#birthdayOpenLetter');
const letterCopy = document.querySelector('#birthdayLetterCopy');
letterButton.addEventListener('click', () => {
  const shouldOpen = letterCopy.hidden;
  letterCopy.hidden = !shouldOpen;
  letterCopy.classList.toggle('is-open', shouldOpen);
  letterButton.setAttribute('aria-expanded', String(shouldOpen));
  letterButton.querySelector('span').textContent = shouldOpen ? 'Cerrar la carta' : 'Abrir la carta';
  letterButton.querySelector('i').textContent = shouldOpen ? '−' : '＋';
  if (shouldOpen) letterCopy.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

window.addEventListener('resize', () => cancelAnimationFrame(confettiFrame));
