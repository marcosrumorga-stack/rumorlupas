# Writes the record beside each shirt's photos: the supplier's own title, the
# address it came from, what they charge, and what we will charge.
#
#   .\tools\camisas-fichas.ps1
#
# It exists because the first sixty-odd shirts were fetched before the record
# was being kept, and because the price now depends on the supplier's: a shirt
# that is not a player version and costs them 13 EUR is sold at 30 rather than
# 35. That is not something to work out by hand eighty times.
#
# Only the product JSON is read - no photos are downloaded again.
#
# The supplier's URLs do not always match their titles: one link saying 2014 is
# the 1994 shirt, and one saying "esl" is the 2014. So the id on the left is
# what this shop calls the product and the handle on the right is only how to
# find it; the title that comes back is what the catalogue entry gets named
# from. A mismatch between them is expected, not a bug.
param(
  [string]$Shop = "https://www.afabricadastailandesas.com",
  [string]$Root = (Split-Path $PSScriptRoot -Parent)
)

$CAMISAS = @(
  @{ id = "portugal-26-27";                handle = "camisola-portugal-principal-26-27-copa-do-mundo-2026-homem-versao-jogador"; liga = "selecoes/europa" }
  @{ id = "portugal-mulher-26-27";         handle = "camisola-portugal-principal-26-27-copa-do-mundo-2026-mulher"; liga = "selecoes/europa" }
  @{ id = "portugal-alt-26-27";            handle = "camisola-portugal-alternativa-26-27-copa-do-mundo-2026-homem-versao-jogador"; liga = "selecoes/europa" }
  @{ id = "portugal-travis-scott";         handle = "camisola-portugal-cactus-jack-total-90-2026-retro"; liga = "selecoes/europa" }
  @{ id = "portugal-2016";                 handle = "camisola-portugal-2016-homem-retro"; liga = "selecoes/europa" }
  @{ id = "portugal-eusebio-25-26";        handle = "camisola-portugal-alternativa-edicao-especial-eusebio-25-26-homem"; liga = "selecoes/europa" }
  @{ id = "portugal-eusebio-mulher-25-26"; handle = "camisola-portugal-alternativa-edicao-especial-eusebio-25-26-mulher"; liga = "selecoes/europa" }

  @{ id = "espanha-26-27";                 handle = "camisola-espanha-principal-26-27-duas-estrelas-e-patch-copa-do-mundo-2026-versao-jogador"; liga = "selecoes/europa" }
  @{ id = "espanha-mulher-26-27";          handle = "camisola-espanha-principal-26-27-duas-estrelas-copa-do-mundo-2026-mulher"; liga = "selecoes/europa" }
  @{ id = "espanha-alt-26-27";             handle = "camisola-espanha-alternativa-26-27-copa-do-mundo-2026-duas-estrelas-homem"; liga = "selecoes/europa" }
  @{ id = "espanha-alt-mulher-26-27";      handle = "camisola-espanha-alternativa-26-27-duas-estrelas-copa-do-mundo-2026-mulher-1"; liga = "selecoes/europa" }
  @{ id = "espanha-alt-manga-longa-26-27"; handle = "camisola-espanha-ii-26-27-copa-do-mundo-manga-longa-versao-jogador"; liga = "selecoes/europa" }
  @{ id = "espanha-alt-ml-estrelas-26-27"; handle = "camisola-espanha-alternativa-26-27-copa-do-mundo-2026-duas-estrelas-manga-longa-homem"; liga = "selecoes/europa" }
  @{ id = "espanha-cropped-26-27";         handle = "camisola-espanha-i-26-27-copa-do-mundo-2026-top-cropped-mulher"; liga = "selecoes/europa" }
  @{ id = "espanha-cropped-ii-26-27";      handle = "camisola-espanha-ii-26-27-copa-do-mundo-2026-top-cropped-mulher"; liga = "selecoes/europa" }
  @{ id = "espanha-gr-26-27";              handle = "camisola-espanha-guarda-redes-26-27-copa-do-mundo-2026-homem"; liga = "selecoes/europa" }
  @{ id = "espanha-especial-26";           handle = "camisola-espanha-edicao-especial-copa-do-mundo-2026-homem-vermelha"; liga = "selecoes/europa" }
  @{ id = "espanha-especial-preta-26";     handle = "camisola-espanha-edicao-especial-copa-do-mundo-2026-homem-preto"; liga = "selecoes/europa" }
  @{ id = "espanha-especial-azul-26";      handle = "camisola-espanha-edicao-especial-copa-do-mundo-2026-homem-azul"; liga = "selecoes/europa" }
  @{ id = "espanha-especial-mulher-26";    handle = "camisola-espanha-edicao-especial-copa-do-mundo-2026-mulher"; liga = "selecoes/europa" }
  @{ id = "espanha-campeao-26";            handle = "camisola-espanha-edicao-especial-campeao-do-mundo-2026-homem-v1"; liga = "selecoes/europa" }
  @{ id = "espanha-travis-scott";          handle = "camisola-espanha-x-travis-scott-cactus-jack-total-90-2026-retro"; liga = "selecoes/europa" }
  @{ id = "espanha-treino-sm";             handle = "conjunto-de-treino-sem-mangas-espanha-copa-do-mundo-2026"; liga = "selecoes/europa" }

  @{ id = "alemanha-26-27";                handle = "camisola-alemanha-principal-26-27-copa-do-mundo-2026-homem-versao-jogador"; liga = "selecoes/europa" }
  @{ id = "alemanha-alt-26-27";            handle = "camisola-alemanha-alternativa-26-27-copa-do-mundo-2026-homem"; liga = "selecoes/europa" }
  @{ id = "alemanha-alt-mulher-26-27";     handle = "camisola-alemanha-alternativa-26-27-copa-do-mundo-2026-mulher"; liga = "selecoes/europa" }
  @{ id = "alemanha-remixed";              handle = "camisola-alemanha-bringback-remixed-oversized-2026-retro"; liga = "selecoes/europa" }
  @{ id = "alemanha-especial-24-25";       handle = "alemanha-edicao-especial-24-25-homem"; liga = "selecoes/europa" }
  @{ id = "alemanha-1990";                 handle = "camisola-alemanha-i-1990-homem-retro"; liga = "selecoes/europa" }
  @{ id = "alemanha-1994";                 handle = "alemania-i-2014-homem-retro"; liga = "selecoes/europa" }
  @{ id = "alemanha-2010-ii";              handle = "camisola-alemanha-ii-2010-homem-retro"; liga = "selecoes/europa" }
  @{ id = "alemanha-2014-i";               handle = "alemania-i-esl-homem"; liga = "selecoes/europa" }
  @{ id = "alemanha-2014-ii";              handle = "alemania-ii-2014-homem-retro"; liga = "selecoes/europa" }

  @{ id = "franca-26-27";                  handle = "camisola-franca-principal-26-27-copa-do-mundo-2026-homem"; liga = "selecoes/europa" }
  @{ id = "franca-alt-26-27";              handle = "camisola-franca-alternativa-26-27-copa-do-mundo-2026-homem-versao-jogador"; liga = "selecoes/europa" }
  @{ id = "franca-alt-adepto-26-27";       handle = "camisola-franca-alternativa-26-27-copa-do-mundo-2026-homem"; liga = "selecoes/europa" }
  @{ id = "franca-alt-mulher-26-27";       handle = "camisola-franca-alternativa-26-27-copa-do-mundo-2026-mulher-copia"; liga = "selecoes/europa" }
  @{ id = "franca-travis-scott";           handle = "camisola-franca-x-travis-scott-cactus-jack-total-90-2026-retro"; liga = "selecoes/europa" }
  @{ id = "franca-ml-euro-2024";           handle = "camisola-francia-i-manga-larga-euro-2024-homem-version-jogador"; liga = "selecoes/europa" }
  @{ id = "franca-euro-2024";              handle = "camisola-francia-i-euro-2024-homem"; liga = "selecoes/europa" }
  @{ id = "franca-98-99";                  handle = "francia-i-98-99-homem"; liga = "selecoes/europa" }
  @{ id = "franca-82-83";                  handle = "francia-i-82-83-homem-retro"; liga = "selecoes/europa" }
  @{ id = "franca-2006-ii";                handle = "franca-ii-2006-homem-retro"; liga = "selecoes/europa" }
  @{ id = "franca-2018";                   handle = "camisola-franca-i-2018-homem-retro"; liga = "selecoes/europa" }
  @{ id = "franca-2022-ii";                handle = "camisola-franca-ii-2022-homem-retro"; liga = "selecoes/europa" }

  @{ id = "holanda-principal-26-27";       handle = "camisola-holanda-principal-26-27-copa-do-mundo-2026-homem"; liga = "selecoes/europa" }
  @{ id = "holanda-jogador-26-27";         handle = "camisola-holanda-principal-26-27-copa-do-mundo-2026-homem-versao-jogador"; liga = "selecoes/europa" }
  @{ id = "holanda-26-27";                 handle = "camisola-holanda-dri-fit-nike-26-27-homem"; liga = "selecoes/europa" }
  @{ id = "holanda-travis-scott";          handle = "camisola-holanda-x-travis-scott-cactus-jack-total-90-2026-retro"; liga = "selecoes/europa" }

  @{ id = "belgica-26-27";                 handle = "camisola-belgica-principal-26-27-copa-do-mundo-2026-homem-versao-jogador"; liga = "selecoes/europa" }
  @{ id = "belgica-mulher-26-27";          handle = "camisola-belgica-principal-26-27-copa-do-mundo-2026-mulher"; liga = "selecoes/europa" }
  @{ id = "belgica-alt-26-27";             handle = "camisola-belgica-alternativa-2026-homem-equipamento-futebol"; liga = "selecoes/europa" }

  @{ id = "croacia-26-27";                 handle = "camisola-croacia-2026-27-copa-do-mundo-equipamento"; liga = "selecoes/europa" }
  @{ id = "croacia-euro-24-25";            handle = "croacia-i-euro-copa-24-25-homem"; liga = "selecoes/europa" }
  @{ id = "croacia-1998-ii";               handle = "croacia-ii-1998-homem-retro"; liga = "selecoes/europa" }

  @{ id = "dinamarca-26";                  handle = "camisola-dinamarca-i-2026-homem"; liga = "selecoes/europa" }
  @{ id = "dinamarca-86-87";               handle = "dinamarca-i-86-87-homem-retro"; liga = "selecoes/europa" }

  @{ id = "escocia-26-27";                 handle = "camisola-escocia-principal-26-27-copa-do-mundo-2026-homem"; liga = "selecoes/europa" }
  @{ id = "escocia-alt-26-27";             handle = "camisola-escocia-alternativa-26-27-copa-do-mundo-2026-homem"; liga = "selecoes/europa" }

  @{ id = "argentina-26-27";               handle = "camisola-argentina-principal-26-27-copa-do-mundo-2026-com-patch-homem-versao-jogador"; liga = "selecoes/americas" }
  @{ id = "canada-26-27";                  handle = "camisola-canada-26-27"; liga = "selecoes/americas" }
  @{ id = "colombia-26-27";                handle = "camisola-colombia-principal-26-27-copa-do-mundo-2026-homem-versao-jogador"; liga = "selecoes/americas" }
  @{ id = "estados-unidos-26-27";          handle = "camisola-estados-unidos-principal-26-27-copa-do-mundo-2026-homem"; liga = "selecoes/americas" }
  @{ id = "estados-unidos-alt-26-27";      handle = "camisola-estados-unidos-alternativa-26-27-copa-do-mundo-2026-homem"; liga = "selecoes/americas" }
  @{ id = "estados-unidos-travis-scott";   handle = "camisola-estados-unidos-x-travis-scott-cactus-jack-total-90-2026-retro"; liga = "selecoes/americas" }
  @{ id = "equador-26-27";                 handle = "camisola-equador-principal-26-27-copa-do-mundo-2026-homem-1"; liga = "selecoes/americas" }
  @{ id = "equador-alt-26-27";             handle = "camisola-equador-alternativa-26-27-copa-do-mundo-2026-homem"; liga = "selecoes/americas" }
  @{ id = "equador-iii-26-27";             handle = "camisola-equador-alternativa-iii-26-27-copa-do-mundo-2026-homem"; liga = "selecoes/americas" }
  @{ id = "equador-gr-26-27";              handle = "camisola-equador-guarda-redes-26-27-copa-do-mundo-2026-homem"; liga = "selecoes/americas" }
  @{ id = "equador-especial-26-27";        handle = "camisola-equador-edicao-especial-26-27-copa-do-mundo-2026-homem"; liga = "selecoes/americas" }
  @{ id = "jamaica-26-27";                 handle = "camisola-jamaica-principal-26-27-copa-do-mundo-2026-homem"; liga = "selecoes/americas" }
  @{ id = "jamaica-alt-26-27";             handle = "camisola-jamaica-alternativa-26-27-copa-do-mundo-2026-homem"; liga = "selecoes/americas" }
  @{ id = "mexico-26-27";                  handle = "camisola-mexico-principal-26-27-copa-do-mundo-2026-homem-versao-jogador"; liga = "selecoes/americas" }
  @{ id = "mexico-mulher-26-27";           handle = "camisola-mexico-principal-26-27-copa-do-mundo-2026-mulher"; liga = "selecoes/americas" }
  @{ id = "mexico-travis-scott";           handle = "camisola-mexico-x-travis-scott-cactus-jack-total-90-2026-retro"; liga = "selecoes/americas" }
  @{ id = "mexico-97-98";                  handle = "mexico-i-97-98-homem"; liga = "selecoes/americas" }
  @{ id = "peru-26-27";                    handle = "camisola-peru-principal-26-27-homem"; liga = "selecoes/americas" }
  @{ id = "uruguai-26-27";                 handle = "camisola-uruguai-2026-27-copa-do-mundo-homem-equipamento"; liga = "selecoes/americas" }
  @{ id = "uruguai-alt-26-27";             handle = "camisola-uruguai-alternativa-2026-27-copa-do-mundo-azul-homem-equipamento"; liga = "selecoes/americas" }
  @{ id = "venezuela-25-26";               handle = "camisola-venezuela-i-25-26"; liga = "selecoes/americas" }
  @{ id = "venezuela-alt-26-27";           handle = "camisola-venezuela-alternativa-2026-27-homem"; liga = "selecoes/americas" }
)

# What the shop charges, from what the supplier charges and what the thing is.
# Marcos's rules, in the order he gave them, later ones correcting earlier:
#   a two-piece training set   -> 40
#   long sleeves               -> 40
#   retro, or a player version -> 35, whatever the supplier charges
#   otherwise, 13 at the supplier -> 30
#   everything else            -> 35
#
# Order matters here. The retro and player-version rule is tested before the
# 13-euro one because plenty of retro shirts also cost the supplier 13, and he
# said those stay at 35.
function Preco([string]$titulo, [double]$fornecedor) {
  $t = $titulo.ToUpperInvariant()
  if ($t -match "CONJUNTO") { return 40 }
  if ($t -match "MANGA (LONGA|LARGA)") { return 40 }
  if ($t -match "RETRO" -or $t -match "VERS[AÃ]O JOGADOR") { return 35 }
  if ([Math]::Round($fornecedor) -eq 13) { return 30 }
  return 35
}

$linhas = @()
foreach ($c in $CAMISAS) {
  $destino = Join-Path $Root "tools\camisas-originais\$($c.id)"
  if (-not (Test-Path $destino)) { "SEM PASTA: $($c.id)"; continue }
  try {
    $d = Invoke-RestMethod "$Shop/products/$($c.handle).js" -TimeoutSec 30
  } catch {
    "FALHOU $($c.id): $($_.Exception.Message)"
    continue
  }
  $fornecedor = $d.price / 100
  $nosso = Preco $d.title $fornecedor
  $ficha = [ordered]@{
    id = $c.id; titulo = $d.title; handle = $c.handle; liga = $c.liga
    precoFornecedor = $fornecedor; preco = $nosso
    fotos = (Get-ChildItem $destino -File -Filter *.jpeg).Count
    obtido = (Get-Date).ToString("yyyy-MM-dd")
  }
  [System.IO.File]::WriteAllText((Join-Path $destino "_ficha.json"),
    ($ficha | ConvertTo-Json), (New-Object System.Text.UTF8Encoding($false)))
  $linhas += [pscustomobject]$ficha
}

$linhas | Sort-Object liga, id |
  Format-Table @{n="id";e={$_.id};w=32}, @{n="liga";e={$_.liga -replace "selecoes/",""};w=9},
               @{n="forn";e={"{0:N0}" -f $_.precoFornecedor};w=5},
               @{n="nosso";e={$_.preco};w=5}, @{n="fotos";e={$_.fotos};w=5},
               @{n="titulo";e={$_.titulo}} -AutoSize | Out-String -Width 200
