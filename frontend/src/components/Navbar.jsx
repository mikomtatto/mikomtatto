import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-darker/95 backdrop-blur-md border-b border-gray-800 shadow-lg shadow-black/20' 
        : 'bg-darker/95 backdrop-blur-sm border-b border-gray-800/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="font-display text-xl sm:text-2xl font-bold">
            <span className="text-white">Mikom</span>
            <span className="text-accent">Tatto</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6 sm:space-x-8">
            <Link to="/" className="text-gray-300 hover:text-accent transition-colors duration-300 text-sm sm:text-base font-medium">Ana Sayfa</Link>
            <Link to="/gallery" className="text-gray-300 hover:text-accent transition-colors duration-300 text-sm sm:text-base font-medium">Galeri</Link>
            <Link to="/styles" className="text-gray-300 hover:text-accent transition-colors duration-300 text-sm sm:text-base font-medium">Stiller</Link>
            <Link to="/about" className="text-gray-300 hover:text-accent transition-colors duration-300 text-sm sm:text-base font-medium">Hakkımızda</Link>
            <Link to="/booking" className="btn-primary text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">Randevu Al</Link>
          </div>

          <button 
            className="md:hidden text-white p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-darker/95 backdrop-blur-md border-t border-gray-800 shadow-xl">
          <div className="px-4 py-4 space-y-3">
            <Link to="/" className="block text-gray-300 hover:text-accent transition-colors duration-300 py-2 text-base font-medium">Ana Sayfa</Link>
            <Link to="/gallery" className="block text-gray-300 hover:text-accent transition-colors duration-300 py-2 text-base font-medium">Galeri</Link>
            <Link to="/styles" className="block text-gray-300 hover:text-accent transition-colors duration-300 py-2 text-base font-medium">Stiller</Link>
            <Link to="/about" className="block text-gray-300 hover:text-accent transition-colors duration-300 py-2 text-base font-medium">Hakkımızda</Link>
            <Link to="/booking" className="block btn-primary text-center py-3 text-base font-medium">Randevu Al</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
