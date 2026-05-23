import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // --- B2C Assistant Endpoints ---
  getProducts: async (filters = {}) => {
    try {
      const response = await apiClient.get('/assistant/products', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      throw error;
    }
  },

  getRecommendations: async (filters = {}) => {
    try {
      const response = await apiClient.get('/assistant/recommendations', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching top recommendations:', error);
      throw error;
    }
  },

  // --- B2B Dashboard Endpoints ---
  getCountryDistribution: async () => {
    try {
      const response = await apiClient.get('/dashboard/country-distribution');
      return response.data;
    } catch (error) {
      console.error('Error fetching country distribution:', error);
      throw error;
    }
  },

  getPriceRatingCorrelation: async () => {
    try {
      const response = await apiClient.get('/dashboard/price-rating-correlation');
      return response.data;
    } catch (error) {
      console.error('Error fetching price rating correlation:', error);
      throw error;
    }
  },

  getTopIngredients: async (limit = 12) => {
    try {
      const response = await apiClient.get('/dashboard/top-ingredients', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching top ingredients:', error);
      throw error;
    }
  },
};
