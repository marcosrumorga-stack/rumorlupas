document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");
navToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const productGrid = document.getElementById("productGrid");

// Per card: which colour it shows, and which of that colour's photos is in view.
const selectedColor = {};
const photoIndex = {};
PRODUCTS.forEach((p) => {
  selectedColor[p.id] = defaultColorId(p);
  photoIndex[p.id] = 0;
});

// How wide a card is, measured on the live grid rather than read off the CSS -
// the grid is minmax(230px, 1fr), so the column count and the card width both
// move with the screen:
//
//   under 540   one column    290 at 320, 345 at 375, 470 at 520
//   540 - 799   two columns   232 at 540, 342 at 760
//   800 - 1099  three         233 at 800, 307 at 1024
//   1100 up     four          about 248, held by the container's max width
//
// Each line below sits a little above the real width, never under it. Over
// costs a few kilobytes; under is the one mistake a srcset can make that a
// customer can see, because the browser then picks a copy too small to be sharp.
const CARD_SIZES =
  "(max-width: 539px) calc(100vw - 30px), " +
  "(max-width: 799px) calc(50vw - 20px), " +
  "(max-width: 1099px) calc(33vw - 10px), " +
  "250px";

// The photos sit in a scroll-snapping strip inside the link, so a swipe or an
// arrow leafs through them while a plain click still opens the product.
function mediaHtml(p) {
  const images = productImages(p, selectedColor[p.id]);
  if (!images.length) {
    return `<a href="${productUrl(p)}" class="product-card__image">${t("product.soon")}<span class="sr-only">${p.name}</span></a>`;
  }

  const slides = images
    .map((src, i) => `<img src="${sizedImage(src, 800)}" srcset="${imageSrcset(src)}" sizes="${CARD_SIZES}" alt="${p.name}"${i ? ' loading="lazy"' : ""}>`)
    .join("");

  const arrows = images.length > 1
    ? `<button type="button" class="card-nav card-nav--prev" data-id="${p.id}" data-step="-1" aria-label="${t("aria.prevPhoto")}">‹</button>
       <button type="button" class="card-nav card-nav--next" data-id="${p.id}" data-step="1" aria-label="${t("aria.nextPhoto")}">›</button>`
    : "";

  // Sold out and last one share the corner: a colour can only ever be one.
  const out = isSoldOut(p, selectedColor[p.id])
    ? `<span class="sold-out">${t("product.soldOut")}</span>`
    : isLastOne(p, selectedColor[p.id])
      ? `<span class="last-one">${t("product.lastOne")}</span>`
      : "";

  return `<a href="${productUrl(p)}" class="product-card__image">
      <div class="card-track" data-track="${p.id}">${slides}</div>
    </a>${arrows}${out}`;
}

const categoryTabs = document.getElementById("categoryTabs");
const leagueTabs = document.getElementById("leagueTabs");
const subLeagueTabs = document.getElementById("subLeagueTabs");
const gridEmpty = document.getElementById("gridEmpty");
const catalogNote = document.getElementById("catalogNote");
let activeCategory = categories()[0];
// null means the whole category. Otherwise a group path: "selecoes", or
// "selecoes/americas" when a continent inside it is the one being looked at.
let activeGroup = null;

// /camisas/liga/premier-league and /camisas/liga/selecoes/americas, with or
// without a language in front, are both served this same page by _redirects -
// Netlify's * matches across slashes, so the rule written for the leagues
// already covers the continents inside them. Reading the address here is what
// makes it a real one: opened cold, sent in a message or reached with the back
// button, it arrives at the right pill instead of the top of the catalogue.
function readGroupFromPath() {
  const match = location.pathname.match(
    /^\/(?:(?:en|es)\/)?([a-z][a-z0-9-]*)\/([a-z][a-z0-9-]*)\/([a-z0-9-]+(?:\/[a-z0-9-]+)*)\/?$/);
  if (!match) return false;
  const [, categoryId, groupPath, wanted] = match;
  const setup = categorySetup(categoryId);
  if (setup.path !== categoryId || setup.groupPath !== groupPath) return false;
  if (!findGroup(categoryId, wanted)) return false;
  activeCategory = categoryId;
  activeGroup = wanted;
  return true;
}

// The league a path sits in: "selecoes/americas" belongs to "selecoes", and a
// league belongs to itself. What the second row of pills marks as active.
function activeLeague() {
  return activeGroup ? activeGroup.split("/")[0] : null;
}

// The address the current view is at, so pushing it and reading it back agree.
function currentPath() {
  const lang = typeof currentLang === "string" ? currentLang : "pt";
  const home = lang === "pt" ? "/" : `/${lang}/`;
  return activeGroup ? groupUrl(activeCategory, activeGroup, lang) : home;
}

// A league has an address of its own, so it needs a head of its own: the tab,
// the search result and anything that reads the description should say which
// league this is, not what the home page says.
//
// The edge function writes the same three things server-side, because a crawler
// that runs nothing still has to see them. This is for the person looking at
// the tab, and for the crawlers that do run scripts.
function renderGroupHead() {
  const home = { title: t("meta.home.title"), desc: t("meta.home.desc") };
  const group = activeGroup ? findGroup(activeCategory, activeGroup) : null;

  document.title = group ? groupPageTitle(activeCategory, activeGroup, t) : home.title;

  const desc = document.querySelector('meta[name="description"]');
  if (desc) {
    desc.setAttribute("content",
      group ? groupPageDescription(activeCategory, activeGroup, t) : home.desc);
  }

  // A league with nothing in it is shown to people on purpose and kept out of
  // the index on purpose. The tag is removed again the moment it has stock.
  const empty = group && !productsInGroup(activeCategory, activeGroup).length;
  let robots = document.querySelector('meta[name="robots"]');
  if (empty && !robots) {
    robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, follow";
    document.head.appendChild(robots);
  } else if (!empty && robots) {
    robots.remove();
  }
}

function showGroup(groupId, push) {
  activeGroup = groupId;
  if (push) history.pushState({ group: groupId, cat: activeCategory }, "", currentPath());
  renderGroups();
  renderGroupHead();
  renderProducts();
}

// One pill. `count` of 0 dims it: the league is still shown and still opens,
// and says on arrival that it is being filled.
function groupPill(path, label, on, count) {
  return `<button type="button" role="tab" class="leagues__tab${on ? " active" : ""}` +
    `${count === 0 ? " leagues__tab--soon" : ""}" data-group="${path}" aria-selected="${on}">${label}</button>`;
}

// True where the pointer cannot hover: a phone, a tablet. There the first tap
// on a continent opens its teams instead of going straight to the continent,
// because a menu that only hover can reach does not exist on those screens.
const semHover = () => window.matchMedia("(hover: none)").matches;

function wireGroupPills(row) {
  row.querySelectorAll(".leagues__tab, .teams__item").forEach((btn) => {
    btn.addEventListener("click", () => {
      // A button that opens something, on a screen with no hover: the first tap
      // opens it rather than jumping past it. Works for both levels, because
      // both say so with aria-haspopup.
      const wrap = btn.parentElement && btn.parentElement.classList.contains("teams") ? btn.parentElement : null;
      if (wrap && btn.getAttribute("aria-haspopup") !== "false" && semHover() && !wrap.classList.contains("open")) {
        row.querySelectorAll(".teams.open").forEach((o) => { if (!o.contains(wrap)) o.classList.remove("open"); });
        wrap.classList.add("open");
        return;
      }
      const wanted = btn.dataset.group || null;
      if (wanted === activeGroup) return;
      showGroup(wanted, true);
    });
  });
}

// One entry inside a panel. An entry that holds more entries carries them in a
// panel of its own, opening beside it: Seleções holds continents, a continent
// holds teams, and a fourth level would draw itself the same way.
function menuEntry(path, group) {
  const dentro = subGroups(activeCategory, path);
  const on = activeGroup === path || String(activeGroup || "").startsWith(`${path}/`);
  const botao = `<button type="button" class="teams__item${on ? " active" : ""}` +
    `${dentro.length ? " teams__item--pai" : ""}" data-group="${path}" aria-haspopup="${dentro.length > 0}">${groupName(group)}</button>`;
  if (!dentro.length) return botao;

  const filhos = dentro.map((g) => menuEntry(`${path}/${g.id}`, g)).join("");
  return `<span class="teams teams--aninhado" data-for="${path}">${botao}` +
    `<span class="teams__menu teams__menu--lado" role="menu">${filhos}</span></span>`;
}

function renderGroups() {
  const groups = categoryGroups(activeCategory);
  leagueTabs.hidden = !groups.length;
  subLeagueTabs.hidden = true;
  subLeagueTabs.innerHTML = "";
  if (!groups.length) {
    leagueTabs.innerHTML = "";
    return;
  }

  leagueTabs.setAttribute("aria-label", t("aria.league"));
  // "Todas" first: without it there is no way back to the whole tab once a
  // league is picked. A league is lit for everything inside it too, so Seleções
  // stays lit while Portugal is the one being read.
  const league = activeLeague();
  leagueTabs.innerHTML = [
    groupPill("", t("league.all"), !activeGroup, null),
    ...groups.map((g) => {
      const dentro = subGroups(activeCategory, g.id);
      const pill = groupPill(g.id, groupName(g), g.id === league, productsInGroup(activeCategory, g.id).length);
      if (!dentro.length) return pill;
      const filhos = dentro.map((sub) => menuEntry(`${g.id}/${sub.id}`, sub)).join("");
      return `<span class="teams" data-for="${g.id}">${pill}` +
        `<span class="teams__menu" role="menu">${filhos}</span></span>`;
    }),
  ].join("");
  wireGroupPills(leagueTabs);

  // Opened by hover and by focus, and on a touch screen by a first tap on the
  // pill - where hover does not exist and a tap would otherwise jump straight
  // to the continent without ever showing the teams inside it.
  leagueTabs.querySelectorAll(".teams").forEach((wrap) => {
    const abrir = () => {
      // Already open: leave it exactly where it is. mouseover and pointerover
      // bubble, so every twitch of the pointer inside a panel reaches the
      // wrapper again, and measuring and replacing the panel on each one makes
      // it shiver under the cursor.
      if (wrap.classList.contains("open")) return;
      // Close whatever is open that this one does not live inside, so moving
      // between two continents swaps their panels instead of stacking them.
      leagueTabs.querySelectorAll(".teams.open").forEach((o) => {
        if (o !== wrap && !o.contains(wrap) && !wrap.contains(o)) o.classList.remove("open");
      });

      // The menus are fixed to the window, so each has to be told where its own
      // trigger is. Measured when it opens rather than when it is drawn: the
      // row scrolls, and yesterday's position is the wrong one.
      const gatilho = wrap.querySelector(".leagues__tab, .teams__item");
      const r = gatilho.getBoundingClientRect();
      const menu = wrap.querySelector(".teams__menu");
      const largura = menu.offsetWidth || 180;

      if (wrap.classList.contains("teams--aninhado")) {
        // Beside the panel it lives in, not beside the entry: the entry stops
        // at the panel's padding, so anchoring to it opened the second panel a
        // few pixels on top of the first.
        const painel = wrap.parentElement.getBoundingClientRect();
        const cabe = painel.right + largura + 8 <= window.innerWidth;
        menu.style.left = `${Math.round(cabe ? painel.right + 2 : Math.max(8, painel.left - largura - 2))}px`;
        // Lined up with the entry, then pulled back up if the bottom would fall
        // off the window.
        const topo = Math.min(r.top - 6, window.innerHeight - menu.offsetHeight - 8);
        menu.style.top = `${Math.round(Math.max(8, topo))}px`;
      } else {
        menu.style.top = `${Math.round(r.bottom + 6)}px`;
        const meio = r.left + r.width / 2 - largura / 2;
        menu.style.left = `${Math.round(Math.max(8, Math.min(meio, window.innerWidth - largura - 8)))}px`;
      }
      wrap.classList.add("open");
    };
    // Closing waits a moment. Reaching a menu item is a diagonal movement, and
    // a diagonal clips the corner of whatever is beside the pill on the way -
    // closing the instant the pointer leaves makes the menu impossible to
    // reach for anyone who does not travel in straight lines.
    let aFechar = null;
    const cancelar = () => { if (aFechar) { clearTimeout(aFechar); aFechar = null; } };
    const fechar = () => { cancelar(); aFechar = setTimeout(() => wrap.classList.remove("open"), 300); };

    // mouseenter and mouseover both, and pointerover on top: they are the same
    // gesture but they are not dispatched identically everywhere, and a menu
    // that opens on only one of them is a menu that sometimes does not open.
    // abrir() is cheap and idempotent, so asking three times costs nothing.
    ["mouseenter", "mouseover", "pointerover"].forEach((evento) => {
      wrap.addEventListener(evento, () => { cancelar(); abrir(); });
    });
    wrap.addEventListener("mouseleave", fechar);
    wrap.addEventListener("pointerleave", fechar);
    wrap.addEventListener("focusin", () => { cancelar(); abrir(); });
    wrap.addEventListener("focusout", (e) => { if (!wrap.contains(e.relatedTarget)) fechar(); });
    wrap.addEventListener("keydown", (e) => { if (e.key === "Escape") { cancelar(); wrap.classList.remove("open"); } });
  });

  // Anywhere else closes whatever is open. Pointerdown rather than click, so a
  // menu does not sit open under a finger that has already moved on.
  document.addEventListener("pointerdown", (e) => {
    if (!e.target.closest || !e.target.closest(".teams")) {
      leagueTabs.querySelectorAll(".teams.open").forEach((o) => o.classList.remove("open"));
    }
  });
}

// The back button, and the forward one after it.
window.addEventListener("popstate", () => {
  activeGroup = null;
  readGroupFromPath();
  renderCategories();
  renderCatalogNote();
  renderGroupHead();
  renderProducts();
});

// What ships in the box differs per category — a hat comes with no cleaning
// cloth. Categories with nothing to say simply show no line.
function renderCatalogNote() {
  const key = `catalog.note.${activeCategory}`;
  const text = t(key);
  const has = text !== key;
  catalogNote.textContent = has ? text : "";
  catalogNote.hidden = !has;
}

function renderCategories() {
  const all = categories();
  categoryTabs.innerHTML = all
    .map((id) => {
      const on = id === activeCategory;
      return `<button type="button" role="tab" class="cats__tab${on ? " active" : ""}" data-cat="${id}" aria-selected="${on}">${categoryLabel(id)}</button>`;
    })
    .join("");

  categoryTabs.querySelectorAll(".cats__tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.cat === activeCategory) return;
      activeCategory = btn.dataset.cat;
      // A league belongs to the tab it was picked in, so changing tab drops it
      // and the address goes back to the catalogue's own.
      activeGroup = null;
      history.pushState({ cat: activeCategory }, "", currentPath());
      renderCategories();
      renderCatalogNote();
      renderGroupHead();
      renderProducts();
    });
  });

  renderGroups();
}

function renderProducts() {
  // productsInGroup rather than a match on the field: a shirt filed under
  // "selecoes/americas" has to show under Seleções as well as under Américas.
  const shown = activeGroup
    ? productsInGroup(activeCategory, activeGroup)
    : PRODUCTS.filter((p) => productCategory(p) === activeCategory);

  // A league the shop has not stocked yet is shown on purpose, so a customer
  // can see what is coming; saying so is better than an empty grid.
  gridEmpty.hidden = shown.length > 0;
  gridEmpty.textContent = shown.length ? "" : t("league.empty");

  productGrid.innerHTML = shown.map((p) => `
    <div class="product-card" data-product="${p.id}">
      <div class="product-card__media">${mediaHtml(p)}</div>
      <div class="product-card__body">
        <a href="${productUrl(p)}" class="product-card__name">${cardName(p)}</a>
        ${colorSwatchesHtml(p, selectedColor[p.id])}
        <p class="product-card__price">${priceHtml(p)}</p>
        ${isSoldOut(p, selectedColor[p.id])
          ? `<button class="product-card__btn" disabled>${t("product.soldOut")}</button>`
          : `<button class="product-card__btn" data-id="${p.id}">${t("product.add")}</button>`}
      </div>
    </div>
  `).join("");

  productGrid.querySelectorAll(".product-card__btn[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id, selectedColor[btn.dataset.id]));
  });

  productGrid.querySelectorAll(".swatch").forEach((btn) => {
    const productId = btn.closest(".product-card").dataset.product;
    btn.addEventListener("click", () => pickColor(productId, btn.dataset.color));
  });

  productGrid.querySelectorAll(".card-nav").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // The arrows sit over the link; without this the card would open.
      e.preventDefault();
      stepPhoto(btn.dataset.id, Number(btn.dataset.step));
    });
  });

  productGrid.querySelectorAll(".card-track").forEach((track) => {
    // A swipe moves the strip directly, so read the position back.
    track.addEventListener("scroll", () => {
      if (!track.clientWidth) return;
      photoIndex[track.dataset.track] = Math.round(track.scrollLeft / track.clientWidth);
    }, { passive: true });

    // A redraw resets scroll to zero; put each strip back where it was.
    const at = photoIndex[track.dataset.track];
    if (at) track.scrollLeft = track.clientWidth * at;
  });
}

function stepPhoto(productId, step) {
  const product = PRODUCTS.find((p) => p.id === productId);
  const track = productGrid.querySelector(`.card-track[data-track="${productId}"]`);
  if (!product || !track) return;

  const count = productImages(product, selectedColor[productId]).length;
  if (count < 2) return;

  photoIndex[productId] = (photoIndex[productId] + step + count) % count;
  track.scrollTo({ left: track.clientWidth * photoIndex[productId], behavior: "smooth" });
}

function pickColor(productId, colorId) {
  selectedColor[productId] = colorId;
  photoIndex[productId] = 0;
  renderProducts();
}

// Before the first draw, so a league address opens on its own pill.
const arrivedAtGroup = readGroupFromPath();
renderCategories();
renderCatalogNote();
renderGroupHead();
renderProducts();
// Straight to the catalogue: someone who followed a league link came for the
// shirts, not for the hero.
//
// Scrolling once is not enough. Everything above the catalogue - the hero, the
// customer strip - is still loading, and each photo that lands pushes the
// catalogue further down, so a scroll to where it is now ends up short by
// however much arrived afterwards. So it is re-asserted until the target stops
// moving, and given up on after a second either way. `behavior: auto` because
// the page sets smooth scrolling globally and a chain of animations fighting
// each other is worse than none.
if (arrivedAtGroup) {
  const target = document.getElementById("catalogo");

  // Three shots on a timer rather than a frame loop: requestAnimationFrame is
  // paused in a tab that is not being looked at, which is exactly the tab a
  // link opened in a background window lands in. `behavior: auto` because the
  // page scrolls smoothly by default and three animations chasing each other
  // look worse than none.
  //
  // Whether the reader has taken over is decided by where the page actually is,
  // not by listening for wheel and touch events. Those fire for reasons that
  // have nothing to do with a person - the first version gave up on the scroll
  // altogether, at random, because something else in the page tripped one. If
  // the position is no longer where this last put it, someone else moved it and
  // it stops arguing.
  let placed = null;
  const toCatalogue = () => {
    if (placed !== null && Math.abs(window.scrollY - placed) > 2) return;
    window.scrollTo({
      top: Math.round(target.getBoundingClientRect().top + window.scrollY),
      // "instant", not "auto". In scrollTo, "auto" does not mean jump - it
      // means use the element's scroll-behavior, and this page sets that to
      // smooth. So the scroll animated, window.scrollY read a few pixels along
      // rather than at the target, and the next attempt read that gap as the
      // reader having taken over and gave up on a page that had barely moved.
      behavior: "instant",
    });
    // Where the page ended up, not where it was asked to go: on the first try
    // the images above have no height yet, so the document can be too short to
    // scroll that far and the browser stops short.
    placed = Math.round(window.scrollY);
  };
  window.addEventListener("load", toCatalogue);
  setTimeout(toCatalogue, 300);
  setTimeout(toCatalogue, 900);
}

// The customer strip: arrows for the mouse, which has no sideways gesture, and
// click-and-drag on top. Touch and trackpad already work through scroll-snap.
const clientesStrip = document.getElementById("clientesStrip");
if (clientesStrip) {
  // Endless in both directions: the photos are laid out three times over and
  // the scroll position is shifted by one set whenever it reaches an edge.
  // Because the sets are identical, the shift is invisible.
  const originals = Array.from(clientesStrip.children);
  for (let copy = 0; copy < 2; copy++) {
    originals.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clientesStrip.appendChild(clone);
    });
  }

  // Widths come from CSS, not from the photos, so this is right before they load.
  const setWidth = () => clientesStrip.scrollWidth / 3;
  const page = () => Math.min(clientesStrip.clientWidth * 0.8, setWidth() * 0.5);

  // Start on the middle set, so there is a full set of room either way.
  requestAnimationFrame(() => { clientesStrip.scrollLeft = setWidth(); });

  clientesStrip.addEventListener("scroll", () => {
    const w = setWidth();
    if (clientesStrip.scrollLeft >= 2 * w) clientesStrip.scrollLeft -= w;
    else if (clientesStrip.scrollLeft <= 0) clientesStrip.scrollLeft += w;
  }, { passive: true });

  // Re-centre before an arrow scroll, so the animation never crosses an edge
  // and gets cut short by the shift above.
  function recentre() {
    const w = setWidth();
    while (clientesStrip.scrollLeft >= 2 * w) clientesStrip.scrollLeft -= w;
    while (clientesStrip.scrollLeft < w) clientesStrip.scrollLeft += w;
  }

  document.getElementById("clientesPrev").addEventListener("click", () => {
    recentre();
    clientesStrip.scrollBy({ left: -page(), behavior: "smooth" });
  });
  document.getElementById("clientesNext").addEventListener("click", () => {
    recentre();
    clientesStrip.scrollBy({ left: page(), behavior: "smooth" });
  });

  let down = false;
  let startX = 0;
  let startScroll = 0;

  clientesStrip.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true;
    startX = e.clientX;
    startScroll = clientesStrip.scrollLeft;
  });

  clientesStrip.addEventListener("pointermove", (e) => {
    if (!down) return;
    const moved = e.clientX - startX;
    // Only take over once it's clearly a drag, not a stray click.
    if (!clientesStrip.classList.contains("dragging") && Math.abs(moved) < 4) return;
    clientesStrip.classList.add("dragging");
    clientesStrip.setPointerCapture(e.pointerId);
    clientesStrip.scrollLeft = startScroll - moved;
  });

  const endDrag = () => {
    down = false;
    clientesStrip.classList.remove("dragging");
  };
  clientesStrip.addEventListener("pointerup", endDrag);
  clientesStrip.addEventListener("pointercancel", endDrag);
  clientesStrip.addEventListener("pointerleave", endDrag);
}
