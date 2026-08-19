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
    return `<a href="${productUrl(p)}" class="product-card__image">${t("product.soon")}<span class="sr-only">${p.name}</span></a>`;
  }

  const slides = images
    .map((src, i) => `<img src="${src}" alt="${p.name}"${i ? ' loading="lazy"' : ""}>`)
    .join("");

  const arrows = images.length > 1
    ? `<button type="button" class="card-nav card-nav--prev" data-id="${p.id}" data-step="-1" aria-label="${t("aria.prevPhoto")}">‹</button>
       <button type="button" class="card-nav card-nav--next" data-id="${p.id}" data-step="1" aria-label="${t("aria.nextPhoto")}">›</button>`
    : "";

  // Sold out and last one share the corner: a colour can only ever be one.
  const out = isSoldOut(p, selectedColor[p.id])
    ? `<span class="sold-out">${t("product.soldOut")}</span>`
    : isLastOne(p, selectedColor[p.id])
      ? `<span class="last-one">${t("product.lastOne")}</span>`
      : "";

  return `<a href="${productUrl(p)}" class="product-card__image">
      <div class="card-track" data-track="${p.id}">${slides}</div>
    </a>${arrows}${out}`;
}

const categoryTabs = document.getElementById("categoryTabs");
const catalogNote = document.getElementById("catalogNote");
let activeCategory = categories()[0];

// What ships in the box differs per category — a hat comes with no cleaning
// cloth. Categories with nothing to say simply show no line.
function renderCatalogNote() {
  const key = `catalog.note.${activeCategory}`;
  const text = t(key);
  const has = text !== key;
  catalogNote.textContent = has ? text : "";
  catalogNote.hidden = !has;
}

function renderCategories() {
  const all = categories();
  categoryTabs.innerHTML = all
    .map((id) => {
      const on = id === activeCategory;
      return `<button type="button" role="tab" class="cats__tab${on ? " active" : ""}" data-cat="${id}" aria-selected="${on}">${categoryLabel(id)}</button>`;
    })
    .join("");

  categoryTabs.querySelectorAll(".cats__tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.cat === activeCategory) return;
      activeCategory = btn.dataset.cat;
      renderCategories();
      renderCatalogNote();
      renderProducts();
    });
  });
}

function renderProducts() {
  productGrid.innerHTML = PRODUCTS.filter((p) => productCategory(p) === activeCategory).map((p) => `
    <div class="product-card" data-product="${p.id}">
      <div class="product-card__media">${mediaHtml(p)}</div>
      <div class="product-card__body">
        <a href="${productUrl(p)}" class="product-card__name">${p.name}</a>
        ${colorSwatchesHtml(p, selectedColor[p.id])}
        <p class="product-card__price">${priceHtml(p)}</p>
        ${isSoldOut(p, selectedColor[p.id])
          ? `<button class="product-card__btn" disabled>${t("product.soldOut")}</button>`
          : `<button class="product-card__btn" data-id="${p.id}">${t("product.add")}</button>`}
      </div>
    </div>
  `).join("");

  productGrid.querySelectorAll(".product-card__btn[data-id]").forEach((btn) => {
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

renderCategories();
renderCatalogNote();
renderProducts();

// Tabs, note and cards are built in JS, so they redraw when the language changes.
document.addEventListener("rl:languagechange", () => {
  renderCategories();
  renderCatalogNote();
  renderProducts();
});

// The customer strip: arrows for the mouse, which has no sideways gesture, and
// click-and-drag on top. Touch and trackpad already work through scroll-snap.
const clientesStrip = document.getElementById("clientesStrip");
if (clientesStrip) {
  // Endless in both directions: the photos are laid out three times over and
  // the scroll position is shifted by one set whenever it reaches an edge.
  // Because the sets are identical, the shift is invisible.
  const originals = Array.from(clientesStrip.children);
  for (let copy = 0; copy < 2; copy++) {
    originals.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clientesStrip.appendChild(clone);
    });
  }

  // Widths come from CSS, not from the photos, so this is right before they load.
  const setWidth = () => clientesStrip.scrollWidth / 3;
  const page = () => Math.min(clientesStrip.clientWidth * 0.8, setWidth() * 0.5);

  // Start on the middle set, so there is a full set of room either way.
  requestAnimationFrame(() => { clientesStrip.scrollLeft = setWidth(); });

  clientesStrip.addEventListener("scroll", () => {
    const w = setWidth();
    if (clientesStrip.scrollLeft >= 2 * w) clientesStrip.scrollLeft -= w;
    else if (clientesStrip.scrollLeft <= 0) clientesStrip.scrollLeft += w;
  }, { passive: true });

  // Re-centre before an arrow scroll, so the animation never crosses an edge
  // and gets cut short by the shift above.
  function recentre() {
    const w = setWidth();
    while (clientesStrip.scrollLeft >= 2 * w) clientesStrip.scrollLeft -= w;
    while (clientesStrip.scrollLeft < w) clientesStrip.scrollLeft += w;
  }

  document.getElementById("clientesPrev").addEventListener("click", () => {
    recentre();
    clientesStrip.scrollBy({ left: -page(), behavior: "smooth" });
  });
  document.getElementById("clientesNext").addEventListener("click", () => {
    recentre();
    clientesStrip.scrollBy({ left: page(), behavior: "smooth" });
  });

  let down = false;
  let startX = 0;
  let startScroll = 0;

  clientesStrip.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true;
    startX = e.clientX;
    startScroll = clientesStrip.scrollLeft;
  });

  clientesStrip.addEventListener("pointermove", (e) => {
    if (!down) return;
    const moved = e.clientX - startX;
    // Only take over once it's clearly a drag, not a stray click.
    if (!clientesStrip.classList.contains("dragging") && Math.abs(moved) < 4) return;
    clientesStrip.classList.add("dragging");
    clientesStrip.setPointerCapture(e.pointerId);
    clientesStrip.scrollLeft = startScroll - moved;
  });

  const endDrag = () => {
    down = false;
    clientesStrip.classList.remove("dragging");
  };
  clientesStrip.addEventListener("pointerup", endDrag);
  clientesStrip.addEventListener("pointercancel", endDrag);
  clientesStrip.addEventListener("pointerleave", endDrag);
}
