//Reference the elements of the document
const container = document.querySelector('.container');
const playerDisplay = document.querySelector('.display-player');
const resetButton = document.querySelector('#reset');
const announcer = document.querySelector('.announcer');

let currentPlayer = 1;

const maxRows = 5;
const maxColumns = 5;
const columnsArray = Array.from({ length: maxColumns }, () => []); // Creates an array of 7 empty arrays


function createGrid(columns, rows) {

  // Clear the container
  container.innerHTML = '';

  // Set the grid styles dynamically
  container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  container.style.maxWidth = `${columns * 100}px`;


  // Create playboard
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      // Create a div
      const tile = document.createElement('div')
      // Assign a class based on row and col
      tile.classList.add('tile');
      // Save the column index as a data attribute
      tile.dataset.column = col; 
      // Append to the container
      container.appendChild(tile);
    }
  }

  const tiles = document.querySelectorAll('.tile')
  console.log(tiles)

  tiles.forEach(tile => {
    tile.addEventListener('click', (event) =>{
      //tile.classList.add('player1')
      const columnIndex = parseInt(event.target.dataset.column);
      const columnArray = columnsArray[columnIndex];
      const rowPosition = columnArray.length;


      if (rowPosition < maxRows){
      columnArray.push('red')}
      console.log(columnIndex,rowPosition,maxRows)
      const tileIndex = (maxRows - 1 - rowPosition) * maxColumns + columnIndex;
      if(currentPlayer == 1){
      tiles[tileIndex].classList.add('player1');
      currentPlayer = 2;
      } else {
        tiles[tileIndex].classList.add('player2');
        currentPlayer = 1;
      }
      console.log(tileIndex)



    })
  })

}





createGrid(maxColumns,maxRows)

