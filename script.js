document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
navToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const productGrid = document.getElementById("productGrid");

// Per card: which colour it shows, and which of that colour's photos is in view.
const selectedColor = {};
const photoIndex = {};
PRODUCTS.forEach((p) => {
  selectedColor[p.id] = defaultColorId(p);
  photoIndex[p.id] = 0;
});

// The photos sit in a scroll-snapping strip inside the link, so a swipe or an
// arrow leafs through them while a plain click still opens the product.
function mediaHtml(p) {
  const images = productImages(p, selectedColor[p.id]);
  if (!images.length) {
    return `<a href="produto.html?id=${p.id}" class="product-card__image">${t("product.soon")}<span class="sr-only">${p.name}</span></a>`;
  }

  const slides = images
    .map((src, i) => `<img src="${src}" alt="${p.name}"${i ? ' loading="lazy"' : ""}>`)
    .join("");

  const arrows = images.length > 1
    ? `<button type="button" class="card-nav card-nav--prev" data-id="${p.id}" data-step="-1" aria-label="${t("aria.prevPhoto")}">‹</button>
       <button type="button" class="card-nav card-nav--next" data-id="${p.id}" data-step="1" aria-label="${t("aria.nextPhoto")}">›</button>`
    : "";

  return `<a href="produto.html?id=${p.id}" class="product-card__image">
      <div class="card-track" data-track="${p.id}">${slides}</div>
    </a>${arrows}`;
}

function renderProducts() {
  productGrid.innerHTML = PRODUCTS.map((p) => `
    <div class="product-card" data-product="${p.id}">
      <div class="product-card__media">${mediaHtml(p)}</div>
      <div class="product-card__body">
        <a href="produto.html?id=${p.id}" class="product-card__name">${p.name}</a>
        ${colorSwatchesHtml(p, selectedColor[p.id])}
        <p class="product-card__price">${priceHtml(p)}</p>
        <button class="product-card__btn" data-id="${p.id}">${t("product.add")}</button>
      </div>
    </div>
  `).join("");

  productGrid.querySelectorAll(".product-card__btn").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id, selectedColor[btn.dataset.id]));
  });

  productGrid.querySelectorAll(".swatch").forEach((btn) => {
    const productId = btn.closest(".product-card").dataset.product;
    btn.addEventListener("click", () => pickColor(productId, btn.dataset.color));
  });

  productGrid.querySelectorAll(".card-nav").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // The arrows sit over the link; without this the card would open.
      e.preventDefault();
      stepPhoto(btn.dataset.id, Number(btn.dataset.step));
    });
  });

  productGrid.querySelectorAll(".card-track").forEach((track) => {
    // A swipe moves the strip directly, so read the position back.
    track.addEventListener("scroll", () => {
      if (!track.clientWidth) return;
      photoIndex[track.dataset.track] = Math.round(track.scrollLeft / track.clientWidth);
    }, { passive: true });

    // A redraw resets scroll to zero; put each strip back where it was.
    const at = photoIndex[track.dataset.track];
    if (at) track.scrollLeft = track.clientWidth * at;
  });
}

function stepPhoto(productId, step) {
  const product = PRODUCTS.find((p) => p.id === productId);
  const track = productGrid.querySelector(`.card-track[data-track="${productId}"]`);
  if (!product || !track) return;

  const count = productImages(product, selectedColor[productId]).length;
  if (count < 2) return;

  photoIndex[productId] = (photoIndex[productId] + step + count) % count;
  track.scrollTo({ left: track.clientWidth * photoIndex[productId], behavior: "smooth" });
}

function pickColor(productId, colorId) {
  selectedColor[productId] = colorId;
  photoIndex[productId] = 0;
  renderProducts();
}

renderProducts();

// Cards are built in JS, so they have to be redrawn when the language changes.
document.addEventListener("rl:languagechange", renderProducts);
