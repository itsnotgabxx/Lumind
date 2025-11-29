// frontend/js/utils/router.js (O CÓDIGO CORRETO)
import { userState } from './userState.js';
import { NavBar } from '../components/NavBar.js'; // <-- ADICIONE ESTA LINHA

export class Router {
    constructor(routes) {
        this.routes = routes; // Recebe as rotas do routes.js
        this.app = document.getElementById('app');
        this.navBar = new NavBar(userState.user);
        this.navContainer = document.getElementById('navbar-container');
        
        userState.subscribe((user) => {
            this.navBar = new NavBar(user);
            this.navContainer.innerHTML = this.navBar.render();
            if (user) {
                this.navBar.setupEventListeners();
            }
        });

        window.addEventListener('popstate', (event) => {
            this._handleRoute(event.state);
        });
    }

    init() {
    // ADICIONE ESTE CÓDIGO
    // Escuta todos os cliques na janela
    window.addEventListener('click', e => {
        // Verifica se o clique foi em um <a> ou dentro de um <a> que tenha [data-link]
        const link = e.target.closest('a[data-link]');

        if (link) {
            e.preventDefault(); // Impede o navegador de recarregar a página
            this.navigate(link.pathname); // Usa seu router para navegar
        }
    });
    // FIM DO CÓDIGO ADICIONADO

    this.routes.push({
        path: '/404',
        component: () => import('../pages/404.js'),
        title: 'Página não encontrada'
    });

    this._handleRoute(null);
}

    navigate(path, state = {}) {
        window.history.pushState(state, '', path);
        this._handleRoute(state);
    }

    _pathToRegex(path) {
        const regex = new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '([^\\/]+)') + '$');
        return regex;
    }

    _findRoute(path) {
        let params = {};
        const potentialRoute = this.routes.find(route => {
            const regex = this._pathToRegex(route.path);
            const match = path.match(regex);
            
            if (match) {
                const paramKeys = (route.path.match(/:\w+/g) || []).map(key => key.substring(1));
                params = paramKeys.reduce((acc, key, index) => {
                    acc[key] = match[index + 1];
                    return acc;
                }, {});
                return true;
            }
            return false;
        });

        if (potentialRoute) {
            return { route: potentialRoute, params };
        }
        
        return { route: this.routes.find(r => r.path === '/404'), params: {} };
    }

    async _handleRoute(state) {
        const path = window.location.pathname;
        const { route, params } = this._findRoute(path);

        try {
            if (route.middleware) {
                for (const middleware of route.middleware) {
                    const result = await middleware(this);
                    if (!result) return;
                }
            }

            const module = await route.component();

            // Passa params e state para a função default (render)
            const renderFn = module.default;
            if (typeof renderFn !== 'function') {
                throw new Error(`Rota '${route.path}' não exporta uma função default válida.`);
            }
            const content = await renderFn({ params, state });
            this.app.innerHTML = content;

            // Passa params e state para a função setup (eventos)
            if (typeof module.setup === 'function') {
                module.setup({ params, state });
            }

            document.title = `${route.title} - Lumind`;
        } catch (err) {
            console.error('Erro ao carregar rota:', {
                path,
                err
            });
            // Fallback simples para evitar tela branca
            this.app.innerHTML = `
                <div class="w-full max-w-[900px] mx-auto px-4 py-8">
                    <div class="card border-2 border-red-200 bg-red-50">
                        <h1 class="text-xl font-bold text-red-700 mb-2 flex items-center gap-2">
                            <i class="fas fa-bug"></i>
                            Ocorreu um erro ao carregar esta página
                        </h1>
                        <p class="text-sm text-red-600 mb-4">${err?.message || 'Erro desconhecido'}</p>
                        <div class="flex gap-3">
                            <button class="btn-primary" data-route="/">Voltar ao início</button>
                            <button class="btn-subtle" data-route="/404">Abrir página 404</button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Renderização da Navbar com tolerância a erros
        try {
            this.navBar = new NavBar(userState.user);
            if (this.navContainer) {
                this.navContainer.innerHTML = this.navBar.render();
                if (userState.user) {
                    this.navBar.setupEventListeners();
                }
            }
        } catch (e) {
            console.error('Erro ao renderizar Navbar:', e);
        }
    }
}