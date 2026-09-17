const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Shipping rules. The threshold is repeated in cart.js so the drawer can show
// how far the customer still is from it — but this file is what actually
// charges, so change it here first and keep the two in step.
// Zones, rates and the free-shipping threshold live in shipping.js, read by
// the cart drawer too, so the price quoted and the price charged cannot drift.
const {
  FREE_SHIPPING_FROM, SHIPPING_COUNTRIES, zoneFor, shippingCentsFor,
} = require("../../shipping.js");

// Discount codes, from the same table the cart drawer read. The browser's
// answer was only a preview: the code is checked again here against the cart
// this function resolved, so a code typed straight into the request, or one
// that expired while the tab sat open, never reaches Stripe.
const { typedCode, checkCoupon } = require("./lib/coupons.js");

// Falls back to Portugal when the browser sends nothing - an older cart still
// open in someone's tab has no country field.
const DEFAULT_COUNTRY = "PT";

// Stock is written once, in products.js, and read from here so a sale means
// editing one file. Loaded defensively: if the catalogue can't be reached from
// this bundle, checkout carries on without the stock check rather than turning
// every order away. The browser blocks sold-out items either way.
let CATALOGUE = null;
try {
  CATALOGUE = require("../../products.js");
} catch (err) {
  console.warn("Stock check disabled — products.js not loadable:", err.message);
}

function stockFor(id, colorId) {
  if (!CATALOGUE) return Infinity;
  const product = CATALOGUE.PRODUCTS.find((p) => p.id === id);
  if (!product) return Infinity;
  return CATALOGUE.stockOf(product, colorId);
}

// Keep this in sync with products.js — prices are looked up here, never
// trusted from the client, so someone can't tamper with the cart to pay less.
// `colors` maps a colour id to the name that goes on the Stripe line item, so
// the order says which variant to ship.
const PRODUCTS = {
  // Two different models, so the order line has to say which one to pack.
  "eye-jacket-45":   { name: "Oakley Eye Jacket Redux", price: 49, colors: {
    preto:                      "Preto",
    "bege-piet-lente-dourada":  "Bege PIET · lente dourada",
    "bege-piet-lente-preta":    "Bege PIET · lente preta",
  } },
  "eye-jacket":      { name: "Oakley Eye Jacket",     price: 59, colors: {
    "preta-brain-dead-lente-azul": "Preta BRAIN DEAD · lente azul",
  } },
  "plantaris-50":    { name: "Oakley Plantaris",      price: 49, colors: { preto: "Preto" } },
  "juliet-45":       { name: "Oakley Juliet",         price: 49, colors: {
    "prata-lente-preta":       "Prata · lente preta",
    "prata-lente-espelhada":   "Prata · lente espelhada",
    "prata-lente-azul":        "Prata · lente azul",
    "prata-lente-roxa":        "Prata · lente roxa",
    "cinza-escura-espelhada":  "Cinza escura · lente espelhada",
    "cinza-escura-lente-azul": "Cinza escura · lente azul",
    "cinza-escura-lente-rosa": "Cinza escura · lente rosa",
    "dourada-lente-preta":     "Dourada · lente preta",
  } },
  "xx-45":           { name: "Oakley XX",             price: 49, colors: {
    "24k-lente-esmeralda": "24K · lente esmeralda",
  } },
  "plate-55":        { name: "Oakley Plate",          price: 59, colors: {
    // Same order as products.js: the first entry is what a pre-colour cart
    // falls back to, so the two lists must start with the same variant.
    "cinza-fosca-preta":      "Cinza fosca · lente preta",
    "cinza-fosca-espelhada":  "Cinza fosca · lente espelhada",
    "cinza-fosca-azul":       "Cinza fosca · lente azul",
    "cinza-fosca-amarela":    "Cinza fosca · lente amarela",
    "cinza-fosca-tanzanite":  "Cinza fosca · lente tanzanite",
    "cinza-escura-espelhada": "Cinza escura · lente espelhada",
    "preta-roxa":             "Preta · lente roxa",
  } },
  "gascan-50":       { name: "Oakley Gascan",         price: 49, colors: {
    "preta-lente-preta":                  "Preta · lente preta",
    "preta-lente-laranja":                "Preta · lente laranja",
    "preta-transparente-lente-preta":     "Preta transparente · lente preta",
    "preta-transparente-lente-espelhada": "Preta transparente · lente espelhada",
    "branca-transparente-lente-laranja":  "Branca transparente · lente laranja",
  } },
  // Out of the shop for now, so it has to leave this table too, not just
  // products.js: stockFor() returns Infinity for an id the catalogue no longer
  // has, so a model left here alone would sell without limit. Dropping it makes
  // the line unknown and the cart skips it. Bring both back together.
  // "splice-53":       { name: "Oakley Splice",         price: 53 },
  "monster-dog-47":  { name: "Oakley Monster Dog",    price: 49, colors: {
    "preta-lente-preta": "Preta · lente preta",
  } },
  "dartboard-50":    { name: "Oakley Dartboard",      price: 49, colors: {
    "preta-lente-preta":         "Preta · lente preta",
    "branca-lente-azul":         "Branca · lente azul",
    "branca-lente-transparente": "Branca · lente transparente",
    "castanha-lente-gold":       "Castanha · lente dourada",
  } },
  "flak-2xl-45":     { name: "Oakley Flak 2.0 XL",    price: 49, colors: {
    "preta-lente-espelhada":  "Preta · lente espelhada",
    // Armação, hastes, lente - the same wording as the shop, so the order says
    // which of the four to pack. All four frames are black.
    "azul-lente-azul":        "Preta, hastes azuis · lente azul",
    "vermelha-lente-laranja": "Preta, hastes vermelhas · lente laranja",
    "vermelha-lente-preta":   "Preta, hastes vermelhas · lente preta",
  } },
  "holbrook":        { name: "Oakley Holbrook",       price: 49, colors: {
    "preta-lente-preta":    "Preta · lente preta",
    "preta-lente-vermelha": "Preta · lente vermelha",
  } },
  "pitboss-53":      { name: "Oakley Pit Boss II",    price: 53, colors: {
    "preta-lente-preta": "Preta · lente preta",
  } },
  // The shirts are written in from tools/camisas-catalogo.ps1, from the same
  // records the catalogue is built from. This file still keeps its own price
  // list and still trusts nothing the browser sends; generating both from one
  // place only removes the risk that one of them is forgotten - which it was:
  // a hundred and seventy-four shirts reached the catalogue while this table
  // still knew one, and every one of them would have been refused at the till.
  // >>> camisas geradas por tools/camisas-catalogo.ps1 - nao editar a mao
  "africa-do-sul-26-27": { name: "Camisola África do Sul Principal 26/27 - Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "africa-do-sul-alt-26-27": { name: "Camisola África do Sul Alternativa 26/27 - Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "alemanha-1990": { name: "Camisola Alemanha I 1990 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "alemanha-1994": { name: "Camisola Alemanha I 1994 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "alemanha-2010-ii": { name: "Camisola Alemanha II 2010 - Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "alemanha-2014-i": { name: "Camisola Alemanha I 2014 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "alemanha-2014-ii": { name: "Camisola Alemanha II 2014 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "alemanha-26-27": { name: "Camisola Alemanha Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "alemanha-alt-26-27": { name: "Camisola Alemanha Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "alemanha-alt-mulher-26-27": { name: "Camisola Alemanha Alternativa 26/27 Copa do Mundo 2026 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "alemanha-especial-24-25": { name: "Camisola Alemanha Edição Especial 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "alemanha-remixed": { name: "Camisola Alemanha BRINGBACK REMIXED OVERSIZED 2026 - Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "arabia-saudita-26-27": { name: "Camisola Árabia Saudita Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argelia-26-27": { name: "Camisola Argélia Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argelia-adepto-26-27": { name: "Camisola Argélia Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-06-07": { name: "Camisola Argentina I 06/07 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-10-11": { name: "Camisola Argentina I 10/11 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-26-27": { name: "Camisola Argentina Principal 26/27 Copa do Mundo 2026 com Patch - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-78-79": { name: "Camisola Argentina I 78/79 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-86-87": { name: "Camisola Argentina I 86/87 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-93-94": { name: "Camisola Argentina I 93/94 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-94-95": { name: "Camisola Argentina I 94/95 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-96-97": { name: "Camisola Argentina I 96/97 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-98-99": { name: "Camisola Argentina I 98/99 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-adepto-26-27": { name: "Camisola Argentina Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-alt-86-87": { name: "Camisola Argentina II 86/87 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-alt-98-99": { name: "Camisola Argentina II 98/99 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-alt-copa-america-2024-jogador": { name: "Camisola Argentina II Copa América 2024 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-alt-cropped-26-27": { name: "Camisola Argentina II 26/27 Copa do Mundo 2026 - TOP CROPPED Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-alt-jogador-26-27": { name: "Camisola Argentina Alternativa 2026/27 Copa do Mundo (Versão Jogador) Homem - Equipamento", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-alt-preta-26-27": { name: "Camisola Argentina Alternativa 2026/27 Copa do Mundo Preta Homem - Equipamento", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-alt-preta-jogador-2024": { name: "Camisola Argentina Edição Especial Limitada Black II 2024 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-comemorativa-2001": { name: "Camisola Argentina Edição Especial I 2001 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-coronados-jogador-26-27": { name: "Camisola Argentina Edição Especial Coronados de Gloria 26/27 - Jogador", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-cropped-26-27": { name: "Camisola Argentina I 26/27 Copa do Mundo 2026 - TOP CROPPED Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-icons-branca-2026": { name: "Camisola Argentina Icons 2026 Branca - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-pre-jogo-26-27": { name: "Camisola Argentina Pré - Jogo 2026/27 - Copa do Mundo 2026", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-remixed-2026": { name: "Camisola Argentina BRINGBACK REMIXED OVERSIZED 2026 - Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "argentina-thrasher-2026": { name: "Camisola Argentina Edição Especial Thrasher 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "athletico-pr-26-27": { name: "Camisola Athletico Paranaense Principal 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "atletico-mineiro-25-26": { name: "Camisola Atletico Mineiro I 25/26", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "atletico-mineiro-26-27": { name: "Camisola Atletico Mineiro I 26/27 sem Publicidade - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "atletico-mineiro-all-black-25-26": { name: "Camisola Atlético Mineiro All Black 2025/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "atletico-mineiro-alt-25-26": { name: "Camisola Atletico Mineiro II 25/26", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "atletico-mineiro-alt-mulher-25-26": { name: "Camisola Atletico Mineiro II 25/26 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "atletico-mineiro-alt-mulher-26-27": { name: "Camisola Atletico Mineiro II 26/27 sem Publicidade - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "atletico-mineiro-alt-publicidade-26-27": { name: "Camisola Atletico Mineiro II 26/27 com Publicidade - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "atletico-mineiro-iii-24-25": { name: "Camisola Atletico Mineiro III 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "atletico-mineiro-iii-25-26": { name: "Camisola Atletico Mineiro III 25/26", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "atletico-mineiro-mulher-26-27": { name: "Camisola Atletico Mineiro Principal 26/27 Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "atletico-mineiro-polo": { name: "Camisola Polo Atletico Mineiro", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "atletico-mineiro-publicidade-26-27": { name: "Camisola Atletico Mineiro I 26/27 com Publicidade - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "atletico-mineiro-treino-26-27": { name: "Camisola Atletico Mineiro Treino 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "atletico-mineiro-treino-i-26-27": { name: "Camisola Atletico Mineiro Treino I 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "bahia-26-27": { name: "Camisola Bahia Principal 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "bahia-alt-26-27": { name: "Camisola Bahia Alternativa 26/27 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "bahia-alt-jogador-26-27": { name: "Camisola Bahia Alternativa 26/27 (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "bahia-alt-mulher-26-27": { name: "Camisola Bahia Alternativa 26/27 Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "bahia-especial-branca-26-27": { name: "Camisola Bahia Edição Especial Branco 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "bahia-jogador-26-27": { name: "Camisola Bahia Principal 26/27 - Versão Jogador", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "bahia-retro": { name: "Camisola Bahia (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "bahia-treino-26-27": { name: "Camisola Bahia Treino 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "belgica-26-27": { name: "Camisola Bélgica Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "belgica-adepto-26-27": { name: "Camisola Bélgica Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "belgica-alt-26-27": { name: "Camisola Bélgica Alternativa - Copa do Mundo 2026 - Homem - Equipamento Futebol", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "belgica-mulher-26-27": { name: "Camisola Bélgica Principal 26/27 - Copa do Mundo 2026 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "botafogo-24-25": { name: "Camisola Botafogo I 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "botafogo-25-26": { name: "Camisola Botafogo I 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "botafogo-26-27": { name: "Camisola Botafogo Principal 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "botafogo-alt-24-25": { name: "Camisola Botafogo II 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "botafogo-alt-25-26": { name: "Camisola Botafogo II 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "botafogo-branca-26-27": { name: "Camisola Botafogo Branca 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "botafogo-iii-25-26": { name: "Camisola Botafogo III 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-04-06": { name: "Camisola Brasil I 04/06 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-1970": { name: "Camisola Brasil I 70 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-1988": { name: "Camisola Brasil I 1988 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-1994": { name: "Camisola Brasil I 94 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-1994-ii": { name: "Camisola Brasil 1994 - Homem - Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-1998": { name: "Camisola Brasil I 98 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-2002": { name: "Camisola Brasil I 2002 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-2006": { name: "Camisola Brasil I 2006 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-2014": { name: "Camisola Brasil I 2014 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-2018": { name: "Camisola Brasil I 2018 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-2022": { name: "Camisola Brasil I Copa do Mundo 2022 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-26-27": { name: "Camisola Brasil Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-91-93": { name: "Camisola Brasil I 91/93 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-adepto-26-27": { name: "Camisola Brasil Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-alt-04-06": { name: "Camisola Brasil II 04/06 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-alt-1998": { name: "Camisola Brasil II 98 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-alt-2002": { name: "Camisola Brasil II 2002 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-alt-2006": { name: "Camisola Brasil II 2006 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-alt-2010": { name: "Camisola Brasil II 2010 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-alt-2018": { name: "Camisola Brasil II 2018 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-alt-2022": { name: "Camisola Brasil II Copa do Mundo 2022 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-alt-26-27": { name: "Camisola Brasil Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-alt-cropped-26-27": { name: "Camisola Mulher Brasil II 26/27 Copa do Mundo 2026 - TOP CROPPED", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-alt-jogador-26-27": { name: "Camisola Brasil Alternativa 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-alt-manga-longa-26": { name: "Camisola Brasil Alternativa Manga Longa - Copa do Mundo 2026 - Homem", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-alt-mulher-26-27": { name: "Camisola Mulher Brasil Alternativa 26/27 Copa do Mundo 2026", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-alt-vermelha-26-27": { name: "Camisola Brasil Alternativa Vermelha 26/27 Copa do Mundo 2026 - Homem (Edição Especial)", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-aquecimento-26": { name: "Camisola Brasil Aquecimento 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-arara-26": { name: "Camisola Brasil 2026 Edição Especial Arara - Homem - Amarela", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-casual-24-25": { name: "Camisola Nk Casual Brasil I 24/25", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-copa-america-2024": { name: "Camisola Brasil I Copa América 2024 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-cristo-redentor-jogador-2024": { name: "Camisola Brasil Especial Edition Jesus Cristo Redentor 2024 Homem (Versão Jogador) - Black", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-cristo-redentor-preta": { name: "Camisola Brasil Jesus Especial Edition - Black", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-cropped-26-27": { name: "Camisola Mulher Brasil 26/27 Copa do Mundo 2026 - TOP CROPPED", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-especial-26": { name: "Camisola Brasil Edição Especial - Copa do Mundo 2026", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-feminina-2023": { name: "Camisola Brasil 2023 - Retro - Seleção Feminina", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-feminina-25-26": { name: "Camisola Brasil I Seleção Feminina 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-feminina-alt-jogador": { name: "Camisola Brasil II Seleção Feminina - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-guarda-redes-2002": { name: "Camisola Brasil Portero/guarda Redes I 2002 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-guarda-redes-26-27": { name: "Camisola Brasil Guarda Redes 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-guarda-redes-98-99": { name: "Camisola Brasil Portero/guarda Redes I 98/99 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-iii-2019": { name: "Camisola Brasil III 2019 Homem", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-mulher-26-27": { name: "Camisola Brasil Principal 26/27 Copa do Mundo 2026 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-neymar-26-27": { name: "Camisola Brasil 2026/27 - Copa do Mundo (com Personalização - Neymar 10)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-nordeste": { name: "Camisola Brasil Special Edition Nordeste", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-originals-amarela": { name: "Camisola Brasil Originals Edição Especial Amarela - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-refletiva": { name: "Camisola Brasil Especial Edition Refletiva", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-retro": { name: "Camisola Brasil Retro - Homem", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-total-90": { name: "Camisola Brasil Total 90 Edição Especial", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-travis-scott-total-90": { name: "Camisola Brasil x Travis Scott Cactus Jack Total 90 2026 - Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "brasil-treino-26-27": { name: "Camisola Brasil 2026/27 - Treino - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "cabo-verde-24-25-ii": { name: "Camisola Cabo Verde II 24/25", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "cabo-verde-26-27": { name: "Camisola Cabo Verde Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "cabo-verde-alt-26-27": { name: "Camisola Cabo Verde Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "cabo-verde-gr-26-27": { name: "Camisola Cabo Verde 2026/27 - Guarda - Redes - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "cabo-verde-gr-laranja-26-27": { name: "Camisola Cabo Verde 2026/27 - Guarda - Redes Laranja - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "cabo-verde-gr-rosa-26-27": { name: "Camisola Cabo Verde 2026/27 - Guarda - Redes Rosa - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "cabo-verde-iii-26-27": { name: "Camisola Cabo Verde III 2026/27 Copa do Mundo 2026", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "canada-26-27": { name: "Camisola Canadá 26/27", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "ceara-alt-25-26": { name: "Camisola Ceara II 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "ceara-alt-26-27": { name: "Camisola Ceara II 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "chapecoense-26-27": { name: "Camisola Chapecoense Principal 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "colombia-26-27": { name: "Camisola Colômbia Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "colombia-adepto-26-27": { name: "Camisola Colômbia Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "colombia-alt-26-27": { name: "Camisola Colômbia Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "colombia-especial-24-25": { name: "Camisola Colômbia Edição Especial 24/25 (Homem)", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "colombia-mulher-26-27": { name: "Camisola Colômbia Principal 26/27 - Copa do Mundo 2026 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "colombia-preta-24-25": { name: "Camisola Colômbia Preta 24/25 (Homem)", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "coreia-2024": { name: "Camisola Coreia I 2024 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-2012": { name: "Camisola Corinthians I 2012 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-25-26": { name: "Camisola Corinthians I 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-26-27": { name: "Camisola Corinthians I 26/27 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-93-94": { name: "Camisola Corinthians I 93/94 - Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-alt-11-12": { name: "Camisola Corinthians II 11/12 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-alt-1999": { name: "Camisola Corinthians II 1999 - Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-alt-2009": { name: "Camisola Corinthians II 2009 - Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-alt-2012": { name: "Camisola Corinthians II 2012 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-alt-25-26": { name: "Camisola Corinthians II 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-alt-26-27": { name: "Camisola Corinthians II 26/27 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-alt-90-91": { name: "Camisola Corinthians II 90/91 - Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-alt-cropped-26-27": { name: "Camisola Corinthians II 26/27 - TOP CROPPED Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-alt-jogador-25-26": { name: "Camisola Corinthians II 25/26 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-alt-jogador-26-27": { name: "Camisola Corinthians Alternativa 2026/27 - Jogador", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-alt-mulher-26-27": { name: "Camisola Corinthians II 26/27 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-alt-sem-patrocinio-24-25": { name: "Camisola Corinthians sem Patrocinador II 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-ayrton-senna": { name: "Camisola Corinthians Ayrton Senna Edição Especial (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-comemorativa": { name: "Camisola Corinthians I Edição Especial Comemorativa Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-cropped-26-27": { name: "Camisola Corinthians I 26/27 - TOP CROPPED Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-guarda-redes-26-27": { name: "Camisola Corinthians Guarda Redes I 26/27 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-guarda-redes-ii-26-27": { name: "Camisola Corinthians Guarda Redes II 26/27 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-iii-11-12": { name: "Camisola Corinthians III 11/12 (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-iii-25-26": { name: "Camisola Corinthians III 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-iii-jogador-25-26": { name: "Camisola Corinthians III 25/26 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-iii-mulher-25-26": { name: "Camisola Corinthians III 25/26 Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-japao-22-23": { name: "Camisola Corinthians Edição Especial Japão 22/23 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-jogador-25-26": { name: "Camisola Corinthians I 25/26 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-jogador-26-27": { name: "Camisola Corinthians I 26/27 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-mulher-26-27": { name: "Camisola Corinthians I 26/27 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-mundial-2000": { name: "Camisola Corinthians I Mundial 2000 - Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-sem-patrocinio-24-25": { name: "Camisola Corinthians sem Patrocinador I 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-treino-25-26": { name: "Camisola Corinthians Treino 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "corinthians-treino-26-27": { name: "Camisola Corinthians Treino 26/27 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "coritiba-26-27": { name: "Camisola Coritiba 2026/27 Home - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "costa-marfim-ii-26": { name: "Camisola Costa do Marfim II 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "croacia-1998-ii": { name: "Camisola Croácia II 1998 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "croacia-26-27": { name: "Camisola Croácia 2026/27 Copa do Mundo - Equipamento", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "croacia-euro-24-25": { name: "Camisola Croácia I Euro Copa 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "dinamarca-26": { name: "Camisola Dinamarca I 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "dinamarca-86-87": { name: "Camisola Dinamarca I 86/87 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "egito-alt-26": { name: "Camisola Egito Alternativa - Copa do Mundo - 2026 Homem - Equipamento", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "equador-26-27": { name: "Camisola Equador Principal 26/27 - Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "equador-alt-26-27": { name: "Camisola Equador Alternativa 26/27 - Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "equador-especial-26-27": { name: "Camisola Equador Edição Especial 26/27 - Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "equador-gr-26-27": { name: "Camisola Equador Guarda Redes 26/27 - Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "equador-iii-26-27": { name: "Camisola Equador Alternativa III 26/27 - Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "escocia-26-27": { name: "Camisola Escócia Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "escocia-alt-26-27": { name: "Camisola Escócia Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-26-27": { name: "Camisola Espanha Principal 26/27 Duas Estrelas e Patch - Copa do Mundo 2026 (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-alt-26-27": { name: "Camisola Espanha Alternativa 26/27 Copa do Mundo 2026 Duas Estrelas - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-alt-manga-longa-26-27": { name: "Camisola Espanha II 26/27 Copa do Mundo Manga Longa - Versão Jogador", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-alt-ml-estrelas-26-27": { name: "Camisola Espanha Alternativa 26/27 Copa do Mundo 2026 Duas Estrelas Manga Longa - Homem", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-alt-mulher-26-27": { name: "Camisola Espanha Alternativa 26/27 Duas Estrelas - Copa do Mundo 2026 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-campeao-26": { name: "Camisola Espanha Edição Especial Campeão do Mundo 2026 - Homem V1", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-cropped-26-27": { name: "Camisola Espanha I 26/27 - Copa do Mundo 2026 - TOP CROPPED Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-cropped-ii-26-27": { name: "Camisola Espanha II 26/27 - Copa do Mundo 2026 - TOP CROPPED Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-especial-26": { name: "Camisola Espanha Edição Especial Copa do Mundo 2026 - Homem Vermelha", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-especial-azul-26": { name: "Camisola Espanha Edição Especial Copa do Mundo 2026 - Homem Azul", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-especial-mulher-26": { name: "Camisola Espanha Edição Especial Copa do Mundo 2026 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-especial-preta-26": { name: "Camisola Espanha Edição Especial Copa do Mundo 2026 - Homem Preto", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-gr-26-27": { name: "Camisola Espanha Guarda Redes 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-mulher-26-27": { name: "Camisola Espanha Principal 26/27 Duas Estrelas - Copa do Mundo 2026 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-travis-scott": { name: "Camisola Espanha x Travis Scott Cactus Jack Total 90 2026 - Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "espanha-treino-sm": { name: "Conjunto de Treino sem Mangas Espanha Copa do Mundo 2026", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "estados-unidos-26-27": { name: "Camisola Estados Unidos Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "estados-unidos-alt-26-27": { name: "Camisola Estados Unidos Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "estados-unidos-travis-scott": { name: "Camisola Estados Unidos x Travis Scott Cactus Jack Total 90 2026 - Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-1995": { name: "Camisola Flamengo Home 1995 Retrô - Equipamento Principal Vintage Masculino", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-1995-azul": { name: "Camisola Flamengo 1995 Azul - Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-2000": { name: "Camisola Flamengo 2000 Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-2009": { name: "Camisola Flamengo 2009 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-2019": { name: "Camisola Flamengo 2019 - Homem Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-24-25": { name: "Camisola Flamengo I 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-25-26": { name: "Camisola Flamengo I 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-26-27": { name: "Camisola Flamengo I 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-alt-2010": { name: "Camisola Flamengo II 2010 - Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-alt-24-25": { name: "Camisola Flamengo II 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-alt-25-26": { name: "Camisola Flamengo II 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-alt-26-27": { name: "Camisola Flamengo II 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-alt-jogador-25-26": { name: "Camisola Flamengo II 25/26 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-alt-jogador-26-27": { name: "Camisola Flamengo II 26/27 - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-alt-manga-longa-26-27": { name: "Camisola Flamengo II 26/27 - Homem Manga Longa", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-alt-mulher-25-26": { name: "Camisola Flamengo II 25/26 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-alt-mulher-26-27": { name: "Camisola Flamengo II 26/27 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-alt-publicidade-25-26": { name: "Camisola Flamengo II 25/26 com Publicidade - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-alt-sem-mangas-26-27": { name: "Camisola Flamengo Alternativa sem Mangas 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-amarela-26-27": { name: "Camisola Flamengo 2026/27 Amarela - Especial Copa do Mundo", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-amarela-mulher-26-27": { name: "Camisola Flamengo 26/27 Amarela - Mulher Especial Copa do Mundo", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-balmain-24-25": { name: "Camisola Flamengo Edição Especial Limitada Balmain Paris Black 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-conjunto-treino-25-26": { name: "Camisola sem Mangas Flamengo Conjunto Treino I 25/26", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-cropped-26-27": { name: "Camisola Flamengo I 26/27 - TOP CROPPED Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-diamante-negro-25-26": { name: "Camisola Flamengo Marrom 25/26 Diamante Negro - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-especial-24-25": { name: "Camisola Flamengo Edição Especial 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-guarda-redes-alt-26-27": { name: "Camisola Flamengo Guarda - Redes Alternativa 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-iii-1995": { name: "Camisola Flamengo III 1995 - Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-iii-25-26": { name: "Camisola Flamengo III 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-iii-26-27": { name: "Camisola Flamengo III 26/27 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-iii-cropped-26-27": { name: "Camisola Flamengo III 26/27 - TOP CROPPED Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-iii-jogador-25-26": { name: "Camisola Flamengo III 25/26 (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-iii-mulher-25-26": { name: "Camisola Flamengo III 25/26 Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-iii-mulher-26-27": { name: "Camisola Flamengo III 26/27 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-iii-mulher-ii-25-26": { name: "Camisola Flamengo III 25/26 Mulher 2", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-iii-sem-mangas-26-27": { name: "Camisola Flamengo III 26/27 Homem sem Mangas", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-jogador-24-25": { name: "Camisola Flamengo I 24/25 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-jogador-25-26": { name: "Camisola Flamengo I 25/26 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-jogador-26-27": { name: "Camisola Flamengo 2026/27 - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-jogador-manga-longa-25-26": { name: "Camisola Flamengo I 25/26 Homem Jogador (Manga Longa)", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-lifestyle-25-26": { name: "Camisola Flamengo Lifestyle Adidas 25/26", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-lifestyle-vermelha-25-26": { name: "Camisola Flamengo Lifestyle Adidas 25/26 - Vermelha", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-manga-longa": { name: "Camisola Flamengo I Homem (Manga Longa)", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-manga-longa-26-27": { name: "Camisola Flamengo 2026/27 - Manga Longa - Homem", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-mulher-24-25": { name: "Camisola Flamengo I 24/25 Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-mulher-25-26": { name: "Camisola Flamengo I 25/26 Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-mulher-26-27": { name: "Camisola Flamengo I 26/27 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-originals-26-27": { name: "Camisola Flamengo Adidas Originals 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-patrocinadores-24-25": { name: "Camisola Flamengo I Todos os Patrocinadores 24/25 Homem", price: 55, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-patrocinadores-ii-24-25": { name: "Camisola Flamengo II Todos os Patrocinadores 24/25 Homem", price: 55, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-pre-jogo-26-27": { name: "Camisola Flamengo Pré - Jogo 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-regata-25-26": { name: "Camisola Regata Flamengo I 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-retro": { name: "Camisola Flamengo Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-retro-24-25": { name: "Camisola Flamengo Retro 24/25 Homem", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-retro-ii": { name: "Camisola Flamengo Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-sem-mangas-26-27": { name: "Camisola Flamengo I 26/27 - Homem sem Mangas", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-sem-patrocinio-manga-longa-26-27": { name: "Camisola Flamengo 26/27 sem Patrocinio - Manga Longa - Homem", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-treino-25-26": { name: "Camisola Flamengo 25/26 Homem - Treino I", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-treino-bege-26-27": { name: "Camisola de Treino Flamengo Bege 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-treino-bege-cava-26-27": { name: "Camisola de Treino Flamengo Bege 26/27 - Homem - Manga Cava", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-treino-castanha-26-27": { name: "Camisola de Treino Flamengo Marrom 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-treino-castanha-cava-26-27": { name: "Camisola de Treino Flamengo Marrom 26/27 - Homem - Manga Cava", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-treino-ii-25-26": { name: "Camisola Flamengo 25/26 Homem - Treino II", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-treino-mulher-24-25": { name: "Camisola Flamengo Treino 24/25 Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-zico-25-26": { name: "Camisola Flamengo Zico 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "flamengo-zico-amarela-26-27": { name: "Camisola Flamengo 26/27 Amarela - Versão Zico Especial Copa do Mundo", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "fluminense-2012": { name: "Camisola Fluminense I 2012 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "fluminense-25-26": { name: "Camisola Fluminense I 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "fluminense-26-27": { name: "Camisola Fluminense I 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "fluminense-alt-25-26": { name: "Camisola Fluminense II 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "fluminense-alt-ii-mulher-26-27": { name: "Camisola Fluminense Alternativa 26/27 Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "fluminense-alt-mulher-26-27": { name: "Camisola Fluminense II 26/27 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "fluminense-branca-26-27": { name: "Camisola Fluminense Branca 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "fluminense-iii-11-12": { name: "Camisola Fluminense III 11/12 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "fluminense-iii-26-27": { name: "Camisola Fluminense III 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "fluminense-treino-24-25": { name: "Camisola Fluminense Treino 2024/25 Verde Homem - Equipamento", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "fortaleza-25-26": { name: "Camisola Fortaleza I 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "franca-2006-ii": { name: "Camisola França II 2006 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "franca-2018": { name: "Camisola França I 2018 - Homem Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "franca-2022-ii": { name: "Camisola França II 2022 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "franca-26-27": { name: "Camisola França Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "franca-82-83": { name: "Camisola França I 82/83 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "franca-98-99": { name: "Camisola França I 98/99 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "franca-alt-26-27": { name: "Camisola França Alternativa 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "franca-alt-adepto-26-27": { name: "Camisola França Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "franca-alt-mulher-26-27": { name: "Camisola França Alternativa 26/27 Copa do Mundo 2026 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "franca-euro-2024": { name: "Camisola França I Euro 2024 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "franca-ml-euro-2024": { name: "Camisola França I Manga Longa Euro 2024 Homem (Versão Jogador)", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "franca-travis-scott": { name: "Camisola França x Travis Scott Cactus Jack Total 90 2026 - Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gales-26-27": { name: "Camisola País de Gales Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gales-90-92": { name: "Camisola País de Gales I 90/92 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gales-alt-26-27": { name: "Camisola País de Gales Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gana-26": { name: "Camisola Gana - Copa do Mundo 2026 - Homem - Equipamento Futebol", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gremio-25-26": { name: "Camisola Gremio I 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gremio-26-27": { name: "Camisola Gremio I 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gremio-alt-2000": { name: "Camisola Grêmio II 2000 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gremio-alt-25-26": { name: "Camisola Gremio II 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gremio-alt-26-27": { name: "Camisola Gremio II 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gremio-alt-jogador-25-26": { name: "Camisola Grêmio II 25/26 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gremio-alt-mulher-26-27": { name: "Camisola Gremio Alternativa 26/27 Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gremio-guarda-redes-26-27": { name: "Camisola Gremio 26/27 - Guarda - Redes - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gremio-iii-25-26": { name: "Camisola Gremio III 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gremio-iii-26-27": { name: "Camisola Gremio III 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gremio-jogador-25-26": { name: "Camisola Grêmio I 25/26 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gremio-jogador-26-27": { name: "Camisola Gremio I 26/27 - Homem Versão Jogador", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gremio-manga-longa-26-27": { name: "Camisola Gremio I 26/27 - Homem Manga Longa", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gremio-mulher-26-27": { name: "Camisola Gremio Principal 26/27 Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "gremio-retro": { name: "Camisola Grêmio I Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "holanda-12-13-ii": { name: "Camisola Holanda II 12/13 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "holanda-26-27": { name: "Camisola Holanda Dri - Fit Nike 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "holanda-88-89-ii": { name: "Camisola Holanda II 88/89 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "holanda-95-96": { name: "Camisola Holanda I 95/96 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "holanda-alt-26-27": { name: "Camisola Holanda Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "holanda-jogador-26-27": { name: "Camisola Holanda Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "holanda-principal-26-27": { name: "Camisola Holanda Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "holanda-travis-scott": { name: "Camisola Holanda x Travis Scott Cactus Jack Total 90 2026 - Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "inglaterra-1996": { name: "Camisola Inglaterra I 1996 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "inglaterra-2002": { name: "Camisola Inglaterra 1 2002 - Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "inglaterra-2004": { name: "Camisola Inglaterra I 2004 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "inglaterra-26-27": { name: "Camisola Inglaterra Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "inglaterra-94-95": { name: "Camisola Retrô Inglaterra 1994/95 - Homem", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "inglaterra-adepto-26-27": { name: "Camisola Inglaterra Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "inglaterra-alt-26-27": { name: "Camisola Inglaterra Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "inglaterra-especial-azul-26-27": { name: "Camisola Inglaterra Edição Espeical Azul 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "inglaterra-mulher-26-27": { name: "Camisola Inglaterra Copa do Mundo 2026 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "inglaterra-palace-26-27": { name: "Camisola Inglaterra x Palace Skateboards Three Lions Edição Especial 26/27 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "inglaterra-palace-ii-26-27": { name: "Camisola Inglaterra x Palace Skateboards Three Lions Edição Especial II 26/27 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "inglaterra-palace-iii-26-27": { name: "Camisola Inglaterra Edição Especial Palace - Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "inglaterra-travis-scott": { name: "Camisola Inglaterra x Travis Scott Cactus Jack Total 90 2026 - Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "internacional-2006-manga-longa": { name: "Camisola Internacional Alternativa 2006 Manga Longa - Homem - Equipamento", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "internacional-26-27": { name: "Camisola Internacional Principal 26/27 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "internacional-alt-26-27": { name: "Camisola Internacional 2026/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "internacional-ii-26-27": { name: "Camisola Internacional Principal 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "internacional-iii-26-27": { name: "Camisola Internacional III 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "internacional-mulher-26-27": { name: "Camisola Internacional Principal 26/27 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "italia-1994": { name: "Camisola Itália I Mundial 94 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "italia-1994-ii": { name: "Camisola Itália II Mundial 94 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "italia-2006-ii": { name: "Camisola Itália II Mundial 2006 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "italia-26-27": { name: "Camisola Itália Principal 26/27 - Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "italia-alt-26-27": { name: "Camisola Itália Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "italia-ii-branca-retro": { name: "Camisola Itália II Branca Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "italia-mulher-26-27": { name: "Camisola Itália 2026/27 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "italia-versace": { name: "Camisola Itália x Versace Edição Especial Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "italia-versace-azul": { name: "Camisola Itália x Versace Azul Edição Especial", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "jamaica-26-27": { name: "Camisola Jamaica Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "jamaica-alt-26-27": { name: "Camisola Jamaica Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-1998": { name: "Camisola Japão 1998 (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-24-25": { name: "Camisola Japão II 24/25 (Homem)", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-26-27": { name: "Camisola Japão Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-alt-26-27": { name: "Camisola Japão Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-alt-jogador-26-27": { name: "Camisola Japão Alternativa 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-alt-mulher-26-27": { name: "Camisola Japão Alternativa 26/27 Copa do Mundo 2026 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-dbz": { name: "Camisola Japão Edição Expicial x DBZ - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-dragon-ball-26-27": { name: "Camisola Japão Edição Especial Dragon Ball 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-especial-24-25": { name: "Camisola Japão 2024/25 - Edição Especial - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-especial-26": { name: "Camisola Japão 2026 - Edição Especial - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-especial-branca-26": { name: "Camisola Japão 2O26 - Edição Especial Branca - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-especial-ii": { name: "Camisola Japão Edição Especial Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-especial-vi-24-25": { name: "Camisola Japão Edição Especial VI 24/25 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-goku-24-25": { name: "Camisola Japão Edição Goku 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-goku-25-26": { name: "Camisola Japão Edição Especial Goku 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-itachi-2025": { name: "Camisola Japão Edição Especial Itachi 2025 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-itachi-25-26": { name: "Camisola Japão Edição Especial Itachi 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-itachi-sasuke": { name: "Camisola Japão Edição Especial Itachi x Sasuke - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-limitada-24-25": { name: "Camisola Japão Edição Especial I 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-limitada-ii-24-25": { name: "Camisola Japão Edição Especial Limitada II 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-luffy-24-25": { name: "Camisola Japão Edição Especial Luffy 24/25 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-naruto": { name: "Camisola Japão Edição Especial Naruto Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-obito-25-26": { name: "Camisola Japão 2025/26 - Edição Especial Obito Uchiha - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-one-piece-26": { name: "Camisola Japão Edição One Piece Concept 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-remixed": { name: "Camisola Japão BRINGBACK REMIXED OVERSIZED 2026 - Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-rock-lee-24-25": { name: "Camisola Japão Edição Especial Rock Lee 24/25 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-tsubasa": { name: "Camisola Japão Edição Capitão Tsubasa - Campeões: Oliver e Benji - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-vegeta": { name: "Camisola Japão Vegeta Edição Dragon Ball", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "japao-zoro-26-27": { name: "Camisola Japão Concept x Roronoa Zoro 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "juventus-mooca-24-25": { name: "Camisola Juventus da Mooca I 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "marrocos-25-26-ii": { name: "Camisola Marrocos II 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "marrocos-26-27": { name: "Camisola Marrocos Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "marrocos-alt-26-27": { name: "Camisola Marrocos Alternativa 2026/27 Copa do Mundo 2026", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "mexico-26-27": { name: "Camisola México Principal 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "mexico-97-98": { name: "Camisola México I 97/98 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "mexico-mulher-26-27": { name: "Camisola México Principal 26/27 - Copa do Mundo 2026 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "mexico-travis-scott": { name: "Camisola México x Travis Scott Cactus Jack Total 90 2026 - Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "nautico-26-27": { name: "Camisola Náutico 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "nautico-alt-26-27": { name: "Camisola Náutico Alternativa 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "nautico-alt-mulher-26-27": { name: "Camisola Náutico Alternativa 26/27 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "nautico-mulher-26-27": { name: "Camisola Náutico 26/27 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "nigeria-1998": { name: "Camisola Nigéria I 1998 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "nigeria-26-27": { name: "Camisola Nigéria Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "nigeria-96-98-ii": { name: "Camisola Nigéria II 96/98 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "nigeria-alt-26-27": { name: "Camisola Nigéria Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "noruega-26-27": { name: "Camisola Noruega Principal 26/27 - Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "noruega-alt-26-27": { name: "Camisola Noruega Alternativa 26/27 - Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "noruega-iii-26-27": { name: "Camisola Noruega III 26/27 - Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-14-15": { name: "Camisola Palmeiras 14/15 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-24-25": { name: "Camisola Palmeiras I 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-25-26": { name: "Camisola Palmeiras I 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-26-27": { name: "Camisola Palmeiras Principal 26/27 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-alt-14-15": { name: "Camisola Palmeiras II 14/15 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-alt-25-26": { name: "Camisola Palmeiras II 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-alt-26-27": { name: "Camisola Palmeiras Alternativa 26/27 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-alt-anos-99": { name: "Camisola Palmeiras II Anos 99 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-alt-jogador-25-26": { name: "Camisola Palmeiras II 25/26 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-alt-manga-longa-26-27": { name: "Camisola Palmeiras Alternativa 26/27 Manga Longa - Homem", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-alt-mulher-25-26": { name: "Camisola Palmeiras II 25/26 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-anos-80": { name: "Camisola Palmeiras I Anos 80 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-anos-89": { name: "Camisola Palmeiras I Anos 89 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-ii-24-25": { name: "Camisola Palmeiras II 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-iii-2009": { name: "Camisola Palmeiras III Retrô 2009 - Homem", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-iii-26-27": { name: "Camisola Palmeiras III 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-iii-amarela-25-26": { name: "Camisola Palmeiras III Amarelo 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-iii-jogador-25-26": { name: "Camisola Palmeiras III 25/26 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-iv-dourada-25-26": { name: "Camisola Palmeiras IV Dourada 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-jogador-25-26": { name: "Camisola Palmeiras I 25/26 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-jogador-26-27": { name: "Camisola Palmeiras 2026/27 - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-manga-longa-26-27": { name: "Camisola Palmeiras Principal 26/27 Manga Longa - Homem", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-patrocinadores-24-25": { name: "Camisola Palmeiras I Todos os Patrocinadores 24/25 Homem", price: 55, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-patrocinadores-ii-24-25": { name: "Camisola Palmeiras Todos os Patrocinadores II 24/25 Homem", price: 55, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "palmeiras-socio-torcedor-25-26": { name: "Camisola Palmeiras Sócio Torcedor 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "peru-26-27": { name: "Camisola Peru Principal 26/27 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "portugal-2016": { name: "Camisola Portugal 2016 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "portugal-26-27": { name: "Camisola Portugal Principal 26/27 Copa do Mundo 2026 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "portugal-alt-26-27": { name: "Camisola Portugal Alternativa 26/27 Copa do Mundo 2026 - Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "portugal-eusebio-25-26": { name: "Camisola Portugal Alternativa Edição Especial Eusébio 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "portugal-eusebio-mulher-25-26": { name: "Camisola Portugal Alternativa Edição Especial Eusébio 25/26 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "portugal-mulher-26-27": { name: "Camisola Portugal Principal 26/27 Copa do Mundo 2026 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "portugal-travis-scott": { name: "Camisola Portugal Cactus Jack Total 90 2026 - Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "portuguesa-iii-25-26": { name: "Camisola Portuguesa III 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "remo-26-27": { name: "Camisola Remo I 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "remo-mulher-26-27": { name: "Camisola Remo I 26/27 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "romenia-25-26": { name: "Camisola Roménia Principal 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santa-cruz-26-27": { name: "Camisola Santa Cruz Principal 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santa-cruz-alt-26-27": { name: "Camisola Santa Cruz Alternativa 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santa-cruz-alt-mulher-26-27": { name: "Camisola Santa Cruz Alternativa 26/27 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santa-cruz-mulher-26-27": { name: "Camisola Santa Cruz Principal 26/27 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-11-12": { name: "Camisola Santos I 11/12 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-1970": { name: "Camisola Santos I 1970 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-1998": { name: "Camisola Santos I 1998 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-25-26": { name: "Camisola Santos I 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-26-27": { name: "Camisola Santos Principal 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-alt-25-26": { name: "Camisola Santos II 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-alt-26-27": { name: "Camisola Santos Alternativa 26/27 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-charlie-brown": { name: "Camisola Santos Charlie Brown Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-charlie-brown-branca": { name: "Camisola Santos Charlie Brown Homem - Branca", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-iii-12-13": { name: "Camisola Santos III 12/13 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-iii-azul-25-26": { name: "Camisola Santos III 25/26 Azul - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-iv-2013": { name: "Camisola Santos Lv 2013 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-jogador-25-26": { name: "Camisola Santos I 25/26 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-jogador-26-27": { name: "Camisola Santos Principal 26/27 (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-pele-1000-gols": { name: "Camisola Santos Pelé 1000 Gols Homem - Branca", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "santos-pele-25-26": { name: "Camisola Santos Edição Especial Pelé 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-2007": { name: "Camisola São Paulo I Lg 2007 - Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-25-26": { name: "Camisola São Paulo I 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-26-27": { name: "Camisola São Paulo I 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-alt-24-25": { name: "Camisola São Paulo II 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-alt-26-27": { name: "Camisola São Paulo II 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-alt-jogador-25-26": { name: "Camisola São Paulo II 25/26 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-alt-mulher-26-27": { name: "Camisola São Paulo Alternativa 26/27 Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-iii-25-26": { name: "Camisola São Paulo III 25/26 - Terceiro Equipamento Alternativo Masculino", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-iii-26-27": { name: "Camisola São Paulo III 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-iii-jogador-25-26": { name: "Camisola São Paulo III 25/26 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-jogador-25-26": { name: "Camisola São Paulo I 25/26 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-jogador-26-27": { name: "Camisola São Paulo I 26/27 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-manga-longa-24-25": { name: "Camisola Sao Paulo I 24/25 Homem (Manga Longa)", price: 40, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-mulher-24-25": { name: "Camisola São Paulo I 24/25 Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-mulher-25-26": { name: "Camisola São Paulo I 25/26 Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-patrocinadores-24-25": { name: "Camisola São Paulo I Todos os Patrocinadores 24/25 Homem", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-patrocinadores-ii-24-25": { name: "Camisola São Paulo II Todos Los Patrocinadores 24/25 Homem", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-pre-jogo-26-27": { name: "Camisola Sao Paulo Pré - Jogo 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-treino-26-27": { name: "Camisola Sao Paulo Treino 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sao-paulo-treino-ii-26-27": { name: "Camisola Sao Paulo Treino II 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "senegal-26-27": { name: "Camisola Senegal Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "senegal-alt-26-27": { name: "Camisola Senegal Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "senegal-retro": { name: "Camisola Senegal I Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "senegal-retro-ii": { name: "Camisola Senegal II Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sport-recife-25-26": { name: "Camisola Sport Recife I 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sport-recife-26-27": { name: "Camisola Sport Recife Principal 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sport-recife-92-93": { name: "Camisola Sport Recife I 92/93 Homem (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sport-recife-alt-25-26": { name: "Camisola Sport Recife II 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sport-recife-alt-26-27": { name: "Camisola Sport Recife Alternativa 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sport-recife-iii-25-26": { name: "Camisola Sport Recife III 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "sport-recife-jogador-25-26": { name: "Camisola Sport Recife I 25/26 Homem (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "suecia-26-27": { name: "Camisola Suécia Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "suica-24-25": { name: "Camisola Suíça 24/25", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "suica-26-27": { name: "Camisola Suiça Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "suica-alt-26-27": { name: "Camisola Suiça Alternativa 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "ucrania-26-27": { name: "Camisola Ucrânia Principal 26/27 Copa do Mundo 2026 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "uruguai-26-27": { name: "Camisola Uruguai 2026/27 Copa do Mundo - Homem - Equipamento", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "uruguai-alt-26-27": { name: "Camisola Uruguai Alternativa 2026/27 Copa do Mundo - Azul Homem - Equipamento", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-1988": { name: "Camisola Vasco 1988 - Homem Retro", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-1997": { name: "Camisola Vasco da Gama 1997 (Retro)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-24-25": { name: "Camisola Vasco da Gama I 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-25-26": { name: "Camisola Vasco da Gama I 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-26-27": { name: "Camisola Vasco da Gama I 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-alt-25-26": { name: "Camisola Vasco da Gama II 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-alt-26-27": { name: "Camisola Vasco da Gama II 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-alt-jogador-26-27": { name: "Camisola Vasco Alternativa 26/27 (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-alt-mulher-26-27": { name: "Camisola Vasco da Gama II 26/27 - Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-guarda-redes-22-23": { name: "Camisola Vasco da Gama Portero/guarda Redes I 22/23 Homem Offwhite", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-ii-24-25": { name: "Camisola Vasco da Gama II 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-iii-24-25": { name: "Camisola Vasco da Gama III 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-iii-25-26": { name: "Camisola Vasco da Gama III 25/26 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-iii-26-27": { name: "Camisola Vasco da Gama III 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-iii-mulher-24-25": { name: "Camisola Vasco da Gama III 24/25 Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-jogador-26-27": { name: "Camisola Vasco Principal 26/27 (Versão Jogador)", price: 35, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-mares-almirante-26-27": { name: "Camisola Vasco da Gama Edição Especial Mares do Almirante 26/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-mulher-24-25": { name: "Camisola Vasco da Gama I 24/25 Mulher", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vasco-preta-24-25": { name: "Camisola Vasco da Gama Preta 24/25 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "venezuela-25-26": { name: "Camisola Venezuela I 25/26 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "venezuela-alt-26-27": { name: "Camisola Venezuela Alternativa 2026/27 - Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vitoria-25-26": { name: "Camisola Vitoria Fc I 25/26", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vitoria-26-27": { name: "Camisola Vitoria Principal 26/27 Homem", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  "vitoria-guarda-redes-25-26": { name: "Camisola Vitoria Fc 25/26 - Homem - Guarda Redes", price: 30, printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],
    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },
  // <<< fim das camisas geradas
};

// Mirrors cleanPrinting() in products.js: capitals, no accents, twelve letters,
// two digits. Repeated rather than imported because what a customer typed
// reaches this function through a cart key in their own browser, and the shop
// prints what this says, not what arrived.
function cleanPrinting(raw) {
  const [name, number] = String(raw || "").split("~");
  const printed = String(name || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Z ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12);
  // Leading zeros go before the cut: "0010" is 10, not 0.
  const digits = String(number || "").replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, "").slice(0, 2);
  return printed || digits ? [printed, digits].filter(Boolean).join(" ") : null;
}

// Stripe wants a coupon object of its own, and the rule lives in coupons.js -
// so the object is named after the rule. Change the percentage, the cap or the
// kind and the name changes with it, which means an edit to coupons.js can
// never be paid out at yesterday's rate. The flip side, worth knowing before
// raising a cap on a live code: the redemption counter belongs to the object,
// so a new name starts counting from zero again.
function stripeCouponId(coupon) {
  const rule = `${coupon.type}|${coupon.value}|${coupon.maxUses || 0}`;
  let hash = 0;
  for (let i = 0; i < rule.length; i++) {
    hash = (hash * 31 + rule.charCodeAt(i)) >>> 0;
  }
  return `rl_${coupon.code}_${hash.toString(36)}`;
}

// Made on first use rather than by hand in the dashboard, so a code is live the
// moment coupons.js deploys and there is no second place to keep in step.
async function stripeCouponFor(coupon) {
  const id = stripeCouponId(coupon);

  try {
    return (await stripe.coupons.retrieve(id)).id;
  } catch {
    /* first order on this rule - fall through and create it */
  }

  const params = { id, name: coupon.code, duration: "once" };
  if (coupon.type === "percent") {
    params.percent_off = coupon.value;
  } else {
    // currency belongs to amount_off only; sending it alongside percent_off is
    // an error rather than something Stripe ignores.
    params.amount_off = Math.round(coupon.value * 100);
    params.currency = "eur";
  }
  if (coupon.maxUses) params.max_redemptions = coupon.maxUses;

  try {
    return (await stripe.coupons.create(params)).id;
  } catch (err) {
    // Two customers checking out in the same second both find it missing and
    // both try to create it. The loser reads the winner's copy instead of
    // failing an order over a race.
    if (err && err.code === "resource_already_exists") return id;
    throw err;
  }
}

function couponRefusal(reason, minimum) {
  return {
    statusCode: 409,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "coupon", reason, minimum: minimum || 0 }),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let cart;
  let country;
  let couponCode;
  try {
    const payload = JSON.parse(event.body);
    cart = payload.cart;
    country = payload.country;
    couponCode = payload.coupon;
  } catch {
    return { statusCode: 400, body: "Invalid request body" };
  }

  // Cart keys are "<productId>" or "<productId>|<colorId>". Resolve each one
  // against the table above, so a tampered id or colour never reaches Stripe.
  const lines = [];
  for (const [key, qty] of Object.entries(cart || {})) {
    const [id, colorId, printed] = String(key).split("|");
    const product = PRODUCTS[id];
    if (!product || !(qty > 0)) continue;

    // Only where the product offers it, so a key edited by hand cannot add a
    // printed name to something that is not printed - or dodge the surcharge.
    const printing = product.printing ? cleanPrinting(printed) : null;

    let colorName = null;
    if (product.colors) {
      // Older carts were saved before colours existed and carry no suffix;
      // fall back to the first colour rather than losing the line.
      const resolved = colorId || Object.keys(product.colors)[0];
      colorName = product.colors[resolved];
      if (!colorName) {
        return { statusCode: 400, body: `Unknown colour for ${id}` };
      }
    }

    // Answered as JSON so the browser can name the model and mend the cart,
    // instead of showing the customer a bare failure.
    const available = stockFor(id, colorId);
    if (available < qty) {
      return {
        statusCode: 409,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "stock", key, available }),
      };
    }

    lines.push({ product, qty, colorName, printing });
  }

  if (lines.length === 0) {
    return { statusCode: 400, body: "Cart is empty" };
  }

  // Some things are sold in twos. Counted across the whole order rather than
  // per line, so two different shirts pass and one shirt beside a pair of
  // lupas does not. The cart drawer says this before the button is pressed;
  // this is what actually refuses, because the drawer runs in the browser.
  const perGroup = {};
  lines.forEach(({ product, qty }) => {
    if (!product.group) return;
    perGroup[product.group] = (perGroup[product.group] || 0) + qty;
  });
  const minimums = {};
  lines.forEach(({ product }) => {
    if (product.group && product.minimum) minimums[product.group] = product.minimum;
  });
  const short = Object.keys(perGroup).find((g) => perGroup[g] < (minimums[g] || 1));
  if (short) {
    return {
      statusCode: 409,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "minimum", group: short, have: perGroup[short], need: minimums[short],
      }),
    };
  }

  // The printed name goes in the line's own name, because this text is what the
  // shop reads when it packs and what the customer sees on the Stripe page and
  // on the receipt - the three have to agree about what was ordered.
  const linePrice = ({ product, printing }) => product.price + (printing ? product.printing : 0);
  const lineName = ({ product, colorName, printing }) => [
    colorName ? `${product.name} — ${colorName}` : product.name,
    printing ? `(${printing})` : "",
  ].filter(Boolean).join(" ");

  const line_items = lines.map((line) => ({
    price_data: {
      currency: "eur",
      product_data: { name: lineName(line) },
      unit_amount: Math.round(linePrice(line) * 100),
    },
    quantity: line.qty,
  }));

  // Worked out from the resolved lines, never from a total sent by the client.
  const subtotal = lines.reduce((sum, line) => sum + linePrice(line) * line.qty, 0);

  // The browser sends which country the customer chose, and the rate is worked
  // out here from it - the amount is never taken from the request. An unknown
  // or missing country falls back to Portugal rather than shipping free.
  const destination = zoneFor(country) ? String(country).toUpperCase() : DEFAULT_COUNTRY;
  const zone = zoneFor(destination);

  // The coupon is read against the subtotal this function worked out from the
  // catalogue, not against any total the browser sent - so emptying the cart
  // down to one pair after a 90-euro code was accepted does not get past here.
  // Refused as JSON, with the reason, so the drawer can say what is wrong
  // instead of showing a bare failure.
  let discounts;
  let couponFreeShipping = false;
  let appliedCode = null;

  if (typedCode(couponCode)) {
    const check = checkCoupon(couponCode, subtotal);
    if (!check.ok) return couponRefusal(check.reason, check.minimum);

    appliedCode = check.code;
    couponFreeShipping = check.freeShipping;
    if (!check.freeShipping) {
      try {
        discounts = [{ coupon: await stripeCouponFor(check.coupon) }];
      } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
      }
    }
  }

  // A free-shipping code zeroes the rate here rather than through Stripe: a
  // Stripe coupon comes off the products, and this one has to come off the
  // postage. The 80-euro threshold is still read from the undiscounted
  // subtotal, which is what shippingCentsFor() is given.
  const shippingCents = couponFreeShipping ? 0 : shippingCentsFor(destination, subtotal);
  const freeShipping = shippingCents === 0;

  // Anything in this order that is not on a shelf, and the longest wait among
  // them. Stripe takes a single estimate per shipping option, so a mixed order
  // is quoted the slower one and told in the name that the rest leaves first.
  const ordered = lines.filter(({ product }) => product.deliveryDays);
  const slowest = ordered.reduce(
    (worst, { product }) => (!worst || product.deliveryDays[1] > worst[1] ? product.deliveryDays : worst),
    null);

  const siteUrl = process.env.URL || "http://localhost:8888";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // No payment_method_types set here on purpose: Stripe Checkout then
      // shows whatever payment methods are enabled in the Dashboard
      // (Settings -> Payment methods) automatically, including wallets
      // like Apple Pay / Google Pay that aren't explicit type strings.
      line_items,
      // Left out entirely when no code was used: Stripe reads an empty
      // discounts array as "no discount and no promotion field", which is the
      // same thing, but an undefined key is the honest way to say nothing.
      ...(discounts ? { discounts } : {}),
      // So the dashboard says which code brought the order in - the only place
      // the shop can tell a campaign apart from an ordinary sale.
      ...(appliedCode ? { metadata: { cupom: appliedCode } } : {}),
      // Every country the shop serves stays selectable, so a customer who
      // picked the wrong one in the cart is not trapped - but the rate below
      // belongs to what they chose, so Stripe is told to keep them in the same
      // zone rather than letting a Portuguese rate pay for a German parcel.
      shipping_address_collection: {
        allowed_countries: zone ? zone.countries : SHIPPING_COUNTRIES,
      },
      // The courier needs a phone number as well as an email to arrange
      // delivery. Stripe makes this field required once it is enabled, and
      // hands it back on the session as customer_details.phone.
      phone_number_collection: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: shippingCents, currency: "eur" },
            // Portuguese on purpose, like the line items: this text is what
            // the shop reads when packing, and the function has no language.
            // An order holding something ordered in says so here, because
            // Stripe shows one estimate and this is the last screen before
            // the card: a customer must not read "2 to 5 working days" and
            // then wait three weeks for the half of it that was never on the
            // shelf. The lupas in that order still leave straight away.
            display_name: [
              freeShipping ? "Envio grátis" : "Envio",
              ordered.length && ordered.length < lines.length ? "(as lupas seguem primeiro)" : "",
            ].filter(Boolean).join(" "),
            delivery_estimate: ordered.length ? {
              minimum: { unit: "day", value: slowest[0] },
              maximum: { unit: "day", value: slowest[1] },
            } : {
              minimum: { unit: "business_day", value: zone.days[0] },
              maximum: { unit: "business_day", value: zone.days[1] },
            },
          },
        },
      ],
      // Stripe swaps {CHECKOUT_SESSION_ID} for the real id — the reference the
      // customer quotes and the shop looks up in the Stripe dashboard.
      success_url: `${siteUrl}/obrigado.html?ref={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?checkout=cancel`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    // The usage cap is counted by Stripe, so this is where a code running out
    // shows up - at the last customer, mid-checkout. Say so plainly and let
    // them buy without it, rather than turning the order away as a failure.
    if (err && (err.code === "coupon_expired" || err.code === "coupon_limit_reached")) {
      return couponRefusal("exhausted");
    }
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
