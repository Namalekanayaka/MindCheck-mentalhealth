# Quick Start: Using Firebase in MindCheck

## Overview

Firebase is now integrated into MindCheck! Here's how to use the database features in your code.

## Authentication

### Using the Auth Hook

```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { currentUser, userProfile, signUp, signIn, signInWithGoogle, logOut } = useAuth();

  // currentUser - Firebase user object (null if not logged in)
  // userProfile - User profile from Firestore
  
  return (
    <div>
      {currentUser ? (
        <p>Welcome, {userProfile?.displayName}!</p>
      ) : (
        <button onClick={() => signIn(email, password)}>Login</button>
      )}
    </div>
  );
}
```

## Database Operations

### Saving Assessment Results

```jsx
import { saveAssessment } from './services/dbService';
import { useAuth } from './contexts/AuthContext';

function QuizResults() {
  const { currentUser } = useAuth();

  async function handleSaveResults(results) {
    if (currentUser) {
      await saveAssessment(currentUser.uid, {
        type: 'Mental Health Assessment',
        score: results.score,
        answers: results.answers,
        recommendation: results.recommendation
      });
    }
  }
}
```

### Saving Chat History

```jsx
import { saveChatConversation, updateChatConversation } from './services/dbService';
import { useAuth } from './contexts/AuthContext';

function Chatbot() {
  const { currentUser } = useAuth();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);

  async function saveConversation() {
    if (currentUser) {
      if (!conversationId) {
        // Create new conversation
        const id = await saveChatConversation(currentUser.uid, { messages });
        setConversationId(id);
      } else {
        // Update existing conversation
        await updateChatConversation(currentUser.uid, conversationId, messages);
      }
    }
  }
}
```

### Logging Progress

```jsx
import { logProgress } from './services/dbService';
import { useAuth } from './contexts/AuthContext';

function MoodTracker() {
  const { currentUser } = useAuth();

  async function handleLogMood(moodData) {
    if (currentUser) {
      await logProgress(currentUser.uid, {
        mood: moodData.mood,
        activities: moodData.activities,
        notes: moodData.notes,
        date: new Date().toISOString().split('T')[0]
      });
    }
  }
}
```

### Retrieving Data

```jsx
import { getUserAssessments, getProgressLogs, getChatHistory } from './services/dbService';
import { useAuth } from './contexts/AuthContext';

function UserDashboard() {
  const { currentUser } = useAuth();
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    async function loadData() {
      if (currentUser) {
        // Get last 10 assessments
        const userAssessments = await getUserAssessments(currentUser.uid, 10);
        setAssessments(userAssessments);

        // Get last 30 days of progress
        const progress = await getProgressLogs(currentUser.uid, 30);
        
        // Get chat history
        const chats = await getChatHistory(currentUser.uid, 5);
      }
    }
    loadData();
  }, [currentUser]);
}
```

## Database Structure

Your data is organized like this in Firestore:

```
users/
  {userId}/
    - email
    - displayName
    - authProvider
    - createdAt
    - updatedAt
    
    assessments/
      {assessmentId}/
        - type
        - score
        - answers
        - recommendation
        - createdAt
    
    chatHistory/
      {conversationId}/
        - messages: [{role, content, timestamp}]
        - startedAt
        - lastMessageAt
    
    progressLogs/
      {logId}/
        - mood
        - activities
        - notes
        - date
        - createdAt
```

## Available Functions

### Authentication (`authService.js`)
- `signUpWithEmail(email, password, displayName)` - Create new account
- `signInWithEmail(email, password)` - Sign in with email
- `signInWithGoogle()` - Sign in with Google
- `logOut()` - Sign out current user
- `resetPassword(email)` - Send password reset email
- `getUserProfile(userId)` - Get user profile from Firestore

### Database (`dbService.js`)

**User Profiles:**
- `updateUserProfile(userId, profileData)` - Update user profile
- `getUserProfile(userId)` - Get user profile

**Assessments:**
- `saveAssessment(userId, assessmentData)` - Save assessment result
- `getUserAssessments(userId, limit)` - Get user's assessments
- `getLatestAssessment(userId)` - Get most recent assessment

**Chat History:**
- `saveChatConversation(userId, conversationData)` - Create new conversation
- `updateChatConversation(userId, conversationId, messages)` - Update conversation
- `getChatHistory(userId, limit)` - Get chat history
- `getConversation(userId, conversationId)` - Get specific conversation

**Progress Tracking:**
- `logProgress(userId, progressData)` - Log mood/wellness entry
- `getProgressLogs(userId, limit)` - Get progress logs
- `getProgressLogsByDateRange(userId, startDate, endDate)` - Get logs in date range

## Tips

1. **Always check if user is logged in** before saving data:
   ```jsx
   if (currentUser) {
     // Save data
   }
   ```

2. **Handle errors gracefully**:
   ```jsx
   try {
     await saveAssessment(userId, data);
   } catch (error) {
     console.error('Failed to save:', error);
     // Show error message to user
   }
   ```

3. **Loading states**: Database operations are async, show loading indicators

4. **Offline support**: Firebase caches data automatically for offline use

---

That's it! You're ready to use Firebase in MindCheck. 🚀
