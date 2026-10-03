export const CAT_LABEL = {
  todas: 'Todas as peças',
  novidades: 'Novidades',
  basicas: 'Básicas',
  blusas: 'Blusas e regatas',
  tshirts: 'T-shirts',
  calcas: 'Calças',
  conjuntos: 'Conjuntos',
  shorts: 'Shorts',
  liquida: 'Liquida −15%'
};

export const CATS = [
  { slug: 'novidades', name: 'Novidades', img: '/images/peplum.webp', badge: 'New In' },
  { slug: 'basicas', name: 'Básicas', img: '/images/regata-trio.webp' },
  { slug: 'blusas', name: 'Blusas', img: '/images/quadrado-amarela.webp' },
  { slug: 'calcas', name: 'Calças', img: '/images/wide-leg.webp' },
  { slug: 'conjuntos', name: 'Conjuntos', img: '/images/conjunto-bata.webp', badge: 'Alta Procura' },
  { slug: 'shorts', name: 'Shorts', img: '/images/shorts-linho.webp' },
  { slug: 'liquida', name: 'Liquida', img: '/images/trico.webp', tag: '−15% OFF' }
];

export const COL = {
  cacau: ['Cacau', '#6b4434'],
  off: ['Off-white', '#f3efe6'],
  marinho: ['Marinho', '#1f2540'],
  preto: ['Preto', '#1d1b1c'],
  branco: ['Branco', '#fbfbf9']
};

export const PRODUCTS = [
  {
    slug: 'blusa-peplum-lacinhos',
    name: 'Blusa Peplum Laçinhos',
    cats: ['novidades', 'blusas'],
    price: 89.9,
    imgs: ['/images/peplum.webp'],
    pos: '50% 35%',
    focus: ['30%', '22%'],
    colors: [
      ['Azul bebê', '#bfd5ec'],
      COL.branco,
      ['Rosa suave', '#f3bccb'],
      COL.preto
    ],
    sizes: ['Único'],
    stock: 4,
    badge: 'Lançamento',
    rating: 4.9,
    reviewsCount: 38,
    composition: '92% Poliamida, 8% Elastano',
    bullets: ['Laçinhos ajustáveis na alça', 'Franzido que modela a cintura', 'Tamanho único (veste do 36 ao 42)', 'Tecido respirável de toque sedoso'],
    desc: 'Lançamento exclusivo da casa: peplum romântica com delicados laçinhos na alça e franzido que valoriza o corpo com conforto impecável. Combina perfeitamente com alfaiataria, jeans premium e pantalonas fluidas.'
  },
  {
    slug: 'regata-poliamida',
    name: 'Regata Poliamida com Forro Duplo',
    cats: ['basicas', 'blusas'],
    price: 49.9,
    imgs: ['/images/regata-cacau.webp', '/images/regata-trio.webp'],
    pos: '50% 30%',
    focus: ['50%', '48%'],
    colors: [COL.cacau, COL.off, COL.marinho],
    sizes: ['Único'],
    stock: 3,
    badge: 'Reposição',
    rating: 5.0,
    reviewsCount: 84,
    composition: '90% Poliamida, 10% Elastano',
    bullets: ['Forro duplo zero transparência no busto', 'Toque gelado que não esquenta', 'Elasticidade com retorno perfeito', 'Veste com conforto até o G (44)'],
    desc: 'Nossa campeã de vendas: regata de poliamida tecnológica com forro duplo na região do busto, permitindo o uso sem sutiã com total segurança e sustentação. Aquela peça indispensável para o guarda-roupa inteligente.'
  },
  {
    slug: 'blusa-decote-quadrado',
    name: 'Blusa Decote Quadrado Minimal',
    cats: ['novidades', 'blusas', 'basicas'],
    price: 59.9,
    imgs: ['/images/quadrado-amarela.webp', '/images/quadrado-amarela-2.webp'],
    pos: '50% 30%',
    focus: ['50%', '38%'],
    colors: [
      ['Amarelo Manteiga', '#efe8a6'],
      COL.off,
      COL.preto
    ],
    sizes: ['Único'],
    stock: 6,
    badge: 'Tendência',
    rating: 4.8,
    reviewsCount: 29,
    composition: '93% Poliamida, 7% Elastano',
    bullets: ['Decote quadrado que alonga o colo', 'Manga clássica de alfaiataria casual', 'Toque aveludado e caimento reto', 'Combina com acessórios dourados'],
    desc: 'O decote quadrado traz uma elegância imediata a qualquer visual contemporâneo. Produzida em poliamida encorpada que não marca nem deforma ao longo do dia.'
  },
  {
    slug: 'regata-alca-larga',
    name: 'Regata Alça Larga Estruturada',
    cats: ['basicas', 'blusas'],
    price: 54.9,
    imgs: ['/images/regata-branca.webp'],
    pos: '50% 25%',
    focus: ['48%', '30%'],
    colors: [COL.branco, COL.preto, COL.cacau],
    sizes: ['Único'],
    stock: 8,
    rating: 4.9,
    reviewsCount: 42,
    composition: '90% Poliamida, 10% Elastano',
    bullets: ['Alças largas que cobrem a alça do sutiã', 'Decote sutil e sofisticado', 'Acabamento corte a laser na barra', 'Veste do P ao G com perfeição'],
    desc: 'Projetada para quem ama praticidade sem abrir mão de sofisticação: alças largas pensadas na medida exata para esconder alças de sutiã, com forro duplo no busto e elasticidade premium.'
  },
  {
    slug: 'regata-contraste-pb',
    name: 'Regata Canelada Contraste P&B',
    cats: ['basicas', 'blusas'],
    price: 59.9,
    imgs: ['/images/regata-pb.webp'],
    pos: '50% 40%',
    focus: ['62%', '34%'],
    colors: [COL.off, COL.preto],
    sizes: ['Único'],
    stock: 5,
    rating: 5.0,
    reviewsCount: 31,
    composition: '95% Algodão Canelado, 5% Elastano',
    bullets: ['Malha canelada de alta densidade', 'Acabamento contrastante estilo Old Money', 'Gola arredondada vintage', 'Não desbota e não encolhe'],
    desc: 'O clássico estilo parisiense com o contraste preto e branco. Uma peça chave de inspiração retrô chic que transforma qualquer look básico em uma produção editorial.'
  },
  {
    slug: 'tshirt-listrada-gola-rosa',
    name: 'T-shirt Listrada Gola Rosa Contrastante',
    cats: ['novidades', 'tshirts', 'blusas'],
    price: 69.9,
    imgs: ['/images/tshirt-listrada.webp'],
    pos: '50% 35%',
    focus: ['52%', '34%'],
    colors: [
      ['Listrado Areia & Rosa', '#a39a92']
    ],
    sizes: ['P', 'M', 'G'],
    stock: 6,
    badge: 'Novidade',
    rating: 4.9,
    reviewsCount: 19,
    composition: '100% Algodão Penteado Premium',
    bullets: ['Gola canelada rosa em contraste', 'Listras finas com alinhamento manual', 'Modelagem fluida e confortável', 'Algodão pré-encolhido macio'],
    desc: 'Listras náuticas revisitadas com um toque de doçura moderna: a gola em tom rosé/framboesa ilumina o rosto e confere jovialidade a calças jeans claras e shorts de alfaiataria.'
  },
  {
    slug: 'tshirt-oversized-listrada',
    name: 'T-shirt Oversized Listrada Marinho',
    cats: ['tshirts', 'blusas'],
    price: 74.9,
    imgs: ['/images/oversized.webp'],
    pos: '50% 35%',
    focus: ['50%', '40%'],
    colors: [
      ['Azul Marinho Náutico', '#27304f']
    ],
    sizes: ['P', 'M', 'G'],
    stock: 2,
    badge: 'Poucas Peças',
    rating: 4.9,
    reviewsCount: 27,
    composition: '100% Algodão Premium Fio 30.1',
    bullets: ['Caimento solto streetwear elegante', 'Gola grossa em ribana reforçada', 'Ombros caídos no estilo oversized', 'Listras atemporais'],
    desc: 'A queridinha do momento: corte amplo e despretensioso que combina com calças wide leg, bermudas de linho ou por dentro de saias fluidas. Elegância descomplicada.'
  },
  {
    slug: 'blusa-basica-poliamida',
    name: 'Blusa Básica Gola Alta Poliamida',
    cats: ['basicas', 'blusas'],
    price: 64.9,
    imgs: ['/images/basica-cacau.webp'],
    pos: '50% 30%',
    focus: ['55%', '45%'],
    colors: [COL.cacau, COL.preto, COL.off],
    sizes: ['Único'],
    stock: 7,
    rating: 4.8,
    reviewsCount: 36,
    composition: '90% Poliamida, 10% Elastano',
    bullets: ['Gola alta anatômica que não aperta', 'Manga curta elegante', 'Poliamida encorpada sem transparência', 'Ideal para sobreposições e dias amenos'],
    desc: 'Uma peça indispensável no guarda-roupa da mulher elegante. A gola alta anatômica confere postura e refinamento instantâneo tanto no ambiente de trabalho quanto no jantar casual.'
  },
  {
    slug: 'blusa-assimetrica',
    name: 'Blusa Assimétrica Drapeada Lateral',
    cats: ['novidades', 'blusas'],
    price: 69.9,
    imgs: ['/images/assimetrica.webp'],
    pos: '50% 30%',
    focus: ['50%', '38%'],
    colors: [
      ['Terracota / Telha', '#7e3a3a'],
      COL.preto
    ],
    sizes: ['Único'],
    stock: 3,
    badge: 'Reposição',
    rating: 5.0,
    reviewsCount: 45,
    composition: '92% Poliamida, 8% Elastano',
    bullets: ['Barra com corte assimétrico moderno', 'Franzido drapeado ajustável na lateral', 'Tecido com caimento fluido', 'Realça a linha do quadril'],
    desc: 'A assimetria está em alta nos principais editoriais de moda internacional. O franzido lateral permite ajustar o comprimento e cria um efeito óptico drapeado deslumbrante.'
  },
  {
    slug: 'calca-wide-leg-chocolate',
    name: 'Calça Wide Leg Chocolate Alfaiataria',
    cats: ['novidades', 'calcas'],
    price: 149.9,
    imgs: ['/images/wide-leg.webp'],
    pos: '50% 40%',
    focus: ['50%', '22%'],
    colors: [
      ['Marrom Chocolate Intenso', '#4b2a1f']
    ],
    sizes: ['36', '38', '40', '42', '44'],
    stock: 5,
    badge: 'Novidade',
    rating: 4.9,
    reviewsCount: 53,
    composition: '96% Crepe de Alfaiataria, 4% Elastano',
    bullets: ['Cintura alta com cós anatômico', 'Pernas amplas com caimento reto esvoaçante', 'Passantes para cinto estruturados', 'Bolsos faca funcionais'],
    desc: 'O tom chocolate é a cor do ano. Esta calça wide leg tem corte impecável de alfaiataria, alongando a silhueta com movimento elegante e tecido encorpado que não amassa fácil.'
  },
  {
    slug: 'calca-animal-print',
    name: 'Calça Animal Print com Faixa Lateral',
    cats: ['calcas'],
    price: 129.9,
    imgs: ['/images/animal-print.webp'],
    pos: '30% 40%',
    focus: ['30%', '30%'],
    colors: [
      ['Onça Clássica', '#a9783f']
    ],
    sizes: ['P', 'M', 'G'],
    stock: 4,
    rating: 4.8,
    reviewsCount: 22,
    composition: '100% Viscose Sarjada Premium',
    bullets: ['Estampa exclusiva de onça atemporal', 'Faixa esportiva lateral contrastante', 'Cós com elástico e cordão de ajuste', 'Bolsos laterais embutidos'],
    desc: 'O animal print ganha uma leitura esportiva sofisticada com a faixa lateral. Perfeita para usar com tênis e camiseta branca de dia, ou sandália e blazer preto à noite.'
  },
  {
    slug: 'calca-pantalona-listrada',
    name: 'Calça Pantalona Listrada Alongadora',
    cats: ['novidades', 'calcas'],
    price: 139.9,
    imgs: ['/images/pantalona.webp'],
    pos: '50% 40%',
    focus: ['46%', '26%'],
    colors: [
      ['Preto & Branco', '#2a2a2a']
    ],
    sizes: ['P', 'M', 'G'],
    stock: 6,
    badge: 'Novidade',
    rating: 5.0,
    reviewsCount: 39,
    composition: '100% Crepe Acetinado Leve',
    bullets: ['Listras verticais que alongam as pernas', 'Cós alto com laço decorativo', 'Tecido fluido que não esquenta', 'Caimento amplo e arejado'],
    desc: 'Se você ainda não tem uma pantalona listrada, este é o momento. A padronagem geométrica vertical alonga visualmente a silhueta, conferindo um ar imponente e chic.'
  },
  {
    slug: 'calca-poa',
    name: 'Calça Poá Vintage Ampla',
    cats: ['calcas'],
    price: 129.9,
    imgs: ['/images/poa.webp'],
    pos: '50% 50%',
    focus: ['52%', '46%'],
    colors: [
      ['Off-white com Bolinhas Pretas', '#efe8dc']
    ],
    sizes: ['P', 'M', 'G'],
    stock: 3,
    rating: 4.9,
    reviewsCount: 17,
    composition: '100% Viscose Lavada',
    bullets: ['Poá retrô atemporal', 'Cós com amarração delicada', 'Caimento super leve e fresco', 'Toque de seda no corpo'],
    desc: 'O poá nunca sai de moda. O caimento soltinho e fresco torna esta peça irresistível para passeios à beira-mar, almoços especiais e momentos de lazer com muito estilo.'
  },
  {
    slug: 'shorts-linho-bolsinhos',
    name: 'Shorts Linho com Bolsinhos Frontais',
    cats: ['novidades', 'shorts'],
    price: 79.9,
    imgs: ['/images/shorts-linho.webp'],
    pos: '55% 50%',
    focus: ['60%', '45%'],
    colors: [
      ['Rosa Pastel', '#f2b4c6'],
      ['Azul Sereno', '#9fc4e8'],
      ['Verde Oliva', '#8b9a5c']
    ],
    sizes: ['M', 'G'],
    stock: 6,
    rating: 4.8,
    reviewsCount: 28,
    composition: '70% Viscose, 30% Linho com Forro 100% Algodão',
    bullets: ['Linho rústico macio com forro interno', 'Bolsos utilitários frontais charmosos', 'Cós com elástico de conforto', 'Não pinica nem esquenta'],
    desc: 'A leveza do linho combinada com a praticidade dos bolsinhos frontais. Possui forro 100% algodão para assegurar total conforto e discrição em qualquer iluminação.'
  },
  {
    slug: 'conjunto-bata-shorts',
    name: 'Conjunto Bata com Bojo + Shorts Rodado',
    cats: ['novidades', 'conjuntos'],
    price: 159.9,
    imgs: ['/images/conjunto-bata.webp'],
    pos: '50% 35%',
    focus: ['48%', '38%'],
    colors: [
      ['Rosa Chiclete', '#f4a8bf']
    ],
    sizes: ['P', 'M', 'G'],
    stock: 2,
    badge: 'Lançamento',
    rating: 5.0,
    reviewsCount: 33,
    composition: '95% Crepe Duna, 5% Elastano',
    bullets: ['Bata com bojo estruturado integrado', 'Shorts soltinho que parece saia', 'Look coordenado pronto para arrasar', 'Tecido duna que não precisa passar'],
    desc: 'O conjunto mais desejado da estação. A bata conta com bojo que modela com delicadeza e o shorts possui corte rodado fluido que lembra uma saia godê feminina.'
  },
  {
    slug: 'conjunto-camisa-shorts-listrado',
    name: 'Conjunto Camisa Manga Curta + Shorts',
    cats: ['conjuntos', 'shorts'],
    price: 169.9,
    imgs: ['/images/conjunto-listrado.webp'],
    pos: '55% 45%',
    focus: ['56%', '46%'],
    colors: [
      ['Azul Céu Listrado', '#9dbfe1']
    ],
    sizes: ['P', 'M', 'G'],
    stock: 5,
    rating: 4.9,
    reviewsCount: 41,
    composition: '100% Algodão Texturizado',
    bullets: ['Camisa com abotoamento frontal madrepérola', 'Shorts com elástico e bolsos', 'Peças podem ser usadas separadas', 'Algodão leve e respirável'],
    desc: 'Look pronto com estética resort luxuosa: a camisa de mangas curtas e o shorts coordenado formam a produção ideal para viagens, finais de semana e reuniões de verão.'
  },
  {
    slug: 'legging-pezinho',
    name: 'Legging Pezinho Térmica Confort',
    cats: ['liquida', 'calcas'],
    price: 76.4,
    was: 89.9,
    imgs: ['/images/legging.webp'],
    pos: '50% 55%',
    focus: ['50%', '78%'],
    colors: [COL.preto],
    sizes: ['P', 'M', 'G'],
    stock: 4,
    badge: '−15% OFF',
    rating: 4.8,
    reviewsCount: 15,
    composition: '88% Poliamida, 12% Spandex',
    bullets: ['Alça de pezinho que fixa na sola', 'Cintura super alta com compressão média', 'Tecido térmico que não fica transparente', 'Liquidação especial de coleção'],
    desc: 'A clássica legging stirrup (com pezinho) que voltou com força total nos desfiles internacionais. Não sobe na canela, ideal para usar com mocassins, scarpins ou botas.'
  },
  {
    slug: 'blusa-trico-botoes-dourados',
    name: 'Blusa Tricô Canelado Botões Dourados',
    cats: ['liquida', 'blusas'],
    price: 101.9,
    was: 119.9,
    imgs: ['/images/trico.webp'],
    pos: '50% 40%',
    focus: ['72%', '70%'],
    colors: [
      ['Areia Dourada', '#cfc2b2']
    ],
    sizes: ['Único'],
    stock: 3,
    badge: '−15% OFF',
    rating: 5.0,
    reviewsCount: 24,
    composition: '70% Viscose, 30% Poliamida',
    bullets: ['Tricô canelado com toque macio', 'Gola alta estruturada elegante', 'Botões dourados decorativos no punho', 'Modelagem que abraça o corpo'],
    desc: 'Um tricô refinado de toque aveludado com detalhes em botões dourados metálicos nos punhos. O auge do luxo discreto para os dias frescos com 15% de desconto promocional.'
  },
  {
    slug: 'kit-regata-poliamida',
    name: 'Kit 3 Regatas Poliamida (Cacau + Off + Marinho)',
    cats: ['basicas'],
    price: 129.9,
    was: 149.7,
    imgs: ['/images/regata-trio.webp', '/images/regata-cacau.webp'],
    pos: '50% 40%',
    focus: ['50%', '48%'],
    hidden: true,
    colors: [
      ['Trio Essencial: Cacau, Off-white e Marinho', 'conic-gradient(#6b4434 0 33%, #f3efe6 0 66%, #1f2540 0)']
    ],
    sizes: ['Único'],
    stock: 5,
    badge: 'Kit Exclusivo',
    rating: 5.0,
    reviewsCount: 67,
    composition: '90% Poliamida, 10% Elastano',
    bullets: ['3 regatas nas cores mais pedidas', 'Forro duplo no busto em todas as peças', 'Economia imediata de R$ 19,80', 'Tamanho único com caimento perfeito até o 44'],
    desc: 'Uma de cada, por favor: o combo perfeito para renovar suas peças essenciais com economia e muita elegância. Três regatas indispensáveis com forro duplo.'
  }
];

export const bySlug = Object.fromEntries(PRODUCTS.map(p => [p.slug, p]));
export const VISIBLE = PRODUCTS.filter(p => !p.hidden);

export const ARARA_SLUGS = [
  'blusa-peplum-lacinhos',
  'blusa-assimetrica',
  'blusa-decote-quadrado',
  'calca-wide-leg-chocolate',
  'conjunto-bata-shorts',
  'calca-pantalona-listrada',
  'tshirt-listrada-gola-rosa',
  'calca-animal-print',
  'conjunto-camisa-shorts-listrado',
  'tshirt-oversized-listrada'
];

export const NOVIDADES_SLUGS = [
  'blusa-peplum-lacinhos',
  'conjunto-bata-shorts',
  'blusa-decote-quadrado',
  'calca-wide-leg-chocolate',
  'tshirt-listrada-gola-rosa',
  'shorts-linho-bolsinhos',
  'calca-pantalona-listrada',
  'blusa-assimetrica'
];

export const BASICAS_SLUGS = [
  'regata-poliamida',
  'regata-alca-larga',
  'regata-contraste-pb',
  'blusa-basica-poliamida',
  'blusa-decote-quadrado'
];

export const LIQUIDA_SLUGS = [
  'blusa-trico-botoes-dourados',
  'legging-pezinho'
];

export const INSTA_IMAGES = [
  { img: '/images/peplum.webp', slug: 'blusa-peplum-lacinhos', likes: '1.420', comments: '64' },
  { img: '/images/shorts-linho.webp', slug: 'shorts-linho-bolsinhos', likes: '890', comments: '42' },
  { img: '/images/conjunto-bata.webp', slug: 'conjunto-bata-shorts', likes: '2.150', comments: '118' },
  { img: '/images/pantalona.webp', slug: 'calca-pantalona-listrada', likes: '1.780', comments: '85' },
  { img: '/images/regata-trio.webp', slug: 'regata-poliamida', likes: '3.420', comments: '190' },
  { img: '/images/wide-leg.webp', slug: 'calca-wide-leg-chocolate', likes: '2.640', comments: '142' }
];

export const FAQ_DATA = [
  {
    q: 'Como sei o meu tamanho ideal?',
    a: 'Muitas de nossas peças são confeccionadas em poliamida e tecidos nobres com elastano inteligente, atendendo com caimento impecável do P ao G (veste do 36 ao 42/44). Em cada produto você encontra nossa tabela detalhada de medidas. Além disso, se quiser que nossa equipe meça a peça na fita métrica em tempo real, basta nos chamar no WhatsApp!'
  },
  {
    q: 'Quais são as opções de pagamento?',
    a: 'Oferecemos 5% de desconto automático no Pix (com aprovação imediata), cartão de crédito em até 3x sem juros (ou em até 12x), e link de pagamento protegido para atendimento personalizado.'
  },
  {
    q: 'Vocês realizam entregas para todo o Brasil?',
    a: 'Sim! Entregamos com seguro total para todos os estados do país via Correios (PAC e SEDEX). Para Praia Grande e Baixada Santista, contamos com entrega expressa via motoboy no mesmo dia ou no próximo dia útil.'
  },
  {
    q: 'E se a peça não vestir bem ou eu quiser trocar?',
    a: 'Garantimos troca ou devolução descomplicada em até 7 dias corridos após o recebimento. Você pode realizar a troca sem custos diretamente em nosso Espaço Conceito na Galeria Boulevard ou via logística reversa dos Correios.'
  },
  {
    q: 'Posso comprar pelo site e retirar pessoalmente na loja física?',
    a: 'Com certeza! Selecione a opção "Retirar na Loja" na finalização do pedido. Nossa equipe separa com todo carinho na nossa sacolinha Lara Luxo e você pode retirar em até 2 horas úteis na loja 14.'
  },
  {
    q: 'Como funciona o cupom de primeira compra?',
    a: 'Você ganha 10% de desconto imediato em seu primeiro pedido utilizando o cupom BEMVINDA na sacola. Ele é cumulativo com o frete grátis!'
  }
];
