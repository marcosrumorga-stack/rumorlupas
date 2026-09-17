# Writes the shirt entries into products.js, between two markers, from the
# records under tools/camisas-originais.
#
#   .\tools\camisas-catalogo.ps1                    # all of them
#   .\tools\camisas-catalogo.ps1 -So portugal-26-27,japao-26-27
#
# Generated rather than typed because there are a hundred and seventy-five of
# them and each needs an id, a name, a short name, a league, a price and a list
# of photos. Everything it writes comes from a record written when the photos
# were fetched, so the catalogue and the folder of images cannot drift apart.
#
# It only ever replaces what is between the markers. Anything hand-written
# outside them, the lupas and the first shirt included, is left alone.
#
# Every byte of this file is ASCII, on purpose, and no escape sequence for a
# non-ASCII character appears in it either. Windows PowerShell reads a .ps1 as
# ANSI unless it carries a byte order mark, so a UTF-8 source arrives with its
# accents mangled, and an en dash inside a character class was twice enough to
# make the whole script a parse error. Characters outside ASCII are built from
# their code points at runtime instead. The names this produces are of course
# full of accents; those come from the supplier's text, read as UTF-8.
param(
  [string]$Root = (Split-Path $PSScriptRoot -Parent),
  [string[]]$So = @()
)

$ABRE   = [string][char]40    # (
$FECHA  = [string][char]41    # )
$TRACOS = "-" + [char]0x2013 + [char]0x2014   # hyphen, en dash, em dash

# Words that stay lowercase inside a name, and fragments that stay as they are.
$MINUSCULAS = @("de", "do", "da", "dos", "das", "e", "x", "com", "sem", "a", "o")
$INTACTAS = @("II", "III", "IV", "VI", "I", "GR", "DBZ", "F1", "ESL", "NBA",
              "TOP", "CROPPED", "BRINGBACK", "REMIXED", "OVERSIZED")

function Palavra([string]$w, [int]$posicao) {
  if ($INTACTAS -contains $w) { return $w }
  # 26/27, 98/99, 1994: leave anything starting with a digit alone.
  if ($w -match "^[0-9]") { return $w }
  $baixo = $w.ToLowerInvariant()
  if ($posicao -gt 0 -and $MINUSCULAS -contains $baixo) { return $baixo }
  if ($baixo.Length -lt 1) { return $baixo }
  $baixo.Substring(0, 1).ToUpperInvariant() + $baixo.Substring(1)
}

# "CAMISOLA PORTUGAL PRINCIPAL 26/27 ... (VERSAO JOGADOR)" ->
# "Camisola Portugal Principal 26/27 ... (Versao Jogador)"
function Nome([string]$titulo) {
  $t = ($titulo -replace "\s+", " ").Trim()
  # The supplier writes a hyphen, an en dash, a pipe, or nothing. One dash here.
  $t = $t -replace ("\s*[" + [regex]::Escape($TRACOS) + "]\s*"), " - "
  $t = $t -replace "\s*\|\s*", " - "
  $partes = $t -split " "
  $saida = @()
  for ($i = 0; $i -lt $partes.Count; $i++) {
    $w = $partes[$i]
    if ($w -eq "-") { $saida += "-"; continue }
    if ($w.Length -eq 0) { continue }
    # Compared character by character, not with StartsWith: passing it a string
    # built from a char code matched every word, stripping the first and last
    # letter of each - CAMISOLA came out as Amisol.
    # Compared character by character, and rebuilt from the same char codes
    # rather than from a variable declared at the top of the script: the
    # brackets came back empty inside here, so "(VERSAO JOGADOR)" lost both of
    # them and the name read "Homem Versao Jogador".
    $abre = ""; $fecha = ""
    if ($w[0] -eq [char]40) { $abre = [string][char]40; $w = $w.Substring(1) }
    if ($w.Length -eq 0) { continue }
    if ($w[$w.Length - 1] -eq [char]41) { $fecha = [string][char]41; $w = $w.Substring(0, $w.Length - 1) }
    if ($w.Length -eq 0) { continue }
    $saida += ($abre + (Palavra $w $i) + $fecha)
  }
  $nome = (($saida -join " ") -replace "\s+", " ").Trim()

  # The supplier types country names without their accents, and sometimes in
  # another language. On our own pages they are spelled properly. Keyed by what
  # comes out of the casing above, and applied only as a whole word so Italia
  # inside another word is left alone.
  $PAISES = @{
    "Mexico" = [char]0x4D + [char]0x00E9 + "xico"
    "Belgica" = "B" + [char]0x00E9 + "lgica"
    "Escocia" = "Esc" + [char]0x00F3 + "cia"
    "Italia" = "It" + [char]0x00E1 + "lia"
    "Suica" = "Su" + [char]0x00ED + [char]0x00E7 + "a"
    "Nigeria" = "Nig" + [char]0x00E9 + "ria"
    "Romenia" = "Rom" + [char]0x00E9 + "nia"
    "Ucrania" = "Ucr" + [char]0x00E2 + "nia"
    "Colombia" = "Col" + [char]0x00F4 + "mbia"
    "Croacia" = "Cro" + [char]0x00E1 + "cia"
    "Suecia" = "Su" + [char]0x00E9 + "cia"
    "Argelia" = "Arg" + [char]0x00E9 + "lia"
    "Arabia" = [char]0x00C1 + "rabia"
    "Canada" = "Canad" + [char]0x00E1
    "Korea" = "Coreia"
    "Africa" = [char]0x00C1 + "frica"
    "Japao" = "Jap" + [char]0x00E3 + "o"
  }
  foreach ($errado in $PAISES.Keys) {
    $nome = $nome -replace ("\b" + $errado + "\b"), $PAISES[$errado]
  }
  $nome
}

# What the search result leads with: the shirt without the tournament, the
# gender and the version, which is where the interesting words stop.
function NomeCurto([string]$nome) {
  $curto = $nome
  $cortes = @(" Copa do Mundo", " - Homem", " - Mulher", " " + $ABRE, " Homem", " Mulher")
  foreach ($corte in $cortes) {
    $i = $curto.IndexOf($corte)
    if ($i -gt 12) { $curto = $curto.Substring(0, $i) }
  }
  $curto.Trim((" -").ToCharArray())
}

# The national team each id belongs to. Longest first, so estados-unidos wins
# over a shorter slug that happens to be a prefix of it, and cabo-verde is not
# read as cabo. A shirt whose id matches none of these files under its continent
# with no team, which the menu simply does not list.
$SELECOES = @("africa-do-sul", "arabia-saudita", "costa-marfim", "estados-unidos",
  "cabo-verde", "inglaterra", "dinamarca", "argentina", "venezuela", "colombia",
  "marrocos", "alemanha", "portugal", "escocia", "romenia", "senegal", "ucrania",
  "argelia", "belgica", "croacia", "equador", "espanha", "holanda", "jamaica",
  "noruega", "nigeria", "uruguai", "brasil", "canada", "coreia", "franca",
  "italia", "mexico", "suecia", "gales", "japao", "egito", "gana", "peru",
  "suica") | Sort-Object { $_.Length } -Descending

function Selecao([string]$id) {
  foreach ($s in $SELECOES) { if ($id -eq $s -or $id.StartsWith("$s-")) { return $s } }
  return ""
}

$pastas = Get-ChildItem (Join-Path $Root "tools\camisas-originais") -Directory |
  Where-Object { -not $_.Name.StartsWith("_") } | Sort-Object Name
if ($So.Count) { $pastas = $pastas | Where-Object { $So -contains $_.Name } }

$entradas = @()
$fichas = @()
$semFotos = @()
foreach ($p in $pastas) {
  $caminho = Join-Path $p.FullName "_ficha.json"
  if (-not (Test-Path $caminho)) { "SEM FICHA: $($p.Name)"; continue }
  $f = Get-Content $caminho -Raw -Encoding UTF8 | ConvertFrom-Json

  $dir = Join-Path $Root "images\products\$($f.id)"
  $fotos = @()
  if (Test-Path $dir) {
    $fotos = @(Get-ChildItem $dir -File -Filter *.jpeg | Sort-Object { [int]($_.BaseName) })
  }
  if (-not $fotos.Count) { $semFotos += $f.id; continue }

  $nome = Nome $f.titulo
  $curto = NomeCurto $nome
  $selecao = Selecao $f.id
  $liga = if ($selecao) { "$($f.liga)/$selecao" } else { $f.liga }
  if (-not $selecao) { "SEM SELECAO RECONHECIDA: $($f.id)" }
  $linhasFoto = ($fotos | ForEach-Object { '      "images/products/' + $f.id + '/' + $_.Name + '",' }) -join "`n"
  $fichas += [pscustomobject]@{ id = $f.id; nome = $nome; preco = $f.preco }

  $entradas += @"
  {
    id: "$($f.id)",
    name: "$nome",
    namesItself: true,
    titleName: "$curto",
    slug: "$($f.id)",
    category: "camisas",
    league: "$liga",
    price: $($f.preco),
    personalisation: 5,
    images: [
$linhasFoto
    ],
    colors: [
      { id: "s", name: "S" }, { id: "m", name: "M" }, { id: "l", name: "L" },
      { id: "xl", name: "XL" }, { id: "xxl", name: "XXL" },
    ],
  },
"@
}

# ---------- the checkout function's own table ----------
# That file keeps a price list of its own on purpose: what a browser sends is
# never what it charges. Generating both from the same records keeps that
# property - the browser still cannot reach it - while removing the only real
# risk in having two lists, which is that one of them is forgotten. Before this,
# a hundred and seventy-four shirts were in the catalogue and in no price list,
# so every one of them would have been refused at the till.
$linhasCheckout = @()
foreach ($e in $fichas) {
  $linhasCheckout += '  "' + $e.id + '": { name: "' + $e.nome + '", price: ' + $e.preco +
    ', printing: 5, group: "camisas", minimum: 2, deliveryDays: [10, 21],' + "`n" +
    '    colors: { s: "S", m: "M", l: "L", xl: "XL", xxl: "XXL" } },'
}

$INICIO_CK = "  // >>> camisas geradas por tools/camisas-catalogo.ps1 - nao editar a mao"
$FIM_CK    = "  // <<< fim das camisas geradas"
$ckFile = Join-Path $Root "netlify\functions\create-checkout-session.js"
$ck = [System.IO.File]::ReadAllText($ckFile, [System.Text.Encoding]::UTF8)
$blocoCk = "$INICIO_CK`n" + ($linhasCheckout -join "`n") + "`n$FIM_CK"
if ($ck.Contains($INICIO_CK)) {
  $a = $ck.IndexOf($INICIO_CK)
  $b = $ck.IndexOf($FIM_CK) + $FIM_CK.Length
  $ck = $ck.Substring(0, $a) + $blocoCk + $ck.Substring($b)
} else {
  # First run: in front of the line that closes the price table. Found by
  # walking back from the comment that follows it rather than by matching a
  # run of newlines, because this file is stored with Windows line endings and
  # a pattern written with Unix ones silently matches nothing.
  $depois = $ck.IndexOf("// Mirrors cleanPrinting()")
  if ($depois -lt 0) { throw "Nao encontrei o comentario que segue a tabela de precos." }
  $i = $ck.LastIndexOf("};", $depois)
  if ($i -lt 0) { throw "Nao encontrei o fim da tabela de precos em create-checkout-session.js." }
  $ck = $ck.Substring(0, $i) + $blocoCk + "`n" + $ck.Substring($i)
}
[System.IO.File]::WriteAllText($ckFile, $ck, (New-Object System.Text.UTF8Encoding($false)))
"$($linhasCheckout.Count) camisas escritas na tabela do checkout"

$INICIO = "  // >>> camisas geradas por tools/camisas-catalogo.ps1 - nao editar a mao"
$FIM    = "  // <<< fim das camisas geradas"

$ficheiro = Join-Path $Root "products.js"
$texto = [System.IO.File]::ReadAllText($ficheiro, [System.Text.Encoding]::UTF8)
$bloco = "$INICIO`n" + ($entradas -join "`n") + "`n$FIM"

if ($texto.Contains($INICIO)) {
  $a = $texto.IndexOf($INICIO)
  $b = $texto.IndexOf($FIM) + $FIM.Length
  $texto = $texto.Substring(0, $a) + $bloco + $texto.Substring($b)
} else {
  $fecho = "`n];"
  $i = $texto.LastIndexOf($fecho)
  if ($i -lt 0) { throw "Nao encontrei o fim do array PRODUCTS em products.js." }
  $texto = $texto.Substring(0, $i) + "`n" + $bloco + $texto.Substring($i)
}

[System.IO.File]::WriteAllText($ficheiro, $texto, (New-Object System.Text.UTF8Encoding($false)))
"$($entradas.Count) camisas escritas em products.js"
if ($semFotos.Count) { "sem fotos tratadas, deixadas de fora: $($semFotos.Count)" }
