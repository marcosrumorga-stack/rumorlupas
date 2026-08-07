const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Shipping rules. The threshold is repeated in cart.js so the drawer can show
// how far the customer still is from it — but this file is what actually
// charges, so change it here first and keep the two in step.
const FREE_SHIPPING_FROM = 80;
const SHIPPING_CENTS = 390;

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
  "eye-jacket-45":   { name: "Oakley Eye Jacket",     price: 49, colors: { preto: "Preto" } },
  "plantaris-50":    { name: "Oakley Plantaris",      price: 49, colors: { preto: "Preto" } },
  "juliet-45":       { name: "Oakley Juliet",         price: 49 },
  "xx-45":           { name: "Oakley XX",             price: 49 },
  "plate-55":        { name: "Oakley Plate",          price: 53 },
  "gascan-50":       { name: "Oakley Gascan",         price: 49 },
  "splice-53":       { name: "Oakley Splice",         price: 53 },
  "monster-dog-47":  { name: "Oakley Monster Dog",    price: 49 },
  "dartboard-50":    { name: "Oakley Dartboard",      price: 49 },
  "flak-2xl-45":     { name: "Oakley Flak 2.0 XL",    price: 49 },
  "pitboss-53":      { name: "Oakley PitBoss",        price: 53 },
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let cart;
  try {
    cart = JSON.parse(event.body).cart;
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
  const freeShipping = subtotal >= FREE_SHIPPING_FROM;

  const siteUrl = process.env.URL || "http://localhost:8888";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // No payment_method_types set here on purpose: Stripe Checkout then
      // shows whatever payment methods are enabled in the Dashboard
      // (Settings -> Payment methods) automatically, including wallets
      // like Apple Pay / Google Pay that aren't explicit type strings.
      line_items,
      shipping_address_collection: { allowed_countries: ["PT"] },
      // The courier needs a phone number as well as an email to arrange
      // delivery. Stripe makes this field required once it is enabled, and
      // hands it back on the session as customer_details.phone.
      phone_number_collection: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: freeShipping ? 0 : SHIPPING_CENTS, currency: "eur" },
            display_name: freeShipping ? "Envio grátis — Portugal" : "Envio CTT — Portugal",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 5 },
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
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
