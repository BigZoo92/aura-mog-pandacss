# AURA BATTLE — Technical Showcase

> An absurd idea, engineered seriously: Tung Tung Tung Sahur in a panda onesie dances 12 internet dances, defeats a Tailwind caricature, sits on it and smokes a JNR whose smoke spells out why this project uses Panda CSS. Every pixel of every frame is HTML + CSS, and the whole thing is a seekable, speed-controllable player.

This document explains how it works, what it does well, where it falls short, and what was actually measured.

---

## 1. Why Panda CSS for this project

The hard part of the project isn't any single animation; it's **organizing hundreds of them**. The project has:
- a 47-joint character rig;
- ~110 movement tracks (107 reach the production CSS);
- 58 moves;
- 18 chapters;
- an effects vocabulary;
- a smoke system with a hundred-odd timed elements.

Panda gives this project three things it uses heavily:

- **A build-time config that is real TypeScript.** `panda.config.ts` *runs code*: it compiles the choreography (typed key poses + inverse kinematics) into static `@keyframes` and a slot recipe. The browser never sees the poses, the IK or the track library; it gets plain CSS.
- **Typed design-system primitives.** Tokens, semantic tokens, layer styles (`wood`, `fleeceWhite`…), conditions (`_gigaForm`, `_beastReveal`), recipes (`arcadeButton`) and slot recipes (`hudPlate`, `rigMotion`), all with generated TypeScript types. `rigMotion({ move: 'twerkyMain' })` is type-checked against the actual list of moves.
- **Static extraction + source transforms.** With `transform: true`, static `css()` / `cva()` / `sva()` calls become plain class strings at build time.

None of this is impossible with Tailwind (or plain CSS, or vanilla-extract). It is the combination this codebase leans on. **No controlled Panda-vs-Tailwind comparison was performed** (see §10).

## 2. The CSS character rig

`src/character/` — Tung Tung is ~200 DOM elements: borders, gradients, `border-radius`, `clip-path` and pseudo-elements. There is no SVG, canvas or image.

- **A joint is a zero-size element sitting on its pivot** (`Bone.tsx`, `transform-origin: 0 0`). Its artwork hangs off it, and child joints are nested inside it, so rotating the shoulder carries the elbow, wrist and hand along.
- **Each joint owns one transform, split into independent properties.** Joints animate `rotate`, `translate`, `scale`, `opacity` and `z-index` as separate CSS properties (`channels.ts`). Two tracks can drive the same joint if they touch different properties. The compiler **rejects** two tracks writing the same joint property (`motion-recipe.ts`).
- **Everything is in `em`.** One `font-size` on the stage (container-query units) scales the whole character.
- **Geometry has a single source** (`geometry.ts`). The same numbers feed the CSS (as `rig.*` tokens) and the build-time IK.
- **Front, profile and back are real artwork.**
  - A registered custom property, `--facing` (`@property`, inherited), steps 0 → 0.5 → 1.
  - Each surface computes its own visibility in CSS, e.g. `clamp(0, (0.25 - var(--facing)) * 1000, 1)`.
  - The back of the hood, the "PANDA CSS" back print, the strapped bat and the pom-pom tail only exist on the back surface. The profile view has its own nose-out face.
  - `--look` lets the face peek over the shoulder while the body faces away.
- **Joints added for V2:**
  - `hips` (the onesie bottom), `cheekL`/`cheekR`, `tail`: these are what make the twerk a twerk.
  - `hoodEarL`/`hoodEarR`: costume follow-through.
  - `propR`/`propGlow`: the JNR and its LED.

The `hips` stacking is orientation-dependent. They tuck under the onesie top from the front, but sit over the lower back when he faces away.

## 3. How joint animations compose

A **track** (`motion/track.ts`) is one movement primitive over a region of the body, authored as a handful of key poses. For example:

```ts
twerkPelvis: {
  summary: 'Pelvis pops up and drops back down; knees extend and flex with it (leg IK).',
  duration: 500,
  frames: {
    0:   { ...pelvisAt({ y: SQUAT }), ease: 'snap' },
    38:  { ...pelvisAt({ y: SQUAT - POP }), ease: 'in' },
    100: pelvisAt({ y: SQUAT }),
  },
}
```

- `legs()` and `arm()` (`motion/ik.ts`) are **build-time two-bone IK**. Poses are authored as "palm here" or "feet planted there", and the helpers produce joint angles.
- **Rotations are unwrapped** so consecutive keyframes never differ by more than 180°. Interpolation always takes the shortest path, so a hand crossing the chin doesn't swing round via the hip.
- A track compiles into **one `@keyframes` per joint it touches**, named `<track>_<joint>`, e.g. `twerkPelvis_shinL`.
- A **move** (`motion/move.ts`) composes tracks with their own cycle lengths, plus static pose data (orientation, face, hand poses, prop):

```ts
twerkyMain: {
  tracks: ['twerkPelvis', 'twerkTorso', 'twerkHips', 'twerkCheeks', 'twerkHead', 'sixSevenTwerk', 'tailWag', 'hoodEarsBounce'],
  orientation: 'back',
  hands: { L: 'palmUp', R: 'palmUp' },
}
```

The 67 runs at 600 ms against the 500 ms pelvis and 250 ms hips, and that offset is deliberate. A test (`tests/twerky.test.ts`) asserts:
- pelvis, torso, hips, cheeks and arms are driven by **different** tracks;
- the whole body (`body`, `world`) is **not** animated in the twerk;
- the torso counter-moves (it sinks back by 70–100% of the pelvis rise).

## 4. The typed choreography

`src/choreography/` — each dance has a folder:
- `*.tracks.ts`: keyframe data, used by the Panda config only;
- `*.moves.ts`: bundled, small;
- `*.chapter.ts`: segments, plus timeline events such as aura, captions, camera, effects, slow motion, Giga Chad flashes, boss damage and projectiles.

`choreography.config.ts` only sequences the chapters. Every identifier is a union type: `MoveId`, `TrackName`, `ChapterId`, `CameraShot`, `EffectKind`, `BossPhase`… A typo in a chapter file fails `tsc`.

Adding a dance means a folder, plus one line in each registry, plus one line in the show array. Nothing else changes.

## 5. Static extraction

The motion recipe's variants are chosen at runtime (the current segment's move), so the extractor can't see them. `staticCss: { recipes: { rigMotion: ['*'] } }` generates them all. That is 58 moves × up to 47 slots, but only the slots each move actually animates.

`optimize.removeUnusedKeyframes: true` is enabled, and verified two ways:
- `scripts/verify-css.mjs` parses the production stylesheet. **999 `@keyframes`, 999 referenced names, 0 missing.**
- `tests/production-css.test.ts` checks every keyframe listed in the compiled motion manifest, plus every smoke keyframe, against `dist/`.

`removeUnusedTokens` is **not** enabled. Tokens are referenced from runtime CSS custom properties (`--tone`, `--spread`…) and from the `token()` function inside strings, and that wasn't worth the risk.

Panda's extractor resolves local constants and template literals inside `css()` (used in `Face.tsx`). It cannot evaluate method calls such as `.replace()`, so smoke gradients are written as literal strings.

## 6. Playback, seeking and speed

There is **one logical clock**: `PlayerStore.time`, framework-free and fully unit-tested.

- **Scene derivation.** `sceneAt(timeline, t)` derives everything visible: chapter, segment, form, active windowed events, camera. React re-renders the stage only when `scene.key` changes. Aura, combo and boss health are pure functions of `t` (`scoring.ts`), so seeking backwards un-earns aura exactly.
- **Driving CSS animations.** The bridge to them is `AnimationSync` (`animation-sync.ts`, ~100 lines). It uses the Web Animations API only as a **controller** and never generates keyframes.
  - Every animated subtree declares its time origin with `data-t0`: a segment start, an effect, a caption, or the smoke origin.
  - After each scene commit (in a layout effect, before paint) it collects the subtree's animations and sets `currentTime = showTime − t0` and `playbackRate = userRate × cinematicRate`.
  - Between discontinuities the animations run natively; a 2 Hz drift check corrects anything more than 40 ms off.
  - It calls `play()` before setting `currentTime` (a finished animation rewinds on `play()`; a unit test covers this).
- **Cinematic slow motion** multiplies the user's speed instead of replacing it. Frames that straddle a window boundary are integrated exactly; the test checks that slicing time differently gives the same result to 1e-6.
- **Hidden tabs suspend playback.** Reduced motion holds every animation at a still key pose.

**Verified in Chrome** (`scripts/verify-playback.mjs`, 9/9 checks passed):
- pausing mid-exhale freezes all 114 smoke animations and the character, and they don't move afterwards;
- every smoke animation shares the same `currentTime`;
- 0.25× propagates to every smoke and character animation;
- seeking into the reveal shows the right argument, and seeking back 10 s hides it again.

## 7. Reuse instead of duplication

Primitives written once and reused:
- **Parametric 67** (`six-seven.tracks.ts`): front, fast, behind-the-back, while twerking, wide, and on the ghost arms.
- **`mirrorTrack()`**: Floss, Disco, West Side and Scuba "switch sides" without re-authoring.
- **`hold()`**: freeze frames with an optional tremble.
- **Costume follow-through** (`costume.tracks.ts`): hood ears and tail, reused by the twerk, the sit-down and the exhale.
- **The boss counter-attack**: replays real moves (`flossRight`, `griddyFront`, `sixSeven`, `shhMogged`, `dabHold`) as short segments.
- **Effects** (`EffectLayer.tsx`): a dozen reusable CSS effects. Per-instance parameters come through custom properties (`--tone`, `--size`, `--dur`).

## 8. Act V — the JNR smoke reveal

`src/finale/`, split by concern:

| File | Role |
| --- | --- |
| `seat.ts` | Where Tailwind lies and Tung sits. **Computes the mouth position** from the rig geometry, so the smoke starts exactly at his lips. |
| `finale.tracks.ts` / `.moves.ts` | Gestures: sit, pull the JNR from the kangaroo pocket, the slow inhale (LED glow), hold, exhale. The wrist position is solved so the mouthpiece meets the lips. |
| `props/jnr/Jnr.tsx` | The JNR, rebuilt in CSS from the reference: mouthpiece, red tank, `clip-path` hawk, "JNR / JUST NO REASON" as real text, flavor label, LED "100" screen. It sits **between the palm and the curled fingers** (the `hold` hand pose). |
| `smoke/smoke.config.ts` | Every smoke timing and position, relative to the smoke origin (start of the "finalPuff" chapter). |
| `smoke/smoke.keyframes.ts` | Nine keyframes shared by all smoke elements. **Argument keyframe stops are computed from the config constants.** |
| `smoke/smoke.state.ts` | The same timeline as pure functions: argument phase, current argument, verdict lines. Used by tests, the reduced-motion still frame and the screen-reader line. |
| `smoke/SmokeBillows.tsx`, `SmokeReveal.tsx` | 14 exhale puffs, 6 billows (each lump breathes on its own clock), 7 argument clouds (wisp → cloud → text condenses → drifts → evaporates), the verdict cloud. |
| `finale.config.ts` | The four chapters (Tailwind down, Final Puff, Smoke Signals, Aura King). |
| `AuraKingCard.tsx` | The final card: Replay / Explore the dances (playground) / Inspect the CSS (inspector). |

Design choices:
- **One time origin for all the smoke.** The layer mounts once across three chapters, and each element's position in time is its `animation-delay`. Pausing, 0.25×, seeking and replay therefore need no smoke-specific code.
- **No blur on large surfaces.** Lumps are radial gradients with a crisp 70→73% edge. Blur is used only on the small text elements while they condense.
- **Readability.** The billows thin to a ~45% haze once the arguments start. Argument clouds are opaque, and never more than three are legible at once (tested).
- **Honest copy.** A test guards against performance-superiority phrasing and checks the disclaimer is present: "An opinionated choice for this project. Both tools can ship great, performant CSS."

## 9. Limitations

- **The character is a 2D puppet.** Turns are faked (squash, `rotateY` on a flat plane, surface swaps). Profile and back views are separate artwork, not a 3D model. The feet stay drawn toes-outward in the brief profile frame.
- **Choreography is hand-tuned.** Poses were adjusted from screenshots, not motion capture. Recognizability was checked by eye at key frames, not with an audience.
- **Container queries and `@property` are required**: Chrome 105+, Safari 16.4+, Firefox 128+. Older engines are not supported.
- **Seeking works at the granularity of CSS animations.** A segment's animations are re-created when the segment changes (React remounts the rig), then aligned before paint. This was correct in every case tested; a browser that delayed creating CSS animations would show one misaligned frame.
- **The JS bundle is heavier than the runtime logic needs** (see below). Most of it is React plus the atomic class strings that `transform: true` inlines for every `css()` call.
- **Build time is dominated by `tsc -b`**, not Panda.

## 10. What was measured

Measured on this machine (macOS, Chrome via playwright-core, Node 24, Vite 8.3, Panda 2.2.0). Scripts: `scripts/measure.mjs`, `scripts/verify-css.mjs`, `scripts/verify-playback.mjs`.

**Production build** (`pnpm build`: panda codegen + tsc -b + vite build)

| Asset | Raw | Gzip |
| --- | --- | --- |
| JS (`index-*.js`) | 393.5 KiB | 118.8 KiB |
| CSS (`index-*.css`) | 337.0 KiB | 51.6 KiB |
| HTML | 1.0 kB | 0.5 kB |

- `@keyframes` in the production CSS: **999**, all referenced; 0 missing.
- Full `pnpm build`: **4.5 s wall clock**. Of that, `vite build` is ~150–560 ms; the rest is codegen and type-checking.

**Playback in headless Chrome** (3 s of playback per scene, dev server, 1440×900)

| Scene | Median frame | p95 | Worst | Stage elements | Running animations |
| --- | --- | --- | --- | --- | --- |
| Floss | 16.7 ms | 16.7 ms | 16.8 ms | 197 | 32 |
| 67 Twerky | 16.7 ms | 16.8 ms | 16.8 ms | 184 | 29 |
| Exhale | 16.7 ms | 16.7 ms | 16.8 ms | 359 | 137 |
| Smoke reveal + verdict | 16.7 ms | 16.7 ms | **83.4 ms (one frame)** | 359 | 138 |

Headless Chrome has no real display. These numbers show main-thread headroom (no long frames except one 83 ms spike during the smoke reveal, probably at a scene commit) but **they are not a GPU or real-device profile**. Profile on target hardware before claiming smoothness there.

**Not measured**
- **No Tailwind implementation of this project exists**, so no Panda-vs-Tailwind numbers are claimed: bundle size, CSS size, speed, nothing. The show's jokes are jokes; the aura is fictional.
- Memory over repeated replays was not profiled. Unit tests check that the player and the adapter release subscriptions and animation references (`listenerCount`, `dispose()`).
