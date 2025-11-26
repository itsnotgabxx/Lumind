// frontend/js/config/routes.js
import { authMiddleware, guestMiddleware, studentOnlyMiddleware, guardianOnlyMiddleware } from '../middleware/auth.js';

export const routes = [
    {
        path: '/',
        component: () => import('../pages/home.js'),
        title: 'Início',
        middleware: [guestMiddleware]
    },
    {
        path: '/login-type',
        component: () => import('../pages/loginType.js'),
        title: 'Tipo de Acesso',
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
    // 📚 ROTAS EXCLUSIVAS PARA ESTUDANTES
    {
        path: '/questionario',
        component: () => import('../pages/questionario.js'),
        title: 'Questionário',
        middleware: [studentOnlyMiddleware]
    },
    {
        path: '/recomendacao',
        component: () => import('../pages/recomendacao.js'),
        title: 'Recomendações',
        middleware: [studentOnlyMiddleware]
    },
    {
        path: '/conteudo/:id',
        component: () => import('../pages/conteudo.js'),
        title: 'Conteúdo',
        middleware: [studentOnlyMiddleware]
    },
    {
        path: '/mensagens',
        component: () => import('../pages/mensagens.js'),
        title: 'Mensagens',
        middleware: [studentOnlyMiddleware]
    },
    // ROTAS PARA RESPONSÁVEIS
    {
        path: '/acompanhamento',
        component: () => import('../pages/acompanhamento.js'),
        title: 'Acompanhamento',
        middleware: [guardianOnlyMiddleware]
    },
    {
        path: '/enviarIncentivo',
        component: () => import('../pages/enviarIncentivo.js'),
        title: 'Enviar Incentivo',
        middleware: [guardianOnlyMiddleware]
    },
    {
        path: '/falarComEspecialista',
        component: () => import('../pages/falarComEspecialista.js'),
        title: 'Falar com Especialista',
        middleware: [guardianOnlyMiddleware]
    },
    {
        path: '/historico',
        component: () => import('../pages/historicoCompleto.js'),
        title: 'Histórico Completo',
        middleware: [guardianOnlyMiddleware]
    },
    // 🔄 ROTAS COMPARTILHADAS (acessíveis para ambos)
    {
        path: '/perfil',
        component: () => import('../pages/profile.js'),
        title: 'Meu Perfil',
        middleware: [authMiddleware]
    },
    {
        path: '/progresso',
        component: () => import('../pages/progresso.js'),
        title: 'Progresso',
        middleware: [authMiddleware]
    }
];