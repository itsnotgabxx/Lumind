import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

export default function ProgressoPage() {
    return `
        <div class="w-full max-w-7xl mx-auto px-4 py-8">
            <!-- Header -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 id="progresso-header" class="text-3xl font-bold text-gray-800 mb-2">
                        ${userState.user.user_type === 'guardian' 
                            ? `Progresso de <span id="student-progresso-name">...</span>` 
                            : 'Seu Progresso'} 📊
                    </h1>
                    <p class="text-gray-600">
                        ${userState.user.user_type === 'guardian' 
                            ? `Acompanhe a evolução e desempenho do aluno` 
                            : 'Acompanhe sua evolução e conquistas'}
                    </p>
                </div>
                <button data-route="${userState.user.user_type === 'guardian' ? '/acompanhamento' : '/recomendacao'}" class="btn-subtle">
                    <i class="fas fa-arrow-left mr-2"></i>Voltar
                </button>
            </div>

            <!-- Cards de Resumo -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- Progresso Geral -->
                <div class="card bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
                    <h2 class="text-xl font-semibold mb-4 flex items-center">
                        <i class="fas fa-flag-checkered mr-2 text-green-500"></i>
                        Resumo Geral
                    </h2>
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <p id="progresso-percentual" class="text-5xl font-bold text-purple-600">0%</p>
                            <p class="text-gray-600 mt-1">do plano concluído</p>
                        </div>
                        <div class="w-32 h-32">
                            <svg class="progress-ring" viewBox="0 0 120 120">
                                <circle class="text-gray-200" stroke="currentColor" stroke-width="8" fill="transparent" r="52" cx="60" cy="60"/>
                                <circle id="progresso-circle" class="progress-ring-circle" stroke-dasharray="326.73" stroke-dashoffset="326.73" r="52" cx="60" cy="60"/>
                            </svg>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                        <div id="progresso-barra" class="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-1000" style="width: 0%"></div>
                    </div>
                </div>

                <!-- Conquistas -->
                <div class="card bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
                    <h2 class="text-xl font-semibold mb-4 flex items-center">
                        <i class="fas fa-trophy mr-2 text-amber-500"></i>
                        Conquistas
                    </h2>
                    <div id="conquistas-container" class="flex flex-wrap gap-3 mt-4 min-h-[100px]">
                        <span class="text-gray-400">Carregando...</span>
                    </div>
                    <p id="conquistas-texto" class="text-sm text-gray-600 mt-4">
                        Carregando suas conquistas...
                    </p>
                </div>
            </div>

            <!-- Estatísticas Detalhadas -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="card text-center hover:shadow-lg transition-shadow">
                    <i class="fas fa-check-circle text-4xl text-green-500 mb-2"></i>
                    <p class="text-3xl font-bold text-gray-800" id="stat-completed">0</p>
                    <p class="text-sm text-gray-600">Concluídos</p>
                </div>
                
                <div class="card text-center hover:shadow-lg transition-shadow">
                    <i class="fas fa-spinner text-4xl text-blue-500 mb-2"></i>
                    <p class="text-3xl font-bold text-gray-800" id="stat-in-progress">0</p>
                    <p class="text-sm text-gray-600">Em Andamento</p>
                </div>
                
                <div class="card text-center hover:shadow-lg transition-shadow">
                    <i class="fas fa-clock text-4xl text-purple-500 mb-2"></i>
                    <p class="text-3xl font-bold text-gray-800" id="stat-time">0h</p>
                    <p class="text-sm text-gray-600">Tempo Total</p>
                </div>
                
                <div class="card text-center hover:shadow-lg transition-shadow">
                    <i class="fas fa-fire text-4xl text-orange-500 mb-2"></i>
                    <p class="text-3xl font-bold text-gray-800" id="stat-streak">0</p>
                    <p class="text-sm text-gray-600">Dias Seguidos</p>
                </div>
            </div>

            <!-- Atividades Recentes -->
            <div class="card mb-8">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-semibold flex items-center">
                        <i class="fas fa-history mr-2 text-blue-500"></i>
                        Atividades Recentes
                    </h2>
                    <button data-route="/historico" class="btn-subtle text-sm">
                        <i class="fas fa-list-alt mr-2"></i>Ver Histórico Completo
                    </button>
                </div>
                <ul id="atividades-recentes-lista" class="space-y-3">
                    <p class="text-gray-500 text-center py-8">Carregando atividades...</p>
                </ul>
            </div>

            <!-- Próximos Objetivos -->
            <div class="card bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200">
                <h3 class="text-xl font-semibold mb-4 flex items-center">
                    <i class="fas fa-bullseye mr-2 text-teal-600"></i>
                    Próximos Objetivos
                </h3>
                <div class="space-y-3">
                    <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <i class="fas fa-star text-2xl text-amber-500"></i>
                        <div class="flex-grow">
                            <p class="font-medium text-gray-800">Complete mais 3 atividades</p>
                            <p class="text-sm text-gray-600">Para desbloquear a conquista "Explorador Dedicado"</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <i class="fas fa-calendar-check text-2xl text-green-500"></i>
                        <div class="flex-grow">
                            <p class="font-medium text-gray-800">Estude por 7 dias seguidos</p>
                            <p class="text-sm text-gray-600">Continue sua sequência! Você está indo muito bem!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderUserProgress(progress) {
    if (!progress) return;
    
    // Percentual
    const percentage = progress.progress_percentage || 0;
    document.getElementById('progresso-percentual').textContent = `${percentage}%`;
    document.getElementById('progresso-barra').style.width = `${percentage}%`;
    
    // Círculo SVG
    const circle = document.getElementById('progresso-circle');
    if (circle) {
        const circumference = 326.73;
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    // Conquistas
    const achievementsContainer = document.getElementById('conquistas-container');
    const achievementsText = document.getElementById('conquistas-texto');
    
    if (achievementsContainer && achievementsText && progress.achievements) {
        achievementsContainer.innerHTML = '';
        const emojiMap = {
            'Explorador Curioso': '🌍',
            'Mestre dos Vídeos': '🎬',
            'Leitor Voraz': '📚',
            'Gamer Dedicado': '🎮',
            'Sequência de 7 dias': '🔥'
        };
        
        progress.achievements.forEach(ach => {
            const badge = document.createElement('div');
            badge.className = 'flex flex-col items-center p-3 bg-white rounded-lg border-2 border-amber-300 hover:shadow-lg transition-shadow';
            badge.innerHTML = `
                <span class="text-4xl mb-1">${emojiMap[ach] || '🏆'}</span>
                <span class="text-xs font-medium text-gray-700 text-center">${ach}</span>
            `;
            achievementsContainer.appendChild(badge);
        });
        
        // Conquistas bloqueadas
        const totalAchievements = 10;
        for (let i = progress.achievements.length; i < totalAchievements; i++) {
            const locked = document.createElement('div');
            locked.className = 'flex flex-col items-center p-3 bg-gray-100 rounded-lg border-2 border-gray-300 opacity-50';
            locked.title = 'Ainda não desbloqueado';
            locked.innerHTML = `
                <span class="text-4xl mb-1">❓</span>
                <span class="text-xs text-gray-500">Bloqueado</span>
            `;
            achievementsContainer.appendChild(locked);
        }
        
        achievementsText.textContent = `${progress.achievements.length} de ${totalAchievements} conquistas desbloqueadas!`;
    }


    // Stats
    document.getElementById('stat-completed').textContent = progress.completed_activities || 0;
    
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
    
    document.getElementById('stat-time').textContent = timeText;
    document.getElementById('stat-streak').textContent = progress.streak_days || 0;
}

function renderUserActivities(activities) {
    const list = document.getElementById('atividades-recentes-lista');
    if (!list || !activities || !Array.isArray(activities)) return;
    
    list.innerHTML = '';
    
    if (activities.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center py-8">Nenhuma atividade ainda</p>';
        return;
    }
    
    document.getElementById('stat-in-progress').textContent = 
        activities.filter(a => a.status === 'in_progress').length;
    
    const statusIcons = {
        'completed': '<i class="fas fa-check-circle text-green-500 text-xl"></i>',
        'in_progress': '<i class="fas fa-spinner text-blue-500 text-xl"></i>',
        'not_started': '<i class="far fa-circle text-gray-400 text-xl"></i>'
    };

    const statusTexts = {
        'completed': 'Concluído',
        'in_progress': 'Em andamento',
        'not_started': 'Não iniciado'
    };

    const statusColors = {
        'completed': 'bg-green-50 border-green-200',
        'in_progress': 'bg-blue-50 border-blue-200',
        'not_started': 'bg-gray-50 border-gray-200'
    };

    activities.slice(0, 10).forEach(activity => {
        const li = document.createElement('li');
        li.className = `flex items-center justify-between p-4 rounded-lg border-2 ${statusColors[activity.status]} hover:shadow-md transition-shadow`;
        
        li.innerHTML = `
            <div class="flex items-center gap-4">
                ${statusIcons[activity.status] || statusIcons.not_started}
                <div>
                    <p class="font-medium text-gray-800">${activity.content?.title || 'Atividade'}</p>
                    <div class="flex items-center gap-3 mt-1">
                        <span class="text-sm text-gray-600">${statusTexts[activity.status]}</span>
                        ${activity.progress_percentage > 0 ? `
                            <span class="text-sm font-medium text-blue-600">${activity.progress_percentage}%</span>
                        ` : ''}
                    </div>
                </div>
            </div>
            ${activity.progress_percentage > 0 && activity.status === 'in_progress' ? `
                <div class="w-32">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-500 h-2 rounded-full" style="width: ${activity.progress_percentage}%"></div>
                    </div>
                </div>
            ` : ''}
        `;
        
        list.appendChild(li);
    });
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
        if (userState.user.user_type === 'guardian') {
        } else {
            header.innerHTML = `Seu Progresso, ${user.full_name.split(' ')[0]}! 📊`;
        }
    }

    // Navegação
    document.querySelectorAll('[data-route]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            window.router.navigate(element.dataset.route);
        });
    });

    // Carrega dados
    const loadProgress = async () => {
        try {
            let progress, activities;
            
            if (userState.user.user_type === 'guardian' && userState.user.student_id) {
                const studentId = userState.user.student_id;
                
                const student = await api.request(`/users/${studentId}`);
                
                const studentNameElement = document.getElementById('student-progresso-name');
                if (studentNameElement) {
                    studentNameElement.textContent = student.full_name;
                }
                
                const headerElement = document.getElementById('progresso-header');
                if (headerElement) {
                    headerElement.innerHTML = `Progresso de <span id="student-progresso-name">${student.full_name}</span> 📊`;
                }
                
                progress = await api.getStudentProgress(studentId);
                activities = await api.getStudentActivities(studentId);
            } else {
                progress = await api.getUserProgress();
                activities = await api.getUserActivities();
            }
            
            renderUserProgress(progress);
            renderUserActivities(activities);
        } catch (error) {
            console.error('Erro:', error);
            showCustomAlert('Erro ao carregar seu progresso.', 'Erro', 'error');
        }
    };
    
    loadProgress();
}