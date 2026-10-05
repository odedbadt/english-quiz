/* אוצר מילים: עברית <-> אנגלית.
   group משמש לבחירת מסיחים (distractors) מאותו שדה סמנטי,
   כדי שהשאלה תהיה מאתגרת ולא תיפתר בניחוש לפי סוג המילה. */
(function (root) {
  'use strict';

  var VOCAB = [
    // --- חפצים בבית ---
    { id: 'v001', he: 'קלף',       en: 'card',        group: 'object', note: 'קלף משחק' },
    { id: 'v002', he: 'מפתח',      en: 'key',         group: 'object' },
    { id: 'v003', he: 'מגבת',      en: 'towel',       group: 'object' },
    { id: 'v004', he: 'כפית',      en: 'teaspoon',    group: 'object' },
    { id: 'v005', he: 'מזלג',      en: 'fork',        group: 'object' },
    { id: 'v006', he: 'סכין',      en: 'knife',       group: 'object' },
    { id: 'v007', he: 'צלחת',      en: 'plate',       group: 'object' },
    { id: 'v008', he: 'מספריים',   en: 'scissors',    group: 'object' },
    { id: 'v009', he: 'מברשת',     en: 'brush',       group: 'object' },
    { id: 'v010', he: 'סבון',      en: 'soap',        group: 'object' },
    { id: 'v011', he: 'מסרק',      en: 'comb',        group: 'object' },
    { id: 'v012', he: 'מטרייה',    en: 'umbrella',    group: 'object' },
    { id: 'v013', he: 'מחברת',     en: 'notebook',    group: 'object' },
    { id: 'v014', he: 'עיתון',     en: 'newspaper',   group: 'object' },
    { id: 'v015', he: 'ארנק',      en: 'wallet',      group: 'object' },
    { id: 'v016', he: 'מגהץ',      en: 'iron',        group: 'object', note: 'המכשיר לגיהוץ' },

    // --- בית ועיר ---
    { id: 'v017', he: 'חלון',      en: 'window',      group: 'place' },
    { id: 'v018', he: 'דלת',       en: 'door',        group: 'place' },
    { id: 'v019', he: 'מטבח',      en: 'kitchen',     group: 'place' },
    { id: 'v020', he: 'מדרכה',     en: 'sidewalk',    group: 'place' },
    { id: 'v021', he: 'כביש',      en: 'road',        group: 'place' },
    { id: 'v022', he: 'רמזור',     en: 'traffic light', group: 'place' },
    { id: 'v023', he: 'משרד',      en: 'office',      group: 'place' },
    { id: 'v024', he: 'ספרייה',    en: 'library',     group: 'place' },
    { id: 'v025', he: 'מסעדה',     en: 'restaurant',  group: 'place' },
    { id: 'v026', he: 'גשר',       en: 'bridge',      group: 'place' },

    // --- לבוש ---
    { id: 'v027', he: 'נעל',       en: 'shoe',        group: 'clothing' },
    { id: 'v028', he: 'חולצה',     en: 'shirt',       group: 'clothing' },
    { id: 'v029', he: 'מכנסיים',   en: 'trousers',    group: 'clothing' },
    { id: 'v030', he: 'מעיל',      en: 'coat',        group: 'clothing' },
    { id: 'v031', he: 'כובע',      en: 'hat',         group: 'clothing' },
    { id: 'v032', he: 'חגורה',     en: 'belt',        group: 'clothing' },
    { id: 'v033', he: 'כפפה',      en: 'glove',       group: 'clothing' },

    // --- טבע ומזג אוויר ---
    { id: 'v034', he: 'גשם',       en: 'rain',        group: 'nature' },
    { id: 'v035', he: 'שלג',       en: 'snow',        group: 'nature' },
    { id: 'v036', he: 'ענן',       en: 'cloud',       group: 'nature' },
    { id: 'v037', he: 'רוח',       en: 'wind',        group: 'nature' },
    { id: 'v038', he: 'חוף',       en: 'beach',       group: 'nature' },
    { id: 'v039', he: 'יער',       en: 'forest',      group: 'nature' },
    { id: 'v040', he: 'מדבר',      en: 'desert',      group: 'nature' },
    { id: 'v041', he: 'עמק',       en: 'valley',      group: 'nature' },
    { id: 'v042', he: 'נהר',       en: 'river',       group: 'nature' },
    { id: 'v043', he: 'אגם',       en: 'lake',        group: 'nature' },

    // --- חיות ---
    { id: 'v044', he: 'ציפור',     en: 'bird',        group: 'animal' },
    { id: 'v045', he: 'חתול',      en: 'cat',         group: 'animal' },
    { id: 'v046', he: 'סוס',       en: 'horse',       group: 'animal' },
    { id: 'v047', he: 'פרה',       en: 'cow',         group: 'animal' },
    { id: 'v048', he: 'דבורה',     en: 'bee',         group: 'animal' },
    { id: 'v049', he: 'נמלה',      en: 'ant',         group: 'animal' },
    { id: 'v050', he: 'פיל',       en: 'elephant',    group: 'animal' },
    { id: 'v051', he: 'שועל',      en: 'fox',         group: 'animal' },
    { id: 'v052', he: 'צב',        en: 'turtle',      group: 'animal' },

    // --- אנשים ומקצועות ---
    { id: 'v053', he: 'רופא',      en: 'doctor',      group: 'person' },
    { id: 'v054', he: 'מורה',      en: 'teacher',     group: 'person' },
    { id: 'v055', he: 'נגר',       en: 'carpenter',   group: 'person' },
    { id: 'v056', he: 'טבח',       en: 'cook',        group: 'person' },
    { id: 'v057', he: 'שוטר',      en: 'policeman',   group: 'person' },
    { id: 'v058', he: 'שכן',       en: 'neighbour',   group: 'person' },
    { id: 'v059', he: 'אורח',      en: 'guest',       group: 'person' },

    // --- פעלים ---
    { id: 'v060', he: 'להסביר',    en: 'to explain',  group: 'verb' },
    { id: 'v061', he: 'להחליט',    en: 'to decide',   group: 'verb' },
    { id: 'v062', he: 'להזמין',    en: 'to invite',   group: 'verb' },
    { id: 'v063', he: 'להשאיל',    en: 'to lend',     group: 'verb' },
    { id: 'v064', he: 'לשאול',     en: 'to borrow',   group: 'verb', note: 'במשמעות לקיחת דבר בהשאלה' },
    { id: 'v065', he: 'לתקן',      en: 'to fix',      group: 'verb' },
    { id: 'v066', he: 'לנחש',      en: 'to guess',    group: 'verb' },
    { id: 'v067', he: 'להסתיר',    en: 'to hide',     group: 'verb' },

    // --- שמות תואר ---
    { id: 'v068', he: 'מסוכן',     en: 'dangerous',   group: 'adj' },
    { id: 'v069', he: 'קשה',       en: 'difficult',   group: 'adj' },
    { id: 'v070', he: 'עצום',      en: 'enormous',    group: 'adj' },
    { id: 'v071', he: 'מפורסם',    en: 'famous',      group: 'adj' },
    { id: 'v072', he: 'רגיל',      en: 'ordinary',    group: 'adj' },
    { id: 'v073', he: 'ריק',       en: 'empty',       group: 'adj' },
    { id: 'v074', he: 'רטוב',      en: 'wet',         group: 'adj' },
    { id: 'v075', he: 'חמוץ',      en: 'sour',        group: 'adj' }
  ];

  root.SP = root.SP || {};
  root.SP.VOCAB = VOCAB;
  if (typeof module !== 'undefined' && module.exports) { module.exports = VOCAB; }
})(typeof window !== 'undefined' ? window : globalThis);
