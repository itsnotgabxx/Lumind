import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

// Função para converter dados do formulário para o formato da API
function formDataToUserCreate(formData, googleData = null) {
    const learningPreferences = [];
    const interests = formData.get('interesses') ? formData.get('interesses').split(',').map(i => i.trim()) : [];
    const distractions = formData.get('distracoes') || '';

    // Converte checkboxes de preferências de aprendizado
    const checkboxes = document.querySelectorAll('input[name="aprender_pref"]:checked');
    checkboxes.forEach(checkbox => {
        learningPreferences.push(checkbox.value);
    });

    const userData = {
        full_name: formData.get('nome-completo'),
        email: formData.get('email-cadastro'),
        password: formData.get('senha-cadastro') || '-', // '-' se vier do Google
        birth_date: formData.get('data-nascimento') ? new Date(formData.get('data-nascimento')).toISOString() : null,
        guardian_name: formData.get('nome-responsavel') || null,
        guardian_email: formData.get('email-responsavel') || null,
        learning_preferences: learningPreferences,
        interests: interests,
        distractions: distractions
    };

    // 👇 Se vier do Google, adiciona o firebase_uid
    if (googleData) {
        userData.firebase_uid = googleData.firebase_uid;
    }

    return userData;
}

export default function CadastroPage() {
    // 👇 VERIFICAR SE HÁ DADOS DO GOOGLE
    const googleData = sessionStorage.getItem('google_registration_data');
    const isGoogleSignup = !!googleData;
    
    return `
        <div class="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div class="w-full max-w-md card">
                <div class="lumind-logo-placeholder">L</div>
                <h1 class="lumind-brand-header">Lumind</h1>
                <p class="lumind-subheader">${isGoogleSignup ? 'Complete seu cadastro!' : 'Crie sua conta para começar a aprender!'}</p>
                
                ${isGoogleSignup ? `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p class="text-sm text-blue-800">
                            <i class="fab fa-google mr-2"></i>
                            Cadastrando com Google
                        </p>
                    </div>
                ` : ''}
                
                <form id="form-cadastro" action="#" method="POST" class="space-y-4">
                    <div>
                        <label for="nome-completo" class="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input type="text" id="nome-completo" name="nome-completo" required class="input-field">
                    </div>
                    <div>
                        <label for="email-cadastro" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email-cadastro" name="email-cadastro" required class="input-field" ${isGoogleSignup ? 'readonly' : ''}>
                    </div>
                    
                    ${!isGoogleSignup ? `
                        <div>
                            <label for="senha-cadastro" class="block text-sm font-medium text-gray-700">Senha</label>
                            <input type="password" id="senha-cadastro" name="senha-cadastro" required class="input-field">
                        </div>
                        <div>
                            <label for="confirmar-senha" class="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                            <input type="password" id="confirmar-senha" name="confirmar-senha" required class="input-field">
                        </div>
                    ` : ''}
                    
                    <div>
                        <label for="data-nascimento" class="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                        <input type="date" id="data-nascimento" name="data-nascimento" required class="input-field">
                    </div>
                    <div>
                        <label for="nome-responsavel" class="block text-sm font-medium text-gray-700">Nome do Responsável (Opcional)</label>
                        <input type="text" id="nome-responsavel" name="nome-responsavel" class="input-field">
                    </div>
                    <div>
                        <label for="email-responsavel" class="block text-sm font-medium text-gray-700">Email do Responsável (Opcional)</label>
                        <input type="email" id="email-responsavel" name="email-responsavel" class="input-field">
                    </div>
                    <button type="submit" class="w-full btn-primary">
                        <i class="fas fa-user-plus mr-2"></i>
                        ${isGoogleSignup ? 'Completar Cadastro' : 'Cadastrar'}
                    </button>
                </form>
                
                ${!isGoogleSignup ? `
                    <p class="mt-6 text-center text-sm">
                        Já tem uma conta? 
                        <span data-route="/login" class="link cursor-pointer">Entrar</span>
                    </p>
                ` : ''}
            </div>
        </div>
    `;
}

export function setup() {
    // 👇 PREENCHER CAMPOS COM DADOS DO GOOGLE
    const googleDataStr = sessionStorage.getItem('google_registration_data');
    let googleData = null;
    
    if (googleDataStr) {
        googleData = JSON.parse(googleDataStr);
        
        // Preencher campos
        document.getElementById('nome-completo').value = googleData.full_name || '';
        document.getElementById('email-cadastro').value = googleData.email || '';
        
        console.log('📝 Preenchendo formulário com dados do Google:', googleData);
    }

    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(formCadastro);

            // 👇 VALIDAR SENHA APENAS SE NÃO FOR CADASTRO GOOGLE
            if (!googleData) {
                const senha = formData.get('senha-cadastro');
                const confirmarSenha = formData.get('confirmar-senha');

                if (senha !== confirmarSenha) {
                    showCustomAlert("As senhas não coincidem. Tente novamente.", "Erro de Cadastro", "error");
                    return;
                }
            }

            const loading = document.getElementById('loading-overlay');
            loading.style.display = 'flex';

            try {
                const userData = formDataToUserCreate(formData, googleData);
                
                // 👇 USAR ENDPOINT DIFERENTE PARA CADASTRO GOOGLE
                if (googleData) {
                    await api.completeGoogleRegistration(userData);
                    sessionStorage.removeItem('google_registration_data');
                    console.log('✅ Cadastro Google completado');
                } else {
                    await api.register(userData);
                    console.log('✅ Cadastro tradicional completado');
                }
                
                // Atualiza o estado global
                userState.user = api.user;

                showCustomAlert(`Cadastro realizado! Preencha o questionário.`, "Bem-vindo(a)!", "success");
                window.router.navigate('/questionario');
            } catch (error) {
                showCustomAlert(error.message, "Erro no Cadastro", "error");
            } finally {
                loading.style.display = 'none';
            }
        });
    }

    // 👇 ADICIONAR LISTENER APENAS SE EXISTIR O ELEMENTO
    const loginLink = document.querySelector('span[data-route="/login"]');
    if (loginLink) {
        loginLink.addEventListener('click', () => {
            window.router.navigate('/login');
        });
    }
}