import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

export default function RecomendacaoPage() {
    return `
        <div class="w-full max-w-7xl mx-auto px-4 py-8">
            <!-- Header com boas-vindas -->
            <div class="bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 rounded-2xl p-6 mb-8 border-2 border-purple-100">
                <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div>
                        <h1 id="recomendacao-header" class="text-3xl font-bold text-gray-800 mb-2">
                            Olá! 👋
                        </h1>
                        <p class="text-gray-600">
                            Continue de onde parou ou explore novos conteúdos personalizados
                        </p>
                    </div>
                    
                    <div class="flex flex-wrap gap-3">
                        <button data-route="/perfil" class="btn-subtle">
                            <i class="fas fa-user-circle mr-2"></i>Meu Perfil
                        </button>
                        <button data-route="/progresso" class="btn-subtle border-green-300 text-green-700 hover:bg-green-50">
                            <i class="fas fa-chart-line mr-2"></i>Progresso
                        </button>
                        <button data-route="/acompanhamento" class="btn-subtle border-teal-300 text-teal-700 hover:bg-teal-50">
                            <i class="fas fa-user-shield mr-2"></i>Responsável
                        </button>
                    </div>
                </div>
            </div>

            <!-- Estatísticas Rápidas -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div class="card bg-purple-50 border-2 border-purple-200 hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-3xl font-bold text-purple-600" id="stat-em-andamento">-</div>
                            <div class="text-sm text-gray-600 mt-1">Em andamento</div>
                        </div>
                        <i class="fas fa-spinner text-4xl text-purple-300"></i>
                    </div>
                </div>
                
                <div class="card bg-green-50 border-2 border-green-200 hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-3xl font-bold text-green-600" id="stat-concluidos">-</div>
                            <div class="text-sm text-gray-600 mt-1">Concluídos</div>
                        </div>
                        <i class="fas fa-check-circle text-4xl text-green-300"></i>
                    </div>
                </div>
                
                <div class="card bg-blue-50 border-2 border-blue-200 hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-3xl font-bold text-blue-600" id="stat-tempo">-</div>
                            <div class="text-sm text-gray-600 mt-1">Horas de estudo</div>
                        </div>
                        <i class="fas fa-clock text-4xl text-blue-300"></i>
                    </div>
                </div>
                
                <div class="card bg-amber-50 border-2 border-amber-200 hover:shadow-lg transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-3xl font-bold text-amber-600" id="stat-sequencia">-</div>
                            <div class="text-sm text-gray-600 mt-1">Dias seguidos</div>
                        </div>
                        <i class="fas fa-fire text-4xl text-amber-300"></i>
                    </div>
                </div>
            </div>

            <!-- Continue de onde parou -->
            <div class="mb-10" id="continue-section" style="display: none;">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-semibold text-gray-800 flex items-center">
                        <i class="fas fa-play-circle mr-3 text-blue-500"></i>
                        Continue de onde parou
                    </h2>
                </div>
                <div id="continue-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Cards serão inseridos aqui -->
                </div>
            </div>

            <!-- Filtros por categoria -->
            <div class="mb-6">
                <h2 class="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                    <i class="fas fa-filter mr-3 text-teal-500"></i>
                    Explorar por categoria
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <button class="card text-center hover:shadow-lg transition-all category-filter border-2 border-transparent hover:border-purple-300" data-category="all">
                        <i class="fas fa-th text-4xl text-gray-600 mb-3"></i>
                        <p class="font-semibold text-gray-800">Todos</p>
                        <p class="text-xs text-gray-500 mt-1">Ver tudo</p>
                    </button>
                    
                    <button class="card text-center hover:shadow-lg transition-all category-filter border-2 border-transparent hover:border-purple-300" data-category="video">
                        <i class="fas fa-video text-4xl text-purple-500 mb-3"></i>
                        <p class="font-semibold text-gray-800">Vídeos</p>
                        <p class="text-xs text-gray-500 mt-1">Visual</p>
                    </button>
                    
                    <button class="card text-center hover:shadow-lg transition-all category-filter border-2 border-transparent hover:border-purple-300" data-category="text">
                        <i class="fas fa-book-open text-4xl text-blue-500 mb-3"></i>
                        <p class="font-semibold text-gray-800">Leitura</p>
                        <p class="text-xs text-gray-500 mt-1">Textual</p>
                    </button>
                    
                    <button class="card text-center hover:shadow-lg transition-all category-filter border-2 border-transparent hover:border-purple-300" data-category="audio">
                        <i class="fas fa-headphones text-4xl text-teal-500 mb-3"></i>
                        <p class="font-semibold text-gray-800">Áudio</p>
                        <p class="text-xs text-gray-500 mt-1">Podcasts</p>
                    </button>
                    
                    <button class="card text-center hover:shadow-lg transition-all category-filter border-2 border-transparent hover:border-purple-300" data-category="interactive_game">
                        <i class="fas fa-gamepad text-4xl text-amber-500 mb-3"></i>
                        <p class="font-semibold text-gray-800">Jogos</p>
                        <p class="text-xs text-gray-500 mt-1">Interativo</p>
                    </button>
                </div>
            </div>

            <!-- Recomendações Personalizadas -->
            <div class="mb-10">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 class="text-2xl font-semibold text-gray-800 flex items-center">
                        <i class="fas fa-star mr-3 text-amber-400"></i>
                        Recomendado para você
                    </h2>
                    <button id="btn-refresh-recomendacoes" class="btn-subtle text-sm">
                        <i class="fas fa-sync-alt mr-2"></i>Atualizar recomendações
                    </button>
                </div>
                
                <div id="recomendacao-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <!-- Loading state -->
                    <div class="col-span-full">
                        <div class="flex flex-col items-center justify-center py-16">
                            <div class="loading-spinner mb-4"></div>
                            <p class="text-gray-600">Carregando suas recomendações...</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dica do Dia -->
            <div class="card bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50 border-2 border-teal-200">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-lightbulb text-2xl text-white"></i>
                    </div>
                    <div class="flex-grow">
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">
                            💡 Dica do Dia
                        </h3>
                        <p class="text-gray-700 leading-relaxed">
                            Estude um pouco todos os dias! Mesmo que sejam apenas 15 minutos, 
                            a constância é mais importante que a quantidade. Seu cérebro aprende melhor 
                            com repetição espaçada do que com sessões longas e esporádicas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Função para criar card de conteúdo
function createContentCard(item) {
    const card = document.createElement('div');
    card.className = 'card hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer';

    const typeColors = {
        'video': 'bg-purple-100 text-purple-700 border-purple-200',
        'text': 'bg-blue-100 text-blue-700 border-blue-200',
        'audio': 'bg-teal-100 text-teal-700 border-teal-200',
        'interactive_game': 'bg-amber-100 text-amber-700 border-amber-200'
    };

    const typeIcons = {
        'video': '<i class="fas fa-video mr-1"></i> Vídeo',
        'text': '<i class="fas fa-book-open mr-1"></i> Leitura',
        'audio': '<i class="fas fa-headphones mr-1"></i> Áudio',
        'interactive_game': '<i class="fas fa-gamepad mr-1"></i> Jogo'
    };

    const placeholderImage = `https://placehold.co/400x250/${Math.random() > 0.5 ? 'A78BFA' : '60A5FA'}/FFFFFF?text=${item.title.substring(0,1)}`;

    card.innerHTML = `
        <div class="relative overflow-hidden rounded-lg mb-4">
            <img src="${item.image_url || placeholderImage}" 
                 alt="${item.title}" 
                 class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                 onerror="this.src='${placeholderImage}'">
            <div class="absolute top-2 right-2">
                <span class="px-3 py-1 rounded-full text-xs font-semibold border-2 ${typeColors[item.type] || typeColors.video} backdrop-blur-sm">
                    ${typeIcons[item.type] || typeIcons.video}
                </span>
            </div>
            ${item.is_new ? `
                <div class="absolute top-2 left-2">
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white border-2 border-white">
                        <i class="fas fa-sparkles mr-1"></i>NOVO
                    </span>
                </div>
            ` : ''}
        </div>

        <h3 class="text-lg font-semibold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2">
            ${item.title}
        </h3>

        <p class="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
            ${item.description || 'Explore este conteúdo incrível e aprenda de forma divertida!'}
        </p>

        <div class="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
            <span><i class="far fa-clock mr-1"></i>~15 min</span>
            <span><i class="fas fa-signal mr-1"></i>Básico</span>
            ${item.views ? `<span><i class="fas fa-eye mr-1"></i>${item.views}</span>` : ''}
        </div>

        <button class="w-full btn-primary text-sm btn-explorar-conteudo group-hover:shadow-lg transition-shadow"
                data-content-id="${item.id}"
                data-content-title="${item.title}">
            <i class="fas fa-play-circle mr-2"></i>Começar Agora
        </button>
    `;

    return card;
}

// Renderizar recomendações
function renderRecommendations(recommendations, container = 'recomendacao-grid') {
    const grid = document.getElementById(container);
    if (!grid || !Array.isArray(recommendations)) return;

    grid.innerHTML = '';

    if (recommendations.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full">
                <div class="card text-center py-16">
                    <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
                    <p class="text-gray-600 text-lg font-semibold mb-2">Nenhum conteúdo encontrado</p>
                    <p class="text-gray-500 text-sm">Ajuste seus filtros ou explore outras categorias</p>
                </div>
            </div>
        `;
        return;
    }

    recommendations.forEach(item => {
        const card = createContentCard(item);
        grid.appendChild(card);
    });
}

// Carregar estatísticas
async function loadStatistics() {
    try {
        const progress = await api.getUserProgress();
        const activities = await api.getUserActivities();

        document.getElementById('stat-concluidos').textContent = progress.completed_activities || 0;
        document.getElementById('stat-em-andamento').textContent = 
            activities.filter(a => a.status === 'in_progress').length || 0;
        document.getElementById('stat-tempo').textContent = 
            Math.floor((progress.total_time_spent || 0) / 60);
        document.getElementById('stat-sequencia').textContent = progress.streak_days || 0;

        // Continue de onde parou
        const inProgress = activities.filter(a => a.status === 'in_progress');
        if (inProgress.length > 0) {
            document.getElementById('continue-section').style.display = 'block';
            renderRecommendations(inProgress.map(a => a.content), 'continue-grid');
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

export function setup() {
    const user = userState.user;
    if (!user) {
        window.router.navigate('/login');
        return;
    }

    // Atualiza header
    const header = document.getElementById('recomendacao-header');
    if (header) {
        const firstName = user.full_name.split(' ')[0];
        header.innerHTML = `Olá, ${firstName}! 👋`;
    }

    // Carrega estatísticas
    loadStatistics();

    // Navigation buttons
    document.querySelectorAll('[data-route]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            window.router.navigate(el.dataset.route);
        });
    });

    // Carrega recomendações
    let allRecommendations = [];
    let currentFilter = 'all';
    
    const loadRecommendations = async (filter = 'all') => {
        currentFilter = filter;
        const grid = document.getElementById('recomendacao-grid');
        
        try {
            if (allRecommendations.length === 0) {
                grid.innerHTML = `
                    <div class="col-span-full flex flex-col items-center justify-center py-16">
                        <div class="loading-spinner mb-4"></div>
                        <p class="text-gray-600">Carregando conteúdos...</p>
                    </div>
                `;
                
                allRecommendations = await api.getRecommendations(20);
            }

            const filtered = filter === 'all' 
                ? allRecommendations 
                : allRecommendations.filter(item => item.type === filter);

            renderRecommendations(filtered);
        } catch (error) {
            console.error('Erro ao carregar recomendações:', error);
            showCustomAlert('Erro ao carregar recomendações', 'Erro', 'error');
            grid.innerHTML = `
                <div class="col-span-full">
                    <div class="card text-center py-16">
                        <i class="fas fa-exclamation-triangle text-6xl text-red-300 mb-4"></i>
                        <p class="text-red-600 text-lg font-semibold mb-4">Erro ao carregar conteúdo</p>
                        <button onclick="window.location.reload()" class="btn-primary">
                            <i class="fas fa-redo mr-2"></i>Tentar novamente
                        </button>
                    </div>
                </div>
            `;
        }
    };

    loadRecommendations();

    // Filtro de categorias
    document.querySelectorAll('.category-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active de todos
            document.querySelectorAll('.category-filter').forEach(b => {
                b.classList.remove('ring-2', 'ring-purple-500', 'bg-purple-50', 'border-purple-500');
            });
            
            // Adiciona active no clicado
            btn.classList.add('ring-2', 'ring-purple-500', 'bg-purple-50', 'border-purple-500');
            
            loadRecommendations(btn.dataset.category);
        });
    });

    // Botão refresh
    document.getElementById('btn-refresh-recomendacoes')?.addEventListener('click', async () => {
        allRecommendations = [];
        await loadRecommendations(currentFilter);
        showCustomAlert('Recomendações atualizadas!', 'Sucesso', 'success');
    });

    // Listener para botões "Explorar"
    const setupCardListeners = (containerId) => {
        document.getElementById(containerId)?.addEventListener('click', (ev) => {
            const btn = ev.target.closest('.btn-explorar-conteudo');
            if (!btn) return;

            window.router.navigate(`/conteudo/${btn.dataset.contentId}`, {
                contentId: btn.dataset.contentId,
                contentTitle: btn.dataset.contentTitle
            });
        });
    };

    setupCardListeners('recomendacao-grid');
    setupCardListeners('continue-grid');
}