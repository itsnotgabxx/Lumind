import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

export default function EnviarIncentivoPage() {
    return `
        <div class="w-full min-h-screen py-8">
            <div class="container mx-auto px-4 max-w-2xl">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <div>
                        <h1 class="text-3xl sm:text-4xl font-bold text-gray-800">
                            Enviar Incentivo
                        </h1>
                        <p id="enviar-incentivo-intro" class="text-gray-600 mt-2">Envie uma mensagem positiva para motivar!</p>
                    </div>
                    <button data-route="/acompanhamento" class="btn-subtle whitespace-nowrap">
                        <i class="fas fa-arrow-left mr-2"></i>Voltar
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Formulário Principal -->
                    <div class="lg:col-span-2">
                        <div class="card">
                            <form id="form-enviar-incentivo" class="space-y-6">
                                <!-- Mensagem -->
                                <div>
                                    <label for="mensagem-incentivo" class="block text-sm font-semibold text-gray-700 mb-2">
                                        Sua Mensagem
                                    </label>
                                    <textarea 
                                        id="mensagem-incentivo" 
                                        name="mensagem-incentivo" 
                                        rows="5" 
                                        class="input-field w-full resize-none"
                                        placeholder="Ex: Você está fazendo um ótimo trabalho! Continue com essa dedicação! 🌟"
                                    ></textarea>
                                    <p class="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                        <i class="fas fa-info-circle"></i>
                                        Máximo 500 caracteres
                                    </p>
                                    <div class="mt-2 flex justify-between items-center">
                                        <div class="text-xs text-gray-600">
                                            <span id="char-count">0</span>/500 caracteres
                                        </div>
                                    </div>
                                </div>

                                <!-- Emojis/Stickers -->
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-3">
                                        Adicione um Emoji
                                    </label>
                                    <div class="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <button type="button" class="emoji-btn text-2xl p-2 hover:bg-white rounded-lg transition-all hover:scale-110" data-emoji="🌟" title="Estrela">🌟</button>
                                        <button type="button" class="emoji-btn text-2xl p-2 hover:bg-white rounded-lg transition-all hover:scale-110" data-emoji="🎉" title="Celebração">🎉</button>
                                        <button type="button" class="emoji-btn text-2xl p-2 hover:bg-white rounded-lg transition-all hover:scale-110" data-emoji="👏" title="Palmas">👏</button>
                                        <button type="button" class="emoji-btn text-2xl p-2 hover:bg-white rounded-lg transition-all hover:scale-110" data-emoji="💪" title="Força">💪</button>
                                        <button type="button" class="emoji-btn text-2xl p-2 hover:bg-white rounded-lg transition-all hover:scale-110" data-emoji="🔥" title="Fogo">🔥</button>
                                        <button type="button" class="emoji-btn text-2xl p-2 hover:bg-white rounded-lg transition-all hover:scale-110" data-emoji="❤️" title="Coração">❤️</button>
                                        <button type="button" class="emoji-btn text-2xl p-2 hover:bg-white rounded-lg transition-all hover:scale-110" data-emoji="😊" title="Feliz">😊</button>
                                        <button type="button" class="emoji-btn text-2xl p-2 hover:bg-white rounded-lg transition-all hover:scale-110" data-emoji="🚀" title="Foguete">🚀</button>
                                        <button type="button" class="emoji-btn text-2xl p-2 hover:bg-white rounded-lg transition-all hover:scale-110" data-emoji="✨" title="Brilho">✨</button>
                                        <button type="button" class="emoji-btn text-2xl p-2 hover:bg-white rounded-lg transition-all hover:scale-110" data-emoji="🎯" title="Alvo">🎯</button>
                                        <button type="button" class="emoji-btn text-2xl p-2 hover:bg-white rounded-lg transition-all hover:scale-110" data-emoji="📚" title="Livros">📚</button>
                                        <button type="button" class="emoji-btn text-2xl p-2 hover:bg-white rounded-lg transition-all hover:scale-110" data-emoji="🏆" title="Troféu">🏆</button>
                                    </div>
                                </div>

                                <!-- Botões -->
                                <div class="flex gap-3 pt-4">
                                    <button type="submit" class="flex-1 btn-primary py-3 text-lg font-semibold">
                                        <i class="fas fa-paper-plane mr-2"></i>Enviar Mensagem
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Dicas -->
                    <div>
                        <div class="card bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200">
                            <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <i class="fas fa-lightbulb text-amber-500"></i>
                                Dicas de Incentivo
                            </h3>
                            <ul class="space-y-2 text-sm text-gray-700">
                                <li class="flex items-start gap-2">
                                    <span class="text-green-500 font-bold mt-1">✓</span>
                                    <span>Seja específico - mencione o que o estudante fez bem</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="text-green-500 font-bold mt-1">✓</span>
                                    <span>Mantenha um tom positivo e motivador</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="text-green-500 font-bold mt-1">✓</span>
                                    <span>Use emojis para tornar mais divertido</span>
                                </li>
                                <li class="flex items-start gap-2">
                                    <span class="text-green-500 font-bold mt-1">✓</span>
                                    <span>Reconheça o esforço, não apenas os resultados</span>
                                </li>
                            </ul>
                        </div>
                    </div>
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

    // Counter de caracteres
    const textarea = document.getElementById('mensagem-incentivo');
    const charCount = document.getElementById('char-count');
    
    textarea.addEventListener('input', () => {
        charCount.textContent = textarea.value.length;

        if (textarea.value.length > 500) {
            textarea.value = textarea.value.substring(0, 500);
            charCount.textContent = '500';
            showCustomAlert("Mensagem atingiu o limite de 500 caracteres", "warning");
        }
    });

    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const emoji = btn.dataset.emoji;
            textarea.value += emoji;
            charCount.textContent = textarea.value.length;
            textarea.focus();
        });
    });

    document.querySelector('[data-route="/acompanhamento"]').addEventListener('click', () => {
        window.router.navigate('/acompanhamento');
    });

    // Envio do formulário
    document.getElementById('form-enviar-incentivo').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = document.getElementById('mensagem-incentivo').value;
        
        if (!msg.trim()) {
            showCustomAlert("Por favor, escreva uma mensagem.", "warning");
            return;
        }

        try {
            let recipient_id;
            
            if (user.user_type === 'guardian' && user.student_id) {
                recipient_id = user.student_id;
            } else {
                recipient_id = user.id;
            }

            await api.sendMessage(recipient_id, msg, 'incentive');
            showCustomAlert(`Mensagem de incentivo enviada com sucesso! 🎉`, "success");
            document.getElementById('mensagem-incentivo').value = '';
            charCount.textContent = '0';
            
            setTimeout(() => {
                window.router.navigate('/acompanhamento');
            }, 1500);
        } catch (error) {
            console.error('Erro:', error);
            showCustomAlert(error.message || "Erro ao enviar mensagem. Tente novamente.", "error");
        }
    });
}