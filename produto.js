document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
navToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// Two ways in. /lupas/oakley-juliet is the address the shop publishes; the old
// produto.html?id=juliet-45 is still answered because it is loose in the world —
// in the sitemap Google already fetched, and in links people have sent each
// other. Netlify redirects the old form, but the page resolves both regardless.
const product = (function () {
  const slug = barePath(window.location.pathname).replace(/^\/lupas\//, "").replace(/\/$/, "");
  const bySlug = slug && findProductBySlug(slug);
  if (bySlug) return bySlug;
  const id = new URLSearchParams(window.location.search).get("id");
  return PRODUCTS.find((p) => p.id === id);
})();

const productDetail = document.getElementById("productDetail");
const productNotFound = document.getElementById("productNotFound");

if (!product) {
  productNotFound.hidden = false;
} else {
  productDetail.hidden = false;

  // ?cor= lets a link point at one variant. The Meta catalogue sells each
  // colour as its own item, so an ad for the blue Juliet has to open on the
  // blue Juliet - landing on the default colour reads as the wrong product.
  // An unknown or sold-through colour falls back rather than showing nothing.
  let currentColor = (function () {
    const wanted = new URLSearchParams(window.location.search).get("cor");
    // Checked against the list rather than through findColor, which never
    // reports a miss - it falls back to the first colour so that old carts
    // saved without one still resolve. Trusting it here left a mistyped
    // ?cor= selecting nothing at all.
    const known = wanted && hasColors(product) && product.colors.some((c) => c.id === wanted);
    return known ? wanted : defaultColorId(product);
  })();

  // Nobody searches "Juliet". They search "oakley juliet portugal" — so the tab
  // and the search result lead with Oakley, and carry the two things that decide
  // a click: how much choice there is, and the price.
  function pageTitle() {
    const colours = hasColors(product) ? product.colors : [];
    const left = colours.length
      ? colours.filter((c) => !isSoldOut(product, c.id))
      : (isSoldOut(product, null) ? [] : [null]);

    if (colours.length && !left.length) {
      return `Oakley ${product.name} — ${t("product.soldOut").toLowerCase()} | RumorLupas`;
    }
    const price = formatPrice(product.price);
    if (left.length > 1) {
      return `Oakley ${product.name} — ${left.length} ${t("seo.colours")}, ${price} | RumorLupas`;
    }
    return `Oakley ${product.name} — ${price} | RumorLupas`;
  }

  // Google runs the page's script before indexing it, so the model's own name,
  // price and stock can be filled in here. Social previews still cannot — those
  // crawlers do not run scripts, which is why the og: tags stay generic.
  // Off the origin, not off location.href: at /lupas/<modelo> a relative path
  // would resolve inside /lupas/ and point at images that are not there.
  function absolute(path) {
    return new URL(path, `${location.origin}/`).href;
  }

  function renderSeo() {
    // In the language being read, so the three versions of a model do not
    // compete with each other in search.
    const canonical = `${location.origin}${productUrl(product)}`;
    document.title = pageTitle();
    document.querySelector('link[rel="canonical"]').href = canonical;
    document.querySelector('meta[name="description"]').content =
      `${product.name} — ${formatPrice(product.price)}. ${productHistory(product)}`.slice(0, 300);

    const anyLeft = hasColors(product)
      ? product.colors.some((c) => !isSoldOut(product, c.id))
      : !isSoldOut(product, null);

    const data = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `Oakley ${product.name}`,
      sku: product.id,
      image: productImages(product, currentColor).map(absolute),
      description: productHistory(product),
      brand: { "@type": "Brand", name: "Oakley" },
      offers: {
        "@type": "Offer",
        url: canonical,
        priceCurrency: "EUR",
        price: product.price.toFixed(2),
        itemCondition: "https://schema.org/NewCondition",
        availability: anyLeft
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: "RumorLupas" },
        // One entry per shipping zone, built from shipping.js so the rates
        // Google shows are the rates the checkout charges.
        shippingDetails: SHIPPING_ZONES.map((zone) => ({
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: (zone.cents / 100).toFixed(2),
            currency: "EUR",
          },
          shippingDestination: zone.countries.map((code) => ({
            "@type": "DefinedRegion",
            addressCountry: code,
          })),
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: zone.days[0], maxValue: zone.days[1], unitCode: "DAY",
            },
          },
        })),
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          // The 14-day right of withdrawal is EU law, so it holds in every
          // country the shop now ships to, not just Portugal.
          applicableCountry: SHIPPING_COUNTRIES,
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 14,
          returnMethod: "https://schema.org/ReturnByMail",
        },
      },
    };

    // Only when real reviews exist. Search Console asks for these two fields on
    // every product, but they are a claim about what customers said - a model
    // nobody has reviewed yet correctly has neither, and inventing them is the
    // kind of markup Google penalises.
    const reviews = productReviews(product);
    if (reviews.length) {
      data.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: averageRating(product),
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1,
      };
      data.review = reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.name },
        datePublished: r.date,
        reviewBody: r.text,
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
      }));
    }

    let tag = document.getElementById("productSchema");
    if (!tag) {
      tag = document.createElement("script");
      tag.type = "application/ld+json";
      tag.id = "productSchema";
      document.head.appendChild(tag);
    }
    tag.textContent = JSON.stringify(data);
  }

  document.getElementById("productName").textContent = product.name;
  const priceEl = document.getElementById("productPrice");
  const historyEl = document.getElementById("productHistory");
  function renderHistory() {
    priceEl.innerHTML = priceHtml(product);
    historyEl.textContent = productHistory(product);
  }

  // Reviews are quoted text someone else wrote. Escaped rather than trusted:
  // a customer typing "<3" or an ampersand should not be able to break the
  // page, never mind anything worse.
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Stars drawn as filled and empty glyphs rather than images, so they carry
  // into the page's own colour and need no extra request.
  function starsHtml(rating) {
    const full = "★".repeat(rating);
    const empty = "☆".repeat(5 - rating);
    return `<span class="stars" aria-hidden="true">${full}${empty}</span>`;
  }

  function renderReviews() {
    const el = document.getElementById("productReviews");
    if (!el) return;

    const reviews = productReviews(product);
    if (!reviews.length) {
      el.hidden = true;
      el.innerHTML = "";
      return;
    }

    const average = averageRating(product);
    const newest = reviews.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));

    el.hidden = false;
    el.innerHTML = `
      <h2>${t("pp.reviews")}</h2>
      <p class="reviews__summary">
        ${starsHtml(Math.round(average))}
        <strong>${average.toLocaleString(HTML_LANG[currentLang] || "pt-PT",
          { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</strong>
        <span>${t(reviews.length === 1 ? "pp.reviewCountOne" : "pp.reviewCount")
          .replace("{n}", reviews.length)}</span>
      </p>
      ${newest.map((r) => `
        <article class="review">
          <p class="review__head">
            ${starsHtml(r.rating)}
            <strong>${esc(r.name)}</strong>
            <time datetime="${esc(r.date)}">${formatReviewDate(r.date)}</time>
          </p>
          <p class="review__text">${esc(r.text)}</p>
        </article>
      `).join("")}
    `;
  }

  // Month and year is enough: a review from "agosto de 2026" reads as recent
  // without pinning the customer to a day they bought something.
  function formatReviewDate(iso) {
    const date = new Date(`${iso}T00:00:00`);
    if (isNaN(date)) return iso;
    return date.toLocaleDateString(HTML_LANG[currentLang] || "pt-PT",
      { month: "long", year: "numeric" });
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
  const addBtn = document.getElementById("addToCartBtn");
  const stockNote = document.getElementById("stockNote");

  function renderStock() {
    const out = isSoldOut(product, currentColor);
    addBtn.disabled = out;
    addBtn.textContent = out ? t("product.soldOut") : t("product.add");

    // Sits above the button, where it is read on the way to clicking it.
    const last = !out && isLastOne(product, currentColor);
    stockNote.hidden = !last;
    stockNote.textContent = last ? t("product.lastOneNote") : "";
  }

  function renderColors() {
    const color = findColor(product, currentColor);
    productColors.innerHTML = colorSwatchesHtml(product, currentColor) +
      (color ? `<p class="color-name">${colorName(color)}</p>` : "");
    productColors.querySelectorAll(".swatch").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentColor = btn.dataset.color;
        images = productImages(product, currentColor);
        galleryIndex = 0;
        renderColors();
        renderGallery();
        renderStock();
      });
    });
  }

  renderColors();
  renderGallery();
  renderHistory();
  renderReviews();
  renderStock();
  renderSeo();

  addBtn.addEventListener("click", () => {
    if (isSoldOut(product, currentColor)) return;
    addToCart(product.id, currentColor);
  });
}
