import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

// Função para converter dados do formulário para o formato da API
function formDataToUserCreate(formData) {
    const learningPreferences = [];
    const interests = formData.get('interesses') ? formData.get('interesses').split(',').map(i => i.trim()) : [];
    const distractions = formData.get('distracoes') || '';

    // Converte checkboxes de preferências de aprendizado
    const checkboxes = document.querySelectorAll('input[name="aprender_pref"]:checked');
    checkboxes.forEach(checkbox => {
        learningPreferences.push(checkbox.value);
    });

    return {
        full_name: formData.get('nome-completo'),
        email: formData.get('email-cadastro'),
        password: formData.get('senha-cadastro'),
        birth_date: formData.get('data-nascimento') ? new Date(formData.get('data-nascimento')).toISOString() : null,
        guardian_name: formData.get('nome-responsavel') || null,
        guardian_email: formData.get('email-responsavel') || null,
        learning_preferences: learningPreferences,
        interests: interests,
        distractions: distractions
    };
}

export default function CadastroPage() {
    return `
        <div class="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div class="w-full max-w-md card">
                <div class="lumind-logo-placeholder">L</div>
                <h1 class="lumind-brand-header">Lumind</h1>
                <p class="lumind-subheader">Crie sua conta para começar a aprender!</p>
                <form id="form-cadastro" action="#" method="POST" class="space-y-4">
                    <div>
                        <label for="nome-completo" class="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input type="text" id="nome-completo" name="nome-completo" required class="input-field">
                    </div>
                    <div>
                        <label for="email-cadastro" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email-cadastro" name="email-cadastro" required class="input-field">
                    </div>
                    <div>
                        <label for="senha-cadastro" class="block text-sm font-medium text-gray-700">Senha</label>
                        <input type="password" id="senha-cadastro" name="senha-cadastro" required class="input-field">
                    </div>
                    <div>
                        <label for="confirmar-senha" class="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                        <input type="password" id="confirmar-senha" name="confirmar-senha" required class="input-field">
                    </div>
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
                    <button type="submit" class="w-full btn-primary"><i class="fas fa-user-plus mr-2"></i>Cadastrar</button>
                </form>
                <p class="mt-6 text-center text-sm">
                    Já tem uma conta? 
                    <span data-route="/login" class="link cursor-pointer">Entrar</span>
                </p>
            </div>
        </div>
    `;
}

export function setup() {
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(formCadastro);
            const senha = formData.get('senha-cadastro');
            const confirmarSenha = formData.get('confirmar-senha');

            if (senha !== confirmarSenha) {
                showCustomAlert("As senhas não coincidem. Tente novamente.", "Erro de Cadastro", "error");
                return;
            }

            const loading = document.getElementById('loading-overlay');
            loading.style.display = 'flex';

            try {
                // A função 'formDataToUserCreate' já existe no seu api.js
                const userData = formDataToUserCreate(formData);
                await api.register(userData);
                
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

    document.querySelector('span[data-route="/login"]').addEventListener('click', () => {
        window.router.navigate('/login');
    });
}