
// board
var blockSize = 25;
var rows = 21;
var cols = 21;
var board;
var context;
var gameSession;
var score = 0;

var restartMessage = document.getElementById("restartMessage");
var scoreBoard = document.getElementById("scoreBoard");
var gameover = false;


// Snake
var snake = [];
var head;
function posSnake(x, y, grow=false) {
    if (snake.length > 0 && !grow) {
        snake.splice(0,1)
    }
    head = [x,y]
    snake.push(head)
}
var velX;
var velY;
var frameInputTaken;


// Food
var foodPos = []
function posFood(customPos=false, x=0, y=0) {
    if (!customPos) {
        do {
            foodPos = [randInt(0, rows), randInt(0, rows)];
            var valid = true;
            snake.forEach(segment => {
                if (posEqual(segment, foodPos)) {
                    valid = false;
                }
            })

        } while (!valid);
    } else {
        foodPos = [x, y];
    }
}


window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width= cols * blockSize;
    context = board.getContext("2d"); // used for drawing on the board

    document.addEventListener("keydown", changeDirection);
    drawBackground();
}

function startGameSession() {
    restartMessage.style.display = "none";
    score = 0;
    gameover = false;
    if (gameSession != null) {
        clearInterval(gameSession);
    }

    snake = [];
    posSnake(Math.floor(rows / 2) - 5, Math.floor(cols / 2));
    posFood(true, Math.floor(rows / 2) + 5, Math.floor(cols / 2));

    velX = 1
    velY = 0
    frameInputTaken = false;

    return setInterval(update, 75);
}


function changeDirection(e) {
    if (e.code=="Space") {
        gameSession = startGameSession();
        return
    }

    if (!frameInputTaken) {
        if (velY == 0 && (e.code=="ArrowUp" || e.code=="KeyW")) {
            velX = 0;
            velY = -1;
            frameInputTaken = true;
        } else if (velY == 0 && (e.code=="ArrowDown" || e.code=="KeyS")) {
            velX = 0;
            velY = 1;
            frameInputTaken = true;
        } else if (velX == 0 && (e.code=="ArrowLeft" || e.code=="KeyA")) {
            velX = -1;
            velY = 0;
            frameInputTaken = true;
        } else if (velX == 0 && (e.code=="ArrowRight" || e.code=="KeyD")) {
            velX = 1;
            velY = 0;
            frameInputTaken = true;
        }
    }
}


function update() {

    // check if ate food
    var grow = false;
    if (posEqual(head, foodPos)) {
        grow = true;
        score++

        posFood();
    }

    // update snake position
    posSnake(head[0] + velX, head[1] + velY, grow);
    
    // allow new input
    frameInputTaken = false;

    // check if collision
    if (head[0] < 0 || head[0] >= cols || head[1] < 0 || head[1] >= rows) {
        gameOver();
    }
    for (i = 0; i < snake.length - 1; i++) {
        if (posEqual(head, snake[i])) {
            gameOver();
        }
    }


    // draw
    if (!gameover) {
        drawBackground();
        
        // draw food
        drawBlock(foodPos[0], foodPos[1], "red");

        // draw snake
        snake.forEach(segment => {
            drawBlock(segment[0], segment[1], "lime");
        })
    } else {
        drawBackground();
    }
    
    scoreBoard.innerHTML = score;
    
}

function gameOver() {
    clearInterval(gameSession);
    restartMessage.style.display = "block";
    gameover = true;
}

function drawBackground() {
    context.fillStyle = "black";
    context.fillRect(0,0, board.width, board.height);
}

function drawBlock(x, y, color, size=blockSize) {
    context.fillStyle = color;
    context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function posEqual(pos1, pos2) {
    return pos1[0] == pos2[0] && pos1[1] == pos2[1];
}