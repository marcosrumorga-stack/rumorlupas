# Makes the smaller copies of every product photo that the catalogue grid, the
# product page thumbnails and the cart draw from. Run it after adding, removing
# or replacing a photo under images/products:
#
#   .\tools\resize.ps1
#
# The originals under images/products stay the reference. The product page's
# large view on high-density phones, the Google markup and the Meta feed all
# keep using them; this only adds images/sized/<width>/<same path>.
#
# Why these widths. The grid card is about 250 CSS pixels on a computer but a
# single column on a phone - 345 pixels at 375 wide, 470 on a large phone - and
# a phone draws two or three device pixels per CSS pixel. So "small" here is
# relative: 480 serves computers, 800 serves most phones, and the original
# (1200 for nearly all of them) serves the densest screens. 200 is for the
# 64-pixel thumbnails on the product page and the 56-pixel ones in the cart.
#
# Nothing is ever made bigger than it was. Where a target is at least as wide as
# the original - the Plate photos are 900 across, the Plantaris ones 680 - the
# original is copied byte for byte instead of being re-encoded, so no copy is
# ever softer than the file it came from.
#
# The folder is wiped and rebuilt on every run, which is what removes the copies
# of photos that no longer exist. The encoder is deterministic, so git only
# shows the files that really changed.
param(
  [string]$Root = (Split-Path $PSScriptRoot -Parent),
  [int[]]$Widths = @(200, 480, 800),
  [int]$Quality = 82
)

Add-Type -AssemblyName System.Drawing

$src = Join-Path $Root "images\products"
$dst = Join-Path $Root "images\sized"
if (-not (Test-Path $src)) { throw "Nao encontrei $src - passe -Root com a pasta do site." }

if (Test-Path $dst) { Remove-Item $dst -Recurse -Force }

$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [int64]$Quality)

# GDI+ samples past the edge of the picture when it resamples, and pulls in
# black from outside it - a thin dark frame round every copy. Mirroring the
# edge pixels outward gives it real image to sample from instead.
$edges = New-Object System.Drawing.Imaging.ImageAttributes
$edges.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)

$bytesIn = @{}; $bytesOut = @{}; $copied = @{}; $count = 0
foreach ($w in $Widths) { $bytesOut[$w] = 0; $copied[$w] = 0 }

$files = Get-ChildItem $src -Recurse -File -Include *.jpeg, *.jpg
foreach ($f in $files) {
  $rel = $f.FullName.Substring($src.Length + 1)
  $img = [System.Drawing.Image]::FromFile($f.FullName)
  try {
    foreach ($w in $Widths) {
      $out = Join-Path (Join-Path $dst $w) $rel
      New-Item -ItemType Directory -Force -Path (Split-Path $out -Parent) | Out-Null

      if ($w -ge $img.Width) {
        Copy-Item $f.FullName $out
        $copied[$w]++
      } else {
        $h = [int][Math]::Round($img.Height * $w / $img.Width)
        $bmp = New-Object System.Drawing.Bitmap $w, $h
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $w, $h),
          0, 0, $img.Width, $img.Height, [System.Drawing.GraphicsUnit]::Pixel, $edges)
        $g.Dispose()
        $bmp.Save($out, $jpeg, $params)
        $bmp.Dispose()
      }
      $bytesOut[$w] += (Get-Item $out).Length
    }
  } finally {
    $img.Dispose()
  }
  $bytesIn["all"] += $f.Length
  $count++
}

$edges.Dispose(); $params.Dispose()

"{0} fotos originais, {1:N1} MB" -f $count, ($bytesIn["all"] / 1MB)
foreach ($w in $Widths) {
  "  {0,4} px  {1,6:N1} MB   ({2} copiadas sem mexer, por serem mais estreitas)" -f `
    $w, ($bytesOut[$w] / 1MB), $copied[$w]
}
