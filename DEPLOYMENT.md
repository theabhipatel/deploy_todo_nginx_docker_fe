# 🚀 Full Deployment Guide: Multi-Repo MERN App (Frontend + Backend + MongoDB + Nginx + SSL)

This guide walks you through deploying a **multi-repo MERN app** (React frontend, Node/Express backend, MongoDB) on an **Ubuntu server** using **Docker, Docker Compose, Nginx, and Certbot**.

---

## 🧩 Domains Used
- **Frontend:** https://todo-app.theabhipatel.com  
- **Backend:** https://api.todo-app.theabhipatel.com

---

## 1️⃣ Setup Ubuntu Server

```bash
ssh ubuntu@YOUR_SERVER_IP
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg lsb-release apt-transport-https software-properties-common
```

### Install Docker & Compose
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

### Install Git & UFW
```bash
sudo apt install -y git ufw
sudo ufw allow OpenSSH
sudo ufw allow 80,443/tcp
sudo ufw --force enable
```

---

## 2️⃣ Clone Repos
```bash
cd /opt
git clone git@github.com:YOUR_GH_USER/frontend.git
git clone git@github.com:YOUR_GH_USER/backend.git
```

---

## 3️⃣ Frontend Repo Files (Nginx + Certbot + Compose)

Create these files inside `/opt/frontend`:

### `docker-compose.yml`
```yaml
version: "3.8"

services:
  nginx:
    image: nginx:stable
    container_name: nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
      - ./build:/usr/share/nginx/html:ro
    depends_on:
      - frontend
      - backend

  certbot:
    image: certbot/certbot
    container_name: certbot
    restart: unless-stopped
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: >
      sh -c "
        set -e;
        if [ ! -d /etc/letsencrypt/live/todo-app.theabhipatel.com ]; then
          certbot certonly --webroot -w /var/www/certbot             -d todo-app.theabhipatel.com -d api.todo-app.theabhipatel.com             --email you@example.com --agree-tos --no-eff-email --non-interactive;
        fi;
        while :; do
          certbot renew --quiet --post-hook 'docker exec nginx nginx -s reload' || true;
          sleep 6h;
        done
      "

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: frontend
    restart: always

  backend:
    build:
      context: ../backend
      dockerfile: Dockerfile
    container_name: backend
    restart: always
    environment:
      - PORT=5000
      - MONGO_URL=mongodb://mongo:27017/tododb

  mongo:
    image: mongo:6
    container_name: mongo
    restart: unless-stopped
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

---

### `nginx.conf`
```nginx
server {
  listen 80;
  server_name todo-app.theabhipatel.com api.todo-app.theabhipatel.com;

  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }

  location / {
    return 301 https://$host$request_uri;
  }
}

server {
  listen 443 ssl http2;
  server_name todo-app.theabhipatel.com;

  ssl_certificate /etc/letsencrypt/live/todo-app.theabhipatel.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/todo-app.theabhipatel.com/privkey.pem;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}

server {
  listen 443 ssl http2;
  server_name api.todo-app.theabhipatel.com;

  ssl_certificate /etc/letsencrypt/live/api.todo-app.theabhipatel.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.todo-app.theabhipatel.com/privkey.pem;

  location / {
    proxy_pass http://backend:5000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

---

### `Dockerfile` (Frontend)
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

---

## 4️⃣ Backend `Dockerfile`
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 5️⃣ Deploy Script `/opt/deploy.sh`
```bash
#!/usr/bin/env bash
set -e
SERVICE="$1"
STACK_DIR="/opt/frontend"

if [ "$SERVICE" = "frontend" ]; then
  cd /opt/frontend && git fetch --all && git reset --hard origin/master
  cd "$STACK_DIR"
  docker compose up -d --build nginx frontend backend
elif [ "$SERVICE" = "backend" ]; then
  cd /opt/backend && git fetch --all && git reset --hard origin/master
  cd "$STACK_DIR"
  docker compose up -d --build backend
fi
```

---

## 6️⃣ DNS Setup
Point A records for both subdomains to your server IP.

---

## 7️⃣ First Deployment
```bash
cd /opt/frontend
mkdir -p certbot/conf certbot/www build
docker compose up -d frontend backend nginx certbot
```

Check certbot logs:
```bash
docker compose logs -f certbot
```

---

## 8️⃣ GitHub Actions Auto Deploy

### Frontend `.github/workflows/deploy.yml`
```yaml
on:
  push:
    branches: [ master ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Frontend
        uses: appleboy/ssh-action@v0.1.9
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: /opt/deploy.sh frontend
```

### Backend `.github/workflows/deploy.yml`
```yaml
on:
  push:
    branches: [ master ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Backend
        uses: appleboy/ssh-action@v0.1.9
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: /opt/deploy.sh backend
```

---

## ✅ Done!
Your multi-repo MERN stack with Nginx, SSL, and auto-deploys is live!
