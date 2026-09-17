# Gives the shirt room inside its square, so the camisas sit in the frame the
# way the lupas do.
#
#   .\tools\inset-camisas.ps1                      # every shirt
#   .\tools\inset-camisas.ps1 -Produto brasil-26-27 # just one
#   .\tools\inset-camisas.ps1 -Scale 0.8            # try a different look
#
# The lupas are photographed on a studio backdrop: the product takes a bit over
# a third of the square and there is white all around it. The supplier's shirt
# photos are the opposite - the garment runs from edge to edge - so on the same
# page the two categories read as different shops, the camisa a solid block of
# colour and the lupa an object with air around it.
#
# So the photo is drawn at 74% of the square and the margin is filled with the
# photo's own colours, heavily blurred and darkened. Nothing is cropped and
# nothing is invented: the surround is the shop rack the shirt is already
# hanging on, which is why the seam does not read as a paste. GDI+ has no blur,
# so the blur here is a 20-pixel copy drawn back at full size - shrinking that
# far IS the blur, and it costs nothing.
#
# It reads tools/camisas-originais/<produto> and writes images/products/<produto>
# for every folder it finds there, so it can be run again with another -Scale
# without fetching the photos again. Run .\tools\resize.ps1 afterwards to
# rebuild the smaller copies and the link-preview crops from the new files.
#
# The supplier's photos go in as they come. Run .\tools\watermark.ps1 on the
# output afterwards, not on the originals: the originals are the clean copy this
# reads from every time, and watermarking them would burn the mark in twice the
# next time the scale is changed.
param(
  [string]$Root = (Split-Path $PSScriptRoot -Parent),
  # One product id, or all of them when left out.
  [string]$Produto = "",
  [double]$Scale = 0.74,
  # The longest side the output may have. The supplier ships photos up to
  # 4284 pixels across; the site never serves more than 800, and the product
  # page's largest view on the densest phone asks for about 1000. Without this
  # the shirts alone weighed half a gigabyte - carried by git, pushed to
  # Netlify and never once sent to a browser.
  [int]$Maximo = 1400,
  [int]$Quality = 88,
  # How much darker the surround is than the photo, out of 255.
  [int]$Dim = 70
)

Add-Type -AssemblyName System.Drawing

$raiz = Join-Path $Root "tools\camisas-originais"
if (-not (Test-Path $raiz)) { throw "Nao encontrei $raiz - as fotos do fornecedor vivem ai." }

# One folder per product, named after its id in products.js.
$pastas = Get-ChildItem $raiz -Directory | Sort-Object Name
if ($Produto) {
  $pastas = $pastas | Where-Object { $_.Name -eq $Produto }
  if (-not $pastas) { throw "Nao ha fotos para '$Produto' em $raiz." }
}
if (-not $pastas) { throw "Nenhuma pasta de produto em $raiz." }

$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [int64]$Quality)

$shade = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($Dim, 0, 0, 0))

foreach ($pasta in $pastas) {
$dst = Join-Path $Root "images\products\$($pasta.Name)"
if (-not (Test-Path $dst)) { New-Item -ItemType Directory $dst | Out-Null }

foreach ($file in Get-ChildItem $pasta.FullName -File -Filter *.jpeg | Sort-Object { [int]($_.BaseName) }) {
  $img = [System.Drawing.Image]::FromFile($file.FullName)
  # Square, always. The supplier shoots some shirts portrait and some square,
  # and the catalogue card is a square that crops whatever it is given - so a
  # tall photo lost its head and its hem. Squaring here rather than letting the
  # card do it means the crop is decided once, with the whole garment in view,
  # instead of differently on every page that shows the photo.
  $lado = [Math]::Min([Math]::Max($img.Width, $img.Height), $Maximo)
  $W = $lado; $H = $lado

  # The blur: small enough that no detail survives, big enough to keep the
  # rack's light and dark bands roughly where they were.
  $tiny = New-Object System.Drawing.Bitmap 20, 20
  $gt = [System.Drawing.Graphics]::FromImage($tiny)
  $gt.InterpolationMode = "HighQualityBicubic"
  $gt.DrawImage($img, 0, 0, 20, 20)
  $gt.Dispose()

  $out = New-Object System.Drawing.Bitmap $W, $H
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.InterpolationMode = "HighQualityBicubic"
  $g.PixelOffsetMode = "HighQuality"
  # Drawn past the edges so the blur's own outermost pixels, which bicubic
  # smears, stay outside the frame.
  $g.DrawImage($tiny, [int](-$W * 0.08), [int](-$H * 0.08), [int]($W * 1.16), [int]($H * 1.16))
  $g.FillRectangle($shade, 0, 0, $W, $H)

  # Fitted inside the square keeping its own shape, so nothing is stretched.
  $escala = ($lado * $Scale) / [Math]::Max($img.Width, $img.Height)
  $w2 = [int]($img.Width * $escala); $h2 = [int]($img.Height * $escala)
  $g.DrawImage($img, [int](($W - $w2) / 2), [int](($H - $h2) / 2), $w2, $h2)
  $g.Dispose()

  $target = Join-Path $dst $file.Name
  $out.Save($target, $jpeg, $params)
  $out.Dispose(); $tiny.Dispose(); $img.Dispose()
  "{0,-16} {1,-8} {2}x{3}  foto a {4:P0}" -f $pasta.Name, $file.Name, $W, $H, $Scale
}
}

$shade.Dispose(); $params.Dispose()
"pronto - corra agora .\tools\watermark.ps1 -Path images\products e depois .\tools\resize.ps1"
