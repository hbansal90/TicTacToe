/*
    1. Basic Setup
    2. Determine Winner
    3. Basic AI and Winner Notification
    4. Unbeatable minmax algorithm
 */
var oriBoard;
// Keeps the state of the board
const humanPlayer ='O';
const AIPlayer ='X';
let winFlag = false;
let computersPoint = 0;
let HumansPoint = 0;
// The End points for the winning
const winCombos =[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
// lets take control all the cells of the grid
const cells = document.querySelectorAll('.cell');
startGame();


function turnClick(square){
    if(typeof oriBoard[square.target.id] == 'number'){
    //console.log(square.target.id)
    turn(square.target.id, humanPlayer); // to give human player a chance
    if(!checkWin(oriBoard, humanPlayer) &&!checkTie())
        setTimeout(()=>{
        
        turn( bestSpot(), AIPlayer);
    }, 1000);

    }
}

function turn (squareId, player){
    if(player == AIPlayer) {
        document.getElementById(squareId).classList.add('AIturn');
    }
    oriBoard[squareId] = player;
    console.log(oriBoard);
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(oriBoard, player);
    if(gameWon) gameOver(gameWon)
}
// Lets determin the winner of the game
function checkWin(board, player){
    let plays = board.reduce((a, e, i)=> (e ===player)? a.concat(i): a, []);
    let gameWon = null;
    for(let [index, win] of winCombos.entries()){
        if( win.every(elem => plays.indexOf(elem)>-1)){
            gameWon = { index: index, player: player};
            break;
        }
    }
    return gameWon;
}
function gameOver(gameWon){
    // lets higlhlight the winnign combinations
    setTimeout(()=>{
    for( let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = (gameWon.player == humanPlayer)? "#007FFF": "#E32636";
        document.getElementById(index).style.color = "white";
    }
    for(var i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == humanPlayer? "You Win!": "You Lose");
    if(gameWon.player == humanPlayer){
        HumansPoint++;
        declareWinner("You Win!");
    }
    else{
        computersPoint++;
        declareWinner("You Lose!");
    }
    }, 500);
}
function emptySquares(){
    return oriBoard.filter(s => typeof s =='number')
}
// Basic AI
function bestSpot(){
    return minimax(oriBoard, AIPlayer).index;
}
function declareWinner(who) {
    const endgameElement = document.querySelector(".endgame");
    const tableElement = document.querySelector("table");

    // Display the endgame element with slide-right and glow animation
    endgameElement.style.display = 'block';
    setTimeout(() => {
        endgameElement.classList.add('show');
    }, 50);

    // Apply slide-left animation to the table
    tableElement.classList.add('slide-left');

    // Update the endgame message
    document.querySelector('.text').innerHTML = `<div>${who}</div>`;
    document.querySelector('.scoreboard').innerHTML = `Your Score: ${HumansPoint}</div><div>Computer's Score: ${computersPoint}</div>`
    tableElement.classList.add('slide-left')
}

function startGame() {
    oriBoard = Array.from(Array(9).keys());
    const endgameElement = document.querySelector(".endgame");
    const tableElement = document.querySelector("table");

    // Hide the endgame element and remove animation classes
    endgameElement.style.display = 'none';
    endgameElement.classList.remove('show');

    // Reverse the slide-left effect for the table
    tableElement.classList.remove('slide-left');
    tableElement.classList.add('slide-left-reverse');
    setTimeout(() => {
        tableElement.classList.remove('slide-left-reverse');
    }, 500);

    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function checkTie(){
    if(emptySquares().length == 0){
        for(var i =0; i< cells.length; i++){
            cells[i].style.backgroundColor = "#feb300";
            cells[i].style.color ='#874F41 '
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner('Tie Game!');
        return true;
    }
    return false;
}

// Min-max algorithm to make unbeatable AI
function minimax(newBoard, player){
    var availspots = emptySquares();
    if(checkWin(newBoard, humanPlayer)){
        return {score: -10};
    } else if( checkWin(newBoard, AIPlayer)){
        return {score: 10};
    } else if( availspots.length === 0){
        return {score: 0};
    }
    var moves = [];
    for(var i = 0; i< availspots.length; i++){
        var move ={}
        move.index = newBoard[availspots[i]];
        newBoard[availspots[i]] = player;

        if(player == AIPlayer){
            var result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        } else{
            var result = minimax(newBoard, AIPlayer);
            move.score = result.score
        }
        newBoard[availspots[i]] = move.index;
        moves.push(move);
        }

        var bestMove;
        if(player == AIPlayer){
            var bestScore = -Infinity;
            for(var i =0; i< moves.length; i++){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else{
            bestScore = Infinity;
            for(var i = 0; i< moves.length; i++){
                if(moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }

