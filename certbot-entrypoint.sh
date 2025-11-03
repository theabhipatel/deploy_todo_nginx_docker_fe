#!/bin/sh

set -e

DOMAIN1="todo-app.theabhipatel.com"
DOMAIN2="api.todo-app.theabhipatel.com"
EMAIL="abhi@gmail.com"
WEBROOT="/var/www/certbot"

echo "🔍 Checking for existing SSL certificate..."

if [ ! -d "/etc/letsencrypt/live/$DOMAIN1" ]; then
  echo "⚙️  Requesting new SSL certificate for domains..."
  certbot certonly --webroot -w "$WEBROOT" \
    -d "$DOMAIN1" -d "$DOMAIN2" \
    --email "$EMAIL" \
    --agree-tos --no-eff-email --non-interactive --verbose
else
  echo "✅ Existing certificate found. Skipping initial request."
fi

echo "🔁 Starting renewal loop..."
while :; do
  certbot renew --quiet || true
  sleep 12h
done