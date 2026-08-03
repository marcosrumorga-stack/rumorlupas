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
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = `${product.price} €`;
  document.getElementById("productHistory").textContent =
    product.history || "Em breve, mais detalhes sobre a história deste modelo.";

  const galleryImage = document.getElementById("galleryImage");
  const galleryThumbs = document.getElementById("galleryThumbs");
  const galleryPrev = document.getElementById("galleryPrev");
  const galleryNext = document.getElementById("galleryNext");

  const images = product.images && product.images.length ? product.images : null;
  let galleryIndex = 0;

  function renderGallery() {
    if (!images) {
      galleryImage.remove();
      document.querySelector(".product-detail__stage").textContent = "Foto em breve";
      return;
    }
    galleryImage.src = images[galleryIndex];
    galleryImage.alt = product.name;
    galleryThumbs.querySelectorAll(".product-detail__thumb").forEach((el, i) => {
      el.classList.toggle("active", i === galleryIndex);
    });
  }

  if (images) {
    galleryThumbs.innerHTML = images.map((src, i) => `
      <button class="product-detail__thumb${i === 0 ? " active" : ""}" data-index="${i}">
        <img src="${src}" alt="${product.name} — foto ${i + 1}" loading="lazy">
      </button>
    `).join("");

    galleryThumbs.querySelectorAll(".product-detail__thumb").forEach((btn) => {
      btn.addEventListener("click", () => {
        galleryIndex = Number(btn.dataset.index);
        renderGallery();
      });
    });

    if (images.length > 1) {
      galleryPrev.hidden = false;
      galleryNext.hidden = false;
      galleryPrev.addEventListener("click", () => {
        galleryIndex = (galleryIndex - 1 + images.length) % images.length;
        renderGallery();
      });
      galleryNext.addEventListener("click", () => {
        galleryIndex = (galleryIndex + 1) % images.length;
        renderGallery();
      });
    }
  }

  renderGallery();

  document.getElementById("addToCartBtn").addEventListener("click", () => {
    addToCart(product.id);
  });
}
