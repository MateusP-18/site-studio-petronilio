/* Efeito interativo de cabelo: deformação localizada via WebGL (sem bibliotecas).
   Alvo: [data-hair] (faixa com a foto de cabelo). Sem WebGL, com movimento reduzido ou em erro, fica a <img> estática. */
(()=>{const band=document.querySelector("[data-hair]"),cv=band&&band.querySelector("canvas"),img=band&&band.querySelector("img.bg");
if(!cv||!img)return;if(!window.__hairForce&&matchMedia("(prefers-reduced-motion:reduce)").matches){cv.remove();return} // __hairForce: só usado na página de teste
const O={alpha:false,antialias:false,powerPreference:"low-power"},gl=cv.getContext("webgl2",O)||cv.getContext("webgl",O);
if(!gl){cv.remove();return}
const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o};
const pr=gl.createProgram();
gl.attachShader(pr,sh(gl.VERTEX_SHADER,"attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}"));
// a=amplitude, m=centro da influência, c=escala "cover", r=proporção. Fios claros (luzes) se deslocam mais que os escuros.
gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,"precision mediump float;varying vec2 v;uniform sampler2D t;uniform vec2 a,m,c,r;void main(){vec2 d=(v-m)*r;float g=exp(-dot(d,d)/.5);vec2 q=(v-.5)*c+.5;float l=dot(texture2D(t,q).rgb,vec3(.3,.6,.1));float s=clamp(.55+.9*l+.12*sin(q.y*40.+l*4.),.4,1.4);q-=a*g*s*vec2(1.,.5);gl_FragColor=texture2D(t,q);}"));
gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){cv.remove();return}
gl.useProgram(pr);
const buf=gl.createBuffer(),tex=gl.createTexture();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
const L=gl.getAttribLocation(pr,"p");gl.enableVertexAttribArray(L);gl.vertexAttribPointer(L,2,gl.FLOAT,false,0,0);
const U=n=>gl.getUniformLocation(pr,n),ua=U("a"),um=U("m"),uc=U("c"),ur=U("r");
const MAX=.02,K=3,W=12,C=8,cl=(n,a,b)=>Math.max(a,Math.min(b,n));
let ok=false,ro,raf=0,last=0,ar=1,x=0,y=0,vx=0,vy=0,mx=.5,my=.5,tx=.5,ty=.5,px=null,py=0;
const dispose=()=>{cancelAnimationFrame(raf);raf=0;ok=false;ro&&ro.disconnect();cv.remove();band.classList.remove("gl");gl.deleteTexture(tex);gl.deleteBuffer(buf);gl.deleteProgram(pr);const e=gl.getExtension("WEBGL_lose_context");e&&e.loseContext()};
const size=()=>{const d=Math.min(devicePixelRatio||1,2),w=Math.round(band.clientWidth*d),h=Math.round(band.clientHeight*d);if(!w||!h)return;if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}gl.viewport(0,0,w,h);const ca=w/h,z=.94;gl.uniform2f(uc,(ca>ar?1:ca/ar)*z,(ca>ar?ar/ca:1)*z);gl.uniform2f(ur,ca,1)};
const draw=()=>{gl.uniform2f(ua,cl(x,-MAX,MAX),cl(y,-MAX,MAX));gl.uniform2f(um,mx,my);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)};
const tick=t=>{const dt=Math.min((t-last)/1000||.016,.033);last=t;
vx+=(-W*W*x-C*vx)*dt;vy+=(-W*W*y-C*vy)*dt;x+=vx*dt;y+=vy*dt;
const e=Math.min(1,dt*14);mx+=(tx-mx)*e;my+=(ty-my)*e;draw();
if(Math.abs(x)+Math.abs(y)+Math.abs(vx)+Math.abs(vy)>1e-3)raf=requestAnimationFrame(tick);else{x=y=vx=vy=0;draw();raf=0}};
const kick=()=>{if(ok&&!raf){last=performance.now();raf=requestAnimationFrame(tick)}};
band.addEventListener("pointermove",e=>{const r=band.getBoundingClientRect();tx=(e.clientX-r.left)/r.width;ty=1-(e.clientY-r.top)/r.height;
if(px===null){mx=tx;my=ty}else{vx=cl(vx+cl((e.clientX-px)/r.width*K,-.2,.2),-.45,.45);vy=cl(vy+cl(-(e.clientY-py)/r.height*K*.4,-.1,.1),-.45,.45)}
px=e.clientX;py=e.clientY;kick()},{passive:true});
["pointerleave","pointerup","pointercancel"].forEach(n=>band.addEventListener(n,()=>{px=null}));
const init=()=>{try{ar=img.naturalWidth/img.naturalHeight;gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);
const w2=typeof WebGL2RenderingContext!=="undefined"&&gl instanceof WebGL2RenderingContext;if(w2)gl.generateMipmap(gl.TEXTURE_2D);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,w2?gl.LINEAR_MIPMAP_LINEAR:gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
ok=true;size();draw();band.classList.add("gl");ro=new ResizeObserver(()=>{size();draw()});ro.observe(band)}
catch(err){console.info("Efeito de cabelo indisponível; imagem estática mantida.");dispose()}};
img.complete&&img.naturalWidth?init():img.addEventListener("load",init,{once:true});
cv.addEventListener("webglcontextlost",e=>{e.preventDefault();if(cv.isConnected)dispose()});
addEventListener("pagehide",()=>{if(cv.isConnected)dispose()},{once:true});
})();
