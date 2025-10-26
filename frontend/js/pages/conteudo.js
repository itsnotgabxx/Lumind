import { api } from '../api.js';
import { showCustomAlert } from '../utils/alert.js';

export default async function ConteudoPage({ params }) {
    const contentId = params.id;
    let content;

    try {
        content = await api.getContentById(contentId); 
    } catch (error) {
        showCustomAlert('Erro ao carregar conteúdo', 'Erro', 'error');
        window.router.navigate('/recomendacao');
        return '<p>Erro ao carregar...</p>';
    }

    return `
        <div class="w-full max-w-4xl mx-auto">
            <header class="mb-6">
                <h1 id="acesso-conteudo-header" class="screen-title">${content.title}</h1>
                <div class="flex justify-between items-center">
                    <span class="content-tag">${getContentTypeIcon(content.type)}</span>
                    <button id="btn-fechar-conteudo" class="btn-subtle">
                        <i class="fas fa-times mr-2"></i>Fechar
                    </button>
                </div>
            </header>

            <div id="conteudo-wrapper" class="card">
                ${await renderContent(content)}
            </div>

            <div class="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <select id="font-size-content" class="input-field w-full sm:w-48">
                    <option value="normal">Tamanho do Texto</option>
                    <option value="large">Texto Grande (1.2em)</option>
                    <option value="larger">Texto Maior (1.4em)</option>
                </select>

                <button id="btn-marcar-concluido" class="btn-primary w-full sm:w-auto">
                    <i class="fas fa-check mr-2"></i>Marcar como Concluído
                </button>
            </div>
        </div>
    `;
}

function getContentTypeIcon(type) {
    switch(type) {
        case 'video':
            return '<i class="fas fa-video mr-1"></i> Vídeo';
        case 'text':
            return '<i class="fas fa-book-open mr-1"></i> Leitura';
        default:
            return '<i class="fas fa-puzzle-piece mr-1"></i> Jogo';
    }
}

async function renderContent(content) {
    switch(content.type) {
        case 'video':
            return await import('./content/VideoPlayer.js')
                .then(module => module.default(content));
        case 'text':
            return await import('./content/TextContent.js')
                .then(module => module.default(content));
        case 'interactive_game':
            return await import('./content/GameContent.js')
                .then(module => module.default(content));
        default:
            return '<p>Tipo de conteúdo não suportado</p>';
    }
}

export function setup({ params }) {
    const contentId = params.id;

    const btnFechar = document.getElementById('btn-fechar-conteudo');
    if (btnFechar) {
        btnFechar.addEventListener('click', () => {
            window.router.navigate('/recomendacao');
        });
    }

    const fontSizeSelect = document.getElementById('font-size-content');
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', (e) => {
            const wrapper = document.getElementById('conteudo-wrapper');
            wrapper.style.fontSize = e.target.value === 'normal' ? '' : 
                                   e.target.value === 'large' ? '1.2em' : '1.4em';
        });
    }

    const btnConcluido = document.getElementById('btn-marcar-concluido');
    if (btnConcluido) {
        btnConcluido.addEventListener('click', async () => {
            try {
                await api.updateProgress(contentId, 'completed', 100, 0);
                showCustomAlert('Conteúdo marcado como concluído!', 'Sucesso', 'success');
                window.router.navigate('/progresso');
            } catch (error) {
                showCustomAlert('Erro ao marcar como concluído', 'Erro', 'error');
            }
        });
    }
}