const CART_KEY = "rumorlupas_cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

let cart = loadCart();

const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");

// A cart key is "<productId>" for a plain product, or "<productId>|<colorId>"
// when the product comes in more than one colour. Keys written before colours
// existed have no suffix, and still resolve to the product's first colour.
function cartKey(productId, colorId) {
  return colorId ? `${productId}|${colorId}` : productId;
}

function cartLine(key, qty) {
  const [productId, colorId] = key.split("|");
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return null;
  return { key, qty, product, color: findColor(product, colorId) };
}

function cartLines() {
  return Object.entries(cart)
    .map(([key, qty]) => cartLine(key, qty))
    .filter(Boolean);
}

function addToCart(productId, colorId) {
  const key = cartKey(productId, colorId);
  cart[key] = (cart[key] || 0) + 1;
  saveCart(cart);
  renderCart();
  openCart();
}

function updateQty(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  delete cart[id];
  saveCart(cart);
  renderCart();
}

// FREE_SHIPPING_FROM and the zone rates come from shipping.js, which the
// checkout function reads too - the price quoted here and the price charged
// there are now the same number rather than two copies kept in step by hand.

const COUNTRY_KEY = "rumorlupas_country";

function savedCountry() {
  try {
    const stored = localStorage.getItem(COUNTRY_KEY);
    if (stored && zoneFor(stored)) return stored;
  } catch {
    /* private browsing: the choice lasts for this page only */
  }
  return "PT";
}

let shipCountry = savedCountry();

// Country names come from the browser in whatever language is being read,
// rather than from 27 names written out three times in i18n.js.
function countryName(code, lang) {
  try {
    return new Intl.DisplayNames([lang], { type: "region" }).of(code);
  } catch {
    return code;
  }
}

function renderCountrySelect() {
  const select = document.getElementById("shipCountry");
  if (!select) return;

  const names = SHIPPING_COUNTRIES
    .map((code) => ({ code, name: countryName(code, currentLang) }))
    .sort((a, b) => a.name.localeCompare(b.name, currentLang));

  select.innerHTML = names
    .map((c) => `<option value="${c.code}"${c.code === shipCountry ? " selected" : ""}>${c.name}</option>`)
    .join("");

  select.onchange = () => {
    shipCountry = select.value;
    try { localStorage.setItem(COUNTRY_KEY, shipCountry); } catch { /* ignore */ }
    renderCart();
  };
}

function cartTotal() {
  return cartLines().reduce((sum, line) => sum + line.product.price * line.qty, 0);
}

// The code the customer typed, kept across pages the way the cart itself is.
// Whether it still applies is never stored - that is worked out again on every
// render, so a code that expires, or a cart that drops under a minimum, stops
// counting on its own.
const COUPON_KEY = "rumorlupas_coupon";

function savedCouponCode() {
  try {
    return localStorage.getItem(COUPON_KEY) || "";
  } catch {
    /* private browsing: the code lasts for this page only */
    return "";
  }
}

let couponCode = savedCouponCode();

function setCouponCode(code) {
  couponCode = code;
  try {
    if (code) localStorage.setItem(COUPON_KEY, code);
    else localStorage.removeItem(COUPON_KEY);
  } catch { /* ignore */ }
}

// null when nothing is typed, otherwise the same verdict the checkout function
// will reach - both sides ask coupons.js, so the drawer cannot promise a
// discount the server then refuses.
function couponState() {
  if (!couponCode) return null;
  return checkCoupon(couponCode, cartTotal());
}

// Cents, matching coupons.js. Zero unless a code is typed, valid, and worth
// money off the products - a free-shipping code is worth nothing here and
// shows up in renderShipCost() instead.
function couponDiscountCents() {
  const state = couponState();
  return state && state.ok ? state.discountCents : 0;
}

function couponFreeShipping() {
  const state = couponState();
  return Boolean(state && state.ok && state.freeShipping);
}

// What the card is actually charged, postage aside. The free-shipping bar and
// the shipping rate stay on cartTotal() on purpose: the 80-euro line is
// measured before the discount, here and in the checkout function alike.
function cartPayable() {
  return cartTotal() - couponDiscountCents() / 100;
}

function cartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function renderCart() {
  const lines = cartLines();
  cartCountEl.textContent = cartCount();

  if (lines.length === 0) {
    cartItemsEl.innerHTML = `<p class="cart-drawer__empty">${t("cart.empty")}</p>`;
  } else {
    cartItemsEl.innerHTML = lines.map(({ key, qty, product, color }) => {
      const images = productImages(product, color && color.id);
      return `
        <div class="cart-item">
          <div class="cart-item__thumb">${
            images.length ? `<img src="${images[0]}" alt="">` : ""
          }</div>
          <div class="cart-item__info">
            <p class="cart-item__name">${product.name}</p>
            ${color ? `<p class="cart-item__color"><span class="swatch" style="--swatch: ${swatchBackground(color)}"></span>${colorName(color)}</p>` : ""}
            <p class="cart-item__price">${formatPrice(product.price)} · <span class="cart-item__qty-inline">${qty}x</span></p>
            <div class="cart-item__qty">
              <button data-action="dec" data-id="${key}">−</button>
              <span>${qty}</span>
              <button data-action="inc" data-id="${key}">+</button>
            </div>
            <button class="cart-item__remove" data-action="remove" data-id="${key}">${t("cart.remove")}</button>
          </div>
        </div>
      `;
    }).join("");

    cartItemsEl.querySelectorAll("[data-action='inc']").forEach((b) => b.addEventListener("click", () => updateQty(b.dataset.id, 1)));
    cartItemsEl.querySelectorAll("[data-action='dec']").forEach((b) => b.addEventListener("click", () => updateQty(b.dataset.id, -1)));
    cartItemsEl.querySelectorAll("[data-action='remove']").forEach((b) => b.addEventListener("click", () => removeFromCart(b.dataset.id)));
  }

  cartTotalEl.textContent = formatPrice(cartPayable());
  renderCountrySelect();
  renderCoupon();
  renderShipProgress();
  renderShipCost();
}

// One button does both jobs, and says which one it is about to do: it removes
// only while the field still holds the code that is applied. Start editing and
// it goes back to offering to apply what is now written, so the label never
// promises something other than what pressing it does.
function syncCouponButton() {
  const input = document.getElementById("couponInput");
  const apply = document.getElementById("couponApply");
  if (!input || !apply) return;

  const state = couponState();
  const unchanged = typedCode(input.value) === couponCode;
  apply.textContent = t(state && state.ok && unchanged ? "coupon.remove" : "coupon.apply");
}

// The field, the message under it, and the discount line above the total. The
// listeners are bound once further down; this only ever rewrites text, so it
// is safe to call on every render.
function renderCoupon() {
  const input = document.getElementById("couponInput");
  const apply = document.getElementById("couponApply");
  const msg = document.getElementById("couponMsg");
  const row = document.getElementById("cartDiscount");
  if (!input || !apply || !msg || !row) return;

  const state = couponState();

  // Not while they are mid-word: rewriting the field under a customer's cursor
  // is how a typed code turns into a typo.
  if (document.activeElement !== input) input.value = couponCode;
  syncCouponButton();

  row.hidden = true;
  msg.textContent = "";
  msg.className = "cart-coupon__msg";

  if (!state) return;

  if (!state.ok) {
    msg.className = "cart-coupon__msg cart-coupon__msg--bad";
    msg.textContent = state.reason === "minimum"
      ? t("coupon.minimum").replace("{x}", formatPrice(state.minimum))
      : t(`coupon.${state.reason}`);
    return;
  }

  msg.className = "cart-coupon__msg cart-coupon__msg--good";
  msg.textContent = t(state.freeShipping ? "coupon.okShip" : "coupon.ok")
    .replace("{code}", state.code);

  // A free-shipping code is worth nothing off the products, so there is no
  // line to show - renderShipCost() says "envio gratis" instead.
  if (state.discountCents > 0) {
    row.hidden = false;
    row.querySelector(".cart-drawer__discount-label").textContent =
      `${t("coupon.discount")} · ${state.code}`;
    row.querySelector(".cart-drawer__discount-value").textContent =
      `−${formatPrice(state.discountCents / 100)}`;
  }
}

// What the chosen country actually costs, and how long it takes. Written into
// the note under the button so the customer sees it before Stripe, not after.
function renderShipCost() {
  const note = document.querySelector(".cart-drawer__note");
  if (!note) return;

  const zone = zoneFor(shipCountry);
  if (!zone) return;

  // Mirrors the function: a free-shipping code zeroes the rate, and the
  // 80-euro threshold is still read from the subtotal before any discount.
  const cents = couponFreeShipping() ? 0 : shippingCentsFor(shipCountry, cartTotal());
  const price = cents === 0 ? t("cart.shipFree") : formatPrice(cents / 100);

  note.textContent = `${t("cart.note")} · ${price} · ${
    t("cart.shipDays").replace("{a}", zone.days[0]).replace("{b}", zone.days[1])}`;
}

function renderShipProgress() {
  const el = document.getElementById("shipProgress");
  if (!el) return;

  const total = cartTotal();
  if (total === 0) {
    el.hidden = true;
    return;
  }
  el.hidden = false;

  const done = total >= FREE_SHIPPING_FROM;
  const missing = Math.max(FREE_SHIPPING_FROM - total, 0);
  const pct = Math.min((total / FREE_SHIPPING_FROM) * 100, 100);

  el.classList.toggle("done", done);
  el.innerHTML = `
    <p class="ship-progress__label">${
      done ? t("ship.unlocked") : t("ship.remaining").replace("{x}", `<strong>${formatPrice(missing)}</strong>`)
    }</p>
    <div class="ship-progress__track"><div class="ship-progress__fill" style="width: ${pct}%"></div></div>
  `;
}

function openCart() {
  cartDrawer.classList.add("open");
}
function closeCart() {
  cartDrawer.classList.remove("open");
}

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

// A form, not a lone button, so Enter in the field applies the code - which is
// what a phone keyboard offers and what most people press.
const couponForm = document.getElementById("couponForm");
if (couponForm) {
  const input = document.getElementById("couponInput");

  couponForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const typed = typedCode(input.value);
    // Pressing it while the field still holds the applied code means remove;
    // anything else means apply what is written. An empty field is a removal
    // too, which is what clearing it and pressing Enter looks like.
    setCouponCode(typed && typed !== couponCode ? typed : "");
    input.blur();
    renderCart();
  });

  // Typing again after a rejection clears the complaint, so the message under
  // the field always belongs to what is written in it.
  input.addEventListener("input", () => {
    const msg = document.getElementById("couponMsg");
    syncCouponButton();
    if (couponCode || !msg) return;
    msg.textContent = "";
    msg.className = "cart-coupon__msg";
  });
}

checkoutBtn.addEventListener("click", async () => {
  const entries = Object.entries(cart);
  if (entries.length === 0) return;

  checkoutBtn.disabled = true;
  checkoutBtn.textContent = t("cart.processing");

  try {
    const res = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, country: shipCountry, coupon: couponCode }),
    });
    if (res.status === 409) {
      const detail = await res.json().catch(() => null);
      if (detail && detail.error === "stock") {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = t("cart.checkout");
        mendCart(detail.key, detail.available);
        return;
      }
      // The code stopped working between opening the drawer and paying -
      // usually a usage cap the last customer just filled. Take it off, say
      // why, and leave the cart intact so pressing again simply buys.
      if (detail && detail.error === "coupon") {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = t("cart.checkout");
        setCouponCode("");
        renderCart();
        openCart();
        showNotice(detail.reason === "minimum"
          ? t("coupon.minimum").replace("{x}", formatPrice(detail.minimum))
          : t(`coupon.${detail.reason}`));
        return;
      }
    }
    if (!res.ok) throw new Error("checkout failed");
    const { url } = await res.json();
    window.location.href = url;
  } catch (err) {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = t("cart.checkout");
    alert(t("cart.error"));
  }
});

// Stock ran out between opening the page and paying. Rather than a dead end,
// put the cart right and say what changed, so checking out again just works.
function mendCart(key, available) {
  const line = cartLine(key, cart[key] || 0);
  const name = line ? line.product.name : "";

  if (available > 0) {
    cart[key] = available;
  } else {
    delete cart[key];
  }
  saveCart(cart);
  renderCart();
  openCart();

  const message = available > 0
    ? t("stock.adjusted").replace("{n}", available).replace("{name}", name)
    : t("stock.soldOut").replace("{name}", name);
  showNotice(message);
}

// A toast rather than alert(): abandoning a payment is not an error worth
// freezing the page over, and the customer can carry on reading behind it.
function showNotice(message) {
  const el = document.createElement("div");
  el.className = "notice";
  el.setAttribute("role", "status");

  const text = document.createElement("span");
  text.textContent = message;

  const close = document.createElement("button");
  close.className = "notice__close";
  close.setAttribute("aria-label", t("aria.close"));
  close.textContent = "×";

  el.append(text, close);
  document.body.appendChild(el);

  const dismiss = () => el.remove();
  close.addEventListener("click", dismiss);
  setTimeout(dismiss, 8000);
}

function handleCheckoutRedirect() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("checkout");

  // A paid order now lands on obrigado.html, which clears the cart itself.
  // This still catches an old link sitting in someone's history.
  if (status === "success") {
    cart = {};
    saveCart(cart);
    renderCart();
  } else if (status === "cancel") {
    showNotice(t("cart.canceled"));
  }
  if (status) {
    window.history.replaceState({}, "", window.location.pathname);
  }
}

renderCart();
handleCheckoutRedirect();
