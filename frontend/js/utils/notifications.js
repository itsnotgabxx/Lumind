import { api } from '../api.js';
import { userState } from './userState.js';

let notificationInterval = null;
let lastUnreadCount = 0;

/**
 * Inicia o serviço de notificações
 */
export function startNotifications() {
    if (notificationInterval) {
        console.log('⚠️ Notificações já estão ativas');
        return;
    }

    // Verifica imediatamente
    checkForNewMessages();

    // Verifica a cada 3 segundos (mais frequente para atualizar badge em tempo real)
    notificationInterval = setInterval(() => {
        checkForNewMessages();
    }, 3000);

    console.log('🔔 Serviço de notificações iniciado');
}

/**
 * Para o serviço de notificações
 */
export function stopNotifications() {
    if (notificationInterval) {
        clearInterval(notificationInterval);
        notificationInterval = null;
        console.log('🔕 Serviço de notificações parado');
    }
}

/**
 * Verifica por novas mensagens
 */
async function checkForNewMessages() {
    try {
        const user = userState.user;
        if (!user || user.user_type !== 'student') {
            return;
        }

        const data = await api.getUnreadMessagesCount();
        const currentCount = data.unread_count || 0;

        // Atualiza badges na navbar
        updateBadges(currentCount);

        // Se aumentou o número de não lidas, mostra notificação
        if (currentCount > lastUnreadCount) {
            const newMessages = currentCount - lastUnreadCount;
            showNewMessageNotification(newMessages);
        }

        lastUnreadCount = currentCount;
    } catch (error) {
        console.error('Erro ao verificar mensagens:', error);
    }
}

/**
 * Atualiza os badges de notificação (exportado para uso em outras páginas)
 */
export async function updateNotificationBadges() {
    try {
        const user = userState.user;
        if (!user || user.user_type !== 'student') {
            return;
        }

        const data = await api.getUnreadMessagesCount();
        const count = data.unread_count || 0;
        updateBadges(count);
    } catch (error) {
        console.error('Erro ao atualizar badges:', error);
    }
}

/**
 * Atualiza os badges de notificação (interno)
 */
function updateBadges(count) {
    const badge = document.getElementById('unread-badge');
    const badgeMobile = document.getElementById('unread-badge-mobile');

    if (badge) {
        if (count > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    if (badgeMobile) {
        if (count > 0) {
            badgeMobile.classList.remove('hidden');
        } else {
            badgeMobile.classList.add('hidden');
        }
    }
}

/**
 * Mostra notificação de nova mensagem
 */
function showNewMessageNotification(count) {
    // Tentar usar notificação do navegador se permitido
    if ('Notification' in window && Notification.permission === 'granted') {
        const message = count === 1 
            ? 'Você recebeu uma nova mensagem! 💬'
            : `Você recebeu ${count} novas mensagens! 💬`;
            
        new Notification('Lumind - Nova Mensagem', {
            body: message,
            icon: '/images/logo.png',
            badge: '/images/logo.png'
        });
    }
}

/**
 * Solicita permissão para notificações do navegador
 */
export async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        console.log('Permissão de notificação:', permission);
        return permission === 'granted';
    }
    return Notification.permission === 'granted';
}

/**
 * Reseta o contador (útil quando o usuário abre a página de mensagens)
 */
export function resetUnreadCount() {
    lastUnreadCount = 0;
    updateBadges(0);
}
