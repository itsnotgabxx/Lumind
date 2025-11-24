import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

export default function AcompanhamentoPage() {
    return `
        <div class="w-full max-w-[1400px] mx-auto px-4 py-6 sm:py-8">
            <!-- Header Principal -->
            <div class="bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 mb-8 border-2 border-teal-200 shadow-lg">
                <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div class="flex-grow">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                                <i class="fas fa-user-shield text-white text-xl"></i>
                            </div>
                            <div>
                                <h1 id="acompanhamento-header" class="text-2xl sm:text-3xl font-bold text-gray-800">
                                    Área do Responsável 👨‍👩‍👧‍👦
                                </h1>
                                <p class="text-gray-600 text-sm mt-1">
                                    Acompanhe o desenvolvimento de <span id="student-name" class="font-semibold text-teal-700">...</span>
                                </p>
                            </div>
                        </div>
                        <p class="text-gray-600 text-sm sm:text-base max-w-2xl">
                            Monitore o progresso, envie mensagens de incentivo e mantenha-se informado sobre as atividades do estudante
                        </p>
                    </div>
                    
                    <button data-route="/recomendacao" class="btn-subtle whitespace-nowrap">
                        <i class="fas fa-arrow-left mr-2"></i>Voltar
                    </button>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <button data-route="/enviarIncentivo" class="card hover:shadow-xl transition-all p-4 text-left border-2 border-transparent hover:border-purple-300">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-paper-plane text-purple-600 text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-800">Enviar Incentivo</h3>
                            <p class="text-xs text-gray-600">Motive o estudante</p>
                        </div>
                    </div>
                </button>

                <button data-route="/falarComEspecialista" class="card hover:shadow-xl transition-all p-4 text-left border-2 border-transparent hover:border-blue-300">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-headset text-blue-600 text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-800">Falar com Especialista</h3>
                            <p class="text-xs text-gray-600">Tire suas dúvidas</p>
                        </div>
                    </div>
                </button>

                <button id="btn-ver-relatorio" class="card hover:shadow-xl transition-all p-4 text-left border-2 border-transparent hover:border-green-300">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-file-download text-green-600 text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-800">Relatório Completo</h3>
                            <p class="text-xs text-gray-600">Baixar PDF</p>
                        </div>
                    </div>
                </button>

                <button data-route="/progresso" class="card hover:shadow-xl transition-all p-4 text-left border-2 border-transparent hover:border-amber-300">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-chart-line text-amber-600 text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-800">Ver Progresso Detalhado</h3>
                            <p class="text-xs text-gray-600">Estatísticas completas</p>
                        </div>
                    </div>
                </button>
            </div>

            <!-- Resumo Visual do Progresso -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <!-- Progresso Geral -->
                <div class="lg:col-span-2 card bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
                    <h2 class="text-xl font-semibold mb-4 flex items-center">
                        <i class="fas fa-chart-pie mr-2 text-purple-600"></i>
                        Visão Geral do Desenvolvimento
                    </h2>
                    
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-white rounded-xl p-4 shadow-sm">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm text-gray-600">Progresso Geral</span>
                                <i class="fas fa-percentage text-purple-500"></i>
                            </div>
                            <div class="text-3xl font-bold text-purple-600" id="overall-progress">0%</div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div id="overall-progress-bar" class="bg-purple-500 h-2 rounded-full transition-all duration-1000" style="width: 0%"></div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl p-4 shadow-sm">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm text-gray-600">Tempo de Estudo</span>
                                <i class="fas fa-clock text-blue-500"></i>
                            </div>
                            <div class="text-3xl font-bold text-blue-600" id="study-time">0h</div>
                            <div class="text-xs text-gray-500 mt-1">
                                <span id="study-time-trend" class="text-green-600">
                                    <i class="fas fa-arrow-up"></i> +15% esta semana
                                </span>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl p-4 shadow-sm">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm text-gray-600">Atividades Completas</span>
                                <i class="fas fa-check-double text-green-500"></i>
                            </div>
                            <div class="text-3xl font-bold text-green-600" id="completed-count">0</div>
                            <div class="text-xs text-gray-500 mt-1">
                                de <span id="total-activities">20</span> recomendadas
                            </div>
                        </div>

                        <div class="bg-white rounded-xl p-4 shadow-sm">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm text-gray-600">Sequência Atual</span>
                                <i class="fas fa-fire text-orange-500"></i>
                            </div>
                            <div class="text-3xl font-bold text-orange-600" id="streak-days">0</div>
                            <div class="text-xs text-gray-500 mt-1">dias consecutivos</div>
                        </div>
                    </div>

                    <!-- Gráfico de Atividade Semanal -->
                    <div class="bg-white rounded-xl p-4 shadow-sm">
                        <h3 class="text-sm font-semibold text-gray-700 mb-3">Atividade nos Últimos 7 Dias</h3>
                        <div id="weekly-activity-chart" class="flex items-end justify-between gap-2 h-24">
                            <div class="text-center py-8 text-gray-500 w-full">
                                <i class="fas fa-spinner fa-spin text-lg mb-2"></i>
                                <p class="text-xs">Carregando dados...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Conquistas e Destaques -->
                <div class="space-y-6">
                    <!-- Conquistas Recentes -->
                    <div class="card bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
                        <h2 class="text-lg font-semibold mb-4 flex items-center">
                            <i class="fas fa-trophy mr-2 text-amber-500"></i>
                            Conquistas Recentes
                        </h2>
                        <div id="recent-achievements" class="space-y-3">
                            <div class="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                <span class="text-3xl">🏆</span>
                                <div class="flex-grow">
                                    <div class="font-semibold text-gray-800 text-sm">Carregando...</div>
                                    <div class="text-xs text-gray-500">aguarde</div>
                                </div>
                            </div>
                        </div>
                        <button data-route="/progresso" class="w-full mt-4 text-sm text-center text-amber-700 hover:text-amber-800 font-medium">
                            Ver todas as conquistas <i class="fas fa-arrow-right ml-1"></i>
                        </button>
                    </div>

                    <!-- Status do Momento -->
                    <div class="card bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
                        <h2 class="text-lg font-semibold mb-4 flex items-center">
                            <i class="fas fa-lightbulb mr-2 text-green-600"></i>
                            Status do Momento
                        </h2>
                        <div class="space-y-3">
                            <div class="flex items-start gap-3">
                                <i class="fas fa-check-circle text-green-500 mt-1"></i>
                                <div>
                                    <p class="text-sm font-medium text-gray-800">Estudando regularmente</p>
                                    <p class="text-xs text-gray-600">5 dias seguidos esta semana</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3">
                                <i class="fas fa-heart text-red-400 mt-1"></i>
                                <div>
                                    <p class="text-sm font-medium text-gray-800">Temas favoritos</p>
                                    <p class="text-xs text-gray-600" id="favorite-topics">Xadrez, Espaço</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3">
                                <i class="fas fa-star text-amber-400 mt-1"></i>
                                <div>
                                    <p class="text-sm font-medium text-gray-800">Melhor horário</p>
                                    <p class="text-xs text-gray-600">Tarde (14h-17h)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Atividades Recentes e Alertas -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <!-- Atividades Recentes -->
                <div class="lg:col-span-2 card">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-semibold flex items-center">
                            <i class="fas fa-history mr-2 text-blue-500"></i>
                            Atividades Recentes
                        </h2>
                        <button data-route="/historico" class="btn-subtle text-sm">
                            <i class="fas fa-external-link-alt mr-1"></i>Ver Tudo
                        </button>
                    </div>
                    
                    <div id="recent-activities" class="space-y-3">
                        <div class="text-center py-8 text-gray-500">
                            <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                            <p class="text-sm">Carregando atividades...</p>
                        </div>
                    </div>
                </div>

                <!-- Mensagens e Alertas -->
                <div class="space-y-6">
                    <!-- Últimas Mensagens Enviadas -->
                    <div class="card bg-purple-50 border-2 border-purple-200">
                        <h3 class="text-lg font-semibold mb-3 flex items-center">
                            <i class="fas fa-envelope mr-2 text-purple-600"></i>
                            Mensagens Enviadas
                        </h3>
                        <div id="sent-messages" class="space-y-2 max-h-48 overflow-y-auto">
                            <p class="text-sm text-gray-500 text-center py-4">Nenhuma mensagem enviada ainda</p>
                        </div>
                        <button data-route="/enviarIncentivo" class="w-full mt-3 btn-primary text-sm">
                            <i class="fas fa-paper-plane mr-2"></i>Enviar Novo Incentivo
                        </button>
                    </div>

                    <!-- Alertas Importantes -->
                    <div class="card bg-red-50 border-2 border-red-200" id="alerts-card" style="display: none;">
                        <h3 class="text-lg font-semibold mb-3 flex items-center">
                            <i class="fas fa-exclamation-triangle mr-2 text-red-600"></i>
                            Alertas
                        </h3>
                        <div id="alerts-list" class="space-y-2">
                            <!-- Alertas serão inseridos aqui -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recomendações para Responsável -->
            <div class="card bg-gradient-to-r from-blue-50 via-teal-50 to-green-50 border-2 border-blue-200">
                <h2 class="text-xl font-semibold mb-4 flex items-center">
                    <i class="fas fa-magic mr-2 text-blue-600"></i>
                    Dicas para Apoiar o Desenvolvimento
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-white rounded-xl p-4 shadow-sm">
                        <div class="flex items-start gap-3">
                            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-comment-dots text-purple-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-800 mb-1">Celebre as Conquistas</h4>
                                <p class="text-sm text-gray-600">
                                    Reconheça cada progresso, por menor que seja. O reforço positivo é fundamental para a motivação!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl p-4 shadow-sm">
                        <div class="flex items-start gap-3">
                            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-clock text-blue-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-800 mb-1">Crie uma Rotina</h4>
                                <p class="text-sm text-gray-600">
                                    Estabeleça horários regulares para estudo. A previsibilidade ajuda no foco e no conforto.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl p-4 shadow-sm">
                        <div class="flex items-start gap-3">
                            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-hands-helping text-green-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-800 mb-1">Esteja Presente</h4>
                                <p class="text-sm text-gray-600">
                                    Demonstre interesse pelo que está sendo aprendido. Pergunte sobre os conteúdos e compartilhe a alegria!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl p-4 shadow-sm">
                        <div class="flex items-start gap-3">
                            <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-spa text-amber-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-800 mb-1">Respeite o Ritmo</h4>
                                <p class="text-sm text-gray-600">
                                    Cada pessoa aprende de forma única. Evite comparações e valorize o progresso individual.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Renderiza gráfico de atividade dos últimos 7 dias
function renderWeeklyActivityChart(dailyStats) {
    const container = document.getElementById('weekly-activity-chart');
    if (!container || !dailyStats || dailyStats.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500 w-full">
                <i class="fas fa-chart-bar text-lg mb-2"></i>
                <p class="text-xs">Sem dados de atividade ainda</p>
            </div>
        `;
        return;
    }

    // Calcula o valor máximo para normalizar as alturas das barras
    const maxTime = Math.max(...dailyStats.map(day => day.time_spent), 1);
    const maxHeight = 100; // altura máxima em %

    // Gera as barras do gráfico
    const chartHTML = dailyStats.map(day => {
        const heightPercent = maxTime > 0 ? (day.time_spent / maxTime) * maxHeight : 10;
        const timeText = day.time_spent > 0 ? `${day.time_spent}m` : '0m';
        
        // Define a cor baseada no tempo de estudo
        let colorClass, textColorClass;
        if (day.time_spent === 0) {
            colorClass = 'bg-gray-100';
            textColorClass = 'text-gray-700';
        } else if (day.time_spent < 15) {
            colorClass = 'bg-purple-200';
            textColorClass = 'text-purple-700';
        } else if (day.time_spent < 30) {
            colorClass = 'bg-purple-300';
            textColorClass = 'text-purple-800';
        } else {
            colorClass = 'bg-purple-400';
            textColorClass = 'text-purple-900';
        }

        return `
            <div class="flex-1 ${colorClass} rounded-t-lg flex flex-col items-center justify-end transition-all hover:opacity-80" 
                 style="height: ${Math.max(heightPercent, 15)}%"
                 title="${day.weekday} - ${day.time_spent} minutos estudados">
                <div class="text-xs text-gray-500 mb-1">${day.weekday}</div>
                <div class="text-xs font-semibold ${textColorClass}">${timeText}</div>
            </div>
        `;
    }).join('');

    container.innerHTML = chartHTML;
}

// Renderiza conquistas recentes
function renderRecentAchievements(achievements) {
    const container = document.getElementById('recent-achievements');
    if (!container || !achievements || achievements.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Nenhuma conquista ainda</p>';
        return;
    }

    const emojiMap = {
        'Explorador Curioso': { emoji: '🌍', color: 'green' },
        'Mestre dos Vídeos': { emoji: '🎬', color: 'purple' },
        'Leitor Voraz': { emoji: '📚', color: 'blue' },
        'Gamer Dedicado': { emoji: '🎮', color: 'amber' },
        'Sequência de 7 dias': { emoji: '🔥', color: 'orange' }
    };

    container.innerHTML = achievements.slice(0, 3).map(achievement => {
        const info = emojiMap[achievement] || { emoji: '🏆', color: 'amber' };
        return `
            <div class="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span class="text-3xl">${info.emoji}</span>
                <div class="flex-grow">
                    <div class="font-semibold text-gray-800 text-sm">${achievement}</div>
                    <div class="text-xs text-gray-500">Desbloqueado recentemente</div>
                </div>
            </div>
        `;
    }).join('');
}

// Renderiza atividades recentes
function renderRecentActivities(activities) {
    const container = document.getElementById('recent-activities');
    if (!container) return;

    if (!activities || activities.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-500 text-center py-8">Nenhuma atividade registrada ainda</p>';
        return;
    }

    const statusConfig = {
        'completed': {
            icon: 'fa-check-circle',
            color: 'green',
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'Concluído'
        },
        'in_progress': {
            icon: 'fa-spinner',
            color: 'blue',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'Em andamento'
        },
        'not_started': {
            icon: 'fa-circle',
            color: 'gray',
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            text: 'Não iniciado'
        }
    };

    container.innerHTML = activities.slice(0, 5).map(activity => {
        const status = statusConfig[activity.status] || statusConfig.not_started;
        const date = activity.updated_at ? new Date(activity.updated_at).toLocaleDateString('pt-BR') : 'Data não disponível';
        
        return `
            <div class="flex items-center justify-between p-4 rounded-lg border-2 ${status.bg} ${status.border} hover:shadow-md transition-shadow">
                <div class="flex items-center gap-4">
                    <i class="fas ${status.icon} text-${status.color}-500 text-xl"></i>
                    <div>
                        <p class="font-medium text-gray-800">${activity.content?.title || 'Atividade'}</p>
                        <div class="flex items-center gap-3 mt-1">
                            <span class="text-xs text-gray-600">${status.text}</span>
                            <span class="text-xs text-gray-400">• ${date}</span>
                            ${activity.progress_percentage > 0 ? `
                                <span class="text-xs font-medium text-${status.color}-600">${activity.progress_percentage}%</span>
                            ` : ''}
                        </div>
                    </div>
                </div>
                ${activity.progress_percentage > 0 && activity.status === 'in_progress' ? `
                    <div class="w-24">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-${status.color}-500 h-2 rounded-full" style="width: ${activity.progress_percentage}%"></div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Renderiza estatísticas gerais
function renderStatistics(progress, activities) {
    if (!progress) return;

    // Progresso geral
    const percentage = progress.progress_percentage || 0;
    document.getElementById('overall-progress').textContent = `${percentage}%`;
    document.getElementById('overall-progress-bar').style.width = `${percentage}%`;

    // Atividades concluídas
    const completedCount = progress.completed_activities || 0;
    document.getElementById('completed-count').textContent = completedCount;

    // Tempo de estudo (usando dados reais da API em minutos)
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
    
    document.getElementById('study-time').textContent = timeText;

    // Sequência
    const streakDays = progress.streak_days || 0;
    document.getElementById('streak-days').textContent = streakDays;

    // Conquistas
    if (progress.achievements && progress.achievements.length > 0) {
        renderRecentAchievements(progress.achievements);
    }

    // Atividades recentes
    if (activities && activities.length > 0) {
        renderRecentActivities(activities);
        
        // Verifica se há algum alerta
        const inactiveFor3Days = activities.every(a => {
            const lastActivity = new Date(a.updated_at);
            const daysSince = Math.floor((Date.now() - lastActivity) / (1000 * 60 * 60 * 24));
            return daysSince > 3;
        });

        if (inactiveFor3Days) {
            showAlert('Sem atividade há mais de 3 dias', 'Considere enviar uma mensagem de incentivo!');
        }
    }
}

// Mostra alertas
function showAlert(title, message) {
    const alertsCard = document.getElementById('alerts-card');
    const alertsList = document.getElementById('alerts-list');
    
    if (alertsCard && alertsList) {
        alertsCard.style.display = 'block';
        
        const alertHTML = `
            <div class="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                <i class="fas fa-exclamation-circle text-red-500 mt-1"></i>
                <div>
                    <div class="font-semibold text-gray-800 text-sm">${title}</div>
                    <div class="text-xs text-gray-600 mt-1">${message}</div>
                </div>
            </div>
        `;
        
        alertsList.innerHTML += alertHTML;
    }
}

// Renderiza mensagens enviadas
async function renderSentMessages() {
    const container = document.getElementById('sent-messages');
    if (!container) return;

    try {
        // Busca mensagens enviadas (filtradas por tipo 'incentive')
        const messages = await api.getReceivedMessages('incentive');
        
        if (!messages || messages.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Nenhuma mensagem enviada ainda</p>';
            return;
        }

        container.innerHTML = messages.slice(0, 3).map(msg => {
            const date = new Date(msg.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
            return `
                <div class="p-2 bg-white rounded-lg text-xs">
                    <div class="font-medium text-gray-700 mb-1">"${msg.message.substring(0, 50)}${msg.message.length > 50 ? '...' : ''}"</div>
                    <div class="text-gray-500">${date}</div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
        container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Erro ao carregar mensagens</p>';
    }
}

export function setup() {
    const user = userState.user;
    if (!user) {
        window.router.navigate('/login');
        return;
    }

    // Atualiza nome do estudante
    const studentNameEl = document.getElementById('student-name');
    if (studentNameEl) {
        studentNameEl.textContent = user.full_name;
    }

    // Atualiza tópicos favoritos
    try {
        const interests = user.interests ? JSON.parse(user.interests) : [];
        if (interests.length > 0) {
            document.getElementById('favorite-topics').textContent = interests.join(', ');
        }
    } catch (e) {
        console.error('Erro ao processar interesses:', e);
    }

    // Navegação
    document.querySelectorAll('[data-route]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            window.router.navigate(element.dataset.route);
        });
    });

    // Botão de relatório
    document.getElementById('btn-ver-relatorio')?.addEventListener('click', () => {
        showCustomAlert(
            'Em breve você poderá baixar relatórios completos em PDF com todo o histórico de atividades e progresso!',
            'Funcionalidade em Desenvolvimento',
            'info'
        );
    });

    // Carrega dados
    const loadData = async () => {
        try {
            // Se for responsável, busca dados do estudante vinculado
            if (userState.user.user_type === 'guardian' && userState.user.student_id) {
                const studentId = userState.user.student_id;
                
                // Busca dados do estudante vinculado
                const student = await api.request(`/users/${studentId}`);
                
                // Atualiza o nome do estudante no header
                const studentNameElement = document.getElementById('student-name');
                if (studentNameElement) {
                    studentNameElement.textContent = student.full_name;
                }
                
                // Busca progresso do estudante
                const [progress, activities, dailyActivity] = await Promise.all([
                    api.getStudentProgress(studentId),
                    api.getStudentActivities(studentId),
                    api.getStudentDailyActivity(studentId, 7)
                ]);

                renderStatistics(progress, activities);
                renderWeeklyActivityChart(dailyActivity);
                await renderSentMessages();
            } else {
                // Para estudantes, busca dados próprios
                const [progress, activities, dailyActivity] = await Promise.all([
                    api.getUserProgress(),
                    api.getUserActivities(),
                    api.getDailyActivity(7)
                ]);

                renderStatistics(progress, activities);
                renderWeeklyActivityChart(dailyActivity);
                await renderSentMessages();
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            showCustomAlert('Erro ao carregar dados de acompanhamento', 'Erro', 'error');
        }
    };

    loadData();
}