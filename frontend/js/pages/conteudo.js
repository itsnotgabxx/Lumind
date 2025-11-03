import { api } from '../api.js';
import { showCustomAlert } from '../utils/alert.js';
import { userState } from '../utils/userState.js';
import GamePlayer from './content/GamePlayer.js';

export default async function ConteudoPage({ params }) {
    const contentId = params.id;
    console.log('🎯 ConteudoPage recebeu params:', params);
    console.log('🎯 contentId extraído:', contentId);

    let content;
    let userProgress;

    try {
        content = await api.getContentById(contentId);
        
        try {
            const activities = await api.getUserActivities();
            userProgress = activities.find(a => a.content_id === parseInt(contentId));
        } catch (e) {
            console.log('Progresso não encontrado, iniciando novo');
        }
    } catch (error) {
        showCustomAlert('Erro ao carregar conteúdo', 'Erro', 'error');
        window.router.navigate('/recomendacao');
        return '<p>Erro ao carregar...</p>';
    }

    const isCompleted = userProgress?.status === 'completed';

    return `
        <div class="w-full min-h-screen mx-auto px-4 py-6 sm:py-8">
            <nav class="mb-6 flex items-center gap-2 text-sm text-gray-600 max-w-7xl mx-auto">
                <button data-route="/recomendacao" class="hover:text-purple-600 transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Voltar
                </button>
            </nav>

            <div class="mb-6 max-w-7xl mx-auto">
                <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                    ${content.title}
                </h1>
                ${content.description ? `
                    <p class="text-gray-600 text-lg">
                        ${content.description}
                    </p>
                ` : ''}
            </div>

            <div class="space-y-6 max-w-7xl mx-auto">
                <div id="conteudo-wrapper" class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div class="flex items-center justify-center py-12">
                        <div class="loading-spinner"></div>
                        <span class="ml-3 text-gray-600">Carregando conteúdo...</span>
                    </div>
                </div>

                ${!isCompleted ? `
                    <div class="flex justify-center py-8">
                        <button 
                            id="btn-marcar-concluido" 
                            class="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-12 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 text-lg flex items-center gap-3"
                        >
                            <i class="fas fa-check-circle text-2xl"></i>
                            Marcar como Concluído
                        </button>
                    </div>
                ` : `
                    <div class="flex flex-col items-center py-8 gap-4">
                        <div class="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl px-8 py-4 text-center shadow-lg">
                            <i class="fas fa-check-circle text-4xl mb-2"></i>
                            <div class="font-bold text-xl">Concluído!</div>
                            <div class="text-sm opacity-90 mt-1">Parabéns pelo progresso! 🎉</div>
                        </div>
                        <button 
                            id="btn-proximo-conteudo"
                            class="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                            Próximo Conteúdo
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                `}
            </div>
        </div>
    `;
}

async function renderContent(content) {
    try {
        switch(content.type) {
            case 'video':
                return await import('./content/VideoPlayer.js')
                    .then(module => module.default(content));
            case 'text':
                return await import('./content/TextContent.js')
                    .then(module => module.default(content));
            case 'interactive_game':
                return GamePlayer(content);
            case 'audio':
                return await import('./content/AudioPlayer.js')
                    .then(module => module.default(content))
                    .catch(() => '<p class="text-center text-gray-600 py-8">Player de áudio em desenvolvimento</p>');
            default:
                return '<p class="text-center text-gray-600 py-8">Tipo de conteúdo não suportado</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar módulo de conteúdo:', error);
        return '<p class="text-center text-red-600 py-8">Erro ao carregar conteúdo. Tente novamente.</p>';
    }
}

export async function setup({ params }) {
    const contentId = params.id;
    console.log('⚙️ Setup recebeu params:', params);
    console.log('⚙️ contentId no setup:', contentId);

    const user = userState.user;

    if (!user) {
        window.router.navigate('/login');
        return;
    }

    // Adiciona estilos CSS para vídeos e iframes
    const style = document.createElement('style');
    style.textContent = `
        #conteudo-wrapper iframe,
        #conteudo-wrapper video {
            width: 100% !important;
            min-height: 500px !important;
            aspect-ratio: 16/9;
        }
        #conteudo-wrapper .video-container,
        #conteudo-wrapper .iframe-container {
            width: 100%;
            aspect-ratio: 16/9;
        }
    `;
    document.head.appendChild(style);

    try {
        const content = await api.getContentById(contentId);
        const contentHtml = await renderContent(content);
        
        const wrapper = document.getElementById('conteudo-wrapper');
        if (wrapper) {
            wrapper.innerHTML = contentHtml;
            
            // Inicializar jogos após renderizar
            setTimeout(() => {
                initializeGames();
            }, 100);
        }
    } catch (error) {
        console.error('Erro ao carregar conteúdo:', error);
    }

    try {
        await api.updateProgress(contentId, 'in_progress', 0, Date.now());
    } catch (e) {
        console.log('Erro ao registrar início:', e);
    }

    document.querySelectorAll('[data-route]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            window.router.navigate(el.dataset.route);
        });
    });

    const btnConcluido = document.getElementById('btn-marcar-concluido');
    if (btnConcluido && !btnConcluido.disabled) {
        btnConcluido.addEventListener('click', async () => {
            const originalText = btnConcluido.innerHTML;
            
            try {
                btnConcluido.disabled = true;
                btnConcluido.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Salvando...';
                
                await api.updateProgress(contentId, 'completed', 100, 0);
                
                showCustomAlert(
                    'Parabéns! Continue assim e você vai longe! 🎉',
                    'Conteúdo Concluído!',
                    'success'
                );
                
                setTimeout(() => {
                    window.router.navigate('/progresso');
                }, 2000);
                
            } catch (error) {
                console.error('Erro ao marcar como concluído:', error);
                showCustomAlert('Erro ao salvar progresso. Tente novamente.', 'Erro', 'error');
                
                btnConcluido.disabled = false;
                btnConcluido.innerHTML = originalText;
            }
        });
    }

    document.getElementById('btn-proximo-conteudo')?.addEventListener('click', async () => {
        try {
            const recommendations = await api.getRecommendations(10);
            
            if (recommendations && recommendations.length > 0) {
                const incomplete = recommendations.filter(r => r.id !== parseInt(contentId));
                
                if (incomplete.length > 0) {
                    const random = incomplete[Math.floor(Math.random() * incomplete.length)];
                    window.router.navigate(`/conteudo/${random.id}`);
                } else {
                    window.router.navigate('/recomendacao');
                }
            } else {
                window.router.navigate('/recomendacao');
            }
        } catch (error) {
            console.error('Erro ao buscar próximo conteúdo:', error);
            window.router.navigate('/recomendacao');
        }
    });

    const autoSaveInterval = setInterval(async () => {
        try {
            const currentProgress = Math.min(100, Math.floor((Date.now() % 100000) / 1000));
            await api.updateProgress(contentId, 'in_progress', currentProgress, Date.now());
        } catch (e) {
            console.log('Erro no auto-save:', e);
        }
    }, 30000);

    window.addEventListener('beforeunload', () => {
        clearInterval(autoSaveInterval);
    });
    
    // ========== FUNÇÕES PARA INICIALIZAR JOGOS ==========
    
    function initializeGames() {
    console.log('🎮 Procurando jogos para inicializar...');
    
    // Procurar por jogos da memória
    const memoryGrids = document.querySelectorAll('[id^="mem-"][id$="-grid"]');
    console.log('🎮 Grids de memória encontrados:', memoryGrids.length);
    
    memoryGrids.forEach(grid => {
        const gameId = grid.id.replace('-grid', '');
        console.log('🎮 Inicializando jogo da memória:', gameId);
        initMemoryGame(gameId);
    });
    
    // 👇 ADICIONE ESTA PARTE DO QUIZ
    // Procurar por quizzes
    const quizzes = document.querySelectorAll('[id^="quiz-"][id$="-content"]');
    console.log('📝 Quizzes encontrados:', quizzes.length);
    
    quizzes.forEach(quiz => {
        const gameId = quiz.id.replace('-content', '');
        console.log('📝 Inicializando quiz:', gameId);
        initQuizGame(gameId);
    });
    
    // Procurar por puzzles
    const puzzleGrids = document.querySelectorAll('[id^="puzzle-"][id$="-grid"]');
    console.log('🧩 Grids de puzzle encontrados:', puzzleGrids.length);
    
    puzzleGrids.forEach(grid => {
        const gameId = grid.id.replace('-grid', '');
        console.log('🧩 Inicializando puzzle:', gameId);
        initPuzzleGame(gameId);
    });
}
    
    function initMemoryGame(gameId) {
        const grid = document.getElementById(gameId + '-grid');
        const restartBtn = document.getElementById(gameId + '-restart');
        
        if (!grid) {
            console.error('❌ Grid não encontrado:', gameId);
            return;
        }
        
        console.log('✅ Grid encontrado:', grid);
        
        const state = {
            flippedCards: [],
            matchedPairs: 0,
            moves: 0,
            startTime: null,
            timerInterval: null,
            totalPairs: grid.querySelectorAll('.memory-card').length / 2
        };
        
        function handleCardClick(card) {
            console.log('🎯 Card clicado!', card);
            
            if (card.classList.contains('flipped') || 
                card.classList.contains('matched') || 
                state.flippedCards.length >= 2) {
                return;
            }
            
            if (!state.startTime) {
                state.startTime = Date.now();
                state.timerInterval = setInterval(() => {
                    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
                    const minutes = Math.floor(elapsed / 60);
                    const seconds = elapsed % 60;
                    const timerEl = document.getElementById(gameId + '-timer');
                    if (timerEl) {
                        timerEl.textContent = minutes + ':' + seconds.toString().padStart(2, '0');
                    }
                }, 1000);
            }
            
            card.classList.add('flipped');
            state.flippedCards.push(card);
            
            if (state.flippedCards.length === 2) {
                state.moves++;
                const movesEl = document.getElementById(gameId + '-moves');
                if (movesEl) {
                    movesEl.textContent = state.moves;
                }
                
                setTimeout(() => {
                    const [card1, card2] = state.flippedCards;
                    const value1 = card1.getAttribute('data-card');
                    const value2 = card2.getAttribute('data-card');
                    
                    if (value1 === value2) {
                        card1.classList.add('matched');
                        card2.classList.add('matched');
                        state.matchedPairs++;
                        
                        const pairsEl = document.getElementById(gameId + '-pairs');
                        if (pairsEl) {
                            pairsEl.textContent = state.matchedPairs + '/' + state.totalPairs;
                        }
                        
                        if (state.matchedPairs === state.totalPairs) {
                            clearInterval(state.timerInterval);
                            setTimeout(() => {
                                showCustomAlert(
                                    `Você completou o jogo em ${state.moves} movimentos!`,
                                    'Parabéns! 🎉',
                                    'success'
                                );
                            }, 500);
                        }
                    } else {
                        card1.classList.remove('flipped');
                        card2.classList.remove('flipped');
                    }
                    
                    state.flippedCards = [];
                }, 800);
            }
        }
        
        function restart() {
            clearInterval(state.timerInterval);
            state.flippedCards = [];
            state.matchedPairs = 0;
            state.moves = 0;
            state.startTime = null;
            state.timerInterval = null;
            
            document.querySelectorAll('[data-game="' + gameId + '"]').forEach(card => {
                card.classList.remove('flipped', 'matched');
            });
            
            document.getElementById(gameId + '-moves').textContent = '0';
            document.getElementById(gameId + '-timer').textContent = '0:00';
            document.getElementById(gameId + '-pairs').textContent = '0/' + state.totalPairs;
        }
        
        // Adicionar event listeners
        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.memory-card');
            if (card) {
                handleCardClick(card);
            }
        });
        
        if (restartBtn) {
            restartBtn.addEventListener('click', restart);
        }
        
        console.log('✅ Event listeners adicionados para', gameId);
    }
    
    function initPuzzleGame(gameId) {
        const grid = document.getElementById(gameId + '-grid');
        const shuffleBtn = document.getElementById(gameId + '-shuffle');
        const solveBtn = document.getElementById(gameId + '-solve');
        
        if (!grid) {
            console.error('❌ Puzzle grid não encontrado:', gameId);
            return;
        }
        
        console.log('✅ Puzzle grid encontrado:', grid);
        
        let puzzleState = {
            tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null],
            moves: 0
        };
        
        function renderPuzzle() {
            grid.innerHTML = puzzleState.tiles.map((num, index) => {
                if (num === null) {
                    return '<div class="puzzle-tile empty" data-index="' + index + '"></div>';
                }
                return `
                    <div class="puzzle-tile bg-gradient-to-br from-teal-400 to-green-500 text-white shadow-lg"
                         data-index="${index}">
                        ${num}
                    </div>
                `;
            }).join('');
            
            // Re-adicionar event listeners aos tiles
            grid.querySelectorAll('.puzzle-tile:not(.empty)').forEach(tile => {
                tile.addEventListener('click', () => {
                    moveTile(parseInt(tile.dataset.index));
                });
            });
        }
        
        function moveTile(index) {
            const emptyIndex = puzzleState.tiles.indexOf(null);
            const validMoves = [emptyIndex - 1, emptyIndex + 1, emptyIndex - 4, emptyIndex + 4];
            
            if (Math.abs(index - emptyIndex) === 1) {
                if (Math.floor(index / 4) !== Math.floor(emptyIndex / 4)) return;
            }
            
            if (validMoves.includes(index)) {
                [puzzleState.tiles[index], puzzleState.tiles[emptyIndex]] = 
                [puzzleState.tiles[emptyIndex], puzzleState.tiles[index]];
                
                puzzleState.moves++;
                document.getElementById(gameId + '-moves').textContent = puzzleState.moves;
                
                renderPuzzle();
                checkWin();
            }
        }
        
        function shufflePuzzle() {
            for (let i = 0; i < 100; i++) {
                const emptyIndex = puzzleState.tiles.indexOf(null);
                const possibleMoves = [];
                
                if (emptyIndex % 4 !== 0) possibleMoves.push(emptyIndex - 1);
                if (emptyIndex % 4 !== 3) possibleMoves.push(emptyIndex + 1);
                if (emptyIndex >= 4) possibleMoves.push(emptyIndex - 4);
                if (emptyIndex < 12) possibleMoves.push(emptyIndex + 4);
                
                const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                [puzzleState.tiles[emptyIndex], puzzleState.tiles[randomMove]] = 
                [puzzleState.tiles[randomMove], puzzleState.tiles[emptyIndex]];
            }
            
            puzzleState.moves = 0;
            document.getElementById(gameId + '-moves').textContent = '0';
            document.getElementById(gameId + '-status').textContent = 'Organize os números!';
            renderPuzzle();
        }
        
        function solvePuzzle() {
            puzzleState.tiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];
            renderPuzzle();
            checkWin();
        }
        
        function checkWin() {
            const solved = puzzleState.tiles.every((num, index) => 
                num === null ? index === 15 : num === index + 1
            );
            
            if (solved) {
                document.getElementById(gameId + '-status').textContent = '🎉 Parabéns! Puzzle resolvido!';
                setTimeout(() => {
                    showCustomAlert(
                        `Você completou o puzzle em ${puzzleState.moves} movimentos!`,
                        'Parabéns! 🎉',
                        'success'
                    );
                }, 500);
            }
        }
        
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', shufflePuzzle);
        }
        
        if (solveBtn) {
            solveBtn.addEventListener('click', solvePuzzle);
        }
        
        renderPuzzle();
        shufflePuzzle();
        
        console.log('✅ Puzzle inicializado:', gameId);
    }

    function initQuizGame(gameId) {
    const contentDiv = document.getElementById(gameId + '-content');
    if (!contentDiv) {
        console.error('❌ Quiz content div não encontrado:', gameId);
        return;
    }
    
    // Pegar questões do objeto global
    const quizData = window.quizGamesData?.[gameId] || [];
    
    console.log('🎯 Inicializando quiz:', gameId);
    console.log('📝 Questões carregadas:', quizData.length);
    console.log('📝 Dados:', quizData);
    
    if (quizData.length === 0) {
        contentDiv.innerHTML = `
            <div class="text-center text-red-600 py-8">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p class="text-lg font-semibold">Erro: Nenhuma questão encontrada</p>
                <p class="text-sm mt-2">Por favor, recarregue a página</p>
            </div>
        `;
        return;
    }
    
    let currentQuestion = 0;
    let score = 0;
    
    function loadQuestion() {
        const question = quizData[currentQuestion];
        
        console.log('📄 Carregando questão', currentQuestion + 1, ':', question);
        
        contentDiv.innerHTML = `
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-gray-800">${question.question}</h3>
                
                <div class="space-y-3">
                    ${question.options.map((option, index) => `
                        <button class="quiz-option w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all" data-index="${index}">
                            <span class="font-semibold text-purple-600">${String.fromCharCode(65 + index)}.</span>
                            <span class="ml-3 text-gray-800">${option}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.getElementById(gameId + '-current').textContent = (currentQuestion + 1) + '/' + quizData.length;
        
        // Adicionar event listeners aos botões
        contentDiv.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedIndex = parseInt(btn.dataset.index);
                console.log('✅ Resposta selecionada:', selectedIndex);
                checkAnswer(selectedIndex);
            });
        });
    }
    
    function checkAnswer(selected) {
        const question = quizData[currentQuestion];
        const options = contentDiv.querySelectorAll('.quiz-option');
        
        console.log('🔍 Verificando resposta:', selected, 'Correta:', question.correct);
        
        options.forEach(opt => opt.disabled = true);
        
        if (selected === question.correct) {
            score += 10;
            options[selected].classList.add('bg-green-100', 'border-green-500');
            options[selected].innerHTML += ' <i class="fas fa-check text-green-600 float-right"></i>';
            console.log('✅ Resposta CORRETA!');
        } else {
            options[selected].classList.add('bg-red-100', 'border-red-500');
            options[selected].innerHTML += ' <i class="fas fa-times text-red-600 float-right"></i>';
            options[question.correct].classList.add('bg-green-100', 'border-green-500');
            console.log('❌ Resposta ERRADA. Correta era:', question.correct);
        }
        
        document.getElementById(gameId + '-score').textContent = score;
        
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < quizData.length) {
                loadQuestion();
            } else {
                showResults();
            }
        }, 2000);
    }
    
    function showResults() {
        const percentage = (score / (quizData.length * 10)) * 100;
        
        console.log('🏆 Quiz finalizado! Pontuação:', score, 'Percentual:', percentage);
        
        contentDiv.innerHTML = `
            <div class="text-center space-y-6">
                <div class="text-6xl mb-4">
                    ${percentage >= 70 ? '🎉' : percentage >= 50 ? '😊' : '💪'}
                </div>
                <h3 class="text-3xl font-bold text-gray-800">Quiz Concluído!</h3>
                <div class="text-6xl font-bold text-purple-600">${score} pontos</div>
                <p class="text-xl text-gray-600">Você acertou ${Math.round(percentage)}% das questões!</p>
                
                <button onclick="location.reload()" class="px-8 py-4 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg">
                    <i class="fas fa-redo mr-2"></i>Jogar Novamente
                </button>
            </div>
        `;
    }
    
    loadQuestion();
}
}