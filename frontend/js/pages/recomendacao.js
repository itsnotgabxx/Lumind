import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

// Retorna o HTML da página
export default function RecomendacaoPage() {
    return `
        <div class="items-start pt-8 w-full">
            <div class="container mx-auto px-4 w-full"> 
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                    <div class="w-full sm:w-auto text-center sm:text-left">
                        <h1 id="recomendacao-header" class="screen-title">Olá!</h1>
                        <p class="screen-subtitle">Sugestões para você explorar:</p>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button data-route="/perfil" class="btn-subtle text-sm w-full sm:w-auto">
                            <i class="fas fa-user-circle mr-2"></i> Meu Perfil
                        </button>
                        <button data-route="/acompanhamento" class="btn-subtle w-full sm:w-auto text-sm border-teal-300 text-teal-600 hover:bg-teal-50 hover:border-teal-500">
                            <i class="fas fa-user-shield mr-2"></i> Responsável
                        </button>
                    </div>
                </div>
                
                <div class="mb-10">
                    <h2 class="text-xl font-semibold mb-4 flex items-center text-gray-700"><i class="fas fa-star mr-2 text-amber-400"></i>Para Você</h2>
                    <div id="recomendacao-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <p>Carregando recomendações...</p>
                    </div>
                </div>

                <div class="mb-6">
                    <h2 class="text-xl font-semibold mb-4 flex items-center text-gray-700"><i class="fas fa-lightbulb mr-2 text-teal-400"></i>Novidades</h2>
                    <div class="card bg-gray-50">
                        <p class="text-gray-600"><i class="fas fa-info-circle mr-2 text-blue-500"></i>Mais conteúdos e temas incríveis chegando em breve!</p>
                    </div>
                </div>
                <div class="text-right mt-10">
                    <button data-route="/progresso" class="btn-primary">
                        <i class="fas fa-chart-line mr-2"></i> Ver Meu Progresso
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Renderiza os cards de recomendação (movido do script.js)
function renderRecommendations(recommendations) {
    const grid = document.getElementById('recomendacao-grid');
    if (!grid || !Array.isArray(recommendations)) return;

    grid.innerHTML = ''; // Limpa o "Carregando..."

    if (recommendations.length === 0) {
        grid.innerHTML = '<p class="text-gray-600">Nenhuma recomendação encontrada ainda. Explore alguns conteúdos!</p>';
        return;
    }

    recommendations.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card transform hover:shadow-lg transition-shadow duration-300 flex flex-col';

        const img = document.createElement('img');
        img.src = item.image_url || 'images/math.png';
        img.alt = item.title;
        img.className = 'rounded-md mb-4 w-full h-48 object-cover';
        card.appendChild(img);

        const h3 = document.createElement('h3');
        h3.className = 'text-lg font-semibold mb-2 text-gray-800';
        h3.textContent = item.title;
        card.appendChild(h3);

        const p = document.createElement('p');
        p.className = 'text-gray-600 text-sm mb-3 flex-grow';
        p.textContent = item.description || '';
        card.appendChild(p);

        const tag = document.createElement('span');
        tag.className = 'content-tag self-start mb-4';
        tag.innerHTML = item.type === 'video' ? '<i class="fas fa-video mr-1"></i> Vídeo' : (item.type === 'text' ? '<i class="fas fa-book-open mr-1"></i> Leitura' : '<i class="fas fa-puzzle-piece mr-1"></i> Jogo');
        card.appendChild(tag);

        const btn = document.createElement('button');
        btn.className = 'mt-auto w-full btn-secondary text-sm btn-explorar-conteudo';
        // Armazena os dados no botão para o event listener
        btn.dataset.contentId = item.id;
        btn.dataset.contentTitle = item.title;
        btn.innerHTML = '<i class="fas fa-play-circle mr-2"></i>Explorar';
        card.appendChild(btn);

        grid.appendChild(card);
    });
}

// Configura os event listeners da página
export function setup() {
    // Atualiza o cabeçalho
    const recomendacaoHeader = document.getElementById('recomendacao-header');
    if (recomendacaoHeader && userState.user) {
        recomendacaoHeader.innerHTML = `Olá, ${userState.user.full_name}!`;
    }

    // Adiciona listeners para os links de navegação
    document.querySelectorAll('[data-route]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            window.router.navigate(element.dataset.route);
        });
    });

    // Carrega as recomendações
    const loadRecommendations = async () => {
        try {
            const recommendations = await api.getRecommendations();
            renderRecommendations(recommendations);
        } catch (error) {
            showCustomAlert('Erro ao carregar recomendações', 'Erro', 'error');
            const grid = document.getElementById('recomendacao-grid');
            if(grid) grid.innerHTML = '<p class="text-red-500">Não foi possível carregar as recomendações. Tente recarregar a página.</p>';
        }
    };
    
    loadRecommendations();

    // Listener para os botões "Explorar" (delegação de evento)
    const grid = document.getElementById('recomendacao-grid');
    if (grid) {
        grid.addEventListener('click', (ev) => {
            const btn = ev.target.closest('.btn-explorar-conteudo');
            if (!btn) return;

            const contentId = btn.dataset.contentId;
            const contentTitle = btn.dataset.contentTitle;

            // Passa os dados para a próxima rota usando o state do History API
            window.router.navigate(`/conteudo/${contentId}`, {
                contentId: contentId,
                contentTitle: contentTitle
            });
        });
    }
}