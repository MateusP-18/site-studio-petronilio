/* Galeria e avaliações: carrossel 3D giratório (HTML/CSS/JS puro) à direita e a avaliação da foto em destaque à esquerda.
   Segue o conceito e as propriedades do Spin Shutter (React Bits Pro): count, aspect, radius, tilt, roll, distance,
   spread, speed, aperture, haze, shadow. O componente oficial é React + WebGL e exige licença; ele NÃO está instalado
   aqui. Esta versão é independente e usa os valores de referência pedidos (veja P).
   Sincronização: a foto em destaque é a que está de fato na frente da órbita (calculada a partir do ângulo real do anel,
   com histerese); a avaliação exibida é sempre a do item em destaque (equivalente ao onFocusChange do oficial). */
(()=>{const S=window.STUDIO,root=document.getElementById("galeria"),G=S&&S.galeria;
if(!root||!G||!G.length)return;
const $=(q,e=root)=>e.querySelector(q),$$=(q,e=root)=>[...e.querySelectorAll(q)],N=G.length,STEP=360/N,mod=(a,n)=>((a%n)+n)%n;
/* Valores de referência do Spin Shutter. size = altura da carta relativa ao raio da órbita (padrão do componente .38; ajustado para o layout). */
const P={count:10,aspect:1.1,radius:17,tilt:21,roll:-16,distance:2.1,spread:.35,speed:1.1,aperture:1,haze:.11,shadow:.56,size:.46,sizeSm:.5,focus:.22};
const mqr=matchMedia("(prefers-reduced-motion:reduce)"),coarse=matchMedia("(pointer:coarse)");
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])),pad=n=>String(n).padStart(2,"0");
/* ---------- marcação ---------- */
const stars=(n,ex)=>n>0?`<span class="g-st" role="img" aria-label="Nota ${n} de 5">${"★".repeat(n)}${"☆".repeat(5-n)}</span>`:(ex?`<span class="g-st g-st0" aria-hidden="true">☆☆☆☆☆</span>`:"");
$("#rvw").innerHTML=G.map((g,i)=>{const d=g.depoimento||{};
 return `<figure class="g-it" data-i="${i}" aria-hidden="true"><figcaption>${stars(d.nota,d.exemplo)}${d.nome?`<b>${esc(d.nome)}</b>`:""}<span>${esc(g.titulo)}</span></figcaption><blockquote><p>${esc(d.texto)}</p></blockquote></figure>`}).join("");
const card=(g,i)=>{const v=(g.cor!=null?g.cor:i)%6,
 face=g.img?`<img src="${esc(g.img)}" alt="${esc(g.alt||g.titulo)}" loading="lazy" decoding="async" draggable="false"${g.pos?` style="object-position:50% ${esc(g.pos)}"`:""}>`
  :`<img class="g-sym" src="assets/logo-symbol.png" alt="" width="48" height="69" draggable="false"><span class="g-cap"><b>${esc(g.titulo)}</b><small>Espaço para foto</small></span>`;
  return `<button type="button" class="g-card" data-i="${i}" tabindex="-1" aria-label="Foto ${i+1} de ${N}: ${esc(g.titulo)}${g.img?"":" (espaço reservado para foto)"}"><span class="g-fr g-bl v${v}" aria-hidden="true">${face.replace(' alt="',' data-a="').replace("<img ",'<img alt="" ')}</span><span class="g-fr v${v}">${face}</span></button>`};
$("#gor").innerHTML=`<div class="g-orb" tabindex="0" role="group" aria-roledescription="carrossel" aria-label="Galeria de fotos do Studio Petronilio. Use as setas do teclado para trocar de foto e a barra de espaço para pausar ou retomar o giro."><div class="g-k"><div class="g-cam"><div class="g-ring">${G.map(card).join("")}</div></div></div></div>`;
$("#gct").innerHTML=`<div class="g-ctl"><ol class="g-dots">${G.map((g,i)=>`<li><button type="button" data-i="${i}" aria-label="Ver foto ${i+1} de ${N}: ${esc(g.titulo)}"></button></li>`).join("")}</ol><p class="g-cnt" aria-hidden="true"><b>01</b> / ${pad(N)}</p></div>`;
const orb=$(".g-orb"),cards=$$(".g-card"),items=$$(".g-it"),dots=$$(".g-dots button"),cnt=$(".g-cnt b"),rvw=$("#rvw"),bls=cards.map(c=>c.firstElementChild),shs=cards.map(c=>c.lastElementChild),pv=cards.map(()=>({t:"",o:-1,b:-1,s:-1}));
/* ---------- estado ---------- */
const K=2.2;let R=220,Rk=528,open=0,rot=0,actK=0,active=-1,anim=null,speedNow=0,hover=false,focused=false,userPaused=false,dragging=false,visible=false,started=false,holdUntil=0,raf=0,last=0,dirty=true,wasPrev=-1,liveT=0;
const ease=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2,ease3=k=>1-Math.pow(1-k,3);
const reduced=()=>mqr.matches;
/* ---------- tamanho e câmera ---------- */
const layout=()=>{const W=orb.clientWidth||320,s=W<520?P.sizeSm:P.size;R=Math.min(W*(W<640?.42:.45),360);Rk=R*K;
 const h=Rk*s,w=h*P.aspect,st=orb.style;
 st.setProperty("--R",R+"px");st.setProperty("--K",K);st.setProperty("--Rk",Rk+"px");st.setProperty("--cw",w+"px");st.setProperty("--ch",h+"px");st.setProperty("--dist",P.distance);st.setProperty("--rad",P.radius*K+"px");st.setProperty("--sh",P.shadow);
 st.setProperty("--rt",`translate3d(${(.04*Rk).toFixed(1)}px,${(-.2*Rk).toFixed(1)}px,0) rotateZ(${P.roll}deg) rotateX(${-P.tilt}deg)`);dirty=true};
/* ---------- aplicar a pose de cada carta ---------- */
const apply=()=>{const o=ease3(open),rr=Rk*o;
 for(let i=0;i<N;i++){const a=(i*STEP-rot)*o,f=(Math.cos(a*Math.PI/180)+1)/2,q=pv[i];/* f: 0 = atrás, 1 = na frente */
  const t=`rotateY(${a.toFixed(2)}deg) translateZ(${rr.toFixed(1)}px) rotateY(${(-a).toFixed(2)}deg) rotateX(${P.tilt}deg) rotateZ(${-P.roll}deg) scale(${(1+P.focus*Math.pow(f,12)).toFixed(3)})`;
  if(t!==q.t){q.t=t;cards[i].style.transform=t}
  /* profundidade de campo (aperture) e névoa (haze) usando só opacidade: a carta tem uma camada nítida e outra já desfocada (fixa),
     e a mistura entre as duas muda com a distância. Mudar opacidade é barato; mudar filter a cada quadro obrigava a redesenhar tudo. */
  const bl=Math.min(1,P.aperture*Math.pow(1-f,1.5)*1.15),ob=Math.min(1,bl*1.6),os=1-bl,oc=1-P.haze*(1-f)*2;
  if(Math.abs(oc-q.o)>.004){q.o=oc;cards[i].style.opacity=oc.toFixed(3)}
  if(Math.abs(ob-q.b)>.004){q.b=ob;bls[i].style.opacity=ob.toFixed(3)}
  if(Math.abs(os-q.s)>.004){q.s=os;shs[i].style.opacity=os.toFixed(3)}}
 /* foto em destaque = a que está na frente; histerese evita troca por pequenas variações perto do limite entre duas fotos */
 const fl=rot/STEP;if(Math.abs(fl-actK)>.54)actK=Math.round(fl);
 const idx=mod(actK,N);if(idx!==active)setActive(idx)};
const setActive=i=>{const prev=active;active=i;
 items.forEach((e,k)=>{const on=k===i;e.classList.toggle("on",on);e.classList.toggle("was",k===prev&&!on);e.setAttribute("aria-hidden",on?"false":"true")});
 if(prev>=0){const pe=items[prev];setTimeout(()=>pe.classList.remove("was"),700)}
 dots.forEach((b,k)=>{if(k===i)b.setAttribute("aria-current","true");else b.removeAttribute("aria-current")});
 cnt.textContent=pad(i+1);root.dispatchEvent(new CustomEvent("gallery:focus",{detail:{index:i,id:G[i].id}}))};
/* ---------- navegação ---------- */
const live=()=>{rvw.setAttribute("aria-live","polite");clearTimeout(liveT);liveT=setTimeout(()=>rvw.setAttribute("aria-live","off"),2500)};
const toK=k=>{const to=k*STEP;if(reduced()){rot=to;anim=null}else anim={from:rot,to,t0:performance.now(),d:Math.min(1100,350+Math.abs(to-rot)*7)};dirty=true;kick()};
const goTo=i=>{live();holdUntil=performance.now()+7000;const base=Math.round(rot/STEP),d=mod(i-mod(base,N)+N/2,N)-N/2;toK(base+d)};
const setPaused=p=>{userPaused=p};
/* ---------- laço de animação (só roda com a seção visível) ---------- */
const loop=t=>{raf=0;const dt=Math.min(.05,(t-last)/1000||0);last=t;let moving=false;
 if(started&&open<1){open=Math.min(1,open+dt/1.4);moving=true}
 if(anim){const k=Math.min(1,(t-anim.t0)/anim.d);rot=anim.from+(anim.to-anim.from)*ease(k);if(k>=1)anim=null;moving=true}
 else if(!dragging){const auto=started&&!reduced()&&!userPaused&&!hover&&!focused&&t>holdUntil,tgt=auto?P.speed*6:0;/* speed = voltas por minuto */
  speedNow+=(tgt-speedNow)*Math.min(1,dt*3);if(Math.abs(speedNow)<.02)speedNow=tgt;if(speedNow){rot+=speedNow*dt;moving=true}}
 if(moving||dragging||dirty){apply();dirty=false}
 if(visible)raf=requestAnimationFrame(loop)};
const kick=()=>{if(!raf&&visible){last=performance.now();raf=requestAnimationFrame(loop)}};
/* ---------- interação ---------- */
$("#gct").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
 if(b.dataset.i!=null)goTo(+b.dataset.i)});
let px=0,pr=0,pid=null,lx=0,lt=0,vel=0,moved=false;
orb.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse"&&e.button!==0)return;pid=e.pointerId;px=lx=e.clientX;pr=rot;vel=0;lt=performance.now();moved=false});
orb.addEventListener("pointermove",e=>{if(e.pointerType==="mouse")hover=true;if(pid!==e.pointerId)return;const dx=e.clientX-px;
 if(!moved&&Math.abs(dx)>6){moved=true;dragging=true;anim=null;try{orb.setPointerCapture(pid)}catch(_){}orb.classList.add("drag");kick()}
 if(moved){rot=pr-dx*.4;const n=performance.now();vel=(lx-e.clientX)*.4/Math.max(1,n-lt)*1000;lx=e.clientX;lt=n}});
const end=e=>{if(pid!==e.pointerId)return;pid=null;if(moved){dragging=false;orb.classList.remove("drag");holdUntil=performance.now()+7000;live();toK(Math.round((rot+vel*.18)/STEP));setTimeout(()=>{moved=false},60)}};
orb.addEventListener("pointerup",end);orb.addEventListener("pointercancel",end);
orb.addEventListener("pointerenter",e=>{if(e.pointerType==="mouse")hover=true});orb.addEventListener("pointerleave",e=>{if(e.pointerType==="mouse")hover=false});
orb.addEventListener("click",e=>{const c=e.target.closest(".g-card");if(c&&!moved)goTo(+c.dataset.i)});
orb.addEventListener("keydown",e=>{const k=e.key;
 if(k==="ArrowRight"||k==="ArrowDown"){e.preventDefault();goTo(active+1)}else if(k==="ArrowLeft"||k==="ArrowUp"){e.preventDefault();goTo(active-1)}
 else if(k==="Home"){e.preventDefault();goTo(0)}else if(k==="End"){e.preventDefault();goTo(N-1)}
 else if(k===" "&&!reduced()){e.preventDefault();setPaused(!userPaused)}});
root.addEventListener("focusin",e=>{focused=!!(e.target.matches&&e.target.matches(":focus-visible"))});root.addEventListener("focusout",()=>{focused=false});
const rm=()=>{if(reduced()){speedNow=0;open=1;started=true;dirty=true}};
(mqr.addEventListener?mqr.addEventListener("change",rm):mqr.addListener(rm));rm();
/* ---------- início ---------- */
layout();new ResizeObserver(()=>{layout();kick()}).observe(orb);
if(reduced()){open=1;started=true}
apply();/* já mostra a foto 1 e a avaliação 1 antes de a animação começar */
if("IntersectionObserver"in window)new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible){if(!started){started=true}kick()}else if(raf){cancelAnimationFrame(raf);raf=0}},{threshold:.15}).observe(orb);
else{visible=true;started=true;open=1;kick()}
})();
