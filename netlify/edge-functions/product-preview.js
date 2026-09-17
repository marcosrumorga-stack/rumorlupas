// Writes a product page's <head> before the page leaves the server.
//
// Two things need it, and neither can run JavaScript in time.
//
// A link preview - WhatsApp, Instagram, Facebook, iMessage - is drawn by a
// crawler that fetches the HTML and reads it. It never runs produto.js, so
// every model shared by message showed the shop's generic cover and the title
// "Produto — RumorLupas". Worse, the static canonical points at /produto.html,
// so a search engine that does not run scripts is told all twelve models are
// the same page.
//
// And the page's largest element is the first gallery photo, which produto.js
// creates only after six scripts have arrived and run. The browser cannot see
// it coming, so it starts fetching it late - which is why the product pages
// carry the slow tail of this site's Largest Contentful Paint while the home
// page, whose largest element is text, is quick. A preload of exactly the
// photo the gallery will ask for lets the fetch start immediately.
//
// Everything here is read from products.js, the same file the catalogue, the
// checkout and the Meta feed read, so there is no second copy of the catalogue
// to keep in step.
//
// It fails open, twice over. An error inside the handler sends the page out
// exactly as it is today. An error before the handler even runs is covered by
// onError: "bypass" in the config at the bottom - without it Netlify's default
// is to answer with an error page, which here would mean product pages that do
// not load at all.

// products.js and i18n.js are browser scripts: top-level consts and functions,
// and a CommonJS guard at the end for the Node functions. Edge functions run in
// Deno, which treats every .js file as an ES module - so importing them gives a
// module with no exports, and the first version of this file, which did just
// that, would not have started. They are fetched from the deploy instead and
// run in a function scope that supplies `module`, so their own guard hands the
// exports back.
//
// `window` and `document` are passed in as undefined on purpose. i18n.js reads
// the page's address when it thinks it is in a browser, and Deno has at times
// defined a global `window`; shadowing both keeps the scripts on their
// server-side path whatever the runtime does.
let loading;

function runScript(source) {
  const module = { exports: {} };
  new Function("module", "exports", "window", "document", source)(module, module.exports, undefined, undefined);
  return module.exports;
}

function loadCatalogue(origin) {
  if (!loading) {
    loading = Promise.all(["/products.js", "/i18n.js"].map(async (path) => {
      const res = await fetch(new URL(path, origin));
      if (!res.ok) throw new Error(`${path} answered ${res.status}`);
      return res.text();
    })).then(([products, i18n]) => ({ catalogue: runScript(products), strings: runScript(i18n) }))
      // A failed load is not kept: the next request tries again.
      .catch((error) => { loading = undefined; throw error; });
  }
  return loading;
}

const SITE = "https://rumorlupas.com";
const HTML_LANG = { pt: "pt-PT", en: "en", es: "es" };
const OG_LOCALE = { pt: "pt_PT", en: "en_GB", es: "es_ES" };

// Matches /<category>/<slug> and the same under /en and /es, with or without a
// trailing slash - /lupas/oakley-juliet, /camisas/brasil-26-27. The category is
// captured rather than hard-coded, and checked against the product's own once
// the catalogue is loaded, so /camisas/oakley-juliet is not a second address
// for the same page.
const PATH = /^\/(?:(en|es)\/)?([a-z][a-z0-9-]*)\/([^/]+)\/?$/;

// One segment deeper: /camisas/liga/premier-league. Three segments is why it
// cannot be confused with a product, which has two.
//
// The lookahead is load-bearing. All three segments here are slash-free, so
// without it /en/lupas/oakley-juliet also reads as three segments - category
// "en", group "lupas" - and the language prefix is never taken. It matched, the
// category lookup then found nothing, and every English and Spanish product
// page quietly lost its head. Refusing a category called "en" or "es" forces
// the prefix to be read as a prefix. PATH above does not need this: its last
// group cannot hold a slash, so only one reading of it ever fits.
// The last group takes further segments, because a league can hold leagues:
// /camisas/liga/selecoes/americas is the Americas inside Selecoes.
const LEAGUE_PATH = /^\/(?:(en|es)\/)?(?!en\/|es\/)([a-z][a-z0-9-]*)\/([a-z][a-z0-9-]*)\/([a-z0-9-]+(?:\/[a-z0-9-]+)*)\/?$/;

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;").replace(/"/g, "&quot;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Netlify rewrites the HTML on deploy - it reorders attributes and swaps
// double quotes for single ones - so nothing here may depend on how a tag was
// written. The old tags are removed by what they are, and a fresh block goes
// in before </head>.
function stripHead(html) {
  return html
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\b[^>]*\bname=["'](?:description|twitter:[^"']*)["'][^>]*>/gi, "")
    .replace(/<meta\b[^>]*\bproperty=["'](?:og|product):[^"']*["'][^>]*>/gi, "")
    .replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi, "");
}

// A league address is the catalogue opened on one league, and a page of its own
// to Google, so it needs a head of its own. It lives in this function rather
// than a second edge function so both share the one catalogue already loaded.
async function dressLeague(url, context, match) {
  const lang = match[1] || "pt";
  const categoryPath = match[2];
  const groupPath = match[3];
  const wanted = match[4];

  let catalogue;
  let strings;
  try {
    ({ catalogue, strings } = await loadCatalogue(url.origin));
  } catch (error) {
    console.error("product-preview: catalogue", error && error.message);
    return;
  }

  const {
    CATEGORY_SETUP, categorySetup, findGroup, productsInGroup,
    groupPageTitle, groupPageDescription, productImages, defaultColorId, ogImage,
  } = catalogue;

  // Every part of the address has to belong to the same category, or it is not
  // a league's page: /lupas/liga/x is nobody's.
  const categoryId = Object.keys(CATEGORY_SETUP)
    .find((id) => CATEGORY_SETUP[id].path === categoryPath);
  if (!categoryId) return;
  const setup = categorySetup(categoryId);
  if (setup.groupPath !== groupPath) return;
  const group = findGroup(categoryId, wanted);
  if (!group) return;

  const response = await context.next();
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;

  const original = await response.text();
  const headers = new Headers(response.headers);
  headers.delete("content-length");

  try {
    const { I18N } = strings;
    const tr = (key) => (I18N[lang] && I18N[lang][key] !== undefined ? I18N[lang][key] : key);

    // The path and not the group: a continent and the league above it are two
    // pages with two different counts, and only the path says which is which.
    const title = groupPageTitle(categoryId, wanted, tr);
    const description = groupPageDescription(categoryId, wanted, tr);
    const canonical = `${SITE}${lang === "pt" ? "" : "/" + lang}/${setup.path}/${setup.groupPath}/${wanted}`;

    const stocked = productsInGroup(categoryId, wanted);
    // A shared league link shows a shirt from that league when there is one.
    const first = stocked[0];
    const cover = first ? productImages(first, defaultColorId(first))[0] : null;
    const preview = cover ? `${SITE}/${ogImage(cover)}` : `${SITE}/images/og-cover.png`;

    const tags = [
      `<title id="pageTitle">${escapeAttr(title)}</title>`,
      `<meta name="description" content="${escapeAttr(description)}">`,
      `<link rel="canonical" href="${escapeAttr(canonical)}">`,
      `<meta property="og:type" content="website">`,
      `<meta property="og:site_name" content="RumorLupas">`,
      `<meta property="og:locale" content="${OG_LOCALE[lang]}">`,
      `<meta property="og:url" content="${escapeAttr(canonical)}">`,
      `<meta property="og:title" content="${escapeAttr(title)}">`,
      `<meta property="og:description" content="${escapeAttr(description)}">`,
      `<meta property="og:image" content="${escapeAttr(preview)}">`,
      `<meta property="og:image:width" content="1200">`,
      `<meta property="og:image:height" content="630">`,
      `<meta name="twitter:card" content="summary_large_image">`,
    ];
    // Shown to a customer on purpose and kept out of the index on purpose: a
    // league being filled is worth seeing and not worth filing. The tag goes
    // the moment the league has a shirt, here and in script.js both.
    if (!stocked.length) tags.push(`<meta name="robots" content="noindex, follow">`);

    let html = stripHead(original).replace(/<\/head>/i, `${tags.join("\n")}\n</head>`);
    html = html.replace(/<html\b[^>]*>/i, (tag) =>
      /\blang=/.test(tag) ? tag.replace(/\blang=["'][^"']*["']/i, `lang="${HTML_LANG[lang]}"`) : tag);

    return new Response(html, { status: response.status, headers });
  } catch (error) {
    console.error("product-preview: league", error && error.message);
    return new Response(original, { status: response.status, headers });
  }
}

export default async (request, context) => {
  const url = new URL(request.url);

  const league = url.pathname.match(LEAGUE_PATH);
  if (league) return await dressLeague(url, context, league);

  const match = url.pathname.match(PATH);
  if (!match) return;

  const lang = match[1] || "pt";
  const categoryPath = match[2];

  let catalogue;
  let strings;
  let product;
  try {
    ({ catalogue, strings } = await loadCatalogue(url.origin));
    product = catalogue.findProductBySlug(match[3]);
  } catch (error) {
    console.error("product-preview: catalogue", error && error.message);
    return;
  }
  // The slug found it, but only at its own category's address. Reaching a
  // shirt under /lupas/ is not a page this should dress up as one.
  if (product && catalogue.productSetup(product).path !== categoryPath) product = null;

  const {
    hasColors, defaultColorId, findColor, productImages, imageSrcset, sizedImage,
    ogImage, isSoldOut, productPageTitle, productPageDescription, productSlug,
    searchLead, GALLERY_SIZES,
  } = catalogue;
  const { I18N } = strings;
  // An address that names no model: produto.js already answers that one, with
  // a noindex and a "produto nao encontrado".
  if (!product) return;

  const response = await context.next();
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;

  const original = await response.text();
  const headers = new Headers(response.headers);
  headers.delete("content-length");

  try {
    const tr = (key) => (I18N[lang] && I18N[lang][key] !== undefined ? I18N[lang][key] : key);

    // The colour in the address, when it names a real one - so a link sent for
    // a particular colour previews that colour, not the model's default.
    const wanted = url.searchParams.get("cor");
    const colorId = wanted && hasColors(product) && product.colors.some((c) => c.id === wanted)
      ? wanted
      : defaultColorId(product);
    const color = findColor(product, colorId);
    // Same fallback colorName() makes in the browser: a variant with no string
    // of its own keeps the name written in the catalogue. The sizes have none
    // on purpose - an "M" is an M in all three languages - and without this the
    // preview of a shared shirt read "Camisa Brasil 26/27 — color.s".
    const colorKey = color ? `color.${color.id}` : "";
    const colorLabel = color ? (tr(colorKey) === colorKey ? color.name : tr(colorKey)) : "";

    const images = productImages(product, colorId);
    const cover = images[0];
    const path = `/${lang === "pt" ? "" : lang + "/"}${categoryPath}/${productSlug(product)}`;
    const canonical = SITE + path;
    const shared = canonical + (wanted && colorId === wanted ? `?cor=${encodeURIComponent(colorId)}` : "");

    const title = productPageTitle(product, tr);
    const description = productPageDescription(product, tr);
    // The same string the page title leads with - the short one where a product
    // has it, because a preview in a chat is read at a glance like a title is.
    const lead = searchLead(product);
    const ogTitle = colorLabel
      ? `${lead} — ${colorLabel} | RumorLupas`
      : title;

    const tags = [
      `<title id="pageTitle">${escapeAttr(title)}</title>`,
      `<meta name="description" content="${escapeAttr(description)}">`,
      `<link rel="canonical" href="${escapeAttr(canonical)}">`,
      `<meta property="og:type" content="product">`,
      `<meta property="og:site_name" content="RumorLupas">`,
      `<meta property="og:locale" content="${OG_LOCALE[lang]}">`,
      `<meta property="og:url" content="${escapeAttr(shared)}">`,
      `<meta property="og:title" content="${escapeAttr(ogTitle)}">`,
      `<meta property="og:description" content="${escapeAttr(description)}">`,
      `<meta name="twitter:card" content="summary_large_image">`,
    ];

    if (cover) {
      // 1200x630, cropped around the lupas, because a preview is drawn as a
      // wide band and these photos are tall.
      const preview = `${SITE}/${ogImage(cover)}`;
      tags.push(
        `<meta property="og:image" content="${escapeAttr(preview)}">`,
        `<meta property="og:image:width" content="1200">`,
        `<meta property="og:image:height" content="630">`,
        `<meta property="og:image:alt" content="${escapeAttr(`${lead}${colorLabel ? " — " + colorLabel : ""}`)}">`,
      );

      // Exactly what produto.js will ask for, so this starts the one fetch the
      // page needs rather than a second one beside it. Each entry of the
      // srcset is "<path> <width>w"; the site goes in front of the path.
      const absoluteSrcset = imageSrcset(cover)
        .split(", ")
        .map((entry) => `${SITE}/${entry}`)
        .join(", ");

      tags.push(
        `<link rel="preload" as="image" fetchpriority="high"` +
        ` href="${escapeAttr(`${SITE}/${sizedImage(cover, 800)}`)}"` +
        ` imagesrcset="${escapeAttr(absoluteSrcset)}"` +
        ` imagesizes="${escapeAttr(GALLERY_SIZES)}">`,
      );
    }

    tags.push(
      `<meta property="product:price:amount" content="${product.price}">`,
      `<meta property="product:price:currency" content="EUR">`,
      `<meta property="product:availability" content="${isSoldOut(product, colorId) ? "out of stock" : "in stock"}">`,
    );

    let html = stripHead(original).replace(/<\/head>/i, `${tags.join("\n")}\n</head>`);
    html = html.replace(/<html\b[^>]*>/i, (tag) =>
      /\blang=/.test(tag) ? tag.replace(/\blang=["'][^"']*["']/i, `lang="${HTML_LANG[lang]}"`) : tag);

    return new Response(html, { status: response.status, headers });
  } catch (error) {
    console.error("product-preview:", error && error.message);
    return new Response(original, { status: response.status, headers });
  }
};

export const config = {
  path: [
    "/lupas/*", "/en/lupas/*", "/es/lupas/*",
    "/camisas/*", "/en/camisas/*", "/es/camisas/*",
  ],
  // If the function cannot run at all, serve the page without it. Netlify's
  // default is to answer with an error, which would take the product pages
  // down over what is only an improvement to them.
  onError: "bypass",
};
