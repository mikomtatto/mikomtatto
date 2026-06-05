import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Gallery from './components/Gallery'
import GalleryDetail from './components/GalleryDetail'
import Styles from './components/Styles'
import StyleDetail from './components/StyleDetail'
import Booking from './components/Booking'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminPanel from './components/AdminPanel'

function App() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  
  return (
    <Router>
      <div className="min-h-screen bg-darker">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Gallery isHorizontal={true} />
              <Styles isHorizontal={true} />
              <Booking />
              <Contact />
            </>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:id" element={<GalleryDetail />} />
          <Route path="/styles" element={<Styles />} />
          <Route path="/styles/:id" element={<StyleDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/django-admin" element={<Navigate to={`${API_URL}/admin`} replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
