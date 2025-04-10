import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar.jsx"
import LandingPage from "./components/LandingPage.jsx"
import QuestionsForm from './components/QuestionsForm.jsx'
import Roadmap from './components/Roadmap.jsx'
import { ProjectProvider } from './context/ProjectContext.jsx'
import ProjectForm from "./components/ProjectForm.jsx";
function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Navbar isLandingPage={true} /><LandingPage /></>} />
          <Route path="/create-project" element={<><Navbar /><ProjectForm /></>} />
          <Route path="/questions/:projectId" element={<><Navbar /><QuestionsForm /></>} />
          <Route path="/roadmap/:projectId" element={<><Navbar /><Roadmap /></>} />
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  )
}

export default App