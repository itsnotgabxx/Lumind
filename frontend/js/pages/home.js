export default function HomePage() {
    return `
        <div class="w-full">
            <!-- Hero Section -->
            <div class="bg-gradient-to-br from-purple-50 to-blue-50 py-16 px-4 mb-12 rounded-2xl">
                <div class="max-w-4xl mx-auto text-center">
                    <div class="lumind-logo-placeholder mb-6 mx-auto">L</div>
                    <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Bem-vindo ao Lumind
                    </h1>
                    <p class="text-xl text-gray-600 mb-8">
                        Uma plataforma de aprendizado inclusiva, acessível e personalizada para você
                    </p>
                    
                    <div class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <button id="btn-home-login" class="btn-primary text-lg py-4 px-8">
                            <i class="fas fa-sign-in-alt mr-2"></i>Entrar
                        </button>
                        <button id="btn-home-cadastro" class="btn-secondary text-lg py-4 px-8">
                            <i class="fas fa-user-plus mr-2"></i>Criar Conta Grátis
                        </button>
                    </div>
                </div>
            </div>

            <!-- Features Section -->
            <div class="max-w-6xl mx-auto px-4 mb-16">
                <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
                    Por que escolher o Lumind?
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Feature 1: Acessibilidade -->
                    <div class="card text-center hover:shadow-xl transition-shadow">
                        <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-universal-access text-3xl text-purple-600"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-3 text-gray-800">100% Acessível</h3>
                        <p class="text-gray-600">
                            Interface adaptável com controles de fonte, contraste e suporte completo para leitores de tela
                        </p>
                    </div>

                    <!-- Feature 2: Personalização -->
                    <div class="card text-center hover:shadow-xl transition-shadow">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-brain text-3xl text-blue-600"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-3 text-gray-800">Personalizado</h3>
                        <p class="text-gray-600">
                            Conteúdo adaptado ao seu ritmo e estilo de aprendizagem preferido
                        </p>
                    </div>

                    <!-- Feature 3: Acompanhamento -->
                    <div class="card text-center hover:shadow-xl transition-shadow">
                        <div class="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-users text-3xl text-teal-600"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-3 text-gray-800">Acompanhamento Familiar</h3>
                        <p class="text-gray-600">
                            Responsáveis podem acompanhar o progresso e enviar mensagens de incentivo
                        </p>
                    </div>
                </div>
            </div>

            <!-- Content Types Section -->
            <div class="bg-gray-50 py-16 px-4 rounded-2xl mb-16">
                <div class="max-w-6xl mx-auto">
                    <h2 class="text-3xl font-bold text-center text-gray-800 mb-4">
                        Aprenda do seu jeito
                    </h2>
                    <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Oferecemos diversos formatos de conteúdo para atender diferentes estilos de aprendizagem
                    </p>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <div class="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
                            <i class="fas fa-video text-4xl text-purple-500 mb-3"></i>
                            <h4 class="font-semibold text-gray-800 mb-2">Vídeos</h4>
                            <p class="text-sm text-gray-600">Conteúdo visual dinâmico e legendado</p>
                        </div>
                        
                        <div class="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
                            <i class="fas fa-book-open text-4xl text-blue-500 mb-3"></i>
                            <h4 class="font-semibold text-gray-800 mb-2">Leitura</h4>
                            <p class="text-sm text-gray-600">Textos com fonte e tamanho ajustáveis</p>
                        </div>
                        
                        <div class="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
                            <i class="fas fa-headphones text-4xl text-teal-500 mb-3"></i>
                            <h4 class="font-semibold text-gray-800 mb-2">Áudio</h4>
                            <p class="text-sm text-gray-600">Podcasts e narrações claras</p>
                        </div>
                        
                        <div class="bg-white p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
                            <i class="fas fa-gamepad text-4xl text-amber-500 mb-3"></i>
                            <h4 class="font-semibold text-gray-800 mb-2">Jogos</h4>
                            <p class="text-sm text-gray-600">Aprendizado interativo e divertido</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Benefits for TEA -->
            <div class="max-w-6xl mx-auto px-4 mb-16">
                <div class="card bg-blue-50 border-2 border-blue-200">
                    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
                        <i class="fas fa-heart text-red-400 mr-2"></i>
                        Especialmente desenvolvido para pessoas com TEA
                    </h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="flex items-start gap-3">
                            <i class="fas fa-check-circle text-green-500 text-xl mt-1"></i>
                            <div>
                                <h4 class="font-semibold text-gray-800 mb-1">Interface Previsível</h4>
                                <p class="text-gray-600 text-sm">Layout consistente que cria uma rotina visual confortável</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start gap-3">
                            <i class="fas fa-check-circle text-green-500 text-xl mt-1"></i>
                            <div>
                                <h4 class="font-semibold text-gray-800 mb-1">Sem Sobrecarga Sensorial</h4>
                                <p class="text-gray-600 text-sm">Controle de animações, sons e elementos visuais</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start gap-3">
                            <i class="fas fa-check-circle text-green-500 text-xl mt-1"></i>
                            <div>
                                <h4 class="font-semibold text-gray-800 mb-1">Progresso Visual</h4>
                                <p class="text-gray-600 text-sm">Acompanhe seu avanço com indicadores claros</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start gap-3">
                            <i class="fas fa-check-circle text-green-500 text-xl mt-1"></i>
                            <div>
                                <h4 class="font-semibold text-gray-800 mb-1">Ritmo Individual</h4>
                                <p class="text-gray-600 text-sm">Aprenda no seu próprio tempo, sem pressão</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CTA Section -->
            <div class="max-w-4xl mx-auto text-center px-4">
                <div class="card bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    <h2 class="text-3xl font-bold mb-4">Comece sua jornada de aprendizado hoje!</h2>
                    <p class="text-lg mb-8 opacity-90">
                        Junte-se a centenas de alunos que já estão aprendendo de forma personalizada e acessível
                    </p>
                    <button id="btn-home-cadastro-2" class="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg">
                        <i class="fas fa-rocket mr-2"></i>Criar Conta Grátis
                    </button>
                </div>
            </div>
        </div>
    `;
}

export function setup() {
    const btnLogin = document.getElementById('btn-home-login');
    const btnCadastro = document.getElementById('btn-home-cadastro');
    const btnCadastro2 = document.getElementById('btn-home-cadastro-2');
    
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            window.router.navigate('/login-type');
        });
    }

    if (btnCadastro) {
        btnCadastro.addEventListener('click', () => {
            window.router.navigate('/login-type');
        });
    }

    if (btnCadastro2) {
        btnCadastro2.addEventListener('click', () => {
            window.router.navigate('/login-type');
        });
    }
}