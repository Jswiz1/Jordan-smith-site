#!/bin/bash
# Turn a short clip into the scroll-scrubbed frame sequence used in the On set section.
# Usage: tools/make-sequence.sh path/to/clip.mp4 [seconds-to-use]
# Writes src/media/reel/d/0001.webp… (desktop, 1280 wide, 18 fps) and src/media/reel/m/… (phones, 720 wide, 10 fps),
# plus src/media/reel/poster.jpg (the first frame, shown before frames load and as the reduced-motion fallback).
set -euo pipefail
CLIP="$1"; DUR="${2:-8}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/src/media/reel"
rm -rf "$OUT"; mkdir -p "$OUT/d" "$OUT/m"
ffmpeg -hide_banner -loglevel error -t "$DUR" -i "$CLIP" -vf "fps=18,scale=1280:-2:flags=lanczos" -c:v libwebp -quality 48 -compression_level 6 "$OUT/d/%04d.webp"
ffmpeg -hide_banner -loglevel error -t "$DUR" -i "$CLIP" -vf "fps=10,scale=720:-2:flags=lanczos"  -c:v libwebp -quality 48 -compression_level 6 "$OUT/m/%04d.webp"
ffmpeg -hide_banner -loglevel error -i "$CLIP" -vframes 1 -vf "scale=1280:-2" -q:v 4 "$OUT/poster.jpg"
D=$(ls "$OUT/d" | wc -l); M=$(ls "$OUT/m" | wc -l)
printf '{"d":%s,"m":%s}\n' "$D" "$M" > "$OUT/frames.json"
echo "desktop frames: $D ($(du -sh "$OUT/d" | cut -f1))  phone frames: $M ($(du -sh "$OUT/m" | cut -f1))"
