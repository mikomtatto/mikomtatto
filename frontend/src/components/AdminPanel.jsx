import { useState, useEffect } from 'react'
import axios from 'axios'
import HeroBackgroundManager from './HeroBackgroundManager'

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('appointments')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchData()
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await axios.post(`${API_URL}/api/appointments/admin-login/`, {
        username,
        password
      })
      
      if (response.data.success) {
        setIsAuthenticated(true)
        localStorage.setItem('adminAuth', 'true')
        fetchData()
      }
    } catch (error) {
      setLoginError('Geçersiz kullanıcı adı veya şifre')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
    setUsername('')
    setPassword('')
    setData({})
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      console.log('AdminPanel fetching from:', API_URL)
      const [appointments, gallery, styles, about, contact] = await Promise.all([
        axios.get(`${API_URL}/api/appointments/`),
        axios.get(`${API_URL}/api/gallery/images/`),
        axios.get(`${API_URL}/api/styles/`),
        axios.get(`${API_URL}/api/site/about/`),
        axios.get(`${API_URL}/api/site/contact/`)
      ])
      
      console.log('Gallery data:', gallery.data)
      setData({
        appointments: appointments.data,
        gallery: gallery.data,
        styles: styles.data,
        about: about.data,
        contact: contact.data
      })
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAppointmentStatus = async (id, status) => {
    try {
      await axios.patch(`/api/appointments/${id}/`, { status })
      fetchData()
    } catch (error) {
      console.error('Randevu güncellenirken hata:', error)
      alert('Randevu güncellenirken hata oluştu')
    }
  }

  const deleteItem = async (type, id) => {
    if (!confirm('Bu öğeyi silmek istediğinize emin misiniz?')) return
    
    try {
      await axios.delete(`/api/${type}/${id}/`)
      fetchData()
    } catch (error) {
      console.error('Silme hatası:', error)
      alert('Silme işlemi başarısız')
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'Beklemede'
      case 'confirmed': return 'Onaylandı'
      case 'completed': return 'Tamamlandı'
      case 'cancelled': return 'İptal Edildi'
      default: return status
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center bg-gradient-to-b from-darker to-dark">
        <div className="max-w-md w-full">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="font-display text-4xl font-bold mb-2">
                <span className="text-white">Admin</span>
                <span className="text-accent">Panel</span>
              </h2>
              <p className="text-gray-400">Django superuser ile giriş yapın</p>
            </div>
            <form onSubmit={handleLogin}>
              {loginError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6">
                  {loginError}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-300 mb-3 font-medium">Kullanıcı Adı</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  placeholder="Kullanıcı adı"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 mb-3 font-medium">Şifre</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-accent text-black font-semibold px-6 py-3 rounded-xl hover:bg-accent-light transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-accent/20">
                Giriş Yap
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'appointments', label: 'Randevular', icon: '📅' },
    { id: 'gallery', label: 'Galeri', icon: '📷' },
    { id: 'styles', label: 'Stiller', icon: '🎨' },
    { id: 'hero', label: 'Hero Arka Plan', icon: '🖼️' },
    { id: 'about', label: 'Hakkımızda', icon: 'ℹ️' },
    { id: 'contact', label: 'İletişim', icon: '📞' },
  ]

  return (
    <div className="min-h-screen pt-20 px-4 bg-gradient-to-b from-darker to-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">
              <span className="text-white">Admin</span>
              <span className="text-accent">Panel</span>
            </h1>
            <p className="text-gray-400">İçerik yönetimi</p>
          </div>
          <button onClick={handleLogout} className="bg-red-500/10 text-red-400 border border-red-500/30 px-6 py-2 rounded-xl hover:bg-red-500/20 transition-all font-medium">
            Çıkış Yap
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all duration-300 font-medium ${
                activeTab === tab.id 
                  ? 'bg-accent text-black shadow-lg shadow-accent/20' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
          </div>
        ) : (
          <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            {activeTab === 'appointments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-2xl font-bold">Randevular</h2>
                  <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                    {data.appointments?.length || 0} toplam
                  </span>
                </div>
                {data.appointments?.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="text-gray-400 text-xl">Henüz randevu yok.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.appointments?.map(appointment => (
                      <div key={appointment.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-accent/50 transition-all">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-xl text-white mb-2">{appointment.name}</h3>
                            <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                              <span className="flex items-center gap-1">📞 {appointment.phone}</span>
                              <span className="flex items-center gap-1">✉️ {appointment.email}</span>
                            </div>
                          </div>
                          <select
                            value={appointment.status}
                            onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                            className={`px-4 py-2 rounded-lg border font-medium ${getStatusColor(appointment.status)} focus:outline-none focus:ring-2 focus:ring-accent/20`}
                          >
                            <option value="pending">Beklemede</option>
                            <option value="confirmed">Onaylandı</option>
                            <option value="completed">Tamamlandı</option>
                            <option value="cancelled">İptal Edildi</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div className="bg-gray-900/50 rounded-lg p-3">
                            <span className="text-gray-500 block mb-1">Tarih</span>
                            <span className="text-white font-medium">{appointment.date}</span>
                          </div>
                          <div className="bg-gray-900/50 rounded-lg p-3">
                            <span className="text-gray-500 block mb-1">Saat</span>
                            <span className="text-white font-medium">{appointment.time}</span>
                          </div>
                          {appointment.style_name && (
                            <div className="bg-gray-900/50 rounded-lg p-3">
                              <span className="text-gray-500 block mb-1">Stil</span>
                              <span className="text-accent font-medium">{appointment.style_name}</span>
                            </div>
                          )}
                          <div className={`bg-gray-900/50 rounded-lg p-3 ${getStatusColor(appointment.status)}`}>
                            <span className="text-gray-500 block mb-1">Durum</span>
                            <span className="font-medium">{getStatusLabel(appointment.status)}</span>
                          </div>
                        </div>
                        <p className="text-gray-400 bg-gray-900/30 rounded-lg p-3">{appointment.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-2xl font-bold">Galeri</h2>
                  <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/gallery/image/`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm flex items-center gap-1">
                    Yeni fotoğraf eklemek için Django admin →
                  </a>
                </div>
                {data.gallery?.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-gray-400 text-xl">Henüz fotoğraf yok.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(data.gallery) && data.gallery.map(item => (
                      <div key={item.id} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-accent/50 transition-all group">
                        {item.image_url && (
                          <div className="aspect-[4/5] overflow-hidden">
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => {
                              e.target.style.display = 'none'
                            }} />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                          {item.style_name && (
                            <p className="text-accent text-sm mb-3">{item.style_name}</p>
                          )}
                          {item.is_featured && (
                            <span className="inline-block bg-accent/20 text-accent px-2 py-1 rounded-full text-xs font-bold mb-3">
                              ★ Öne Çıkan
                            </span>
                          )}
                          <button
                            onClick={() => deleteItem('gallery', item.id)}
                            className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1"
                          >
                            🗑️ Sil
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'styles' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-2xl font-bold">Dövme Stilleri</h2>
                  <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/styles/style/`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm flex items-center gap-1">
                    Yeni stil eklemek için Django admin →
                  </a>
                </div>
                {data.styles?.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🎨</div>
                    <p className="text-gray-400 text-xl">Henüz stil yok.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.styles?.map(style => (
                      <div key={style.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-accent/50 transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-display text-xl font-bold">{style.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${style.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {style.is_active ? '✓ Aktif' : '✗ Pasif'}
                          </span>
                        </div>
                        {style.price_range && (
                          <p className="text-accent font-semibold mb-3">{style.price_range}</p>
                        )}
                        <p className="text-gray-400 mb-4">{style.description}</p>
                        <button
                          onClick={() => deleteItem('styles', style.id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1"
                        >
                          🗑️ Sil
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'hero' && (
              <HeroBackgroundManager />
            )}

            {activeTab === 'about' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-2xl font-bold">Hakkımızda</h2>
                  <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/styles/style/`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm flex items-center gap-1">
                    Düzenlemek için Django admin →
                  </a>
                </div>
                {data.about?.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">ℹ️</div>
                    <p className="text-gray-400 text-xl">Henüz içerik yok.</p>
                  </div>
                ) : (
                  data.about?.map(item => (
                    <div key={item.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                      <h3 className="font-display text-2xl font-bold mb-4">{item.title}</h3>
                      {item.image_url && (
                        <img src={item.image_url} alt={item.title} className="w-full max-w-md h-48 object-cover rounded-xl mb-4" />
                      )}
                      <p className="text-gray-300 whitespace-pre-line leading-relaxed">{item.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'contact' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-2xl font-bold">İletişim Bilgileri</h2>
                  <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/admin/styles/style/`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm flex items-center gap-1">
                    Düzenlemek için Django admin →
                  </a>
                </div>
                {data.contact?.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">📞</div>
                    <p className="text-gray-400 text-xl">Henüz iletişim bilgisi yok.</p>
                  </div>
                ) : (
                  data.contact?.map(item => (
                    <div key={item.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-900/50 rounded-xl p-4">
                          <h3 className="font-semibold mb-2 text-accent flex items-center gap-2">📍 Adres</h3>
                          <p className="text-gray-300 whitespace-pre-line">{item.address}</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-4">
                          <h3 className="font-semibold mb-2 text-accent flex items-center gap-2">📞 Telefon</h3>
                          <p className="text-gray-300">{item.phone}</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-4">
                          <h3 className="font-semibold mb-2 text-accent flex items-center gap-2">✉️ E-posta</h3>
                          <p className="text-gray-300">{item.email}</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-4">
                          <h3 className="font-semibold mb-2 text-accent flex items-center gap-2">🕐 Çalışma Saatleri</h3>
                          <p className="text-gray-300 whitespace-pre-line">{item.working_hours}</p>
                        </div>
                      </div>
                      {(item.facebook || item.instagram || item.twitter) && (
                        <div className="mt-6 pt-6 border-t border-gray-700">
                          <h3 className="font-semibold mb-4 text-accent flex items-center gap-2">🔗 Sosyal Medya</h3>
                          <div className="flex flex-wrap gap-3">
                            {item.facebook && <a href={item.facebook} target="_blank" className="bg-gray-900/50 text-accent px-4 py-2 rounded-lg hover:bg-gray-800 transition-all">Facebook</a>}
                            {item.instagram && <a href={item.instagram} target="_blank" className="bg-gray-900/50 text-accent px-4 py-2 rounded-lg hover:bg-gray-800 transition-all">Instagram</a>}
                            {item.twitter && <a href={item.twitter} target="_blank" className="bg-gray-900/50 text-accent px-4 py-2 rounded-lg hover:bg-gray-800 transition-all">Twitter</a>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
