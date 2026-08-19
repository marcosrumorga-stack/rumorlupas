# Rebuilds sitemap.xml from products.js, so the list of models never has to be
# kept in step by hand. Run it after adding or removing a product:
#
#   .\tools\sitemap.ps1
#
param(
  [string]$Root = ".",
  [string]$Site = "https://rumorlupas.com"
)

$productsFile = Join-Path $Root "products.js"
$source = [System.IO.File]::ReadAllText((Resolve-Path $productsFile), [System.Text.Encoding]::UTF8)

# Only the ids inside PRODUCTS, and only at product level — colour ids sit
# deeper and the file's comments carry an example id that must not be picked up.
$block = [regex]::Match($source, 'const PRODUCTS = \[(.*?)\n\];', 'Singleline').Groups[1].Value
$block = [regex]::Replace($block, '(?m)^\s*//.*$', '')
$ids = [regex]::Matches($block, '(?m)^\s{2,4}(\{ )?id: "([a-z0-9.-]+)"') | ForEach-Object { $_.Groups[2].Value }

$today = (Get-Date).ToString("yyyy-MM-dd")
$lines = @('<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

function Add-Url([string]$loc, [string]$priority, [string]$freq) {
  $script:lines += "  <url>"
  $script:lines += "    <loc>$loc</loc>"
  $script:lines += "    <lastmod>$today</lastmod>"
  $script:lines += "    <changefreq>$freq</changefreq>"
  $script:lines += "    <priority>$priority</priority>"
  $script:lines += "  </url>"
}

Add-Url "$Site/" "1.0" "daily"
foreach ($id in $ids) { Add-Url "$Site/produto.html?id=$id" "0.8" "weekly" }
Add-Url "$Site/termos.html" "0.2" "yearly"
Add-Url "$Site/privacidade.html" "0.2" "yearly"

$lines += '</urlset>'

$out = Join-Path $Root "sitemap.xml"
[System.IO.File]::WriteAllText($out, ($lines -join "`n") + "`n", (New-Object System.Text.UTF8Encoding($false)))
"sitemap.xml: {0} modelos, {1} urls" -f $ids.Count, ($ids.Count + 3)
