export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        
        // Intercepta mudanças na URL
        window.addEventListener('popstate', this._handleRoute.bind(this));
    }

    // Registra uma nova rota
    register(path, {
        component,
        title,
        auth = false,
        middleware = []
    }) {
        this.routes.set(path, {
            component,
            title,
            auth,
            middleware
        });
    }

    // Navega para uma rota específica
    async navigate(path, data = {}) {
        // Atualiza a URL
        window.history.pushState(data, '', path);
        await this._handleRoute();
    }

    // Manipula a mudança de rota
    async _handleRoute() {
        const path = window.location.pathname;
        const route = this.routes.get(path) || this.routes.get('/404');

        if (!route) {
            console.error(`Rota não encontrada: ${path}`);
            return;
        }

        // Executa middlewares
        for (const middleware of route.middleware) {
            const result = await middleware();
            if (!result) return; // Middleware bloqueou a navegação
        }

        // Atualiza o título da página
        document.title = `${route.title} - Lumind`;

        // Carrega o componente de forma lazy
        try {
            const content = await route.component();
            document.getElementById('app').innerHTML = content;
            
            // Dispara evento de mudança de rota
            window.dispatchEvent(new CustomEvent('routeChanged', { 
                detail: { path, data: window.history.state } 
            }));
        } catch (error) {
            console.error('Erro ao carregar componente:', error);
        }
    }

    // Inicializa o router
    async init() {
        // Registra rotas padrão
        this.register('/404', {
            component: () => import('../pages/404.js'),
            title: 'Página não encontrada'
        });

        // Trata a rota inicial
        await this._handleRoute();
    }
}