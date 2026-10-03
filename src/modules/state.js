// Central Reactive State with LocalStorage Persistence

const STORAGE_KEYS = {
  CART: 'll_cart_v2',
  FAV: 'll_fav_v2',
  COUPON: 'll_coupon_v2',
  RESERVE: 'll_reserve_v2',
  FORM: 'll_form_v2',
  ORDER: 'll_order_v2'
};

const getStored = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (_) {
    return fallback;
  }
};

const setStored = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (_) {}
};

export const state = {
  cart: getStored(STORAGE_KEYS.CART, []),
  fav: new Set(getStored(STORAGE_KEYS.FAV, [])),
  coupon: getStored(STORAGE_KEYS.COUPON, null),
  reserveEnd: getStored(STORAGE_KEYS.RESERVE, 0),
  order: getStored(STORAGE_KEYS.ORDER, null),
  form: getStored(STORAGE_KEYS.FORM, {
    nome: '',
    whats: '',
    email: '',
    cep: '',
    city: '',
    ship: 'retirada',
    pay: 'pix'
  }),
  welcomed: false,
  page: 'home',
  sort: 'novidades',
  curHash: '',
  prevHash: '',
  scrollTarget: null,
  openCartAfter: false
};

export const persistCart = () => setStored(STORAGE_KEYS.CART, state.cart);
export const persistFav = () => setStored(STORAGE_KEYS.FAV, Array.from(state.fav));
export const persistCoupon = () => setStored(STORAGE_KEYS.COUPON, state.coupon);
export const persistReserve = () => setStored(STORAGE_KEYS.RESERVE, state.reserveEnd);
export const persistForm = () => setStored(STORAGE_KEYS.FORM, state.form);
export const persistOrder = () => setStored(STORAGE_KEYS.ORDER, state.order);

export const COUPONS = {
  BEMVINDA: 0.10,
  PRIMEIRACOMPRA: 0.10,
  LARA10: 0.10,
  LARA15: 0.15
};

export const FREE_SHIP_THRESHOLD = 299;
export const PIX_DISCOUNT = 0.05;
export const RESERVE_MINUTES = 15;
