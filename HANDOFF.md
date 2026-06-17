# Nerd Alert! — Project Handoff

A browser RPG based on the user's cartoon **"Nerd Alert!"** (the cast works an office IT
help desk). Started ~2022 as a reskin of the **"Pizza Legends"** vanilla-JS tutorial; this
session modernized it, re-themed it off "pizza", and built out Episode 1's systems.

This doc is the cold-start guide. Companion notes live in the auto-memory at
`~/.claude/projects/-Users-benhughes-Documents-Claude-VideoGame-NerdAlert-Game/memory/`
(`project-overview.md`, `stack-gotchas.md`).

---

## Run it

```bash
npm install        # first time
npm run dev        # dev server at http://localhost:5173  (Vite + HMR)
npm run build      # verify the production bundle compiles (catches bad imports/syntax)
```

- **Stack:** Vite + ES modules, vanilla JS, HTML canvas. No framework.
- **Git:** work is on branch **`master`** (not `main`). Commit per change; messages end with the Co-Authored-By trailer.
- **Resolution:** 4:3 retro, **264×198** canvas scaled 3× via CSS (`styles/global.css`).

---

## Layout / key files

- `index.html` → `src/main.js` — entry. Imports all CSS, shows the **TitleScreen**, and boots the game on "Start".
- **Core loop / world:**
  - `src/Overworld.js` — game loop (update → draw lower → sprites (depth-sorted) → draw upper), camera focus, input binding, the episode intro, FPS meter.
  - `src/OverworldMap.js` — **all 5 maps as data** (gameObjects, walls, cutsceneSpaces, cutsceneOnLoad). The big file. `getRelevantScenario` does story-flag gating.
  - `src/OverworldEvent.js` — the **cutscene event dispatcher** (one method per event type).
  - `src/GameObject.js` / `src/Person.js` / `src/Sprite.js` — entities, grid movement, behavior loops.
  - `src/DirectionInput.js` / `src/KeyPressListener.js` — input.
- **UI:** `TitleScreen.js`, `Hud.js`, `TextMessage.js` + `RevealingText.js`, `KeyboardMenu.js`, `PauseMenu.js`, `TitleCard.js`, `Letterbox.js`, `SceneTransition.js`, `FpsMeter.js`.
- **Battle (`src/Battle/`):** `Battle.js`, `TurnCycle.js`, `Combatant.js`, `SubmissionMenu.js`, `Team.js`, `BattleEvent.js`, `BattleAnimations.js`, and **`ticketBattle.js`** (the v1 help-desk "brain"). `ReplacementMenu.js` is legacy/unused.
- **Content/state:** `src/Content/{characters,enemies,actions}.js`, `src/State/PlayerState.js`.
- **Assets:** `public/images/...` (served at `/images/...`), `styles/*.css` (imported from `main.js`). Note **two image dirs**: JS uses `images/...` (from `public/`); CSS `url(...)` uses `styles/images/...`.

---

## Cutscene system (the vocabulary you build scenes with)

Cutscenes are arrays of event objects run in order by `OverworldMap.startCutscene(events)`.
Event types (each is a method on `OverworldEvent`):

| Event | Purpose |
|---|---|
| `{type:"textMessage", text, faceHero?}` | Dialogue box (typewriter). `{CASTER}/{TARGET}/{ACTION}` tokens in battle. |
| `{type:"walk", who, direction, retry?}` | Move a character one tile. |
| `{type:"stand", who, direction, time?}` | Face a direction / pause `time` ms. **No `time` = immediate** (face & continue). |
| `{type:"changeMap", map}` | Scene-transition to another map. |
| `{type:"battle", enemyId}` | Start a battle vs an `Enemies` entry. |
| `{type:"pause"}` | Open the pause menu. |
| `{type:"addStoryFlag", flag}` | Set `playerState.storyFlags[flag] = true`. |
| `{type:"addToParty", characterId}` | Recruit a character into the party. |
| `{type:"titleCard", title, subtitle?, duration?}` | TV-episode title card; skippable with Enter. |
| `{type:"letterbox", on}` | Cinematic bars in/out. Persists on `overworld.letterbox`. Bars are 36px (cover the HUD). |
| `{type:"cameraPan", x, y, time}` | Smoothly pan the camera to a world tile (leaves characters in place). |
| `{type:"cameraFollow", who}` | Reattach the camera to an object (e.g. `"hero"`). |
| `{type:"parallel", events:[seqA, seqB, ...]}` | Run several **sequences** concurrently (e.g. characters walking together). Each `seq` is its own event array. |

**Map-data ways to trigger cutscenes:**
- `cutsceneSpaces[asGridCoord(x,y)] = [ scenario, ... ]` — fires when the hero **steps on** the tile. Each scenario `{required?:[flags], disqualify?:[flags], events}`. `getRelevantScenario` picks the first scenario whose `required` are all set and `disqualify` none set. **Fire-once recipe:** end events with `addStoryFlag` + give the scenario `disqualify:[that flag]`.
- `cutsceneOnLoad: [events]` — map config field; fires the instant the map mounts (no keypress). Used by the Elevator scene.
- NPC `talking: [scenario, ...]` — same gating, fired by pressing Enter facing the NPC.
- NPC `behaviorLoop: [events]` + `behaviorLoopRepeat` (default true) — idle/scripted autonomous movement, runs outside cutscenes (player can move). `false` = play once then stop.

---

## Battle system (v1 — the "ticket" model)

Battles = "a coworker files an IT ticket, you try to fix it." Lives mostly in
`src/Battle/ticketBattle.js` (all tunable constants at the top).

- On battle start, `Battle` rolls a random **ticket** (`monitor/webcam/laptop/mouse/printer/password`).
- Player has **4 moves** (Brett's `actions` in `characters.js`): **Smack it** (universal ~50%), **Check the cords** (monitor/laptop/printer), **Replace batteries** (mouse), **Ask** (calms the customer / fixes passwords).
- Wrong tool or failed roll → themed miss + a **counter** chance that drains Brett's **patience** (his HP).
- **Win = land a fix** (zeroes the customer). **Lose = patience hits 0.** Player-only `TurnCycle`; no enemy turns, no items, no XP in v1.
- **Creatures dropped** — `.Character` sprite is `display:none`, so each side shows its person sprite (`.Battle_hero`/`.Battle_enemy`, cropped from the overworld sheet) + an HP HUD.
- **Mock battle:** talk to `helpDeskCustomer` in BackLotHallway (near the start) to trigger one.

**Battle gotcha:** a fighter's `.Character`/battle sprite shows the *full* image, so it needs a small single-frame portrait (like `brett001.png`, ~27×21). The 128×128 overworld people sheets render as a frame grid. Current customer/Kenny/Toshi battle sprites reuse `brett001.png` as placeholders.

---

## Story / content state

**Episode 1 plot** (user's, partially built): Brett meets Kenny → meet Toshi → introduce
Toshi to **Darius** (planned to be the **shop**) → go to HR for Toshi's badge.

**Maps & flow:** `BackLotHallway` (start, postman blocks the exit) → `HallwayCredits` (title
on the wall) → `Lobby` (security guard sign-in) → `Elevator` (Kenny scene, `cutsceneOnLoad`)
→ `SeventhFloor` (the **Act I climax** — see below). **Act I ends** when the gang returns to
the desks; that's where the **help desk + ticket battles** will live.

**Act I climax** (SeventhFloor, the `(16,16)` cutscene trigger behind Kenny): walk together
to the office → camera pans to reveal Bridget/Toshi → "I KNEW it" reveal → pan back →
Bridget+Toshi cross over and the introduction plays → Kenny & Brett turn to face each other →
Toshi joins the party → all three walk back to the desks. **All its positions / camera
centers / walk counts are best-guess placeholders the user tunes by playtest.**

**Party:** starts as Brett only. Kenny joins at the end of the Elevator scene; Toshi joins at
the Act I climax. Pause menu offers "Swap for X". (`PlayerState.party`, `addToParty`.)

**Title menu:** Start / Continue / Episodes / Settings / Quit. Continue + Episodes 2–5 are
**forward-wired** to a `localStorage` save (`nerdAlertSave` with `episodesUnlocked`) that
doesn't exist yet, so they auto-enable once a save system writes to it. Quit shows a
sign-off (a browser page can't truly stop the dev server / close a user-opened tab).

---

## Gotchas (also in stack-gotchas.md memory)

- **Shell is zsh:** unquoted `$VAR` from `$(find …)` does NOT word-split. For batch edits use `find … -exec perl -i -pe '…' {} +`.
- **Vite build only checks imports, not runtime globals.** A symbol used without an `import` passes the build but throws at runtime — audit per-file.
- **Headless preview throttles `requestAnimationFrame` and clamps `setTimeout`** (it's a backgrounded tab). So you can't watch movement/camera/walks or trust timing there — verify via build + import audit + DOM/event probes + screenshots of static frames. (This caused a long false-alarm "slowdown" that was actually the user's **laptop battery-saver** throttling — confirmed with the FPS meter.)
- **Dynamic `import('/src/x.js')` in `preview_eval` can get a *different* module instance** than the running app (Vite stamps `?v=` on internal imports), so a singleton like `playerState` won't match. Test pure logic, or reload first.
- **NPC behavior loops** were a real slowdown source — fixed in `GameObject.doBehaviorEvent`: loop stands default to a 1000ms hold (no `setTimeout(0)` spin), `behaviorLoopActive` blocks duplicate loops, and a loop bails when `map.overworld.map !== map` (stops loops on maps you've left). `Overworld.startGameLoop` guards `gameLoopRunning` so it can't double-run.
- **Sprite filename casing:** macOS is case-insensitive; keep code matching real files (e.g. `Toshi.png`) so it survives case-sensitive hosting.
- **Dev FPS meter:** hidden by default; press **`` ` ``** (backtick) to toggle. `src/FpsMeter.js`.

---

## Open TODOs / next steps

- **Next beat (planned):** turn the desks into the working **help desk** — NPCs walk up and
  trigger ticket battles; the "collect things and fight things" loop.
- **Tune the Act I climax** positions/camera/walk counts in playtest (SeventhFloor `(16,16)` cutscene).
- **Battle polish:** real small battle portraits per character; IT-themed move flavor in `actions.js`; decide what the `CharacterTypes` taxonomy means (still cooking words); per-character movesets (Brett/Kenny/Toshi); future items (USB cables, RAM) thrown at tickets; consider fully dropping the trainer/creature redundancy.
- **Save system** → lights up Continue + Episodes 2–5 automatically (already wired to read `localStorage`).
- **Episodes 2–5** content.
- **In-code `// TODO: theme` markers:** `characters.js` (placeholder roster/art/types), `actions.js` (move flavor), `enemies.js` (Postman's fighter is `f001` placeholder — was a nonexistent `f002` that would've crashed).

---

## Verification habits that worked

Build (`npm run build`) → per-file import audit → instantiate components / read data in the
browser via `preview_eval` → screenshot static frames → check `preview_console_logs` for
errors. Don't trust live motion/timing in the headless preview; the user playtests movement,
camera, and battles in their own browser.
