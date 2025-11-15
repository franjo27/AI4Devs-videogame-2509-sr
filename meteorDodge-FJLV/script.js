// ===== CONFIGURACIÓN DEL CANVAS =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ===== VARIABLES DEL JUEGO =====
let gameState = 'ready'; // Estados: 'ready', 'playing', 'gameOver'
let score = 0;
let level = 1;
let gameTime = 0;
let lastTime = 0;
let animationId;

// ===== CONFIGURACIÓN DE LA NAVE =====
const spaceship = {
    width: 60,
    height: 80,
    x: canvas.width / 2 - 30,
    y: canvas.height - 100,
    speed: 6,
    dx: 0, // Velocidad horizontal
    color: '#4d96ff'
};

// ===== ARRAY DE METEORITOS =====
let meteors = [];

// ===== CONFIGURACIÓN DE METEORITOS =====
const meteorConfig = {
    minSize: 30,
    maxSize: 60,
    minSpeed: 2,
    maxSpeed: 4,
    spawnInterval: 1000, // Milisegundos entre spawns
    lastSpawn: 0
};

// ===== ELEMENTOS DEL DOM =====
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const playAgainButton = document.getElementById('playAgainButton');
const gameOverScreen = document.getElementById('gameOverScreen');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const timeDisplay = document.getElementById('time');
const finalScore = document.getElementById('finalScore');
const finalTime = document.getElementById('finalTime');
const finalLevel = document.getElementById('finalLevel');

// ===== CONTROL DE TECLAS =====
const keys = {
    left: false,
    right: false
};

// ===== EVENT LISTENERS PARA TECLADO =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keys.left = true;
        e.preventDefault();
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keys.right = true;
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keys.left = false;
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keys.right = false;
    }
});

// ===== EVENT LISTENERS PARA BOTONES =====
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    startGame();
});

// ===== FUNCIÓN: DIBUJAR NAVE =====
function drawSpaceship() {
    // Cuerpo principal de la nave
    ctx.fillStyle = spaceship.color;
    ctx.beginPath();
    ctx.moveTo(spaceship.x + spaceship.width / 2, spaceship.y); // Punta superior
    ctx.lineTo(spaceship.x, spaceship.y + spaceship.height); // Esquina inferior izquierda
    ctx.lineTo(spaceship.x + spaceship.width, spaceship.y + spaceship.height); // Esquina inferior derecha
    ctx.closePath();
    ctx.fill();

    // Ventana de la nave
    ctx.fillStyle = '#6bc5ff';
    ctx.beginPath();
    ctx.arc(spaceship.x + spaceship.width / 2, spaceship.y + 30, 12, 0, Math.PI * 2);
    ctx.fill();

    // Alas laterales
    ctx.fillStyle = '#3a7bc8';
    // Ala izquierda
    ctx.beginPath();
    ctx.moveTo(spaceship.x, spaceship.y + spaceship.height - 20);
    ctx.lineTo(spaceship.x - 15, spaceship.y + spaceship.height);
    ctx.lineTo(spaceship.x, spaceship.y + spaceship.height);
    ctx.closePath();
    ctx.fill();
    // Ala derecha
    ctx.beginPath();
    ctx.moveTo(spaceship.x + spaceship.width, spaceship.y + spaceship.height - 20);
    ctx.lineTo(spaceship.x + spaceship.width + 15, spaceship.y + spaceship.height);
    ctx.lineTo(spaceship.x + spaceship.width, spaceship.y + spaceship.height);
    ctx.closePath();
    ctx.fill();

    // Efecto de propulsión
    const flameHeight = 15 + Math.random() * 10;
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.moveTo(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height);
    ctx.lineTo(spaceship.x + spaceship.width / 2 - 8, spaceship.y + spaceship.height + flameHeight);
    ctx.lineTo(spaceship.x + spaceship.width / 2 + 8, spaceship.y + spaceship.height + flameHeight);
    ctx.closePath();
    ctx.fill();

    // Llama interna (amarilla)
    ctx.fillStyle = '#ffd93d';
    ctx.beginPath();
    ctx.moveTo(spaceship.x + spaceship.width / 2, spaceship.y + spaceship.height);
    ctx.lineTo(spaceship.x + spaceship.width / 2 - 5, spaceship.y + spaceship.height + flameHeight - 5);
    ctx.lineTo(spaceship.x + spaceship.width / 2 + 5, spaceship.y + spaceship.height + flameHeight - 5);
    ctx.closePath();
    ctx.fill();
}

// ===== FUNCIÓN: MOVER NAVE =====
function moveSpaceship() {
    // Calcular dirección
    spaceship.dx = 0;
    if (keys.left) spaceship.dx = -spaceship.speed;
    if (keys.right) spaceship.dx = spaceship.speed;

    // Actualizar posición
    spaceship.x += spaceship.dx;

    // Límites del canvas
    if (spaceship.x < 0) spaceship.x = 0;
    if (spaceship.x + spaceship.width > canvas.width) {
        spaceship.x = canvas.width - spaceship.width;
    }
}

// ===== FUNCIÓN: CREAR METEORITO =====
function createMeteor() {
    const size = Math.random() * (meteorConfig.maxSize - meteorConfig.minSize) + meteorConfig.minSize;
    const meteor = {
        x: Math.random() * (canvas.width - size),
        y: -size,
        size: size,
        speed: Math.random() * (meteorConfig.maxSpeed - meteorConfig.minSpeed) + meteorConfig.minSpeed,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        color: `hsl(${Math.random() * 60 + 10}, 70%, 50%)` // Tonos naranjas/rojos
    };
    meteors.push(meteor);
}

// ===== FUNCIÓN: DIBUJAR METEORITO =====
function drawMeteor(meteor) {
    ctx.save();
    ctx.translate(meteor.x + meteor.size / 2, meteor.y + meteor.size / 2);
    ctx.rotate(meteor.rotation);

    // Cuerpo del meteorito (irregular)
    ctx.fillStyle = meteor.color;
    ctx.beginPath();
    const points = 8;
    for (let i = 0; i < points; i++) {
        const angle = (Math.PI * 2 / points) * i;
        const radius = meteor.size / 2 * (0.7 + Math.random() * 0.3);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fill();

    // Detalles (cráteres)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    for (let i = 0; i < 3; i++) {
        const craterX = (Math.random() - 0.5) * meteor.size * 0.5;
        const craterY = (Math.random() - 0.5) * meteor.size * 0.5;
        const craterSize = Math.random() * meteor.size * 0.15;
        ctx.beginPath();
        ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

// ===== FUNCIÓN: ACTUALIZAR METEORITOS =====
function updateMeteors(deltaTime) {
    // Generar nuevos meteoritos
    if (Date.now() - meteorConfig.lastSpawn > meteorConfig.spawnInterval) {
        createMeteor();
        meteorConfig.lastSpawn = Date.now();
    }

    // Actualizar posición y rotación de meteoritos existentes
    for (let i = meteors.length - 1; i >= 0; i--) {
        meteors[i].y += meteors[i].speed;
        meteors[i].rotation += meteors[i].rotationSpeed;

        // Eliminar meteoritos que salieron de la pantalla
        if (meteors[i].y > canvas.height + meteors[i].size) {
            meteors.splice(i, 1);
            // Aumentar puntaje por esquivar
            score += 5;
            updateScore();
        }
    }
}

// ===== FUNCIÓN: DETECTAR COLISIÓN =====
function checkCollision() {
    for (let meteor of meteors) {
        // Colisión simplificada: círculo del meteorito vs triángulo de la nave
        const meteorCenterX = meteor.x + meteor.size / 2;
        const meteorCenterY = meteor.y + meteor.size / 2;
        const meteorRadius = meteor.size / 2;

        // Puntos críticos de la nave (triángulo)
        const shipTipX = spaceship.x + spaceship.width / 2;
        const shipTipY = spaceship.y;
        const shipBottomY = spaceship.y + spaceship.height;
        const shipLeftX = spaceship.x;
        const shipRightX = spaceship.x + spaceship.width;

        // Verificar si el centro del meteorito está dentro del área de la nave
        if (meteorCenterY + meteorRadius > shipTipY &&
            meteorCenterY - meteorRadius < shipBottomY &&
            meteorCenterX + meteorRadius > shipLeftX &&
            meteorCenterX - meteorRadius < shipRightX) {
            
            // Colisión más precisa: verificar distancia a la forma triangular
            const distToTip = Math.sqrt(
                Math.pow(meteorCenterX - shipTipX, 2) + 
                Math.pow(meteorCenterY - shipTipY, 2)
            );

            if (distToTip < meteorRadius + 20 || 
                (meteorCenterY > shipTipY + 20 && 
                 meteorCenterX > shipLeftX && 
                 meteorCenterX < shipRightX)) {
                return true;
            }
        }
    }
    return false;
}

// ===== FUNCIÓN: DIBUJAR FONDO CON ESTRELLAS =====
const stars = [];
for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.2
    });
}

function drawBackground() {
    // Fondo oscuro
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Estrellas
    ctx.fillStyle = '#ffffff';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Mover estrellas hacia abajo
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

// ===== FUNCIÓN: ACTUALIZAR PUNTAJE Y NIVEL =====
function updateScore() {
    scoreDisplay.textContent = score;
    
    // Calcular nivel basado en puntaje
    const newLevel = Math.floor(score / 100) + 1;
    if (newLevel > level) {
        level = newLevel;
        levelDisplay.textContent = level;
        increaseDifficulty();
    }
}

// ===== FUNCIÓN: AUMENTAR DIFICULTAD =====
function increaseDifficulty() {
    // Aumentar velocidad de meteoritos
    meteorConfig.minSpeed += 0.3;
    meteorConfig.maxSpeed += 0.5;
    
    // Reducir intervalo de spawn (más meteoritos)
    meteorConfig.spawnInterval = Math.max(400, meteorConfig.spawnInterval - 100);
    
    // Aumentar tamaño máximo de meteoritos
    meteorConfig.maxSize = Math.min(80, meteorConfig.maxSize + 5);
}

// ===== FUNCIÓN: ACTUALIZAR TIEMPO =====
function updateTime() {
    const seconds = Math.floor(gameTime / 1000);
    timeDisplay.textContent = seconds + 's';
    // Añadir puntos por tiempo sobrevivido
    if (seconds > 0 && seconds % 5 === 0 && gameTime % 1000 < 20) {
        score += 10;
        updateScore();
    }
}

// ===== FUNCIÓN: GAME OVER =====
function gameOver() {
    gameState = 'gameOver';
    cancelAnimationFrame(animationId);

    // Mostrar estadísticas finales
    finalScore.textContent = score;
    finalTime.textContent = Math.floor(gameTime / 1000) + 's';
    finalLevel.textContent = level;

    // Mostrar pantalla de Game Over
    gameOverScreen.style.display = 'flex';
}

// ===== FUNCIÓN: INICIAR JUEGO =====
function startGame() {
    // Reset de variables
    gameState = 'playing';
    score = 0;
    level = 1;
    gameTime = 0;
    lastTime = performance.now();
    meteors = [];
    
    // Reset configuración de meteoritos
    meteorConfig.minSpeed = 2;
    meteorConfig.maxSpeed = 4;
    meteorConfig.spawnInterval = 1000;
    meteorConfig.lastSpawn = Date.now();
    meteorConfig.maxSize = 60;

    // Reset posición de la nave
    spaceship.x = canvas.width / 2 - spaceship.width / 2;
    spaceship.y = canvas.height - 100;
    spaceship.dx = 0;

    // Actualizar UI
    updateScore();
    levelDisplay.textContent = level;
    timeDisplay.textContent = '0s';

    // Ocultar botones
    startButton.style.display = 'none';
    restartButton.style.display = 'inline-block';
    gameOverScreen.style.display = 'none';

    // Iniciar loop del juego
    gameLoop();
}

// ===== FUNCIÓN: LOOP PRINCIPAL DEL JUEGO =====
function gameLoop(currentTime = 0) {
    if (gameState !== 'playing') return;

    // Calcular delta time
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    gameTime += deltaTime;

    // Limpiar canvas y dibujar fondo
    drawBackground();

    // Actualizar y dibujar meteoritos
    updateMeteors(deltaTime);
    meteors.forEach(meteor => drawMeteor(meteor));

    // Mover y dibujar nave
    moveSpaceship();
    drawSpaceship();

    // Actualizar tiempo
    updateTime();

    // Verificar colisiones
    if (checkCollision()) {
        gameOver();
        return;
    }

    // Continuar el loop
    animationId = requestAnimationFrame(gameLoop);
}

// ===== INICIALIZACIÓN =====
// Dibujar estado inicial
drawBackground();
spaceship.x = canvas.width / 2 - spaceship.width / 2;
drawSpaceship();
