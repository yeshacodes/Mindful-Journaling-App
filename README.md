# 🌿 Mindful Micro-Journaling App

A calm, minimal journaling application designed to help users reflect, track moods, and build mindfulness habits.

Built with **Next.js, TypeScript, Tailwind CSS, Supabase, and OpenAI**.

---

## 🌐 Live Demo

👉 https://your-vercel-link.vercel.app

---

## ✨ Features

- 🧠 AI-powered journaling prompts (OpenAI)
- 🔐 Authentication (Email + Google OAuth via Supabase)
- 📝 Create and manage journal entries
- 🎭 Mood tagging for each entry
- 🔄 Generate new prompts dynamically
- 🎨 Clean, minimal, calming UI

---

## 🏗️ Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS  
- **Backend/Auth**: Supabase  
- **AI Integration**: OpenAI API  
- **Deployment**: Vercel  

---

## 📁 Project Structure

- **frontend/** – Main Next.js application  
- **backend/** – Placeholder for future backend logic  
- **guidelines/** – Project notes and references  


---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/mindful-micro-journaling-app.git
cd mindful-micro-journaling-app

2. Install dependencies
npm --prefix frontend install

3. Set up environment variables
Create a .env.local file inside the frontend/ folder and add:

NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
OPENAI_API_KEY=your_key

4. Run the development server
npm --prefix frontend run dev

5. Open the app
Visit:
http://localhost:3000