// Application Entry Point

import './styles/main.css';
import { CONTACTS, getWaLink } from './data/contacts.js';
import { CATS } from './data/products.js';
import { router } from './modules/router.js';
import { updateBag } from './modules/cart.js';
import { initGlobalListeners } from './modules/ui.js';
import { $, icon, WA_ICON } from './modules/utils.js';

function renderMenuDrawer() {
  const menuBody = $('#menuBody');
  if (!menuBody) return;

  menuBody.innerHTML = `
    <nav class="menu-list">
      ${CATS.map(c => `
        <a href="#/loja/${c.slug}" data-action="go" data-href="#/loja/${c.slug}">
          <img src="${c.img}" alt="${c.name}">
          ${c.name}
          ${c.tag ? `<small style="font-family:var(--f-sans);font-size:12px;color:var(--rose-deep);margin-left:auto">${c.tag}</small>` : ''}
        </a>
      `).join('')}
      <a href="#/loja/todas" data-action="go" data-href="#/loja/todas">
        <span style="width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:var(--blush);color:var(--vinho)">
          ${icon('bag')}
        </span>
        Todas as peças
      </a>
    </nav>

    <div class="menu-meta">
      <a class="btn btn--wine" href="${getWaLink('Olá! Vim pelo site da Lara Luxo.')}" target="_blank" rel="noopener">
        ${WA_ICON} ${CONTACTS.whatsapp}
      </a>
      <a class="link" href="${CONTACTS.social.instagram}" target="_blank" rel="noopener">
        ${CONTACTS.social.instagramHandle}
      </a>
      <p style="font-size:13.5px;line-height:1.4">
        ${CONTACTS.address.street}<br>
        ${CONTACTS.address.complement} · ${CONTACTS.address.neighborhood}
      </p>
      <p style="font-size:12.5px;color:var(--ink-muted)">
        ${CONTACTS.hours.weekdays}
      </p>
    </div>
  `;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  renderMenuDrawer();
  initGlobalListeners();
  window.addEventListener('hashchange', router);
  updateBag();
  router();
});
