// Product data only. Every translatable string — including each model's story,
// keyed "history.<id>" — lives in i18n.js.

const PRODUCTS = [
  {
    id: "eye-jacket-45",
    name: "Eye Jacket Redux",
    price: 49,
    oldPrice: 70,
    colors: [
      {
        id: "preto",
        name: "Preto",
        hex: "#15130f",
        stock: 5,
        images: [
          "images/products/eye-jacket-45/preto/2.jpeg",
          "images/products/eye-jacket-45/preto/1.jpeg",
          "images/products/eye-jacket-45/preto/3.jpeg",
          "images/products/eye-jacket-45/preto/4.jpeg",
          "images/products/eye-jacket-45/preto/5.jpeg",
          "images/products/eye-jacket-45/preto/6.jpeg",
          "images/products/eye-jacket-45/preto/model.jpeg",
        ],
      },
    ],
  },
  {
    id: "plantaris-50",
    name: "Plantaris",
    price: 49,
    oldPrice: 70,
    colors: [
      {
        id: "preto",
        name: "Preto",
        hex: "#15130f",
        stock: 3,
        images: [
          "images/products/plantaris-50/preto/1.jpeg",
          "images/products/plantaris-50/preto/2.jpeg",
          "images/products/plantaris-50/preto/3.jpeg",
          "images/products/plantaris-50/preto/4.jpeg",
          "images/products/plantaris-50/preto/model.jpeg",
        ],
      },
    ],
  },
  { id: "juliet-45", name: "Juliet", price: 49, oldPrice: 70 },
  {
    id: "xx-45",
    name: "XX",
    price: 49,
    oldPrice: 70,
    colors: [
      {
        id: "24k-lente-esmeralda",
        name: "24K · lente esmeralda",
        hex: "#c39c50",
        swatch: "linear-gradient(135deg, #c39c50 50%, #58ac83 50%)",
        stock: 2,
        images: [
          "images/products/xx-45/24k-lente-esmeralda/1.jpeg",
          "images/products/xx-45/24k-lente-esmeralda/2.jpeg",
          "images/products/xx-45/24k-lente-esmeralda/3.jpeg",
          "images/products/xx-45/24k-lente-esmeralda/4.jpeg",
        ],
      },
    ],
  },
  {
    id: "plate-55",
    name: "Plate",
    price: 59,
    oldPrice: 84.29,
    // Split dots here too: armação on one side, lente on the other. Five of
    // these share the same armação, so the lente half is what separates them.
    // Neutral lenses first, colours after, the two other armações last.
    colors: [
      {
        id: "cinza-fosca-preta",
        name: "Cinza fosca · lente preta",
        hex: "#82807d",
        swatch: "linear-gradient(135deg, #82807d 50%, #1a1a1c 50%)",
        stock: 1,
        images: [
          "images/products/plate-55/cinza-fosca-preta/1.jpeg",
          "images/products/plate-55/cinza-fosca-preta/2.jpeg",
          "images/products/plate-55/cinza-fosca-preta/3.jpeg",
        ],
      },
      {
        id: "cinza-fosca-espelhada",
        name: "Cinza fosca · lente espelhada",
        hex: "#82807d",
        swatch: "linear-gradient(135deg, #82807d 50%, #9aa0a6 50%)",
        stock: 1,
        images: [
          "images/products/plate-55/cinza-fosca-espelhada/1.jpeg",
          "images/products/plate-55/cinza-fosca-espelhada/2.jpeg",
          "images/products/plate-55/cinza-fosca-espelhada/3.jpeg",
        ],
      },
      {
        id: "cinza-fosca-azul",
        name: "Cinza fosca · lente azul",
        hex: "#82807d",
        swatch: "linear-gradient(135deg, #82807d 50%, #1e8fd0 50%)",
        stock: 2,
        images: [
          "images/products/plate-55/cinza-fosca-azul/1.jpeg",
          "images/products/plate-55/cinza-fosca-azul/2.jpeg",
          "images/products/plate-55/cinza-fosca-azul/3.jpeg",
        ],
      },
      {
        id: "cinza-fosca-amarela",
        name: "Cinza fosca · lente amarela",
        hex: "#82807d",
        swatch: "linear-gradient(135deg, #82807d 50%, #f0c40a 50%)",
        stock: 1,
        images: [
          "images/products/plate-55/cinza-fosca-amarela/1.jpeg",
          "images/products/plate-55/cinza-fosca-amarela/2.jpeg",
          "images/products/plate-55/cinza-fosca-amarela/3.jpeg",
        ],
      },
      {
        id: "cinza-fosca-tanzanite",
        name: "Cinza fosca · lente tanzanite",
        hex: "#82807d",
        swatch: "linear-gradient(135deg, #82807d 50%, #c62368 50%)",
        stock: 1,
        images: [
          "images/products/plate-55/cinza-fosca-tanzanite/1.jpeg",
          "images/products/plate-55/cinza-fosca-tanzanite/2.jpeg",
          "images/products/plate-55/cinza-fosca-tanzanite/3.jpeg",
        ],
      },
      {
        id: "cinza-escura-espelhada",
        name: "Cinza escura · lente espelhada",
        hex: "#4a4744",
        swatch: "linear-gradient(135deg, #4a4744 50%, #8d9298 50%)",
        stock: 1,
        images: [
          "images/products/plate-55/cinza-escura-espelhada/1.jpeg",
          "images/products/plate-55/cinza-escura-espelhada/2.jpeg",
          "images/products/plate-55/cinza-escura-espelhada/3.jpeg",
        ],
      },
      {
        id: "preta-roxa",
        name: "Preta · lente roxa",
        hex: "#15130f",
        swatch: "linear-gradient(135deg, #15130f 50%, #6d3f9e 50%)",
        stock: 3,
        images: [
          "images/products/plate-55/preta-roxa/1.jpeg",
          "images/products/plate-55/preta-roxa/2.jpeg",
          "images/products/plate-55/preta-roxa/3.jpeg",
        ],
      },
    ],
  },
  {
    id: "gascan-50",
    name: "Gascan",
    price: 49,
    oldPrice: 70,
    // Here both the armação and the lente vary, and two armações repeat, so a
    // solid dot would leave two pairs looking identical on the catalogue card,
    // where no name is shown. These carry a split dot instead: armação on one
    // side, lente on the other.
    colors: [
      {
        id: "preta-lente-preta",
        name: "Preta · lente preta",
        hex: "#15130f",
        stock: 2,
        images: [
          "images/products/gascan-50/preta-lente-preta/1.jpeg",
          "images/products/gascan-50/preta-lente-preta/2.jpeg",
          "images/products/gascan-50/preta-lente-preta/3.jpeg",
          "images/products/gascan-50/preta-lente-preta/4.jpeg",
        ],
      },
      {
        id: "preta-lente-laranja",
        name: "Preta · lente laranja",
        hex: "#15130f",
        swatch: "linear-gradient(135deg, #15130f 50%, #f4741f 50%)",
        stock: 1,
        images: [
          "images/products/gascan-50/preta-lente-laranja/1.jpeg",
          "images/products/gascan-50/preta-lente-laranja/2.jpeg",
          "images/products/gascan-50/preta-lente-laranja/3.jpeg",
          "images/products/gascan-50/preta-lente-laranja/4.jpeg",
        ],
      },
      {
        id: "preta-transparente-lente-preta",
        name: "Preta transparente · lente preta",
        hex: "#6f6d70",
        swatch: "linear-gradient(135deg, #6f6d70 50%, #15130f 50%)",
        stock: 2,
        images: [
          "images/products/gascan-50/preta-transparente-lente-preta/1.jpeg",
          "images/products/gascan-50/preta-transparente-lente-preta/2.jpeg",
          "images/products/gascan-50/preta-transparente-lente-preta/3.jpeg",
          "images/products/gascan-50/preta-transparente-lente-preta/4.jpeg",
        ],
      },
      {
        id: "preta-transparente-lente-espelhada",
        name: "Preta transparente · lente espelhada",
        hex: "#6f6d70",
        swatch: "linear-gradient(135deg, #6f6d70 50%, #b9bec3 50%)",
        stock: 2,
        images: [
          "images/products/gascan-50/preta-transparente-lente-espelhada/1.jpeg",
          "images/products/gascan-50/preta-transparente-lente-espelhada/2.jpeg",
          "images/products/gascan-50/preta-transparente-lente-espelhada/3.jpeg",
          "images/products/gascan-50/preta-transparente-lente-espelhada/4.jpeg",
        ],
      },
      {
        id: "branca-transparente-lente-laranja",
        name: "Branca transparente · lente laranja",
        hex: "#e9e7e4",
        swatch: "linear-gradient(135deg, #e9e7e4 50%, #f4741f 50%)",
        stock: 1,
        images: [
          "images/products/gascan-50/branca-transparente-lente-laranja/1.jpeg",
          "images/products/gascan-50/branca-transparente-lente-laranja/2.jpeg",
          "images/products/gascan-50/branca-transparente-lente-laranja/3.jpeg",
          "images/products/gascan-50/branca-transparente-lente-laranja/4.jpeg",
        ],
      },
    ],
  },
  { id: "splice-53", name: "Splice", price: 53, oldPrice: 75.71 },
  { id: "monster-dog-47", name: "Monster Dog", price: 49, oldPrice: 70 },
  { id: "dartboard-50", name: "Dartboard", price: 49, oldPrice: 70 },
  { id: "flak-2xl-45", name: "Flak 2.0 XL", price: 49, oldPrice: 70 },
  {
    id: "pitboss-53",
    // The id stays as it is — it is in the product page URL and in carts
    // already saved in people's browsers. Only the shown name changes.
    name: "Pit Boss II",
    price: 53,
    oldPrice: 75.71,
    colors: [
      {
        id: "preta-lente-preta",
        name: "Preta · lente preta",
        hex: "#15130f",
        stock: 2,
        images: [
          "images/products/pitboss-53/preta-lente-preta/1.jpeg",
          "images/products/pitboss-53/preta-lente-preta/2.jpeg",
          "images/products/pitboss-53/preta-lente-preta/3.jpeg",
          "images/products/pitboss-53/preta-lente-preta/4.jpeg",
          "images/products/pitboss-53/preta-lente-preta/model.jpeg",
        ],
      },
    ],
  },
];

// Categories are read off the products themselves, so there is no second list
// to keep in step. To open a new one, give a product a category and add a
// "category.<id>" string to i18n.js — the tab appears on its own:
//
//   { id: "chapeu-25", name: "Chapéu", price: 25, category: "chapeus" }
//
const DEFAULT_CATEGORY = "lupas";

function productCategory(product) {
  return product.category || DEFAULT_CATEGORY;
}

// In the order the products declare them, so the tabs follow the catalogue.
function categories() {
  const found = [];
  PRODUCTS.forEach((p) => {
    const c = productCategory(p);
    if (!found.includes(c)) found.push(c);
  });
  return found;
}

function categoryLabel(id) {
  const key = `category.${id}`;
  const text = t(key);
  return text === key ? id : text;
}

// A product either has colour variants — each with its own photos — or a plain
// images list. These helpers hide that difference from the rest of the code.

function hasColors(product) {
  return Boolean(product.colors && product.colors.length);
}

function defaultColorId(product) {
  return hasColors(product) ? product.colors[0].id : null;
}

function findColor(product, colorId) {
  if (!hasColors(product)) return null;
  return product.colors.find((c) => c.id === colorId) || product.colors[0];
}

// Every model leaves in the same box — micro bag, pano and case — so the kit
// shot is not stored per model or per colour. It is appended here, which means
// a new model inherits it with no extra work, the same way the "Vem com" block
// is written once. It goes last so the head-on shot stays the cover, and it is
// skipped for a model that has no photos yet: a lone packaging photo under
// "Foto em breve" would read as if the box were the product.
const KIT_IMAGE = "images/products/kit.jpeg";

function productImages(product, colorId) {
  const color = findColor(product, colorId);
  const own = (color ? color.images : product.images) || [];
  return own.length ? own.concat(KIT_IMAGE) : own;
}

// Stock lives on the colour, since a model can be out of black and still have
// white. Leaving `stock` unset means "not being tracked" — the item stays on
// sale. Set it to a number to have the site and the checkout honour it, and to
// 0 to take it off sale.
//
//   { id: "preto", name: "Preto", hex: "#15130f", stock: 2, images: [...] }
//
function stockOf(product, colorId) {
  const color = findColor(product, colorId);
  const value = color ? color.stock : product.stock;
  return value === undefined || value === null ? Infinity : value;
}

function isSoldOut(product, colorId) {
  return stockOf(product, colorId) <= 0;
}

// Portuguese writes 61,43 € — and whole euros carry no decimals, matching how
// the prices have always been shown.
function formatPrice(value) {
  const shown = Number.isInteger(value) ? String(value) : value.toFixed(2).replace(".", ",");
  return `${shown} €`;
}

// Derived, not stored: change either price and the badge follows.
function discountPercent(product) {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0;
  return Math.round((1 - product.price / product.oldPrice) * 100);
}

function priceHtml(product) {
  const now = `<span class="price__now">${formatPrice(product.price)}</span>`;
  const off = discountPercent(product);
  if (!off) return now;
  return `<s class="price__old">${formatPrice(product.oldPrice)}</s>${now}` +
    `<span class="price__off" aria-label="${off}% ${t("price.off")}">-${off}%</span>`;
}

function productHistory(product) {
  const key = `history.${product.id}`;
  const text = t(key);
  return text === key ? t("pp.historySoon") : text;
}

// The `name` on a colour is Portuguese; the shown name comes from i18n.js under
// `color.<id>`, so a colour reads in the visitor's language everywhere it
// appears — the dot's tooltip, the caption on the product page, the cart line.
// A colour with no entry there falls back to the Portuguese, so adding one
// without translating it first still works.
function colorName(color) {
  const key = `color.${color.id}`;
  const text = t(key);
  return text === key ? color.name : text;
}

// Normally the dot is just the colour. A model whose variants differ in both
// the armação and the lente can set `swatch` to any CSS background — a split
// dot — so two variants sharing an armação are still told apart on the
// catalogue card, where the name is not written out.
function swatchBackground(color) {
  return color.swatch || color.hex;
}

function colorSwatchesHtml(product, selectedId) {
  if (!hasColors(product)) return "";
  const dots = product.colors
    .map((c) => {
      const on = c.id === selectedId;
      const out = isSoldOut(product, c.id);
      const label = colorName(c);
      return `<button type="button" class="swatch${on ? " active" : ""}${out ? " out" : ""}" style="--swatch: ${swatchBackground(c)}" data-color="${c.id}" aria-pressed="${on}" title="${label}"><span class="sr-only">${label}</span></button>`;
    })
    .join("");
  return `<div class="swatches" role="group" aria-label="Cor">${dots}</div>`;
}

// The checkout function pulls the catalogue from here too, so stock is written
// in one place rather than kept in step across two files.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PRODUCTS, stockOf, isSoldOut, findColor, productCategory };
}
