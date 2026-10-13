import * as THREE from 'three';
export function createHouse(container:HTMLElement){
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(10,8,11);camera.lookAt(0,.8,0);
 let renderer:THREE.WebGLRenderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return ()=>{};}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor(0x181c1b,0);renderer.outputColorSpace=THREE.SRGBColorSpace;container.querySelector<HTMLElement>('.model-fallback')!.hidden=true;container.append(renderer.domElement);container.closest('.architecture')?.classList.add('has-model');
 const ambient=new THREE.AmbientLight(0xf4f1df,2);scene.add(ambient);const sun=new THREE.DirectionalLight(0xffeed8,4);sun.position.set(4,8,5);scene.add(sun);const fill=new THREE.DirectionalLight(0xb5d4e5,2);fill.position.set(-5,3,-5);scene.add(fill);
 const home=new THREE.Group();scene.add(home);home.rotation.y=-.2;
 const solids:THREE.Mesh[]=[];const wires:THREE.LineSegments[]=[];
 const wall=new THREE.MeshStandardMaterial({color:0xc7c4af,roughness:.82,transparent:true});const wood=new THREE.MeshStandardMaterial({color:0x80664b,roughness:.9,transparent:true});const dark=new THREE.MeshStandardMaterial({color:0x303b38,roughness:.6,transparent:true});const glass=new THREE.MeshStandardMaterial({color:0x90b6b1,metalness:.35,roughness:.15,transparent:true,opacity:.55});const lineMat=new THREE.LineBasicMaterial({color:0x9ba999,transparent:true,opacity:.8});
 function box(w:number,h:number,d:number,x:number,y:number,z:number,material:THREE.MeshStandardMaterial,stage:number){const geometry=new THREE.BoxGeometry(w,h,d);const mesh=new THREE.Mesh(geometry,material.clone());mesh.position.set(x,y,z);mesh.userData.stage=stage;mesh.userData.baseOpacity=material.opacity;home.add(mesh);solids.push(mesh);const wire=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),lineMat.clone());wire.position.copy(mesh.position);home.add(wire);wires.push(wire);return mesh;}
 box(7,.18,5,0,0,0,wall,.05);box(4.3,.15,2.8,-.8,.17,3.4,wood,.12);
 box(.18,2.8,4.8,-3.25,1.48,0,wall,.3);box(6.4,2.8,.18,0,1.48,-2.3,wall,.34);box(.18,2.8,4.8,3.25,1.48,0,wood,.38);box(2.2,2.8,.18,2.2,1.48,2.3,wall,.4);
 box(.14,2.8,.15,-3.1,1.48,2.3,dark,.22);box(.14,2.8,.15,-.9,1.48,2.3,dark,.23);box(.14,2.8,.15,1.1,1.48,2.3,dark,.24);
 box(2.1,2.65,.06,-2,1.5,2.32,glass,.65);box(1.9,2.65,.06,.1,1.5,2.32,glass,.67);
 box(7.1,.22,5.5,0,2.95,0,dark,.52);box(3.4,1.85,2.8,1.2,3.95,-.7,wall,.72);box(3.8,.18,3.2,1.2,4.95,-.7,dark,.82);box(2.7,1.5,.05,1.2,3.97,.72,glass,.9);
 for(let i=0;i<13;i++)box(.06,2.8,.12,1.3+i*.15,1.48,2.42,wood,.7);
 const grid=new THREE.GridHelper(13,26,0x5c6a5b,0x343e35);grid.position.y=-.12;scene.add(grid);
 const control=document.querySelector<HTMLInputElement>('#build-progress')!;const stage=document.getElementById('build-stage')!;let userControlled=false;let progress=Number(control.value)/100;let rotation=home.rotation.y;let dragging=false;let lastX=0;let inView=true;let destroyed=false;let frame=0;
 function draw(){if(destroyed||!inView)return;const p=progress;solids.forEach(mesh=>{const material=mesh.material as THREE.MeshStandardMaterial;material.opacity=THREE.MathUtils.clamp((p-mesh.userData.stage)*7,0,1)*mesh.userData.baseOpacity;mesh.scale.y=Math.max(.001,THREE.MathUtils.clamp((p-mesh.userData.stage)*7,0,1));});wires.forEach(wire=>(wire.material as THREE.LineBasicMaterial).opacity=.7*(1-p*.75));home.rotation.y=rotation;renderer.render(scene,camera);}
 const resize=new ResizeObserver(()=>{const w=container.clientWidth,h=container.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);draw();});resize.observe(container);
 const visible=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)draw();});visible.observe(container);
 const onInput=()=>{userControlled=true;progress=Number(control.value)/100;updateStage();draw();};
 function updateStage(){stage.textContent=progress<.3?'01 / FRAMEWORK':progress<.7?'02 / STRUCTURE':'03 / MATERIAL & FINISH';}
 const scroll=()=>{if(userControlled||!inView)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const rect=container.getBoundingClientRect();progress=THREE.MathUtils.clamp((innerHeight-rect.top)/(innerHeight+rect.height*.4),0,1);control.value=String(Math.round(progress*100));updateStage();draw();});};
 const down=(e:PointerEvent)=>{dragging=true;lastX=e.clientX;renderer.domElement.setPointerCapture(e.pointerId);};const move=(e:PointerEvent)=>{if(dragging){rotation+=(e.clientX-lastX)*.007;lastX=e.clientX;draw();}};const up=()=>{dragging=false;};
 control.addEventListener('input',onInput);window.addEventListener('scroll',scroll,{passive:true});renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointercancel',up);draw();
 return ()=>{destroyed=true;cancelAnimationFrame(frame);resize.disconnect();visible.disconnect();control.removeEventListener('input',onInput);window.removeEventListener('scroll',scroll);renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('pointerup',up);renderer.domElement.removeEventListener('pointercancel',up);scene.traverse(obj=>{if(obj instanceof THREE.Mesh||obj instanceof THREE.LineSegments){obj.geometry.dispose();const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>m.dispose());}});wall.dispose();wood.dispose();dark.dispose();glass.dispose();lineMat.dispose();renderer.dispose();renderer.domElement.remove();};
}
