document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
navToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const productGrid = document.getElementById("productGrid");

// Which colour each card is currently showing, keyed by product id.
const selectedColor = {};
PRODUCTS.forEach((p) => {
  selectedColor[p.id] = defaultColorId(p);
});

function renderProducts() {
  productGrid.innerHTML = PRODUCTS.map((p) => {
    const images = productImages(p, selectedColor[p.id]);
    return `
    <div class="product-card" data-product="${p.id}">
      <div class="product-card__image"${images.length ? ` data-id="${p.id}" role="button" tabindex="0" aria-label="${t("product.photosOf")} ${p.name}"` : ""}>${
        images.length
          ? `<img src="${images[0]}" alt="${p.name}" loading="lazy">`
          : t("product.soon")
      }</div>
      <div class="product-card__body">
        <a href="produto.html?id=${p.id}" class="product-card__name">${p.name}</a>
        ${colorSwatchesHtml(p, selectedColor[p.id])}
        <p class="product-card__price">${priceHtml(p)}</p>
        <button class="product-card__btn" data-id="${p.id}">${t("product.add")}</button>
      </div>
    </div>
  `;
  }).join("");

  productGrid.querySelectorAll(".product-card__btn").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id, selectedColor[btn.dataset.id]));
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

  productGrid.querySelectorAll(".swatch").forEach((btn) => {
    const productId = btn.closest(".product-card").dataset.product;
    btn.addEventListener("click", () => pickColor(productId, btn.dataset.color));
  });
}

function pickColor(productId, colorId) {
  selectedColor[productId] = colorId;

  const product = PRODUCTS.find((p) => p.id === productId);
  const card = productGrid.querySelector(`.product-card[data-product="${productId}"]`);
  if (!product || !card) return;

  const images = productImages(product, colorId);
  const img = card.querySelector(".product-card__image img");
  if (img && images.length) img.src = images[0];

  card.querySelectorAll(".swatch").forEach((s) => {
    const on = s.dataset.color === colorId;
    s.classList.toggle("active", on);
    s.setAttribute("aria-pressed", on);
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
  if (!product) return;
  const images = productImages(product, selectedColor[productId]);
  if (!images.length) return;
  lightboxImages = images;
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

// Cards are built in JS, so they have to be redrawn when the language changes.
document.addEventListener("rl:languagechange", renderProducts);
