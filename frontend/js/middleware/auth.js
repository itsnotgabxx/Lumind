import { userState } from '../utils/userState.js';

export const authMiddleware = async () => {
    const user = userState.user;
    
    if (!user) {
        localStorage.setItem('intendedRoute', window.location.pathname);
        
        window.router.navigate('/login-type');
        return false;
    }
    
    return true;
};

export const studentOnlyMiddleware = async () => {
    const user = userState.user;
    
    if (!user) {
        localStorage.setItem('intendedRoute', window.location.pathname);
        window.router.navigate('/login-type');
        return false;
    }
    
    if (user.user_type !== 'student') {
        window.router.navigate('/acompanhamento');
        return false;
    }
    
    return true;
};

export const guardianOnlyMiddleware = async () => {
    const user = userState.user;
    
    if (!user) {
        localStorage.setItem('intendedRoute', window.location.pathname);
        window.router.navigate('/login-type');
        return false;
    }
    
    if (user.user_type !== 'guardian') {
        window.router.navigate('/recomendacao');
        return false;
    }
    
    return true;
};

export const guestMiddleware = async () => {
    const user = userState.user;
    
    if (user) {
        if (user.user_type === 'guardian') {
            window.router.navigate('/acompanhamento');
        } else {
            window.router.navigate('/recomendacao');
        }
        return false;
    }
    
    return true;
};