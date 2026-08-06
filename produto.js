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
  const priceEl = document.getElementById("productPrice");
  const historyEl = document.getElementById("productHistory");
  function renderHistory() {
    priceEl.innerHTML = priceHtml(product);
    historyEl.textContent = productHistory(product);
  }

  // The photos sit side by side in a scroll-snapping strip, so swiping is the
  // browser's own gesture — momentum, rubber-banding and all. The arrows and
  // thumbnails just scroll that strip.
  const galleryTrack = document.getElementById("galleryTrack");
  const galleryThumbs = document.getElementById("galleryThumbs");
  const galleryPrev = document.getElementById("galleryPrev");
  const galleryNext = document.getElementById("galleryNext");

  let images = productImages(product, currentColor);
  let galleryIndex = 0;

  function renderGallery() {
    if (!images.length) {
      document.querySelector(".product-detail__stage").textContent = t("product.soon");
      return;
    }

    galleryTrack.innerHTML = images.map((src, i) => `
      <img src="${src}" alt="${product.name} — ${t("product.photo")} ${i + 1}"${i ? ' loading="lazy"' : ""}>
    `).join("");

    galleryThumbs.innerHTML = images.map((src, i) => `
      <button class="product-detail__thumb" data-index="${i}">
        <img src="${src}" alt="" loading="lazy">
      </button>
    `).join("");

    galleryThumbs.querySelectorAll(".product-detail__thumb").forEach((btn) => {
      btn.addEventListener("click", () => goTo(Number(btn.dataset.index)));
    });

    const many = images.length > 1;
    galleryPrev.hidden = !many;
    galleryNext.hidden = !many;

    goTo(galleryIndex, false);
  }

  function goTo(index, smooth = true) {
    galleryIndex = (index + images.length) % images.length;
    galleryTrack.scrollTo({
      left: galleryTrack.clientWidth * galleryIndex,
      behavior: smooth ? "smooth" : "auto",
    });
    syncThumbs();
  }

  function syncThumbs() {
    galleryThumbs.querySelectorAll(".product-detail__thumb").forEach((el, i) => {
      el.classList.toggle("active", i === galleryIndex);
    });
  }

  // A swipe moves the strip without going through goTo, so read the position
  // back to keep the thumbnails in step.
  galleryTrack.addEventListener("scroll", () => {
    if (!galleryTrack.clientWidth) return;
    const i = Math.round(galleryTrack.scrollLeft / galleryTrack.clientWidth);
    if (i !== galleryIndex && images[i]) {
      galleryIndex = i;
      syncThumbs();
    }
  }, { passive: true });

  galleryPrev.addEventListener("click", () => goTo(galleryIndex - 1));
  galleryNext.addEventListener("click", () => goTo(galleryIndex + 1));

  document.addEventListener("keydown", (e) => {
    if (images.length < 2) return;
    if (e.key === "ArrowLeft") goTo(galleryIndex - 1);
    if (e.key === "ArrowRight") goTo(galleryIndex + 1);
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
