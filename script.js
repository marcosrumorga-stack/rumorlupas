document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
navToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const productGrid = document.getElementById("productGrid");

function renderProducts() {
  productGrid.innerHTML = PRODUCTS.map((p) => `
    <div class="product-card">
      <div class="product-card__image"${p.images && p.images.length ? ` data-id="${p.id}" role="button" tabindex="0" aria-label="Ver fotos de ${p.name}"` : ""}>${
        p.images && p.images.length
          ? `<img src="${p.images[0]}" alt="${p.name}" loading="lazy">`
          : "Foto em breve"
      }</div>
      <div class="product-card__body">
        <a href="produto.html?id=${p.id}" class="product-card__name">${p.name}</a>
        ${colorSwatchesHtml(p)}
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
