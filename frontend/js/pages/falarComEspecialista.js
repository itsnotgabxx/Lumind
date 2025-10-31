import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';
import { api } from '../api.js';

export default function FalarComEspecialistaPage() {
    return `
        <div class="w-full max-w-[1400px] mx-auto px-4 py-6 sm:py-8">
            <!-- Header com Breadcrumb -->
            <div class="mb-6">
                <button data-route="/acompanhamento" class="text-purple-600 hover:text-purple-700 text-sm font-medium mb-3 inline-flex items-center transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Voltar para Acompanhamento
                </button>
                
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                                <i class="fas fa-headset text-white text-xl"></i>
                            </div>
                            <span>Falar com Especialista</span>
                        </h1>
                        <p class="text-gray-600 text-sm sm:text-base">
                            Nossa equipe está pronta para ajudar você e sua família
                        </p>
                    </div>
                    
                    <!-- Status de Atendimento -->
                    <div class="flex items-center gap-2 bg-green-50 border-2 border-green-200 px-4 py-2 rounded-xl">
                        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span class="text-sm font-semibold text-green-700">Equipe Online</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Formulário de Contato -->
                <div class="lg:col-span-2">
                    <div class="card">
                        <div class="mb-6">
                            <h2 class="text-xl font-semibold text-gray-800 mb-2">
                                Envie sua Mensagem
                            </h2>
                            <p class="text-gray-600 text-sm">
                                Preencha os campos abaixo e entraremos em contato em até 24 horas úteis
                            </p>
                        </div>

                        <form id="form-falar-especialista" class="space-y-5">
                            <!-- Nome -->
                            <div>
                                <label for="nome-contato-especialista" class="block text-sm font-semibold text-gray-700 mb-2">
                                    <i class="fas fa-user text-purple-500 mr-2"></i>
                                    Seu Nome
                                </label>
                                <input 
                                    type="text" 
                                    id="nome-contato-especialista" 
                                    name="nome-contato-especialista" 
                                    required 
                                    class="input-field"
                                    placeholder="Como você gostaria de ser chamado(a)?"
                                >
                            </div>

                            <!-- Email -->
                            <div>
                                <label for="email-contato-especialista" class="block text-sm font-semibold text-gray-700 mb-2">
                                    <i class="fas fa-envelope text-purple-500 mr-2"></i>
                                    Seu Email
                                </label>
                                <input 
                                    type="email" 
                                    id="email-contato-especialista" 
                                    name="email-contato-especialista" 
                                    required 
                                    class="input-field"
                                    placeholder="seuemail@exemplo.com"
                                >
                                <p class="text-xs text-gray-500 mt-1 ml-1">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Enviaremos a resposta para este email
                                </p>
                            </div>

                            <!-- Telefone (Opcional) -->
                            <div>
                                <label for="telefone-especialista" class="block text-sm font-semibold text-gray-700 mb-2">
                                    <i class="fas fa-phone text-purple-500 mr-2"></i>
                                    Telefone <span class="text-gray-400 font-normal">(Opcional)</span>
                                </label>
                                <input 
                                    type="tel" 
                                    id="telefone-especialista" 
                                    name="telefone-especialista" 
                                    class="input-field"
                                    placeholder="(00) 00000-0000"
                                >
                            </div>

                            <!-- Tipo de Solicitação -->
                            <div>
                                <label for="tipo-solicitacao" class="block text-sm font-semibold text-gray-700 mb-2">
                                    <i class="fas fa-tag text-purple-500 mr-2"></i>
                                    Tipo de Solicitação
                                </label>
                                <select id="tipo-solicitacao" name="tipo-solicitacao" required class="input-field">
                                    <option value="">Selecione um tipo...</option>
                                    <option value="duvida-tecnica">❓ Dúvida Técnica</option>
                                    <option value="progresso-estudante">📊 Progresso do Estudante</option>
                                    <option value="conteudo-pedagogico">📚 Conteúdo Pedagógico</option>
                                    <option value="acessibilidade">♿ Acessibilidade</option>
                                    <option value="sugestao">💡 Sugestão</option>
                                    <option value="problema">⚠️ Relatar Problema</option>
                                    <option value="outro">💬 Outro Assunto</option>
                                </select>
                            </div>

                            <!-- Assunto -->
                            <div>
                                <label for="assunto-especialista" class="block text-sm font-semibold text-gray-700 mb-2">
                                    <i class="fas fa-heading text-purple-500 mr-2"></i>
                                    Assunto
                                </label>
                                <input 
                                    type="text" 
                                    id="assunto-especialista" 
                                    name="assunto-especialista" 
                                    required 
                                    class="input-field"
                                    placeholder="Ex: Dúvida sobre progresso do aluno"
                                    maxlength="100"
                                >
                                <div class="flex justify-between items-center mt-1">
                                    <p class="text-xs text-gray-500 ml-1">
                                        <i class="fas fa-lightbulb mr-1"></i>
                                        Seja específico para uma resposta mais rápida
                                    </p>
                                    <span id="assunto-counter" class="text-xs text-gray-400">
                                        0/100
                                    </span>
                                </div>
                            </div>

                            <!-- Mensagem -->
                            <div>
                                <label for="mensagem-especialista" class="block text-sm font-semibold text-gray-700 mb-2">
                                    <i class="fas fa-comment-dots text-purple-500 mr-2"></i>
                                    Sua Mensagem
                                </label>
                                <textarea 
                                    id="mensagem-especialista" 
                                    name="mensagem-especialista" 
                                    rows="6" 
                                    required
                                    class="input-field resize-none"
                                    placeholder="Descreva detalhadamente sua dúvida ou solicitação..."
                                    maxlength="1000"
                                ></textarea>
                                <div class="flex justify-between items-center mt-1">
                                    <p class="text-xs text-gray-500 ml-1">
                                        <i class="fas fa-check-circle mr-1"></i>
                                        Mínimo 20 caracteres
                                    </p>
                                    <span id="mensagem-counter" class="text-xs text-gray-400">
                                        0/1000
                                    </span>
                                </div>
                            </div>

                            <!-- Sugestões Rápidas de Mensagem -->
                            <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                                <p class="text-sm font-semibold text-gray-700 mb-3">
                                    <i class="fas fa-magic text-blue-500 mr-2"></i>
                                    Sugestões Rápidas:
                                </p>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <button type="button" class="suggestion-quick-btn" data-template="progresso">
                                        <i class="fas fa-chart-line mr-2"></i>
                                        Dúvida sobre progresso
                                    </button>
                                    <button type="button" class="suggestion-quick-btn" data-template="conteudo">
                                        <i class="fas fa-book mr-2"></i>
                                        Sugerir conteúdo
                                    </button>
                                    <button type="button" class="suggestion-quick-btn" data-template="dificuldade">
                                        <i class="fas fa-question-circle mr-2"></i>
                                        Relatar dificuldade
                                    </button>
                                    <button type="button" class="suggestion-quick-btn" data-template="elogio">
                                        <i class="fas fa-heart mr-2"></i>
                                        Enviar elogio
                                    </button>
                                </div>
                            </div>

                            <!-- Botões de Ação -->
                            <div class="flex flex-col sm:flex-row gap-3 pt-4">
                                <button 
                                    type="submit" 
                                    id="btn-enviar-especialista"
                                    class="btn-primary flex-grow"
                                >
                                    <i class="fas fa-paper-plane mr-2"></i>
                                    Enviar Solicitação
                                </button>
                                <button 
                                    type="button" 
                                    id="btn-limpar-form"
                                    class="btn-subtle"
                                >
                                    <i class="fas fa-eraser mr-2"></i>
                                    Limpar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Sidebar com Informações -->
                <div class="lg:col-span-1 space-y-6">
                    <!-- Tempo de Resposta -->
                    <div class="card bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                <i class="fas fa-clock text-white text-xl"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-800 mb-2">
                                    Tempo de Resposta
                                </h3>
                                <p class="text-sm text-gray-600 mb-2">
                                    Nossa equipe responde em até <strong class="text-purple-600">24 horas úteis</strong>
                                </p>
                                <div class="flex items-center gap-2 text-xs text-gray-500">
                                    <i class="far fa-clock"></i>
                                    <span>Segunda a Sexta: 8h às 18h</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Canais de Atendimento -->
                    <div class="card">
                        <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i class="fas fa-phone-volume text-teal-500"></i>
                            Outros Canais
                        </h3>
                        <div class="space-y-3">
                            <a href="mailto:suporte@lumind.com.br" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                                <div class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                                    <i class="fas fa-envelope text-teal-600"></i>
                                </div>
                                <div>
                                    <div class="text-sm font-semibold text-gray-800">Email</div>
                                    <div class="text-xs text-gray-500">suporte@lumind.com.br</div>
                                </div>
                            </a>
                            
                            <a href="https://wa.me/5511999999999" target="_blank" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                    <i class="fab fa-whatsapp text-green-600"></i>
                                </div>
                                <div>
                                    <div class="text-sm font-semibold text-gray-800">WhatsApp</div>
                                    <div class="text-xs text-gray-500">(11) 99999-9999</div>
                                </div>
                            </a>
                        </div>
                    </div>

                    <!-- FAQ Rápido -->
                    <div class="card">
                        <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i class="fas fa-question-circle text-amber-500"></i>
                            Perguntas Frequentes
                        </h3>
                        <div class="space-y-3">
                            <button class="faq-item w-full text-left" data-faq="progresso">
                                <div class="flex items-start gap-3">
                                    <i class="fas fa-chevron-right text-purple-500 mt-1"></i>
                                    <span class="text-sm text-gray-700 flex-grow">
                                        Como acompanhar o progresso?
                                    </span>
                                </div>
                            </button>
                            <button class="faq-item w-full text-left" data-faq="conteudo">
                                <div class="flex items-start gap-3">
                                    <i class="fas fa-chevron-right text-purple-500 mt-1"></i>
                                    <span class="text-sm text-gray-700 flex-grow">
                                        Como sugerir novos conteúdos?
                                    </span>
                                </div>
                            </button>
                            <button class="faq-item w-full text-left" data-faq="acessibilidade">
                                <div class="flex items-start gap-3">
                                    <i class="fas fa-chevron-right text-purple-500 mt-1"></i>
                                    <span class="text-sm text-gray-700 flex-grow">
                                        Recursos de acessibilidade
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Estatísticas de Atendimento -->
                    <div class="card bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
                        <h3 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i class="fas fa-star text-amber-500"></i>
                            Nosso Atendimento
                        </h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-green-600">98%</div>
                                <div class="text-xs text-gray-600">Satisfação</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-blue-600">< 24h</div>
                                <div class="text-xs text-gray-600">Resposta</div>
                            </div>
                        </div>
                    </div>

                    <!-- Dica -->
                    <div class="card bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
                        <div class="flex items-start gap-3">
                            <i class="fas fa-lightbulb text-2xl text-amber-500"></i>
                            <div>
                                <h4 class="font-semibold text-gray-800 mb-1 text-sm">
                                    💡 Dica
                                </h4>
                                <p class="text-xs text-gray-700 leading-relaxed">
                                    Quanto mais detalhes você fornecer, mais rápida e precisa será nossa resposta!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Templates de mensagens rápidas
const messageTemplates = {
    progresso: {
        tipo: 'progresso-estudante',
        assunto: 'Dúvida sobre o progresso do estudante',
        mensagem: 'Olá! Gostaria de entender melhor como está o desenvolvimento do(a) estudante na plataforma. Especificamente, tenho dúvidas sobre:\n\n- [Descreva sua dúvida aqui]\n\nAgradeço a atenção!'
    },
    conteudo: {
        tipo: 'conteudo-pedagogico',
        assunto: 'Sugestão de novo conteúdo',
        mensagem: 'Olá! Gostaria de sugerir um novo conteúdo para a plataforma:\n\n- Tema: [Descreva o tema]\n- Por quê seria útil: [Explique]\n\nObrigado(a)!'
    },
    dificuldade: {
        tipo: 'duvida-tecnica',
        assunto: 'Dificuldade em utilizar a plataforma',
        mensagem: 'Olá! Estou com dificuldade em:\n\n- [Descreva a dificuldade]\n- O que já tentei: [Descreva]\n\nPreciso de ajuda para resolver isso. Obrigado(a)!'
    },
    elogio: {
        tipo: 'sugestao',
        assunto: 'Elogio e feedback positivo',
        mensagem: 'Olá! Gostaria de parabenizar a equipe pelo excelente trabalho!\n\n[Compartilhe sua experiência positiva aqui]\n\nContinuem assim! 💜'
    }
};

// Aplicar template de mensagem
function applyTemplate(templateKey) {
    const template = messageTemplates[templateKey];
    if (!template) return;

    document.getElementById('tipo-solicitacao').value = template.tipo;
    document.getElementById('assunto-especialista').value = template.assunto;
    document.getElementById('mensagem-especialista').value = template.mensagem;
    
    // Atualiza contadores
    updateCharCounter('assunto-especialista', 'assunto-counter', 100);
    updateCharCounter('mensagem-especialista', 'mensagem-counter', 1000);
    
    // Scroll suave para o formulário
    document.getElementById('mensagem-especialista').scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Focus no campo de mensagem
    setTimeout(() => {
        document.getElementById('mensagem-especialista').focus();
    }, 500);
}

// Atualizar contador de caracteres
function updateCharCounter(inputId, counterId, maxLength) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(counterId);
    
    if (input && counter) {
        const length = input.value.length;
        counter.textContent = `${length}/${maxLength}`;
        
        // Muda cor quando próximo do limite
        if (length > maxLength * 0.9) {
            counter.classList.add('text-amber-500', 'font-semibold');
        } else {
            counter.classList.remove('text-amber-500', 'font-semibold');
        }
    }
}

// Validar formulário
function validateForm() {
    const mensagem = document.getElementById('mensagem-especialista').value;
    const assunto = document.getElementById('assunto-especialista').value;
    const tipo = document.getElementById('tipo-solicitacao').value;
    
    if (mensagem.length < 20) {
        showCustomAlert('A mensagem deve ter pelo menos 20 caracteres', 'Atenção', 'warning');
        document.getElementById('mensagem-especialista').focus();
        return false;
    }
    
    if (assunto.length < 5) {
        showCustomAlert('O assunto deve ter pelo menos 5 caracteres', 'Atenção', 'warning');
        document.getElementById('assunto-especialista').focus();
        return false;
    }
    
    if (!tipo) {
        showCustomAlert('Por favor, selecione o tipo de solicitação', 'Atenção', 'warning');
        document.getElementById('tipo-solicitacao').focus();
        return false;
    }
    
    return true;
}

// Máscara de telefone
function applyPhoneMask(value) {
    value = value.replace(/\D/g, '');
    
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    return value;
}

export function setup() {
    const user = userState.user;
    if (!user) {
        window.router.navigate('/login');
        return;
    }

    // Preenche dados do usuário
    const nomeInput = document.getElementById('nome-contato-especialista');
    const emailInput = document.getElementById('email-contato-especialista');
    
    if (user.full_name) {
        nomeInput.value = `Responsável por ${user.full_name}`;
    }
    if (user.email) {
        emailInput.value = user.email;
    }

    // Botão Voltar
    document.querySelector('[data-route="/acompanhamento"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.router.navigate('/acompanhamento');
    });

    // Contadores de caracteres
    const assuntoInput = document.getElementById('assunto-especialista');
    const mensagemInput = document.getElementById('mensagem-especialista');
    
    assuntoInput.addEventListener('input', () => {
        updateCharCounter('assunto-especialista', 'assunto-counter', 100);
    });
    
    mensagemInput.addEventListener('input', () => {
        updateCharCounter('mensagem-especialista', 'mensagem-counter', 1000);
    });

    // Máscara de telefone
    const telefoneInput = document.getElementById('telefone-especialista');
    telefoneInput.addEventListener('input', (e) => {
        e.target.value = applyPhoneMask(e.target.value);
    });

    // Sugestões rápidas
    document.querySelectorAll('.suggestion-quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const template = btn.dataset.template;
            applyTemplate(template);
        });
    });

    // FAQ items
    document.querySelectorAll('.faq-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const faq = btn.dataset.faq;
            
            // Poderia abrir um modal com a resposta, por enquanto navega
            let message = '';
            switch(faq) {
                case 'progresso':
                    message = 'Para acompanhar o progresso, acesse a página de "Progresso" no menu principal. Lá você encontrará gráficos detalhados, estatísticas e o histórico completo de atividades.';
                    break;
                case 'conteudo':
                    message = 'Você pode sugerir novos conteúdos através deste formulário! Selecione "Conteúdo Pedagógico" como tipo e descreva sua sugestão.';
                    break;
                case 'acessibilidade':
                    message = 'O Lumind oferece: alto contraste, redução de movimento, ajuste de fonte, navegação por teclado e compatibilidade com leitores de tela. Acesse "Configurações" para personalizar.';
                    break;
            }
            
            showCustomAlert(message, 'Resposta Rápida', 'info');
        });
    });

    // Botão limpar
    document.getElementById('btn-limpar-form')?.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar o formulário?')) {
            document.getElementById('form-falar-especialista').reset();
            
            // Restaura dados do usuário
            if (user.full_name) {
                nomeInput.value = `Responsável por ${user.full_name}`;
            }
            if (user.email) {
                emailInput.value = user.email;
            }
            
            // Reseta contadores
            updateCharCounter('assunto-especialista', 'assunto-counter', 100);
            updateCharCounter('mensagem-especialista', 'mensagem-counter', 1000);
        }
    });

    // Envio do formulário
    document.getElementById('form-falar-especialista').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Valida formulário
        if (!validateForm()) {
            return;
        }
        
        const btn = document.getElementById('btn-enviar-especialista');
        const originalText = btn.innerHTML;
        
        try {
            // Desabilita botão
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
            
            // Coleta dados do formulário
            const formData = {
                nome: document.getElementById('nome-contato-especialista').value,
                email: document.getElementById('email-contato-especialista').value,
                telefone: document.getElementById('telefone-especialista').value,
                tipo: document.getElementById('tipo-solicitacao').value,
                assunto: document.getElementById('assunto-especialista').value,
                mensagem: document.getElementById('mensagem-especialista').value,
                usuario_id: user.id
            };
            
            // Simula envio (substitua pela chamada real da API)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Aqui você faria:
            // await api.enviarSolicitacaoEspecialista(formData);
            
            // Sucesso
            showCustomAlert(
                'Sua solicitação foi enviada com sucesso! Nossa equipe entrará em contato em até 24 horas úteis.',
                'Solicitação Enviada! 🎉',
                'success'
            );
            
            // Limpa o formulário
            document.getElementById('form-falar-especialista').reset();
            
            // Restaura dados do usuário
            if (user.full_name) {
                nomeInput.value = `Responsável por ${user.full_name}`;
            }
            if (user.email) {
                emailInput.value = user.email;
            }
            
            // Reseta contadores
            updateCharCounter('assunto-especialista', 'assunto-counter', 100);
            updateCharCounter('mensagem-especialista', 'mensagem-counter', 1000);
            
            // Navega de volta após 2 segundos
            setTimeout(() => {
                window.router.navigate('/acompanhamento');
            }, 2000);
            
        } catch (error) {
            console.error('Erro ao enviar solicitação:', error);
            showCustomAlert(
                'Não foi possível enviar sua solicitação. Por favor, tente novamente ou entre em contato por email.',
                'Erro no Envio',
                'error'
            );
        } finally {
            // Reabilita botão
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    });
}