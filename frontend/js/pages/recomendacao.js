import { api } from '../api.js';
import { ContentCard } from '../components/ContentCard.js';
import { showCustomAlert } from '../utils/alert.js';

export function setupRecomendacaoPage() {
    // Atualiza o cabeçalho com o nome do usuário
    document.addEventListener('screenContentUpdate', async () => {
        const recomendacaoHeader = document.getElementById('recomendacao-header');
        if (recomendacaoHeader && api.user) {
            recomendacaoHeader.innerHTML = `Olá, ${api.user.full_name}!`;
        }

        // Carrega e renderiza as recomendações
        try {
            const recommendations = await api.getRecommendations();
            renderRecommendations(recommendations);
        } catch (error) {
            showCustomAlert('Erro ao carregar recomendações', 'Erro', 'error');
        }
    });
}

function renderRecommendations(recommendations) {
    const grid = document.querySelector('#recomendacao-grid');
    if (!grid || !Array.isArray(recommendations)) return;

    grid.innerHTML = '';

    recommendations.forEach(item => {
        const contentCard = new ContentCard(item);
        grid.appendChild(contentCard.render());
    });
}