import { showCustomAlert } from '../utils/alert.js';

export default function LoginTypePage() {
    return `
        <div class="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div class="w-full max-w-2xl">
                <!-- Header -->
                <div class="text-center mb-8">
                    <div class="lumind-logo-placeholder mx-auto">L</div>
                    <h1 class="lumind-brand-header">Lumind</h1>
                    <p class="lumind-subheader">Como você gostaria de acessar?</p>
                </div>

                <!-- Cards de Seleção -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Card Aluno -->
                    <div id="login-student" class="login-type-card group cursor-pointer">
                        <div class="text-center">
                            <div class="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <i class="fas fa-graduation-cap text-blue-600 text-3xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold text-gray-800 mb-2">Sou Estudante</h3>
                            <p class="text-gray-600 text-sm mb-4">
                                Acesse seus conteúdos, atividades e progresso de aprendizagem
                            </p>
                            <div class="flex items-center justify-center text-blue-600 font-medium">
                                <span>Continuar como Estudante</span>
                                <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Card Responsável -->
                    <div id="login-guardian" class="login-type-card group cursor-pointer">
                        <div class="text-center">
                            <div class="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <i class="fas fa-user-shield text-purple-600 text-3xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold text-gray-800 mb-2">Sou Responsável</h3>
                            <p class="text-gray-600 text-sm mb-4">
                                Acompanhe o desenvolvimento e progresso do seu estudante
                            </p>
                            <div class="flex items-center justify-center text-purple-600 font-medium">
                                <span>Continuar como Responsável</span>
                                <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Informações Adicionais -->
                <div class="mt-8 text-center text-sm text-gray-500">
                    <p>
                        <i class="fas fa-info-circle mr-1"></i>
                        Escolha o tipo de acesso de acordo com seu perfil. Você pode alterar depois.
                    </p>
                </div>
            </div>
        </div>

        <style>
            .login-type-card {
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 16px;
                padding: 2rem;
                transition: all 0.2s ease;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            }

            .login-type-card:hover {
                border-color: #3b82f6;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                transform: translateY(-2px);
            }

            .login-type-card:active {
                transform: translateY(0);
            }
        </style>
    `;
}

export function setup() {
    const studentCard = document.getElementById('login-student');
    const guardianCard = document.getElementById('login-guardian');

    if (studentCard) {
        studentCard.addEventListener('click', () => {
            sessionStorage.setItem('selected_user_type', 'student');
            window.router.navigate('/login');
        });
    }

    if (guardianCard) {
        guardianCard.addEventListener('click', () => {
            sessionStorage.setItem('selected_user_type', 'guardian');
            window.router.navigate('/login');
        });
    }
}