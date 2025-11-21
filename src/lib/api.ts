const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Models endpoints
  getAllModels: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/models?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch models');
    return response.json();
  },

  getLeaderboard: async (limit = 50) => {
    const response = await fetch(`${API_BASE_URL}/models/leaderboard?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  },

  getFeaturedModels: async () => {
    const response = await fetch(`${API_BASE_URL}/models/featured`);
    if (!response.ok) throw new Error('Failed to fetch featured models');
    return response.json();
  },

  getModelById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/models/${id}`);
    if (!response.ok) throw new Error('Failed to fetch model');
    return response.json();
  },

  getModelTypes: async () => {
    const response = await fetch(`${API_BASE_URL}/models/types`);
    if (!response.ok) throw new Error('Failed to fetch model types');
    return response.json();
  },

  getOrganizations: async () => {
    const response = await fetch(`${API_BASE_URL}/models/organizations`);
    if (!response.ok) throw new Error('Failed to fetch organizations');
    return response.json();
  },

  getStatistics: async () => {
    const response = await fetch(`${API_BASE_URL}/models/stats/overview`);
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return response.json();
  },

  getPricingData: async () => {
    const response = await fetch(`${API_BASE_URL}/models/pricing`);
    if (!response.ok) throw new Error('Failed to fetch pricing data');
    return response.json();
  },

  // Upload endpoint
  uploadCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload/upload-csv`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error('Failed to upload CSV');
    return response.json();
  },

  // CRUD operations
  createModel: async (modelData) => {
    const response = await fetch(`${API_BASE_URL}/models`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modelData),
    });
    if (!response.ok) throw new Error('Failed to create model');
    return response.json();
  },

  updateModel: async (id, modelData) => {
    const response = await fetch(`${API_BASE_URL}/models/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modelData),
    });
    if (!response.ok) throw new Error('Failed to update model');
    return response.json();
  },

  deleteModel: async (id) => {
    const response = await fetch(`${API_BASE_URL}/models/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete model');
    return response.json();
  },
};

export default api;
