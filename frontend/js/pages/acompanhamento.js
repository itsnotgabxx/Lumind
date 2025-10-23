export default function AcompanhamentoPage() {
    return `
        <div class="w-full max-w-4xl mx-auto">
            <div class="text-center mb-8">
                <h1 class="screen-title">Acompanhamento do Responsável</h1>
                <p id="acompanhamento-responsavel-intro" class="screen-subtitle"></p>
            </div>

            <!-- Visão Geral -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="card">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Tempo de Estudo</h3>
                    <p class="text-xl font-semibold text-gray-800" id="tempo-estudo">0h</p>
                    <p class="text-sm text-gray-500">Nesta semana</p>
                </div>
                
                <div class="card">
                    <h3 class="text-lg font-semibold text-gray-800 mb-3">Atividades Concluídas</h3>
                    <p class="text-xl font-semibold text-gray-800" id="atividades-concluidas">0</p>
                    <p class="text-sm text-gray-500">Total</p>
                </div>
            </div>

            <!-- Progresso -->
            <div class="card mb-8">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Progresso Geral</h3>
                    <p class="text-sm text-right text-gray-500" id="progresso-texto"></p>
                </div>
                <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div class="progress-bar-fill h-full rounded-full transition-all duration-500" style="width: 0%"></div>
                </div>
            </div>

            <!-- Alertas e Observações -->
            <div class="card">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Alertas e Observações</h3>
                <div class="space-y-3" id="alertas-container">
                    <!-- Alertas serão inseridos aqui dinamicamente -->
                </div>
            </div>

            <!-- Enviar Incentivo -->
            <div class="card mt-8">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Enviar Mensagem de Incentivo</h3>
                <form id="form-enviar-incentivo">
                    <textarea 
                        class="input-field" 
                        rows="4" 
                        placeholder="Escreva uma mensagem positiva..."
                        required
                    ></textarea>
                    <button type="submit" class="btn-primary w-full mt-4">
                        <i class="fas fa-paper-plane mr-2"></i>Enviar Mensagem
                    </button>
                </form>
            </div>
        </div>
    `;
}

export function setup() {
    updateAcompanhamentoData();
    setupEventListeners();
}

async function updateAcompanhamentoData() {
    const loading = document.getElementById('loading-overlay');
    loading.style.display = 'flex';

    try {
        // Busca dados do progresso
        const progress = await api.getUserProgress();
        const activities = await api.getUserActivities();
        
        // Atualiza texto introdutório
        const intro = document.getElementById('acompanhamento-responsavel-intro');
        if (intro && api.user) {
            intro.innerHTML = `Acompanhe o progresso de ${api.user.full_name}.`;
        }

        // Atualiza tempo de estudo
        const tempoEstudo = document.getElementById('tempo-estudo');
        if (tempoEstudo) {
            tempoEstudo.textContent = `${progress.study_time_week || 0}h`;
        }

        // Atualiza atividades concluídas
        const atividadesConcluidas = document.getElementById('atividades-concluidas');
        if (atividadesConcluidas) {
            atividadesConcluidas.textContent = progress.completed_activities || 0;
        }

        // Atualiza barra de progresso
        const progressBar = document.querySelector('.progress-bar-fill');
        const progressoTexto = document.getElementById('progresso-texto');
        if (progressBar && progressoTexto) {
            progressBar.style.width = `${progress.progress_percentage}%`;
            progressoTexto.textContent = `${progress.progress_percentage}% concluído`;
        }

        // Renderiza alertas
        renderAlertas(progress, activities);

    } catch (error) {
        showCustomAlert('Erro ao carregar dados de acompanhamento', 'Erro', 'error');
    } finally {
        loading.style.display = 'none';
    }
}

function renderAlertas(progress, activities) {
    const container = document.getElementById('alertas-container');
    if (!container) return;

    container.innerHTML = '';
    const alertas = gerarAlertas(progress, activities);

    alertas.forEach(alerta => {
        const div = document.createElement('div');
        div.className = `alert-card p-4 rounded-lg border ${alerta.type === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`;
        
        div.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <i class="${alerta.icon} text-xl ${alerta.type === 'warning' ? 'text-amber-500' : 'text-blue-500'}"></i>
                </div>
                <div class="ml-3">
                    <h4 class="font-medium ${alerta.type === 'warning' ? 'text-amber-800' : 'text-blue-800'}">${alerta.title}</h4>
                    <p class="${alerta.type === 'warning' ? 'text-amber-700' : 'text-blue-700'}">${alerta.message}</p>
                </div>
            </div>
        `;
        
        container.appendChild(div);
    });
}

function gerarAlertas(progress, activities) {
    const alertas = [];

    // Verifica inatividade
    const ultimaAtividade = activities[0]?.timestamp;
    if (ultimaAtividade) {
        const diasInativo = Math.floor((new Date() - new Date(ultimaAtividade)) / (1000 * 60 * 60 * 24));
        if (diasInativo > 7) {
            alertas.push({
                type: 'warning',
                icon: 'fas fa-exclamation-circle',
                title: 'Período de Inatividade',
                message: `Não há atividades registradas nos últimos ${diasInativo} dias.`
            });
        }
    }

    // Verifica progresso lento
    if (progress.progress_percentage < 30) {
        alertas.push({
            type: 'info',
            icon: 'fas fa-info-circle',
            title: 'Sugestão',
            message: 'Que tal estabelecer metas diárias de estudo?'
        });
    }

    // Adiciona observações positivas
    if (progress.study_time_week > 5) {
        alertas.push({
            type: 'info',
            icon: 'fas fa-star',
            title: 'Ótimo Desempenho',
            message: 'Dedicou bastante tempo aos estudos esta semana!'
        });
    }

    return alertas;
}

function setupEventListeners() {
    // Form de envio de incentivo
    const formIncentivo = document.getElementById('form-enviar-incentivo');
    if (formIncentivo) {
        formIncentivo.addEventListener('submit', async (event) => {
            event.preventDefault();
            const message = formIncentivo.querySelector('textarea').value;
            
            try {
                await api.sendIncentiveMessage(message);
                showCustomAlert('Mensagem enviada com sucesso!', 'Sucesso', 'success');
                formIncentivo.reset();
            } catch (error) {
                showCustomAlert('Erro ao enviar mensagem', 'Erro', 'error');
            }
        });
    }

    // Atualiza dados quando a rota é acessada
    window.addEventListener('routeChanged', (event) => {
        if (event.detail.path === '/acompanhamento') {
            updateAcompanhamentoData();
        }
    });
}