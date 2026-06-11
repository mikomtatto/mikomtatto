import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const StyleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [style, setStyle] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [commentForm, setCommentForm] = useState({
    name: '',
    is_anonymous: false,
    rating: 5,
    text: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [id])

  const API_URL = import.meta.env.VITE_API_URL || 'https://mikomtatto-backend.onrender.com'

  const fetchData = async () => {
    try {
      const [styleRes, commentsRes] = await Promise.all([
        axios.get(`${API_URL}/api/styles/${id}/`),
        axios.get(`${API_URL}/api/gallery/comments/?content_type=tattoostyle&object_id=${id}`)
      ])
      setStyle(styleRes.data)
      setComments(commentsRes.data)
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = () => {
    navigate(`/booking?style=${id}`)
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    
    // Spam prevention: Check if user has commented on this item recently
    const storageKey = `commented_tattoostyle_${id}`
    const lastCommentTime = localStorage.getItem(storageKey)
    const COOLDOWN_MINUTES = 5
    
    if (lastCommentTime) {
      const timeDiff = Date.now() - parseInt(lastCommentTime)
      const minutesDiff = timeDiff / (1000 * 60)
      
      if (minutesDiff < COOLDOWN_MINUTES) {
        alert(`Yorum yapmak için ${Math.ceil(COOLDOWN_MINUTES - minutesDiff)} dakika beklemelisiniz.`)
        return
      }
    }
    
    setSubmitting(true)

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      await axios.post(`${API_URL}/api/gallery/comments/`, {
        ...commentForm,
        content_type: 'tattoostyle',
        object_id: parseInt(id)
      })
      setCommentForm({ name: '', is_anonymous: false, rating: 5, text: '' })
      setShowModal(false)
      
      // Store comment time for spam prevention
      localStorage.setItem(storageKey, Date.now().toString())
      
      fetchData() // Reload comments
    } catch (error) {
      console.error('Yorum gönderilirken hata:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className="pt-32 sm:pt-36 md:pt-40 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-gray-400">Yükleniyor...</div>
        </div>
      </section>
    )
  }

  if (!style) {
    return (
      <section className="pt-32 sm:pt-36 md:pt-40 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-gray-400">Stil bulunamadı.</div>
          <Link to="/styles" className="inline-block mt-4 btn-primary">
            Stiller Sayfasına Dön
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-32 sm:pt-36 md:pt-40 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/styles" className="inline-flex items-center gap-2 text-gray-400 hover:text-accent transition-colors mb-8">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Stiller Sayfasına Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            {style.image_url ? (
              <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-gray-900 border border-gray-800">
                <img 
                  src={style.image_url} 
                  alt={style.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[16/10] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
                <span className="text-6xl">🎨</span>
              </div>
            )}
          </div>

          <div>
            <h1 className="font-display text-4xl font-bold text-white mb-4">{style.name}</h1>
            
            {style.price_range && (
              <div className="inline-block bg-accent/20 backdrop-blur-sm text-accent px-4 py-2 rounded-full text-sm font-bold mb-6">
                {style.price_range}
              </div>
            )}
            
            {style.description && (
              <p className="text-gray-300 text-lg leading-relaxed mb-8 whitespace-pre-line">
                {style.description}
              </p>
            )}

            <button
              onClick={handleBookAppointment}
              className="bg-accent text-black font-semibold px-8 py-4 rounded-xl hover:bg-accent-light transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-accent/20 text-lg"
            >
              Bu Stilde Randevu Al
            </button>

            <div className="mt-8 text-gray-500 text-sm">
              <p>Oluşturulma Tarihi: {new Date(style.created_at).toLocaleDateString('tr-TR')}</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-bold text-white">Yorumlar ({comments.length})</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-accent text-black font-semibold px-6 py-3 rounded-xl hover:bg-accent-light transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-accent/20"
            >
              + Yorum Yap
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                Henüz yorum yapılmamış. İlk yorumu siz yapın!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white">
                        {comment.is_anonymous ? 'Anonim' : comment.name}
                      </h4>
                      <div className="flex items-center gap-2 text-accent text-sm">
                        {'★'.repeat(comment.rating)}
                        <span className="text-gray-500">•</span>
                        <p className="text-gray-500 text-sm">
                          {new Date(comment.created_at).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 whitespace-pre-line">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Comment Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-2xl font-bold text-white">Yorum Yap</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={commentForm.is_anonymous}
                      onChange={(e) => setCommentForm({ ...commentForm, is_anonymous: e.target.checked })}
                      className="w-4 h-4 accent-accent"
                    />
                    Anonim olarak yorum yap
                  </label>
                </div>

                {!commentForm.is_anonymous && (
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Adınız Soyadınız *</label>
                    <input
                      type="text"
                      value={commentForm.name}
                      onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                      placeholder="Adınız Soyadınız"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Puan *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setCommentForm({ ...commentForm, rating: star })}
                        className={`text-3xl transition-colors ${
                          star <= commentForm.rating ? 'text-accent' : 'text-gray-600 hover:text-accent'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Yorumunuz *</label>
                  <textarea
                    value={commentForm.text}
                    onChange={(e) => setCommentForm({ ...commentForm, text: e.target.value })}
                    placeholder="Yorumunuz..."
                    rows={4}
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-700 transition-all"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-accent text-black font-semibold px-6 py-3 rounded-xl hover:bg-accent-light transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {submitting ? 'Gönderiliyor...' : 'Yorum Yap'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default StyleDetail
