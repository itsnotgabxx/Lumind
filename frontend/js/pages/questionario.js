import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

// Estado do questionário
let questionnaireState = {
    currentStep: 1,
    totalSteps: 3,
    data: {
        learning_preferences: ['video', 'interativo'], // padrões
        interests: [],
        distractions: ''
    }
};

function questionnaireDataToPreferences() {
    return {
        learning_preferences: questionnaireState.data.learning_preferences,
        interests: questionnaireState.data.interests,
        distractions: questionnaireState.data.distractions
    };
}

export default function QuestionarioPage() {
    const user = userState.user;
    const userName = user ? user.full_name.split(' ')[0] : 'você';
    
    return `
        <div class="questionnaire-container">
            <div class="questionnaire-wrapper">
                <!-- Progresso Circular -->
                <div class="progress-section">
                    <div class="progress-circle">
                        <svg class="progress-ring" width="120" height="120">
                            <circle class="progress-ring-bg" cx="60" cy="60" r="54"/>
                            <circle class="progress-ring-fill" cx="60" cy="60" r="54" style="stroke-dasharray: 339.29; stroke-dashoffset: ${339.29 * (1 - (questionnaireState.currentStep - 1) / (questionnaireState.totalSteps - 1))}"/>
                        </svg>
                        <div class="progress-text">
                            <span class="progress-current">${questionnaireState.currentStep}</span>
                            <span class="progress-total">/${questionnaireState.totalSteps}</span>
                        </div>
                    </div>
                </div>

                <!-- Container com animação -->
                <div id="form-container" class="form-container">
                    <!-- Sessão 1: Estilos de Aprendizado -->
                    <div id="step-1" class="form-step active-step">
                        <div class="step-header">
                            <div class="step-icon icon-learning">
                                <i class="fas fa-lightbulb"></i>
                            </div>
                            <div>
                                <h2 class="step-title">Como você aprende melhor?</h2>
                                <p class="step-subtitle">Escolha as formas que mais combinam com você (pode selecionar várias)</p>
                            </div>
                        </div>

                        <form id="form-step-1" class="step-form">
                            <div class="learning-options">
                                <!-- Opção 1: Vídeos -->
                                <label class="learning-card">
                                    <input type="checkbox" name="learning_pref" value="video" data-icon="fa-video">
                                    <div class="card-icon">
                                        <i class="fas fa-video"></i>
                                    </div>
                                    <div class="card-content">
                                        <h4>Vídeos</h4>
                                        <p>Vídeo-aulas e tutoriais visuais</p>
                                    </div>
                                </label>

                                <!-- Opção 2: Imagens -->
                                <label class="learning-card">
                                    <input type="checkbox" name="learning_pref" value="imagem" data-icon="fa-image">
                                    <div class="card-icon">
                                        <i class="fas fa-image"></i>
                                    </div>
                                    <div class="card-content">
                                        <h4>Imagens</h4>
                                        <p>Infográficos e diagramas visuais</p>
                                    </div>
                                </label>

                                <!-- Opção 3: Textos -->
                                <label class="learning-card">
                                    <input type="checkbox" name="learning_pref" value="leitura" data-icon="fa-book">
                                    <div class="card-icon">
                                        <i class="fas fa-book-open"></i>
                                    </div>
                                    <div class="card-content">
                                        <h4>Textos</h4>
                                        <p>Artigos e conteúdo escrito</p>
                                    </div>
                                </label>

                                <!-- Opção 4: Áudio -->
                                <label class="learning-card">
                                    <input type="checkbox" name="learning_pref" value="audio" data-icon="fa-headphones">
                                    <div class="card-icon">
                                        <i class="fas fa-headphones"></i>
                                    </div>
                                    <div class="card-content">
                                        <h4>Áudio</h4>
                                        <p>Podcasts e narração</p>
                                    </div>
                                </label>

                                <!-- Opção 5: Interativo -->
                                <label class="learning-card">
                                    <input type="checkbox" name="learning_pref" value="interativo" data-icon="fa-gamepad" checked>
                                    <div class="card-icon">
                                        <i class="fas fa-gamepad"></i>
                                    </div>
                                    <div class="card-content">
                                        <h4>Jogos</h4>
                                        <p>Atividades interativas e desafios</p>
                                    </div>
                                </label>

                                <!-- Opção 6: Prático -->
                                <label class="learning-card">
                                    <input type="checkbox" name="learning_pref" value="pratico" data-icon="fa-hammer">
                                    <div class="card-icon">
                                        <i class="fas fa-hammer"></i>
                                    </div>
                                    <div class="card-content">
                                        <h4>Prático</h4>
                                        <p>Aprender fazendo na prática</p>
                                    </div>
                                </label>
                            </div>
                        </form>
                    </div>

                    <!-- Sessão 2: Interesses -->
                    <div id="step-2" class="form-step">
                        <div class="step-header">
                            <div class="step-icon icon-interests">
                                <i class="fas fa-heart"></i>
                            </div>
                            <div>
                                <h2 class="step-title">O que você gosta?</h2>
                                <p class="step-subtitle">Selecione seus tópicos de interesse para recomendações personalizadas</p>
                            </div>
                        </div>

                        <form id="form-step-2" class="step-form">
                            <div class="interests-grid">
                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Espaço">
                                    <div class="card-icon">
                                        <i class="fas fa-rocket"></i>
                                    </div>
                                    <span>Espaço</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Tecnologia">
                                    <div class="card-icon">
                                        <i class="fas fa-microchip"></i>
                                    </div>
                                    <span>Tecnologia</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Música">
                                    <div class="card-icon">
                                        <i class="fas fa-music"></i>
                                    </div>
                                    <span>Música</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Programação">
                                    <div class="card-icon">
                                        <i class="fas fa-code"></i>
                                    </div>
                                    <span>Programação</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Arte">
                                    <div class="card-icon">
                                        <i class="fas fa-palette"></i>
                                    </div>
                                    <span>Arte</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Ciência">
                                    <div class="card-icon">
                                        <i class="fas fa-flask"></i>
                                    </div>
                                    <span>Ciência</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Natureza">
                                    <div class="card-icon">
                                        <i class="fas fa-leaf"></i>
                                    </div>
                                    <span>Natureza</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="História">
                                    <div class="card-icon">
                                        <i class="fas fa-scroll"></i>
                                    </div>
                                    <span>História</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Esportes">
                                    <div class="card-icon">
                                        <i class="fas fa-trophy"></i>
                                    </div>
                                    <span>Esportes</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Xadrez">
                                    <div class="card-icon">
                                        <i class="fas fa-chess"></i>
                                    </div>
                                    <span>Xadrez</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Matemática">
                                    <div class="card-icon">
                                        <i class="fas fa-calculator"></i>
                                    </div>
                                    <span>Matemática</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Idiomas">
                                    <div class="card-icon">
                                        <i class="fas fa-language"></i>
                                    </div>
                                    <span>Idiomas</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Geografia">
                                    <div class="card-icon">
                                        <i class="fas fa-globe-americas"></i>
                                    </div>
                                    <span>Geografia</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Literatura">
                                    <div class="card-icon">
                                        <i class="fas fa-book"></i>
                                    </div>
                                    <span>Literatura</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Animais">
                                    <div class="card-icon">
                                        <i class="fas fa-paw"></i>
                                    </div>
                                    <span>Animais</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Culinária">
                                    <div class="card-icon">
                                        <i class="fas fa-utensils"></i>
                                    </div>
                                    <span>Culinária</span>
                                </label>

                                <label class="interest-card">
                                    <input type="checkbox" name="interest" value="Fotografia">
                                    <div class="card-icon">
                                        <i class="fas fa-camera"></i>
                                    </div>
                                    <span>Fotografia</span>
                                </label>
                            </div>

                            <div id="selected-interests" class="selected-tags"></div>
                        </form>
                    </div>

                    <!-- Sessão 3: Desafios -->
                    <div id="step-3" class="form-step">
                        <div class="step-header">
                            <div class="step-icon icon-challenges">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <div>
                                <h2 class="step-title">Seus desafios</h2>
                                <p class="step-subtitle">Nos ajude a criar um ambiente confortável para você</p>
                            </div>
                        </div>

                        <form id="form-step-3" class="step-form">
                            <div class="challenges-grid">
                                <label class="challenge-card">
                                    <input type="checkbox" name="distraction" value="Sons altos">
                                    <div class="card-icon">
                                        <i class="fas fa-volume-mute"></i>
                                    </div>
                                    <span>Sons altos</span>
                                </label>

                                <label class="challenge-card">
                                    <input type="checkbox" name="distraction" value="Cores vibrantes">
                                    <div class="card-icon">
                                        <i class="fas fa-eye"></i>
                                    </div>
                                    <span>Cores vibrantes</span>
                                </label>

                                <label class="challenge-card">
                                    <input type="checkbox" name="distraction" value="Textos longos">
                                    <div class="card-icon">
                                        <i class="fas fa-file-alt"></i>
                                    </div>
                                    <span>Textos longos</span>
                                </label>

                                <label class="challenge-card">
                                    <input type="checkbox" name="distraction" value="Movimento na tela">
                                    <div class="card-icon">
                                        <i class="fas fa-spinner"></i>
                                    </div>
                                    <span>Movimento na tela</span>
                                </label>

                                <label class="challenge-card">
                                    <input type="checkbox" name="distraction" value="Muitas opções">
                                    <div class="card-icon">
                                        <i class="fas fa-list"></i>
                                    </div>
                                    <span>Muitas opções</span>
                                </label>

                                <label class="challenge-card">
                                    <input type="checkbox" name="distraction" value="Pressão de tempo">
                                    <div class="card-icon">
                                        <i class="fas fa-hourglass-end"></i>
                                    </div>
                                    <span>Pressão de tempo</span>
                                </label>

                                <label class="challenge-card">
                                    <input type="checkbox" name="distraction" value="Instruções complexas">
                                    <div class="card-icon">
                                        <i class="fas fa-exclamation-triangle"></i>
                                    </div>
                                    <span>Instruções complexas</span>
                                </label>

                                <label class="challenge-card">
                                    <input type="checkbox" name="distraction" value="Barulho ambiente">
                                    <div class="card-icon">
                                        <i class="fas fa-volume-up"></i>
                                    </div>
                                    <span>Barulho ambiente</span>
                                </label>

                                <label class="challenge-card">
                                    <input type="checkbox" name="distraction" value="Luz forte">
                                    <div class="card-icon">
                                        <i class="fas fa-sun"></i>
                                    </div>
                                    <span>Luz forte</span>
                                </label>

                                <label class="challenge-card">
                                    <input type="checkbox" name="distraction" value="Distrações visuais">
                                    <div class="card-icon">
                                        <i class="fas fa-eye-slash"></i>
                                    </div>
                                    <span>Distrações visuais</span>
                                </label>

                                <label class="challenge-card">
                                    <input type="checkbox" name="distraction" value="Nenhum desafio específico">
                                    <div class="card-icon">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                    <span>Nenhum desafio</span>
                                </label>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Botões de Navegação -->
                <div class="button-container">
                    <button id="btn-back" class="btn-secondary" style="display: none;">
                        <i class="fas fa-arrow-left mr-2"></i>Voltar
                    </button>
                    <button id="btn-next" class="btn-primary">
                        Próximo <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>

                <!-- Indicador de Dica -->
                <div class="tip-section">
                    <i class="fas fa-info-circle"></i>
                    <span id="tip-text">Selecione pelo menos uma opção para continuar</span>
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

    initializeQuestionnaireState();
    setupStepNavigation();
    setupStep1();
    setupStep2();
    setupStep3();
}

function initializeQuestionnaireState() {
    // Carregar estado anterior se existir
    const saved = sessionStorage.getItem('questionnaireState');
    if (saved) {
        questionnaireState = JSON.parse(saved);
    }
    // Sempre resetar para o step 1 ao abrir a página
    questionnaireState.currentStep = 1;
}

function saveQuestionnaireState() {
    sessionStorage.setItem('questionnaireState', JSON.stringify(questionnaireState));
}

function setupStepNavigation() {
    const btnNext = document.getElementById('btn-next');
    const btnBack = document.getElementById('btn-back');

    btnNext.addEventListener('click', () => {
        if (validateCurrentStep()) {
            if (questionnaireState.currentStep < questionnaireState.totalSteps) {
                goToNextStep();
            } else {
                submitQuestionnaire();
            }
        }
    });

    btnBack.addEventListener('click', () => {
        if (questionnaireState.currentStep > 1) {
            goToPreviousStep();
        }
    });

    // Atualizar UI inicial
    updateNavigationButtons();
}

function validateCurrentStep() {
    const step = questionnaireState.currentStep;

    if (step === 1) {
        const selected = document.querySelectorAll('input[name="learning_pref"]:checked');
        if (selected.length === 0) {
            showCustomAlert("Selecione pelo menos uma forma de aprendizado", "Validação", "warning");
            return false;
        }
        // Salvar dados
        questionnaireState.data.learning_preferences = Array.from(selected).map(el => el.value);
    } else if (step === 2) {
        const selected = document.querySelectorAll('input[name="interest"]:checked');
        
        let interests = Array.from(selected).map(el => el.value);
        
        if (interests.length === 0) {
            showCustomAlert("Selecione pelo menos um interesse", "Validação", "warning");
            return false;
        }
        
        questionnaireState.data.interests = interests;
    } else if (step === 3) {
        const selected = document.querySelectorAll('input[name="distraction"]:checked');
        
        let distractions = Array.from(selected).map(el => el.value);
        
        questionnaireState.data.distractions = distractions.join('; ');
    }

    saveQuestionnaireState();
    return true;
}

function goToNextStep() {
    const currentStep = document.getElementById(`step-${questionnaireState.currentStep}`);
    
    // Sai para a esquerda
    currentStep.classList.remove('active-step');
    currentStep.classList.add('slide-out-left');

    questionnaireState.currentStep++;
    saveQuestionnaireState();
    
    const nextStep = document.getElementById(`step-${questionnaireState.currentStep}`);
    
    setTimeout(() => {
        // Remove classes da tela anterior
        currentStep.classList.remove('slide-out-left', 'active-step');
        
        // Entra a nova tela pela direita
        nextStep.classList.add('active-step', 'slide-in-right');
        
        setTimeout(() => {
            nextStep.classList.remove('slide-in-right');
            updateNavigationButtons();
            updateProgressCircle();
            updateTipText();
        }, 300);
    }, 300);
}

function goToPreviousStep() {
    const currentStep = document.getElementById(`step-${questionnaireState.currentStep}`);
    
    // Sai para a direita
    currentStep.classList.remove('active-step');
    currentStep.classList.add('slide-out-right');

    questionnaireState.currentStep--;
    saveQuestionnaireState();
    
    const prevStep = document.getElementById(`step-${questionnaireState.currentStep}`);
    
    setTimeout(() => {
        // Remove classes da tela anterior
        currentStep.classList.remove('slide-out-right', 'active-step');
        
        // Entra a tela anterior pela esquerda
        prevStep.classList.add('active-step', 'slide-in-left');
        
        setTimeout(() => {
            prevStep.classList.remove('slide-in-left');
            updateNavigationButtons();
            updateProgressCircle();
            updateTipText();
        }, 300);
    }, 300);
}

function updateNavigationButtons() {
    const btnNext = document.getElementById('btn-next');
    const btnBack = document.getElementById('btn-back');
    
    if (questionnaireState.currentStep === 1) {
        btnBack.style.display = 'none';
        btnNext.textContent = 'Próximo ';
        const icon = document.createElement('i');
        icon.className = 'fas fa-arrow-right ml-2';
        btnNext.appendChild(icon);
    } else if (questionnaireState.currentStep === questionnaireState.totalSteps) {
        btnBack.style.display = 'block';
        btnNext.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Finalizar';
    } else {
        btnBack.style.display = 'block';
        btnNext.textContent = 'Próximo ';
        const icon = document.createElement('i');
        icon.className = 'fas fa-arrow-right ml-2';
        btnNext.appendChild(icon);
    }
}

function updateProgressCircle() {
    const circumference = 339.29;
    const progress = (questionnaireState.currentStep - 1) / (questionnaireState.totalSteps - 1);
    const offset = circumference * (1 - progress);
    
    const ring = document.querySelector('.progress-ring-fill');
    if (ring) {
        ring.style.strokeDashoffset = offset;
    }
    
    // Atualiza o texto do progresso
    const currentText = document.querySelector('.progress-current');
    if (currentText) {
        currentText.textContent = questionnaireState.currentStep;
    }
}

function updateTipText() {
    const tipMap = {
        1: 'Selecione pelo menos uma forma de aprendizado',
        2: 'Escolha seus interesses para recomendações personalizadas',
        3: 'Compartilhe seus desafios para melhorar sua experiência'
    };
    
    const tipEl = document.getElementById('tip-text');
    if (tipEl) {
        tipEl.textContent = tipMap[questionnaireState.currentStep];
    }
}

function setupStep1() {
    const checkboxes = document.querySelectorAll('input[name="learning_pref"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const card = checkbox.closest('.learning-card');
            if (checkbox.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        // Pré-selecionar se já estava marcado
        if (questionnaireState.data.learning_preferences.includes(checkbox.value)) {
            checkbox.checked = true;
            const card = checkbox.closest('.learning-card');
            card.classList.add('selected');
        }
    });
}

function setupStep2() {
    const interestCheckboxes = document.querySelectorAll('input[name="interest"]');
    const selectedTags = document.getElementById('selected-interests');

    interestCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSelectedInterestsTags();
        });

        // Pré-selecionar se já estava marcado
        if (questionnaireState.data.interests.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });

    updateSelectedInterestsTags();
}

function updateSelectedInterestsTags() {
    const selected = document.querySelectorAll('input[name="interest"]:checked');
    const container = document.getElementById('selected-interests');
    
    container.innerHTML = '';
    
    selected.forEach(checkbox => {
        const tag = document.createElement('span');
        tag.className = 'selected-tag';
        tag.innerHTML = `
            ${checkbox.value}
            <button type="button" class="tag-remove" data-value="${checkbox.value}">×</button>
        `;
        
        tag.querySelector('.tag-remove').addEventListener('click', (e) => {
            e.preventDefault();
            checkbox.checked = false;
            updateSelectedInterestsTags();
        });
        
        container.appendChild(tag);
    });
}

function setupStep3() {
    const distractionCheckboxes = document.querySelectorAll('input[name="distraction"]');

    distractionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const card = checkbox.closest('.challenge-card');
            if (checkbox.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    });

    // Recuperar valores anteriores
    if (questionnaireState.data.distractions) {
        const items = questionnaireState.data.distractions.split('; ');
        items.forEach(item => {
            const checkbox = Array.from(distractionCheckboxes).find(cb => cb.value === item.trim());
            if (checkbox) {
                checkbox.checked = true;
                checkbox.closest('.challenge-card').classList.add('selected');
            }
        });
    }
}

async function submitQuestionnaire() {
    if (!validateCurrentStep()) {
        return;
    }

    const loading = document.getElementById('loading-overlay');
    if (loading) loading.style.display = 'flex';
    
    try {
        const preferences = questionnaireDataToPreferences();
        console.log('Enviando preferências:', preferences);
        
        await api.updatePreferences(preferences);
        
        showCustomAlert(
            "Preferências salvas! Preparando suas recomendações personalizadas...", 
            "Tudo pronto! 🎉", 
            "success"
        );
        
        // Limpar state
        sessionStorage.removeItem('questionnaireState');
        
        setTimeout(() => {
            window.router.navigate('/recomendacao');
        }, 1500);
    } catch (error) {
        console.error('Erro ao salvar:', error);
        showCustomAlert(
            error.message || 'Erro ao salvar preferências', 
            "Erro ao Salvar Preferências", 
            "error"
        );
    } finally {
        if (loading) loading.style.display = 'none';
    }
}