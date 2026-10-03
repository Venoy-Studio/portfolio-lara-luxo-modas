// Page Views Renderers: Home, Shop, and Product Details Page (PDP)

import { bySlug, VISIBLE, CAT_LABEL, CATS, ARARA_SLUGS, NOVIDADES_SLUGS, BASICAS_SLUGS, LIQUIDA_SLUGS, INSTA_IMAGES, FAQ_DATA } from '../data/products.js';
import { CONTACTS, getWaLink } from '../data/contacts.js';
import { REVIEWS, TRUST_METRICS } from '../data/reviews.js';
import { state, persistFav } from './state.js';
import { addToCart } from './cart.js';
import { openOverlay } from './overlay.js';
import { initArara } from './arara.js';
import { shipOptions } from './checkout.js';
import { $, $$, esc, brl, pix, parcelas, plural, icon, WA_ICON, FLOURISH, HANGER, toast } from './utils.js';

export function sectionHead({ script, title, sub, id }) {
  return `
    <header class="sec-head reveal">
      ${script ? `<span class="sec-head__script">${script}</span>` : ''}
      <h2 class="sec-head__title"${id ? ` id="${id}"` : ''}>${title}</h2>
      ${FLOURISH('sec-head__flourish')}
      ${sub ? `<p class="sec-head__sub">${sub}</p>` : ''}
    </header>
  `;
}

export function cardHTML(p, i = 0) {
  const fav = state.fav.has(p.slug);
  const badgeClass = p.badge === 'Lançamento' || p.badge?.includes('%')
    ? 'badge--wine'
    : (p.badge === 'Reposição' || p.badge?.includes('Kit'))
    ? 'badge--rose'
    : '';

  return `
  <article class="card reveal" style="--d:${((i % 4) * 0.08).toFixed(2)}s">
    <div class="card__top">
      <a class="card__media" href="#/p/${p.slug}" aria-label="${esc(p.name)}">
        ${p.badge ? `<span class="badge ${badgeClass}">${p.badge}</span>` : ''}
        <img src="${p.imgs[0]}" alt="${esc(p.name)}" loading="lazy" decoding="async" style="object-position:${p.pos}">
      </a>
      <button class="card__fav ${fav ? 'is-on' : ''}" data-action="fav" data-slug="${p.slug}" aria-label="Favoritar ${esc(p.name)}" aria-pressed="${fav}">
        ${icon('heart')}
      </button>
      <button class="card__add" data-action="quick" data-slug="${p.slug}" aria-label="Adicionar ${esc(p.name)} à sacola">
        ${icon('plus', 'style="stroke-width:2.2"')}
      </button>
    </div>
    <div class="card__body">
      <h3 class="card__name"><a href="#/p/${p.slug}">${esc(p.name)}</a></h3>
      <p class="card__price">
        ${p.was ? `<s>${brl(p.was)}</s>` : ''}
        ${brl(p.price)}
      </p>
      <p class="card__pix"><b>${brl(pix(p.price))}</b> no Pix</p>
      ${p.stock <= 3 ? `<p class="card__stock">Restam apenas ${p.stock} peças</p>` : ''}
      ${p.colors.length > 1 ? `
        <div class="card__dots" aria-label="${p.colors.length} cores disponíveis">
          ${p.colors.map(c => `<span class="dot" style="background:${c[1]}" title="${esc(c[0])}"></span>`).join('')}
        </div>` : ''}
    </div>
  </article>`;
}

export function nextSunday() {
  const d = new Date();
  const end = new Date(d);
  end.setDate(d.getDate() + ((7 - d.getDay()) % 7));
  end.setHours(23, 59, 59, 0);
  if (end < d) end.setDate(end.getDate() + 7);
  return end.getTime();
}

export function renderHome() {
  const app = $('#app');
  if (!app) return;

  const looks = ARARA_SLUGS.map(s => bySlug[s]).filter(Boolean);

  app.innerHTML = `
  <!-- Hero Section com Arara 3D -->
  <section class="hero" aria-labelledby="hero-title">
    <div class="container">
      <p class="hero__eyebrow">
        ${icon('pin')} ${CONTACTS.address.neighborhood} · ${CONTACTS.address.city}
      </p>
      <h1 class="hero__title" id="hero-title">
        Se é <em>tendência</em>,<br> você encontra aqui.
      </h1>
      <p class="hero__sub">
        As peças exclusivas que você ama no nosso Instagram, agora com compra facilitada, 5% de desconto no Pix e envio seguro para todo o Brasil.
      </p>
      <div class="hero__cta">
        <button class="btn btn--rose" data-action="scroll" data-target="novidades">
          Explorar Novidades da Semana ${icon('arrowR')}
        </button>
        <a class="hero__wa" href="${getWaLink('Olá! Vim pelo site da Lara Luxo e queria uma ajuda para escolher.')}" target="_blank" rel="noopener">
          ${WA_ICON} Atendimento personalizado pelo Whats
        </a>
      </div>
    </div>

    <!-- Arara Giratória 3D -->
    <div class="arara" id="arara">
      <div class="arara__stage" tabindex="0" role="group" aria-roledescription="carrossel 3D" aria-label="Arara giratória de looks exclusivos. Arraste ou use as setas do teclado.">
        <svg class="arara__svg arara__svg--back" aria-hidden="true"></svg>
        <div class="arara__scene">
          <div class="arara__ring">
            <div class="arara__rail"></div>
            ${looks.map((p, i) => `
              <button class="look" style="--i:${i}" data-i="${i}" tabindex="-1" aria-label="${esc(p.name)}, ${brl(p.price)}">
                ${HANGER}
                <span class="look__img">
                  <img src="${p.imgs[0]}" alt="${esc(p.name)}" draggable="false" style="object-position:${p.pos}">
                </span>
              </button>
            `).join('')}
          </div>
        </div>
        <svg class="arara__svg arara__svg--front" aria-hidden="true"></svg>
        <div class="arara__floor"></div>
        <p class="arara__hint">${icon('hand')} Arraste para girar a arara</p>
      </div>

      <div class="arara__info" aria-live="polite">
        <p class="arara__count">Look <span data-ar="n">1</span> de ${looks.length}</p>
        <p class="arara__name" data-ar="name"></p>
        <p class="arara__price" data-ar="price"></p>
        <div class="arara__controls">
          <button class="arara__arrow" data-ar="prev" aria-label="Look anterior">${icon('chevL')}</button>
          <a class="btn btn--rose" data-ar="go" href="#/">Ver esta peça</a>
          <button class="arara__arrow" data-ar="next" aria-label="Próximo look">${icon('chevR')}</button>
        </div>
      </div>
    </div>

    <div class="container">
      <ul class="hero__trust">
        <li>${icon('truck')}<span>Envio Rápido para<br><b>todo o Brasil</b></span></li>
        <li>${icon('pix')}<span><b>5% de desconto</b><br>pagando no Pix</span></li>
        <li>${icon('swap')}<span>Primeira troca<br><b>em até 7 dias</b></span></li>
        <li>${icon('store')}<span>Espaço Conceito<br><b>no ${CONTACTS.address.neighborhood}</b></span></li>
      </ul>
    </div>
  </section>

  <!-- Categorias Estilo Stories -->
  <section class="sec sec--tight" aria-label="Categorias em Destaque">
    <div class="cats">
      ${CATS.map(c => `
        <a class="cat" href="#/loja/${c.slug}">
          <span class="cat__ring">
            <img src="${c.img}" alt="${c.name}" loading="lazy">
            ${c.tag ? `<span class="cat__tag">${c.tag}</span>` : ''}
          </span>
          ${c.name}
        </a>
      `).join('')}
    </div>
  </section>

  <!-- Novidades da Semana -->
  <section class="sec" id="novidades" style="padding-top:20px">
    <div class="container">
      ${sectionHead({
        script: 'coleção cápsula',
        title: 'Novidades da Semana',
        sub: 'Chegou na loja física, chegou aqui. Modelagens exclusivas e tecidos selecionados que esgotam rápido.'
      })}
      <div class="grid">
        ${NOVIDADES_SLUGS.map((s, i) => cardHTML(bySlug[s], i)).join('')}
      </div>
      <div class="sec-foot">
        <a class="btn btn--ghost-wine" href="#/loja/todas">Ver todas as peças da coleção ${icon('arrowR')}</a>
      </div>
    </div>
  </section>

  <!-- Kit "Uma de Cada, Por Favor" -->
  <section class="sec sec--blush">
    <div class="container kit__inner">
      <div class="kit__media reveal">
        <img id="kitImg" src="/images/regata-trio.webp" alt="Kit 3 Regatas Poliamida nas cores cacau, off-white e marinho" loading="lazy">
        <span class="kit__seal">3 cores<small>no kit</small></span>
      </div>
      <div class="kit__text reveal" style="--d:.1s">
        ${sectionHead({
          script: 'básicas essenciais',
          title: 'Uma de cada, por favor.',
          sub: 'Regata de poliamida inteligente com forro duplo no busto, nas 3 cores indispensáveis da estação: cacau, off-white e marinho.'
        })}
        <div class="kit__colors">
          <span><i class="dot" style="background:#6b4434"></i> Cacau</span>
          <span><i class="dot" style="background:#f3efe6"></i> Off-white</span>
          <span><i class="dot" style="background:#1f2540"></i> Marinho</span>
        </div>
        <div class="price-block">
          <s>3 × ${brl(49.9)} = ${brl(149.7)}</s>
          <strong>${brl(129.9)}</strong>
          <span>${brl(pix(129.9))} no Pix</span>
          <span class="save-chip">Economia imediata de ${brl(19.8)}</span>
        </div>
        <button class="btn btn--wine" data-action="add-kit">
          ${icon('bagPlus')} Quero o Kit com as 3 Cores
        </button>
      </div>
    </div>
  </section>

  <!-- Série Básicas Necessárias (Rail Horizontal) -->
  <section class="sec">
    <div class="container">
      ${sectionHead({
        script: 'closet inteligente',
        title: 'Básicas Necessárias',
        sub: 'Peças coringas e versáteis que combinam perfeitamente entre si e multiplicam seus looks.'
      })}
    </div>
    <div class="rail">
      ${BASICAS_SLUGS.map((s, i) => cardHTML(bySlug[s], i)).join('')}
    </div>
  </section>

  <!-- Liquidação com Cronômetro Dinâmico -->
  <section class="sec sec--areia" id="liquida">
    <div class="container liquida__inner">
      <div class="reveal">
        ${sectionHead({
          script: 'oportunidade especial',
          title: 'Liquida Outono/Inverno −15%',
          sub: 'Peças selecionadas da coleção com 15% de desconto automático. Ofertas válidas enquanto durarem as últimas unidades.'
        })}
        <div class="countdown" data-countdown="${nextSunday()}" role="timer" aria-label="Tempo até o fim da liquidação">
          <div><b data-cd="d">0</b><small>dias</small></div>
          <div><b data-cd="h">00</b><small>horas</small></div>
          <div><b data-cd="m">00</b><small>min</small></div>
          <div><b data-cd="s">00</b><small>seg</small></div>
        </div>
        <p class="liquida__note">Aproveite! O estoque promocional é limitado.</p>
      </div>
      <div class="liquida__grid">
        ${LIQUIDA_SLUGS.map((s, i) => cardHTML(bySlug[s], i)).join('')}
      </div>
    </div>
  </section>

  <!-- Prova Social & Avaliações Reais -->
  <section class="sec">
    <div class="container">
      ${sectionHead({
        script: 'experiência comprovada',
        title: 'O que dizem nossas clientes',
        sub: `Mais de ${TRUST_METRICS.totalOrders} pedidos entregues com nota média ${TRUST_METRICS.rating} de 5 estrelas.`
      })}
      <div class="reviews-grid">
        ${REVIEWS.map(r => `
          <div class="review-card reveal">
            <div class="review-stars">
              ${icon('star')}${icon('star')}${icon('star')}${icon('star')}${icon('star')}
            </div>
            <p class="review-text">"${esc(r.text)}"</p>
            <div class="review-author">
              <b>${esc(r.name)}</b>
              <small>${esc(r.item)} · ${esc(r.city)}</small>
              <span class="review-verified">${icon('check', 'style="width:14px;height:14px"')} Compra Verificada</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Espaço Conceito / Loja Física -->
  <section class="sec sec--blush" id="loja">
    <div class="container store__inner">
      <div class="wall reveal" role="img" aria-label="Espaço Conceito Lara Luxo Modas">
        <div class="wall__sign logo">
          <span class="logo__word"><span class="logo__script">Lara Luxo</span></span>
          <span class="logo__modas">MODAS</span>
        </div>
        <p class="wall__caption">${CONTACTS.address.complement} · ${CONTACTS.address.neighborhood}</p>
      </div>
      <div class="store__info reveal" style="--d:.1s">
        ${sectionHead({
          script: 'venha provar de perto',
          title: 'Nosso Espaço Conceito'
        })}
        <ul class="facts">
          <li>
            ${icon('pin')}
            <span>
              ${CONTACTS.address.street}<br>
              <small>${CONTACTS.address.complement} · ${CONTACTS.address.neighborhood}, ${CONTACTS.address.city}/${CONTACTS.address.state}</small>
            </span>
          </li>
          <li>
            ${icon('clock')}
            <span>
              ${CONTACTS.hours.weekdays}<br>
              <small>${CONTACTS.hours.sunday}</small>
            </span>
          </li>
        </ul>
        <div class="store__btns">
          <a class="btn btn--wine" href="${CONTACTS.mapsUrl}" target="_blank" rel="noopener">
            ${icon('pin')} Traçar Rota no Maps
          </a>
          <a class="btn btn--ghost-wine" href="${getWaLink('Olá! Quero dar uma passada na loja hoje, vocês estão abertas?')}" target="_blank" rel="noopener">
            ${WA_ICON} Falar com Atendente
          </a>
        </div>
        <div class="care">
          <img src="/images/touquinhas.webp" alt="Touquinha descartável do provador Lara Luxo" loading="lazy">
          <p>
            <b>Cuidado em cada detalhe</b>
            Disponibilizamos touquinhas descartáveis no provador para que você prove roupas claras sem manchar de maquiagem. Esse carinho vai também na sua embalagem!
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Feed do Instagram -->
  <section class="sec">
    <div class="container">
      ${sectionHead({
        script: 'comunidade & estilo',
        title: CONTACTS.social.instagramHandle,
        sub: 'Inspirações de looks diários, provadores ao vivo e bastidores da nossa equipe.'
      })}
      <div class="insta__stats reveal">
        <div><b>+12 mil</b> seguidoras</div>
        <div><b>+2.400</b> looks postados</div>
        <div><b>4.9 ★</b> satisfação</div>
      </div>
      <div class="insta reveal">
        ${INSTA_IMAGES.map(item => `
          <a href="${CONTACTS.social.instagram}" target="_blank" rel="noopener" aria-label="Ver post no Instagram">
            <img src="${item.img}" alt="Look Lara Luxo" loading="lazy">
            <div class="insta__overlay">
              <span>❤️ ${item.likes}</span>
              <span>💬 ${item.comments}</span>
            </div>
          </a>
        `).join('')}
      </div>
      <div class="sec-foot">
        <a class="btn btn--wine" href="${CONTACTS.social.instagram}" target="_blank" rel="noopener">
          ${icon('ig')} Seguir no Instagram
        </a>
      </div>
    </div>
  </section>

  <!-- Dúvidas Frequentes (FAQ) -->
  <section class="sec sec--blush" id="faq">
    <div class="container">
      ${sectionHead({
        script: 'tire suas dúvidas',
        title: 'Tudo o que você precisa saber'
      })}
      <div class="faq reveal">
        ${FAQ_DATA.map(item => `
          <details>
            <summary>${item.q}</summary>
            <p>${item.a}</p>
          </details>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Final Wine Velvet CTA Banner -->
  <section class="sec sec--wine final">
    <div class="container">
      <span class="sec-head__script">precisa de ajuda?</span>
      <h2 class="final__title">Estamos online agora no WhatsApp para te ajudar.</h2>
      <p class="final__sub">Dúvidas sobre tamanho, combinação de cores ou disponibilidade de peças? É só chamar nossa equipe.</p>
      <a class="btn btn--rose" href="${getWaLink('Olá! Vim pelo site da Lara Luxo e gostaria de auxílio com a minha escolha.')}" target="_blank" rel="noopener">
        ${WA_ICON} Chamar no WhatsApp
      </a>
    </div>
  </section>`;

  initArara();
}

export function renderShop(cat = 'todas') {
  const app = $('#app');
  if (!app) return;
  if (!CAT_LABEL[cat]) cat = 'todas';

  const sort = state.sort || 'novidades';
  let list = VISIBLE.filter(p => cat === 'todas' || p.cats.includes(cat));

  if (sort === 'menor') list = list.slice().sort((a, b) => a.price - b.price);
  if (sort === 'maior') list = list.slice().sort((a, b) => b.price - a.price);

  app.innerHTML = `
  <section class="shop-head">
    <div class="container">
      ${sectionHead({
        script: 'catálogo completo',
        title: CAT_LABEL[cat],
        sub: `${plural(list.length, 'peça selecionada', 'peças selecionadas')} · 5% OFF no Pix · Troca fácil em 7 dias`
      })}
    </div>
    <div class="filters">
      ${Object.keys(CAT_LABEL).map(k => `
        <a class="chip ${k === cat ? 'is-on' : ''}" href="#/loja/${k}">
          ${CAT_LABEL[k].replace(' −15%', '')}
        </a>
      `).join('')}
    </div>
    <div class="sortbar">
      <label for="sort">Ordenar por:</label>
      <select id="sort">
        <option value="novidades" ${sort === 'novidades' ? 'selected' : ''}>Mais Recentes</option>
        <option value="menor" ${sort === 'menor' ? 'selected' : ''}>Menor Preço</option>
        <option value="maior" ${sort === 'maior' ? 'selected' : ''}>Maior Preço</option>
      </select>
    </div>
  </section>

  <section class="sec" style="padding-top:0">
    <div class="container">
      <div class="grid">
        ${list.map((p, i) => cardHTML(p, i)).join('')}
      </div>
    </div>
  </section>`;

  const sel = $('#sort');
  sel?.addEventListener('change', () => {
    state.sort = sel.value;
    renderShop(cat);
  });
}

export function relatedFor(p) {
  const isTop = p.cats.some(c => ['blusas', 'basicas', 'tshirts'].includes(c));
  const isBottom = p.cats.some(c => ['calcas', 'shorts'].includes(c));
  const want = isTop && !isBottom ? ['calcas', 'shorts'] : isBottom && !isTop ? ['blusas', 'basicas'] : ['blusas', 'calcas'];
  return VISIBLE.filter(x => x.slug !== p.slug && x.cats.some(c => want.includes(c))).slice(0, 4);
}

export function renderProduct(slug) {
  const app = $('#app');
  const p = bySlug[slug];
  if (!app) return;
  if (!p) {
    location.hash = '#/';
    return;
  }

  const sel = { ci: 0, si: p.sizes.length === 1 ? 0 : -1 };
  const slides = [{ k: p.imgs[0] }, { k: p.imgs[0], zoom: true }].concat(p.imgs.slice(1).map(k => ({ k })));
  const fav = state.fav.has(p.slug);
  const mainCat = p.cats.find(c => c !== 'novidades') || p.cats[0];

  app.innerHTML = `
  <div class="pdp container">
    <nav class="crumbs" aria-label="Navegação estrutural">
      <a href="#/">Início</a><span>/</span>
      <a href="#/loja/${mainCat}">${CAT_LABEL[mainCat]?.replace(' −15%', '') || 'Loja'}</a><span>/</span>
      <span>${esc(p.name)}</span>
    </nav>

    <div class="pdp__grid">
      <!-- Galeria de Imagens -->
      <div class="gallery">
        ${p.badge ? `<span class="badge ${p.badge === 'Lançamento' ? 'badge--wine' : 'badge--rose'}">${p.badge}</span>` : ''}
        <button class="card__fav ${fav ? 'is-on' : ''}" data-action="fav" data-slug="${p.slug}" aria-label="Favoritar" aria-pressed="${fav}">
          ${icon('heart')}
        </button>
        <div class="gallery__track" id="gTrack">
          ${slides.map((s, i) => `
            <div class="gallery__slide ${s.zoom ? 'gallery__slide--zoom' : ''}" style="--fx:${p.focus[0]};--fy:${p.focus[1]}">
              <img ${i === 0 ? 'id="pdpImg"' : 'loading="lazy"'} src="${s.k}" alt="${esc(p.name)}${s.zoom ? ', detalhe ampliado' : ''}" style="object-position:${s.zoom ? '50% 50%' : p.pos}">
              ${s.zoom ? '<span class="gallery__tag">Toque do tecido</span>' : ''}
            </div>
          `).join('')}
        </div>
        <div class="gallery__dots">
          ${slides.map((s, i) => `<button data-g="${i}" class="${i === 0 ? 'is-on' : ''}" aria-label="Foto ${i + 1}"></button>`).join('')}
        </div>
        <div class="thumbs">
          ${slides.map((s, i) => `
            <button data-g="${i}" class="${i === 0 ? 'is-on' : ''}" aria-label="Foto ${i + 1}">
              <img src="${s.k}" alt="" style="${s.zoom ? `transform:scale(1.85);transform-origin:${p.focus[0]} ${p.focus[1]}` : `object-position:${p.pos}`}">
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Informações & Seleção de Tamanho -->
      <div class="pdp__info">
        <h1 class="pdp__title">${esc(p.name)}</h1>
        <div class="pdp__price">
          ${p.was ? `<s>${brl(p.was)}</s>` : ''}
          <strong>${brl(p.price)}</strong>
        </div>
        <p class="pdp__pix">
          <b>${brl(pix(p.price))} no Pix (5% OFF)</b> · ${parcelas(p.price)}
        </p>

        ${p.stock <= 5 ? `
          <div class="stock">
            ${p.stock <= 3 ? `Poucas unidades: restam apenas ${p.stock} peças` : `Estoque limitado: restam ${p.stock} peças`}
            <div class="meter"><i style="--v:${Math.max(0.15, p.stock / 12).toFixed(2)}"></i></div>
          </div>` : ''}

        <div id="pdpOpts">
          <div class="opt" data-opt="color">
            <p class="opt__label">Cor selecionada: <b data-sel="color">${esc(p.colors[sel.ci][0])}</b></p>
            <div class="swatches">
              ${p.colors.map((c, i) => `
                <button class="sw ${i === sel.ci ? 'is-on' : ''}" style="background:${c[1]}" data-ci="${i}" aria-label="${esc(c[0])}" aria-pressed="${i === sel.ci}"></button>
              `).join('')}
            </div>
          </div>

          <div class="opt" data-opt="size">
            <p class="opt__label">
              Tamanho: <b data-sel="size">${sel.si < 0 ? 'Escolha o tamanho' : (p.sizes[sel.si] === 'Único' ? 'Tamanho Único' : p.sizes[sel.si])}</b>
              <button class="link" data-action="size-guide" data-slug="${p.slug}" style="display:inline-flex;align-items:center;gap:4px">
                ${icon('ruler', 'style="width:16px;height:16px"')} Guia de medidas
              </button>
            </p>
            <div class="sizes">
              ${p.sizes.map((s, i) => `
                <button class="sz ${s === 'Único' ? 'sz--wide' : ''} ${i === sel.si ? 'is-on' : ''}" data-si="${i}" aria-pressed="${i === sel.si}">
                  ${s === 'Único' ? 'Tamanho Único' : s}
                </button>
              `).join('')}
            </div>
            <p class="opt__err">Selecione o tamanho desejado para adicionar à sacola.</p>
          </div>
        </div>

        <div class="pdp__ctas">
          <button class="btn btn--wine btn--block" id="pdpAdd">
            ${icon('bagPlus')} Adicionar à Sacola
          </button>
          <a class="btn btn--ghost-wine btn--block" id="pdpWa" target="_blank" rel="noopener">
            ${WA_ICON} Comprar pelo WhatsApp
          </a>
        </div>

        <!-- Calculadora de Frete -->
        <form class="ship-calc" id="shipCalc" autocomplete="off">
          <p class="ship-calc__label">
            ${icon('truck', 'style="width:18px;height:18px"')} Calcule o Frete e Prazo de Entrega
          </p>
          <div class="ship-calc__row">
            <input inputmode="numeric" name="cep" placeholder="00000-000" maxlength="9" aria-label="CEP" value="${state.form.cep || ''}">
            <button class="btn btn--ghost-wine btn--sm" type="submit">Calcular</button>
          </div>
          <ul class="ship-res" id="shipRes"></ul>
        </form>

        <ul class="bullets">
          ${p.bullets.map(b => `<li>${icon('check')} <span>${esc(b)}</span></li>`).join('')}
          ${p.composition ? `<li>${icon('sparkle')} <span>Composição: <b>${esc(p.composition)}</b></span></li>` : ''}
        </ul>

        <div class="pdp__trust">
          <div>${icon('swap')}Primeira troca<br>grátis em 7 dias</div>
          <div>${icon('pix')}5% OFF à vista<br>no Pix</div>
          <div>${icon('store')}Retire grátis<br>no Espaço Conceito</div>
        </div>

        <div class="acc">
          <details open>
            <summary>Detalhes da Peça & Modelagem</summary>
            <p>${esc(p.desc)}</p>
          </details>
          <details>
            <summary>Política de Trocas & Devoluções</summary>
            <p>Se a peça não servir ou não atender sua expectativa, você pode solicitar a troca em até 7 dias corridos após o recebimento. A peça deve estar sem uso, com a etiqueta fixada e na embalagem original.</p>
          </details>
          <details>
            <summary>Instruções de Lavagem e Cuidados</summary>
            <p>Recomendamos lavagem à mão ou no ciclo delicado da máquina em saquinho protetor. Secar à sombra e evitar torcer para preservar a elasticidade nobre da fibra.</p>
          </details>
        </div>
      </div>
    </div>
  </div>

  <!-- Complete o Look -->
  <section class="sec sec--blush">
    <div class="container">
      ${sectionHead({ script: 'combina perfeitamente', title: 'Complete a sua produção' })}
      <div class="grid">
        ${relatedFor(p).map((r, i) => cardHTML(r, i)).join('')}
      </div>
    </div>
  </section>

  <!-- Barra Fixa Mobile -->
  <div class="pdp-bar" id="pdpBar">
    <img src="${p.imgs[0]}" alt="" style="object-position:${p.pos}">
    <div class="pdp-bar__info">
      <span>${esc(p.name)}</span>
      <b>${brl(p.price)}</b>
    </div>
    <button class="btn btn--wine" data-action="pdp-bar-add">Adicionar</button>
  </div>`;

  setupPdpEvents(p, sel);
}

function setupPdpEvents(p, sel) {
  const optsRoot = $('#pdpOpts');
  const waBtn = $('#pdpWa');

  const updateWa = () => {
    const size = sel.si < 0
      ? 'tamanho a definir'
      : (p.sizes[sel.si] === 'Único' ? 'tamanho único' : 'tam. ' + p.sizes[sel.si]);
    if (waBtn) {
      waBtn.href = getWaLink(`Olá! Vi no site da ${CONTACTS.storeName} e me interessei na ${p.name} (Cor: ${p.colors[sel.ci][0]}, ${size}) por ${brl(p.price)}. Ainda está disponível?`);
    }
  };

  optsRoot?.addEventListener('click', e => {
    const sw = e.target.closest('.sw[data-ci]');
    const sz = e.target.closest('.sz[data-si]');

    if (sw) {
      sel.ci = +sw.dataset.ci;
      $$('.sw', optsRoot).forEach(b => {
        const on = b === sw;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on);
      });
      const colorLabel = $('[data-sel="color"]', optsRoot);
      if (colorLabel) colorLabel.textContent = p.colors[sel.ci][0];
      updateWa();
    }

    if (sz) {
      sel.si = +sz.dataset.si;
      $$('.sz', optsRoot).forEach(b => {
        const on = b === sz;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on);
      });
      const sizeLabel = $('[data-sel="size"]', optsRoot);
      if (sizeLabel) sizeLabel.textContent = p.sizes[sel.si] === 'Único' ? 'Tamanho Único' : p.sizes[sel.si];
      $('[data-opt="size"]', optsRoot)?.classList.remove('is-error');
      updateWa();
    }
  });

  updateWa();

  const add = () => {
    if (sel.si < 0) {
      const o = $('[data-opt="size"]', optsRoot);
      if (o) {
        o.classList.remove('is-error');
        void o.offsetWidth;
        o.classList.add('is-error');
        o.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    addToCart(p, sel.ci, sel.si, 1, { fromImg: $('#pdpImg'), openCart: true });
  };

  $('#pdpAdd')?.addEventListener('click', add);
  $('[data-action="pdp-bar-add"]')?.addEventListener('click', add);

  // Galeria de Fotos
  const trackEl = $('#gTrack');
  if (trackEl) {
    const setDot = i => $$('.gallery__dots button, .thumbs button').forEach(b => b.classList.toggle('is-on', +b.dataset.g === i));
    trackEl.addEventListener('scroll', () => {
      setDot(Math.round(trackEl.scrollLeft / trackEl.clientWidth));
    }, { passive: true });

    $$('.gallery [data-g]').forEach(b => {
      b.addEventListener('click', () => {
        trackEl.scrollTo({ left: +b.dataset.g * trackEl.clientWidth, behavior: 'smooth' });
        setDot(+b.dataset.g);
      });
    });
  }

  // Calculadora de Frete
  const form = $('#shipCalc');
  if (form) {
    const inp = form.cep;
    inp.addEventListener('input', () => {
      const d = inp.value.replace(/\D/g, '').slice(0, 8);
      inp.value = d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = inp.value.replace(/\D/g, '');
      const res = $('#shipRes');
      if (!res) return;

      if (d.length !== 8) {
        res.innerHTML = '<li>Por favor, digite os 8 números do seu CEP.</li>';
        return;
      }

      res.innerHTML = shipOptions(d, p.price).map(o => `
        <li>
          <span><b>${o.label}</b><br><small style="color:var(--ink-soft)">${o.eta}</small></span>
          <b class="${o.price === 0 ? 'free' : ''}">${o.price === 0 ? 'Grátis' : brl(o.price)}</b>
        </li>
      `).join('');
    });
  }

  // Barra de Compra Fixa Mobile
  const bar = $('#pdpBar');
  const pdpAdd = $('#pdpAdd');
  if (bar && pdpAdd && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([en]) => {
      bar.classList.toggle('is-on', !en.isIntersecting && en.boundingClientRect.top < 0);
    });
    io.observe(pdpAdd);
  }
}
