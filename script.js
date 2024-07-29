const maxComida = 100;
const comidaIncremento = 1;
const ethereumIncremento = 0.0000001; // Incremento de Ethereum por comida
const ethereumInviteIncrement = 0.0000100; // Incremento de Ethereum por invitación
const tiempoMaximo = 5 * 60 * 60 * 1000; // 5 horas en milisegundos
const tiempoInvitaciones = 48 * 60 * 60 * 1000; // 48 horas en milisegundos
const tiempoAnimacion = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

let barComida = 0;
let ethereumBalance = 0.0000;
let ultimaInteraccion = new Date().getTime();
let ultimaInvitacion = new Date().getTime();
let ultimaAnimacion = new Date().getTime();
let invitaciones = 0;
let hambre = true;
let nivel = 1;

const foodBar = document.getElementById('food-bar');
const foodLabel = document.getElementById('food-label');
const ethereumLabel = document.getElementById('ethereum-label');
const timerLabel = document.getElementById('timer');
const tapButton = document.getElementById('tap-button');
const inviteButton = document.getElementById('invite-friends');
const linkMetaMaskButton = document.getElementById('link-metamask');
const catImage = document.getElementById('cat');
const foodIcon = document.getElementById('food-icon');
const hungryIcon = document.getElementById('hungry-icon');
const gameBackground = document.getElementById('game-background');
const levelUpMessage = document.getElementById('level-up-message');

// Función para cargar el progreso del juego
function loadGame() {
    const savedData = localStorage.getItem('gameData');
    if (savedData) {
        const data = JSON.parse(savedData);
        barComida = data.barComida || 0;
        ethereumBalance = data.ethereumBalance || 0.0000;
        ultimaInteraccion = data.ultimaInteraccion || new Date().getTime();
        ultimaInvitacion = data.ultimaInvitacion || new Date().getTime();
        ultimaAnimacion = data.ultimaAnimacion || new Date().getTime();
        invitaciones = data.invitaciones || 0;
        hambre = data.hambre || true;
        nivel = data.nivel || 1;
        updateUI();
    }
}

// Función para guardar el progreso del juego
function saveGame() {
    const gameData = {
        barComida,
        ethereumBalance,
        ultimaInteraccion,
        ultimaInvitacion,
        ultimaAnimacion,
        invitaciones,
        hambre,
        nivel
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

function tocarPantalla() {
    if (hambre) {
        barComida += comidaIncremento;
        ethereumBalance += ethereumIncremento;
        ultimaInteraccion = new Date().getTime();
        animateCat();
        checkLevelUp();
        updateUI();
        saveGame(); // Guardar el progreso después de tocar
    }
}

function animateCat() {
    catImage.classList.add('feed-animation');
    setTimeout(() => {
        catImage.classList.remove('feed-animation');
    }, 1000); // Duración de la animación
}

function checkLevelUp() {
    // Verificar si se ha alcanzado un nuevo nivel
    const nuevoNivel = Math.floor(barComida / maxComida) + 1;
    if (nuevoNivel > nivel) {
        nivel = nuevoNivel;
        showLevelUpMessage();
    }
}

function showLevelUpMessage() {
    levelUpMessage.textContent = `¡Tu gato ha alcanzado el nivel ${nivel}!`;
    levelUpMessage.style.display = 'block';
    setTimeout(() => {
        levelUpMessage.style.display = 'none';
    }, 6000); // El mensaje se oculta después de 6 segundos
}

function updateUI() {
    const comidaPercent = (barComida / maxComida) * 100;
    foodBar.style.width = `${comidaPercent}%`;
    foodLabel.textContent = `Comida: ${comidaPercent.toFixed(2)}%`;
    ethereumLabel.textContent = `Ethereum: ${ethereumBalance.toFixed(7)}`;
    
    if (barComida >= maxComida) {
        hambre = false;
        foodBar.style.width = '100%';
        gameBackground.style.backgroundColor = '#d3d3d3'; // Fondo gris
        foodIcon.style.display = 'none'; // Ocultar icono de comida
        hungryIcon.style.display = 'block'; // Mostrar icono de hambre
    } else {
        hambre = true;
        gameBackground.style.backgroundColor = '#87CEEB'; // Fondo azul
        foodIcon.style.display = 'block'; // Mostrar icono de comida
        hungryIcon.style.display = 'none'; // Ocultar icono de hambre
    }
    saveGame(); // Guardar el progreso después de actualizar la UI
}

function updateTemporizador() {
    const tiempoActual = new Date().getTime();
    const tiempoDesdeUltimaInteraccion = tiempoActual - ultimaInteraccion;
    const tiempoDesdeUltimaAnimacion = tiempoActual - ultimaAnimacion;

    // Controlar la aparición del icono de hambre
    if (tiempoDesdeUltimaInteraccion >= tiempoMaximo && barComida >= maxComida) {
        // Solo reiniciar la comida si ha pasado más de 24 horas
        if (tiempoDesdeUltimaInteraccion >= tiempoAnimacion) {
            barComida = 0;
            hambre = true;
            updateUI();
        }
    }

    // Controlar la animación del gato
    if (tiempoDesdeUltimaAnimacion >= tiempoAnimacion) {
        catImage.classList.add('feed-animation');
        setTimeout(() => {
            catImage.classList.remove('feed-animation');
        }, 1000); // Duración de la animación
        ultimaAnimacion = tiempoActual; // Resetear el tiempo de animación
    }

    const horas = Math.floor(tiempoDesdeUltimaInteraccion / 3600000);
    const minutos = Math.floor((tiempoDesdeUltimaInteraccion % 3600000) / 60000);
    const segundos = Math.floor((tiempoDesdeUltimaInteraccion % 60000) / 1000);
    const tiempoFormateado = `${pad(horas)}:${pad(minutos)}:${pad(segundos)}`;
    timerLabel.textContent = `Temporizador: ${tiempoFormateado}`;
}

function pad(num) {
    return num < 10 ? '0' + num : num;
}

function startTimer() {
    setInterval(updateTemporizador, 1000);
}

function inviteFriends() {
    const tiempoDesdeUltimaInvitacion = new Date().getTime() - ultimaInvitacion;
    
    if (tiempoDesdeUltimaInvitacion < tiempoInvitaciones && invitaciones >= 5) {
        alert("Has alcanzado el límite de invitaciones. Vuelve en 48 horas para invitar a más amigos.");
        return;
    }

    const url = `https://t.me/share/url?url=https://t.me/Catpopy_bot`;
    window.open(url, '_blank');

    if (tiempoDesdeUltimaInvitacion >= tiempoInvitaciones) {
        invitaciones = 0;
    }
    invitaciones++;
    ethereumBalance += ethereumInviteIncrement;
    ultimaInvitacion = new Date().getTime();
    ethereumLabel.textContent = `Ethereum: ${ethereumBalance.toFixed(7)}`;
    saveGame(); // Guardar el progreso después de invitar
}

function linkMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        // Invita A Tu Amigo Y gana 
        window.open('https://t.me/enlasminer', '_blank');
        return;
    }

    // Solicitar al usuario que se conecte con MetaMask
    ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
            // Guardar la cuenta vinculada (si es necesario)
            alert(`Cuenta vinculada: ${accounts[0]}`);
        })
        .catch(error => {
            console.error(error);
        });
}

// Añadir eventos a los botones
tapButton.addEventListener('click', tocarPantalla);
inviteButton.addEventListener('click', inviteFriends);
linkMetaMaskButton.addEventListener('click', linkMetaMask);

// Iniciar el temporizador y cargar el progreso del juego
startTimer();
loadGame();