# 🚀 One-Command MERN Todo App Deployment on Any Server
This project provides a **fully automated**, production-ready CI/CD setup for deploying a **MERN Todo Application** (Frontend + Backend) with Domain & Auto SSL on any Ubuntu server using **Docker, Docker Compose, Nginx, Certbot SSL**, and **GitHub Actions**.

Just **push your code to the `production` branch** — your server will automatically install everything, configure itself, build both repos, and deploy the updated application.

---

# ✨ What This Setup Does

### ✅ 1. First-Time Server Setup (Fully Automatic)
When your EC2/Ubuntu server is empty, the GitHub Action will automatically:

- Install Docker & Docker Compose  
- Clone *both* frontend and backend repositories  
- Create the `.env` files using GitHub Secrets  
- Build and start all Docker containers  
- Configure Nginx reverse proxy  
- Generate & install SSL certificates using Certbot  

---

### ✅ 2. Auto-Update on Every Push
If the application already exists on the server:

- Fetch latest `production` branch from both repos  
- Hard reset to ensure clean sync  
- Recreate `.env` files from GitHub Secrets  
- Rebuild all Docker containers  
- Restart application with near-zero downtime  
- Clean old Docker images  

---

### ✅ 3. Zero Manual SSH Work
Deployment is **100% handled by GitHub Actions**.

---

# 🧑‍💻 What You Need To Do Manually (Only Once)

### ✔ 1. Clone both repositories (optional for local development)
```
git clone <frontend-repo>
git clone <backend-repo>
```

### ✔ 2. Create a new SSH key pair (See SSH Setup section)

### ✔ 3. Create an Ubuntu VPS / AWS EC2 instance

### ✔ 4. Add your SSH public key to the server

### ✔ 5. Point your domain to your EC2
Add DNS “A Records”:

```
api.yourdomain.com → <EC2_PUBLIC_IP>
yourdomain.com → <EC2_PUBLIC_IP>
```

### ✔ 6. Create `.env` files for frontend & backend (See next section)

### ✔ 7. Add GitHub Secrets

### ✔ 8. Use the `production` branch for deployment  
Push/merge updates → GitHub Action runs → App deploys automatically.

---

# 📦 Project Structure (Combined)

```
/project-root
  ├── frontend/
  │   ├── docker-compose.yml
  │   ├── Dockerfile
  │   ├── install-docker.sh
  │   ├── nginx/
  │   │   ├── entrypoint.sh
  │   │   └── templates/
  │   │       ├── http.template
  │   │       ├── https.template
  │   ├── .env.example
  │   └── React/Tailwind app code...
  │
  ├── backend/
  │   ├── docker-compose.yml
  │   ├── Dockerfile
  │   ├── install-docker.sh
  │   ├── nginx/
  │   │   ├── entrypoint.sh
  │   │   └── templates/
  │   │       ├── http.template
  │   │       ├── https.template
  │   ├── .env.example
  │   └── Node/Express/MongoDB code...
  │
  ├── .github/
  │   └── workflows/
  │       └── deploy.yml
```

---

# 🔧 Environment Variables (`.env` Setup)

### Backend `.env` example:
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CLIENT_URL=https://yourdomain.com
```

### Frontend `.env` example:
```
VITE_API_URL=https://api.yourdomain.com
```

### Add these to GitHub Secrets:

| Secret Name | Description |
|-------------|-------------|
| **EC2_HOST** | EC2 server IP |
| **EC2_USER** | `ubuntu` |
| **EC2_SSH_KEY** | Private SSH key |
| **ENV_FILE_BACKEND** | Backend `.env` content |
| **ENV_FILE_FRONTEND** | Frontend `.env` content |

---

# 🔑 SSH Key Setup

Generate:
```
ssh-keygen -t ed25519 -C "github-deploy" -f ./my-ec2-key
```

Add:

- `my-ec2-key.pub` → EC2 `~/.ssh/authorized_keys`
- `my-ec2-key` → GitHub Secret `EC2_SSH_KEY`

---

# 🚀 How Deployment Works

### Push to `production` → GitHub Action:

```
Push → GitHub Action triggers →
    SSH into EC2 →
        If app does NOT exist:
            install docker
            clone both repos
            create .env files
            build & run containers
            configure nginx + SSL
        Else:
            fetch latest code
            reset files
            update envs
            rebuild both frontend & backend
            restart services
```

Everything is automated.

---

# 🎉 Final Result

You get a full **MERN stack deployment pipeline** with:

- Docker  
- Docker Compose  
- Nginx Reverse Proxy  
- Auto SSL (Certbot)  
- GitHub Actions  
- EC2 / Ubuntu  

Write code → Push → Your Todo App goes live. 🚀

---

### built by:
**TheAbhiPatel**  
[Portfolio](https://www.theabhipatel.com) • [LinkedIn](https://www.linkedin.com/in/theabhipatel)
