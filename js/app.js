/* חיבור הממשק: בחירת שאלה מהמתזמן, הצגה, קבלת תשובה, שמירת התקדמות. */
(function (SP) {
  'use strict';

  var STORE_KEY = 'spelling-quiz-v1';
  var TYPES = SP.TYPES;

  var el = {
    kickerType: document.getElementById('kicker-type'),
    kickerSection: document.getElementById('kicker-section'),
    tracks: document.getElementById('tracks'),
    unlocked: document.getElementById('unlocked'),
    pips: document.getElementById('pips'),
    prompt: document.getElementById('prompt'),
    gloss: document.getElementById('gloss'),
    say: document.getElementById('say'),
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
    refresh: document.getElementById('refresh'),
    appver: document.getElementById('appver'),
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
  var cur = SP.createCurriculum({
    tracks: SP.TRACKS, cards: cards, scheduler: sched, state: saved.curriculum
  });
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
        curriculum: cur.exportState(),
        modes: enabled
      }));
    } catch (e) { /* מצב פרטי / אין מקום — פשוט לא שומרים */ }
  }

  // ---------- עזר ----------
  function filter(card) { return !!enabled[card.type]; }

  /* הסטטיסטיקה שבראש המסך נמדדת על החומר שנפתח בלבד. ספירה על כל
     המאגר הייתה מציגה 0 מתוך מאות כבר בשאלה הראשונה. */
  function openFilter(card) { return filter(card) && cur.isOpen(card); }

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
    var s = sched.stats(openFilter);
    el.asked.textContent = s.asked;
    el.rate.textContent = s.asked ? Math.round(100 * s.right / s.asked) + '%' : '—';
    el.mastered.textContent = s.mastered + ' / ' + s.total;
    el.masteryFill.style.width = (s.total ? (100 * s.mastered / s.total) : 0) + '%';
  }

  /* לוח המסלולים: לכל מסלול פעיל, הפרק הנוכחי וכמה ממנו כבר נשלט. */
  function renderTracks() {
    clear(el.tracks);
    SP.TRACKS.forEach(function (t) {
      var idx = cur.unlockedCount(t.id) - 1;
      var p = cur.progress(t.id, idx, filter);
      if (!p.total) { return; }           // המסלול כבוי כרגע בהגדרות

      var row = document.createElement('div');
      row.className = 'track';

      var head = document.createElement('div');
      head.className = 'track-head';

      var name = document.createElement('b');
      name.textContent = t.name;
      head.appendChild(name);

      var sec = document.createElement('span');
      sec.className = 'track-section';
      appendMixed(sec, p.section.name);
      head.appendChild(sec);

      if (p.section.tag) {
        var tag = document.createElement('span');
        tag.className = 'lat tag';
        tag.dir = 'ltr';
        tag.lang = 'en';
        tag.textContent = p.section.tag;
        head.appendChild(tag);
      }

      var count = document.createElement('span');
      count.className = 'track-count';
      count.textContent = p.done + '/' + p.total + ' · פרק ' + (idx + 1) + ' מתוך ' + t.sections.length;
      head.appendChild(count);

      var bar = document.createElement('div');
      bar.className = 'track-bar';
      var fill = document.createElement('span');
      fill.style.width = (p.total ? 100 * p.done / p.total : 0) + '%';
      bar.appendChild(fill);

      row.appendChild(head);
      row.appendChild(bar);
      el.tracks.appendChild(row);
    });
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
    clear(el.kickerSection);
    clear(el.pips);
    clear(el.prompt);
    el.prompt.textContent = 'בחרו לפחות סוג שאלות אחד כדי להתחיל.';
    el.prompt.className = 'prompt empty';
    el.gloss.hidden = true;
    el.say.hidden = true;
    el.note.hidden = true;
    el.unlocked.hidden = true;
    el.feedback.hidden = true;
    el.next.hidden = true;
    clear(el.options);
  }

  function nextQuestion() {
    var card = cur.pick(filter);
    if (!card) { renderEmpty(); return; }

    var q = SP.makeQuestion(card, { vocab: SP.VOCAB });
    current = { card: card, question: q };
    answered = false;

    el.kickerType.textContent = TYPE_LABEL[card.type];
    clear(el.kickerSection);
    var sec = cur.sectionOf(card);
    if (sec) {
      el.kickerSection.appendChild(document.createTextNode(' · '));
      appendMixed(el.kickerSection, sec.name);
    }
    renderPips(card.id);

    el.prompt.className = 'prompt';
    clear(el.prompt);
    el.prompt.appendChild(document.createTextNode(q.promptHead + ' '));
    el.prompt.appendChild(wordSpan(q.promptWord, q.promptWordLang));
    if (q.promptTail) {
      el.prompt.appendChild(document.createTextNode(' ' + q.promptTail));
    }

    /* בשאלת איות המשמעות מוצגת כהקשר. היא אינה רמז: התשובה היא האיות,
       וידיעת המשמעות אינה מצביעה על אף אחת מארבע האפשרויות. */
    setMixedText(el.gloss, q.meaning ? 'במשמעות: ' + q.meaning : q.hint);
    setText(el.say, q.say);
    el.pattern.hidden = true;
    el.note.hidden = true;

    el.feedback.hidden = true;
    el.feedback.className = 'feedback';
    el.unlocked.hidden = true;
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

    /* הפרק נבדק אחרי כל תשובה, ולא רק בסופו: ברגע שרוב הפריטים נשלטים
       הפרק הבא נפתח, והתלמיד רואה זאת מיד. */
    var opened = cur.sync(filter);
    if (opened.length) {
      clear(el.unlocked);
      opened.forEach(function (o, i) {
        if (i) { el.unlocked.appendChild(document.createTextNode(' ')); }
        appendMixed(el.unlocked, 'סיימת פרק ב' + o.track.name + ' — נפתח ”' + o.section.name + '“.');
      });
      el.unlocked.hidden = false;
    }

    renderPips(current.card.id);
    renderTracks();
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
      renderTracks();
      renderStats();
      if (!answered || !current) { nextQuestion(); }
    });
  });

  /* עדכון יזום. באפליקציה מותקנת אין שורת כתובת ואין רענון כפול, ולכן
     המטמון הישן יכול להישאר תקוע; הכפתור מוחק אותו ומושך מחדש.
     ה-service worker מתעדכן גם הוא, שאם לא כן הוא יגיש שוב את הישן. */
  function refreshApp() {
    el.refresh.disabled = true;
    setText(el.appver, 'מחפש עדכון…');

    var done = function (msg) {
      setText(el.appver, msg);
      el.refresh.disabled = false;
    };

    if (!('serviceWorker' in navigator)) {
      location.reload();
      return;
    }

    navigator.serviceWorker.getRegistration().then(function (reg) {
      if (!reg) { location.reload(); return; }
      return reg.update().then(function () {
        return new Promise(function (resolve) {
          var ch = new MessageChannel();
          var timer = setTimeout(function () { resolve({ ok: false }); }, 8000);
          ch.port1.onmessage = function (ev) { clearTimeout(timer); resolve(ev.data || {}); };
          var sw = reg.active || navigator.serviceWorker.controller;
          if (!sw) { clearTimeout(timer); resolve({ ok: false }); return; }
          sw.postMessage({ type: 'refresh' }, [ch.port2]);
        });
      }).then(function (res) {
        if (res && res.ok) { location.reload(); } else { done('לא הצלחנו לרענן. נסו שוב מאוחר יותר.'); }
      });
    }).catch(function () { done('לא הצלחנו לרענן. נסו שוב מאוחר יותר.'); });
  }

  el.refresh.addEventListener('click', refreshApp);

  el.reset.addEventListener('click', function () {
    if (!window.confirm('לאפס את כל ההתקדמות ולהתחיל מחדש?')) { return; }
    sched.reset();
    cur.reset();
    save();
    renderTracks();
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

  renderTracks();
  renderStats();
  nextQuestion();
})(window.SP);
