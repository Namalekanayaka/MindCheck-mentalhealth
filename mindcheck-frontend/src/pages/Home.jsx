import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchRandomQuote } from '../api/api';

const Home = () => {
    const navigate = useNavigate();
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadQuote = async () => {
            try {
                const randomQuote = await fetchRandomQuote();
                setQuote(randomQuote);
            } catch (error) {
                console.error('Error loading quote:', error);
            } finally {
                setLoading(false);
            }
        };
        loadQuote();
    }, []);

    const features = [
        {
            icon: '📋',
            title: 'Mental Health Quiz',
            description: 'Take a comprehensive assessment to understand your current mental state'
        },
        {
            icon: '📊',
            title: 'Track Progress',
            description: 'Monitor your mental wellness journey with visual charts and insights'
        },
        {
            icon: '🆘',
            title: 'Access Resources',
            description: 'Find emergency hotlines, articles, and professional help when you need it'
        },
        {
            icon: '🔒',
            title: 'Private & Secure',
            description: 'Your data is stored locally and never shared without your permission'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 md:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="inline-block mb-6"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-float">
                                <span className="text-4xl">🧠</span>
                            </div>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            <span className="gradient-text">MindCheck</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Your mental health matters. Take the first step towards understanding and improving your mental wellness.
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <button
                                onClick={() => navigate('/quiz')}
                                className="btn-primary text-lg px-8 py-4 group"
                            >
                                Start Assessment
                                <svg className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                            <button
                                onClick={() => navigate('/resources')}
                                className="btn-secondary text-lg px-8 py-4"
                            >
                                View Resources
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Quote Section */}
            {!loading && quote && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="py-12 bg-white"
                >
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500">
                            <div className="flex items-start space-x-4">
                                <div className="text-4xl text-blue-500">"</div>
                                <div className="flex-1">
                                    <p className="text-lg md:text-xl text-gray-700 italic mb-2">
                                        {quote.text}
                                    </p>
                                    <p className="text-sm text-gray-500">— {quote.author}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            How <span className="gradient-text">MindCheck</span> Helps
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Comprehensive tools to support your mental wellness journey
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -5 }}
                                className="card text-center"
                            >
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Take Control of Your Mental Health?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Start your journey towards better mental wellness today
                        </p>
                        <button
                            onClick={() => navigate('/quiz')}
                            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
                        >
                            Begin Assessment Now
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Disclaimer */}
            <section className="py-8 bg-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-sm text-gray-600 text-center">
                        <strong>Disclaimer:</strong> MindCheck is not a substitute for professional medical advice, diagnosis, or treatment.
                        If you are experiencing a mental health crisis, please contact emergency services or call the National Mental Health Helpline at 1926.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;
