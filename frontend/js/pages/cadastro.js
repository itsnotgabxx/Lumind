import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

function formDataToUserCreate(formData, googleData = null) {
    const userType = sessionStorage.getItem('selected_user_type') || 'student';
    const isGuardian = userType === 'guardian';
    
    const learningPreferences = [];
    const interests = formData.get('interesses') ? formData.get('interesses').split(',').map(i => i.trim()) : [];
    const distractions = formData.get('distracoes') || '';

    if (!isGuardian) {
        const checkboxes = document.querySelectorAll('input[name="aprender_pref"]:checked');
        checkboxes.forEach(checkbox => {
            learningPreferences.push(checkbox.value);
        });
    }

    const userData = {
        full_name: formData.get('nome-completo'),
        email: formData.get('email-cadastro'),
        password: formData.get('senha-cadastro') || '-',
        user_type: userType,
        birth_date: formData.get('data-nascimento') ? new Date(formData.get('data-nascimento')).toISOString() : null,
        guardian_name: formData.get('nome-responsavel') || null,
        guardian_email: formData.get('email-responsavel') || null,
        learning_preferences: learningPreferences,
        interests: interests,
        distractions: distractions
    };

    if (isGuardian) {
        const studentOption = document.querySelector('input[name="student-option"]:checked')?.value;
        
        if (studentOption === 'create') {
            userData.create_student = {
                full_name: formData.get('nome-estudante'),
                email: formData.get('email-novo-estudante'),
                password: formData.get('senha-estudante'),
                birth_date: formData.get('data-nascimento-estudante') ? new Date(formData.get('data-nascimento-estudante')).toISOString() : null,
            };
        } else {
            userData.student_email = formData.get('email-estudante');
        }
    } else {
        const nomeResponsavel = formData.get('nome-responsavel')?.trim();
        const emailResponsavel = formData.get('email-responsavel')?.trim();
        const senhaResponsavel = formData.get('senha-responsavel')?.trim();
        const dataNascimentoResponsavel = formData.get('data-nascimento-responsavel')?.trim();
        
        if (nomeResponsavel && emailResponsavel && senhaResponsavel && dataNascimentoResponsavel) {
            userData.create_guardian = {
                full_name: nomeResponsavel,
                email: emailResponsavel,
                password: senhaResponsavel,
                birth_date: new Date(dataNascimentoResponsavel).toISOString(),
            };
        }
    }

    if (googleData) {
        userData.firebase_uid = googleData.firebase_uid;
    }

    return userData;
}

export default function CadastroPage() {
    const googleData = sessionStorage.getItem('google_registration_data');
    const isGoogleSignup = !!googleData;
    const userType = sessionStorage.getItem('selected_user_type') || 'student';
    const isGuardian = userType === 'guardian';
    
    return `
        <div class="min-h-screen py-12 px-4">
            <div class="w-full max-w-2xl mx-auto">
                <!-- Cabeçalho -->
                <div class="text-center mb-8">
                    <!-- Indicador do tipo de cadastro -->
                    <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                        isGuardian ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }">
                        <i class="fas ${isGuardian ? 'fa-user-shield' : 'fa-graduation-cap'} mr-1"></i>
                        ${isGuardian ? 'Cadastro de Responsável' : 'Cadastro de Estudante'}
                    </div>
                    
                    <div class="lumind-logo-placeholder mb-4 mx-auto">L</div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">
                        ${isGoogleSignup ? 'Complete seu Cadastro' : 
                          isGuardian ? 'Criar Conta de Responsável' : 'Criar Conta'}
                    </h1>
                    <p class="text-gray-600">
                        ${isGoogleSignup ? 'Só mais algumas informações e você estará pronto!' : 
                          isGuardian ? 'Cadastre-se para acompanhar o desenvolvimento do seu estudante' :
                          'Junte-se a centenas de alunos que já estão aprendendo!'}
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

                        ${isGuardian ? `
                            <!-- Opções para Responsáveis -->
                            <div class="border-t pt-6">
                                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <i class="fas fa-link mr-2 text-purple-500"></i>
                                    Configurar Estudante
                                </h3>
                                
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-3">
                                            Como você quer configurar o estudante? *
                                        </label>
                                        <div class="space-y-2">
                                            <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                                <input 
                                                    type="radio" 
                                                    name="student-option" 
                                                    value="existing" 
                                                    class="mr-3"
                                                    onchange="toggleStudentOptions()"
                                                    checked
                                                >
                                                <div>
                                                    <div class="font-medium">Vincular a um estudante existente</div>
                                                    <div class="text-sm text-gray-500">O estudante já possui uma conta</div>
                                                </div>
                                            </label>
                                            <label class="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                                <input 
                                                    type="radio" 
                                                    name="student-option" 
                                                    value="create" 
                                                    class="mr-3"
                                                    onchange="toggleStudentOptions()"
                                                >
                                                <div>
                                                    <div class="font-medium">Criar uma nova conta de estudante</div>
                                                    <div class="text-sm text-gray-500">Criar conta e vincular automaticamente</div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Opção 1: Vincular estudante existente -->
                                    <div id="existing-student-fields">
                                        <div>
                                            <label for="email-estudante" class="block text-sm font-medium text-gray-700 mb-2">
                                                Email do Estudante *
                                            </label>
                                            <input 
                                                type="email" 
                                                id="email-estudante" 
                                                name="email-estudante" 
                                                class="input-field"
                                                placeholder="estudante@exemplo.com"
                                            >
                                            <p class="text-sm text-gray-500 mt-1">
                                                <i class="fas fa-info-circle mr-1"></i>
                                                Informe o email do estudante existente que você deseja acompanhar
                                            </p>
                                        </div>
                                    </div>

                                    <!-- Opção 2: Criar novo estudante -->
                                    <div id="new-student-fields" style="display: none;" class="space-y-4 p-4 bg-blue-50 rounded-lg border">
                                        <h4 class="font-medium text-gray-800 flex items-center">
                                            <i class="fas fa-user-plus mr-2 text-blue-500"></i>
                                            Dados do novo estudante
                                        </h4>
                                        
                                        <div>
                                            <label for="nome-estudante" class="block text-sm font-medium text-gray-700 mb-2">
                                                Nome completo do estudante *
                                            </label>
                                            <input 
                                                type="text" 
                                                id="nome-estudante" 
                                                name="nome-estudante" 
                                                class="input-field"
                                                placeholder="Maria Silva"
                                            >
                                        </div>

                                        <div>
                                            <label for="email-novo-estudante" class="block text-sm font-medium text-gray-700 mb-2">
                                                Email do estudante *
                                            </label>
                                            <input 
                                                type="email" 
                                                id="email-novo-estudante" 
                                                name="email-novo-estudante" 
                                                class="input-field"
                                                placeholder="maria@exemplo.com"
                                            >
                                        </div>

                                        <div>
                                            <label for="senha-estudante" class="block text-sm font-medium text-gray-700 mb-2">
                                                Senha do estudante *
                                            </label>
                                            <input 
                                                type="password" 
                                                id="senha-estudante" 
                                                name="senha-estudante" 
                                                class="input-field"
                                                placeholder="Senha do estudante"
                                            >
                                        </div>

                                        <div>
                                            <label for="data-nascimento-estudante" class="block text-sm font-medium text-gray-700 mb-2">
                                                Data de nascimento do estudante *
                                            </label>
                                            <input 
                                                type="date" 
                                                id="data-nascimento-estudante" 
                                                name="data-nascimento-estudante" 
                                                class="input-field"
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : `
                            <!-- Responsável (Opcional - Para Estudantes) -->
                            <div class="border-t pt-6">
                                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <i class="fas fa-user-shield mr-2 text-teal-500"></i>
                                    Dados do Responsável (Opcional)
                                </h3>
                                <p class="text-sm text-gray-600 mb-6">
                                    <i class="fas fa-info-circle mr-2 text-teal-600"></i>
                                    Preencha todos os campos abaixo para criar uma conta de responsável que poderá acompanhar seu progresso. Deixe em branco se não desejar.
                                </p>
                                
                                <div class="space-y-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                                    <div>
                                        <label for="nome-responsavel" class="block text-sm font-medium text-gray-700 mb-2">
                                            Nome do Responsável
                                        </label>
                                        <input 
                                            type="text" 
                                            id="nome-responsavel" 
                                            name="nome-responsavel" 
                                            class="input-field"
                                            placeholder="Ex: Maria Silva"
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

                                    <div>
                                        <label for="senha-responsavel" class="block text-sm font-medium text-gray-700 mb-2">
                                            Senha do Responsável
                                        </label>
                                        <input 
                                            type="password" 
                                            id="senha-responsavel" 
                                            name="senha-responsavel" 
                                            class="input-field"
                                            placeholder="Crie uma senha segura"
                                        >
                                        <p class="text-xs text-gray-500 mt-1">
                                            O responsável usará este email e senha para fazer login
                                        </p>
                                    </div>

                                    <div>
                                        <label for="data-nascimento-responsavel" class="block text-sm font-medium text-gray-700 mb-2">
                                            Data de Nascimento do Responsável
                                        </label>
                                        <input 
                                            type="date" 
                                            id="data-nascimento-responsavel" 
                                            name="data-nascimento-responsavel" 
                                            class="input-field"
                                        >
                                    </div>
                                </div>
                            </div>
                        `}

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
                    `Cadastro realizado com sucesso! Bem-vindo(a) ao Lumind!`, 
                    "Cadastro Concluído! 🎉", 
                    "success"
                );
                
                setTimeout(() => {
                    if (userState.user.user_type === 'guardian') {
                        window.router.navigate('/acompanhamento');
                    } else {
                        window.router.navigate('/questionario');
                    }
                }, 1500);
            } catch (error) {
                showCustomAlert(error.message || 'Erro ao criar conta', "Erro no Cadastro", "error");
            } finally {
                loading.style.display = 'none';
            }
        });
    }

    window.toggleStudentOptions = function() {
        const existingOption = document.querySelector('input[name="student-option"][value="existing"]');
        const createOption = document.querySelector('input[name="student-option"][value="create"]');
        const existingFields = document.getElementById('existing-student-fields');
        const newFields = document.getElementById('new-student-fields');
        
        if (createOption && createOption.checked) {
            existingFields.style.display = 'none';
            newFields.style.display = 'block';
            document.getElementById('email-estudante').removeAttribute('required');
            document.getElementById('nome-estudante').setAttribute('required', '');
            document.getElementById('email-novo-estudante').setAttribute('required', '');
            document.getElementById('senha-estudante').setAttribute('required', '');
            document.getElementById('data-nascimento-estudante').setAttribute('required', '');
        } else {
            existingFields.style.display = 'block';
            newFields.style.display = 'none';
            document.getElementById('email-estudante').setAttribute('required', '');
            document.getElementById('nome-estudante').removeAttribute('required');
            document.getElementById('email-novo-estudante').removeAttribute('required');
            document.getElementById('senha-estudante').removeAttribute('required');
            document.getElementById('data-nascimento-estudante').removeAttribute('required');
        }
    }
}