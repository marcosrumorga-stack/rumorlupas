// Product data only. Every translatable string — including each model's story,
// keyed "history.<id>" — lives in i18n.js.

// The Dartboard's on-model shot is the same photo for every colour, so it is
// written once and referenced from each rather than copied four times. The
// customer in it gave her consent to appear here.
const DARTBOARD_MODEL = "images/products/dartboard-50/model.jpeg";

const PRODUCTS = [
  {
    id: "eye-jacket-45",
    name: "Eye Jacket Redux",
    price: 49,
    oldPrice: 70,
    colors: [
      {
        // Keeps the "preto" id even though the newer colours name their lente
        // too: the id is in the product page URL and in carts already saved in
        // people's browsers, and renaming it would turn those orders away.
        id: "preto",
        name: "Preto",
        hex: "#15130f",
        stock: 1,
        images: [
          "images/products/eye-jacket-45/preto/1.jpeg",
          "images/products/eye-jacket-45/preto/2.jpeg",
          "images/products/eye-jacket-45/preto/3.jpeg",
          "images/products/eye-jacket-45/preto/4.jpeg",
        ],
      },
      {
        id: "bege-piet-lente-dourada",
        name: "Bege PIET · lente dourada",
        hex: "#d9c3a5",
        swatch: "linear-gradient(135deg, #d9c3a5 50%, #a8862c 50%)",
        stock: 0,
        images: [
          "images/products/eye-jacket-45/bege-piet-lente-dourada/1.jpeg",
          "images/products/eye-jacket-45/bege-piet-lente-dourada/2.jpeg",
          "images/products/eye-jacket-45/bege-piet-lente-dourada/3.jpeg",
          "images/products/eye-jacket-45/bege-piet-lente-dourada/4.jpeg",
        ],
      },
      {
        id: "bege-piet-lente-preta",
        name: "Bege PIET · lente preta",
        hex: "#d9c3a5",
        swatch: "linear-gradient(135deg, #d9c3a5 50%, #1a1a1c 50%)",
        stock: 0,
        images: [
          "images/products/eye-jacket-45/bege-piet-lente-preta/1.jpeg",
          "images/products/eye-jacket-45/bege-piet-lente-preta/2.jpeg",
          "images/products/eye-jacket-45/bege-piet-lente-preta/3.jpeg",
          "images/products/eye-jacket-45/bege-piet-lente-preta/4.jpeg",
        ],
      },
    ],
  },
  {
    // The 1996 original, a different model from the Eye Jacket Redux above and
    // sold alongside it. New ids carry no price number: the ones on the older
    // products are the prices they launched at and have been wrong for a while.
    id: "eye-jacket",
    name: "Eye Jacket",
    price: 59,
    oldPrice: 84.29,
    colors: [
      {
        id: "preta-brain-dead-lente-azul",
        name: "Preta BRAIN DEAD · lente azul",
        hex: "#1b1a2e",
        swatch: "linear-gradient(135deg, #1b1a2e 50%, #2b2bc8 50%)",
        stock: 0,
        images: [
          "images/products/eye-jacket/preta-brain-dead-lente-azul/1.jpeg",
          "images/products/eye-jacket/preta-brain-dead-lente-azul/2.jpeg",
          "images/products/eye-jacket/preta-brain-dead-lente-azul/3.jpeg",
          "images/products/eye-jacket/preta-brain-dead-lente-azul/4.jpeg",
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
        stock: 0,
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
  {
    id: "juliet-45",
    name: "Juliet",
    price: 49,
    oldPrice: 70,
    // Grouped by armação: the four prata first, then the cinza escura, then the
    // dourada. "cinza-escura-espelhada" is the id the Plate already uses — the
    // description is word for word the same, so they share the one string.
    colors: [
      {
        id: "prata-lente-preta",
        name: "Prata · lente preta",
        hex: "#b8b2a6",
        swatch: "linear-gradient(135deg, #b8b2a6 50%, #1a1a1c 50%)",
        stock: 0,
        images: [
          "images/products/juliet-45/prata-lente-preta/1.jpeg",
          "images/products/juliet-45/prata-lente-preta/2.jpeg",
          "images/products/juliet-45/prata-lente-preta/3.jpeg",
          "images/products/juliet-45/prata-lente-preta/4.jpeg",
        ],
      },
      {
        id: "prata-lente-espelhada",
        name: "Prata · lente espelhada",
        hex: "#b8b2a6",
        swatch: "linear-gradient(135deg, #b8b2a6 50%, #cdd2d6 50%)",
        stock: 0,
        images: [
          "images/products/juliet-45/prata-lente-espelhada/1.jpeg",
          "images/products/juliet-45/prata-lente-espelhada/2.jpeg",
          "images/products/juliet-45/prata-lente-espelhada/3.jpeg",
          "images/products/juliet-45/prata-lente-espelhada/4.jpeg",
        ],
      },
      {
        id: "prata-lente-azul",
        name: "Prata · lente azul",
        hex: "#b8b2a6",
        swatch: "linear-gradient(135deg, #b8b2a6 50%, #3d5fc4 50%)",
        stock: 2,
        images: [
          "images/products/juliet-45/prata-lente-azul/1.jpeg",
          "images/products/juliet-45/prata-lente-azul/2.jpeg",
          "images/products/juliet-45/prata-lente-azul/3.jpeg",
          "images/products/juliet-45/prata-lente-azul/4.jpeg",
        ],
      },
      {
        id: "prata-lente-roxa",
        name: "Prata · lente roxa",
        hex: "#b8b2a6",
        swatch: "linear-gradient(135deg, #b8b2a6 50%, #8b2fc9 50%)",
        stock: 2,
        images: [
          "images/products/juliet-45/prata-lente-roxa/1.jpeg",
          "images/products/juliet-45/prata-lente-roxa/2.jpeg",
          "images/products/juliet-45/prata-lente-roxa/3.jpeg",
          "images/products/juliet-45/prata-lente-roxa/4.jpeg",
        ],
      },
      {
        id: "cinza-escura-espelhada",
        name: "Cinza escura · lente espelhada",
        hex: "#4a4744",
        swatch: "linear-gradient(135deg, #4a4744 50%, #cdd2d6 50%)",
        stock: 2,
        images: [
          "images/products/juliet-45/cinza-escura-espelhada/1.jpeg",
          "images/products/juliet-45/cinza-escura-espelhada/2.jpeg",
          "images/products/juliet-45/cinza-escura-espelhada/3.jpeg",
          "images/products/juliet-45/cinza-escura-espelhada/4.jpeg",
        ],
      },
      {
        id: "cinza-escura-lente-azul",
        name: "Cinza escura · lente azul",
        hex: "#4a4744",
        swatch: "linear-gradient(135deg, #4a4744 50%, #3a45c8 50%)",
        stock: 1,
        images: [
          "images/products/juliet-45/cinza-escura-lente-azul/1.jpeg",
          "images/products/juliet-45/cinza-escura-lente-azul/2.jpeg",
          "images/products/juliet-45/cinza-escura-lente-azul/3.jpeg",
          "images/products/juliet-45/cinza-escura-lente-azul/4.jpeg",
        ],
      },
      {
        id: "cinza-escura-lente-rosa",
        name: "Cinza escura · lente rosa",
        hex: "#4a4744",
        swatch: "linear-gradient(135deg, #4a4744 50%, #e0338c 50%)",
        stock: 1,
        images: [
          "images/products/juliet-45/cinza-escura-lente-rosa/1.jpeg",
          "images/products/juliet-45/cinza-escura-lente-rosa/2.jpeg",
          "images/products/juliet-45/cinza-escura-lente-rosa/3.jpeg",
          "images/products/juliet-45/cinza-escura-lente-rosa/4.jpeg",
        ],
      },
      {
        id: "dourada-lente-preta",
        name: "Dourada · lente preta",
        hex: "#d4a017",
        swatch: "linear-gradient(135deg, #d4a017 50%, #1a1a1c 50%)",
        stock: 1,
        images: [
          "images/products/juliet-45/dourada-lente-preta/1.jpeg",
          "images/products/juliet-45/dourada-lente-preta/2.jpeg",
          "images/products/juliet-45/dourada-lente-preta/3.jpeg",
          "images/products/juliet-45/dourada-lente-preta/4.jpeg",
        ],
      },
    ],
  },
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
        stock: 1,
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
        stock: 0,
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
        stock: 0,
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
        stock: 1,
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
        stock: 0,
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
        stock: 0,
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
        stock: 2,
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
        stock: 1,
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
        stock: 1,
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
        stock: 1,
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
  // Out of the shop for now — it never got photos or stock. Uncommenting gives
  // it back its place in the catalogue, the sitemap and the checkout; then drop
  // "splice-53" from RETIRED in tools/sitemap.ps1 and run the script.
  // { id: "splice-53", name: "Splice", price: 53, oldPrice: 75.71 },
  {
    id: "monster-dog-47",
    name: "Monster Dog",
    price: 49,
    oldPrice: 70,
    colors: [
      {
        id: "preta-lente-preta",
        name: "Preta · lente preta",
        hex: "#15130f",
        stock: 0,
        images: [
          "images/products/monster-dog-47/preta-lente-preta/1.jpeg",
          "images/products/monster-dog-47/preta-lente-preta/2.jpeg",
          "images/products/monster-dog-47/preta-lente-preta/3.jpeg",
          "images/products/monster-dog-47/preta-lente-preta/4.jpeg",
          // Worn by a customer who gave the shop the right to use the image.
          "images/products/monster-dog-47/preta-lente-preta/model.jpeg",
        ],
      },
    ],
  },
  {
    id: "dartboard-50",
    name: "Dartboard",
    price: 49,
    oldPrice: 70,
    colors: [
      {
        id: "preta-lente-preta",
        name: "Preta · lente preta",
        hex: "#15130f",
        stock: 0,
        images: [
          "images/products/dartboard-50/preta-lente-preta/1.jpeg",
          "images/products/dartboard-50/preta-lente-preta/2.jpeg",
          "images/products/dartboard-50/preta-lente-preta/3.jpeg",
          "images/products/dartboard-50/preta-lente-preta/4.jpeg",
          DARTBOARD_MODEL,
        ],
      },
      {
        id: "branca-lente-azul",
        name: "Branca · lente azul",
        hex: "#f2f0ed",
        swatch: "linear-gradient(135deg, #f2f0ed 50%, #3c8fd0 50%)",
        stock: 1,
        images: [
          "images/products/dartboard-50/branca-lente-azul/1.jpeg",
          "images/products/dartboard-50/branca-lente-azul/2.jpeg",
          "images/products/dartboard-50/branca-lente-azul/3.jpeg",
          "images/products/dartboard-50/branca-lente-azul/4.jpeg",
          DARTBOARD_MODEL,
        ],
      },
      {
        id: "branca-lente-transparente",
        name: "Branca · lente transparente",
        hex: "#f2f0ed",
        swatch: "linear-gradient(135deg, #f2f0ed 50%, #ddd4c8 50%)",
        stock: 0,
        images: [
          "images/products/dartboard-50/branca-lente-transparente/1.jpeg",
          "images/products/dartboard-50/branca-lente-transparente/2.jpeg",
          "images/products/dartboard-50/branca-lente-transparente/3.jpeg",
          "images/products/dartboard-50/branca-lente-transparente/4.jpeg",
          DARTBOARD_MODEL,
        ],
      },
      {
        id: "castanha-lente-gold",
        name: "Castanha · lente dourada",
        hex: "#5a3a22",
        swatch: "linear-gradient(135deg, #5a3a22 50%, #d9a44c 50%)",
        stock: 0,
        images: [
          "images/products/dartboard-50/castanha-lente-gold/1.jpeg",
          "images/products/dartboard-50/castanha-lente-gold/2.jpeg",
          "images/products/dartboard-50/castanha-lente-gold/3.jpeg",
          "images/products/dartboard-50/castanha-lente-gold/4.jpeg",
          DARTBOARD_MODEL,
        ],
      },
    ],
  },
  {
    id: "flak-2xl-45",
    name: "Flak 2.0 XL",
    price: 49,
    oldPrice: 70,
    // The armação is black on all four. What tells them apart is the lens and
    // the colour of the temples, so the names say all three: armação, hastes,
    // lente. They used to name only the temple colour ("Vermelha · lente
    // preta"), which reads as a red frame - it misled the shop's own stock
    // count in September 2026, so it would mislead a buyer too.
    //
    // The ids keep the old wording on purpose. They are in saved carts, in the
    // ?cor= address of each colour and in the photo folders; only what is
    // shown changed.
    //
    // The dots follow the site's rule, armação on one half and lente on the
    // other, which makes all four black on the left. The temples do not fit in
    // a two-part dot; the photos and the name carry them.
    colors: [
      {
        id: "preta-lente-espelhada",
        name: "Preta · lente espelhada",
        hex: "#15130f",
        swatch: "linear-gradient(135deg, #15130f 50%, #b9bec3 50%)",
        stock: 0,
        images: [
          "images/products/flak-2xl-45/preta-lente-espelhada/1.jpeg",
          "images/products/flak-2xl-45/preta-lente-espelhada/2.jpeg",
          "images/products/flak-2xl-45/preta-lente-espelhada/3.jpeg",
          "images/products/flak-2xl-45/preta-lente-espelhada/4.jpeg",
        ],
      },
      {
        id: "azul-lente-azul",
        name: "Preta, hastes azuis · lente azul",
        hex: "#15130f",
        swatch: "linear-gradient(135deg, #15130f 50%, #2f8fd8 50%)",
        stock: 1,
        images: [
          "images/products/flak-2xl-45/azul-lente-azul/1.jpeg",
          "images/products/flak-2xl-45/azul-lente-azul/2.jpeg",
          "images/products/flak-2xl-45/azul-lente-azul/3.jpeg",
          "images/products/flak-2xl-45/azul-lente-azul/4.jpeg",
        ],
      },
      {
        id: "vermelha-lente-laranja",
        name: "Preta, hastes vermelhas · lente laranja",
        hex: "#15130f",
        swatch: "linear-gradient(135deg, #15130f 50%, #f2a33c 50%)",
        stock: 1,
        images: [
          "images/products/flak-2xl-45/vermelha-lente-laranja/1.jpeg",
          "images/products/flak-2xl-45/vermelha-lente-laranja/2.jpeg",
          "images/products/flak-2xl-45/vermelha-lente-laranja/3.jpeg",
          "images/products/flak-2xl-45/vermelha-lente-laranja/4.jpeg",
        ],
      },
      {
        id: "vermelha-lente-preta",
        name: "Preta, hastes vermelhas · lente preta",
        // Black frame, black lens: the two halves would be the same colour,
        // so no split - the site's rule for that case.
        hex: "#15130f",
        stock: 1,
        images: [
          "images/products/flak-2xl-45/vermelha-lente-preta/1.jpeg",
          "images/products/flak-2xl-45/vermelha-lente-preta/2.jpeg",
          "images/products/flak-2xl-45/vermelha-lente-preta/3.jpeg",
          "images/products/flak-2xl-45/vermelha-lente-preta/4.jpeg",
        ],
      },
    ],
  },
  {
    id: "holbrook",
    name: "Holbrook",
    price: 49,
    oldPrice: 70,
    colors: [
      {
        id: "preta-lente-preta",
        name: "Preta · lente preta",
        hex: "#15130f",
        stock: 1,
        images: [
          "images/products/holbrook/preta-lente-preta/1.jpeg",
          "images/products/holbrook/preta-lente-preta/2.jpeg",
          "images/products/holbrook/preta-lente-preta/3.jpeg",
          "images/products/holbrook/preta-lente-preta/4.jpeg",
        ],
      },
      {
        id: "preta-lente-vermelha",
        name: "Preta · lente vermelha",
        hex: "#15130f",
        swatch: "linear-gradient(135deg, #15130f 50%, #e5401a 50%)",
        stock: 1,
        images: [
          "images/products/holbrook/preta-lente-vermelha/1.jpeg",
          "images/products/holbrook/preta-lente-vermelha/2.jpeg",
          "images/products/holbrook/preta-lente-vermelha/3.jpeg",
          "images/products/holbrook/preta-lente-vermelha/4.jpeg",
        ],
      },
    ],
  },
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
  // >>> camisas geradas por tools/camisas-catalogo.ps1 - nao editar a mao
  {
    id: "africa-do-sul-26-27",
    name: "Camisola África do Sul Principal 26/27 - Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola África do Sul Principal 26/27",
    slug: "africa-do-sul-26-27",
    category: "camisas",
    league: "selecoes/africa/africa-do-sul",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/africa-do-sul-26-27/1.jpeg",
      "images/products/africa-do-sul-26-27/2.jpeg",
      "images/products/africa-do-sul-26-27/3.jpeg",
      "images/products/africa-do-sul-26-27/4.jpeg",
      "images/products/africa-do-sul-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "africa-do-sul-alt-26-27",
    name: "Camisola África do Sul Alternativa 26/27 - Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola África do Sul Alternativa 26/27",
    slug: "africa-do-sul-alt-26-27",
    category: "camisas",
    league: "selecoes/africa/africa-do-sul",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/africa-do-sul-alt-26-27/1.jpeg",
      "images/products/africa-do-sul-alt-26-27/2.jpeg",
      "images/products/africa-do-sul-alt-26-27/3.jpeg",
      "images/products/africa-do-sul-alt-26-27/4.jpeg",
      "images/products/africa-do-sul-alt-26-27/5.jpeg",
      "images/products/africa-do-sul-alt-26-27/6.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "alemanha-1990",
    name: "Camisola Alemanha I 1990 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Alemanha I 1990",
    slug: "alemanha-1990",
    category: "camisas",
    league: "selecoes/europa/alemanha",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/alemanha-1990/1.jpeg",
      "images/products/alemanha-1990/2.jpeg",
      "images/products/alemanha-1990/3.jpeg",
      "images/products/alemanha-1990/4.jpeg",
      "images/products/alemanha-1990/5.jpeg",
      "images/products/alemanha-1990/6.jpeg",
      "images/products/alemanha-1990/7.jpeg",
      "images/products/alemanha-1990/8.jpeg",
      "images/products/alemanha-1990/9.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "alemanha-1994",
    name: "Camisola Alemanha I 1994 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Alemanha I 1994",
    slug: "alemanha-1994",
    category: "camisas",
    league: "selecoes/europa/alemanha",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/alemanha-1994/1.jpeg",
      "images/products/alemanha-1994/2.jpeg",
      "images/products/alemanha-1994/3.jpeg",
      "images/products/alemanha-1994/4.jpeg",
      "images/products/alemanha-1994/5.jpeg",
      "images/products/alemanha-1994/6.jpeg",
      "images/products/alemanha-1994/7.jpeg",
      "images/products/alemanha-1994/8.jpeg",
      "images/products/alemanha-1994/9.jpeg",
      "images/products/alemanha-1994/10.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "alemanha-2010-ii",
    name: "Camisola Alemanha II 2010 - Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Alemanha II 2010",
    slug: "alemanha-2010-ii",
    category: "camisas",
    league: "selecoes/europa/alemanha",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/alemanha-2010-ii/1.jpeg",
      "images/products/alemanha-2010-ii/2.jpeg",
      "images/products/alemanha-2010-ii/3.jpeg",
      "images/products/alemanha-2010-ii/4.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "alemanha-2014-i",
    name: "Camisola Alemanha I 2014 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Alemanha I 2014",
    slug: "alemanha-2014-i",
    category: "camisas",
    league: "selecoes/europa/alemanha",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/alemanha-2014-i/1.jpeg",
      "images/products/alemanha-2014-i/2.jpeg",
      "images/products/alemanha-2014-i/3.jpeg",
      "images/products/alemanha-2014-i/4.jpeg",
      "images/products/alemanha-2014-i/5.jpeg",
      "images/products/alemanha-2014-i/6.jpeg",
      "images/products/alemanha-2014-i/7.jpeg",
      "images/products/alemanha-2014-i/8.jpeg",
      "images/products/alemanha-2014-i/9.jpeg",
      "images/products/alemanha-2014-i/10.jpeg",
      "images/products/alemanha-2014-i/11.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "alemanha-2014-ii",
    name: "Camisola Alemanha II 2014 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Alemanha II 2014",
    slug: "alemanha-2014-ii",
    category: "camisas",
    league: "selecoes/europa/alemanha",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/alemanha-2014-ii/1.jpeg",
      "images/products/alemanha-2014-ii/2.jpeg",
      "images/products/alemanha-2014-ii/3.jpeg",
      "images/products/alemanha-2014-ii/4.jpeg",
      "images/products/alemanha-2014-ii/5.jpeg",
      "images/products/alemanha-2014-ii/6.jpeg",
      "images/products/alemanha-2014-ii/7.jpeg",
      "images/products/alemanha-2014-ii/8.jpeg",
      "images/products/alemanha-2014-ii/9.jpeg",
      "images/products/alemanha-2014-ii/10.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "alemanha-26-27",
    name: "Camisola Alemanha Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola Alemanha Principal 26/27",
    slug: "alemanha-26-27",
    category: "camisas",
    league: "selecoes/europa/alemanha",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/alemanha-26-27/1.jpeg",
      "images/products/alemanha-26-27/2.jpeg",
      "images/products/alemanha-26-27/3.jpeg",
      "images/products/alemanha-26-27/4.jpeg",
      "images/products/alemanha-26-27/5.jpeg",
      "images/products/alemanha-26-27/6.jpeg",
      "images/products/alemanha-26-27/7.jpeg",
      "images/products/alemanha-26-27/8.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "alemanha-alt-26-27",
    name: "Camisola Alemanha Alternativa 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Alemanha Alternativa 26/27",
    slug: "alemanha-alt-26-27",
    category: "camisas",
    league: "selecoes/europa/alemanha",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/alemanha-alt-26-27/1.jpeg",
      "images/products/alemanha-alt-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "alemanha-alt-mulher-26-27",
    name: "Camisola Alemanha Alternativa 26/27 Copa do Mundo 2026 - Mulher",
    namesItself: true,
    titleName: "Camisola Alemanha Alternativa 26/27",
    slug: "alemanha-alt-mulher-26-27",
    category: "camisas",
    league: "selecoes/europa/alemanha",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/alemanha-alt-mulher-26-27/1.jpeg",
      "images/products/alemanha-alt-mulher-26-27/2.jpeg",
      "images/products/alemanha-alt-mulher-26-27/3.jpeg",
      "images/products/alemanha-alt-mulher-26-27/4.jpeg",
      "images/products/alemanha-alt-mulher-26-27/5.jpeg",
      "images/products/alemanha-alt-mulher-26-27/6.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "alemanha-especial-24-25",
    name: "Camisola Alemanha Edição Especial 24/25 Homem",
    namesItself: true,
    titleName: "Camisola Alemanha Edição Especial 24/25",
    slug: "alemanha-especial-24-25",
    category: "camisas",
    league: "selecoes/europa/alemanha",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/alemanha-especial-24-25/1.jpeg",
      "images/products/alemanha-especial-24-25/2.jpeg",
      "images/products/alemanha-especial-24-25/3.jpeg",
      "images/products/alemanha-especial-24-25/4.jpeg",
      "images/products/alemanha-especial-24-25/5.jpeg",
      "images/products/alemanha-especial-24-25/6.jpeg",
      "images/products/alemanha-especial-24-25/7.jpeg",
      "images/products/alemanha-especial-24-25/8.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "alemanha-remixed",
    name: "Camisola Alemanha BRINGBACK REMIXED OVERSIZED 2026 - Retro",
    namesItself: true,
    titleName: "Camisola Alemanha BRINGBACK REMIXED OVERSIZED 2026 - Retro",
    slug: "alemanha-remixed",
    category: "camisas",
    league: "selecoes/europa/alemanha",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/alemanha-remixed/1.jpeg",
      "images/products/alemanha-remixed/2.jpeg",
      "images/products/alemanha-remixed/3.jpeg",
      "images/products/alemanha-remixed/4.jpeg",
      "images/products/alemanha-remixed/5.jpeg",
      "images/products/alemanha-remixed/6.jpeg",
      "images/products/alemanha-remixed/7.jpeg",
      "images/products/alemanha-remixed/8.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "arabia-saudita-26-27",
    name: "Camisola Árabia Saudita Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Árabia Saudita Principal 26/27",
    slug: "arabia-saudita-26-27",
    category: "camisas",
    league: "selecoes/asia/arabia-saudita",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/arabia-saudita-26-27/1.jpeg",
      "images/products/arabia-saudita-26-27/2.jpeg",
      "images/products/arabia-saudita-26-27/3.jpeg",
      "images/products/arabia-saudita-26-27/4.jpeg",
      "images/products/arabia-saudita-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "argelia-26-27",
    name: "Camisola Argélia Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola Argélia Principal 26/27",
    slug: "argelia-26-27",
    category: "camisas",
    league: "selecoes/africa/argelia",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/argelia-26-27/1.jpeg",
      "images/products/argelia-26-27/2.jpeg",
      "images/products/argelia-26-27/3.jpeg",
      "images/products/argelia-26-27/4.jpeg",
      "images/products/argelia-26-27/5.jpeg",
      "images/products/argelia-26-27/6.jpeg",
      "images/products/argelia-26-27/7.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "argelia-adepto-26-27",
    name: "Camisola Argélia Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Argélia Principal 26/27",
    slug: "argelia-adepto-26-27",
    category: "camisas",
    league: "selecoes/africa/argelia",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/argelia-adepto-26-27/1.jpeg",
      "images/products/argelia-adepto-26-27/2.jpeg",
      "images/products/argelia-adepto-26-27/3.jpeg",
      "images/products/argelia-adepto-26-27/4.jpeg",
      "images/products/argelia-adepto-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "argentina-26-27",
    name: "Camisola Argentina Principal 26/27 Copa do Mundo 2026 com Patch - Homem (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola Argentina Principal 26/27",
    slug: "argentina-26-27",
    category: "camisas",
    league: "selecoes/americas/argentina",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/argentina-26-27/1.jpeg",
      "images/products/argentina-26-27/2.jpeg",
      "images/products/argentina-26-27/3.jpeg",
      "images/products/argentina-26-27/4.jpeg",
      "images/products/argentina-26-27/5.jpeg",
      "images/products/argentina-26-27/6.jpeg",
      "images/products/argentina-26-27/7.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "belgica-26-27",
    name: "Camisola Bélgica Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola Bélgica Principal 26/27",
    slug: "belgica-26-27",
    category: "camisas",
    league: "selecoes/europa/belgica",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/belgica-26-27/1.jpeg",
      "images/products/belgica-26-27/2.jpeg",
      "images/products/belgica-26-27/3.jpeg",
      "images/products/belgica-26-27/4.jpeg",
      "images/products/belgica-26-27/5.jpeg",
      "images/products/belgica-26-27/6.jpeg",
      "images/products/belgica-26-27/7.jpeg",
      "images/products/belgica-26-27/8.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "belgica-alt-26-27",
    name: "Camisola Bélgica Alternativa - Copa do Mundo 2026 - Homem - Equipamento Futebol",
    namesItself: true,
    titleName: "Camisola Bélgica Alternativa",
    slug: "belgica-alt-26-27",
    category: "camisas",
    league: "selecoes/europa/belgica",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/belgica-alt-26-27/1.jpeg",
      "images/products/belgica-alt-26-27/2.jpeg",
      "images/products/belgica-alt-26-27/3.jpeg",
      "images/products/belgica-alt-26-27/4.jpeg",
      "images/products/belgica-alt-26-27/5.jpeg",
      "images/products/belgica-alt-26-27/6.jpeg",
      "images/products/belgica-alt-26-27/7.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "belgica-mulher-26-27",
    name: "Camisola Bélgica Principal 26/27 - Copa do Mundo 2026 - Mulher",
    namesItself: true,
    titleName: "Camisola Bélgica Principal 26/27",
    slug: "belgica-mulher-26-27",
    category: "camisas",
    league: "selecoes/europa/belgica",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/belgica-mulher-26-27/1.jpeg",
      "images/products/belgica-mulher-26-27/2.jpeg",
      "images/products/belgica-mulher-26-27/3.jpeg",
      "images/products/belgica-mulher-26-27/4.jpeg",
      "images/products/belgica-mulher-26-27/5.jpeg",
      "images/products/belgica-mulher-26-27/6.jpeg",
      "images/products/belgica-mulher-26-27/7.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "brasil-26-27",
    name: "Camisola Brasil Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola Brasil Principal 26/27",
    slug: "brasil-26-27",
    category: "camisas",
    league: "selecoes/americas/brasil",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/brasil-26-27/1.jpeg",
      "images/products/brasil-26-27/2.jpeg",
      "images/products/brasil-26-27/3.jpeg",
      "images/products/brasil-26-27/4.jpeg",
      "images/products/brasil-26-27/5.jpeg",
      "images/products/brasil-26-27/6.jpeg",
      "images/products/brasil-26-27/7.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "cabo-verde-24-25-ii",
    name: "Camisola Cabo Verde Ll 24/25",
    namesItself: true,
    titleName: "Camisola Cabo Verde Ll 24/25",
    slug: "cabo-verde-24-25-ii",
    category: "camisas",
    league: "selecoes/africa/cabo-verde",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/cabo-verde-24-25-ii/1.jpeg",
      "images/products/cabo-verde-24-25-ii/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "cabo-verde-26-27",
    name: "Camisola Cabo Verde Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Cabo Verde Principal 26/27",
    slug: "cabo-verde-26-27",
    category: "camisas",
    league: "selecoes/africa/cabo-verde",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/cabo-verde-26-27/1.jpeg",
      "images/products/cabo-verde-26-27/2.jpeg",
      "images/products/cabo-verde-26-27/3.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "cabo-verde-alt-26-27",
    name: "Camisola Cabo Verde Alternativa 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Cabo Verde Alternativa 26/27",
    slug: "cabo-verde-alt-26-27",
    category: "camisas",
    league: "selecoes/africa/cabo-verde",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/cabo-verde-alt-26-27/1.jpeg",
      "images/products/cabo-verde-alt-26-27/2.jpeg",
      "images/products/cabo-verde-alt-26-27/3.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "cabo-verde-gr-26-27",
    name: "Camisola Cabo Verde 2026/27 - Guarda - Redes - Homem",
    namesItself: true,
    titleName: "Camisola Cabo Verde 2026/27 - Guarda - Redes",
    slug: "cabo-verde-gr-26-27",
    category: "camisas",
    league: "selecoes/africa/cabo-verde",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/cabo-verde-gr-26-27/1.jpeg",
      "images/products/cabo-verde-gr-26-27/2.jpeg",
      "images/products/cabo-verde-gr-26-27/3.jpeg",
      "images/products/cabo-verde-gr-26-27/4.jpeg",
      "images/products/cabo-verde-gr-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "cabo-verde-gr-laranja-26-27",
    name: "Camisola Cabo Verde 2026/27 - Guarda - Redes Laranja - Homem",
    namesItself: true,
    titleName: "Camisola Cabo Verde 2026/27 - Guarda - Redes Laranja",
    slug: "cabo-verde-gr-laranja-26-27",
    category: "camisas",
    league: "selecoes/africa/cabo-verde",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/cabo-verde-gr-laranja-26-27/1.jpeg",
      "images/products/cabo-verde-gr-laranja-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "cabo-verde-gr-rosa-26-27",
    name: "Camisola Cabo Verde 2026/27 - Guarda - Redes Rosa - Homem",
    namesItself: true,
    titleName: "Camisola Cabo Verde 2026/27 - Guarda - Redes Rosa",
    slug: "cabo-verde-gr-rosa-26-27",
    category: "camisas",
    league: "selecoes/africa/cabo-verde",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/cabo-verde-gr-rosa-26-27/1.jpeg",
      "images/products/cabo-verde-gr-rosa-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "cabo-verde-iii-26-27",
    name: "Camisola Cabo Verde III 2026/27 Copa do Mundo 2026",
    namesItself: true,
    titleName: "Camisola Cabo Verde III 2026/27",
    slug: "cabo-verde-iii-26-27",
    category: "camisas",
    league: "selecoes/africa/cabo-verde",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/cabo-verde-iii-26-27/1.jpeg",
      "images/products/cabo-verde-iii-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "canada-26-27",
    name: "Camisola Canadá 26/27",
    namesItself: true,
    titleName: "Camisola Canadá 26/27",
    slug: "canada-26-27",
    category: "camisas",
    league: "selecoes/americas/canada",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/canada-26-27/1.jpeg",
      "images/products/canada-26-27/2.jpeg",
      "images/products/canada-26-27/3.jpeg",
      "images/products/canada-26-27/4.jpeg",
      "images/products/canada-26-27/5.jpeg",
      "images/products/canada-26-27/6.jpeg",
      "images/products/canada-26-27/7.jpeg",
      "images/products/canada-26-27/8.jpeg",
      "images/products/canada-26-27/9.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "colombia-26-27",
    name: "Camisola Colômbia Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola Colômbia Principal 26/27",
    slug: "colombia-26-27",
    category: "camisas",
    league: "selecoes/americas/colombia",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/colombia-26-27/1.jpeg",
      "images/products/colombia-26-27/2.jpeg",
      "images/products/colombia-26-27/3.jpeg",
      "images/products/colombia-26-27/4.jpeg",
      "images/products/colombia-26-27/5.jpeg",
      "images/products/colombia-26-27/6.jpeg",
      "images/products/colombia-26-27/7.jpeg",
      "images/products/colombia-26-27/8.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "coreia-2024",
    name: "Camisola Coreia I 2024 Homem (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola Coreia I 2024",
    slug: "coreia-2024",
    category: "camisas",
    league: "selecoes/asia/coreia",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/coreia-2024/1.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "costa-marfim-ii-26",
    name: "Camisola Costa do Marfim II 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Costa do Marfim II 2026",
    slug: "costa-marfim-ii-26",
    category: "camisas",
    league: "selecoes/africa/costa-marfim",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/costa-marfim-ii-26/1.jpeg",
      "images/products/costa-marfim-ii-26/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "croacia-1998-ii",
    name: "Camisola Croácia II 1998 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Croácia II 1998",
    slug: "croacia-1998-ii",
    category: "camisas",
    league: "selecoes/europa/croacia",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/croacia-1998-ii/1.jpeg",
      "images/products/croacia-1998-ii/2.jpeg",
      "images/products/croacia-1998-ii/3.jpeg",
      "images/products/croacia-1998-ii/4.jpeg",
      "images/products/croacia-1998-ii/5.jpeg",
      "images/products/croacia-1998-ii/6.jpeg",
      "images/products/croacia-1998-ii/7.jpeg",
      "images/products/croacia-1998-ii/8.jpeg",
      "images/products/croacia-1998-ii/9.jpeg",
      "images/products/croacia-1998-ii/10.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "croacia-26-27",
    name: "Camisola Croácia 2026/27 Copa do Mundo - Equipamento",
    namesItself: true,
    titleName: "Camisola Croácia 2026/27",
    slug: "croacia-26-27",
    category: "camisas",
    league: "selecoes/europa/croacia",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/croacia-26-27/1.jpeg",
      "images/products/croacia-26-27/2.jpeg",
      "images/products/croacia-26-27/3.jpeg",
      "images/products/croacia-26-27/4.jpeg",
      "images/products/croacia-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "croacia-euro-24-25",
    name: "Camisola Croácia I Euro Copa 24/25 Homem",
    namesItself: true,
    titleName: "Camisola Croácia I Euro Copa 24/25",
    slug: "croacia-euro-24-25",
    category: "camisas",
    league: "selecoes/europa/croacia",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/croacia-euro-24-25/1.jpeg",
      "images/products/croacia-euro-24-25/2.jpeg",
      "images/products/croacia-euro-24-25/3.jpeg",
      "images/products/croacia-euro-24-25/4.jpeg",
      "images/products/croacia-euro-24-25/5.jpeg",
      "images/products/croacia-euro-24-25/6.jpeg",
      "images/products/croacia-euro-24-25/7.jpeg",
      "images/products/croacia-euro-24-25/8.jpeg",
      "images/products/croacia-euro-24-25/9.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "dinamarca-26",
    name: "Camisola Dinamarca I 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Dinamarca I 2026",
    slug: "dinamarca-26",
    category: "camisas",
    league: "selecoes/europa/dinamarca",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/dinamarca-26/1.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "dinamarca-86-87",
    name: "Camisola Dinamarca I 86/87 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Dinamarca I 86/87",
    slug: "dinamarca-86-87",
    category: "camisas",
    league: "selecoes/europa/dinamarca",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/dinamarca-86-87/1.jpeg",
      "images/products/dinamarca-86-87/2.jpeg",
      "images/products/dinamarca-86-87/3.jpeg",
      "images/products/dinamarca-86-87/4.jpeg",
      "images/products/dinamarca-86-87/5.jpeg",
      "images/products/dinamarca-86-87/6.jpeg",
      "images/products/dinamarca-86-87/7.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "egito-alt-26",
    name: "Camisola Egito Alternativa - Copa do Mundo - 2026 Homem - Equipamento",
    namesItself: true,
    titleName: "Camisola Egito Alternativa",
    slug: "egito-alt-26",
    category: "camisas",
    league: "selecoes/africa/egito",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/egito-alt-26/1.jpeg",
      "images/products/egito-alt-26/2.jpeg",
      "images/products/egito-alt-26/3.jpeg",
      "images/products/egito-alt-26/4.jpeg",
      "images/products/egito-alt-26/5.jpeg",
      "images/products/egito-alt-26/6.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "equador-26-27",
    name: "Camisola Equador Principal 26/27 - Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Equador Principal 26/27",
    slug: "equador-26-27",
    category: "camisas",
    league: "selecoes/americas/equador",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/equador-26-27/1.jpeg",
      "images/products/equador-26-27/2.jpeg",
      "images/products/equador-26-27/3.jpeg",
      "images/products/equador-26-27/4.jpeg",
      "images/products/equador-26-27/5.jpeg",
      "images/products/equador-26-27/6.jpeg",
      "images/products/equador-26-27/7.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "equador-alt-26-27",
    name: "Camisola Equador Alternativa 26/27 - Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Equador Alternativa 26/27",
    slug: "equador-alt-26-27",
    category: "camisas",
    league: "selecoes/americas/equador",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/equador-alt-26-27/1.jpeg",
      "images/products/equador-alt-26-27/2.jpeg",
      "images/products/equador-alt-26-27/3.jpeg",
      "images/products/equador-alt-26-27/4.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "equador-especial-26-27",
    name: "Camisola Equador Edição Especial 26/27 - Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Equador Edição Especial 26/27",
    slug: "equador-especial-26-27",
    category: "camisas",
    league: "selecoes/americas/equador",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/equador-especial-26-27/1.jpeg",
      "images/products/equador-especial-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "equador-gr-26-27",
    name: "Camisola Equador Guarda Redes 26/27 - Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Equador Guarda Redes 26/27",
    slug: "equador-gr-26-27",
    category: "camisas",
    league: "selecoes/americas/equador",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/equador-gr-26-27/1.jpeg",
      "images/products/equador-gr-26-27/2.jpeg",
      "images/products/equador-gr-26-27/3.jpeg",
      "images/products/equador-gr-26-27/4.jpeg",
      "images/products/equador-gr-26-27/5.jpeg",
      "images/products/equador-gr-26-27/6.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "equador-iii-26-27",
    name: "Camisola Equador Alternativa III 26/27 - Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Equador Alternativa III 26/27",
    slug: "equador-iii-26-27",
    category: "camisas",
    league: "selecoes/americas/equador",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/equador-iii-26-27/1.jpeg",
      "images/products/equador-iii-26-27/2.jpeg",
      "images/products/equador-iii-26-27/3.jpeg",
      "images/products/equador-iii-26-27/4.jpeg",
      "images/products/equador-iii-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "escocia-26-27",
    name: "Camisola Escócia Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Escócia Principal 26/27",
    slug: "escocia-26-27",
    category: "camisas",
    league: "selecoes/europa/escocia",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/escocia-26-27/1.jpeg",
      "images/products/escocia-26-27/2.jpeg",
      "images/products/escocia-26-27/3.jpeg",
      "images/products/escocia-26-27/4.jpeg",
      "images/products/escocia-26-27/5.jpeg",
      "images/products/escocia-26-27/6.jpeg",
      "images/products/escocia-26-27/7.jpeg",
      "images/products/escocia-26-27/8.jpeg",
      "images/products/escocia-26-27/9.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "escocia-alt-26-27",
    name: "Camisola Escócia Alternativa 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Escócia Alternativa 26/27",
    slug: "escocia-alt-26-27",
    category: "camisas",
    league: "selecoes/europa/escocia",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/escocia-alt-26-27/1.jpeg",
      "images/products/escocia-alt-26-27/2.jpeg",
      "images/products/escocia-alt-26-27/3.jpeg",
      "images/products/escocia-alt-26-27/4.jpeg",
      "images/products/escocia-alt-26-27/5.jpeg",
      "images/products/escocia-alt-26-27/6.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-26-27",
    name: "Camisola Espanha Principal 26/27 Duas Estrelas e Patch - Copa do Mundo 2026 (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola Espanha Principal 26/27 Duas Estrelas e Patch",
    slug: "espanha-26-27",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/espanha-26-27/1.jpeg",
      "images/products/espanha-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-alt-26-27",
    name: "Camisola Espanha Alternativa 26/27 Copa do Mundo 2026 Duas Estrelas - Homem",
    namesItself: true,
    titleName: "Camisola Espanha Alternativa 26/27",
    slug: "espanha-alt-26-27",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/espanha-alt-26-27/1.jpeg",
      "images/products/espanha-alt-26-27/2.jpeg",
      "images/products/espanha-alt-26-27/3.jpeg",
      "images/products/espanha-alt-26-27/4.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-alt-manga-longa-26-27",
    name: "Camisola Espanha II 26/27 Copa do Mundo Manga Longa - Versão Jogador",
    namesItself: true,
    titleName: "Camisola Espanha II 26/27",
    slug: "espanha-alt-manga-longa-26-27",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 40,
    personalisation: 5,
    images: [
      "images/products/espanha-alt-manga-longa-26-27/1.jpeg",
      "images/products/espanha-alt-manga-longa-26-27/2.jpeg",
      "images/products/espanha-alt-manga-longa-26-27/3.jpeg",
      "images/products/espanha-alt-manga-longa-26-27/4.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-alt-ml-estrelas-26-27",
    name: "Camisola Espanha Alternativa 26/27 Copa do Mundo 2026 Duas Estrelas Manga Longa - Homem",
    namesItself: true,
    titleName: "Camisola Espanha Alternativa 26/27",
    slug: "espanha-alt-ml-estrelas-26-27",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 40,
    personalisation: 5,
    images: [
      "images/products/espanha-alt-ml-estrelas-26-27/1.jpeg",
      "images/products/espanha-alt-ml-estrelas-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-alt-mulher-26-27",
    name: "Camisola Espanha Alternativa 26/27 Duas Estrelas - Copa do Mundo 2026 - Mulher",
    namesItself: true,
    titleName: "Camisola Espanha Alternativa 26/27 Duas Estrelas",
    slug: "espanha-alt-mulher-26-27",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/espanha-alt-mulher-26-27/1.jpeg",
      "images/products/espanha-alt-mulher-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-campeao-26",
    name: "Camisola Espanha Edição Especial Campeão do Mundo 2026 - Homem V1",
    namesItself: true,
    titleName: "Camisola Espanha Edição Especial Campeão do Mundo 2026",
    slug: "espanha-campeao-26",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/espanha-campeao-26/1.jpeg",
      "images/products/espanha-campeao-26/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-cropped-26-27",
    name: "Camisola Espanha I 26/27 - Copa do Mundo 2026 - TOP CROPPED Mulher",
    namesItself: true,
    titleName: "Camisola Espanha I 26/27",
    slug: "espanha-cropped-26-27",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/espanha-cropped-26-27/1.jpeg",
      "images/products/espanha-cropped-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-cropped-ii-26-27",
    name: "Camisola Espanha II 26/27 - Copa do Mundo 2026 - TOP CROPPED Mulher",
    namesItself: true,
    titleName: "Camisola Espanha II 26/27",
    slug: "espanha-cropped-ii-26-27",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/espanha-cropped-ii-26-27/1.jpeg",
      "images/products/espanha-cropped-ii-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-especial-26",
    name: "Camisola Espanha Edição Especial Copa do Mundo 2026 - Homem Vermelha",
    namesItself: true,
    titleName: "Camisola Espanha Edição Especial",
    slug: "espanha-especial-26",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/espanha-especial-26/1.jpeg",
      "images/products/espanha-especial-26/2.jpeg",
      "images/products/espanha-especial-26/3.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-especial-azul-26",
    name: "Camisola Espanha Edição Especial Copa do Mundo 2026 - Homem Azul",
    namesItself: true,
    titleName: "Camisola Espanha Edição Especial",
    slug: "espanha-especial-azul-26",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/espanha-especial-azul-26/1.jpeg",
      "images/products/espanha-especial-azul-26/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-especial-mulher-26",
    name: "Camisola Espanha Edição Especial Copa do Mundo 2026 - Mulher",
    namesItself: true,
    titleName: "Camisola Espanha Edição Especial",
    slug: "espanha-especial-mulher-26",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/espanha-especial-mulher-26/1.jpeg",
      "images/products/espanha-especial-mulher-26/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-especial-preta-26",
    name: "Camisola Espanha Edição Especial Copa do Mundo 2026 - Homem Preto",
    namesItself: true,
    titleName: "Camisola Espanha Edição Especial",
    slug: "espanha-especial-preta-26",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/espanha-especial-preta-26/1.jpeg",
      "images/products/espanha-especial-preta-26/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-gr-26-27",
    name: "Camisola Espanha Guarda Redes 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Espanha Guarda Redes 26/27",
    slug: "espanha-gr-26-27",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/espanha-gr-26-27/1.jpeg",
      "images/products/espanha-gr-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-mulher-26-27",
    name: "Camisola Espanha Principal 26/27 Duas Estrelas - Copa do Mundo 2026 - Mulher",
    namesItself: true,
    titleName: "Camisola Espanha Principal 26/27 Duas Estrelas",
    slug: "espanha-mulher-26-27",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/espanha-mulher-26-27/1.jpeg",
      "images/products/espanha-mulher-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-travis-scott",
    name: "Camisola Espanha x Travis Scott Cactus Jack Total 90 2026 - Retro",
    namesItself: true,
    titleName: "Camisola Espanha x Travis Scott Cactus Jack Total 90 2026 - Retro",
    slug: "espanha-travis-scott",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/espanha-travis-scott/1.jpeg",
      "images/products/espanha-travis-scott/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "espanha-treino-sm",
    name: "Conjunto de Treino sem Mangas Espanha Copa do Mundo 2026",
    namesItself: true,
    titleName: "Conjunto de Treino sem Mangas Espanha",
    slug: "espanha-treino-sm",
    category: "camisas",
    league: "selecoes/europa/espanha",
    price: 40,
    personalisation: 5,
    images: [
      "images/products/espanha-treino-sm/1.jpeg",
      "images/products/espanha-treino-sm/2.jpeg",
      "images/products/espanha-treino-sm/3.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "estados-unidos-26-27",
    name: "Camisola Estados Unidos Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Estados Unidos Principal 26/27",
    slug: "estados-unidos-26-27",
    category: "camisas",
    league: "selecoes/americas/estados-unidos",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/estados-unidos-26-27/1.jpeg",
      "images/products/estados-unidos-26-27/2.jpeg",
      "images/products/estados-unidos-26-27/3.jpeg",
      "images/products/estados-unidos-26-27/4.jpeg",
      "images/products/estados-unidos-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "estados-unidos-alt-26-27",
    name: "Camisola Estados Unidos Alternativa 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Estados Unidos Alternativa 26/27",
    slug: "estados-unidos-alt-26-27",
    category: "camisas",
    league: "selecoes/americas/estados-unidos",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/estados-unidos-alt-26-27/1.jpeg",
      "images/products/estados-unidos-alt-26-27/2.jpeg",
      "images/products/estados-unidos-alt-26-27/3.jpeg",
      "images/products/estados-unidos-alt-26-27/4.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "estados-unidos-travis-scott",
    name: "Camisola Estados Unidos x Travis Scott Cactus Jack Total 90 2026 - Retro",
    namesItself: true,
    titleName: "Camisola Estados Unidos x Travis Scott Cactus Jack Total 90 2026 - Retro",
    slug: "estados-unidos-travis-scott",
    category: "camisas",
    league: "selecoes/americas/estados-unidos",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/estados-unidos-travis-scott/1.jpeg",
      "images/products/estados-unidos-travis-scott/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "franca-2006-ii",
    name: "Camisola França II 2006 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola França II 2006",
    slug: "franca-2006-ii",
    category: "camisas",
    league: "selecoes/europa/franca",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/franca-2006-ii/1.jpeg",
      "images/products/franca-2006-ii/2.jpeg",
      "images/products/franca-2006-ii/3.jpeg",
      "images/products/franca-2006-ii/4.jpeg",
      "images/products/franca-2006-ii/5.jpeg",
      "images/products/franca-2006-ii/6.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "franca-2018",
    name: "Camisola França I 2018 - Homem Retro",
    namesItself: true,
    titleName: "Camisola França I 2018",
    slug: "franca-2018",
    category: "camisas",
    league: "selecoes/europa/franca",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/franca-2018/1.jpeg",
      "images/products/franca-2018/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "franca-2022-ii",
    name: "Camisola França II 2022 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola França II 2022",
    slug: "franca-2022-ii",
    category: "camisas",
    league: "selecoes/europa/franca",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/franca-2022-ii/1.jpeg",
      "images/products/franca-2022-ii/2.jpeg",
      "images/products/franca-2022-ii/3.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "franca-26-27",
    name: "Camisola França Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola França Principal 26/27",
    slug: "franca-26-27",
    category: "camisas",
    league: "selecoes/europa/franca",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/franca-26-27/1.jpeg",
      "images/products/franca-26-27/2.jpeg",
      "images/products/franca-26-27/3.jpeg",
      "images/products/franca-26-27/4.jpeg",
      "images/products/franca-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "franca-82-83",
    name: "Camisola França I 82/83 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola França I 82/83",
    slug: "franca-82-83",
    category: "camisas",
    league: "selecoes/europa/franca",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/franca-82-83/1.jpeg",
      "images/products/franca-82-83/2.jpeg",
      "images/products/franca-82-83/3.jpeg",
      "images/products/franca-82-83/4.jpeg",
      "images/products/franca-82-83/5.jpeg",
      "images/products/franca-82-83/6.jpeg",
      "images/products/franca-82-83/7.jpeg",
      "images/products/franca-82-83/8.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "franca-98-99",
    name: "Camisola França I 98/99 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola França I 98/99",
    slug: "franca-98-99",
    category: "camisas",
    league: "selecoes/europa/franca",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/franca-98-99/1.jpeg",
      "images/products/franca-98-99/2.jpeg",
      "images/products/franca-98-99/3.jpeg",
      "images/products/franca-98-99/4.jpeg",
      "images/products/franca-98-99/5.jpeg",
      "images/products/franca-98-99/6.jpeg",
      "images/products/franca-98-99/7.jpeg",
      "images/products/franca-98-99/8.jpeg",
      "images/products/franca-98-99/9.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "franca-alt-26-27",
    name: "Camisola França Alternativa 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola França Alternativa 26/27",
    slug: "franca-alt-26-27",
    category: "camisas",
    league: "selecoes/europa/franca",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/franca-alt-26-27/1.jpeg",
      "images/products/franca-alt-26-27/2.jpeg",
      "images/products/franca-alt-26-27/3.jpeg",
      "images/products/franca-alt-26-27/4.jpeg",
      "images/products/franca-alt-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "franca-alt-adepto-26-27",
    name: "Camisola França Alternativa 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola França Alternativa 26/27",
    slug: "franca-alt-adepto-26-27",
    category: "camisas",
    league: "selecoes/europa/franca",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/franca-alt-adepto-26-27/1.jpeg",
      "images/products/franca-alt-adepto-26-27/2.jpeg",
      "images/products/franca-alt-adepto-26-27/3.jpeg",
      "images/products/franca-alt-adepto-26-27/4.jpeg",
      "images/products/franca-alt-adepto-26-27/5.jpeg",
      "images/products/franca-alt-adepto-26-27/6.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "franca-alt-mulher-26-27",
    name: "Camisola França Alternativa 26/27 Copa do Mundo 2026 - Mulher",
    namesItself: true,
    titleName: "Camisola França Alternativa 26/27",
    slug: "franca-alt-mulher-26-27",
    category: "camisas",
    league: "selecoes/europa/franca",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/franca-alt-mulher-26-27/1.jpeg",
      "images/products/franca-alt-mulher-26-27/2.jpeg",
      "images/products/franca-alt-mulher-26-27/3.jpeg",
      "images/products/franca-alt-mulher-26-27/4.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "franca-euro-2024",
    name: "Camisola França I Euro 2024 Homem",
    namesItself: true,
    titleName: "Camisola França I Euro 2024",
    slug: "franca-euro-2024",
    category: "camisas",
    league: "selecoes/europa/franca",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/franca-euro-2024/1.jpeg",
      "images/products/franca-euro-2024/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "franca-ml-euro-2024",
    name: "Camisola França I Manga Longa Euro 2024 Homem (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola França I Manga Longa Euro 2024",
    slug: "franca-ml-euro-2024",
    category: "camisas",
    league: "selecoes/europa/franca",
    price: 40,
    personalisation: 5,
    images: [
      "images/products/franca-ml-euro-2024/1.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "franca-travis-scott",
    name: "Camisola França x Travis Scott Cactus Jack Total 90 2026 - Retro",
    namesItself: true,
    titleName: "Camisola França x Travis Scott Cactus Jack Total 90 2026 - Retro",
    slug: "franca-travis-scott",
    category: "camisas",
    league: "selecoes/europa/franca",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/franca-travis-scott/1.jpeg",
      "images/products/franca-travis-scott/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "gales-26-27",
    name: "Camisola País de Gales Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola País de Gales Principal 26/27",
    slug: "gales-26-27",
    category: "camisas",
    league: "selecoes/europa/gales",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/gales-26-27/1.jpeg",
      "images/products/gales-26-27/2.jpeg",
      "images/products/gales-26-27/3.jpeg",
      "images/products/gales-26-27/4.jpeg",
      "images/products/gales-26-27/5.jpeg",
      "images/products/gales-26-27/6.jpeg",
      "images/products/gales-26-27/7.jpeg",
      "images/products/gales-26-27/8.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "gales-90-92",
    name: "Camisola País de Gales I 90/92 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola País de Gales I 90/92",
    slug: "gales-90-92",
    category: "camisas",
    league: "selecoes/europa/gales",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/gales-90-92/1.jpeg",
      "images/products/gales-90-92/2.jpeg",
      "images/products/gales-90-92/3.jpeg",
      "images/products/gales-90-92/4.jpeg",
      "images/products/gales-90-92/5.jpeg",
      "images/products/gales-90-92/6.jpeg",
      "images/products/gales-90-92/7.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "gales-alt-26-27",
    name: "Camisola País de Gales Alternativa 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola País de Gales Alternativa 26/27",
    slug: "gales-alt-26-27",
    category: "camisas",
    league: "selecoes/europa/gales",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/gales-alt-26-27/1.jpeg",
      "images/products/gales-alt-26-27/2.jpeg",
      "images/products/gales-alt-26-27/3.jpeg",
      "images/products/gales-alt-26-27/4.jpeg",
      "images/products/gales-alt-26-27/5.jpeg",
      "images/products/gales-alt-26-27/6.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "gana-26",
    name: "Camisola Gana - Copa do Mundo 2026 - Homem - Equipamento Futebol",
    namesItself: true,
    titleName: "Camisola Gana",
    slug: "gana-26",
    category: "camisas",
    league: "selecoes/africa/gana",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/gana-26/1.jpeg",
      "images/products/gana-26/2.jpeg",
      "images/products/gana-26/3.jpeg",
      "images/products/gana-26/4.jpeg",
      "images/products/gana-26/5.jpeg",
      "images/products/gana-26/6.jpeg",
      "images/products/gana-26/7.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "holanda-12-13-ii",
    name: "Camisola Holanda II 12/13 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Holanda II 12/13",
    slug: "holanda-12-13-ii",
    category: "camisas",
    league: "selecoes/europa/holanda",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/holanda-12-13-ii/1.jpeg",
      "images/products/holanda-12-13-ii/2.jpeg",
      "images/products/holanda-12-13-ii/3.jpeg",
      "images/products/holanda-12-13-ii/4.jpeg",
      "images/products/holanda-12-13-ii/5.jpeg",
      "images/products/holanda-12-13-ii/6.jpeg",
      "images/products/holanda-12-13-ii/7.jpeg",
      "images/products/holanda-12-13-ii/8.jpeg",
      "images/products/holanda-12-13-ii/9.jpeg",
      "images/products/holanda-12-13-ii/10.jpeg",
      "images/products/holanda-12-13-ii/11.jpeg",
      "images/products/holanda-12-13-ii/12.jpeg",
      "images/products/holanda-12-13-ii/13.jpeg",
      "images/products/holanda-12-13-ii/14.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "holanda-26-27",
    name: "Camisola Holanda Dri - Fit Nike 26/27 - Homem",
    namesItself: true,
    titleName: "Camisola Holanda Dri - Fit Nike 26/27",
    slug: "holanda-26-27",
    category: "camisas",
    league: "selecoes/europa/holanda",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/holanda-26-27/1.jpeg",
      "images/products/holanda-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "holanda-88-89-ii",
    name: "Camisola Holanda II 88/89 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Holanda II 88/89",
    slug: "holanda-88-89-ii",
    category: "camisas",
    league: "selecoes/europa/holanda",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/holanda-88-89-ii/1.jpeg",
      "images/products/holanda-88-89-ii/2.jpeg",
      "images/products/holanda-88-89-ii/3.jpeg",
      "images/products/holanda-88-89-ii/4.jpeg",
      "images/products/holanda-88-89-ii/5.jpeg",
      "images/products/holanda-88-89-ii/6.jpeg",
      "images/products/holanda-88-89-ii/7.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "holanda-95-96",
    name: "Camisola Holanda I 95/96 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Holanda I 95/96",
    slug: "holanda-95-96",
    category: "camisas",
    league: "selecoes/europa/holanda",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/holanda-95-96/1.jpeg",
      "images/products/holanda-95-96/2.jpeg",
      "images/products/holanda-95-96/3.jpeg",
      "images/products/holanda-95-96/4.jpeg",
      "images/products/holanda-95-96/5.jpeg",
      "images/products/holanda-95-96/6.jpeg",
      "images/products/holanda-95-96/7.jpeg",
      "images/products/holanda-95-96/8.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "holanda-alt-26-27",
    name: "Camisola Holanda Alternativa 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Holanda Alternativa 26/27",
    slug: "holanda-alt-26-27",
    category: "camisas",
    league: "selecoes/europa/holanda",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/holanda-alt-26-27/1.jpeg",
      "images/products/holanda-alt-26-27/2.jpeg",
      "images/products/holanda-alt-26-27/3.jpeg",
      "images/products/holanda-alt-26-27/4.jpeg",
      "images/products/holanda-alt-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "holanda-jogador-26-27",
    name: "Camisola Holanda Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola Holanda Principal 26/27",
    slug: "holanda-jogador-26-27",
    category: "camisas",
    league: "selecoes/europa/holanda",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/holanda-jogador-26-27/1.jpeg",
      "images/products/holanda-jogador-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "holanda-principal-26-27",
    name: "Camisola Holanda Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Holanda Principal 26/27",
    slug: "holanda-principal-26-27",
    category: "camisas",
    league: "selecoes/europa/holanda",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/holanda-principal-26-27/1.jpeg",
      "images/products/holanda-principal-26-27/2.jpeg",
      "images/products/holanda-principal-26-27/3.jpeg",
      "images/products/holanda-principal-26-27/4.jpeg",
      "images/products/holanda-principal-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "holanda-travis-scott",
    name: "Camisola Holanda x Travis Scott Cactus Jack Total 90 2026 - Retro",
    namesItself: true,
    titleName: "Camisola Holanda x Travis Scott Cactus Jack Total 90 2026 - Retro",
    slug: "holanda-travis-scott",
    category: "camisas",
    league: "selecoes/europa/holanda",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/holanda-travis-scott/1.jpeg",
      "images/products/holanda-travis-scott/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "inglaterra-1996",
    name: "Camisola Inglaterra I 1996 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Inglaterra I 1996",
    slug: "inglaterra-1996",
    category: "camisas",
    league: "selecoes/europa/inglaterra",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/inglaterra-1996/1.jpeg",
      "images/products/inglaterra-1996/2.jpeg",
      "images/products/inglaterra-1996/3.jpeg",
      "images/products/inglaterra-1996/4.jpeg",
      "images/products/inglaterra-1996/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "inglaterra-2002",
    name: "Camisola Inglaterra 1 2002 - Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Inglaterra 1 2002",
    slug: "inglaterra-2002",
    category: "camisas",
    league: "selecoes/europa/inglaterra",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/inglaterra-2002/1.jpeg",
      "images/products/inglaterra-2002/2.jpeg",
      "images/products/inglaterra-2002/3.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "inglaterra-2004",
    name: "Camisola Inglaterra I 2004 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Inglaterra I 2004",
    slug: "inglaterra-2004",
    category: "camisas",
    league: "selecoes/europa/inglaterra",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/inglaterra-2004/1.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "inglaterra-26-27",
    name: "Camisola Inglaterra Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola Inglaterra Principal 26/27",
    slug: "inglaterra-26-27",
    category: "camisas",
    league: "selecoes/europa/inglaterra",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/inglaterra-26-27/1.jpeg",
      "images/products/inglaterra-26-27/2.jpeg",
      "images/products/inglaterra-26-27/3.jpeg",
      "images/products/inglaterra-26-27/4.jpeg",
      "images/products/inglaterra-26-27/5.jpeg",
      "images/products/inglaterra-26-27/6.jpeg",
      "images/products/inglaterra-26-27/7.jpeg",
      "images/products/inglaterra-26-27/8.jpeg",
      "images/products/inglaterra-26-27/9.jpeg",
      "images/products/inglaterra-26-27/10.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "inglaterra-94-95",
    name: "Camisola Retrô Inglaterra 1994/95 - Homem",
    namesItself: true,
    titleName: "Camisola Retrô Inglaterra 1994/95",
    slug: "inglaterra-94-95",
    category: "camisas",
    league: "selecoes/europa/inglaterra",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/inglaterra-94-95/1.jpeg",
      "images/products/inglaterra-94-95/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "inglaterra-adepto-26-27",
    name: "Camisola Inglaterra Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Inglaterra Principal 26/27",
    slug: "inglaterra-adepto-26-27",
    category: "camisas",
    league: "selecoes/europa/inglaterra",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/inglaterra-adepto-26-27/1.jpeg",
      "images/products/inglaterra-adepto-26-27/2.jpeg",
      "images/products/inglaterra-adepto-26-27/3.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "inglaterra-alt-26-27",
    name: "Camisola Inglaterra Alternativa 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Inglaterra Alternativa 26/27",
    slug: "inglaterra-alt-26-27",
    category: "camisas",
    league: "selecoes/europa/inglaterra",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/inglaterra-alt-26-27/1.jpeg",
      "images/products/inglaterra-alt-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "inglaterra-especial-azul-26-27",
    name: "Camisola Inglaterra Edição Espeical Azul 26/27 - Homem",
    namesItself: true,
    titleName: "Camisola Inglaterra Edição Espeical Azul 26/27",
    slug: "inglaterra-especial-azul-26-27",
    category: "camisas",
    league: "selecoes/europa/inglaterra",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/inglaterra-especial-azul-26-27/1.jpeg",
      "images/products/inglaterra-especial-azul-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "inglaterra-mulher-26-27",
    name: "Camisola Inglaterra Copa do Mundo 2026 - Mulher",
    namesItself: true,
    titleName: "Camisola Inglaterra",
    slug: "inglaterra-mulher-26-27",
    category: "camisas",
    league: "selecoes/europa/inglaterra",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/inglaterra-mulher-26-27/1.jpeg",
      "images/products/inglaterra-mulher-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "inglaterra-palace-26-27",
    name: "Camisola Inglaterra x Palace Skateboards Three Lions Edição Especial 26/27 Homem",
    namesItself: true,
    titleName: "Camisola Inglaterra x Palace Skateboards Three Lions Edição Especial 26/27",
    slug: "inglaterra-palace-26-27",
    category: "camisas",
    league: "selecoes/europa/inglaterra",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/inglaterra-palace-26-27/1.jpeg",
      "images/products/inglaterra-palace-26-27/2.jpeg",
      "images/products/inglaterra-palace-26-27/3.jpeg",
      "images/products/inglaterra-palace-26-27/4.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "inglaterra-palace-ii-26-27",
    name: "Camisola Inglaterra x Palace Skateboards Three Lions Edição Especial II 26/27 Homem",
    namesItself: true,
    titleName: "Camisola Inglaterra x Palace Skateboards Three Lions Edição Especial II 26/27",
    slug: "inglaterra-palace-ii-26-27",
    category: "camisas",
    league: "selecoes/europa/inglaterra",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/inglaterra-palace-ii-26-27/1.jpeg",
      "images/products/inglaterra-palace-ii-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "inglaterra-palace-iii-26-27",
    name: "Camisola Inglaterra Edição Especial Palace - Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Inglaterra Edição Especial Palace",
    slug: "inglaterra-palace-iii-26-27",
    category: "camisas",
    league: "selecoes/europa/inglaterra",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/inglaterra-palace-iii-26-27/1.jpeg",
      "images/products/inglaterra-palace-iii-26-27/2.jpeg",
      "images/products/inglaterra-palace-iii-26-27/3.jpeg",
      "images/products/inglaterra-palace-iii-26-27/4.jpeg",
      "images/products/inglaterra-palace-iii-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "inglaterra-travis-scott",
    name: "Camisola Inglaterra x Travis Scott Cactus Jack Total 90 2026 - Retro",
    namesItself: true,
    titleName: "Camisola Inglaterra x Travis Scott Cactus Jack Total 90 2026 - Retro",
    slug: "inglaterra-travis-scott",
    category: "camisas",
    league: "selecoes/europa/inglaterra",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/inglaterra-travis-scott/1.jpeg",
      "images/products/inglaterra-travis-scott/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "italia-1994",
    name: "Camisola Itália I Mundial 94 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Itália I Mundial 94",
    slug: "italia-1994",
    category: "camisas",
    league: "selecoes/europa/italia",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/italia-1994/1.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "italia-1994-ii",
    name: "Camisola Itália II Mundial 94 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Itália II Mundial 94",
    slug: "italia-1994-ii",
    category: "camisas",
    league: "selecoes/europa/italia",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/italia-1994-ii/1.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "italia-2006-ii",
    name: "Camisola Itália II Mundial 2006 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Itália II Mundial 2006",
    slug: "italia-2006-ii",
    category: "camisas",
    league: "selecoes/europa/italia",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/italia-2006-ii/1.jpeg",
      "images/products/italia-2006-ii/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "italia-26-27",
    name: "Camisola Itália Principal 26/27 - Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Itália Principal 26/27",
    slug: "italia-26-27",
    category: "camisas",
    league: "selecoes/europa/italia",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/italia-26-27/1.jpeg",
      "images/products/italia-26-27/2.jpeg",
      "images/products/italia-26-27/3.jpeg",
      "images/products/italia-26-27/4.jpeg",
      "images/products/italia-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "italia-alt-26-27",
    name: "Camisola Itália Alternativa 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Itália Alternativa 26/27",
    slug: "italia-alt-26-27",
    category: "camisas",
    league: "selecoes/europa/italia",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/italia-alt-26-27/1.jpeg",
      "images/products/italia-alt-26-27/2.jpeg",
      "images/products/italia-alt-26-27/3.jpeg",
      "images/products/italia-alt-26-27/4.jpeg",
      "images/products/italia-alt-26-27/5.jpeg",
      "images/products/italia-alt-26-27/6.jpeg",
      "images/products/italia-alt-26-27/7.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "italia-ii-branca-retro",
    name: "Camisola Itália II Branca Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Itália II Branca",
    slug: "italia-ii-branca-retro",
    category: "camisas",
    league: "selecoes/europa/italia",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/italia-ii-branca-retro/1.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "italia-mulher-26-27",
    name: "Camisola Itália 2026/27 - Mulher",
    namesItself: true,
    titleName: "Camisola Itália 2026/27",
    slug: "italia-mulher-26-27",
    category: "camisas",
    league: "selecoes/europa/italia",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/italia-mulher-26-27/1.jpeg",
      "images/products/italia-mulher-26-27/2.jpeg",
      "images/products/italia-mulher-26-27/3.jpeg",
      "images/products/italia-mulher-26-27/4.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "italia-versace",
    name: "Camisola Itália x Versace Edição Especial Homem",
    namesItself: true,
    titleName: "Camisola Itália x Versace Edição Especial",
    slug: "italia-versace",
    category: "camisas",
    league: "selecoes/europa/italia",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/italia-versace/1.jpeg",
      "images/products/italia-versace/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "italia-versace-azul",
    name: "Camisola Itália x Versace Azul Edição Especial",
    namesItself: true,
    titleName: "Camisola Itália x Versace Azul Edição Especial",
    slug: "italia-versace-azul",
    category: "camisas",
    league: "selecoes/europa/italia",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/italia-versace-azul/1.jpeg",
      "images/products/italia-versace-azul/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "jamaica-26-27",
    name: "Camisola Jamaica Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Jamaica Principal 26/27",
    slug: "jamaica-26-27",
    category: "camisas",
    league: "selecoes/americas/jamaica",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/jamaica-26-27/1.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "jamaica-alt-26-27",
    name: "Camisola Jamaica Alternativa 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Jamaica Alternativa 26/27",
    slug: "jamaica-alt-26-27",
    category: "camisas",
    league: "selecoes/americas/jamaica",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/jamaica-alt-26-27/1.jpeg",
      "images/products/jamaica-alt-26-27/2.jpeg",
      "images/products/jamaica-alt-26-27/3.jpeg",
      "images/products/jamaica-alt-26-27/4.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-1998",
    name: "Camisola Japão 1998 (Retro)",
    namesItself: true,
    titleName: "Camisola Japão 1998",
    slug: "japao-1998",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/japao-1998/1.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-24-25",
    name: "Camisola Japão II 24/25 (Homem)",
    namesItself: true,
    titleName: "Camisola Japão II 24/25",
    slug: "japao-24-25",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-24-25/1.jpeg",
      "images/products/japao-24-25/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-26-27",
    name: "Camisola Japão Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Japão Principal 26/27",
    slug: "japao-26-27",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-26-27/1.jpeg",
      "images/products/japao-26-27/2.jpeg",
      "images/products/japao-26-27/3.jpeg",
      "images/products/japao-26-27/4.jpeg",
      "images/products/japao-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-alt-26-27",
    name: "Camisola Japão Alternativa 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Japão Alternativa 26/27",
    slug: "japao-alt-26-27",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-alt-26-27/1.jpeg",
      "images/products/japao-alt-26-27/2.jpeg",
      "images/products/japao-alt-26-27/3.jpeg",
      "images/products/japao-alt-26-27/4.jpeg",
      "images/products/japao-alt-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-alt-jogador-26-27",
    name: "Camisola Japão Alternativa 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola Japão Alternativa 26/27",
    slug: "japao-alt-jogador-26-27",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/japao-alt-jogador-26-27/1.jpeg",
      "images/products/japao-alt-jogador-26-27/2.jpeg",
      "images/products/japao-alt-jogador-26-27/3.jpeg",
      "images/products/japao-alt-jogador-26-27/4.jpeg",
      "images/products/japao-alt-jogador-26-27/5.jpeg",
      "images/products/japao-alt-jogador-26-27/6.jpeg",
      "images/products/japao-alt-jogador-26-27/7.jpeg",
      "images/products/japao-alt-jogador-26-27/8.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-alt-mulher-26-27",
    name: "Camisola Japão Alternativa 26/27 Copa do Mundo 2026 - Mulher",
    namesItself: true,
    titleName: "Camisola Japão Alternativa 26/27",
    slug: "japao-alt-mulher-26-27",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-alt-mulher-26-27/1.jpeg",
      "images/products/japao-alt-mulher-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-dbz",
    name: "Camisola Japão Edição Expicial x DBZ - Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição Expicial x DBZ",
    slug: "japao-dbz",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-dbz/1.jpeg",
      "images/products/japao-dbz/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-dragon-ball-26-27",
    name: "Camisola Japão Edição Especial Dragon Ball 26/27 - Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição Especial Dragon Ball 26/27",
    slug: "japao-dragon-ball-26-27",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-dragon-ball-26-27/1.jpeg",
      "images/products/japao-dragon-ball-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-especial-24-25",
    name: "Camisola Japão 2024/25 - Edição Especial - Homem",
    namesItself: true,
    titleName: "Camisola Japão 2024/25 - Edição Especial",
    slug: "japao-especial-24-25",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-especial-24-25/1.jpeg",
      "images/products/japao-especial-24-25/2.jpeg",
      "images/products/japao-especial-24-25/3.jpeg",
      "images/products/japao-especial-24-25/4.jpeg",
      "images/products/japao-especial-24-25/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-especial-26",
    name: "Camisola Japão 2026 - Edição Especial - Homem",
    namesItself: true,
    titleName: "Camisola Japão 2026 - Edição Especial",
    slug: "japao-especial-26",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-especial-26/1.jpeg",
      "images/products/japao-especial-26/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-especial-branca-26",
    name: "Camisola Japão 2O26 - Edição Especial Branca - Homem",
    namesItself: true,
    titleName: "Camisola Japão 2O26 - Edição Especial Branca",
    slug: "japao-especial-branca-26",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-especial-branca-26/1.jpeg",
      "images/products/japao-especial-branca-26/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-especial-ii",
    name: "Camisola Japão Edição Especial Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição Especial",
    slug: "japao-especial-ii",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-especial-ii/1.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-especial-vi-24-25",
    name: "Camisola Japão Edição Especial VI 24/25 - Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição Especial VI 24/25",
    slug: "japao-especial-vi-24-25",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-especial-vi-24-25/1.jpeg",
      "images/products/japao-especial-vi-24-25/2.jpeg",
      "images/products/japao-especial-vi-24-25/3.jpeg",
      "images/products/japao-especial-vi-24-25/4.jpeg",
      "images/products/japao-especial-vi-24-25/5.jpeg",
      "images/products/japao-especial-vi-24-25/6.jpeg",
      "images/products/japao-especial-vi-24-25/7.jpeg",
      "images/products/japao-especial-vi-24-25/8.jpeg",
      "images/products/japao-especial-vi-24-25/9.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-goku-24-25",
    name: "Camisola Japão Edição Goku 24/25 Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição Goku 24/25",
    slug: "japao-goku-24-25",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-goku-24-25/1.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-goku-25-26",
    name: "Camisola Japão Edição Especial Goku 25/26 - Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição Especial Goku 25/26",
    slug: "japao-goku-25-26",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-goku-25-26/1.jpeg",
      "images/products/japao-goku-25-26/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-itachi-2025",
    name: "Camisola Japão Edição Especial Itachi 2025 - Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição Especial Itachi 2025",
    slug: "japao-itachi-2025",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-itachi-2025/1.jpeg",
      "images/products/japao-itachi-2025/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-itachi-25-26",
    name: "Camisola Japão Edição Especial Itachi 25/26 - Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição Especial Itachi 25/26",
    slug: "japao-itachi-25-26",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-itachi-25-26/1.jpeg",
      "images/products/japao-itachi-25-26/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-itachi-sasuke",
    name: "Camisola Japão Edição Especial Itachi x Sasuke - Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição Especial Itachi x Sasuke",
    slug: "japao-itachi-sasuke",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-itachi-sasuke/1.jpeg",
      "images/products/japao-itachi-sasuke/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-limitada-24-25",
    name: "Camisola Japão Edição Especial I 24/25 Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição Especial I 24/25",
    slug: "japao-limitada-24-25",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-limitada-24-25/1.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-limitada-ii-24-25",
    name: "Camisola Japão Edição Especial Limitada II 24/25 Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição Especial Limitada II 24/25",
    slug: "japao-limitada-ii-24-25",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-limitada-ii-24-25/1.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-luffy-24-25",
    name: "Camisola Japão Edição Especial Luffy 24/25 - Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição Especial Luffy 24/25",
    slug: "japao-luffy-24-25",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-luffy-24-25/1.jpeg",
      "images/products/japao-luffy-24-25/2.jpeg",
      "images/products/japao-luffy-24-25/3.jpeg",
      "images/products/japao-luffy-24-25/4.jpeg",
      "images/products/japao-luffy-24-25/5.jpeg",
      "images/products/japao-luffy-24-25/6.jpeg",
      "images/products/japao-luffy-24-25/7.jpeg",
      "images/products/japao-luffy-24-25/8.jpeg",
      "images/products/japao-luffy-24-25/9.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-naruto",
    name: "Camisola Japão Edição Especial Naruto Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição Especial Naruto",
    slug: "japao-naruto",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/japao-naruto/1.jpeg",
      "images/products/japao-naruto/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-obito-25-26",
    name: "Camisola Japão 2025/26 - Edição Especial Obito Uchiha - Homem",
    namesItself: true,
    titleName: "Camisola Japão 2025/26 - Edição Especial Obito Uchiha",
    slug: "japao-obito-25-26",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-obito-25-26/1.jpeg",
      "images/products/japao-obito-25-26/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-one-piece-26",
    name: "Camisola Japão Edição One Piece Concept 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição One Piece Concept 2026",
    slug: "japao-one-piece-26",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-one-piece-26/1.jpeg",
      "images/products/japao-one-piece-26/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-remixed",
    name: "Camisola Japão BRINGBACK REMIXED OVERSIZED 2026 - Retro",
    namesItself: true,
    titleName: "Camisola Japão BRINGBACK REMIXED OVERSIZED 2026 - Retro",
    slug: "japao-remixed",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/japao-remixed/1.jpeg",
      "images/products/japao-remixed/2.jpeg",
      "images/products/japao-remixed/3.jpeg",
      "images/products/japao-remixed/4.jpeg",
      "images/products/japao-remixed/5.jpeg",
      "images/products/japao-remixed/6.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-rock-lee-24-25",
    name: "Camisola Japão Edição Especial Rock Lee 24/25 - Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição Especial Rock Lee 24/25",
    slug: "japao-rock-lee-24-25",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-rock-lee-24-25/1.jpeg",
      "images/products/japao-rock-lee-24-25/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-tsubasa",
    name: "Camisola Japão Edição Capitão Tsubasa - Campeões: Oliver e Benji - Homem",
    namesItself: true,
    titleName: "Camisola Japão Edição Capitão Tsubasa - Campeões: Oliver e Benji",
    slug: "japao-tsubasa",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-tsubasa/1.jpeg",
      "images/products/japao-tsubasa/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-vegeta",
    name: "Camisola Japão Vegeta Edição Dragon Ball",
    namesItself: true,
    titleName: "Camisola Japão Vegeta Edição Dragon Ball",
    slug: "japao-vegeta",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-vegeta/1.jpeg",
      "images/products/japao-vegeta/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "japao-zoro-26-27",
    name: "Camisola Japão Concept x Roronoa Zoro 26/27 - Homem",
    namesItself: true,
    titleName: "Camisola Japão Concept x Roronoa Zoro 26/27",
    slug: "japao-zoro-26-27",
    category: "camisas",
    league: "selecoes/asia/japao",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/japao-zoro-26-27/1.jpeg",
      "images/products/japao-zoro-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "marrocos-25-26-ii",
    name: "Camisola Marrocos II 25/26 Homem",
    namesItself: true,
    titleName: "Camisola Marrocos II 25/26",
    slug: "marrocos-25-26-ii",
    category: "camisas",
    league: "selecoes/africa/marrocos",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/marrocos-25-26-ii/1.jpeg",
      "images/products/marrocos-25-26-ii/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "marrocos-26-27",
    name: "Camisola Marrocos Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Marrocos Principal 26/27",
    slug: "marrocos-26-27",
    category: "camisas",
    league: "selecoes/africa/marrocos",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/marrocos-26-27/1.jpeg",
      "images/products/marrocos-26-27/2.jpeg",
      "images/products/marrocos-26-27/3.jpeg",
      "images/products/marrocos-26-27/4.jpeg",
      "images/products/marrocos-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "marrocos-alt-26-27",
    name: "Camisola Marrocos Alternativa 2026/27 Copa do Mundo 2026",
    namesItself: true,
    titleName: "Camisola Marrocos Alternativa 2026/27",
    slug: "marrocos-alt-26-27",
    category: "camisas",
    league: "selecoes/africa/marrocos",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/marrocos-alt-26-27/1.jpeg",
      "images/products/marrocos-alt-26-27/2.jpeg",
      "images/products/marrocos-alt-26-27/3.jpeg",
      "images/products/marrocos-alt-26-27/4.jpeg",
      "images/products/marrocos-alt-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "mexico-26-27",
    name: "Camisola México Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola México Principal 26/27",
    slug: "mexico-26-27",
    category: "camisas",
    league: "selecoes/americas/mexico",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/mexico-26-27/1.jpeg",
      "images/products/mexico-26-27/2.jpeg",
      "images/products/mexico-26-27/3.jpeg",
      "images/products/mexico-26-27/4.jpeg",
      "images/products/mexico-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "mexico-97-98",
    name: "Camisola México I 97/98 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola México I 97/98",
    slug: "mexico-97-98",
    category: "camisas",
    league: "selecoes/americas/mexico",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/mexico-97-98/1.jpeg",
      "images/products/mexico-97-98/2.jpeg",
      "images/products/mexico-97-98/3.jpeg",
      "images/products/mexico-97-98/4.jpeg",
      "images/products/mexico-97-98/5.jpeg",
      "images/products/mexico-97-98/6.jpeg",
      "images/products/mexico-97-98/7.jpeg",
      "images/products/mexico-97-98/8.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "mexico-mulher-26-27",
    name: "Camisola México Principal 26/27 - Copa do Mundo 2026 - Mulher",
    namesItself: true,
    titleName: "Camisola México Principal 26/27",
    slug: "mexico-mulher-26-27",
    category: "camisas",
    league: "selecoes/americas/mexico",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/mexico-mulher-26-27/1.jpeg",
      "images/products/mexico-mulher-26-27/2.jpeg",
      "images/products/mexico-mulher-26-27/3.jpeg",
      "images/products/mexico-mulher-26-27/4.jpeg",
      "images/products/mexico-mulher-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "mexico-travis-scott",
    name: "Camisola México x Travis Scott Cactus Jack Total 90 2026 - Retro",
    namesItself: true,
    titleName: "Camisola México x Travis Scott Cactus Jack Total 90 2026 - Retro",
    slug: "mexico-travis-scott",
    category: "camisas",
    league: "selecoes/americas/mexico",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/mexico-travis-scott/1.jpeg",
      "images/products/mexico-travis-scott/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "nigeria-1998",
    name: "Camisola Nigéria I 1998 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Nigéria I 1998",
    slug: "nigeria-1998",
    category: "camisas",
    league: "selecoes/africa/nigeria",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/nigeria-1998/1.jpeg",
      "images/products/nigeria-1998/2.jpeg",
      "images/products/nigeria-1998/3.jpeg",
      "images/products/nigeria-1998/4.jpeg",
      "images/products/nigeria-1998/5.jpeg",
      "images/products/nigeria-1998/6.jpeg",
      "images/products/nigeria-1998/7.jpeg",
      "images/products/nigeria-1998/8.jpeg",
      "images/products/nigeria-1998/9.jpeg",
      "images/products/nigeria-1998/10.jpeg",
      "images/products/nigeria-1998/11.jpeg",
      "images/products/nigeria-1998/12.jpeg",
      "images/products/nigeria-1998/13.jpeg",
      "images/products/nigeria-1998/14.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "nigeria-26-27",
    name: "Camisola Nigéria Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Nigéria Principal 26/27",
    slug: "nigeria-26-27",
    category: "camisas",
    league: "selecoes/africa/nigeria",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/nigeria-26-27/1.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "nigeria-96-98-ii",
    name: "Camisola Nigéria II 96/98 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Nigéria II 96/98",
    slug: "nigeria-96-98-ii",
    category: "camisas",
    league: "selecoes/africa/nigeria",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/nigeria-96-98-ii/1.jpeg",
      "images/products/nigeria-96-98-ii/2.jpeg",
      "images/products/nigeria-96-98-ii/3.jpeg",
      "images/products/nigeria-96-98-ii/4.jpeg",
      "images/products/nigeria-96-98-ii/5.jpeg",
      "images/products/nigeria-96-98-ii/6.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "nigeria-alt-26-27",
    name: "Camisola Nigéria Alternativa 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Nigéria Alternativa 26/27",
    slug: "nigeria-alt-26-27",
    category: "camisas",
    league: "selecoes/africa/nigeria",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/nigeria-alt-26-27/1.jpeg",
      "images/products/nigeria-alt-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "noruega-26-27",
    name: "Camisola Noruega Principal 26/27 - Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Noruega Principal 26/27",
    slug: "noruega-26-27",
    category: "camisas",
    league: "selecoes/europa/noruega",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/noruega-26-27/1.jpeg",
      "images/products/noruega-26-27/2.jpeg",
      "images/products/noruega-26-27/3.jpeg",
      "images/products/noruega-26-27/4.jpeg",
      "images/products/noruega-26-27/5.jpeg",
      "images/products/noruega-26-27/6.jpeg",
      "images/products/noruega-26-27/7.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "noruega-alt-26-27",
    name: "Camisola Noruega Alternativa 26/27 - Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Noruega Alternativa 26/27",
    slug: "noruega-alt-26-27",
    category: "camisas",
    league: "selecoes/europa/noruega",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/noruega-alt-26-27/1.jpeg",
      "images/products/noruega-alt-26-27/2.jpeg",
      "images/products/noruega-alt-26-27/3.jpeg",
      "images/products/noruega-alt-26-27/4.jpeg",
      "images/products/noruega-alt-26-27/5.jpeg",
      "images/products/noruega-alt-26-27/6.jpeg",
      "images/products/noruega-alt-26-27/7.jpeg",
      "images/products/noruega-alt-26-27/8.jpeg",
      "images/products/noruega-alt-26-27/9.jpeg",
      "images/products/noruega-alt-26-27/10.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "noruega-iii-26-27",
    name: "Camisola Noruega III 26/27 - Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Noruega III 26/27",
    slug: "noruega-iii-26-27",
    category: "camisas",
    league: "selecoes/europa/noruega",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/noruega-iii-26-27/1.jpeg",
      "images/products/noruega-iii-26-27/2.jpeg",
      "images/products/noruega-iii-26-27/3.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "peru-26-27",
    name: "Camisola Peru Principal 26/27 Homem",
    namesItself: true,
    titleName: "Camisola Peru Principal 26/27",
    slug: "peru-26-27",
    category: "camisas",
    league: "selecoes/americas/peru",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/peru-26-27/1.jpeg",
      "images/products/peru-26-27/2.jpeg",
      "images/products/peru-26-27/3.jpeg",
      "images/products/peru-26-27/4.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "portugal-2016",
    name: "Camisola Portugal 2016 Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Portugal 2016",
    slug: "portugal-2016",
    category: "camisas",
    league: "selecoes/europa/portugal",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/portugal-2016/1.jpeg",
      "images/products/portugal-2016/2.jpeg",
      "images/products/portugal-2016/3.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "portugal-26-27",
    name: "Camisola Portugal Principal 26/27 Copa do Mundo 2026 Homem (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola Portugal Principal 26/27",
    slug: "portugal-26-27",
    category: "camisas",
    league: "selecoes/europa/portugal",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/portugal-26-27/1.jpeg",
      "images/products/portugal-26-27/2.jpeg",
      "images/products/portugal-26-27/3.jpeg",
      "images/products/portugal-26-27/4.jpeg",
      "images/products/portugal-26-27/5.jpeg",
      "images/products/portugal-26-27/6.jpeg",
      "images/products/portugal-26-27/7.jpeg",
      "images/products/portugal-26-27/8.jpeg",
      "images/products/portugal-26-27/9.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "portugal-alt-26-27",
    name: "Camisola Portugal Alternativa 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)",
    namesItself: true,
    titleName: "Camisola Portugal Alternativa 26/27",
    slug: "portugal-alt-26-27",
    category: "camisas",
    league: "selecoes/europa/portugal",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/portugal-alt-26-27/1.jpeg",
      "images/products/portugal-alt-26-27/2.jpeg",
      "images/products/portugal-alt-26-27/3.jpeg",
      "images/products/portugal-alt-26-27/4.jpeg",
      "images/products/portugal-alt-26-27/5.jpeg",
      "images/products/portugal-alt-26-27/6.jpeg",
      "images/products/portugal-alt-26-27/7.jpeg",
      "images/products/portugal-alt-26-27/8.jpeg",
      "images/products/portugal-alt-26-27/9.jpeg",
      "images/products/portugal-alt-26-27/10.jpeg",
      "images/products/portugal-alt-26-27/11.jpeg",
      "images/products/portugal-alt-26-27/12.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "portugal-eusebio-25-26",
    name: "Camisola Portugal Alternativa Edição Especial Eusébio 25/26 - Homem",
    namesItself: true,
    titleName: "Camisola Portugal Alternativa Edição Especial Eusébio 25/26",
    slug: "portugal-eusebio-25-26",
    category: "camisas",
    league: "selecoes/europa/portugal",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/portugal-eusebio-25-26/1.jpeg",
      "images/products/portugal-eusebio-25-26/2.jpeg",
      "images/products/portugal-eusebio-25-26/3.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "portugal-eusebio-mulher-25-26",
    name: "Camisola Portugal Alternativa Edição Especial Eusébio 25/26 - Mulher",
    namesItself: true,
    titleName: "Camisola Portugal Alternativa Edição Especial Eusébio 25/26",
    slug: "portugal-eusebio-mulher-25-26",
    category: "camisas",
    league: "selecoes/europa/portugal",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/portugal-eusebio-mulher-25-26/1.jpeg",
      "images/products/portugal-eusebio-mulher-25-26/2.jpeg",
      "images/products/portugal-eusebio-mulher-25-26/3.jpeg",
      "images/products/portugal-eusebio-mulher-25-26/4.jpeg",
      "images/products/portugal-eusebio-mulher-25-26/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "portugal-mulher-26-27",
    name: "Camisola Portugal Principal 26/27 Copa do Mundo 2026 - Mulher",
    namesItself: true,
    titleName: "Camisola Portugal Principal 26/27",
    slug: "portugal-mulher-26-27",
    category: "camisas",
    league: "selecoes/europa/portugal",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/portugal-mulher-26-27/1.jpeg",
      "images/products/portugal-mulher-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "portugal-travis-scott",
    name: "Camisola Portugal Cactus Jack Total 90 2026 - Retro",
    namesItself: true,
    titleName: "Camisola Portugal Cactus Jack Total 90 2026 - Retro",
    slug: "portugal-travis-scott",
    category: "camisas",
    league: "selecoes/europa/portugal",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/portugal-travis-scott/1.jpeg",
      "images/products/portugal-travis-scott/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "romenia-25-26",
    name: "Camisola Roménia Principal 25/26 - Homem",
    namesItself: true,
    titleName: "Camisola Roménia Principal 25/26",
    slug: "romenia-25-26",
    category: "camisas",
    league: "selecoes/europa/romenia",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/romenia-25-26/1.jpeg",
      "images/products/romenia-25-26/2.jpeg",
      "images/products/romenia-25-26/3.jpeg",
      "images/products/romenia-25-26/4.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "senegal-26-27",
    name: "Camisola Senegal Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Senegal Principal 26/27",
    slug: "senegal-26-27",
    category: "camisas",
    league: "selecoes/africa/senegal",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/senegal-26-27/1.jpeg",
      "images/products/senegal-26-27/2.jpeg",
      "images/products/senegal-26-27/3.jpeg",
      "images/products/senegal-26-27/4.jpeg",
      "images/products/senegal-26-27/5.jpeg",
      "images/products/senegal-26-27/6.jpeg",
      "images/products/senegal-26-27/7.jpeg",
      "images/products/senegal-26-27/8.jpeg",
      "images/products/senegal-26-27/9.jpeg",
      "images/products/senegal-26-27/10.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "senegal-alt-26-27",
    name: "Camisola Senegal Alternativa 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Senegal Alternativa 26/27",
    slug: "senegal-alt-26-27",
    category: "camisas",
    league: "selecoes/africa/senegal",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/senegal-alt-26-27/1.jpeg",
      "images/products/senegal-alt-26-27/2.jpeg",
      "images/products/senegal-alt-26-27/3.jpeg",
      "images/products/senegal-alt-26-27/4.jpeg",
      "images/products/senegal-alt-26-27/5.jpeg",
      "images/products/senegal-alt-26-27/6.jpeg",
      "images/products/senegal-alt-26-27/7.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "senegal-retro",
    name: "Camisola Senegal I Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Senegal I",
    slug: "senegal-retro",
    category: "camisas",
    league: "selecoes/africa/senegal",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/senegal-retro/1.jpeg",
      "images/products/senegal-retro/2.jpeg",
      "images/products/senegal-retro/3.jpeg",
      "images/products/senegal-retro/4.jpeg",
      "images/products/senegal-retro/5.jpeg",
      "images/products/senegal-retro/6.jpeg",
      "images/products/senegal-retro/7.jpeg",
      "images/products/senegal-retro/8.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "senegal-retro-ii",
    name: "Camisola Senegal II Homem (Retro)",
    namesItself: true,
    titleName: "Camisola Senegal II",
    slug: "senegal-retro-ii",
    category: "camisas",
    league: "selecoes/africa/senegal",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/senegal-retro-ii/1.jpeg",
      "images/products/senegal-retro-ii/2.jpeg",
      "images/products/senegal-retro-ii/3.jpeg",
      "images/products/senegal-retro-ii/4.jpeg",
      "images/products/senegal-retro-ii/5.jpeg",
      "images/products/senegal-retro-ii/6.jpeg",
      "images/products/senegal-retro-ii/7.jpeg",
      "images/products/senegal-retro-ii/8.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "suecia-26-27",
    name: "Camisola Suécia Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Suécia Principal 26/27",
    slug: "suecia-26-27",
    category: "camisas",
    league: "selecoes/europa/suecia",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/suecia-26-27/1.jpeg",
      "images/products/suecia-26-27/2.jpeg",
      "images/products/suecia-26-27/3.jpeg",
      "images/products/suecia-26-27/4.jpeg",
      "images/products/suecia-26-27/5.jpeg",
      "images/products/suecia-26-27/6.jpeg",
      "images/products/suecia-26-27/7.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "suica-24-25",
    name: "Camisola Suíça 24/25",
    namesItself: true,
    titleName: "Camisola Suíça 24/25",
    slug: "suica-24-25",
    category: "camisas",
    league: "selecoes/europa/suica",
    price: 35,
    personalisation: 5,
    images: [
      "images/products/suica-24-25/1.jpeg",
      "images/products/suica-24-25/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "suica-26-27",
    name: "Camisola Suiça Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Suiça Principal 26/27",
    slug: "suica-26-27",
    category: "camisas",
    league: "selecoes/europa/suica",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/suica-26-27/1.jpeg",
      "images/products/suica-26-27/2.jpeg",
      "images/products/suica-26-27/3.jpeg",
      "images/products/suica-26-27/4.jpeg",
      "images/products/suica-26-27/5.jpeg",
      "images/products/suica-26-27/6.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "suica-alt-26-27",
    name: "Camisola Suiça Alternativa 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Suiça Alternativa 26/27",
    slug: "suica-alt-26-27",
    category: "camisas",
    league: "selecoes/europa/suica",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/suica-alt-26-27/1.jpeg",
      "images/products/suica-alt-26-27/2.jpeg",
      "images/products/suica-alt-26-27/3.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "ucrania-26-27",
    name: "Camisola Ucrânia Principal 26/27 Copa do Mundo 2026 - Homem",
    namesItself: true,
    titleName: "Camisola Ucrânia Principal 26/27",
    slug: "ucrania-26-27",
    category: "camisas",
    league: "selecoes/europa/ucrania",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/ucrania-26-27/1.jpeg",
      "images/products/ucrania-26-27/2.jpeg",
      "images/products/ucrania-26-27/3.jpeg",
      "images/products/ucrania-26-27/4.jpeg",
      "images/products/ucrania-26-27/5.jpeg",
      "images/products/ucrania-26-27/6.jpeg",
      "images/products/ucrania-26-27/7.jpeg",
      "images/products/ucrania-26-27/8.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "uruguai-26-27",
    name: "Camisola Uruguai 2026/27 Copa do Mundo - Homem - Equipamento",
    namesItself: true,
    titleName: "Camisola Uruguai 2026/27",
    slug: "uruguai-26-27",
    category: "camisas",
    league: "selecoes/americas/uruguai",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/uruguai-26-27/1.jpeg",
      "images/products/uruguai-26-27/2.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "uruguai-alt-26-27",
    name: "Camisola Uruguai Alternativa 2026/27 Copa do Mundo - Azul Homem - Equipamento",
    namesItself: true,
    titleName: "Camisola Uruguai Alternativa 2026/27",
    slug: "uruguai-alt-26-27",
    category: "camisas",
    league: "selecoes/americas/uruguai",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/uruguai-alt-26-27/1.jpeg",
      "images/products/uruguai-alt-26-27/2.jpeg",
      "images/products/uruguai-alt-26-27/3.jpeg",
      "images/products/uruguai-alt-26-27/4.jpeg",
      "images/products/uruguai-alt-26-27/5.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "venezuela-25-26",
    name: "Camisola Venezuela I 25/26 - Homem",
    namesItself: true,
    titleName: "Camisola Venezuela I 25/26",
    slug: "venezuela-25-26",
    category: "camisas",
    league: "selecoes/americas/venezuela",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/venezuela-25-26/1.jpeg",
      "images/products/venezuela-25-26/2.jpeg",
      "images/products/venezuela-25-26/3.jpeg",
      "images/products/venezuela-25-26/4.jpeg",
      "images/products/venezuela-25-26/5.jpeg",
      "images/products/venezuela-25-26/6.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  {
    id: "venezuela-alt-26-27",
    name: "Camisola Venezuela Alternativa 2026/27 - Homem",
    namesItself: true,
    titleName: "Camisola Venezuela Alternativa 2026/27",
    slug: "venezuela-alt-26-27",
    category: "camisas",
    league: "selecoes/americas/venezuela",
    price: 30,
    personalisation: 5,
    images: [
      "images/products/venezuela-alt-26-27/1.jpeg",
      "images/products/venezuela-alt-26-27/2.jpeg",
      "images/products/venezuela-alt-26-27/3.jpeg",
      "images/products/venezuela-alt-26-27/4.jpeg",
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
  // <<< fim das camisas geradas
];

// The address a model is sold at: /lupas/oakley-juliet rather than
// produto.html?id=juliet-45. It says what the page is to both Google and to
// whoever it gets sent to on WhatsApp.
//
// Derived from the name rather than stored, so a new model needs nothing extra
// — but that also means renaming a model changes its URL, and the old one then
// needs a line in _redirects or the links already out there break. A product
// can write its own `slug` instead, which is how a name gets rewritten without
// the address moving under the links already out there.
function productSlug(product) {
  if (product.slug) return `${productSetup(product).slugPrefix}${product.slug}`;
  const name = product.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  // The prefix belongs to the category, not to every product. It is "oakley-"
  // for the lupas because that is what people search and what their addresses
  // already say; a shirt needs nothing in front of its own name.
  return `${productSetup(product).slugPrefix}${name}`;
}

// Carries the language of the page it is linked from, so a reader browsing in
// Spanish stays in Spanish when they open a model.
function productUrl(product, lang) {
  return localePath(`/${productSetup(product).path}/${productSlug(product)}`, lang);
}

// ---------------------------------------------------------------------------
// Reviews.
//
// A product carries them as `reviews: [...]`, alongside its colours:
//
//   reviews: [
//     { name: "Ana", rating: 5, date: "2026-08-14",
//       text: "Chegaram em tres dias e sao mesmo como nas fotos." },
//   ],
//
// **Only ever write a review a customer actually wrote.** Google penalises
// fabricated review markup, and unlike most SEO shortcuts this one is a lie a
// customer can catch. A model with no reviews shows no section and emits no
// rating fields - absent is correct, invented is not.
//
// First names only, matching the customer photos: a surname in a public page
// is personal data nobody agreed to publish. Keep the text in the language the
// customer wrote it in; a translated review stops being their words.
// ---------------------------------------------------------------------------

function productReviews(product) {
  return (product.reviews || []).filter(
    (r) => r && r.text && r.rating >= 1 && r.rating <= 5);
}

// Rounded to one decimal, the precision Google shows. Null when there is
// nothing to average, so callers have to handle "no reviews" explicitly
// rather than printing a zero.
function averageRating(product) {
  const reviews = productReviews(product);
  if (!reviews.length) return null;
  const sum = reviews.reduce((total, r) => total + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

function findProductBySlug(slug) {
  return PRODUCTS.find((p) => productSlug(p) === slug);
}

// Categories are read off the products themselves, so there is no second list
// to keep in step. To open a new one, give a product a category and add a
// "category.<id>" string to i18n.js — the tab appears on its own:
//
//   { id: "chapeu-25", name: "Chapéu", price: 25, category: "chapeus" }
//
const DEFAULT_CATEGORY = "lupas";

// What each category owns: where its products live, what their addresses are
// built from, the word its titles lead with, and whether the kit - the micro
// bag, the cloth and the case - goes with them.
//
// The lupas keep exactly what they have always had. Their addresses are
// indexed by Google, shared in messages and sitting in people's history, and
// the "oakley-" is inside them; nothing here may move them. A new category
// gets its own path instead of being filed under "lupas", which is the shop's
// word for sunglasses and means nothing for a shirt.
//
// tools/sitemap.ps1 writes the sitemap and the redirects from this same file
// but cannot read JavaScript, so it carries a copy of the two fields it needs.
// Change a path or a prefix here and change it there in the same commit.
// `variants` is what the choice under a product actually is. The machinery is
// the same either way - one list, one stock number each, one id in the cart
// key - but a lupa is chosen by colour and a shirt by size, so the dots become
// labelled pills and the title counts sizes instead of colours.
const CATEGORY_SETUP = {
  lupas: {
    path: "lupas", slugPrefix: "oakley-", titleWord: "Oakley", kit: true,
    variants: "colour", countWord: "seo.colours", groupLabel: "aria.colour",
    // What goes in the Product markup's brand field, which Google reads as a
    // statement about who made the thing. Left out where the shop is not in a
    // position to make that statement.
    brand: "Oakley",
  },
  camisas: {
    path: "camisas", slugPrefix: "", titleWord: "Camisa", kit: false,
    variants: "size", countWord: "seo.sizes", groupLabel: "aria.size",
    // Ordered in from the supplier, who ships in batches, so the shop sells
    // them two at a time. The rule counts every shirt in the order together:
    // two different shirts pass, one shirt beside a pair of lupas does not.
    minimum: 2,
    // Not held on a shelf: the supplier takes three to six days to dispatch
    // and seven to fifteen to arrive, so ten to twenty-one all told. Counted
    // in calendar days, which is how they count them - the lupas promise
    // working days and the two are never said in the same breath.
    deliveryDays: [10, 21],
    // Sub-navigation inside the tab, in the order the shop wants them read,
    // each with an address of its own under /camisas/liga/<id> so a league can
    // be found on Google and sent in a message.
    //
    // All eleven are shown whether or not they hold shirts yet - the shop's
    // call, so a customer sees what is coming - and an empty one says "em
    // breve" rather than showing an empty grid. An empty one is still kept out
    // of the sitemap and marked noindex: showing a person a page that is being
    // filled is a different thing from asking Google to file ten pages that
    // have nothing on them.
    //
    // A name written here is used as it stands unless i18n.js carries a
    // `league.<id>` string - the same fallback colorName() makes. Premier
    // League is Premier League in all three languages; Selecoes is not.
    groupPath: "liga",
    groups: [
      // The only one divided so far. A league without its own `groups` simply
      // draws no third row - see subGroups().
      {
        id: "selecoes", name: "Seleções",
        groups: [
          { id: "europa", name: "Europa", title: "Seleções da Europa" },
          { id: "americas", name: "Américas", title: "Seleções das Américas" },
          { id: "asia", name: "Ásia", title: "Seleções da Ásia" },
          { id: "africa", name: "África", title: "Seleções de África" },
        ],
      },
      { id: "brasileirao", name: "Brasileirão" },
      { id: "liga-portugal", name: "Liga Portugal" },
      { id: "premier-league", name: "Premier League" },
      { id: "la-liga", name: "La Liga" },
      { id: "ligue-1", name: "Ligue 1" },
      { id: "bundesliga", name: "Bundesliga" },
      { id: "serie-a", name: "Serie A" },
      { id: "mls", name: "MLS" },
      { id: "nba", name: "NBA" },
      // "Camisolas F1" as a pill made its own title read "Camisolas F1 —
      // camisolas de Fórmula 1". The address moved with the name, which is only
      // safe because this league is empty, noindex and in nobody's sitemap.
      { id: "formula-1", name: "Fórmula 1" },
    ],
  },
};

function productCategory(product) {
  return product.category || DEFAULT_CATEGORY;
}

// An unknown category behaves like the default rather than throwing: a typo in
// a product's category should show it in the wrong tab, not break the site.
function categorySetup(id) {
  return CATEGORY_SETUP[id] || CATEGORY_SETUP[DEFAULT_CATEGORY];
}

function productSetup(product) {
  return categorySetup(productCategory(product));
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

// The groups a category is browsed by — the leagues under Camisas. Every other
// category returns an empty list, which is how the rest of the code knows there
// is no second row of pills to draw.
function categoryGroups(id) {
  return categorySetup(id).groups || [];
}

// A group is found by a path, not an id, because a group can hold groups:
// "selecoes" is the league and "selecoes/americas" a continent inside it. One
// string rather than a field per level, so a fourth level would need no new
// machinery and a product still says where it belongs in one place.
// The national teams, spelled the way this shop spells them. Only the ones
// whose slug is not already the name: Portugal and Brasil need no entry.
// A team missing here still works — it shows as its own slug — so adding a
// country is adding shirts, and this is only about the accents.
const TEAM_NAMES = {
  "africa-do-sul": "África do Sul", "alemanha": "Alemanha", "arabia-saudita": "Arábia Saudita",
  "argelia": "Argélia", "argentina": "Argentina", "belgica": "Bélgica",
  "brasil": "Brasil", "cabo-verde": "Cabo Verde", "canada": "Canadá",
  "colombia": "Colômbia", "coreia": "Coreia do Sul", "costa-marfim": "Costa do Marfim",
  "croacia": "Croácia", "dinamarca": "Dinamarca", "egito": "Egito",
  "equador": "Equador", "escocia": "Escócia", "espanha": "Espanha",
  "estados-unidos": "Estados Unidos", "franca": "França", "gales": "País de Gales",
  "gana": "Gana", "holanda": "Holanda", "inglaterra": "Inglaterra",
  "italia": "Itália", "jamaica": "Jamaica", "japao": "Japão",
  "marrocos": "Marrocos", "mexico": "México", "nigeria": "Nigéria",
  "noruega": "Noruega", "peru": "Peru", "portugal": "Portugal",
  "romenia": "Roménia", "senegal": "Senegal", "suecia": "Suécia",
  "suica": "Suíça", "ucrania": "Ucrânia", "uruguai": "Uruguai",
  "venezuela": "Venezuela",
};

// The teams inside a continent, read off the shirts filed under it rather than
// listed by hand. A country appears the moment its first shirt does and goes
// when the last one goes, so the menu can never promise a page with nothing on
// it — which is the one thing a list written by hand always ends up doing.
function discoveredGroups(categoryId, path) {
  const prefix = `${path}/`;
  const found = [];
  PRODUCTS.forEach((p) => {
    if (productCategory(p) !== categoryId) return;
    const has = productGroup(p) || "";
    if (!has.startsWith(prefix)) return;
    const id = has.slice(prefix.length).split("/")[0];
    if (!id || found.some((g) => g.id === id)) return;
    found.push({ id, name: TEAM_NAMES[id] || id });
  });
  return found.sort((a, b) => a.name.localeCompare(b.name, "pt"));
}

// A group is found by a path, because a group can hold groups. The top levels
// are declared in CATEGORY_SETUP; the bottom one is discovered from the
// products, so walking has to consult both.
function findGroup(categoryId, path) {
  const parts = String(path || "").split("/").filter(Boolean);
  if (!parts.length) return null;
  let list = categoryGroups(categoryId);
  let found = null;
  const andados = [];
  for (const part of parts) {
    found = list.find((g) => g.id === part) || null;
    if (!found) return null;
    andados.push(part);
    list = found.groups || discoveredGroups(categoryId, andados.join("/"));
  }
  return found;
}

// The groups inside a group — the continents under Seleções, the teams inside a
// continent. Empty where there is nothing below, which is how the rows of pills
// and the hover menu know to stay away.
function subGroups(categoryId, path) {
  const group = findGroup(categoryId, path);
  if (!group) return [];
  return group.groups || discoveredGroups(categoryId, path);
}

// `tr` so the server can pass its own lookup; the browser falls back to t().
// Keyed by the group's own id and not by its path: the ids are unique across
// the whole tree, and a key that carried the path would have to be rewritten
// every time a group moved.
function groupName(group, tr) {
  const key = `league.${group.id}`;
  const text = tr ? tr(key) : t(key);
  return text === key ? group.name : text;
}

// The longer form, for a page title and a search result: the pill says "Europa"
// because the league above it already says Seleções, but a title standing on
// its own in Google says "Seleções da Europa". Written out rather than built,
// because Portuguese wants a different preposition for each one — da Europa,
// das Américas, de África - and that is not worth generating.
function groupTitleName(group, tr) {
  const key = `league.title.${group.id}`;
  const text = tr ? tr(key) : t(key);
  if (text !== key) return text;
  return group.title || groupName(group, tr);
}

function productGroup(product) {
  return product.league || null;
}

// A shirt filed under "selecoes/americas" counts for "selecoes" too, so the
// league shows everything inside it without having to list its own continents.
function productsInGroup(categoryId, path) {
  const want = String(path || "");
  return PRODUCTS.filter((p) => {
    if (productCategory(p) !== categoryId) return false;
    const has = productGroup(p) || "";
    return has === want || has.startsWith(`${want}/`);
  });
}

// /camisas/liga/premier-league, and the same under /en and /es. Three segments
// rather than /camisas/premier-league on purpose: two segments is the address a
// product already occupies, and a league that one day shares a slug with a
// shirt would quietly take its page.
function groupUrl(categoryId, groupId, lang) {
  const setup = categorySetup(categoryId);
  const prefix = lang && lang !== "pt" ? `/${lang}` : "";
  return `${prefix}/${setup.path}/${setup.groupPath}/${groupId}`;
}

// What is actually being sold under a league. Most of these are football, which
// is the fallback, but the NBA is basketball and F1 is neither - saying
// "camisolas de futebol" over the NBA is simply wrong, and it is the line
// Google shows.
function groupShirtsWord(group, tr) {
  const key = `league.shirts.${group.id}`;
  const text = tr(key);
  return text === key ? tr("league.shirts") : text;
}

// Leads with the league's own name, because that is what gets typed into
// Google — "premier league camisola" — and it sidesteps Portuguese wanting a
// different preposition for each one: da Premier League, do Brasileirão.
//
// Takes the path rather than the group, so the products can be counted: a
// continent and the league above it are two different pages with two different
// counts, and only the path says which one this is.
function groupPageTitle(categoryId, path, tr) {
  const group = findGroup(categoryId, path);
  if (!group) return "";
  const name = groupTitleName(group, tr);
  const shirts = groupShirtsWord(group, tr);
  const products = productsInGroup(categoryId, path);
  if (!products.length) {
    return `${name} — ${shirts}, ${tr("league.soon")} | RumorLupas`;
  }
  const cheapest = Math.min(...products.map((p) => p.price));
  return `${name} — ${shirts} ${tr("league.from")} ${formatPrice(cheapest)} | RumorLupas`;
}

function groupPageDescription(categoryId, path, tr) {
  const group = findGroup(categoryId, path);
  if (!group) return "";
  const name = groupTitleName(group, tr);
  const shirts = groupShirtsWord(group, tr);
  const products = productsInGroup(categoryId, path);
  if (!products.length) {
    return `${name} — ${shirts}, ${tr("league.soon")}. ${tr("league.soonTail")}`;
  }
  const cheapest = Math.min(...products.map((p) => p.price));
  return `${name} — ${shirts} ${tr("league.from")} ${formatPrice(cheapest)}. ${tr("league.descTail")}`;
}

// A product either has colour variants — each with its own photos — or a plain
// images list. These helpers hide that difference from the rest of the code.

function hasColors(product) {
  return Boolean(product.colors && product.colors.length);
}

// The colour a model opens on - its catalogue card, its own page, and the photo
// in a shared link's preview. The first one that can still be bought, or the
// first of all when none can.
//
// It used to be the first colour regardless. Once a model's lead colour sold
// out, its catalogue card said "Esgotado" and its page opened on a disabled
// button, while the colours still in stock sat one tap away where nobody looked.
// In September 2026 that was the Plate, the Dartboard and the Flak - six pairs
// for sale behind a sold-out sign.
//
// Only the opening choice. findColor() still falls back to the first colour,
// because that is what a cart saved before colours existed actually holds.
function defaultColorId(product) {
  if (!hasColors(product)) return null;
  const available = product.colors.find((c) => !isSoldOut(product, c.id));
  return (available || product.colors[0]).id;
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

// A variant with no photos of its own falls back to the product's, which is
// what a size does: five sizes of one shirt are the same shirt.
function productImages(product, colorId) {
  const color = findColor(product, colorId);
  const own = ((color && color.images) || product.images) || [];
  if (!own.length) return own;
  // Only where it is true. The kit shot is the micro bag, the cloth and the
  // case, and a shirt arrives with none of them.
  return productSetup(product).kit ? own.concat(KIT_IMAGE) : own;
}

// Smaller copies of every product photo, made by tools/resize.ps1 under
// images/sized/<width>/ with the same path below that. The paths above stay the
// originals, and the places that need a big picture - the Google markup and the
// Meta feed - keep reading them straight from productImages().
//
// The copies are for the places that draw a photo smaller than it was shot.
// On a computer the catalogue card is about 250 pixels; on a phone it is a
// single column, 345 at 375 wide, and a phone draws two or three real pixels
// for each of those. So the originals were never too big for every screen -
// only for most of them - which is why this is a srcset and not a swap.
function sizedImage(src, width) {
  return src.replace(/^images\/products\//, `images/sized/${width}/`);
}

// For a photo shown in a box `sizes` wide. The browser takes the smallest entry
// that still covers the box at the screen's density, so a laptop gets the 480,
// most phones the 800, and the densest screens the original.
//
// The original is labelled 1200w because nearly all of them are. A handful of
// Juliet reshoots are a little wider and get fetched slightly larger than they
// need; the Plate (900) and Plantaris (680) photos are narrower, and for those
// the resize tool copied the original rather than enlarge it. Either way no
// screen gets a softer picture than it did before this.
function imageSrcset(src) {
  return `${sizedImage(src, 480)} 480w, ${sizedImage(src, 800)} 800w, ${src} 1200w`;
}

// The 64-pixel thumbnails under the product gallery and the 56-pixel ones in
// the cart. 200 covers them at three device pixels per CSS pixel.
function thumbImage(src) {
  return sizedImage(src, 200);
}

// How wide the product page draws its main photo, measured on the live page:
// one column up to 760 wide, where it is the screen less its margins (347 at
// 375, 712 at 760), then two columns, growing from 333 to a ceiling of 512.
// Each figure sits a little above the real one - overshooting costs bytes,
// undershooting costs sharpness.
//
// It lives here because two places must say exactly the same thing: the <img>
// produto.js builds, and the preload the edge function puts in the head so the
// browser can start fetching that photo without waiting for the scripts. If
// the two disagree, the browser fetches the photo twice.
const GALLERY_SIZES =
  "(max-width: 760px) calc(100vw - 28px), " +
  "(max-width: 1119px) calc(50vw - 40px), " +
  "520px";

// The picture a shared link shows: 1200x630, cropped around the lupas by
// tools/resize.ps1 from each colour's head-on photo. The photos themselves are
// 3:4 portraits, and Facebook, Instagram and WhatsApp cut a link preview to a
// wide band through the middle - which on these photos can run through the
// lenses. Only the head-on photo, 1.jpeg, gets one; anything else falls back
// to the photo itself, which still previews, just cropped by the platform.
function ogImage(src) {
  return /\/1\.jpeg$/.test(src) ? src.replace(/^images\/products\//, "images/og/") : src;
}

// The product page's <title> and description, written here rather than in
// produto.js because two places need exactly the same words: the page, which
// Google reads after running it, and the edge function that writes the head
// for link previews, whose crawlers run nothing. `tr` looks a key up in the
// language being served - t() in the browser, the I18N table on the server.
//
// Nobody searches "Juliet"; they search "oakley juliet portugal". So the title
// leads with Oakley and carries the two things that decide a click: how much
// choice is left, and the price.
// What a product is called with its category's word in front: "Oakley Juliet"
// for the lupas, because that is what people type into Google. Three places
// need exactly this string - the page title, the Google markup and the link
// preview the edge function writes - so it is written once here.
//
// A product whose own name already says what the thing is sets `namesItself`
// and keeps the word off, or the page reads "Camisa Camisola Brasil Principal
// 26/27". It is a flag rather than a guess at the name, because guessing does
// not survive contact with Portuguese: camisola does not begin with camisa,
// they only share five letters, and any rule that catches this pair catches
// things it should not.
function titleLead(product) {
  const word = productSetup(product).titleWord;
  return word && !product.namesItself ? `${word} ${product.name}` : product.name;
}

// The name a search result leads with, which is not always the name a customer
// reads. Google shows about sixty characters of a title; the shirt's supplier
// name is seventy-six on its own, so the words that decide a click - how much
// choice is left, and the price - fell off the end where nobody saw them.
//
// A product carrying `titleName` lends it to the title and to the link preview
// only. The page heading, the catalogue card, the cart line and the Stripe row
// all keep the full name, because those are read by someone who has already
// arrived and wants to know exactly what they are buying. The Google markup
// keeps it too: that field is a statement about the product, not a headline.
function searchLead(product) {
  return product.titleName || titleLead(product);
}

// What the catalogue card says. The short name where there is one: a card is a
// thumbnail with a line under it, and the supplier's full name runs to five
// lines there, leaving the price and the sizes below the fold of the card. The
// whole name is still what the product page, the cart and the Stripe row show.
function cardName(product) {
  return product.titleName || product.name;
}

function productPageTitle(product, tr) {
  const colours = hasColors(product) ? product.colors : [];
  const left = colours.length
    ? colours.filter((c) => !isSoldOut(product, c.id))
    : (isSoldOut(product, null) ? [] : [null]);

  const lead = searchLead(product);

  if (colours.length && !left.length) {
    return `${lead} — ${tr("product.soldOut").toLowerCase()} | RumorLupas`;
  }
  const price = formatPrice(product.price);
  if (left.length > 1) {
    return `${lead} — ${left.length} ${tr(productSetup(product).countWord)}, ${price} | RumorLupas`;
  }
  return `${lead} — ${price} | RumorLupas`;
}

function productPageDescription(product, tr) {
  const key = `history.${product.id}`;
  const history = tr(key) === key ? tr("pp.historySoon") : tr(key);
  const full = `${product.name} — ${formatPrice(product.price)}. ${history}`;
  if (full.length <= 300) return full;

  // On the last whole word, not at the 300th character. This used to end the
  // Juliet with "colecionados da marca ate hoj", which only Google saw; it is
  // now also the line under a link shared by message.
  const cut = full.slice(0, 300);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 200 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:\s]+$/, "")}…`;
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

// A shirt can be printed with a name and a number. It rides in the cart key as
// a third part - "brasil-26-27|m|RONALDO~9" - so two shirts printed differently
// are two lines, the quantity still counts them, and nothing else about the
// cart had to learn a new shape.
//
// Cleaned on both sides from here: in the browser so the customer sees exactly
// what will be printed, and again in the checkout function, because a cart key
// lives in localStorage and can be typed by hand. What comes out is what the
// shirt can actually carry - capitals, no accents, a short name, two digits.
const PRINT_NAME_MAX = 12;

function cleanPrinting(name, number) {
  const printed = String(name || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Z ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, PRINT_NAME_MAX);
  // Leading zeros go before the cut, not after: "0010" is the number 10, and
  // trimming second would have turned it into 0.
  const digits = String(number || "").replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, "").slice(0, 2);
  return printed || digits ? { name: printed, number: digits } : null;
}

function printingFromKey(part) {
  if (!part) return null;
  const [name, number] = String(part).split("~");
  return cleanPrinting(name, number);
}

function printingToKey(printing) {
  return printing ? `${printing.name}~${printing.number}` : "";
}

function printingLabel(printing) {
  return printing ? [printing.name, printing.number].filter(Boolean).join(" ") : "";
}

// What the printing costs on top, and zero for anything that cannot be printed
// - which is every lupa.
function printingPrice(product) {
  return product && product.personalisation ? product.personalisation : 0;
}

// An order can leave in more than one parcel. The lupas are on the shelf and
// the shirts are ordered in when they sell, so a cart holding both arrives
// twice - the lupas first, the shirts weeks later.
//
// One entry per category in the cart, in the order they appear, so the cart
// and the checkout can say both. Averaging them would produce a date that is
// true of neither parcel, and a customer waiting three weeks for a pair of
// sunglasses that arrived on Tuesday is a complaint the shop earned.
//
// `days` of null means the category ships from the shelf and the shipping
// zone's own working-day estimate is the right answer for it.
function deliveryEstimates(categoryIds) {
  const seen = [];
  categoryIds.forEach((id) => {
    if (seen.some((entry) => entry.category === id)) return;
    seen.push({ category: id, days: categorySetup(id).deliveryDays || null });
  });
  return seen;
}

// How few of a category an order may carry. One, unless the category says so.
function categoryMinimum(id) {
  return categorySetup(id).minimum || 1;
}

// Given how many of each category are in a cart, the ones that are in it but
// not in enough. Asked by the drawer, so the customer is told before they try,
// and by the checkout function, which is what actually refuses.
function shortOfMinimum(counts) {
  return Object.keys(counts)
    .filter((id) => counts[id] > 0 && counts[id] < categoryMinimum(id))
    .map((id) => ({ category: id, have: counts[id], need: categoryMinimum(id) }));
}

// Exactly one left. Untracked colours return Infinity, so they never say this —
// the warning only ever appears when the number behind it is real.
function isLastOne(product, colorId) {
  return stockOf(product, colorId) === 1;
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
  const setup = productSetup(product);
  const sized = setup.variants === "size";

  const dots = product.colors
    .map((c) => {
      const on = c.id === selectedId;
      const out = isSoldOut(product, c.id);
      const label = colorName(c);
      // A size has no colour to show, so the dot becomes a pill with the size
      // written in it. Everything else about it - selected, sold out, the
      // reader's label - stays the same.
      if (sized) {
        return `<button type="button" class="swatch swatch--size${on ? " active" : ""}${out ? " out" : ""}" data-color="${c.id}" aria-pressed="${on}" title="${label}">${label}</button>`;
      }
      return `<button type="button" class="swatch${on ? " active" : ""}${out ? " out" : ""}" style="--swatch: ${swatchBackground(c)}" data-color="${c.id}" aria-pressed="${on}" title="${label}"><span class="sr-only">${label}</span></button>`;
    })
    .join("");

  return `<div class="swatches" role="group" aria-label="${t(setup.groupLabel)}">${dots}</div>`;
}

// The checkout function pulls the catalogue from here too, so stock is written
// in one place rather than kept in step across two files. productSlug goes with
// it so the Meta feed builds the same addresses the site sells at, rather than
// a second copy of the rule that could drift.
if (typeof module !== "undefined" && module.exports) {
  // The checkout function, the Meta feed and the link-preview edge function all
  // read the catalogue from here rather than keeping a copy.
  module.exports = {
    PRODUCTS, stockOf, isSoldOut, findColor, productCategory, productSlug,
    findProductBySlug, hasColors, defaultColorId, productImages, ogImage,
    formatPrice, titleLead, searchLead, cardName,
    productPageTitle, productPageDescription,
    sizedImage, imageSrcset, GALLERY_SIZES,
    categorySetup, productSetup, CATEGORY_SETUP,
    categoryGroups, findGroup, subGroups, discoveredGroups, groupName, groupTitleName,
    productGroup, productsInGroup,
    groupUrl, groupPageTitle, groupPageDescription,
    cleanPrinting, printingFromKey, printingToKey, printingLabel, printingPrice,
    categoryMinimum, shortOfMinimum, categoryLabel, deliveryEstimates,
  };
}
