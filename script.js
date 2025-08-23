const statusDisplay = document.querySelector('.status-display');
const gameCells = document.querySelectorAll('.cell');
const restartButton = document.querySelector('.restart-button');
const modeButtons = document.querySelectorAll('.mode-button');
const gameBoard = document.querySelector('.game-board');

let gameActive = false;
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameMode = '';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const messageTurn = () => `Player ${currentPlayer}'s turn`;
const messageWin = () => `Player ${currentPlayer} has won! 🎉`;
const messageDraw = () => `Game ended in a draw! 🤝`;

function startGame(mode) {
    gameMode = mode;
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];

    document.querySelector('.game-mode-selection').style.display = 'none';
    gameBoard.style.display = 'grid';
    restartButton.style.display = 'block';

    statusDisplay.innerHTML = messageTurn();
}

function handleAITurn() {
    if (!gameActive || currentPlayer !== 'O') {
        return;
    }

    statusDisplay.innerHTML = 'AI is thinking...';
    setTimeout(() => {
        let bestMove = findBestMove();
        handleCellPlayed(gameCells[bestMove], bestMove);
        handleResultValidation();
    }, 500);
}

function findBestMove() {
    // 1. Check for a winning move for the AI
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === 'O' && gameState[b] === 'O' && gameState[c] === '') return c;
        if (gameState[a] === 'O' && gameState[b] === '' && gameState[c] === 'O') return b;
        if (gameState[a] === '' && gameState[b] === 'O' && gameState[c] === 'O') return a;
    }

    // 2. Block the opponent's winning move
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === 'X' && gameState[b] === 'X' && gameState[c] === '') return c;
        if (gameState[a] === 'X' && gameState[b] === '' && gameState[c] === 'X') return b;
        if (gameState[a] === '' && gameState[b] === 'X' && gameState[c] === 'X') return a;
    }

    // 3. Take the center if available
    if (gameState[4] === '') return 4;

    // 4. Take a corner
    const corners = [0, 2, 6, 8];
    for (const index of corners) {
        if (gameState[index] === '') return index;
    }

    // 5. Take any empty spot
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') return i;
    }

    return -1;
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add(currentPlayer);
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') continue;

        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = messageWin();
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        statusDisplay.innerHTML = messageDraw();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = messageTurn();
    
    if (gameMode === 'player-vs-ai' && currentPlayer === 'O') {
        handleAITurn();
    }
}

function handleRestartGame() {
    gameActive = false;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.innerHTML = 'Choose a game mode';
    
    document.querySelector('.game-mode-selection').style.display = 'flex';
    gameBoard.style.display = 'none';
    restartButton.style.display = 'none';

    gameCells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('X', 'O');
    });
}

modeButtons.forEach(button => {
    button.addEventListener('click', () => startGame(button.dataset.mode));
});
gameCells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);