// Configuração da API
const API_BASE_URL = 'http://localhost:8000/api';

// Classe para gerenciar a API
class LumindAPI {
    constructor() {
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
    async login(email) {
        // Usa o novo endpoint que não requer senha
        const user = await this.request(`/users/login-by-email?user_email=${encodeURIComponent(email)}`, {
            method: 'POST'
        });
        this.user = user;
        localStorage.setItem('lumind_user', JSON.stringify(user));
        return user;
    }

    async register(userData) {
        const newUser = await this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        // Após registro, faz login automaticamente
        await this.login(newUser.email);
        return newUser;
    }

    async getCurrentUser() {
        // Apenas retorna o usuário que já está em memória/localStorage
        return this.user;
    }

    logout() {
        this.user = null;
        localStorage.removeItem('lumind_user');
    }

    // Preferências de aprendizado
    async updatePreferences(preferences) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/users/${this.user.id}/preferences`, {
            method: 'PUT',
            body: JSON.stringify(preferences)
        });
    }

    async updateProfile(profileData) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/users/${this.user.id}/profile`, {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async updateAccessibility(accessibilityData) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/users/${this.user.id}/accessibility`, {
            method: 'PUT',
            body: JSON.stringify(accessibilityData)
        });
    }

    // Conteúdo
    async getContent() {
        return await this.request(`/content`);
    }

    async getContentById(id) {
        return await this.request(`/content/${id}`);
    }

    async getRecommendations(limit = 5) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/users/${this.user.id}/recommendations?limit=${limit}`);
    }

    // Progresso
    async getUserProgress() {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/users/${this.user.id}/progress`);
    }

    async updateProgress(contentId, status, progressPercentage = 0, timeSpent = 0) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/users/${this.user.id}/progress/${contentId}?status=${status}&progress_percentage=${progressPercentage}&time_spent=${timeSpent}`, {
            method: 'POST'
        });
    }

    async getUserActivities() {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/users/${this.user.id}/activities`);
    }

    // Mensagens
    async sendMessage(recipientId, message, messageType = 'incentive') {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/messages/users/${this.user.id}/send`, {
            method: 'POST',
            body: JSON.stringify({
                recipient_id: recipientId,
                message: message,
                message_type: messageType
            })
        });
    }

    async getReceivedMessages(messageType = null) {
        if (!this.user) throw new Error("Usuário não logado.");
        const endpoint = messageType ? `/messages/users/${this.user.id}/received?message_type=${messageType}` : `/messages/users/${this.user.id}/received`;
        return await this.request(endpoint);
    }

    async getUnreadCount() {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/messages/users/${this.user.id}/unread-count`);
    }

    async markMessageAsRead(messageId) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/messages/users/${this.user.id}/mark-read/${messageId}`, {
            method: 'POST'
        });
    }

    async getGuardianMessages(studentId) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/messages/guardian/${this.user.id}/student/${studentId}`);
    }
}

// Instância global da API
export const api = new LumindAPI();