let currentUserName = "Sky"; 
let currentUserEmail = "sky@exemplo.com"; 
let currentContentTitle = "Conteúdo Interativo"; 
let currentContentId = null; // id do conteúdo vindo do backend
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

document.addEventListener('DOMContentLoaded', async () => {
    // Verifica se o usuário já está logado
    if (api.user) {
        showScreen('recomendacao');
        await loadUserData();
    } else {
        showScreen('login');
    }

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
        formEnviarIncentivo.addEventListener('submit', async function(event){
            event.preventDefault();
            const mensagemIncentivo = document.getElementById('mensagem-incentivo').value;
            if(mensagemIncentivo.trim()){
                try {
                    if (api.user) {
                        // Envia mensagem para o próprio usuário (simulando responsável enviando para estudante)
                        await api.sendMessage(api.user.id, mensagemIncentivo, 'incentive');
                        showCustomAlert(`Mensagem de incentivo enviada para ${currentUserName}!`, "Mensagem Enviada!", "success");
                    } else {
                        showCustomAlert(`Mensagem de incentivo enviada para ${currentUserName}! (simulado)`, "Mensagem Enviada!", "success");
                    }
                    document.getElementById('mensagem-incentivo').value = '';
                    showScreen('acompanhamentoResponsavel');
                } catch (error) {
                    showCustomAlert("Erro ao enviar mensagem. Tente novamente.", "Erro", "error");
                }
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
        formCadastro.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(formCadastro);
            const senha = formData.get('senha-cadastro');
            const confirmarSenha = formData.get('confirmar-senha');

            if (senha !== confirmarSenha) {
                showCustomAlert("As senhas não coincidem. Tente novamente.", "Erro de Cadastro", "error");
                return;
            }

            try {
                const userData = formDataToUserCreate(formData);
                await api.register(userData);
                
                currentUserName = userData.full_name;
                currentUserEmail = userData.email;
                
                showCustomAlert(`Cadastro realizado para ${currentUserName}! Preencha o questionário.`, "Bem-vindo(a)!", "success");
                showScreen('questionario');
            } catch (error) {
                showCustomAlert(error.message, "Erro no Cadastro", "error");
            }
        });
    }

    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async function(event) {
            event.preventDefault();
            const email = document.getElementById('email-login').value;

            try {
                await api.login(email); // A senha não é mais necessária
                
                currentUserName = api.user.full_name;
                currentUserEmail = api.user.email;
                
                // Atualiza o nome do responsável no formulário de contato com especialista
                const nomeContatoEspecialista = document.getElementById('nome-contato-especialista');
                if (nomeContatoEspecialista) {
                    nomeContatoEspecialista.value = `Responsável por ${currentUserName}`;
                }
                
                await loadUserData();
                showScreen('recomendacao');
            } catch (error) {
                showCustomAlert(error.message, "Erro no Login", "error");
            }
        });
    }

    const formQuestionario = document.getElementById('form-questionario');
    if (formQuestionario) {
        formQuestionario.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            try {
                const preferences = questionnaireDataToPreferences();
                await api.updatePreferences(preferences);
                
                showCustomAlert("Preferências salvas! Preparando suas recomendações.", "Obrigado!", "success");
                await loadUserData();
                showScreen('recomendacao');
            } catch (error) {
                showCustomAlert(error.message, "Erro ao Salvar Preferências", "error");
            }
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
        formPerfilAcessibilidade.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            try {
                const accessibilityData = {
                    font_size: document.getElementById('acess-font-size').value,
                    contrast: document.getElementById('acess-contrast').value,
                    reduce_animations: document.getElementById('acess-animations').checked,
                    text_to_speech: document.getElementById('acess-tts-global').checked
                };
                
                if (api.user) {
                    await api.updateAccessibility(accessibilityData);
                    
                    applyAccessibilitySettings(accessibilityData); 
                    showCustomAlert('Opções de acessibilidade salvas!', 'Sucesso', 'success');
                } else {
                    showCustomAlert('Opções de acessibilidade salvas! (simulado)', 'Sucesso', 'success');
                }
            } catch (error) {
                showCustomAlert('Erro ao salvar configurações de acessibilidade.', 'Erro', 'error');
            }
        });
    }

    // Delegação de evento para botões de explorar (inclui itens renderizados dinamicamente)
    document.addEventListener('click', async (ev) => {
        const btn = ev.target.closest('.btn-explorar-conteudo');
        if (!btn) return;

        const contentId = btn.getAttribute('data-content-id');
        const contentTitle = btn.getAttribute('data-content-title');

        // Se vier ID do backend, busca conteúdo real
        if (contentId) {
            try {
                const content = await api.getContentById(contentId);
                currentContentId = content.id;
                currentContentTitle = content.title;

                // Monta estrutura temporária para reuso do renderer existente
                currentContentData[currentContentTitle] = {
                    type: content.type,
                    source: content.source || undefined,
                    description: content.description || '',
                    title: content.title,
                    paragraphs: content.content ? content.content.split('\n\n') : [],
                    image: content.image_url || undefined,
                    gameElement: content.type === 'interactive_game' ? `<div class="text-center p-8"><i class="fas fa-gamepad text-5xl text-amber-500 mb-4"></i><p class="text-lg">${content.title}</p><button class="btn-secondary mt-4 text-sm">Começar Jogo</button></div>` : undefined
                };
                showScreen('acessoConteudo');
            } catch (e) {
                showCustomAlert('Não foi possível carregar o conteúdo.', 'Erro', 'error');
            }
            return;
        }

        // Fallback: comportamento antigo por título
        currentContentTitle = contentTitle || "Conteúdo Interativo";
        currentContentId = null;
        showScreen('acessoConteudo');
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
        btnMarcarConcluido.addEventListener('click', async function() {
            try {
                if (api.user && currentContentId) {
                    await api.updateProgress(currentContentId, 'completed', 100, 0);
                }
                showCustomAlert(`"${currentContentTitle}" marcado como concluído!`, 'Progresso Atualizado', 'success');
            } catch (e) {
                showCustomAlert('Falha ao registrar progresso. Mesmo assim marcamos localmente.', 'Aviso', 'warning');
            }

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
            
            // Limpa dados da API
            api.logout();
            
            // Reseta variáveis locais
            currentUserName = "Sky"; 
            currentUserEmail = "sky@exemplo.com";
            
            // Limpa formulários
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
    
    // Adiciona listener para o botão "Ver Meu Progresso"
    const btnVerProgresso = document.querySelector('button[onclick="showScreen(\'progressoUsuario\')"]');
    if (btnVerProgresso) {
        btnVerProgresso.addEventListener('click', async function(event) {
            event.preventDefault();
            if (api.user) {
                try {
                    const progress = await api.getUserProgress();
                    const activities = await api.getUserActivities();
                    renderUserProgress(progress);
                    renderUserActivities(activities);
                } catch (error) {
                    console.error('Erro ao carregar progresso:', error);
                }
            }
            showScreen('progressoUsuario');
        });
    }
    
    // Adiciona listener para o botão "Responsável"
    const btnResponsavel = document.querySelector('button[onclick="showScreen(\'acompanhamentoResponsavel\')"]');
    if (btnResponsavel) {
        btnResponsavel.addEventListener('click', async function(event) {
            event.preventDefault();
            if (api.user) {
                try {
                    const progress = await api.getUserProgress();
                    const activities = await api.getUserActivities();
                    renderGuardianPanel(progress, activities);
                } catch (error) {
                    console.error('Erro ao carregar dados para responsável:', error);
                }
            }
            showScreen('acompanhamentoResponsavel');
        });
    }
});

// Função para carregar dados do usuário da API
async function loadUserData() {
    if (!api.user) return;
    
    try {
        // Carrega progresso do usuário
        const progress = await api.getUserProgress();
        
        // Aplica configurações de acessibilidade
        if (api.user.accessibility_settings) {
            try {
                // As configurações podem vir como um objeto ou uma string JSON
                const settings = typeof api.user.accessibility_settings === 'string' 
                    ? JSON.parse(api.user.accessibility_settings) 
                    : api.user.accessibility_settings;
                
                applyAccessibilitySettings(settings);
                
                // Atualiza os valores do formulário no perfil
                document.getElementById('acess-font-size').value = settings.font_size || 'Padrão';
                document.getElementById('acess-contrast').value = settings.contrast || 'Padrão Lumind';
                document.getElementById('acess-animations').checked = settings.reduce_animations || false;
                document.getElementById('acess-tts-global').checked = settings.text_to_speech || false;
            } catch (e) {
                console.error("Erro ao aplicar configurações de acessibilidade:", e);
            }
        }
        
        // Carrega recomendações
        const recommendations = await api.getRecommendations();
        
        // Renderiza recomendações no grid
        renderRecommendations(recommendations);
        
        // Carrega atividades do usuário
        const activities = await api.getUserActivities();
        
        // Atualiza dados locais
        currentUserName = api.user.full_name;
        currentUserEmail = api.user.email;
        
        // Atualiza preferências no perfil se disponíveis
        if (api.user.learning_preferences) {
            try {
                const prefs = JSON.parse(api.user.learning_preferences);
                const perfilEstilos = document.getElementById('perfil-estilos');
                if (perfilEstilos) {
                    perfilEstilos.textContent = prefs.join(', ');
                }
            } catch (e) {
                console.error('Erro ao parsear preferências:', e);
            }
        }
        
        if (api.user.interests) {
            try {
                const interests = JSON.parse(api.user.interests);
                const perfilInteresses = document.getElementById('perfil-interesses');
                if (perfilInteresses) {
                    perfilInteresses.textContent = interests.join(', ');
                }
            } catch (e) {
                console.error('Erro ao parsear interesses:', e);
            }
        }
        
        // Renderiza progresso e atividades
        renderUserProgress(progress);
        renderUserActivities(activities);

        updateDynamicContent();
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}

// Renderiza cards de recomendação a partir da API
function renderRecommendations(recommendations) {
    const grid = document.querySelector('#recomendacao .grid');
    if (!grid || !Array.isArray(recommendations)) return;

    grid.innerHTML = '';

    recommendations.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card transform hover:shadow-lg transition-shadow duration-300 flex flex-col';

        const img = document.createElement('img');
        img.src = item.image_url || 'images/math.png';
        img.alt = item.title;
        img.className = 'rounded-md mb-4 w-full h-48 object-cover';
        card.appendChild(img);

        const h3 = document.createElement('h3');
        h3.className = 'text-lg font-semibold mb-2 text-gray-800';
        h3.textContent = item.title;
        card.appendChild(h3);

        const p = document.createElement('p');
        p.className = 'text-gray-600 text-sm mb-3 flex-grow';
        p.textContent = item.description || '';
        card.appendChild(p);

        const tag = document.createElement('span');
        tag.className = 'content-tag self-start mb-4';
        tag.innerHTML = item.type === 'video' ? '<i class="fas fa-video mr-1"></i> Vídeo' : (item.type === 'text' ? '<i class="fas fa-book-open mr-1"></i> Leitura' : '<i class="fas fa-puzzle-piece mr-1"></i> Jogo');
        card.appendChild(tag);

        const btn = document.createElement('button');
        btn.className = 'mt-auto w-full btn-secondary text-sm btn-explorar-conteudo';
        btn.setAttribute('data-content-id', item.id);
        btn.setAttribute('data-content-title', item.title);
        btn.innerHTML = '<i class="fas fa-play-circle mr-2"></i>Explorar';
        card.appendChild(btn);

        grid.appendChild(card);
    });
}

// Renderiza progresso do usuário
function renderUserProgress(progress) {
    if (!progress) return;
    
    // Atualiza resumo geral
    const progressPercentage = document.querySelector('#progressoUsuario .text-3xl.font-bold.text-green-600');
    if (progressPercentage) {
        progressPercentage.textContent = `${progress.progress_percentage}%`;
    }
    
    const progressBar = document.querySelector('#progressoUsuario .progress-bar-fill');
    if (progressBar) {
        progressBar.style.width = `${progress.progress_percentage}%`;
    }
    
    // Atualiza conquistas
    const achievementsContainer = document.querySelector('#progressoUsuario .flex.flex-wrap.gap-4');
    if (achievementsContainer && progress.achievements) {
        achievementsContainer.innerHTML = '';
        
        progress.achievements.forEach((achievement, index) => {
            const span = document.createElement('span');
            span.className = 'text-3xl transform hover:scale-125 transition-transform text-amber-500';
            span.title = achievement;
            
            // Mapeia conquistas para emojis
            const emojiMap = {
                'Explorador Curioso': '🌍',
                'Mestre dos Vídeos': '🎬',
                'Leitor Voraz': '📚'
            };
            
            span.textContent = emojiMap[achievement] || '🏆';
            achievementsContainer.appendChild(span);
        });
        
        // Adiciona conquistas não desbloqueadas
        const totalAchievements = 10;
        for (let i = progress.achievements.length; i < totalAchievements; i++) {
            const span = document.createElement('span');
            span.className = 'text-3xl text-gray-300';
            span.title = 'Ainda não desbloqueado';
            span.textContent = '❓';
            achievementsContainer.appendChild(span);
        }
        
        const achievementsText = document.querySelector('#progressoUsuario .text-sm.text-gray-500.mt-3');
        if (achievementsText) {
            achievementsText.textContent = `${progress.achievements.length} de ${totalAchievements} conquistas!`;
        }
    }
}

/**
 * Aplica as configurações de acessibilidade salvas em todo o documento.
 * @param {object} settings - O objeto de configurações vindo da API.
 * Ex: { font_size: "medio", contrast: "alto_contraste", ... }
 */
function applyAccessibilitySettings(settings) {
    if (!settings) {
        console.warn("Configurações de acessibilidade não encontradas.");
        return;
    }

    const body = document.body;

    // 1. Tamanho da Fonte
    body.classList.remove('font-size-padrao', 'font-size-medio', 'font-size-grande');
    if (settings.font_size === 'medio') {
        body.classList.add('font-size-medio');
    } else if (settings.font_size === 'grande') {
        body.classList.add('font-size-grande');
    } else {
        body.classList.add('font-size-padrao');
    }

    // 2. Alto Contraste
    body.classList.remove('high-contrast'); // Remove para garantir
    if (settings.contrast === 'alto_contraste' || settings.contrast === 'Alto Contraste') {
        body.classList.add('high-contrast');
    }

    // 3. Reduzir Animações
    body.classList.remove('reduce-motion'); // Remove para garantir
    if (settings.reduce_animations) {
        body.classList.add('reduce-motion');
    }

    // 4. Suporte a Leitor de Tela (a lógica principal é tratada por leitores de tela nativos, mas podemos adicionar atributos ARIA onde necessário)
}

// Renderiza atividades do usuário
function renderUserActivities(activities) {
    if (!activities || !Array.isArray(activities)) return;
    
    const activitiesList = document.querySelector('#progressoUsuario .space-y-3');
    if (!activitiesList) return;
    
    activitiesList.innerHTML = '';
    
    activities.forEach(activity => {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors';
        
        const div = document.createElement('div');
        
        const title = document.createElement('p');
        title.className = 'font-medium text-gray-700';
        title.textContent = activity.content?.title || 'Atividade';
        div.appendChild(title);
        
        const status = document.createElement('p');
        status.className = 'text-sm text-gray-500';
        
        let statusText = '';
        let statusIcon = '';
        
        switch (activity.status) {
            case 'completed':
                statusText = 'Concluído';
                statusIcon = '<i class="fas fa-check-circle mr-1"></i>';
                break;
            case 'in_progress':
                statusText = `Em andamento - ${activity.progress_percentage}%`;
                statusIcon = '<i class="fas fa-spinner fa-spin mr-1"></i>';
                break;
            default:
                statusText = 'Não iniciado';
                statusIcon = '<i class="far fa-circle mr-1"></i>';
        }
        
        status.innerHTML = statusText;
        div.appendChild(status);
        
        const span = document.createElement('span');
        span.className = activity.status === 'completed' ? 'text-green-500 font-semibold' : 
                        activity.status === 'in_progress' ? 'text-blue-500 font-semibold' : 
                        'text-gray-400 font-semibold';
        span.innerHTML = statusIcon;
        
        li.appendChild(div);
        li.appendChild(span);
        
        activitiesList.appendChild(li);
    });
}

// Renderiza painel do responsável
function renderGuardianPanel(progress, activities) {
    if (!progress) return;
    
    // Atualiza visão geral
    const timeSpent = document.querySelector('#acompanhamentoResponsavel .text-xl.font-semibold.text-gray-800');
    if (timeSpent) {
        timeSpent.textContent = `${Math.floor(progress.total_time_spent / 60)} horas`;
    }
    
    const activitiesCompleted = document.querySelectorAll('#acompanhamentoResponsavel .text-xl.font-semibold.text-gray-800')[1];
    if (activitiesCompleted) {
        activitiesCompleted.textContent = progress.completed_activities.toString();
    }
    
    const progressBar = document.querySelector('#acompanhamentoResponsavel .progress-bar-fill');
    if (progressBar) {
        progressBar.style.width = `${progress.progress_percentage}%`;
    }
    
    const progressText = document.querySelector('#acompanhamentoResponsavel .text-sm.text-right.text-gray-500');
    if (progressText) {
        progressText.textContent = `${progress.progress_percentage}%`;
    }
    
    // Atualiza alertas e observações baseado no progresso
    const alertsContainer = document.querySelector('#acompanhamentoResponsavel .space-y-3');
    if (alertsContainer && activities) {
        alertsContainer.innerHTML = '';
        
        // Alerta de dificuldade se há atividades em andamento há muito tempo
        const inProgressActivities = activities.filter(a => a.status === 'in_progress');
        if (inProgressActivities.length > 0) {
            const alert = document.createElement('li');
            alert.className = 'p-3 bg-yellow-50 border border-yellow-200 rounded-md';
            alert.innerHTML = `
                <p class="font-medium text-yellow-700"><i class="fas fa-exclamation-triangle mr-2"></i> Atividades em Andamento</p>
                <p class="text-sm text-yellow-600 mt-1">${currentUserName} tem ${inProgressActivities.length} atividade(s) em andamento.</p>
            `;
            alertsContainer.appendChild(alert);
        }
        
        // Alerta de conquista se completou atividades recentemente
        const completedActivities = activities.filter(a => a.status === 'completed');
        if (completedActivities.length > 0) {
            const alert = document.createElement('li');
            alert.className = 'p-3 bg-green-50 border border-green-200 rounded-md';
            alert.innerHTML = `
                <p class="font-medium text-green-700"><i class="fas fa-star mr-2"></i> Conquista Notável!</p>
                <p class="text-sm text-green-600 mt-1">${currentUserName} completou ${completedActivities.length} atividade(s) com sucesso!</p>
            `;
            alertsContainer.appendChild(alert);
        }
    }
}