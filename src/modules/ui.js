// Global UI Controllers, Tickers, and Event Delegations

import { state, persistFav } from './state.js';
import { bySlug } from '../data/products.js';
import { CONTACTS, getWaLink } from '../data/contacts.js';
import { openOverlay, closeOverlay, showWelcome, hideWelcome, getCurrentOverlay } from './overlay.js';
import { addToCart, updateBag, renderCart, updateBars, applyCoupon, removeCoupon } from './cart.js';
import { renderCheckout } from './checkout.js';
import { openQuick, openSizeGuide } from './quickview.js';
import { renderSearch } from './search.js';
import { router } from './router.js';
import { $, $$, icon, toast, reduceMotion } from './utils.js';

let revealIO = null;

export function observeReveal() {
  const app = $('#app');
  const els = $$('.reveal:not(.is-in)', app);
  if (!('IntersectionObserver' in window) || reduceMotion) {
    els.forEach(el => el.classList.add('is-in'));
    return;
  }
  if (!revealIO) {
    revealIO = new IntersectionObserver(ens => {
      ens.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          revealIO.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });
  }
  els.forEach(el => revealIO.observe(el));
}

const pad = n => String(n).padStart(2, '0');

export function tickTimers() {
  $$('[data-countdown]').forEach(el => {
    let s = Math.max(0, Math.floor((+el.dataset.countdown - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s -= d * 86400;
    const h = Math.floor(s / 3600); s -= h * 3600;
    const m = Math.floor(s / 60); s -= m * 60;

    const set = (k, v) => {
      const b = $(`[data-cd="${k}"]`, el);
      if (b && b.textContent !== String(v)) b.textContent = v;
    };
    set('d', d); set('h', pad(h)); set('m', pad(m)); set('s', pad(s));
  });

  const left = state.reserveEnd - Date.now();
  $$('[data-reserve]').forEach(el => {
    el.innerHTML = left > 0
      ? `por <b>${pad(Math.floor(left / 60000))}:${pad(Math.floor(left / 1000) % 60)}</b> minutos`
      : 'Peças em sacola sujeitas à disponibilidade de estoque.';
  });
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const header = $('#header');
  const y = el.getBoundingClientRect().top + scrollY - ((header ? header.offsetHeight : 70) + 12);
  window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
}

export function initGlobalListeners() {
  // Event Delegation para Botões e Ações
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const a = t.dataset.action;

    switch (a) {
      case 'open-cart':
        e.preventDefault();
        openOverlay('cart');
        break;

      case 'open-menu':
        openOverlay('menu');
        break;

      case 'open-search':
        renderSearch('');
        const sInp = $('#searchInput');
        if (sInp) sInp.value = '';
        openOverlay('search');
        break;

      case 'close':
        closeOverlay();
        break;

      case 'go':
        e.preventDefault();
        closeOverlay(true);
        if (location.hash === t.dataset.href) {
          router();
        } else {
          location.hash = t.dataset.href;
        }
        break;

      case 'scroll':
        scrollToId(t.dataset.target);
        break;

      case 'go-faq':
        if (state.page === 'home') {
          scrollToId('faq');
        } else {
          state.scrollTarget = 'faq';
          location.hash = '#/';
        }
        break;

      case 'quick': {
        e.preventDefault();
        const card = t.closest('.card');
        openQuick(t.dataset.slug, card && $('.card__media img', card));
        break;
      }

      case 'fav': {
        e.preventDefault();
        const s = t.dataset.slug;
        const on = !state.fav.has(s);
        if (on) {
          state.fav.add(s);
          toast(`${icon('heart')} <span>Adicionado aos seus favoritos!</span>`, 1800);
        } else {
          state.fav.delete(s);
        }
        persistFav();
        $$(`[data-action="fav"][data-slug="${s}"]`).forEach(b => {
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-pressed', on);
        });
        break;
      }

      case 'add-kit':
        addToCart(bySlug['kit-regata-poliamida'], 0, 0, 1, {
          fromImg: $('#kitImg'),
          openCart: true
        });
        break;

      case 'inc':
      case 'dec':
      case 'remove': {
        const l = state.cart.find(x => x.key === t.dataset.key);
        if (!l) break;
        if (a === 'inc') l.qty++;
        else if (a === 'dec') l.qty--;
        if (a === 'remove' || l.qty <= 0) {
          state.cart = state.cart.filter(x => x !== l);
        }
        if (!state.cart.length) state.reserveEnd = 0;
        updateBag();
        break;
      }

      case 'upsell-add': {
        const p = bySlug[t.dataset.slug];
        const ci = +t.dataset.ci;
        const si = +t.dataset.si;
        if (si < 0) {
          closeOverlay(true);
          openQuick(p.slug);
        } else {
          addToCart(p, ci, si, 1, { openCart: true });
        }
        break;
      }

      case 'coupon-remove':
        removeCoupon();
        break;

      case 'checkout':
        closeOverlay(true);
        location.hash = '#/checkout';
        break;

      case 'back-to-bag':
        state.openCartAfter = true;
        location.hash = state.prevHash || '#/';
        break;

      case 'size-guide':
        e.preventDefault();
        openSizeGuide(t.dataset.slug);
        break;

      case 'search-chip': {
        const inp = $('#searchInput');
        if (inp) inp.value = t.dataset.q;
        renderSearch(t.dataset.q);
        break;
      }

      case 'welcome-close':
        hideWelcome();
        break;

      case 'welcome-apply':
        hideWelcome();
        applyCoupon('BEMVINDA');
        break;

      case 'toggle-summary': {
        const w = $('#sumWrap');
        if (w) {
          const on = !w.classList.contains('is-open');
          w.classList.toggle('is-open', on);
          t.setAttribute('aria-expanded', on);
        }
        break;
      }

      case 'copy-pix': {
        const inp = t.parentElement?.querySelector('input');
        if (!inp) return;
        const done = () => toast(`${icon('check')} <span>Código Pix copiado com sucesso!</span>`, 2200);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(inp.value).then(done, () => {
            inp.select();
            done();
          });
        } else {
          inp.select();
          done();
        }
        break;
      }
    }
  });

  // Formulário de Cupom
  document.addEventListener('submit', e => {
    const f = e.target.closest('[data-form="coupon"]');
    if (!f) return;
    e.preventDefault();
    if (applyCoupon(f.code.value) && state.page === 'checkout') {
      renderCheckout();
    }
  });

  // Tecla Escape para Fechar Overlays
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (getCurrentOverlay()) closeOverlay();
      hideWelcome();
    }
  });

  // Campo de Busca em Tempo Real
  const searchInput = $('#searchInput');
  searchInput?.addEventListener('input', e => renderSearch(e.target.value));

  // Ticker de Mensagens da Topbar
  const msgs = $$('.topbar__msg');
  if (msgs.length) {
    let mi = 0;
    setInterval(() => {
      if (document.hidden) return;
      msgs[mi]?.classList.remove('is-on');
      mi = (mi + 1) % msgs.length;
      msgs[mi]?.classList.add('is-on');
    }, 4000);
  }

  // Header Elevation ao Rolar
  const header = $('#header');
  const onScroll = () => {
    if (header) header.classList.toggle('is-scrolled', scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateBars);

  // Exibir Cupom de Boas-Vindas
  setTimeout(() => {
    if (!state.welcomed && !state.coupon && ['home', 'loja'].includes(state.page)) {
      showWelcome();
      state.welcomed = true;
    }
  }, 14000);

  // Intervalo do Cronômetro
  setInterval(tickTimers, 1000);
  onScroll();
}
