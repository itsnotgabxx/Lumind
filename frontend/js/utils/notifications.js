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
        if (!user) {
            return;
        }

        let unreadCount = 0;

        // Para estudantes: conta mensagens gerais e de incentivo não lidas
        if (user.user_type === 'student') {
            const data = await api.getUnreadMessagesCount();
            unreadCount = data.unread_count || 0;
            updateBadges(unreadCount, 'student');

            // Se aumentou o número de não lidas, mostra notificação
            if (unreadCount > lastUnreadCount) {
                const newMessages = unreadCount - lastUnreadCount;
                showNewMessageNotification(newMessages, user);
            }
            lastUnreadCount = unreadCount;
        }
        
        // Para responsáveis: conta mensagens não lidas que recebeu
        else if (user.user_type === 'guardian') {
            try {
                const receivedMessages = await api.getReceivedMessages('general');
                const unreadReceived = receivedMessages.filter(msg => !msg.is_read && msg.sender_id == user.student_id).length;
                updateBadges(unreadReceived, 'guardian');

                // Se aumentou o número de não lidas, mostra notificação
                if (unreadReceived > lastUnreadCount) {
                    const newMessages = unreadReceived - lastUnreadCount;
                    showNewMessageNotification(newMessages, user);
                }
                lastUnreadCount = unreadReceived;
            } catch (e) {
                console.log('Erro ao buscar mensagens para responsável:', e);
            }
        }
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
        if (!user) {
            return;
        }

        if (user.user_type === 'student') {
            const data = await api.getUnreadMessagesCount();
            const count = data.unread_count || 0;
            updateBadges(count, 'student');
        } else if (user.user_type === 'guardian') {
            const receivedMessages = await api.getReceivedMessages('general');
            const unreadCount = receivedMessages.filter(msg => !msg.is_read && msg.sender_id == user.student_id).length;
            updateBadges(unreadCount, 'guardian');
        }
    } catch (error) {
        console.error('Erro ao atualizar badges:', error);
    }
}

/**
 * Atualiza os badges de notificação (interno)
 */
function updateBadges(count, userType = 'student') {
    if (userType === 'student') {
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
    } else if (userType === 'guardian') {
        const badgeGuardian = document.getElementById('unread-badge-guardian');
        const badgeGuardianMobile = document.getElementById('unread-badge-guardian-mobile');

        if (badgeGuardian) {
            if (count > 0) {
                badgeGuardian.classList.remove('hidden');
            } else {
                badgeGuardian.classList.add('hidden');
            }
        }

        if (badgeGuardianMobile) {
            if (count > 0) {
                badgeGuardianMobile.classList.remove('hidden');
            } else {
                badgeGuardianMobile.classList.add('hidden');
            }
        }
    }
}

/**
 * Mostra notificação de nova mensagem
 */
function showNewMessageNotification(count, user) {
    // Tentar usar notificação do navegador se permitido
    if ('Notification' in window && Notification.permission === 'granted') {
        let title = '';
        let body = '';

        if (user.user_type === 'student') {
            // Para estudantes, mostra genérico
            title = 'Lumind - Nova Mensagem';
            body = count === 1 
                ? 'Você recebeu uma nova mensagem! 💬'
                : `Você recebeu ${count} novas mensagens! 💬`;
        } else if (user.user_type === 'guardian') {
            // Para responsáveis, mostra nome do aluno
            const studentName = user.full_name ? user.full_name.split(' ')[0] : 'Seu aluno';
            title = `Nova mensagem de ${studentName}`;
            body = count === 1 
                ? `${studentName} enviou uma mensagem! 💬`
                : `${studentName} enviou ${count} mensagens! 💬`;
        }
            
        new Notification(title, {
            body: body,
            icon: '/images/Logo_Lumind.png',
            badge: '/images/Logo_Lumind.png'
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
