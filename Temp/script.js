let interval;
let tempsRestant = 0;
let pausat = false;

// Actualitza l'hora actual
function mostrarHoraActual() {
    const ara = new Date();
    const hores = String(ara.getHours()).padStart(2, '0');
    const minuts = String(ara.getMinutes()).padStart(2, '0');
    const segons = String(ara.getSeconds()).padStart(2, '0');
    document.getElementById('hora-actual').textContent = `${hores}:${minuts}:${segons}`;
}
setInterval(mostrarHoraActual, 1000);

// Iniciar el temporitzador
function iniciarTemporitzador() {
    const horaFinal = document.getElementById("horaFinal").value;
    const durada = document.getElementById("durada").value;

    if (horaFinal) {
        const [h, m] = horaFinal.split(":");
        const horaFi = new Date();
        horaFi.setHours(h, m, 0);
        tempsRestant = (horaFi - new Date()) / 1000; // Temps en segons
    } else if (durada) {
        const [h, m, s] = durada.split(":").map(Number);
        tempsRestant = h * 3600 + m * 60 + s;
    }

    if (tempsRestant > 0) {
        if (!pausat) {
            executarCompteEnrere();
        }
        pausat = false;
    }
}

// Executar compte enrere
function executarCompteEnrere() {
    interval = setInterval(() => {
        if (tempsRestant <= 0) {
            clearInterval(interval);
            document.getElementById('temps-restant').textContent = "00:00:00";
            reproduirSo(); // Reproducir el so quan finalitza el temporitzador
        } else {
            tempsRestant--;
            const hores = String(Math.floor(tempsRestant / 3600)).padStart(2, '0');
            const minuts = String(Math.floor((tempsRestant % 3600) / 60)).padStart(2, '0');
            const segons = String(tempsRestant % 60).padStart(2, '0');
            document.getElementById('temps-restant').textContent = `${hores}:${minuts}:${segons}`;
        }
    }, 1000);
}

// Pausar temporitzador
function pausarTemporitzador() {
    clearInterval(interval);
    pausat = true;
}

// Reiniciar temporitzador
function reiniciarTemporitzador() {
    clearInterval(interval);
    tempsRestant = 0;
    document.getElementById('temps-restant').textContent = "00:00:00";
    pausat = false;
    mostrarHoraActual(); // Reiniciar la hora actual mostrada
}

// Reproduir so quan finalitza

function reproduirSo() {
    const soSeleccionat = document.getElementById('so').value;
    
    // Solo cambiar el sonido si es necesario
    switch (soSeleccionat) {
        case "sound1":
            soGlobal = new Audio("./beep1.mp3");
            break;
        case "sound2":
            soGlobal = new Audio("./beep2.mp3");
            break;
        case "sound3":
            soGlobal = new Audio("./beep3.mp3");
            break;
    }

    if (soGlobal) {
        soGlobal.play().catch(error => {
            alert("Error en reproduir l'àudio. Clica a la pàgina per provar-lo manualment.");
        });
    }
}

function detenerSonido() {
    if (soGlobal) {
        soGlobal.pause();  // Detener el sonido
        soGlobal.currentTime = 0;  // Volver al inicio del sonido
    }
}
