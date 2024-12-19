document.getElementById('nom').addEventListener('click', () => {
    fetch('nombres.txt')
        .then(response => response.text())
        .then(data => {
            const names = data.split(/\\r?\\n/).filter(name => name.trim() !== '');
            initWheel(names);
            document.getElementById('tirar').disabled = false;
            alert('Noms carregats correctament!');
        })
        .catch(error => {
            console.error('Error carregant els noms:', error);
            alert('No s\'han pogut carregar els noms.');
        });
});

function initWheel(names) {
    const canvas = document.getElementById('ruleta');
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    const anglePerSlice = (2 * Math.PI) / names.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    names.forEach((name, i) => {
        const angle = i * anglePerSlice;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, angle, angle + anglePerSlice);
        ctx.fillStyle = i % 2 === 0 ? '#FFCC00' : '#FF9900';
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#333';
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(angle + anglePerSlice / 2);
        ctx.textAlign = 'right';
        ctx.fillText(name, radius - 10, 5);
        ctx.restore();
    });
}