"""Gera ../teste-cabelo.html: página única só com o efeito de cabelo, para testar. Uso: python3 tools/build-demo.py"""
import base64,pathlib
r=pathlib.Path(__file__).resolve().parent.parent
img='data:image/webp;base64,'+base64.b64encode((r/'assets/img/cabelo.webp').read_bytes()).decode()
js=(r/'js/hair.js').read_text()
h='''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Teste: efeito de cabelo | Studio Petronilio</title>
<style>*{box-sizing:border-box;margin:0}body{font:16px/1.6 system-ui,sans-serif;background:#F8F6F1;color:#383833}
.band{position:relative;isolation:isolate;overflow:clip;touch-action:pan-y;height:clamp(300px,60vw,560px);display:grid;place-items:center;text-align:center;color:#fff}
.band::before{content:"";position:absolute;inset:0;z-index:-1;background:rgba(34,26,20,.3)}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2;transform:scale(1.064)}
canvas{position:absolute;inset:0;width:100%;height:100%;z-index:-2;opacity:0;transition:opacity .5s}.gl canvas{opacity:1}
.band p{pointer-events:none;font:500 1.6rem Georgia,serif;padding:0 1rem;text-shadow:0 1px 14px rgba(0,0,0,.4)}
#st{padding:1.2rem;text-align:center;max-width:42rem;margin:auto}#st a{color:#5d6856}</style></head><body>
<section class="band" data-hair><img class="bg" src="'''+img+'''" alt="" width="1672" height="941"><canvas aria-hidden="true"></canvas><p>Passe o mouse ou arraste o dedo sobre o cabelo</p></section>
<p id="st" role="status" aria-live="polite">Verificando…</p>
<script>window.__hairForce=/forcar/.test(location.search)</script>
<script>'''+js+'''</script>
<script>addEventListener("load",()=>setTimeout(()=>{const b=document.querySelector("[data-hair]"),s=document.getElementById("st"),rm=!window.__hairForce&&matchMedia("(prefers-reduced-motion:reduce)").matches;
if(b.classList.contains("gl"))s.textContent="Efeito ativo: mova o mouse ou arraste o dedo sobre a imagem.";
else if(rm)s.innerHTML='O sistema está com "movimento reduzido" ativado, então o efeito foi desligado de propósito. <a href="?forcar">Testar mesmo assim</a>';
else s.textContent="WebGL não ativou neste navegador ou visualizador. Abra o arquivo no Chrome ou no Safari."},900))</script></body></html>'''
(r.parent/'teste-cabelo.html').write_text(h);print('ok',len(h)//1024,'KB')
