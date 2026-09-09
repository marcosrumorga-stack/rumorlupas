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
    "azul-lente-azul":        "Azul · lente azul",
    "vermelha-lente-laranja": "Vermelha · lente laranja",
    "vermelha-lente-preta":   "Vermelha · lente preta",
  } },
  "holbrook":        { name: "Oakley Holbrook",       price: 49, colors: {
    "preta-lente-preta":    "Preta · lente preta",
    "preta-lente-vermelha": "Preta · lente vermelha",
  } },
  "pitboss-53":      { name: "Oakley Pit Boss II",    price: 53, colors: {
    "preta-lente-preta": "Preta · lente preta",
  } },
};

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
    const [id, colorId] = String(key).split("|");
    const product = PRODUCTS[id];
    if (!product || !(qty > 0)) continue;

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

    lines.push({ product, qty, colorName });
  }

  if (lines.length === 0) {
    return { statusCode: 400, body: "Cart is empty" };
  }

  const line_items = lines.map(({ product, qty, colorName }) => ({
    price_data: {
      currency: "eur",
      product_data: { name: colorName ? `${product.name} — ${colorName}` : product.name },
      unit_amount: Math.round(product.price * 100),
    },
    quantity: qty,
  }));

  // Worked out from the resolved lines, never from a total sent by the client.
  const subtotal = lines.reduce((sum, { product, qty }) => sum + product.price * qty, 0);

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
            display_name: freeShipping ? "Envio grátis" : "Envio",
            delivery_estimate: {
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
