document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
navToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

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

const productGrid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");

function renderProducts() {
  productGrid.innerHTML = PRODUCTS.map((p) => `
    <div class="product-card">
      <div class="product-card__image"${p.images && p.images.length ? ` data-id="${p.id}" role="button" tabindex="0" aria-label="Ver fotos de ${p.name}"` : ""}>${
        p.images && p.images.length
          ? `<img src="${p.images[0]}" alt="${p.name}" loading="lazy">`
          : "Foto em breve"
      }</div>
      <div class="product-card__body">
        <p class="product-card__name">${p.name}</p>
        <p class="product-card__price">${p.price} €</p>
        <button class="product-card__btn" data-id="${p.id}">Adicionar ao carrinho</button>
      </div>
    </div>
  `).join("");

  productGrid.querySelectorAll(".product-card__btn").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });

  productGrid.querySelectorAll(".product-card__image[data-id]").forEach((el) => {
    el.addEventListener("click", () => openLightbox(el.dataset.id));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(el.dataset.id);
      }
    });
  });
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
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

function cartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === id);
    return sum + (product ? product.price * qty : 0);
  }, 0);
}

function cartCount() {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function renderCart() {
  const entries = Object.entries(cart);
  cartCountEl.textContent = cartCount();

  if (entries.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-drawer__empty">Seu carrinho está vazio.</p>';
  } else {
    cartItemsEl.innerHTML = entries.map(([id, qty]) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return "";
      return `
        <div class="cart-item">
          <div class="cart-item__thumb"></div>
          <div class="cart-item__info">
            <p class="cart-item__name">${product.name}</p>
            <p class="cart-item__price">${product.price} € · <span class="cart-item__qty-inline">${qty}x</span></p>
            <div class="cart-item__qty">
              <button data-action="dec" data-id="${id}">−</button>
              <span>${qty}</span>
              <button data-action="inc" data-id="${id}">+</button>
            </div>
            <button class="cart-item__remove" data-action="remove" data-id="${id}">Remover</button>
          </div>
        </div>
      `;
    }).join("");

    cartItemsEl.querySelectorAll("[data-action='inc']").forEach((b) => b.addEventListener("click", () => updateQty(b.dataset.id, 1)));
    cartItemsEl.querySelectorAll("[data-action='dec']").forEach((b) => b.addEventListener("click", () => updateQty(b.dataset.id, -1)));
    cartItemsEl.querySelectorAll("[data-action='remove']").forEach((b) => b.addEventListener("click", () => removeFromCart(b.dataset.id)));
  }

  cartTotalEl.textContent = `${cartTotal()} €`;
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
  checkoutBtn.textContent = "A processar...";

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
    checkoutBtn.textContent = "Finalizar compra";
    alert("Não foi possível iniciar o pagamento. Tenta novamente em instantes.");
  }
});

function handleCheckoutRedirect() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("checkout");
  if (status === "success") {
    cart = {};
    saveCart(cart);
    alert("Pagamento confirmado! Obrigado pela compra.");
  } else if (status === "cancel") {
    alert("Pagamento cancelado. Seu carrinho continua salvo.");
  }
  if (status) {
    window.history.replaceState({}, "", window.location.pathname);
  }
}

const lightbox = document.getElementById("lightbox");
const lightboxBackdrop = document.getElementById("lightboxBackdrop");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxName = document.getElementById("lightboxName");
const lightboxCounter = document.getElementById("lightboxCounter");

let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product || !product.images || !product.images.length) return;
  lightboxImages = product.images;
  lightboxIndex = 0;
  lightboxName.textContent = product.name;
  renderLightboxImage();
  lightbox.classList.add("open");
}

function renderLightboxImage() {
  lightboxImage.src = lightboxImages[lightboxIndex];
  lightboxImage.alt = lightboxName.textContent;
  lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

function lightboxGo(delta) {
  lightboxIndex = (lightboxIndex + delta + lightboxImages.length) % lightboxImages.length;
  renderLightboxImage();
}

function closeLightbox() {
  lightbox.classList.remove("open");
}

lightboxBackdrop.addEventListener("click", closeLightbox);
lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => lightboxGo(-1));
lightboxNext.addEventListener("click", () => lightboxGo(1));

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") lightboxGo(-1);
  if (e.key === "ArrowRight") lightboxGo(1);
});

renderProducts();
renderCart();
handleCheckoutRedirect();
