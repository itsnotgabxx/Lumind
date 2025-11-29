// Configuração da API
const API_BASE_URL = 'http://localhost:8000/api';

// Classe para gerenciar a API
class LumindAPI {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('lumind_user') || 'null');
        // Normaliza URLs relativas vindas do backend/localStorage
        if (this.user) {
            this.user = this._normalizeUser(this.user);
        }
    }

    // Métodos auxiliares internos
    _getStaticBase() {
        // Remove o sufixo /api da base
        return API_BASE_URL.replace(/\/?api$/, '');
    }

    _toAbsoluteIfStatic(urlOrPath) {
        if (!urlOrPath) return urlOrPath;
        if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
        // Caminho relativo vindo do backend (ex: /static/avatars/1.png)
        const base = this._getStaticBase();
        return `${base}${urlOrPath}`;
    }

    _normalizeUser(user) {
        try {
            if (user && user.avatar_url) {
                user.avatar_url = this._toAbsoluteIfStatic(user.avatar_url);
            }
        } catch (_) {}
        return user;
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
        let user = await this.request(`/users/login-by-email?user_email=${encodeURIComponent(email)}`, {
            method: 'POST'
        });
        user = this._normalizeUser(user);
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
        const updated = await this.request(`/users/${this.user.id}/preferences`, {
            method: 'PUT',
            body: JSON.stringify(preferences)
        });
        // Sincroniza estado local com o usuário atualizado
        this.user = updated;
        localStorage.setItem('lumind_user', JSON.stringify(updated));
        return updated;
    }

    async updateProfile(profileData) {
        if (!this.user) throw new Error("Usuário não logado.");
        const updated = await this.request(`/users/${this.user.id}/profile`, {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
        // Sincroniza estado local
        this.user = updated;
        localStorage.setItem('lumind_user', JSON.stringify(updated));
        return updated;
    }

    async updateAccessibility(accessibilityData) {
        if (!this.user) throw new Error("Usuário não logado.");
        const updated = await this.request(`/users/${this.user.id}/accessibility`, {
            method: 'PUT',
            body: JSON.stringify(accessibilityData)
        });
        // Sincroniza estado local
        this.user = updated;
        localStorage.setItem('lumind_user', JSON.stringify(updated));
        return updated;
    }

    async uploadAvatar(file) {
        if (!this.user) throw new Error("Usuário não logado.");
        const formData = new FormData();
        formData.append('file', file);
        const url = `${API_BASE_URL}/users/${this.user.id}/avatar`;
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.detail || 'Erro ao enviar avatar');
        }
        const data = await response.json();
        // Converte caminho relativo do backend em URL absoluta do servidor de API
        const staticBase = API_BASE_URL.replace(/\/api$/, '');
        const absoluteUrl = data.avatar_url?.startsWith('http')
            ? data.avatar_url
            : `${staticBase}${data.avatar_url}`;
        // Guarda avatar_url no user local (campo extra local)
        this.user = { ...this.user, avatar_url: absoluteUrl };
        localStorage.setItem('lumind_user', JSON.stringify(this.user));
        return { avatar_url: absoluteUrl };
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

    async getStudentProgress(studentId) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/users/${studentId}/progress`);
    }

    async updateProgress(contentId, status, progressPercentage = 0, timeSpent = 0) {
        if (!this.user) throw new Error("Usuário não logado.");
        const userId = this.user.id;
        const url = `/users/${userId}/progress/${contentId}?status=${status}&progress_percentage=${progressPercentage}&time_spent=${timeSpent}`;
        console.log(`📤 updateProgress called:`, {
            userId,
            contentId,
            status,
            progressPercentage,
            timeSpent,
            url
        });
        return await this.request(url, {
            method: 'POST'
        });
    }

    async getUserActivities() {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/users/${this.user.id}/activities`);
    }

    async getDailyActivity(days = 7) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/users/${this.user.id}/daily-activity?days=${days}`);
    }

    // Busca atividades diárias do estudante vinculado (para responsáveis)
    async getStudentDailyActivity(studentId, days = 7) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/users/${studentId}/daily-activity?days=${days}`);
    }

    async getContentPeers(contentId) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/content/${contentId}/peers?user_id=${this.user.id}`);
    }

    async getConversation(peerId) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/messages/users/${this.user.id}/conversations/${peerId}`);
    }

    async getPeersConversations() {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/messages/users/${this.user.id}/peers-conversations`);
    }

    async sendDirectMessage(recipientId, message) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/messages/users/${this.user.id}/send`, {
            method: 'POST',
            body: JSON.stringify({
                recipient_id: recipientId,
                message: message,
                message_type: 'general'
            })
        });
    }

    async getUserById(userId) {
        return await this.request(`/users/${userId}`);
    }

    async getUnreadMessagesCount() {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/messages/users/${this.user.id}/unread-count`);
    }

    // Busca atividades do estudante vinculado (para responsáveis)
    async getStudentActivities(studentId) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/users/${studentId}/activities`);
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

    async markConversationAsRead(senderId) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/messages/users/${this.user.id}/mark-conversation-read/${senderId}`, {
            method: 'POST'
        });
    }

    async getGuardianMessages(studentId) {
        if (!this.user) throw new Error("Usuário não logado.");
        return await this.request(`/messages/guardian/${this.user.id}/student/${studentId}`);
    }

    // Relatórios
    async downloadStudentReportPDF(studentId) {
        if (!this.user) throw new Error("Usuário não logado.");
        
        try {
            const url = `${API_BASE_URL}/reports/student/${studentId}/pdf`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao gerar relatório');
            }

            // Obtém o blob do PDF
            const blob = await response.blob();
            
            // Extrai o nome do arquivo dos headers
            const contentDisposition = response.headers.get('content-disposition');
            let filename = 'relatorio.pdf';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename=([^;]+)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/"/g, '');
                }
            }

            // Cria um link temporário para download
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            return { success: true, filename };
        } catch (error) {
            console.error('Erro ao baixar relatório:', error);
            throw error;
        }
    }

    async googleLogin(token) {
    const data = await this.request('/users/google', {
        method: 'POST',
        body: JSON.stringify({ token })
    });

    // 👇 VERIFICAR SE É USUÁRIO NOVO
    if (data.is_new_user) {
        // Retorna os dados do Google para o cadastro
        return {
            isNewUser: true,
            googleData: data.google_data
        };
    } else {
        // Usuário existente - faz login normalmente
        this.user = this._normalizeUser(data.user);
        localStorage.setItem('lumind_user', JSON.stringify(this.user));
        return {
            isNewUser: false,
            user: this.user
        };
    }
}

// 👇 NOVO MÉTODO para completar cadastro com Google
async completeGoogleRegistration(userData) {
    let newUser = await this.request('/users/google/complete-registration', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
    newUser = this._normalizeUser(newUser);
    this.user = newUser;
    localStorage.setItem('lumind_user', JSON.stringify(newUser));
    return newUser;
}
}


// Instância global da API
export const api = new LumindAPI();
