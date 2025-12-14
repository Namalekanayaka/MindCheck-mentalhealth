import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchQuestions } from '../api/api';
import { saveQuizResult } from '../utils/localStorage';
import { useAuth } from '../contexts/AuthContext';
import { saveAssessment } from '../services/dbService';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';

const Quiz = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const data = await fetchQuestions();
                setQuestions(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load questions. Please try again.');
                setLoading(false);
            }
        };
        loadQuestions();
    }, []);

    const handleAnswer = (value) => {
        setAnswers({
            ...answers,
            [questions[currentQuestionIndex].id]: value
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        // Calculate total score
        const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);

        // Save to localStorage (for backward compatibility)
        saveQuizResult(totalScore, answers);

        // Save to Firebase for current user
        if (currentUser) {
            try {
                await saveAssessment(currentUser.uid, {
                    type: 'Mental Health Assessment',
                    score: totalScore,
                    totalQuestions: questions.length,
                    answers: answers,
                    completedAt: new Date().toISOString()
                });
            } catch (error) {
                console.error('Failed to save assessment to Firebase:', error);
                // Continue to results page even if save fails
            }
        }

        // Navigate to results page
        navigate('/result', {
            state: {
                score: totalScore,
                totalQuestions: questions.length,
                answers
            }
        });
    };

    const isAnswered = answers[questions[currentQuestionIndex]?.id] !== undefined;
    const allAnswered = questions.every(q => answers[q.id] !== undefined);
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600">Loading questions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="card max-w-md text-center">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button onClick={() => window.location.reload()} className="btn-primary">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="gradient-text">Mental Health Assessment</span>
                    </h1>
                    <p className="text-gray-600">
                        Please answer the following questions honestly. There are no right or wrong answers.
                    </p>
                </motion.div>

                {/* Progress Bar */}
                <ProgressBar
                    current={currentQuestionIndex + 1}
                    total={questions.length}
                />

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <QuestionCard
                        key={currentQuestionIndex}
                        question={questions[currentQuestionIndex]}
                        selectedValue={answers[questions[currentQuestionIndex].id]}
                        onSelect={handleAnswer}
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={questions.length}
                    />
                </AnimatePresence>

                {/* Navigation Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8 max-w-3xl mx-auto"
                >
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${currentQuestionIndex === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        ← Previous
                    </button>

                    <div className="flex gap-2">
                        {questions.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentQuestionIndex
                                    ? 'bg-blue-600 w-8'
                                    : answers[questions[index].id] !== undefined
                                        ? 'bg-green-500'
                                        : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!allAnswered}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${allAnswered
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Submit Quiz ✓
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={!isAnswered}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${isAnswered
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Next →
                        </button>
                    )}
                </motion.div>

                {/* Help Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 text-center"
                >
                    <p className="text-sm text-gray-500">
                        {allAnswered
                            ? '✓ All questions answered. You can submit the quiz now.'
                            : `${Object.keys(answers).length} of ${questions.length} questions answered`}
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Quiz;
