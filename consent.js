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

function buildBanner() {
  const wrap = document.createElement("div");
  wrap.className = "consent";
  wrap.setAttribute("role", "dialog");
  wrap.setAttribute("aria-labelledby", "consentText");

  const privacy = typeof localePath === "function"
    ? localePath("/privacidade.html")
    : "/privacidade.html";

  wrap.innerHTML = `
    <div class="consent__inner">
      <p class="consent__text" id="consentText">
        ${t("consent.text")}
        <a class="consent__link" href="${privacy}">${t("consent.more")}</a>
      </p>
      <div class="consent__actions">
        <button type="button" class="consent__btn" data-choice="reject">${t("consent.reject")}</button>
        <button type="button" class="consent__btn" data-choice="accept">${t("consent.accept")}</button>
      </div>
    </div>`;

  wrap.querySelectorAll("[data-choice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const choice = btn.dataset.choice;
      saveConsent(choice);
      wrap.remove();
      banner = null;
      refreshControl();
      if (choice === "accept") loadPixel();
      // Withdrawing cannot unload a script that already ran, so a refusal made
      // after the pixel loaded takes effect on the next page load.
      else if (window.fbq) window.location.reload();
    });
  });

  document.body.appendChild(wrap);
  return wrap;
}

let banner = null;

function openBanner() {
  if (!PIXEL_ID || banner) return;
  banner = buildBanner();
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
  if (choice === "accept") loadPixel();
  else if (choice === null) openBanner();

  const changeBtn = document.getElementById("consentChange");
  if (changeBtn) changeBtn.addEventListener("click", openBanner);
  refreshControl();
}
