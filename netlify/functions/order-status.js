// Answers the thank-you page when it asks whether an order has actually been
// paid for.
//
// Until now that page told everyone the same thing: we have your order and we
// are getting it ready. With a card that is true the moment Stripe sends the
// customer back. With Multibanco it is not: Checkout completes, the customer
// lands here, and only afterwards do they go to a machine or to homebanking and
// pay a reference. Telling someone who has not paid yet that their parcel is
// being packed is how a shop ends up waiting for money that never comes while
// the customer waits for a parcel that was never sent.
//
// So the page asks, and this answers with one of three words. Everything else
// about the order - the email, the address, what was bought - stays here. The
// session id is in the address bar of the person who just checked out, which is
// who this is for; it is long and random, so it cannot be guessed, but it is
// not a password either, and nothing is returned that they did not just type in
// themselves a minute ago.
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// cs_test_... and cs_live_... Checked before Stripe is called so a page full of
// junk ids cannot be used to make this function hammer the API.
const SESSION_ID = /^cs_[A-Za-z0-9_]{10,200}$/;

const answer = (statusCode, body) => ({
  statusCode,
  headers: {
    "content-type": "application/json; charset=utf-8",
    // The answer is about one order and changes the moment it is paid, so it
    // must never be held by a CDN or a browser.
    "cache-control": "no-store",
  },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  const ref = ((event.queryStringParameters || {}).ref || "").trim();
  if (!SESSION_ID.test(ref)) return answer(400, { state: "unknown" });

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(ref, {
      expand: ["payment_intent"],
    });
  } catch (error) {
    // A wrong id, or Stripe being unreachable. "unknown" is deliberate: the
    // page then says nothing about whether the money arrived, which is the
    // only honest thing to say when we could not find out.
    console.error("order-status:", error && error.message);
    return answer(200, { state: "unknown" });
  }

  const paid = session.payment_status === "paid" ||
               session.payment_status === "no_payment_required";
  if (paid) return answer(200, { state: "paid" });

  if (session.status === "expired") return answer(200, { state: "unpaid" });

  const intent = session.payment_intent;
  const status = intent && typeof intent === "object" ? intent.status : null;

  // Multibanco hands back a voucher to display; a bank transfer hands back
  // instructions. Both arrive under next_action, keyed by their own type, and
  // both carry a Stripe-hosted page with the reference on it. Read generically
  // rather than by name, so a payment method added in the Dashboard later works
  // here without this file being touched.
  const next = intent && typeof intent === "object" ? intent.next_action : null;
  const details = next && next.type ? next[next.type] : null;

  if (status === "processing" || status === "requires_action") {
    return answer(200, {
      state: "pending",
      // The reference itself, so the page can print it rather than only send
      // the customer somewhere else to read it.
      entity: (details && details.entity) || null,
      reference: (details && details.reference) || null,
      expiresAt: (details && details.expires_at) || null,
      voucherUrl: (details &&
        (details.hosted_voucher_url || details.hosted_instructions_url)) || null,
    });
  }

  // requires_payment_method, canceled, or a session still open: the money is
  // not on its way and nothing is being packed.
  return answer(200, { state: "unpaid" });
};
