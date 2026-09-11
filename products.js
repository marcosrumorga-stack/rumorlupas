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
        stock: 1,
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
];

// The address a model is sold at: /lupas/oakley-juliet rather than
// produto.html?id=juliet-45. It says what the page is to both Google and to
// whoever it gets sent to on WhatsApp.
//
// Derived from the name rather than stored, so a new model needs nothing extra
// — but that also means renaming a model changes its URL, and the old one then
// needs a line in _redirects or the links already out there break.
function productSlug(product) {
  const name = product.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `oakley-${name}`;
}

// Carries the language of the page it is linked from, so a reader browsing in
// Spanish stays in Spanish when they open a model.
function productUrl(product, lang) {
  return localePath(`/lupas/${productSlug(product)}`, lang);
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

function productImages(product, colorId) {
  const color = findColor(product, colorId);
  const own = (color ? color.images : product.images) || [];
  return own.length ? own.concat(KIT_IMAGE) : own;
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
function productPageTitle(product, tr) {
  const colours = hasColors(product) ? product.colors : [];
  const left = colours.length
    ? colours.filter((c) => !isSoldOut(product, c.id))
    : (isSoldOut(product, null) ? [] : [null]);

  if (colours.length && !left.length) {
    return `Oakley ${product.name} — ${tr("product.soldOut").toLowerCase()} | RumorLupas`;
  }
  const price = formatPrice(product.price);
  if (left.length > 1) {
    return `Oakley ${product.name} — ${left.length} ${tr("seo.colours")}, ${price} | RumorLupas`;
  }
  return `Oakley ${product.name} — ${price} | RumorLupas`;
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
// in one place rather than kept in step across two files. productSlug goes with
// it so the Meta feed builds the same addresses the site sells at, rather than
// a second copy of the rule that could drift.
if (typeof module !== "undefined" && module.exports) {
  // The checkout function, the Meta feed and the link-preview edge function all
  // read the catalogue from here rather than keeping a copy.
  module.exports = {
    PRODUCTS, stockOf, isSoldOut, findColor, productCategory, productSlug,
    findProductBySlug, hasColors, defaultColorId, productImages, ogImage,
    formatPrice, productPageTitle, productPageDescription,
    sizedImage, imageSrcset, GALLERY_SIZES,
  };
}
