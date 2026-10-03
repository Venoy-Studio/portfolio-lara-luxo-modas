// Quick Add & Size Guide Modal Engine

import { bySlug } from '../data/products.js';
import { getWaLink } from '../data/contacts.js';
import { addToCart } from './cart.js';
import { openOverlay, closeOverlay } from './overlay.js';
import { $, $$, esc, brl, pix, icon, WA_ICON } from './utils.js';

export function openQuick(slug, fromImg) {
  const p = bySlug[slug];
  if (!p) return;

  if (p.colors.length === 1 && p.sizes.length === 1) {
    addToCart(p, 0, 0, 1, { fromImg });
    return;
  }

  const sel = { ci: 0, si: p.sizes.length === 1 ? 0 : -1 };
  const sheetBody = $('#sheetBody');
  if (!sheetBody) return;

  sheetBody.innerHTML = `
    <div class="qa">
      <div class="qa__top">
        <img src="${p.imgs[0]}" alt="${esc(p.name)}" style="object-position:${p.pos}">
        <p class="qa__name">${esc(p.name)}</p>
        <p class="qa__price">
          <b>${brl(p.price)}</b> · ${brl(pix(p.price))} no Pix
        </p>
      </div>

      <div class="opt" data-opt="color">
        <p class="opt__label">Cor: <b data-sel="color">${esc(p.colors[sel.ci][0])}</b></p>
        <div class="swatches">
          ${p.colors.map((c, i) => `
            <button class="sw ${i === sel.ci ? 'is-on' : ''}" style="background:${c[1]}" data-ci="${i}" aria-label="${esc(c[0])}" aria-pressed="${i === sel.ci}"></button>
          `).join('')}
        </div>
      </div>

      <div class="opt" data-opt="size">
        <p class="opt__label">
          Tamanho: <b data-sel="size">${sel.si < 0 ? 'Escolha' : (p.sizes[sel.si] === 'Único' ? 'Único' : p.sizes[sel.si])}</b>
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
        <p class="opt__err">Selecione o tamanho para continuar.</p>
      </div>

      <button class="btn btn--wine btn--block" data-action="qa-add">
        ${icon('bagPlus')} Adicionar à Sacola
      </button>

      <p style="margin-top:14px;font-size:13.5px">
        <a class="link" href="#/p/${p.slug}" data-action="go" data-href="#/p/${p.slug}">
          Ver todos os detalhes da peça
        </a>
      </p>
    </div>
  `;

  const root = $('#sheetBody .qa');
  if (!root) return;

  root.addEventListener('click', e => {
    const sw = e.target.closest('.sw[data-ci]');
    const sz = e.target.closest('.sz[data-si]');

    if (sw) {
      sel.ci = +sw.dataset.ci;
      $$('.sw', root).forEach(b => {
        const on = b === sw;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on);
      });
      const colLabel = $('[data-sel="color"]', root);
      if (colLabel) colLabel.textContent = p.colors[sel.ci][0];
    }

    if (sz) {
      sel.si = +sz.dataset.si;
      $$('.sz', root).forEach(b => {
        const on = b === sz;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on);
      });
      const sizeLabel = $('[data-sel="size"]', root);
      if (sizeLabel) sizeLabel.textContent = p.sizes[sel.si] === 'Único' ? 'Tamanho Único' : p.sizes[sel.si];
      $('[data-opt="size"]', root)?.classList.remove('is-error');
    }
  });

  $('[data-action="qa-add"]', root)?.addEventListener('click', () => {
    if (sel.si < 0) {
      const o = $('[data-opt="size"]', root);
      if (o) {
        o.classList.remove('is-error');
        void o.offsetWidth;
        o.classList.add('is-error');
      }
      return;
    }
    closeOverlay(true);
    addToCart(p, sel.ci, sel.si, 1, { fromImg, openCart: true });
  });

  openOverlay('sheet');
}

export function openSizeGuide(slug) {
  const p = bySlug[slug];
  if (!p) return;

  const sheetBody = $('#sheetBody');
  if (!sheetBody) return;

  sheetBody.innerHTML = `
    <div class="qa">
      <p class="sec-head__script" style="margin-top:6px">Tabela de Medidas</p>
      <p class="qa__name">${esc(p.name)}</p>
      <p style="font-size:14px;color:var(--ink-soft);margin:8px auto 6px;max-width:36ch">
        ${p.sizes.includes('Único')
          ? 'Peça em Tamanho Único confeccionada com elastano inteligente: veste com conforto do 36 ao 42/44 (busto de 84 a 102 cm).'
          : 'Medidas corporais de referência em centímetros:'}
      </p>
      <table class="size-table">
        <thead>
          <tr>
            <th>Tamanho</th>
            <th>Busto</th>
            <th>Cintura</th>
            <th>Quadril</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>P · 36/38</td>
            <td>84–88 cm</td>
            <td>66–70 cm</td>
            <td>92–96 cm</td>
          </tr>
          <tr>
            <td>M · 40</td>
            <td>89–94 cm</td>
            <td>71–76 cm</td>
            <td>97–102 cm</td>
          </tr>
          <tr>
            <td>G · 42/44</td>
            <td>95–102 cm</td>
            <td>77–84 cm</td>
            <td>103–110 cm</td>
          </tr>
        </tbody>
      </table>
      <p style="font-size:12.5px;color:var(--ink-muted);margin-bottom:16px">
        Medidas aproximadas. O caimento pode variar conforme o biotipo.
      </p>
      <a class="btn btn--ghost-wine btn--block" href="${getWaLink(`Olá! Tenho uma dúvida sobre as medidas exatas da ${p.name}. Podem me auxiliar?`)}" target="_blank" rel="noopener">
        ${WA_ICON} Medir a peça pelo WhatsApp
      </a>
    </div>
  `;

  openOverlay('sheet');
}
