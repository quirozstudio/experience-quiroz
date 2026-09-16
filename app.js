const root = document.documentElement;
const body = document.body;

const presets = {
  amistad: {
    accent: '#ff5c35',
    rgb: '255, 92, 53',
    stageInk: '#130d0b',
    symbol: 'A',
    counter: 'EXPERIENCIA 01 / 04',
    eyebrow: 'PARA QUIEN SIEMPRE ESTÁ',
    title: 'Lo vuestro no<br>cabe en una caja.',
    text: 'Una historia construida con recuerdos pequeños que terminaron significándolo todo.',
    chapters: ['El comienzo', 'Los momentos', 'Lo que queda'],
    modalTitle: 'Aquí empieza<br>vuestro recuerdo.',
    modalText: 'Las historias importantes no necesitan ser perfectas. Solo necesitan ser verdad.'
  },
  pasion: {
    accent: '#ff3131',
    rgb: '255, 49, 49',
    stageInk: '#110708',
    symbol: '90',
    counter: 'EXPERIENCIA 02 / 04',
    eyebrow: 'PARA LO QUE OS HACE VIBRAR',
    title: 'La pasión también<br>guarda memoria.',
    text: 'El sonido, la espera, el lugar y la gente. Todo aquello que solo entiende quien lo ha vivido.',
    chapters: ['La primera vez', 'El gran día', 'La promesa'],
    modalTitle: 'Nunca fue solo<br>un resultado.',
    modalText: 'Fue el viaje, la voz rota y el abrazo justo cuando todo parecía imposible.'
  },
  amor: {
    accent: '#a984ff',
    rgb: '169, 132, 255',
    stageInk: '#0d0915',
    symbol: '∞',
    counter: 'EXPERIENCIA 03 / 04',
    eyebrow: 'PARA VUESTRA PROPIA HISTORIA',
    title: 'Todo lo que pasa<br>cuando os elegís.',
    text: 'Una experiencia íntima que habla de vosotros sin parecerse a ninguna historia de amor prestada.',
    chapters: ['El encuentro', 'Nuestro idioma', 'Lo que viene'],
    modalTitle: 'Volvería a elegirte<br>en cada historia.',
    modalText: 'Incluso sabiendo todos los caminos, volvería exactamente al lugar donde te encontré.'
  },
  familia: {
    accent: '#e7ae4b',
    rgb: '231, 174, 75',
    stageInk: '#151007',
    symbol: 'F',
    counter: 'EXPERIENCIA 04 / 04',
    eyebrow: 'PARA TODO LO QUE NOS UNE',
    title: 'Hay voces que siempre<br>nos llevan a casa.',
    text: 'Fotografías, anécdotas y palabras reunidas para que una historia familiar siga creciendo.',
    chapters: ['De dónde venimos', 'Lo compartido', 'Para siempre'],
    modalTitle: 'La memoria también<br>puede ser hogar.',
    modalText: 'Un lugar donde cada voz, cada gesto y cada fotografía vuelve a tener presente.'
  }
};

const intro = document.querySelector('#intro');
const enterExperience = document.querySelector('#enterExperience');
const skipIntro = document.querySelector('#skipIntro');
const siteHeader = document.querySelector('#siteHeader');
const menuToggle = document.querySelector('#menuToggle');
const mobileNav = document.querySelector('#mobileNav');
const stage = document.querySelector('#experienceStage');
const switcherButtons = [...document.querySelectorAll('.switcher-button')];
const chapterButtons = [...document.querySelectorAll('.chapter-button')];
const memoryModal = document.querySelector('#memoryModal');
const openMemory = document.querySelector('#openMemory');
const closeMemory = document.querySelector('#closeMemory');
const finishMemory = document.querySelector('#finishMemory');

let activePreset = 'amistad';

function finishIntro() {
  intro.classList.add('is-leaving');
  body.classList.remove('intro-open');
  window.setTimeout(() => {
    intro.hidden = true;
  }, 850);
}

enterExperience.addEventListener('click', finishIntro);
skipIntro.addEventListener('click', finishIntro);

function toggleMenu(force) {
  const shouldOpen = typeof force === 'boolean' ? force : !body.classList.contains('menu-open');
  body.classList.toggle('menu-open', shouldOpen);
  menuToggle.setAttribute('aria-expanded', String(shouldOpen));
  mobileNav.hidden = !shouldOpen;
}

menuToggle.addEventListener('click', () => toggleMenu());
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => toggleMenu(false)));

function updateHeader() {
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 24);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.13 }
);
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

function setText(selector, value, allowHtml = false) {
  const element = document.querySelector(selector);
  if (allowHtml) element.innerHTML = value;
  else element.textContent = value;
}

function applyPreset(name) {
  const preset = presets[name];
  activePreset = name;
  root.style.setProperty('--accent', preset.accent);
  root.style.setProperty('--accent-rgb', preset.rgb);
  root.style.setProperty('--stage-ink', preset.stageInk);
  stage.dataset.theme = name;
  setText('#stageCounter', preset.counter);
  setText('#stageSymbol', preset.symbol);
  setText('#stageEyebrow', preset.eyebrow);
  setText('#stageTitle', preset.title, true);
  setText('#stageText', preset.text);
  setText('#chapterOne', preset.chapters[0]);
  setText('#chapterTwo', preset.chapters[1]);
  setText('#chapterThree', preset.chapters[2]);
  setText('#memoryModalSymbol', preset.symbol);
  setText('#memoryModalTitle', preset.modalTitle, true);
  setText('#memoryModalText', preset.modalText);

  switcherButtons.forEach((button) => {
    const isActive = button.dataset.preset === name;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  chapterButtons.forEach((button, index) => {
    button.classList.toggle('is-active', index === 0);
    button.setAttribute('aria-pressed', String(index === 0));
  });
}

switcherButtons.forEach((button) => button.addEventListener('click', () => applyPreset(button.dataset.preset)));

chapterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const chapter = Number(button.dataset.chapter);
    chapterButtons.forEach((item, index) => {
      item.classList.toggle('is-active', index === chapter);
      item.setAttribute('aria-pressed', String(index === chapter));
    });
    const symbol = document.querySelector('#stageSymbol');
    symbol.animate(
      [
        { opacity: 0.12, transform: 'translateY(-50%) scale(.92)' },
        { opacity: 1, transform: 'translateY(-50%) scale(1)' }
      ],
      { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)' }
    );
  });
});

function showMemory() {
  memoryModal.hidden = false;
  body.classList.add('modal-open');
  closeMemory.focus();
}

function hideMemory() {
  memoryModal.hidden = true;
  body.classList.remove('modal-open');
  openMemory.focus();
}

openMemory.addEventListener('click', showMemory);
closeMemory.addEventListener('click', hideMemory);
finishMemory.addEventListener('click', hideMemory);
memoryModal.addEventListener('click', (event) => {
  if (event.target === memoryModal) hideMemory();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!memoryModal.hidden) hideMemory();
  else if (body.classList.contains('menu-open')) toggleMenu(false);
});

document.querySelector('#year').textContent = String(new Date().getFullYear());

applyPreset(activePreset);

// Subtle motion layer: keeps the existing interactions while adding depth.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const hero = document.querySelector('.hero');
const memoryObject = document.querySelector('.memory-object');

document.querySelectorAll('.featured-projects__grid, .process__steps').forEach((group) => {
  [...group.children].forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 70}ms`);
  });
});

function setCardLight(event) {
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  card.style.setProperty('--card-x', `${event.clientX - bounds.left}px`);
  card.style.setProperty('--card-y', `${event.clientY - bounds.top}px`);
}

document.querySelectorAll('.featured-project, .format-card').forEach((card) => {
  card.addEventListener('pointermove', setCardLight, { passive: true });
});

function moveMemory(event) {
  if (!finePointer.matches || reduceMotion.matches) return;
  const bounds = hero.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 20;
  const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 20;
  memoryObject.style.setProperty('--mx', `${x}px`);
  memoryObject.style.setProperty('--my', `${y}px`);
}

function resetMemory() {
  memoryObject.style.setProperty('--mx', '0px');
  memoryObject.style.setProperty('--my', '0px');
}

hero.addEventListener('pointermove', moveMemory, { passive: true });
hero.addEventListener('pointerleave', resetMemory, { passive: true });

let motionFrame;

function updateScrollMotion() {
  motionFrame = undefined;
  if (reduceMotion.matches) return;
  const progress = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1);
  hero.style.setProperty('--hero-lift', `${progress * -34}px`);
  memoryObject.style.setProperty('--hero-drift', `${progress * 46}px`);
  memoryObject.style.setProperty('--hero-rotate', `${progress * 5}deg`);
}

window.addEventListener('scroll', () => {
  if (motionFrame) return;
  motionFrame = window.requestAnimationFrame(updateScrollMotion);
}, { passive: true });

updateScrollMotion();
