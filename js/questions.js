/* בניית הקלפים (כל כיוון שאלה הוא קלף נפרד, עם דרגת שליטה משל עצמו)
   ובניית השאלה עצמה — נוסח, מסיחים וערבוב התשובות. */
(function (root) {
  'use strict';

  var TYPES = {
    VOCAB_HE_EN: 'vocab-he-en',
    VOCAB_EN_HE: 'vocab-en-he',
    SPELLING: 'spelling'
  };

  function buildCards(vocab, spelling) {
    var cards = [];
    vocab.forEach(function (item) {
      cards.push({ id: item.id + ':he-en', type: TYPES.VOCAB_HE_EN, item: item });
      cards.push({ id: item.id + ':en-he', type: TYPES.VOCAB_EN_HE, item: item });
    });
    spelling.forEach(function (item) {
      cards.push({ id: item.id + ':spell', type: TYPES.SPELLING, item: item });
    });
    return cards;
  }

  function shuffle(arr, random) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* מסיחים לשאלת אוצר מילים: מילים מאותה קבוצה סמנטית, ואם אין די — מכל המאגר. */
  function pickVocabDistractors(item, vocab, field, random, count) {
    var same = vocab.filter(function (o) { return o.group === item.group && o.id !== item.id; });
    var rest = vocab.filter(function (o) { return o.group !== item.group; });
    var out = [], seen = {};
    seen[item[field]] = true;
    [shuffle(same, random), shuffle(rest, random)].forEach(function (bucket) {
      bucket.forEach(function (o) {
        if (out.length >= count || seen[o[field]]) { return; }
        seen[o[field]] = true;
        out.push(o[field]);
      });
    });
    return out;
  }

  function makeQuestion(card, ctx) {
    var random = (ctx && ctx.random) || Math.random;
    var vocab = (ctx && ctx.vocab) || [];
    var item = card.item;
    var q = { id: card.id, type: card.type, note: '', hint: '' };
    var answer, choices;

    if (card.type === TYPES.VOCAB_HE_EN) {
      answer = item.en;
      q.promptHead = 'המילה';
      q.promptWord = item.he;
      q.promptWordLang = 'he';
      q.promptTail = 'באנגלית';
      q.hint = item.note || '';
      q.optionDir = 'ltr';
      q.optionLang = 'en';
      choices = pickVocabDistractors(item, vocab, 'en', random, 3).concat([answer]);
    } else if (card.type === TYPES.VOCAB_EN_HE) {
      answer = item.he;
      q.promptHead = 'המילה';
      q.promptWord = item.en;
      q.promptWordLang = 'en';
      q.promptTail = 'בעברית';
      q.hint = item.note || '';
      q.optionDir = 'rtl';
      q.optionLang = 'he';
      choices = pickVocabDistractors(item, vocab, 'he', random, 3).concat([answer]);
    } else {
      answer = item.en;
      q.promptHead = 'תאיית את המילה';
      q.promptWord = item.he;
      q.promptWordLang = 'he';
      q.promptTail = '';
      q.note = item.note || '';
      q.optionDir = 'ltr';
      q.optionLang = 'en';
      q.focus = item.focus || '';
      choices = item.wrong.slice(0, 3).concat([answer]);
    }

    q.item = item;
    q.answer = answer;
    q.prompt = [q.promptHead, '”' + q.promptWord + '“', q.promptTail]
      .filter(function (p) { return p; }).join(' ');
    q.options = shuffle(choices, random).map(function (text) {
      return { text: text, correct: text === answer };
    });
    return q;
  }

  root.SP = root.SP || {};
  root.SP.TYPES = TYPES;
  root.SP.buildCards = buildCards;
  root.SP.makeQuestion = makeQuestion;
  root.SP.shuffle = shuffle;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TYPES: TYPES, buildCards: buildCards, makeQuestion: makeQuestion, shuffle: shuffle };
  }
})(typeof window !== 'undefined' ? window : globalThis);
