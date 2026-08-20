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

  cartTotalEl.textContent = formatPrice(cartTotal());
  renderCountrySelect();
  renderShipProgress();
  renderShipCost();
}

// What the chosen country actually costs, and how long it takes. Written into
// the note under the button so the customer sees it before Stripe, not after.
function renderShipCost() {
  const note = document.querySelector(".cart-drawer__note");
  if (!note) return;

  const zone = zoneFor(shipCountry);
  if (!zone) return;

  const cents = shippingCentsFor(shipCountry, cartTotal());
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

checkoutBtn.addEventListener("click", async () => {
  const entries = Object.entries(cart);
  if (entries.length === 0) return;

  checkoutBtn.disabled = true;
  checkoutBtn.textContent = t("cart.processing");

  try {
    const res = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, country: shipCountry }),
    });
    if (res.status === 409) {
      const detail = await res.json().catch(() => null);
      if (detail && detail.error === "stock") {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = t("cart.checkout");
        mendCart(detail.key, detail.available);
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
