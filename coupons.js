// Discount codes, written once and read by both sides: the cart drawer, to show
// the customer what a code is worth before they pay, and the checkout function,
// to actually take it off. Same arrangement as shipping.js - what the browser
// works out is a preview, and the function works it out again from this table
// rather than trusting any number that arrived in the request.
//
// A code is one entry below:
//
//   code         what the customer types, matched exactly as written here.
//   type         "percent"  - value is the percentage off
//                "amount"   - value is euros off
//                "shipping" - the parcel travels free, whatever the cart holds
//   value        the number behind the type. Ignored by "shipping".
//   minSubtotal  euros the cart must reach first. Leave out for none.
//   until        last day it works, "YYYY-MM-DD". Leave out for no end date.
//   maxUses      how many orders may use it in total. Leave out for unlimited.
//   note         a reminder for the shop. Never shown to the customer.
//
// Two rules the whole file rests on, so they are stated once here:
//
//   The discount comes off the products, never off the postage.
//   The 80-euro free-shipping line is measured before the discount - a code
//   cannot pull an order under the line and still have the parcel travel free.
//
// maxUses is counted by Stripe, on the coupon object the checkout function
// creates from this rule. A "shipping" code has no Stripe coupon behind it -
// the function simply zeroes the rate - so maxUses does nothing there. Give a
// free-shipping code an `until` date instead of a usage cap.

const COUPONS = [
  // 10 % off the products. The cap is roughly the whole shop - 49 units as of
  // September 2026 - so a code that escapes onto a voucher site cannot outrun
  // the stock behind it, and the end date closes the campaign on its own if
  // nobody remembers to.
  { code: "FRONTOFF", type: "percent", value: 10, until: "2026-12-31", maxUses: 50,
    note: "10% nos produtos, campanha de lancamento" },

  // More shapes, for when the next campaign comes round. Uncomment, edit, and
  // the code works the moment the site deploys - there is nothing to create in
  // Stripe by hand.
  //
  // { code: "PAR5",   type: "amount",   value: 5, minSubtotal: 90,
  //   note: "5 euros para quem leva dois pares" },
  // { code: "PORTES", type: "shipping",           until: "2026-10-31",
  //   note: "Envio gratis, campanha de outubro" },
];

// A code has to be written exactly as it is published - FRONTOFF, one word, in
// capitals - so the comparison below is exact. "frontoff" and "FRONT OFF" are
// refused like any other wrong code.
//
// The one thing forgiven is whitespace at the ends, which is what a paste
// drags in and what a phone's space bar adds after the last letter. It is
// invisible on screen, so refusing it would look to the customer like the shop
// rejecting a code they can see is right.
//
// Whoever loosens this again: take the text-transform off .cart-coupon__input
// at the same time, or the field will show a lowercase code in capitals and
// then deny it exists.
function typedCode(code) {
  return String(code || "").trim();
}

function findCoupon(code) {
  const wanted = typedCode(code);
  if (!wanted) return null;
  return COUPONS.find((c) => c.code === wanted) || null;
}

// A fixed-amount code has a floor of its own: Stripe refuses a discount larger
// than the amount being charged, so a 10-euro code needs a 10-euro cart even
// when no minimum was written for it.
function minimumFor(coupon) {
  const written = coupon.minSubtotal || 0;
  return coupon.type === "amount" ? Math.max(written, coupon.value) : written;
}

// Cents, not euros: money that has to survive a round trip to Stripe should
// never spend time as a fraction. Capped at the subtotal as a second guard -
// minimumFor() should already have kept it under, and if it ever does not, the
// shop pays nobody.
function discountCentsFor(coupon, subtotal) {
  if (!coupon || coupon.type === "shipping") return 0;
  const subtotalCents = Math.round(subtotal * 100);
  const raw = coupon.type === "percent"
    ? Math.round(subtotalCents * coupon.value / 100)
    : Math.round(coupon.value * 100);
  return Math.max(0, Math.min(raw, subtotalCents));
}

// One answer, read by the drawer and by the function. `reason` names the
// problem so the browser can turn it into a sentence in the language being
// read, instead of each side writing its own wording.
function checkCoupon(code, subtotal) {
  const coupon = findCoupon(code);
  if (!coupon) return { ok: false, reason: "unknown" };

  if (coupon.until) {
    // Good until the end of that day, so a code that says 31/12 still works on
    // the 31st. Read as UTC; Portugal is never more than an hour off it, and
    // erring by an hour in the customer's favour is the right way to err.
    const deadline = Date.parse(`${coupon.until}T23:59:59Z`);
    if (Number.isFinite(deadline) && Date.now() > deadline) {
      return { ok: false, reason: "expired", coupon };
    }
  }

  const minimum = minimumFor(coupon);
  if (subtotal < minimum) {
    return { ok: false, reason: "minimum", coupon, minimum };
  }

  return {
    ok: true,
    coupon,
    code: coupon.code,
    discountCents: discountCentsFor(coupon, subtotal),
    freeShipping: coupon.type === "shipping",
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { COUPONS, typedCode, findCoupon, checkCoupon, discountCentsFor };
}
