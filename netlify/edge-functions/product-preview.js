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
// It fails open. Any error at all, and the page goes out exactly as it is
// today: a worse preview, never a broken page.

import catalogue from "../../products.js";
import strings from "../../i18n.js";

const {
  findProductBySlug, hasColors, defaultColorId, findColor, productImages,
  imageSrcset, sizedImage, ogImage, formatPrice, isSoldOut,
  productPageTitle, productPageDescription, productSlug, GALLERY_SIZES,
} = catalogue;
const { I18N } = strings;

const SITE = "https://rumorlupas.com";
const HTML_LANG = { pt: "pt-PT", en: "en", es: "es" };
const OG_LOCALE = { pt: "pt_PT", en: "en_GB", es: "es_ES" };

// Matches /lupas/<slug> and the same under /en and /es, with or without a
// trailing slash. Anything else is none of this function's business.
const PATH = /^\/(?:(en|es)\/)?lupas\/([^/]+)\/?$/;

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

export default async (request, context) => {
  const url = new URL(request.url);
  const match = url.pathname.match(PATH);
  if (!match) return;

  const lang = match[1] || "pt";
  let product;
  try {
    product = findProductBySlug(match[2]);
  } catch {
    return;
  }
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
    const colorLabel = color ? tr(`color.${color.id}`) : "";

    const images = productImages(product, colorId);
    const cover = images[0];
    const path = `/${lang === "pt" ? "" : lang + "/"}lupas/${productSlug(product)}`;
    const canonical = SITE + path;
    const shared = canonical + (wanted && colorId === wanted ? `?cor=${encodeURIComponent(colorId)}` : "");

    const title = productPageTitle(product, tr);
    const description = productPageDescription(product, tr);
    const ogTitle = colorLabel
      ? `Oakley ${product.name} — ${colorLabel} | RumorLupas`
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
        `<meta property="og:image:alt" content="${escapeAttr(`Oakley ${product.name}${colorLabel ? " — " + colorLabel : ""}`)}">`,
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
  path: ["/lupas/*", "/en/lupas/*", "/es/lupas/*"],
};
