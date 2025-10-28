import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';
import { applyAccessibilitySettings } from '../utils/accessibility.js';
import { showConfirmDialog } from '../utils/confirmDialog.js';

export default function PerfilPage() {
    return `
        <div class="w-full max-w-4xl mx-auto px-4 py-8">
            <!-- Header -->
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">
                        <i class="fas fa-user-cog mr-2 text-purple-500"></i>
                        Meu Perfil
                    </h1>
                    <p class="text-gray-600">Gerencie suas informações e preferências</p>
                </div>
                <button data-route="/recomendacao" class="btn-subtle">
                    <i class="fas fa-arrow-left mr-2"></i>Voltar
                </button>
            </div>
            
            <!-- Informações Pessoais -->
            <div class="card mb-6">
                <h2 class="text-xl font-semibold mb-6 flex items-center pb-4 border-b">
                    <i class="fas fa-user mr-2 text-blue-500"></i>
                    Informações Pessoais
                </h2>
                <form id="form-perfil-info" class="space-y-4">
                    <div class="flex flex-col sm:flex-row items-center gap-6 mb-6">
                        <img id="perfil-foto" 
                             src="https://placehold.co/120x120/A78BFA/FFFFFF?text=U" 
                             alt="Foto de perfil" 
                             class="w-24 h-24 rounded-full border-4 border-purple-200 shadow-lg">
                        <div class="flex-grow text-center sm:text-left">
                            <h3 class="text-xl font-semibold text-gray-800" id="perfil-nome-display">Carregando...</h3>
                            <p class="text-gray-600" id="perfil-email-display">email@exemplo.com</p>
                            <button type="button" class="mt-2 text-sm link">
                                <i class="fas fa-camera mr-1"></i>Alterar foto
                            </button>
                        </div>
                    </div>

                    <div>
                        <label for="perfil-nome" class="block text-sm font-medium text-gray-700 mb-2">
                            Nome Completo
                        </label>
                        <input type="text" id="perfil-nome" name="perfil-nome" class="input-field">
                    </div>

                    <div>
                        <label for="perfil-email" class="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input type="email" id="perfil-email" name="perfil-email" class="input-field" readonly>
                        <p class="text-xs text-gray-500 mt-1">
                            <i class="fas fa-info-circle mr-1"></i>
                            Entre em contato com o suporte para alterar seu email
                        </p>
                    </div>

                    <div class="flex gap-3">
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-save mr-2"></i>Salvar Alterações
                        </button>
                        <button type="button" id="btn-alterar-senha" class="btn-subtle">
                            <i class="fas fa-key mr-2"></i>Alterar Senha
                        </button>
                    </div>
                </form>
            </div>

            <!-- Preferências de Aprendizagem -->
            <div class="card mb-6">
                <h2 class="text-xl font-semibold mb-4 flex items-center pb-4 border-b">
                    <i class="fas fa-brain mr-2 text-purple-500"></i>
                    Preferências de Aprendizagem
                </h2>
                <p class="text-sm text-gray-600 mb-4">
                    Personalize como o Lumind funciona para você
                </p>
                <button id="btn-ajustar-preferencias" class="btn-secondary mb-4">
                    <i class="fas fa-edit mr-2"></i>Ajustar Preferências
                </button>
                <div class="space-y-2">
                    <div class="flex items-start gap-2">
                        <i class="fas fa-check text-green-500 mt-1"></i>
                        <div>
                            <p class="font-medium text-gray-700">Estilos preferidos:</p>
                            <p id="perfil-estilos" class="text-gray-600 text-sm">Carregando...</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-2">
                        <i class="fas fa-check text-green-500 mt-1"></i>
                        <div>
                            <p class="font-medium text-gray-700">Interesses:</p>
                            <p id="perfil-interesses" class="text-gray-600 text-sm">Carregando...</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Acessibilidade -->
            <div class="card mb-6">
                <h2 class="text-xl font-semibold mb-4 flex items-center pb-4 border-b">
                    <i class="fas fa-universal-access mr-2 text-teal-500"></i>
                    Opções de Acessibilidade
                </h2>
                <form id="form-perfil-acessibilidade" class="space-y-4">
                    <div>
                        <label for="acess-font-size" class="block text-sm font-medium text-gray-700 mb-2">
                            Tamanho da Fonte
                        </label>
                        <select id="acess-font-size" name="acess-font-size" class="input-field">
                            <option value="Padrão">Padrão</option>
                            <option value="Médio">Médio (+12.5%)</option>
                            <option value="Grande">Grande (+25%)</option>
                        </select>
                    </div>

                    <div>
                        <label for="acess-contrast" class="block text-sm font-medium text-gray-700 mb-2">
                            Esquema de Cores
                        </label>
                        <select id="acess-contrast" name="acess-contrast" class="input-field">
                            <option value="Padrão Lumind">Padrão Lumind</option>
                            <option value="Alto Contraste">Alto Contraste (Preto/Amarelo)</option>
                        </select>
                    </div>

                    <div class="space-y-3">
                        <label class="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input id="acess-animations" name="acess-animations" type="checkbox" 
                                   class="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
                            <div>
                                <p class="font-medium text-gray-800">Reduzir Animações</p>
                                <p class="text-sm text-gray-600">Desativa transições e animações</p>
                            </div>
                        </label>

                        <label class="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input id="acess-tts-global" name="acess-tts-global" type="checkbox" 
                                   class="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
                            <div>
                                <p class="font-medium text-gray-800">Suporte a Leitor de Tela</p>
                                <p class="text-sm text-gray-600">Otimiza para NVDA e JAWS</p>
                            </div>
                        </label>
                    </div>

                    <button type="submit" class="btn-primary">
                        <i class="fas fa-save mr-2"></i>Salvar Acessibilidade
                    </button>
                </form>
            </div>

            <!-- Danger Zone -->
            <div class="card border-2 border-red-200 bg-red-50">
                <h3 class="text-lg font-semibold text-red-800 mb-4">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    Zona de Perigo
                </h3>
                <p class="text-sm text-red-700 mb-4">
                    Ações irreversíveis que afetam permanentemente sua conta
                </p>
                <div class="flex gap-3">
                    <button id="btn-sair-conta" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        <i class="fas fa-sign-out-alt mr-2"></i>Sair da Conta
                    </button>
                    <button class="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg transition-colors">
                        <i class="fas fa-trash mr-2"></i>Excluir Conta
                    </button>
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

    // Preenche dados
    document.getElementById('perfil-nome').value = user.full_name;
    document.getElementById('perfil-email').value = user.email;
    document.getElementById('perfil-nome-display').textContent = user.full_name;
    document.getElementById('perfil-email-display').textContent = user.email;
    document.getElementById('perfil-foto').src = `https://placehold.co/120x120/A78BFA/FFFFFF?text=${user.full_name.substring(0,1)}`;
    
    // Preferências
    try {
        const prefs = user.learning_preferences ? JSON.parse(user.learning_preferences) : ["Não definido"];
        const interests = user.interests ? JSON.parse(user.interests) : ["Não definido"];
        document.getElementById('perfil-estilos').textContent = prefs.join(', ');
        document.getElementById('perfil-interesses').textContent = interests.join(', ');
    } catch (e) {
        document.getElementById('perfil-estilos').textContent = user.learning_preferences || "Não definido";
        document.getElementById('perfil-interesses').textContent = user.interests || "Não definido";
    }

    // Acessibilidade
    const settings = user.accessibility_settings || {};
    document.getElementById('acess-font-size').value = settings.font_size || 'Padrão';
    document.getElementById('acess-contrast').value = settings.contrast || 'Padrão Lumind';
    document.getElementById('acess-animations').checked = settings.reduce_animations || false;
    document.getElementById('acess-tts-global').checked = settings.text_to_speech || false;
    
    // Navegação
    document.querySelectorAll('[data-route]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            window.router.navigate(el.dataset.route);
        });
    });

    // Listeners
    document.getElementById('btn-ajustar-preferencias')?.addEventListener('click', () => {
        window.router.navigate('/questionario');
    });

    document.getElementById('btn-alterar-senha')?.addEventListener('click', () => {
        showCustomAlert('Função em desenvolvimento', 'Aviso', 'info');
    });

    // Salvar perfil
    document.getElementById('form-perfil-info')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = document.getElementById('perfil-nome').value.trim();
        if (newName === user.full_name) return;

        try {
            await api.updateProfile({ full_name: newName });
            user.full_name = newName;
            userState.user = user;
            showCustomAlert('Nome atualizado!', 'Sucesso', 'success');
            document.getElementById('perfil-nome-display').textContent = newName;
        } catch (error) {
            showCustomAlert('Erro ao salvar', 'Erro', 'error');
        }
    });

    // Salvar acessibilidade
    document.getElementById('form-perfil-acessibilidade')?.addEventListener('submit', async (e) => {
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
            applyAccessibilitySettings(accessibilityData);
            showCustomAlert('Acessibilidade salva!', 'Sucesso', 'success');
        } catch (error) {
            showCustomAlert('Erro ao salvar', 'Erro', 'error');
        }
    });

    // Logout
    document.getElementById('btn-sair-conta')?.addEventListener('click', () => {
        showConfirmDialog(
            'Tem certeza que deseja sair?',
            'Sair da Conta',
            () => {
                api.logout();
                userState.user = null;
                sessionStorage.clear();
                localStorage.clear();
                window.location.reload();
            }
        );
    });
}