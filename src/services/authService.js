
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  if (response.data.accessToken) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const authHeader = () => {
  const user = getCurrentUser();

  if (user && user.accessToken) {
    return { Authorization: 'Bearer ' + user.accessToken };
  } else {
    return {};
  }
};

export const updateUserPassword = (password) => {
  return axios.put(`${API_URL}/update-password`, { password }, { headers: authHeader() });
};
