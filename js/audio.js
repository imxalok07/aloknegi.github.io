const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let musicMuted = false;
let soundMuted = false;
let musicLoop = null;

const melody = [329.63, 392.00, 523.25, 493.88, 440.00, 392.00, 349.23, 392.00]; 
const bass = [130.81, 196.00, 220.00, 174.61]; 

function toggleMusic() {
    musicMuted = !musicMuted;
    document.getElementById('music-btn').classList.toggle('muted', musicMuted);
    if (musicMuted) {
        if (musicLoop) clearInterval(musicLoop);
    } else {
        if (typeof playMusic === "function") playMusic();
    }
}

function toggleSound() {
    soundMuted = !soundMuted;
    document.getElementById('sound-btn').classList.toggle('muted', soundMuted);
}

function playInstrument(freq, vol, type, duration, isMusic = false) {
    if (isMusic && musicMuted) return;
    if (!isMusic && soundMuted) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
}

function playMusic() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (musicLoop) clearInterval(musicLoop);
    let step = 0;
    musicLoop = setInterval(() => {
        if(!gameActive) return;
        playInstrument(melody[step % melody.length], 0.08, 'square', 0.2, true);
        if (step % 2 === 0) playInstrument(bass[Math.floor(step / 2) % bass.length], 0.15, 'triangle', 0.4, true);
        step++;
    }, 300);
}