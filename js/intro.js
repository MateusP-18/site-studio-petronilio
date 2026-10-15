/* Abertura cinematográfica: vídeo em tela cheia na primeira visita da sessão.
   A classe "intro" em <html> é aplicada por um script inline no <head> (antes da primeira pintura) e só se
   a abertura ainda não foi concluída/pulada nesta sessão e o visitante não pediu movimento reduzido.
   Um script inline logo após o #intro já define o src do vídeo, então o download começa durante a leitura do HTML.
   Para rever a abertura sem fechar a aba, abra o site com ?intro no endereço. Sem JS a camada nunca aparece (ver css/styles.css). */
(()=>{const d=document.documentElement,el=document.getElementById("intro");
if(!el)return;
if(!d.classList.contains("intro")){el.remove();return}
const v=el.querySelector("video"),btn=el.querySelector(".intro-skip"),KEY="sp-intro",HOLD=150,FADE=600,SPEED=1.75,
IDLE=15000,/* sem nenhum progresso do vídeo por 15 s (contando só com a aba visível): desiste e mostra o site */
parts=[...document.querySelectorAll(".skip,header,main,footer")];
let done=0,started=0,hold=0,idle=0,tick=0,play=null;
const inert=on=>parts.forEach(e=>on?e.setAttribute("inert",""):e.removeAttribute("inert"));
inert(true);
/* reg=true: o visitante terminou ou pulou (registra a sessão). fast=true: entrada acelerada (pulou ou houve falha) */
const finish=(reg,fast)=>{if(done)return;done=1;if(fast)d.classList.add("fast");clearInterval(tick);clearTimeout(hold);
 if(reg){try{sessionStorage.setItem(KEY,"1")}catch(e){}}
 v.pause();inert(false);d.classList.remove("intro");el.classList.add("out");
 if(document.activeElement===btn)btn.blur();
 document.dispatchEvent(new Event("intro:done"));
 setTimeout(()=>el.classList.add("free"),fast?120:350);
 setTimeout(()=>{v.removeAttribute("src");v.load();el.remove()},(fast?FADE/2:FADE)+150)};
btn.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();btn.disabled=true;finish(1,1)});
addEventListener("keydown",e=>{if(e.key==="Escape"&&!done)finish(1,1)});
v.muted=true;v.defaultMuted=true;
const rate=()=>{v.defaultPlaybackRate=SPEED;v.playbackRate=SPEED};rate();
["loadedmetadata","playing"].forEach(n=>v.addEventListener(n,rate));
/* qualquer sinal de vida do vídeo zera o relógio de inatividade */
const alive=()=>{idle=0};
["loadstart","progress","loadedmetadata","loadeddata","canplay","canplaythrough","timeupdate","playing"].forEach(n=>v.addEventListener(n,alive));
v.addEventListener("playing",()=>{started=1;if(play){play.remove();play=null}});
tick=setInterval(()=>{if(!document.hidden&&!play){idle+=500;if(idle>=IDLE)finish(0,1)}},500);
v.addEventListener("ended",()=>{hold=setTimeout(()=>finish(1),HOLD)});
v.addEventListener("error",()=>finish(0,1));
/* navegador que bloqueia o autoplay (ex.: economia de energia): oferece um toque para assistir; sem toque, segue para o site */
const blocked=()=>{if(done||play)return;play=document.createElement("button");play.type="button";play.className="intro-play";play.textContent="Assistir abertura";
 play.addEventListener("click",e=>{e.stopPropagation();play.disabled=true;const p=v.play();if(p&&p.catch)p.catch(()=>finish(0,1))});el.appendChild(play);
 setTimeout(()=>{if(!started)finish(0,1)},6000)};
const go=()=>{try{const p=v.play();if(p&&p.catch)p.catch(e=>{if(e&&e.name==="NotAllowedError")blocked();else if(!started&&e&&e.name!=="AbortError")finish(0,1)})}catch(e){finish(0,1)}};
if(!v.getAttribute("src"))v.src=v.getAttribute("data-src");
go();
})();
