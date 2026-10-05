/* חיבור הממשק: בחירת שאלה מהמתזמן, הצגה, קבלת תשובה, שמירת התקדמות. */
(function (SP) {
  'use strict';

  var STORE_KEY = 'spelling-quiz-v1';
  var TYPES = SP.TYPES;

  var el = {
    kickerType: document.getElementById('kicker-type'),
    pips: document.getElementById('pips'),
    prompt: document.getElementById('prompt'),
    gloss: document.getElementById('gloss'),
    pattern: document.getElementById('pattern'),
    note: document.getElementById('note'),
    options: document.getElementById('options'),
    feedback: document.getElementById('feedback'),
    next: document.getElementById('next'),
    asked: document.getElementById('stat-asked'),
    rate: document.getElementById('stat-rate'),
    mastered: document.getElementById('stat-mastered'),
    masteryFill: document.getElementById('mastery-fill'),
    reset: document.getElementById('reset'),
    modes: {
      'vocab-he-en': document.getElementById('mode-he-en'),
      'vocab-en-he': document.getElementById('mode-en-he'),
      'spelling': document.getElementById('mode-spelling')
    }
  };

  var TYPE_LABEL = {};
  TYPE_LABEL[TYPES.VOCAB_HE_EN] = 'אוצר מילים · עברית ← אנגלית';
  TYPE_LABEL[TYPES.VOCAB_EN_HE] = 'אוצר מילים · אנגלית ← עברית';
  TYPE_LABEL[TYPES.SPELLING] = 'איות באנגלית';

  var cards = SP.buildCards(SP.VOCAB, SP.SPELLING);
  var saved = load();
  var sched = SP.createScheduler({ cards: cards, state: saved.progress });
  var enabled = saved.modes || { 'vocab-he-en': true, 'vocab-en-he': true, 'spelling': true };
  var current = null;      // { card, question }
  var answered = false;

  // ---------- שמירה ----------
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        progress: sched.exportState(),
        modes: enabled
      }));
    } catch (e) { /* מצב פרטי / אין מקום — פשוט לא שומרים */ }
  }

  // ---------- עזר ----------
  function filter(card) { return !!enabled[card.type]; }

  function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }

  function setText(node, text) {
    node.textContent = text || '';
    node.hidden = !text;
  }

  /* אותיות לטיניות בתוך משפט עברי קופצות ממקומן אם אין בידוד דו-כיווני,
     ולכן כל רצף לטיני נעטף ב-span מבודד ומודגש. */
  function appendMixed(node, text) {
    String(text).split(/([A-Za-z](?:[A-Za-z'’+\-\/ ]*[A-Za-z])?)/).forEach(function (part, i) {
      if (!part) { return; }
      if (i % 2) {
        var lat = document.createElement('span');
        lat.className = 'lat';
        lat.textContent = part;
        node.appendChild(lat);
      } else {
        node.appendChild(document.createTextNode(part));
      }
    });
  }

  function setMixedText(node, text) {
    clear(node);
    if (text) { appendMixed(node, text); }
    node.hidden = !text;
  }

  function wordSpan(text, lang) {
    var span = document.createElement('span');
    span.textContent = '”' + text + '“';
    if (lang === 'en') {
      span.dir = 'ltr';
      span.lang = 'en';
      span.style.unicodeBidi = 'isolate';
    }
    return span;
  }

  // ---------- תצוגה ----------
  function renderStats() {
    var s = sched.stats(filter);
    el.asked.textContent = s.asked;
    el.rate.textContent = s.asked ? Math.round(100 * s.right / s.asked) + '%' : '—';
    el.mastered.textContent = s.mastered + ' / ' + s.total;
    el.masteryFill.style.width = (s.total ? (100 * s.mastered / s.total) : 0) + '%';
  }

  function renderPips(cardId) {
    clear(el.pips);
    var m = sched.masteryOf(cardId);
    for (var i = 0; i < sched.constants.MAX_MASTERY; i++) {
      var pip = document.createElement('i');
      if (i < m) { pip.className = 'on'; }
      el.pips.appendChild(pip);
    }
  }

  function renderEmpty() {
    current = null;
    el.kickerType.textContent = '';
    clear(el.pips);
    clear(el.prompt);
    el.prompt.textContent = 'בחרו לפחות סוג שאלות אחד כדי להתחיל.';
    el.prompt.className = 'prompt empty';
    el.gloss.hidden = true;
    el.note.hidden = true;
    el.feedback.hidden = true;
    el.next.hidden = true;
    clear(el.options);
  }

  function nextQuestion() {
    var card = sched.next(filter);
    if (!card) { renderEmpty(); return; }

    var q = SP.makeQuestion(card, { vocab: SP.VOCAB });
    current = { card: card, question: q };
    answered = false;

    el.kickerType.textContent = TYPE_LABEL[card.type];
    renderPips(card.id);

    el.prompt.className = 'prompt';
    clear(el.prompt);
    el.prompt.appendChild(document.createTextNode(q.promptHead + ' '));
    el.prompt.appendChild(wordSpan(q.promptWord, q.promptWordLang));
    if (q.promptTail) {
      el.prompt.appendChild(document.createTextNode(' ' + q.promptTail));
    }

    setMixedText(el.gloss, q.hint);
    el.pattern.hidden = true;
    el.note.hidden = true;

    el.feedback.hidden = true;
    el.feedback.className = 'feedback';
    el.next.hidden = true;

    clear(el.options);
    q.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option';
      btn.dataset.dir = q.optionDir;
      btn.dataset.index = String(i);

      var num = document.createElement('span');
      num.className = 'num';
      num.textContent = String(i + 1);

      var txt = document.createElement('span');
      txt.className = 'txt';
      txt.textContent = opt.text;
      if (q.optionLang === 'en') { txt.lang = 'en'; txt.dir = 'ltr'; }

      btn.appendChild(num);
      btn.appendChild(txt);
      btn.addEventListener('click', function () { answer(i); });
      el.options.appendChild(btn);
    });
  }

  function explain(q, correct) {
    var item = q.item;
    if (q.type === TYPES.SPELLING) {
      var parts = [];
      if (item.note) { parts.push(item.note); }
      if (item.focus) { parts.push('תרגול: ' + item.focus); }
      return parts.join(' · ');
    }
    return item.he + ' = ' + item.en + (item.note ? ' (' + item.note + ')' : '');
  }

  function answer(index) {
    if (!current || answered) { return; }
    answered = true;

    var q = current.question;
    var correct = q.options[index].correct;
    var buttons = el.options.querySelectorAll('.option');

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
      if (q.options[i].correct) {
        buttons[i].classList.add('is-right');
      } else if (i === index) {
        buttons[i].classList.add('is-wrong');
      } else {
        buttons[i].classList.add('is-dim');
      }
    }

    el.feedback.className = 'feedback ' + (correct ? 'ok' : 'no');
    clear(el.feedback);
    var lead = document.createElement('b');
    if (correct) {
      lead.textContent = 'נכון. ';
      el.feedback.appendChild(lead);
    } else {
      lead.textContent = 'לא נכון. התשובה: ';
      el.feedback.appendChild(lead);
      var ans = wordSpan(q.answer, q.optionLang);
      ans.style.fontWeight = '700';
      el.feedback.appendChild(ans);
      el.feedback.appendChild(document.createTextNode('. '));
    }
    el.feedback.hidden = false;

    /* האותיות הלטיניות מקבלות שורה משל עצמן, משמאל לימין,
       וההסבר העברי נשאר עברי. */
    var item = current.card.item;
    if (q.type === TYPES.SPELLING && item.pattern) {
      el.pattern.textContent = item.pattern;
      el.pattern.hidden = false;
    }
    setMixedText(el.note, explain(q, correct));

    sched.record(current.card.id, correct);
    renderPips(current.card.id);
    renderStats();
    save();

    el.next.hidden = false;
    el.next.focus();
  }

  // ---------- אירועים ----------
  el.next.addEventListener('click', nextQuestion);

  Object.keys(el.modes).forEach(function (type) {
    var box = el.modes[type];
    box.checked = !!enabled[type];
    box.addEventListener('change', function () {
      enabled[type] = box.checked;
      save();
      renderStats();
      if (!answered || !current) { nextQuestion(); }
    });
  });

  el.reset.addEventListener('click', function () {
    if (!window.confirm('לאפס את כל ההתקדמות ולהתחיל מחדש?')) { return; }
    sched.reset();
    save();
    renderStats();
    nextQuestion();
  });

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) { return; }
    if (!answered && e.key >= '1' && e.key <= '4') {
      var i = Number(e.key) - 1;
      if (current && i < current.question.options.length) {
        e.preventDefault();
        answer(i);
      }
      return;
    }
    if (answered && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      nextQuestion();
    }
  });

  renderStats();
  nextQuestion();
})(window.SP);
