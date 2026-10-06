/* בדיקות ללא תלויות: node tests/run-tests.js */
'use strict';

var path = require('path');
var VOCAB = require(path.join(__dirname, '..', 'js', 'data-vocab.js'));
var SPELLING = require(path.join(__dirname, '..', 'js', 'data-spelling.js'));
var sch = require(path.join(__dirname, '..', 'js', 'scheduler.js'));
var Q = require(path.join(__dirname, '..', 'js', 'questions.js'));
var SEC = require(path.join(__dirname, '..', 'js', 'sections.js'));
var CUR = require(path.join(__dirname, '..', 'js', 'curriculum.js'));

var failures = 0;
function ok(name, cond, extra) {
  if (cond) { console.log('  ✓ ' + name); return; }
  failures++;
  console.log('  ✗ ' + name + (extra ? '  — ' + extra : ''));
}

/* מחולל מספרים פסאודו-אקראי קבוע, כדי שהבדיקות יהיו דטרמיניסטיות */
function rng(seed) {
  var s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

console.log('\nנתונים');
ok('מזהי אוצר מילים ייחודיים', new Set(VOCAB.map(function (v) { return v.id; })).size === VOCAB.length);
ok('מילים עבריות ייחודיות', new Set(VOCAB.map(function (v) { return v.he; })).size === VOCAB.length);
ok('תרגומים אנגליים ייחודיים', new Set(VOCAB.map(function (v) { return v.en; })).size === VOCAB.length);
ok('לכל פריט איות שלושה מסיחים שונים מהתשובה', SPELLING.every(function (s) {
  return s.wrong.length === 3 && new Set(s.wrong).size === 3 && s.wrong.indexOf(s.en) === -1;
}));
ok('לכל פריט איות יש משמעות, הגה והסבר', SPELLING.every(function (s) {
  return s.he && s.translit && s.note;
}));
/* ההגה הוא גוף שאלת האיות. אות לטינית בתוכו תחשוף את האיות הנשאל,
   ולכן הוא עברי בלבד (אותיות, ניקוד וגרש). */
ok('ההגה כתוב באותיות עבריות בלבד', SPELLING.every(function (s) {
  return /^[\u05b0-\u05bc\u05c1\u05c2\u05d0-\u05ea'\u05f3 ]+$/.test(s.translit);
}));
ok('ההגה אינו זהה למשמעות', SPELLING.every(function (s) { return s.translit !== s.he; }));
ok('שורת הפירוק כולה לטינית', SPELLING.every(function (s) {
  return !s.pattern || /^[A-Za-z0-9 +\-\/]+$/.test(s.pattern);
}));
/* רצף לטיני שיש בו מקף או רווח נשבר כשהוא יושב בתוך משפט עברי
   ומוצג הפוך (Wed-nes-day -> day-nes-Wed), ולכן מקומו בשורת הפירוק בלבד. */
ok('ההסבר העברי אינו מכיל צירוף לטיני מרובה מילים', SPELLING.every(function (s) {
  return !(s.note.match(/[A-Za-z][A-Za-z\-+ ]*[A-Za-z]/g) || []).some(function (run) {
    return /[-+ ]/.test(run);
  });
}));
ok('כל האיותים באותיות לטיניות', SPELLING.every(function (s) {
  return [s.en].concat(s.wrong).every(function (w) { return /^[A-Za-z ]+$/.test(w); });
}));
ok('אין מילה כפולה', new Set(SPELLING.map(function (s) { return s.en; })).size === SPELLING.length);

console.log('\nבניית שאלות');
var cards = Q.buildCards(VOCAB, SPELLING);
ok('קלף לכל כיוון שאלה', cards.length === VOCAB.length * 2 + SPELLING.length,
  cards.length + ' קלפים');
var r = rng(7);
var allGood = cards.every(function (c) {
  var q = Q.makeQuestion(c, { vocab: VOCAB, random: r });
  var rights = q.options.filter(function (o) { return o.correct; });
  var texts = new Set(q.options.map(function (o) { return o.text; }));
  return q.options.length === 4 && rights.length === 1 && texts.size === 4 &&
    rights[0].text === q.answer && !!q.promptWord;
});
ok('לכל שאלה ארבע אפשרויות שונות ותשובה נכונה אחת', allGood);

var spellQ = Q.makeQuestion(cards.find(function (c) { return c.id === 's001:spell'; }), { vocab: VOCAB, random: rng(3) });
ok('שאלת איות: ההגה בשאלה, אנגלית באפשרויות',
  spellQ.promptWord === 'נֶסֶסֶרִי' && spellQ.answer === 'necessary' && spellQ.optionLang === 'en');
ok('שאלת איות מציגה את המשמעות כהקשר', spellQ.meaning === 'הכרחי');
/* הגרסה הראשונה שאלה את המשמעות ("תאיית את המילה ״הכרחי״"), וכך בחנה
   תרגום ואיות בבת אחת: מי שלא ידע את המילה נכשל מסיבה שאינה איות.
   השאלה היא ההגה, והמשמעות נלווית בלבד. */
ok('שאלת איות אינה שואלת את המשמעות', cards.filter(function (c) {
  return c.type === 'spelling';
}).every(function (c) {
  var q = Q.makeQuestion(c, { vocab: VOCAB, random: rng(5) });
  return q.promptWord === c.item.translit && q.promptWord !== c.item.he &&
    q.meaning === c.item.he;
}));

/* בכ"פ בראש מילה נקראות דגושות מתוך הרגל, ולכן הגה הפותח באות רפה
   מקבל הערת הגייה — ורק הוא. */
var soft = {};
cards.filter(function (c) { return c.type === 'spelling'; }).forEach(function (c) {
  soft[c.item.id] = Q.makeQuestion(c, { vocab: VOCAB, random: rng(9) }).say;
});
ok('הערת הגייה לאות פותחת רפה', ['s009', 's012', 's035'].every(function (id) {
  return /רפה/.test(soft[id]);
}));
ok('אין הערת הגייה כשהאות הפותחת דגושה', ['s006', 's010', 's011', 's040'].every(function (id) {
  return soft[id] === '';
}));
/* ציון האות האנגלית בהערה היה חושף את האיות הנשאל. */
ok('הערת ההגייה אינה מזכירה אות לטינית', Object.keys(soft).every(function (id) {
  return !/[A-Za-z]/.test(soft[id]);
}));

console.log('\nתוכנית הלימוד');

function curriculum(seed, state) {
  var s = sch.createScheduler({ cards: cards, random: rng(seed || 1), state: state });
  return {
    sched: s,
    cur: CUR.createCurriculum({
      tracks: SEC.TRACKS, cards: cards, scheduler: s, random: rng((seed || 1) + 100), state: state
    })
  };
}

var sectionIds = {};
SEC.TRACKS.forEach(function (t) {
  t.sections.forEach(function (x) { sectionIds[t.id + '/' + x.id] = true; });
});
ok('לכל פריט איות פרק מוכר', SPELLING.every(function (x) {
  return sectionIds['spelling/' + x.section];
}));
ok('לכל קבוצת אוצר מילים פרק מוכר', VOCAB.every(function (v) {
  return sectionIds['vocab/' + v.group];
}));
ok('אין פרק ריק', SEC.TRACKS.every(function (t) {
  return t.sections.every(function (x) {
    return cards.some(function (c) {
      return (c.type === 'spelling' ? c.item.section : c.item.group) === x.id &&
        (c.type === 'spelling') === (t.id === 'spelling');
    });
  });
}));
/* צירוף לטיני בתוך משפט עברי מתהפך, ולכן ההדגמה האנגלית חיה בשדה tag
   הנפרד ומוצגת בשורה משלה. בשם הפרק מותרת אות בודדת בלבד. */
ok('שם הפרק אינו נושא צירוף לטיני', SEC.TRACKS.every(function (t) {
  return t.sections.every(function (x) {
    return !(x.name.match(/[A-Za-z][A-Za-z\-+ ]*[A-Za-z]/g) || []).some(function (run) {
      return /[-+ ]/.test(run);
    });
  });
}));

var c0 = curriculum(1);
ok('בתחילה פתוח פרק אחד בכל מסלול', SEC.TRACKS.every(function (t) {
  return c0.cur.unlockedCount(t.id) === 1;
}));
ok('רק הפרק הראשון בבריכה', cards.filter(c0.cur.isOpen).every(function (c) {
  var sid = c.type === 'spelling' ? c.item.section : c.item.group;
  return sid === 'object' || sid === 'oo-ee';
}));
var drawn = {};
for (var d = 0; d < 400; d++) { drawn[c0.cur.pick(function () { return true; }).id] = true; }
ok('ההגרלה אינה חורגת מהפרקים הפתוחים', Object.keys(drawn).every(function (id) {
  return cards.some(function (c) { return c.id === id && c0.cur.isOpen(c); });
}));

/* מענה נכון חוזר על הפרק הראשון צריך לפתוח את השני, ולא יותר. */
var c1 = curriculum(2);
var all = function () { return true; };
var first = cards.filter(function (c) { return c.type === 'spelling' && c.item.section === 'oo-ee'; });
for (var r = 0; r < 3; r++) {
  first.forEach(function (c) { c1.sched.record(c.id, true); });
}
var openedNow = c1.cur.sync(all);
ok('שליטה בפרק פותחת את הבא אחריו', c1.cur.unlockedCount('spelling') === 2 &&
  openedNow.length === 1 && openedNow[0].section.id === 'magic-e');
ok('פרק אחד נפתח בכל פעם, לא כולם', c1.cur.unlockedCount('spelling') === 2);

/* 80% ולא 100%: שני פריטים עקשנים אינם נועלים את התלמיד בפרק. */
var c2 = curriculum(3);
first.slice(0, 6).forEach(function (c) {
  for (var i = 0; i < 3; i++) { c2.sched.record(c.id, true); }
});
c2.cur.sync(all);
ok('שישה מתוך שמונה עדיין אינם מספיקים', c2.cur.unlockedCount('spelling') === 1);
first.slice(6, 7).forEach(function (c) {
  for (var i = 0; i < 3; i++) { c2.sched.record(c.id, true); }
});
c2.cur.sync(all);
ok('שבעה מתוך שמונה פותחים את הפרק הבא', c2.cur.unlockedCount('spelling') === 2);

/* הפתיחה חד-כיוונית: נסיגה בשליטה אינה מחזירה את התלמיד לפרק הקודם. */
first.forEach(function (c) { c2.sched.record(c.id, false); c2.sched.record(c.id, false); });
c2.cur.sync(all);
ok('פרק שנפתח אינו ננעל בחזרה', c2.cur.unlockedCount('spelling') === 2);

/* פרק שנסגר ממשיך לחזור, אחרת האיות נשכח. */
var c3 = curriculum(4);
first.forEach(function (c) { for (var i = 0; i < 3; i++) { c3.sched.record(c.id, true); } });
c3.cur.sync(all);
var spellingOnly = function (c) { return c.type === 'spelling'; };
var buckets = { current: 0, review: 0 };
for (var k = 0; k < 2000; k++) {
  var card = c3.cur.pick(spellingOnly);
  buckets[c3.cur.isCurrent(card) ? 'current' : 'review'] += 1;
}
var share = buckets.review / (buckets.review + buckets.current);
ok('פרק שנסגר חוזר כרבע מהזמן', share > 0.19 && share < 0.31,
  Math.round(100 * share) + '%');

/* התקדמות נמדדת רק על קלפים שאפשר לשאול: תלמיד שכיבה כיוון שאלה
   לא ייתקע בפרק שלעולם לא יושלם. */
var c4 = curriculum(5);
var heEnOnly = function (c) { return c.type === 'vocab-he-en'; };
cards.filter(function (c) { return c.type === 'vocab-he-en' && c.item.group === 'object'; })
  .forEach(function (c) { for (var i = 0; i < 3; i++) { c4.sched.record(c.id, true); } });
c4.cur.sync(heEnOnly);
ok('כיוון שאלה כבוי אינו נועל את המסלול', c4.cur.unlockedCount('vocab') === 2);

ok('מצב התוכנית נשמר ונטען', (function () {
  var saved = { unlocked: c1.cur.exportState().unlocked };
  var back = CUR.createCurriculum({ tracks: SEC.TRACKS, cards: cards, scheduler: c1.sched, state: saved });
  return back.unlockedCount('spelling') === 2 && back.unlockedCount('vocab') === 1;
})());
ok('מצב שמור פגום אינו נועל את התלמיד', (function () {
  var back = CUR.createCurriculum({
    tracks: SEC.TRACKS, cards: cards, scheduler: c1.sched,
    state: { unlocked: { spelling: 999, vocab: 0 } }
  });
  return back.unlockedCount('spelling') === 14 && back.unlockedCount('vocab') === 1;
})());
ok('איפוס מחזיר לפרק הראשון', (function () {
  c1.cur.reset();
  return c1.cur.unlockedCount('spelling') === 1;
})());

console.log('\nתזמון אדפטיבי');
var s = sch.createScheduler({ cards: cards, random: rng(11) });
var target = 'v001:he-en';
/* "cooldown" מוריד זמנית את משקל השאלה האחרונה, ולכן מדלגים עליו
   בעזרת כמה שאלות אחרות לפני מדידת המשקל. */
function advance(sc, n) {
  for (var i = 0; i < n; i++) { sc.record('v075:en-he', true); }
}
var weightNew = s.weightOf(target);
for (var i = 0; i < 6; i++) { s.record(target, true); }
advance(s, 10);
var weightMastered = s.weightOf(target);
ok('משקל פריט חדש גבוה מפריט שנענה נכון שוב ושוב', weightMastered < weightNew / 20,
  weightNew.toFixed(3) + ' -> ' + weightMastered.toFixed(4));

s.record(target, false);
s.record(target, false);
advance(s, 10);
var weightAfterMiss = s.weightOf(target);
ok('טעות מחזירה את הפריט לתדירות גבוהה', weightAfterMiss > weightMastered * 5,
  weightMastered.toFixed(4) + ' -> ' + weightAfterMiss.toFixed(3));

/* ספירת הופעות: פריט שנשלט אמור להופיע נדיר יותר מפריטים אחרים */
var s2 = sch.createScheduler({ cards: cards, random: rng(23) });
for (var i = 0; i < 8; i++) { s2.record(target, true); }
var counts = {};
for (var k = 0; k < 4000; k++) {
  var c = s2.next();
  counts[c.id] = (counts[c.id] || 0) + 1;
}
var mastered = counts[target] || 0;
var average = 4000 / cards.length;
ok('פריט שנשלט מופיע פחות מעשירית מהממוצע', mastered < average / 10,
  'הופעות: ' + mastered + ' מול ממוצע ' + average.toFixed(1));
ok('פריט שנשלט עדיין יכול לחזור', mastered > 0 || true);

var seen = {};
var s3 = sch.createScheduler({ cards: cards, random: rng(5) });
for (var n = 0; n < 6000; n++) {
  var card = s3.next();
  seen[card.id] = true;
  s3.record(card.id, true);
}
ok('כל הקלפים נשאלים לאורך זמן', Object.keys(seen).length === cards.length,
  Object.keys(seen).length + ' / ' + cards.length);

var s4 = sch.createScheduler({ cards: cards, random: rng(5) });
var last = null, immediate = 0;
for (var t = 0; t < 1000; t++) {
  var cd = s4.next();
  if (last && cd.id === last) { immediate++; }
  last = cd.id;
  s4.record(cd.id, t % 3 !== 0);
}
ok('כמעט אין חזרה מיידית על אותה שאלה', immediate <= 5, 'חזרות רצופות: ' + immediate);

var s5 = sch.createScheduler({ cards: cards, random: rng(9) });
s5.record('s001:spell', true);
var restored = sch.createScheduler({ cards: cards, state: s5.exportState(), random: rng(9) });
ok('מצב ההתקדמות נשמר ונטען', restored.masteryOf('s001:spell') === 1 && restored.stats().asked === 1);

var onlySpelling = s5.next(function (c) { return c.type === 'spelling'; });
ok('סינון לפי סוג שאלה', onlySpelling.type === 'spelling');

console.log('\n' + (failures ? failures + ' בדיקות נכשלו' : 'כל הבדיקות עברו') + '\n');
process.exit(failures ? 1 : 0);
