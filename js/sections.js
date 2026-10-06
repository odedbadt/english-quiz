/* תוכנית הלימוד: רשימת הפרקים, מסודרת, לכל מסלול בנפרד.
   התלמיד מתחיל בפרק הראשון; כשהוא שולט ברוב הפריטים שבו נפתח הבא.

   name — עברית. אות לטינית בודדת מותרת, אך לא צירוף: צירוף לטיני בתוך
          משפט עברי מתהפך (ראו ההערות על דו-כיווניות בקובץ הבדיקות).
   tag  — ההדגמה האנגלית. היא חיה בשדה משלה ומוצגת בשורה משמאל לימין,
          ולעולם אינה נתפרת לתוך משפט עברי.

   שיוך פריט לפרק: item.section, בשני המסלולים.

   אוצר המילים מחולק לפרקים של ארבעה-חמישה פריטים ולא לפי קבוצה שלמה.
   הקבוצה ”חפצים בבית“ לבדה הייתה 32 קלפים, פי ארבעה מכל פרק איות, וכך
   התלמיד נתקע בפרק אחד למאות שאלות. group נשאר מה שהיה — מאגר המסיחים
   הסמנטי — ואינו מושפע מהחלוקה הזאת. */
(function (root) {
  'use strict';

  var VOCAB_SECTIONS = [
    { id: 'object-1',   name: 'חפצים בבית א', tag: 'card · key · towel' },
    { id: 'object-2',   name: 'חפצים בבית ב', tag: 'fork · knife · plate' },
    { id: 'object-3',   name: 'חפצים בבית ג', tag: 'brush · soap · comb' },
    { id: 'object-4',   name: 'חפצים בבית ד', tag: 'notebook · newspaper · wallet' },
    { id: 'place-1',    name: 'בית ועיר א', tag: 'window · door · kitchen' },
    { id: 'place-2',    name: 'בית ועיר ב', tag: 'traffic light · office · library' },
    { id: 'clothing-1', name: 'לבוש א', tag: 'shoe · shirt · trousers' },
    { id: 'clothing-2', name: 'לבוש ב', tag: 'hat · belt · glove' },
    { id: 'nature-1',   name: 'טבע ומזג אוויר א', tag: 'rain · snow · cloud' },
    { id: 'nature-2',   name: 'טבע ומזג אוויר ב', tag: 'forest · desert · valley' },
    { id: 'animal-1',   name: 'חיות א', tag: 'bird · cat · horse' },
    { id: 'animal-2',   name: 'חיות ב', tag: 'ant · elephant · fox' },
    { id: 'person-1',   name: 'אנשים ומקצועות א', tag: 'doctor · teacher · carpenter' },
    { id: 'person-2',   name: 'אנשים ומקצועות ב', tag: 'policeman · neighbour · guest' },
    { id: 'verb-1',     name: 'פעלים א', tag: 'to explain · to decide · to invite' },
    { id: 'verb-2',     name: 'פעלים ב', tag: 'to borrow · to fix · to guess' },
    { id: 'adj-1',      name: 'שמות תואר א', tag: 'dangerous · difficult · enormous' },
    { id: 'adj-2',      name: 'שמות תואר ב', tag: 'ordinary · empty · wet' }
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
