# Burns the RumorLupas boar into product photos.
#
# The mark has to live in the pixels, not in a CSS layer over them: an overlay
# looks identical on the page, but anyone who opens the image URL or saves the
# picture walks away with a clean copy.
#
# It is centred on the lupas rather than on the frame of the photo. Those are
# not the same point — the product sits anywhere between 45% and 73% of the
# height depending on the shot — and a mark floating in empty background is
# cropped off in seconds, which would defeat the whole purpose. The product is
# found by sampling the backdrop colour at the four corners and taking the
# bounding box of everything far enough from it.
#
# Reads anything WIC decodes (jpeg, png, avif, webp) and always writes jpeg,
# so an .avif source leaves a .jpeg behind and the old file is removed —
# products.js has to be updated to match.
#
# It overwrites in place and has no way to tell an already-marked photo from a
# clean one, so keep the originals elsewhere and run it on a fresh copy.
#
#   .\tools\watermark.ps1 -Path images\products
#
param(
  [Parameter(Mandatory = $true)][string]$Path,
  [string]$Mark = "images/boar-mark.png",
  # Fraction of the photo's shorter side that the mark spans.
  [double]$Scale = 0.20,
  [double]$Opacity = 0.30,
  # How far a pixel must sit from the backdrop colour, summed over B/G/R, to
  # count as product. Low values catch the backdrop's own gradient and shadow.
  [int]$Tolerance = 150,
  [int]$Quality = 90
)

Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase

function Read-Bitmap([string]$file) {
  $stream = [System.IO.File]::OpenRead($file)
  try {
    return ([System.Windows.Media.Imaging.BitmapDecoder]::Create(
      $stream,
      [System.Windows.Media.Imaging.BitmapCreateOptions]::PreservePixelFormat,
      [System.Windows.Media.Imaging.BitmapCacheOption]::OnLoad)).Frames[0]
  } finally { $stream.Dispose() }
}

# Bounding box of the product, or the whole frame if nothing stands out.
function Get-ProductBox($bitmap, [int]$tol) {
  $conv = New-Object System.Windows.Media.Imaging.FormatConvertedBitmap(
    $bitmap, [System.Windows.Media.PixelFormats]::Bgra32, $null, 0)
  [int]$w = $conv.PixelWidth
  [int]$h = $conv.PixelHeight
  [int]$stride = $w * 4
  $px = New-Object byte[] ($stride * $h)
  $conv.CopyPixels($px, $stride, 0)

  [int]$b0 = 0; [int]$b1 = 0; [int]$b2 = 0
  foreach ($cx in @(2, ($w - 3))) {
    foreach ($cy in @(2, ($h - 3))) {
      [int]$i = $cy * $stride + $cx * 4
      $b0 += $px[$i]; $b1 += $px[$i + 1]; $b2 += $px[$i + 2]
    }
  }
  $b0 = [int]($b0 / 4); $b1 = [int]($b1 / 4); $b2 = [int]($b2 / 4)

  [int]$minX = $w; [int]$minY = $h; [int]$maxX = 0; [int]$maxY = 0
  for ([int]$y = 0; $y -lt $h; $y += 3) {
    [int]$row = $y * $stride
    for ([int]$x = 0; $x -lt $w; $x += 3) {
      [int]$i = $row + $x * 4
      [int]$d = [math]::Abs($px[$i] - $b0) + [math]::Abs($px[$i + 1] - $b1) + [math]::Abs($px[$i + 2] - $b2)
      if ($d -gt $tol) {
        if ($x -lt $minX) { $minX = $x }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }

  if ($maxX -le $minX -or $maxY -le $minY) {
    return [pscustomobject]@{ x = 0; y = 0; w = $w; h = $h }
  }
  [pscustomobject]@{ x = $minX; y = $minY; w = ($maxX - $minX); h = ($maxY - $minY) }
}

$markImage = Read-Bitmap (Resolve-Path $Mark)

$targets = Get-ChildItem -LiteralPath $Path -Recurse -File |
  Where-Object { $_.Extension -in ".jpg", ".jpeg", ".png", ".avif", ".webp" }

$done = 0
foreach ($file in $targets) {
  $photo = Read-Bitmap $file.FullName
  [int]$w = $photo.PixelWidth
  [int]$h = $photo.PixelHeight

  # Sized off the shorter side, so portrait and square shots get a mark of the
  # same visual weight.
  [int]$markW = [math]::Round([math]::Min($w, $h) * $Scale)
  [int]$markH = [math]::Round($markW * $markImage.PixelHeight / $markImage.PixelWidth)

  $box = Get-ProductBox $photo $Tolerance
  $x = $box.x + ($box.w - $markW) / 2
  $y = $box.y + ($box.h - $markH) / 2

  $visual = New-Object System.Windows.Media.DrawingVisual
  $ctx = $visual.RenderOpen()
  $ctx.DrawImage($photo, (New-Object System.Windows.Rect(0, 0, $w, $h)))
  $ctx.PushOpacity($Opacity)
  $ctx.DrawImage($markImage, (New-Object System.Windows.Rect($x, $y, $markW, $markH)))
  $ctx.Pop()
  $ctx.Close()

  $rendered = New-Object System.Windows.Media.Imaging.RenderTargetBitmap(
    $w, $h, 96, 96, [System.Windows.Media.PixelFormats]::Pbgra32)
  $rendered.Render($visual)

  $encoder = New-Object System.Windows.Media.Imaging.JpegBitmapEncoder
  $encoder.QualityLevel = $Quality
  $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($rendered))

  $out = [System.IO.Path]::ChangeExtension($file.FullName, ".jpeg")
  $stream = [System.IO.File]::Create($out)
  try { $encoder.Save($stream) } finally { $stream.Dispose() }
  if ($file.FullName -ne $out) { Remove-Item -LiteralPath $file.FullName -Force }
  $done++
}

"marcadas: $done"
