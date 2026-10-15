"""Gera ../studio-petronilio.html (arquivo único, com CSS, JS e imagens embutidos). Uso: python3 tools/build-standalone.py"""
import re,base64,mimetypes,pathlib
r=pathlib.Path(__file__).resolve().parent.parent
h=(r/'index.html').read_text()
css=(r/'css/styles.css').read_text().replace('../assets/','assets/');js=''.join((r/'js'/f).read_text()+'\n' for f in ('intro.js','config.js','main.js','hair.js','glass.js','gallery.js','dither.js'))
h=h.replace('<link rel="stylesheet" href="css/styles.css">',lambda_:=None) if False else h.replace('<link rel="stylesheet" href="css/styles.css">','<style>'+css+'</style>')
h=h.replace('<script src="js/intro.js"></script>\n<script src="js/config.js"></script>\n<script src="js/main.js"></script>\n<script src="js/hair.js"></script>\n<script src="js/glass.js"></script>\n<script src="js/gallery.js"></script>\n<script src="js/dither.js"></script>','<script>'+js+'</script>')
def uri(m):
    p=r/m.group(0)
    if not p.is_file():return m.group(0)
    return 'data:%s;base64,%s'%(mimetypes.guess_type(str(p))[0],base64.b64encode(p.read_bytes()).decode())
h=re.sub(r'assets/[\w./-]+\.(?:png|svg|webp|woff2?|otf|ttf|mp4)',uri,h)
(r.parent/'studio-petronilio.html').write_text(h);print('ok',len(h)//1024,'KB')
