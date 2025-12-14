import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserAssessments, getProgressLogs } from '../services/dbService';
import { motion } from 'framer-motion';

export default function UserProfile() {
    const { currentUser, userProfile, logOut } = useAuth();
    const [assessments, setAssessments] = useState([]);
    const [progressLogs, setProgressLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserData() {
            if (currentUser) {
                try {
                    const [userAssessments, userProgress] = await Promise.all([
                        getUserAssessments(currentUser.uid, 5),
                        getProgressLogs(currentUser.uid, 7)
                    ]);
                    setAssessments(userAssessments);
                    setProgressLogs(userProgress);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                } finally {
                    setLoading(false);
                }
            }
        }

        fetchUserData();
    }, [currentUser]);

    async function handleLogout() {
        try {
            await logOut();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-coral-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8 mb-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                {userProfile?.displayName?.charAt(0)?.toUpperCase() || currentUser?.email?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {userProfile?.displayName || 'User'}
                                </h1>
                                <p className="text-gray-600">{currentUser?.email}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Member since {new Date(currentUser?.metadata?.creationTime).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </motion.div>

                {/* Assessment History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-xl p-8 mb-6"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Assessment History</h2>
                    {assessments.length > 0 ? (
                        <div className="space-y-3">
                            {assessments.map((assessment, index) => (
                                <div
                                    key={assessment.id}
                                    className="p-4 bg-teal-50 rounded-lg border border-teal-100"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {assessment.type || 'Mental Health Assessment'}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Score: {assessment.score || 'N/A'}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {assessment.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">
                            No assessments yet. Take your first assessment to get started!
                        </p>
                    )}
                </motion.div>

                {/* Progress Logs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl p-8"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Progress</h2>
                    {progressLogs.length > 0 ? (
                        <div className="space-y-3">
                            {progressLogs.map((log, index) => (
                                <div
                                    key={log.id}
                                    className="p-4 bg-coral-50 rounded-lg border border-coral-100"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Mood: {log.mood || 'Not specified'}
                                            </p>
                                            {log.notes && (
                                                <p className="text-sm text-gray-600 mt-1">{log.notes}</p>
                                            )}
                                            {log.activities && log.activities.length > 0 && (
                                                <div className="flex gap-2 mt-2">
                                                    {log.activities.map((activity, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 py-1 bg-white rounded text-xs text-gray-700"
                                                        >
                                                            {activity}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {log.date || log.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">
                            No progress logs yet. Start tracking your wellness journey!
                        </p>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
