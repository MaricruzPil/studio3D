/** Anaglifo rojo-cian listo para lentes físicos. CSS no crea anaglifos a partir de 2D. */
let panX=0,panY=0,drag=null,original=false,originalStyles=null;
export function updateAnaglyph(img, settings) {
  img.style.transform=`translate(${panX}px,${panY}px) scale(${settings.scale/100})`;
  img.style.filter=`brightness(${settings.brightness}%) contrast(${settings.contrast}%)`;
}
export function resetAnaglyphView(){panX=0;panY=0;}
export function setOriginalPreview(img,enabled){if(enabled===original)return;original=enabled;if(enabled){originalStyles={transform:img.style.transform,filter:img.style.filter};img.style.transform='';img.style.filter='';}else if(originalStyles){img.style.transform=originalStyles.transform;img.style.filter=originalStyles.filter;originalStyles=null;}}
export function attachAnaglyphPan(display,img,getSettings){const move=e=>{if(!drag)return;e.preventDefault();const r=img.getBoundingClientRect(),b=display.getBoundingClientRect(),maxX=Math.max(0,(r.width-b.width)/2+24),maxY=Math.max(0,(r.height-b.height)/2+24);panX=Math.max(-maxX,Math.min(maxX,drag.panX+e.clientX-drag.x));panY=Math.max(-maxY,Math.min(maxY,drag.panY+e.clientY-drag.y));updateAnaglyph(img,getSettings())};const end=()=>{drag=null};const down=e=>{if(!img.hidden&&getSettings().scale>100){drag={x:e.clientX,y:e.clientY,panX,panY};img.setPointerCapture?.(e.pointerId)}};img.addEventListener('pointerdown',down);img.addEventListener('pointermove',move);img.addEventListener('pointerup',end);img.addEventListener('pointercancel',end);return()=>{img.removeEventListener('pointerdown',down);img.removeEventListener('pointermove',move);img.removeEventListener('pointerup',end);img.removeEventListener('pointercancel',end);drag=null}}
export function clearAnaglyph(img) {
  setOriginalPreview(img,false);resetAnaglyphView();img.removeAttribute('src'); img.style.transform=''; img.style.filter=''; img.hidden=true;
}
