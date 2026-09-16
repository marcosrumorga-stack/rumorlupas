# Gives the shirt room inside its square, so the camisas sit in the frame the
# way the lupas do.
#
#   .\tools\inset-camisas.ps1            # the settled look
#   .\tools\inset-camisas.ps1 -Scale 0.8 # try a different one
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
# It reads tools/camisas-originais and writes images/products/brasil-26-27, so
# it can be run again with another -Scale without fetching the photos again.
# Run .\tools\resize.ps1 afterwards to rebuild the smaller copies and the
# link-preview crops from the new files.
param(
  [string]$Root = (Split-Path $PSScriptRoot -Parent),
  [double]$Scale = 0.74,
  [int]$Quality = 88,
  # How much darker the surround is than the photo, out of 255.
  [int]$Dim = 70
)

Add-Type -AssemblyName System.Drawing

$src = Join-Path $Root "tools\camisas-originais"
$dst = Join-Path $Root "images\products\brasil-26-27"
if (-not (Test-Path $src)) { throw "Nao encontrei $src - as fotos do fornecedor vivem ai." }
if (-not (Test-Path $dst)) { New-Item -ItemType Directory $dst | Out-Null }

$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [int64]$Quality)

$shade = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($Dim, 0, 0, 0))

foreach ($file in Get-ChildItem $src -File -Filter *.jpeg | Sort-Object Name) {
  $img = [System.Drawing.Image]::FromFile($file.FullName)
  $W = $img.Width; $H = $img.Height

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

  $w2 = [int]($W * $Scale); $h2 = [int]($H * $Scale)
  $g.DrawImage($img, [int](($W - $w2) / 2), [int](($H - $h2) / 2), $w2, $h2)
  $g.Dispose()

  $target = Join-Path $dst $file.Name
  $out.Save($target, $jpeg, $params)
  $out.Dispose(); $tiny.Dispose(); $img.Dispose()
  "{0,-8} {1}x{2}  foto a {3:P0}" -f $file.Name, $W, $H, $Scale
}

$shade.Dispose(); $params.Dispose()
"pronto - corra agora .\tools\resize.ps1"
