'use strict';
// One subject — one answer. Cards live in HTML; their dialogs read from this object.
// Facts only from the owner's map; open questions are listed in the handoff, not invented here.
// Lever ids: weight · variant · amplitude · volume · tempo. Direction: up · down · any.

const content = {
 point: {
  kicker: 'Шаг 1 · С чего начать', title: 'С того, что подходит сейчас', icon: 'locate',
  lead: [
   'Не нужно заранее решать, новичок вы или опытный.',
   'Для каждого упражнения тренер предложит вариант, с которого можно спокойно начать.'
  ],
  key: 'Это не проверка. Просто находим, откуда начать.',
  detail: [
   'Бывает, что вариант подходит сразу. Бывает, что после первых повторений понятно: его стоит чуть поменять. В разных упражнениях старт может быть разным — это нормально.'
  ]
 },
 watch: {
  kicker: 'Шаг 2 · Как понять, что подходит', title: 'Смотрим, как идёт', icon: 'eye',
  lead: [
   'Важно не только то, получилось ли сделать упражнение.',
   'Важно, как оно получается.'
  ],
  checksIntro: 'На что смотрим:',
  checks: [
   'получается ли держать движение под контролем',
   'можно ли работать, не борясь с весом всё время',
   'подходит ли вариант вам сейчас'
  ],
  key: 'Если что-то не так, вариант можно поменять сразу.',
  detail: [
   'Не всё видно со стороны. Если тяжело, легко или что-то непонятно — скажите. Так тренеру проще подобрать точнее.'
  ]
 },
 keep: {
  kicker: 'Шаг 3 · Решаем, что дальше', title: 'Оставить как есть', icon: 'equal',
  lead: [
   'Увеличивать нагрузку каждый раз не нужно.',
   'Если вариант подходит и получается уверенно — с ним и продолжаем.'
  ],
  key: 'Повторять — тоже прогресс: движение становится увереннее.',
  detail: [
   'Иногда шаг вперёд — это не больший вес, а более спокойное и точное движение.'
  ]
 },
 advance: {
  kicker: 'Шаг 3 · Решаем, что дальше', title: 'Шаг вперёд', icon: 'up',
  lead: [
   'Когда упражнение идёт уверенно и становится легко, можно двигаться дальше.'
  ],
  key: 'Шаг вперёд делают, когда к нему готовы, а не потому, что так положено.',
  leversIntro: 'Например:',
  levers: [
   ['weight', 'up', 'больший вес'],
   ['variant', 'up', 'более сложный вариант'],
   ['volume', 'up', 'больше работы']
  ],
  detail: [
   'Иногда вместо этого меняют амплитуду или темп. Обычно меняют что-то одно — и снова смотрят, как идёт.'
  ]
 },
 shift: {
  kicker: 'Шаг 3 · Решаем, что дальше', title: 'Поменять вариант', icon: 'swap',
  lead: [
   'Если оказалось слишком тяжело или упражнение пока не складывается, вариант меняют прямо на тренировке.',
   'Терпеть только потому, что уже начали, не нужно.'
  ],
  key: 'Меняется вариант упражнения — не отношение к вам.',
  leversIntro: 'Например:',
  levers: [
   ['weight', 'down', 'вес поменьше'],
   ['variant', 'down', 'вариант попроще'],
   ['volume', 'down', 'меньше работы']
  ],
  detail: [
   'Можно поменять и амплитуду или темп. Подбирать нагрузку по ходу — обычная часть тренировки.'
  ]
 },
 again: {
  kicker: 'Шаг 4 · А в следующий раз', title: 'Смотрим заново', icon: 'history',
  lead: [
   'Самочувствие меняется. После хорошего отдыха знакомое может идти легче, после перерыва или тяжёлой недели — тяжелее.',
   'Поэтому каждая тренировка начинается с того, как вы сегодня.'
  ],
  key: 'Прошлый результат подсказывает, но не обязывает.',
  checksIntro: 'Сегодня можно:',
  checks: ['оставить как было', 'добавить', 'взять полегче', 'поменять вариант упражнения'],
  detail: [
   'Если сегодня нужно полегче, прошлые результаты никуда не денутся.'
  ]
 }
};

const LEVER_NAMES = { weight: 'Вес', variant: 'Вариант', amplitude: 'Амплитуда', volume: 'Объём', tempo: 'Темп' };
const DIR_ICON = { up: 'up', down: 'down', any: 'swap' };

/* Lucide paths (lucide-static) */
const icons = {
 users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
 locate: '<line x1="2" x2="5" y1="12" y2="12"/><line x1="19" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="5"/><line x1="12" x2="12" y1="19" y2="22"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/>',
 eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
 split: '<path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/>',
 history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
 rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
 equal: '<line x1="5" x2="19" y1="9" y2="9"/><line x1="5" x2="19" y1="15" y2="15"/>',
 up: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
 down: '<path d="m7 7 10 10"/><path d="M17 7v10H7"/>',
 swap: '<path d="m2 9 3-3 3 3"/><path d="M13 18H7a2 2 0 0 1-2-2V6"/><path d="m22 15-3 3-3-3"/><path d="M11 6h6a2 2 0 0 1 2 2v10"/>',
 weight: '<path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/>',
 variant: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
 volume: '<path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/>',
 amplitude: '<path d="M12 2v20"/><path d="m8 18 4 4 4-4"/><path d="m8 6 4-4 4 4"/>',
 tempo: '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
 user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
 close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const svg = id => '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">' + icons[id] + '</svg>';
const paras = list => (list || []).map(t => '<p>' + esc(t) + '</p>').join('');

(function playHeroDialogue() {
 // One looped scene woven from: fit · return · stronger/slimmer · stay.
 // Opening plays once; the body loops without repeating it.
 const opening = ['Тренер', 'Можно начать с того, что подходит сейчас — без решения заранее.'];
 const lines = [
  ['Вы', 'Не понимаю, подойдёт ли мне это вообще.'],
  ['Тренер', 'Не обязательно решать в голове. С этого здесь и начинают.'],
  ['Вы', 'Тренировки раньше были, потом ритм пропал. Теперь неловко.'],
  ['Тренер', 'Догонять никого не нужно. Посмотрим, что хорошо идёт сегодня.'],
  ['Вы', 'То есть это не начало с нуля?'],
  ['Тренер', 'Это продолжение — просто с того места, где вы сейчас.'],
  ['Вы', 'Хочу чувствовать себя стройнее, но без жёсткого режима.'],
  ['Тренер', 'Тогда не будем начинать с жёсткого режима.'],
  ['Вы', 'А с чего?'],
  ['Тренер', 'С движения, которое подходит сейчас и к которому можно вернуться.'],
  ['Вы', 'Хочу и сильнее себя почувствовать — но не доказывать каждый раз, что могу больше.'],
  ['Тренер', 'Сила не всегда про больший вес. Иногда — про более уверенное движение.'],
  ['Вы', 'А если сегодня не получается?'],
  ['Тренер', 'Тогда сегодня берём то, что получается. Прошлый результат никуда не денется.'],
  ['Вы', 'Я часто начинаю, а потом всё исчезает.'],
  ['Тренер', 'Не нужно делать идеально, чтобы продолжать.'],
  ['Вы', 'А если выпаду на время?'],
  ['Тренер', 'Вернётесь — и начнёте с того, как идёт в этот день. Без догонялок.'],
  ['Вы', 'То есть можно просто попробовать?'],
  ['Тренер', 'Да. По ощущениям обычно становится понятно гораздо быстрее, чем в голове.']
 ];
 const chat = document.getElementById('scenario-chat');
 if (!chat) return;

 const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
 const scrollChat = () => { chat.scrollTop = chat.scrollHeight; };
 const bubble = (who, text) => {
  const node = document.createElement('div');
  node.className = 'msg ' + (who === 'Вы' ? 'me' : 'co');
  node.innerHTML = (who === 'Тренер' ? '<small>Тренер</small>' : '') + esc(text);
  return node;
 };
 const typing = () => {
  const node = document.createElement('div');
  node.className = 'typing';
  node.setAttribute('aria-label', 'Тренер печатает');
  node.innerHTML = '<i></i><i></i><i></i>';
  return node;
 };
 const wait = ms => new Promise(resolve => window.setTimeout(resolve, reduced() ? 0 : ms));
 const keep = 5;

 const speak = async (who, text) => {
  if (who === 'Тренер' && chat.childElementCount) {
   const indicator = typing();
   chat.append(indicator);
   scrollChat();
   await wait(1100);
   if (!indicator.isConnected) return;
   indicator.replaceWith(bubble(who, text));
  } else {
   chat.append(bubble(who, text));
  }
  scrollChat();
  while (chat.childElementCount > keep) chat.firstElementChild.remove();
  await wait(who === 'Вы' ? 900 + text.length * 18 : 1300 + text.length * 36);
 };

 const playOnce = async () => {
  for (const [who, text] of lines) await speak(who, text);
 };

 const loop = async () => {
  if (reduced()) {
   chat.append(bubble(opening[0], opening[1]));
   lines.forEach(([who, text]) => chat.append(bubble(who, text)));
   scrollChat();
   return;
  }
  await speak(opening[0], opening[1]);
  for (;;) {
   await playOnce();
   await wait(2200);
  }
 };

 loop();
})();

document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = svg(el.dataset.icon); });

function leverRows(d) {
 if (!d.levers) return '';
 return '<div class="d-group"><p class="d-intro">' + esc(d.leversIntro) + '</p><ul class="d-levers">' +
  d.levers.map(([id, dir, text]) =>
   '<li><span class="dl-icon">' + svg(id) + '</span><span class="dl-name">' + LEVER_NAMES[id] + '</span>' +
   '<span class="dl-text">' + esc(text) + '</span><span class="dl-dir dir-' + dir + '">' + svg(DIR_ICON[dir]) + '</span></li>'
  ).join('') + '</ul></div>';
}

function checkRows(d) {
 if (!d.checks) return '';
 return '<div class="d-group"><p class="d-intro">' + esc(d.checksIntro) + '</p><ul class="d-checks">' +
  d.checks.map(t => '<li>' + esc(t) + '</li>').join('') + '</ul></div>';
}

function paintBody(d) {
 return '<div class="d-lead">' + paras(d.lead) + '</div>' +
  (d.key ? '<p class="d-key">' + esc(d.key) + '</p>' : '') +
  leverRows(d) + checkRows(d) +
  (d.detail ? '<div class="d-more">' + paras(d.detail) + '</div>' : '');
}

const dialog = document.getElementById('detail');
const body = document.getElementById('detail-body');
let origin = null;

document.querySelectorAll('[data-topic]').forEach(btn => btn.addEventListener('click', () => {
 const d = content[btn.dataset.topic];
 origin = btn;
 document.getElementById('detail-icon').innerHTML = svg(d.icon);
 document.getElementById('detail-kicker').textContent = d.kicker;
 document.getElementById('detail-title').textContent = d.title;
 body.innerHTML = paintBody(d);
 dialog.showModal();
 dialog.scrollTop = 0;
}));

const closeBtn = document.getElementById('close');
closeBtn.innerHTML = svg('close');
closeBtn.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => origin?.focus({ preventScroll: true }));
