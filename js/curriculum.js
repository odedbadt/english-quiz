/* שכבת תוכנית הלימוד מעל המתזמן.

   המתזמן יודע לבחור קלף לפי דרגת שליטה; הוא אינו יודע דבר על פרקים.
   כאן נוסף הגבול: רק פרקים שנפתחו משתתפים בהגרלה, הפרק הנוכחי מקבל
   את רוב הזמן, ופרקים שנסגרו ממשיכים לחזור במינון נמוך — איות נשכח
   בלי חזרה, ולכן ”סיימתי“ אינו ”לא אראה שוב“.

   הבחירה היא בשני שלבים: תחילה מגרילים דלי (נוכחי או חזרה) ואז
   מבקשים מהמתזמן קלף מתוכו. כך היחס בין השניים קבוע וניתן לבדיקה,
   ואינו משתנה ככל שמצטברים פרקים שנסגרו. */
(function (root) {
  'use strict';

  var REVIEW_SHARE = 0.25;   // חלקם של פרקים שנסגרו בהגרלה
  /* כמה פעמים צריך לענות נכון על קלף כדי שייחשב ”יודע“, לפי איך שהלך
     בפרק הזה עד כה. מי שכמעט אינו טועה אינו צריך שלושה סיבובים על אותן
     שמונה מילים — זו הדרך הבטוחה לשעמם אותו.

     הסולם רשאי רק להקל, לעולם לא להחמיר. ניסיון להחמיר (שלוש שליטות
     למי שמתקשה) נמדד והיה הרסני: תשובה שגויה מורידה שתי דרגות, ולכן
     מתחת ל-67% דיוק השליטה נסוגה בממוצע מהר משהיא עולה, ודרגה 3 אינה
     מושגת כמעט לעולם. בדיוק 0.5 הפרק הראשון קפץ מ-193 שאלות ל-432,
     ובאלפיים שאלות נפתחו ארבעה פרקים במקום ארבעה-עשר. מי שמתקשה הוא
     בדיוק מי שאסור להעניש בעוד חזרות. */
  var MASTERY_BY_ACCURACY = [
    { from: 0.9, mastery: 1 },
    { from: 0.0, mastery: 2 }
  ];
  var ADVANCE_MASTERY = 2;   // ברירת מחדל לפרק שטרם נענתה בו שאלה
  var ADVANCE_RATIO = 0.8;   // איזה חלק מהפרק צריך להגיע לשם

  /* ADVANCE_MASTERY נמוך מ-MASTERED_AT שבמתזמן (4) בכוונה: הראשון הוא
     תנאי מעבר וצריך להיות בר-השגה, השני הוא תג ההישג שבראש המסך.
     הוא הורד מ-3 ל-2 אחרי מדידה: בפועל פרק ראשון נמשך מאתיים שאלות
     ויותר, והתלמיד לא ראה התקדמות. פרק שאינו נגמר גם מקבע את הבריכה
     על אותם קלפים — ”נתקע“ ו”חוזר על עצמו“ הם אותה תקלה. */

  function createCurriculum(opts) {
    opts = opts || {};
    var tracks = opts.tracks || [];
    var cards = opts.cards || [];
    var sched = opts.scheduler;
    var random = opts.random || Math.random;
    var saved = (opts.state && opts.state.unlocked) || {};

    var unlocked = {};
    tracks.forEach(function (t) {
      var n = Number(saved[t.id]);
      /* תמיד פרק אחד פתוח לפחות, ולעולם לא יותר ממה שקיים — כך קובץ
         שמור ישן או פגום אינו נועל את התלמיד מחוץ לתוכנית. */
      unlocked[t.id] = Math.min(t.sections.length, Math.max(1, n || 1));
    });

    function trackOf(card) { return card.type === 'spelling' ? 'spelling' : 'vocab'; }

    function sectionIdOf(card) { return card.item.section; }

    function trackDef(id) {
      for (var i = 0; i < tracks.length; i++) { if (tracks[i].id === id) { return tracks[i]; } }
      return null;
    }

    function indexOf(card) {
      var t = trackDef(trackOf(card));
      if (!t) { return -1; }
      var sid = sectionIdOf(card);
      for (var i = 0; i < t.sections.length; i++) { if (t.sections[i].id === sid) { return i; } }
      return -1;   // פריט ללא פרק מוכר אינו נכנס לבריכה; הבדיקות אוסרות זאת
    }

    function isOpen(card) {
      var i = indexOf(card);
      return i >= 0 && i < unlocked[trackOf(card)];
    }

    function isCurrent(card) {
      return indexOf(card) === unlocked[trackOf(card)] - 1;
    }

    function sectionAt(trackId, idx) {
      var t = trackDef(trackId);
      return t && t.sections[idx] ? t.sections[idx] : null;
    }

    function currentSection(trackId) { return sectionAt(trackId, unlocked[trackId] - 1); }

    function sectionOf(card) { return sectionAt(trackOf(card), indexOf(card)); }

    function pick(enabled) {
      function open(c) { return (!enabled || enabled(c)) && isOpen(c); }
      function current(c) { return open(c) && isCurrent(c); }
      function review(c) { return open(c) && !isCurrent(c); }

      var hasCurrent = cards.some(current);
      var hasReview = cards.some(review);
      if (!hasCurrent && !hasReview) { return null; }
      if (!hasCurrent) { return sched.next(review); }
      if (!hasReview) { return sched.next(current); }
      return random() < REVIEW_SHARE ? sched.next(review) : sched.next(current);
    }

    /* התקדמות בפרק נמדדת רק על קלפים שאפשר לשאול כרגע: תלמיד שכיבה
       כיוון שאלה אחד לא ייתקע בפרק שלעולם לא יושלם. */
    function progress(trackId, idx, enabled) {
      var pool = cards.filter(function (c) {
        return trackOf(c) === trackId && indexOf(c) === idx && (!enabled || enabled(c));
      });

      var right = 0, seen = 0;
      pool.forEach(function (c) {
        var st = sched.cardState(c.id);
        right += st.right; seen += st.seen;
      });
      var need = ADVANCE_MASTERY;
      if (seen) {
        var acc = right / seen;
        for (var i = 0; i < MASTERY_BY_ACCURACY.length; i++) {
          if (acc >= MASTERY_BY_ACCURACY[i].from) { need = MASTERY_BY_ACCURACY[i].mastery; break; }
        }
      }

      var done = 0;
      pool.forEach(function (c) {
        if (sched.masteryOf(c.id) >= need) { done += 1; }
      });
      return {
        total: pool.length, done: done, need: need,
        accuracy: seen ? right / seen : null,
        section: sectionAt(trackId, idx)
      };
    }

    function cleared(trackId, idx, enabled) {
      var p = progress(trackId, idx, enabled);
      return p.total > 0 && p.done / p.total >= ADVANCE_RATIO;
    }

    /* נקרא אחרי כל תשובה. הפתיחה היא חד-כיוונית: פרק שנפתח נשאר פתוח
       גם אם השליטה בו נסוגה, אחרת טעות אחת הייתה מחזירה את התלמיד
       לאחור באמצע הפרק הבא. */
    function sync(enabled) {
      var opened = [];
      tracks.forEach(function (t) {
        while (unlocked[t.id] < t.sections.length && cleared(t.id, unlocked[t.id] - 1, enabled)) {
          unlocked[t.id] += 1;
          opened.push({ track: t, section: currentSection(t.id) });
        }
      });
      return opened;
    }

    function exportState() { return { unlocked: unlocked, v: 1 }; }

    function reset() {
      tracks.forEach(function (t) { unlocked[t.id] = 1; });
    }

    return {
      pick: pick,
      sync: sync,
      progress: progress,
      isOpen: isOpen,
      isCurrent: isCurrent,
      sectionOf: sectionOf,
      trackOf: trackOf,
      currentSection: currentSection,
      unlockedCount: function (trackId) { return unlocked[trackId]; },
      exportState: exportState,
      reset: reset,
      constants: { REVIEW_SHARE: REVIEW_SHARE, ADVANCE_MASTERY: ADVANCE_MASTERY, ADVANCE_RATIO: ADVANCE_RATIO, MASTERY_BY_ACCURACY: MASTERY_BY_ACCURACY }
    };
  }

  root.SP = root.SP || {};
  root.SP.createCurriculum = createCurriculum;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createCurriculum: createCurriculum };
  }
})(typeof window !== 'undefined' ? window : globalThis);
