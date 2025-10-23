import { api } from '../api.js';
import { showCustomAlert } from '../utils/alert.js';
import { showScreen } from '../utils/navigation.js';

export function setupLoginPage() {
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const email = formLogin.querySelector('input[name="email"]').value;
            const senha = formLogin.querySelector('input[name="senha"]').value;
            
            try {
                await api.login(email, senha);
                showScreen('recomendacao');
                await loadUserData();
            } catch (error) {
                showCustomAlert(error.message || 'Erro ao fazer login', 'Erro', 'error');
            }
        });
    }

    const formEsqueciSenha = document.getElementById('form-esqueci-senha');
    if(formEsqueciSenha) {
        formEsqueciSenha.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = formEsqueciSenha.querySelector('input[name="email"]').value;
            showCustomAlert('Um email de recuperação foi enviado!', 'Sucesso', 'success');
        });
    }
}