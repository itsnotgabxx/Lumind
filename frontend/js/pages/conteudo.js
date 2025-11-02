import { api } from '../api.js';
import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';
import GamePlayer from './content/GamePlayer.js';

export default async function ConteudoPage({ params }) {
    const contentId = params.id;
    let content;
    let userProgress;

    try {
        content = await api.getContentById(contentId);
        
        try {
            const activities = await api.getUserActivities();
            userProgress = activities.find(a => a.content_id === parseInt(contentId));
        } catch (e) {
            console.log('Progresso não encontrado, iniciando novo');
        }
    } catch (error) {
        showCustomAlert('Erro ao carregar conteúdo', 'Erro', 'error');
        window.router.navigate('/recomendacao');
        return '<p>Erro ao carregar...</p>';
    }

    const isCompleted = userProgress?.status === 'completed';

    return `
        <div class="w-full min-h-screen mx-auto px-4 py-6 sm:py-8">
            <nav class="mb-6 flex items-center gap-2 text-sm text-gray-600 max-w-7xl mx-auto">
                <button data-route="/recomendacao" class="hover:text-purple-600 transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Voltar
                </button>
            </nav>

            <div class="mb-6 max-w-7xl mx-auto">
                <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                    ${content.title}
                </h1>
                ${content.description ? `
                    <p class="text-gray-600 text-lg">
                        ${content.description}
                    </p>
                ` : ''}
            </div>

            <div class="space-y-6 max-w-7xl mx-auto">
                <div id="conteudo-wrapper" class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div class="flex items-center justify-center py-12">
                        <div class="loading-spinner"></div>
                        <span class="ml-3 text-gray-600">Carregando conteúdo...</span>
                    </div>
                </div>

                ${!isCompleted ? `
                    <div class="flex justify-center py-8">
                        <button 
                            id="btn-marcar-concluido" 
                            class="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-12 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 text-lg flex items-center gap-3"
                        >
                            <i class="fas fa-check-circle text-2xl"></i>
                            Marcar como Concluído
                        </button>
                    </div>
                ` : `
                    <div class="flex flex-col items-center py-8 gap-4">
                        <div class="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl px-8 py-4 text-center shadow-lg">
                            <i class="fas fa-check-circle text-4xl mb-2"></i>
                            <div class="font-bold text-xl">Concluído!</div>
                            <div class="text-sm opacity-90 mt-1">Parabéns pelo progresso! 🎉</div>
                        </div>
                        <button 
                            id="btn-proximo-conteudo"
                            class="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                            Próximo Conteúdo
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                `}
            </div>
        </div>
    `;
}

function getTypeIcon(type) {
    const icons = {
        'video': '<i class="fas fa-video"></i>',
        'text': '<i class="fas fa-book-open"></i>',
        'audio': '<i class="fas fa-headphones"></i>',
        'interactive_game': '<i class="fas fa-gamepad"></i>'
    };
    return icons[type] || '<i class="fas fa-puzzle-piece"></i>';
}

function getTypeGradient(type) {
    const gradients = {
        'video': 'bg-gradient-to-br from-purple-500 to-purple-600',
        'text': 'bg-gradient-to-br from-blue-500 to-blue-600',
        'audio': 'bg-gradient-to-br from-teal-500 to-teal-600',
        'interactive_game': 'bg-gradient-to-br from-amber-500 to-amber-600'
    };
    return gradients[type] || 'bg-gradient-to-br from-gray-500 to-gray-600';
}

function getTypeLabel(type) {
    const labels = {
        'video': 'Vídeo',
        'text': 'Leitura',
        'audio': 'Áudio',
        'interactive_game': 'Jogo'
    };
    return labels[type] || 'Conteúdo';
}

async function renderContent(content) {
    try {
        switch(content.type) {
            case 'video':
                return await import('./content/VideoPlayer.js')
                    .then(module => module.default(content));
            case 'text':
                return await import('./content/TextContent.js')
                    .then(module => module.default(content));
            case 'interactive_game':
                return GamePlayer(content);
            case 'audio':
                return await import('./content/AudioPlayer.js')
                    .then(module => module.default(content))
                    .catch(() => '<p class="text-center text-gray-600 py-8">Player de áudio em desenvolvimento</p>');
            default:
                return '<p class="text-center text-gray-600 py-8">Tipo de conteúdo não suportado</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar módulo de conteúdo:', error);
        return '<p class="text-center text-red-600 py-8">Erro ao carregar conteúdo. Tente novamente.</p>';
    }
}

export async function setup({ params }) {
    const contentId = params.id;
    const user = userState.user;

    if (!user) {
        window.router.navigate('/login');
        return;
    }

    // Adiciona estilos CSS para vídeos e iframes
    const style = document.createElement('style');
    style.textContent = `
        #conteudo-wrapper iframe,
        #conteudo-wrapper video {
            width: 100% !important;
            min-height: 500px !important;
            aspect-ratio: 16/9;
        }
        #conteudo-wrapper .video-container,
        #conteudo-wrapper .iframe-container {
            width: 100%;
            aspect-ratio: 16/9;
        }
        /* Ocultar títulos e descrições duplicados dentro do conteúdo */
        #conteudo-wrapper h1,
        #conteudo-wrapper h2,
        #conteudo-wrapper h3,
        #conteudo-wrapper p:not(.text-center):not(.text-red-600) {
            display: none !important;
        }
        /* Garantir que apenas o vídeo seja exibido */
        #conteudo-wrapper > div > *:not(iframe):not(video):not(.video-container):not(.iframe-container) {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    try {
        const content = await api.getContentById(contentId);
        const contentHtml = await renderContent(content);
        
        const wrapper = document.getElementById('conteudo-wrapper');
        if (wrapper) {
            wrapper.innerHTML = contentHtml;
        }
    } catch (error) {
        console.error('Erro ao carregar conteúdo:', error);
    }

    try {
        await api.updateProgress(contentId, 'in_progress', 0, Date.now());
    } catch (e) {
        console.log('Erro ao registrar início:', e);
    }

    document.querySelectorAll('[data-route]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            window.router.navigate(el.dataset.route);
        });
    });

    const btnConcluido = document.getElementById('btn-marcar-concluido');
    if (btnConcluido && !btnConcluido.disabled) {
        btnConcluido.addEventListener('click', async () => {
            const originalText = btnConcluido.innerHTML;
            
            try {
                btnConcluido.disabled = true;
                btnConcluido.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Salvando...';
                
                await api.updateProgress(contentId, 'completed', 100, 0);
                
                showCustomAlert(
                    'Parabéns! Continue assim e você vai longe! 🎉',
                    'Conteúdo Concluído!',
                    'success'
                );
                
                setTimeout(() => {
                    window.router.navigate('/progresso');
                }, 2000);
                
            } catch (error) {
                console.error('Erro ao marcar como concluído:', error);
                showCustomAlert('Erro ao salvar progresso. Tente novamente.', 'Erro', 'error');
                
                btnConcluido.disabled = false;
                btnConcluido.innerHTML = originalText;
            }
        });
    }

    document.getElementById('btn-proximo-conteudo')?.addEventListener('click', async () => {
        try {
            const recommendations = await api.getRecommendations(10);
            
            if (recommendations && recommendations.length > 0) {
                const incomplete = recommendations.filter(r => r.id !== parseInt(contentId));
                
                if (incomplete.length > 0) {
                    const random = incomplete[Math.floor(Math.random() * incomplete.length)];
                    window.router.navigate(`/conteudo/${random.id}`);
                } else {
                    window.router.navigate('/recomendacao');
                }
            } else {
                window.router.navigate('/recomendacao');
            }
        } catch (error) {
            console.error('Erro ao buscar próximo conteúdo:', error);
            window.router.navigate('/recomendacao');
        }
    });

    const autoSaveInterval = setInterval(async () => {
        try {
            const currentProgress = Math.min(100, Math.floor((Date.now() % 100000) / 1000));
            await api.updateProgress(contentId, 'in_progress', currentProgress, Date.now());
        } catch (e) {
            console.log('Erro no auto-save:', e);
        }
    }, 30000);

    window.addEventListener('beforeunload', () => {
        clearInterval(autoSaveInterval);
    });
}