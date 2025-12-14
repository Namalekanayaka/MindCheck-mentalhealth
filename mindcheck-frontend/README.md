# MindCheck

Mental health assessment platform with AI chatbot support and progress tracking.

## Features

- 🔐 User authentication (Email/Password & Google)
- 📊 Mental health assessment quiz
- 💬 AI-powered chatbot (Google Gemini)
- 📈 Progress tracking and mood logging
- 🎨 Modern, responsive UI

## Tech Stack

React • Firebase • Tailwind CSS • Vite • Google Gemini AI

## Setup

```bash
# Install dependencies
npm install

# Create .env file with your credentials
cp .env.example .env

# Run development server
npm run dev
```

## Environment Variables

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Build

```bash
npm run build
```

## Deploy

Deploy to Vercel with one click or push to GitHub and connect to Vercel.

## License

MIT
