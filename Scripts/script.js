var origBoard;
const playerOne = 'X';
const compPlayer = 'O';

var setTimer;
const timerTotal = 0;
let time = timerTotal * 60;
const counterElement = document.getElementById('timer');

function updateTimer()
{
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    counterElement.innerHTML = `${minutes}:${seconds}`;
    time++;
}

const winCombos = 
[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [2, 5, 8],
    [1, 4, 7],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
gameMode();


function gameMode()
{
    var choice = document.getElementsByName("choice");

    if (choice[0].checked == true){
        beginGame();
    }else if (choice[1].checked == true){
        document.querySelector(".gameover").style.display = "none";
        for (var i = 0; i < cells.length; i++)
        {
            cells[i].innerText = '';
            cells[i].style.removeProperty('background-color');
        }
        beginGamePVP();
    }
}
/*____________________________Begin code for player Vs player______________________________ */
const X_CLASS = 'X';
const CIRCLE_CLASS = "O";
let circleTurn

function beginGamePVP()
{
    circleTurn = false
    setTimer = setInterval(updateTimer, 1000);
    cells.forEach(cell => {
        cell.classList.remove(CIRCLE_CLASS)
        cell.classList.remove(X_CLASS)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true })
    })
}

function handleClick(e)
{
    const cell = e.target.id
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
    placeMark(cell, currentClass)
    if (checkWinner(currentClass))
    {
        endGame(false)
    }else if (isDraw())
    {
        endGame(true)
    }else
    {
        switchTurns()
    }
    const mssgeTurns = circleTurn ? CIRCLE_CLASS : X_CLASS
    document.getElementById("turn").innerHTML = "It is " + mssgeTurns + "'s turn"
    
}

function isDraw()
{
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}

function endGame (draw)
{
    if (draw)
    {
        document.querySelector(".gameover").style.display = "block"
        document.querySelector(".gameover .text").innerText = "Draw Game!"
        clearInterval(setTimer);

    }else
    {
        document.querySelector(".gameover").style.display = "block"
        document.querySelector(".gameover .text").innerText = `${circleTurn ? "O" : "X"} Wins!`
        clearInterval(setTimer);
    }
    time = 0;
}

function placeMark(cell, currentClass)
{
    document.getElementById(cell).innerText = currentClass
    document.getElementById(cell).classList = currentClass
}

function switchTurns()
{
    circleTurn = !circleTurn
}

function checkWinner(currentClass)
{
    return winCombos.some (combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass)
        })
    })
}



/*____________________________Begin code for player Vs computer_____________________________ */

function beginGame()
{
    setTimer = setInterval(updateTimer, 1000);
    document.querySelector(".gameover").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++)
    {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turn(squareId, player)
{
    if (player === playerOne)
    {
        document.getElementById("turn").innerHTML="It is "+ playerOne +"'s turn";
    }
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameEnd(gameWon)
}

function turnClick(square)
{
    if (typeof origBoard[square.target.id] == 'number')
    {
        turn(square.target.id, playerOne)
        if (!checkTie()) turn(bestSpot(), compPlayer);
    }
    
}

function checkWin(board, player)
{
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i): a, [])
    let gameWon = null;
    for (let [index, win] of winCombos.entries())
    {
        if (win.every(elem => plays.indexOf(elem) > -1))
        {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameEnd(gameWon)
{
    for (let index of winCombos[gameWon.index])
    {
        document.getElementById(index).style.backgroundColor = gameWon.player == playerOne ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++)
    {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == playerOne ? "Player One Wins!" : "Computer Wins!")
    clearInterval(setTimer);
    time = 0;
}

function declareWinner(who)
{
    document.querySelector(".gameover").style.display = "block";
    document.querySelector(".gameover .text").innerText = who;
}

function emptySquares()
{
    return origBoard.filter(s => typeof s == 'number');
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function bestSpot ()
{
    return emptySquares(getRandomInt(9))[0];
}

function checkTie()
{
    if (emptySquares().length == 0)
    {
        for (var i = 0; i < cells.length; i++) 
        {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}
