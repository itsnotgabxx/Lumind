import { api } from '../api.js';
import { showCustomAlert } from '../utils/alert.js';
import { showScreen } from '../utils/navigation.js';

export function setupProfilePage() {
    const formPerfilInfo = document.getElementById('form-perfil-info');
    if(formPerfilInfo) {
        formPerfilInfo.addEventListener('submit', function(event) {
            event.preventDefault();
            showCustomAlert('Informações atualizadas com sucesso!', 'Sucesso', 'success');
        });
    }

    const formPerfilAcessibilidade = document.getElementById('form-perfil-acessibilidade');
    if(formPerfilAcessibilidade) {
        formPerfilAcessibilidade.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const settings = {
                font_size: document.getElementById('font-size').value,
                contrast: document.getElementById('contrast').value,
                reduce_animations: document.getElementById('reduce-animations').checked
            };
            
            try {
                await api.updateAccessibilitySettings(settings);
                applyAccessibilitySettings(settings);
                showCustomAlert('Configurações de acessibilidade salvas!', 'Sucesso', 'success');
            } catch (error) {
                showCustomAlert('Erro ao salvar configurações', 'Erro', 'error');
            }
        });
    }
    
    const btnAjustarPreferenciasPerfil = document.getElementById('btn-ajustar-preferencias-perfil');
    if(btnAjustarPreferenciasPerfil) {
        btnAjustarPreferenciasPerfil.addEventListener('click', function(event) {
            showScreen('questionario');
        });
    }

    const btnSairContaPerfil = document.getElementById('btn-sair-conta-perfil');
    if(btnSairContaPerfil) {
        btnSairContaPerfil.addEventListener('click', async function(event) {
            try {
                await api.logout();
                showScreen('login');
            } catch (error) {
                showCustomAlert('Erro ao sair da conta', 'Erro', 'error');
            }
        });
    }
}