// reference to all HTML elements
const container = document.querySelector('.container');
const playerDisplay = document.querySelector('.display-player');
const resetButton = document.querySelector('#reset');
const announcer = document.querySelector('.announcer');
const updateGridButton = document.querySelector('#updateGrid')
const columns = document.querySelector('#columns')
const rows = document.querySelector('#rows')
const connectingTiles = document.querySelector('#connectingTiles')

// game variables
const PLAYER_1_WIN = 'Player_1_Wins';
const PLAYER_2_WIN = 'Player_2_Wins';
const TIE = 'Tie';
let maxRows = 6;
let maxColumns = 7;
let winningTiles = 4;
let scores = {
    player1: 0,
    player2: 0
}
let currentPlayer = 1;
let isGameRunning = true;
let columnsArray = Array.from({ length: maxColumns }, () => []);

//check winner and add score
function updateScores(winner) {
    if (winner === 1) {
        scores.player1++;
    } else if (winner === 2) {
        scores.player2++;
    }

    // Update score display
    document.querySelector('.player1-score span').textContent = scores.player1;
    document.querySelector('.player2-score span').textContent = scores.player2;
}


//Creates the game grid with the specified dimensions

function createGrid(columns, rows) {
    // Clear the container
    container.innerHTML = '';

    // Set grid styles
    setupGridStyles(columns, rows);

    // Create tiles
    createTiles(columns, rows);

    // Add click listeners
    setupEventListeners();
}

//set grid styles
function setupGridStyles(columns, rows) {
    container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    container.style.maxWidth = `${columns * 100}px`;
}

//creating tiles for the grid, depends on user input
function createTiles(columns, rows) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.column = col;
            container.appendChild(tile);
        }
    }
}

/**
 * Sets up event listeners for tiles
 */
function setupEventListeners() {
    const tiles = document.querySelectorAll('.tile');

    tiles.forEach(tile => {
        tile.addEventListener('click', handleTileClick);
    });
}

/**
 * Handles the click event on a tile
 */
function handleTileClick(event) {
    if (!isGameRunning) return;

    const columnIndex = parseInt(event.target.dataset.column);
    const columnArray = columnsArray[columnIndex];
    const rowPosition = columnArray.length;

    if (rowPosition >= maxRows) return;

    makeMove(columnIndex, rowPosition);
    updateUI(columnIndex, rowPosition);

    if (checkWin(columnIndex, rowPosition)) {
        isGameRunning = false;
        console.log("won")
        announceWinner();
        return;
    }

    // Check for tie BEFORE changing player
    if (columnsArray.every(column => column.length === maxRows)) {
        isGameRunning = false;
        announceTie();
        return;
    }

    changePlayer();
}

// announcing tie, unhide announcer
function announceTie() {
    announcer.textContent = "It's a Tie!";
    announcer.classList.remove('hide');
}

//announcing winner, unhide announcer and update scores
function announceWinner() {
    const winnerMessage = currentPlayer === 1 ? PLAYER_1_WIN : PLAYER_2_WIN;
    announcer.textContent = `Player ${currentPlayer} wins!`;
    announcer.classList.remove('hide');
    updateScores(currentPlayer)
}

//make move in the game, adding player tile into array
function makeMove(columnIndex, rowPosition) {
    columnsArray[columnIndex].push(currentPlayer === 1 ? 'player1' : 'player2');
}


/**
 * Updates the UI after a move
    figuring out tileindex, and add class to the specific tile, so its either red or yellow
 */
function updateUI(columnIndex, rowPosition) {
    const tiles = document.querySelectorAll('.tile');
    const tileIndex = (maxRows - 1 - rowPosition) * maxColumns + columnIndex;
    tiles[tileIndex].classList.add(currentPlayer === 1 ? 'player1' : 'player2');
}


/**
 * Changes the current player
 */
function changePlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    playerDisplay.textContent = `${currentPlayer}`;

    // Remove previous player class
    playerDisplay.classList.remove('player1-turn', 'player2-turn');

    // Add the correct class
    if (currentPlayer === 1) {
        console.log("hi")
        playerDisplay.classList.add('player1-turn');
    } else {
        playerDisplay.classList.add('player2-turn');
    }


}
//check all possible wins
function checkWin(columnIndex, rowPosition) {

    return (
        checkVerticalWin(columnIndex, rowPosition) ||
        checkHorizontalWin(columnIndex, rowPosition) ||
        checkDiagonalWin(columnIndex, rowPosition)
    );

}

function checkVerticalWin(columnIndex, rowPosition) {
    const columnArray = columnsArray[columnIndex];
    if (columnArray.length < winningTiles) return false; // Not enough pieces to win

    const currentValue = currentPlayer === 1 ? 'player1' : 'player2';
    let count = 1; // Start with the current piece

    // Check downward from current position
    for (let i = rowPosition - 1; i >= 0; i--) {
        if (columnsArray[columnIndex][i] === currentValue) {
            count++;
            if (count >= winningTiles) return true;
        } else {
            break; // Stop checking if a different piece is found
        }
    }

    return false;
}

function checkHorizontalWin(columnIndex, rowPosition) {
    const currentValue = currentPlayer === 1 ? 'player1' : 'player2';
    let count = 1;

    // Check left
    for (let col = columnIndex - 1; col >= 0; col--) {
        // Check if the column exists and has enough rows
        if (!columnsArray[col] || !columnsArray[col][rowPosition]) break;
        if (columnsArray[col][rowPosition] === currentValue) {
            count++;
            if (count >= winningTiles) return true;
        } else {
            break;
        }
    }

    // Check right
    for (let col = columnIndex + 1; col < maxColumns; col++) {
        // Check if the column exists and has enough rows
        if (!columnsArray[col] || !columnsArray[col][rowPosition]) break;
        if (columnsArray[col][rowPosition] === currentValue) {
            count++;
            if (count >= winningTiles) return true;
        } else {
            break;
        }
    }

    return false;
}

/*
Start counting from 1 (including the current tile).

Check "Up-Right" (\ diagonal) direction:
    Move one step diagonally up-right (columnIndex + i, rowPosition + i).
    Stop if out of bounds (column or row doesn't exist).
    If the tile matches the current player, increase the count.
    If count >= winningTiles, return true (win detected).
    If a tile does not match, stop checking in this direction.

Check "Down-Left" (\ diagonal) direction:
    Move one step diagonally down-left (columnIndex - i, rowPosition - i).
    Follow the same logic as before.
    
If neither direction completes a win, return false.
*/
function checkDiagonalWin(columnIndex, rowPosition) {
    const currentValue = currentPlayer === 1 ? 'player1' : 'player2';

    // Check diagonal \
    let count = 1;

    // Check up-right
    for (let i = 1; i < winningTiles; i++) {
        if (columnIndex + i >= maxColumns ||
            rowPosition + i >= columnsArray[columnIndex + i]?.length) break;
        if (columnsArray[columnIndex + i][rowPosition + i] === currentValue) {
            count++;
            if (count >= winningTiles) return true;
        } else {
            break;
        }
    }

    // Check down-left
    for (let i = 1; i < winningTiles; i++) {
        if (columnIndex - i < 0 ||
            rowPosition - i < 0 ||
            !columnsArray[columnIndex - i][rowPosition - i]) break;
        if (columnsArray[columnIndex - i][rowPosition - i] === currentValue) {
            count++;
            if (count >= winningTiles) return true;
        } else {
            break;
        }
    }

    // Check diagonal /
    count = 1;

    // Check up-left
    for (let i = 1; i < winningTiles; i++) {
        if (columnIndex - i < 0 ||
            rowPosition + i >= columnsArray[columnIndex - i]?.length) break;
        if (columnsArray[columnIndex - i][rowPosition + i] === currentValue) {
            count++;
            if (count >= winningTiles) return true;
        } else {
            break;
        }
    }

    // Check down-right
    for (let i = 1; i < winningTiles; i++) {
        if (columnIndex + i >= maxColumns ||
            rowPosition - i < 0 ||
            !columnsArray[columnIndex + i][rowPosition - i]) break;
        if (columnsArray[columnIndex + i][rowPosition - i] === currentValue) {
            count++;
            if (count >= winningTiles) return true;
        } else {
            break;
        }
    }

    return false;
}


//resetting game board, new columnsarray
function resetGame() {
    isGameRunning = true;
    currentPlayer = 1;
    columnsArray = Array.from({ length: maxColumns }, () => []);

    // Clear all tiles
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.classList.remove('player1', 'player2');
    });

    // Reset display
    playerDisplay.classList.remove('player1-turn', 'player2-turn');
    playerDisplay.classList.add('player1-turn')
    playerDisplay.textContent = "1";
    announcer.classList.add('hide');
}

// Add this to your setupEventListeners function
resetButton.addEventListener('click', resetGame);

updateGridButton.addEventListener('click', updateGrid)

//update grid and checking if connecting tiles are lower then the columns or rows
function updateGrid() {
    if (parseInt(connectingTiles.value) > parseInt(columns.value) || parseInt(connectingTiles.value) > parseInt(rows.value)) {
        alert("connecting tiles must be lower or equals than the rows and columns")
    } else {
        maxColumns = parseInt(columns.value)
        maxRows = parseInt(rows.value)
        winningTiles = parseInt(connectingTiles.value)
        resetGame()
        columnsArray = Array.from({ length: maxColumns }, () => []);
        createGrid(maxColumns, maxRows)
    }
}

// Initialize the game
createGrid(maxColumns, maxRows);