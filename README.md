# AURA BATTLE — Tung Tung Tung CSSHUR

**One panda (costume). Infinite aura. Zero Tailwind.**

Tung Tung Tung Sahur, wearing a panda onesie, performs 12 internet dances, defeats a (friendly) Tailwind CSS caricature, sits on it, and smokes a JNR whose smoke reveals why this project uses Panda CSS. It's all HTML + CSS keyframes, driven by a seekable, speed-controllable player.

- React 19 + TypeScript (strict) + Vite 8 + **Panda CSS 2.2** (`@pandacss/vite`, `transform: true`)
- No SVG, canvas, WebGL, images, video or animation libraries. JavaScript never computes joint positions per frame.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:5173 (any free port)
pnpm test         # unit tests (Vitest)
pnpm build        # panda codegen + tsc -b + vite build
pnpm lint
```

After `pnpm build`:

```bash
node scripts/verify-css.mjs        # every referenced @keyframes is in the production CSS
```

With the dev server running (the scripts assume port 5199: `pnpm dev --port 5199`):

```bash
node scripts/verify-playback.mjs   # pause / 0.25× / seek checks on real Animation objects in Chrome
node scripts/measure.mjs           # sizes + frame timings (needs a build)
node scripts/shoot.mjs name="?seek=finalPuff:6200"   # screenshot any moment
```

The browser scripts use your locally installed Google Chrome through `playwright-core`.

## Deep links

- `?seek=smokeReveal:5600`: open the show paused at a chapter + ms
- `?mode=playground&dance=sixSevenTwerky&inspect`: playground on a dance, inspector open
- `?lab&move=twerkyMain&t=190&form=gigaPandaChad`: a single frozen pose (visual QA)

## Keyboard

`Space` play/pause · `← →` seek · `R` replay · `N`/`P` next/previous chapter · `L` loop · `F` fullscreen.
In the playground, `I` toggles the inspector and `Esc` closes it.

## Map of the code

```
src/
  character/      the rig: Bone, Head (log + hood), Face, Torso (onesie), Hips, Arm, Hand, Leg
    rig/          joints, geometry (single source of truth), surfaces (front/profile/back)
  choreography/   motion compiler (tracks → keyframes, IK, mirror, hold), 12 dance folders
  battle/         the Tailwind boss, projectiles, boss-fight moves
  finale/         Act V: seat geometry, JNR gestures, smoke config/state/keyframes/components, final card
  props/jnr/      the CSS JNR
  animation/      timeline (scene, scoring, cinematic) + playback (PlayerStore, AnimationSync)
  stage/          stage, camera, themes, effects, captions
  player/         show mode UI (HUD, timeline, transport), hooks
  playground/     dance playground + "Inspect the Aura"
  design-system/  tokens, semantic tokens, layer styles, conditions, keyframes, recipes
panda.config.ts   compiles the choreography at build time
```

See **[TECHNICAL_SHOWCASE.md](./TECHNICAL_SHOWCASE.md)** for the architecture, its limits, and the measurements.

---

*Performance claims require benchmarks. The aura is fictional. An opinionated choice for this project — both tools can ship great, performant CSS.*
