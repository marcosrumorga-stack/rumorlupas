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

// Mirrors FREE_SHIPPING_FROM in netlify/functions/create-checkout-session.js.
// That file is what charges; this one only tells the customer how close they
// are. If one changes, change both.
const FREE_SHIPPING_FROM = 80;

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
            ${color ? `<p class="cart-item__color"><span class="swatch" style="--swatch: ${color.hex}"></span>${color.name}</p>` : ""}
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
  renderShipProgress();
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
      body: JSON.stringify({ cart }),
    });
    if (!res.ok) throw new Error("checkout failed");
    const { url } = await res.json();
    window.location.href = url;
  } catch (err) {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = t("cart.checkout");
    alert(t("cart.error"));
  }
});

function handleCheckoutRedirect() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("checkout");
  if (status === "success") {
    cart = {};
    saveCart(cart);
    alert(t("cart.success"));
  } else if (status === "cancel") {
    alert(t("cart.canceled"));
  }
  if (status) {
    window.history.replaceState({}, "", window.location.pathname);
  }
}

renderCart();
handleCheckoutRedirect();

// Cart rows are built in JS, so they have to be redrawn when the language changes.
document.addEventListener("rl:languagechange", renderCart);
