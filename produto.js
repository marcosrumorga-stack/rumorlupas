document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
navToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const product = PRODUCTS.find((p) => p.id === productId);

const productDetail = document.getElementById("productDetail");
const productNotFound = document.getElementById("productNotFound");

if (!product) {
  productNotFound.hidden = false;
} else {
  productDetail.hidden = false;

  document.getElementById("pageTitle").textContent = `${product.name} — RumorLupas`;
  let currentColor = defaultColorId(product);

  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = `${product.price} €`;
  const historyEl = document.getElementById("productHistory");
  function renderHistory() {
    historyEl.textContent = productHistory(product);
  }

  const galleryImage = document.getElementById("galleryImage");
  const galleryThumbs = document.getElementById("galleryThumbs");
  const galleryPrev = document.getElementById("galleryPrev");
  const galleryNext = document.getElementById("galleryNext");

  let images = productImages(product, currentColor);
  let galleryIndex = 0;

  function renderGallery() {
    if (!images.length) {
      galleryImage.remove();
      document.querySelector(".product-detail__stage").textContent = t("product.soon");
      return;
    }

    galleryImage.src = images[galleryIndex];
    galleryImage.alt = product.name;

    galleryThumbs.innerHTML = images.map((src, i) => `
      <button class="product-detail__thumb${i === galleryIndex ? " active" : ""}" data-index="${i}">
        <img src="${src}" alt="${product.name} — ${t("product.photo")} ${i + 1}" loading="lazy">
      </button>
    `).join("");

    galleryThumbs.querySelectorAll(".product-detail__thumb").forEach((btn) => {
      btn.addEventListener("click", () => {
        galleryIndex = Number(btn.dataset.index);
        renderGallery();
      });
    });

    const many = images.length > 1;
    galleryPrev.hidden = !many;
    galleryNext.hidden = !many;
  }

  galleryPrev.addEventListener("click", () => {
    galleryIndex = (galleryIndex - 1 + images.length) % images.length;
    renderGallery();
  });
  galleryNext.addEventListener("click", () => {
    galleryIndex = (galleryIndex + 1) % images.length;
    renderGallery();
  });

  const productColors = document.getElementById("productColors");

  function renderColors() {
    productColors.innerHTML = colorSwatchesHtml(product, currentColor);
    productColors.querySelectorAll(".swatch").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentColor = btn.dataset.color;
        images = productImages(product, currentColor);
        galleryIndex = 0;
        renderColors();
        renderGallery();
      });
    });
  }

  renderColors();
  renderGallery();
  renderHistory();

  document.getElementById("addToCartBtn").addEventListener("click", () => {
    addToCart(product.id, currentColor);
  });

  // The story and the photo captions are written by JS, so redraw on a switch.
  document.addEventListener("rl:languagechange", () => {
    renderHistory();
    renderGallery();
  });
}
