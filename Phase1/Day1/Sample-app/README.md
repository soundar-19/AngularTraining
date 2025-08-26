# 🚀 Sample App - Angular Training Project

<div align="center">

![Angular](https://img.shields.io/badge/Angular-20.1.6-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

</div>

## 📋 Project Overview

A modern Angular application demonstrating **standalone components**, **routing**, and **global styling**. Built as part of Angular Training Phase 1, Day 1.

### ✨ Features

- 🎯 **Standalone Components** - Modern Angular architecture
- 🧭 **Client-side Routing** - Navigate between pages seamlessly
- 🎨 **Global & Component Styling** - Beautiful UI with CSS styling
- 📱 **Responsive Design** - Works on all devices
- 🔧 **TypeScript Support** - Type-safe development

## 🏗️ Project Structure

```
📦 Sample-app/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 pages/
│   │   │   ├── 📁 dashboard/          # 📊 Dashboard Component
│   │   │   │   ├── dashboard.ts
│   │   │   │   ├── dashboard.html
│   │   │   │   └── dashboard.css
│   │   │   ├── 📁 bugs/               # 🐛 Bugs Component
│   │   │   │   ├── bugs.ts
│   │   │   │   ├── bugs.html
│   │   │   │   └── bugs.css
│   │   │   └── 📁 login/              # 🔐 Login Component
│   │   │       ├── login.ts
│   │   │       ├── login.html
│   │   │       └── login.css
│   │   ├── app.ts                     # 🏠 Main App Component
│   │   ├── app.html                   # 📄 App Template
│   │   ├── app.css                    # 🎨 App Styles
│   │   ├── app.routes.ts              # 🛣️ Routing Configuration
│   │   └── app.config.ts              # ⚙️ App Configuration
│   ├── main.ts                        # 🚀 Bootstrap Entry Point
│   ├── styles.css                     # 🌍 Global Styles
│   └── index.html                     # 📋 HTML Entry Point
├── angular.json                       # 🔧 Angular CLI Config
├── package.json                       # 📦 Dependencies
└── tsconfig.json                      # 📝 TypeScript Config
```

## 🗺️ Application Flow

```mermaid
graph TD
    A[🏠 App Root] --> B[🧭 Router Outlet]
    B --> C[📊 Dashboard]
    B --> D[🐛 Bugs]
    B --> E[🔐 Login]
    
    F[🌍 Global Styles] --> C
    F --> D
    F --> E
    
    G[🎨 Component Styles] --> C
    H[🎨 Component Styles] --> D
    I[🎨 Component Styles] --> E
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style F fill:#f1f8e9
```

## 🛣️ Routing Configuration

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | 🔄 Redirect | → Dashboard |
| `/dashboard` | 📊 Dashboard | Main dashboard page |
| `/bugs` | 🐛 Bugs | Bug tracking page |
| `/login` | 🔐 Login | User authentication |
| `/**` | 🔄 Wildcard | → Dashboard |

## 🎨 Styling Architecture

```mermaid
flowchart LR
    A[🌍 Global Styles<br/>styles.css] --> B[📱 All Components]
    C[🎨 App Styles<br/>app.css] --> D[🏠 App Component]
    E[🎯 Component Styles] --> F[📊 Dashboard]
    E --> G[🐛 Bugs]
    E --> H[🔐 Login]
    
    style A fill:#4caf50,color:#fff
    style C fill:#2196f3,color:#fff
    style E fill:#ff9800,color:#fff
```

## 🚀 Getting Started

### Prerequisites
- 📦 Node.js (v18+)
- 🅰️ Angular CLI (v20+)
- 💻 VS Code (recommended)

### Installation

```bash
# 📥 Clone the repository
git clone <repository-url>

# 📂 Navigate to project
cd Sample-app

# 📦 Install dependencies
npm install
```

### 🏃‍♂️ Development Server

```bash
# 🚀 Start development server
npm start
# or
ng serve
```

🌐 Open [http://localhost:4200](http://localhost:4200) in your browser

### 🏗️ Build for Production

```bash
# 📦 Build the project
npm run build
# or
ng build
```

## 🧪 Testing

```bash
# 🧪 Run unit tests
npm test

# 🔍 Run e2e tests
npm run e2e
```

## 🛠️ Key Technologies

<div align="center">

| Technology | Version | Purpose |
|------------|---------|----------|
| 🅰️ **Angular** | 20.1.6 | Frontend Framework |
| 📘 **TypeScript** | 5.0+ | Type Safety |
| 🎨 **CSS3** | Latest | Styling |
| 🧭 **Angular Router** | 20.1.6 | Navigation |
| 🔧 **Angular CLI** | 20.1.6 | Development Tools |

</div>

## 📚 Learning Objectives

- ✅ **Standalone Components** - Modern Angular architecture
- ✅ **Routing & Navigation** - Single Page Application
- ✅ **Component Communication** - Data flow patterns
- ✅ **Styling Strategies** - Global vs Component styles
- ✅ **TypeScript Integration** - Type-safe development

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to branch (`git push origin feature/amazing-feature`)
5. 🔄 Open Pull Request

## Author
- **Soundar Raja B**

## 📄 License

This project is part of Angular Training materials.

---

