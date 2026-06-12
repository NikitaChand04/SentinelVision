import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar       from './components/layout/Navbar'
import Footer       from './components/layout/Footer'
import LandingPage  from './pages/LandingPage'
import AboutPage    from './pages/AboutPage'
import UploadPage   from './pages/UploadPage'
import ResultsPage  from './pages/ResultsPage'
import './styles/globals.css'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/about"   element={<AboutPage />} />
        <Route path="/upload"  element={<UploadPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}