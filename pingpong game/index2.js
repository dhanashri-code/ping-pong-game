let can = document.getElementById("table");
let draw = can.getContext("2d");

// Ball object
const ball = {
    x: can.width / 2,
    y: can.height / 2,
    r: 13,
    velX: 5,
    velY: 5,
    speed: 2,
    color: "#47d71c"
};

// User paddle object
const user = {
    x: 0,
    y: (can.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "rgb(0, 242, 255)"
};

// CPU paddle object
const cpu = {
    x: can.width - 10,
    y: (can.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "rgb(0, 242, 255)"
};

// Separator line object
const sep = {
    x: (can.width - 2) / 2,
    y: 0,
    width: 4,
    height: 10,
    color: "orange"
};

// Game state variables
let isGameOver = false;
let winner = "";
let gameStarted = false; // Ensure the game starts after instructions
const restartButton = document.getElementById("restart-btn");
const instructionWindow = document.getElementById("instruction-window");
const closeButton = document.getElementById("close-btn");

// Draw a rectangle
function drawRectangle(x, y, w, h, color) {
    draw.fillStyle = color;
    draw.fillRect(x, y, w, h);
}

// Draw a circle
function drawCircle(x, y, r, color) {
    draw.fillStyle = color;
    draw.beginPath();
    draw.arc(x, y, r, 0, Math.PI * 2, false);
    draw.closePath();
    draw.fill();
}

// Draw score
function drawScore(text, x, y) {
    draw.fillStyle = "white";
    draw.font = "40px cursive";
    draw.fillText(text, x, y);
}

// Draw separator line
function drawSeparator() {
    for (let i = 0; i <= can.height; i += 20) {
        drawRectangle(sep.x, sep.y + i, sep.width, sep.height, sep.color);
    }
}

// Display a message
function displayMessage(message) {
    draw.fillStyle = "rgb(213, 30, 91)";
    draw.font = "50px cursive";
    draw.textAlign = "center";
    draw.fillText(message, can.width / 2, can.height / 2);
}

// Update and render all game objects
function helper() {
    // Clear the canvas
    drawRectangle(0, 0, can.width, can.height, "black");

    if (!gameStarted) {
        return; // Stop rendering if the game hasn't started
    }

    if (isGameOver) {
        displayMessage(winner);
        restartButton.style.display = "block";
        return;
    }

    // Draw game objects
    drawScore(user.score, can.width / 4, can.height / 5);
    drawScore(cpu.score, (3 * can.width) / 4, can.height / 5);
    drawSeparator();
    drawRectangle(user.x, user.y, user.width, user.height, user.color);
    drawRectangle(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color);
    drawCircle(ball.x, ball.y, ball.r, ball.color);
}

// Detect collision between the ball and a paddle
function detect_collision(ball, player) {
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    ball.top = ball.y - ball.r;
    ball.bottom = ball.y + ball.r;
    ball.left = ball.x - ball.r;
    ball.right = ball.x + ball.r;

    return (
        ball.right > player.left &&
        ball.top < player.bottom &&
        ball.left < player.right &&
        ball.bottom > player.top
    );
}

// Update ball movement and handle collisions
function updateBall() {
    ball.x += ball.velX;
    ball.y += ball.velY;

    // Ball collision with top and bottom walls
    if (ball.y - ball.r < 0 || ball.y + ball.r > can.height) {
        ball.velY = -ball.velY;
    }

    // Scoring logic
    if (ball.x - ball.r < 0) {
        cpu.score++;
        restart();
    } else if (ball.x + ball.r > can.width) {
        user.score++;
        restart();
    }

    // Collision with paddles
    let player = ball.x < can.width / 2 ? user : cpu;
    if (detect_collision(ball, player)) {
        ball.velX = -ball.velX;
        ball.speed += 0.1; // Increase speed slightly on paddle hit
    }

    // Check for game over condition
    if (user.score === 10) {
        isGameOver = true;
        winner = "User Wins!";
    } else if (cpu.score === 10) {
        isGameOver = true;
        winner = "AI Wins!";
    }
}

// Restart the game round
function restart() {
    ball.x = can.width / 2;
    ball.y = can.height / 2;
    ball.velX = -ball.velX;
    ball.speed = 5;
}

// CPU AI logic
function cpuAI() {
    if (cpu.y + cpu.height / 2 < ball.y) {
        cpu.y += 5;
    } else {
        cpu.y -= 3;
    }
}

// Update logic
function update() {
    if (!isGameOver && gameStarted) {
        updateBall();
        cpuAI();
    }
}

// Game loop callback
function call_back() {
    update();
    helper();
}

// Set game loop interval
let fps = 50;
let looper = setInterval(call_back, 1000 / fps);

// Paddle control with mouse
can.addEventListener("mousemove", getMousePos);

// Add event listeners for both mouse and touch events
can.addEventListener("mousemove", getMousePos);
can.addEventListener("touchmove", getTouchPos, { passive: false });

function getMousePos(evt) {
    let rect = can.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height / 2;
}

function getTouchPos(evt) {
    // Prevent default touch behavior
    evt.preventDefault();

    let rect = can.getBoundingClientRect();
    // Smoothly handle the first touch point
    let touch = evt.touches[0];
    user.y = touch.clientY - rect.top - user.height / 2;
}
// Reset game when restart button is clicked
restartButton.addEventListener("click", function () {
    user.score = 0;
    cpu.score = 0;
    ball.x = can.width / 2;
    ball.y = can.height / 2;
    ball.velX = 5;
    ball.velY = 5;
    isGameOver = false;
    winner = "";
    restartButton.style.display = "none";
});


// Close instruction window and start game
closeButton.addEventListener("click", function () {
    instructionWindow.style.display = "none";
    gameStarted = true; // Start the game after instructions are closed
});


