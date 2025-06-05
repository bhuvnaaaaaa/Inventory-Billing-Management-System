import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Replace with your backend API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
