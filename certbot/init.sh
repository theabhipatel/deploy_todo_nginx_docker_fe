#!/bin/sh
set -e

if [ -z "$DOMAINS" ]; then
  echo "❌ DOMAINS is not set"
  exit 1
fi
if [ -z "$EMAIL" ]; then
  echo "❌ EMAIL is not set"
  exit 1
fi

FIRST_DOMAIN=$(echo $DOMAINS | cut -d',' -f1)
CERT_PATH="/etc/letsencrypt/live/$FIRST_DOMAIN/fullchain.pem"

if [ ! -f "$CERT_PATH" ]; then
  echo "🔐 Issuing certs for: $DOMAINS"
  certbot certonly --webroot -w /var/www/certbot \
    -d $(echo $DOMAINS | sed 's/,/ -d /g') \
    --email "$EMAIL" --agree-tos --no-eff-email --non-interactive
else
  echo "✅ Certificates already present"
fi

# renewal loop
while true; do
  certbot renew --webroot -w /var/www/certbot
  sleep 12h
done
