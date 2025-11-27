import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';
import { resetUnreadCount, updateNotificationBadges } from '../utils/notifications.js';

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

export async function setup() {
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

    // Reset contador de mensagens não lidas e atualiza badges
    resetUnreadCount();
    await updateNotificationBadges();

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

            // Buscar todas as mensagens (sem filtro de tipo)
            let allMessages = [];
            
            try {
                // Buscar mensagens de incentivo
                const incentiveMessages = await api.getReceivedMessages('incentive');
                allMessages = [...incentiveMessages];
            } catch (e) {
                console.log('Erro ao buscar mensagens de incentivo:', e);
            }

            try {
                // Buscar mensagens de chat
                const chatMessages = await api.getReceivedMessages('general');
                allMessages = [...allMessages, ...chatMessages];
            } catch (e) {
                console.log('Erro ao buscar mensagens de chat:', e);
            }

            // Agrupar mensagens por sender (conversas)
            const conversasMap = new Map();
            
            allMessages.forEach(msg => {
                const senderId = msg.sender?.id || msg.sender_id;
                if (!conversasMap.has(senderId)) {
                    conversasMap.set(senderId, {
                        sender: msg.sender || { id: senderId, full_name: 'Desconhecido' },
                        messages: [],
                        messageType: msg.message_type
                    });
                }
                conversasMap.get(senderId).messages.push(msg);
            });

            // Converter para array e ordenar por mensagem mais recente
            let conversas = Array.from(conversasMap.values());
            conversas.forEach(conversa => {
                conversa.messages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                conversa.lastMessage = conversa.messages[0];
                conversa.unreadCount = conversa.messages.filter(m => !m.is_read).length;
            });

            conversas.sort((a, b) => {
                return new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at);
            });

            if (!conversas || conversas.length === 0) {
                container.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }

            emptyState.classList.add('hidden');

            let filtered = conversas;
            if (currentFilter === 'unread') {
                filtered = conversas.filter(c => c.unreadCount > 0);
            }

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8 px-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                        <p class="text-gray-600">Nenhuma mensagem neste filtro</p>
                    </div>
                `;
                return;
            }

            // Renderiza conversas
            container.innerHTML = filtered.map((conversa) => {
                const msg = conversa.lastMessage;
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

                // Determina o tipo de mensagem
                const isFromFriend = msg.message_type === 'general';
                const messageTypeLabel = isFromFriend 
                    ? '<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">💜 Amigo</span>'
                    : '<span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">👥 Responsável</span>';

                // Define emoji baseado no tipo
                const emoji = isFromFriend ? '👤' : '💜';

                const borderColor = isFromFriend ? 'border-blue-400' : 'border-purple-400';
                const gradientColor = isFromFriend ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500';

                // Preview da última mensagem (truncado)
                const previewText = msg.message.length > 60 ? msg.message.substring(0, 60) + '...' : msg.message;
                const previewClass = msg.is_read ? 'text-gray-600' : 'text-gray-800 font-semibold';

                return `
                    <div class="conversa-card card bg-white border-l-4 ${borderColor} hover:shadow-lg transition-all group cursor-pointer relative" data-sender-id="${conversa.sender.id}">
                        ${conversa.unreadCount > 0 ? `<div class="absolute top-3 right-3 bg-gradient-to-br from-green-400 to-emerald-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">${conversa.unreadCount}</div>` : ''}
                        <div class="flex gap-4">
                            <!-- Avatar -->
                            <div class="flex-shrink-0 relative">
                                <div class="w-14 h-14 bg-gradient-to-br ${gradientColor} rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <span class="text-2xl">${emoji}</span>
                                </div>
                            </div>

                            <!-- Conteúdo -->
                            <div class="flex-grow min-w-0">
                                <div class="flex items-start justify-between gap-2 mb-2">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <h3 class="font-semibold text-gray-800">
                                                ${conversa.sender.full_name}
                                            </h3>
                                            ${messageTypeLabel}
                                        </div>
                                        <p class="text-xs text-gray-500 mt-1">${formattedTime}</p>
                                    </div>
                                </div>

                                <!-- Preview da mensagem -->
                                <p class="${previewClass} leading-relaxed break-words text-sm">${escapeHtml(previewText)}</p>

                                <!-- Ação -->
                                <div class="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${conversa.unreadCount > 0 ? `
                                        <button class="mark-read-btn text-xs btn-subtle py-1 px-3">
                                            <i class="fas fa-check mr-1"></i>Marcar como lida
                                        </button>
                                    ` : ''}
                                    <button class="reply-btn text-xs btn-primary py-1 px-3" data-peer-id="${conversa.sender.id}">
                                        <i class="fas fa-reply mr-1"></i>Responder
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Event listeners para marcar conversa como lida
            document.querySelectorAll('.mark-read-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const card = e.currentTarget.closest('.conversa-card');
                    const senderId = card.dataset.senderId;

                    try {
                        await api.markConversationAsRead(senderId);
                        await updateNotificationBadges();
                        loadMessages();
                    } catch (error) {
                        console.error('Erro ao marcar como lida:', error);
                        showCustomAlert('Erro ao marcar como lida', 'error');
                    }
                });
            });

            // Event listeners para responder (abrir chat)
            document.querySelectorAll('.reply-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const peerId = btn.getAttribute('data-peer-id');
                    
                    // Marca a conversa como lida antes de abrir o chat
                    try {
                        await api.markConversationAsRead(peerId);
                        await updateNotificationBadges();
                    } catch (error) {
                        console.log('Nota: Erro ao marcar como lido ao abrir chat:', error);
                        // Continua mesmo se falhar
                    }
                    
                    window.router.navigate(`/chat/${peerId}`);
                });
            });

            // Event listeners para abrir conversa completa ao clicar no card
            document.querySelectorAll('.conversa-card').forEach(card => {
                card.addEventListener('click', async () => {
                    const senderId = card.dataset.senderId;
                    window.router.navigate(`/chat/${senderId}`);
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
