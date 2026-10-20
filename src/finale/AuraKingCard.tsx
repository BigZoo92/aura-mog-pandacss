import { css } from "../../styled-system/css";
import { arcadeButton } from "../../styled-system/recipes";

/**
 * The end of the show. Its entrance animations run on their own time origin
 * (`data-t0`), so they replay, pause and seek like everything else. The three
 * actions are real controls: replay the battle, open the playground, open the
 * joint inspector.
 */
const card = css({
  position: "absolute",
  inset: "0",
  zIndex: 9,
  display: "grid",
  alignContent: "center",
  justifyItems: "start",
  gap: "1.2cqh",
  padding: "4cqh 4cqw",
  width: "min(52%, 640px)",
  pointerEvents: "none",
  "& > div > *": {
    animation: "victoryRise 700ms token(easings.overshoot) both",
  },
  // Portrait: title block on top, actions at the bottom — his face stays visible in between.
  "@container (max-aspect-ratio: 1/1)": {
    width: "100%",
    height: "100%",
    alignContent: "space-between",
    justifyItems: "center",
    textAlign: "center",
  },
});
const block = css({
  display: "grid",
  gap: "1.2cqh",
  justifyItems: "inherit",
});
const title = css({
  fontFamily: "display",
  fontSize: "clamp(26px, 6.2cqw, 92px)",
  lineHeight: "0.9",
  color: "aura.lime",
  WebkitTextStroke: "0.06em token(colors.ink.900)",
  paintOrder: "stroke fill",
  textShadow: "0.07em 0.07em 0 token(colors.violet.600)",
});
const score = css({
  fontFamily: "display",
  fontSize: "clamp(18px, 3.8cqw, 54px)",
  color: "aura.gold",
  WebkitTextStroke: "0.06em token(colors.ink.900)",
  paintOrder: "stroke fill",
  animationDelay: "200ms !important",
});
const crown = css({
  fontFamily: "body",
  fontWeight: "700",
  fontSize: "clamp(11px, 1.9cqw, 22px)",
  letterSpacing: "0.1em",
  color: "ink.900",
  bg: "cream.50",
  padding: "0.35em 0.8em",
  border: "0.14em solid token(colors.ink.900)",
  boxShadow: "0.25em 0.25em 0 token(colors.ink.900)",
  animationDelay: "400ms !important",
});
const actions = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "1.5cqh",
  pointerEvents: "auto",
  animationDelay: "650ms !important",
  "@container (max-aspect-ratio: 1/1)": { justifyContent: "center" },
});
const disclaimer = css({
  fontFamily: "mono",
  fontSize: "clamp(9px, 1.25cqw, 14px)",
  color: "ink.900",
  bg: "rgba(255,245,222,0.75)",
  padding: "0.2em 0.5em",
  animationDelay: "900ms !important",
});

interface AuraKingCardProps {
  t0: number;
  onReplay: () => void;
  onExplore: () => void;
  onInspect: () => void;
}

export function AuraKingCard({
  t0,
  onReplay,
  onExplore,
  onInspect,
}: AuraKingCardProps) {
  return (
    <div className={card} data-t0={t0}>
      <div className={block}>
        <div className={title}>PANDA CSS WINS</div>
        <div className={score}>+999 999 AURA</div>
        <div className={crown}>TUNG TUNG TUNG CSSHUR — THE AURA KING</div>
      </div>
      <div className={block}>
        <div className={actions}>
          <button
            type="button"
            className={arcadeButton({ tone: "lime", size: "md" })}
            onClick={onReplay}
          >
            ⟲ REPLAY THE AURA BATTLE
          </button>
          <button
            type="button"
            className={arcadeButton({ tone: "cream", size: "md" })}
            onClick={onExplore}
          >
            ◆ EXPLORE THE DANCES
          </button>
          <button
            type="button"
            className={arcadeButton({ tone: "violet", size: "md" })}
            onClick={onInspect}
          >
            ⌕ INSPECT THE CSS
          </button>
        </div>
        <div className={disclaimer}>
          Performance claims require benchmarks. The aura is fictional.
        </div>
      </div>
    </div>
  );
}
