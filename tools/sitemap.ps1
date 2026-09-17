# Rebuilds sitemap.xml and _redirects from products.js, so neither has to be
# kept in step by hand. Run it after adding, removing or renaming a product:
#
#   .\tools\sitemap.ps1
#
# Renaming matters: the address is derived from the model's name, so a rename
# changes the URL and the old one needs to keep redirecting.
param(
  [string]$Root = ".",
  [string]$Site = "https://rumorlupas.com"
)

# Models pulled from sale but expected back. Their pages are gone, so both the
# old and the new address are sent to the catalogue with a 302 - a temporary
# code, because a 301 tells Google the address is finished for good and it
# would have to earn its place again on the way back. Without this, produto.html
# still answers 200 and shows "produto nao encontrado", which reads to Google
# as a broken page rather than a deliberate one.
$RETIRED = @(
  @{ id = "splice-53"; slug = "oakley-splice" }
)

$source = [System.IO.File]::ReadAllText(
  (Resolve-Path (Join-Path $Root "products.js")), [System.Text.Encoding]::UTF8)

# Only product-level entries: colour ids sit deeper, and the file's comments
# carry an example id that must not be picked up.
$block = [regex]::Match($source, 'const PRODUCTS = \[(.*?)\n\];', 'Singleline').Groups[1].Value
$block = [regex]::Replace($block, '(?m)^\s*//.*$', '')

# Each category owns a path and a slug prefix. This is a copy of CATEGORY_SETUP
# in products.js, which this script cannot read - change one and change the
# other in the same commit. A category missing here falls back to the lupas.
$CATEGORIES = @{
  lupas   = @{ path = "lupas";   slugPrefix = "oakley-" }
  camisas = @{ path = "camisas"; slugPrefix = "" }
}

# The sub-navigation inside a category, and another copy of products.js - the
# `groups` list under CATEGORY_SETUP. Order does not matter here; the pills are
# ordered by the catalogue, this only decides which addresses exist.
#
# Every league gets a rewrite so its address answers, but only a league that
# holds shirts goes in the sitemap: the empty ones are shown to customers on
# purpose and are marked noindex by the edge function, so listing them would be
# asking Google to file pages we have just told it to ignore.
$GROUPS = @{
  camisas = @{
    path = "liga"
    # Paths, not ids: a league that holds leagues writes its children out in
    # full, the same strings products.js uses.
    ids  = @("selecoes",
             "selecoes/europa", "selecoes/americas", "selecoes/asia", "selecoes/africa",
             "brasileirao", "liga-portugal", "premier-league",
             "la-liga", "ligue-1", "bundesliga", "serie-a", "mls", "nba",
             "formula-1")
  }
}

$products = @()
$hits = [regex]::Matches($block, '(?m)^\s{2,4}(\{ )?id: "([a-z0-9.-]+)",\s*\r?\n?\s*name: "([^"]+)"')
for ($i = 0; $i -lt $hits.Count; $i++) {
  $m = $hits[$i]
  # Everything until the next product, so its own category is read and not the
  # next one's.
  $fim = if ($i + 1 -lt $hits.Count) { $hits[$i + 1].Index } else { $block.Length }
  $texto = $block.Substring($m.Index, $fim - $m.Index)
  $cat = if ($texto -match 'category: "([a-z0-9-]+)"') { $Matches[1] } else { "lupas" }
  $setup = if ($CATEGORIES.ContainsKey($cat)) { $CATEGORIES[$cat] } else { $CATEGORIES["lupas"] }

  # A product may write its own address instead of having it built from the
  # name - productSlug() in products.js does the same, and for the same reason:
  # a rename must not move a page that is already linked to. Without this the
  # long supplier name would generate a slug nobody has ever linked to.
  if ($texto -match 'slug: "([a-z0-9-]+)"') {
    $slug = $Matches[1]
  } else {
    $slug = $m.Groups[3].Value.ToLowerInvariant()
    $slug = $slug.Normalize([Text.NormalizationForm]::FormD) -replace '\p{Mn}', ''
    $slug = ($slug -replace '[^a-z0-9]+', '-').Trim('-')
  }
  # Slashes allowed: a product says where it belongs down to the last level,
  # "selecoes/americas" and not just "selecoes".
  $league = if ($texto -match 'league: "([a-z0-9/-]+)"') { $Matches[1] } else { "" }
  $products += [pscustomobject]@{
    id = $m.Groups[2].Value; slug = "$($setup.slugPrefix)$slug"; path = $setup.path
    category = $cat; league = $league }
}

$dupes = $products | Group-Object slug | Where-Object { $_.Count -gt 1 }
if ($dupes) { throw "Slugs repetidos: " + ($dupes.Name -join ', ') }

# ---------- languages ----------
# Portuguese keeps the bare paths; the other two sit under a prefix. Must match
# DEFAULT_LANG and localePath() in i18n.js.
$LANGS = @("pt", "en", "es")
$HREFLANG = @{ pt = "pt-PT"; en = "en"; es = "es" }

function Loc-Path([string]$bare, [string]$lang) {
  if ($lang -eq "pt") { return $bare }
  if ($bare -eq "/") { return "/$lang/" }
  return "/$lang$bare"
}

# ---------- sitemap.xml ----------
$today = (Get-Date).ToString("yyyy-MM-dd")
$lines = @('<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
           '        xmlns:xhtml="http://www.w3.org/1999/xhtml">')

$pages = @()
function Add-Page([string]$path, [string]$priority, [string]$freq, [string[]]$langs = $LANGS) {
  $script:pages += [pscustomobject]@{
    path = $path; priority = $priority; freq = $freq; langs = $langs }
}
Add-Page "/" "1.0" "daily"
foreach ($p in $products) { Add-Page "/$($p.path)/$($p.slug)" "0.8" "weekly" }
# A league only earns a place once it has something to show.
foreach ($cat in $GROUPS.Keys) {
  $setup = $CATEGORIES[$cat]

  # Every group path a product actually names, plus every path above it: a
  # shirt filed under selecoes/europa/portugal gives Portugal a page, and gives
  # Europa and Selecoes one too. Discovered rather than listed, the same way
  # products.js discovers the teams inside a continent - a list written by hand
  # here would promise pages that do not exist and miss ones that do.
  $caminhos = @{}
  foreach ($p in $products) {
    if ($p.category -ne $cat -or -not $p.league) { continue }
    $partes = $p.league -split "/"
    for ($i = 0; $i -lt $partes.Count; $i++) {
      $caminhos[($partes[0..$i] -join "/")] = $true
    }
  }
  # The ones declared but empty stay out, which is where the noindex on them
  # comes from; the ones discovered are by definition not empty.
  foreach ($id in ($caminhos.Keys | Sort-Object)) {
    $profundidade = ($id -split "/").Count
    $peso = @("0.6", "0.6", "0.5", "0.5")[[Math]::Min($profundidade - 1, 3)]
    Add-Page "/$($setup.path)/$($GROUPS[$cat].path)/$id" $peso "weekly"
  }
}
# Portuguese only: the documents themselves are not translated, and the notice
# at the top of each says only the Portuguese version is binding. Must match
# PT_ONLY in i18n.js.
Add-Page "/termos.html" "0.2" "yearly" @("pt")
Add-Page "/privacidade.html" "0.2" "yearly" @("pt")

# Each language gets an entry of its own - a page can only be found in a
# language it has an address in - and every entry lists all three, so Google
# reads them as one page rather than three competing for the same searches.
foreach ($page in $pages) {
  foreach ($lang in $page.langs) {
    $lines += "  <url>"
    $lines += "    <loc>$Site$(Loc-Path $page.path $lang)</loc>"
    if ($page.langs.Count -gt 1) {
      foreach ($alt in $page.langs) {
        $lines += '    <xhtml:link rel="alternate" hreflang="{0}" href="{1}{2}"/>' -f
                  $HREFLANG[$alt], $Site, (Loc-Path $page.path $alt)
      }
      $lines += '    <xhtml:link rel="alternate" hreflang="x-default" href="{0}{1}"/>' -f
                $Site, (Loc-Path $page.path "pt")
    }
    $lines += "    <lastmod>$today</lastmod>", "    <changefreq>$($page.freq)</changefreq>",
              "    <priority>$($page.priority)</priority>", "  </url>"
  }
}
$urlCount = ($pages | ForEach-Object { $_.langs.Count } | Measure-Object -Sum).Sum
$lines += '</urlset>'
[System.IO.File]::WriteAllText((Join-Path $Root "sitemap.xml"),
  ($lines -join "`n") + "`n", (New-Object System.Text.UTF8Encoding($false)))

# ---------- _redirects ----------
# Order matters: Netlify takes the first rule that matches. The 301s carry "!"
# so they beat produto.html actually existing on disk.
$r = @(
  "# Generated by tools/sitemap.ps1 - do not edit by hand.",
  "",
  "# The address each model was sold at before /lupas/ existed. Kept because it",
  "# is in the sitemap Google already fetched and in links people have shared.")
foreach ($p in $products) { $r += "/produto.html  id=$($p.id)  /$($p.path)/$($p.slug)  301!" }

# Before the catch-all below, or /lupas/<retirado> would be rewritten to
# produto.html and answer 200 with "produto nao encontrado".
if ($RETIRED.Count) {
  $r += "", "# Pulled from sale, expected back: 302 and not 301, so the address is not",
        "# written off. Each language goes to its own catalogue."
  foreach ($x in $RETIRED) {
    $r += "/produto.html  id=$($x.id)  /  302!"
    $r += "/lupas/$($x.slug)  /  302!"
    foreach ($lang in $LANGS | Where-Object { $_ -ne "pt" }) {
      $r += "/$lang/lupas/$($x.slug)  /$lang/  302!"
    }
  }
}

# Before the product rules below, and this matters: Netlify's * matches across
# slashes, so /camisas/* would swallow /camisas/liga/premier-league and hand it
# to produto.html, which would look for a model of that name and find none.
if ($GROUPS.Count) {
  $r += "", "# A league inside a category is the catalogue, opened on that league.",
        "# script.js reads the address back; the edge function writes the head."
  foreach ($cat in $GROUPS.Keys) {
    $base = "/$($CATEGORIES[$cat].path)/$($GROUPS[$cat].path)/*"
    foreach ($lang in $LANGS | Where-Object { $_ -ne "pt" }) {
      $r += "/$lang$base  /index.html  200"
    }
    $r += "$base  /index.html  200"
  }
}

# The model rules come before the catch-all, or /en/lupas/x would be rewritten
# to /lupas/x, which is not a file on disk and would 404.
$r += "", "# Serve the product page at its own address without changing the bar.",
      "# One pair of rules per category that has products in it."
foreach ($path in ($products | ForEach-Object { $_.path } | Select-Object -Unique)) {
  foreach ($lang in $LANGS | Where-Object { $_ -ne "pt" }) {
    $r += "/$lang/$path/*  /produto.html  200"
  }
  $r += "/$path/*  /produto.html  200"
}

$r += "", "# The Meta catalogue feed. Generated per request from products.js rather",
      "# than kept as a file, so a sale cannot leave a sold pair being advertised",
      "# until someone remembers to regenerate it. The address is the one already",
      "# registered in Commerce Manager, so it has to keep working."
$r += "/meta-feed.csv  /.netlify/functions/meta-feed  200"

$r += "", "# The translated addresses are the same files, read in another language:",
      "# i18n.js takes the language from the prefix that is still in the address bar.",
      "# Netlify ignores the trailing slash when it matches, so the first rule",
      "# answers both /en and /en/. Do not add a /en -> /en/ redirect: it matches",
      "# /en/ as well and the address redirects to itself, forever."
foreach ($lang in $LANGS | Where-Object { $_ -ne "pt" }) {
  $r += "/$lang/  /index.html  200", "/$lang/*  /:splat  200"
}
[System.IO.File]::WriteAllText((Join-Path $Root "_redirects"),
  ($r -join "`n") + "`n", (New-Object System.Text.UTF8Encoding($false)))

"sitemap.xml : {0} modelos, {1} paginas, {2} urls em {3} linguas" -f
  $products.Count, $pages.Count, $urlCount, $LANGS.Count
$rules = $r | Where-Object { $_ -match '\s(200|30\d!?)$' }
"_redirects  : {0} redirecionamentos + {1} reescritas" -f
  @($rules | Where-Object { $_ -match '30\d!?$' }).Count,
  @($rules | Where-Object { $_ -match '200$' }).Count
