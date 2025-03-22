// survivalMode.js
// ============================
// CHAOS KEYBOARD BATTLE - SURVIVAL MODE
// ============================

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player setup
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    speed: 5,
    health: 100,
    score: 0,
    bullets: []
};

// Enemy setup
const enemies = [];
let wave = 1;
let enemySpawnRate = 2000; // Milliseconds

// Power-ups
const powerUps = [];

// Controls
const keys = {};

// Key events
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Function to create an enemy
function spawnEnemy() {
    const enemy = {
        x: Math.random() * (canvas.width - 50),
        y: -50,
        width: 50,
        height: 50,
        speed: Math.random() * 2 + 1, // Random speed
        health: 30 + wave * 5 // Increase enemy health per wave
    };
    enemies.push(enemy);
}

// Function to spawn power-ups
function spawnPowerUp() {
    const types = ["health", "shield", "speed", "bullet"];
    const type = types[Math.floor(Math.random() * types.length)];
    const powerUp = {
        x: Math.random() * (canvas.width - 30),
        y: Math.random() * (canvas.height - 30),
        width: 30,
        height: 30,
        type: type,
        active: true
    };
    powerUps.push(powerUp);
}

// Bullet shooting function
function shootBullet() {
    player.bullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 10,
        speed: 6
    });
}

// Collision detection
function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player movement
    if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;
    if (keys[" "] || keys["Enter"]) shootBullet();

    // Bullet movement
    player.bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) player.bullets.splice(index, 1);
    });

    // Enemy movement
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) enemies.splice(index, 1);

        // Check collision with player
        if (isColliding(player, enemy)) {
            player.health -= 10;
            enemies.splice(index, 1);
        }

        // Check collision with bullets
        player.bullets.forEach((bullet, bIndex) => {
            if (isColliding(bullet, enemy)) {
                enemy.health -= 20;
                player.bullets.splice(bIndex, 1);
                if (enemy.health <= 0) {
                    player.score += 10;
                    enemies.splice(index, 1);
                }
            }
        });
    });

    // Power-up collection
    powerUps.forEach((powerUp, index) => {
        if (isColliding(player, powerUp)) {
            if (powerUp.type === "health") player.health = Math.min(100, player.health + 20);
            if (powerUp.type === "shield") player.shield = true; // Implement shield effect
            if (powerUp.type === "speed") player.speed += 2;
            if (powerUp.type === "bullet") player.bullets.forEach(b => b.speed += 2);
            powerUps.splice(index, 1);
        }
    });

    // Drawing player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Drawing bullets
    ctx.fillStyle = "red";
    player.bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Drawing enemies
    ctx.fillStyle = "green";
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Drawing power-ups
    ctx.fillStyle = "yellow";
    powerUps.forEach(powerUp => {
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    });

    // UI - Health and Score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Health: ${player.health}`, 10, 30);
    ctx.fillText(`Score: ${player.score}`, 10, 60);
    ctx.fillText(`Wave: ${wave}`, 10, 90);

    // Game over condition
    if (player.health <= 0) {
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    requestAnimationFrame(update);
}

// Start the game loop
setInterval(spawnEnemy, enemySpawnRate);
setInterval(spawnPowerUp, 10000);
update();
