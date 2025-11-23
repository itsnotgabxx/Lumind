import { api } from '../api.js';
import { showCustomAlert } from '../utils/alert.js';

export default function HistoricoCompletoPage() {
    return `
        <div class="items-start pt-8 w-full">
            <div class="container mx-auto px-4 w-full max-w-7xl">
                <div class="flex flex-col text-center sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
                    <h1 class="screen-title sm:text-left order-2 sm:order-1 flex-grow"><i class="fas fa-book-reader mr-2 text-purple-500"></i>Histórico de Atividades</h1>
                    <button data-route="/progresso" class="btn-subtle text-sm order-1 sm:order-2 w-full sm:w-auto"><i class="fas fa-arrow-left mr-2"></i> Voltar</button>
                </div>
                <p class="screen-subtitle mb-8 text-center sm:text-left">Veja todas as atividades que você já explorou.</p>
                
                <!-- Filtros -->
                <div class="card mb-6 p-4">
                    <div class="flex flex-wrap gap-2">
                        <button class="filter-chip filter-chip-active" data-filter="all">
                            Todas <span class="badge-count ml-1">0</span>
                        </button>
                        <button class="filter-chip" data-filter="completed">
                            ✅ Concluídas <span class="badge-count ml-1">0</span>
                        </button>
                        <button class="filter-chip" data-filter="in_progress">
                            ⏳ Em Andamento <span class="badge-count ml-1">0</span>
                        </button>
                    </div>
                </div>

                <!-- Lista de Atividades -->
                <div class="card">
                    <div id="historico-lista" class="space-y-3">
                        <div class="flex justify-center py-12">
                            <div class="loading-spinner mr-3"></div>
                            <span class="text-gray-600">Carregando histórico...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function setup() {
    document.querySelector('[data-route="/progresso"]')?.addEventListener('click', () => {
        window.router.navigate('/progresso');
    });

    loadHistorico();
    setupFilters();
}

let allActivities = [];

async function loadHistorico() {
    try {
        const activities = await api.getUserActivities();
        allActivities = activities || [];
        
        renderHistorico(allActivities);
        updateFilterCounts(allActivities);
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        showCustomAlert('Erro ao carregar histórico', 'Erro', 'error');
        document.getElementById('historico-lista').innerHTML = `
            <div class="text-center py-8 text-red-600">
                <i class="fas fa-exclamation-triangle text-3xl mb-3"></i>
                <p>Erro ao carregar histórico</p>
            </div>
        `;
    }
}

function renderHistorico(activities) {
    const lista = document.getElementById('historico-lista');
    if (!lista) return;

    if (!activities || activities.length === 0) {
        lista.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <i class="fas fa-inbox text-4xl mb-3"></i>
                <p>Nenhuma atividade encontrada</p>
            </div>
        `;
        return;
    }

    lista.innerHTML = '';

    const statusIcons = {
        'completed': '<i class="fas fa-check-circle text-green-500 text-xl"></i>',
        'in_progress': '<i class="fas fa-spinner text-blue-500 text-xl"></i>',
        'not_started': '<i class="far fa-circle text-gray-400 text-xl"></i>'
    };

    const statusBadges = {
        'completed': '<span class="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">✅ Concluído</span>',
        'in_progress': '<span class="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">⏳ Em Andamento</span>',
        'not_started': '<span class="text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">⭕ Não Iniciado</span>'
    };

    const typeIcons = {
        'video': '<i class="fas fa-video text-purple-500"></i>',
        'text': '<i class="fas fa-book-open text-blue-500"></i>',
        'audio': '<i class="fas fa-headphones text-teal-500"></i>',
        'interactive_game': '<i class="fas fa-gamepad text-amber-500"></i>'
    };

    const typeLabels = {
        'video': 'Vídeo',
        'text': 'Leitura',
        'audio': 'Áudio',
        'interactive_game': 'Jogo'
    };

    activities.forEach(activity => {
        const content = activity.content;
        if (!content) return;

        const li = document.createElement('div');
        li.className = 'p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all';
        
        const progressColor = activity.progress_percentage < 30 ? 'text-red-600' : 
                             activity.progress_percentage < 70 ? 'text-yellow-600' : 
                             'text-green-600';

        li.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-start gap-3 flex-grow">
                    ${statusIcons[activity.status] || statusIcons.not_started}
                    <div class="flex-grow">
                        <h3 class="font-semibold text-gray-800">${content.title}</h3>
                        <div class="flex flex-wrap gap-2 mt-1">
                            <span class="text-xs text-gray-600">
                                ${typeIcons[content.type] || ''} ${typeLabels[content.type] || 'Conteúdo'}
                            </span>
                            ${content.difficulty ? `<span class="text-xs text-gray-600">📊 ${content.difficulty}</span>` : ''}
                        </div>
                    </div>
                </div>
                ${statusBadges[activity.status]}
            </div>

            <div class="ml-10 flex flex-wrap gap-4 items-center text-sm">
                ${activity.progress_percentage > 0 ? `
                    <div class="flex items-center gap-2">
                        <span class="text-gray-600">Progresso:</span>
                        <span class="font-semibold ${progressColor}">${activity.progress_percentage}%</span>
                    </div>
                ` : ''}
                
                ${activity.time_spent > 0 ? `
                    <div class="flex items-center gap-2">
                        <i class="far fa-clock text-gray-400"></i>
                        <span class="text-gray-600">${activity.time_spent} min</span>
                    </div>
                ` : ''}

                ${content.duration ? `
                    <span class="text-gray-600">| ${content.duration}</span>
                ` : ''}
            </div>

            ${activity.progress_percentage > 0 && activity.status === 'in_progress' ? `
                <div class="ml-10 mt-3">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full transition-all" style="width: ${activity.progress_percentage}%"></div>
                    </div>
                </div>
            ` : ''}
        `;

        lista.appendChild(li);
    });
}

function setupFilters() {
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => {
                c.classList.remove('filter-chip-active');
            });
            
            chip.classList.add('filter-chip-active');

            const filter = chip.dataset.filter;
            if (filter === 'all') {
                renderHistorico(allActivities);
            } else {
                const filtered = allActivities.filter(a => a.status === filter);
                renderHistorico(filtered);
            }
        });
    });
}

function updateFilterCounts(activities) {
    const counts = {
        all: activities.length,
        completed: activities.filter(a => a.status === 'completed').length,
        in_progress: activities.filter(a => a.status === 'in_progress').length
    };

    document.querySelectorAll('.filter-chip').forEach(chip => {
        const filter = chip.dataset.filter;
        if (counts[filter] !== undefined) {
            const badge = chip.querySelector('.badge-count');
            if (badge) {
                badge.textContent = counts[filter];
            }
        }
    });
}