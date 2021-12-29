const player = (sign = 'X') => {
    function getSign() {
        return sign;
    }

    return {getSign};
}

const gameBoard = (() => {
    let _board = new Array(9).fill('');

    function setSquare(pos, sign) {
        _board[pos] = sign;    
    }

    function getSquare(pos) {
        return _board[pos];
    }

    function clear() {
        _board.fill('');
    }

    return {setSquare, getSquare, clear};
})();

const displayController = (() => {
    const _winCombinationClass = 'is-winner';
    const _message = document.querySelector('#message');
    const _restart = document.querySelector('#restart');
    const _squares = document.querySelectorAll('.square');

    _restart.addEventListener('click', () => {
        gameController.reset();
    });

    _squares.forEach(square => square.addEventListener('click', ({target}) => {
        if (gameController.getIsGameOver() || target.textContent !== '') return;
        gameController.playTurn(target.dataset.index);
        draw();
    }));

    function showReset() {
        _restart.classList.add('is-visible');
    }

    function draw() {
        _squares.forEach((square, i) => {
            square.textContent = gameBoard.getSquare(i);
            if (gameController.getIsGameOver() && gameController.getWinCombination().includes(i)) {
                square.classList.add(_winCombinationClass);    
            }
            if (gameBoard.getSquare(i) !== ''){
                square.classList.add(`is-${gameBoard.getSquare(i)}`);
            }
        });
    }

    function message(message) {
        _message.innerHTML = message;
    }

    function clear(player = 'X') {
        _squares.forEach(square => {
            square.textContent = '';
            square.classList.remove(_winCombinationClass, 'is-X', 'is-O');
        });
        message(`Is your turn <span class="is-${player}">${player}</span>`);
        _restart.classList.remove('is-visible');
    }

    return {draw, message, showReset, clear};
})();

const gameController = (() => {
    const player1 = player();
    const player2 = player('O');
    let move = 0;
    let currentPlayer = player1.getSign();
    let isGameOver = false;
    let winCombination = [];

    function playTurn(pos) {
        gameBoard.setSquare(pos, currentPlayer);
        checkMove(Number(pos))
        if (!isGameOver) {
            move++;
            currentPlayer = currentPlayer === player1.getSign()
                ? player2.getSign()
                : player1.getSign();
            displayController.message(`Is your turn <span class="is-${currentPlayer}">${currentPlayer}</span>`);
        }
    }

    function getIsGameOver() {
        return isGameOver;
    }

    function checkMove(pos) {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        winConditions.forEach(condition => {
            if (condition.includes(pos)) {
                if (condition.every(index => gameBoard.getSquare(index) === currentPlayer)) {
                    winCombination = [...condition];
                    displayController.message(`<span class="is-${currentPlayer}">${currentPlayer}</span> is the winner!`);
                    isGameOver = true;
                    displayController.showReset();
                }
            }
        });

        if (move === 8 && !isGameOver) {
            displayController.message(`Is a tie!`);
            isGameOver = true;
            displayController.showReset();
        }
    }

    function getWinCombination() {
        return winCombination;
    }

    function reset() {  
        winCombination = [];
        isGameOver = false;
        move = 0;
        currentPlayer = player1.getSign();
        gameBoard.clear();
        displayController.clear(currentPlayer);
    }

    return {playTurn, getIsGameOver, getWinCombination, reset};
})();
