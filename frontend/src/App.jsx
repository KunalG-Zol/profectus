import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar.jsx"
import LandingPage from "./components/LandingPage.jsx"
import QuestionsForm from './components/QuestionsForm.jsx'
import Roadmap from './components/Roadmap.jsx'
import { ProjectProvider } from './context/ProjectContext.jsx'
import ProjectForm from "./components/ProjectForm.jsx";
import LoginPage from "./components/LoginPage.jsx";
import SignupPage from "./components/SignupPage.jsx";
import ProjectsPage from "./components/ProjectsPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import AuthCallback from "./components/AuthCallback.jsx";
function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Navbar isLandingPage={true} /><LandingPage /></>} />
          <Route path="/project-form" element={<><Navbar /><ProjectForm /></>} />
          <Route path="/questions/:projectId" element={<><Navbar /><QuestionsForm /></>} />
          <Route path="/roadmap/:projectId" element={<><Navbar /><Roadmap /></>} />
          <Route path="/login" element={<><Navbar isLandingPage={true} /><LoginPage /></>} />
          <Route path="/signup" element={<><Navbar isLandingPage={true} /><SignupPage /></>} />
          <Route path="/projects" element={<><Navbar /><ProjectsPage /></>} />
          <Route path="/profile" element={<><Navbar /><ProfilePage /></>} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  )
}

export default App;
