export default function ProgressoPage() {
    return `
        <div class="w-full max-w-4xl mx-auto">
            <h1 id="progresso-header" class="screen-title text-center mb-8"></h1>
            
            <!-- Resumo do Progresso -->
            <div class="card mb-8">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">Seu Progresso Geral</h2>
                        <p class="text-gray-600 mt-1">Continue assim! Cada conquista conta.</p>
                    </div>
                    <div class="text-right">
                        <span class="text-3xl font-bold text-green-600" id="progress-percentage">0%</span>
                        <p class="text-sm text-gray-500">completado</p>
                    </div>
                </div>
                
                <!-- Barra de Progresso -->
                <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div class="progress-bar-fill h-full rounded-full transition-all duration-500" style="width: 0%"></div>
                </div>
            </div>

            <!-- Conquistas -->
            <div class="card mb-8">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Suas Conquistas</h2>
                <div class="flex flex-wrap gap-4" id="achievements-container">
                    <!-- Conquistas serão inseridas aqui dinamicamente -->
                </div>
                <p class="text-sm text-gray-500 mt-3" id="achievements-text"></p>
            </div>

            <!-- Atividades Recentes -->
            <div class="card">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Atividades Recentes</h2>
                <div class="space-y-3" id="activities-container">
                    <!-- Atividades serão inseridas aqui dinamicamente -->
                </div>
            </div>
        </div>
    `;
}

export function setup() {
    updateProgressData();
    setupEventListeners();
}

async function updateProgressData() {
    const loading = document.getElementById('loading-overlay');
    loading.style.display = 'flex';

    try {
        // Busca dados do progresso
        const progress = await api.getUserProgress();
        
        // Atualiza cabeçalho
        const header = document.getElementById('progresso-header');
        if (header && api.user) {
            header.innerHTML = `Seu Progresso, ${api.user.full_name}!`;
        }

        // Atualiza porcentagem
        const percentage = document.getElementById('progress-percentage');
        const progressBar = document.querySelector('.progress-bar-fill');
        if (percentage && progressBar) {
            percentage.textContent = `${progress.progress_percentage}%`;
            progressBar.style.width = `${progress.progress_percentage}%`;
        }

        // Renderiza conquistas
        renderAchievements(progress.achievements);

        // Renderiza atividades
        const activities = await api.getUserActivities();
        renderActivities(activities);

    } catch (error) {
        showCustomAlert('Erro ao carregar progresso', 'Erro', 'error');
    } finally {
        loading.style.display = 'none';
    }
}

function renderAchievements(achievements) {
    const container = document.getElementById('achievements-container');
    if (!container) return;

    container.innerHTML = '';
    
    // Renderiza conquistas obtidas
    achievements.forEach(achievement => {
        container.appendChild(createAchievementCard(achievement, true));
    });

    // Adiciona conquistas bloqueadas
    const totalAchievements = 10;
    for (let i = achievements.length; i < totalAchievements; i++) {
        container.appendChild(createAchievementCard(null, false));
    }

    // Atualiza texto de conquistas
    const text = document.getElementById('achievements-text');
    if (text) {
        text.textContent = `${achievements.length} de ${totalAchievements} conquistas desbloqueadas`;
    }
}

function createAchievementCard(achievement, unlocked) {
    const div = document.createElement('div');
    div.className = `achievement-card ${unlocked ? 'unlocked' : 'locked'}`;
    
    if (unlocked) {
        div.innerHTML = `
            <div class="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                <i class="${achievement.icon} text-2xl text-purple-500"></i>
                <h3 class="font-medium text-purple-900 mt-2">${achievement.title}</h3>
                <p class="text-sm text-purple-700">${achievement.description}</p>
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                <i class="fas fa-lock text-2xl text-gray-400"></i>
                <h3 class="font-medium text-gray-500 mt-2">???</h3>
                <p class="text-sm text-gray-400">Conquista bloqueada</p>
            </div>
        `;
    }

    return div;
}

function renderActivities(activities) {
    const container = document.getElementById('activities-container');
    if (!container || !Array.isArray(activities)) return;

    container.innerHTML = '';
    
    activities.forEach(activity => {
        const div = document.createElement('div');
        div.className = 'activity-card p-4 bg-white rounded-lg border border-gray-200';
        
        const icon = getActivityIcon(activity.type);
        const date = new Date(activity.timestamp).toLocaleDateString('pt-BR');
        
        div.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <i class="${icon} text-xl text-blue-500"></i>
                </div>
                <div class="ml-3">
                    <p class="text-gray-800">${activity.description}</p>
                    <span class="text-sm text-gray-500">${date}</span>
                </div>
            </div>
        `;
        
        container.appendChild(div);
    });
}

function getActivityIcon(type) {
    switch(type) {
        case 'completion':
            return 'fas fa-check-circle';
        case 'achievement':
            return 'fas fa-trophy';
        case 'login':
            return 'fas fa-sign-in-alt';
        default:
            return 'fas fa-circle';
    }
}

function setupEventListeners() {
    // Atualiza dados quando a rota é acessada
    window.addEventListener('routeChanged', (event) => {
        if (event.detail.path === '/progresso') {
            updateProgressData();
        }
    });
}