
import axios from 'axios';
import { authHeader } from './authService';

const API_URL = 'http://localhost:5000/api/users';

export const getUsers = () => {
  return axios.get(API_URL, { headers: authHeader() });
};
