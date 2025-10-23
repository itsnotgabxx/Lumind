import { authMiddleware, guestMiddleware } from '../middleware/auth.js';

export const routes = [
    {
        path: '/',
        component: () => import('../pages/home.js'),
        title: 'Início',
        middleware: [guestMiddleware]
    },
    {
        path: '/login',
        component: () => import('../pages/login.js'),
        title: 'Login',
        middleware: [guestMiddleware]
    },
    {
        path: '/cadastro',
        component: () => import('../pages/cadastro.js'),
        title: 'Criar Conta',
        middleware: [guestMiddleware]
    },
    {
        path: '/questionario',
        component: () => import('../pages/questionario.js'),
        title: 'Questionário',
        middleware: [authMiddleware]
    },
    {
        path: '/recomendacao',
        component: () => import('../pages/recomendacao.js'),
        title: 'Recomendações',
        middleware: [authMiddleware]
    },
    {
        path: '/perfil',
        component: () => import('../pages/profile.js'),
        title: 'Meu Perfil',
        middleware: [authMiddleware]
    },
    {
        path: '/progresso',
        component: () => import('../pages/progresso.js'),
        title: 'Meu Progresso',
        middleware: [authMiddleware]
    },
    {
        path: '/conteudo/:id',
        component: () => import('../pages/conteudo.js'),
        title: 'Conteúdo',
        middleware: [authMiddleware]
    }
];