// Modal & Drawer Overlay Controller

import { $ } from './utils.js';
import { updateBars } from './cart.js';

let currentOverlay = null;
let lastFocus = null;

const OV = {
  cart: '#cart',
  menu: '#menu',
  sheet: '#sheet',
  search: '#search'
};

export function getCurrentOverlay() {
  return currentOverlay;
}

export function openOverlay(name) {
  if (currentOverlay) closeOverlay(true);
  const el = $(OV[name]);
  if (!el) return;

  lastFocus = document.activeElement;
  el.removeAttribute('inert');
  el.setAttribute('aria-hidden', 'false');

  requestAnimationFrame(() => el.classList.add('is-open'));

  if (name !== 'search') {
    const scrim = $('#scrim');
    if (scrim) scrim.classList.add('is-on');
  }

  document.documentElement.classList.add('lock');
  currentOverlay = name;

  hideWelcome();
  updateBars();

  setTimeout(() => {
    const f = name === 'search' ? $('#searchInput') : el.querySelector('button, a, input');
    if (f && f.focus) f.focus({ preventScroll: true });
  }, 60);
}

export function closeOverlay(silent = false) {
  if (!currentOverlay) return;
  const el = $(OV[currentOverlay]);
  if (el) {
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('inert', '');
  }

  const scrim = $('#scrim');
  if (scrim) scrim.classList.remove('is-on');

  document.documentElement.classList.remove('lock');
  currentOverlay = null;

  updateBars();

  if (!silent && lastFocus && lastFocus.focus && document.contains(lastFocus)) {
    lastFocus.focus({ preventScroll: true });
  }
}

export function showWelcome() {
  const w = $('#welcome');
  if (!w || w.classList.contains('is-on')) return;
  w.classList.add('is-on');
  w.setAttribute('aria-hidden', 'false');
}

export function hideWelcome() {
  const w = $('#welcome');
  if (!w) return;
  w.classList.remove('is-on');
  w.setAttribute('aria-hidden', 'true');
}
