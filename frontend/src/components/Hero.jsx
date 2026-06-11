import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Hero = () => {
  const [heroBackground, setHeroBackground] = useState(null)

  useEffect(() => {
    fetchHeroBackground()
  }, [])

  const fetchHeroBackground = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await axios.get(`${API_URL}/api/site/hero-backgrounds/?is_active=true`)
      if (response.data && response.data.length > 0) {
        const activeHero = response.data[0]
        if (activeHero.is_active && activeHero.image_url) {
          setHeroBackground(activeHero)
        }
      }
    } catch (error) {
      console.error('Hero background yüklenirken hata:', error)
    }
  }

  return (
    <section className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-darker via-dark to-black">
      {heroBackground && heroBackground.image_url ? (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackground.image_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-darker/90 via-dark/80 to-black/90"></div>
        </div>
      ) : (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-accent rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gray-700 rounded-full filter blur-3xl"></div>
        </div>
      )}
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6">
          <span className="text-white">Mikom</span>
          <span className="text-accent">Tatto</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
          Profesyonel dövme sanat stüdyosu. Her dövme bir sanat eseridir.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <Link to="/booking" className="btn-primary text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4">
            Randevu Al
          </Link>
          <Link to="/gallery" className="btn-secondary text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4">
            Galeriyi İncele
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

export default Hero
