# Builds meta-feed.csv - the product feed the Meta catalogue reads - straight
# from products.js, so stock never drifts between the shop and the catalogue.
# Meta refetches the file on its own schedule, so a sale means editing one
# number where you already edit it and running:
#
#   .\tools\catalog.ps1
#
# Each COLOUR is one item, not each model: 22 of the colours are one-of-one,
# and a catalogue that only knew models would keep advertising a Juliet that
# is gone in the blue and left only in grey. They are tied together by
# item_group_id, which is how Meta shows them as variants of one product.
param(
  [string]$Root = ".",
  [string]$Site = "https://rumorlupas.com",

  # Meta requires this on every item and treats it as a claim about the goods.
  # "new", "refurbished" or "used". Nothing in the shop states which these are,
  # so it is a parameter rather than a guess buried in the code - confirm it
  # before the feed goes anywhere near Commerce Manager.
  [ValidateSet("new", "refurbished", "used")]
  [string]$Condition = "new"
)

$ErrorActionPreference = "Stop"

$src = [System.IO.File]::ReadAllText(
  (Resolve-Path (Join-Path $Root "products.js")), [System.Text.Encoding]::UTF8)
$i18n = [System.IO.File]::ReadAllText(
  (Resolve-Path (Join-Path $Root "i18n.js")), [System.Text.Encoding]::UTF8)

# ---------- shared image constants (DARTBOARD_MODEL and friends) ----------
$consts = @{}
foreach ($m in [regex]::Matches($src, '(?m)^const ([A-Z_][A-Z0-9_]*) = "([^"]+)";')) {
  $consts[$m.Groups[1].Value] = $m.Groups[2].Value
}

# ---------- Portuguese strings, for descriptions and colour names ----------
# Only the pt block: the same keys exist three times over.
$ptBlock = [regex]::Match($i18n, '(?s)\n  pt: \{(.*?)\n  \},').Groups[1].Value
$strings = @{}
foreach ($m in [regex]::Matches($ptBlock, '"([a-zA-Z0-9._-]+)":\s*"((?:[^"\\]|\\.)*)"')) {
  $strings[$m.Groups[1].Value] = $m.Groups[2].Value -replace '\\"', '"'
}

# ---------- parse products.js by brace depth ----------
# Depth, not indentation: the photo sets are nested unevenly and one product is
# written on a single line, so counting spaces gets it wrong.
$block = [regex]::Match($src, 'const PRODUCTS = \[(.*?)\n\];', 'Singleline').Groups[1].Value
$block = [regex]::Replace($block, '(?m)^\s*//.*$', '')

$products = @()
$product = $null
$color = $null
$depth = 0

foreach ($line in ($block -split "`n")) {
  $opens = ([regex]::Matches($line, '\{')).Count
  $closes = ([regex]::Matches($line, '\}')).Count

  if ($depth -eq 0 -and $opens -gt 0) {
    $product = [pscustomobject]@{ id=""; name=""; price=0.0; colors=@(); images=@() }
    $products += $product
    $color = $null
  } elseif ($depth -eq 1 -and $opens -gt 0) {
    $color = [pscustomobject]@{ id=""; name=""; stock=$null; images=@() }
    $product.colors += $color
  }

  $target = if ($color) { $color } else { $product }

  if ($product) {
    if ($line -match '\bid: "([^"]+)"'   -and $target.id   -eq "") { $target.id = $Matches[1] }
    if ($line -match '\bname: "([^"]+)"' -and $target.name -eq "") { $target.name = $Matches[1] }
    if ($line -match '\bprice: ([0-9.]+)' -and -not $color -and $product.price -eq 0) {
      $product.price = [double]$Matches[1]
    }
    if ($color -and $line -match '\bstock: ([0-9]+)' -and $null -eq $color.stock) {
      $color.stock = [int]$Matches[1]
    }
    if ($line -match '^\s*"(images/[^"]+)",?\s*$') { $target.images += $Matches[1] }
    if ($line -match '^\s*([A-Z_][A-Z0-9_]*),\s*$' -and $consts.ContainsKey($Matches[1])) {
      $target.images += $consts[$Matches[1]]
    }
  }

  $depth += $opens - $closes
  if ($depth -le 1) { $color = $null }
  if ($depth -le 0) { $product = $null }
}

# ---------- helpers ----------
function Slug([string]$name) {
  $s = $name.ToLowerInvariant().Normalize([Text.NormalizationForm]::FormD) -replace '\p{Mn}', ''
  return "oakley-" + (($s -replace '[^a-z0-9]+', '-').Trim('-'))
}

function ColorLabel($c) {
  $key = "color.$($c.id)"
  if ($strings.ContainsKey($key)) { return $strings[$key] }
  return $c.name
}

function Csv([string]$v) {
  if ($null -eq $v) { $v = "" }
  if ($v -match '[",\r\n]') { return '"' + ($v -replace '"', '""') + '"' }
  return $v
}

# ---------- build the rows ----------
$cols = @("id","item_group_id","title","description","availability","condition","price",
          "link","image_link","additional_image_link","brand","color",
          "quantity_to_sell_on_facebook","google_product_category")
$rows = @($cols -join ",")

$items = 0; $units = 0; $soldOut = 0; $skipped = @()

foreach ($p in $products) {
  if (-not $p.id) { continue }
  $slug = Slug $p.name
  $story = $strings["history.$($p.id)"]
  $variants = if ($p.colors.Count) { $p.colors } else { @($null) }

  foreach ($c in $variants) {
    $id = if ($c) { "$($p.id)|$($c.id)" } else { $p.id }
    $imgs = if ($c) { $c.images } else { $p.images }

    # Meta rejects an item with no image, and a "Foto em breve" model has none.
    if (-not $imgs.Count) { $skipped += $id; continue }

    $stock = if ($c) { $c.stock } else { $null }
    $available = if ($null -eq $stock) { "in stock" } elseif ($stock -gt 0) { "in stock" } else { "out of stock" }
    if ($available -eq "out of stock") { $soldOut++ } else { $items++ }
    if ($null -ne $stock) { $units += $stock }

    $label = if ($c) { ColorLabel $c } else { "" }
    $title = if ($label) { "Oakley $($p.name) - $label" } else { "Oakley $($p.name)" }
    $link = "$Site/lupas/$slug" + $(if ($c) { "?cor=$($c.id)" } else { "" })

    # The head-on shot is always first in a colour's own list.
    $main = "$Site/$($imgs[0])"
    $extra = ($imgs | Select-Object -Skip 1 -First 19 | ForEach-Object { "$Site/$_" }) -join ","

    $row = @(
      (Csv $id), (Csv $p.id), (Csv $title), (Csv $story), (Csv $available), (Csv $Condition),
      # Invariant culture on purpose: a Portuguese machine formats this as
      # "49,00" and Meta rejects the row - it wants a dot.
      (Csv ($p.price.ToString("F2", [System.Globalization.CultureInfo]::InvariantCulture) + " EUR")),
      (Csv $link), (Csv $main), (Csv $extra),
      (Csv "Oakley"), (Csv $label),
      (Csv $(if ($null -ne $stock) { "$stock" } else { "" })), (Csv "178")
    )
    $rows += ($row -join ",")
  }
}

$outFile = Join-Path $Root "meta-feed.csv"
[System.IO.File]::WriteAllText($outFile, ($rows -join "`n") + "`n",
  (New-Object System.Text.UTF8Encoding($false)))

"meta-feed.csv : {0} itens a venda, {1} esgotados, {2} unidades" -f $items, $soldOut, $units
"condition     : {0}  (confirmar antes de publicar)" -f $Condition
if ($skipped.Count) { "sem foto, fora do feed: {0}" -f ($skipped -join ", ") }
