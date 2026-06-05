import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Gallery = ({ isHorizontal = false }) => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showArrows, setShowArrows] = useState(false)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    fetchImages()
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
  }, [isHorizontal, images])

  
  const fetchImages = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await axios.get(`${API_URL}/api/gallery/images/`)
      setImages(response.data)
    } catch (error) {
      console.error('Galeri yüklenirken hata:', error)
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

  const featuredImages = images.filter(img => img.is_featured)
  const displayImages = filter === 'featured' ? featuredImages : images

  return (
    <section id="gallery" className="py-24 px-4 bg-gradient-to-b from-darker to-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-4">
            <span className="text-white">Galeri</span>
            <span className="text-accent">.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Sanat eserlerimizi inceleyin, her dövme bir hikaye anlatır
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-12">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${
              filter === 'all' 
                ? 'bg-accent text-black shadow-lg shadow-accent/20' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
            }`}
          >
            Tümü
          </button>
          <button 
            onClick={() => setFilter('featured')}
            className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${
              filter === 'featured' 
                ? 'bg-accent text-black shadow-lg shadow-accent/20' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
            }`}
          >
            Öne Çıkanlar
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
          </div>
        ) : displayImages.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-xl">Henüz fotoğraf yüklenmemiş.</p>
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
              {displayImages.map((image) => (
                <Link key={image.id} to={`/gallery/${image.id}`} className="group relative flex-shrink-0 w-80">
                  <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-accent/50 transition-all duration-500 cursor-pointer">
                    <div className="aspect-[4/5] overflow-hidden">
                      <img 
                        src={image.image_url} 
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%231a1a1a" width="400" height="500"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yüklenemedi%3C/text%3E%3C/svg%3E'
                        }}
                      />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {image.is_featured && (
                          <div className="inline-flex items-center gap-2 bg-accent text-black px-3 py-1 rounded-full text-xs font-bold mb-3">
                            <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                            ÖNE ÇIKAN
                          </div>
                        )}
                        <h3 className="font-display text-2xl font-bold text-white mb-2">{image.title}</h3>
                        {image.style_name && (
                          <p className="text-accent font-medium mb-2">{image.style_name}</p>
                        )}
                        {image.description && (
                          <p className="text-gray-300 text-sm line-clamp-2">{image.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Featured badge on image */}
                    {image.is_featured && (
                      <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        ★ ÖNE ÇIKAN
                      </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayImages.map((image) => (
              <Link key={image.id} to={`/gallery/${image.id}`} className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-accent/50 transition-all duration-500 cursor-pointer">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img 
                      src={image.image_url} 
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%231a1a1a" width="400" height="500"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yüklenemedi%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {image.is_featured && (
                        <div className="inline-flex items-center gap-2 bg-accent text-black px-3 py-1 rounded-full text-xs font-bold mb-3">
                          <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                          ÖNE ÇIKAN
                        </div>
                      )}
                      <h3 className="font-display text-2xl font-bold text-white mb-2">{image.title}</h3>
                      {image.style_name && (
                        <p className="text-accent font-medium mb-2">{image.style_name}</p>
                      )}
                      {image.description && (
                        <p className="text-gray-300 text-sm line-clamp-2">{image.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Featured badge on image */}
                  {image.is_featured && (
                    <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      ★ ÖNE ÇIKAN
                    </div>
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

export default Gallery
