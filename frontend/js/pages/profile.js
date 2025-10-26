import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';
import { applyAccessibilitySettings } from '../utils/accessibility.js'; 

export default function PerfilUsuarioPage() {
    // Este HTML é baseado no seu index.html original
    return `
        <div class="items-start pt-8 w-full">
            <div class="container mx-auto px-4 max-w-2xl w-full"> 
                <div class="flex flex-col text-center sm:flex-row sm:justify-between sm:items-center mb-8 gap-3">
                    <h1 class="screen-title sm:text-left order-2 sm:order-1 flex-grow"><i class="fas fa-user-cog mr-2 text-purple-500"></i>Meu Perfil</h1>
                    <button data-route="/recomendacao" class="btn-subtle text-sm order-1 sm:order-2 w-full sm:w-auto"><i class="fas fa-arrow-left mr-2"></i> Voltar</button>
                </div>
                
                <div class="card mb-6">
                    <h2 class="text-lg font-semibold mb-4 text-gray-700">Informações Pessoais</h2>
                    <form id="form-perfil-info" action="#" method="POST" class="space-y-4">
                        <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                            <img id="perfil-foto" src="https://placehold.co/80x80/A78BFA/FFFFFF?text=S" alt="Foto de perfil" class="w-20 h-20 rounded-full object-cover border-2 border-purple-200">
                            <div class="w-full sm:w-auto flex-grow">
                                <label for="perfil-nome" class="block text-sm font-medium text-gray-700">Nome</label>
                                <input type="text" id="perfil-nome" name="perfil-nome" value="Carregando..." class="input-field mb-0">
                            </div>
                        </div>
                        <div>
                            <label for="perfil-email" class="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="perfil-email" name="perfil-email" value="Carregando..." class="input-field" readonly> 
                        </div>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <button type="submit" class="btn-primary w-full sm:w-auto"><i class="fas fa-save mr-2"></i>Salvar Nome</button>
                            <span id="btn-alterar-senha" class="link self-center cursor-pointer">Alterar Senha</span>
                        </div>
                    </form>
                </div>

                <div class="card mb-6">
                    <h2 class="text-lg font-semibold mb-4 text-gray-700">Preferências e Interesses</h2>
                    <p class="text-sm text-gray-600 mb-3">Ajuste como o Lumind funciona para você.</p>
                    <button id="btn-ajustar-preferencias-perfil" class="btn-secondary"><i class="fas fa-edit mr-2"></i> Ajustar Preferências</button>
                    <div class="mt-4 space-y-2 text-sm">
                        <p class="text-gray-700">Estilos preferidos: <span id="perfil-estilos" class="preference-tag">Carregando...</span></p>
                        <p class="text-gray-700">Interesses: <span id="perfil-interesses" class="preference-tag">Carregando...</span></p>
                    </div>
                </div>
                
                <div class="card">
                    <h2 class="text-lg font-semibold mb-4 text-gray-700">Opções de Acessibilidade</h2>
                    <form id="form-perfil-acessibilidade" action="#" method="POST" class="space-y-4">
                        <div>
                            <label for="acess-font-size" class="block text-sm font-medium text-gray-700">Tamanho da Fonte Global</label>
                            <select id="acess-font-size" name="acess-font-size" class="input-field">
                                <option>Padrão</option>
                                <option>Médio</option>
                                <option>Grande</option>
                            </select>
                        </div>
                        <div>
                            <label for="acess-contrast" class="block text-sm font-medium text-gray-700">Esquema de Cores</label>
                            <select id="acess-contrast" name="acess-contrast" class="input-field">
                                <option>Padrão Lumind</option>
                                <option>Alto Contraste</option>
                            </select>
                        </div>
                        <div class="flex items-center">
                            <input id="acess-animations" name="acess-animations" type="checkbox" class="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
                            <label for="acess-animations" class="ml-2 block text-sm text-gray-900">Reduzir Animações</label>
                        </div>
                        <div class="flex items-center">
                            <input id="acess-tts-global" name="acess-tts-global" type="checkbox" class="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
                            <label for="acess-tts-global" class="ml-2 block text-sm text-gray-900">Suporte a Leitor de Tela</label>
                        </div>
                        <button type="submit" class="btn-primary mt-2"><i class="fas fa-save mr-2"></i>Salvar Acessibilidade</button>
                    </form>
                </div>
                <div class="text-center mt-8">
                    <button id="btn-sair-conta-perfil" class="text-red-500 hover:text-red-700 font-medium"><i class="fas fa-sign-out-alt mr-2"></i> Sair da Conta</button>
                </div>
            </div>
        </div>
    `;
}

export function setup() {
    const user = userState.user;
    if (!user) {
        window.router.navigate('/login');
        return;
    }

    // Preenche dados do usuário
    document.getElementById('perfil-nome').value = user.full_name;
    document.getElementById('perfil-email').value = user.email;
    document.getElementById('perfil-foto').src = `https://placehold.co/80x80/A78BFA/FFFFFF?text=${user.full_name.substring(0,1).toUpperCase()}`;
    
    // Preenche preferências
    try {
        const prefs = user.learning_preferences ? JSON.parse(user.learning_preferences) : ["Não definido"];
        const interests = user.interests ? JSON.parse(user.interests) : ["Não definido"];
        document.getElementById('perfil-estilos').textContent = prefs.join(', ');
        document.getElementById('perfil-interesses').textContent = interests.join(', ');
    } catch (e) {
        document.getElementById('perfil-estilos').textContent = user.learning_preferences || "Não definido";
        document.getElementById('perfil-interesses').textContent = user.interests || "Não definido";
    }

    // Preenche configurações de acessibilidade salvas
    const settings = user.accessibility_settings || {};
    document.getElementById('acess-font-size').value = settings.font_size || 'Padrão';
    document.getElementById('acess-contrast').value = settings.contrast || 'Padrão Lumind';
    document.getElementById('acess-animations').checked = settings.reduce_animations || false;
    document.getElementById('acess-tts-global').checked = settings.text_to_speech || false;
    
    // --- Listeners ---
    document.querySelector('[data-route="/recomendacao"]').addEventListener('click', () => window.router.navigate('/recomendacao'));
    document.getElementById('btn-ajustar-preferencias-perfil').addEventListener('click', () => window.router.navigate('/questionario'));
    document.getElementById('btn-alterar-senha').addEventListener('click', () => showCustomAlert('Função ainda não implementada.', 'Aviso', 'info'));


    // Form Salvar Nome
    document.getElementById('form-perfil-info').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = document.getElementById('perfil-nome').value.trim();
        if (newName === user.full_name) return;

        try {
            await api.updateProfile({ full_name: newName });
            user.full_name = newName; 
            userState.user = user; 
            showCustomAlert('Nome salvo!', 'Sucesso', 'success');
        } catch (error) {
            showCustomAlert('Erro ao salvar nome.', 'Erro', 'error');
        }
    });

    // Form Salvar Acessibilidade
    document.getElementById('form-perfil-acessibilidade').addEventListener('submit', async (e) => {
        e.preventDefault();
        const accessibilityData = {
            font_size: document.getElementById('acess-font-size').value,
            contrast: document.getElementById('acess-contrast').value,
            reduce_animations: document.getElementById('acess-animations').checked,
            text_to_speech: document.getElementById('acess-tts-global').checked
        };
        
        try {
            await api.updateAccessibility(accessibilityData);
            user.accessibility_settings = accessibilityData; 
            userState.user = user;
            applyAccessibilitySettings(accessibilityData); // Aplica globalmente
            showCustomAlert('Opções de acessibilidade salvas!', 'Sucesso', 'success');
        } catch (error) {
            showCustomAlert('Erro ao salvar configurações.', 'Erro', 'error');
        }
    });

    // Botão Sair
    document.getElementById('btn-sair-conta-perfil').addEventListener('click', () => {
        api.logout();
        userState.user = null;
        window.router.navigate('/login');
    });
}