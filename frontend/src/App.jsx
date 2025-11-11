import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from "./components/Navbar.jsx"
import LandingPage from "./components/LandingPage.jsx"
import HomePage from "./components/HomePage.jsx"
import QuestionsForm from './components/QuestionsForm.jsx'
import Roadmap from './components/Roadmap.jsx'
import { ProjectProvider } from './context/ProjectContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import ProjectForm from "./components/ProjectForm.jsx";
import LoginPage from "./components/LoginPage.jsx";
import SignupPage from "./components/SignupPage.jsx";
import ProjectsPage from "./components/ProjectsPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";

// Component to handle the root route logic
const RootRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-rich-black to-[#071a2a]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  // If logged in, show HomePage, otherwise show LandingPage
  return isAuthenticated() ? (
    <>
      <Navbar />
      <HomePage />
    </>
  ) : (
    <>
      <Navbar isLandingPage={true} />
      <LandingPage />
    </>
  );
};

// Protected Route Component - redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-rich-black to-[#071a2a]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <BrowserRouter>
          <Routes>
            {/* Root route - shows HomePage if logged in, LandingPage if not */}
            <Route path="/" element={<RootRoute />} />

            {/* Protected routes - redirect to login if not authenticated */}
            <Route path="/create-project" element={
              <ProtectedRoute>
                <Navbar />
                <ProjectForm />
              </ProtectedRoute>
            } />

            <Route path="/questions/:projectId" element={
              <ProtectedRoute>
                <Navbar />
                <QuestionsForm />
              </ProtectedRoute>
            } />

            <Route path="/roadmap/:projectId" element={
              <ProtectedRoute>
                <Navbar />
                <Roadmap />
              </ProtectedRoute>
            } />

            <Route path="/projects" element={
              <ProtectedRoute>
                <Navbar />
                <ProjectsPage />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Navbar />
                <ProfilePage />
              </ProtectedRoute>
            } />

            {/* Public auth routes */}
            <Route path="/login" element={
              <>
                <Navbar isLandingPage={true} />
                <LoginPage />
              </>
            } />

            <Route path="/signup" element={
              <>
                <Navbar isLandingPage={true} />
                <SignupPage />
              </>
            } />
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  )
}

export default App
