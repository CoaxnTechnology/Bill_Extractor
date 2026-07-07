#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
    echo "Usage: $0 <your-domain.com>"
    exit 1
fi

DOMAIN="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== Setting up SSL for $DOMAIN ==="

# 1. Stop Docker services on port 80 so Certbot can bind
echo ">>> Stopping Docker services..."
cd "$REPO_DIR"
docker compose down

# 2. Install certbot
echo ">>> Installing certbot..."
apt-get update -qq
apt-get install -y -qq certbot

# 3. Obtain certificate (standalone mode)
echo ">>> Obtaining SSL certificate for $DOMAIN..."
certbot certonly --standalone -d "$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN" || {
    echo "Fallback: trying interactive mode..."
    certbot certonly --standalone -d "$DOMAIN"
}

# 4. Replace placeholder in nginx config
echo ">>> Updating nginx config..."
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" "$REPO_DIR/docker/nginx/nginx.prod.conf"

# 5. Start services with SSL
echo ">>> Starting services with SSL..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 6. Set up auto-renewal cron job
echo ">>> Setting up auto-renewal..."
(crontab -l 2>/dev/null || true; echo "0 3 * * * cd $REPO_DIR && docker compose down && certbot renew --standalone && docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d") | crontab -

echo ""
echo "=== Done! SSL enabled for https://$DOMAIN ==="
echo "Certificates auto-renew daily at 3:00 AM."
