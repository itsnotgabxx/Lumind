// CORREÇÃO: Adicionando os imports necessários
import { api } from '../api.js';
import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

export default function AcompanhamentoPage() {
    return `
        <div class="w-full max-w-4xl mx-auto">
            <div class="text-center mb-8">
                <h1 class="screen-title">Acompanhamento do Responsável</h1>
                <p id="acompanhamento-responsavel-intro" class="screen-subtitle"></p>
            </div>

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

            <div class="card mb-8">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Progresso Geral</h3>
                    <p class="text-sm text-right text-gray-500" id="progresso-texto"></p>
                </div>
                <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div class="progress-bar-fill h-full rounded-full transition-all duration-500" style="width: 0%"></div>
                </div>
            </div>

            <div class="card">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Alertas e Observações</h3>
                <div class="space-y-3" id="alertas-container">
                    </div>
            </div>

            <div class="card mt-8">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Enviar Mensagem de Incentivo</h3>
                <form id="form-enviar-incentivo">
                    <textarea 
                        id="incentivo-textarea" 
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
    // O 'loading-overlay' não existe no seu index.html. 
    // Se você adicionar um, descomente estas linhas.
    // const loading = document.getElementById('loading-overlay');
    // if (loading) loading.style.display = 'flex';

    try {
        const user = userState.user;
        if (!user) {
            window.router.navigate('/login');
            return;
        }

        // Busca dados do progresso
        const progress = await api.getUserProgress();
        const activities = await api.getUserActivities();
        
        // Atualiza texto introdutório
        const intro = document.getElementById('acompanhamento-responsavel-intro');
        if (intro) {
            intro.innerHTML = `Acompanhe o progresso de ${user.full_name}.`;
        }

        // Atualiza tempo de estudo
        const tempoEstudo = document.getElementById('tempo-estudo');
        if (tempoEstudo) {
            // Assumindo que a API retorna 'total_time_spent' em minutos
            const horas = Math.floor((progress.total_time_spent || 0) / 60);
            tempoEstudo.textContent = `${horas}h`;
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
        // if (loading) loading.style.display = 'none';
    }
}

function renderAlertas(progress, activities) {
    const container = document.getElementById('alertas-container');
    if (!container) return;

    container.innerHTML = '';
    const alertas = gerarAlertas(progress, activities);

    if (alertas.length === 0) {
        container.innerHTML = '<p class="text-gray-600">Nenhum alerta ou observação no momento.</p>';
        return;
    }

    alertas.forEach(alerta => {
        const div = document.createElement('div');
        div.className = `alert-card p-4 rounded-lg border ${alerta.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`;
        
        div.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <i class="${alerta.icon} text-xl ${alerta.type === 'warning' ? 'text-yellow-500' : 'text-green-500'}"></i>
                </div>
                <div class="ml-3">
                    <h4 class="font-medium ${alerta.type === 'warning' ? 'text-yellow-800' : 'text-green-800'}">${alerta.title}</h4>
                    <p class="${alerta.type === 'warning' ? 'text-yellow-700' : 'text-green-700'}">${alerta.message}</p>
                </div>
            </div>
        `;
        
        container.appendChild(div);
    });
}

function gerarAlertas(progress, activities) {
    const alertas = [];
    const user = userState.user;
    if (!user) return [];

    // Verifica atividades em progresso
    const inProgress = activities.filter(a => a.status === 'in_progress');
    if (inProgress.length > 0) {
        alertas.push({
            type: 'warning',
            icon: 'fas fa-exclamation-circle',
            title: 'Atividades em Andamento',
            message: `${user.full_name} tem ${inProgress.length} atividade(s) em andamento.`
        });
    }

    // Adiciona observações positivas
    if (progress.completed_activities > 0) {
        alertas.push({
            type: 'info',
            icon: 'fas fa-star',
            title: 'Ótimo Desempenho',
            message: `${user.full_name} já completou ${progress.completed_activities} atividade(s)!`
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
            const textarea = document.getElementById('incentivo-textarea');
            const message = textarea.value;
            const user = userState.user;

            if (!user) {
                showCustomAlert('Usuário não encontrado. Faça login novamente.', 'Erro', 'error');
                return;
            }
            
            try {
                // CORREÇÃO: Chamando 'sendMessage' com o ID do usuário
                await api.sendMessage(user.id, message, 'incentive');
                showCustomAlert('Mensagem enviada com sucesso!', 'Sucesso', 'success');
                formIncentivo.reset();
            } catch (error) {
                showCustomAlert('Erro ao enviar mensagem', 'Erro', 'error');
            }
        });
    }

    // CORREÇÃO: Removido o listener 'routeChanged' que não existe.
}