# Finds shirts whose id CONTRADICTS the supplier's own title.
#
# The supplier's addresses do not always match what they are selling: a link
# saying "brasil-i-70" returned the 2018 away shirt, and two Argentina links had
# their I and II the wrong way round. The title is what the catalogue names the
# product from, so an id carrying a different year is a URL that lies.
#
# It flags a contradiction, never an omission. An id with no year in it claims
# nothing and is fine; "-ii" on the end is this catalogue's way of telling two
# listings of the same shirt apart, so it is not read as a kit number - only
# "-alt" and "-iii" say which kit.
#
# It only reports. Renaming is done deliberately, because a swapped pair needs a
# third name in the middle.
param(
  [string]$Root = (Split-Path $PSScriptRoot -Parent)
)

function EpocaTitulo([string]$t) {
  if ($t -match "(\d{2})/(\d{2})") { return "$($Matches[1])-$($Matches[2])" }
  if ($t -match "\b(19\d{2}|20[0-2]\d)\b") { return $Matches[1] }
  return ""
}

# What the id itself claims: a season like 26-27, or a four-figure year.
function EpocaId([string]$id) {
  if ($id -match "(\d{2})-(\d{2})(-|$)") { return "$($Matches[1])-$($Matches[2])" }
  if ($id -match "(19\d{2}|20[0-2]\d)(-|$)") { return $Matches[1] }
  return ""
}

# A season and a year are the same thing said two ways: a title that says
# "Copa do Mundo 2026" and an id that says 26-27 agree, and so do "MUNDIAL 94"
# and 1994.
function MesmaEpoca([string]$a, [string]$b) {
  if ($a -eq $b) { return $true }
  $anos = @($a, $b) | ForEach-Object {
    if ($_ -match "^(\d{2})-(\d{2})$") { @("20$($Matches[1])", "20$($Matches[2])", "19$($Matches[1])", "19$($Matches[2])") }
    else { @($_) }
  }
  $ligacao = @($anos[0]) | Where-Object { @($anos[1]) -contains $_ }
  return [bool]$ligacao
}

# The supplier writes Roman numerals with lowercase L as often as with I, so
# lI, Il, ll and II all mean the same thing.
function EquipaTitulo([string]$t) {
  $u = ($t -replace "[lL]", "I")
  if ($u -match "\bIII\b") { return "III" }
  if ($u -match "\bII\b")  { return "II" }
  if ($u -match "ALTERNATIVA") { return "II" }
  if ($u -match "\bI\b" -or $u -match "PRINCIPAL") { return "I" }
  return ""
}

$linhas = @()
foreach ($p in (Get-ChildItem (Join-Path $Root "tools\camisas-originais") -Directory | Sort-Object Name)) {
  $c = Join-Path $p.FullName "_ficha.json"
  if (-not (Test-Path $c)) { continue }
  $f = Get-Content $c -Raw -Encoding UTF8 | ConvertFrom-Json

  $epT = EpocaTitulo $f.titulo
  $epI = EpocaId $f.id
  $eqT = EquipaTitulo $f.titulo
  # This catalogue says which kit two ways - "alt" and "ii" both mean the
  # second - because half the shirts were named before the other half.
  $eqI = if ($f.id -match "-iii(-|$)") { "III" }
    elseif ($f.id -match "-(alt|ii)(-|$)") { "II" }
    else { "I" }

  $queixas = @()
  # Both have to say something, and say something different, to be a lie.
  if ($epT -and $epI -and -not (MesmaEpoca $epT $epI)) { $queixas += "o titulo diz $epT, o id diz $epI" }
  if ($eqT -and $eqT -ne $eqI) { $queixas += "o titulo diz $eqT, o id diz $eqI" }

  if ($queixas.Count) {
    $linhas += [pscustomobject]@{ id = $f.id; titulo = $f.titulo; problema = ($queixas -join " | ") }
  }
}

"ids que contradizem o titulo: $($linhas.Count)"
""
$linhas | ForEach-Object { "{0}`n    {1}`n    {2}" -f $_.id, $_.titulo, $_.problema }
