/* אוצר מילים: עברית <-> אנגלית.
   group משמש לבחירת מסיחים (distractors) מאותו שדה סמנטי,
   כדי שהשאלה תהיה מאתגרת ולא תיפתר בניחוש לפי סוג המילה. */
(function (root) {
  'use strict';

  var VOCAB = [
    // --- חפצים בבית ---
    { id: 'v001', he: 'קלף',       en: 'card',        group: 'object', note: 'קלף משחק', section: 'object-1' },
    { id: 'v002', he: 'מפתח',      en: 'key',         group: 'object', section: 'object-1' },
    { id: 'v003', he: 'מגבת',      en: 'towel',       group: 'object', section: 'object-1' },
    { id: 'v004', he: 'כפית',      en: 'teaspoon',    group: 'object', section: 'object-1' },
    { id: 'v005', he: 'מזלג',      en: 'fork',        group: 'object', section: 'object-2' },
    { id: 'v006', he: 'סכין',      en: 'knife',       group: 'object', section: 'object-2' },
    { id: 'v007', he: 'צלחת',      en: 'plate',       group: 'object', section: 'object-2' },
    { id: 'v008', he: 'מספריים',   en: 'scissors',    group: 'object', section: 'object-2' },
    { id: 'v009', he: 'מברשת',     en: 'brush',       group: 'object', section: 'object-3' },
    { id: 'v010', he: 'סבון',      en: 'soap',        group: 'object', section: 'object-3' },
    { id: 'v011', he: 'מסרק',      en: 'comb',        group: 'object', section: 'object-3' },
    { id: 'v012', he: 'מטרייה',    en: 'umbrella',    group: 'object', section: 'object-3' },
    { id: 'v013', he: 'מחברת',     en: 'notebook',    group: 'object', section: 'object-4' },
    { id: 'v014', he: 'עיתון',     en: 'newspaper',   group: 'object', section: 'object-4' },
    { id: 'v015', he: 'ארנק',      en: 'wallet',      group: 'object', section: 'object-4' },
    { id: 'v016', he: 'מגהץ',      en: 'iron',        group: 'object', note: 'המכשיר לגיהוץ', section: 'object-4' },

    // --- בית ועיר ---
    { id: 'v017', he: 'חלון',      en: 'window',      group: 'place', section: 'place-1' },
    { id: 'v018', he: 'דלת',       en: 'door',        group: 'place', section: 'place-1' },
    { id: 'v019', he: 'מטבח',      en: 'kitchen',     group: 'place', section: 'place-1' },
    { id: 'v020', he: 'מדרכה',     en: 'sidewalk',    group: 'place', section: 'place-1' },
    { id: 'v021', he: 'כביש',      en: 'road',        group: 'place', section: 'place-1' },
    { id: 'v022', he: 'רמזור',     en: 'traffic light', group: 'place', section: 'place-2' },
    { id: 'v023', he: 'משרד',      en: 'office',      group: 'place', section: 'place-2' },
    { id: 'v024', he: 'ספרייה',    en: 'library',     group: 'place', section: 'place-2' },
    { id: 'v025', he: 'מסעדה',     en: 'restaurant',  group: 'place', section: 'place-2' },
    { id: 'v026', he: 'גשר',       en: 'bridge',      group: 'place', section: 'place-2' },

    // --- לבוש ---
    { id: 'v027', he: 'נעל',       en: 'shoe',        group: 'clothing', section: 'clothing-1' },
    { id: 'v028', he: 'חולצה',     en: 'shirt',       group: 'clothing', section: 'clothing-1' },
    { id: 'v029', he: 'מכנסיים',   en: 'trousers',    group: 'clothing', section: 'clothing-1' },
    { id: 'v030', he: 'מעיל',      en: 'coat',        group: 'clothing', section: 'clothing-1' },
    { id: 'v031', he: 'כובע',      en: 'hat',         group: 'clothing', section: 'clothing-2' },
    { id: 'v032', he: 'חגורה',     en: 'belt',        group: 'clothing', section: 'clothing-2' },
    { id: 'v033', he: 'כפפה',      en: 'glove',       group: 'clothing', section: 'clothing-2' },

    // --- טבע ומזג אוויר ---
    { id: 'v034', he: 'גשם',       en: 'rain',        group: 'nature', section: 'nature-1' },
    { id: 'v035', he: 'שלג',       en: 'snow',        group: 'nature', section: 'nature-1' },
    { id: 'v036', he: 'ענן',       en: 'cloud',       group: 'nature', section: 'nature-1' },
    { id: 'v037', he: 'רוח',       en: 'wind',        group: 'nature', section: 'nature-1' },
    { id: 'v038', he: 'חוף',       en: 'beach',       group: 'nature', section: 'nature-1' },
    { id: 'v039', he: 'יער',       en: 'forest',      group: 'nature', section: 'nature-2' },
    { id: 'v040', he: 'מדבר',      en: 'desert',      group: 'nature', section: 'nature-2' },
    { id: 'v041', he: 'עמק',       en: 'valley',      group: 'nature', section: 'nature-2' },
    { id: 'v042', he: 'נהר',       en: 'river',       group: 'nature', section: 'nature-2' },
    { id: 'v043', he: 'אגם',       en: 'lake',        group: 'nature', section: 'nature-2' },

    // --- חיות ---
    { id: 'v044', he: 'ציפור',     en: 'bird',        group: 'animal', section: 'animal-1' },
    { id: 'v045', he: 'חתול',      en: 'cat',         group: 'animal', section: 'animal-1' },
    { id: 'v046', he: 'סוס',       en: 'horse',       group: 'animal', section: 'animal-1' },
    { id: 'v047', he: 'פרה',       en: 'cow',         group: 'animal', section: 'animal-1' },
    { id: 'v048', he: 'דבורה',     en: 'bee',         group: 'animal', section: 'animal-1' },
    { id: 'v049', he: 'נמלה',      en: 'ant',         group: 'animal', section: 'animal-2' },
    { id: 'v050', he: 'פיל',       en: 'elephant',    group: 'animal', section: 'animal-2' },
    { id: 'v051', he: 'שועל',      en: 'fox',         group: 'animal', section: 'animal-2' },
    { id: 'v052', he: 'צב',        en: 'turtle',      group: 'animal', section: 'animal-2' },

    // --- אנשים ומקצועות ---
    { id: 'v053', he: 'רופא',      en: 'doctor',      group: 'person', section: 'person-1' },
    { id: 'v054', he: 'מורה',      en: 'teacher',     group: 'person', section: 'person-1' },
    { id: 'v055', he: 'נגר',       en: 'carpenter',   group: 'person', section: 'person-1' },
    { id: 'v056', he: 'טבח',       en: 'cook',        group: 'person', section: 'person-1' },
    { id: 'v057', he: 'שוטר',      en: 'policeman',   group: 'person', section: 'person-2' },
    { id: 'v058', he: 'שכן',       en: 'neighbour',   group: 'person', section: 'person-2' },
    { id: 'v059', he: 'אורח',      en: 'guest',       group: 'person', section: 'person-2' },

    // --- פעלים ---
    { id: 'v060', he: 'להסביר',    en: 'to explain',  group: 'verb', section: 'verb-1' },
    { id: 'v061', he: 'להחליט',    en: 'to decide',   group: 'verb', section: 'verb-1' },
    { id: 'v062', he: 'להזמין',    en: 'to invite',   group: 'verb', section: 'verb-1' },
    { id: 'v063', he: 'להשאיל',    en: 'to lend',     group: 'verb', section: 'verb-1' },
    { id: 'v064', he: 'לשאול',     en: 'to borrow',   group: 'verb', note: 'במשמעות לקיחת דבר בהשאלה', section: 'verb-2' },
    { id: 'v065', he: 'לתקן',      en: 'to fix',      group: 'verb', section: 'verb-2' },
    { id: 'v066', he: 'לנחש',      en: 'to guess',    group: 'verb', section: 'verb-2' },
    { id: 'v067', he: 'להסתיר',    en: 'to hide',     group: 'verb', section: 'verb-2' },

    // --- שמות תואר ---
    { id: 'v068', he: 'מסוכן',     en: 'dangerous',   group: 'adj', section: 'adj-1' },
    { id: 'v069', he: 'קשה',       en: 'difficult',   group: 'adj', section: 'adj-1' },
    { id: 'v070', he: 'עצום',      en: 'enormous',    group: 'adj', section: 'adj-1' },
    { id: 'v071', he: 'מפורסם',    en: 'famous',      group: 'adj', section: 'adj-1' },
    { id: 'v072', he: 'רגיל',      en: 'ordinary',    group: 'adj', section: 'adj-2' },
    { id: 'v073', he: 'ריק',       en: 'empty',       group: 'adj', section: 'adj-2' },
    { id: 'v074', he: 'רטוב',      en: 'wet',         group: 'adj', section: 'adj-2' },
    { id: 'v075', he: 'חמוץ',      en: 'sour',        group: 'adj', section: 'adj-2' }
  ];

  root.SP = root.SP || {};
  root.SP.VOCAB = VOCAB;
  if (typeof module !== 'undefined' && module.exports) { module.exports = VOCAB; }
})(typeof window !== 'undefined' ? window : globalThis);
