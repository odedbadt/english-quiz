/* איות באנגלית: בשאלה מופיע ההגה של המילה באותיות עבריות, והאפשרויות
   הן איותים באנגלית.
   translit = ההגה באותיות עבריות עם ניקוד. זהו גוף השאלה: הוא מזהה את
             המילה ואת צליליה בלי לדרוש ידיעת תרגום, ובלי לחשוף את האיות —
             האות העברית אינה מבדילה בין c ל-s, אינה מסמנת עיצור כפול
             ואינה קובעת את אות התנועה. לכן יש לכתוב את ההגה הטבעי: היכן
             שתנועה או עיצור נבלעים בדיבור, הם נבלעים גם כאן.
   he      = המשמעות. מוצגת לצד השאלה כהקשר בלבד, ואינה הנשאלת.
   en      = האיות הנכון.
   wrong   = שלוש שגיאות כתיב נפוצות.
   pattern = פירוק המילה באותיות לטיניות בלבד. מוצג אחרי התשובה בשורה
             נפרדת משלו, משמאל לימין, כדי שלא יישבר בתוך משפט עברי.
   note    = הכלל בעברית. מוצג אחרי התשובה.
   focus   = שם הכלל, לסיווג הפריט. */
(function (root) {
  'use strict';

  var SPELLING = [
    { id: 's001', he: 'הכרחי', translit: 'נֶסֶסֶרִי', en: 'necessary',
      wrong: ['neccessary', 'necesary', 'necessery'],
      pattern: null, note: 'c אחת ואחריה שתי s', focus: 'עיצורים כפולים', section: 'adv-doubles' },

    { id: 's002', he: 'מקום לינה', translit: 'אָקוֹמוֹדֵיישֶׁן', en: 'accommodation',
      wrong: ['accomodation', 'acommodation', 'accommodaton'],
      pattern: 'cc + mm', note: 'שני זוגות של עיצורים כפולים', focus: 'עיצורים כפולים', section: 'adv-doubles' },

    { id: 's003', he: 'נפרד', translit: 'סֶפְּרֵייט', en: 'separate',
      wrong: ['seperate', 'saparate', 'seperete'],
      pattern: 'sep-a-rate', note: 'התנועה האמצעית נבלעת בדיבור, אך היא איננה e', focus: 'תנועה נבלעת', section: 'adv-swallowed' },

    { id: 's004', he: 'בהחלט', translit: 'דֶפִינֶטְלִי', en: 'definitely',
      wrong: ['definately', 'definatly', 'defenitely'],
      pattern: 'de-fi-nite-ly', note: 'אין במילה אף a', focus: 'תנועה נבלעת', section: 'adv-swallowed' },

    { id: 's005', he: 'לקבל', translit: 'רִיסִיב', en: 'receive',
      wrong: ['recieve', 'receve', 'receeve'],
      pattern: 'c + ei', note: 'הכלל ״i לפני e״ אינו חל אחרי c', focus: 'סדר התנועות', section: 'adv-vowel-order' },

    { id: 's006', he: 'להאמין', translit: 'בִּילִיב', en: 'believe',
      wrong: ['beleive', 'belive', 'beleve'],
      pattern: null, note: 'i לפני e', focus: 'סדר התנועות', section: 'adv-vowel-order' },

    { id: 's007', he: 'מוזר', translit: 'וִירְד', en: 'weird',
      wrong: ['wierd', 'werid', 'weared'],
      pattern: null, note: 'יוצאת דופן לכלל — כאן e לפני i', focus: 'סדר התנועות', section: 'adv-vowel-order' },

    { id: 's008', he: 'להשיג', translit: 'אָצִ\'יב', en: 'achieve',
      wrong: ['acheive', 'achive', 'acheeve'],
      pattern: null, note: 'i לפני e', focus: 'סדר התנועות', section: 'adv-vowel-order' },

    { id: 's009', he: 'זר, לא מקומי', translit: 'פוֹרִין', en: 'foreign',
      wrong: ['foriegn', 'foregin', 'forein'],
      pattern: null, note: 'יוצאת דופן — e לפני i, והמילה נחתמת ב-gn', focus: 'סדר התנועות', section: 'adv-vowel-order' },

    { id: 's010', he: 'מפני ש', translit: 'בִּיקוֹז', en: 'because',
      wrong: ['becuase', 'becouse', 'becaus'],
      pattern: 'be + cause', note: 'שתי מילים שהתאחדו', focus: 'הרכבה', section: 'adv-forms' },

    { id: 's011', he: 'יפה', translit: 'בְּיוּטִיפוּל', en: 'beautiful',
      wrong: ['beatiful', 'beautifull', 'beutiful'],
      pattern: 'beau + ti + ful', note: 'הסיומת נכתבת ב-l אחת', focus: 'סיומות', section: 'adv-endings' },

    { id: 's012', he: 'חבר', translit: 'פְרֶנְד', en: 'friend',
      wrong: ['freind', 'frend', 'friand'],
      pattern: 'fri + end', note: 'i לפני e', focus: 'סדר התנועות', section: 'adv-vowel-order' },

    { id: 's013', he: 'מסעדה', translit: 'רֶסְטְרוֹנְט', en: 'restaurant',
      wrong: ['restaurent', 'resturant', 'restarant'],
      pattern: 'rest-au-rant', note: 'מילה שאולה מצרפתית, והסיומת היא ant', focus: 'מילה שאולה', section: 'adv-forms' },

    { id: 's014', he: 'עסק', translit: 'בִּיזְנֶס', en: 'business',
      wrong: ['buisness', 'bussiness', 'bisness'],
      pattern: 'busi + ness', note: 'נגזרת מ-busy, ולכן התנועה היא i', focus: 'מילת בסיס', section: 'adv-forms' },

    { id: 's015', he: 'מחר', translit: 'טוּמוֹרוֹ', en: 'tomorrow',
      wrong: ['tommorow', 'tomorow', 'tommorrow'],
      pattern: null, note: 'm אחת ואחריה שתי r', focus: 'עיצורים כפולים', section: 'adv-doubles' },

    { id: 's016', he: 'כתובת', translit: 'אַדְרֶס', en: 'address',
      wrong: ['adress', 'addres', 'adres'],
      pattern: null, note: 'שתי d וגם שתי s', focus: 'עיצורים כפולים', section: 'adv-doubles' },

    { id: 's017', he: 'שונה', translit: 'דִיפְרֶנְט', en: 'different',
      wrong: ['diffrent', 'diferent', 'differrent'],
      pattern: 'dif-fer-ent', note: 'שתי f, ובאמצע תנועה שכמעט אינה נשמעת', focus: 'תנועה נבלעת', section: 'adv-swallowed' },

    { id: 's018', he: 'מעניין', translit: 'אִינְטְרֶסְטִינְג', en: 'interesting',
      wrong: ['intresting', 'interessting', 'intersting'],
      pattern: 'inter + esting', note: 'התנועה השנייה נבלעת בדיבור אך נכתבת', focus: 'תנועה נבלעת', section: 'adv-swallowed' },

    { id: 's019', he: 'לזכור', translit: 'רִימֶמְבֶּר', en: 'remember',
      wrong: ['remeber', 'rememer', 'remmember'],
      pattern: 're-mem-ber', note: 'שלוש הברות, בלי עיצורים כפולים', focus: 'פירוק להברות', section: 'adv-swallowed' },

    { id: 's020', he: 'סביבה', translit: 'אִינְוַיירֶמֶנְט', en: 'environment',
      wrong: ['enviroment', 'envirnoment', 'enviornment'],
      pattern: 'environ + ment', note: 'יש n באמצע שאינה נשמעת', focus: 'אות שאינה נשמעת', section: 'adv-silent' },

    { id: 's021', he: 'ממשלה', translit: 'גָאבֶרְמֶנְט', en: 'government',
      wrong: ['goverment', 'governement', 'govrnment'],
      pattern: 'govern + ment', note: 'יש n לפני הסיומת, אף שלא שומעים אותה', focus: 'אות שאינה נשמעת', section: 'adv-silent' },

    { id: 's022', he: 'עד (זמן)', translit: 'אַנְטִיל', en: 'until',
      wrong: ['untill', 'untl', 'antil'],
      pattern: null, note: 'l אחת בסוף, בשונה מ-till', focus: 'סיומות', section: 'adv-endings' },

    { id: 's023', he: 'כתיבה', translit: 'רַייטִינְג', en: 'writing',
      wrong: ['writting', 'writeing', 'wrighting'],
      pattern: 'write + ing', note: 'ה-e נופלת, וה-t אינה נכפלת', focus: 'נטיית הפועל', section: 'adv-forms' },

    { id: 's024', he: 'התחלה', translit: 'בִּיגִינִינְג', en: 'beginning',
      wrong: ['begining', 'beginnning', 'begginning'],
      pattern: 'begin + ning', note: 'העיצור האחרון נכפל לפני הסיומת', focus: 'נטיית הפועל', section: 'adv-forms' },

    { id: 's025', he: 'מוצלח', translit: 'סָקְסֶסְפוּל', en: 'successful',
      wrong: ['succesful', 'successfull', 'sucessful'],
      pattern: null, note: 'שתי c, שתי s, ובסוף l אחת', focus: 'עיצורים כפולים', section: 'adv-doubles' },

    { id: 's026', he: 'להביך', translit: 'אִימְבַּרֶס', en: 'embarrass',
      wrong: ['embarass', 'embaras', 'emberrass'],
      pattern: null, note: 'שתי r וגם שתי s', focus: 'עיצורים כפולים', section: 'adv-doubles' },

    { id: 's027', he: 'להמליץ', translit: 'רֶקוֹמֶנְד', en: 'recommend',
      wrong: ['recomend', 'reccomend', 'recommand'],
      pattern: null, note: 'c אחת ושתי m', focus: 'עיצורים כפולים', section: 'adv-doubles' },

    { id: 's028', he: 'אירוע, מאורע', translit: 'אָקֵייז\'ֶן', en: 'occasion',
      wrong: ['ocassion', 'occassion', 'ocasion'],
      pattern: null, note: 'שתי c ו-s אחת', focus: 'עיצורים כפולים', section: 'adv-doubles' },

    { id: 's029', he: 'הזדמנות', translit: 'אוֹפּוֹרְטְיוּנִיטִי', en: 'opportunity',
      wrong: ['oportunity', 'oppurtunity', 'opportunety'],
      pattern: null, note: 'שתי p ו-r אחת', focus: 'עיצורים כפולים', section: 'adv-doubles' },

    { id: 's030', he: 'עצמאי', translit: 'אִינְדִיפֶּנְדֶנְט', en: 'independent',
      wrong: ['independant', 'indepedent', 'independet'],
      pattern: null, note: 'נחתמת ב-ent ולא ב-ant', focus: 'סיומות', section: 'adv-endings' },

    { id: 's031', he: 'ידע', translit: 'נוֹלִיג\'', en: 'knowledge',
      wrong: ['knowlege', 'knowledg', 'nowledge'],
      pattern: 'know + ledge', note: 'האות הראשונה אינה נשמעת', focus: 'אות שאינה נשמעת', section: 'adv-silent' },

    { id: 's032', he: 'שפה', translit: 'לַנְגְוִויג\'', en: 'language',
      wrong: ['langauge', 'languag', 'lanquage'],
      pattern: 'lan + guage', note: 'יש u אחרי ה-g', focus: 'סיומות', section: 'adv-endings' },

    { id: 's033', he: 'גובה', translit: 'הַייט', en: 'height',
      wrong: ['heigth', 'hight', 'heighth'],
      pattern: null, note: 'נחתמת ב-ght, כמו light', focus: 'אות שאינה נשמעת', section: 'adv-silent' },

    { id: 's034', he: 'מקצב', translit: 'רִיד\'ֶם', en: 'rhythm',
      wrong: ['rythm', 'rhythem', 'rytham'],
      pattern: 'rh + ythm', note: 'אין במילה אף תנועה, ואחרי האות הראשונה באה h', focus: 'מילה שאולה', section: 'adv-forms' },

    { id: 's035', he: 'פברואר', translit: 'פֶבְּרוּאֶרִי', en: 'February',
      wrong: ['Febuary', 'Februrary', 'Febraury'],
      pattern: 'Feb-ru-ary', note: 'ההברה האמצעית נבלעת בדיבור', focus: 'אות שאינה נשמעת', section: 'adv-silent' },

    { id: 's036', he: 'יום רביעי', translit: 'וֶנְזְדֵיי', en: 'Wednesday',
      wrong: ['Wendsday', 'Wedensday', 'Wenesday'],
      pattern: 'Wed-nes-day', note: 'האות הרביעית אינה נשמעת', focus: 'אות שאינה נשמעת', section: 'adv-silent' },

    { id: 's037', he: 'לוח שנה', translit: 'קַלֶנְדֶר', en: 'calendar',
      wrong: ['calender', 'calandar', 'callendar'],
      pattern: 'cal-en-dar', note: 'הסיומת היא ar ולא er', focus: 'סיומות', section: 'adv-endings' },

    { id: 's038', he: 'הפתעה', translit: 'סָפְּרַייז', en: 'surprise',
      wrong: ['suprise', 'surprize', 'surprice'],
      pattern: 'sur + prise', note: 'יש r גם בהברה הראשונה', focus: 'אות נבלעת', section: 'adv-swallowed' },

    { id: 's039', he: 'ויכוח', translit: 'אַרְגְיוּמֶנְט', en: 'argument',
      wrong: ['arguement', 'argumant', 'arguemnt'],
      pattern: 'argue + ment', note: 'ה-e נופלת לפני הסיומת', focus: 'סיומות', section: 'adv-endings' },

    { id: 's040', he: 'כנראה', translit: 'פְּרוֹבְּלִי', en: 'probably',
      wrong: ['probaly', 'probebly', 'propably'],
      pattern: 'prob-ab-ly', note: 'ההברה האמצעית נבלעת בדיבור', focus: 'פירוק להברות', section: 'adv-swallowed' },

    { id: 's041', he: 'ספרייה', translit: 'לַייבְּרֶרִי', en: 'library',
      wrong: ['libary', 'librery', 'liberary'],
      pattern: 'lib-rar-y', note: 'שתי r', focus: 'פירוק להברות', section: 'adv-swallowed' },

    { id: 's042', he: 'ירק', translit: 'וֶג\'טֶבְּל', en: 'vegetable',
      wrong: ['vegtable', 'vegatable', 'vegeteble'],
      pattern: 'veg-e-table', note: 'התנועה השנייה כמעט אינה נשמעת', focus: 'תנועה נבלעת', section: 'adv-swallowed' },

    { id: 's043', he: 'שוקולד', translit: 'צ\'וֹקְלֶט', en: 'chocolate',
      wrong: ['choclate', 'chocolat', 'chocolet'],
      pattern: 'choc-o-late', note: 'התנועה האמצעית נכתבת אף שאינה נשמעת', focus: 'תנועה נבלעת', section: 'adv-swallowed' },

    { id: 's044', he: 'טמפרטורה', translit: 'טֶמְפְּרֶצ\'ֶר', en: 'temperature',
      wrong: ['temperture', 'tempreture', 'temparature'],
      pattern: 'tem-per-a-ture', note: 'ארבע הברות, לא שלוש', focus: 'פירוק להברות', section: 'adv-swallowed' },

    { id: 's045', he: 'תור (שעומדים בו)', translit: 'קְיוּ', en: 'queue',
      wrong: ['que', 'queu', 'quee'],
      pattern: 'q + ue + ue', note: 'שתי התנועות חוזרות פעמיים', focus: 'מילה שאולה', section: 'adv-forms' },

    { id: 's046', he: 'מזג אוויר', translit: 'וֶד\'ֶר', en: 'weather',
      wrong: ['wether', 'weater', 'wheather'],
      pattern: 'weather / whether', note: 'השנייה פירושה ״האם״, ונכתבת אחרת', focus: 'הומופונים', section: 'adv-forms' },

    { id: 's047', he: 'דרך, בעד', translit: 'ת\'רוּ', en: 'through',
      wrong: ['throught', 'thru', 'trough'],
      pattern: null, note: 'ה-gh בסוף אינה נשמעת', focus: 'אות שאינה נשמעת', section: 'adv-silent' },

    { id: 's048', he: 'לשון', translit: 'טַאנְג', en: 'tongue',
      wrong: ['tounge', 'tung', 'tonge'],
      pattern: 'ton + gue', note: 'הסיומת אינה נכתבת כפי שהיא נשמעת', focus: 'סיומות', section: 'adv-endings' },

    { id: 's049', he: 'תרגיל, אימון', translit: 'אֶקְסֶרְסַייז', en: 'exercise',
      wrong: ['excercise', 'exersise', 'exercize'],
      pattern: null, note: 'אין c אחרי ה-ex, והסיומת היא ise', focus: 'סיומות', section: 'adv-endings' },

    { id: 's050', he: 'ציוד', translit: 'אִיקְוִויפְּמֶנְט', en: 'equipment',
      wrong: ['equiptment', 'equipement', 'equippment'],
      pattern: 'equip + ment', note: 'שתי החטיבות מתחברות בלי אות נוספת', focus: 'סיומות', section: 'adv-endings' },

    /* ---------- המסלול המתחיל: פרקי צליל ואיות בסיסיים ---------- */
    // --- תנועות ארוכות ---
    { id: 'b001', he: 'ירח', translit: 'מוּן', en: 'moon',
      wrong: ['mun', 'moun', 'moone'],
      pattern: 'oo', note: 'הצליל הארוך נכתב בשתי o', focus: 'תנועה ארוכה', section: 'oo-ee' },

    { id: 'b002', he: 'אוכל', translit: 'פוּד', en: 'food',
      wrong: ['fud', 'fude', 'foud'],
      pattern: 'oo', note: 'הצליל הארוך נכתב בשתי o', focus: 'תנועה ארוכה', section: 'oo-ee' },

    { id: 'b003', he: 'בקרוב', translit: 'סוּן', en: 'soon',
      wrong: ['sun', 'sune', 'soun'],
      pattern: 'oo', note: 'בשתי o; עם אחת בלבד זו מילה אחרת לגמרי', focus: 'תנועה ארוכה', section: 'oo-ee' },

    { id: 'b004', he: 'חדר', translit: 'רוּם', en: 'room',
      wrong: ['rum', 'roum', 'roome'],
      pattern: 'oo', note: 'הצליל הארוך נכתב בשתי o', focus: 'תנועה ארוכה', section: 'oo-ee' },

    { id: 'b005', he: 'לראות', translit: 'סִי', en: 'see',
      wrong: ['se', 'sii', 'sie'],
      pattern: 'ee', note: 'הצליל הארוך נכתב בשתי e', focus: 'תנועה ארוכה', section: 'oo-ee' },

    { id: 'b006', he: 'עץ', translit: 'טְרִי', en: 'tree',
      wrong: ['tre', 'trii', 'trea'],
      pattern: 'ee', note: 'הצליל הארוך נכתב בשתי e', focus: 'תנועה ארוכה', section: 'oo-ee' },

    { id: 'b007', he: 'ירוק', translit: 'גְרִין', en: 'green',
      wrong: ['gren', 'griin', 'grean'],
      pattern: 'ee', note: 'הצליל הארוך נכתב בשתי e', focus: 'תנועה ארוכה', section: 'oo-ee' },

    { id: 'b008', he: 'לישון', translit: 'סְלִיפּ', en: 'sleep',
      wrong: ['slep', 'sliip', 'sleap'],
      pattern: 'ee', note: 'הצליל הארוך נכתב בשתי e', focus: 'תנועה ארוכה', section: 'oo-ee' },

    // --- האות האילמת שמאריכה ---
    { id: 'b009', he: 'עוגה', translit: 'קֵייק', en: 'cake',
      wrong: ['cak', 'caik', 'cayk'],
      pattern: 'cak + e', note: 'ה-e בסוף אינה נשמעת, אך היא מאריכה את התנועה שלפניה', focus: 'e מאריכה', section: 'magic-e' },

    { id: 'b010', he: 'שם', translit: 'נֵיים', en: 'name',
      wrong: ['nam', 'naim', 'naym'],
      pattern: 'nam + e', note: 'ה-e בסוף שותקת ומאריכה את התנועה', focus: 'e מאריכה', section: 'magic-e' },

    { id: 'b011', he: 'משחק', translit: 'גֵיים', en: 'game',
      wrong: ['gam', 'gaim', 'gaym'],
      pattern: 'gam + e', note: 'ה-e בסוף שותקת ומאריכה את התנועה', focus: 'e מאריכה', section: 'magic-e' },

    { id: 'b012', he: 'מאוחר', translit: 'לֵייט', en: 'late',
      wrong: ['lat', 'lait', 'layt'],
      pattern: 'lat + e', note: 'ה-e בסוף שותקת ומאריכה את התנועה', focus: 'e מאריכה', section: 'magic-e' },

    { id: 'b013', he: 'אופניים', translit: 'בַּייק', en: 'bike',
      wrong: ['bik', 'byke', 'baik'],
      pattern: 'bik + e', note: 'ה-e בסוף שותקת ומאריכה את התנועה', focus: 'e מאריכה', section: 'magic-e' },

    { id: 'b014', he: 'זמן', translit: 'טַיים', en: 'time',
      wrong: ['tim', 'tiem', 'taim'],
      pattern: 'tim + e', note: 'ה-e בסוף שותקת ומאריכה את התנועה', focus: 'e מאריכה', section: 'magic-e' },

    { id: 'b015', he: 'תשע', translit: 'נַיין', en: 'nine',
      wrong: ['nin', 'nien', 'nain'],
      pattern: 'nin + e', note: 'ה-e בסוף שותקת ומאריכה את התנועה', focus: 'e מאריכה', section: 'magic-e' },

    { id: 'b016', he: 'לרכוב', translit: 'רַייד', en: 'ride',
      wrong: ['rid', 'ried', 'raid'],
      pattern: 'rid + e', note: 'ה-e בסוף שותקת; בלעדיה זו מילה אחרת', focus: 'e מאריכה', section: 'magic-e' },

    // --- c רכה ---
    { id: 'b017', he: 'פנים', translit: 'פֵייס', en: 'face',
      wrong: ['fase', 'faice', 'fece'],
      pattern: 'fac + e', note: 'לפני e האות c נשמעת s', focus: 'c רכה', section: 'soft-c' },

    { id: 'b018', he: 'מרוץ', translit: 'רֵייס', en: 'race',
      wrong: ['rase', 'raice', 'rece'],
      pattern: 'rac + e', note: 'לפני e האות c נשמעת s', focus: 'c רכה', section: 'soft-c' },

    { id: 'b019', he: 'מקום', translit: 'פְּלֵייס', en: 'place',
      wrong: ['plase', 'plaice', 'plece'],
      pattern: 'plac + e', note: 'לפני e האות c נשמעת s', focus: 'c רכה', section: 'soft-c' },

    { id: 'b020', he: 'קרח', translit: 'אַייס', en: 'ice',
      wrong: ['ise', 'ais', 'aice'],
      pattern: 'ic + e', note: 'לפני e האות c נשמעת s', focus: 'c רכה', section: 'soft-c' },

    { id: 'b021', he: 'אורז', translit: 'רַייס', en: 'rice',
      wrong: ['rise', 'raice', 'ryce'],
      pattern: 'ric + e', note: 'לפני e האות c נשמעת s', focus: 'c רכה', section: 'soft-c' },

    { id: 'b022', he: 'נחמד', translit: 'נַייס', en: 'nice',
      wrong: ['nise', 'naice', 'nyce'],
      pattern: 'nic + e', note: 'לפני e האות c נשמעת s', focus: 'c רכה', section: 'soft-c' },

    { id: 'b023', he: 'עיר', translit: 'סִיטִי', en: 'city',
      wrong: ['sity', 'citi', 'sitty'],
      pattern: null, note: 'גם לפני i האות c נשמעת s', focus: 'c רכה', section: 'soft-c' },

    { id: 'b024', he: 'עיפרון', translit: 'פֶּנְסִיל', en: 'pencil',
      wrong: ['pensil', 'pencill', 'pencel'],
      pattern: 'pen + cil', note: 'גם לפני i האות c נשמעת s', focus: 'c רכה', section: 'soft-c' },

    // --- צמדי תנועות ---
    { id: 'b025', he: 'ים', translit: 'סִי', en: 'sea',
      wrong: ['see', 'sae', 'seea'],
      pattern: 'ea', note: 'הצליל זהה, והמשמעות היא שמכריעה בין הצמדים', focus: 'צמד תנועות', section: 'ea-ie' },

    { id: 'b026', he: 'תה', translit: 'טִי', en: 'tea',
      wrong: ['tee', 'tae', 'teea'],
      pattern: 'ea', note: 'הצמד כאן הוא תנועה אחת', focus: 'צמד תנועות', section: 'ea-ie' },

    { id: 'b027', he: 'בשר', translit: 'מִיט', en: 'meat',
      wrong: ['meet', 'met', 'meit'],
      pattern: 'ea', note: 'הצליל זהה, והמשמעות היא שמכריעה בין הצמדים', focus: 'צמד תנועות', section: 'ea-ie' },

    { id: 'b028', he: 'נקי', translit: 'קְלִין', en: 'clean',
      wrong: ['clen', 'cleen', 'clien'],
      pattern: 'ea', note: 'הצמד כאן הוא תנועה אחת', focus: 'צמד תנועות', section: 'ea-ie' },

    { id: 'b029', he: 'שדה', translit: 'פִילְד', en: 'field',
      wrong: ['feild', 'filed', 'feeld'],
      pattern: 'ie', note: 'i לפני e', focus: 'צמד תנועות', section: 'ea-ie' },

    { id: 'b030', he: 'חתיכה', translit: 'פִּיס', en: 'piece',
      wrong: ['peice', 'pice', 'peece'],
      pattern: 'ie', note: 'i לפני e', focus: 'צמד תנועות', section: 'ea-ie' },

    { id: 'b031', he: 'מנהל', translit: 'צִ\'יף', en: 'chief',
      wrong: ['cheif', 'chef', 'chiefe'],
      pattern: 'ie', note: 'i לפני e', focus: 'צמד תנועות', section: 'ea-ie' },

    { id: 'b032', he: 'גנב', translit: 'ת\'יף', en: 'thief',
      wrong: ['theif', 'thif', 'theef'],
      pattern: 'ie', note: 'i לפני e', focus: 'צמד תנועות', section: 'ea-ie' },

    // --- צמדי עיצורים ---
    { id: 'b033', he: 'לחשוב', translit: 'ת\'ִינְק', en: 'think',
      wrong: ['tink', 'thinck', 'fink'],
      pattern: 'th', note: 'שתי אותיות שיחד הן צליל אחד', focus: 'צמד עיצורים', section: 'digraphs' },

    { id: 'b034', he: 'שלוש', translit: 'ת\'רִי', en: 'three',
      wrong: ['tree', 'thre', 'free'],
      pattern: 'th', note: 'שתי אותיות שיחד הן צליל אחד', focus: 'צמד עיצורים', section: 'digraphs' },

    { id: 'b035', he: 'אמא', translit: 'מָאד\'ֶר', en: 'mother',
      wrong: ['muther', 'modher', 'mathor'],
      pattern: 'th', note: 'שתי אותיות שיחד הן צליל אחד', focus: 'צמד עיצורים', section: 'digraphs' },

    { id: 'b036', he: 'כיסא', translit: 'צֶ\'ר', en: 'chair',
      wrong: ['cher', 'chare', 'shair'],
      pattern: 'ch', note: 'שתי אותיות שיחד הן צליל אחד', focus: 'צמד עיצורים', section: 'digraphs' },

    { id: 'b037', he: 'גבינה', translit: 'צִ\'יז', en: 'cheese',
      wrong: ['chese', 'cheeze', 'sheese'],
      pattern: 'ch', note: 'שתי אותיות שיחד הן צליל אחד', focus: 'צמד עיצורים', section: 'digraphs' },

    { id: 'b038', he: 'מורה', translit: 'טִיצ\'ֶר', en: 'teacher',
      wrong: ['teecher', 'teachar', 'teatcher'],
      pattern: 'ch', note: 'שתי אותיות שיחד הן צליל אחד', focus: 'צמד עיצורים', section: 'digraphs' },

    { id: 'b039', he: 'ספינה', translit: 'שִׁיפּ', en: 'ship',
      wrong: ['shipp', 'sip', 'chip'],
      pattern: 'sh', note: 'שתי אותיות שיחד הן צליל אחד', focus: 'צמד עיצורים', section: 'digraphs' },

    { id: 'b040', he: 'דג', translit: 'פִישׁ', en: 'fish',
      wrong: ['fich', 'fishe', 'phish'],
      pattern: 'sh', note: 'שתי אותיות שיחד הן צליל אחד', focus: 'צמד עיצורים', section: 'digraphs' },

    // --- k שותקת ---
    { id: 'b041', he: 'לדעת', translit: 'נוֹ', en: 'know',
      wrong: ['no', 'now', 'knoe'],
      pattern: 'kn + ow', note: 'האות הראשונה נכתבת ואינה נשמעת', focus: 'k שותקת', section: 'silent-k' },

    { id: 'b042', he: 'ברך', translit: 'נִי', en: 'knee',
      wrong: ['nee', 'kne', 'knie'],
      pattern: 'kn + ee', note: 'האות הראשונה נכתבת ואינה נשמעת', focus: 'k שותקת', section: 'silent-k' },

    { id: 'b043', he: 'סכין', translit: 'נַייף', en: 'knife',
      wrong: ['nife', 'knive', 'knyfe'],
      pattern: 'kn + ife', note: 'האות הראשונה נכתבת ואינה נשמעת', focus: 'k שותקת', section: 'silent-k' },

    { id: 'b044', he: 'לדפוק', translit: 'נוֹק', en: 'knock',
      wrong: ['nock', 'knok', 'knoc'],
      pattern: 'kn + ock', note: 'האות הראשונה נכתבת ואינה נשמעת', focus: 'k שותקת', section: 'silent-k' },

    { id: 'b045', he: 'קשר', translit: 'נוֹט', en: 'knot',
      wrong: ['not', 'knott', 'nott'],
      pattern: 'kn + ot', note: 'האות הראשונה נכתבת ואינה נשמעת', focus: 'k שותקת', section: 'silent-k' },

    { id: 'b046', he: 'אביר', translit: 'נַייט', en: 'knight',
      wrong: ['night', 'nite', 'knite'],
      pattern: 'kn + ight', note: 'האות הראשונה נכתבת ואינה נשמעת; המשמעות מכריעה', focus: 'k שותקת', section: 'silent-k' },

    { id: 'b047', he: 'ידע', translit: 'נְיוּ', en: 'knew',
      wrong: ['new', 'nuw', 'knue'],
      pattern: 'kn + ew', note: 'האות הראשונה נכתבת ואינה נשמעת; המשמעות מכריעה', focus: 'k שותקת', section: 'silent-k' },

    { id: 'b048', he: 'ידית', translit: 'נוֹבּ', en: 'knob',
      wrong: ['nob', 'knobb', 'nobb'],
      pattern: 'kn + ob', note: 'האות הראשונה נכתבת ואינה נשמעת', focus: 'k שותקת', section: 'silent-k' },

    // --- gh שותקת ---
    { id: 'b049', he: 'לילה', translit: 'נַייט', en: 'night',
      wrong: ['nite', 'nigt', 'nighte'],
      pattern: 'ni + ght', note: 'הצמד נכתב ואינו נשמע', focus: 'gh שותקת', section: 'silent-gh' },

    { id: 'b050', he: 'אור', translit: 'לַייט', en: 'light',
      wrong: ['lite', 'ligt', 'lighte'],
      pattern: 'li + ght', note: 'הצמד נכתב ואינו נשמע', focus: 'gh שותקת', section: 'silent-gh' },

    { id: 'b051', he: 'נכון', translit: 'רַייט', en: 'right',
      wrong: ['rite', 'rigt', 'righte'],
      pattern: 'ri + ght', note: 'הצמד נכתב ואינו נשמע', focus: 'gh שותקת', section: 'silent-gh' },

    { id: 'b052', he: 'מחשבה', translit: 'ת\'וֹט', en: 'thought',
      wrong: ['thaught', 'thout', 'thoght'],
      pattern: 'thou + ght', note: 'הצמד נכתב ואינו נשמע', focus: 'gh שותקת', section: 'silent-gh' },

    { id: 'b053', he: 'קנה', translit: 'בּוֹט', en: 'bought',
      wrong: ['boght', 'baught', 'bout'],
      pattern: 'bou + ght', note: 'הצמד נכתב ואינו נשמע', focus: 'gh שותקת', section: 'silent-gh' },

    { id: 'b054', he: 'שמונה', translit: 'אֵייט', en: 'eight',
      wrong: ['eigt', 'aight', 'eighte'],
      pattern: 'ei + ght', note: 'הצמד נכתב ואינו נשמע', focus: 'gh שותקת', section: 'silent-gh' },

    { id: 'b055', he: 'גבוה', translit: 'הַיי', en: 'high',
      wrong: ['hy', 'hight', 'higt'],
      pattern: 'hi + gh', note: 'הצמד נכתב ואינו נשמע', focus: 'gh שותקת', section: 'silent-gh' },

    { id: 'b056', he: 'בת', translit: 'דוֹטֶר', en: 'daughter',
      wrong: ['doughter', 'daugter', 'dauther'],
      pattern: 'dau + ghter', note: 'הצמד נכתב ואינו נשמע', focus: 'gh שותקת', section: 'silent-gh' },

    // --- בחירה בין אותיות דומות ---
    { id: 'b057', he: 'חתול', translit: 'קַט', en: 'cat',
      wrong: ['kat', 'catt', 'cate'],
      pattern: null, note: 'לפני a נכתב הצליל ב-c', focus: 'בחירת האות', section: 'c-s-k' },

    { id: 'b058', he: 'כוס', translit: 'קָאפּ', en: 'cup',
      wrong: ['kup', 'cupp', 'kap'],
      pattern: null, note: 'לפני u נכתב הצליל ב-c', focus: 'בחירת האות', section: 'c-s-k' },

    { id: 'b059', he: 'לבוא', translit: 'קָאם', en: 'come',
      wrong: ['kome', 'cume', 'comme'],
      pattern: 'com + e', note: 'לפני o נכתב הצליל ב-c', focus: 'בחירת האות', section: 'c-s-k' },

    { id: 'b060', he: 'ילד', translit: 'קִיד', en: 'kid',
      wrong: ['cid', 'kidd', 'kyd'],
      pattern: null, note: 'לפני i נכתב הצליל ב-k', focus: 'בחירת האות', section: 'c-s-k' },

    { id: 'b061', he: 'מפתח', translit: 'קִי', en: 'key',
      wrong: ['cey', 'kee', 'ki'],
      pattern: null, note: 'לפני e נכתב הצליל ב-k', focus: 'בחירת האות', section: 'c-s-k' },

    { id: 'b062', he: 'מטבח', translit: 'קִיצ\'ֶן', en: 'kitchen',
      wrong: ['citchen', 'kichen', 'kitchin'],
      pattern: 'kit + chen', note: 'לפני i נכתב הצליל ב-k', focus: 'בחירת האות', section: 'c-s-k' },

    { id: 'b063', he: 'לרקוד', translit: 'דַנְס', en: 'dance',
      wrong: ['danse', 'dans', 'dence'],
      pattern: 'dan + ce', note: 'הצליל הזה נכתב כאן ב-c', focus: 'בחירת האות', section: 'c-s-k' },

    { id: 'b064', he: 'מאז', translit: 'סִינְס', en: 'since',
      wrong: ['sinse', 'sence', 'sinc'],
      pattern: 'sin + ce', note: 'בראש המילה הצליל נכתב ב-s, ובסופה ב-c', focus: 'בחירת האות', section: 'c-s-k' },
  ];

  root.SP = root.SP || {};
  root.SP.SPELLING = SPELLING;
  if (typeof module !== 'undefined' && module.exports) { module.exports = SPELLING; }
})(typeof window !== 'undefined' ? window : globalThis);
