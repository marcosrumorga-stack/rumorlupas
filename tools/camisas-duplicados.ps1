# Looks for the same shirt sold twice under two ids.
#
# Three ways, weakest to strongest:
#   - the same supplier address fetched twice, which is the same product;
#   - the same title, which is almost always the same product;
#   - the same photographs, byte for byte, which is the same product even when
#     the supplier gave the two listings different names.
#
# The photo check compares the FIRST photo, because that is the one the shop
# chose to lead with and the one the card shows. Two shirts sharing a lead photo
# are either the same garment or one of them is mislabelled; both are worth
# looking at.
param(
  [string]$Root = (Split-Path $PSScriptRoot -Parent)
)

$fichas = @()
foreach ($p in (Get-ChildItem (Join-Path $Root "tools\camisas-originais") -Directory | Sort-Object Name)) {
  $c = Join-Path $p.FullName "_ficha.json"
  if (Test-Path $c) { $fichas += (Get-Content $c -Raw -Encoding UTF8 | ConvertFrom-Json) }
}
"camisolas: $($fichas.Count)"
""

"=== o mesmo endereco no fornecedor ==="
$porHandle = $fichas | Where-Object { $_.handle } | Group-Object handle | Where-Object { $_.Count -gt 1 }
if (-not $porHandle) { "  nenhum" }
$porHandle | ForEach-Object {
  "  {0}" -f $_.Name
  $_.Group | ForEach-Object { "      {0,-42} {1}" -f $_.id, $_.titulo }
}

""
"=== o mesmo titulo ==="
$porTitulo = $fichas | Group-Object { $_.titulo.ToUpperInvariant().Trim() -replace "\s+", " " } | Where-Object { $_.Count -gt 1 }
if (-not $porTitulo) { "  nenhum" }
$porTitulo | ForEach-Object {
  "  {0}" -f $_.Group[0].titulo
  $_.Group | ForEach-Object { "      {0,-42} {1}" -f $_.id, $_.handle }
}

""
"=== a mesma primeira fotografia ==="
$porFoto = @{}
foreach ($f in $fichas) {
  $d = Join-Path $Root "images\products\$($f.id)"
  if (-not (Test-Path $d)) { continue }
  $primeira = Get-ChildItem $d -File -Filter *.jpeg |
    Sort-Object { if ($_.BaseName -match "^\d+$") { [int]$_.BaseName } else { 9999 } } |
    Select-Object -First 1
  if (-not $primeira) { continue }
  $h = (Get-FileHash $primeira.FullName -Algorithm MD5).Hash
  if (-not $porFoto.ContainsKey($h)) { $porFoto[$h] = @() }
  $porFoto[$h] += $f
}
$iguais = $porFoto.GetEnumerator() | Where-Object { $_.Value.Count -gt 1 }
if (-not $iguais) { "  nenhum" }
$iguais | ForEach-Object {
  "  ---"
  $_.Value | ForEach-Object { "      {0,-42} {1} EUR   {2}" -f $_.id, $_.preco, $_.titulo }
}
