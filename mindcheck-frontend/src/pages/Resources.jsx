import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchResources } from '../api/api';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const loadResources = async () => {
            try {
                const data = await fetchResources();
                setResources(data);
            } catch (error) {
                console.error('Error loading resources:', error);
            } finally {
                setLoading(false);
            }
        };
        loadResources();
    }, []);

    const categories = ['All', ...new Set(resources.map(r => r.category))];
    const filteredResources = filter === 'All'
        ? resources
        : resources.filter(r => r.category === filter);

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Emergency Hotlines':
                return 'from-red-500 to-pink-500';
            case 'Online Resources':
                return 'from-blue-500 to-cyan-500';
            case 'Self-Help Tools':
                return 'from-green-500 to-emerald-500';
            case 'Professional Help':
                return 'from-purple-500 to-indigo-500';
            default:
                return 'from-gray-500 to-slate-500';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Emergency Hotlines':
                return '🆘';
            case 'Online Resources':
                return '📚';
            case 'Self-Help Tools':
                return '🧘';
            case 'Professional Help':
                return '👨‍⚕️';
            default:
                return '📌';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600">Loading resources...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="gradient-text">Mental Health Resources</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Access emergency hotlines, helpful articles, and professional support services
                    </p>
                </motion.div>

                {/* Emergency Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-500 mb-8"
                >
                    <div className="flex items-start space-x-4">
                        <div className="text-4xl">🆘</div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-red-700 mb-2">In Crisis? Get Help Now</h3>
                            <div className="space-y-2 text-gray-700">
                                <p>
                                    <strong>National Mental Health Helpline:</strong>{' '}
                                    <a href="tel:1926" className="text-red-600 hover:text-red-700 font-bold text-lg">
                                        1926
                                    </a>
                                    {' '}(24/7, Free)
                                </p>
                                <p>
                                    <strong>CCCline Crisis Support:</strong>{' '}
                                    <a href="tel:1333" className="text-red-600 hover:text-red-700 font-bold text-lg">
                                        1333
                                    </a>
                                    {' '}(24/7, Toll-free)
                                </p>
                                <p>
                                    <strong>Sri Lanka Sumithrayo:</strong>{' '}
                                    <a href="tel:0112692909" className="text-red-600 hover:text-red-700 font-bold">
                                        011 2692 909
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-3 mb-8"
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${filter === category
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource, index) => (
                        <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="card group cursor-pointer"
                        >
                            {/* Category Badge */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-3xl">{getCategoryIcon(resource.category)}</span>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(resource.category)} text-white`}>
                                    {resource.category}
                                </span>
                            </div>

                            {/* Resource Info */}
                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                {resource.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4">
                                {resource.description}
                            </p>

                            {/* Contact Info */}
                            {resource.contact !== 'N/A' && (
                                <div className="mb-3">
                                    <span className="text-sm font-semibold text-gray-700">Contact: </span>
                                    <span className="text-sm text-blue-600 font-semibold">
                                        {resource.contact}
                                    </span>
                                </div>
                            )}

                            {/* Website Link */}
                            {resource.website && (
                                <a
                                    href={resource.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-semibold group"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Visit Website
                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            )}

                            {/* Country Tag */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <span className="text-xs text-gray-500">
                                    📍 {resource.country}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* No Results */}
                {filteredResources.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No resources found</h3>
                        <p className="text-gray-600">Try selecting a different category</p>
                    </div>
                )}

                {/* Disclaimer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded"
                >
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> These resources are provided for informational purposes only.
                        MindCheck does not endorse or guarantee the services of any listed organization.
                        Always consult with qualified healthcare professionals for medical advice.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Resources;
