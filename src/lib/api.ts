import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/api/v1',
    withCredentials: true, // Send cookies to the API
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
