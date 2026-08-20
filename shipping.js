// Where the shop ships and what it charges, written once and read by both
// sides: the cart drawer to show the cost, and the checkout function to charge
// it. The threshold used to be written in cart.js and in the function
// separately, which is the sort of pair that drifts.
//
// The customer picks the country in the cart, not at Stripe. Stripe Checkout
// takes a flat list of shipping options and cannot pick one based on the
// address the customer types later, so a shop with different rates per country
// has to know the country before the session is created. The choice is only a
// hint: the function resolves the rate itself and never trusts the browser.

const FREE_SHIPPING_FROM = 80;

// Ordered from most specific to least: zoneFor() takes the first match, and
// the last zone is the catch-all for the rest of the EU.
const SHIPPING_ZONES = [
  {
    id: "pt",
    cents: 490,
    days: [2, 5],
    countries: ["PT"],
  },
  {
    id: "es",
    cents: 990,
    days: [3, 7],
    countries: ["ES"],
  },
  {
    // The other 25 member states. Outside the EU there would be a customs
    // declaration and import VAT for the buyer, which is a different promise
    // from the one the site makes - so the list stops at the union.
    id: "eu",
    cents: 1490,
    days: [5, 10],
    countries: [
      "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
      "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "RO", "SK", "SI", "SE",
    ],
  },
];

const SHIPPING_COUNTRIES = SHIPPING_ZONES.reduce(
  (all, zone) => all.concat(zone.countries), []);

function zoneFor(country) {
  const code = String(country || "").toUpperCase();
  return SHIPPING_ZONES.find((zone) => zone.countries.indexOf(code) !== -1) || null;
}

// Free shipping applies in every zone. It only ever triggers at 80 euros or
// more, where there is margin to absorb it, and keeping one threshold keeps
// the promise on the site true in all three languages without a footnote.
function shippingCentsFor(country, subtotal) {
  const zone = zoneFor(country);
  if (!zone) return null;
  return subtotal >= FREE_SHIPPING_FROM ? 0 : zone.cents;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    FREE_SHIPPING_FROM, SHIPPING_ZONES, SHIPPING_COUNTRIES,
    zoneFor, shippingCentsFor,
  };
}
