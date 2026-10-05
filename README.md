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
| `spelling` | `תאיית את המילה ”הכרחי“` | `necessary` / `neccessary` / `necesary` / `necessery` |

Vocabulary distractors are drawn from the same semantic group (animals, verbs,
clothing…), so the answer cannot be guessed from the shape of the options.
Spelling distractors are hand-written misspellings — doubled consonants, `ie/ei`,
silent letters, swallowed vowels. The question itself gives nothing away; the
item's Hebrew `note` and the rule it drills (`focus`) are shown only after the
answer, as the explanation.

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
js/data-spelling.js   50 English spelling items with hints
js/scheduler.js       weighted picker, mastery, persistence (also runs in Node)
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
{ id: 's051', he: 'ציוד', en: 'equipment',
  wrong: ['equiptment', 'equipement', 'equippment'],
  note: 'equip + ment, בלי אותיות נוספות', focus: 'סיומות' }
```

`id` must be unique; `wrong` must hold exactly three distinct misspellings.
`node tests/run-tests.js` checks both.
