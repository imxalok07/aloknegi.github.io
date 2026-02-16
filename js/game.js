const track = document.getElementById('game-track');
const p1 = document.getElementById('p1');
const input = document.getElementById('ans-input');
const quesBox = document.getElementById('question');

let pullPos = 0, diff = 15, ans = 0, gameActive = false;
const WIN_LIMIT = 350;

let queuedLevel = 15;
function openGuide(level) {
    queuedLevel = level;
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('how-to-play').classList.remove('hidden');
}

function initGame() {
    // Hide guide
    document.getElementById('how-to-play').classList.add('hidden'); 
    
    // START AUDIO CONTEXT (REQUIRED)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    diff = queuedLevel; 
    document.getElementById('arena').classList.remove('hidden');
    document.getElementById('gameplay-ui').classList.remove('hidden');
    gameActive = true;
    p1.classList.add('pulling');
    
    if (typeof playMusic === "function") playMusic();
    
    newQ();
    gameLoop();
    setTimeout(() => input.focus(), 100);
}

function newQ() {
    let n1 = Math.floor(Math.random() * diff);
    let n2 = Math.floor(Math.random() * diff);
    ans = n1 + n2;
    quesBox.innerText = `${n1} + ${n2}`;
    input.value = '';
}

input.addEventListener('input', () => {
    if (parseInt(input.value) === ans) {
        if (typeof playInstrument === "function") playInstrument(1046.50, 0.2, 'sine', 0.2);
        pullPos -= 65; 
        newQ();
    }
});

function gameLoop() {
    if (!gameActive) return;
    // Faster speed logic as requested
    let enemySpeed = (diff === 15 ? 0.4 : diff === 50 ? 0.65 : 0.85);
    pullPos += enemySpeed;
    track.style.transform = `translateX(${-pullPos}px)`;
    if (pullPos < -WIN_LIMIT) endGame(true);
    if (pullPos > WIN_LIMIT) endGame(false);
    requestAnimationFrame(gameLoop); 
}

function endGame(win) {
    gameActive = false;
    if (musicLoop) clearInterval(musicLoop);
    document.getElementById('gameplay-ui').classList.add('hidden');
    document.getElementById('arena').style.opacity = "0.1";
    const res = document.getElementById('result-screen');
    if (win) {
        if (typeof playInstrument === "function") playInstrument(523.25, 0.2, 'square', 0.5);
        document.getElementById('res-msg').innerText = "VICTORY";
        document.getElementById('res-msg').style.color = "var(--blue)";
        document.getElementById('humor-msg').innerText = "Calculated Dominance.";
        document.getElementById('sticker-box').innerText = "🏆";
        p1.classList.add('victory-jump');
    } else {
        document.getElementById('res-msg').innerText = "DEFEAT";
        document.getElementById('res-msg').style.color = "#ff4757";
        document.getElementById('humor-msg').innerText = "You need to work on your maths.";
        document.getElementById('sticker-box').innerText = "📉";
    }
    res.classList.remove('hidden');
}