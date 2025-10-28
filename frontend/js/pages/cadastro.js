import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

function formDataToUserCreate(formData, googleData = null) {
    const learningPreferences = [];
    const interests = formData.get('interesses') ? formData.get('interesses').split(',').map(i => i.trim()) : [];
    const distractions = formData.get('distracoes') || '';

    const checkboxes = document.querySelectorAll('input[name="aprender_pref"]:checked');
    checkboxes.forEach(checkbox => {
        learningPreferences.push(checkbox.value);
    });

    const userData = {
        full_name: formData.get('nome-completo'),
        email: formData.get('email-cadastro'),
        password: formData.get('senha-cadastro') || '-',
        birth_date: formData.get('data-nascimento') ? new Date(formData.get('data-nascimento')).toISOString() : null,
        guardian_name: formData.get('nome-responsavel') || null,
        guardian_email: formData.get('email-responsavel') || null,
        learning_preferences: learningPreferences,
        interests: interests,
        distractions: distractions
    };

    if (googleData) {
        userData.firebase_uid = googleData.firebase_uid;
    }

    return userData;
}

export default function CadastroPage() {
    const googleData = sessionStorage.getItem('google_registration_data');
    const isGoogleSignup = !!googleData;
    
    return `
        <div class="min-h-screen py-12 px-4">
            <div class="w-full max-w-2xl mx-auto">
                <!-- Cabeçalho -->
                <div class="text-center mb-8">
                    <div class="lumind-logo-placeholder mb-4 mx-auto">L</div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">
                        ${isGoogleSignup ? 'Complete seu Cadastro' : 'Criar Conta'}
                    </h1>
                    <p class="text-gray-600">
                        ${isGoogleSignup ? 'Só mais algumas informações e você estará pronto!' : 'Junte-se a centenas de alunos que já estão aprendendo!'}
                    </p>
                </div>

                ${isGoogleSignup ? `
                    <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <i class="fab fa-google text-2xl text-blue-600"></i>
                        <div>
                            <p class="font-semibold text-blue-900">Cadastrando com Google</p>
                            <p class="text-sm text-blue-700">Sua conta será vinculada ao Google</p>
                        </div>
                    </div>
                ` : ''}
                
                <div class="card">
                    <form id="form-cadastro" class="space-y-6">
                        <!-- Informações Pessoais -->
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-user mr-2 text-purple-500"></i>
                                Informações Pessoais
                            </h3>
                            
                            <div class="space-y-4">
                                <div>
                                    <label for="nome-completo" class="block text-sm font-medium text-gray-700 mb-2">
                                        Nome Completo *
                                    </label>
                                    <input 
                                        type="text" 
                                        id="nome-completo" 
                                        name="nome-completo" 
                                        required 
                                        class="input-field"
                                        placeholder="João Silva"
                                    >
                                </div>

                                <div>
                                    <label for="email-cadastro" class="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input 
                                        type="email" 
                                        id="email-cadastro" 
                                        name="email-cadastro" 
                                        required 
                                        class="input-field"
                                        placeholder="joao@exemplo.com"
                                        ${isGoogleSignup ? 'readonly' : ''}
                                    >
                                </div>

                                ${!isGoogleSignup ? `
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label for="senha-cadastro" class="block text-sm font-medium text-gray-700 mb-2">
                                                Senha *
                                            </label>
                                            <input 
                                                type="password" 
                                                id="senha-cadastro" 
                                                name="senha-cadastro" 
                                                required 
                                                class="input-field"
                                                placeholder="••••••••"
                                                minlength="6"
                                            >
                                            <p class="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
                                        </div>
                                        <div>
                                            <label for="confirmar-senha" class="block text-sm font-medium text-gray-700 mb-2">
                                                Confirmar Senha *
                                            </label>
                                            <input 
                                                type="password" 
                                                id="confirmar-senha" 
                                                name="confirmar-senha" 
                                                required 
                                                class="input-field"
                                                placeholder="••••••••"
                                            >
                                        </div>
                                    </div>
                                ` : ''}

                                <div>
                                    <label for="data-nascimento" class="block text-sm font-medium text-gray-700 mb-2">
                                        Data de Nascimento *
                                    </label>
                                    <input 
                                        type="date" 
                                        id="data-nascimento" 
                                        name="data-nascimento" 
                                        required 
                                        class="input-field"
                                    >
                                </div>
                            </div>
                        </div>

                        <!-- Responsável (Opcional) -->
                        <div class="border-t pt-6">
                            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-user-shield mr-2 text-teal-500"></i>
                                Responsável (Opcional)
                            </h3>
                            <p class="text-sm text-gray-600 mb-4">
                                Caso você seja menor de idade ou queira que um responsável acompanhe seu progresso
                            </p>
                            
                            <div class="space-y-4">
                                <div>
                                    <label for="nome-responsavel" class="block text-sm font-medium text-gray-700 mb-2">
                                        Nome do Responsável
                                    </label>
                                    <input 
                                        type="text" 
                                        id="nome-responsavel" 
                                        name="nome-responsavel" 
                                        class="input-field"
                                        placeholder="Maria Silva"
                                    >
                                </div>

                                <div>
                                    <label for="email-responsavel" class="block text-sm font-medium text-gray-700 mb-2">
                                        Email do Responsável
                                    </label>
                                    <input 
                                        type="email" 
                                        id="email-responsavel" 
                                        name="email-responsavel" 
                                        class="input-field"
                                        placeholder="maria@exemplo.com"
                                    >
                                </div>
                            </div>
                        </div>

                        <!-- Termos -->
                        <div class="border-t pt-6">
                            <label class="flex items-start gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    id="aceitar-termos" 
                                    required 
                                    class="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                >
                                <span class="text-sm text-gray-600">
                                    Eu li e concordo com os 
                                    <a href="#" class="link">Termos de Uso</a> e 
                                    <a href="#" class="link">Política de Privacidade</a>
                                </span>
                            </label>
                        </div>

                        <!-- Botão -->
                        <button type="submit" class="w-full btn-primary py-3 text-lg">
                            <i class="fas fa-user-plus mr-2"></i>
                            ${isGoogleSignup ? 'Completar Cadastro' : 'Criar Minha Conta'}
                        </button>
                    </form>

                    ${!isGoogleSignup ? `
                        <div class="mt-6 text-center">
                            <p class="text-sm text-gray-600">
                                Já tem uma conta?
                                <a href="/login" class="link font-semibold" data-link>
                                    Fazer login
                                </a>
                            </p>
                        </div>
                    ` : ''}
                </div>

                <!-- Benefícios -->
                <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="text-center">
                        <i class="fas fa-check-circle text-3xl text-green-500 mb-2"></i>
                        <p class="text-sm font-medium text-gray-700">100% Gratuito</p>
                    </div>
                    <div class="text-center">
                        <i class="fas fa-lock text-3xl text-blue-500 mb-2"></i>
                        <p class="text-sm font-medium text-gray-700">Dados Seguros</p>
                    </div>
                    <div class="text-center">
                        <i class="fas fa-smile text-3xl text-amber-500 mb-2"></i>
                        <p class="text-sm font-medium text-gray-700">Fácil de Usar</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function setup() {
    const googleDataStr = sessionStorage.getItem('google_registration_data');
    let googleData = null;
    
    if (googleDataStr) {
        googleData = JSON.parse(googleDataStr);
        document.getElementById('nome-completo').value = googleData.full_name || '';
        document.getElementById('email-cadastro').value = googleData.email || '';
    }

    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(formCadastro);

            // Validar senha apenas se não for Google
            if (!googleData) {
                const senha = formData.get('senha-cadastro');
                const confirmarSenha = formData.get('confirmar-senha');

                if (senha !== confirmarSenha) {
                    showCustomAlert("As senhas não coincidem. Tente novamente.", "Erro de Cadastro", "error");
                    return;
                }

                if (senha.length < 6) {
                    showCustomAlert("A senha deve ter pelo menos 6 caracteres.", "Senha muito curta", "error");
                    return;
                }
            }

            // Verificar termos
            if (!document.getElementById('aceitar-termos').checked) {
                showCustomAlert("Você precisa aceitar os termos para continuar.", "Termos não aceitos", "warning");
                return;
            }

            const loading = document.getElementById('loading-overlay');
            loading.style.display = 'flex';

            try {
                const userData = formDataToUserCreate(formData, googleData);
                
                if (googleData) {
                    await api.completeGoogleRegistration(userData);
                    sessionStorage.removeItem('google_registration_data');
                } else {
                    await api.register(userData);
                }
                
                userState.user = api.user;

                showCustomAlert(
                    `Cadastro realizado com sucesso! Agora vamos personalizar sua experiência.`, 
                    "Bem-vindo(a) ao Lumind! 🎉", 
                    "success"
                );
                
                setTimeout(() => {
                    window.router.navigate('/questionario');
                }, 1500);
            } catch (error) {
                showCustomAlert(error.message || 'Erro ao criar conta', "Erro no Cadastro", "error");
            } finally {
                loading.style.display = 'none';
            }
        });
    }
}