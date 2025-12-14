import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute - Wrapper component for routes that require authentication
 * Redirects to signup page if user is not authenticated
 */
export default function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-coral-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to signup if not authenticated
    if (!currentUser) {
        return <Navigate to="/signup" replace />;
    }

    // User is authenticated, render the protected content
    return children;
}
