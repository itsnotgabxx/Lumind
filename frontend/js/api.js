// Configuração da API
const API_BASE_URL = 'http://localhost:8000/api';

// Classe para gerenciar a API
class LumindAPI {
    constructor() {
        this.token = localStorage.getItem('lumind_token');
        this.user = JSON.parse(localStorage.getItem('lumind_user') || 'null');
    }

    // Método para fazer requisições HTTP
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Adiciona token de autenticação se disponível
        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Erro na requisição');
            }

            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    }

    // Autenticação
    async login(email, password) {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Erro no login');
        }

        this.token = data.access_token;
        localStorage.setItem('lumind_token', this.token);

        // Busca dados do usuário
        await this.getCurrentUser();
        return data;
    }

    async register(userData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        // Após registro, faz login automaticamente
        await this.login(userData.email, userData.password);
        return data;
    }

    async getCurrentUser() {
        if (!this.token) return null;

        try {
            const user = await this.request('/auth/me');
            this.user = user;
            localStorage.setItem('lumind_user', JSON.stringify(user));
            return user;
        } catch (error) {
            this.logout();
            return null;
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('lumind_token');
        localStorage.removeItem('lumind_user');
    }

    // Preferências de aprendizado
    async updatePreferences(preferences) {
        return await this.request('/auth/preferences', {
            method: 'PUT',
            body: JSON.stringify(preferences)
        });
    }

    async updateProfile(profileData) {
        return await this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    // Conteúdo
    async getContent() {
        return await this.request('/content');
    }

    async getContentById(id) {
        return await this.request(`/content/${id}`);
    }

    async getRecommendations(limit = 5) {
        return await this.request(`/recommendations?limit=${limit}`);
    }

    // Progresso
    async getUserProgress() {
        return await this.request('/progress');
    }

    async updateProgress(contentId, status, progressPercentage = 0, timeSpent = 0) {
        return await this.request(`/progress/${contentId}?status=${status}&progress_percentage=${progressPercentage}&time_spent=${timeSpent}`, {
            method: 'POST'
        });
    }

    async getUserActivities() {
        return await this.request('/activities');
    }

    // Mensagens
    async sendMessage(recipientId, message, messageType = 'incentive') {
        return await this.request('/messages/send', {
            method: 'POST',
            body: JSON.stringify({
                recipient_id: recipientId,
                message: message,
                message_type: messageType
            })
        });
    }

    async getReceivedMessages(messageType = null) {
        const endpoint = messageType ? `/messages/received?message_type=${messageType}` : '/messages/received';
        return await this.request(endpoint);
    }

    async getUnreadCount() {
        return await this.request('/messages/unread-count');
    }

    async markMessageAsRead(messageId) {
        return await this.request(`/messages/mark-read/${messageId}`, {
            method: 'POST'
        });
    }

    async getGuardianMessages(studentId) {
        return await this.request(`/messages/guardian/${studentId}`);
    }
}

// Instância global da API
const api = new LumindAPI();

// Funções auxiliares para o frontend
function showCustomAlert(message, title = "Alerta", type = "info") {
    // Usa a função existente do script.js
    if (typeof window.showCustomAlert === 'function') {
        window.showCustomAlert(message, title, type);
    } else {
        alert(`${title}: ${message}`);
    }
}

// Função para converter dados do formulário para o formato da API
function formDataToUserCreate(formData) {
    const learningPreferences = [];
    const interests = formData.get('interesses') ? formData.get('interesses').split(',').map(i => i.trim()) : [];
    const distractions = formData.get('distracoes') || '';

    // Converte checkboxes de preferências de aprendizado
    const checkboxes = document.querySelectorAll('input[name="aprender_pref"]:checked');
    checkboxes.forEach(checkbox => {
        learningPreferences.push(checkbox.value);
    });

    return {
        full_name: formData.get('nome-completo'),
        email: formData.get('email-cadastro'),
        password: formData.get('senha-cadastro'),
        birth_date: formData.get('data-nascimento') ? new Date(formData.get('data-nascimento')).toISOString() : null,
        guardian_name: formData.get('nome-responsavel') || null,
        guardian_email: formData.get('email-responsavel') || null,
        learning_preferences: learningPreferences,
        interests: interests,
        distractions: distractions
    };
}

// Função para converter dados do questionário
function questionnaireDataToPreferences() {
    const learningPreferences = [];
    const interests = document.getElementById('interesses').value ? 
        document.getElementById('interesses').value.split(',').map(i => i.trim()) : [];
    const distractions = document.getElementById('distracoes').value || '';

    // Converte checkboxes de preferências de aprendizado
    const checkboxes = document.querySelectorAll('input[name="aprender_pref"]:checked');
    checkboxes.forEach(checkbox => {
        learningPreferences.push(checkbox.value);
    });

    return {
        learning_preferences: learningPreferences,
        interests: interests,
        distractions: distractions
    };
}
