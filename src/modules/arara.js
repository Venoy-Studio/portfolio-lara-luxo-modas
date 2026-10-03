// 3D Rotating Clothes Rack Engine (Arara 3D)

import { bySlug, ARARA_SLUGS } from '../data/products.js';
import { $, $$, brl, pix, reduceMotion } from './utils.js';

export function initArara() {
  const root = $('#arara');
  if (!root) return () => {};

  const stage = $('.arara__stage', root);
  const ring = $('.arara__ring', root);
  const looks = $$('.look', root);
  const items = ARARA_SLUGS.map(s => bySlug[s]).filter(Boolean);
  const N = looks.length;
  const STEP = 360 / N;

  const nm = $('[data-ar="name"]', root);
  const pr = $('[data-ar="price"]', root);
  const nEl = $('[data-ar="n"]', root);
  const goEl = $('[data-ar="go"]', root);

  let front = -1;

  const updateInfo = i => {
    if (i === front) return;
    front = i;
    const p = items[i];
    if (!p) return;
    if (nEl) nEl.textContent = i + 1;
    if (nm) nm.textContent = p.name;
    if (pr) pr.innerHTML = `<b>${brl(p.price)}</b> · ${brl(pix(p.price))} no Pix`;
    if (goEl) goEl.href = '#/p/' + p.slug;
    looks.forEach((el, k) => el.classList.toggle('is-front', k === i));
  };

  const ok3d = window.CSS && CSS.supports && CSS.supports('transform-style', 'preserve-3d') && CSS.supports('perspective', '1px');
  if (!ok3d) {
    root.classList.add('arara--flat');
    updateInfo(0);
    looks.forEach((el, i) => {
      el.addEventListener('click', () => {
        location.hash = '#/p/' + items[i].slug;
      });
    });
    $('[data-ar="prev"]', root)?.addEventListener('click', () => updateInfo((front - 1 + N) % N));
    $('[data-ar="next"]', root)?.addEventListener('click', () => updateInfo((front + 1) % N));
    return () => {};
  }

  let R = 260;
  let angle = 0;
  let vel = 0;
  let pxPerDeg = 3;
  let dragging = false;
  let moved = 0;
  let lastX = 0;
  let lastT = 0;
  let raf = 0;
  let hinted = false;
  let wheelT = 0;
  let pid = null;

  const wrap = a => ((a % 360) + 540) % 360 - 180;

  function layout() {
    const vw = Math.min(innerWidth, 1440);
    const cw = Math.round(Math.max(126, Math.min(vw * 0.35, 196)));
    const ch = Math.round(cw * 4 / 3);
    R = Math.round((cw / 2) / Math.tan(Math.PI / N) * 1.14);

    root.style.setProperty('--card-w', cw + 'px');
    root.style.setProperty('--card-h', ch + 'px');
    root.style.setProperty('--r', R + 'px');
    root.style.setProperty('--step', STEP + 'deg');
    root.style.setProperty('--persp', Math.round(Math.max(760, R * 3.3)) + 'px');
    pxPerDeg = (2 * Math.PI * R / 360) * 0.85;

    render();
    drawRail();
  }

  function drawRail() {
    const rail = $('.arara__rail', root);
    const back = $('.arara__svg--back', root);
    const frontSvg = $('.arara__svg--front', root);
    if (!rail || !stage || !back || !frontSvg) return;

    const sb = stage.getBoundingClientRect();
    const rb = rail.getBoundingClientRect();
    if (!rb.width) return;

    const cx = rb.left + rb.width / 2 - sb.left;
    const cy = rb.top + rb.height / 2 - sb.top;
    const rx = rb.width / 2 - 2;
    const ry = Math.max(4, rb.height / 2 - 2);
    const floor = sb.height - 34;
    const arc = sweep => `M${(cx - rx).toFixed(1)} ${cy.toFixed(1)}A${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 ${sweep} ${(cx + rx).toFixed(1)} ${cy.toFixed(1)}`;
    const grad = '<defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stop-color="#9a645b"/><stop offset=".3" stop-color="#f3d2c8"/><stop offset=".5" stop-color="#c8907f"/><stop offset=".72" stop-color="#f7ded5"/><stop offset="1" stop-color="#9a645b"/></linearGradient><linearGradient id="pg" x1="0" x2="1"><stop offset="0" stop-color="#8f5a52"/><stop offset=".5" stop-color="#f7ded5"/><stop offset="1" stop-color="#8f5a52"/></linearGradient></defs>';

    back.innerHTML = grad + `<ellipse cx="${cx}" cy="${floor}" rx="34" ry="7" fill="#220207" opacity=".55"/><rect x="${cx - 2.5}" y="${cy}" width="5" height="${floor - cy}" rx="2.5" fill="url(#pg)"/><ellipse cx="${cx}" cy="${floor}" rx="22" ry="4.5" fill="url(#pg)"/><path d="${arc(1)}" fill="none" stroke="#7a4640" stroke-width="5" stroke-linecap="round"/><path d="${arc(1)}" fill="none" stroke="url(#rg)" stroke-width="3" stroke-linecap="round" opacity=".85"/>`;
    frontSvg.innerHTML = grad.replace(/id="rg"/, 'id="rg2"').replace(/id="pg"/, 'id="pg2"') + `<path d="${arc(0)}" fill="none" stroke="#6e3d38" stroke-width="5.5" stroke-linecap="round"/><path d="${arc(0)}" fill="none" stroke="url(#rg2)" stroke-width="3.4" stroke-linecap="round"/>`;
  }

  function render() {
    if (!ring) return;
    ring.style.transform = `translateZ(${-R}px) rotateY(${-angle}deg)`;
    for (let i = 0; i < N; i++) {
      const d = Math.abs(wrap(i * STEP - angle));
      if (looks[i]) {
        looks[i].style.setProperty('--shade', Math.min(0.74, d / 115).toFixed(3));
      }
    }
    updateInfo(((Math.round(angle / STEP) % N) + N) % N);
  }

  function animateTo(target, dur) {
    cancelAnimationFrame(raf);
    if (reduceMotion) {
      angle = target;
      render();
      return;
    }
    const from = angle;
    const delta = target - from;
    const t0 = performance.now();
    const D = dur || Math.min(950, Math.max(420, Math.abs(delta) * 10));
    const ease = t => 1 - Math.pow(1 - t, 3);
    const tick = now => {
      const t = Math.min(1, (now - t0) / D);
      angle = from + delta * ease(t);
      render();
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  const snap = a => Math.round(a / STEP) * STEP;
  const hideHint = () => {
    hinted = true;
    const h = $('.arara__hint', root);
    if (h) h.classList.add('is-off');
  };

  const go = dir => {
    hideHint();
    animateTo(snap(angle) + dir * STEP);
  };

  const goTo = i => {
    const cur = snap(angle);
    const ci = ((Math.round(cur / STEP) % N) + N) % N;
    let diff = i - ci;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    hideHint();
    animateTo(cur + diff * STEP);
  };

  const onPointerDown = e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true;
    moved = 0;
    vel = 0;
    lastX = e.clientX;
    lastT = performance.now();
    pid = e.pointerId;
    cancelAnimationFrame(raf);
  };

  const onPointerMove = e => {
    if (!dragging || e.pointerId !== pid) return;
    const now = performance.now();
    const dx = e.clientX - lastX;
    moved += Math.abs(dx);
    if (moved > 5 && !stage.classList.contains('is-drag')) {
      stage.classList.add('is-drag');
      try { stage.setPointerCapture(e.pointerId); } catch (_) {}
      hideHint();
    }
    if (moved > 5) {
      angle -= dx / pxPerDeg;
      const v = (-dx / pxPerDeg) / Math.max(8, now - lastT);
      vel = vel * 0.6 + v * 0.4;
      render();
    }
    lastX = e.clientX;
    lastT = now;
  };

  const onPointerUp = e => {
    if (!dragging) return;
    dragging = false;
    const wasDrag = stage.classList.contains('is-drag');
    stage.classList.remove('is-drag');
    if (wasDrag) {
      animateTo(snap(angle + Math.max(-1, Math.min(1, vel)) * 220));
      return;
    }
    const look = e.target.closest && e.target.closest('.look');
    if (look) {
      const i = +look.dataset.i;
      if (i === front) {
        location.hash = '#/p/' + items[i].slug;
      } else {
        goTo(i);
      }
    }
  };

  const onKeyDown = e => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (items[front]) location.hash = '#/p/' + items[front].slug;
    }
  };

  stage.addEventListener('pointerdown', onPointerDown);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerup', onPointerUp);
  stage.addEventListener('pointercancel', () => {
    if (dragging) {
      dragging = false;
      stage.classList.remove('is-drag');
      animateTo(snap(angle));
    }
  });
  stage.addEventListener('keydown', onKeyDown);

  const prevBtn = $('[data-ar="prev"]', root);
  const nextBtn = $('[data-ar="next"]', root);
  const onPrev = () => go(-1);
  const onNext = () => go(1);

  prevBtn?.addEventListener('click', onPrev);
  nextBtn?.addEventListener('click', onNext);

  const onResize = () => layout();
  window.addEventListener('resize', onResize);

  layout();

  return () => {
    stage.removeEventListener('pointerdown', onPointerDown);
    stage.removeEventListener('pointermove', onPointerMove);
    stage.removeEventListener('pointerup', onPointerUp);
    stage.removeEventListener('keydown', onKeyDown);
    prevBtn?.removeEventListener('click', onPrev);
    nextBtn?.removeEventListener('click', onNext);
    window.removeEventListener('resize', onResize);
    cancelAnimationFrame(raf);
  };
}
