import { useState, useEffect } from 'react'
import axios from 'axios'

const HeroBackgroundManager = () => {
  const [backgrounds, setBackgrounds] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [newBackground, setNewBackground] = useState({ name: '', image: null })

  useEffect(() => {
    fetchBackgrounds()
  }, [])

  const fetchBackgrounds = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await axios.get(`${API_URL}/api/site/hero-backgrounds/`)
      setBackgrounds(response.data)
    } catch (error) {
      console.error('Hero backgroundlar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setNewBackground({ ...newBackground, image: file })
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!newBackground.name || !newBackground.image) return

    setUploading(true)
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const formData = new FormData()
      formData.append('name', newBackground.name)
      formData.append('image', newBackground.image)
      formData.append('is_active', false)
      formData.append('is_preset', false)

      await axios.post(`${API_URL}/api/site/hero-backgrounds/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setNewBackground({ name: '', image: null })
      fetchBackgrounds()
    } catch (error) {
      console.error('Hero background yüklenirken hata:', error)
      alert('Yükleme başarısız')
    } finally {
      setUploading(false)
    }
  }

  const handleSetActive = async (id) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      await axios.patch(`${API_URL}/api/site/hero-backgrounds/${id}/`, { is_active: true })
      fetchBackgrounds()
    } catch (error) {
      console.error('Hero background aktifleştirilirken hata:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu arka planı silmek istediğinize emin misiniz?')) return

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      await axios.delete(`${API_URL}/api/site/hero-backgrounds/${id}/`)
      fetchBackgrounds()
    } catch (error) {
      console.error('Hero background silinirken hata:', error)
    }
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8">
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-6">Hero Arka Planları</h2>

      <form onSubmit={handleUpload} className="mb-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Yeni Arka Plan Ekle</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Arka Plan Adı</label>
            <input
              type="text"
              value={newBackground.name}
              onChange={(e) => setNewBackground({ ...newBackground, name: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm"
              placeholder="Örn: Gece Teması"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Arka Plan Görseli</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="bg-accent text-black font-semibold px-6 py-2 rounded-lg hover:bg-accent-light transition-all disabled:opacity-50 text-sm"
          >
            {uploading ? 'Yükleniyor...' : 'Yükle'}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {backgrounds.map((bg) => (
          <div key={bg.id} className="relative group">
            <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-700">
              {bg.image_url ? (
                <img
                  src={bg.image_url}
                  alt={bg.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">
                  Görsel Yok
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-white text-sm font-medium">{bg.name}</span>
              {bg.is_active && (
                <span className="text-accent text-xs bg-accent/20 px-2 py-1 rounded-full">Aktif</span>
              )}
            </div>
            <div className="mt-2 flex gap-2">
              {!bg.is_active && (
                <button
                  onClick={() => handleSetActive(bg.id)}
                  className="flex-1 bg-green-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Aktifleştir
                </button>
              )}
              {!bg.is_preset && (
                <button
                  onClick={() => handleDelete(bg.id)}
                  className="flex-1 bg-red-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sil
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {backgrounds.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          Henüz arka plan eklenmemiş.
        </div>
      )}
    </div>
  )
}

export default HeroBackgroundManager
