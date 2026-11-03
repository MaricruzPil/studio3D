function outputName(mime){return mime.includes('mp4')?'studio3d-video-sbs.mp4':'studio3d-video-sbs.webm';}
function supportedMime(){const candidates=['video/mp4;codecs="avc1.42E01E,mp4a.40.2"','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];return candidates.find(type=>window.MediaRecorder?.isTypeSupported?.(type));}

export async function exportProcessedVideo(renderer,video,onProgress){
  if(!renderer?.canvas?.captureStream||!window.MediaRecorder)throw new Error('Este navegador no permite exportar video procesado. Prueba un navegador de escritorio compatible.');
  const mime=supportedMime();if(!mime)throw new Error('No hay un formato de grabación compatible en este navegador.');
  const sourceStream=(video.captureStream||video.webkitCaptureStream)?.call(video);
  const stream=renderer.canvas.captureStream(30);
  if(sourceStream)for(const track of sourceStream.getAudioTracks())stream.addTrack(track);
  const chunks=[];const recorder=new MediaRecorder(stream,{mimeType:mime});
  const wasPaused=video.paused,originalTime=video.currentTime;
  let progressListener,recorderStarted=false;
  try{
    await new Promise((resolve,reject)=>{const seek=()=>{video.removeEventListener('seeked',seek);resolve();};video.addEventListener('seeked',seek,{once:true});video.currentTime=0;if(video.currentTime===0)resolve();});
    recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};
    const finished=new Promise((resolve,reject)=>{recorder.onstop=resolve;recorder.onerror=()=>reject(new Error('El navegador detuvo la exportación de video.'));});
    progressListener=()=>onProgress?.(video.duration>0?video.currentTime/video.duration:0);
    video.addEventListener('timeupdate',progressListener);renderer.start();recorder.start(250);recorderStarted=true;
    await video.play();
    await new Promise((resolve,reject)=>{const end=()=>{cleanup();resolve();};const fail=()=>{cleanup();reject(new Error('El video no pudo reproducirse durante la exportación.'));};const cleanup=()=>{video.removeEventListener('ended',end);video.removeEventListener('error',fail);};video.addEventListener('ended',end,{once:true});video.addEventListener('error',fail,{once:true});});
    if(recorder.state!=='inactive')recorder.stop();await finished;
    const blob=new Blob(chunks,{type:mime});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=outputName(mime);link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    onProgress?.(1);return {mime,hasAudio:!!sourceStream?.getAudioTracks().length};
  }finally{
    if(progressListener)video.removeEventListener('timeupdate',progressListener);if(recorderStarted&&recorder.state!=='inactive')recorder.stop();renderer.stop();stream.getTracks().forEach(track=>track.stop());sourceStream?.getTracks().forEach(track=>track.stop());
    video.currentTime=Math.min(originalTime,Number.isFinite(video.duration)?video.duration:originalTime);if(wasPaused)video.pause();else video.play().catch(()=>{});
  }
}
