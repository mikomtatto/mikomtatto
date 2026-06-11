import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'

const StyleSelector = ({ styles, selectedStyle, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm sm:text-base text-left flex items-center justify-between"
      >
        <span className="flex items-center gap-3">
          {selectedStyle ? (
            <>
              {selectedStyle.image_url && (
                <img
                  src={selectedStyle.image_url}
                  alt={selectedStyle.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              )}
              <span>{selectedStyle.name}</span>
            </>
          ) : (
            <span className="text-gray-500">Stil Seçin</span>
          )}
        </span>
        <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl max-h-64 overflow-y-auto">
          {styles.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => {
                onSelect(style)
                setIsOpen(false)
              }}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left flex items-center gap-3 hover:bg-gray-800 transition-colors text-sm sm:text-base ${selectedStyle?.id === style.id ? 'bg-gray-800 border-l-2 border-accent' : ''}`}
            >
              {style.image_url ? (
                <img
                  src={style.image_url}
                  alt={style.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg flex-shrink-0"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 text-xs sm:text-sm">🎨</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{style.name}</div>
                {style.price_range && (
                  <div className="text-xs text-accent truncate">{style.price_range}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const Booking = () => {
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    style: null,
    description: ''
  })
  const [styles, setStyles] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStyles()
  }, [])

  useEffect(() => {
    // Check for pre-selected style from URL after styles are loaded
    const preSelectedStyleId = searchParams.get('style')
    if (preSelectedStyleId && styles.length > 0) {
      const matchedStyle = styles.find(s => s.id === parseInt(preSelectedStyleId))
      if (matchedStyle) {
        setFormData(prev => ({ ...prev, style: matchedStyle.id }))
      }
    }
  }, [searchParams, styles])

  const fetchStyles = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await axios.get(`${API_URL}/api/styles/?active=true`)
      setStyles(response.data)
    } catch (error) {
      console.error('Stiller yüklenirken hata:', error)
    }
  }

  const handleStyleSelect = (style) => {
    setFormData(prev => ({ ...prev, style: style }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      await axios.post(`${API_URL}/api/appointments/`, formData)
      setSuccess(true)
      setFormData({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        style: null,
        description: ''
      })
    } catch (error) {
      setError('Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
      console.error('Randevu hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (success) {
    return (
      <section id="booking" className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:py-20 md:py-24 px-4 bg-gradient-to-b from-dark to-darker">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <span className="text-4xl sm:text-5xl">✓</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">Randevu Talebiniz Alındı!</h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 px-2">
              En kısa sürede sizinle iletişime geçeceğiz. Teşekkür ederiz!
            </p>
            <Link 
              to="/"
              className="inline-block bg-accent text-black font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl hover:bg-accent-light transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-accent/20 text-sm sm:text-base"
            >
              Anasayfaya Dön
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" className="py-16 sm:py-20 md:py-24 px-4 bg-gradient-to-b from-dark to-darker">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
            <span className="text-white">Randevu</span>
            <span className="text-accent">Al</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Hayalinizdeki dövme için randevu oluşturun
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6 text-sm sm:text-base">
              {error}
            </div>
          )}

          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-gray-300 mb-2 sm:mb-3 font-medium flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-accent">👤</span> Ad Soyad *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm sm:text-base"
                  placeholder="Adınız Soyadınız"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 sm:mb-3 font-medium flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-accent">📞</span> Telefon *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm sm:text-base"
                  placeholder="05XX XXX XX XX"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 sm:mb-3 font-medium flex items-center gap-2 text-sm sm:text-base">
                <span className="text-accent">✉️</span> E-posta *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-sm sm:text-base"
                placeholder="email@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-gray-300 mb-2 sm:mb-3 font-medium flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-accent">📅</span> Tarih *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-2 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-xs sm:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 sm:mb-3 font-medium flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-accent">🕐</span> Saat *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-2 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-xs sm:text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 sm:mb-3 font-medium flex items-center gap-2 text-sm sm:text-base">
                <span className="text-accent">🎨</span> Dövme Stili (Opsiyonel)
              </label>
              <StyleSelector
                styles={styles}
                selectedStyle={styles.find(s => s.id === formData.style)}
                onSelect={handleStyleSelect}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 sm:mb-3 font-medium flex items-center gap-2 text-sm sm:text-base">
                <span className="text-accent">📝</span> Açıklama *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none text-sm sm:text-base"
                placeholder="Dövme hakkında detaylı bilgi verin..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-black font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl hover:bg-accent-light transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base sm:text-lg"
            >
              {loading ? 'Gönderiliyor...' : 'Randevu Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Booking
