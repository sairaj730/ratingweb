
import axios from 'axios';
import { authHeader } from './authService';

const API_URL = 'http://localhost:5000/api';

export const getStores = () => {
  return axios.get(`${API_URL}/stores`, { headers: authHeader() });
};

export const getRatings = () => {
  return axios.get(`${API_URL}/ratings`, { headers: authHeader() });
};

export const addRating = (ratingData) => {
  return axios.post(`${API_URL}/ratings/add`, ratingData, { headers: authHeader() });
};

export const getStats = () => {
  return axios.get(`${API_URL}/stats`, { headers: authHeader() });
};

export const addStore = (storeData) => {
  return axios.post(`${API_URL}/stores/add`, storeData, { headers: authHeader() });
};

export const updateRating = (ratingData) => {
  return axios.put(`${API_URL}/ratings/update`, ratingData, { headers: authHeader() });
};