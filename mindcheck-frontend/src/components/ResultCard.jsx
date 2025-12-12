import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ResultCard = ({ score, totalQuestions }) => {
    const navigate = useNavigate();
    const maxScore = totalQuestions * 3;
    const percentage = (score / maxScore) * 100;

    // Determine severity level and styling
    const getSeverityInfo = () => {
        if (percentage <= 25) {
            return {
                level: 'Minimal',
                color: 'mental-calm',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-500',
                textColor: 'text-green-700',
                gradient: 'from-green-400 to-emerald-500',
                message: 'You appear to be doing well! Keep up the good work with self-care.',
                recommendations: [
                    'Continue your current wellness practices',
                    'Maintain healthy sleep and exercise routines',
                    'Stay connected with friends and family',
                    'Practice gratitude and mindfulness'
                ]
            };
        } else if (percentage <= 50) {
            return {
                level: 'Mild',
                color: 'mental-mild',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-500',
                textColor: 'text-yellow-700',
                gradient: 'from-yellow-400 to-orange-400',
                message: 'You may be experiencing some challenges. Consider reaching out for support.',
                recommendations: [
                    'Talk to someone you trust about how you\'re feeling',
                    'Consider speaking with a counselor or therapist',
                    'Practice stress-reduction techniques',
                    'Ensure you\'re getting adequate sleep and nutrition'
                ]
            };
        } else if (percentage <= 75) {
            return {
                level: 'Moderate',
                color: 'mental-moderate',
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-500',
                textColor: 'text-orange-700',
                gradient: 'from-orange-400 to-red-400',
                message: 'You may be experiencing significant distress. Professional support is recommended.',
                recommendations: [
                    'Reach out to a mental health professional',
                    'Contact your doctor for a referral',
                    'Use the resources page for immediate support',
                    'Call 1926 (Mental Health Helpline) or 1333 (CCCline) if needed'
                ]
            };
        } else {
            return {
                level: 'Severe',
                color: 'mental-severe',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-500',
                textColor: 'text-red-700',
                gradient: 'from-red-500 to-pink-500',
                message: 'Please seek professional help immediately. You don\'t have to face this alone.',
                recommendations: [
                    'Contact a mental health professional today',
                    'Call National Mental Health Helpline: 1926 (24/7, Free)',
                    'Call CCCline: 1333 or Sri Lanka Sumithrayo: 011 2692 909',
                    'Visit your nearest hospital emergency department or call 110 if in crisis'
                ]
            };
        }
    };

    const severityInfo = getSeverityInfo();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Score Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`card ${severityInfo.bgColor} border-2 ${severityInfo.borderColor}`}
            >
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                        Your Assessment Results
                    </h2>

                    {/* Score Display */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="relative inline-block mb-6"
                    >
                        <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${severityInfo.gradient} flex items-center justify-center shadow-2xl`}>
                            <div className="text-center">
                                <div className="text-5xl font-bold text-white">{score}</div>
                                <div className="text-sm text-white/90">out of {maxScore}</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Severity Level */}
                    <div className={`inline-block px-6 py-2 rounded-full ${severityInfo.textColor} font-bold text-lg mb-4`}>
                        {severityInfo.level} Level
                    </div>

                    {/* Message */}
                    <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
                        {severityInfo.message}
                    </p>
                </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
            >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recommendations</h3>
                <ul className="space-y-3">
                    {severityInfo.recommendations.map((rec, index) => (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="flex items-start space-x-3"
                        >
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${severityInfo.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-gray-700">{rec}</span>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
            >
                <button
                    onClick={() => navigate('/resources')}
                    className="btn-primary"
                >
                    View Resources
                </button>
                <button
                    onClick={() => navigate('/tracker')}
                    className="btn-secondary"
                >
                    Track Progress
                </button>
                <button
                    onClick={() => navigate('/quiz')}
                    className="btn-secondary"
                >
                    Retake Quiz
                </button>
            </motion.div>

            {/* Disclaimer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded"
            >
                <p className="text-sm text-blue-800">
                    <strong>Important:</strong> This assessment is not a diagnostic tool. It's designed to help you
                    understand your current mental state. Please consult with a qualified mental health professional
                    for proper diagnosis and treatment.
                </p>
            </motion.div>
        </div>
    );
};

export default ResultCard;
