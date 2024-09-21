const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.querySelector('.start-screen');
const gameOverScreen = document.getElementById('gameOverScreen');
const playerForm = document.getElementById('playerForm');
const playerNameInput = document.getElementById('playerName');
const gameOverText = document.getElementById('gameOverText');
const restartButton = document.getElementById('restartButton');
const exitButton = document.getElementById('exitButton');

canvas.width = 400;
canvas.height = 400;

let snake, food, direction, score, speed, playerName;
let gameInterval;
let isGameOver = false;

playerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    playerName = playerNameInput.value;
    startGame();
});

function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.classList.add('hidden');
    resetGame();
    gameInterval = setInterval(gameLoop, speed);
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    food = spawnFood();
    direction = { x: 0, y: 0 };
    score = 0;
    speed = 200; // Starting speed is slow (higher number means slower)
    isGameOver = false;
}

function gameLoop() {
    if (isGameOver) return;

    update();
    draw();
}

function update() {
    // Move the snake
    const head = { ...snake[0] };
    head.x += direction.x * 20;
    head.y += direction.y * 20;

    // Check for wall collision
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        endGame();
    }

    // Check for self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }

    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score += 1;
        food = spawnFood();
        increaseSpeed();
    } else {
        snake.pop();
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, 20, 20);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 20, 20);

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function spawnFood() {
    const x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
    const y = Math.floor(Math.random() * (canvas.height / 20)) * 20;
    return { x, y };
}

function increaseSpeed() {
    if (speed > 50) { // Prevent speed from becoming too fast
        speed -= 10; // Speed increases by decreasing the interval time
    }
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    gameOverText.textContent = `${playerName}, your score is ${score}`;
    gameOverScreen.classList.remove('hidden');
}

function handleKeyPress(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
}

document.addEventListener('keydown', handleKeyPress);

restartButton.addEventListener('click', startGame);

exitButton.addEventListener('click', () => {
    window.close();
});
