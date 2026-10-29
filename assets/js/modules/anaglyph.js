/** Anaglifo rojo-cian listo para lentes físicos. CSS no crea anaglifos a partir de 2D. */
let panX=0,panY=0,drag=null,original=false,originalStyles=null;
export function updateAnaglyph(img, settings) {
  img.style.transform=`translate(${panX}px,${panY}px) scale(${settings.scale/100})`;
  img.style.filter=`brightness(${settings.brightness}%) contrast(${settings.contrast}%)`;
}
export function resetAnaglyphView(){panX=0;panY=0;}
export function setOriginalPreview(img,enabled){if(enabled===original)return;original=enabled;if(enabled){originalStyles={transform:img.style.transform,filter:img.style.filter};img.style.transform='';img.style.filter='';}else if(originalStyles){img.style.transform=originalStyles.transform;img.style.filter=originalStyles.filter;originalStyles=null;}}
export function attachAnaglyphPan(display,img,getSettings,onChange){
  const pointers=new Map();let pinch=null,lastTap=0;
  const limits=()=>{const r=img.getBoundingClientRect(),b=display.getBoundingClientRect();return [Math.max(0,(r.width-b.width)/2+24),Math.max(0,(r.height-b.height)/2+24)]};
  const clamp=()=>{const [mx,my]=limits();panX=Math.max(-mx,Math.min(mx,panX));panY=Math.max(-my,Math.min(my,panY));};
  const render=()=>{clamp();updateAnaglyph(img,getSettings());onChange?.()};
  const pointData=()=>[...pointers.values()];
  const down=e=>{if(img.hidden)return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});img.setPointerCapture?.(e.pointerId);if(pointers.size===2){const [a,b]=pointData();pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),scale:getSettings().scale,panX,panY,midX:(a.x+b.x)/2,midY:(a.y+b.y)/2};return}if(getSettings().scale>100)drag={x:e.clientX,y:e.clientY,panX,panY};};
  const move=e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2&&pinch){const [a,b]=pointData(),midX=(a.x+b.x)/2,midY=(a.y+b.y)/2,ratio=Math.hypot(a.x-b.x,a.y-b.y)/pinch.distance;getSettings().scale=Math.max(50,Math.min(200,pinch.scale*ratio));panX=pinch.panX+(midX-pinch.midX);panY=pinch.panY+(midY-pinch.midY);render();return}if(drag){e.preventDefault();panX=drag.panX+e.clientX-drag.x;panY=drag.panY+e.clientY-drag.y;render()}};
  const up=e=>{pointers.delete(e.pointerId);if(pointers.size<2)pinch=null;drag=null;const now=Date.now();if(now-lastTap<300&&pointers.size===0){getSettings().scale=getSettings().scale===100?150:100;resetAnaglyphView();render()}lastTap=now};
  img.addEventListener('pointerdown',down);img.addEventListener('pointermove',move);img.addEventListener('pointerup',up);img.addEventListener('pointercancel',up);img.addEventListener('lostpointercapture',up);window.addEventListener('resize',render);return()=>{img.removeEventListener('pointerdown',down);img.removeEventListener('pointermove',move);img.removeEventListener('pointerup',up);img.removeEventListener('pointercancel',up);img.removeEventListener('lostpointercapture',up);window.removeEventListener('resize',render);pointers.clear();pinch=null;drag=null}}
export function clearAnaglyph(img) {
  setOriginalPreview(img,false);resetAnaglyphView();img.removeAttribute('src'); img.style.transform=''; img.style.filter=''; img.hidden=true;
}
