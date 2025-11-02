// Componente para renderizar jogos educativos
export default function GamePlayer(content) {
    const gameType = content.game_type || 'embedded';
    
    switch(gameType) {
        case 'embedded':
            return renderEmbeddedGame(content);
        case 'memory':
            return renderMemoryGame(content);
        case 'quiz':
            return renderQuizGame(content);
        case 'puzzle':
            return renderPuzzleGame(content);
        default:
            return renderEmbeddedGame(content);
    }
}

// Renderiza jogos embedded (via iframe)
function renderEmbeddedGame(content) {
    return `
        <div class="game-container bg-gray-900 rounded-xl overflow-hidden">
            <div class="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
                <h2 class="text-2xl font-bold text-white mb-2">${content.title}</h2>
                <p class="text-purple-100 text-sm">${content.description || 'Divirta-se jogando e aprendendo!'}</p>
            </div>
            
            <div class="relative w-full" style="padding-bottom: 75%; background: #1a1a1a;">
                <iframe
                    src="${content.game_url}"
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

// Jogo da Memória
function renderMemoryGame(content) {
    const cards = content.cards || [
        '🌟', '🌈', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸',
        '🌟', '🌈', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸'
    ];
    
    return `
        <div class="game-container max-w-4xl mx-auto">
            <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-xl p-6 text-white">
                <h2 class="text-3xl font-bold mb-2">${content.title}</h2>
                <p class="text-purple-100">${content.description || 'Encontre todos os pares!'}</p>
                
                <div class="mt-4 flex items-center gap-6">
                    <div class="bg-white/20 px-4 py-2 rounded-lg">
                        <span class="text-sm">Movimentos:</span>
                        <span id="moves" class="text-2xl font-bold ml-2">0</span>
                    </div>
                    <div class="bg-white/20 px-4 py-2 rounded-lg">
                        <span class="text-sm">Tempo:</span>
                        <span id="timer" class="text-2xl font-bold ml-2">0:00</span>
                    </div>
                    <div class="bg-white/20 px-4 py-2 rounded-lg">
                        <span class="text-sm">Pares:</span>
                        <span id="pairs" class="text-2xl font-bold ml-2">0/${cards.length / 2}</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-white p-8 rounded-b-xl shadow-2xl">
                <div id="memory-grid" class="grid grid-cols-4 gap-4 mb-6">
                    ${cards.map((card, index) => `
                        <div class="memory-card aspect-square bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-5xl cursor-pointer transform transition-all hover:scale-105 shadow-lg"
                             data-card="${card}"
                             data-index="${index}"
                             onclick="handleMemoryCardClick(this)">
                            <span class="card-back">?</span>
                            <span class="card-front hidden">${card}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="flex justify-center gap-4">
                    <button onclick="restartMemoryGame()" class="btn-primary px-6 py-3">
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
                display: none;
            }
            .memory-card.flipped .card-front {
                display: block;
            }
            .memory-card.matched {
                background: linear-gradient(135deg, #10B981, #059669);
                cursor: default;
                opacity: 0.7;
            }
            .memory-card.matched:hover {
                transform: none;
            }
        </style>
        
        <script>
            let memoryGameState = {
                flippedCards: [],
                matchedPairs: 0,
                moves: 0,
                startTime: null,
                timerInterval: null
            };
            
            function handleMemoryCardClick(card) {
                if (card.classList.contains('flipped') || 
                    card.classList.contains('matched') || 
                    memoryGameState.flippedCards.length >= 2) {
                    return;
                }
                
                // Inicia o timer no primeiro clique
                if (!memoryGameState.startTime) {
                    memoryGameState.startTime = Date.now();
                    memoryGameState.timerInterval = setInterval(updateTimer, 1000);
                }
                
                card.classList.add('flipped');
                memoryGameState.flippedCards.push(card);
                
                if (memoryGameState.flippedCards.length === 2) {
                    memoryGameState.moves++;
                    document.getElementById('moves').textContent = memoryGameState.moves;
                    
                    setTimeout(checkMatch, 800);
                }
            }
            
            function checkMatch() {
                const [card1, card2] = memoryGameState.flippedCards;
                const value1 = card1.getAttribute('data-card');
                const value2 = card2.getAttribute('data-card');
                
                if (value1 === value2) {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    memoryGameState.matchedPairs++;
                    
                    document.getElementById('pairs').textContent = 
                        memoryGameState.matchedPairs + '/' + ${cards.length / 2};
                    
                    if (memoryGameState.matchedPairs === ${cards.length / 2}) {
                        clearInterval(memoryGameState.timerInterval);
                        setTimeout(() => {
                            alert('🎉 Parabéns! Você completou o jogo em ' + 
                                  memoryGameState.moves + ' movimentos!');
                        }, 500);
                    }
                } else {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                }
                
                memoryGameState.flippedCards = [];
            }
            
            function updateTimer() {
                const elapsed = Math.floor((Date.now() - memoryGameState.startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                document.getElementById('timer').textContent = 
                    minutes + ':' + seconds.toString().padStart(2, '0');
            }
            
            function restartMemoryGame() {
                memoryGameState = {
                    flippedCards: [],
                    matchedPairs: 0,
                    moves: 0,
                    startTime: null,
                    timerInterval: null
                };
                
                document.querySelectorAll('.memory-card').forEach(card => {
                    card.classList.remove('flipped', 'matched');
                });
                
                document.getElementById('moves').textContent = '0';
                document.getElementById('timer').textContent = '0:00';
                document.getElementById('pairs').textContent = '0/${cards.length / 2}';
                
                clearInterval(memoryGameState.timerInterval);
            }
        </script>
    `;
}

// Quiz Interativo
function renderQuizGame(content) {
    const questions = content.questions || [
        {
            question: "Qual é a capital do Brasil?",
            options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
            correct: 2
        },
        {
            question: "Quantos planetas existem no Sistema Solar?",
            options: ["7", "8", "9", "10"],
            correct: 1
        }
    ];
    
    return `
        <div class="game-container max-w-3xl mx-auto">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-6 text-white">
                <h2 class="text-3xl font-bold mb-2">${content.title}</h2>
                <p class="text-blue-100">${content.description || 'Teste seus conhecimentos!'}</p>
                
                <div class="mt-4 flex items-center gap-6">
                    <div class="bg-white/20 px-4 py-2 rounded-lg">
                        <span class="text-sm">Questão:</span>
                        <span id="current-question" class="text-2xl font-bold ml-2">1/${questions.length}</span>
                    </div>
                    <div class="bg-white/20 px-4 py-2 rounded-lg">
                        <span class="text-sm">Pontuação:</span>
                        <span id="score" class="text-2xl font-bold ml-2">0</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-white p-8 rounded-b-xl shadow-2xl">
                <div id="quiz-content">
                    <!-- Conteúdo será inserido via JavaScript -->
                </div>
            </div>
        </div>
        
        <script>
            const quizData = ${JSON.stringify(questions)};
            let currentQuestion = 0;
            let score = 0;
            
            function loadQuestion() {
                const question = quizData[currentQuestion];
                const content = document.getElementById('quiz-content');
                
                content.innerHTML = \`
                    <div class="space-y-6">
                        <h3 class="text-2xl font-bold text-gray-800">\${question.question}</h3>
                        
                        <div class="space-y-3">
                            \${question.options.map((option, index) => \`
                                <button onclick="checkAnswer(\${index})" 
                                        class="quiz-option w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all">
                                    <span class="font-semibold text-purple-600">\${String.fromCharCode(65 + index)}.</span>
                                    <span class="ml-3 text-gray-800">\${option}</span>
                                </button>
                            \`).join('')}
                        </div>
                    </div>
                \`;
                
                document.getElementById('current-question').textContent = 
                    (currentQuestion + 1) + '/' + quizData.length;
            }
            
            function checkAnswer(selected) {
                const question = quizData[currentQuestion];
                const options = document.querySelectorAll('.quiz-option');
                
                options.forEach(opt => opt.disabled = true);
                
                if (selected === question.correct) {
                    score += 10;
                    options[selected].classList.add('bg-green-100', 'border-green-500');
                    options[selected].innerHTML += ' <i class="fas fa-check text-green-600 float-right"></i>';
                } else {
                    options[selected].classList.add('bg-red-100', 'border-red-500');
                    options[selected].innerHTML += ' <i class="fas fa-times text-red-600 float-right"></i>';
                    options[question.correct].classList.add('bg-green-100', 'border-green-500');
                }
                
                document.getElementById('score').textContent = score;
                
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
                const content = document.getElementById('quiz-content');
                const percentage = (score / (quizData.length * 10)) * 100;
                
                content.innerHTML = \`
                    <div class="text-center space-y-6">
                        <div class="text-6xl mb-4">
                            \${percentage >= 70 ? '🎉' : percentage >= 50 ? '😊' : '💪'}
                        </div>
                        <h3 class="text-3xl font-bold text-gray-800">Quiz Concluído!</h3>
                        <div class="text-6xl font-bold text-purple-600">\${score} pontos</div>
                        <p class="text-xl text-gray-600">Você acertou \${Math.round(percentage)}% das questões!</p>
                        
                        <button onclick="restartQuiz()" class="btn-primary px-8 py-4 text-lg">
                            <i class="fas fa-redo mr-2"></i>Jogar Novamente
                        </button>
                    </div>
                \`;
            }
            
            function restartQuiz() {
                currentQuestion = 0;
                score = 0;
                document.getElementById('score').textContent = '0';
                loadQuestion();
            }
            
            // Carrega a primeira questão
            loadQuestion();
        </script>
    `;
}

// Quebra-Cabeça Simples
function renderPuzzleGame(content) {
    return `
        <div class="game-container max-w-4xl mx-auto">
            <div class="bg-gradient-to-r from-teal-600 to-green-600 rounded-t-xl p-6 text-white">
                <h2 class="text-3xl font-bold mb-2">${content.title}</h2>
                <p class="text-teal-100">${content.description || 'Organize as peças!'}</p>
                
                <div class="mt-4 flex items-center gap-6">
                    <div class="bg-white/20 px-4 py-2 rounded-lg">
                        <span class="text-sm">Movimentos:</span>
                        <span id="puzzle-moves" class="text-2xl font-bold ml-2">0</span>
                    </div>
                    <div class="bg-white/20 px-4 py-2 rounded-lg">
                        <span id="puzzle-status" class="text-lg">Organize os números!</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-white p-8 rounded-b-xl shadow-2xl">
                <div id="puzzle-grid" class="grid grid-cols-4 gap-3 max-w-md mx-auto mb-6">
                    <!-- Será preenchido via JavaScript -->
                </div>
                
                <div class="flex justify-center gap-4">
                    <button onclick="shufflePuzzle()" class="btn-secondary px-6 py-3">
                        <i class="fas fa-random mr-2"></i>Embaralhar
                    </button>
                    <button onclick="solvePuzzle()" class="btn-subtle px-6 py-3">
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
        
        <script>
            let puzzleState = {
                tiles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null],
                moves: 0
            };
            
            function renderPuzzle() {
                const grid = document.getElementById('puzzle-grid');
                grid.innerHTML = puzzleState.tiles.map((num, index) => {
                    if (num === null) {
                        return '<div class="puzzle-tile empty" data-index="' + index + '"></div>';
                    }
                    return \`
                        <div class="puzzle-tile bg-gradient-to-br from-teal-400 to-green-500 text-white shadow-lg"
                             data-index="\${index}"
                             onclick="moveTile(\${index})">
                            \${num}
                        </div>
                    \`;
                }).join('');
            }
            
            function moveTile(index) {
                const emptyIndex = puzzleState.tiles.indexOf(null);
                const validMoves = [
                    emptyIndex - 1, emptyIndex + 1,
                    emptyIndex - 4, emptyIndex + 4
                ];
                
                // Verifica movimentos válidos (sem ultrapassar bordas)
                if (Math.abs(index - emptyIndex) === 1) {
                    if (Math.floor(index / 4) !== Math.floor(emptyIndex / 4)) return;
                }
                
                if (validMoves.includes(index)) {
                    [puzzleState.tiles[index], puzzleState.tiles[emptyIndex]] = 
                    [puzzleState.tiles[emptyIndex], puzzleState.tiles[index]];
                    
                    puzzleState.moves++;
                    document.getElementById('puzzle-moves').textContent = puzzleState.moves;
                    
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
                document.getElementById('puzzle-moves').textContent = '0';
                document.getElementById('puzzle-status').textContent = 'Organize os números!';
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
                    document.getElementById('puzzle-status').textContent = '🎉 Parabéns! Puzzle resolvido!';
                    setTimeout(() => {
                        alert('Você completou o puzzle em ' + puzzleState.moves + ' movimentos!');
                    }, 500);
                }
            }
            
            renderPuzzle();
            shufflePuzzle();
        </script>
    `;
}

// Exporta as funções de setup se necessário
export function setupGameControls() {
    // Funções globais já estão no HTML inline
    console.log('Game controls initialized');
}