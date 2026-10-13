import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger);
let dispose: (()=>void)|undefined;
function initialize(){
 dispose?.();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const controller=new AbortController();const opts={signal:controller.signal};
 const cleanups:(()=>void)[]=[];
 const menu=document.querySelector<HTMLButtonElement>('.menu-button');
 const mobile=document.querySelector<HTMLElement>('.mobile-nav');
 menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');if(mobile)mobile.hidden=!open;if(open&&!reduced&&mobile)gsap.fromTo(mobile.querySelectorAll('a'),{opacity:0,y:15},{opacity:1,y:0,stagger:.045,duration:.35});},opts);
 document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&mobile&&!mobile.hidden){mobile.hidden=true;menu?.setAttribute('aria-expanded','false');menu?.focus();}},opts);
 mobile?.addEventListener('keydown',(e)=>{if(e.key!=='Tab')return;const links=Array.from(mobile.querySelectorAll<HTMLElement>('a'));if(!e.shiftKey&&document.activeElement===links.at(-1)){e.preventDefault();menu?.focus();}},opts);
 let lenis:Lenis|undefined;
 const context=gsap.context(()=>{
  if(!reduced){
   if(matchMedia('(min-width: 768px) and (pointer: fine)').matches){lenis=new Lenis({duration:.85,anchors:true,smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);const tick=(time:number)=>lenis?.raf(time*1000);gsap.ticker.add(tick);cleanups.push(()=>gsap.ticker.remove(tick));}
   const loader=document.querySelector('.preloader');let played=true;try{played=sessionStorage.getItem('svgbc-intro')==='1';sessionStorage.setItem('svgbc-intro','1');}catch{}
   if(loader&&!played){gsap.set(loader,{display:'flex'});gsap.timeline().from('.draft-line',{scaleX:0,duration:.35}).from('.preloader img',{clipPath:'inset(100% 0 0 0)',duration:.35},'-=.1').to(loader,{yPercent:-100,duration:.55,delay:.15,ease:'power3.inOut'}).set(loader,{display:'none'});}
   gsap.fromTo('.hero-image',{scale:1.06},{scale:1,duration:1.8,ease:'power2.out'});
   gsap.fromTo('.hero h1>span',{y:28,clipPath:'inset(100% 0 0 0)'},{y:0,clipPath:'inset(0)',stagger:.15,duration:.9,delay:loader&&!played?.8:.1,ease:'power3.out'});
   gsap.to('.hero-image',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
   document.querySelectorAll('.section h2').forEach(el=>gsap.fromTo(el,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0)',duration:.85,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
   document.querySelectorAll('.reveal-image,.project .image-frame').forEach(el=>gsap.fromTo(el,{clipPath:'inset(0 0 14% 0)'},{clipPath:'inset(0)',ease:'none',scrollTrigger:{trigger:el,start:'top 95%',end:'top 40%',scrub:true}}));
   gsap.fromTo('.process-line',{scaleX:0},{scaleX:1,stagger:.15,scrollTrigger:{trigger:'.process-grid',start:'top 85%',end:'bottom 65%',scrub:1}});
   gsap.fromTo('.footer-top',{y:25},{y:0,scrollTrigger:{trigger:'footer',start:'top bottom',end:'bottom bottom',scrub:true}});
  }
 });
 const serviceImage=document.querySelector<HTMLImageElement>('#service-image');
 document.querySelectorAll<HTMLElement>('[data-service-image]').forEach(link=>{const update=()=>{if(serviceImage&&serviceImage.src!==link.dataset.serviceImage){if(!reduced)gsap.fromTo(serviceImage,{opacity:.55},{opacity:1,duration:.3});serviceImage.src=link.dataset.serviceImage!;serviceImage.alt=link.querySelector('h3')?.textContent+' — visual reference';}};link.addEventListener('pointerenter',update,opts);link.addEventListener('focus',update,opts);});
 document.querySelectorAll<HTMLElement>('.comparison').forEach(el=>el.querySelector('input')?.addEventListener('input',(e)=>el.style.setProperty('--split',`${(e.target as HTMLInputElement).value}%`),opts));
 let reviewIndex=0;const slides=Array.from(document.querySelectorAll<HTMLElement>('.review-slide'));
 document.querySelectorAll<HTMLElement>('[data-review]').forEach(button=>button.addEventListener('click',()=>{reviewIndex=(reviewIndex+Number(button.dataset.review)+slides.length)%slides.length;slides.forEach((s,i)=>s.hidden=i!==reviewIndex);const count=document.querySelector('.review-count');if(count)count.textContent=`0${reviewIndex+1} / 0${slides.length}`;if(!reduced)gsap.fromTo(slides[reviewIndex],{opacity:.25,x:8},{opacity:1,x:0,duration:.3});},opts));
 const form=document.querySelector<HTMLFormElement>('#estimate-form');
 if(form){const query=new URLSearchParams(location.search);for(const field of ['service','city']){const input=form.elements.namedItem(field) as HTMLInputElement;if(query.has(field))input.value=query.get(field)!;}
 form.addEventListener('submit',(e)=>{e.preventDefault();const inputs=Array.from(form.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>('[required]'));let first:HTMLElement|undefined;for(const field of inputs){const invalid=!field.value.trim()||!field.validity.valid;field.setAttribute('aria-invalid',String(invalid));const error=document.getElementById(`${field.name}-error`);if(error)error.textContent=invalid?(field.type==='email'&&field.value?'Enter a valid email address.':'Please complete this field.'):'';if(invalid&&!first)first=field;}const status=document.getElementById('form-status')!;if(first){status.textContent='Please check the highlighted fields.';document.getElementById('email-preview')!.hidden=true;first.focus();return;}
 const data=new FormData(form);const service=form.querySelector<HTMLSelectElement>('[name=service]')!;const body=`Project inquiry — independent website concept\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone')}\nCity / ZIP: ${data.get('city')}\nProject type: ${service.selectedOptions[0].text}\nTimeline: ${data.get('timeline')}\n\n${data.get('description')}`;
 const preview=document.getElementById('email-preview')!;preview.hidden=false;preview.querySelector('pre')!.textContent=body;document.querySelector<HTMLAnchorElement>('#open-email')!.href=`mailto:info@siliconvalleygbc.com?subject=${encodeURIComponent('Construction project inquiry')}&body=${encodeURIComponent(body)}`;status.textContent='Your draft is ready below. Nothing has been sent.';
 });document.getElementById('copy-email')?.addEventListener('click',async()=>{const text=document.querySelector('#email-preview pre')?.textContent||'';try{await navigator.clipboard.writeText(text);document.getElementById('form-status')!.textContent='Email text copied. Nothing has been sent.';}catch{document.getElementById('form-status')!.textContent='Copy the email text shown below manually.';}},opts);}
 const scene=document.getElementById('house-scene');let sceneCleanup:(()=>void)|undefined;let active=true;
 if(scene&&!reduced&&matchMedia('(min-width:768px)').matches){const observer=new IntersectionObserver(async entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();try{const {createHouse}=await import('./house');if(active)sceneCleanup=createHouse(scene);}catch{ /* Keep the labeled static fallback. */ }}},{rootMargin:'250px'});observer.observe(scene);cleanups.push(()=>observer.disconnect());}
 dispose=()=>{active=false;controller.abort();context.revert();lenis?.destroy();sceneCleanup?.();cleanups.forEach(fn=>fn());};
}
document.addEventListener('astro:page-load',initialize);
document.addEventListener('astro:before-swap',()=>dispose?.());
