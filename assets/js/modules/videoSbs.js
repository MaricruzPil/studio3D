/** Una sola fuente de video: ambas perspectivas comparten seek, pausa, volumen y tiempo. */
export function timeLabel(sec){if(!Number.isFinite(sec))return '0:00';const s=Math.max(0,Math.floor(sec));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
export function attachPlayer(video, elements, onFrame, onPlayState){
  const {play,back,forward,progress,volume,time,vrPlay}=elements;
  const sync=()=>{play.textContent=video.paused?'Reproducir':'Pausar';progress.value=video.duration>0?Math.round(video.currentTime/video.duration*1000):0;time.textContent=`${timeLabel(video.currentTime)} / ${timeLabel(video.duration)}`;};
  const toggle=async()=>{try{if(video.paused){await video.play();}else video.pause();}catch(e){onPlayState(false,`No se pudo reproducir el video: ${e.message}`);}};
  const seek=(delta)=>{if(Number.isFinite(video.duration))video.currentTime=Math.max(0,Math.min(video.duration,video.currentTime+delta));};
  const seekFromBar=()=>{if(Number.isFinite(video.duration))video.currentTime=video.duration*(Number(progress.value)/1000);};
  const vol=()=>{video.volume=Number(volume.value);};
  const playListener=()=>{sync();onPlayState(true);};
  const pauseListener=()=>{sync();onPlayState(false);onFrame();};
  const frameListener=()=>{sync();onFrame();};
  const errorListener=()=>onPlayState(false,'Ocurrió un error de reproducción. Puedes cargar otro MP4.');
  play.addEventListener('click',toggle);vrPlay.addEventListener('click',toggle);
  const backFn=()=>seek(-10),forwardFn=()=>seek(10);
  back.addEventListener('click',backFn);forward.addEventListener('click',forwardFn);
  progress.addEventListener('input',seekFromBar);volume.addEventListener('input',vol);
  video.addEventListener('play',playListener);video.addEventListener('pause',pauseListener);
  for(const name of ['timeupdate','durationchange','loadeddata','seeked'])video.addEventListener(name,frameListener);
  video.addEventListener('error',errorListener);
  video.volume=Number(volume.value);sync();
  return ()=>{
    play.removeEventListener('click',toggle);vrPlay.removeEventListener('click',toggle);
    back.removeEventListener('click',backFn);forward.removeEventListener('click',forwardFn);
    progress.removeEventListener('input',seekFromBar);volume.removeEventListener('input',vol);
    video.removeEventListener('play',playListener);video.removeEventListener('pause',pauseListener);
    for(const name of ['timeupdate','durationchange','loadeddata','seeked'])video.removeEventListener(name,frameListener);
    video.removeEventListener('error',errorListener);
  };
}
