import { showCustomAlert } from '../utils/alert.js';

export default function EsqueciSenhaPage() {
    return `
        <div class="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div class="w-full max-w-md card">
                <div class="text-center mb-6">
                    <i class="fas fa-key text-4xl mb-3 text-purple-500"></i>
                    <h1 class="screen-title">Recuperar Senha</h1>
                    <p class="screen-subtitle">Digite seu e-mail para enviarmos instruções de recuperação.</p>
                </div>
                <form id="form-esqueci-senha" action="#" method="POST" class="space-y-4">
                    <div>
                        <label for="email-recuperacao" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email-recuperacao" name="email-recuperacao" required class="input-field" placeholder="seuemail@exemplo.com">
                    </div>
                    <button type="submit" class="w-full btn-primary"><i class="fas fa-paper-plane mr-2"></i>Enviar Instruções</button>
                </form>
                <p class="mt-6 text-center text-sm">
                    Lembrou a senha? 
                    <span data-route="/login" class="link cursor-pointer">Voltar para Login</span>
                </p>
            </div>
        </div>
    `;
}

export function setup() {
    const formEsqueciSenha = document.getElementById('form-esqueci-senha');
    if (formEsqueciSenha) {
        formEsqueciSenha.addEventListener('submit', function(event) {
            event.preventDefault();
            const emailRecuperacao = document.getElementById('email-recuperacao').value;
            
            if (emailRecuperacao) {
                // (Aqui você chamaria a API real)
                showCustomAlert(`Instruções de recuperação de senha enviadas para ${emailRecuperacao} (simulado).`, "Verifique seu Email", "success");
                document.getElementById('email-recuperacao').value = ''; 
                window.router.navigate('/login');
            } else {
                showCustomAlert("Por favor, insira seu email.", "Campo Obrigatório", "warning");
            }
        });
    }

    document.querySelector('span[data-route="/login"]').addEventListener('click', () => {
        window.router.navigate('/login');
    });
}