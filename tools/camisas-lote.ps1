# Fetches a batch of shirts, retrying each one when the shop answers 429.
# The shop throttles hard once a few hundred requests have gone through, and a
# refused fetch leaves a product out of the catalogue silently.
#   .\tools\camisas-lote.ps1 -Liga brasileirao/flamengo -Ficheiro flamengo.json
#
# The file is a list of the id each shirt should have and the address it comes
# from. The id is NOT taken from the address: the shop's addresses do not match
# their own titles, so check what came back and rename with camisas-renomear.ps1
# where they disagree.
#
#   [ { "id": "flamengo-26-27", "h": "camisola-flamengo-i-26-27-homem" } ]
param(
  [Parameter(Mandatory = $true)][string]$Ficheiro,
  [Parameter(Mandatory = $true)][string]$Liga,
  [string]$Root = (Split-Path $PSScriptRoot -Parent)
)

$lote = Get-Content $Ficheiro -Raw -Encoding UTF8 | ConvertFrom-Json
$maus = @()

foreach ($c in $lote) {
  if (Test-Path (Join-Path $Root "tools\camisas-originais\$($c.id)\_ficha.json")) {
    "{0,-42} ja existe" -f $c.id
    continue
  }
  $ok = $false
  for ($t = 1; $t -le 5 -and -not $ok; $t++) {
    try {
      Start-Sleep -Seconds (3 * $t)
      $linha = & "$Root\tools\fetch-camisas.ps1" -Id $c.id -Handle $c.h -Liga $Liga -Root $Root -ErrorAction Stop |
        Select-Object -Last 1
      "$linha"
      $ok = $true
    } catch { }
  }
  if (-not $ok) { $maus += $c.id; "{0,-42} FALHOU 5x" -f $c.id }
}

""
"falharam: $($maus.Count)"
$maus
