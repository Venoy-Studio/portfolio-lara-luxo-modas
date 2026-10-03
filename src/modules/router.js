// Single Page Application Hash Router

import { state } from './state.js';
import { renderHome, renderShop, renderProduct } from './views.js';
import { renderCheckout, renderOrder } from './checkout.js';
import { openOverlay, closeOverlay, hideWelcome, getCurrentOverlay } from './overlay.js';
import { updateBars } from './cart.js';
import { observeReveal, scrollToId } from './ui.js';
import { $, $$ } from './utils.js';

export function router() {
  if (state.curHash && !state.curHash.startsWith('#/checkout') && !state.curHash.startsWith('#/pedido')) {
    state.prevHash = state.curHash;
  }
  state.curHash = location.hash || '#/';

  if (getCurrentOverlay()) {
    closeOverlay(true);
  }

  const h = location.hash || '#/';
  let m;
  let page = 'home';

  if ((m = h.match(/^#\/p\/([\w-]+)/))) {
    page = 'produto';
    renderProduct(m[1]);
  } else if ((m = h.match(/^#\/loja(?:\/([\w-]+))?/))) {
    page = 'loja';
    renderShop(m[1] || 'todas');
  } else if (h.startsWith('#/checkout')) {
    page = 'checkout';
    renderCheckout();
  } else if (h.startsWith('#/pedido')) {
    page = 'pedido';
    renderOrder();
  } else {
    page = 'home';
    renderHome();
  }

  state.page = page;
  document.body.dataset.page = page;

  // Atualizar classe ativa na navegação
  $$('.nav a').forEach(a => {
    a.classList.toggle('is-active', page === 'loja' && h === '#/loja/' + a.dataset.nav);
  });

  if (!state.scrollTarget) {
    window.scrollTo(0, 0);
  }

  observeReveal();
  updateBars();

  if (state.scrollTarget) {
    const t = state.scrollTarget;
    state.scrollTarget = null;
    setTimeout(() => scrollToId(t), 80);
  }

  if (page === 'checkout' || page === 'pedido') {
    hideWelcome();
  }

  if (state.openCartAfter) {
    state.openCartAfter = false;
    setTimeout(() => openOverlay('cart'), 100);
  }
}
