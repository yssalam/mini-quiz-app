import "./App.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';

// Protected Pages (placeholder for now)
import Dashboard from './pages/quiz/Dashboard';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound';

//Quiz
import Quiz from "./pages/quiz/Quiz";
import Result from "./pages/quiz/Result";
import History from "./pages/quiz/History";
import QuizResultDetail from "./pages/quiz/QuizResultDetail"


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/history" element={<History />} />
        <Route path="/quiz/result" element={<Result />} />
        <Route path="/result/:sessionId" element={<QuizResultDetail />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
              
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}


export default App;
