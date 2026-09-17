# Makes the smaller copies of every product photo that the catalogue grid, the
# product page thumbnails and the cart draw from. Run it after adding, removing
# or replacing a photo under images/products:
#
#   .\tools\resize.ps1
#
# The originals under images/products stay the reference. The product page's
# large view on high-density phones, the Google markup and the Meta feed all
# keep using them; this only adds images/sized/<width>/<same path>, and the
# 1200x630 link-preview crops under images/og/ described further down.
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

# Every relative path below is this string cut off the front of a full path, so
# $src has to be spelled the way Windows spells it. A short 8.3 path - the
# MARCOS~1 form - is eight characters shorter than the real one, so the cut left
# the tail of "produ|cts" on every name and the whole tree was rebuilt inside a
# folder called "cts". It emptied images/sized and images/og first, so the
# damage was three thousand files and only git got them back.
$real = (Get-Item $src).FullName
if ($real -cne $src) { throw "Passe o caminho por extenso: $Root nao e $((Get-Item $Root).FullName)." }

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

"{0} fotos originais, {1:N1} MB" -f $count, ($bytesIn["all"] / 1MB)
foreach ($w in $Widths) {
  "  {0,4} px  {1,6:N1} MB   ({2} copiadas sem mexer, por serem mais estreitas)" -f `
    $w, ($bytesOut[$w] / 1MB), $copied[$w]
}

# ---- link previews -----------------------------------------------------------
#
# A shared link is drawn at 1.91:1 - Facebook, Instagram, WhatsApp, iMessage
# all cut the picture to a wide band, through its middle, when it is not that
# shape already. These photos are 3:4 portraits with the lupas anywhere from
# 45% to 73% of the way down, so the platform's band can run through the
# lenses. Each colour's head-on photo (1.jpeg) gets its own 1200x630 instead,
# centred on the lupas themselves, written to images/og/<same path>.
#
# The lupas are found by comparing each row of the photo with that row's own
# outer edges, which are always backdrop in a head-on shot. The first version
# compared everything with the four corners, the way tools/watermark.ps1 does,
# and on about ten photos it failed: the studio backdrop darkens towards the
# top, the upper backdrop read as "product", the box ran almost to the top of
# the frame, and the crop centred on empty wall with the lenses cut off below.
# A row judged against itself does not care how the backdrop shades from top
# to bottom. The window is then made just wide enough to hold the lupas with a
# margin, and never runs off the photo.

$og = Join-Path $Root "images\og"
if (Test-Path $og) { Remove-Item $og -Recurse -Force }

$OgW = 1200; $OgH = 630; $Tolerance = 150; $Margin = 1.18
$ogCount = 0; $ogBytes = 0

function Get-ProductBox([System.Drawing.Bitmap]$bmp, [int]$tol) {
  $rect = New-Object System.Drawing.Rectangle 0, 0, $bmp.Width, $bmp.Height
  $data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly,
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  try {
    $stride = $data.Stride
    $px = New-Object byte[] ($stride * $bmp.Height)
    [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $px, 0, $px.Length)
  } finally { $bmp.UnlockBits($data) }

  $w = $bmp.Width; $h = $bmp.Height
  # 3% at each side is the reference strip; a row needs product in 2% of the
  # samples across it to count, so a speck of dust does not stretch the box.
  $edge = [int]($w * 0.03)
  $minHits = [int]($w / 3 * 0.02)

  [int]$minX = $w; [int]$minY = $h; [int]$maxX = 0; [int]$maxY = 0
  for ([int]$y = 0; $y -lt $h; $y += 3) {
    $row = $y * $stride
    [double]$b0 = 0; [double]$b1 = 0; [double]$b2 = 0; $n = 0
    for ([int]$e = 0; $e -lt $edge; $e++) {
      foreach ($ex in @($e, ($w - 1 - $e))) {
        $i = $row + $ex * 4
        $b0 += $px[$i]; $b1 += $px[$i + 1]; $b2 += $px[$i + 2]; $n++
      }
    }
    $b0 /= $n; $b1 /= $n; $b2 /= $n

    $hits = 0; $rx0 = $w; $rx1 = 0
    for ([int]$x = $edge; $x -lt ($w - $edge); $x += 3) {
      $i = $row + $x * 4
      $d = [math]::Abs($px[$i] - $b0) + [math]::Abs($px[$i + 1] - $b1) + [math]::Abs($px[$i + 2] - $b2)
      if ($d -gt $tol) {
        $hits++
        if ($x -lt $rx0) { $rx0 = $x }; if ($x -gt $rx1) { $rx1 = $x }
      }
    }
    if ($hits -ge $minHits) {
      if ($y -lt $minY) { $minY = $y }; if ($y -gt $maxY) { $maxY = $y }
      if ($rx0 -lt $minX) { $minX = $rx0 }; if ($rx1 -gt $maxX) { $maxX = $rx1 }
    }
  }
  # Nothing stood out: centre on the whole photo rather than on nothing.
  if ($maxX -le $minX -or $maxY -le $minY) { return @(0, 0, $w, $h) }
  @($minX, $minY, ($maxX - $minX), ($maxY - $minY))
}

$covers = Get-ChildItem $src -Recurse -File -Filter "1.jpeg"
foreach ($f in $covers) {
  $rel = $f.FullName.Substring($src.Length + 1)
  $out = Join-Path $og $rel
  New-Item -ItemType Directory -Force -Path (Split-Path $out -Parent) | Out-Null

  $img = New-Object System.Drawing.Bitmap $f.FullName
  try {
    $box = Get-ProductBox $img $Tolerance
    $bx = $box[0]; $by = $box[1]; $bw = $box[2]; $bh = $box[3]
    $aspect = $OgW / $OgH

    # Wide enough for the lupas and a margin, at the preview's shape.
    $cw = [Math]::Max($bw * $Margin, $bh * $Margin * $aspect)
    $cw = [Math]::Min($cw, $img.Width)
    $ch = $cw / $aspect
    if ($ch -gt $img.Height) { $ch = $img.Height; $cw = $ch * $aspect }

    $cx = $bx + $bw / 2; $cy = $by + $bh / 2
    $x0 = [Math]::Max(0, [Math]::Min($cx - $cw / 2, $img.Width - $cw))
    $y0 = [Math]::Max(0, [Math]::Min($cy - $ch / 2, $img.Height - $ch))

    $bmp = New-Object System.Drawing.Bitmap $OgW, $OgH
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $OgW, $OgH),
      [single]$x0, [single]$y0, [single]$cw, [single]$ch, [System.Drawing.GraphicsUnit]::Pixel, $edges)
    $g.Dispose()
    $bmp.Save($out, $jpeg, $params)
    $bmp.Dispose()
  } finally {
    $img.Dispose()
  }
  $ogCount++; $ogBytes += (Get-Item $out).Length
}

$edges.Dispose(); $params.Dispose()

"{0} previsualizacoes de link 1200x630, {1:N1} MB" -f $ogCount, ($ogBytes / 1MB)
