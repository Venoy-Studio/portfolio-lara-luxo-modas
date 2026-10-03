// Live Search Engine

import { VISIBLE } from '../data/products.js';
import { $, norm, esc, brl, pix, icon } from './utils.js';

export function renderSearch(q = '') {
  const body = $('#searchBody');
  if (!body) return;

  const nq = norm(q.trim());
  const res = nq
    ? VISIBLE.filter(p => norm(p.name + ' ' + p.cats.join(' ') + ' ' + p.colors.map(c => c[0]).join(' ')).includes(nq))
    : [];

  body.innerHTML = `
    ${!nq ? `<p class="search__hint">Buscas mais populares da semana</p>` : ''}
    <div class="chips">
      ${['Regata', 'Wide Leg', 'Alfaiataria', 'Conjunto', 'Shorts', 'Listrada', 'Liquida'].map(s => `
        <button class="chip" data-action="search-chip" data-q="${s}">${s}</button>
      `).join('')}
    </div>
    <div class="search__results">
      ${nq && !res.length ? `
        <p class="search__hint" style="margin-top:24px">
          Não encontramos resultados para “${esc(q)}”.<br>
          Chame nossa equipe no WhatsApp que nós verificamos o estoque para você!
        </p>` : ''}
      ${res.map(p => `
        <a class="mini" href="#/p/${p.slug}" data-action="go" data-href="#/p/${p.slug}">
          <img src="${p.imgs[0]}" alt="${esc(p.name)}" style="object-position:${p.pos}">
          <div>
            <p class="mini__name">${esc(p.name)}</p>
            <p class="mini__price">${brl(p.price)} <span style="color:var(--ok);font-weight:600">· ${brl(pix(p.price))} no Pix</span></p>
          </div>
          ${icon('chevR')}
        </a>
      `).join('')}
    </div>
  `;
}
