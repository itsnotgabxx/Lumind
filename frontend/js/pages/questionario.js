import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

function questionnaireDataToPreferences() {
    const learningPreferences = [];
    const interests = document.getElementById('interesses').value ? 
        document.getElementById('interesses').value.split(',').map(i => i.trim()) : [];
    const distractions = document.getElementById('distracoes').value || '';

    const checkboxes = document.querySelectorAll('input[name="aprender_pref"]:checked');
    checkboxes.forEach(checkbox => {
        learningPreferences.push(checkbox.value);
    });

    return {
        learning_preferences: learningPreferences,
        interests: interests,
        distractions: distractions
    };
}

export default function QuestionarioPage() {
    const user = userState.user;
    const userName = user ? user.full_name.split(' ')[0] : 'você';
    
    return `
        <div class="min-h-screen py-12 px-4">
            <div class="w-full max-w-3xl mx-auto">
                <!-- Progresso -->
                <div class="mb-8">
                    <div class="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Passo 1 de 1</span>
                        <span>100%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style="width: 100%"></div>
                    </div>
                </div>

                <!-- Cabeçalho -->
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-magic text-3xl text-purple-600"></i>
                    </div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">
                        Olá, ${userName}! 👋
                    </h1>
                    <p class="text-lg text-gray-600">
                        Vamos personalizar sua experiência de aprendizado
                    </p>
                    <p class="text-sm text-gray-500 mt-2">
                        Não se preocupe, você pode mudar essas preferências depois!
                    </p>
                </div>
                
                <div class="card">
                    <form id="form-questionario" class="space-y-8">
                        <!-- Pergunta 1: Como aprende -->
                        <div>
                            <div class="flex items-start gap-3 mb-4">
                                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span class="font-bold text-purple-600">1</span>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-800 text-lg">
                                        Como você prefere aprender?
                                    </h3>
                                    <p class="text-sm text-gray-600 mt-1">
                                        Selecione todas as opções que se aplicam a você
                                    </p>
                                </div>
                            </div>
                            
                            <div class="space-y-3">
                                <label class="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all choice-label group">
                                    <input 
                                        type="checkbox" 
                                        name="aprender_pref" 
                                        value="leitura" 
                                        class="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mr-3"
                                    >
                                    <i class="fas fa-book-open w-8 text-center text-2xl text-gray-400 group-hover:text-purple-500 transition-colors mr-3"></i>
                                    <div class="flex-grow">
                                        <span class="font-medium text-gray-800">Lendo textos e artigos</span>
                                        <p class="text-xs text-gray-500 mt-1">Conteúdo escrito com imagens</p>
                                    </div>
                                </label>

                                <label class="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all choice-label group">
                                    <input 
                                        type="checkbox" 
                                        name="aprender_pref" 
                                        value="imagem" 
                                        class="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mr-3"
                                    >
                                    <i class="fas fa-image w-8 text-center text-2xl text-gray-400 group-hover:text-purple-500 transition-colors mr-3"></i>
                                    <div class="flex-grow">
                                        <span class="font-medium text-gray-800">Vendo imagens e ilustrações</span>
                                        <p class="text-xs text-gray-500 mt-1">Infográficos e diagramas visuais</p>
                                    </div>
                                </label>

                                <label class="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all choice-label group">
                                    <input 
                                        type="checkbox" 
                                        name="aprender_pref" 
                                        value="video" 
                                        class="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mr-3"
                                        checked
                                    >
                                    <i class="fas fa-video w-8 text-center text-2xl text-purple-500 mr-3"></i>
                                    <div class="flex-grow">
                                        <span class="font-medium text-gray-800">Assistindo a vídeos</span>
                                        <p class="text-xs text-gray-500 mt-1">Vídeo-aulas e tutoriais visuais</p>
                                    </div>
                                </label>

                                <label class="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all choice-label group">
                                    <input 
                                        type="checkbox" 
                                        name="aprender_pref" 
                                        value="audio" 
                                        class="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mr-3"
                                    >
                                    <i class="fas fa-headphones w-8 text-center text-2xl text-gray-400 group-hover:text-purple-500 transition-colors mr-3"></i>
                                    <div class="flex-grow">
                                        <span class="font-medium text-gray-800">Ouvindo áudios e podcasts</span>
                                        <p class="text-xs text-gray-500 mt-1">Narração e explicações em áudio</p>
                                    </div>
                                </label>

                                <label class="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all choice-label group">
                                    <input 
                                        type="checkbox" 
                                        name="aprender_pref" 
                                        value="interativo" 
                                        class="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mr-3"
                                        checked
                                    >
                                    <i class="fas fa-gamepad w-8 text-center text-2xl text-purple-500 mr-3"></i>
                                    <div class="flex-grow">
                                        <span class="font-medium text-gray-800">Com atividades interativas e jogos</span>
                                        <p class="text-xs text-gray-500 mt-1">Aprendizado prático e divertido</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Pergunta 2: Interesses -->
                        <div class="border-t pt-8">
                            <div class="flex items-start gap-3 mb-4">
                                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span class="font-bold text-blue-600">2</span>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-800 text-lg">
                                        Quais são seus principais interesses?
                                    </h3>
                                    <p class="text-sm text-gray-600 mt-1">
                                        Isso nos ajuda a recomendar conteúdo relevante para você
                                    </p>
                                </div>
                            </div>

                            <input 
                                type="text" 
                                id="interesses" 
                                name="interesses" 
                                class="input-field"
                                placeholder="Ex: Xadrez, Espaço, Música, Programação..."
                                value="Xadrez, Espaço"
                            >
                            <p class="text-xs text-gray-500 mt-2">
                                <i class="fas fa-lightbulb mr-1 text-amber-500"></i>
                                Separe os interesses por vírgula
                            </p>

                            <!-- Tags de sugestão -->
                            <div class="mt-3 flex flex-wrap gap-2">
                                <span class="text-xs text-gray-500">Sugestões populares:</span>
                                <button type="button" class="interesse-tag px-3 py-1 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full text-xs border border-gray-300 hover:border-purple-300 transition-colors">
                                    <i class="fas fa-space-shuttle mr-1"></i>Espaço
                                </button>
                                <button type="button" class="interesse-tag px-3 py-1 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full text-xs border border-gray-300 hover:border-purple-300 transition-colors">
                                    <i class="fas fa-music mr-1"></i>Música
                                </button>
                                <button type="button" class="interesse-tag px-3 py-1 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full text-xs border border-gray-300 hover:border-purple-300 transition-colors">
                                    <i class="fas fa-code mr-1"></i>Programação
                                </button>
                                <button type="button" class="interesse-tag px-3 py-1 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full text-xs border border-gray-300 hover:border-purple-300 transition-colors">
                                    <i class="fas fa-palette mr-1"></i>Arte
                                </button>
                            </div>
                        </div>

                        <!-- Pergunta 3: Distrações -->
                        <div class="border-t pt-8">
                            <div class="flex items-start gap-3 mb-4">
                                <div class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span class="font-bold text-teal-600">3</span>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-800 text-lg">
                                        Algo que te incomoda ou distrai?
                                    </h3>
                                    <p class="text-sm text-gray-600 mt-1">
                                        Vamos criar um ambiente mais confortável para você
                                    </p>
                                </div>
                            </div>

                            <textarea 
                                id="distracoes" 
                                name="distracoes" 
                                rows="4" 
                                class="input-field"
                                placeholder="Ex: Sons altos, cores muito vibrantes, textos muito longos..."
                            >Textos muito longos sem imagens.</textarea>
                            <p class="text-xs text-gray-500 mt-2">
                                <i class="fas fa-info-circle mr-1 text-blue-500"></i>
                                Essas informações nos ajudam a adaptar a plataforma para você
                            </p>
                        </div>

                        <!-- Botão -->
                        <div class="border-t pt-8">
                            <button type="submit" class="w-full btn-primary py-4 text-lg">
                                <i class="fas fa-check-circle mr-2"></i>
                                Salvar e Começar a Aprender
                            </button>
                            <p class="text-center text-xs text-gray-500 mt-3">
                                Você pode alterar essas preferências a qualquer momento no seu perfil
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

export function setup() {
    const user = userState.user;
    if (!user) {
        window.router.navigate('/login');
        return;
    }

    // Tags de interesse clicáveis
    document.querySelectorAll('.interesse-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const input = document.getElementById('interesses');
            const interesse = tag.textContent.trim();
            const currentValue = input.value;
            
            if (!currentValue.includes(interesse)) {
                input.value = currentValue ? `${currentValue}, ${interesse}` : interesse;
            }
        });
    });

    // Submit do formulário
    const formQuestionario = document.getElementById('form-questionario');
    if (formQuestionario) {
        formQuestionario.addEventListener('submit', async function(event) {
            event.preventDefault();

            // Validação mínima
            const checkboxes = document.querySelectorAll('input[name="aprender_pref"]:checked');
            if (checkboxes.length === 0) {
                showCustomAlert(
                    "Por favor, selecione pelo menos uma forma de aprendizado.", 
                    "Seleção Necessária", 
                    "warning"
                );
                return;
            }

            const loading = document.getElementById('loading-overlay');
            loading.style.display = 'flex';
            
            try {
                const preferences = questionnaireDataToPreferences();
                await api.updatePreferences(preferences);
                
                showCustomAlert(
                    "Preferências salvas! Preparando suas recomendações personalizadas...", 
                    "Tudo pronto! 🎉", 
                    "success"
                );
                
                setTimeout(() => {
                    window.router.navigate('/recomendacao');
                }, 1500);
            } catch (error) {
                showCustomAlert(
                    error.message || 'Erro ao salvar preferências', 
                    "Erro ao Salvar Preferências", 
                    "error"
                );
            } finally {
                loading.style.display = 'none';
            }
        });
    }
}