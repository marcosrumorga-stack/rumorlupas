// Consent gate for the Meta pixel.
//
// The pixel is advertising tracking: under EU law it may not run before the
// visitor agrees to it, and refusing has to be exactly as easy as agreeing -
// two buttons of the same size, no "reject" buried behind a settings screen.
// That is where the fines land, not on the banner's wording.
//
// Cloudflare Web Analytics is deliberately NOT gated here. It sets no cookie
// and identifies nobody, which is the only reason this site went without a
// banner at all until the pixel arrived. Do not add anything else to this
// file that runs before consent.
//
// Everything below stays dormant while PIXEL_ID is empty: no banner, no
// script, no storage. A banner asking permission for a tracker that does not
// exist is worse than no banner, so the two switch on together.

// Meta's own snippet ships with a <noscript> tracking image as a fallback.
// It is deliberately not reproduced here: it would fire on load, before
// anyone had answered, which is the one thing this file exists to prevent.
const PIXEL_ID = "2302089550197792";

const CONSENT_KEY = "rumorlupas_consent";
const CONSENT_VERSION = 1;

// Storing the answer is itself allowed without permission - it is what stops
// us asking again on every page - but it holds a choice, never an identifier.
function readConsent() {
  try {
    const raw = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    if (!raw || raw.v !== CONSENT_VERSION) return null;
    return raw.choice === "accept" || raw.choice === "reject" ? raw.choice : null;
  } catch {
    return null;
  }
}

function saveConsent(choice) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      v: CONSENT_VERSION, choice, at: new Date().toISOString(),
    }));
  } catch {
    /* private browsing: the choice holds for this page only, and we ask again */
  }
}

// Meta's own snippet, written out rather than pasted minified so it can be
// read. It queues calls until fbevents.js arrives, then replays them.
function loadPixel() {
  if (!PIXEL_ID || window.fbq) return;
  const fbq = function () {
    fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
  };
  window.fbq = fbq;
  window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", PIXEL_ID);
  fbq("track", "PageView");
}

// The banner is written into every page rather than built here. It used to be
// created by this file, which meant it could not be drawn until i18n.js and
// this script had both arrived - and on the home page it is the largest thing
// in view, so Cloudflare measured it as the element the whole page waited for.
// In the markup it paints with the HTML. A small script in each page's head
// hides it before the first paint for anyone who already answered, so nobody
// who has chosen ever sees it flash; that script repeats CONSENT_KEY and
// CONSENT_VERSION, so changing either means changing the head of every page.
//
// This file still owns everything that matters: the storage, the buttons and
// the pixel. Only the drawing moved.
const BANNER_CLASS = "consent-answered";

function hideBanner() {
  document.documentElement.classList.add(BANNER_CLASS);
}

function openBanner() {
  if (!PIXEL_ID) return;
  document.documentElement.classList.remove(BANNER_CLASS);
}

function wireBanner() {
  const wrap = document.getElementById("consentBanner");
  if (!wrap) return;

  wrap.querySelectorAll("[data-choice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const choice = btn.dataset.choice;
      saveConsent(choice);
      hideBanner();
      refreshControl();
      if (choice === "accept") loadPixel();
      // Withdrawing cannot unload a script that already ran, so a refusal made
      // after the pixel loaded takes effect on the next page load.
      else if (window.fbq) window.location.reload();
    });
  });
}

// The privacy policy carries a control to see the current answer and change
// it. Withdrawing has to be as easy as giving it, and burying it in a footer
// link nobody finds does not count.
function refreshControl() {
  const control = document.getElementById("consentControl");
  if (!control || !PIXEL_ID) return;
  const choice = readConsent();
  document.getElementById("consentState").textContent =
    t(choice ? `consent.state.${choice}` : "consent.state.none");
  document.getElementById("consentChange").textContent = t("consent.change");
  control.hidden = false;
}

window.rlConsent = {
  open: openBanner,
  current: () => (PIXEL_ID ? readConsent() : null),
  active: () => Boolean(PIXEL_ID),
};

if (PIXEL_ID) {
  const choice = readConsent();
  // The head script has already hidden it if there was an answer; this is the
  // same decision made again, for the case where that script did not run.
  if (choice !== null) hideBanner();
  if (choice === "accept") loadPixel();
  wireBanner();

  const changeBtn = document.getElementById("consentChange");
  if (changeBtn) changeBtn.addEventListener("click", openBanner);
  refreshControl();
} else {
  // No pixel means nothing to ask about. The markup sits in the page either
  // way, so it has to be put away here - a moment late, since this runs after
  // the paint, but only ever in the state where the banner should not exist.
  hideBanner();
}
