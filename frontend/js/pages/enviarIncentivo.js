import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

export default function EnviarIncentivoPage() {
    return `
        <div class="items-start pt-8 w-full">
            <div class="container mx-auto px-4 max-w-lg w-full">
                <div class="flex flex-col text-center sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
                    <h1 class="screen-title sm:text-left order-2 sm:order-1 flex-grow"><i class="fas fa-gift mr-2 text-purple-500"></i>Enviar Incentivo</h1>
                    <button data-route="/acompanhamento" class="btn-subtle text-sm order-1 sm:order-2 w-full sm:w-auto"><i class="fas fa-arrow-left mr-2"></i> Voltar</button>
                </div>
                <p id="enviar-incentivo-intro" class="screen-subtitle mb-8 text-center sm:text-left">Envie uma mensagem positiva!</p>

                <div class="card">
                    <form id="form-enviar-incentivo" action="#" method="POST" class="space-y-4">
                        <div>
                            <label for="mensagem-incentivo" class="block text-sm font-medium text-gray-700">Sua mensagem:</label>
                            <textarea id="mensagem-incentivo" name="mensagem-incentivo" rows="4" class="input-field mt-1" placeholder="Ex: Parabéns pelo seu esforço! Continue assim!"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Envie um sticker:</label>
                            <div class="mt-2 flex space-x-3 flex-wrap gap-2">
                                <button type="button" class="text-3xl p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400" title="Estrela"><i class="fas fa-star text-yellow-400"></i></button>
                                </div>
                        </div>
                        <button type="submit" class="w-full btn-primary mt-6"><i class="fas fa-paper-plane mr-2"></i>Enviar Mensagem</button>
                    </form>
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

    // Atualiza texto dinâmico
    document.getElementById('enviar-incentivo-intro').innerHTML = `Envie uma mensagem positiva para ${user.full_name}!`;

    // Botão Voltar
    document.querySelector('[data-route="/acompanhamento"]').addEventListener('click', () => {
        window.router.navigate('/acompanhamento');
    });

    // Envio do formulário
    document.getElementById('form-enviar-incentivo').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = document.getElementById('mensagem-incentivo').value;
        if (!msg.trim()) {
            showCustomAlert("Por favor, escreva uma mensagem.", "Campo Obrigatório", "warning");
            return;
        }

        try {
            // Envia mensagem para o próprio usuário (simulando responsável enviando)
            await api.sendMessage(user.id, msg, 'incentive');
            showCustomAlert(`Mensagem de incentivo enviada para ${user.full_name}!`, "Mensagem Enviada!", "success");
            document.getElementById('mensagem-incentivo').value = '';
            window.router.navigate('/acompanhamento');
        } catch (error) {
            showCustomAlert("Erro ao enviar mensagem. Tente novamente.", "Erro", "error");
        }
    });
}