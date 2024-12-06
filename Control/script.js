const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let carImage = new Image();
carImage.src = 'ModelXnoshadow_birdseyeview.png';

let car = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 100,
    speed: 5,
    dx: 0
};

// Road and grass dimensions
const roadWidth = canvas.width * 0.4;
const roadX = (canvas.width - roadWidth) / 2;
let roadLines = [];
let lineSpacing = 50;
let roadSpeed = 5;
let obstacles = [];
let obstacleSpeed = 3;

// Reset the game state
function resetGame() {
    car.x = canvas.width / 2 - 25;
    car.y = canvas.height - 100;
    obstacles = [];
    roadLines = [];
    createRoadLines();

    // Reset audio
    carRadio.pause();
    carRadio.currentTime = 0;
    isPlaying = false;
    document.getElementById('radioButton').textContent = 'Play radio music';
}

// Create road lines within the narrower road
function createRoadLines() {
    for (let i = 0; i < canvas.height; i += lineSpacing) {
        roadLines.push({ x: roadX + roadWidth / 2 - 5, y: i, width: 10, height: 30 });
    }
}

// Generate obstacles within the road area
function createObstacles() {
    setInterval(() => {
        let obstacleX = roadX + Math.random() * (roadWidth - 50); // Random x position within road
        let obstacleWidth = 50;
        let obstacleHeight = 100;
        obstacles.push({
            x: obstacleX,
            y: -obstacleHeight,  // Start closer to top of visible canvas
            width: obstacleWidth,
            height: obstacleHeight
        });
    }, 2000); // Add a new obstacle every 2 seconds
}

// Move and draw obstacles, check for collisions
function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.y += obstacleSpeed;

        // Remove obstacle if it moves off-screen
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
        }

        // Collision detection with car
        if (
            car.x < obstacle.x + obstacle.width &&
            car.x + car.width > obstacle.x &&
            car.y < obstacle.y + obstacle.height &&
            car.y + car.height > obstacle.y
        ) {
            alert('Game Over!');
            resetGame();  // Reset the game if collision occurs
        }

        // Draw obstacle
        ctx.fillStyle = 'blue';  // Set fill color for obstacles
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Move the car, restricting it within the road
function moveCar() {
    car.x += car.dx;

    if (car.x < roadX) {
        car.x = roadX;
    }
    if (car.x + car.width > roadX + roadWidth) {
        car.x = roadX + roadWidth - car.width;
    }
}

// Draw the grass areas on each side of the road
function drawGrass() {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, roadX, canvas.height); // Left grass area
    ctx.fillRect(roadX + roadWidth, 0, roadX, canvas.height); // Right grass area
}

// Draw the road lines within the central road area
function drawRoad() {
    ctx.fillStyle = 'gray';
    ctx.fillRect(roadX, 0, roadWidth, canvas.height); // Road area

    ctx.fillStyle = 'white';
    roadLines.forEach(line => {
        ctx.fillRect(line.x, line.y, line.width, line.height);
    });
}

// Move the road lines downward to create a moving road effect
function moveRoad() {
    roadLines.forEach(line => {
        line.y += roadSpeed;
        if (line.y > canvas.height) {
            line.y = -line.height;
        }
    });
}

// Draw the car
function drawCar() {
    ctx.drawImage(carImage, car.x, car.y, car.width, car.height);
}

// Main update loop for the game
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrass(); // Draw grass on each side of the road
    drawRoad();  // Draw the road and lines
    moveCar();   // Move the car
    moveRoad();  // Move the road lines for animation
    moveObstacles(); // Draw and move obstacles
    drawCar();   // Draw the car

    requestAnimationFrame(update);
}

// Key event listeners for car movement
function keyDown(e) {
    if (e.key === 'ArrowRight') {
        car.dx = car.speed;
    } else if (e.key === 'ArrowLeft') {
        car.dx = -car.speed;
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        car.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Initialize road lines, obstacles, and start the game loop
createRoadLines();
createObstacles();
update();

// Audio control
const carRadio = document.getElementById('carRadio');
let isPlaying = false;

document.getElementById('radioButton').addEventListener('click', () => {
    if (isPlaying) {
        carRadio.pause();
        document.getElementById('radioButton').textContent = 'Play radio music';
    } else {
        carRadio.play();
        document.getElementById('radioButton').textContent = 'Pause radio music';
    }
    isPlaying = !isPlaying;
});

// Restart button event listener
document.getElementById('restartButton').addEventListener('click', resetGame);
