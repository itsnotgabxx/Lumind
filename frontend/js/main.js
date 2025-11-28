import { Router } from './utils/router.js';
import { routes } from './config/routes.js';
import { api } from './api.js';
import { userState } from './utils/userState.js';
import { setupAlertCloseListener } from './utils/alert.js';
import { applyAccessibilitySettings } from './utils/accessibility.js';
import { startNotifications, stopNotifications } from './utils/notifications.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o listener do modal de alerta
    setupAlertCloseListener();

    // Torna instâncias globais acessíveis
    window.api = api;
    window.userState = userState;

    // --- Configuração do Roteador ---
    // Passa as rotas para o construtor do roteador
    const router = new Router(routes); 
    window.router = router; // Torna o roteador global

    // Inicializa o roteador
    router.init();

    // Monitora mudanças de usuário e controla notificações
    userState.subscribe((user) => {
        if (user && (user.user_type === 'student' || user.user_type === 'guardian')) {
            startNotifications();
        } else {
            stopNotifications();
        }
        // Aplica acessibilidade sempre que o usuário mudar
        if (user && user.accessibility_settings) {
            applyAccessibilitySettings(user.accessibility_settings);
        } else {
            // Remove classes de acessibilidade se não houver settings
            applyAccessibilitySettings({ font_size: 'padrão', contrast: 'padrão', reduce_animations: false });
        }
    });

    // Para notificações ao sair
    window.addEventListener('beforeunload', () => {
        stopNotifications();
    });

    // Aplica acessibilidade no carregamento inicial, se houver usuário persistido
    if (api.user && api.user.accessibility_settings) {
        applyAccessibilitySettings(api.user.accessibility_settings);
    }
});