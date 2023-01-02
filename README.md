# Example

```yaml
version: '3.9'
services:
  backupper:
    image: registry.dennisskoko.lan/backupper/runner:latest
    restart: unless-stopped
    environment:
      AWS_ACCESS_KEY_ID: keyid
      AWS_SECRET_ACCESS_KEY: secret
      AWS_REGION: aws-region-1
      APP_STORAGE_BUCKET: bucket-name
      APP_STORAGE_PATH: bucket/object/destination
      APP_CRONJOB: '0 0 2 * * *'
      APP_ENCRYPTION_SECRET: secret
    volumes:
      - ./folder/to/backup:/data
```
