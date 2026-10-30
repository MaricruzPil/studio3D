import * as THREE from 'three';
/** Un único renderer para dos regiones: izquierda / derecha.
 * Recorte UV auténtico, no replica una única vista plana.
 */
export class StereoRenderer {
  constructor(canvas,container){
    this.canvas=canvas;this.container=container;
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'default'});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    this.renderer.setClearColor(0x181715,1);this.renderer.setScissorTest(true);
    this.camera=new THREE.OrthographicCamera(-1,1,1,-1,.01,20);this.camera.position.z=5;
    this.scenes=[new THREE.Scene(),new THREE.Scene()];
    this.geometry=[this.makeGeometry(0),this.makeGeometry(1)];
    this.material=this.scenes.map(()=>new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));
    this.meshes=this.scenes.map((scene,i)=>{const mesh=new THREE.Mesh(this.geometry[i],this.material[i]);scene.add(mesh);return mesh;});
    this.texture=null;this.width=0;this.height=0;this.settings={parallax:0,scale:100,panX:0,panY:0,vertical:0,format:'full',swap:false};
    this.raf=0;this.playing=false;this.media=null;
    this.resizeRaf=0;
    this.scheduleResize=()=>{cancelAnimationFrame(this.resizeRaf);this.resizeRaf=requestAnimationFrame(()=>{this.resizeRaf=0;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));this.draw();});};
    this.resizeObserver=new ResizeObserver(()=>this.scheduleResize());this.resizeObserver.observe(container);
    this.resizeTargets=[window,window.visualViewport].filter(Boolean);
    this.resizeTargets.forEach(target=>target.addEventListener('resize',this.scheduleResize,{passive:true}));
    window.addEventListener('orientationchange',this.scheduleResize,{passive:true});
  }
  makeGeometry(eye){
    const g=new THREE.PlaneGeometry(1,1);
    const uv=g.attributes.uv;
    for(let i=0;i<uv.count;i++){uv.setX(i,uv.getX(i)*.5+eye*.5);}
    uv.needsUpdate=true;return g;
  }
  setMedia(content){
    this.stop();this.clearTexture();this.media=content;
    this.width=content.width;this.height=content.height;
    this.texture=content.video?new THREE.VideoTexture(content.video):new THREE.Texture(content.image);
    this.texture.colorSpace=THREE.SRGBColorSpace;
    this.texture.minFilter=THREE.LinearFilter;this.texture.magFilter=THREE.LinearFilter;
    this.texture.needsUpdate=true;
    for(const material of this.material){material.map=this.texture;material.needsUpdate=true;}
    this.draw();
  }
  setCalibration(settings){this.settings={...settings};this.draw();}
  draw(){
    if(!this.media||!this.texture||this.canvas.hidden)return;
    const w=Math.max(2,Math.floor(this.container.clientWidth));
    const h=Math.max(2,Math.floor(this.container.clientHeight));
    const leftW=Math.floor(w/2),rightW=w-leftW;
    this.renderer.setSize(w,h,false);
    const eyeW=Math.min(leftW,rightW);
    const encodedEyeAspect=(this.width/2)/this.height;
    const eyeAspect=this.settings.format==='half'?encodedEyeAspect*2:encodedEyeAspect;
    const fitW=Math.min(eyeW,h*eyeAspect),fitH=fitW/eyeAspect;
    const scale=(this.settings.scale??100)/100;
    const worldW=fitW*scale,worldH=fitH*scale;
    const px=1;
    const parallax=(this.settings.parallax||0)/2;
    const vertical=(this.settings.vertical||0)/2;
    const panX=this.settings.panX||0,panY=this.settings.panY||0;
    const xLimit=Math.max(0,w/4+worldW/2-12);
    const yLimit=Math.max(0,h/2+worldH/2-12);
    const boundedPanX=Math.max(-xLimit+Math.abs(parallax),Math.min(xLimit-Math.abs(parallax),panX));
    const boundedPanY=Math.max(-yLimit+Math.abs(vertical),Math.min(yLimit-Math.abs(vertical),panY));
    for(let i=0;i<2;i++){
      const eye=(i===0?0:1);
      const source=(this.settings.swap?1-eye:eye);
      this.meshes[i].geometry=this.geometry[source];
      this.meshes[i].scale.set(worldW,worldH,1);
      this.meshes[i].position.x=boundedPanX+(i===0?-parallax:parallax);
      this.meshes[i].position.y=-boundedPanY+(i===0?vertical:-vertical);
    }
    this.camera.left=-eyeW/2;this.camera.right=eyeW/2;
    this.camera.top=h/2;this.camera.bottom=-h/2;this.camera.updateProjectionMatrix();
    const regions=[[0,0,leftW,h],[leftW,0,rightW,h]];
    for(let i=0;i<2;i++){
      this.renderer.setViewport(...regions[i]);this.renderer.setScissor(...regions[i]);
      this.renderer.clear(true,true,true);this.renderer.render(this.scenes[i],this.camera);
    }
  }
  start(){if(this.playing)return;this.playing=true;const loop=()=>{if(!this.playing)return;this.draw();this.raf=requestAnimationFrame(loop);};this.raf=requestAnimationFrame(loop);}
  stop(){this.playing=false;cancelAnimationFrame(this.raf);this.raf=0;}
  clearTexture(){this.stop();if(this.texture){for(const material of this.material){material.map=null;material.needsUpdate=true;}this.texture.dispose();this.texture=null;}this.media=null;}
  dispose(){this.resizeObserver.disconnect();this.resizeTargets.forEach(target=>target.removeEventListener('resize',this.scheduleResize));window.removeEventListener('orientationchange',this.scheduleResize);cancelAnimationFrame(this.resizeRaf);this.clearTexture();this.geometry.forEach(x=>x.dispose());this.material.forEach(x=>x.dispose());this.renderer.dispose();}
}
