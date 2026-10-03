// Shopping Bag & Cart Engine

import { state, persistCart, persistCoupon, persistReserve, COUPONS, FREE_SHIP_THRESHOLD, PIX_DISCOUNT, RESERVE_MINUTES } from './state.js';
import { bySlug, VISIBLE } from '../data/products.js';
import { CONTACTS, getWaLink } from '../data/contacts.js';
import { $, $$, esc, r2, brl, pix, parcelas, plural, icon, WA_ICON, toast, flyToCart } from './utils.js';
import { openOverlay, closeOverlay } from './overlay.js';

export function lineProduct(l) {
  return bySlug[l.slug];
}

export function cartCount() {
  return state.cart.reduce((n, l) => n + l.qty, 0);
}

export function calcCart(shipCost = null) {
  const sub = r2(state.cart.reduce((s, l) => s + (lineProduct(l) ? lineProduct(l).price * l.qty : 0), 0));
  const was = r2(state.cart.reduce((s, l) => {
    const p = lineProduct(l);
    return s + (p ? (p.was || p.price) * l.qty : 0);
  }, 0));

  const couponOff = state.coupon && COUPONS[state.coupon] ? r2(sub * COUPONS[state.coupon]) : 0;
  const items = r2(sub - couponOff);
  const pixOff = state.form.pay === 'pix' ? r2(items * PIX_DISCOUNT) : 0;
  const ship = shipCost == null ? 0 : shipCost;
  const total = r2(items - pixOff + ship);

  const freeShip = items >= FREE_SHIP_THRESHOLD;
  const missing = r2(Math.max(0, FREE_SHIP_THRESHOLD - items));

  return {
    sub,
    was,
    savings: r2(was - sub + couponOff + pixOff),
    couponOff,
    items,
    pixOff,
    ship,
    total,
    freeShip,
    missing
  };
}

export function addToCart(p, ci = 0, si = 0, qty = 1, opts = {}) {
  const key = `${p.slug}|${ci}|${si}`;
  const line = state.cart.find(l => l.key === key);
  if (line) {
    line.qty += qty;
  } else {
    state.cart.push({ key, slug: p.slug, ci, si, qty });
  }

  if (!state.reserveEnd || state.reserveEnd < Date.now()) {
    state.reserveEnd = Date.now() + RESERVE_MINUTES * 60000;
    persistReserve();
  }

  persistCart();

  const after = () => {
    bumpBag();
    updateBag();
    if (opts.openCart) {
      openOverlay('cart');
    } else {
      toast(`${icon('check')}<span><b>${esc(p.name)}</b> adicionada à sacola!</span><button data-action="open-cart">Ver sacola</button>`);
    }
  };

  if (opts.fromImg) {
    flyToCart(opts.fromImg, after);
  } else {
    after();
  }
}

export function bumpBag() {
  const b = $('#bagBtn');
  if (!b) return;
  b.classList.remove('bump');
  void b.offsetWidth;
  b.classList.add('bump');
}

export function updateBag() {
  const n = cartCount();
  const c = $('#bagCount');
  if (c) {
    c.textContent = n;
    c.classList.toggle('is-on', n > 0);
  }
  const bagBtn = $('#bagBtn');
  if (bagBtn) {
    bagBtn.setAttribute('aria-label', n ? `Abrir sacola, ${plural(n, 'item', 'itens')}` : 'Abrir sacola');
  }
  renderCart();
  updateBars();
}

export function updateBars() {
  const n = cartCount();
  const mc = $('#minicart');
  if (!mc) return;

  const show = n > 0 && (state.page === 'home' || state.page === 'loja');
  mc.classList.toggle('is-on', show);
  mc.setAttribute('aria-hidden', show ? 'false' : 'true');

  if (show) {
    const t = calcCart();
    const countEl = $('#mcCount');
    const totalEl = $('#mcTotal');
    if (countEl) countEl.textContent = `Sacola · ${plural(n, 'item', 'itens')}`;
    if (totalEl) totalEl.textContent = `${brl(t.items)} · ${brl(pix(t.items))} no Pix`;
  }

  const pdpBar = $('#pdpBar');
  const pdpBarOn = pdpBar && pdpBar.classList.contains('is-on');
  document.body.classList.toggle('has-bar', (show && innerWidth < 960) || (pdpBarOn && innerWidth < 960));
}

export function upsellFor() {
  // 1) Outra cor da mesma peça que já está na sacola
  for (const l of state.cart) {
    const p = lineProduct(l);
    if (!p || p.hidden || p.colors.length < 2) continue;
    const ci = p.colors.findIndex((c, i) => !state.cart.some(x => x.slug === p.slug && x.ci === i));
    if (ci > -1) {
      return {
        title: 'Uma de cada, por favor?',
        sub: `Leve a ${p.name} também na elegante cor ${p.colors[ci][0].toLowerCase()}.`,
        items: [{ p, ci, si: l.si }]
      };
    }
  }

  // 2) Complete o look
  const inCart = new Set(state.cart.map(l => l.slug));
  const hasTop = state.cart.some(l => {
    const p = lineProduct(l);
    return p && p.cats.some(c => ['blusas', 'basicas', 'tshirts'].includes(c));
  });
  const want = hasTop ? ['calcas', 'shorts'] : ['blusas', 'basicas'];
  const t = calcCart();
  const items = VISIBLE.filter(p => !inCart.has(p.slug) && p.cats.some(c => want.includes(c)))
    .sort((a, b) => Math.abs(a.price - t.missing) - Math.abs(b.price - t.missing))
    .slice(0, 2)
    .map(p => ({ p, ci: 0, si: p.sizes.length === 1 ? 0 : -1 }));

  return {
    title: 'Combina com a sua sacola',
    sub: t.freeShip ? 'Perfeito para completar a produção.' : `Faltam apenas ${brl(t.missing)} para você ganhar frete grátis.`,
    items
  };
}

export function renderCart() {
  const body = $('#cartBody');
  const foot = $('#cartFoot');
  if (!body || !foot) return;

  if (!state.cart.length) {
    body.innerHTML = `
      <div class="empty">
        <div style="font-size:48px;margin-bottom:12px;color:var(--rose-2)">🛍️</div>
        <h3>Sua sacolinha está vazia</h3>
        <p>As novidades da coleção de moda feminina estão esperando por você.</p>
        <button class="btn btn--wine" data-action="go" data-href="#/loja/novidades">Ver novidades</button>
      </div>`;
    foot.innerHTML = '';
    foot.style.display = 'none';
    return;
  }

  foot.style.display = '';
  const t = calcCart();
  const up = upsellFor();

  body.innerHTML = `
    <div class="reserve">
      ${icon('clock')}
      <span>
        <span class="reserve__big">Deixamos separadinho pra você</span>
        <span data-reserve>por <b>15:00</b> minutos</span>
      </span>
    </div>
    
    <div class="ship-meter ${t.freeShip ? 'is-free' : ''}">
      ${t.freeShip
        ? `${icon('check', 'style="width:18px;height:18px;vertical-align:-4px;color:var(--ok)"')} <b>Parabéns! Você ganhou Frete Grátis.</b>`
        : `Faltam <b>${brl(t.missing)}</b> para o seu <b>Frete Grátis</b>`
      }
      <div class="meter">
        <i style="--v:${Math.min(1, t.items / FREE_SHIP_THRESHOLD).toFixed(3)}"></i>
      </div>
    </div>

    <div>
      ${state.cart.map(l => {
        const p = lineProduct(l);
        if (!p) return '';
        return `
        <div class="line-item">
          <a href="#/p/${p.slug}" data-action="go" data-href="#/p/${p.slug}">
            <img src="${p.imgs[0]}" alt="${esc(p.name)}" style="object-position:${p.pos}">
          </a>
          <div>
            <div class="line-item__top">
              <div>
                <p class="line-item__name">${esc(p.name)}</p>
                <p class="line-item__meta">${esc(p.colors[l.ci][0])} · ${p.sizes[l.si] === 'Único' ? 'Tam. Único' : 'Tam. ' + p.sizes[l.si]}</p>
              </div>
              <button class="rm" data-action="remove" data-key="${l.key}" aria-label="Remover ${esc(p.name)}">
                ${icon('trash')}
              </button>
            </div>
            <div class="line-item__bottom">
              <div class="qty">
                <button data-action="dec" data-key="${l.key}" aria-label="Diminuir">${icon('minus')}</button>
                <span>${l.qty}</span>
                <button data-action="inc" data-key="${l.key}" aria-label="Aumentar">${icon('plus')}</button>
              </div>
              <span class="line-item__price">
                ${p.was ? `<s style="font-size:13px;color:var(--ink-muted);font-family:var(--f-sans);margin-right:6px">${brl(p.was * l.qty)}</s>` : ''}
                ${brl(p.price * l.qty)}
              </span>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>

    ${up.items.length ? `
    <div class="upsell">
      <p class="upsell__title">${up.title}</p>
      <p class="upsell__sub">${up.sub}</p>
      <div class="upsell__list">
        ${up.items.map(u => `
        <div class="mini">
          <span class="mini__media">
            <img src="${u.p.imgs[0]}" alt="" style="object-position:${u.p.pos}">
            ${u.p.colors.length > 1 ? `<i class="mini__dot" style="background:${u.p.colors[u.ci][1]}"></i>` : ''}
          </span>
          <div>
            <p class="mini__name">${esc(u.p.name)}${u.p.colors.length > 1 ? ` · ${esc(u.p.colors[u.ci][0])}` : ''}</p>
            <p class="mini__price">${brl(u.p.price)}</p>
          </div>
          <button class="btn btn--ghost-wine" data-action="upsell-add" data-slug="${u.p.slug}" data-ci="${u.ci}" data-si="${u.si}">
            ${icon('plus', 'style="width:16px;height:16px"')} Levar
          </button>
        </div>`).join('')}
      </div>
    </div>` : ''}

    <form class="coupon" data-form="coupon" autocomplete="off">
      <input name="code" placeholder="CUPOM (Ex: BEMVINDA)" aria-label="Cupom de desconto" value="${state.coupon || ''}">
      <button class="btn btn--ghost-wine" type="submit">Aplicar</button>
    </form>
    
    ${state.coupon ? `
      <p class="coupon-ok">
        ${icon('tag', 'style="width:16px;height:16px;vertical-align:-3px"')}
        Cupom <b>${state.coupon}</b> ativo (−${Math.round((COUPONS[state.coupon] || 0.1) * 100)}%) ·
        <button class="link" data-action="coupon-remove">remover</button>
      </p>` : ''}
  `;

  foot.innerHTML = `
    <div class="totals">
      <div><span>Subtotal (${plural(cartCount(), 'peça', 'peças')})</span><span>${brl(t.sub)}</span></div>
      ${t.couponOff ? `<div class="t-off"><span>Cupom ${state.coupon}</span><span>−${brl(t.couponOff)}</span></div>` : ''}
      <div><span>Frete</span><span>${t.freeShip ? '<b style="color:var(--ok)">Grátis</b>' : 'calculado no checkout'}</span></div>
      <div class="t-total"><span>Total</span><span>${brl(t.items)}</span></div>
      <div class="t-pix">
        ${icon('pix', 'style="width:16px;height:16px;vertical-align:-3px"')} <b>${brl(pix(t.items))}</b> no Pix · ${parcelas(t.items)}
      </div>
    </div>
    <button class="btn btn--wine btn--block" data-action="checkout">${icon('lock')} Finalizar compra</button>
    <a class="btn btn--ghost-wine btn--block" href="${getWaLink(cartWaMsg())}" target="_blank" rel="noopener">
      ${WA_ICON} Finalizar pelo WhatsApp
    </a>
  `;
}

export function cartWaMsg() {
  const t = calcCart();
  const lines = state.cart.map(l => {
    const p = lineProduct(l);
    if (!p) return '';
    return `• ${l.qty}x ${p.name} (${p.colors[l.ci][0]}, ${p.sizes[l.si] === 'Único' ? 'Tam. Único' : 'Tam. ' + p.sizes[l.si]}) - ${brl(p.price * l.qty)}`;
  }).filter(Boolean).join('\n');

  return `Olá! Vim pelo site da ${CONTACTS.storeName} e separei minha sacola:\n\n${lines}\n\n${state.coupon ? `Cupom aplicado: ${state.coupon}\n` : ''}Subtotal: ${brl(t.items)}\nValor no Pix (com 5% OFF): ${brl(pix(t.items))}\n\nPode separar as peças pra mim?`;
}

export function applyCoupon(code) {
  code = (code || '').trim().toUpperCase();
  if (!COUPONS[code]) {
    toast(`<span>Cupom “${esc(code || '—')}” não é válido.</span>`);
    return false;
  }
  state.coupon = code;
  persistCoupon();
  renderCart();
  updateBars();
  toast(`${icon('check')}<span>Cupom <b>${code}</b> aplicado: −${Math.round(COUPONS[code] * 100)}% de desconto!</span>`);
  return true;
}

export function removeCoupon() {
  state.coupon = null;
  persistCoupon();
  renderCart();
  updateBars();
}
