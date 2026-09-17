# Fills in the supplier price of every record that has none, a whole collection
# at a time.
#
# Asking for one product at a time is what got us throttled: a hundred and
# thirty records is a hundred and thirty requests, and the shop shuts the door
# after a few hundred. But Shopify also serves a whole collection in one call -
# /collections/<handle>/products.json?limit=250 - with every product's handle
# and price in it. Twenty-five requests instead of a hundred and thirty, and
# each one answers for dozens of shirts.
#
# It only ever writes a price it actually received. A refused collection leaves
# its shirts untouched and named at the end, because a missing price silently
# becomes the wrong one.
param(
  [string]$Root = (Split-Path $PSScriptRoot -Parent),
  [string]$Shop = "https://www.afabricadastailandesas.com",
  [int]$PausaMs = 2500
)

# Every record that still needs a price, kept by handle so a collection's
# answer can be matched against it.
$porHandle = @{}
foreach ($p in (Get-ChildItem (Join-Path $Root "tools\camisas-originais") -Directory)) {
  $c = Join-Path $p.FullName "_ficha.json"
  if (-not (Test-Path $c)) { continue }
  $f = Get-Content $c -Raw -Encoding UTF8 | ConvertFrom-Json
  if ([double]$f.precoFornecedor -le 0 -and $f.handle) {
    $porHandle[$f.handle] = [pscustomobject]@{ caminho = $c; ficha = $f }
  }
}
"sem preco: $($porHandle.Count)"

# The shop files a shirt under its team, so the collections to ask for are the
# teams these shirts belong to. Under a club league the league itself ends with
# the team - brasileirao/flamengo - but under Selecoes it ends with the
# CONTINENT, selecoes/americas, and the country only appears in the id. Reading
# the last segment for both asked the shop for a collection called "americas",
# which does not exist, and left seventy-eight shirts without a price.
$PAISES = @("africa-do-sul", "arabia-saudita", "costa-marfim", "estados-unidos",
  "cabo-verde", "inglaterra", "dinamarca", "argentina", "venezuela", "colombia",
  "marrocos", "alemanha", "portugal", "escocia", "romenia", "senegal", "ucrania",
  "argelia", "belgica", "croacia", "equador", "espanha", "holanda", "jamaica",
  "noruega", "nigeria", "uruguai", "brasil", "canada", "coreia", "franca",
  "italia", "mexico", "suecia", "gales", "japao", "egito", "gana", "peru",
  "suica") | Sort-Object { $_.Length } -Descending

# A few teams are spelled differently in the shop than in this catalogue.
$outroNome = @{
  "vasco" = "vasco-da-gama"; "juventus-mooca" = "juventus-da-mooca"
  "sport-recife" = "sport"; "athletico-pr" = "athletico-paranaense"
}
$coleccoes = @{}
foreach ($x in $porHandle.Values) {
  $equipa = ""
  if ($x.ficha.liga -like "selecoes/*") {
    foreach ($p in $PAISES) { if ($x.ficha.id -eq $p -or $x.ficha.id.StartsWith("$p-")) { $equipa = $p; break } }
  } else {
    $partes = ($x.ficha.liga -split "/")
    $equipa = $partes[$partes.Count - 1]
  }
  if (-not $equipa) { continue }
  $coleccoes[$(if ($outroNome.ContainsKey($equipa)) { $outroNome[$equipa] } else { $equipa })] = $true
}
"coleccoes a pedir: $($coleccoes.Count)"
""

$apanhados = 0
$masMas = @()
foreach ($col in ($coleccoes.Keys | Sort-Object)) {
  Start-Sleep -Milliseconds $PausaMs
  try {
    $d = Invoke-RestMethod "$Shop/collections/$col/products.json?limit=250" -TimeoutSec 60
  } catch {
    "{0,-24} RECUSADA" -f $col
    $masMas += $col
    continue
  }

  $neste = 0
  foreach ($prod in $d.products) {
    $x = $porHandle[$prod.handle]
    if (-not $x) { continue }
    $preco = [double]$prod.variants[0].price
    if ($preco -le 0) { continue }
    $f = $x.ficha
    $novo = [ordered]@{
      id = $f.id; titulo = $f.titulo; handle = $f.handle; liga = $f.liga
      precoFornecedor = $preco; preco = $f.preco; fotos = $f.fotos; obtido = $f.obtido
    }
    [System.IO.File]::WriteAllText($x.caminho, ($novo | ConvertTo-Json),
      (New-Object System.Text.UTF8Encoding($false)))
    $porHandle.Remove($prod.handle)
    $neste++
    $apanhados++
  }
  "{0,-24} {1,3} produtos na loja, {2,3} precos preenchidos" -f $col, $d.products.Count, $neste
}

""
"preenchidos: $apanhados"
"ainda sem preco: $($porHandle.Count)"
if ($porHandle.Count) { $porHandle.Values | ForEach-Object { "  {0,-42} {1}" -f $_.ficha.id, $_.ficha.liga } }
if ($masMas.Count) { ""; "coleccoes recusadas: $($masMas -join ', ')" }
