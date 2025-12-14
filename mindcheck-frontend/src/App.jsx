import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Tracker from './pages/Tracker';
import Resources from './pages/Resources';
import Auth from './pages/Auth';

// Page transition wrapper
const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
};

// Animated routes component
const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/quiz" element={<PageTransition><Quiz /></PageTransition>} />
                <Route path="/result" element={<PageTransition><Result /></PageTransition>} />
                <Route path="/tracker" element={<PageTransition><Tracker /></PageTransition>} />
                <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
                <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <AnimatedRoutes />
                </main>
                <Footer />
                <Chatbot />
            </div>
        </Router>
    );
}

export default App;
