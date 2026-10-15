/* Dither Wave: textura animada de fundo da seção de serviços (#servicos). Ondas suaves "pontilhadas" (dithering ordenado
   de Bayer 8x8) entre duas cores, desenhadas num ÚNICO <canvas> WebGL pequeno (downScale) esticado com pixels nítidos.
   Implementação própria em JavaScript puro, sem bibliotecas, com os mesmos nomes de parâmetros do componente "Dither Wave"
   do React Bits Pro (o componente oficial é React + shadcn com registro privado e licença; não foi instalado aqui).
   Valores em window.STUDIO.dither (js/config.js). Sem WebGL, com movimento reduzido (um quadro estático) ou com ativo:false,
   o site continua igual. O canvas é decorativo: aria-hidden, pointer-events:none, atrás de todo o conteúdo. */
(()=>{const C=Object.assign({ativo:true,speed:1,intensity:1,scale:6,downScale:.5,primaryColor:"#e9dfcb",secondaryColor:"#5b8255",opacity:1,maxFPS:30,pauseWhenOffscreen:true,waveWidth:.2,waveSpacing:1,dotDensity:.9},(window.STUDIO||{}).dither);
const sec=document.getElementById("servicos");if(!C.ativo||!sec)return;
const cv=document.createElement("canvas"),gl=cv.getContext("webgl",{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:"low-power"});
if(!gl)return;
const rm=matchMedia("(prefers-reduced-motion:reduce)");
const rgb=h=>{h=h.replace("#","");if(h.length===3)h=h.replace(/./g,"$&$&");const n=parseInt(h,16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]};
const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return gl.getShaderParameter(o,gl.COMPILE_STATUS)?o:null};
const vs=sh(gl.VERTEX_SHADER,"attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}");
/* A onda é desenhada só como linhas finas (curvas de nível do campo de ondas): waveWidth = espessura (0 a 1), waveSpacing = quantas linhas,
   dotDensity = fração dos pontos acesos na linha (menor = mais discreto). Os pontos aparecem só ao longo das linhas. */
/* y de cima para baixo: quando a seção cresce (categoria aberta) o desenho não "pula". uK converte pixels do canvas em fase da onda. */
const fs=sh(gl.FRAGMENT_SHADER,`precision mediump float;uniform vec2 uRes;uniform float uTime,uInt,uK,uL,uW,uD;uniform vec3 uA,uB;
float b2(vec2 a){a=floor(a);return fract(a.x*.5+a.y*a.y*.75);}
float b4(vec2 a){return b2(a*.5)*.25+b2(a);}
float b8(vec2 a){return b4(a*.5)*.25+b2(a);}
void main(){vec2 px=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y),p=px*uK;float t=uTime;
float w=sin(p.x+t*.9+uInt*.55*sin(p.y*1.6-t*.6));
w+=.7*sin(p.y*1.9-t*.7+uInt*.45*sin(p.x*1.3+t*.5));
w+=.5*sin((p.x*.8+p.y*.6)*1.4+t*.4+uInt*.3*sin(p.y*.7+t*.8));
float s=w*uL,e=1.-smoothstep(0.,uW,abs(fract(s)-.5)*2.);
gl_FragColor=vec4(mix(uA,uB,step(b8(px)+.004,e*uD)),1.);}`);
if(!vs||!fs)return;
const pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.linkProgram(pr);
if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return;
gl.useProgram(pr);
const bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
const ap=gl.getAttribLocation(pr,"p");gl.enableVertexAttribArray(ap);gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
const U=n=>gl.getUniformLocation(pr,n),uRes=U("uRes"),uTime=U("uTime"),uInt=U("uInt"),uK=U("uK");
gl.uniform3fv(U("uA"),rgb(C.primaryColor));gl.uniform3fv(U("uB"),rgb(C.secondaryColor));gl.uniform1f(uInt,C.intensity);gl.uniform1f(U("uL"),C.waveSpacing);gl.uniform1f(U("uW"),C.waveWidth);gl.uniform1f(U("uD"),C.dotDensity);
/* "scale" maior = ondas maiores; downScale = fração do tamanho real em que o canvas é desenhado (menor = pontilhado mais grosso e mais leve) */
const ds=Math.min(1,Math.max(.1,C.downScale));gl.uniform1f(uK,1/(ds*Math.max(1,C.scale)*12));
cv.className="dw";cv.setAttribute("aria-hidden","true");cv.style.opacity=C.opacity;
let time=3,vis=true,raf=0,last=0,lost=false;const gap=1000/Math.max(1,C.maxFPS);
const draw=()=>{if(lost)return;gl.uniform2f(uRes,cv.width,cv.height);gl.uniform1f(uTime,time);gl.drawArrays(gl.TRIANGLES,0,3)};
const fit=()=>{const w=Math.max(1,Math.round(sec.clientWidth*ds)),h=Math.max(1,Math.round(sec.clientHeight*ds));if(w!==cv.width||h!==cv.height){cv.width=w;cv.height=h;gl.viewport(0,0,w,h);draw()}};
const frame=ts=>{raf=requestAnimationFrame(frame);const dt=ts-last;if(dt<gap-2)return;last=ts;time+=Math.min(dt,100)/1000*C.speed;draw()};
/* só anima com a seção à vista, aba visível e sem pedido de movimento reduzido; senão para o laço (e mantém um quadro estático) */
const upd=()=>{const go=!lost&&(vis||!C.pauseWhenOffscreen)&&!document.hidden&&!rm.matches;if(go&&!raf){last=performance.now();raf=requestAnimationFrame(frame)}else if(!go&&raf){cancelAnimationFrame(raf);raf=0}};
cv.addEventListener("webglcontextlost",e=>{e.preventDefault();lost=true;upd();cv.style.visibility="hidden"});
sec.prepend(cv);fit();
if("ResizeObserver"in window)new ResizeObserver(fit).observe(sec);else addEventListener("resize",fit);
if("IntersectionObserver"in window&&C.pauseWhenOffscreen)new IntersectionObserver(es=>{vis=es[0].isIntersecting;upd()},{rootMargin:"120px 0px"}).observe(sec);
document.addEventListener("visibilitychange",upd);(rm.addEventListener?rm.addEventListener("change",upd):rm.addListener(upd));
upd()})();
