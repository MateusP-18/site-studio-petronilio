/* Glass Reveal (versão HTML/CSS/JS puro, WebGL). Reproduz o comportamento do componente React Bits Pro "Glass Reveal",
   que não foi instalado (é pago e exige React): uma lente "portal" redonda (sem ondulação na borda) mostra a imagem data-rev sobre a imagem base, que mantém as cores originais.
   Parâmetros espelham as props do componente. Sem WebGL, fica apenas a <img> base. */
(()=>{if(!(window.STUDIO&&window.STUDIO.heroGlass))return;/* desligado: ver config.js (heroGlass) */
const hm=document.querySelector("[data-glass]"),cv=hm&&hm.querySelector("canvas"),im=hm&&hm.querySelector("img");
if(!cv||!im)return;const hero=hm.closest(".hero"),box=hero.querySelector(".box"),hd=document.querySelector("header");
const rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
const P={size:.52,sizeSm:.5,distortion:0,aberration:0,wobble:0,wobbleSpeed:2,grayscale:0,dim:0,follow:.95,returnToCenter:true,faceX:.528,faceY:.504,dpr:1.5};
const O={alpha:false,antialias:false,powerPreference:"low-power"},gl=cv.getContext("webgl",O)||cv.getContext("experimental-webgl",O);
if(!gl){cv.remove();return}
const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o};
const pr=gl.createProgram();
gl.attachShader(pr,sh(gl.VERTEX_SHADER,"attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}"));
gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,`precision mediump float;varying vec2 v;uniform sampler2D A,B;uniform vec2 res,lens,dm;uniform vec4 cv;uniform float R,t,wob,ws,dist,ab,dim,gray;
vec2 T(vec2 u){return (u-.5)*cv.xy+.5+cv.zw;}
void main(){vec2 px=v*res,p=px-lens;float r=length(p),an=atan(p.y,p.x);
float w=wob*.16*(sin(an*3.+t*ws)+.6*sin(an*5.-t*ws*1.3)+.4*sin(an*2.+t*ws*.7));float Rw=R*(1.+w);float d=(r-Rw)/R;
float m=1.-smoothstep(-.07,.02,d);
vec2 n=p/Rw;vec2 q=p*(1.-dist*.28*(1.-clamp(dot(n,n),0.,1.)));
vec2 o=normalize(p+1e-4)*ab*res.y*.5*smoothstep(0.,1.,r/Rw)/res;vec2 u=(lens+q)/res;
vec3 cb=vec3(texture2D(B,T(u+o)).r,texture2D(B,T(u)).g,texture2D(B,T(u-o)).b);
vec3 ca=texture2D(A,T(v)).rgb;float g=dot(ca,vec3(.299,.587,.114));ca=mix(ca,vec3(g),gray);ca*=1.-dim*smoothstep(dm.x,dm.y,v.x);
gl_FragColor=vec4(mix(ca,cb,m),1.);}`));
gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){cv.remove();return}
gl.useProgram(pr);
const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
const L=gl.getAttribLocation(pr,"p");gl.enableVertexAttribArray(L);gl.vertexAttribPointer(L,2,gl.FLOAT,false,0,0);
const U=n=>gl.getUniformLocation(pr,n),u={res:U("res"),lens:U("lens"),dm:U("dm"),cv:U("cv"),R:U("R"),t:U("t"),wob:U("wob"),ws:U("ws"),dist:U("dist"),ab:U("ab"),dim:U("dim"),gray:U("gray")};
gl.uniform1i(U("A"),0);gl.uniform1i(U("B"),1);
const tx=[gl.createTexture(),gl.createTexture()],cl=(n,a,b)=>Math.max(a,Math.min(b,n));
let ok=false,raf=0,last=0,time=0,vis=true,W=0,H=0,R=0,dpr=1,xmin=0,xmax=0,ymin=0,ymax=0,rx=0,ry=0,lx=0,ly=0,tX=0,tY=0,back=0,moved=false;
const dispose=()=>{cancelAnimationFrame(raf);raf=0;ok=false;cv.remove();hm.classList.remove("gl");tx.forEach(t=>gl.deleteTexture(t));gl.deleteBuffer(buf);gl.deleteProgram(pr);const e=gl.getExtension("WEBGL_lose_context");e&&e.loseContext()};
const lay=()=>{const r=hm.getBoundingClientRect();W=r.width;H=r.height;if(!W||!H)return;dpr=Math.min(devicePixelRatio||1,P.dpr);
const cw=Math.round(W*dpr),ch=Math.round(H*dpr);if(cv.width!==cw||cv.height!==ch){cv.width=cw;cv.height=ch}gl.viewport(0,0,cw,ch);
const sm=W<700,desk=getComputedStyle(box).position==="absolute";R=(sm?P.sizeSm:P.size)*Math.min(W,H)/2;
xmin=0;xmax=W;ymin=0;ymax=H;
const ar=im.naturalWidth/im.naturalHeight,ca=W/H,sx=ca>ar?1:ca/ar,sy=ca>ar?ar/ca:1,pos=getComputedStyle(im).objectPosition.split(" ").map(parseFloat),fx=(pos[0]||50)/100,fy=(isNaN(pos[1])?50:pos[1])/100;
const cs=Math.max(W/im.naturalWidth,H/im.naturalHeight),dw=im.naturalWidth*cs,dh=im.naturalHeight*cs;rx=(W-dw)*fx+P.faceX*dw;ry=(H-dh)*fy+P.faceY*dh;if(!moved){tX=lx=rx;tY=ly=ry}
gl.uniform4f(u.cv,sx,sy,(1-sx)*(fx-.5),(1-sy)*(.5-fy));gl.uniform2f(u.res,cw,ch);gl.uniform1f(u.R,R*dpr);gl.uniform2f(u.dm,desk?.34:-1,desk?.52:-.5);
tX=cl(tX,xmin,xmax);tY=cl(tY,ymin,ymax)};
const draw=()=>{gl.uniform2f(u.lens,lx*dpr,(H-ly)*dpr);gl.uniform1f(u.t,time);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)};
const frame=ts=>{const dt=Math.min((ts-last)/1000||.016,.05);last=ts;const k=1-Math.pow(P.follow,dt*60);lx+=(tX-lx)*k;ly+=(tY-ly)*k;time+=dt;draw();raf=vis&&!rm?requestAnimationFrame(frame):0};
const gate=()=>document.documentElement.classList.contains("intro");/* durante a abertura em vídeo a lente fica parada, para não competir com a decodificação */
const run=()=>{if(ok&&!raf&&vis&&!rm&&!gate()){last=performance.now();raf=requestAnimationFrame(frame)}};
const aim=(x,y)=>{moved=true;const r=hm.getBoundingClientRect();tX=cl(x-r.left,xmin,xmax);tY=cl(y-r.top,ymin,ymax);clearTimeout(back)};
const home=d=>{clearTimeout(back);if(P.returnToCenter)back=setTimeout(()=>{tX=rx;tY=ry;moved=false},d)};
addEventListener("pointermove",e=>{if(e.pointerType==="mouse"&&!rm&&ok)aim(e.clientX,e.clientY)},{passive:true});
hm.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse"&&!rm)aim(e.clientX,e.clientY)},{passive:true});
hm.addEventListener("pointermove",e=>{if(e.pointerType!=="mouse"&&!rm)aim(e.clientX,e.clientY)},{passive:true});
["pointerup","pointercancel"].forEach(n=>hm.addEventListener(n,e=>{if(e.pointerType!=="mouse")home(1200)}));
const load=s=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=s});
const up=(i,img)=>{gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,tx[i]);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);
[[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]].forEach(([a,b])=>gl.texParameteri(gl.TEXTURE_2D,a,b))};
const init=()=>{const sm=matchMedia("(max-width:700px)").matches;
Promise.all([im.complete&&im.naturalWidth?Promise.resolve(im):load(im.currentSrc||im.src),load(sm?hm.dataset.revSm:hm.dataset.rev)]).then(([a,b])=>{
 try{up(0,a);up(1,b);gl.uniform1f(u.wob,P.wobble);gl.uniform1f(u.ws,P.wobbleSpeed);gl.uniform1f(u.dist,P.distortion);gl.uniform1f(u.ab,P.aberration);gl.uniform1f(u.dim,P.dim);gl.uniform1f(u.gray,P.grayscale);
 ok=true;lay();lx=tX=rx;ly=tY=ry;draw();hm.classList.add("gl");new ResizeObserver(()=>{lay();draw()}).observe(hm);run()}
 catch(e){console.info("Glass Reveal indisponível; imagem base mantida.");dispose()}}).catch(()=>dispose())};
new IntersectionObserver(es=>{vis=es[0].isIntersecting&&!document.hidden;vis?run():0}).observe(hm);
document.addEventListener("visibilitychange",()=>{vis=!document.hidden;vis?run():0});
cv.addEventListener("webglcontextlost",e=>{e.preventDefault();if(cv.isConnected)dispose()});
addEventListener("pagehide",()=>{if(cv.isConnected)dispose()},{once:true});
if(gate())document.addEventListener("intro:done",init,{once:true});else init();
})();
