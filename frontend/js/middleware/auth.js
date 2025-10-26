import { userState } from '../utils/userState.js';

export const authMiddleware = async () => {
    const user = userState.user;
    
    // Se a rota requer autenticação e não há usuário
    if (!user) {
        // Salva a rota pretendida para redirecionamento após login
        localStorage.setItem('intendedRoute', window.location.pathname);
        
        // Redireciona para login
        window.router.navigate('/login');
        return false;
    }
    
    return true;
};

export const guestMiddleware = async () => {
    const user = userState.user;
    
    // Se já está autenticado, redireciona para a página inicial
    if (user) {
        window.router.navigate('/recomendacao');
        return false;
    }
    
    return true;
};