const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Keep this in sync with products.js — prices are looked up here, never
// trusted from the client, so someone can't tamper with the cart to pay less.
// `colors` maps a colour id to the name that goes on the Stripe line item, so
// the order says which variant to ship.
const PRODUCTS = {
  "eye-jacket-45":   { name: "Oakley Eye Jacket",     price: 45, colors: { preto: "Preto" } },
  "plantaris-50":    { name: "Oakley Plantaris",      price: 50, colors: { preto: "Preto" } },
  "juliet-45":       { name: "Oakley Juliet",         price: 45 },
  "xx-45":           { name: "Oakley XX",             price: 45 },
  "plate-55":        { name: "Oakley Plate",          price: 55 },
  "gascan-50":       { name: "Oakley Gascan",         price: 50 },
  "splice-53":       { name: "Oakley Splice",         price: 53 },
  "monster-dog-47":  { name: "Oakley Monster Dog",    price: 47 },
  "dartboard-50":    { name: "Oakley Dartboard",      price: 50 },
  "flak-2xl-45":     { name: "Oakley Flak 2.0 XL",    price: 45 },
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
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 390, currency: "eur" },
            display_name: "Envio CTT — Portugal",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
      success_url: `${siteUrl}/?checkout=success`,
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
