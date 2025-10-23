import { api } from '../api.js';
import { showCustomAlert } from '../utils/alert.js';
import { showScreen } from '../utils/navigation.js';

export function setupCadastroPage() {
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const nome = formCadastro.querySelector('input[name="nome"]').value;
            const email = formCadastro.querySelector('input[name="email"]').value;
            const senha = formCadastro.querySelector('input[name="senha"]').value;
            
            try {
                await api.register({
                    full_name: nome,
                    email: email,
                    password: senha
                });
                
                showCustomAlert('Conta criada com sucesso!', 'Sucesso', 'success');
                showScreen('questionario');
            } catch (error) {
                showCustomAlert(error.message || 'Erro ao criar conta', 'Erro', 'error');
            }
        });
    }
}