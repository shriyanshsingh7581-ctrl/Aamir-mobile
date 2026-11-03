# AAMIR MOBILE (AM) Dhampur — Vercel Deployment Guide

Yeh project **Vercel** par zero-error deployment ke liye poori tarah ready hai. Sabhi required configuration files project root mein create kar di gayi hain:

## 1. Created Vercel Files in Project Root
- **`/vercel.json`**:
  ```json
  {
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "framework": "vite",
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "installCommand": "npm install --legacy-peer-deps",
    "rewrites": [
      {
        "source": "/admin",
        "destination": "/index.html"
      },
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```
- **`/.npmrc`**: `legacy-peer-deps=true` (Vercel par `npm install` ke dauran kisi bhi dependency conflict ko rokne ke liye).
- **`/.vercelignore`**: Extra test/log files ko ignore karne ke liye.
- **`/firebase-applet-config.json`**: Real-time Firebase Firestore (`ai-studio-aamirmobilehub-a41f5d28-fae4-48e4-9e88-2703769df1f4`) se pre-connected hai.

---

## 2. Vercel Par Deploy Kaise Karein (Step-by-Step)

### Option A: GitHub se Direct Deploy (Recommended)
1. AI Studio ke top-right menu se **Export to GitHub** ya **Download ZIP** karein.
2. Agar آپ GitHub par push kar rahe hain aur Vercel par public npm registry se build chalate waqt package version error aaye, to `package.json` mein yeh standard public npm versions rakhein:
   ```json
   {
     "name": "aamir-mobile-dhampur",
     "private": true,
     "version": "1.0.0",
     "type": "module",
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     },
     "dependencies": {
       "@tailwindcss/vite": "^4.0.9",
       "@vitejs/plugin-react": "^4.3.4",
       "firebase": "^11.4.0",
       "lucide-react": "^0.475.0",
       "react": "^19.0.0",
       "react-dom": "^19.0.0",
       "tailwindcss": "^4.0.9",
       "vite": "^6.2.0"
     },
     "devDependencies": {
       "@types/react": "^19.0.0",
       "@types/react-dom": "^19.0.0",
       "typescript": "^5.7.2"
     }
   }
   ```
3. [https://vercel.com/new](https://vercel.com/new) par jayein aur apni GitHub repository **Import** karein.
4. **Framework Preset**: `Vite` (Vercel `vercel.json` se automatically detect kar lega).
5. **Click Deploy** — 40 seconds mein aapki live website ready ho jayegi!

### Option B: Firebase Google Login Domain Allowlist (After Deploy)
Jab aapka Vercel URL live ho jaye (jaise `https://aamir-mobile.vercel.app`), agar aap Admin Panel (`/?admin=true`, PIN: `7777`) mein **Google Admin Sign-In** use karna chahein, to Firebase Console -> **Authentication** -> **Settings** -> **Authorized domains** mein apna `.vercel.app` domain add kar lein.
