function downloadBlob(blob,name){const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function canvasBlob(canvas,type='image/png'){return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('El navegador no pudo generar la imagen.')),type));}

export async function exportAnaglyphPng(image,settings,pan){
  const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas 2D no disponible para exportar.');
  ctx.filter=`brightness(${settings.brightness}%) contrast(${settings.contrast}%)`;
  ctx.translate(canvas.width/2+pan.panX,canvas.height/2+pan.panY);ctx.scale(settings.scale/100,settings.scale/100);
  ctx.drawImage(image,-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
  downloadBlob(await canvasBlob(canvas),'studio3d-anaglifo.png');
}

export async function exportSbsPng(image,settings){
  const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas 2D no disponible para exportar.');
  const eyeW=canvas.width/2,eyeH=canvas.height,encodedAspect=eyeW/eyeH;
  const eyeAspect=settings.format==='half'?encodedAspect*2:encodedAspect;
  const fitW=Math.min(eyeW,eyeH*eyeAspect),fitH=fitW/eyeAspect,scale=(settings.scale??100)/100;
  const drawW=fitW*scale,drawH=fitH*scale,parallax=(settings.parallax||0)/2,vertical=(settings.vertical||0)/2;
  const panX=settings.panX||0,panY=settings.panY||0;
  for(let i=0;i<2;i++){
    const source=settings.swap?1-i:i,sourceX=source*eyeW;
    const centerX=eyeW*(i+.5)+panX+(i===0?-parallax:parallax);
    const centerY=eyeH/2-panY+(i===0?vertical:-vertical);
    ctx.save();ctx.beginPath();ctx.rect(i*eyeW,0,eyeW,eyeH);ctx.clip();
    ctx.drawImage(image,sourceX,0,eyeW,eyeH,centerX-drawW/2,centerY-drawH/2,drawW,drawH);ctx.restore();
  }
  downloadBlob(await canvasBlob(canvas),'studio3d-imagen-sbs.png');
}
