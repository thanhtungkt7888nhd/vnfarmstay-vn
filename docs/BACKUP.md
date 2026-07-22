# Backup System — vnfarmstay.vn

| Tầng | Nơi | Số bản | Tần suất | Script |
|------|-----|--------|----------|--------|
| 1 | ~/Backups/local/ | 3 | Hằng ngày 01:00 | scripts/local-backup.sh |
| 2 | gdrive:Backups/ | 5 | Hằng ngày 02:00 | scripts/drive-backup.sh |
| 3 | GitHub | Toàn bộ | Mỗi commit | git push |
| 4 | Vercel | Toàn bộ deploys | Mỗi merge main | auto |

## Restore
```bash
bash scripts/restore.sh local 20260429-010000
bash scripts/restore.sh drive 20260429-020000
bash scripts/restore.sh github
```
