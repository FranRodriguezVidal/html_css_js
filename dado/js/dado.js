// Referencias al cubo y botones
const cube = document.querySelector('.cube');
const autoBtn = document.getElementById('auto-btn');
const manualBtn = document.getElementById('manual-btn');
const diceBtn = document.getElementById('dice-btn');

// Variables para control manual
let isDragging = false;
let startX, startY;
let currentX = 0, currentY = 0;

// Modo Automático (por defecto)
autoBtn.addEventListener('click', () => {
    cube.style.animation = 'spin 5s infinite linear';
    cube.style.transition = 'transform 0.5s ease-in-out';
    cube.style.cursor = 'grab';

    cube.removeEventListener('mousedown', startDrag);
    cube.removeEventListener('mousemove', drag);
    cube.removeEventListener('mouseup', stopDrag);
    cube.removeEventListener('mouseleave', stopDrag);
});

// Modo Manual
manualBtn.addEventListener('click', () => {
    cube.style.animation = 'none';
    cube.style.cursor = 'grab';
    cube.style.transition = 'transform 0.5s ease-in-out';

    cube.addEventListener('mousedown', startDrag);
    cube.addEventListener('mousemove', drag);
    cube.addEventListener('mouseup', stopDrag);
    cube.addEventListener('mouseleave', stopDrag);
});

// Botón "Lanzar Dado"
diceBtn.addEventListener('click', () => {
    cube.style.animation = 'none';
    cube.style.transition = 'transform 1s ease-in-out';

    // Rotaciones específicas para las caras del dado
    const dicePositions = [
        { x: 0, y: 0 },      // Cara 1
        { x: -90, y: 0 },    // Cara 2
        { x: 0, y: 90 },     // Cara 3
        { x: 0, y: -90 },    // Cara 4
        { x: 90, y: 0 },     // Cara 5
        { x: -180, y: 0 }    // Cara 6
    ];

    // Seleccionar una posición aleatoria
    const randomIndex = Math.floor(Math.random() * dicePositions.length);
    const { x, y } = dicePositions[randomIndex];

    // Aplicar la rotación
    currentX = y;
    currentY = x;
    cube.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
});

// Inicia el arrastre
function startDrag(event) {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
}

// Control del arrastre
function drag(event) {
    if (!isDragging) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    currentX += deltaX * 0.5;
    currentY -= deltaY * 0.5;

    cube.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg)`;

    startX = event.clientX;
    startY = event.clientY;
}

// Finaliza el arrastre
function stopDrag() {
    isDragging = false;
}
