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
        <Navbar />
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create-project" element={<ProjectForm />} />
            <Route path="/questions/:projectId" element={<QuestionsForm />} />
            <Route path="/roadmap/:projectId" element={<Roadmap />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ProjectProvider>
  )
}

export default App