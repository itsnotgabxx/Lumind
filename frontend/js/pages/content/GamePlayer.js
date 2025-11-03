// Componente para renderizar jogos educativos
export default function GamePlayer(content) {
    console.log('🎮 GamePlayer recebeu:', content);
    
    // Parse do content_data se vier como string
    const contentData = typeof content.content_data === 'string' 
        ? JSON.parse(content.content_data) 
        : content.content_data;
    
    console.log('🎮 content_data parseado:', contentData);
    
    const gameType = contentData?.game_type || 'embedded';
    
    console.log('🎮 Tipo de jogo:', gameType);
    
    switch(gameType) {
        case 'embedded':
            return renderEmbeddedGame(content, contentData);
        case 'memory':
            return renderMemoryGame(content, contentData);
        case 'quiz':
            return renderQuizGame(content, contentData);
        case 'puzzle':
            return renderPuzzleGame(content, contentData);
        default:
            return renderEmbeddedGame(content, contentData);
    }
}

// 👇 ADICIONE ESTA FUNÇÃO (EXPORT!)
export function initializeGames() {
    console.log('🎮 Procurando jogos para inicializar...');
    
    // Jogos da Memória
    const memoryGrids = document.querySelectorAll('[id^="mem-"][id$="-grid"]');
    console.log('🎮 Grids de memória encontrados:', memoryGrids.length);
    memoryGrids.forEach(grid => {
        const gameId = grid.id.replace('-grid', '');
        console.log('🎮 Inicializando jogo da memória:', gameId);
        initMemoryGame(gameId);
    });
    
    // Quizzes
    const quizzes = document.querySelectorAll('[id^="quiz-"][id$="-content"]');
    console.log('📝 Quizzes encontrados:', quizzes.length);
    quizzes.forEach(quiz => {
        const gameId = quiz.id.replace('-content', '');
        console.log('📝 Inicializando quiz:', gameId);
        initQuizGame(gameId);
    });
    
    // Puzzles
    const puzzles = document.querySelectorAll('[id^="puzzle-"][id$="-grid"]');
    console.log('🧩 Puzzles encontrados:', puzzles.length);
    puzzles.forEach(grid => {
        const gameId = grid.id.replace('-grid', '');
        console.log('🧩 Inicializando puzzle:', gameId);
        initPuzzleGame(gameId);
    });
}

// ========== RENDERIZADORES ==========

function renderEmbeddedGame(content, contentData) {
    return `
        <div class="game-container bg-gray-900 rounded-xl overflow-hidden">
            <div class="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
                <h2 class="text-2xl font-bold text-white mb-2">${content.title}</h2>
                <p class="text-purple-100 text-sm">${content.description || 'Divirta-se jogando e aprendendo!'}</p>
            </div>
            
            <div class="relative w-full" style="padding-bottom: 75%; background: #1a1a1a;">
                <iframe
                    src="${contentData.game_url}"
                    class="absolute inset-0 w-full h-full"
                    frameborder="0"
                    allowfullscreen
                    allow="gamepad; keyboard-map *; web-share"
                    sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
                ></iframe>
            </div>
            
            <div class="bg-gray-800 p-4 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button onclick="toggleFullscreen()" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                        <i class="fas fa-expand mr-2"></i>Tela Cheia
                    </button>
                    <span class="text-gray-400 text-sm">
                        <i class="fas fa-gamepad mr-1"></i>
                        Use as setas do teclado para jogar
                    </span>
                </div>
                <div class="text-gray-500 text-xs">
                    Jogo fornecido por parceiros educativos
                </div>
            </div>
        </div>
        
        <script>
            function toggleFullscreen() {
                const iframe = document.querySelector('.game-container iframe');
                if (iframe.requestFullscreen) {
                    iframe.requestFullscreen();
                } else if (iframe.webkitRequestFullscreen) {
                    iframe.webkitRequestFullscreen();
                } else if (iframe.msRequestFullscreen) {
                    iframe.msRequestFullscreen();
                }
            }
        </script>
    `;
}

function renderMemoryGame(content, contentData) {
    const cards = contentData.cards || [
        '🌟', '🌈', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸',
        '🌟', '🌈', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸'
    ];
    
    const gameId = 'mem-' + Date.now();
    
    return `
        <div class="game-container max-w-4xl mx-auto">
            <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-xl p-6 text-white">
                <h2 class="text-3xl font-bold mb-2">${content.title}</h2>
                <p class="text-purple-100">${content.description || 'Encontre todos os pares!'}</p>
                
                <div class="mt-4 flex items-center gap-6">
                    <div class="bg-white/20 px-4 py-2 rounded-lg">
                        <span class="text-sm">Movimentos:</span>
                        <span id="${gameId}-moves" class="text-2xl font-bold ml-2">0</span>
                    </div>
                    <div class="bg-white/20 px-4 py-2 rounded-lg">
                        <span class="text-sm">Tempo:</span>
                        <span id="${gameId}-timer" class="text-2xl font-bold ml-2">0:00</span>
                    </div>
                    <div class="bg-white/20 px-4 py-2 rounded-lg">
                        <span class="text-sm">Pares:</span>
                        <span id="${gameId}-pairs" class="text-2xl font-bold ml-2">0/${cards.length / 2}</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-white p-8 rounded-b-xl shadow-2xl">
                <div id="${gameId}-grid" class="grid grid-cols-4 gap-4 mb-6">
                    ${cards.map((card, index) => `
                        <div class="memory-card aspect-square bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-5xl cursor-pointer transform transition-all hover:scale-105 shadow-lg"
                             data-card="${card}"
                             data-index="${index}"
                             data-game="${gameId}">
                            <span class="card-back">?</span>
                            <span class="card-front hidden">${card}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="flex justify-center gap-4">
                    <button id="${gameId}-restart" class="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg transition-all">
                        <i class="fas fa-redo mr-2"></i>Reiniciar Jogo
                    </button>
                </div>
            </div>
        </div>
        
        <style>
            .memory-card {
                user-select: none;
            }
            .memory-card.flipped .card-back {
                display: none !important;
            }
            .memory-card.flipped .card-front {
                display: block !important;
            }
            .memory-card.matched {
                background: linear-gradient(135deg, #10B981, #059669) !important;
                cursor: default;
                opacity: 0.7;
            }
        </style>
    `;
}

function renderQuizGame(content, contentData) {
    const questions = contentData.questions || [];
    const gameId = 'quiz-' + Date.now();
    
    console.log('📝 Quiz - Total de questões:', questions.length);
    console.log('📝 Primeira questão:', questions[0]);
    
    // Armazenar as perguntas de forma mais confiável
    if (typeof window.quizGamesData === 'undefined') {
        window.quizGamesData = {};
    }
    window.quizGamesData[gameId] = questions;
    
    return `
        <div class="game-container max-w-3xl mx-auto">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-6 text-white">
                <h2 class="text-3xl font-bold mb-2">${content.title}</h2>
                <p class="text-blue-100">${content.description || 'Teste seus conhecimentos!'}</p>
                
                <div class="mt-4 flex items-center gap-6">
                    <div class="bg-white/20 px-4 py-2 rounded-lg">
                        <span class="text-sm">Questão:</span>
                        <span id="${gameId}-current" class="text-2xl font-bold ml-2">1/${questions.length}</span>
                    </div>
                    <div class="bg-white/20 px-4 py-2 rounded-lg">
                        <span class="text-sm">Pontuação:</span>
                        <span id="${gameId}-score" class="text-2xl font-bold ml-2">0</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-white p-8 rounded-b-xl shadow-2xl">
                <div id="${gameId}-content" data-game-id="${gameId}"></div>
            </div>
        </div>
    `;
}

function renderPuzzleGame(content, contentData) {
    const gameId = 'puzzle-' + Date.now();
    
    return `
        <div class="game-container max-w-4xl mx-auto">
            <div class="bg-gradient-to-r from-teal-600 to-green-600 rounded-t-xl p-6 text-white">
                <h2 class="text-3xl font-bold mb-2">${content.title}</h2>
                <p class="text-teal-100">${content.description || 'Organize as peças!'}</p>
                
                <div class="mt-4 flex items-center gap-6">
                    <div class="bg-white/20 px-4 py-2 rounded-lg">
                        <span class="text-sm">Movimentos:</span>
                        <span id="${gameId}-moves" class="text-2xl font-bold ml-2">0</span>
                    </div>
                    <div class="bg-white/20 px-4 py-2 rounded-lg">
                        <span id="${gameId}-status" class="text-lg">Organize os números!</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-white p-8 rounded-b-xl shadow-2xl">
                <div id="${gameId}-grid" class="grid grid-cols-4 gap-3 max-w-md mx-auto mb-6"></div>
                
                <div class="flex justify-center gap-4">
                    <button id="${gameId}-shuffle" class="px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white font-bold rounded-xl shadow-lg">
                        <i class="fas fa-random mr-2"></i>Embaralhar
                    </button>
                    <button id="${gameId}-solve" class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl shadow-lg">
                        <i class="fas fa-magic mr-2"></i>Resolver
                    </button>
                </div>
            </div>
        </div>
        
        <style>
            .puzzle-tile {
                aspect-ratio: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                font-weight: bold;
                border-radius: 0.5rem;
                cursor: pointer;
                user-select: none;
                transition: all 0.2s;
            }
            .puzzle-tile:not(.empty):hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            .puzzle-tile.empty {
                background: transparent !important;
                cursor: default;
            }
        </style>
    `;
}

// ========== INICIALIZADORES ==========

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
                            alert('🎉 Parabéns! Você completou em ' + state.moves + ' movimentos!');
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
                alert('Você completou o puzzle em ' + puzzleState.moves + ' movimentos!');
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