import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

export default function CompanheirosPage() {
    return `
        <div class="w-full min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
            <div class="container mx-auto px-4 max-w-4xl">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <div>
                        <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-3">
                            <i class="fas fa-users text-purple-500 text-3xl"></i>
                            Você não está sozinho!
                        </h1>
                        <p class="text-gray-600 mt-2">Conecte-se com outros estudantes aprendendo os mesmos conteúdos</p>
                    </div>
                    <button data-route="/recomendacao" class="btn-subtle whitespace-nowrap">
                        <i class="fas fa-arrow-left mr-2"></i>Voltar
                    </button>
                </div>

                <!-- Container de Companheiros -->
                <div id="peers-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="text-center py-12 col-span-full">
                        <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
                        <p class="text-gray-600">Buscando companheiros...</p>
                    </div>
                </div>

                <!-- Estado Vazio -->
                <div id="empty-state" class="hidden text-center py-12">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                        <i class="fas fa-user-friends text-3xl text-purple-500"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Nenhum companheiro ainda</h3>
                    <p class="text-gray-600 max-w-md mx-auto">
                        Continue explorando conteúdos e você encontrará outros estudantes aprendendo junto com você! 📚
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

    // Apenas estudantes
    if (user.user_type !== 'student') {
        window.router.navigate('/recomendacao');
        return;
    }

    document.querySelector('[data-route="/recomendacao"]').addEventListener('click', () => {
        window.router.navigate('/recomendacao');
    });

    await loadPeers();
}

async function loadPeers() {
    try {
        const user = userState.user;
        const container = document.getElementById('peers-container');
        const emptyState = document.getElementById('empty-state');

        // Buscar todos os conteúdos em progresso ou concluídos do usuário
        const activities = await api.getUserActivities();
        const activeContents = activities
            .filter(a => a.status === 'in_progress' || a.status === 'completed')
            .map(a => a.content_id);

        if (activeContents.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        // Buscar peers de cada conteúdo
        const allPeers = new Map(); // Usar Map para evitar duplicatas

        for (const contentId of activeContents) {
            try {
                const peersData = await api.getContentPeers(contentId);
                if (peersData.peers) {
                    peersData.peers.forEach(peer => {
                        if (!allPeers.has(peer.id)) {
                            allPeers.set(peer.id, {
                                ...peer,
                                contentId: contentId
                            });
                        }
                    });
                }
            } catch (e) {
                console.log(`Erro ao buscar peers do conteúdo ${contentId}:`, e);
            }
        }

        const peers = Array.from(allPeers.values());

        if (peers.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        const statusEmoji = {
            'completed': { emoji: '✅', label: 'Concluiu', color: 'green' },
            'in_progress': { emoji: '⏳', label: 'Estudando', color: 'blue' },
            'not_started': { emoji: '⭕', label: 'Iniciando', color: 'gray' }
        };

        container.innerHTML = peers.map(peer => {
            const status = statusEmoji[peer.status] || statusEmoji['not_started'];
            const progressColor = peer.progress >= 75 ? 'bg-green-500' : 
                                peer.progress >= 50 ? 'bg-yellow-500' : 
                                peer.progress >= 25 ? 'bg-orange-500' : 'bg-gray-300';

            return `
                <div class="card bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 hover:shadow-xl transition-all">
                    <!-- Avatar e Nome -->
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            ${peer.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-gray-800 truncate">${peer.name}</h3>
                            <p class="text-xs text-gray-600 flex items-center gap-1">
                                <span>${status.emoji}</span>
                                <span>${status.label}</span>
                            </p>
                        </div>
                    </div>

                    <!-- Barra de Progresso -->
                    <div class="mb-4">
                        <div class="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progresso</span>
                            <span class="font-bold">${peer.progress}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div class="${progressColor} h-full transition-all duration-300" style="width: ${peer.progress}%"></div>
                        </div>
                    </div>

                    <!-- Botão de Chat -->
                    <button class="peer-chat-btn w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all hover:shadow-lg flex items-center justify-center gap-2" data-peer-id="${peer.id}">
                        <i class="fas fa-comment-dots"></i>
                        <span>Iniciar Conversa</span>
                    </button>
                </div>
            `;
        }).join('');

        // Event listeners para botões
        document.querySelectorAll('.peer-chat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const peerId = btn.getAttribute('data-peer-id');
                window.router.navigate(`/chat/${peerId}`);
            });
        });

    } catch (error) {
        console.error('Erro ao carregar companheiros:', error);
        const container = document.getElementById('peers-container');
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
                <p class="text-red-600">Erro ao carregar companheiros</p>
                <button class="mt-3 btn-subtle text-sm" onclick="location.reload()">
                    <i class="fas fa-redo mr-1"></i>Tentar Novamente
                </button>
            </div>
        `;
    }
}
