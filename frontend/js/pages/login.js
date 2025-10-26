import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

// A função default exporta o HTML da página
export default function LoginPage() {
    return `
        <div class="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div class="w-full max-w-md card">
                <div class="lumind-logo-placeholder">L</div>
                <h1 class="lumind-brand-header">Lumind</h1>
                <p class="lumind-subheader">Bem-vindo(a) de volta!</p>
                <form id="form-login" action="#" method="POST" class="space-y-4">
                    <div>
                        <label for="email-login" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email-login" name="email-login" required class="input-field" value="sky@exemplo.com">
                    </div>
                    <div>
                        <label for="senha-login" class="block text-sm font-medium text-gray-700">Senha</label>
                        <input type="password" id="senha-login" name="senha-login" required class="input-field" value="senha123">
                    </div>
                    <button type="submit" class="w-full btn-primary"><i class="fas fa-sign-in-alt mr-2"></i>Entrar</button>
                </form>
                <div class="mt-6 text-center text-sm">
                    <p>
                        <span data-route="/esqueciSenha" class="link cursor-pointer">Esqueci minha senha</span>
                    </p>
                    <p class="mt-2">
                        Não tem uma conta? 
                        <span data-route="/cadastro" class="link cursor-pointer">Cadastre-se</span>
                    </p>
                </div>
            </div>
        </div>
    `;
}

// A função setup adiciona os event listeners
export function setup() {
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async function(event) {
            event.preventDefault();
            const email = document.getElementById('email-login').value;
            const loading = document.getElementById('loading-overlay');
            loading.style.display = 'flex';

            try {
                // 'api' está disponível globalmente via main.js
                await api.login(email); 
                
                // Atualiza o estado global do usuário
                userState.user = api.user;
                
                // Navega para a página de recomendações
                window.router.navigate('/recomendacao');
            } catch (error) {
                showCustomAlert(error.message, "Erro no Login", "error");
            } finally {
                loading.style.display = 'none';
            }
        });
    }

    // Adiciona listeners para os links de navegação
    document.querySelector('span[data-route="/esqueciSenha"]').addEventListener('click', () => {
        window.router.navigate('/esqueciSenha');
    });

    document.querySelector('span[data-route="/cadastro"]').addEventListener('click', () => {
        window.router.navigate('/cadastro');
    });
}