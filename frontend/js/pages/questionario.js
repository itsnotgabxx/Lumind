import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

// Função para converter dados do questionário
function questionnaireDataToPreferences() {
    const learningPreferences = [];
    const interests = document.getElementById('interesses').value ? 
        document.getElementById('interesses').value.split(',').map(i => i.trim()) : [];
    const distractions = document.getElementById('distracoes').value || '';

    // Converte checkboxes de preferências de aprendizado
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

// Retorna o HTML da página
export default function QuestionarioPage() {
    return `
        <div class="items-start pt-10 md:pt-16 w-full">
            <div class="w-full max-w-2xl card mx-auto">
                <div class="text-center mb-6">
                    <i class="fas fa-tasks text-4xl mb-3 text-purple-500"></i>
                    <h1 id="questionario-header" class="screen-title">Olá!</h1>
                    <p class="screen-subtitle">Como você prefere aprender?</p>
                </div>
                
                <form id="form-questionario" action="#" method="POST" class="space-y-6">
                    <div>
                        <p class="font-semibold text-gray-700 mb-2 text-md">1. Como você aprende melhor?</p>
                        <div class="space-y-3">
                            <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-all duration-200 choice-label">
                                <input type="checkbox" name="aprender_pref" value="leitura" class="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mr-3">
                                <i class="fas fa-book-open w-6 text-center mr-2"></i> Lendo textos e artigos
                            </label>
                            <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-all duration-200 choice-label">
                                <input type="checkbox" name="aprender_pref" value="imagem" class="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mr-3">
                                <i class="fas fa-image w-6 text-center mr-2"></i> Vendo imagens e ilustrações
                            </label>
                            <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-all duration-200 choice-label">
                                <input type="checkbox" name="aprender_pref" value="video" class="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mr-3" checked>
                                <i class="fas fa-video w-6 text-center mr-2"></i> Assistindo a vídeos
                            </label>
                            <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-all duration-200 choice-label">
                                <input type="checkbox" name="aprender_pref" value="audio" class="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mr-3">
                                <i class="fas fa-headphones w-6 text-center mr-2"></i> Ouvindo áudios e podcasts
                            </label>
                            <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-all duration-200 choice-label">
                                <input type="checkbox" name="aprender_pref" value="interativo" class="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mr-3" checked>
                                <i class="fas fa-puzzle-piece w-6 text-center mr-2"></i> Com atividades interativas e jogos
                            </label>
                        </div>
                    </div>

                    <div>
                        <label for="interesses" class="font-semibold text-gray-700 mb-2 block text-md">2. Quais são seus principais interesses?</label>
                        <input type="text" id="interesses" name="interesses" placeholder="Ex: Xadrez, Espaço, Música" class="input-field text-base" value="Xadrez, Espaço">
                        <p class="text-xs text-gray-500 mt-1">Você pode listar vários, separados por vírgula.</p>
                    </div>

                    <div>
                        <label for="distracoes" class="font-semibold text-gray-700 mb-2 block text-md">3. Algo que te incomoda ou distrai?</label>
                        <textarea id="distracoes" name="distracoes" rows="3" placeholder="Ex: Sons altos, cores vibrantes..." class="input-field text-base">Textos muito longos sem imagens.</textarea>
                        <p class="text-xs text-gray-500 mt-1">Isso nos ajudará a criar um ambiente mais confortável.</p>
                    </div>
                    
                    <button type="submit" class="w-full btn-primary mt-8 text-md"><i class="fas fa-check-circle mr-2"></i>Salvar e Começar</button>
                </form>
            </div>
        </div>
    `;
}

// Configura os event listeners da página
export function setup() {
    // Atualiza o cabeçalho com o nome do usuário
    const questionarioHeader = document.getElementById('questionario-header');
    if (questionarioHeader && userState.user) {
        questionarioHeader.innerHTML = `Olá, ${userState.user.full_name}!`;
    }

    const formQuestionario = document.getElementById('form-questionario');
    if (formQuestionario) {
        formQuestionario.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            try {
                // A função 'questionnaireDataToPreferences' já existe no seu api.js
                const preferences = questionnaireDataToPreferences();
                await api.updatePreferences(preferences);
                
                showCustomAlert("Preferências salvas! Preparando suas recomendações.", "Obrigado!", "success");
                window.router.navigate('/recomendacao');
            } catch (error) {
                showCustomAlert(error.message, "Erro ao Salvar Preferências", "error");
            }
        });
    }
}