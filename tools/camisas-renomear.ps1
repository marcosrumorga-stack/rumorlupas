# Renames shirt records whose id contradicts the supplier's own title.
#
# The supplier's addresses are not reliable: a link saying "brasil-i-70"
# returned the 2018 away shirt, "brasil-i-04-06" returned the 2018 home one,
# and two Argentina links had their I and II the wrong way round. The title is
# what the catalogue names a product from, so an id carrying a different year
# is a URL that lies about what it sells.
#
# Some of these are swaps - the right name for one is the wrong name still held
# by another - so every rename goes through a temporary name first. That also
# makes the order of the list not matter.
#
# It moves the record folder, the id inside the record, and the framed photos if
# they have already been built. Nothing here is published yet; a published id is
# a live address and is never renamed.
#   .\tools\camisas-renomear.ps1 -Ficheiro trocas.json -AFingir
#
# The list lives in a JSON file rather than in here, because it is different
# every time and a script that has to be edited to be run gets edited wrong:
#
#   [ { "de": "brasil-04-06", "para": "brasil-2018",
#       "porque": "o titulo diz BRASIL I 2018" } ]
#
# Run it with -AFingir first. It prints what it would do and touches nothing.
param(
  [Parameter(Mandatory = $true)][string]$Ficheiro,
  [string]$Root = (Split-Path $PSScriptRoot -Parent),
  [switch]$AFingir
)

$trocas = @(
  (Get-Content $Ficheiro -Raw -Encoding UTF8 | ConvertFrom-Json) |
    ForEach-Object { , @($_.de, $_.para, $_.porque) }
)
if (-not $trocas.Count) { throw "Nada em $Ficheiro." }

$fichas = Join-Path $Root "tools\camisas-originais"
$fotos  = Join-Path $Root "images\products"

# Nothing moves until everything checks out: a half-done set of swaps is worse
# than none, because the names left behind belong to the wrong shirts.
$erros = @()
foreach ($t in $trocas) {
  if (-not (Test-Path (Join-Path $fichas $t[0]))) { $erros += "nao existe: $($t[0])" }
  $destinoOcupado = (Test-Path (Join-Path $fichas $t[1])) -and
    -not ($trocas | Where-Object { $_[0] -eq $t[1] })
  if ($destinoOcupado) { $erros += "o destino $($t[1]) ja esta ocupado por outra camisola" }
}
if ($erros.Count) { $erros; throw "nada foi mudado." }

function MudaFicha([string]$pasta, [string]$novo) {
  $c = Join-Path $pasta "_ficha.json"
  $f = Get-Content $c -Raw -Encoding UTF8 | ConvertFrom-Json
  $novoF = [ordered]@{
    id = $novo; titulo = $f.titulo; handle = $f.handle; liga = $f.liga
    precoFornecedor = $f.precoFornecedor; preco = $f.preco
    fotos = $f.fotos; obtido = $f.obtido
  }
  [System.IO.File]::WriteAllText($c, ($novoF | ConvertTo-Json),
    (New-Object System.Text.UTF8Encoding($false)))
}

# Out of the way first, into place second.
$temp = @{}
foreach ($t in $trocas) {
  $temp[$t[0]] = "_a-mudar-$($t[0])"
  if (-not $AFingir) {
    Move-Item (Join-Path $fichas $t[0]) (Join-Path $fichas $temp[$t[0]])
    if (Test-Path (Join-Path $fotos $t[0])) {
      Move-Item (Join-Path $fotos $t[0]) (Join-Path $fotos $temp[$t[0]])
    }
  }
}
foreach ($t in $trocas) {
  if (-not $AFingir) {
    Move-Item (Join-Path $fichas $temp[$t[0]]) (Join-Path $fichas $t[1])
    MudaFicha (Join-Path $fichas $t[1]) $t[1]
    if (Test-Path (Join-Path $fotos $temp[$t[0]])) {
      Move-Item (Join-Path $fotos $temp[$t[0]]) (Join-Path $fotos $t[1])
    }
  }
  "{0,-24} -> {1,-24} {2}" -f $t[0], $t[1], $t[2]
}

""
"$($trocas.Count) renomeadas$(if ($AFingir) { ' (so a fingir)' })"
