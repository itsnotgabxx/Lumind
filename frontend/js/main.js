import { api } from './api.js';
import { setupLoginPage } from './pages/login.js';
import { setupProfilePage } from './pages/profile.js';
import { setupAlertCloseListener } from './utils/alert.js';
import { showScreen } from './utils/navigation.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Inicializa listeners globais
    setupAlertCloseListener();
    
    // Inicializa todas as páginas
    setupLoginPage();
    setupProfilePage();
    
    // Verifica se o usuário já está logado
    if (api.user) {
        showScreen('recomendacao');
        await loadUserData();
    } else {
        showScreen('login');
    }
});