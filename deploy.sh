sudo tee /opt/deploy.sh > /dev/null <<'EOF'
#!/usr/bin/env bash
set -e

# Usage: /opt/deploy.sh frontend|backend
SERVICE="$1"
STACK_DIR="/opt/frontend"

if [ -z "$SERVICE" ]; then
  echo "Usage: $0 frontend|backend"
  exit 1
fi

echo "Pull latest for $SERVICE"
if [ "$SERVICE" = "frontend" ]; then
  cd /opt/frontend
  git fetch --all
  git reset --hard origin/master
  cd "$STACK_DIR"
  docker compose up -d --build nginx frontend backend
elif [ "$SERVICE" = "backend" ]; then
  cd /opt/backend
  git fetch --all
  git reset --hard origin/master
  cd "$STACK_DIR"
  docker compose up -d --build backend
else
  echo "Unknown service: $SERVICE"
  exit 1
fi

echo "Done"
EOF

sudo chmod +x /opt/deploy.sh
