import {newCalibration,syncControls} from './modules/calibration.js';
import {updateAnaglyph,clearAnaglyph,resetAnaglyphView,attachAnaglyphPan,setOriginalPreview} from './modules/anaglyph.js';
import {openLocalFile,releaseLocalFile} from './modules/fileLoader.js';
import {attachPlayer} from './modules/videoSbs.js';
import {applyVR,tryFullscreen,leaveFullscreen} from './modules/vrMode.js';

const $=(s)=>document.querySelector(s);
const ui={file:$('#file-input'),status:$('#status'),info:$('#file-info'),display:$('#display'),empty:$('#empty-state'),emptyTitle:$('#empty-heading'),emptyText:$('#empty-description'),img:$('#anaglyph-image'),canvas:$('#stereo-canvas'),eyes:$('#eye-labels'),modeChip:$('#mode-indicator'),vrEnter:$('#vr-enter'),vrExit:$('#vr-exit'),vrPlay:$('#vr-play'),player:$('#player'),fit:$('#a-fit'),original:$('#a-original'),immersive:$('#a-immersive'),immersiveFit:$('#a-immersive-fit'),immersiveExit:$('#a-immersive-exit')};
const playerEls={play:$('#play-pause'),back:$('#skip-back'),forward:$('#skip-forward'),progress:$('#progress'),volume:$('#volume'),time:$('#time-label'),vrPlay:ui.vrPlay};
const names={anaglyph:'Anaglifo rojo-cian',sbs:'Imagen SBS',video:'Video SBS 3D'};
const previews={anaglyph:{name:'Anaglifo',description:'Visualiza y ajusta imÃ¡genes 3D rojo-cian',image:'./assets/media/demo-anaglifo.png'},sbs:{name:'Imagen SBS',description:'Calibra perspectivas estereoscÃ³picas izquierda y derecha',image:'./assets/media/demo-sbs.jpg'},video:{name:'Video SBS',description:'Reproduce y ajusta videos estereoscÃ³picos 3D',image:'./assets/media/demo-sbs.jpg'}};
let mode=null,phase='empty',active=null,calibration=null,renderer=null,unbindPlayer=null,unbindPan=null,requestId=0,vr=false,orientationHandler=null;

function feedback(text,state='idle'){ui.status.textContent=text;ui.status.dataset.state=state;}
function setPhase(next,text){phase=next;feedback(text,next);updateUI();}
function updateUI(){
  for(const btn of document.querySelectorAll('[data-mode]'))btn.setAttribute('aria-pressed',String(btn.dataset.mode===mode));
  for(const section of document.querySelectorAll('[data-controls]'))section.hidden=section.dataset.controls!==mode;
  $('#controls-empty').hidden=!!mode;
  ui.file.disabled=!mode||phase==='loading';
  $('label[for="file-input"]').classList.toggle('is-disabled',ui.file.disabled);
  ui.file.accept=mode==='video'?'.mp4,video/mp4':'.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';
  $('#file-hint').textContent=mode?(mode==='video'?'Archivo MP4 compatible con el navegador.':'Imagen JPG/JPEG, PNG o WebP.'):'Primero selecciona una modalidad.';
  const ready=phase==='ready'&&!!active;
  for(const panel of document.querySelectorAll('.controls'))for(const input of panel.querySelectorAll('input,button'))input.disabled=!ready||panel.dataset.controls!==mode;
  ui.modeChip.textContent=mode?names[mode]:'Sin modalidad';
  ui.vrEnter.hidden=!(ready&&mode!=='anaglyph');ui.vrEnter.disabled=!ready;
  ui.player.hidden=!(ready&&mode==='video');
  ui.empty.hidden=ready||phase==='loading';
  ui.img.hidden=!(ready&&mode==='anaglyph');
  ui.canvas.hidden=!(ready&&(mode==='sbs'||mode==='video'));
  ui.eyes.hidden=!(ready&&(mode==='sbs'||mode==='video')&&!vr);
  if(!ready){
    ui.emptyTitle.textContent=phase==='error'?'No se pudo cargar el archivo':mode?'Importa un archivo':'Selecciona una modalidad';
    ui.emptyText.textContent=phase==='error'?'Elige otro archivo para continuar.':mode?'Selecciona un archivo local o arrástralo aquí.':'Para comenzar, elige anaglifo, imagen SBS o video SBS.';
  }
}
function resetValues(){if(!mode)return;calibration=newCalibration(mode);syncControls(mode,calibration);}
function stopCurrent(){
  unbindPlayer?.();unbindPlayer=null;unbindPan?.();unbindPan=null;
  renderer?.clearTexture();
  clearAnaglyph(ui.img);releaseLocalFile(active);active=null;ui.info.textContent='';
  playerEls.progress.value=0;playerEls.time.textContent='0:00 / 0:00';
}
async function exitVR(){if(!vr)return;vr=false;orientationHandler&&window.removeEventListener('resize',orientationHandler);orientationHandler=null;applyVR(false);await leaveFullscreen();renderer?.draw();updateUI();}
async function selectMode(next){
  requestId++;if(vr)await exitVR();stopCurrent();mode=next;resetValues();setPhase('empty','Sin contenido activo');
}
async function requireRenderer(){if(renderer)return renderer;const {StereoRenderer}=await import('./modules/imageSbs.js');renderer=new StereoRenderer(ui.canvas,ui.display);return renderer;}
async function importFile(file){
  if(!mode){feedback('Primero selecciona una modalidad.','error');return;}
  if(!file)return;
  const token=++requestId; if(vr)await exitVR();
  stopCurrent();resetValues();ui.empty.hidden=false;
  setPhase('loading',`Preparando ${file.name}…`);
  let result;
  try{
    result=await openLocalFile(file,mode);
    if(token!==requestId){releaseLocalFile(result);return;}
    if(mode!=='anaglyph'){
      ui.canvas.hidden=false;
      try{
        const r=await requireRenderer();
        if(token!==requestId){releaseLocalFile(result);ui.canvas.hidden=true;return;}
        r.setMedia(result);r.setCalibration(calibration);
      } catch(err){ui.canvas.hidden=true;throw new Error(`No se pudo iniciar Three.js/WebGL: ${err.message}. Comprueba la conexión al CDN y el soporte WebGL.`);}
    }else{ui.img.src=result.url;updateAnaglyph(ui.img,calibration);unbindPan=attachAnaglyphPan(ui.display,ui.img,()=>calibration,()=>syncControls('anaglyph',calibration));}
    active=result;ui.info.textContent=`${file.name} · ${file.type||'formato desconocido'} · ${result.width} × ${result.height} px · ${formatSize(file.size)} · Cargado`;
    setPhase('ready','Contenido listo');
    if(mode==='video'){
      unbindPlayer=attachPlayer(result.video,playerEls,()=>renderer?.draw(),(playing,error)=>{
        playing?renderer?.start():renderer?.stop();
        if(error)feedback(error,'error');else if(active===result)feedback(playing?'Reproduciendo':'Pausado','ready');
      });
      result.video.addEventListener('loadeddata',()=>renderer?.draw(),{once:true});
    }
    renderer?.draw();
  }catch(err){
    if(result)releaseLocalFile(result);
    if(token!==requestId)return;
    renderer?.clearTexture();ui.canvas.hidden=true;
    setPhase('error',err.message||'No se pudo cargar el archivo.');
  }finally{ui.file.value='';}
}
function formatSize(bytes){return bytes<1048576?`${(bytes/1024).toFixed(1)} KB`:`${(bytes/1048576).toFixed(2)} MB`;}

for(const btn of document.querySelectorAll('[data-mode]'))btn.addEventListener('click',()=>selectMode(btn.dataset.mode));
const preview=$('#module-preview'),previewImage=$('#module-preview-image'),previewName=$('#module-preview-name'),previewDescription=$('#module-preview-description');
function showModulePreview(key){const item=previews[key];if(!item)return;previewImage.src=item.image;previewImage.alt=`Vista previa de ${item.name}`;previewName.textContent=item.name;previewDescription.textContent=item.description;preview.hidden=false;}
for(const btn of document.querySelectorAll('.header-mode-picker [data-mode]')){btn.addEventListener('pointerenter',()=>showModulePreview(btn.dataset.mode));btn.addEventListener('focusin',()=>showModulePreview(btn.dataset.mode));}
ui.file.addEventListener('change',()=>importFile(ui.file.files?.[0]));
for(const section of document.querySelectorAll('[data-controls]')){
  for(const input of section.querySelectorAll('[data-setting]'))input.addEventListener('input',()=>{
    if(!active||section.dataset.controls!==mode)return;
    calibration[input.dataset.setting]=input.type==='checkbox'?input.checked:Number(input.value);
    syncControls(mode,calibration);
    if(mode==='anaglyph'){resetAnaglyphView();updateAnaglyph(ui.img,calibration);}else renderer?.setCalibration(calibration);
  });
  section.querySelector('.reset-button').addEventListener('click',()=>{
    if(!active)return;resetValues();
    if(mode==='anaglyph')updateAnaglyph(ui.img,calibration);else renderer?.setCalibration(calibration);
    feedback('Calibración restablecida','ready');
  });
}
ui.fit.addEventListener('click',()=>{if(active&&mode==='anaglyph'){calibration.scale=100;resetAnaglyphView();syncControls(mode,calibration);updateAnaglyph(ui.img,calibration)}});
async function leaveImmersive(){document.body.classList.remove('anaglyph-immersive');ui.immersiveFit.hidden=true;ui.immersiveExit.hidden=true;if(document.fullscreenElement===ui.display)await document.exitFullscreen?.();ui.immersive.textContent='Ampliar visor'}
ui.immersive.addEventListener('click',async()=>{if(!active||mode!=='anaglyph')return;if(document.body.classList.contains('anaglyph-immersive')){await leaveImmersive();return}document.body.classList.add('anaglyph-immersive');ui.immersive.textContent='Salir del visor';ui.immersiveFit.hidden=false;ui.immersiveExit.hidden=false;try{await ui.display.requestFullscreen?.()}catch{} });
ui.immersiveFit.addEventListener('click',()=>ui.fit.click());ui.immersiveExit.addEventListener('click',leaveImmersive);
const originalStart=()=>{if(active&&mode==='anaglyph')setOriginalPreview(ui.img,true)},originalEnd=()=>setOriginalPreview(ui.img,false);
ui.original.addEventListener('pointerdown',originalStart);ui.original.addEventListener('pointerup',originalEnd);ui.original.addEventListener('pointercancel',originalEnd);ui.original.addEventListener('pointerleave',originalEnd);ui.original.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();originalStart()}});ui.original.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')originalEnd()});window.addEventListener('pointerup',originalEnd);
ui.vrEnter.addEventListener('click',async()=>{
  if(!active||mode==='anaglyph')return;
  vr=true;orientationHandler=applyVR(true);window.addEventListener('resize',orientationHandler);
  ui.vrPlay.hidden=mode!=='video';
  await tryFullscreen();renderer?.draw();
});
ui.vrExit.addEventListener('click',()=>exitVR());
document.addEventListener('fullscreenchange',()=>{if(vr&&!document.fullscreenElement)exitVR();});
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&document.body.classList.contains('anaglyph-immersive'))leaveImmersive()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&vr)exitVR();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('anaglyph-immersive'))leaveImmersive()});
for(const evt of ['dragenter','dragover'])ui.display.addEventListener(evt,e=>{e.preventDefault();ui.display.classList.add('is-dragover');});
for(const evt of ['dragleave','drop'])ui.display.addEventListener(evt,e=>{e.preventDefault();ui.display.classList.remove('is-dragover');});
ui.display.addEventListener('drop',e=>importFile(e.dataTransfer.files?.[0]));
document.addEventListener('visibilitychange',()=>{if(active?.video){if(document.hidden)renderer?.stop();else if(!active.video.paused)renderer?.start();}});
window.addEventListener('beforeunload',()=>{stopCurrent();renderer?.dispose();});
updateUI();
