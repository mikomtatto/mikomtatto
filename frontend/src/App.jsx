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
          <Route path="/gallery" element={<Gallery isHorizontal={false} hideViewAll={true} />} />
          <Route path="/gallery/:id" element={<GalleryDetail />} />
          <Route path="/styles" element={<Styles isHorizontal={false} hideViewAll={true} />} />
          <Route path="/styles/:id" element={<StyleDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
