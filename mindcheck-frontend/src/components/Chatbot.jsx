import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage, detectCrisis, getQuickActions } from '../api/chatbot';

const ChatMessage = ({ message, isUser }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser
                    ? 'bg-gradient-to-r from-accent-warm to-accent-coral text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </motion.div>
    );
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const messagesEndRef = useRef(null);
    const quickActions = getQuickActions();

    useEffect(() => {
        // Load conversation from localStorage
        const saved = localStorage.getItem('mindcheck_chat_history');
        if (saved) {
            setMessages(JSON.parse(saved));
        } else {
            // Welcome message
            setMessages([{
                role: 'assistant',
                content: "Hi! I'm here to support you. How are you feeling today? 💚\n\nRemember: I'm an AI assistant, not a therapist. For professional help, please consult a mental health professional.",
                timestamp: Date.now()
            }]);
        }
    }, []);

    useEffect(() => {
        // Save conversation to localStorage
        if (messages.length > 0) {
            localStorage.setItem('mindcheck_chat_history', JSON.stringify(messages));
        }
    }, [messages]);

    useEffect(() => {
        // Scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (messageText = inputValue) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage = {
            role: 'user',
            content: messageText,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setShowQuickActions(false);

        try {
            // Check for crisis
            if (detectCrisis(messageText)) {
                const crisisResponse = {
                    role: 'assistant',
                    content: `I'm really concerned about you. Please reach out for immediate help:

📞 **National Mental Health Helpline: 1926** (24/7, Free)
📞 **CCCline: 1333** (24/7, Toll-free)  
🚨 **Emergency Services: 110**

You don't have to face this alone. These trained professionals are ready to help you right now. Please call them.`,
                    timestamp: Date.now()
                };
                setMessages(prev => [...prev, crisisResponse]);
                setIsLoading(false);
                return;
            }

            // Get AI response
            const conversationHistory = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const aiResponse = await sendChatMessage(messageText, conversationHistory);

            const assistantMessage = {
                role: 'assistant',
                content: aiResponse,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                role: 'assistant',
                content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or reach out to our emergency contacts if you need immediate help:\n\n📞 1926 (Mental Health Helpline)\n📞 1333 (CCCline)",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (action) => {
        const responseMessage = {
            role: 'assistant',
            content: action.response,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, responseMessage]);
        setShowQuickActions(false);
    };

    const clearChat = () => {
        if (window.confirm('Clear chat history?')) {
            setMessages([{
                role: 'assistant',
                content: "Hi! I'm here to support you. How are you feeling today? 💚",
                timestamp: Date.now()
            }]);
            setShowQuickActions(true);
            localStorage.removeItem('mindcheck_chat_history');
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full shadow-2xl hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-2xl flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg">MindCheck Support</h3>
                                <p className="text-xs text-primary-100">AI Assistant • Always here for you</p>
                            </div>
                            <button
                                onClick={clearChat}
                                className="text-white hover:text-primary-100 transition-colors"
                                title="Clear chat"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            {messages.map((message, index) => (
                                <ChatMessage
                                    key={index}
                                    message={message}
                                    isUser={message.role === 'user'}
                                />
                            ))}

                            {/* Quick Actions */}
                            {showQuickActions && messages.length <= 1 && (
                                <div className="mt-4">
                                    <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {quickActions.map(action => (
                                            <button
                                                key={action.id}
                                                onClick={() => handleQuickAction(action)}
                                                className="text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-sm"
                                            >
                                                <span className="text-lg mb-1 block">{action.icon}</span>
                                                <span className="text-xs font-medium text-gray-700">{action.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Typing Indicator */}
                            {isLoading && (
                                <div className="flex justify-start mb-4">
                                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                AI assistant • Not a replacement for professional care
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
