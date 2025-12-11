import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';
import { api } from '../api.js';

export default function RecomendacaoPage() {
    return `
        <div class="w-full max-w-[1400px] mx-auto px-4 py-6 sm:py-8">
            <!-- Header com Boas-vindas -->
            <div class="bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 rounded-2xl p-6 mb-8 border-2 border-purple-100 shadow-sm">
                <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div class="flex-grow">
                        <h1 id="recomendacao-header" class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <span>Olá! 👋</span>
                        </h1>
                        <p class="text-gray-600 text-sm sm:text-base">
                            Continue de onde parou ou explore novos conteúdos personalizados para você
                        </p>
                    </div>
                </div>
            </div>

            <!-- Estatísticas Rápidas -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                <div class="card bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:shadow-xl transition-all p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-2xl sm:text-3xl font-bold text-purple-600" id="stat-em-andamento">-</div>
                            <div class="text-xs sm:text-sm text-gray-600 mt-1">Em andamento</div>
                        </div>
                        <i class="fas fa-spinner text-3xl sm:text-4xl text-purple-300"></i>
                    </div>
                </div>
                
                <div class="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:shadow-xl transition-all p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-2xl sm:text-3xl font-bold text-green-600" id="stat-concluidos">-</div>
                            <div class="text-xs sm:text-sm text-gray-600 mt-1">Concluídos</div>
                        </div>
                        <i class="fas fa-check-circle text-3xl sm:text-4xl text-green-300"></i>
                    </div>
                </div>
                
                <div class="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-xl transition-all p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-2xl sm:text-3xl font-bold text-blue-600" id="stat-tempo">-h</div>
                            <div class="text-xs sm:text-sm text-gray-600 mt-1">Tempo de estudo</div>
                        </div>
                        <i class="fas fa-clock text-3xl sm:text-4xl text-blue-300"></i>
                    </div>
                </div>
                
                <div class="card bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 hover:shadow-xl transition-all p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-2xl sm:text-3xl font-bold text-amber-600" id="stat-sequencia">-</div>
                            <div class="text-xs sm:text-sm text-gray-600 mt-1">Dias seguidos</div>
                        </div>
                        <i class="fas fa-fire text-3xl sm:text-4xl text-amber-300"></i>
                    </div>
                </div>
            </div>

            <!-- Busca -->
            <div class="mb-6">
                <div class="relative">
                    <input 
                        type="text" 
                        id="search-content" 
                        placeholder="Buscar conteúdos... (Ex: Matemática, Xadrez, Espaço)"
                        class="w-full px-4 py-3 pl-12 pr-12 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors text-sm sm:text-base"
                    >
                    <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <button id="clear-search" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 hidden transition-colors">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <!-- Continue de onde parou -->
            <div class="mb-8" id="continue-section" style="display: none;">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                        <i class="fas fa-play-circle text-blue-500"></i>
                        <span>Continue de onde parou</span>
                    </h2>
                </div>
                <div id="continue-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    <!-- Cards serão inseridos aqui -->
                </div>
            </div>

            <!-- Filtros Rápidos -->
            <div class="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <span class="text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap">Filtrar:</span>
                <button class="filter-chip filter-chip-active" data-filter="all">
                    <i class="fas fa-th"></i>
                    <span>Todos</span>
                    <span class="badge-count">0</span>
                </button>
                <button class="filter-chip" data-filter="video">
                    <i class="fas fa-video"></i>
                    <span>Vídeos</span>
                    <span class="badge-count">0</span>
                </button>
                <button class="filter-chip" data-filter="text">
                    <i class="fas fa-book-open"></i>
                    <span>Leitura</span>
                    <span class="badge-count">0</span>
                </button>
                <button class="filter-chip" data-filter="audio">
                    <i class="fas fa-headphones"></i>
                    <span>Áudio</span>
                    <span class="badge-count">0</span>
                </button>
                <button class="filter-chip" data-filter="interactive_game">
                    <i class="fas fa-gamepad"></i>
                    <span>Jogos</span>
                    <span class="badge-count">0</span>
                </button>
            </div>

            <!-- Contador de Resultados e Ordenação -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div class="flex items-center gap-3">
                    <h2 class="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                        <i class="fas fa-star text-amber-400"></i>
                        <span>Recomendado para você</span>
                    </h2>
                    <span id="result-count" class="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        <strong>0</strong> conteúdos
                    </span>
                </div>
                
                <div class="flex items-center gap-2 w-full sm:w-auto">
                    <select id="sort-select" class="px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-400 text-sm flex-grow sm:flex-grow-0">
                        <option value="recommended">Recomendados</option>
                        <option value="newest">Mais Recentes</option>
                        <option value="popular">Mais Populares</option>
                        <option value="alphabetical">A-Z</option>
                    </select>
                    <button id="btn-refresh-recomendacoes" class="btn-subtle text-sm whitespace-nowrap">
                        <i class="fas fa-sync-alt"></i>
                        <span class="hidden sm:inline ml-2">Atualizar</span>
                    </button>
                </div>
            </div>

            <!-- Grid de Recomendações -->
            <div id="recomendacao-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-10">
                <!-- Loading state -->
                <div class="col-span-full">
                    <div class="flex flex-col items-center justify-center py-16">
                        <div class="loading-spinner mb-4"></div>
                        <p class="text-gray-600 text-sm sm:text-base">Carregando suas recomendações...</p>
                    </div>
                </div>
            </div>

            <!-- Dica Motivacional -->
            <div class="card bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50 border-2 border-teal-200">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 sm:w-14 sm:h-14 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <i class="fas fa-lightbulb text-xl sm:text-2xl text-white"></i>
                    </div>
                    <div class="flex-grow">
                        <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                            💡 Dica do Dia
                        </h3>
                        <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
                            Estudar um pouco todos os dias é mais eficaz do que estudar muito de uma só vez! 
                            Mesmo 15 minutos diários fazem diferença. Seu cérebro aprende melhor com repetição 
                            espaçada do que com sessões longas e esporádicas. Continue assim! 🌟
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Função para criar card de conteúdo melhorado
function createContentCard(item) {
    console.log('🎮 Criando card:', { id: item.id, title: item.title, type: item.type });

    const card = document.createElement('div');
    card.className = 'content-card card hover:shadow-2xl transition-all duration-300 flex flex-col group cursor-pointer overflow-hidden';

    const typeColors = {
        'video': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', icon: 'text-purple-500' },
        'text': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-500' },
        'audio': { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200', icon: 'text-teal-500' },
        'interactive_game': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-500' }
    };

    const typeIcons = {
        'video': '<i class="fas fa-video mr-1"></i> Vídeo',
        'text': '<i class="fas fa-book-open mr-1"></i> Leitura',
        'audio': '<i class="fas fa-headphones mr-1"></i> Áudio',
        'interactive_game': '<i class="fas fa-gamepad mr-1"></i> Jogo'
    };

    const colorScheme = typeColors[item.type] || typeColors.video;
    const placeholderColors = ['8B5CF6', '3B82F6', '2DD4BF', 'FBBF24'];
    const randomColor = placeholderColors[Math.floor(Math.random() * placeholderColors.length)];
    
    // Remove emojis e pega primeira letra para o placeholder
    const titleWithoutEmoji = item.title.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
    const firstLetter = titleWithoutEmoji.substring(0, 1) || '?';
    const placeholderImage = `https://placehold.co/400x250/${randomColor}/FFFFFF?text=${encodeURIComponent(firstLetter)}`;

    card.innerHTML = `
        <!-- Imagem com Overlay -->
        <div class="relative overflow-hidden">
            <img src="${item.image_url || placeholderImage}" 
                 alt="${item.title}" 
                 class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                 onerror="this.src='${placeholderImage}'">
            
            <!-- Overlay com Gradiente -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div class="text-white text-sm flex items-center gap-3">
                    <span><i class="far fa-clock mr-1"></i>${item.duration || '~15 min'}</span>
                    ${item.difficulty ? `<span><i class="fas fa-signal mr-1"></i>${item.difficulty}</span>` : ''}
                </div>
            </div>
            
            <!-- Badge de Tipo -->
            <div class="absolute top-3 right-3">
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold border-2 ${colorScheme.bg} ${colorScheme.text} ${colorScheme.border} backdrop-blur-sm shadow-lg">
                    ${typeIcons[item.type] || typeIcons.video}
                </span>
            </div>
            
            <!-- Badge NOVO -->
            ${item.is_new ? `
                <div class="absolute top-3 left-3">
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500 text-white border-2 border-white shadow-lg">
                        <i class="fas fa-sparkles mr-1"></i>NOVO
                    </span>
                </div>
            ` : ''}
            
            <!-- Badge POPULAR -->
            ${(item.views || 0) > 100 ? `
                <div class="absolute top-3 left-3">
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white border-2 border-white shadow-lg">
                        <i class="fas fa-fire mr-1"></i>POPULAR
                    </span>
                </div>
            ` : ''}
        </div>

        <!-- Conteúdo do Card -->
        <div class="p-4 flex flex-col flex-grow">
            <!-- Título -->
            <h3 class="text-base font-semibold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2 min-h-[3rem]">
                ${item.title}
            </h3>

            <!-- Descrição -->
            <p class="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
                ${item.description || 'Explore este conteúdo incrível e aprenda de forma divertida!'}
            </p>

            <!-- Tags -->
            ${item.tags && item.tags.length > 0 ? `
                <div class="flex flex-wrap gap-1 mb-3">
                    ${item.tags.slice(0, 3).map(tag => `
                        <span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            #${tag}
                        </span>
                    `).join('')}
                </div>
            ` : ''}

            <!-- Metadados -->
            <div class="flex items-center justify-between text-xs text-gray-500 mb-4 pb-3 border-t border-gray-100 pt-3">
                <span class="flex items-center gap-1">
                    <i class="far fa-clock"></i>
                    ${item.duration || '15min'}
                </span>
                <span class="flex items-center gap-1">
                    <i class="fas fa-signal"></i>
                    ${item.difficulty || 'Básico'}
                </span>
                ${item.views ? `
                    <span class="flex items-center gap-1">
                        <i class="fas fa-eye"></i>
                        ${item.views}
                    </span>
                ` : ''}
            </div>

            <!-- Botão de Ação -->
            <button class="w-full btn-primary text-sm py-2.5 btn-explorar-conteudo group-hover:shadow-lg transition-all flex-shrink-0 whitespace-nowrap min-h-[42px] flex items-center justify-center"
                    data-content-id="${item.id}"
                    data-content-title="${item.title}">
                <i class="fas fa-play-circle mr-2"></i>
                Começar Agora
            </button>
        </div>
    `;

    return card;
}

// Renderizar recomendações
function renderRecommendations(recommendations, container = 'recomendacao-grid') {
    const grid = document.getElementById(container);
    if (!grid || !Array.isArray(recommendations)) return;

    grid.innerHTML = '';

    if (recommendations.length === 0) {
        renderEmptyState(grid);
        return;
    }

    recommendations.forEach(item => {
        const card = createContentCard(item);
        grid.appendChild(card);
    });
}

// Estado vazio melhorado
function renderEmptyState(grid) {
    grid.innerHTML = `
        <div class="col-span-full">
            <div class="card text-center py-16">
                <div class="relative inline-block mb-6">
                    <i class="fas fa-search text-6xl text-gray-300"></i>
                    <div class="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
                </div>
                
                <h3 class="text-xl font-semibold text-gray-800 mb-2">
                    Nenhum conteúdo encontrado
                </h3>
                <p class="text-gray-600 mb-6">
                    Tente ajustar seus filtros ou fazer uma nova busca
                </p>
                
                <div class="flex flex-wrap justify-center gap-2 mb-6">
                    <span class="text-sm text-gray-500">Tente buscar:</span>
                    ${['Matemática', 'Xadrez', 'Programação', 'Espaço'].map(sugestao => `
                        <button class="suggestion-chip"
                                onclick="document.getElementById('search-content').value='${sugestao}'; document.getElementById('search-content').dispatchEvent(new Event('input'))">
                            ${sugestao}
                        </button>
                    `).join('')}
                </div>
                
                <button onclick="clearAllFilters()" class="btn-primary">
                    <i class="fas fa-redo mr-2"></i>
                    Limpar Filtros
                </button>
            </div>
        </div>
    `;
}

// Atualiza contadores dos filtros
function updateFilterCounts(allRecommendations, currentRecommendations) {
    const counts = {
        all: allRecommendations.length,
        video: allRecommendations.filter(r => r.type === 'video').length,
        text: allRecommendations.filter(r => r.type === 'text').length,
        audio: allRecommendations.filter(r => r.type === 'audio').length,
        interactive_game: allRecommendations.filter(r => r.type === 'interactive_game').length
    };
    
    document.querySelectorAll('.filter-chip').forEach(chip => {
        const filter = chip.dataset.filter;
        if (filter && counts[filter] !== undefined) {
            const badge = chip.querySelector('.badge-count');
            if (badge) {
                badge.textContent = counts[filter];
            }
        }
    });
    
    // Atualiza contador total
    const resultCount = document.getElementById('result-count');
    if (resultCount) {
        const count = currentRecommendations.length;
        resultCount.innerHTML = `<strong>${count}</strong> conteúdo${count !== 1 ? 's' : ''}`;
    }
}

// Ordenar conteúdos
function sortContent(items, sortBy) {
    const sorted = [...items];
    
    switch(sortBy) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        
        case 'popular':
            return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        
        case 'alphabetical':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        
        case 'recommended':
        default:
            return sorted;
    }
}

// Carregar estatísticas
async function loadStatistics() {
    try {
        const progress = await api.getUserProgress();
        const activities = await api.getUserActivities();

        console.log('📊 Progress completo:', progress);
        console.log('📝 Activities completo:', activities);

        const completedCount = progress.completed_activities || 0;
        const inProgressCount = activities.filter(a => a.status === 'in_progress').length || 0;
        const completedFromActivities = activities.filter(a => a.status === 'completed').length || 0;

        console.log(`✅ Concluídos (progress): ${completedCount}`);
        console.log(`✅ Concluídos (activities): ${completedFromActivities}`);
        console.log(`🔄 Em andamento: ${inProgressCount}`);

        document.getElementById('stat-concluidos').textContent = completedCount;
        document.getElementById('stat-em-andamento').textContent = inProgressCount;
        
        // Usa tempo real da API (em minutos, convertido para horas e minutos)
        const totalMinutes = progress.total_time_spent || 0;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        let timeText;
        if (hours > 0 && minutes > 0) {
            timeText = `${hours}h ${minutes}min`;
        } else if (hours > 0) {
            timeText = `${hours}h`;
        } else {
            timeText = `${minutes}min`;
        }
        
        document.getElementById('stat-tempo').textContent = timeText;
        document.getElementById('stat-sequencia').textContent = progress.streak_days || 0;

        // Continue de onde parou
        const inProgress = activities.filter(a => a.status === 'in_progress');
        if (inProgress.length > 0) {
            document.getElementById('continue-section').style.display = 'block';
            const continueContent = inProgress.map(a => a.content).filter(c => c);
            if (continueContent.length > 0) {
                renderRecommendations(continueContent, 'continue-grid');
            }
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Limpar todos os filtros
window.clearAllFilters = function() {
    document.getElementById('search-content').value = '';
    document.getElementById('search-content').dispatchEvent(new Event('input'));
    
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('filter-chip-active');
    });
    document.querySelector('[data-filter="all"]')?.classList.add('filter-chip-active');
    
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = 'recommended';
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

    // Variáveis de estado
    let allRecommendations = [];
    let filteredRecommendations = [];
    let currentFilter = 'all';
    let currentSort = 'recommended';
    
    // Carrega recomendações
    const loadRecommendations = async () => {
        const grid = document.getElementById('recomendacao-grid');
        
        try {
            if (allRecommendations.length === 0) {
                grid.innerHTML = `
                    <div class="col-span-full flex flex-col items-center justify-center py-16">
                        <div class="loading-spinner mb-4"></div>
                        <p class="text-gray-600">Carregando conteúdos...</p>
                    </div>
                `;
                
                // Busca mais conteúdos (30 em vez de 20)
                allRecommendations = await api.getRecommendations(30);
                filteredRecommendations = allRecommendations;
            }

            applyFilters();
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

    // Aplica filtros e busca
    const applyFilters = () => {
        let results = [...allRecommendations];

        // Aplica filtro de categoria
        if (currentFilter !== 'all') {
            results = results.filter(item => item.type === currentFilter);
        }

        // Aplica busca
        const searchTerm = document.getElementById('search-content')?.value.toLowerCase();
        if (searchTerm) {
            results = results.filter(item => 
                item.title.toLowerCase().includes(searchTerm) ||
                (item.description && item.description.toLowerCase().includes(searchTerm)) ||
                (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }

        // Aplica ordenação
        results = sortContent(results, currentSort);

        filteredRecommendations = results;
        renderRecommendations(results);
        updateFilterCounts(allRecommendations, results);
    };

    loadRecommendations();

    // Busca
    const searchInput = document.getElementById('search-content');
    const clearButton = document.getElementById('clear-search');
    
    if (searchInput && clearButton) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            clearButton.classList.toggle('hidden', query.length === 0);
            applyFilters();
        });

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            clearButton.classList.add('hidden');
            searchInput.focus();
            applyFilters();
        });
    }

    // Filtros de categoria
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(b => {
                b.classList.remove('filter-chip-active');
            });
            
            btn.classList.add('filter-chip-active');
            currentFilter = btn.dataset.filter;
            applyFilters();
        });
    });

    // Ordenação
    document.getElementById('sort-select')?.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFilters();
    });

    // Botão refresh
    document.getElementById('btn-refresh-recomendacoes')?.addEventListener('click', async () => {
        const btn = document.getElementById('btn-refresh-recomendacoes');
        const icon = btn.querySelector('i');
        
        icon.classList.add('fa-spin');
        allRecommendations = [];
        await loadRecommendations();
        icon.classList.remove('fa-spin');
        
        showCustomAlert('Recomendações atualizadas!', 'Sucesso', 'success');
    });

    // Listener para botões "Explorar"
    const setupCardListeners = (containerId) => {
        document.getElementById(containerId)?.addEventListener('click', (ev) => {
            const btn = ev.target.closest('.btn-explorar-conteudo');
            if (!btn) return;

            
            // 👇 ADICIONE ESTAS LINHAS
        console.log('🔍 Botão clicado:', btn.dataset);
        console.log('🔍 Content ID:', btn.dataset.contentId);

        const contentId = btn.dataset.contentId;
        console.log('🚀 Navegando para:', `/conteudo/${contentId}`);
        window.router.navigate(`/conteudo/${contentId}`);
        });
    };

    setupCardListeners('recomendacao-grid');
    setupCardListeners('continue-grid');
}