# Recomputes what every shirt is sold for, from what the supplier charges and
# what the thing is.
#
#   .\tools\camisas-precos.ps1
#
# Run it after adding shirts, or after changing a rule. It reads each product's
# record, asks the supplier for the price when the record does not already have
# it, and writes the selling price back. Slowly on purpose: the shop answers
# 429 when asked too fast, and a missing price silently becomes a wrong one.
#
# Deliberately written without a single accented character. Windows PowerShell
# reads a .ps1 as ANSI unless it carries a byte order mark, and a UTF-8 file
# without one arrives with every accent mangled - which turned RETR[O-circumflex]
# into a parse error the first time this was written. ASCII-only patterns cannot
# be broken that way, so RETR covers RETRO and RETRO-circumflex, and VERS.O
# covers VERSAO however it is spelled.
param(
  [string]$Shop = "https://www.afabricadastailandesas.com",
  [string]$Root = (Split-Path $PSScriptRoot -Parent),
  [int]$PausaMs = 400
)

# Marcos's rules, later ones correcting earlier. Order matters: the retro and
# player-version rule is tested before the 13-euro one, because plenty of retro
# shirts also cost 13 and he said those stay at 35.
function Preco([string]$titulo, [double]$fornecedor) {
  $t = $titulo.ToUpperInvariant()
  if ($t -match "CONJUNTO") { return 40 }
  if ($t -match "MANGA (LONGA|LARGA)") { return 40 }
  if ($t -match "RETR" -or $t -match "VERS.O JOGADOR") { return 35 }
  if ([Math]::Round($fornecedor) -eq 13) { return 30 }
  return 35
}

$pastas = Get-ChildItem (Join-Path $Root "tools\camisas-originais") -Directory | Sort-Object Name
$linhas = @()
$pedidos = 0

foreach ($p in $pastas) {
  $caminho = Join-Path $p.FullName "_ficha.json"
  if (-not (Test-Path $caminho)) { "SEM FICHA: $($p.Name)"; continue }
  $f = Get-Content $caminho -Raw -Encoding UTF8 | ConvertFrom-Json

  $fornecedor = if ($f.PSObject.Properties.Name -contains "precoFornecedor") { [double]$f.precoFornecedor } else { 0 }
  if ($fornecedor -le 0 -and $f.handle) {
    try {
      Start-Sleep -Milliseconds $PausaMs
      $d = Invoke-RestMethod "$Shop/products/$($f.handle).js" -TimeoutSec 30
      $fornecedor = $d.price / 100
      $pedidos++
    } catch {
      "NAO OBTIVE O PRECO DE $($f.id): $($_.Exception.Message)"
    }
  }

  $novo = [ordered]@{
    id = $f.id; titulo = $f.titulo; handle = $f.handle; liga = $f.liga
    precoFornecedor = $fornecedor
    preco = (Preco $f.titulo $fornecedor)
    fotos = (Get-ChildItem $p.FullName -File -Filter *.jpeg).Count
    obtido = $f.obtido
  }
  [System.IO.File]::WriteAllText($caminho, ($novo | ConvertTo-Json),
    (New-Object System.Text.UTF8Encoding($false)))
  $linhas += [pscustomobject]$novo
}

"$($linhas.Count) fichas, $pedidos precos pedidos ao fornecedor"
""
"=== quantas de cada preco ==="
$linhas | Group-Object preco | Sort-Object Name |
  ForEach-Object { "  {0} EUR : {1}" -f $_.Name, $_.Count }
""
"=== por liga ==="
$linhas | Group-Object liga | Sort-Object Name |
  ForEach-Object { "  {0,-20} {1}" -f $_.Name, $_.Count }
""
"=== com menos de tres fotos ==="
$magras = @($linhas | Where-Object { $_.fotos -lt 3 } | Sort-Object fotos, id)
"  {0} produtos" -f $magras.Count
$magras | ForEach-Object { "  {0,-34} {1}" -f $_.id, $_.fotos }
