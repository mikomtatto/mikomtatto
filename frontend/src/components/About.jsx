import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const About = () => {
  const [about, setAbout] = useState(null)
  const [contactInfo, setContactInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://mikomtatto-backend.onrender.com'
      const [aboutRes, contactRes] = await Promise.all([
        axios.get(`${API_URL}/api/site/about/`),
        axios.get(`${API_URL}/api/site/contact/`)
      ])
      
      if (aboutRes.data && aboutRes.data.length > 0) {
        setAbout(aboutRes.data[0])
      }
      
      if (contactRes.data && contactRes.data.length > 0) {
        setContactInfo(contactRes.data[0])
      }
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="about" className="pt-24 sm:pt-28 md:pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-400">Yükleniyor...</div>
        </div>
      </section>
    )
  }

  if (!about) {
    return (
      <section id="about" className="pt-24 sm:pt-28 md:pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center">Hakkımızda</h2>
          <p className="section-subtitle text-center">
            Bizimle tanışın
          </p>
          <div className="text-center text-gray-400 py-20">
            Hakkımızda bilgisi henüz eklenmemiş.
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="pt-32 sm:pt-36 md:pt-40 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title text-center">Hakkımızda</h2>
        <p className="section-subtitle text-center">
          Bizimle tanışın
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 items-center">
          {about.image_url ? (
            <div className="aspect-square overflow-hidden rounded-xl">
              <img
                src={about.image_url}
                alt={about.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('About image load error:', about.image_url)
                  e.target.parentElement.innerHTML = '<div class="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center"><span class="text-6xl">🎨</span></div>'
                }}
              />
            </div>
          ) : (
            <div className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-6xl">🎨</span>
            </div>
          )}
          
          <div className={about.image_url ? '' : 'lg:col-span-2'}>
            <h3 className="font-display text-3xl font-bold mb-6 text-white">
              {about.title}
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line mb-8">
              {about.content}
            </p>
            
            {contactInfo && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h4 className="font-display text-xl font-semibold mb-4 text-accent">İletişim Bilgileri</h4>
                <div className="space-y-3 text-sm">
                  {contactInfo.address && (
                    <div className="flex items-start gap-3 text-gray-300">
                      <span className="text-accent">📍</span>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent transition-colors cursor-pointer whitespace-pre-line"
                      >
                        {contactInfo.address}
                      </a>
                    </div>
                  )}
                  {contactInfo.phone && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <span className="text-accent">📞</span>
                      <a href={`tel:${contactInfo.phone}`} className="hover:text-accent transition-colors">
                        {contactInfo.phone}
                      </a>
                    </div>
                  )}
                  {contactInfo.email && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <span className="text-accent">✉️</span>
                      <a href={`mailto:${contactInfo.email}`} className="hover:text-accent transition-colors">
                        {contactInfo.email}
                      </a>
                    </div>
                  )}
                  {contactInfo.working_hours && (
                    <div className="flex items-start gap-3 text-gray-300">
                      <span className="text-accent">🕐</span>
                      <span className="whitespace-pre-line">{contactInfo.working_hours}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
