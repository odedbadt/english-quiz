/* מתזמן אדפטיבי (adaptive scheduler).
   כל "קלף" (card) מקבל דרגת שליטה m. תשובה נכונה מעלה אותה באחת,
   תשובה שגויה מורידה אותה בשתיים. ההסתברות להופיע שוב היא DECAY^m,
   כלומר כל תשובה נכונה מחצי את הסיכוי שהשאלה תחזור — אך הוא לעולם
   אינו מתאפס, כדי שחומר שנלמד ייבדק שוב מדי פעם. */
(function (root) {
  'use strict';

  var MAX_MASTERY = 6;      // 0.5^6 ≈ 1.5% מהמשקל ההתחלתי
  var DECAY = 0.5;          // כמה מצטמק המשקל אחרי תשובה נכונה
  var DEMOTE = 2;           // בכמה דרגות נסוגים אחרי טעות
  var NEW_BOOST = 1.4;      // עדיפות קלה לפריטים שטרם נשאלו
  var COOLDOWN_PENALTY = 0.04;
  var MIN_WEIGHT = 0.004;
  var MASTERED_AT = 4;

  function blankState() {
    return { m: 0, right: 0, wrong: 0, seen: 0, lastIdx: -1 };
  }

  function createScheduler(opts) {
    opts = opts || {};
    var cards = opts.cards || [];
    var random = opts.random || Math.random;
    var saved = opts.state || {};
    var states = saved.states || {};
    var totals = saved.totals || { asked: 0, right: 0 };
    var qIndex = saved.qIndex || 0;

    function stateOf(id) {
      if (!states[id]) { states[id] = blankState(); }
      return states[id];
    }

    function weightOf(id, cooldown) {
      var st = stateOf(id);
      var w = Math.pow(DECAY, st.m);
      if (st.seen === 0) { w *= NEW_BOOST; }
      w *= 1 + 0.2 * Math.min(st.wrong, 3);
      if (st.lastIdx >= 0 && qIndex - st.lastIdx < cooldown) { w *= COOLDOWN_PENALTY; }
      return Math.max(w, MIN_WEIGHT);
    }

    function cooldownFor(poolSize) {
      return Math.min(6, Math.floor(poolSize / 4));
    }

    function next(filter) {
      var pool = filter ? cards.filter(filter) : cards.slice();
      if (!pool.length) { return null; }
      var cooldown = cooldownFor(pool.length);
      var total = 0, i, weights = [];
      for (i = 0; i < pool.length; i++) {
        weights[i] = weightOf(pool[i].id, cooldown);
        total += weights[i];
      }
      var roll = random() * total;
      for (i = 0; i < pool.length; i++) {
        roll -= weights[i];
        if (roll <= 0) { return pool[i]; }
      }
      return pool[pool.length - 1];
    }

    function record(id, correct) {
      var st = stateOf(id);
      st.seen += 1;
      st.lastIdx = qIndex;
      if (correct) {
        st.right += 1;
        st.m = Math.min(MAX_MASTERY, st.m + 1);
        totals.right += 1;
      } else {
        st.wrong += 1;
        st.m = Math.max(0, st.m - DEMOTE);
      }
      totals.asked += 1;
      qIndex += 1;
      return st;
    }

    function stats(filter) {
      var pool = filter ? cards.filter(filter) : cards;
      var mastered = 0, touched = 0;
      for (var i = 0; i < pool.length; i++) {
        var st = states[pool[i].id];
        if (!st || !st.seen) { continue; }
        touched += 1;
        if (st.m >= MASTERED_AT) { mastered += 1; }
      }
      return {
        total: pool.length,
        touched: touched,
        mastered: mastered,
        asked: totals.asked,
        right: totals.right
      };
    }

    function masteryOf(id) { return stateOf(id).m; }

    function exportState() {
      return { states: states, totals: totals, qIndex: qIndex, v: 1 };
    }

    function reset() {
      states = {};
      totals = { asked: 0, right: 0 };
      qIndex = 0;
    }

    return {
      next: next,
      record: record,
      stats: stats,
      masteryOf: masteryOf,
      weightOf: function (id) { return weightOf(id, cooldownFor(cards.length)); },
      exportState: exportState,
      reset: reset,
      constants: { MAX_MASTERY: MAX_MASTERY, DECAY: DECAY, MASTERED_AT: MASTERED_AT }
    };
  }

  root.SP = root.SP || {};
  root.SP.createScheduler = createScheduler;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createScheduler: createScheduler };
  }
})(typeof window !== 'undefined' ? window : globalThis);
