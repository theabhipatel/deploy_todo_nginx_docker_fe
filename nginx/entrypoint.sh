#!/bin/sh
set -e

if [ -z "$FRONTEND_DOMAIN" ] || [ -z "$BACKEND_DOMAIN" ]; then
  echo "❌ FRONTEND_DOMAIN or BACKEND_DOMAIN missing in .env"
  exit 1
fi

CONF_PATH="/etc/nginx/conf.d/default.conf"
HTTP_TEMPLATE="/etc/nginx/templates/http.template"
HTTPS_TEMPLATE="/etc/nginx/templates/https.template"

echo "⚙️ Creating temporary HTTP-only config..."
sed \
  -e "s/{{FRONTEND_DOMAIN}}/$FRONTEND_DOMAIN/g" \
  -e "s/{{BACKEND_DOMAIN}}/$BACKEND_DOMAIN/g" \
  "$HTTP_TEMPLATE" > "$CONF_PATH"

echo "🚀 Starting temporary Nginx (HTTP)..."
nginx

echo "🕒 Waiting for SSL certificates for both domains..."
while [ ! -d "/etc/letsencrypt/live/$FRONTEND_DOMAIN" ]; do
  sleep 2
done

echo "🔐 SSL found — switching to HTTPS config"
sed \
  -e "s/{{FRONTEND_DOMAIN}}/$FRONTEND_DOMAIN/g" \
  -e "s/{{BACKEND_DOMAIN}}/$BACKEND_DOMAIN/g" \
  "$HTTPS_TEMPLATE" > "$CONF_PATH"

nginx -s quit

# wait until nginx fully shuts down
while pgrep nginx >/dev/null; do
  sleep 1
done

exec nginx -g "daemon off;"