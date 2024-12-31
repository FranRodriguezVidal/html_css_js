// Seleccionamos la imagen y le añadimos un evento de clic
const giftImage = document.querySelector('img');

// Función para iniciar la animación
function animateGift() {
    // Agregamos una clase CSS para que la imagen se mueva suavemente
    giftImage.classList.add('shake');

    // Generamos confeti que forma un corazón antes de explotar
    generateHeartConfetti(giftImage);

    // Después de 5 segundos (5000 ms), redirigimos a otra página
    setTimeout(() => {
        window.location.href = 'https://franrodriguezvidal.github.io/'; // Cambia esta URL por la página de destino
    }, 5000);
}

// Escuchamos el clic en la imagen para disparar la animación
giftImage.addEventListener('click', animateGift);

// Generar confeti en forma de corazón antes de la explosión
function generateHeartConfetti(element) {
    const boxRect = element.getBoundingClientRect(); // Posición de la caja
    const body = document.body;
    const heartParticles = 300; // Número de partículas para el corazón

    for (let i = 0; i < heartParticles; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Posición inicial del confeti (alrededor de la caja)
        confetti.style.left = `${boxRect.left + boxRect.width / 2}px`;
        confetti.style.top = `${boxRect.top + boxRect.height / 2}px`;

        // Estilo dorado o de colores
        const isGold = Math.random() < 0.5; // 50% de probabilidad de ser dorado
        confetti.style.backgroundColor = isGold
            ? '#FFD700' // Dorado
            : `hsl(${Math.random() * 360}, 100%, 50%)`; // Colores aleatorios

        // Generar una forma aleatoria
        const shapes = ['circle', 'square', 'triangle', 'star', 'diamond'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        switch (shape) {
            case 'circle':
                confetti.style.borderRadius = '50%';
                break;
            case 'square':
                confetti.style.borderRadius = '0';
                break;
            case 'triangle':
                confetti.style.width = '0';
                confetti.style.height = '0';
                confetti.style.borderLeft = '7px solid transparent';
                confetti.style.borderRight = '7px solid transparent';
                confetti.style.borderBottom = `14px solid hsl(${Math.random() * 360}, 100%, 50%)`; // Colores aleatorios para el triángulo
                confetti.style.backgroundColor = 'transparent';
                break;
            case 'star':
                confetti.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
                break;
            case 'diamond':
                confetti.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
                break;
        }

        // Ajustar tamaños aleatorios
        const randomSize = Math.random() * 10 + 5; // Tamaños entre 5px y 15px
        if (shape !== 'triangle') {
            confetti.style.width = `${randomSize}px`;
            confetti.style.height = `${randomSize}px`;
        }

        // Calcular posición del confeti en forma de corazón usando una ecuación paramétrica
        const t = (Math.PI / heartParticles) * i * 2; // Distribución en el corazón
        const x = 16 * Math.pow(Math.sin(t), 3); // Ecuación de un corazón en X
        const y =
            -(
                13 * Math.cos(t) -
                5 * Math.cos(2 * t) -
                2 * Math.cos(3 * t) -
                Math.cos(4 * t)
            ); // Ecuación de un corazón en Y

        // Animación inicial para formar el corazón
        confetti.style.transition = `transform 1.5s ease-out`;
        body.appendChild(confetti);

        requestAnimationFrame(() => {
            confetti.style.transform = `translate(${x * 15}px, ${y * 15}px)`; // Escala del corazón
        });

        // Explosión después de formar el corazón
        setTimeout(() => {
            const randomX = (Math.random() - 0.5) * 3000; // Movimiento horizontal
            const randomY = (Math.random() - 0.5) * 1500; // Movimiento vertical
            confetti.style.transition = `transform 2s ease-out, opacity 2s`;
            confetti.style.transform = `translate(${randomX}px, ${randomY}px) scale(${Math.random() + 0.5})`;
            confetti.style.opacity = 0; // Desaparece gradualmente
        }, 1500);

        // Eliminamos el confeti después de la explosión
        setTimeout(() => {
            confetti.remove();
        }, 3500);
    }
}
