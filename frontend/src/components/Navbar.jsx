import { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-darker/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-display text-2xl font-bold text-accent">
            MikomTattoo
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-accent transition-colors">Ana Sayfa</Link>
            <Link to="/gallery" className="text-gray-300 hover:text-accent transition-colors">Galeri</Link>
            <Link to="/styles" className="text-gray-300 hover:text-accent transition-colors">Stiller</Link>
            <Link to="/about" className="text-gray-300 hover:text-accent transition-colors">Hakkımızda</Link>
            <Link to="/booking" className="btn-primary">Randevu Al</Link>
          </div>

          <button 
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
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
        <div className="md:hidden bg-darker border-t border-gray-800">
          <div className="px-4 py-4 space-y-3">
            <Link to="/" className="block text-gray-300 hover:text-accent transition-colors">Ana Sayfa</Link>
            <Link to="/gallery" className="block text-gray-300 hover:text-accent transition-colors">Galeri</Link>
            <Link to="/styles" className="block text-gray-300 hover:text-accent transition-colors">Stiller</Link>
            <Link to="/about" className="block text-gray-300 hover:text-accent transition-colors">Hakkımızda</Link>
            <Link to="/booking" className="block btn-primary text-center">Randevu Al</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
