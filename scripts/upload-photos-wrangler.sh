#!/bin/bash

# Load environment variables
source .env

PHOTOS_DIR="content export/photos"
BUCKET="rexkirshner-com-photos"

echo "Uploading photos to R2..."

for file in "$PHOTOS_DIR"/*.jpeg "$PHOTOS_DIR"/*.jpg; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    # Remove spaces and convert to lowercase for key
    key=$(echo "$filename" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

    echo "Uploading $filename as originals/$key..."
    npx wrangler r2 object put "$BUCKET/originals/$key" --file="$file"
  fi
done

echo "✓ Upload complete!"
