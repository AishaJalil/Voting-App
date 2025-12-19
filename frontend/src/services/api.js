import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const pollAPI = {
    getAllPolls: () => api.get('/polls'),
    getPoll: (id) => api.get(`/polls/${id}`),
    createPoll: (pollData) => api.post('/polls', pollData),
    vote: (voteData) => api.post('/polls/vote', voteData),
};

export default api;