import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Gallery = ({ isHorizontal = false, hideViewAll = false }) => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
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
      console.log('Gallery images response:', response.data)
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
  const displayImages = images
  console.log('Gallery render:', { loading, imagesCount: images.length, displayImagesCount: displayImages.length, isHorizontal })
  return (
    <section id="gallery" className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:py-20 md:py-24 px-4 bg-gradient-to-b from-darker to-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
            <span className="text-white">Galeri</span>
            <span className="text-accent">.</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Sanat eserlerimizi inceleyin, her dövme bir hikaye anlatır
          </p>
        </div>

        {!hideViewAll && (
          <div className="text-center mb-8 sm:mb-12">
            <Link 
              to="/gallery" 
              className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors duration-300 text-sm sm:text-base font-medium group"
            >
              Tümünü Gör
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-400 py-16 sm:py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-accent border-t-transparent"></div>
          </div>
        ) : displayImages.length === 0 ? (
          <div className="text-center text-gray-400 py-16 sm:py-20">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-4">📷</div>
            <p className="text-base sm:text-lg md:text-xl">Henüz fotoğraf yüklenmemiş.</p>
            <p className="text-xs text-gray-500 mt-2">Images: {images.length}, Featured: {featuredImages.length}, Display: {displayImages.length}</p>
          </div>
        ) : isHorizontal ? (
          <div className="relative">
            {showArrows && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 backdrop-blur-sm border border-gray-700 hover:border-accent text-white p-2 sm:p-3 rounded-full shadow-lg transition-all hover:bg-accent hover:text-black"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            <div
              ref={scrollContainerRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 px-8 sm:px-12 scroll-smooth scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayImages.map((image) => (
                <Link key={image.id} to={`/gallery/${image.id}`} className="group relative flex-shrink-0 w-64 sm:w-80">
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gray-900 border border-gray-800 hover:border-accent/50 transition-all duration-500 cursor-pointer">
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
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {image.is_featured && (
                          <div className="inline-flex items-center gap-2 bg-accent text-black px-2 sm:px-3 py-1 rounded-full text-xs font-bold mb-2 sm:mb-3">
                            <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                            ÖNE ÇIKAN
                          </div>
                        )}
                        <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{image.title}</h3>
                        {image.style_name && (
                          <p className="text-accent font-medium mb-1 sm:mb-2 text-sm sm:text-base">{image.style_name}</p>
                        )}
                        {image.description && (
                          <p className="text-gray-300 text-xs sm:text-sm line-clamp-2">{image.description}</p>
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
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 backdrop-blur-sm border border-gray-700 hover:border-accent text-white p-2 sm:p-3 rounded-full shadow-lg transition-all hover:bg-accent hover:text-black"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="flex sm:grid flex-nowrap sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 px-4 sm:px-0 scroll-smooth sm:scroll-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {displayImages.map((image) => (
              <Link key={image.id} to={`/gallery/${image.id}`} className="group relative w-full">
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gray-900 border border-gray-800 hover:border-accent/50 transition-all duration-500 cursor-pointer">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img 
                      src={image.image_url} 
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        console.error('Image load error:', image.image_url, e)
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%231a1a1a" width="400" height="500"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yüklenemedi%3C/text%3E%3C/svg%3E'
                      }}
                      onLoad={() => console.log('Image loaded:', image.image_url)}
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {image.is_featured && (
                        <div className="inline-flex items-center gap-2 bg-accent text-black px-2 sm:px-3 py-1 rounded-full text-xs font-bold mb-2 sm:mb-3">
                          <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                          ÖNE ÇIKAN
                        </div>
                      )}
                      <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{image.title}</h3>
                      {image.style_name && (
                        <p className="text-accent font-medium mb-1 sm:mb-2 text-sm sm:text-base">{image.style_name}</p>
                      )}
                      {image.description && (
                        <p className="text-gray-300 text-xs sm:text-sm line-clamp-2">{image.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Featured badge on image */}
                  {image.is_featured && (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-accent/90 backdrop-blur-sm text-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-lg">
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
