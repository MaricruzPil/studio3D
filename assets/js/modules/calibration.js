/** Calibración exclusivamente visual, nunca modifica el archivo original. */
export const defaults = Object.freeze({
  anaglyph: Object.freeze({scale:100, brightness:100, contrast:100}),
  sbs: Object.freeze({horizontal:0, vertical:0, scale:100, swap:false}),
  video: Object.freeze({horizontal:0, scale:100})
});
export function newCalibration(mode) {return {...defaults[mode]};}
export function syncControls(mode, values) {
  const section = document.querySelector(`[data-controls="${mode}"]`);
  if (!section) return;
  for (const input of section.querySelectorAll('[data-setting]')) {
    const value=values[input.dataset.setting];
    if(input.type==='checkbox'){input.checked=!!value;continue;}
    input.value=value;
    const output=section.querySelector(`output[for="${input.id}"]`);
    if(output) output.textContent=`${['scale','brightness','contrast'].includes(input.dataset.setting)?Math.round(value):value}${['scale','brightness','contrast'].includes(input.dataset.setting)?' %':' px'}`;
  }
}
