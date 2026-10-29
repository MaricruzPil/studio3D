/** API de archivos locales; todo el contenido permanece en este navegador. */
const imageTypes = new Set(['image/jpeg','image/png','image/webp']);
const extensions = {anaglyph:/\.(jpe?g|png|webp)$/i,sbs:/\.(jpe?g|png|webp)$/i,video:/\.mp4$/i};
export function validateSelection(file,mode){
  if(!file) throw new Error('Selecciona un archivo primero.');
  if(!mode) throw new Error('Elige el módulo antes de cargar un archivo.');
  if(!extensions[mode]?.test(file.name)) throw new Error(mode==='video'?'Este módulo solo acepta archivos MP4.':'Solo se admiten imágenes JPG, PNG o WebP.');
  if(mode==='video'){
    if(file.type && file.type!=='video/mp4') throw new Error('El archivo seleccionado no parece ser un MP4.');
  } else if(file.type && !imageTypes.has(file.type)) throw new Error('El formato indicado por el archivo no es válido para este módulo.');
  if(file.size===0) throw new Error('El archivo está vacío. Selecciona otro.');
}
export async function openLocalFile(file,mode){
  validateSelection(file,mode);
  const url=URL.createObjectURL(file);
  try {
    if(mode==='video'){
      const video=document.createElement('video');
      video.playsInline=true;video.setAttribute('playsinline','');video.preload='auto';
      video.src=url;
      await new Promise((resolve,reject)=>{
        const timeout=setTimeout(()=>{clean();reject(new Error('El navegador no pudo preparar el MP4. Comprueba su códec e inténtalo con otro archivo.'));},20000);
        function clean(){clearTimeout(timeout);video.removeEventListener('loadeddata',loaded);video.removeEventListener('error',failed);}
        function loaded(){clean();video.videoWidth&&video.videoHeight?resolve():reject(new Error('El video no tiene dimensiones válidas.'));}
        function failed(){clean();reject(new Error('El navegador no puede decodificar este MP4. Prueba con H.264 compatible.'));}
        video.addEventListener('loadeddata',loaded,{once:true});video.addEventListener('error',failed,{once:true});video.load();
      });
      return {mode,file,url,video,width:video.videoWidth,height:video.videoHeight};
    }
    const image=new Image();
    image.src=url;
    if(image.decode) {try{await image.decode();}catch{throw new Error('El navegador no pudo decodificar esta imagen. Prueba con otro JPG, PNG o WebP.');}}
    else await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('No se pudo decodificar la imagen.'));});
    if(!image.naturalWidth||!image.naturalHeight) throw new Error('La imagen no tiene dimensiones válidas.');
    return {mode,file,url,image,width:image.naturalWidth,height:image.naturalHeight};
  } catch(e){URL.revokeObjectURL(url);throw e;}
}
export function releaseLocalFile(content){
  if(!content)return;
  if(content.video){content.video.pause();content.video.removeAttribute('src');content.video.load();}
  if(content.image)content.image.removeAttribute('src');
  URL.revokeObjectURL(content.url);
}
