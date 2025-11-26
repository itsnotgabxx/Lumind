import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

export default function MensagensPage() {
    return `
        <div class="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
            <div class="container mx-auto px-4 max-w-4xl">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <div>
                        <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-3">
                            <i class="fas fa-inbox text-blue-500 text-3xl"></i>
                            Minhas Mensagens
                        </h1>
                        <p class="text-gray-600 mt-2">Incentivos e mensagens de seus responsáveis</p>
                    </div>
                    <button data-route="/recomendacao" class="btn-subtle whitespace-nowrap">
                        <i class="fas fa-arrow-left mr-2"></i>Voltar
                    </button>
                </div>

                <!-- Filtro de Mensagens -->
                <div class="mb-6 flex flex-wrap gap-2">
                    <button class="filter-btn active" data-filter="all">
                        <i class="fas fa-list mr-2"></i>Todas
                    </button>
                    <button class="filter-btn" data-filter="unread">
                        <i class="fas fa-star mr-2"></i>Não lidas
                    </button>
                </div>

                <!-- Container de Mensagens -->
                <div id="messages-container" class="space-y-4">
                    <div class="text-center py-12">
                        <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
                        <p class="text-gray-600">Carregando mensagens...</p>
                    </div>
                </div>

                <!-- Estado Vazio -->
                <div id="empty-state" class="hidden text-center py-12">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                        <i class="fas fa-envelope-open text-3xl text-purple-500"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Nenhuma mensagem ainda</h3>
                    <p class="text-gray-600 max-w-md mx-auto">
                        Você ainda não recebeu mensagens de incentivo. Quando seus responsáveis enviarem, elas aparecerão aqui! 📬
                    </p>
                </div>
            </div>
        </div>
    `;
}

export function setup() {
    const user = userState.user;
    if (!user) {
        window.router.navigate('/login');
        return;
    }

    // Proteção de rota: apenas estudantes podem acessar
    if (user.user_type === 'guardian') {
        window.router.navigate('/acompanhamento');
        return;
    }

    document.querySelector('[data-route="/recomendacao"]').addEventListener('click', () => {
        window.router.navigate('/recomendacao');
    });

    let currentFilter = 'all';
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            loadMessages();
        });
    });

    async function loadMessages() {
        try {
            const container = document.getElementById('messages-container');
            const emptyState = document.getElementById('empty-state');

            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600">Carregando mensagens...</p>
                </div>
            `;

            const messages = await api.getReceivedMessages('incentive');

            if (!messages || messages.length === 0) {
                container.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }

            emptyState.classList.add('hidden');

            let filtered = messages;
            if (currentFilter === 'unread') {
                filtered = messages.filter(m => !m.is_read);
            }

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8 px-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                        <p class="text-gray-600">Nenhuma mensagem neste filtro</p>
                    </div>
                `;
                return;
            }

            // Renderiza mensagens
            container.innerHTML = filtered.map((msg, index) => {
                const date = new Date(msg.created_at);
                const formattedDate = date.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });
                const formattedTime = date.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                // Extrai emoji se houver
                const emojiMatch = msg.message.match(/[\p{Emoji}]/u);
                const emoji = emojiMatch ? emojiMatch[0] : '💬';

                return `
                    <div class="message-card card bg-white border-l-4 border-purple-400 hover:shadow-lg transition-all group cursor-pointer" data-msg-id="${msg.id}" data-read="${msg.is_read}">
                        <div class="flex gap-4">
                            <!-- Avatar -->
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <span class="text-2xl">${emoji}</span>
                                </div>
                            </div>

                            <!-- Conteúdo -->
                            <div class="flex-grow min-w-0">
                                <div class="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                        <h3 class="font-semibold text-gray-800">
                                            ${msg.sender?.full_name || 'Amigo'}
                                            ${!msg.is_read ? '<span class="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>' : ''}
                                        </h3>
                                        <p class="text-xs text-gray-500">${formattedDate} às ${formattedTime}</p>
                                    </div>
                                    <div class="flex-shrink-0 flex gap-1">
                                        ${!msg.is_read ? '<i class="fas fa-star text-blue-500"></i>' : ''}
                                    </div>
                                </div>

                                <!-- Mensagem -->
                                <p class="text-gray-700 leading-relaxed break-words">${escapeHtml(msg.message)}</p>

                                <!-- Ação -->
                                <div class="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${!msg.is_read ? `
                                        <button class="mark-read-btn text-xs btn-subtle py-1 px-3">
                                            <i class="fas fa-check mr-1"></i>Marcar como lida
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Event listeners para marcar como lida
            document.querySelectorAll('.mark-read-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const card = e.closest('.message-card');
                    const msgId = card.dataset.msgId;

                    try {
                        await api.markMessageAsRead(msgId);
                        card.dataset.read = 'true';
                        loadMessages();
                    } catch (error) {
                        showCustomAlert('Erro ao marcar como lida', 'Erro', 'error');
                    }
                });
            });

            document.querySelectorAll('.message-card').forEach(card => {
                card.addEventListener('click', async () => {
                    const msgId = card.dataset.msgId;
                    if (card.dataset.read === 'false') {
                        try {
                            await api.markMessageAsRead(msgId);
                            card.dataset.read = 'true';
                            loadMessages();
                        } catch (error) {
                            console.error('Erro:', error);
                        }
                    }
                });
            });

        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
            const container = document.getElementById('messages-container');
            container.innerHTML = `
                <div class="text-center py-8 px-4 bg-red-50 rounded-lg border-2 border-red-300">
                    <i class="fas fa-exclamation-circle text-2xl text-red-500 mb-2"></i>
                    <p class="text-red-700">Erro ao carregar mensagens</p>
                    <button class="mt-3 btn-subtle text-sm" onclick="location.reload()">
                        <i class="fas fa-redo mr-1"></i>Tentar Novamente
                    </button>
                </div>
            `;
        }
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

    loadMessages();
}
