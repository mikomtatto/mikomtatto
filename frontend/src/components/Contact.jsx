import { useState, useEffect } from 'react'
import axios from 'axios'

const Contact = () => {
  const [contactInfo, setContactInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await axios.get(`${API_URL}/api/site/contact/`)
      if (response.data && response.data.length > 0) {
        setContactInfo(response.data[0])
      }
    } catch (error) {
      console.error('İletişim bilgileri yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="contact" className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:py-20 px-4 bg-dark">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-400">Yükleniyor...</div>
        </div>
      </section>
    )
  }

  if (!contactInfo) {
    return (
      <section id="contact" className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:py-20 px-4 bg-dark">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center">İletişim</h2>
          <p className="section-subtitle text-center">
            Bizimle iletişime geçin
          </p>
          <div className="text-center text-gray-400 py-16 sm:py-20">
            İletişim bilgileri henüz eklenmemiş.
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-16 sm:py-20 px-4 bg-dark">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title text-center">İletişim</h2>
        <p className="section-subtitle text-center">
          Bizimle iletişime geçin
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12">
          <div className="card text-center">
            <div className="text-accent text-3xl sm:text-4xl mb-3 sm:mb-4">📍</div>
            <h3 className="font-display text-lg sm:text-xl font-semibold mb-2">Adres</h3>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent transition-colors whitespace-pre-line cursor-pointer text-sm sm:text-base"
            >
              {contactInfo.address}
            </a>
          </div>

          <div className="card text-center">
            <div className="text-accent text-3xl sm:text-4xl mb-3 sm:mb-4">📞</div>
            <h3 className="font-display text-lg sm:text-xl font-semibold mb-2">Telefon</h3>
            <a 
              href={`tel:${contactInfo.phone}`}
              className="text-gray-400 hover:text-accent transition-colors text-sm sm:text-base"
            >
              {contactInfo.phone}
            </a>
          </div>

          <div className="card text-center">
            <div className="text-accent text-3xl sm:text-4xl mb-3 sm:mb-4">✉️</div>
            <h3 className="font-display text-lg sm:text-xl font-semibold mb-2">E-posta</h3>
            <a 
              href={`mailto:${contactInfo.email}`}
              className="text-gray-400 hover:text-accent transition-colors text-sm sm:text-base"
            >
              {contactInfo.email}
            </a>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <h3 className="font-display text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Çalışma Saatleri</h3>
          <div className="inline-block card">
            <p className="text-gray-300 whitespace-pre-line text-sm sm:text-base">
              {contactInfo.working_hours}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
