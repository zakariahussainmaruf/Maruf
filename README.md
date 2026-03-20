# 📚 LearningHub — IELTS Preparation Platform

A comprehensive full-stack education platform for IELTS preparation built with React, TypeScript, Firebase, and Tailwind CSS.

## 🚀 Features

- 🔐 Authentication (Email/Password + Google Sign-In)
- 📝 Practice Tests with detailed feedback
- 📖 Module Study Pages
- 🎯 Personalized Study Plans
- 👑 Admin Panel
- 👤 User Dashboard
- 🔔 Notification System
- 🎨 Beautiful UI with animations

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Backend/DB:** Firebase (Auth + Firestore)
- **Build Tool:** Vite
- **Animations:** Custom CSS animations

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/zakariahussainmaruf/learninghub.git
   cd learninghub
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a \`.env.local\` file and add your Firebase config:
   \`\`\`env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

\`\`\`
├── components/
│   ├── AdminPanel.tsx
│   ├── AuthModal.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── ServicesPage.tsx
│   ├── UserPanel.tsx
│   └── ...
├── src/
│   └── lib/
│       └── firebase.ts
├── App.tsx
├── index.tsx
└── index.html
\`\`\`

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_FIREBASE_API_KEY | Firebase API Key |
| VITE_FIREBASE_AUTH_DOMAIN | Firebase Auth Domain |
| VITE_FIREBASE_PROJECT_ID | Firebase Project ID |

## 👨‍💻 Developer

**Zakaria Hussain Maruf** — Full Stack Web Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/zakariahussainmaruf)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zakariahussainmaruf)
