import { userState } from '../utils/userState.js';
import { showConfirmDialog } from '../utils/confirmDialog.js';

export class NavBar {
    constructor(user = null) {
        this.user = user;
        this.mobileMenuOpen = false;
    }

    render() {
        return `
            <nav class="bg-white shadow-md border-b-2 border-purple-100 sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-20">
                        <!-- Logo e Marca -->
                        <div class="flex items-center gap-3">
                            <a href="/" class="flex items-center gap-3 group" data-link>
                                <img src="/images/Logo_Lumind.png" alt="Lumind Logo" class="h-12 w-auto group-hover:scale-105 transition-transform">
                                <div class="hidden sm:block">
                                    <h1 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                        Lumind
                                    </h1>
                                    <p class="text-xs text-gray-500 -mt-1">Aprendizado Inclusivo</p>
                                </div>
                            </a>
                        </div>

                        <!-- Desktop Navigation -->
                        <div class="hidden md:flex items-center gap-2">
                            ${this.user ? this.authenticatedLinks() : this.guestLinks()}
                        </div>

                        <!-- User Menu / Auth Buttons -->
                        <div class="hidden md:flex items-center gap-3">
                            ${this.user ? this.userMenu() : this.authButtons()}
                        </div>

                        <!-- Mobile Menu Button -->
                        <button 
                            id="mobile-menu-button" 
                            class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Menu"
                        >
                            <i class="fas fa-bars text-2xl text-gray-600"></i>
                        </button>
                    </div>
                </div>

                <!-- Mobile Menu -->
                <div id="mobile-menu" class="md:hidden hidden bg-white border-t border-gray-200 shadow-lg">
                    <div class="px-4 py-4 space-y-3">
                        ${this.user ? this.mobileAuthenticatedLinks() : this.mobileGuestLinks()}
                        
                        ${this.user ? `
                            <div class="pt-4 border-t border-gray-200">
                                <div class="flex items-center gap-3 mb-4 p-3 bg-purple-50 rounded-lg">
                                    <img class="h-12 w-12 rounded-full border-2 border-purple-300" 
                                         src="${this.getUserAvatar()}" 
                                         alt="${this.user.full_name}">
                                    <div>
                                        <p class="font-semibold text-gray-800">${this.user.full_name}</p>
                                        <p class="text-sm text-gray-600">${this.user.email}</p>
                                    </div>
                                </div>
                                <a href="/perfil" 
                                   class="mobile-nav-link" 
                                   data-link>
                                    <i class="fas fa-user-circle w-6"></i>
                                    <span>Meu Perfil</span>
                                </a>
                                <button id="mobile-logout-button" class="mobile-nav-link w-full text-red-600 hover:bg-red-50">
                                    <i class="fas fa-sign-out-alt w-6"></i>
                                    <span>Sair</span>
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </nav>
        `;
    }

    authenticatedLinks() {
        if (!this.user) return '';
        
        if (this.user.user_type === 'guardian') {
            return `
                <a href="/acompanhamento" 
                   class="desktop-nav-link ${this.isActive('/acompanhamento')}" 
                   data-link>
                    <i class="fas fa-chart-line"></i>
                    <span>Acompanhamento</span>
                </a>
                <a href="/progresso" 
                   class="desktop-nav-link ${this.isActive('/progresso')}" 
                   data-link>
                    <i class="fas fa-user-graduate"></i>
                    <span>Progresso do Aluno</span>
                </a>
                <a href="/mensagens-responsavel" 
                   class="desktop-nav-link relative ${this.isActive('/mensagens-responsavel')}" 
                   data-link>
                    <i class="fas fa-envelope relative">
                        <span id="unread-badge-guardian" class="hidden absolute -top-2 -right-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full w-2.5 h-2.5 border-2 border-white shadow-lg"></span>
                    </i>
                    <span>Mensagens</span>
                </a>
                <a href="/enviarIncentivo" 
                   class="desktop-nav-link ${this.isActive('/enviarIncentivo')}" 
                   data-link>
                    <i class="fas fa-heart"></i>
                    <span>Enviar Incentivo</span>
                </a>
            `;
        }
        
        return `
            <a href="/recomendacao" 
               class="desktop-nav-link ${this.isActive('/recomendacao')}" 
               data-link>
                <i class="fas fa-star"></i>
                <span>Explorar</span>
            </a>
            <a href="/progresso" 
               class="desktop-nav-link ${this.isActive('/progresso')}" 
               data-link>
                <i class="fas fa-chart-line"></i>
                <span>Meu Progresso</span>
            </a>
            <a href="/companheiros" 
               class="desktop-nav-link ${this.isActive('/companheiros')}" 
               data-link>
                <i class="fas fa-users"></i>
                <span>Companheiros</span>
            </a>
            <a href="/mensagens" 
               class="desktop-nav-link relative ${this.isActive('/mensagens')}" 
               data-link>
                <i class="fas fa-envelope relative">
                    <span id="unread-badge" class="hidden absolute -top-2 -right-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full w-2.5 h-2.5 border-2 border-white shadow-lg"></span>
                </i>
                <span>Mensagens</span>
            </a>
        `;
    }

    guestLinks() {
        return `
            <a href="/" 
               class="desktop-nav-link ${this.isActive('/')}" 
               data-link>
                <i class="fas fa-home"></i>
                <span>Início</span>
            </a>
        `;
    }

    mobileAuthenticatedLinks() {
        if (!this.user) return '';
        
        if (this.user.user_type === 'guardian') {
            return `
                <a href="/acompanhamento" 
                   class="mobile-nav-link ${this.isActive('/acompanhamento')}" 
                   data-link>
                    <i class="fas fa-chart-line w-6"></i>
                    <span>Acompanhamento</span>
                </a>
                <a href="/progresso" 
                   class="mobile-nav-link ${this.isActive('/progresso')}" 
                   data-link>
                    <i class="fas fa-user-graduate w-6"></i>
                    <span>Progresso do Aluno</span>
                </a>
                <a href="/mensagens-responsavel" 
                   class="mobile-nav-link relative ${this.isActive('/mensagens-responsavel')}" 
                   data-link>
                    <i class="fas fa-envelope w-6 relative">
                        <span id="unread-badge-guardian-mobile" class="hidden absolute -top-1 -right-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full w-2.5 h-2.5 border-2 border-white shadow-lg"></span>
                    </i>
                    <span>Mensagens</span>
                </a>
                <a href="/enviarIncentivo" 
                   class="mobile-nav-link ${this.isActive('/enviarIncentivo')}" 
                   data-link>
                    <i class="fas fa-heart w-6"></i>
                    <span>Enviar Incentivo</span>
                </a>
                <a href="/falarComEspecialista" 
                   class="mobile-nav-link ${this.isActive('/falarComEspecialista')}" 
                   data-link>
                    <i class="fas fa-comments w-6"></i>
                    <span>Falar com Especialista</span>
                </a>
            `;
        }
    
        return `
            <a href="/recomendacao" 
               class="mobile-nav-link ${this.isActive('/recomendacao')}" 
               data-link>
                <i class="fas fa-star w-6"></i>
                <span>Explorar Conteúdos</span>
            </a>
            <a href="/progresso" 
               class="mobile-nav-link ${this.isActive('/progresso')}" 
               data-link>
                <i class="fas fa-chart-line w-6"></i>
                <span>Meu Progresso</span>
            </a>
            <a href="/companheiros" 
               class="mobile-nav-link ${this.isActive('/companheiros')}" 
               data-link>
                <i class="fas fa-users w-6"></i>
                <span>Companheiros</span>
            </a>
            <a href="/mensagens" 
               class="mobile-nav-link relative ${this.isActive('/mensagens')}" 
               data-link>
                <i class="fas fa-envelope w-6 relative">
                    <span id="unread-badge-mobile" class="hidden absolute -top-1 -right-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full w-2.5 h-2.5 border-2 border-white shadow-lg"></span>
                </i>
                <span>Mensagens</span>
            </a>
        `;
    }

    mobileGuestLinks() {
        return `
            <a href="/" 
               class="mobile-nav-link ${this.isActive('/')}" 
               data-link>
                <i class="fas fa-home w-6"></i>
                <span>Início</span>
            </a>
            <a href="/login-type" 
               class="mobile-nav-link" 
               data-link>
                <i class="fas fa-sign-in-alt w-6"></i>
                <span>Entrar</span>
            </a>
            <a href="/login-type" 
               class="mobile-nav-link" 
               data-link>
                <i class="fas fa-user-plus w-6"></i>
                <span>Criar Conta</span>
            </a>
        `;
    }

    authButtons() {
        return `
            <a href="/login-type" class="btn-subtle" data-link>
                Entrar
            </a>
            <a href="/login-type" class="btn-primary" data-link>
                Começar Grátis
            </a>
        `;
    }

    userMenu() {
        return `
            <div class="relative">
                <button type="button" 
                        class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors" 
                        id="user-menu-button" 
                        aria-expanded="false" 
                        aria-haspopup="true">
                    <img class="h-10 w-10 rounded-full border-2 border-purple-300 shadow-sm" 
                         src="${this.getUserAvatar()}" 
                         alt="${this.user.full_name}">
                    <div class="hidden lg:block text-left">
                        <p class="text-sm font-semibold text-gray-800">${this.user.full_name.split(' ')[0]}</p>
                        <p class="text-xs text-gray-500">${this.user.user_type === 'guardian' ? 'Responsável' : 'Estudante'}</p>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 text-sm"></i>
                </button>
                
                <div class="user-menu hidden absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 overflow-hidden" 
                     role="menu">
                    <div class="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-b">
                        <p class="font-semibold text-gray-800">${this.user.full_name}</p>
                        <p class="text-sm text-gray-600">${this.user.email}</p>
                    </div>
                    <div class="py-2">
                        <a href="/perfil" 
                           class="dropdown-menu-item" 
                           role="menuitem" 
                           data-link>
                            <i class="fas fa-user-circle w-5"></i>
                            <span>Meu Perfil</span>
                        </a>
                        <a href="/progresso" 
                           class="dropdown-menu-item" 
                           role="menuitem" 
                           data-link>
                            <i class="fas fa-chart-bar w-5"></i>
                            <span>Estatísticas</span>
                        </a>
                    </div>
                    <div class="border-t">
                        <button id="logout-button" 
                                class="dropdown-menu-item w-full text-red-600 hover:bg-red-50">
                            <i class="fas fa-sign-out-alt w-5"></i>
                            <span>Sair da Conta</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getUserAvatar() {
        // Usa avatar enviado se disponível; senão, gera avatar por iniciais
        if (this.user && this.user.avatar_url) {
            // Cache-busting simples para garantir atualização após upload
            const ts = Date.now();
            return `${this.user.avatar_url}?t=${ts}`;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.user.full_name)}&background=8B5CF6&color=fff&size=128&bold=true`;
    }

    isActive(path) {
        return window.location.pathname === path ? 'active' : '';
    }

    setupEventListeners() {
        const menuButton = document.getElementById('user-menu-button');
        const menu = document.querySelector('.user-menu');
        
        if (menuButton && menu) {
            menuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('hidden');
                const isExpanded = !menu.classList.contains('hidden');
                menuButton.setAttribute('aria-expanded', isExpanded);
            });

            document.addEventListener('click', (e) => {
                if (!menuButton.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.add('hidden');
                    menuButton.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileMenuButton.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });

            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuButton.querySelector('i');
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                });
            });
        }

        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        const mobileLogoutButton = document.getElementById('mobile-logout-button');
        if (mobileLogoutButton) {
            mobileLogoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    }

    handleLogout() {
        showConfirmDialog(
            'Você tem certeza que deseja sair da sua conta?',
            'Sair da Conta',
            () => {
                api.logout();
                userState.user = null;
                sessionStorage.clear();
                localStorage.clear();
                window.location.href = '/';
            }
        );
    }
}