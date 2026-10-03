// Checkout & Order Finalization Engine

import { state, persistForm, persistOrder, FREE_SHIP_THRESHOLD, PIX_DISCOUNT } from './state.js';
import { CONTACTS, getWaLink } from '../data/contacts.js';
import { calcCart, lineProduct, cartCount, updateBag } from './cart.js';
import { $, $$, esc, r2, brl, icon, WA_ICON, launchCelebrationConfetti } from './utils.js';

export function shipOptions(cep, baseAmount = null) {
  const items = baseAmount != null ? baseAmount : calcCart().items;
  const free = items >= FREE_SHIP_THRESHOLD;

  const opts = [
    {
      id: 'retirada',
      label: `Retirar no Espaço Conceito (${CONTACTS.address.neighborhood})`,
      eta: 'Pronto em até 2 horas úteis',
      price: 0
    }
  ];

  if (/^117[0-2]/.test(cep)) {
    opts.push({
      id: 'local',
      label: 'Entrega Expressa Praia Grande',
      eta: 'Entrega no mesmo dia ou até 24h',
      price: free ? 0 : 8.00
    });
  } else if (/^11[0-7]/.test(cep)) {
    opts.push({
      id: 'local',
      label: 'Entrega Expressa Baixada Santista',
      eta: '1 a 2 dias úteis',
      price: free ? 0 : 15.00
    });
  }

  opts.push({
    id: 'pac',
    label: 'Correios PAC Seguro',
    eta: '4 a 8 dias úteis',
    price: free ? 0 : 24.90
  });

  opts.push({
    id: 'sedex',
    label: 'Correios SEDEX Prioritário',
    eta: '1 a 3 dias úteis',
    price: 36.90
  });

  return opts;
}

export function cityForCep(cep) {
  if (/^117[0-2]/.test(cep)) return 'Praia Grande / SP';
  if (/^11[0-7]/.test(cep)) return 'Baixada Santista / SP';
  if (/^0[1-9]|^1[0-9]/.test(cep)) return 'São Paulo / Capital e Região';
  return 'Brasil (Envio Nacional)';
}

export function qrSVG(seed) {
  let s = 0;
  for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  const n = 25;
  let cells = '';

  const finder = (x, y) => `
    <rect x="${x}" y="${y}" width="7" height="7" fill="#1f080c"/>
    <rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/>
    <rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#1f080c"/>
  `;

  const inFinder = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!inFinder(x, y) && rnd() > 0.52) cells += `M${x} ${y}h1v1h-1z`;
    }
  }

  return `
    <svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" aria-hidden="true">
      <rect width="${n}" height="${n}" fill="#fff"/>
      <path d="${cells}" fill="#1f080c"/>
      ${finder(0, 0)}
      ${finder(n - 7, 0)}
      ${finder(0, n - 7)}
    </svg>`;
}

export function renderCheckout() {
  const app = $('#app');
  if (!app) return;

  if (!state.cart.length) {
    app.innerHTML = `
      <div class="co container">
        <div class="empty">
          <div style="font-size:48px;margin-bottom:12px;color:var(--rose-2)">🛍️</div>
          <h3>Sua sacolinha está vazia</h3>
          <p>Escolha uma peça da coleção e volte para finalizar seu pedido.</p>
          <a class="btn btn--wine" href="#/loja/novidades">Ver novidades</a>
        </div>
      </div>`;
    return;
  }

  const f = state.form;

  app.innerHTML = `
  <div class="co container">
    <div class="steps" aria-label="Etapas">
      <span class="is-done">${icon('check', 'style="width:14px;height:14px"')} Sacola</span>
      <i></i>
      <span class="is-now">Dados e Entrega</span>
      <i></i>
      <span>Pagamento</span>
    </div>

    <h1 class="co__title">Finalizar Pedido</h1>
    <p class="co__sub">Ambiente 100% seguro com desconto de 5% no Pix e parcelamento em até 3x sem juros.</p>

    <div class="co__grid">
      <div class="co-summary-wrap" id="sumWrap">
        <button class="summary-toggle" data-action="toggle-summary" aria-expanded="false">
          <span>Resumo do Pedido · ${cartCount()} itens</span>
          <b data-total>—</b>
        </button>
        <div class="summary" id="summary"></div>
      </div>

      <form id="coForm" novalidate>
        <div class="box">
          <p class="box__title"><span>1</span> Seus Dados de Contato</p>
          <div class="field" data-f="nome">
            <label for="f-nome">Nome Completo</label>
            <input id="f-nome" name="nome" autocomplete="name" value="${esc(f.nome)}" placeholder="Ex: Fernanda Lima">
            <span class="field__err">Por favor, digite seu nome e sobrenome.</span>
          </div>
          <div class="field" data-f="whats">
            <label for="f-whats">WhatsApp com DDD</label>
            <input id="f-whats" name="whats" inputmode="tel" autocomplete="tel" value="${esc(f.whats)}" placeholder="(11) 98765-4321">
            <span class="field__err">Digite um WhatsApp válido com DDD para envio do código de rastreio.</span>
          </div>
          <div class="field">
            <label for="f-email">E-mail <small>(opcional)</small></label>
            <input id="f-email" name="email" type="email" autocomplete="email" value="${esc(f.email)}" placeholder="Para receber o comprovante no seu e-mail">
          </div>
        </div>

        <div class="box" style="margin-top:16px">
          <p class="box__title"><span>2</span> Opções de Entrega</p>
          <div class="field" data-f="cep">
            <label for="f-cep">CEP de Destino</label>
            <div class="field-row">
              <input id="f-cep" name="cep" inputmode="numeric" autocomplete="postal-code" maxlength="9" value="${esc(f.cep)}" placeholder="00000-000">
              <button type="button" class="btn btn--ghost-wine btn--sm" data-action="cep">Buscar CEP</button>
            </div>
            <span class="field__err">Informe o CEP para entrega ou escolha retirar na loja.</span>
          </div>
          <p id="cepCity" style="text-align:center;font-size:13.5px;color:var(--ok);margin:-4px 0 12px;font-weight:600">
            ${f.city ? icon('check', 'style="width:15px;height:15px;vertical-align:-3px"') + ' ' + esc(f.city) : ''}
          </p>
          <div id="shipOpts"></div>
        </div>

        <div class="box" style="margin-top:16px">
          <p class="box__title"><span>3</span> Forma de Pagamento</p>
          <label class="radio">
            <input type="radio" name="pay" value="pix" ${f.pay === 'pix' ? 'checked' : ''}>
            <span class="radio__t">
              Pix Instantâneo <span class="tag-best">5% OFF</span>
              <small>Aprovação imediata e separação prioritária das peças</small>
            </span>
            <span class="radio__p" data-pay="pix"></span>
          </label>

          <label class="radio">
            <input type="radio" name="pay" value="card" ${f.pay === 'card' ? 'checked' : ''}>
            <span class="radio__t">
              Cartão de Crédito
              <small>Em até 3x sem juros (ou até 12x) por link seguro</small>
            </span>
            <span class="radio__p" data-pay="card"></span>
          </label>

          <label class="radio">
            <input type="radio" name="pay" value="wa" ${f.pay === 'wa' ? 'checked' : ''}>
            <span class="radio__t">
              Combinar pelo WhatsApp
              <small>Nossa equipe te chama para confirmar tamanhos e detalhes</small>
            </span>
            <span class="radio__p" data-pay="wa"></span>
          </label>
        </div>

        <div class="co-cta">
          <button class="btn btn--wine btn--block" type="submit" id="coSubmit">
            ${icon('lock')} Confirmar Pedido
          </button>
        </div>

        <p class="demo-note">
          ${icon('sparkle', 'style="width:16px;height:16px;flex:none;margin-top:2px"')}
          Demonstração de Boutique: os contatos são fictícios e nenhum pagamento real é debitado.
        </p>

        <div class="co-trust">
          <span>${icon('swap')} Troca garantida em 7 dias</span>
          <span>${icon('store')} Espaço Conceito no Ocian</span>
          <span>${icon('pix')} 5% OFF no Pix</span>
        </div>
      </form>
    </div>
  </div>`;

  setupCheckoutEvents();
}

function setupCheckoutEvents() {
  const form = $('#coForm');
  if (!form) return;

  const cepI = form.cep;
  const whatsI = form.whats;

  const fmtCep = v => {
    const d = v.replace(/\D/g, '').slice(0, 8);
    return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
  };

  const fmtTel = v => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  };

  whatsI.addEventListener('input', () => {
    whatsI.value = fmtTel(whatsI.value);
    state.form.whats = whatsI.value;
    persistForm();
  });

  form.nome.addEventListener('input', () => {
    state.form.nome = form.nome.value;
    persistForm();
  });

  form.email.addEventListener('input', () => {
    state.form.email = form.email.value;
    persistForm();
  });

  const lookupCep = () => {
    const d = cepI.value.replace(/\D/g, '');
    if (d.length === 8) {
      state.form.cep = cepI.value;
      state.form.city = cityForCep(d);
      persistForm();
      const cityEl = $('#cepCity');
      if (cityEl) {
        cityEl.innerHTML = `${icon('check', 'style="width:15px;height:15px;vertical-align:-3px"')} ${state.form.city}`;
      }
      $('[data-f="cep"]')?.classList.remove('is-error');
      drawShip();
    }
  };

  cepI.addEventListener('input', () => {
    cepI.value = fmtCep(cepI.value);
    if (cepI.value.replace(/\D/g, '').length === 8) lookupCep();
  });

  form.addEventListener('click', e => {
    if (e.target.closest('[data-action="cep"]')) lookupCep();
  });

  form.addEventListener('change', e => {
    if (e.target.name === 'ship') {
      state.form.ship = e.target.value;
      persistForm();
      drawSummary();
    }
    if (e.target.name === 'pay') {
      state.form.pay = e.target.value;
      persistForm();
      drawSummary();
    }
  });

  function shipCost() {
    const d = (state.form.cep || '').replace(/\D/g, '');
    const opts = d.length === 8 ? shipOptions(d) : shipOptions('00000000');
    const o = opts.find(x => x.id === state.form.ship);
    return o ? o.price : 0;
  }

  function drawShip() {
    const d = (state.form.cep || '').replace(/\D/g, '');
    const opts = d.length === 8 ? shipOptions(d) : shipOptions('00000000').slice(0, 1);
    if (!opts.find(o => o.id === state.form.ship)) {
      state.form.ship = opts[0].id;
      persistForm();
    }

    const shipOptsEl = $('#shipOpts');
    if (shipOptsEl) {
      shipOptsEl.innerHTML = opts.map(o => `
        <label class="radio">
          <input type="radio" name="ship" value="${o.id}" ${o.id === state.form.ship ? 'checked' : ''}>
          <span class="radio__t">
            ${o.label}
            <small>${o.id === 'retirada' ? `${CONTACTS.address.complement} · ` : ''}${o.eta}</small>
          </span>
          <span class="radio__p ${o.price === 0 ? 'free' : ''}">
            ${o.price === 0 ? 'Grátis' : brl(o.price)}
          </span>
        </label>
      `).join('') + (d.length === 8 ? '' : '<p style="text-align:center;font-size:13px;color:var(--ink-soft);margin-top:6px">Digite o CEP para ver entrega via Motoboy e Correios.</p>');
    }

    drawSummary();
  }

  function drawSummary() {
    const t = calcCart(shipCost());
    const sumEl = $('#summary');
    if (!sumEl) return;

    sumEl.innerHTML = `
      <div class="reserve">
        ${icon('clock')}
        <span>
          <span class="reserve__big">Sua sacolinha está separada</span>
          <span data-reserve>por <b>15:00</b> minutos</span>
        </span>
      </div>
      <div class="summary__items">
        ${state.cart.map(l => {
          const p = lineProduct(l);
          if (!p) return '';
          return `
          <div class="summary__item">
            <img src="${p.imgs[0]}" alt="" style="object-position:${p.pos}">
            <span>
              ${l.qty}× ${esc(p.name)}
              <small>${esc(p.colors[l.ci][0])} · ${p.sizes[l.si] === 'Único' ? 'Tam. Único' : 'Tam. ' + p.sizes[l.si]}</small>
            </span>
            <b>${brl(p.price * l.qty)}</b>
          </div>`;
        }).join('')}
      </div>

      <div class="totals">
        <div><span>Subtotal</span><span>${brl(t.sub)}</span></div>
        ${t.couponOff ? `<div class="t-off"><span>Cupom ${state.coupon}</span><span>−${brl(t.couponOff)}</span></div>` : ''}
        ${state.form.pay === 'pix' && t.pixOff ? `<div class="t-off"><span>Desconto Pix (5%)</span><span>−${brl(t.pixOff)}</span></div>` : ''}
        <div><span>Frete</span><span>${t.ship === 0 ? '<b style="color:var(--ok)">Grátis</b>' : brl(t.ship)}</span></div>
        <div class="t-total"><span>Total Final</span><span>${brl(t.total)}</span></div>
      </div>
    `;

    const totalBadge = $('[data-total]');
    if (totalBadge) totalBadge.textContent = brl(t.total);

    const submitBtn = $('#coSubmit');
    if (submitBtn) submitBtn.innerHTML = `${icon('lock')} Confirmar Pedido · ${brl(t.total)}`;

    const pixTotal = r2(t.items - r2(t.items * PIX_DISCOUNT) + t.ship);
    const fullTotal = r2(t.items + t.ship);

    const pixBadge = $('[data-pay="pix"]');
    const cardBadge = $('[data-pay="card"]');
    const waBadge = $('[data-pay="wa"]');

    if (pixBadge) pixBadge.textContent = brl(pixTotal);
    if (cardBadge) cardBadge.textContent = '3x de ' + brl(fullTotal / 3);
    if (waBadge) waBadge.textContent = brl(fullTotal);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const errs = [];
    const nome = form.nome.value.trim();
    const tel = whatsI.value.replace(/\D/g, '');
    const cep = cepI.value.replace(/\D/g, '');

    const nomeErr = $('[data-f="nome"]');
    const whatsErr = $('[data-f="whats"]');
    const cepErr = $('[data-f="cep"]');

    if (nome.split(/\s+/).length < 2 || nome.length < 5) {
      nomeErr?.classList.add('is-error');
      errs.push('nome');
    } else {
      nomeErr?.classList.remove('is-error');
    }

    if (tel.length < 10) {
      whatsErr?.classList.add('is-error');
      errs.push('whats');
    } else {
      whatsErr?.classList.remove('is-error');
    }

    if (state.form.ship !== 'retirada' && cep.length !== 8) {
      cepErr?.classList.add('is-error');
      errs.push('cep');
    } else {
      cepErr?.classList.remove('is-error');
    }

    if (errs.length) {
      const el = $(`[data-f="${errs[0]}"] input`);
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const t = calcCart(shipCost());
    const optsAll = cep.length === 8 ? shipOptions(cep) : shipOptions('00000000');

    state.order = {
      num: 'LL-' + String(Math.floor(1000 + Math.random() * 9000)),
      first: nome.split(/\s+/)[0],
      fullName: nome,
      whats: whatsI.value,
      email: form.email.value,
      pay: state.form.pay,
      ship: (optsAll.find(o => o.id === state.form.ship) || optsAll[0]),
      total: t.total,
      items: state.cart.map(l => ({ ...l })),
      coupon: state.coupon,
      date: new Date().toLocaleDateString('pt-BR')
    };

    persistOrder();

    // Limpar sacola após pedido
    state.cart = [];
    state.coupon = null;
    state.reserveEnd = 0;
    updateBag();

    location.hash = '#/pedido';
    setTimeout(launchCelebrationConfetti, 400);
  });

  drawShip();
}

export function renderOrder() {
  const app = $('#app');
  const o = state.order;
  if (!app) return;
  if (!o) {
    location.hash = '#/';
    return;
  }

  const payBox = o.pay === 'pix' ? `
    <div class="pix reveal">
      <p class="sec-head__script">Pagamento via Pix</p>
      <p style="font-family:var(--f-serif);font-size:32px;font-weight:700;color:var(--vinho);line-height:1.1">${brl(o.total)}</p>
      <div class="pix__qr">${qrSVG(o.num)}</div>
      <div class="pix__code">
        <input readonly value="DEMONSTRAÇÃO · Pedido ${o.num} · Lara Luxo Modas · Chave: ${CONTACTS.legal.pixKey}" aria-label="Código Pix copia e cola">
        <button class="btn btn--wine btn--sm" data-action="copy-pix">
          ${icon('copy', 'style="width:16px;height:16px"')} Copiar
        </button>
      </div>
      <p style="font-size:13.5px;color:var(--ink-soft);margin-top:14px">
        Pague em até 30 minutos para garantir suas peças reservadas com carinho.
      </p>
    </div>` : o.pay === 'card' ? `
    <div class="pix reveal">
      <p class="sec-head__script">Cartão de Crédito</p>
      <p style="font-family:var(--f-serif);font-size:28px;font-weight:700;color:var(--vinho)">
        3x de ${brl(o.total / 3)} sem juros
      </p>
      <p style="color:var(--ink-soft);margin:10px auto 18px;max-width:32ch">
        O link de pagamento protegido da bandeira selecionada chega no seu WhatsApp <b>${esc(o.whats)}</b> em instantes.
      </p>
      ${icon('card', 'style="width:48px;height:48px;color:var(--rose-deep)"')}
    </div>` : `
    <div class="pix reveal">
      <p class="sec-head__script">Atendimento Personalizado</p>
      <p style="color:var(--ink-soft);margin:10px auto 18px;max-width:32ch">
        Nossa equipe já recebeu seu pedido e vai entrar em contato pelo WhatsApp. Se preferir, pode chamar agora:
      </p>
      <a class="btn btn--wine" href="${getWaLink(`Olá! Acabei de fazer o pedido ${o.num} no site e quero combinar o pagamento.`)}" target="_blank" rel="noopener">
        ${WA_ICON} Chamar Atendimento
      </a>
    </div>`;

  app.innerHTML = `
  <section class="order container">
    <div class="bag3d" aria-hidden="true">
      <div class="bag3d__obj">
        <div class="bag3d__tissue bag3d__tissue--1"></div>
        <div class="bag3d__tissue bag3d__tissue--2"></div>
        <svg class="bag3d__handle bag3d__handle--b" viewBox="0 0 80 66" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="M16 66C16 18 64 18 64 66"/></svg>
        <div class="bag3d__face bag3d__back"></div>
        <div class="bag3d__face bag3d__side bag3d__left"></div>
        <div class="bag3d__face bag3d__side bag3d__right"></div>
        <div class="bag3d__face bag3d__bottom"></div>
        <div class="bag3d__face bag3d__front">
          <span class="logo">
            <span class="logo__word"><span class="logo__script">Lara Luxo</span></span>
            <span class="logo__modas">MODAS</span>
          </span>
          <small>${CONTACTS.social.instagramHandle}</small>
        </div>
        <svg class="bag3d__handle bag3d__handle--f" viewBox="0 0 80 66" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="M16 66C16 18 64 18 64 66"/></svg>
      </div>
      <div class="bag3d__shadow"></div>
    </div>

    <p class="sec-head__script">Parabéns, ${esc(o.first)}!</p>
    <h1 class="order__title">Sua sacolinha está separada.</h1>
    <p class="order__sub">
      ${o.ship.id === 'retirada'
        ? `Assim que o pagamento for confirmado, ela estará pronta te esperando em nosso Espaço Conceito: ${CONTACTS.address.full}.`
        : `Assim que o pagamento for confirmado, preparamos o envio com todo amor: ${o.ship.label.toLowerCase()} (${o.ship.eta.toLowerCase()}).`
      }
    </p>
    <span class="order__num">Pedido ${o.num}</span>

    <div class="order__grid">
      ${payBox}
      <div class="pix reveal" style="--d:.1s">
        <p class="sec-head__script">Acompanhamento</p>
        <ol class="timeline">
          <li class="is-done">
            <span>${icon('check', 'style="width:16px;height:16px"')}</span>
            <div>
              <b>Pedido Realizado</b>
              <small>Recebido em nosso sistema</small>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <b>Confirmação de Pagamento</b>
              <small>${o.pay === 'pix' ? 'Aprovação automática em minutos' : 'Via WhatsApp ou link seguro'}</small>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <b>Separação com Carinho</b>
              <small>Embalagem perfumada na sacola rosé</small>
            </div>
          </li>
          <li>
            <span>4</span>
            <div>
              <b>${o.ship.id === 'retirada' ? 'Retirada Disponível' : 'Envio com Rastreio'}</b>
              <small>${o.ship.eta}</small>
            </div>
          </li>
        </ol>
        <a class="btn btn--ghost-wine btn--block" style="margin-top:10px" href="${getWaLink(`Olá! Sou ${o.fullName} e fiz o pedido ${o.num} no site. Gostaria de acompanhar!`)}" target="_blank" rel="noopener">
          ${WA_ICON} Acompanhar no WhatsApp
        </a>
      </div>
    </div>

    <div class="sec-foot">
      <a class="btn btn--wine" href="#/loja/novidades">Continuar Comprando</a>
    </div>
  </section>`;
}
