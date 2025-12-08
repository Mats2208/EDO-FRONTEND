import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Theory from './pages/Theory'
import Laboratory from './pages/Laboratory'
import Problems from './pages/Problems'
import CategoryProblems from './pages/CategoryProblems'
import About from './pages/About'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="theory" element={<Theory />} />
          <Route path="laboratory" element={<Laboratory />} />
          <Route path="problems" element={<Problems />} />
          <Route path="problems/:categoryId" element={<CategoryProblems />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  )
}