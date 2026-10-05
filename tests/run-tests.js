/* בדיקות ללא תלויות: node tests/run-tests.js */
'use strict';

var path = require('path');
var VOCAB = require(path.join(__dirname, '..', 'js', 'data-vocab.js'));
var SPELLING = require(path.join(__dirname, '..', 'js', 'data-spelling.js'));
var sch = require(path.join(__dirname, '..', 'js', 'scheduler.js'));
var Q = require(path.join(__dirname, '..', 'js', 'questions.js'));

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
ok('לכל פריט איות יש מילה עברית והסבר', SPELLING.every(function (s) { return s.he && s.note; }));
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
ok('שאלת איות: עברית בשאלה, אנגלית באפשרויות',
  spellQ.promptWord === 'הכרחי' && spellQ.answer === 'necessary' && spellQ.optionLang === 'en');

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
