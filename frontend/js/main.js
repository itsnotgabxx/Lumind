import { Router } from './utils/router.js';
import { routes } from './config/routes.js';
import { api } from './api.js';
import { userState } from './utils/userState.js';
import { setupAlertCloseListener } from './utils/alert.js';
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
        if (user && user.user_type === 'student') {
            startNotifications();
        } else {
            stopNotifications();
        }
    });

    // Para notificações ao sair
    window.addEventListener('beforeunload', () => {
        stopNotifications();
    });
});