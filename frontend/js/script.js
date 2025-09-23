let currentUserName = "Sky"; 
let currentUserEmail = "sky@exemplo.com"; 
let currentContentTitle = "Conteúdo Interativo"; 
let currentContentData = { 
    "Aventuras no Espaço Sideral": {
        type: "video",
        source: "https://www.youtube.com/embed/zR3Igc3Rhfg?autoplay=1&mute=1", 
        description: "Explore os planetas e maravilhas do nosso sistema solar neste vídeo animado!"
    },
    "Dominando o Xadrez": {
        type: "text",
        title: "Fundamentos do Xadrez",
        paragraphs: [
            "O xadrez é um jogo de estratégia entre dois jogadores. Cada jogador começa com 16 peças: um rei, uma rainha, duas torres, dois bispos, dois cavalos e oito peões.",
            "O objetivo do jogo é dar xeque-mate no rei adversário, o que significa colocá-lo sob ataque de forma que não haja movimento legal para escapar.",
            "Cada peça se move de uma maneira diferente. Aprender os movimentos e o valor relativo das peças é o primeiro passo para se tornar um bom jogador.",
            "Vamos explorar os movimentos básicos e algumas táticas iniciais!"
        ],
        image: "images/xadrez.jpg" 
    },
    "Desafio dos Números": {
        type: "interactive_game",
        description: "Prepare-se para um desafio matemático divertido! (Simulação de Jogo)",
        gameElement: `<div class="text-center p-8"><i class="fas fa-gamepad text-5xl text-amber-500 mb-4"></i><p class="text-lg">Jogo de Números Carregado!</p><button class="btn-secondary mt-4 text-sm">Começar Jogo</button></div>`
    }
};

const customAlertOverlay = document.getElementById('custom-alert-overlay');
const customAlertTitle = document.getElementById('custom-alert-title');
const customAlertMessage = document.getElementById('custom-alert-message');
const customAlertCloseButton = document.getElementById('custom-alert-close');
const customAlertIcon = document.getElementById('custom-alert-icon');

function showCustomAlert(message, title = "Alerta", type = "info") {
    customAlertTitle.textContent = title;
    customAlertMessage.textContent = message;
    
    let iconHtml = '';
    let buttonClass = 'btn-primary w-full text-sm ';
    switch(type) {
        case 'success':
            iconHtml = `<i class="fas fa-check-circle text-4xl text-green-500"></i>`;
            buttonClass += 'bg-green-500 hover:bg-green-600';
            break;
        case 'error':
            iconHtml = `<i class="fas fa-times-circle text-4xl text-red-500"></i>`;
            buttonClass += 'bg-red-500 hover:bg-red-600';
            break;
        case 'warning':
            iconHtml = `<i class="fas fa-exclamation-triangle text-4xl text-yellow-500"></i>`;
            buttonClass += 'bg-yellow-500 hover:bg-yellow-600 text-gray-800';
            break;
        default: 
            iconHtml = `<i class="fas fa-info-circle text-4xl text-blue-500"></i>`;
    }
    customAlertIcon.innerHTML = iconHtml;
    customAlertCloseButton.className = buttonClass;
    customAlertOverlay.style.display = 'flex';
}

if (customAlertCloseButton) {
    customAlertCloseButton.addEventListener('click', () => {
        customAlertOverlay.style.display = 'none';
    });
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active-screen');
        screen.style.display = 'none'; 
    });
    const activeScreen = document.getElementById(screenId);
    if (activeScreen) {
        activeScreen.classList.add('active-screen');
        activeScreen.style.display = 'flex'; 
        window.scrollTo(0, 0); 
    }
    updateDynamicContent(); 
}

function updateDynamicContent() {
    const questionarioHeader = document.getElementById('questionario-header');
    if (questionarioHeader) questionarioHeader.innerHTML = `Olá, ${currentUserName}!`;

    const recomendacaoHeader = document.getElementById('recomendacao-header');
    if (recomendacaoHeader) recomendacaoHeader.innerHTML = `Olá, ${currentUserName}!`;
    
    const progressoHeader = document.getElementById('progresso-header');
    if (progressoHeader) progressoHeader.innerHTML = `Seu Progresso, ${currentUserName}!`;

    const perfilNomeInput = document.getElementById('perfil-nome');
    if (perfilNomeInput) perfilNomeInput.value = currentUserName;
    const perfilEmailInput = document.getElementById('perfil-email');
    if (perfilEmailInput) perfilEmailInput.value = currentUserEmail;
    const perfilFoto = document.querySelector('#perfilUsuario img');
    if (perfilFoto) perfilFoto.src = `https://placehold.co/80x80/A78BFA/FFFFFF?text=${currentUserName.substring(0,1).toUpperCase()}`;


    const acompanhamentoIntro = document.getElementById('acompanhamento-responsavel-intro');
    if (acompanhamentoIntro) acompanhamentoIntro.innerHTML = `Acompanhe o progresso de ${currentUserName}.`;
    
    document.querySelectorAll('.student-specific-text').forEach(el => {
        if (el.dataset.originalText) { 
             el.innerHTML = el.dataset.originalText.replace(/\[Nome do Estudante\]/g, currentUserName);
        } else { 
            el.dataset.originalText = el.innerHTML;
            el.innerHTML = el.innerHTML.replace(/\[Nome do Estudante\]/g, currentUserName);
        }
    });
    const enviarIncentivoIntro = document.getElementById('enviar-incentivo-intro');
    if(enviarIncentivoIntro) enviarIncentivoIntro.innerHTML = `Envie uma mensagem positiva para ${currentUserName}!`;


    const acessoConteudoHeader = document.getElementById('acesso-conteudo-header');
    if (acessoConteudoHeader) acessoConteudoHeader.textContent = currentContentTitle;
    
    const conteudoWrapper = document.getElementById('conteudo-wrapper');
    const placeholderText = document.getElementById('acesso-conteudo-placeholder');
    if (conteudoWrapper && placeholderText) {
        const contentData = currentContentData[currentContentTitle];
        if (contentData) {
            placeholderText.style.display = 'none'; 
            conteudoWrapper.innerHTML = ''; 
            conteudoWrapper.className = 'bg-gray-50 min-h-[25rem] rounded-md flex flex-col items-center justify-center p-4 text-base'; 

            if (contentData.type === "video") {
                const iframe = document.createElement('iframe');
                iframe.src = contentData.source;
                iframe.width = "100%";
                iframe.height = "400"; 
                iframe.frameBorder = "0";
                iframe.allow = "autoplay; encrypted-media";
                iframe.allowFullscreen = true;
                iframe.className = "rounded-md w-full max-w-2xl"; 
                conteudoWrapper.appendChild(iframe);
                const desc = document.createElement('p');
                desc.className = 'text-center text-gray-600 mt-3 text-sm';
                desc.textContent = contentData.description;
                conteudoWrapper.appendChild(desc);
            } else if (contentData.type === "text") {
                conteudoWrapper.classList.remove('items-center', 'justify-center'); 
                conteudoWrapper.classList.add('items-start'); 
                const titleEl = document.createElement('h2');
                titleEl.className = 'text-xl font-semibold mb-3 text-purple-700 self-start';
                titleEl.textContent = contentData.title;
                conteudoWrapper.appendChild(titleEl);
                if(contentData.image) {
                    const imgEl = document.createElement('img');
                    imgEl.src = contentData.image; 
                    imgEl.alt = `Ilustração para ${contentData.title}`;
                    imgEl.className = 'rounded-md mb-3 w-full max-w-sm mx-auto h-auto object-cover';
                    conteudoWrapper.appendChild(imgEl);
                }
                contentData.paragraphs.forEach(pText => {
                    const pEl = document.createElement('p');
                    pEl.className = 'text-gray-700 mb-2 leading-relaxed text-sm md:text-base';
                    pEl.textContent = pText;
                    conteudoWrapper.appendChild(pEl);
                });
            } else if (contentData.type === "interactive_game") {
                conteudoWrapper.innerHTML = contentData.gameElement;
                const desc = document.createElement('p');
                desc.className = 'text-center text-gray-600 mt-2 text-sm';
                desc.textContent = contentData.description;
                conteudoWrapper.appendChild(desc);
            }
        } else {
            placeholderText.textContent = `Conteúdo sobre "${currentContentTitle}" não encontrado.`;
            placeholderText.style.display = 'block';
        }
    }


    const questionarioForm = document.getElementById('form-questionario');
    if (questionarioForm) {
        const aprenderPrefsElements = Array.from(questionarioForm.querySelectorAll('input[name="aprender_pref"]:checked'));
        let aprenderPrefsText = "Não definido";
        if (aprenderPrefsElements.length > 0) {
             aprenderPrefsText = aprenderPrefsElements.map(cb => {
                let labelText = cb.parentElement.textContent.trim();
                const iconElement = cb.parentElement.querySelector('i');
                if (iconElement) {
                    labelText = labelText.replace(iconElement.textContent, '').trim();
                }
                return labelText.split('\n')[0].trim().replace(/\s+/g, ' ');
            }).join(', ');
        }

        const interessesVal = document.getElementById('interesses').value;
        
        const perfilEstilos = document.getElementById('perfil-estilos');
        if(perfilEstilos) perfilEstilos.textContent = aprenderPrefsText;
        
        const perfilInteresses = document.getElementById('perfil-interesses');
        if(perfilInteresses) perfilInteresses.textContent = interessesVal || "Não definido";

        const interessesInputQuestionario = document.getElementById('interesses');
        if (interessesInputQuestionario && interessesInputQuestionario.value.toLowerCase().includes("dinossauros")) {
            interessesInputQuestionario.value = interessesInputQuestionario.value.replace(/dinossauros/gi, "Xadrez").replace(/, \s*,/, ",").trim().replace(/^,|,$/g, '');
        }
        if (interessesInputQuestionario && !interessesInputQuestionario.value.toLowerCase().includes("xadrez") && interessesInputQuestionario.value) { 
            interessesInputQuestionario.value = ("Xadrez, " + interessesInputQuestionario.value).replace(/, \s*,/, ",").trim().replace(/^,|,$/g, '');
        } else if (interessesInputQuestionario && !interessesInputQuestionario.value) {
             interessesInputQuestionario.value = "Xadrez";
        }


    }
}

document.addEventListener('DOMContentLoaded', () => {
    showScreen('login'); 

    // Formulário Esqueci Senha
    const formEsqueciSenha = document.getElementById('form-esqueci-senha');
    if(formEsqueciSenha) {
        formEsqueciSenha.addEventListener('submit', function(event) {
            event.preventDefault();
            const emailRecuperacao = document.getElementById('email-recuperacao').value;
            if(emailRecuperacao) {
                showCustomAlert(`Instruções de recuperação de senha enviadas para ${emailRecuperacao} (simulado).`, "Verifique seu Email", "success");
                // aqui você pode limpar o campo ou redirecionar
                document.getElementById('email-recuperacao').value = ''; 
                showScreen('login');
            } else {
                showCustomAlert("Por favor, insira seu email.", "Campo Obrigatório", "warning");
            }
        });
    }
    
    // Formulário Enviar Incentivo
    const formEnviarIncentivo = document.getElementById('form-enviar-incentivo');
    if(formEnviarIncentivo){
        formEnviarIncentivo.addEventListener('submit', function(event){
            event.preventDefault();
            const mensagemIncentivo = document.getElementById('mensagem-incentivo').value;
            if(mensagemIncentivo.trim()){
                 showCustomAlert(`Mensagem de incentivo enviada para ${currentUserName}! (simulado)`, "Mensagem Enviada!", "success");
                 document.getElementById('mensagem-incentivo').value = '';
                 showScreen('acompanhamentoResponsavel');
            } else {
                showCustomAlert("Por favor, escreva uma mensagem.", "Campo Obrigatório", "warning");
            }
        });
    }

    // Formulário Falar com Especialista
    const formFalarEspecialista = document.getElementById('form-falar-especialista');
    if(formFalarEspecialista){
        formFalarEspecialista.addEventListener('submit', function(event){
            event.preventDefault();
            const nomeContato = document.getElementById('nome-contato-especialista').value;
            const emailContato = document.getElementById('email-contato-especialista').value;
            const assuntoContato = document.getElementById('assunto-especialista').value;
            const mensagemContato = document.getElementById('mensagem-especialista').value;

            if(nomeContato.trim() && emailContato.trim() && assuntoContato.trim() && mensagemContato.trim()){
                showCustomAlert("Sua solicitação foi enviada. Entraremos em contato em breve! (simulado)", "Solicitação Enviada!", "success");
                // Limpar campos
                document.getElementById('nome-contato-especialista').value = `Responsável por ${currentUserName}`;
                document.getElementById('email-contato-especialista').value = '';
                document.getElementById('assunto-especialista').value = '';
                document.getElementById('mensagem-especialista').value = '';
                showScreen('acompanhamentoResponsavel');
            } else {
                 showCustomAlert("Por favor, preencha todos os campos obrigatórios.", "Campos Incompletos", "warning");
            }
        });
    }


    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(event) {
            event.preventDefault();
            const nomeCompletoInput = document.getElementById('nome-completo');
            const emailCadastroInput = document.getElementById('email-cadastro');
            const senha = document.getElementById('senha-cadastro').value;
            const confirmarSenha = document.getElementById('confirmar-senha').value;

            if (senha !== confirmarSenha) {
                showCustomAlert("As senhas não coincidem. Tente novamente.", "Erro de Cadastro", "error");
                return;
            }
            if (nomeCompletoInput && nomeCompletoInput.value.trim() !== "") {
                currentUserName = nomeCompletoInput.value.trim();
            } else {
                currentUserName = "Usuário"; 
            }
            currentUserEmail = emailCadastroInput.value.trim() || "usuario@exemplo.com";
            showCustomAlert(`Cadastro realizado para ${currentUserName}! Preencha o questionário.`, "Bem-vindo(a)!", "success");
            showScreen('questionario');
        });
    }

    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', function(event) {
            event.preventDefault();
            const emailLoginInput = document.getElementById('email-login');
            if (emailLoginInput && emailLoginInput.value.toLowerCase() === "sky@exemplo.com") {
                currentUserName = "Sky";
                currentUserEmail = "sky@exemplo.com";
            } else if (emailLoginInput && emailLoginInput.value.includes('@')) {
                currentUserName = emailLoginInput.value.split('@')[0];
                currentUserEmail = emailLoginInput.value;
            } else {
                currentUserName = "Usuário Logado";
                currentUserEmail = "logado@exemplo.com";
            }
            // Atualiza o nome do responsável no formulário de contato com especialista
            const nomeContatoEspecialista = document.getElementById('nome-contato-especialista');
            if (nomeContatoEspecialista) {
                nomeContatoEspecialista.value = `Responsável por ${currentUserName}`;
            }
            showScreen('recomendacao');
        });
    }

    const formQuestionario = document.getElementById('form-questionario');
    if (formQuestionario) {
        formQuestionario.addEventListener('submit', function(event) {
            event.preventDefault();
            showCustomAlert("Preferências salvas! Preparando suas recomendações.", "Obrigado!", "success");
            showScreen('recomendacao');
        });
    }
    
    const formPerfilInfo = document.getElementById('form-perfil-info');
    if(formPerfilInfo) {
        formPerfilInfo.addEventListener('submit', function(event) {
            event.preventDefault();
            const perfilNomeInput = document.getElementById('perfil-nome');
            currentUserName = perfilNomeInput.value.trim() || currentUserName;
            showCustomAlert('Informações pessoais salvas!', 'Sucesso', 'success');
            updateDynamicContent();
        });
    }

    const formPerfilAcessibilidade = document.getElementById('form-perfil-acessibilidade');
    if(formPerfilAcessibilidade) {
        formPerfilAcessibilidade.addEventListener('submit', function(event) {
            event.preventDefault();
            showCustomAlert('Opções de acessibilidade salvas!', 'Sucesso', 'success');
        });
    }

    document.querySelectorAll('.btn-explorar-conteudo').forEach(button => {
        button.addEventListener('click', function() {
            currentContentTitle = this.dataset.contentTitle || "Conteúdo Interativo";
            showScreen('acessoConteudo');
        });
    });

    const btnFecharConteudo = document.getElementById('btn-fechar-conteudo');
    if (btnFecharConteudo) {
        btnFecharConteudo.addEventListener('click', function() {
            const conteudoWrapper = document.getElementById('conteudo-wrapper');
            if (conteudoWrapper) conteudoWrapper.innerHTML = ''; 
            const placeholderText = document.getElementById('acesso-conteudo-placeholder');
            if (placeholderText) {
                 placeholderText.textContent = 'Carregando...'; 
                 placeholderText.style.display = 'block';
            }
            showScreen('recomendacao');
        });
    }
    
    const fontSizeSelect = document.getElementById('font-size-content');
    if(fontSizeSelect) {
        fontSizeSelect.addEventListener('change', function() {
            const conteudoWrapper = document.getElementById('conteudo-wrapper');
            conteudoWrapper.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl'); 
            let newSizeClass = 'text-base'; 
            if (this.value === 'medio') {
                newSizeClass = 'text-lg'; 
            } else if (this.value === 'grande') {
                newSizeClass = 'text-xl'; 
            }
            conteudoWrapper.classList.add(newSizeClass);
            
            if (currentContentData[currentContentTitle] && currentContentData[currentContentTitle].type === "text") {
                conteudoWrapper.querySelectorAll('p').forEach(pEl => {
                    pEl.className = `text-gray-700 mb-2 leading-relaxed ${newSizeClass}`;
                });
                 conteudoWrapper.querySelectorAll('h2').forEach(hEl => {
                    hEl.className = `font-semibold mb-3 text-purple-700 ${newSizeClass === 'text-xl' ? 'text-2xl' : (newSizeClass === 'text-lg' ? 'text-xl' : 'text-lg') }`; 
                });
            }
        });
    }


    const btnMarcarConcluido = document.getElementById('btn-marcar-concluido');
    if (btnMarcarConcluido) {
        btnMarcarConcluido.addEventListener('click', function() {
            showCustomAlert(`"${currentContentTitle}" marcado como concluído!`, 'Progresso Atualizado', 'success');
            const conteudoWrapper = document.getElementById('conteudo-wrapper');
            if (conteudoWrapper) conteudoWrapper.innerHTML = ''; 
            const placeholderText = document.getElementById('acesso-conteudo-placeholder');
             if (placeholderText) {
                 placeholderText.textContent = 'Carregando...';
                 placeholderText.style.display = 'block';
            }
            showScreen('progressoUsuario'); 
        });
    }
    
    const btnAjustarPreferenciasPerfil = document.getElementById('btn-ajustar-preferencias-perfil');
    if(btnAjustarPreferenciasPerfil) {
        btnAjustarPreferenciasPerfil.addEventListener('click', function(event) {
             event.preventDefault();
             showScreen('questionario');
        });
    }

    const btnSairContaPerfil = document.getElementById('btn-sair-conta-perfil');
    if(btnSairContaPerfil) {
        btnSairContaPerfil.addEventListener('click', function(event) {
            event.preventDefault();
            currentUserName = "Sky"; 
            currentUserEmail = "sky@exemplo.com";
            
            const formLoginEmail = document.getElementById('email-login');
            if(formLoginEmail) formLoginEmail.value = 'sky@exemplo.com'; 
            const formLoginPass = document.getElementById('senha-login');
            if(formLoginPass) formLoginPass.value = 'senha123'; 
            
            const formCadastroNome = document.getElementById('nome-completo');
            if(formCadastroNome) formCadastroNome.value = '';
            const formCadastroEmail = document.getElementById('email-cadastro');
            if(formCadastroEmail) formCadastroEmail.value = '';
            
            showScreen('login');
        });
    }
    updateDynamicContent(); 
});