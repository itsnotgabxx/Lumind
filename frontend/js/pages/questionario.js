import { api } from '../api.js';
import { showCustomAlert } from '../utils/alert.js';
import { showScreen } from '../utils/navigation.js';

export function setupQuestionarioPage() {
    const formQuestionario = document.getElementById('form-questionario');
    if (formQuestionario) {
        formQuestionario.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const aprenderPrefs = Array.from(formQuestionario.querySelectorAll('input[name="aprender_pref"]:checked'))
                .map(input => input.value);
            
            const interesses = document.getElementById('interesses').value;
            
            try {
                await api.updatePreferences({
                    learning_preferences: aprenderPrefs,
                    interests: interesses
                });
                
                showCustomAlert('Preferências salvas com sucesso!', 'Sucesso', 'success');
                showScreen('recomendacao');
            } catch (error) {
                showCustomAlert(error.message || 'Erro ao salvar preferências', 'Erro', 'error');
            }
        });
    }

    // Atualiza o cabeçalho com o nome do usuário
    document.addEventListener('screenContentUpdate', () => {
        const questionarioHeader = document.getElementById('questionario-header');
        if (questionarioHeader && api.user) {
            questionarioHeader.innerHTML = `Olá, ${api.user.full_name}!`;
        }
    });
}