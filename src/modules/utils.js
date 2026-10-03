// Utility Helpers & Icons

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

export const esc = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

export const r2 = v => Math.round(v * 100) / 100;

export const brl = v => 'R$ ' + r2(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const pix = (v, off = 0.05) => r2(v * (1 - off));

export const parcelas = v => {
  const n = v >= 75 ? 3 : v >= 40 ? 2 : 1;
  return n > 1 ? `ou ${n}x de ${brl(v / n)} sem juros` : 'ou no cartão de crédito';
};

export const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;

export const norm = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export const reduceMotion = typeof window !== 'undefined' && window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

export const IC = {
  bag: '<path d="M5.2 7.6h13.6l-1 12.1a1.6 1.6 0 0 1-1.6 1.5H7.8a1.6 1.6 0 0 1-1.6-1.5z"/><path d="M8.8 10.4V6.9a3.2 3.2 0 0 1 6.4 0v3.5"/>',
  bagPlus: '<path d="M5.2 7.6h13.6l-1 12.1a1.6 1.6 0 0 1-1.6 1.5H7.8a1.6 1.6 0 0 1-1.6-1.5z"/><path d="M8.8 10.4V6.9a3.2 3.2 0 0 1 6.4 0v3.5M12 13v4.6M9.7 15.3h4.6"/>',
  heart: '<path d="M12 20s-7.2-4.5-7.2-10.1A4.1 4.1 0 0 1 12 7.3a4.1 4.1 0 0 1 7.2 2.6C19.2 15.5 12 20 12 20z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>',
  truck: '<path d="M3 6.5h11v9.5H3zM14 10h4l3 3.2V16h-7"/><circle cx="7" cy="17.6" r="1.7"/><circle cx="17.2" cy="17.6" r="1.7"/>',
  pix: '<path d="m12 3.2 3.4 3.4a1.8 1.8 0 0 0 1.3.5h.9l3 3a2.7 2.7 0 0 1 0 3.8l-3 3h-.9a1.8 1.8 0 0 0-1.3.5L12 20.8l-3.4-3.4a1.8 1.8 0 0 0-1.3-.5h-.9l-3-3a2.7 2.7 0 0 1 0-3.8l3-3h.9a1.8 1.8 0 0 0 1.3-.5z"/>',
  swap: '<path d="M4 8.5h13.5L14 5M20 15.5H6.5L10 19"/>',
  pin: '<path d="M12 21s-6.2-5.5-6.2-10.6a6.2 6.2 0 0 1 12.4 0C18.2 15.5 12 21 12 21z"/><circle cx="12" cy="10.4" r="2.2"/>',
  clock: '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3 1.9"/>',
  store: '<path d="M4 9.5 5.6 4.5h12.8L20 9.5M4.6 11.5V20h14.8v-8.5M4 9.5c0 1.4 1.1 2.5 2.6 2.5s2.6-1.1 2.6-2.5c0 1.4 1.2 2.5 2.8 2.5s2.8-1.1 2.8-2.5c0 1.4 1.1 2.5 2.6 2.5S20 10.9 20 9.5M10 20v-4.6h4V20"/>',
  ig: '<rect x="3.6" y="3.6" width="16.8" height="16.8" rx="5"/><circle cx="12" cy="12" r="3.9"/><circle cx="17.1" cy="6.9" r=".7" fill="currentColor"/>',
  chevL: '<path d="M14.5 5.5 8 12l6.5 6.5"/>',
  chevR: '<path d="M9.5 5.5 16 12l-6.5 6.5"/>',
  check: '<path d="m5 12.6 4.3 4.2L19 7.2"/>',
  card: '<rect x="3" y="5.8" width="18" height="12.8" rx="2.2"/><path d="M3 10h18M7 15h3"/>',
  arrowR: '<path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5"/>',
  hand: '<path d="M8.5 12.5V6.6a1.4 1.4 0 0 1 2.8 0V11M11.3 10.6V5.4a1.4 1.4 0 0 1 2.8 0v5.2M14.1 10.6V7a1.4 1.4 0 0 1 2.8 0v6.6c0 3.4-2.6 6.4-6 6.4h-.4a5.8 5.8 0 0 1-4.5-2.2l-2.3-3a1.4 1.4 0 0 1 2.2-1.8l1.6 1.9"/>',
  ruler: '<path d="M3.5 16.5 16.5 3.5l4 4-13 13z"/><path d="m7.5 12.5 2 2M10.5 9.5l2 2M13.5 6.5l2 2"/>',
  tag: '<path d="M3.5 12.4V4.9c0-.8.6-1.4 1.4-1.4h7.5l8.1 8.1-8.9 8.9z"/><circle cx="8" cy="8" r="1.4"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>',
  sparkle: '<path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.7l-1.6-5.5L5 10.6 10.4 9z"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'
};

export const icon = (n, extra = '') => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" ${extra}>${IC[n] || ''}</svg>`;

export const WA_ICON = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 11.7a8.4 8.4 0 0 1-12.3 7.4L3.6 20.4l1.4-4.3a8.4 8.4 0 1 1 15.4-4.4z"/><path d="M8.9 8.4c.2-.5.5-.6.8-.6h.6c.2 0 .4 0 .5.4l.8 1.8c.1.2.1.4-.1.6l-.5.6c-.1.1-.2.3 0 .5.6 1 1.5 1.9 2.6 2.5.2.1.3.1.5 0l.6-.7c.2-.2.4-.2.6-.1l1.8.8c.3.1.4.3.4.5v.6c0 .3-.1.6-.6.8-.6.3-1.5.5-2.4.2-2.3-.7-4.4-2.8-5.1-5.1-.3-.9-.1-1.8.2-2.4z" fill="currentColor" stroke="none"/></svg>';

export const FLOURISH = (cls = 'logo__flourish') => `<svg class="${cls}" viewBox="0 0 240 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M24 8h192"/><path d="M24 8c-5 0-10.5-.6-13-3.4C8.6 2 4.7 2.2 3.4 4.8 2 7.6 4.2 10.8 7.3 10.6c2.6-.2 3.8-2.6 2.6-4.3-.9-1.2-2.8-1.1-3.3.2"/><path d="M216 8c5 0 10.5-.6 13-3.4 2.4-2.6 6.3-2.4 7.6.2 1.4 2.8-.8 6-3.9 5.8-2.6-.2-3.8-2.6-2.6-4.3.9-1.2 2.8-1.1 3.3.2"/></svg>`;

export const HEART_DOTS = '<svg class="logo__heart" viewBox="0 0 40 40" aria-hidden="true" fill="none" stroke="currentColor"><circle cx="20" cy="20" r="15.5" stroke-width="1.9" stroke-linecap="round" stroke-dasharray="0.01 4.6"/><path d="M20 26.6s-6-3.7-6-8a3.3 3.3 0 0 1 6-1.9 3.3 3.3 0 0 1 6 1.9c0 4.3-6 8-6 8z" stroke-width="1.8" stroke-linejoin="round"/></svg>';

export const LOGO_INNER = `<span class="logo__word"><span class="logo__script">Lara Luxo</span>${HEART_DOTS}</span>${FLOURISH()}<span class="logo__modas">MODAS</span>`;

export const HANGER = '<svg class="look__hanger" viewBox="0 0 120 40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M60 15v-3.4a4.8 4.8 0 1 0-4.8-4.8"/><path d="M60 15 9 36.5h102z"/></svg>';

let toastTimer;
export function toast(html, ms = 3200) {
  const t = $('#toast');
  if (!t) return;
  t.innerHTML = html;
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-on'), ms);
}

export function flyToCart(src, done) {
  const target = $('#bagBtn');
  const a = src && src.getBoundingClientRect();
  if (reduceMotion || !a || !a.width || !target || !src.animate) {
    done();
    return;
  }
  const b = target.getBoundingClientRect();
  const f = document.createElement('div');
  f.className = 'fly';
  f.style.cssText = `left:${a.left}px;top:${a.top}px;width:${a.width}px;height:${a.height}px`;
  f.innerHTML = `<img src="${src.currentSrc || src.src}" alt="">`;
  document.body.appendChild(f);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const an = f.animate([
    { transform: 'translate(0,0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * 0.5}px,${dy * 0.5 - 70}px) scale(0.42)`, opacity: 0.95, offset: 0.55 },
    { transform: `translate(${dx}px,${dy}px) scale(0.06)`, opacity: 0.35 }
  ], { duration: 760, easing: 'cubic-bezier(.55,0,.25,1)' });
  an.onfinish = () => {
    f.remove();
    done();
  };
}

// Efeito Confetti Leve em Canvas Puro para Celebração de Pedidos
export function launchCelebrationConfetti() {
  if (reduceMotion) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const colors = ['#4e0717', '#e8bcb0', '#c88f82', '#f3d6cd', '#d4a373', '#ffffff'];
  const count = 75;
  const particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: innerWidth / 2,
      y: innerHeight * 0.35,
      r: Math.random() * 6 + 3,
      d: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngleInc: Math.random() * 0.08 + 0.04,
      tiltAngle: 0,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -12 - 4,
      gravity: 0.38,
      opacity: 1
    });
  }

  let animationId;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of particles) {
      p.tiltAngle += p.tiltAngleInc;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.tilt = Math.sin(p.tiltAngle) * 12;

      if (p.y < canvas.height + 20) {
        alive = true;
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      }
    }
    if (alive) {
      animationId = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(animationId);
      canvas.remove();
    }
  }
  update();
}
