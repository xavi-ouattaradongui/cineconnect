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
    const response = await fetch(`${API_URL}/reviews/${filmId}`, { headers });
    return response.json();
  }
};
