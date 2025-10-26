import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

// --- Funções de Renderização (movidas do script.js) ---

function renderUserProgress(progress) {
    if (!progress) return;
    const pEl = document.getElementById('progresso-percentual');
    const barEl = document.getElementById('progresso-barra');
    if(pEl) pEl.textContent = `${progress.progress_percentage}%`;
    if(barEl) barEl.style.width = `${progress.progress_percentage}%`;

    const achievementsContainer = document.getElementById('conquistas-container');
    const achievementsText = document.getElementById('conquistas-texto');
    if (achievementsContainer && achievementsText && progress.achievements) {
        achievementsContainer.innerHTML = '';
        const emojiMap = {'Explorador Curioso': '🌍', 'Mestre dos Vídeos': '🎬', 'Leitor Voraz': '📚'};
        
        progress.achievements.forEach(ach => {
            achievementsContainer.innerHTML += `<span class="text-3xl transform hover:scale-125 transition-transform text-amber-500" title="${ach}">${emojiMap[ach] || '🏆'}</span>`;
        });
        
        const totalAchievements = 10;
        for (let i = progress.achievements.length; i < totalAchievements; i++) {
            achievementsContainer.innerHTML += `<span class="text-3xl text-gray-300" title="Ainda não desbloqueado">❓</span>`;
        }
        achievementsText.textContent = `${progress.achievements.length} de ${totalAchievements} conquistas!`;
    }
}

function renderUserActivities(activities) {
    if (!activities || !Array.isArray(activities)) return;
    const list = document.getElementById('atividades-recentes-lista');
    if (!list) return;
    list.innerHTML = '';
    
    activities.forEach(activity => {
        let statusText = '';
        let statusIcon = '';
        switch (activity.status) {
            case 'completed':
                statusText = 'Concluído';
                statusIcon = '<span class="text-green-500 font-semibold"><i class="fas fa-check-circle mr-1"></i></span>';
                break;
            case 'in_progress':
                statusText = `Em andamento - ${activity.progress_percentage}%`;
                statusIcon = '<span class="text-blue-500 font-semibold"><i class="fas fa-spinner fa-spin mr-1"></i></span>';
                break;
            default:
                statusText = 'Não iniciado';
                statusIcon = '<span class="text-gray-400 font-semibold"><i class="far fa-circle mr-1"></i></span>';
        }

        list.innerHTML += `
            <li class="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                <div>
                    <p class="font-medium text-gray-700">${activity.content?.title || 'Atividade'}</p>
                    <p class="text-sm text-gray-500">${statusText}</p>
                </div>
                ${statusIcon}
            </li>
        `;
    });
}

// --- Componente da Página ---

export default function ProgressoUsuarioPage() {
    // Este HTML é baseado no seu index.html original
    return `
        <div class="items-start pt-8 w-full">
            <div class="container mx-auto px-4 w-full">
                <div class="flex flex-col text-center sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
                    <h1 id="progresso-header" class="screen-title sm:text-left order-2 sm:order-1 flex-grow">Seu Progresso!</h1>
                    <button data-route="/recomendacao" class="btn-subtle text-sm order-1 sm:order-2 w-full sm:w-auto"><i class="fas fa-arrow-left mr-2"></i> Voltar</button>
                </div>
                <p class="screen-subtitle mb-8 text-center sm:text-left">Veja o quanto você já aprendeu.</p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div class="card">
                        <h2 class="text-lg font-semibold mb-3"><i class="fas fa-flag-checkered mr-2 text-green-500"></i>Resumo Geral</h2>
                        <p id="progresso-percentual" class="text-3xl font-bold text-green-600">0%</p>
                        <p class="text-gray-600">do seu plano concluído!</p>
                        <div class="w-full bg-gray-200 rounded-full h-3 mt-4">
                            <div id="progresso-barra" class="progress-bar-fill h-3 rounded-full" style="width: 0%"></div>
                        </div>
                    </div>
                    <div class="card">
                        <h2 class="text-lg font-semibold mb-3"><i class="fas fa-trophy mr-2 text-amber-400"></i>Conquistas</h2>
                        <div id="conquistas-container" class="flex flex-wrap gap-4 mt-4">
                            <span class="text-3xl text-gray-300">...</span>
                        </div>
                        <p id="conquistas-texto" class="text-sm text-gray-500 mt-3">Carregando...</p>
                    </div>
                </div>

                <div class="card mb-8">
                    <h2 class="text-lg font-semibold mb-4"><i class="fas fa-history mr-2 text-blue-500"></i>Atividades Recentes</h2>
                    <ul id="atividades-recentes-lista" class="space-y-3">
                        <p class="text-gray-500">Carregando atividades...</p>
                    </ul>
                </div>
                <div class="text-right">
                    <button data-route="/historico" class="btn-subtle"><i class="fas fa-list-alt mr-2"></i>Ver Histórico Completo</button>
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

    // Atualiza cabeçalho
    const header = document.getElementById('progresso-header');
    if (header) {
        header.innerHTML = `Seu Progresso, ${user.full_name}!`;
    }

    // Adiciona listeners de navegação
    document.querySelectorAll('[data-route]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            window.router.navigate(element.dataset.route);
        });
    });

    // Carrega dados de progresso
    const loadProgress = async () => {
        try {
            const progress = await api.getUserProgress();
            renderUserProgress(progress);
            
            const activities = await api.getUserActivities();
            renderUserActivities(activities);
        } catch (error) {
            showCustomAlert('Erro ao carregar seu progresso.', 'Erro', 'error');
        }
    };
    
    loadProgress();
}