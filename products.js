// Product data only. Every translatable string — including each model's story,
// keyed "history.<id>" — lives in i18n.js.

const PRODUCTS = [
  {
    id: "eye-jacket-45",
    name: "Eye Jacket Redux",
    price: 45,
    colors: [
      {
        id: "preto",
        name: "Preto",
        hex: "#15130f",
        images: [
          "images/products/eye-jacket-45/preto/2.avif",
          "images/products/eye-jacket-45/preto/1.avif",
          "images/products/eye-jacket-45/preto/3.avif",
          "images/products/eye-jacket-45/preto/4.avif",
          "images/products/eye-jacket-45/preto/5.avif",
          "images/products/eye-jacket-45/preto/6.webp",
          "images/products/eye-jacket-45/preto/model.jpg",
        ],
      },
    ],
  },
  {
    id: "plantaris-50",
    name: "Plantaris",
    price: 50,
    colors: [
      {
        id: "preto",
        name: "Preto",
        hex: "#15130f",
        images: [
          "images/products/plantaris-50/preto/1.avif",
          "images/products/plantaris-50/preto/2.avif",
          "images/products/plantaris-50/preto/3.avif",
          "images/products/plantaris-50/preto/4.avif",
          "images/products/plantaris-50/preto/model.webp",
        ],
      },
    ],
  },
  { id: "juliet-45", name: "Juliet", price: 45 },
  { id: "xx-45", name: "XX", price: 45 },
  { id: "plate-55", name: "Plate", price: 55 },
  { id: "gascan-50", name: "Gascan", price: 50 },
  { id: "splice-53", name: "Splice", price: 53 },
  { id: "monster-dog-47", name: "Monster Dog", price: 47 },
  { id: "dartboard-50", name: "Dartboard", price: 50 },
  { id: "flak-2xl-45", name: "Flak 2.0 XL", price: 45 },
  { id: "pitboss-53", name: "PitBoss", price: 53 },
];

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

function productImages(product, colorId) {
  const color = findColor(product, colorId);
  return (color ? color.images : product.images) || [];
}

function productHistory(product) {
  const key = `history.${product.id}`;
  const text = t(key);
  return text === key ? t("pp.historySoon") : text;
}

function colorSwatchesHtml(product, selectedId) {
  if (!hasColors(product)) return "";
  const dots = product.colors
    .map((c) => {
      const on = c.id === selectedId;
      return `<button type="button" class="swatch${on ? " active" : ""}" style="--swatch: ${c.hex}" data-color="${c.id}" aria-pressed="${on}" title="${c.name}"><span class="sr-only">${c.name}</span></button>`;
    })
    .join("");
  return `<div class="swatches" role="group" aria-label="Cor">${dots}</div>`;
}
