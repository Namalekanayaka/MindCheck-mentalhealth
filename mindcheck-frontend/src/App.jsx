import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Tracker from './pages/Tracker';
import Resources from './pages/Resources';
import Auth from './pages/Auth';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import UserProfile from './components/UserProfile';

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
                {/* Default redirect to signup */}
                <Route path="/" element={<Navigate to="/signup" replace />} />

                {/* Public routes - redirect to home if already logged in */}
                <Route path="/login" element={
                    <PublicRoute>
                        <PageTransition><Login /></PageTransition>
                    </PublicRoute>
                } />
                <Route path="/signup" element={
                    <PublicRoute>
                        <PageTransition><SignUp /></PageTransition>
                    </PublicRoute>
                } />

                {/* Protected routes - require authentication */}
                <Route path="/home" element={
                    <ProtectedRoute>
                        <PageTransition><Home /></PageTransition>
                    </ProtectedRoute>
                } />
                <Route path="/quiz" element={
                    <ProtectedRoute>
                        <PageTransition><Quiz /></PageTransition>
                    </ProtectedRoute>
                } />
                <Route path="/result" element={
                    <ProtectedRoute>
                        <PageTransition><Result /></PageTransition>
                    </ProtectedRoute>
                } />
                <Route path="/tracker" element={
                    <ProtectedRoute>
                        <PageTransition><Tracker /></PageTransition>
                    </ProtectedRoute>
                } />
                <Route path="/resources" element={
                    <ProtectedRoute>
                        <PageTransition><Resources /></PageTransition>
                    </ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <PageTransition><UserProfile /></PageTransition>
                    </ProtectedRoute>
                } />

                {/* Legacy auth route - redirect to signup */}
                <Route path="/auth" element={<Navigate to="/signup" replace />} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                        <AnimatedRoutes />
                    </main>
                    <Footer />
                    <Chatbot />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
