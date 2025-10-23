export async function loadPage(pageId) {
    try {
        const response = await fetch(`pages/${pageId}.html`);
        const html = await response.text();
        document.getElementById(pageId).innerHTML = html;
    } catch (error) {
        console.error(`Erro ao carregar a página ${pageId}:`, error);
    }
}

export function setupPageLoading() {
    // Lista de páginas para pré-carregar
    const pages = [
        'login',
        'cadastro',
        'questionario',
        'recomendacao',
        'progressoUsuario',
        'acompanhamentoResponsavel',
        'acessoConteudo',
        'perfilUsuario'
    ];
    
    // Carrega todas as páginas
    pages.forEach(loadPage);
}