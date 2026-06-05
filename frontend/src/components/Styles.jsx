import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Styles = ({ isHorizontal = false }) => {
  const [styles, setStyles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showArrows, setShowArrows] = useState(false)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    fetchStyles()
  }, [])
useEffect(() => {
    if (isHorizontal && scrollContainerRef.current) {
      const checkOverflow = () => {
        const container = scrollContainerRef.current
        setShowArrows(container.scrollWidth > container.clientWidth)
      }
      
      checkOverflow()
      window.addEventListener('resize', checkOverflow)
      return () => window.removeEventListener('resize', checkOverflow)
    }
  }, [isHorizontal, styles])

  
  const fetchStyles = async () => {
    try {
      const response = await axios.get('/api/styles/?active=true')
      setStyles(response.data)
    } catch (error) {
      console.error('Stiller yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section id="styles" className="py-24 px-4 bg-gradient-to-b from-dark to-darker">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-4">
            <span className="text-white">Dövme Stilleri</span>
            <span className="text-accent">.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Size en uygun stili seçin, her stil kendine has bir karaktere sahiptir
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
          </div>
        ) : styles.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-xl">Henüz stil eklenmemiş.</p>
          </div>
        ) : isHorizontal ? (
          <div className="relative">
            {showArrows && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 backdrop-blur-sm border border-gray-700 hover:border-accent text-white p-3 rounded-full shadow-lg transition-all hover:bg-accent hover:text-black"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-4 px-12 scroll-smooth scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {styles.map((style) => (
                <Link key={style.id} to={`/styles/${style.id}`} className="group relative flex-shrink-0 w-96">
                  <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-accent/50 transition-all duration-500 cursor-pointer">
                    {style.image_url ? (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img 
                          src={style.image_url} 
                          alt={style.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="400"%3E%3Crect fill="%231a1a1a" width="640" height="400"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yüklenemedi%3C/text%3E%3C/svg%3E'
                          }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <span className="text-6xl">🎨</span>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="font-display text-2xl font-bold text-white mb-2">{style.name}</h3>
                        {style.price_range && (
                          <div className="inline-block bg-accent/20 backdrop-blur-sm text-accent px-3 py-1 rounded-full text-sm font-bold mb-3">
                            {style.price_range}
                          </div>
                        )}
                        <p className="text-gray-300 text-sm line-clamp-2">{style.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Always visible content */}
                  <div className="mt-4 px-2">
                    <h3 className="font-display text-xl font-bold text-white mb-1">{style.name}</h3>
                    {style.price_range && (
                      <p className="text-accent font-semibold text-sm">{style.price_range}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {showArrows && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 backdrop-blur-sm border border-gray-700 hover:border-accent text-white p-3 rounded-full shadow-lg transition-all hover:bg-accent hover:text-black"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {styles.map((style) => (
              <Link key={style.id} to={`/styles/${style.id}`} className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-accent/50 transition-all duration-500 cursor-pointer">
                  {style.image_url ? (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img 
                        src={style.image_url} 
                        alt={style.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="400"%3E%3Crect fill="%231a1a1a" width="640" height="400"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yüklenemedi%3C/text%3E%3C/svg%3E'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <span className="text-6xl">🎨</span>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-display text-2xl font-bold text-white mb-2">{style.name}</h3>
                      {style.price_range && (
                        <div className="inline-block bg-accent/20 backdrop-blur-sm text-accent px-3 py-1 rounded-full text-sm font-bold mb-3">
                          {style.price_range}
                        </div>
                      )}
                      <p className="text-gray-300 text-sm line-clamp-2">{style.description}</p>
                    </div>
                  </div>
                </div>
                
                {/* Always visible content */}
                <div className="mt-4 px-2">
                  <h3 className="font-display text-xl font-bold text-white mb-1">{style.name}</h3>
                  {style.price_range && (
                    <p className="text-accent font-semibold text-sm">{style.price_range}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Styles
