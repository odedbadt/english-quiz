/* איות באנגלית: המילה בעברית בשאלה, והאפשרויות הן איותים באנגלית.
   en      = האיות הנכון.
   wrong   = שלוש שגיאות כתיב נפוצות.
   pattern = פירוק המילה באותיות לטיניות בלבד. מוצג אחרי התשובה בשורה
             נפרדת משלו, משמאל לימין, כדי שלא יישבר בתוך משפט עברי.
   note    = הכלל בעברית. מוצג אחרי התשובה.
   focus   = שם הכלל, לסיווג הפריט. */
(function (root) {
  'use strict';

  var SPELLING = [
    { id: 's001', he: 'הכרחי', en: 'necessary',
      wrong: ['neccessary', 'necesary', 'necessery'],
      pattern: null, note: 'c אחת ואחריה שתי s', focus: 'עיצורים כפולים' },

    { id: 's002', he: 'מקום לינה', en: 'accommodation',
      wrong: ['accomodation', 'acommodation', 'accommodaton'],
      pattern: 'cc + mm', note: 'שני זוגות של עיצורים כפולים', focus: 'עיצורים כפולים' },

    { id: 's003', he: 'נפרד', en: 'separate',
      wrong: ['seperate', 'saparate', 'seperete'],
      pattern: 'sep-a-rate', note: 'התנועה האמצעית נבלעת בדיבור, אך היא איננה e', focus: 'תנועה נבלעת' },

    { id: 's004', he: 'בהחלט', en: 'definitely',
      wrong: ['definately', 'definatly', 'defenitely'],
      pattern: 'de-fi-nite-ly', note: 'אין במילה אף a', focus: 'תנועה נבלעת' },

    { id: 's005', he: 'לקבל', en: 'receive',
      wrong: ['recieve', 'receve', 'receeve'],
      pattern: 'c + ei', note: 'הכלל ״i לפני e״ אינו חל אחרי c', focus: 'סדר התנועות' },

    { id: 's006', he: 'להאמין', en: 'believe',
      wrong: ['beleive', 'belive', 'beleve'],
      pattern: null, note: 'i לפני e', focus: 'סדר התנועות' },

    { id: 's007', he: 'מוזר', en: 'weird',
      wrong: ['wierd', 'werid', 'weared'],
      pattern: null, note: 'יוצאת דופן לכלל — כאן e לפני i', focus: 'סדר התנועות' },

    { id: 's008', he: 'להשיג', en: 'achieve',
      wrong: ['acheive', 'achive', 'acheeve'],
      pattern: null, note: 'i לפני e', focus: 'סדר התנועות' },

    { id: 's009', he: 'זר, לא מקומי', en: 'foreign',
      wrong: ['foriegn', 'foregin', 'forein'],
      pattern: null, note: 'יוצאת דופן — e לפני i, והמילה נחתמת ב-gn', focus: 'סדר התנועות' },

    { id: 's010', he: 'מפני ש', en: 'because',
      wrong: ['becuase', 'becouse', 'becaus'],
      pattern: 'be + cause', note: 'שתי מילים שהתאחדו', focus: 'הרכבה' },

    { id: 's011', he: 'יפה', en: 'beautiful',
      wrong: ['beatiful', 'beautifull', 'beutiful'],
      pattern: 'beau + ti + ful', note: 'הסיומת נכתבת ב-l אחת', focus: 'סיומות' },

    { id: 's012', he: 'חבר', en: 'friend',
      wrong: ['freind', 'frend', 'friand'],
      pattern: 'fri + end', note: 'i לפני e', focus: 'סדר התנועות' },

    { id: 's013', he: 'מסעדה', en: 'restaurant',
      wrong: ['restaurent', 'resturant', 'restarant'],
      pattern: 'rest-au-rant', note: 'מילה שאולה מצרפתית, והסיומת היא ant', focus: 'מילה שאולה' },

    { id: 's014', he: 'עסק', en: 'business',
      wrong: ['buisness', 'bussiness', 'bisness'],
      pattern: 'busi + ness', note: 'נגזרת מ-busy, ולכן התנועה היא i', focus: 'מילת בסיס' },

    { id: 's015', he: 'מחר', en: 'tomorrow',
      wrong: ['tommorow', 'tomorow', 'tommorrow'],
      pattern: null, note: 'm אחת ואחריה שתי r', focus: 'עיצורים כפולים' },

    { id: 's016', he: 'כתובת', en: 'address',
      wrong: ['adress', 'addres', 'adres'],
      pattern: null, note: 'שתי d וגם שתי s', focus: 'עיצורים כפולים' },

    { id: 's017', he: 'שונה', en: 'different',
      wrong: ['diffrent', 'diferent', 'differrent'],
      pattern: 'dif-fer-ent', note: 'שתי f, ובאמצע תנועה שכמעט אינה נשמעת', focus: 'תנועה נבלעת' },

    { id: 's018', he: 'מעניין', en: 'interesting',
      wrong: ['intresting', 'interessting', 'intersting'],
      pattern: 'inter + esting', note: 'התנועה השנייה נבלעת בדיבור אך נכתבת', focus: 'תנועה נבלעת' },

    { id: 's019', he: 'לזכור', en: 'remember',
      wrong: ['remeber', 'rememer', 'remmember'],
      pattern: 're-mem-ber', note: 'שלוש הברות, בלי עיצורים כפולים', focus: 'פירוק להברות' },

    { id: 's020', he: 'סביבה', en: 'environment',
      wrong: ['enviroment', 'envirnoment', 'enviornment'],
      pattern: 'environ + ment', note: 'יש n באמצע שאינה נשמעת', focus: 'אות שאינה נשמעת' },

    { id: 's021', he: 'ממשלה', en: 'government',
      wrong: ['goverment', 'governement', 'govrnment'],
      pattern: 'govern + ment', note: 'יש n לפני הסיומת, אף שלא שומעים אותה', focus: 'אות שאינה נשמעת' },

    { id: 's022', he: 'עד (זמן)', en: 'until',
      wrong: ['untill', 'untl', 'antil'],
      pattern: null, note: 'l אחת בסוף, בשונה מ-till', focus: 'סיומות' },

    { id: 's023', he: 'כתיבה', en: 'writing',
      wrong: ['writting', 'writeing', 'wrighting'],
      pattern: 'write + ing', note: 'ה-e נופלת, וה-t אינה נכפלת', focus: 'נטיית הפועל' },

    { id: 's024', he: 'התחלה', en: 'beginning',
      wrong: ['begining', 'beginnning', 'begginning'],
      pattern: 'begin + ning', note: 'העיצור האחרון נכפל לפני הסיומת', focus: 'נטיית הפועל' },

    { id: 's025', he: 'מוצלח', en: 'successful',
      wrong: ['succesful', 'successfull', 'sucessful'],
      pattern: null, note: 'שתי c, שתי s, ובסוף l אחת', focus: 'עיצורים כפולים' },

    { id: 's026', he: 'להביך', en: 'embarrass',
      wrong: ['embarass', 'embaras', 'emberrass'],
      pattern: null, note: 'שתי r וגם שתי s', focus: 'עיצורים כפולים' },

    { id: 's027', he: 'להמליץ', en: 'recommend',
      wrong: ['recomend', 'reccomend', 'recommand'],
      pattern: null, note: 'c אחת ושתי m', focus: 'עיצורים כפולים' },

    { id: 's028', he: 'אירוע, מאורע', en: 'occasion',
      wrong: ['ocassion', 'occassion', 'ocasion'],
      pattern: null, note: 'שתי c ו-s אחת', focus: 'עיצורים כפולים' },

    { id: 's029', he: 'הזדמנות', en: 'opportunity',
      wrong: ['oportunity', 'oppurtunity', 'opportunety'],
      pattern: null, note: 'שתי p ו-r אחת', focus: 'עיצורים כפולים' },

    { id: 's030', he: 'עצמאי', en: 'independent',
      wrong: ['independant', 'indepedent', 'independet'],
      pattern: null, note: 'נחתמת ב-ent ולא ב-ant', focus: 'סיומות' },

    { id: 's031', he: 'ידע', en: 'knowledge',
      wrong: ['knowlege', 'knowledg', 'nowledge'],
      pattern: 'know + ledge', note: 'האות הראשונה אינה נשמעת', focus: 'אות שאינה נשמעת' },

    { id: 's032', he: 'שפה', en: 'language',
      wrong: ['langauge', 'languag', 'lanquage'],
      pattern: 'lan + guage', note: 'יש u אחרי ה-g', focus: 'סיומות' },

    { id: 's033', he: 'גובה', en: 'height',
      wrong: ['heigth', 'hight', 'heighth'],
      pattern: null, note: 'נחתמת ב-ght, כמו light', focus: 'אות שאינה נשמעת' },

    { id: 's034', he: 'מקצב', en: 'rhythm',
      wrong: ['rythm', 'rhythem', 'rytham'],
      pattern: 'rh + ythm', note: 'אין במילה אף תנועה, ואחרי האות הראשונה באה h', focus: 'מילה שאולה' },

    { id: 's035', he: 'פברואר', en: 'February',
      wrong: ['Febuary', 'Februrary', 'Febraury'],
      pattern: 'Feb-ru-ary', note: 'ההברה האמצעית נבלעת בדיבור', focus: 'אות שאינה נשמעת' },

    { id: 's036', he: 'יום רביעי', en: 'Wednesday',
      wrong: ['Wendsday', 'Wedensday', 'Wenesday'],
      pattern: 'Wed-nes-day', note: 'האות הרביעית אינה נשמעת', focus: 'אות שאינה נשמעת' },

    { id: 's037', he: 'לוח שנה', en: 'calendar',
      wrong: ['calender', 'calandar', 'callendar'],
      pattern: 'cal-en-dar', note: 'הסיומת היא ar ולא er', focus: 'סיומות' },

    { id: 's038', he: 'הפתעה', en: 'surprise',
      wrong: ['suprise', 'surprize', 'surprice'],
      pattern: 'sur + prise', note: 'יש r גם בהברה הראשונה', focus: 'אות נבלעת' },

    { id: 's039', he: 'ויכוח', en: 'argument',
      wrong: ['arguement', 'argumant', 'arguemnt'],
      pattern: 'argue + ment', note: 'ה-e נופלת לפני הסיומת', focus: 'סיומות' },

    { id: 's040', he: 'כנראה', en: 'probably',
      wrong: ['probaly', 'probebly', 'propably'],
      pattern: 'prob-ab-ly', note: 'ההברה האמצעית נבלעת בדיבור', focus: 'פירוק להברות' },

    { id: 's041', he: 'ספרייה', en: 'library',
      wrong: ['libary', 'librery', 'liberary'],
      pattern: 'lib-rar-y', note: 'שתי r', focus: 'פירוק להברות' },

    { id: 's042', he: 'ירק', en: 'vegetable',
      wrong: ['vegtable', 'vegatable', 'vegeteble'],
      pattern: 'veg-e-table', note: 'התנועה השנייה כמעט אינה נשמעת', focus: 'תנועה נבלעת' },

    { id: 's043', he: 'שוקולד', en: 'chocolate',
      wrong: ['choclate', 'chocolat', 'chocolet'],
      pattern: 'choc-o-late', note: 'התנועה האמצעית נכתבת אף שאינה נשמעת', focus: 'תנועה נבלעת' },

    { id: 's044', he: 'טמפרטורה', en: 'temperature',
      wrong: ['temperture', 'tempreture', 'temparature'],
      pattern: 'tem-per-a-ture', note: 'ארבע הברות, לא שלוש', focus: 'פירוק להברות' },

    { id: 's045', he: 'תור (שעומדים בו)', en: 'queue',
      wrong: ['que', 'queu', 'quee'],
      pattern: 'q + ue + ue', note: 'שתי התנועות חוזרות פעמיים', focus: 'מילה שאולה' },

    { id: 's046', he: 'מזג אוויר', en: 'weather',
      wrong: ['wether', 'weater', 'wheather'],
      pattern: 'weather / whether', note: 'השנייה פירושה ״האם״, ונכתבת אחרת', focus: 'הומופונים' },

    { id: 's047', he: 'דרך, בעד', en: 'through',
      wrong: ['throught', 'thru', 'trough'],
      pattern: null, note: 'ה-gh בסוף אינה נשמעת', focus: 'אות שאינה נשמעת' },

    { id: 's048', he: 'לשון', en: 'tongue',
      wrong: ['tounge', 'tung', 'tonge'],
      pattern: 'ton + gue', note: 'הסיומת אינה נכתבת כפי שהיא נשמעת', focus: 'סיומות' },

    { id: 's049', he: 'תרגיל, אימון', en: 'exercise',
      wrong: ['excercise', 'exersise', 'exercize'],
      pattern: null, note: 'אין c אחרי ה-ex, והסיומת היא ise', focus: 'סיומות' },

    { id: 's050', he: 'ציוד', en: 'equipment',
      wrong: ['equiptment', 'equipement', 'equippment'],
      pattern: 'equip + ment', note: 'שתי החטיבות מתחברות בלי אות נוספת', focus: 'סיומות' }
  ];

  root.SP = root.SP || {};
  root.SP.SPELLING = SPELLING;
  if (typeof module !== 'undefined' && module.exports) { module.exports = SPELLING; }
})(typeof window !== 'undefined' ? window : globalThis);
