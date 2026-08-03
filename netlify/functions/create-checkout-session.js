const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Keep this in sync with products.js — prices are looked up here, never
// trusted from the client, so someone can't tamper with the cart to pay less.
const PRODUCTS = {
  "eye-jacket-45":   { name: "Oakley Eye Jacket",     price: 45 },
  "plantaris-50":    { name: "Oakley Plantaris",      price: 50 },
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

  const entries = Object.entries(cart || {}).filter(([id, qty]) => PRODUCTS[id] && qty > 0);
  if (entries.length === 0) {
    return { statusCode: 400, body: "Cart is empty" };
  }

  const line_items = entries.map(([id, qty]) => ({
    price_data: {
      currency: "eur",
      product_data: { name: PRODUCTS[id].name },
      unit_amount: Math.round(PRODUCTS[id].price * 100),
    },
    quantity: qty,
  }));

  const siteUrl = process.env.URL || "http://localhost:8888";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
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
