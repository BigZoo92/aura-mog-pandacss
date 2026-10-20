import type { CSSProperties, ReactNode, Ref } from "react";
import { css, cx } from "../../../styled-system/css";
import type { Scene } from "../../animation/timeline/scene";
import { TungTung } from "../../character/components/TungTung";
import type { Joint } from "../../character/rig/joints";
import type { CharacterForm } from "../../character/rig/rig.types";
import { CaptionLayer } from "../effects/CaptionLayer";
import { EffectLayer } from "../effects/EffectLayer";
import { StageBackdrop } from "../themes/themes";
import { AuraField } from "./AuraField";
import { CameraRig } from "./CameraRig";

/**
 * The performance stage. A size container: Tung Tung, effects and captions are
 * all sized in container-query units, so the whole spectacle scales as one.
 * Every animated subtree declares its time origin (`data-t0`) for the
 * playback adapter.
 */
const stage = css({
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  containerType: "size",
  isolation: "isolate",
  bg: "ink.900",
});
/**
 * The rig unit: everything on stage is sized in `em` of this font-size.
 * Container units must be resolved by a CHILD of the size container.
 */
const units = css({
  position: "absolute",
  inset: "0",
  fontSize: "min(1.95cqh, 3.6cqw)",
});
const rigAnchor = css({ left: "50%", bottom: "7%" });
const silhouette = css({
  position: "absolute",
  inset: "0",
  "&[data-silhouette=true]": {
    animation: "silhouetteFlash var(--dur) linear both",
  },
});
const scanlines = css({
  position: "absolute",
  inset: "0",
  pointerEvents: "none",
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(8,8,11,0.07) 0 2px, transparent 2px 4px)",
  mixBlendMode: "multiply",
  zIndex: 7,
});
const vignette = css({
  position: "absolute",
  inset: "0",
  pointerEvents: "none",
  boxShadow: "inset 0 0 8em rgba(8,8,11,0.55)",
  zIndex: 7,
});

export interface StageProps {
  scene: Scene;
  /** Playground override of the form. */
  formOverride?: CharacterForm;
  showEffects?: boolean;
  selected?: Joint | null;
  /** Boss, projectiles... rendered in the character plane, behind him. */
  battle?: ReactNode;
  /** In front of the character, inside the camera (Act V smoke). */
  foreground?: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function Stage({
  scene,
  formOverride,
  showEffects = true,
  selected,
  battle,
  foreground,
  className,
  ref,
}: StageProps) {
  const { chapter, segment } = scene;
  const form = formOverride ?? scene.form;
  const silhouetteEvent = scene.active.find(
    (e) => e.type === "effect" && e.effect === "silhouette",
  );

  return (
    <div
      ref={ref}
      className={cx(stage, className)}
      data-stage
      data-chapter={chapter.config.id}
    >
      <div className={units}>
        <StageBackdrop
          key={chapter.config.id}
          theme={chapter.config.theme}
          t0={chapter.start}
        />
        <CameraRig camera={showEffects ? scene.camera : {}}>
          <AuraField form={form} t0={chapter.start} />
          {showEffects && <EffectLayer active={scene.active} plane="back" />}
          {battle}
          <div
            className={silhouette}
            data-silhouette={silhouetteEvent ? "true" : undefined}
            data-t0={silhouetteEvent?.at}
            style={
              silhouetteEvent && "duration" in silhouetteEvent
                ? ({
                    "--dur": `${silhouetteEvent.duration}ms`,
                    "--tone": "#FFE453",
                  } as CSSProperties)
                : undefined
            }
          >
            <TungTung
              key={segment.index}
              move={segment.move}
              form={form}
              formSince={formOverride ? segment.start : scene.formSince}
              formEntrance={formOverride ? "instant" : scene.formEntrance}
              face={segment.face}
              t0={segment.start}
              selected={selected}
              className={rigAnchor}
            />
          </div>
          {foreground}
          {showEffects && <EffectLayer active={scene.active} plane="front" />}
        </CameraRig>
      </div>
      {showEffects && <CaptionLayer active={scene.active} />}
      <div className={vignette} />
      <div className={scanlines} />
    </div>
  );
}
