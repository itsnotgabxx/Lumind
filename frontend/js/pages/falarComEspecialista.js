import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';

export default function FalarComEspecialistaPage() {
    return `
        <div class="items-start pt-8 w-full">
            <div class="container mx-auto px-4 max-w-lg w-full">
                <div class="flex flex-col text-center sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
                    <h1 class="screen-title sm:text-left order-2 sm:order-1 flex-grow"><i class="fas fa-headset mr-2 text-purple-500"></i>Falar com Especialista</h1>
                    <button data-route="/acompanhamento" class="btn-subtle text-sm order-1 sm:order-2 w-full sm:w-auto"><i class="fas fa-arrow-left mr-2"></i> Voltar</button>
                </div>
                <p class="screen-subtitle mb-8 text-center sm:text-left">Entre em contato com nossa equipe.</p>

                <div class="card">
                    <form id="form-falar-especialista" action="#" method="POST" class="space-y-4">
                        <div>
                            <label for="nome-contato-especialista" class="block text-sm font-medium text-gray-700">Seu Nome:</label>
                            <input type="text" id="nome-contato-especialista" name="nome-contato-especialista" required class="input-field mt-1">
                        </div>
                        <div>
                            <label for="email-contato-especialista" class="block text-sm font-medium text-gray-700">Seu Email:</label>
                            <input type="email" id="email-contato-especialista" name="email-contato-especialista" required class="input-field mt-1" placeholder="seuemail@exemplo.com">
                        </div>
                        <div>
                            <label for="assunto-especialista" class="block text-sm font-medium text-gray-700">Assunto:</label>
                            <input type="text" id="assunto-especialista" name="assunto-especialista" required class="input-field mt-1" placeholder="Ex: Dúvida sobre progresso">
                        </div>
                        <div>
                            <label for="mensagem-especialista" class="block text-sm font-medium text-gray-700">Sua Mensagem:</label>
                            <textarea id="mensagem-especialista" name="mensagem-especialista" rows="5" class="input-field mt-1" placeholder="Descreva sua dúvida..."></textarea>
                        </div>
                        <button type="submit" class="w-full btn-primary mt-6"><i class="fas fa-paper-plane mr-2"></i>Enviar Solicitação</button>
                    </form>
                    <p class="text-xs text-gray-500 mt-6 text-center">Nossa equipe responderá em até 24 horas úteis.</p>
                </div>
            </div>
        </div>
    `;
}

export function setup() {
    const user = userState.user;
    if (user) {
        // Preenche o nome do "responsável"
        document.getElementById('nome-contato-especialista').value = `Responsável por ${user.full_name}`;
    }

    // Botão Voltar
    document.querySelector('[data-route="/acompanhamento"]').addEventListener('click', () => {
        window.router.navigate('/acompanhamento');
    });

    // Envio do formulário
    document.getElementById('form-falar-especialista').addEventListener('submit', (e) => {
        e.preventDefault();
        // Lógica de envio da API (simulada)
        showCustomAlert("Sua solicitação foi enviada! (simulado)", "Solicitação Enviada!", "success");
        // Limpa o formulário
        document.getElementById('form-falar-especialista').reset();
        // Preenche o nome novamente
        if(user) document.getElementById('nome-contato-especialista').value = `Responsável por ${user.full_name}`;
        
        window.router.navigate('/acompanhamento');
    });
}