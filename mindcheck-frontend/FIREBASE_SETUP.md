# Firebase Setup Guide for MindCheck

This guide will walk you through setting up Firebase for your MindCheck application.

## Prerequisites

- A Google account
- Your MindCheck project running locally

## Step 1: Create Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `MindCheck` (or your preferred name)
4. Click **Continue**
5. **Disable Google Analytics** (optional, makes setup faster)
6. Click **Create project**
7. Wait for project creation, then click **Continue**

## Step 2: Register Your Web App

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `MindCheck Web`
3. **Do NOT** check "Also set up Firebase Hosting" (unless you want it)
4. Click **Register app**
5. You'll see your Firebase configuration - **keep this page open!**

## Step 3: Get Your Firebase Configuration

You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "mindcheck-xxxxx.firebaseapp.com",
  projectId: "mindcheck-xxxxx",
  storageBucket: "mindcheck-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## Step 4: Add Configuration to Your Project

1. In your project, create a `.env` file in the root directory (if it doesn't exist)
2. Copy the values from Firebase config and add them to `.env`:

```env
# Gemini API Key (keep your existing key)
VITE_GEMINI_API_KEY=your_existing_gemini_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=mindcheck-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mindcheck-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=mindcheck-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

3. **Save the file**
4. **Restart your dev server** (stop with Ctrl+C and run `npm run dev` again)

## Step 5: Enable Authentication

1. In Firebase Console, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Click on **"Sign-in method"** tab

### Enable Email/Password Authentication:
1. Click on **"Email/Password"**
2. Toggle **"Enable"** to ON
3. Click **"Save"**

### Enable Google Authentication:
1. Click on **"Google"**
2. Toggle **"Enable"** to ON
3. Enter a **Project support email** (your email)
4. Click **"Save"**

## Step 6: Create Firestore Database

**Current Firebase Interface (2024+):**

1. In Firebase Console, click **"Build"** in the left sidebar to expand the menu
2. Click **"Firestore Database"**
3. Click **"Create database"** button

**Choose Starting Mode:**
4. You'll see two options:
   - **Production mode** - Secure by default (denies all reads/writes)
   - **Test mode** - Open for development (allows all reads/writes for 30 days)
   
5. Select **"Start in test mode"** for now
   - ⚠️ **Note**: This allows read/write access for 30 days. You'll need to update security rules later for production.
   
6. Click **"Next"**

**Set Location:**
7. Choose a Cloud Firestore location (select closest to your users)
   - For Sri Lanka: `asia-south1` (Mumbai, India)
   - For other regions: Choose the nearest available location
   - ⚠️ **Important**: Location cannot be changed later!
   
8. Click **"Enable"**

9. Wait for database creation (takes 30-60 seconds)

**Alternative Path (if you see different UI):**
- Some accounts may show: Click **"Cloud Firestore"** → **"Create database"**
- Or: Look for **"Firestore Database"** directly in the left sidebar (not under Build)


## Step 7: Configure Security Rules (Optional but Recommended)

Replace the default Firestore rules with these:

1. Go to **Firestore Database** → **Rules** tab
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

## Step 8: Test Your Setup

1. Make sure your dev server is running (`npm run dev`)
2. Navigate to `http://localhost:5173/signup`
3. Try creating an account
4. Check Firebase Console → Authentication → Users to see your new user
5. Check Firestore Database → Data to see your user profile

## Troubleshooting

### "Firebase API key not configured"
- Make sure your `.env` file is in the root directory (same level as `package.json`)
- Restart your dev server after creating/editing `.env`

### "Firebase: Error (auth/configuration-not-found)"
- Make sure you enabled Email/Password authentication in Firebase Console
- Check that all Firebase config values are correct in `.env`

### "Missing or insufficient permissions"
- Make sure you created the Firestore database
- Check that security rules are set correctly

### Changes not reflecting
- Always restart dev server after editing `.env` file
- Clear browser cache or try incognito mode

## Next Steps

✅ Your Firebase is now set up!

You can now:
- Sign up and log in users
- Save assessment results
- Store chat history
- Track user progress

All data will be automatically saved to Firebase Firestore.

## Important Security Notes

🔒 **Before deploying to production:**
1. Update Firestore security rules (currently in test mode)
2. Add your production domain to Firebase authorized domains
3. Never commit `.env` file to Git (it's already in `.gitignore`)
4. Consider setting up Firebase App Check for additional security

---

Need help? Check the [Firebase Documentation](https://firebase.google.com/docs) or ask for assistance!
