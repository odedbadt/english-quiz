/* מדידה, לא בדיקה: node tests/measure.js

   מריץ ”סוכן“ על המודולים האמיתיים וסופר שני דברים שקובעים אם התרגול
   משעמם — כמה הוא חוזר על עצמו, וכמה שאלות עולה לסיים פרק.

   הסוכן המושלם (דיוק 1.0) הוא המקרה הטוב ביותר: מה שמשעמם אותו ישעמם
   כל תלמיד אמיתי יותר. הסוכן הטועה מראה מה קורה למי שמתקשה — שם
   קבור הסיכון האמיתי, כי החמרה בתנאי המעבר פוגעת דווקא בו. */
'use strict';

var path = require('path');
var fs = require('fs');
var DIR = path.join(__dirname, '..', 'js');

var VOCAB = require(path.join(DIR, 'data-vocab.js'));
var SPELLING = require(path.join(DIR, 'data-spelling.js'));
var Q = require(path.join(DIR, 'questions.js'));
var SEC = require(path.join(DIR, 'sections.js'));
var sch = require(path.join(DIR, 'scheduler.js'));
var CUR = require(path.join(DIR, 'curriculum.js'));

function rng(seed) {
  var s = seed >>> 0;
  return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/* קנס חזרה: אותה שאלה פעמיים ברצף היא הגרועה מכולן, ומשם יורד.
   מעבר לשש שאלות הפרש — אין קנס, זו כבר חזרה לגיטימית. */
function gapPenalty(gap) {
  if (gap <= 1) { return 100; }
  if (gap <= 5) { return 100 / (gap * gap); }
  return 0;
}

function run(opts) {
  var cards = Q.buildCards(VOCAB, SPELLING);
  var s = sch.createScheduler({ cards: cards, random: rng(opts.seed) });
  var cur = CUR.createCurriculum({
    tracks: SEC.TRACKS, cards: cards, scheduler: s, random: rng(opts.seed + 7)
  });
  var filter = function (c) { return opts.enabled.indexOf(c.type) > -1; };
  var answer = rng(opts.seed + 99);

  var last = {}, qs = 0, penalty = 0, minGap = Infinity, backToBack = 0;
  var levelStart = 0, costs = [];

  while (qs < opts.cap) {
    var card = cur.pick(filter);
    if (!card) { break; }
    qs += 1;
    if (last[card.id]) {
      var gap = qs - last[card.id];
      if (gap < minGap) { minGap = gap; }
      if (gap === 1) { backToBack += 1; }
      penalty += gapPenalty(gap);
    }
    last[card.id] = qs;

    s.record(card.id, answer() < opts.accuracy);
    if (cur.sync(filter).length) { costs.push(qs - levelStart); levelStart = qs; }
  }

  return {
    questions: qs, penalty: penalty, backToBack: backToBack,
    minGap: minGap === Infinity ? null : minGap,
    levels: costs.length,
    firstLevel: costs.length ? costs[0] : null,
    meanLevel: costs.length ? costs.reduce(function (a, b) { return a + b; }, 0) / costs.length : null,
    worstLevel: costs.length ? Math.max.apply(null, costs) : null
  };
}

function average(opts, runs) {
  runs = runs || 24;
  var acc = { penalty: 0, backToBack: 0, minGap: Infinity, levels: 0, firstLevel: 0, meanLevel: 0, worstLevel: 0 };
  for (var i = 0; i < runs; i++) {
    var r = run(Object.assign({}, opts, { seed: 1000 + i * 17 }));
    acc.penalty += r.penalty;
    acc.backToBack += r.backToBack;
    if (r.minGap !== null && r.minGap < acc.minGap) { acc.minGap = r.minGap; }
    acc.levels += r.levels;
    acc.firstLevel += (r.firstLevel === null ? opts.cap : r.firstLevel);
    acc.meanLevel += (r.meanLevel === null ? opts.cap : r.meanLevel);
    acc.worstLevel += (r.worstLevel === null ? opts.cap : r.worstLevel);
  }
  ['penalty', 'backToBack', 'levels', 'firstLevel', 'meanLevel', 'worstLevel'].forEach(function (k) {
    acc[k] = acc[k] / runs;
  });
  return acc;
}

module.exports = { run: run, average: average };

if (require.main === module) {
  var ALL = ['vocab-he-en', 'vocab-en-he', 'spelling'];
  console.log('ציון חזרה: 100 על אותה שאלה פעמיים ברצף, 100/מרווח² עד מרווח 5, 0 מעבר לכך.');
  console.log('ממוצע על 24 זרעים, שלושת סוגי השאלות פעילים.\n');

  console.log('סוכן מושלם — לעולם אינו טועה');
  [['כל הסוגים', ALL], ['איות בלבד', ['spelling']]].forEach(function (c) {
    var a = average({ enabled: c[1], accuracy: 1, cap: 4000 });
    console.log('  ' + c[0].padEnd(12) +
      ' ציון חזרה ' + a.penalty.toFixed(1).padStart(5) +
      ' | רצופות ' + a.backToBack.toFixed(1) +
      ' | מרווח מזערי ' + String(a.minGap).padStart(2) +
      ' | ' + a.meanLevel.toFixed(1).padStart(5) + ' שאלות לפרק' +
      ' | ' + a.levels.toFixed(0).padStart(2) + ' פרקים');
  });

  console.log('\nקצב לפי דיוק — כמה שאלות עולה פרק');
  [1, 0.9, 0.8, 0.75, 0.6, 0.5, 0.4].forEach(function (acc) {
    var a = average({ enabled: ALL, accuracy: acc, cap: 2000 }, 16);
    console.log('  דיוק ' + String(acc).padEnd(5) +
      ' פרק ראשון ' + a.firstLevel.toFixed(0).padStart(4) +
      ' | ממוצע ' + a.meanLevel.toFixed(0).padStart(4) + ' לפרק' +
      ' | נפתחו ' + a.levels.toFixed(1).padStart(4) + ' פרקים ב-2000 שאלות');
  });
}
