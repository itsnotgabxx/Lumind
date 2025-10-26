// frontend/js/config/routes.js (O CÓDIGO CORRETO)
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
        path: '/esqueciSenha',
        component: () => import('../pages/esqueciSenha.js'),
        title: 'Recuperar Senha',
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
        path: '/perfil', // A rota é /perfil
        component: () => import('../pages/profile.js'), // O arquivo é profile.js
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
    },
    {
        path: '/acompanhamento',
        component: () => import('../pages/acompanhamento.js'),
        title: 'Acompanhamento',
        middleware: [authMiddleware]
    },
    {
        path: '/enviarIncentivo',
        component: () => import('../pages/enviarIncentivo.js'),
        title: 'Enviar Incentivo',
        middleware: [authMiddleware]
    },
    {
        path: '/falarComEspecialista',
        component: () => import('../pages/falarComEspecialista.js'),
        title: 'Falar com Especialista',
        middleware: [authMiddleware]
    },
    {
        path: '/historico',
        component: () => import('../pages/historicoCompleto.js'),
        title: 'Histórico Completo',
        middleware: [authMiddleware]
    }
];