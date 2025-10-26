/**
 * frontend/js/pages/home.js
 * * Esta é a página "home" ou "landing page" da sua aplicação.
 * Ela só é visível para usuários deslogados (convidados),
 * oferecendo as opções de login ou cadastro.
 */

// A função default exporta o HTML da página
export default function HomePage() {
    return `
        <div class="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div class="w-full max-w-md card text-center">
                <div class="lumind-logo-placeholder">L</div>
                <h1 class="lumind-brand-header">Bem-vindo ao Lumind</h1>
                <p class="lumind-subheader">Sua plataforma de aprendizado acessível e personalizada.</p>
                
                <div class="mt-8 flex flex-col sm:flex-row gap-4">
                    <button id="btn-home-login" class="btn-primary w-full text-lg">
                        <i class="fas fa-sign-in-alt mr-2"></i>Entrar
                    </button>
                    <button id="btn-home-cadastro" class="btn-secondary w-full text-lg">
                        <i class="fas fa-user-plus mr-2"></i>Criar Conta
                    </button>
                </div>
            </div>
        </div>
    `;
}

// A função setup adiciona os event listeners
export function setup() {
    // Adiciona listener para o botão de Login
    const btnLogin = document.getElementById('btn-home-login');
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            window.router.navigate('/login');
        });
    }

    // Adiciona listener para o botão de Cadastro
    const btnCadastro = document.getElementById('btn-home-cadastro');
    if (btnCadastro) {
        btnCadastro.addEventListener('click', () => {
            window.router.navigate('/cadastro');
        });
    }
}