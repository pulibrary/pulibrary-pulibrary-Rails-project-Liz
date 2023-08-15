// connect4 tutorial for initial implementation: https://youtu.be/4ARsthVnCTg 
const playerRed = "R";
const playerYellow = "Y";
let currPlayer = playerRed;

let gameOver = false;
let roundOver = false;
let board;

const rows = 6;
const columns = 7;
let currColumns = []; //keeps track of which row each column is at.

let usernameRedPlayer;
let usernameYellowPlayer;
let rounds = 1;
let totalRounds = 0;

window.onload = function() {
    setGame();
    createNextRoundButton();
    // timeout allows setGame CSS styling to render properly before pop up dialogs
    setTimeout(async () => {
        totalRounds = getNumberRounds();
        await loginPlayers();
        setTurn();
        setRound();
    }, 100);
}

function setTurn() {
    // indicate whose turn it is; I am reusing the h2 level header that announces the winner of each round.
    let turn = document.getElementById("winner");
    if (currPlayer == "R") {
        turn.innerText = `${usernameRedPlayer}'s turn to play!`;
        winner.className = "red-text"; 
    } else {
        turn.innerText = `${usernameYellowPlayer}'s turn to play!`;
        winner.className = "yellow-text"; 
    }
}

function setRound() {
    let roundHeader = document.getElementById("round-header");
    roundHeader.innerText = `Round ${rounds}/${totalRounds}`;
}

function setGame() {
    board = [];
    // row height of 0 to 5 indexed for each column. We start at 5, the bottom.
    currColumns = [5, 5, 5, 5, 5, 5, 5];

    // Clear out (any) existing board for next round
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // JS; ' ' is a placeholder for "R" and "Y" in the board. 
            // ' ' means it has not been set to a color.
            row.push(' ');
            // HTML
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            // adds the tile (div element) to the end of this "board" element's list of child nodes.
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
}

// this function is supposed to run ONCE.
function createNextRoundButton() {
    // create "Next Round" button
    let buttonDiv = document.getElementById("connect4-button-div");
    buttonDiv.setAttribute("hidden", "");

    var button = document.createElement("button");
    button.id = "connect4-button";
    button.textContent = "Next Round";
    button.classList.add("decor-button", "button-shadow");
    button.style.cursor = "pointer";

    button.addEventListener("click", function(event) {
        if (gameOver) {
            return;
        }
        // Prevent the default link behavior (don't want to navigate anywhere)
        event.preventDefault();
        let winner = document.getElementById("winner");
        winner.innerText = "";
        roundOver = false;
        setGame();
        setTurn();
        setRound();
    });

    buttonDiv.appendChild(button);
}

function getNumberRounds() {
    let total = 0;
    do {
        const userInput = prompt("Enter an ODD INTEGER for number of rounds desired to play, between 1 and 11:")
        // parse int with base 10
        total = parseInt(userInput, 10);
        console.log(`Test: totalRounds = ${total}`)
    } while (!Number.isInteger(total) || !(1 <= total && total <= 10) || total % 2 == 0);
    console.log("outside of while in getNumberRounds");
    return total;
}

async function loginPlayers() {
    let redPlayer = document.getElementById("red-player");
    let yellowPlayer = document.getElementById("yellow-player");
    
    try {
        usernameRedPlayer = await getPlayerUsername('RED');
        redPlayer.innerText = `Red Player: ${usernameRedPlayer}`;
        usernameYellowPlayer = await getPlayerUsername('YELLOW');
        yellowPlayer.innerText = `Yellow Player: ${usernameYellowPlayer}`;
        
    } catch (error) {
        console.error("Error:", error);
        throw new Error(error);
    }
}

async function getPlayerUsername(color) {
    let username;
    do {
        username = prompt(`Please enter your username to play as the ${color} player:`);
    } while(!(await checkUsernameValidity(username)));

        console.log("Test: after while loops");
        console.log("Test: user = " + username);
    return username;
}

// this function is used to get the CSRF token from the meta tags that Rails automatically
// inserts into the page when you use <%= csrf_meta_tags %>. 
// IMPORTANT: For every user session, a token is generated.
// This token is then used to make sure that the JavaScript fetch request is authorized
//  and isn't a cross-site request forgery.
// It will look for a meta tag like: <meta name="csrf-token" content="some_token_value">.
//  ** It's a mechanism to verify that form submissions or AJAX requests made to your Rails application
// come from the application's own pages and not from external sources.
function getMetaContent(metaName) {
    return document.querySelector("meta[name='" + metaName + "']").getAttribute("content");
  }

async function checkUsernameValidity(username) {
    try {
        // The encoding ensures that characters, which might be interpreted 
        // as control characters in the URL, are safely transmitted.
        // When the encoded URL reaches the Rails server, Rails automatically
        // decodes the parameters for you. So, by the time you access params[:username],
        // the value is already decoded, and you get the original username string that 
        // you can use to look up in your database.
        const response = await fetch("/validate_username?username=" + encodeURIComponent(username), {
            method: "GET",
            headers: {
                "X-CSRF-Token": getMetaContent('csrf-token')
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        if (data.valid) {
            console.log(data.message);  // username exists
            return true;
        } else {
            console.log(data.message);  // username does not exist
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        throw new Error(error);
    }
}

function setPiece() {
    console.log("Setting piece!")
    if (gameOver || roundOver) {
        return;
    }
    console.log(`gameOver = ${gameOver}`)

    // get coords of the tile clicked
    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    // figure out which row the current column should be on
    r = currColumns[c]; 

    if (r < 0) { // as we set tiles, we subtract 1 from r. Check if out of bounds. board[r][c] != ' '
        return;
    }

    board[r][c] = currPlayer; // update JS board
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currPlayer == playerRed) {
        tile.classList.add("red-piece");
        currPlayer = playerYellow;
    }
    else {
        tile.classList.add("yellow-piece");
        currPlayer = playerRed;
    }

    r -= 1; // update the row height for that column
    currColumns[c] = r; // update the array

    setTurn();
    checkWinner();
}

function checkWinner() {
     // horizontal
     for (let r = 0; r < rows; r++) {
         for (let c = 0; c < columns - 3; c++){ // 0 to 3 = 4 tiles
            if (board[r][c] != ' ') { // TODO: needed check?
                if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
         }
    }

    // vertical
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // anti diagonal
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    // diagonal
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
}

function getScore(element) {
    let scoreString = element.innerText;
    let score = parseInt(scoreString.charAt(scoreString.length - 1), 10);
    return score
}

function setWinner(r, c) {
    roundOver = true;
    rounds += 1;
    let redScoreElement = document.getElementById("red-score");
    let yellowScoreElement = document.getElementById("yellow-score");
    let winner = document.getElementById("winner");

    if (board[r][c] == playerRed) {
        winner.innerText = `${usernameRedPlayer} Wins!`;   
        winner.className = "red-text";
        // update round score
        setScore(redScoreElement);

    } else {
        winner.innerText = `${usernameYellowPlayer} Wins!`;
        winner.className = "yellow-text";
        // update round score
        setScore(yellowScoreElement);
    }

    // Handle when game is over
    if (rounds == totalRounds + 1) { // + 1 to indicate we would be at 4th round, meaning we finished 3 rounds.
        gameOver = true;
        let roundHeader = document.getElementById("round-header");
        roundHeader.className = "game-over";
        roundHeader.innerText = "Game Over!";

        // determine who is the FINAL WINNER of game (not the round) after final score update.
        if (getScore(redScoreElement) > getScore(yellowScoreElement)) {
            winner.innerText = `${usernameRedPlayer} is the final winner!`;
            winner.className = "red-text";
            // pass username to set cumulative score of winner
            updateScore(usernameRedPlayer)

        } else {
            winner.innerText = `${usernameYellowPlayer} is the final winner!`;
            winner.className = "yellow-text";
            updateScore(usernameYellowPlayer)
        } 

        // show button to start new game => reload of page
        startNewGame();
    }

    // show button to begin next round
    let buttonDiv = document.getElementById("connect4-button-div");
    buttonDiv.removeAttribute("hidden");
}

// cumulative score of winner-player for today
async function updateScore(username) {
    console.log(`username in updateScore = ${username}`)
    let response;
    try {
        response = await fetch("/update?username=" + encodeURIComponent(username), {
            method: "PATCH",
            headers: {
                "X-CSRF-Token": getMetaContent('csrf-token')
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error("Server response", response.textContent);
        throw new Error(error);
    }
}

// score of round
function setScore(element) { 
    let score = getScore(element);
    element.innerText = `Score: ${parseInt(score, 10) + 1}`;
}

function startNewGame() {
    let buttonDiv = document.getElementById("connect4-button-div");
    buttonDiv.innerHTML = "";
    // create game over button
    var button = document.createElement("button");
    button.id = "connect4-button";
    button.textContent = "Start New Game";
    button.classList.add("decor-button", "button-shadow");
    button.style.cursor = "pointer";

    button.addEventListener("click", function() {
        window.location.href = "/new_game";
    });

    buttonDiv.appendChild(button);
}