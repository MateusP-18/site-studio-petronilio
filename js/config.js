/* Fonte única dos dados editáveis do site. Campos vazios aparecem como "A confirmar".
   SERVIÇOS: cada grupo vira um dos 4 botões de categoria e, ao abrir, mostra o painel com os itens/preços e 2 fotos (imagens[].r = altura/largura da foto). A ordem do array é a ordem dos botões. Cada item tem um "id" estável (usado na seleção de serviços para o agendamento): não mude o id de um item já publicado e dê um id novo e único a cada item que criar. Em grupos com "colunas" (tabela por comprimento), "abaixoDasFotos: N" manda os itens a partir do N-ésimo (contando de 0) para a área abaixo das fotos; a ordem e o conteúdo não mudam.
   MOLDURAS: para colocar uma foto, salve o arquivo em assets/img/ e preencha "img" (ex.: "assets/img/cabelo-1.webp") e "alt".
   Sem "img", o espaço mostra uma moldura reservada. Proporções: círculos 1:1, contato 4:3 (1200x900). */
window.STUDIO = {
  heroGlass: false, // efeito de portal (Glass Reveal) do hero: guardado, desligado por enquanto. Veja a seção "Hero" do README para reativar.
  // Fundo "Dither Wave" da seção de serviços (js/dither.js). Mesmos nomes de parâmetros do componente React Bits Pro.
  // primaryColor = cor real do fundo da seção, secondaryColor = tom mais escuro dela (cor das ondas); opacity controla a transparência das ondas; waveWidth = espessura das linhas das ondas; waveSpacing = quantidade de linhas; dotDensity = quantos pontos acendem ao longo delas; maxFPS limita o custo; pauseWhenOffscreen:true só anima com a seção à vista; ativo:false desliga.
  dither: { ativo: true, speed: 0.6, intensity: 2.5, scale: 10, downScale: 0.25, primaryColor: "#ebe4d7", secondaryColor: "#cdbf9f", opacity: 0.25, waveWidth: 0.2, waveSpacing: 1, dotDensity: 0.9, maxFPS: 30, pauseWhenOffscreen: true },
  nome: "Studio Petronilio",
  slogan: "Descubra sua melhor versão",
  whatsapp: "5585987483358", // DDI+DDD+número: (85) 98748-3358 (o 9º dígito do celular é necessário no link do WhatsApp)
  whatsappConfirmado: true, // número informado pelo cliente como telefone/WhatsApp oficial
  mapsUrl: "https://maps.app.goo.gl/PBK13RnUScbn2qfy5", // link do pin enviado pelo cliente; o mapa da seção Contato usa as coordenadas abaixo
  mapaLat: -4.258995, mapaLng: -38.932481, // coordenadas do pin (do redirecionamento do link acima)
  endereco: "Ver localização no Google Maps", // o link enviado é só um pin (sem rua/número); para mostrar o endereço por extenso, troque este texto (ele continua sendo um link para o mapa)
  telefone: "(85) 98748-3358",
  horarios: ["Segunda a sábado, das 9h às 17h"],
  redes: { instagram: "https://instagram.com/studiopetronilio?dlrf=M21hem1qa2Y2bGMw", facebook: "" }, // URLs completas; vazio = oculto
  mensagemPadrao: "Olá! Gostaria de saber mais sobre os serviços do Studio Petronilio e verificar a disponibilidade para um agendamento.",
  grupos: [
    { id: "cabelo", titulo: "Cabelos", imagens: [{ img: "assets/img/servico-coloracao-complementar.webp", alt: "Mulher de cabelo ruivo recebendo coloração com pincel e papel-alumínio", r: 1 }, { img: "assets/img/servico-alisamento-escova.webp", alt: "Cabelo castanho liso sendo finalizado com prancha", r: 1.002 }], itens: [
      { id: "cabelo-corte", nome: "Corte", valor: "R$ 50,00" },
      { id: "cabelo-escova-simples", nome: "Escova simples", valor: "A partir de R$ 50,00" },
      { id: "cabelo-coloracao", nome: "Coloração", valor: "R$ 70,00 o tubo" },
      { id: "cabelo-botox", nome: "Botox", valor: "A partir de R$ 130,00" },
      { id: "cabelo-inteligente", nome: "Inteligente", valor: "A partir de R$ 150,00" },
      { id: "cabelo-alisamento-vegano", nome: "Alisamento vegano", valor: "A partir de R$ 200,00" },
      { id: "cabelo-mechas", nome: "Mechas", valor: "A partir de R$ 350,00", aviso: "Exige teste de mecha." },
      { id: "cabelo-moreno-iluminado", nome: "Moreno iluminado", valor: "A partir de R$ 350,00", aviso: "Exige teste de mecha." }
    ] },
    { id: "protocolos", titulo: "Tratamentos capilares", imagens: [{ img: "assets/img/servico-tratamento-capilar.webp", alt: "Mulher relaxada no lavatório recebendo tratamento no couro cabeludo", r: 1.002 }, { img: "assets/img/servico-coloracao-mechas.webp", alt: "Cabelo castanho sendo tratado com pincel e papel-alumínio", r: 1.002 }],
      abaixoDasFotos: 6, nota: "Os valores variam conforme o comprimento do cabelo: curto, médio ou longo.", colunas: ["Curto", "Médio", "Longo"], itens: [
      { id: "protocolos-detox-argila", nome: "Detox Capilar com Argila", valores: ["R$ 100,00", "R$ 120,00", "R$ 140,00"] },
      { id: "protocolos-argila-nutricao", nome: "Argila & Nutrição Capilar", valores: ["R$ 120,00", "R$ 140,00", "R$ 160,00"] },
      { id: "protocolos-loreal-absolut-repair", nome: "L'Oréal Absolut Repair", valores: ["R$ 110,00", "R$ 130,00", "R$ 150,00"] },
      { id: "protocolos-loreal-pro-longer", nome: "L'Oréal Pro Longer", valores: ["R$ 110,00", "R$ 130,00", "R$ 150,00"] },
      { id: "protocolos-wella-oil-reflections", nome: "Wella Oil Reflections", valores: ["R$ 85,00", "R$ 100,00", "R$ 120,00"] },
      { id: "protocolos-wella-nutri-enrich", nome: "Wella Nutri-Enrich", valores: ["R$ 75,00", "R$ 90,00", "R$ 110,00"] },
      { id: "protocolos-truss-miracle", nome: "Truss Miracle", valores: ["R$ 75,00", "R$ 90,00", "R$ 110,00"] },
      { id: "protocolos-cauterizacao", nome: "Cauterização", valores: ["A partir de R$ 100,00", "A partir de R$ 100,00", "A partir de R$ 100,00"], aviso: "O valor varia conforme o comprimento e o volume do cabelo." }
    ] },
    { id: "maquiagem", titulo: "Maquiagem e penteados", imagens: [{ img: "assets/img/servico-penteados.webp", alt: "Mulher de costas com penteado preso e ondas soltas em cabelo castanho com luzes", r: 1.01 }, { img: "assets/img/servico-maquiagem.webp", alt: "Mulher sendo maquiada com pincel no rosto", r: 1.01 }], itens: [
      { id: "maquiagem-maquiagem", nome: "Maquiagem", valor: "A partir de R$ 80,00" },
      { id: "maquiagem-penteados", nome: "Penteados", valor: "A partir de R$ 70,00" }
    ] },
    { id: "unhas", titulo: "Unhas e sobrancelhas", imagens: [{ img: "assets/img/servico-unhas.webp", alt: "Manicure aplicando esmalte rosa nas unhas de uma cliente", r: 1.005 }, { img: "assets/img/servico-sobrancelhas.webp", alt: "Mulher fazendo o design de sobrancelhas com pincel", r: 1.005 }], itens: [
      { id: "unhas-mao-pe", nome: "Unha de mão e pé", valor: "R$ 50,00" },
      { id: "unhas-sobrancelha-simples", nome: "Designer de sobrancelha simples", valor: "R$ 20,00" }
    ] }
  ],
  imagens: { contato: { img: "", alt: "" } },
  // GALERIA + AVALIAÇÕES (seção "Galeria e avaliações"): cada item liga UMA foto a UMA avaliação; o carrossel mostra
  // a avaliação do item que está em destaque. As 11 fotos (assets/img/galeria-01..11.webp) são recortes de uma montagem
  // enviada pelo estúdio e os nomes/avaliações são FICTÍCIOS (exemplo: true marca o item como fictício; não aparece aviso na tela).
  // Para publicar conteúdo real, em cada item: troque img/alt e o texto, coloque exemplo: false e, SOMENTE se a cliente
  // autorizar, nome e nota (1 a 5). Sem nome/nota, nada aparece. pos = enquadramento vertical da foto no quadro (0 a 100%).
  galeria: [
    { id: "g01", titulo: "Maquiagem", img: "assets/img/galeria-01.webp", alt: "Mulher de cabelo curto grisalho recebendo maquiagem nos olhos", cor: 0, pos: "35%",
      depoimento: { exemplo: true, nota: 5, nome: "Helena M.", texto: "Fui atendida com muita calma e carinho. A maquiagem valorizou meus traços sem pesar, e o acabamento durou a festa inteira." } },
    { id: "g02", titulo: "Protocolos capilares", img: "assets/img/galeria-02.webp", alt: "Mulher de cabelo cacheado preto e longo, olhando para a câmera", cor: 1, pos: "15%",
      depoimento: { exemplo: true, nota: 5, nome: "Aline S.", texto: "Meus cachos nunca estiveram tão definidos e macios. Explicaram cada etapa do protocolo e senti que cuidaram do meu cabelo de verdade." } },
    { id: "g03", titulo: "Mechas", img: "assets/img/galeria-03.webp", alt: "Mulher de cabelo loiro ondulado com mechas luminosas, durante a maquiagem", cor: 2, pos: "18%",
      depoimento: { exemplo: true, nota: 5, nome: "Camila D.", texto: "As mechas ficaram naturais e cheias de luz, exatamente como eu imaginava. Saí me sentindo ainda mais eu." } },
    { id: "g04", titulo: "Maquiagem", img: "assets/img/galeria-04.webp", alt: "Mulher de cabelo cacheado castanho recebendo maquiagem nos lábios", cor: 3, pos: "30%",
      depoimento: { exemplo: true, nota: 5, nome: "Renata A.", texto: "Fiz a maquiagem para o casamento da minha irmã e amei o acabamento dos lábios. Atendimento humano e muito atencioso." } },
    { id: "g05", titulo: "Coloração", img: "assets/img/galeria-05.webp", alt: "Mulher de cabelo castanho com mechas douradas e maquiagem completa", cor: 4, pos: "30%",
      depoimento: { exemplo: true, nota: 5, nome: "Beatriz N.", texto: "Queria um tom mais quente sem perder a saúde dos fios. O cabelo ficou macio, a cor ficou sofisticada e a pele, iluminada." } },
    { id: "g06", titulo: "Maquiagem", img: "assets/img/galeria-06.webp", alt: "Mulher de cabelo liso preto deitada na cadeira, em preparação de pele antes da maquiagem", cor: 5, pos: "40%",
      depoimento: { exemplo: true, nota: 4, nome: "Yuri T.", texto: "A preparação da pele foi um momento de relaxar. Cuidadoso e sem pressa, e a make durou o dia todo." } },
    { id: "g07", titulo: "Sobrancelha", img: "assets/img/galeria-07.webp", alt: "Mulher de cabelo liso preto recebendo design de sobrancelha", cor: 0, pos: "40%",
      depoimento: { exemplo: true, nota: 5, nome: "Larissa O.", texto: "O design respeitou o formato do meu rosto. Meu olhar ficou mais aberto e natural, sem exagero." } },
    { id: "g08", titulo: "Maquiagem", img: "assets/img/galeria-08.webp", alt: "Mulher de cabelo curto grisalho e cacheado recebendo blush no rosto", cor: 1, pos: "50%",
      depoimento: { exemplo: true, nota: 5, nome: "Marta A.", texto: "Achei que ninguém ia me ouvir com paciência. Aqui cuidaram da minha maquiagem com respeito e delicadeza, e me senti linda." } },
    { id: "g09", titulo: "Coloração", img: "assets/img/galeria-09.webp", alt: "Mulher de cabelo cacheado ruivo olhando por cima do ombro", cor: 2, pos: "35%",
      depoimento: { exemplo: true, nota: 5, nome: "Júlia F.", texto: "Queria um ruivo vibrante nos meus cachos e o resultado superou. A cor tem brilho e os cachos continuam saudáveis." } },
    { id: "g10", titulo: "Maquiagem", img: "assets/img/galeria-10.webp", alt: "Mulher de cabelo curto crespo recebendo máscara de cílios", cor: 3, pos: "18%",
      depoimento: { exemplo: true, nota: 4, nome: "Tainá R.", texto: "É raro alguém acertar a base para o meu tom de pele. Aqui acertaram de primeira, e os cílios ficaram impecáveis." } },
    { id: "g11", titulo: "Maquiagem", img: "assets/img/galeria-11.webp", alt: "Mulher de cabelo cacheado volumoso com maquiagem completa e batom marcante", cor: 4, pos: "45%",
      depoimento: { exemplo: true, nota: 5, nome: "Isabela C.", texto: "Batom marcante e pele perfeita para a minha festa. Recebi elogios a noite toda e ainda me trataram com muito carinho." } }
  ]
};
