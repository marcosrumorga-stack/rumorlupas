// Answers the cart drawer when someone types a discount code. The codes
// themselves never leave the server: the browser sends what was typed and gets
// back a yes or a no, so a wrong guess learns nothing except that it was wrong.
//
// What comes back for a code that works is the rule behind it - ten per cent,
// no minimum, ends on the 31st - and not just the amount off this one cart. The
// drawer then recalculates as the customer adds and removes pairs without
// asking again. That does hand the rule to whoever already knows the code, but
// they are the person the discount is for; the secret worth keeping is the word
// they typed, and that stays here.
//
// Nothing said here is trusted later. create-checkout-session.js reads the same
// table again before Stripe is told anything.
const { checkCoupon } = require("./lib/coupons.js");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let code;
  let subtotal;
  try {
    const payload = JSON.parse(event.body);
    code = payload.code;
    // Only ever used to answer "does this cart reach the minimum". The real
    // subtotal is worked out from the catalogue at checkout, so a browser
    // claiming a bigger cart here buys itself a preview and nothing else.
    subtotal = Number(payload.subtotal);
  } catch {
    return { statusCode: 400, body: "Invalid request body" };
  }

  if (!Number.isFinite(subtotal) || subtotal < 0) subtotal = 0;

  const check = checkCoupon(code, subtotal);

  // Deliberately shaped so the refusals are indistinguishable from each other
  // in size and timing - "unknown" says nothing about how close the guess was.
  // What actually makes guessing impractical is the length of the code, not
  // this; a short code would be weak here however the answer is phrased.
  const body = check.ok
    ? {
      ok: true,
      code: check.code,
      type: check.coupon.type,
      value: check.coupon.value,
      minimum: check.minimum || 0,
      until: check.coupon.until || null,
      freeShipping: check.freeShipping,
      discountCents: check.discountCents,
    }
    : { ok: false, reason: check.reason, minimum: check.minimum || 0 };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      // A verdict depends on the cart and on today's date, and it is answered
      // per visitor. Nothing about it should sit in a shared cache.
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
};
