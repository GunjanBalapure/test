// API Configuration
const API_BASE_URL = '/api';

// Get auth token from localStorage
function getAuthToken() {
    const user = JSON.parse(localStorage.getItem('kaagaz_user') || '{}');
    return user.token || '';
}

// API Helper Functions
const api = {
    // Authentication
    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },

    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return await response.json();
    },

    // Documents
    async uploadDocument(formData) {
        const response = await fetch(`${API_BASE_URL}/documents/upload`, {
            method: 'POST',
            body: formData
        });
        return await response.json();
    },

    async getDocuments() {
        const response = await fetch(`${API_BASE_URL}/documents`, {
            method: 'GET'
        });
        return await response.json();
    },

    async getDocument(id) {
        const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
            method: 'GET'
        });
        return await response.json();
    },

    async deleteDocument(id) {
        const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    }
};
