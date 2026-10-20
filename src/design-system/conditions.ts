/**
 * Character and stage states expressed as Panda conditions, so styles read
 * like the art direction: `_gigaForm: { scale: 1 }`, `_facingBack: {...}`.
 * The rig root carries `data-form` / `data-orientation`; the app root carries
 * `data-effects` for the reduced-effects option.
 */
export const conditions = {
  beastForm: '[data-form=auraBeast] &',
  gigaForm: '[data-form=gigaPandaChad] &',
  brainrotForm: '[data-form=brainrot] &',
  /** Form reveal animations only run when the form was not already revealed by a move. */
  gigaReveal: '[data-form=gigaPandaChad][data-entrance=animated] &',
  beastReveal: '[data-form=auraBeast][data-entrance=animated] &',
  facingBack: '[data-orientation=back] &, [data-orientation=threeQuarter] &',
  calmEffects: '[data-effects=calm] &',
  inspecting: '[data-inspect=true] &',
}
