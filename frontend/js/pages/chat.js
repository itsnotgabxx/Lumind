import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';
import { api } from '../api.js';

export default function ChatPage({ params }) {
    const peerId = params?.peer_id;

    return `
        <div class="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-6">
            <div class="container mx-auto px-4 max-w-2xl h-screen flex flex-col">
                <!-- Header -->
                <div class="bg-white rounded-t-xl shadow-lg border-b-2 border-purple-200 p-4 flex items-center justify-between mb-0">
                    <div class="flex items-center gap-3">
                        <button id="back-button" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <i class="fas fa-arrow-left text-gray-600"></i>
                        </button>
                        <div>
                            <h2 id="peer-name" class="text-xl font-bold text-gray-800">Carregando...</h2>
                            <p id="peer-status" class="text-xs text-gray-500">Online</p>
                        </div>
                    </div>
                    <i class="fas fa-circle text-green-500 text-sm"></i>
                </div>

                <!-- Messages Container -->
                <div id="messages-container" class="flex-1 bg-white overflow-y-auto p-4 space-y-3">
                    <div class="text-center py-12">
                        <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
                        <p class="text-gray-600">Carregando conversa...</p>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="bg-white rounded-b-xl shadow-lg border-t-2 border-purple-200 p-4">
                    <div class="flex gap-2">
                        <input 
                            id="message-input" 
                            type="text" 
                            placeholder="Digite sua mensagem..." 
                            class="input-field flex-1"
                            maxlength="500"
                        >
                        <button id="send-button" class="btn-primary px-4 py-2">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <p id="char-count" class="text-xs text-gray-500 mt-2">0/500</p>
                </div>
            </div>
        </div>
    `;
}

export async function setup({ params }) {
    const user = userState.user;
    if (!user) {
        window.router.navigate('/login');
        return;
    }

    // Apenas estudantes podem usar chat
    if (user.user_type !== 'student') {
        window.router.navigate('/recomendacao');
        return;
    }

    const peerId = params?.peer_id;
    if (!peerId) {
        showCustomAlert('Companheiro não encontrado', 'error');
        window.router.navigate('/recomendacao');
        return;
    }

    const messagesContainer = document.getElementById('messages-container');
    const peerNameEl = document.getElementById('peer-name');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const charCountEl = document.getElementById('char-count');
    const backButton = document.getElementById('back-button');

    let peerName = 'Companheiro';

    // Buscar nome do peer
    try {
        const peerUser = await api.getUserById(parseInt(peerId));
        peerName = peerUser.full_name;
        peerNameEl.textContent = peerName;
    } catch (e) {
        console.error('Erro ao buscar peer:', e);
    }

    // Carregar conversa
    async function loadConversation() {
        try {
            const messages = await api.getConversation(parseInt(peerId));

            if (!messages || messages.length === 0) {
                messagesContainer.innerHTML = `
                    <div class="text-center py-12">
                        <i class="fas fa-comments text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500">Nenhuma mensagem ainda.</p>
                        <p class="text-sm text-gray-400 mt-2">Seja o primeiro a começar a conversa!</p>
                    </div>
                `;
                return;
            }

            messagesContainer.innerHTML = messages.map(msg => {
                const isOwn = msg.sender_id === user.id;
                const time = new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                return `
                    <div class="flex ${isOwn ? 'justify-end' : 'justify-start'}">
                        <div class="max-w-xs lg:max-w-md ${isOwn ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg p-3">
                            <p class="break-words">${escapeHtml(msg.message)}</p>
                            <p class="text-xs ${isOwn ? 'text-purple-100' : 'text-gray-600'} mt-1">${time}</p>
                        </div>
                    </div>
                `;
            }).join('');

            // Scroll para última mensagem
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Erro ao carregar conversa:', error);
            messagesContainer.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
                    <p class="text-red-600">Erro ao carregar mensagens</p>
                </div>
            `;
        }
    }

    // Atualizar contador de caracteres
    messageInput.addEventListener('input', (e) => {
        charCountEl.textContent = `${e.target.value.length}/500`;
    });

    // Enviar mensagem
    sendButton.addEventListener('click', async () => {
        const message = messageInput.value.trim();
        if (!message) {
            showCustomAlert('Digite uma mensagem!', 'warning');
            return;
        }

        try {
            await api.sendDirectMessage(parseInt(peerId), message);
            messageInput.value = '';
            charCountEl.textContent = '0/500';
            await loadConversation();
        } catch (error) {
            console.error('Erro ao enviar:', error);
            showCustomAlert('Erro ao enviar mensagem', 'error');
        }
    });

    // Enter para enviar
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    // Voltar
    backButton.addEventListener('click', () => {
        window.router.navigate('/recomendacao');
    });

    // Carregar conversa inicial
    await loadConversation();

    // Recarregar a cada 3 segundos (polling simples)
    const pollInterval = setInterval(async () => {
        try {
            await loadConversation();
        } catch (e) {
            console.log('Erro no polling:', e);
        }
    }, 3000);

    // Cleanup
    window.addEventListener('beforeunload', () => {
        clearInterval(pollInterval);
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
