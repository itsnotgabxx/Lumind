import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';
import { api } from '../api.js';
import { updateNotificationBadges } from '../utils/notifications.js';

export default function MensagensResponsavelPage() {
    return `
        <div class="w-full min-h-screen py-8">
            <div class="container mx-auto px-4 max-w-4xl">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <div>
                        <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-3">
                            <i class="fas fa-inbox text-purple-500 text-3xl"></i>
                            Minhas Mensagens
                        </h1>
                        <p class="text-gray-600 mt-2">Incentivos enviados para <span id="student-name-header" class="font-semibold text-purple-700">...</span></p>
                    </div>
                    <button data-route="/acompanhamento" class="btn-subtle whitespace-nowrap">
                        <i class="fas fa-arrow-left mr-2"></i>Voltar
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
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Nenhuma mensagem enviada</h3>
                    <p class="text-gray-600 max-w-md mx-auto">
                        Você ainda não enviou mensagens de incentivo. Envie uma para motivar seu aluno! 💜
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

    // Proteção de rota: apenas responsáveis podem acessar
    if (user.user_type !== 'guardian') {
        window.router.navigate('/recomendacao');
        return;
    }

    // Verifica se tem aluno vinculado
    if (!user.student_id) {
        showCustomAlert('Você não tem um aluno vinculado', 'Erro', 'error');
        window.router.navigate('/acompanhamento');
        return;
    }

    document.querySelector('[data-route="/acompanhamento"]').addEventListener('click', () => {
        window.router.navigate('/acompanhamento');
    });

    await loadMessages();
    
    // Atualiza o badge de notificações ao carregar a página
    await updateNotificationBadges();
}

async function loadMessages() {
    try {
        console.log('🔄 Carregando mensagens do responsável...');
        const user = userState.user;
        const container = document.getElementById('messages-container');
        const emptyState = document.getElementById('empty-state');

        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600">Carregando mensagens...</p>
            </div>
        `;

        // Buscar dados do aluno para exibir no header
        let studentName = '...';
        try {
            const student = await api.request(`/users/${user.student_id}`);
            studentName = student.full_name;
            const studentNameEl = document.getElementById('student-name-header');
            if (studentNameEl) {
                studentNameEl.textContent = student.full_name;
            }
        } catch (e) {
            console.log('Erro ao buscar dados do aluno:', e);
        }

        // Buscar TODAS as mensagens (enviadas E recebidas)
        let allMessages = [];
        
        try {
            // Buscar mensagens que o responsável ENVIOU para o aluno (incentivo)
            const sentMessages = await api.getGuardianMessages(user.student_id);
            allMessages = [...sentMessages];
            console.log('📤 Mensagens enviadas:', sentMessages.length);
        } catch (e) {
            console.log('Erro ao buscar mensagens enviadas:', e);
        }

        try {
            // Buscar mensagens que o responsável RECEBEU do aluno (general)
            const receivedMessages = await api.getReceivedMessages('general');
            // Filtrar apenas mensagens do aluno
            const fromStudent = receivedMessages.filter(msg => msg.sender_id == user.student_id);
            allMessages = [...allMessages, ...fromStudent];
            console.log('📥 Mensagens recebidas:', fromStudent.length);
        } catch (e) {
            console.log('Erro ao buscar mensagens recebidas:', e);
        }

        if (!allMessages || allMessages.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        // Ordena mensagens por data DECRESCENTE (mais recentes primeiro)
        allMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Renderiza mensagens agrupadas
        container.innerHTML = allMessages.map((msg) => {
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

            // Determina se é mensagem enviada ou recebida
            const isSent = msg.sender_id === user.id;
            const borderColor = isSent ? 'border-purple-400' : 'border-blue-400';
            const gradientColor = isSent ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-cyan-500';
            const emoji = isSent ? '💜' : '👤';
            // Mostra o nome do aluno quando recebe, ou nome do responsável quando envia
            const label = isSent ? user.full_name : studentName;

            return `
                <div class="mensagem-card card bg-white border-l-4 ${borderColor} hover:shadow-lg transition-all group" data-message-id="${msg.id}">
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
                                    <h3 class="font-semibold text-gray-800">
                                        ${label}
                                    </h3>
                                    <p class="text-xs text-gray-500 mt-1">${formattedTime} • ${formattedDate}</p>
                                </div>
                            </div>

                            <!-- Conteúdo da mensagem -->
                            <p class="text-gray-700 leading-relaxed break-words text-sm">${escapeHtml(msg.message)}</p>

                            <!-- Status de leitura -->
                            <div class="mt-3 text-xs ${msg.is_read ? 'text-gray-500' : 'text-blue-600 font-semibold'}" data-status="read-status">
                                <i class="fas ${msg.is_read ? 'fa-check-double' : 'fa-clock'}"></i>
                                ${msg.is_read ? 'Lido' : 'Não lido'}
                            </div>

                            <!-- Ação -->
                            <div class="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                                ${!msg.is_read ? `
                                    <button class="mark-read-btn text-xs btn-subtle py-1 px-3" data-message-id="${msg.id}">
                                        <i class="fas fa-check mr-1"></i>Marcar como lido
                                    </button>
                                ` : ''}
                                <button class="reply-btn text-xs btn-primary py-1 px-3" data-student-id="${user.student_id}">
                                    <i class="fas fa-reply mr-1"></i>Responder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Event listeners para marcar como lido
        document.querySelectorAll('.mark-read-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const card = e.currentTarget.closest('.mensagem-card');
                const messageId = card?.getAttribute('data-message-id');
                
                if (!messageId) {
                    console.error('Message ID não encontrado');
                    return;
                }
                
                console.log('✏️ Marcando mensagem como lida:', messageId);

                try {
                    await api.markMessageAsRead(messageId);
                    console.log('✅ Mensagem marcada como lida com sucesso');
                    
                    const status = card.querySelector('[data-status="read-status"]');
                    if (status) {
                        status.innerHTML = `<i class="fas fa-check-double"></i> Lido`;
                        status.classList.remove('text-blue-600', 'font-semibold');
                        status.classList.add('text-gray-500');
                    }
                    
                    btn.remove();
                    
                    // Atualiza o badge de notificações
                    await updateNotificationBadges();
                    
                } catch (error) {
                    console.error('❌ Erro ao marcar como lido:', error);
                    showCustomAlert('Erro ao marcar como lido', 'error');
                }
            });
        });

        // Event listeners para responder (abrir chat)
        document.querySelectorAll('.reply-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const card = e.currentTarget.closest('.mensagem-card');
                const messageId = card?.getAttribute('data-message-id');
                const studentId = btn.getAttribute('data-student-id');
                
                if (!studentId) {
                    console.error('Student ID não encontrado');
                    return;
                }
                
                // Marca a mensagem como lida antes de abrir o chat
                if (messageId) {
                    try {
                        await api.markMessageAsRead(messageId);
                        console.log('✅ Mensagem marcada como lida ao abrir chat');
                        
                        // Atualiza o badge de notificações
                        await updateNotificationBadges();
                    } catch (error) {
                        console.log('Nota: Erro ao marcar como lido ao abrir chat:', error);
                        // Continua mesmo se falhar
                    }
                }
                
                console.log('💬 Navegando para chat com:', studentId);
                window.router.navigate(`/chat/${studentId}`);
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
