# Fetches a shirt's photos from the supplier into tools/camisas-originais/<id>,
# which is where inset-camisas.ps1 reads them from.
#
#   .\tools\fetch-camisas.ps1 -Id portugal-26-27 -Handle camisola-portugal-...
#
# It asks the shop's own product JSON - <handle>.js - rather than reading the
# page. The page carries banners, badges and a logo alongside the garment, and
# telling those apart by looking at them is guesswork; the JSON carries the
# product's own images and nothing else.
#
# Photos are kept in the shop's own display order, which is NOT the order the
# numbers in their filenames suggest. Sorting by that number looked tidier and
# was wrong: Portugal's file _9 is the front of the shirt and _1 is the back, so
# the catalogue card led with a photo of someone's shoulder blades. The shop
# already decided which photo sells the shirt; that decision is the one to keep.
#
# The originals are kept as they come, unmarked. inset-camisas.ps1 builds the
# framed copies from them and watermark.ps1 marks those, so the clean source
# survives every change of mind about the framing.
param(
  [Parameter(Mandatory = $true)][string]$Id,
  [Parameter(Mandatory = $true)][string]$Handle,
  # Where it files in the catalogue, e.g. selecoes/europa.
  [string]$Liga = "",
  # 35 for a shirt, 40 for long sleeves and for a two-piece training set.
  [int]$Preco = 35,
  [string]$Shop = "https://www.afabricadastailandesas.com",
  [string]$Root = (Split-Path $PSScriptRoot -Parent)
)

$destino = Join-Path $Root "tools\camisas-originais\$Id"
if (-not (Test-Path $destino)) { New-Item -ItemType Directory $destino -Force | Out-Null }

$dados = Invoke-RestMethod "$Shop/products/$Handle.js" -TimeoutSec 30
if (-not $dados.images -or -not $dados.images.Count) { throw "Sem fotos em $Handle." }

$i = 0
foreach ($url in $dados.images) {
  $i++
  # The JSON gives protocol-relative urls.
  $cheio = if ($url.StartsWith("//")) { "https:$url" } else { $url }
  $ficheiro = Join-Path $destino "$i.jpeg"
  Invoke-WebRequest $cheio -OutFile $ficheiro -TimeoutSec 60
  $tamanho = [int]((Get-Item $ficheiro).Length / 1KB)
  "{0,-18} {1}.jpeg  {2} KB" -f $Id, $i, $tamanho
}

# The supplier's own title, the address it came from and what it will be sold
# for, written beside the photos. The supplier's URLs do not always match their
# titles - one link saying 2014 turned out to be the 1994 shirt - so the title
# is what the catalogue entry gets named from, and it has to survive the walk
# from here to there rather than living in someone's head.
$ficha = [ordered]@{
  id = $Id; titulo = $dados.title; handle = $Handle; liga = $Liga
  preco = $Preco; fotos = $i; obtido = (Get-Date).ToString("yyyy-MM-dd")
}
$json = ($ficha | ConvertTo-Json)
[System.IO.File]::WriteAllText((Join-Path $destino "_ficha.json"), $json,
  (New-Object System.Text.UTF8Encoding($false)))

"$Id : $i fotos  ->  $($dados.title)"
