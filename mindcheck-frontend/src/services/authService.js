import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/**
 * Create a new user profile in Firestore
 */
async function createUserProfile(userId, userData) {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...userData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email, password, displayName) {
    try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update display name
        if (displayName) {
            await updateProfile(user, { displayName });
        }

        // Create user profile in Firestore
        await createUserProfile(user.uid, {
            email: user.email,
            displayName: displayName || '',
            authProvider: 'email',
            photoURL: user.photoURL || null
        });

        return user;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if user profile exists
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        // Create profile if it doesn't exist
        if (!userDoc.exists()) {
            await createUserProfile(user.uid, {
                email: user.email,
                displayName: user.displayName || '',
                authProvider: 'google',
                photoURL: user.photoURL || null
            });
        }

        return user;
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
}

/**
 * Sign out current user
 */
export async function logOut() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
}

/**
 * Get current user profile from Firestore
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
