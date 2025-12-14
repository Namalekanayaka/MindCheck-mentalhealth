import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ==================== USER PROFILES ====================

/**
 * Update user profile
 */
export async function updateUserProfile(userId, profileData) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            ...profileData,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
}

// ==================== ASSESSMENTS ====================

/**
 * Save assessment result
 */
export async function saveAssessment(userId, assessmentData) {
    try {
        const assessmentsRef = collection(db, 'users', userId, 'assessments');
        const docRef = await addDoc(assessmentsRef, {
            ...assessmentData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error saving assessment:', error);
        throw error;
    }
}

/**
 * Get all assessments for a user
 */
export async function getUserAssessments(userId, limitCount = 10) {
    try {
        const assessmentsRef = collection(db, 'users', userId, 'assessments');
        const q = query(assessmentsRef, orderBy('createdAt', 'desc'), limit(limitCount));
        const querySnapshot = await getDocs(q);

        const assessments = [];
        querySnapshot.forEach((doc) => {
            assessments.push({ id: doc.id, ...doc.data() });
        });

        return assessments;
    } catch (error) {
        console.error('Error getting assessments:', error);
        throw error;
    }
}

/**
 * Get latest assessment
 */
export async function getLatestAssessment(userId) {
    try {
        const assessments = await getUserAssessments(userId, 1);
        return assessments.length > 0 ? assessments[0] : null;
    } catch (error) {
        console.error('Error getting latest assessment:', error);
        throw error;
    }
}

// ==================== CHAT HISTORY ====================

/**
 * Save chat conversation
 */
export async function saveChatConversation(userId, conversationData) {
    try {
        const chatRef = collection(db, 'users', userId, 'chatHistory');
        const docRef = await addDoc(chatRef, {
            messages: conversationData.messages,
            startedAt: serverTimestamp(),
            lastMessageAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error saving chat conversation:', error);
        throw error;
    }
}

/**
 * Update existing chat conversation
 */
export async function updateChatConversation(userId, conversationId, messages) {
    try {
        const chatRef = doc(db, 'users', userId, 'chatHistory', conversationId);
        await updateDoc(chatRef, {
            messages: messages,
            lastMessageAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating chat conversation:', error);
        throw error;
    }
}

/**
 * Get chat history for a user
 */
export async function getChatHistory(userId, limitCount = 10) {
    try {
        const chatRef = collection(db, 'users', userId, 'chatHistory');
        const q = query(chatRef, orderBy('lastMessageAt', 'desc'), limit(limitCount));
        const querySnapshot = await getDocs(q);

        const conversations = [];
        querySnapshot.forEach((doc) => {
            conversations.push({ id: doc.id, ...doc.data() });
        });

        return conversations;
    } catch (error) {
        console.error('Error getting chat history:', error);
        throw error;
    }
}

/**
 * Get specific conversation
 */
export async function getConversation(userId, conversationId) {
    try {
        const chatRef = doc(db, 'users', userId, 'chatHistory', conversationId);
        const chatDoc = await getDoc(chatRef);

        if (chatDoc.exists()) {
            return { id: chatDoc.id, ...chatDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting conversation:', error);
        throw error;
    }
}

// ==================== PROGRESS TRACKING ====================

/**
 * Log mood/wellness entry
 */
export async function logProgress(userId, progressData) {
    try {
        const progressRef = collection(db, 'users', userId, 'progressLogs');
        const docRef = await addDoc(progressRef, {
            mood: progressData.mood,
            activities: progressData.activities || [],
            notes: progressData.notes || '',
            date: progressData.date || new Date().toISOString().split('T')[0],
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error logging progress:', error);
        throw error;
    }
}

/**
 * Get progress logs for a user
 */
export async function getProgressLogs(userId, limitCount = 30) {
    try {
        const progressRef = collection(db, 'users', userId, 'progressLogs');
        const q = query(progressRef, orderBy('createdAt', 'desc'), limit(limitCount));
        const querySnapshot = await getDocs(q);

        const logs = [];
        querySnapshot.forEach((doc) => {
            logs.push({ id: doc.id, ...doc.data() });
        });

        return logs;
    } catch (error) {
        console.error('Error getting progress logs:', error);
        throw error;
    }
}

/**
 * Get progress logs for a date range
 */
export async function getProgressLogsByDateRange(userId, startDate, endDate) {
    try {
        const progressRef = collection(db, 'users', userId, 'progressLogs');
        const q = query(
            progressRef,
            where('date', '>=', startDate),
            where('date', '<=', endDate),
            orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);

        const logs = [];
        querySnapshot.forEach((doc) => {
            logs.push({ id: doc.id, ...doc.data() });
        });

        return logs;
    } catch (error) {
        console.error('Error getting progress logs by date range:', error);
        throw error;
    }
}
