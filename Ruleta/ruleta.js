let names = []; // Lista de nombres cargados
let rotationAngle = 0; // Ángulo actual de la ruleta

// Reproducir sonido de giro
const clickSound = new Audio('./sonidoRuleta.mp3');
clickSound.loop = true; // El sonido se repetirá mientras la ruleta gira

// Reproducir sonido al final
const finishSound = new Audio('./slot.mp3'); // Sonido de finalización

document.getElementById('nom').addEventListener('click', () => {
    // Cargar los nombres desde noms.txt
    fetch('nombres.txt')
        .then(response => response.text())
        .then(data => {
            names = data.split(/\r?\n/).filter(name => name.trim() !== '');
            drawWheel();
            document.getElementById('tirar').disabled = false;
        })
        .catch(error => {
            console.error('Error al cargar los nombres:', error);
            alert('No s\'han pogut carregar els noms.');
        });
});

document.getElementById('tirar').addEventListener('click', () => {
    spinWheel();
});

// Dibuja la rueda con los nombres
function drawWheel() {
    const canvas = document.getElementById('ruleta');
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    const totalNames = names.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const anglePerSlice = (2 * Math.PI) / totalNames;

    for (let i = 0; i < totalNames; i++) {
        const startAngle = i * anglePerSlice + rotationAngle;
        const endAngle = startAngle + anglePerSlice;

        // Dibujar segmento
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? '#A50044' : '#004D98'; // Colores alternos
        ctx.fill();
        ctx.stroke();

        // Dibujar texto
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(startAngle + anglePerSlice / 2);
        ctx.textAlign = 'right';
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText(names[i], radius - 10, 5);
        ctx.restore();
    }
}

function spinWheel() {
    // Reproducir sonido de giro
    clickSound.play();

    const spinTime = 4000; // Tiempo total de giro en milisegundos
    const totalRotation = Math.random() * 2 * Math.PI + 10 * Math.PI; // 10 vueltas + aleatorio
    const startTime = performance.now();

    function animateSpin(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / spinTime, 1);
        const easing = 1 - Math.pow(1 - progress, 3); // Efecto ease-out
        rotationAngle = totalRotation * easing;

        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            // Calcular el nombre seleccionado
            const totalNames = names.length;
            const anglePerSlice = (2 * Math.PI) / totalNames;
            const normalizedAngle = (2 * Math.PI - (rotationAngle % (2 * Math.PI))) % (2 * Math.PI);
            const selectedIndex = Math.floor(normalizedAngle / anglePerSlice) % totalNames;

            // Mostrar el nombre seleccionado
            document.getElementById('sort-nom').textContent = names[selectedIndex];

            // Detener el sonido del giro
            clickSound.pause();
            clickSound.currentTime = 0; // Reiniciar el sonido

            // Reproducir el sonido de finalización
            finishSound.play();
        }
    }

    requestAnimationFrame(animateSpin);
}
