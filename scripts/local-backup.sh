#!/bin/bash
# Backup tầng 1: máy tính, giữ 3 bản gần nhất
PROJECT_NAME=$(basename "$PWD")
BACKUP_DIR="$HOME/Backups/local/$PROJECT_NAME"
DATE=$(date +"%Y%m%d-%H%M%S")
ARCHIVE="$BACKUP_DIR/$PROJECT_NAME-$DATE.tar.gz"

mkdir -p "$BACKUP_DIR"

tar --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.vercel' \
    --exclude='dist' \
    -czf "$ARCHIVE" .

ls -t "$BACKUP_DIR"/*.tar.gz | tail -n +4 | xargs -r rm

echo "✅ Local backup: $ARCHIVE"
