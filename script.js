// Elementos DOM
const guessInput = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');
const restartBtn = document.getElementById('restart-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const hintText = document.getElementById('hint-text');
const attemptsCount = document.getElementById('attempts-count');
const minValue = document.getElementById('min-value');
const maxValue = document.getElementById('max-value');
const attemptsList = document.getElementById('attempts-list');
const gameOverScreen = document.getElementById('game-over');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const secretNumberEl = document.getElementById('secret-number');
const usedAttemptsEl = document.getElementById('used-attempts');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');

// Configurações do jogo
let min = 1;
let max = 100;
let secretNumber;
let attemptsLeft;
let totalAttempts;
let gameHistory = [];
let difficulty = 'easy';

// Inicializar o jogo
function initGame() {
    secretNumber = generateRandomNumber(min, max);
    attemptsLeft = getMaxAttempts();
    totalAttempts = attemptsLeft;
    gameHistory = [];
    
    // Atualizar a interface
    attemptsCount.textContent = attemptsLeft;
    minValue.textContent = min;
    maxValue.textContent = max;
    hintText.textContent = 'Digite um número e clique em Enviar!';
    hintText.className = 'hint-text';
    attemptsList.innerHTML = '';
    gameOverScreen.classList.remove('show');
    guessInput.value = '';
    guessInput.disabled = false;
    guessBtn.disabled = false;
}

// Gerar número aleatório
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Obter tentativas máximas baseado na dificuldade
function getMaxAttempts() {
    switch(difficulty) {
        case 'easy': return 12;
        case 'medium': return 8;
        case 'hard': return 5;
        default: return 10;
    }
}

// Verificar o palpite do jogador
function checkGuess() {
    const userGuess = parseInt(guessInput.value);
    
    // Validar entrada
    if (isNaN(userGuess)) {
        hintText.textContent = 'Por favor, digite um número válido!';
        return;
    }
    
    if (userGuess < min || userGuess > max) {
        hintText.textContent = `Por favor, digite um número entre ${min} e ${max}!`;
        return;
    }
    
    // Registrar tentativa
    gameHistory.push(userGuess);
    attemptsLeft--;
    attemptsCount.textContent = attemptsLeft;
    
    // Adicionar ao histórico
    const attemptItem = document.createElement('div');
    attemptItem.className = 'attempt-item';
    
    // Verificar o palpite
    if (userGuess === secretNumber) {
        hintText.textContent = 'Parabéns! Você acertou! 🎉';
        hintText.className = 'hint-text correct';
        attemptItem.innerHTML = `<span class="attempt-number">${userGuess}</span> <span class="attempt-feedback">✅ Correto!</span>`;
        endGame(true);
    } else if (userGuess < secretNumber) {
        hintText.textContent = 'Muito baixo! Tente um número maior. 🔼';
        attemptItem.innerHTML = `<span class="attempt-number">${userGuess}</span> <span class="attempt-feedback">⬆️ Muito baixo</span>`;
    } else {
        hintText.textContent = 'Muito alto! Tente um número menor. 🔽';
        attemptItem.innerHTML = `<span class="attempt-number">${userGuess}</span> <span class="attempt-feedback">⬇️ Muito alto</span>`;
    }
    
    attemptsList.appendChild(attemptItem);
    attemptsList.scrollTop = attemptsList.scrollHeight;
    
    // Verificar se acabaram as tentativas
    if (attemptsLeft <= 0 && userGuess !== secretNumber) {
        hintText.textContent = 'Fim de jogo! Você perdeu. 😢';
        endGame(false);
    }
    
    guessInput.value = '';
    guessInput.focus();
}

// Finalizar o jogo
function endGame(isWin) {
    guessInput.disabled = true;
    guessBtn.disabled = true;
    
    // Atualizar tela de resultado
    if (isWin) {
        resultTitle.textContent = 'Parabéns!';
        resultMessage.textContent = 'Você acertou o número secreto!';
        gameOverScreen.classList.add('win');
        createConfetti();
    } else {
        resultTitle.textContent = 'Fim de Jogo!';
        resultMessage.textContent = 'Você não conseguiu adivinhar o número.';
        gameOverScreen.classList.add('lose');
    }
    
    secretNumberEl.textContent = secretNumber;
    usedAttemptsEl.textContent = totalAttempts - attemptsLeft;
    gameOverScreen.classList.add('show');
    gameOverScreen.classList.add('pulse');
}

// Criar efeito de confete
function createConfetti() {
    const container = document.querySelector('.container');
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = Math.random() * 100 + '%';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(confetti);
        
        // Remover após animação
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Alterar dificuldade
function setDifficulty(level) {
    difficulty = level;
    
    // Atualizar botões
    difficultyButtons.forEach(btn => {
        if (btn.dataset.difficulty === level) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Reiniciar jogo com nova dificuldade
    initGame();
}

// Event listeners
guessBtn.addEventListener('click', checkGuess);

guessInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        checkGuess();
    }
});

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setDifficulty(btn.dataset.difficulty);
    });
});

// Iniciar o jogo quando a página carregar
window.addEventListener('DOMContentLoaded', initGame);