import axios from 'axios';

// The Vite proxy handles routing '/api' to the backend during dev.
// In production, Nginx routes '/api' to the backend container.
const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Sends a chat message to the FastAPI backend.
 * @param {string} query - The user's query.
 * @param {string} subject - The subject ("computer_science" or "english").
 * @returns {Promise<object>} The chat response data containing the answer, mode, and subject.
 */
export const sendChatMessage = async (query, subject) => {
  try {
    const response = await api.post('/chat', {
      query: query,
      subject: subject,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.detail || 'Server error');
  }
};

export default api;
