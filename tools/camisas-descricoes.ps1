# Writes a description for every shirt into i18n.js, in all three languages.
#
#   .\tools\camisas-descricoes.ps1
#
# The product page shows this under "A historia do modelo", and the meta
# description is built from it, so a shirt without one says "em breve" to both a
# customer and to Google. A hundred and seventy-five of them times three
# languages is not something to type, and it is not something to invent either:
# every sentence here is assembled from what the supplier's own title says and
# from what this shop knows it sells. Nothing claims official licensing, a match
# result, or a material nobody has checked.
#
# The sentences live in camisas-descricoes.json. Windows PowerShell reads a .ps1
# as ANSI unless it carries a byte order mark, so accented text inside a script
# arrives mangled - it has broken two scripts in this folder already. This file
# is ASCII and the words are somewhere they can have accents in peace.
param(
  [string]$Root = (Split-Path $PSScriptRoot -Parent)
)

$frases = Get-Content (Join-Path $PSScriptRoot "camisas-descricoes.json") -Raw -Encoding UTF8 | ConvertFrom-Json

# What kind of garment the supplier's title says it is. Order matters: a
# goalkeeper shirt for a World Cup is a goalkeeper shirt, and a retro reissue of
# a home shirt is a retro reissue.
function Tipo([string]$t) {
  if ($t -match "CONJUNTO") { return "conjunto" }
  if ($t -match "GUARDA.?REDES") { return "guardaRedes" }
  if ($t -match "RETR") { return "retro" }
  if ($t -match "EDI..O ESPECIAL|EDI..O EXPICIAL|EDICAO ESPECIAL|ESPEICAL|LIMITADA") { return "especial" }
  if ($t -match "\bIII\b") { return "terceira" }
  if ($t -match "ALTERNATIVA|\bII\b") { return "alternativa" }
  if ($t -match "PRINCIPAL|\bI\b") { return "principal" }
  return "camisola"
}

# "26/27" or "1990" or "98/99". The first one in the title, because a shirt for
# the 26/27 season sold at a 2026 tournament says both and the season is the
# one that describes the garment.
function Epoca([string]$t) {
  if ($t -match "(\d{2}/\d{2})") { return @{ valor = $Matches[1]; molde = "comEpoca" } }
  if ($t -match "\b(19\d{2}|20[0-2]\d)\b") { return @{ valor = $Matches[1]; molde = "comAno" } }
  return @{ valor = ""; molde = "semEpoca" }
}

# Which team each shirt belongs to, read from the catalogue and not from the
# record beside its photos: the record stops at the continent, and the country
# is worked out by camisas-catalogo.ps1 when it writes products.js. Reading it
# back from there is what stops a description and a menu entry ever disagreeing
# about which team a shirt is.
# Read line by line, remembering the last id seen: a league line always belongs
# to the id above it. One expression spanning both was tried first and matched
# almost nothing, because the lupas carry ids with no league between them and
# their colours carry ids of their own.
$ligaDe = @{}
$idAtual = ""
foreach ($linha in [System.IO.File]::ReadAllLines((Join-Path $Root "products.js"), [System.Text.Encoding]::UTF8)) {
  if ($linha -match '^\s+id: "([a-z0-9-]+)",\s*$') { $idAtual = $Matches[1]; continue }
  if ($linha -match '^\s+league: "([a-z0-9/-]+)",\s*$' -and $idAtual) { $ligaDe[$idAtual] = $Matches[1] }
}

$pastas = Get-ChildItem (Join-Path $Root "tools\camisas-originais") -Directory |
  Where-Object { -not $_.Name.StartsWith("_") } | Sort-Object Name

$porLingua = @{ pt = @(); en = @(); es = @() }
$semPais = @()

foreach ($p in $pastas) {
  $caminho = Join-Path $p.FullName "_ficha.json"
  if (-not (Test-Path $caminho)) { continue }
  $f = Get-Content $caminho -Raw -Encoding UTF8 | ConvertFrom-Json
  if (-not (Test-Path (Join-Path $Root "images\products\$($f.id)"))) { continue }

  $titulo = $f.titulo.ToUpperInvariant()
  $tipo = Tipo $titulo
  $ep = Epoca $titulo

  $liga = $ligaDe[$f.id]
  if (-not $liga) { $semPais += $f.id; continue }
  $partes = ($liga -split "/")
  $pais = $partes[$partes.Count - 1]
  # -notcontains, not .Contains(): the property-name list is a PowerShell
  # collection, and calling .Contains on it answers false for everything.
  if ($frases.paises.PSObject.Properties.Name -notcontains $pais) { $semPais += $f.id; continue }

  foreach ($lg in @("pt", "en", "es")) {
    $L = $frases.$lg
    $texto = $L.($ep.molde)
    $texto = $texto.Replace("{pais}", $frases.paises.$pais.$lg)
    $texto = $texto.Replace("{tipo}", $L.tipos.$tipo)
    $texto = $texto.Replace("{epoca}", $ep.valor)

    if ($titulo -match "VERS.O JOGADOR") { $texto += $L.jogador }
    if ($titulo -match "TOP CROPPED") { $texto += $L.cropped }
    elseif ($titulo -match "\bMULHER\b") { $texto += $L.mulher }
    if ($titulo -match "MANGA (LONGA|LARGA)") { $texto += $L.mangaLonga }
    $texto += $(if ($tipo -eq "conjunto") { $L.fechaConjunto } else { $L.fecha })

    $escapado = $texto.Replace('\', '\\').Replace('"', '\"')
    $porLingua[$lg] += '    "history.' + $f.id + '": "' + $escapado + '",'
  }
}

$INICIO = "    // >>> descricoes geradas por tools/camisas-descricoes.ps1 - nao editar a mao"
$FIM    = "    // <<< fim das descricoes geradas"

$ficheiro = Join-Path $Root "i18n.js"
$texto = [System.IO.File]::ReadAllText($ficheiro, [System.Text.Encoding]::UTF8)

# One block per language, replaced in place. Written from the end backwards so
# the earlier blocks' offsets are still good after the later ones move.
# The three places to write, found before anything is written. Finding them one
# at a time as the file changes underneath does not work: after the first block
# goes in, the file contains the marker, so the next pass took the replace path
# and overwrote the block just written - Spanish ended up holding the Portuguese
# text and two languages were never written at all.
$sitios = @()
if ($texto.Contains($INICIO)) {
  foreach ($m in [regex]::Matches($texto, [regex]::Escape($INICIO) + '[\s\S]*?' + [regex]::Escape($FIM))) {
    $sitios += @{ inicio = $m.Index; fim = $m.Index + $m.Length }
  }
} else {
  # First run. Each language block carries one hand-written line for the first
  # shirt; that line is where this one goes, and it goes away with it, because
  # the generator now writes that shirt's description too.
  foreach ($m in [regex]::Matches($texto, '(?m)^[ \t]*"history\.brasil-26-27": "[^"]*",[ \t]*\r?\n')) {
    $sitios += @{ inicio = $m.Index; fim = $m.Index + $m.Length }
  }
}
if ($sitios.Count -ne 3) { throw "Esperava tres sitios onde escrever, encontrei $($sitios.Count)." }

# The language blocks are in the order they appear in the file: pt, en, es.
# Written from the last backwards, so the earlier offsets are still good.
$linguas = @("pt", "en", "es")
for ($i = 2; $i -ge 0; $i--) {
  $lg = $linguas[$i]
  $bloco = "$INICIO`n" + (($porLingua[$lg]) -join "`n") + "`n$FIM"
  $texto = $texto.Substring(0, $sitios[$i].inicio) + $bloco + "`n" + $texto.Substring($sitios[$i].fim)
}

[System.IO.File]::WriteAllText($ficheiro, $texto, (New-Object System.Text.UTF8Encoding($false)))
"{0} descricoes escritas ({1} por lingua)" -f ($porLingua.pt.Count * 3), $porLingua.pt.Count
if ($semPais.Count) { "sem pais reconhecido: " + ($semPais -join ", ") }
