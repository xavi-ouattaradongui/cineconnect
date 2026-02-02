const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  // Authentification
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'inscription');
    }
    
    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Identifiants invalides');
    }
    
    return data;
  },

  // Films (avec token optionnel)
  getFilms: async (token) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const response = await fetch(`${API_URL}/films`, { headers });
    return response.json();
  },

  // Reviews
  getReviews: async (filmId, token) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const response = await fetch(`${API_URL}/reviews/film/${filmId}`, { headers });
    return response.json();
  },

  createReview: async (reviewData, token) => {
    const response = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la création de l\'avis');
    }
    
    return data;
  },

  updateReview: async (reviewId, reviewData, token) => {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la mise à jour de l\'avis');
    }
    
    return data;
  },

  deleteReview: async (reviewId, token) => {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erreur lors de la suppression de l\'avis');
    }
    
    return true;
  },

  // Profile
  getProfile: async (token) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la récupération du profil');
    }
    
    return data;
  },

  updateProfile: async (profileData, token) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la mise à jour du profil');
    }
    
    return data;
  },

  changePassword: async (passwordData, token) => {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors du changement de mot de passe');
    }
    
    return data;
  },

  // Réactions
  toggleReaction: async (reviewId, type, token) => {
    const response = await fetch(`${API_URL}/reviews/${reviewId}/reaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ type })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la réaction');
    }
    
    return data;
  }
};
