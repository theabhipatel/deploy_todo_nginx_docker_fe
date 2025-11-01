# 📝 Todo Application - Frontend

A modern, responsive Todo application frontend built with React, TypeScript, and Tailwind CSS. Features JWT authentication, beautiful UI with shadcn/ui components, and seamless API integration.

## ✨ Features

- 🔐 User authentication (Login/Signup)
- ✅ Complete todo management (Create, Read, Update, Delete)
- 🔍 Search functionality
- 📄 Pagination support
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 📱 Fully responsive design
- ⚡ Built with Vite for fast development

## 🛠 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Lucide React** - Icon library
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A running backend API (see backend repository)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/theabhipatel/deploy_todo_nginx_docker_fe.git
cd deploy_todo_nginx_docker_fe
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Replace `http://localhost:5000/api` with your backend API URL.

4. **Start the development server:**
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build files will be generated in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📱 Usage

### Create an Account
- Navigate to the signup page
- Enter your name, email, and password (minimum 6 characters)
- Click "Create account"

### Manage Todos
- **Add**: Click "Add Todo" button and fill in the details
- **Complete**: Check the checkbox to mark as done
- **Edit**: Click the edit icon to modify
- **Delete**: Click the trash icon to remove
- **Search**: Use the search bar to filter todos
- **Navigate**: Use pagination for multiple pages

## 📁 Project Structure

```
/src
  /components
    /ui              # shadcn/ui components
    ProtectedRoute.tsx
  /contexts
    AuthContext.tsx  # Authentication state
  /pages
    LoginPage.tsx
    SignupPage.tsx
    DashboardPage.tsx
  /lib
    api.ts           # API client
    utils.ts
  App.tsx
  main.tsx
  index.css
```

## 🎨 UI Components

Built with shadcn/ui:
- Button, Input, Card
- Dialog, Badge, Table
- Form components

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

**API Connection Issues:**
- Verify `VITE_API_URL` in `.env` matches your backend URL
- Ensure backend server is running
- Check CORS configuration on backend

**Build Errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

MIT License

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!


---

Built with ❤️ using React and TypeScript by [TheAbhiPatel](https://www.theabhipatel.com)