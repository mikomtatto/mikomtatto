const API_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL || 'https://mikomtatto-backend.onrender.com')
  : ''

export const api = {
  gallery: {
    images: () => `${API_URL}/api/gallery/images/`,
    image: (id) => `${API_URL}/api/gallery/images/${id}/`,
    comments: () => `${API_URL}/api/gallery/comments/`,
  },
  styles: {
    list: () => `${API_URL}/api/styles/`,
    detail: (id) => `${API_URL}/api/styles/${id}/`,
  },
  appointments: {
    create: () => `${API_URL}/api/appointments/`,
  },
}
