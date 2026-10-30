const LIMITS={parallax:[-100,100],scale:[40,220],panX:[-160,160],panY:[-120,120]};

export function attachSbsInteractions(stage,getConfig,changed,isEnabled,onTap){
  const pointers=new Map();let baseline=null,tap=null,lastTap=0;
  const clamp=(key,value)=>{const [min,max]=LIMITS[key];return Math.max(min,Math.min(max,value));};
  const points=()=>[...pointers.values()];
  const distance=items=>items.length<2?0:Math.hypot(items[1].x-items[0].x,items[1].y-items[0].y);
  const rebase=()=>{const current=points();baseline=current.length?{points:current.map(point=>({...point})),config:{...getConfig()}}:null;};
  const clearTap=()=>{tap=null;};
  const down=event=>{
    if(!isEnabled()||event.button>0)return;
    stage.setPointerCapture?.(event.pointerId);pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(pointers.size===1)tap={x:event.clientX,y:event.clientY,time:performance.now(),type:event.pointerType};else clearTap();
    rebase();
  };
  const move=event=>{
    if(!pointers.has(event.pointerId)||!isEnabled())return;
    event.preventDefault();pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(tap&&Math.hypot(event.clientX-tap.x,event.clientY-tap.y)>6)clearTap();
    if(!baseline)return;
    const current=points(),start=baseline.points,base=baseline.config;
    if(current.length>=2&&start.length>=2){
      const startDistance=distance(start);
      if(startDistance>5){getConfig().scale=clamp('scale',base.scale*distance(current)/startDistance);changed();}
      return;
    }
    if(current.length!==1||start.length!==1)return;
    const dx=current[0].x-start[0].x,dy=current[0].y-start[0].y,config=getConfig();
    if(config.interactionMode==='separate')config.parallax=clamp('parallax',base.parallax+dx*.5);
    else{config.panX=clamp('panX',base.panX+dx);config.panY=clamp('panY',base.panY+dy);}
    changed();
  };
  const release=event=>{
    if(!pointers.has(event.pointerId))return;
    const wasTap=event.type==='pointerup'&&tap&&pointers.size===1&&performance.now()-tap.time<350;
    const tapType=tap?.type;pointers.delete(event.pointerId);tap=null;
    if(wasTap){const now=performance.now();if(now-lastTap<350&&tapType===event.pointerType){lastTap=0;onTap?.(tapType)}else lastTap=now;}
    rebase();
  };
  stage.addEventListener('pointerdown',down);stage.addEventListener('pointermove',move,{passive:false});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(type,release);
  return()=>{stage.removeEventListener('pointerdown',down);stage.removeEventListener('pointermove',move);for(const type of ['pointerup','pointercancel','lostpointercapture'])stage.removeEventListener(type,release);pointers.clear();baseline=null;tap=null;lastTap=0;};
}
