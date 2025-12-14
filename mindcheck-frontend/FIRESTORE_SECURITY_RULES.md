# Firestore Security Rules for MindCheck

## Overview
These security rules ensure that users can only access their own data in Firestore.

## How to Apply These Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your MindCheck project
3. Click **"Build"** → **"Firestore Database"**
4. Click the **"Rules"** tab
5. Replace the existing rules with the rules below
6. Click **"Publish"**

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      // Allow read/write only if authenticated and accessing own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Assessments subcollection
      match /assessments/{assessmentId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Chat history subcollection
      match /chatHistory/{conversationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Progress logs subcollection
      match /progressLogs/{logId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## What These Rules Do

### ✅ **Allowed:**
- Users can read their own profile data
- Users can write to their own profile
- Users can read/write their own assessments
- Users can read/write their own chat history
- Users can read/write their own progress logs

### ❌ **Blocked:**
- Unauthenticated users cannot access any data
- Users cannot read other users' data
- Users cannot write to other users' data
- Users cannot list all users

## Testing Your Rules

### Test 1: User Can Access Own Data
1. Log in as User A
2. Take a quiz
3. Check profile - should see your own results ✅

### Test 2: User Cannot Access Other User's Data
1. Log in as User A, take quiz
2. Log out, log in as User B
3. Check profile - should NOT see User A's results ✅

### Test 3: Unauthenticated Access Blocked
1. Log out
2. Try to access any data directly
3. Should be denied ✅

## Important Notes

> [!WARNING]
> **Test Mode Expiration**
> If you previously set up Firestore in "test mode", those rules will expire after 30 days. Make sure to apply these production rules before that!

> [!IMPORTANT]
> **Apply These Rules Now**
> Without these rules, users can potentially see each other's data. Apply these rules immediately to secure your application.

## Troubleshooting

### "Missing or insufficient permissions" error
- Make sure you're logged in
- Verify the rules are published
- Check that you're accessing your own data (correct userId)

### Rules not applying
- Click "Publish" after editing rules
- Wait 30-60 seconds for rules to propagate
- Refresh your app

---

**Your data is now secure!** 🔒 Users can only access their own information.
