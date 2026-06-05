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
      <section id="contact" className="py-20 px-4 bg-dark">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-400">Yükleniyor...</div>
        </div>
      </section>
    )
  }

  if (!contactInfo) {
    return (
      <section id="contact" className="py-20 px-4 bg-dark">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center">İletişim</h2>
          <p className="section-subtitle text-center">
            Bizimle iletişime geçin
          </p>
          <div className="text-center text-gray-400 py-20">
            İletişim bilgileri henüz eklenmemiş.
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 px-4 bg-dark">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title text-center">İletişim</h2>
        <p className="section-subtitle text-center">
          Bizimle iletişime geçin
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="card text-center">
            <div className="text-accent text-4xl mb-4">📍</div>
            <h3 className="font-display text-xl font-semibold mb-2">Adres</h3>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent transition-colors whitespace-pre-line cursor-pointer"
            >
              {contactInfo.address}
            </a>
          </div>

          <div className="card text-center">
            <div className="text-accent text-4xl mb-4">📞</div>
            <h3 className="font-display text-xl font-semibold mb-2">Telefon</h3>
            <a 
              href={`tel:${contactInfo.phone}`}
              className="text-gray-400 hover:text-accent transition-colors"
            >
              {contactInfo.phone}
            </a>
          </div>

          <div className="card text-center">
            <div className="text-accent text-4xl mb-4">✉️</div>
            <h3 className="font-display text-xl font-semibold mb-2">E-posta</h3>
            <a 
              href={`mailto:${contactInfo.email}`}
              className="text-gray-400 hover:text-accent transition-colors"
            >
              {contactInfo.email}
            </a>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="font-display text-2xl font-semibold mb-6">Çalışma Saatleri</h3>
          <div className="inline-block card">
            <p className="text-gray-300 whitespace-pre-line">
              {contactInfo.working_hours}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
