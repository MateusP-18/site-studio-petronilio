(()=>{const S=window.STUDIO,$=(q,e=document)=>e.querySelector(q),$$=(q,e=document)=>[...e.querySelectorAll(q)];
const num=(S.whatsapp||"").replace(/\D/g,""),rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
const msg=s=>s?`Olá! Tenho interesse em ${s.toLowerCase()} no ${S.nome} e gostaria de verificar a disponibilidade para um agendamento.`:S.mensagemPadrao;
const wl=m=>`https://wa.me/${num}?text=${encodeURIComponent(m)}`;
const G=Object.fromEntries(S.grupos.map(g=>[g.id,g])),fr=(o,w,h)=>o.img?`<img src="${o.img}" alt="${o.alt||""}" width="${w}" height="${h}" loading="lazy">`:"";
const av=i=>i.aviso?`<em class="av">${i.aviso}</em>`:"";
const ck='<span class="sx-ck" aria-hidden="true"></span>';
const ul=g=>`<ul>${g.itens.map(i=>`<li data-sid="${i.id}"><button type="button" class="sx-it" aria-pressed="false">${ck}<span class="sx-nm">${i.nome}</span><i></i><b>${i.valor}</b>${av(i)}</button></li>`).join("")}</ul>`;
const slug=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
S.grupos.forEach(g=>g.itens.forEach(i=>{i.id=i.id||g.id+"-"+slug(i.nome)}));/* id estável de cada serviço (config.js); sem id, é gerado a partir do nome */
const tbl=(P,its)=>`<div class="proto"><table><caption class="sr">Valores por comprimento do cabelo</caption><thead><tr><th scope="col">Protocolo</th>${P.colunas.map(c=>`<th scope="col">${c}</th>`).join("")}</tr></thead><tbody>${its.map(i=>`<tr data-sid="${i.id}"><th scope="row"><button type="button" class="sx-it" aria-pressed="false">${ck}<span class="sx-nm">${i.nome}</span><i></i>${av(i)}</button></th>${i.valores.map((v,k)=>`<td data-l="${P.colunas[k]}"><i class="ld"></i><span>${v}</span></td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
/* Serviços: 4 categorias sempre visíveis (botões); a ativa abre um painel na largura toda abaixo da grade. Uma por vez; clicar na ativa recolhe. */
const IC={cabelo:'<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8 7.5 20 18M8 16.5 20 6"/>',protocolos:'<path d="M12 3c3.5 4.2 6 7.2 6 10.5a6 6 0 0 1-12 0C6 10.2 8.5 7.2 12 3Z"/><path d="M9.5 14.5a2.6 2.6 0 0 0 2.5 2"/>',maquiagem:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="M19 16v4M17 18h4"/>',unhas:'<rect x="8" y="11" width="8" height="10" rx="2"/><path d="M10 11V8.5h4V11M11 8.5V3h2v5.5"/>'};
const fig=i=>`<figure${i.img?"":' class="empty" aria-hidden="true"'}>${i.img?`<img data-src="${i.img}" alt="${i.alt||""}" width="${Math.round(1000/i.r)}" height="1000" decoding="async">`:""}</figure>`;
const panel=g=>{const cta=`<div class="sx-cta" aria-live="polite"><a class="lnk" href="#contato" data-wa data-svc="${g.titulo}">Agendar ${g.titulo.toLowerCase()}</a></div>`,ph=`<div class="sx-ph">${g.imagens.map(fig).join("")}</div>`,hd=`<section class="sx-panel${g.colunas?" split":""}" id="pn-${g.id}" role="region" aria-labelledby="tab-${g.id}" hidden>`;
 if(!g.colunas)return `${hd}<div class="sx-info"><h3>${g.titulo}</h3>${ul(g)}${cta}</div>${ph}</section>`;
 /* tabela por comprimento: os primeiros itens ficam na coluna de informações; a partir de "abaixoDasFotos" ficam abaixo das fotos (mesma ordem, nada duplicado) */
 const k=g.abaixoDasFotos>0?g.abaixoDasFotos:g.itens.length,A=g.itens.slice(0,k),B=g.itens.slice(k);
 return `${hd}<div class="sx-info"><h3>${g.titulo}</h3><p class="sub">${g.nota}</p>${tbl(g,A)}${cta}</div><div class="sx-r">${ph}${B.length?tbl(g,B):""}</div></section>`};
$("#svc").innerHTML=`<div class="sx-tabs" role="group" aria-label="Categorias de serviços">${S.grupos.map((g,k)=>`<div class="sx-c rv" style="--d:${(k*.08).toFixed(2)}s"><button type="button" class="sx-tab" id="tab-${g.id}" aria-expanded="false" aria-controls="pn-${g.id}"><svg viewBox="0 0 24 24" aria-hidden="true">${IC[g.id]||""}</svg><span class="sx-tt"><b>${g.titulo}</b><small class="sx-sm">${g.itens.length} ${g.itens.length>1?"serviços":"serviço"}</small></span><i class="sx-pm" aria-hidden="true"></i></button></div>`).join("")}</div><div class="sx-drawer"><div class="sx-clip">${S.grupos.map(panel).join("")}</div></div>`;
/* Seleção de serviços para o agendamento: vários itens, de qualquer categoria; mantida ao trocar de categoria.
   A chamada "Agendar ..." de cada categoria mostra os serviços marcados (na ordem em que foram marcados); sem seleção volta à frase original. */
{const sel=new Set(),info={};S.grupos.forEach(g=>g.itens.forEach(i=>{info[i.id]={nome:i.nome}}));
const lista=a=>a.length<2?a.join(""):a.slice(0,-1).join(", ")+" e "+a[a.length-1];
$$(".sx-panel .lnk").forEach(a=>{a.dataset.t0=a.textContent});$$(".sx-sm").forEach(s=>{s.dataset.t0=s.textContent});
const sync=()=>{const nm=[...sel].map(id=>info[id].nome),n=nm.length,pl=n>1,
  txt=n?`Agendar ${pl?"serviços":"serviço"}: ${lista(nm)}.`:"",
  wa=n?`Olá! Tenho interesse em agendar ${pl?"os serviços":"o serviço"}: ${lista(nm)}, no ${S.nome}, e gostaria de verificar a disponibilidade para um agendamento.`:"";
 $$("[data-sid]").forEach(e=>{const on=sel.has(e.dataset.sid);e.classList.toggle("sel",on);$(".sx-it",e).setAttribute("aria-pressed",on)});
 $$(".sx-panel").forEach(p=>{const a=$(".lnk",p);a.textContent=n?txt:a.dataset.t0;if(num)a.href=wl(n?wa:msg(a.dataset.svc));
  const g=p.id.slice(3),c=$$("[data-sid].sel",p).length,s=$("#tab-"+g+" .sx-sm");s.textContent=s.dataset.t0+(c?` · ${c} selecionado${c>1?"s":""}`:"")})};
$("#svc").addEventListener("click",e=>{const r=e.target.closest("[data-sid]");if(!r)return;const id=r.dataset.sid;sel.has(id)?sel.delete(id):sel.add(id);sync()});
sync()}
{const dr=$(".sx-drawer"),clip=$(".sx-clip"),tabs=$$(".sx-tab"),pns=$$(".sx-panel");let cur=null,tok=0,fin=0;
/* as fotos só são baixadas quando a categoria é aberta (ou quando o visitante se aproxima do botão) */
const load=id=>$$("img[data-src]",$("#pn-"+id)).forEach(i=>{i.src=i.dataset.src;i.removeAttribute("data-src")});
tabs.forEach(t=>{const id=t.id.slice(4),w=()=>load(id);t.addEventListener("pointerenter",w,{passive:true});t.addEventListener("focus",w)});
const show=id=>{const my=++tok,vis=pns.find(p=>!p.hidden);cur=id;
 tabs.forEach(t=>{const on=t.id==="tab-"+id;t.classList.toggle("on",on);t.setAttribute("aria-expanded",on)});
 if(id)load(id);
 const run=()=>{if(my!==tok)return;const next=id?$("#pn-"+id):null,h0=dr.offsetHeight;clearTimeout(fin);
  dr.style.height=h0+"px";pns.forEach(p=>{if(p!==next){p.hidden=true;p.classList.remove("out")}});
  if(next){next.hidden=false;next.classList.remove("in");void next.offsetWidth;next.classList.add("in")}
  const h1=next?clip.offsetHeight:0;void dr.offsetHeight;dr.style.height=h1+"px";
  fin=setTimeout(()=>{if(my===tok)dr.style.height=next?"auto":"0px"},rm?30:700);
  if(next){const r=dr.getBoundingClientRect();if(r.top>innerHeight*.6)scrollBy({top:r.top-(h.getBoundingClientRect().bottom+$(".sx-tabs").offsetHeight+12),behavior:rm?"auto":"smooth"})}};
 if(vis&&!rm){vis.classList.add("out");setTimeout(run,150)}else run()};
tabs.forEach(t=>t.addEventListener("click",()=>show(cur===t.id.slice(4)?null:t.id.slice(4))))}
$$("[data-img]").forEach(e=>{const o=S.imagens[e.dataset.img];if(o&&o.img){e.classList.remove("empty");e.removeAttribute("aria-hidden");e.insertAdjacentHTML("afterbegin",fr(o,1200,900))}});
const ic={instagram:'<path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7Zm5 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM17.3 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/>',facebook:'<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8Z"/>'};
const so=Object.entries(S.redes).filter(([,u])=>u);
$("#soc").innerHTML=so.length?so.map(([k,u])=>`<a href="${u}" target="_blank" rel="noopener" aria-label="${k}"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">${ic[k]||""}</svg></a>`).join(""):'<span class="tbd">Redes sociais a confirmar</span>';
const toast=t=>{let e=$(".toast");if(!e){e=document.createElement("div");e.className="toast";e.setAttribute("role","status");document.body.append(e)}e.textContent=t;e.classList.add("on");clearTimeout(e.t);e.t=setTimeout(()=>e.classList.remove("on"),3800)};
$$("[data-wa]").forEach(a=>{if(num){a.href=wl(msg(a.dataset.svc));a.target="_blank";a.rel="noopener"}else a.addEventListener("click",e=>{e.preventDefault();toast("Número do WhatsApp ainda não configurado (js/config.js).")})});
if(!num)console.info("Studio Petronilio: defina STUDIO.whatsapp em js/config.js");
$$("[data-f]").forEach(e=>{let v=S[e.dataset.f];if(Array.isArray(v))v=v.join(" · ");if(e.dataset.f==="whatsapp"&&v){const d=v.replace(/\D/g,"");if(d.length===13)v=`+${d.slice(0,2)} (${d.slice(2,4)}) ${d.slice(4,9)}-${d.slice(9)}`;if(!S.whatsappConfirmado)v+=" (a confirmar)"}e.textContent=v||"A confirmar";e.classList.toggle("tbd",!v)});
$$("[data-lnk=maps]").forEach(e=>{if(!S.endereco)return;const a=document.createElement("a");a.textContent=e.textContent;e.textContent="";e.classList.remove("tbd");e.appendChild(a);a.setAttribute("data-maps","")});
/* Mapa do Contato: iframe do Google Maps (alfinete nas coordenadas do cliente) coberto por um link transparente: clicar em qualquer ponto abre a localização no Google Maps */
{const mp=$("#mapa");if(mp&&S.mapaLat!=null&&S.mapaLng!=null){const q=`${S.mapaLat},${S.mapaLng}`;
 mp.innerHTML=`<span class="mapa-fb" aria-hidden="true"></span><iframe title="Mapa com a localização do Studio Petronilio" src="https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=17&hl=pt-BR&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" tabindex="-1" aria-hidden="true"></iframe><a class="mapa-ov" data-maps href="#contato" aria-label="Abrir a localização do Studio Petronilio no Google Maps (abre em nova aba)"><span>Abrir no Google Maps</span></a>`}}
$$("[data-maps]").forEach(a=>{a.href=S.mapsUrl;a.target="_blank";a.rel="noopener"});
$("#ano").textContent=new Date().getFullYear();
const fm=$("#fm"),fs=$("#fs");/* campo de mensagem: sem alça de redimensionar; cresce com o texto (uma linha a mais por vez) até o limite do CSS (max-height), depois rola por dentro */
{const t=$("#fmsg"),grow=()=>{t.style.height="auto";t.style.height=(t.scrollHeight+t.offsetHeight-t.clientHeight)+"px"};t.addEventListener("input",grow);addEventListener("resize",grow);grow()}
fm.onsubmit=e=>{e.preventDefault();const n=$("#fn"),m=$("#fmsg"),bad=!n.value.trim()||!m.value.trim();[n,m].forEach(i=>i.setAttribute("aria-invalid",!i.value.trim()));
if(bad){fs.textContent="Preencha seu nome e a mensagem.";return}
if(!num){fs.textContent="O envio pelo WhatsApp será ativado quando o número oficial for configurado.";return}
fs.textContent="Abrindo o WhatsApp…";open(wl(`Olá! Meu nome é ${n.value.trim()}. ${m.value.trim()}`),"_blank","noopener")};
const h=$("header"),mb=$(".menu"),nav=$("#nav");
const sc=()=>{h.classList.toggle("s",scrollY>30)};sc();
let t;addEventListener("scroll",()=>{t||(t=requestAnimationFrame(()=>{t=0;sc()}))},{passive:true});
const tg=o=>{nav.classList.toggle("open",o);h.classList.toggle("o",o);mb.setAttribute("aria-expanded",o);mb.setAttribute("aria-label",o?"Fechar menu":"Abrir menu");document.body.style.overflow=o?"hidden":""};
mb.onclick=()=>tg(!nav.classList.contains("open"));$$("#nav a").forEach(a=>a.addEventListener("click",()=>tg(false)));
addEventListener("keydown",e=>{if(e.key==="Escape")tg(false)});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
$$(".rv,.stg").forEach(e=>io.observe(e));
/* cartões "diferenciais" (seção Sobre): brilho que segue o ponteiro (só com mouse) */
$$(".dif li").forEach(l=>l.addEventListener("pointermove",e=>{if(e.pointerType!=="mouse")return;const r=l.getBoundingClientRect();l.style.setProperty("--mx",(e.clientX-r.left)+"px");l.style.setProperty("--my",(e.clientY-r.top)+"px")}));
/* foto da seção Sobre: leve paralaxe enquanto está na tela */
{const fx=$(".pic.fx");if(fx&&!rm){let on=0,t=0;const upd=()=>{t=0;const r=fx.getBoundingClientRect(),vh=innerHeight,p=Math.max(-1,Math.min(1,((r.top+r.height/2)-vh/2)/(vh/2+r.height/2)));fx.style.setProperty("--p",p.toFixed(3))};
new IntersectionObserver(es=>{on=es[0].isIntersecting;if(on)upd()},{rootMargin:"10% 0px"}).observe(fx);
addEventListener("scroll",()=>{if(on&&!t)t=requestAnimationFrame(upd)},{passive:true})}}
/* botões: ondinha suave no ponto do toque/clique */
document.addEventListener("pointerdown",e=>{const b=e.target.closest&&e.target.closest(".btn");if(!b||rm)return;const r=b.getBoundingClientRect(),s=document.createElement("span");s.className="rip";s.style.left=(e.clientX-r.left)+"px";s.style.top=(e.clientY-r.top)+"px";b.appendChild(s);setTimeout(()=>s.remove(),700)});
})();
