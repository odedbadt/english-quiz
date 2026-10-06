/* תוכנית הלימוד: רשימת הפרקים, מסודרת, לכל מסלול בנפרד.
   התלמיד מתחיל בפרק הראשון; כשהוא שולט ברוב הפריטים שבו נפתח הבא.

   name — עברית. אות לטינית בודדת מותרת, אך לא צירוף: צירוף לטיני בתוך
          משפט עברי מתהפך (ראו ההערות על דו-כיווניות בקובץ הבדיקות).
   tag  — ההדגמה האנגלית. היא חיה בשדה משלה ומוצגת בשורה משמאל לימין,
          ולעולם אינה נתפרת לתוך משפט עברי.

   שיוך פריט לפרק: קלף איות לפי item.section, קלף אוצר מילים לפי
   item.group — כלומר הקבוצה הסמנטית שכבר שימשה לבחירת מסיחים. */
(function (root) {
  'use strict';

  var VOCAB_SECTIONS = [
    { id: 'object',   name: 'חפצים בבית',      tag: 'key · towel · fork' },
    { id: 'place',    name: 'בית ועיר',        tag: 'window · bridge' },
    { id: 'clothing', name: 'לבוש',            tag: 'shirt · coat · hat' },
    { id: 'nature',   name: 'טבע ומזג אוויר',  tag: 'rain · forest · lake' },
    { id: 'animal',   name: 'חיות',            tag: 'bird · horse · fox' },
    { id: 'person',   name: 'אנשים ומקצועות',  tag: 'doctor · teacher' },
    { id: 'verb',     name: 'פעלים',           tag: 'to explain · to hide' },
    { id: 'adj',      name: 'שמות תואר',       tag: 'famous · empty · wet' }
  ];

  /* הסדר הוא סדר הלימוד: תחילה צליל ואיות בסיסיים, ואחריהם המאגר המתקדם.
     ”סדר התנועות“ בא ראשון מבין המתקדמים משום שהוא ממשיך ישירות את
     פרק צמדי התנועות שלפניו. */
  var SPELLING_SECTIONS = [
    { id: 'oo-ee',           name: 'תנועות ארוכות',          tag: 'oo · ee' },
    { id: 'magic-e',         name: 'האות האילמת שמאריכה',    tag: 'cake · bike' },
    { id: 'soft-c',          name: 'c רכה',                  tag: 'face · city' },
    { id: 'ea-ie',           name: 'צמדי תנועות',            tag: 'ea · ie' },
    { id: 'digraphs',        name: 'צמדי עיצורים',           tag: 'th · ch · sh' },
    { id: 'silent-k',        name: 'k שותקת',                tag: 'know · knife' },
    { id: 'silent-gh',       name: 'gh שותקת',               tag: 'night · thought' },
    { id: 'c-s-k',           name: 'בחירה בין אותיות דומות', tag: 'cat · kid · since' },
    { id: 'adv-vowel-order', name: 'סדר התנועות',            tag: 'receive · believe' },
    { id: 'adv-doubles',     name: 'עיצורים כפולים',         tag: 'necessary · address' },
    { id: 'adv-endings',     name: 'סיומות',                 tag: 'beautiful · calendar' },
    { id: 'adv-swallowed',   name: 'תנועות נבלעות',          tag: 'separate · chocolate' },
    { id: 'adv-silent',      name: 'אותיות שאינן נשמעות',    tag: 'Wednesday · knowledge' },
    { id: 'adv-forms',       name: 'צורות ומילים שאולות',    tag: 'writing · rhythm' }
  ];

  var TRACKS = [
    { id: 'vocab',    name: 'אוצר מילים', sections: VOCAB_SECTIONS },
    { id: 'spelling', name: 'איות',       sections: SPELLING_SECTIONS }
  ];

  root.SP = root.SP || {};
  root.SP.TRACKS = TRACKS;
  if (typeof module !== 'undefined' && module.exports) { module.exports = { TRACKS: TRACKS }; }
})(typeof window !== 'undefined' ? window : globalThis);
