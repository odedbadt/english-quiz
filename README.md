# אנגלית: אוצר מילים ואיות

A self-contained multiple-choice quiz that helps Hebrew speakers learn **English
vocabulary** and **English spelling**, with a question mix that adapts to the pupil.

No build step, no dependencies: open `index.html` in a browser, or serve the folder.

```sh
python3 -m http.server 8777   # then open http://localhost:8777
node tests/run-tests.js       # data + scheduler tests
```

## Question types

Every question is multiple choice with four options, and each type can be toggled
on or off in the footer.

| Type | Prompt | Options |
| --- | --- | --- |
| `vocab-he-en` | `המילה ”קלף“ באנגלית` | `card` / `plate` / `wallet` / `iron` |
| `vocab-en-he` | `המילה ”card“ בעברית` | `קלף` / `מזלג` / `עיתון` / `מגבת` |
| `spelling` | `איך כותבים את המילה ”נֶסֶסֶרִי“` (במשמעות: הכרחי) | `necessary` / `neccessary` / `necesary` / `necessery` |

## Sections

The material is a curriculum, not a flat pool. Each track advances on its own:

| track | sections | ordering |
| --- | --- | --- |
| `vocab` | 18 | the semantic groups, split into 4-5 word chunks |
| `spelling` | 14 | 8 beginner phonics sections, then 6 from the advanced bank |

The spelling track starts on sound-and-letter basics — long `oo`/`ee`, the silent
`e` that lengthens, soft `c`, the `ea`/`ie` pairs, `th`/`ch`/`sh`, silent `k`,
silent `gh`, and choosing between `c`, `s` and `k` — and only then reaches the
advanced bank (doubled consonants, endings, swallowed vowels, silent letters).

**Advancing.** A section opens the next one when 80% of its cards reach a mastery
that depends on how the pupil is doing in that section: **one** correct answer per
card at 90% accuracy or better, **two** otherwise. The ladder may only ever lower
the bar, never raise it — raising it was measured and it punishes exactly the
pupil who is already struggling (a wrong answer costs two mastery levels, so
above the default the requirement becomes practically unreachable). Coverage is counted only over question types that are currently switched on,
so a pupil who turns off a direction is not stranded in a section that can never
complete. Unlocking is one-way: a later slip does not re-lock a section, or a
single wrong answer would throw the pupil backwards mid-chapter.

Sections are kept to a similar size on purpose. The first version grouped
vocabulary by whole semantic group, which made `חפצים בבית` 32 cards against
8 for every spelling section — and because the scheduler draws roughly in
proportion to pool size, most questions came from that one oversized section
while the spelling track crawled. Simulated against the real modules, the first
level-up took **over 200 questions**; a section that never ends also pins the
draw to the same handful of cards, so *stuck* and *repetitive* were one bug, not
two. Even sections plus the lower mastery bar bring that to **under 50**, and
the number of distinct cards seen over a session goes up rather than down.

**Review.** A cleared section keeps coming back, at about a quarter of the draw.
The pick is two-stage — first the bucket (current section vs. everything cleared),
then the scheduler picks within it — so the ratio stays fixed as sections pile up
instead of review slowly swamping the current chapter.

**Measuring it.** `npm run measure` runs an agent over the real modules and
reports the two numbers that decide whether practice is boring: a repetition
score (100 for the same question twice in a row, falling off with the gap) and
the questions it costs to clear a level. A perfect agent currently scores **0**
repetition and **11.6 questions per level**. Run it before touching a scheduler
or curriculum constant.

Section membership is data, not logic: a spelling item carries `section`, a
vocabulary item reuses its `group`. `js/sections.js` holds the order and the
display names; `js/curriculum.js` holds the gate.

Vocabulary distractors are drawn from the same semantic group (animals, verbs,
clothing…), so the answer cannot be guessed from the shape of the options.
Spelling distractors are hand-written misspellings — doubled consonants, `ie/ei`,
silent letters, swallowed vowels.

A spelling question asks for the word by its **sound, written in Hebrew letters**
(`translit`), not by its meaning. Asking for the meaning would test translation
and spelling at once, and a pupil who did not know the word would fail for a
reason that has nothing to do with orthography — vocabulary is what the other two
types are for. The Hebrew meaning is still shown beside the question, as context
rather than as the thing being asked.

Hebrew script is the right vehicle for this because of what it cannot express: it
does not distinguish `c` from `s`, does not mark a doubled consonant, and does not
fix which letter carries a vowel. `נֶסֶסֶרִי` therefore identifies the word and its
sounds while leaving `necessary` / `neccessary` / `necesary` / `necessery` equally
open. For the same reason the transliteration follows natural speech: where a
vowel or a letter is swallowed (`chocolate` → `צ'וֹקְלֶט`) or silent
(`knowledge` → `נוֹלִיג'`), it is absent from the sound too — that is precisely
what the item drills.

One wrinkle the transliteration has to work around: a Hebrew reader pronounces a
leading `ב`/`כ`/`פ` as a plosive out of habit — `B`, `K`, `P` — and skims past the
dagesh that would say otherwise. English makes no such promise, so `פְרֶנְד`
(`friend`) gets read as *prend* and `פוֹרִין` (`foreign`) as *porin*. When a
transliteration opens on one of those letters without a dagesh, the question
carries a short pronunciation note — `הפ׳ כאן רפה — כמו ב״טלפון״, לא כמו ב״פיל״`.
It demonstrates in Hebrew only: naming the English letter would give the spelling
away. Three items need it today (`foreign`, `friend`, `February`); the note is
derived from the transliteration, so new items get it automatically.

The question itself gives nothing away; the item's Hebrew `note` and the rule it
drills (`focus`) are shown only after the answer, as the explanation.

## The adaptive part

Each card — and each *direction* of a vocabulary word is its own card — carries a
mastery level `m`:

* a correct answer raises `m` by one (up to 6);
* a wrong answer drops it by two;
* the chance of being drawn is proportional to `0.5^m`.

So a word answered correctly six times in a row is roughly **64× less likely** to
come back than a fresh one, a single mistake undoes two correct answers, and
nothing is ever retired completely — a floor on the weight keeps mastered items
resurfacing occasionally. A short cooldown suppresses the cards asked in the last
few questions, so the same item does not repeat back to back.

Progress (mastery levels, totals, enabled question types) is saved to
`localStorage` under `spelling-quiz-v1` and restored on the next visit.
"איפוס התקדמות" clears it.

Answer with the mouse or with <kbd>1</kbd>–<kbd>4</kbd>; <kbd>Enter</kbd> moves on.

## Installing it as an app

`manifest.webmanifest` + `sw.js` make it installable: "Add to Home Screen" on
iOS/Android gives a standalone window with the Georgia `a` icon, and the service
worker caches the shell so it runs with no network. Icons are generated from
`/System/Library/Fonts/Supplemental/Georgia.ttf` — see the icon sizes in
`icons/`; regenerate them if the artwork changes.

Service workers need HTTPS (GitHub Pages provides it) or `localhost`.

## Layout

```
index.html            RTL markup and the controls
manifest.webmanifest  app name, colors, icons
sw.js                 offline cache (serve from cache, refresh in background)
icons/                favicons + 180/192/512 app icons, incl. a maskable one
css/style.css         light/dark theme, RTL-aware spacing
js/data-vocab.js      75 Hebrew↔English words, grouped for distractors
js/sections.js        the curriculum: ordered sections per track
js/data-spelling.js   114 English spelling items: sound, meaning, rule, section
js/scheduler.js       weighted picker, mastery, persistence
js/curriculum.js      section gate, advancement, review mix (also runs in Node)
js/questions.js       card building, prompts, option shuffling
js/app.js             DOM wiring, feedback, keyboard, localStorage
tests/run-tests.js    data integrity + scheduler behaviour
```

## Adding material

Append to `js/data-vocab.js`:

```js
{ id: 'v076', he: 'מטוס', en: 'airplane', group: 'object' }
```

or to `js/data-spelling.js`:

```js
{ id: 's051', he: 'ציוד', translit: 'אִיקְוִויפְּמֶנְט', en: 'equipment',
  wrong: ['equiptment', 'equipement', 'equippment'],
  note: 'equip + ment, בלי אותיות נוספות', focus: 'סיומות',
  section: 'adv-endings' }
```

`id` must be unique; `wrong` must hold exactly three distinct misspellings; and
`translit` is required, Hebrew-only, and must not simply repeat `he`; and
`section` must name a section that `js/sections.js` actually declares.
`node tests/run-tests.js` checks all of these.
