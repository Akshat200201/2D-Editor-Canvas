import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { generateSceneId } from './utils/sceneUtils';
import CanvasEditor from './components/CanvasEditor';
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to={`/canvas/${generateSceneId()}`} replace />} />
          <Route path="/canvas/:id" element={<CanvasEditor />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
