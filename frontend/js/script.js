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
    if (api.token && api.user) {
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
            const password = document.getElementById('senha-login').value;

            try {
                await api.login(email, password);
                
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
        formPerfilAcessibilidade.addEventListener('submit', function(event) {
            event.preventDefault();
            showCustomAlert('Opções de acessibilidade salvas!', 'Sucesso', 'success');
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
                if (api.token && currentContentId) {
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
});

// Função para carregar dados do usuário da API
async function loadUserData() {
    if (!api.user) return;
    
    try {
        // Carrega progresso do usuário
        const progress = await api.getUserProgress();
        
        // Carrega recomendações
        const recommendations = await api.getRecommendations();
        
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
        
        // Renderiza recomendações no grid
        renderRecommendations(recommendations);

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