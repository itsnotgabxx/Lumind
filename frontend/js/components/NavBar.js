import { userState } from '../utils/userState.js';
import { showConfirmDialog } from '../utils/confirmDialog.js'; // 👈 ADICIONAR ESTA LINHA

export class NavBar {
    constructor(user = null) {
        this.user = user;
    }

    render() {
        return `
            <nav class="bg-white shadow-sm">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex">
                            <div class="flex-shrink-0 flex items-center">
                               <a href="/" class="text-purple-600 font-bold text-xl" data-link>Lumind</a>
                            </div>
                            ${this.user ? this.authenticatedLinks() : this.guestLinks()}
                        </div>
                        ${this.user ? this.userMenu() : ''}
                    </div>
                </div>
            </nav>
        `;
    }

    authenticatedLinks() {
    return `
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a href="/recomendacao" 
               class="nav-link ${this.isActive('/recomendacao')}" data-link> 
                Recomendações
            </a>
            <a href="/progresso" 
               class="nav-link ${this.isActive('/progresso')}" data-link>
                Meu Progresso
            </a>
        </div>
    `;
}

    guestLinks() {
    return `
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a href="/login" 
               class="nav-link ${this.isActive('/login')}" data-link>
                Entrar
            </a>
            <a href="/cadastro" 
               class="nav-link ${this.isActive('/cadastro')}" data-link>
                Criar Conta
            </a>
        </div>
    `;
}

    userMenu() {
        return `
            <div class="hidden sm:ml-6 sm:flex sm:items-center">
                <div class="ml-3 relative">
                    <div>
                        <button type="button" 
                                class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" 
                                id="user-menu-button" 
                                aria-expanded="false" 
                                aria-haspopup="true">
                            <span class="sr-only">Abrir menu do usuário</span>
                            <img class="h-8 w-8 rounded-full" 
                                 src="${this.getUserAvatar()}" 
                                 alt="${this.user.full_name}">
                        </button>
                    </div>
                    <div class="user-menu hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" 
                         role="menu" 
                         aria-orientation="vertical" 
                         aria-labelledby="user-menu-button" 
                         tabindex="-1">
                        <a href="/perfil" 
   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
   role="menuitem" data-link>
    Meu Perfil
</a>
                        <a href="#" 
                           class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                           role="menuitem"
                           id="logout-button">
                            Sair
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    getUserAvatar() {
        return `https://placehold.co/80x80/A78BFA/FFFFFF?text=${this.user.full_name.substring(0,1).toUpperCase()}`;
    }

    isActive(path) {
        return window.location.pathname === path ? 'active' : '';
    }

    setupEventListeners() {
    // Toggle menu do usuário
    const menuButton = document.getElementById('user-menu-button');
    const menu = document.querySelector('.user-menu');
    
    if (menuButton && menu) {
        menuButton.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        // Fecha o menu quando clicar fora
        document.addEventListener('click', (e) => {
            if (!menuButton.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.add('hidden');
            }
        });
    }

    // Botão de logout
    const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();

                showConfirmDialog(
                    'Você tem certeza que deseja sair da sua conta?',
                    'Sair da Conta',
                    () => {
                        // Confirmou - faz logout
                        api.logout();
                        userState.user = null;
                        sessionStorage.clear();
                        localStorage.clear();
                        
                        window.location.reload();
                    },
                    () => {
                        // Cancelou - não faz nada
                        console.log('Logout cancelado');
                    }
                );
            });
        }
    }
}