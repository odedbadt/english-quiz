# Handoff

State of the project as of 2026-10-06, for whoever (or whatever) picks it up next.

## Where things stand

Everything asked for is built, deployed, and verified in a real browser.

* Repo: `odedbadt/english-quiz` (public), local clone at `~/work/spelling`.
* Live: **https://odedbadt.github.io/english-quiz/** — GitHub Pages, `main` / root,
  enabled via the API (no workflow file, so no `workflow` token scope needed).
  Every push republishes; a build takes under a minute.
* Working tree is clean and pushed. Three commits: initial, the quiz, the PWA.
* `node tests/run-tests.js` (or `npm test`) — 44 checks, all passing.
* A `python3 -m http.server 8777` is still running in the background from this
  session (PID was 81885). Kill it when convenient; it only serves local dev.

## What it is

A dependency-free static quiz that helps Hebrew speakers learn **English**
vocabulary and **English** spelling. Three multiple-choice question types, each
toggleable in the footer:

| type | prompt | options |
| --- | --- | --- |
| `vocab-he-en` | `המילה ”קלף“ באנגלית` | English words |
| `vocab-en-he` | `המילה ”card“ בעברית` | Hebrew words |
| `spelling` | `איך כותבים את המילה ”נֶסֶסֶרִי“` | four English spellings |

75 vocabulary pairs and 114 spelling items → 264 cards (each vocabulary direction
is its own card). The material is gated into sections: 8 for vocabulary (the
semantic groups) and 14 for spelling (8 beginner phonics sections, then 6 from
the advanced bank). Each track advances independently.

## Decisions worth not relitigating

These came out of review during the session; changing them would undo the point.

1. **The target language is English, not Hebrew.** The spelling half drills
   English orthography (`necessary`, `Wednesday`, `accommodation`), with the
   prompt in Hebrew. An earlier draft drilled Hebrew spelling and was wrong.
2. **No hints before answering.** The question is the prompt and the four
   options, nothing else. The rule (`note`) and the breakdown (`pattern`) appear
   only in the feedback, after the answer. A pre-answer hint gives the answer away.
   The meaning shown on a spelling card is not a hint — see 6.
3. **Latin text never sits inside a Hebrew sentence as a multi-token run.**
   Bidi reorders it — `Wed-nes-day` rendered as `day-nes-Wed`. English
   breakdowns live in the `pattern` field and render on their own LTR line;
   Hebrew notes may reference single letters only. Two tests in
   `tests/run-tests.js` enforce this — keep them.
4. **Vocabulary distractors come from the same semantic `group`**, so the answer
   can't be guessed from the shape of the options.
5. **The icon is a lowercase Georgia `a`** on the app teal `#0f766e`, generated
   with PIL from `/System/Library/Fonts/Supplemental/Georgia.ttf`.
6. **A spelling card asks for the sound, not the meaning.** The prompt is the
   word's pronunciation in Hebrew letters (`translit`); the Hebrew meaning sits
   beside it as context only. The first version asked
   `תאיית את המילה ”הכרחי“`, which tested translation and spelling together — a
   pupil who did not know `necessary` failed for a vocabulary reason, which is
   what the two `vocab-*` types are already for. Hebrew script works here because
   it cannot distinguish `c` from `s`, cannot mark a doubled consonant and cannot
   fix a vowel letter, so it identifies the word without leaking its spelling.
   Transliterate natural speech, not the spelling: swallowed and silent letters
   are absent from the sound (`knowledge` → `נוֹלִיג'`) because that is the point
   of the item. Three tests in `tests/run-tests.js` enforce this — keep them.
7. **A transliteration opening on a soft `ב`/`כ`/`פ` carries a pronunciation
   note.** Hebrew reads a leading בכ״פ as a plosive by habit and ignores the
   dagesh, so `פְרֶנְד` is read *prend*. `softLeadNote()` in `js/questions.js`
   derives the note from the transliteration — no per-item field — and it
   demonstrates with Hebrew example words only, since naming the English letter
   would leak the spelling. Keep the dagesh accurate in the data: it is what
   decides whether the note appears.
8. **Sections are a gate, not a label.** Only unlocked sections enter the draw.
   A section opens the next when 80% of its cards reach mastery 3, counted over
   the question types currently switched on — otherwise a pupil who turns off a
   direction waits forever for a section that cannot complete. Unlocking is
   one-way on purpose. Cleared sections keep ~25% of the draw, picked in two
   stages (bucket first, then card) so the ratio does not drift as sections
   accumulate. `ADVANCE_MASTERY` (3) is deliberately below the scheduler's
   `MASTERED_AT` (4): one is a reachable gate, the other is the badge on screen.


## The adaptive scheduler

`js/scheduler.js`, also runnable under Node (that's how it's tested).

Each card carries a mastery level `m`: correct `+1` (max 6), wrong `−2` (min 0),
draw weight `∝ 0.5^m`. So six correct answers make a card ~64× rarer than a fresh
one, and one mistake undoes two correct answers. A weight floor (`0.004`) keeps
mastered cards resurfacing instead of retiring, and a cooldown of
`min(6, pool/4)` questions suppresses whatever was just asked. New cards get a
1.4× boost; cards with a wrong history get up to 1.6×.

State (mastery, totals, enabled types) is JSON in `localStorage` under
`spelling-quiz-v1`, via `exportState()`. Per-device, no accounts.

## Files

```
index.html            RTL markup, icon/manifest links, SW registration
manifest.webmanifest  name, colors, 192/512/maskable icons
sw.js                 offline cache: serve from cache, refresh in background
icons/                favicons 16/32, apple-touch 180, 192/512, 512 maskable
css/style.css         light/dark, RTL-aware
js/data-vocab.js      75 pairs, grouped for distractors
js/sections.js        ordered sections per track (the curriculum)
js/data-spelling.js   114 items: he, translit, en, wrong[3], pattern, note, focus, section
js/scheduler.js       weighted picker, mastery, persistence
js/curriculum.js      section gate, advancement, review mix
js/questions.js       card building, prompts, pronunciation notes, shuffling
js/app.js             DOM, feedback, keyboard, localStorage
tests/run-tests.js    data integrity + scheduler behaviour + bidi guards
```

## Gotchas

* `sw.js` is stale-while-revalidate, so a deploy lands on the **second** load.
  Hard-refresh twice when checking a change on the live site.
* Service workers need HTTPS or `localhost`; from `file://` the page still works,
  it just won't install or cache.
* iOS caches `apple-touch-icon` aggressively — remove and re-add the home-screen
  entry to pick up a new icon.
* The Google Fonts `<link>` is the only external dependency. Self-host it if the
  app must be fully offline on first run.

## Possible next steps

Nothing is blocked; these are ideas, in rough order of value.

* More material — append to the data files; `id` must be unique, `wrong` must
  hold exactly three distinct misspellings, `translit` is required, and
  `section` must name a declared section. The tests check all of them.
* A session summary screen (today's score, which items regressed).
* Audio for the English word (Web Speech API, no backend needed).
* Cross-device progress, or a parent/teacher view of several pupils — this is
  the only item that needs a backend. `exportState()` already returns a plain
  serializable object, so syncing it is a small change plus an identity story.
