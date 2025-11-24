import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';
import { auth, provider, signInWithPopup } from '../config/firebaseConfig.js';

export default function LoginPage() {
    const userType = sessionStorage.getItem('selected_user_type') || 'student';
    const isGuardian = userType === 'guardian';
    
    return `
        <div class="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div class="w-full max-w-md card">
                <!-- Indicador do tipo de login -->
                <div class="text-center mb-4">
                    <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        isGuardian ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }">
                        <i class="fas ${isGuardian ? 'fa-user-shield' : 'fa-graduation-cap'} mr-1"></i>
                        ${isGuardian ? 'Área do Responsável' : 'Área do Estudante'}
                    </div>
                    <button id="btn-change-type" class="text-xs text-gray-500 hover:text-gray-700 ml-2 underline">
                        alterar
                    </button>
                </div>

                <div class="lumind-logo-placeholder">L</div>
                <h1 class="lumind-brand-header">Lumind</h1>
                <p class="lumind-subheader">
                    ${isGuardian ? 
                        'Acompanhe o desenvolvimento do seu estudante!' : 
                        'Bem-vindo(a) de volta!'
                    }
                </p>

                <form id="form-login" action="#" method="POST" class="space-y-4">
                    <div>
                        <label for="email-login" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email-login" name="email-login" required class="input-field" 
                               placeholder="${isGuardian ? 'Email do responsável' : 'Seu email'}"
                               value="sky@exemplo.com">
                    </div>
                    <div>
                        <label for="senha-login" class="block text-sm font-medium text-gray-700">Senha</label>
                        <input type="password" id="senha-login" name="senha-login" required class="input-field" value="senha123">
                    </div>
                    
                    ${isGuardian ? `
                        <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <div class="flex items-start">
                                <i class="fas fa-info-circle text-purple-600 mt-1 mr-2"></i>
                                <div class="text-sm text-purple-700">
                                    <strong>Para responsáveis:</strong> Use suas credenciais para acessar o painel de acompanhamento.
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    <button type="submit" class="w-full btn-primary">
                        <i class="fas fa-sign-in-alt mr-2"></i>
                        ${isGuardian ? 'Entrar como Responsável' : 'Entrar'}
                    </button>
                </form>

                <!-- Botão Google (mantém o mesmo para ambos) -->
                <div class="mt-4">
                    <button id="btn-google" class="w-full btn-secondary flex justify-center items-center gap-2">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="w-5 h-5">
                        Entrar com Google
                    </button>
                </div>

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

export function setup() {
    const formLogin = document.getElementById('form-login');
    const btnGoogle = document.getElementById('btn-google');
    const btnChangeType = document.getElementById('btn-change-type');
    const loading = document.getElementById('loading-overlay');
    
    const userType = sessionStorage.getItem('selected_user_type') || 'student';
    const isGuardian = userType === 'guardian';

    if (btnChangeType) {
        btnChangeType.addEventListener('click', () => {
            sessionStorage.removeItem('selected_user_type');
            window.router.navigate('/login-type');
        });
    }

    if (formLogin) {
        formLogin.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email-login').value;
            loading.style.display = 'flex';

            try {
                await api.login(email);
                userState.user = api.user;
                
                if (userState.user.user_type === 'guardian') {
                    window.router.navigate('/acompanhamento');
                } else {
                    window.router.navigate('/recomendacao');
                }
            } catch (error) {
                showCustomAlert(error.message, "Erro no Login", "error");
            } finally {
                loading.style.display = 'none';
            }
        });
    }

    // 👇 novo listener para login com Google
  if (btnGoogle) {
    btnGoogle.addEventListener('click', async () => {
        loading.style.display = 'flex';
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const token = await user.getIdToken();

            // Envia o token para o backend
            const response = await api.googleLogin(token);

            // 👇 VERIFICAR SE É USUÁRIO NOVO
            if (response.isNewUser) {
                // Salva dados do Google temporariamente
                sessionStorage.setItem('google_registration_data', JSON.stringify(response.googleData));
                
                // Redireciona para cadastro
                showCustomAlert(
                    "Bem-vindo! Complete seu cadastro para continuar.",
                    "Primeiro acesso",
                    "info"
                );
                window.router.navigate('/cadastro');
            } else {
                // Login bem-sucedido
                userState.user = response.user;
                showCustomAlert("Login com Google realizado com sucesso!", "Bem-vindo(a)", "success");
                
                if (userState.user.user_type === 'guardian') {
                    window.router.navigate('/acompanhamento');
                } else {
                    window.router.navigate('/recomendacao');
                }
            }
        } catch (err) {
            console.error(err);
            showCustomAlert("Erro ao fazer login com Google", "Erro", "error");
        } finally {
            loading.style.display = 'none';
        }
    });
}


    document.querySelector('span[data-route="/esqueciSenha"]').addEventListener('click', () => {
        window.router.navigate('/esqueciSenha');
    });

    document.querySelector('span[data-route="/cadastro"]').addEventListener('click', () => {
        window.router.navigate('/cadastro');
    });
}
