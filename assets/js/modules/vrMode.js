/** Fullscreen y orientación son mejoras progresivas, no requisitos para visualizar. */
export function applyVR(active){
  document.body.classList.toggle('vr-active',active);
  document.getElementById('vr-controls').hidden=!active;
  const warning=document.getElementById('orientation-warning');
  const update=()=>warning.hidden=!(active&&window.innerHeight>window.innerWidth);
  update();return update;
}
export async function tryFullscreen(){
  try {await document.getElementById('display').requestFullscreen?.();}catch{}
  try {await screen.orientation?.lock?.('landscape');}catch{}
}
export async function leaveFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();}catch{}}
