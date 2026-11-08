/**
 * ĐẤU GIÁ KIẾN THỨC - CHINH PHỤC TÂY TIẾN
 * Pure JavaScript Game Logic & Web Audio API Engine
 */

// --- V. NGÂN HÀNG CÂU HỎI CHUẨN ---
const QUESTION_BANK = [
    {
        id: 1,
        category: "CÂU 1 – KHỞI ĐỘNG",
        question: "Bài thơ Tây Tiến được Quang Dũng sáng tác vào năm nào và tại đâu?",
        options: {
            A: "Năm 1945 tại Hà Nội.",
            B: "Năm 1948 tại Phù Lưu Chanh.",
            C: "Năm 1954 tại Điện Biên.",
            D: "Năm 1947 tại Tây Bắc."
        },
        answer: "B",
        explanation: "Tây Tiến được sáng tác năm 1948 tại Phù Lưu Chanh, khi Quang Dũng đã chuyển sang đơn vị khác và nhớ về đoàn quân Tây Tiến."
    },
    {
        id: 2,
        category: "CÂU 2 – KHÁM PHÁ",
        question: "Cụm từ \"nhớ chơi vơi\" trong khổ thơ đầu thể hiện điều gì?",
        options: {
            A: "Nỗi sợ hãi trước thiên nhiên Tây Bắc.",
            B: "Sự tiếc nuối về tuổi trẻ đã qua.",
            C: "Nỗi nhớ da diết, mênh mang về Tây Tiến.",
            D: "Sự vui mừng khi trở về quê hương."
        },
        answer: "C",
        explanation: "Cụm từ \"nhớ chơi vơi\" diễn tả nỗi nhớ sâu sắc, lan tỏa và bao trùm không gian, thời gian."
    },
    {
        id: 3,
        category: "CÂU 3 – TĂNG TỐC",
        question: "Trong khổ thơ thứ hai, hình ảnh \"Doanh trại bừng lên hội đuốc hoa\" gợi lên không khí nào?",
        options: {
            A: "Không khí chiến đấu căng thẳng, khốc liệt.",
            B: "Không khí tưng bừng, rực rỡ của đêm liên hoan văn nghệ.",
            C: "Không gian núi rừng lạnh lẽo, hoang vu.",
            D: "Nỗi buồn chia xa của người lính."
        },
        answer: "B",
        explanation: "Từ \"bừng lên\" kết hợp với hình ảnh \"hội đuốc hoa\" tạo nên không khí rực rỡ, ấm áp và vui tươi của đêm liên hoan."
    },
    {
        id: 4,
        category: "CÂU 4 – BỨT PHÁ",
        question: "Hình ảnh \"Áo bào thay chiếu anh về đất\" thể hiện vẻ đẹp nào của người lính Tây Tiến?",
        options: {
            A: "Vẻ đẹp bình dị, hồn nhiên.",
            B: "Vẻ đẹp bi tráng, sự hy sinh được thể hiện trang trọng và thiêng liêng.",
            C: "Vẻ đẹp lãng mạn trong tình yêu đôi lứa.",
            D: "Sự tiếc nuối trước cuộc sống hòa bình."
        },
        answer: "B",
        explanation: "Hình ảnh sử dụng cảm hứng lãng mạn để nâng sự hy sinh của người lính lên tầm vóc thiêng liêng, trang trọng."
    },
    {
        id: 5,
        category: "CÂU 5 – VỀ ĐÍCH",
        question: "Câu thơ \"Hồn về Sầm Nứa chẳng về xuôi\" thể hiện điều gì?",
        options: {
            A: "Người lính mong muốn trở về Hà Nội.",
            B: "Tâm hồn người lính vẫn gắn bó thủy chung với chiến trường Tây Bắc.",
            C: "Người lính không muốn tiếp tục hành quân.",
            D: "Nỗi nhớ về những ngày liên hoan văn nghệ."
        },
        answer: "B",
        explanation: "Câu thơ khẳng định tình cảm gắn bó sâu nặng, thủy chung của người lính với Tây Tiến và mảnh đất Tây Bắc."
    }
];

// --- HỆ THỐNG ÂM THANH SYNTHESIZER (WEB AUDIO API) ---
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.masterVolume = 0.7;
        this.bgmOsc = null;
        this.bgmTimer = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, type, duration, delay = 0) {
        if (this.isMuted || !this.ctx) return;
        setTimeout(() => {
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                gain.gain.setValueAtTime(this.masterVolume * 0.3, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {}
        }, delay);
    }

    playClick() { this.playTone(600, 'sine', 0.08); }
    playBid() { this.playTone(880, 'triangle', 0.15); }
    playQuestionIntro() {
        this.playTone(440, 'sine', 0.1, 0);
        this.playTone(554, 'sine', 0.1, 100);
        this.playTone(659, 'sine', 0.2, 200);
    }
    playTick() { this.playTone(1000, 'square', 0.04); }
    playCorrect() {
        this.playTone(523.25, 'triangle', 0.15, 0);
        this.playTone(659.25, 'triangle', 0.15, 120);
        this.playTone(783.99, 'triangle', 0.3, 240);
    }
    playWrong() {
        this.playTone(200, 'sawtooth', 0.2, 0);
        this.playTone(150, 'sawtooth', 0.3, 150);
    }
    playWin() {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            this.playTone(freq, 'triangle', 0.4, idx * 180);
        });
    }

    startBgm() {
        if (this.isMuted || this.bgmTimer) return;
        this.init();
        let step = 0;
        const notes = [261.63, 329.63, 392.00, 329.63];
        this.bgmTimer = setInterval(() => {
            if (this.isMuted) return;
            this.playTone(notes[step % notes.length], 'sine', 0.2);
            step++;
        }, 500);
    }

    stopBgm() {
        if (this.bgmTimer) {
            clearInterval(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

const sounds = new SoundEngine();

// --- GAME STATE MANAGEMENT ---
const state = {
    teams: [
        { id: 1, name: 'Đội 1', score: 100, currentBid: 0, lastResult: null },
        { id: 2, name: 'Đội 2', score: 100, currentBid: 0, lastResult: null },
        { id: 3, name: 'Đội 3', score: 100, currentBid: 0, lastResult: null }
    ],
    currentQIndex: 0,
    timerSeconds: 30,
    timerInterval: null
};

// --- DOM ELEMENTS ---
const screens = {
    welcome: document.getElementById('screen-welcome'),
    setup: document.getElementById('screen-setup'),
    bidding: document.getElementById('screen-bidding'),
    question: document.getElementById('screen-question'),
    result: document.getElementById('screen-result'),
    final: document.getElementById('screen-final')
};

const scoreboard = document.getElementById('game-scoreboard');

// --- APP INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    bindEvents();
});

function switchScreen(targetScreenKey) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[targetScreenKey].classList.add('active');

    if (targetScreenKey === 'welcome' || targetScreenKey === 'setup') {
        scoreboard.classList.add('hidden');
    } else {
        scoreboard.classList.remove('hidden');
        updateScoreboardDisplay();
    }
}

function bindEvents() {
    // Sound & Fullscreen controls
    document.getElementById('toggle-sound-btn').addEventListener('click', (e) => {
        sounds.init();
        sounds.isMuted = !sounds.isMuted;
        e.target.textContent = sounds.isMuted ? '🔇 Tắt Âm Thanh' : '🔊 Bật Âm Thanh';
        if (sounds.isMuted) sounds.stopBgm();
        else sounds.startBgm();
    });

    document.getElementById('volume-range').addEventListener('input', (e) => {
        sounds.masterVolume = parseFloat(e.target.value);
    });

    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    });

    // Screen 1 -> Screen 2
    document.getElementById('start-game-btn').addEventListener('click', () => {
        sounds.init();
        sounds.playClick();
        sounds.startBgm();
        switchScreen('setup');
    });

    // Screen 2 -> Screen 3
    document.getElementById('confirm-setup-btn').addEventListener('click', () => {
        sounds.playClick();
        state.teams[0].name = document.getElementById('team1-name').value.trim() || 'Đội 1';
        state.teams[1].name = document.getElementById('team2-name').value.trim() || 'Đội 2';
        state.teams[2].name = document.getElementById('team3-name').value.trim() || 'Đội 3';
        
        setupBiddingScreen();
        switchScreen('bidding');
    });

    // Screen 3 Bidding Actions
    document.querySelectorAll('.bid-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            sounds.playBid();
            const teamId = parseInt(e.target.dataset.team);
            const bidVal = parseInt(e.target.dataset.value);

            const team = state.teams.find(t => t.id === teamId);
            if (bidVal > team.score) {
                alert(`Đội ${team.name} chỉ có ${team.score} điểm, không thể cược ${bidVal} điểm!`); return; }  team.currentBid = bidVal;  // Highlight button const parent = document.getElementById(`bid-card-${teamId}`);
            parent.querySelectorAll('.bid-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');

            const status = document.getElementById(`bid-status-${teamId}`); status.textContent = `Đã cược ${bidVal} điểm`;
            status.classList.add('done');

            checkAllBidsConfirmed();
        });
    });

    document.getElementById('start-question-btn').addEventListener('click', () => {
        sounds.playQuestionIntro();
        loadQuestionScreen();
        switchScreen('question');
    });

    // Screen 4 -> Screen 5
    document.getElementById('show-answer-btn').addEventListener('click', () => {
        sounds.playClick();
        stopTimer();
        loadResultScreen();
        switchScreen('result');
    });

    // Screen 5 Referee Actions
    document.querySelectorAll('.btn-eval').forEach(btn => {
        btn.addEventListener('click', (e) => {
            sounds.playClick();
            const teamId = parseInt(e.target.dataset.team);
            const isCorrect = e.target.dataset.result === 'true';

            const team = state.teams.find(t => t.id === teamId);
            team.lastResult = isCorrect;

            const parent = e.target.closest('.eval-actions');
            parent.querySelectorAll('.btn-eval').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');

            checkAllEvaluationsDone();
        });
    });

    document.getElementById('next-question-btn').addEventListener('click', () => {
        sounds.playClick();
        // Calculate points
        state.teams.forEach(team => {
            if (team.lastResult === true) {
                team.score += team.currentBid;
                sounds.playCorrect();
            } else if (team.lastResult === false) {
                team.score -= team.currentBid;
                sounds.playWrong();
            }
            team.currentBid = 0;
            team.lastResult = null;
        });

        state.currentQIndex++;

        if (state.currentQIndex < QUESTION_BANK.length) {
            setupBiddingScreen();
            switchScreen('bidding');
        } else {
            loadFinalScreen();
            switchScreen('final');
        }
    });

    // Screen 6 -> Play Again
    document.getElementById('restart-game-btn').addEventListener('click', () => {
        sounds.playClick();
        state.teams.forEach(t => {
            t.score = 100;
            t.currentBid = 0;
            t.lastResult = null;
        });
        state.currentQIndex = 0;
        switchScreen('welcome');
    });
}

// --- LOGIC FUNCTIONS ---
function updateScoreboardDisplay() {
    document.getElementById('board-team1-name').textContent = state.teams[0].name;
    document.getElementById('board-team1-score').textContent = state.teams[0].score;
    document.getElementById('board-team1-bid').textContent = `Cược: ${state.teams[0].currentBid}`;  document.getElementById('board-team2-name').textContent = state.teams[1].name; document.getElementById('board-team2-score').textContent = state.teams[1].score; document.getElementById('board-team2-bid').textContent = `Cược: ${state.teams[1].currentBid}`;

    document.getElementById('board-team3-name').textContent = state.teams[2].name;
    document.getElementById('board-team3-score').textContent = state.teams[2].score;
    document.getElementById('board-team3-bid').textContent = `Cược: ${state.teams[2].currentBid}`;  document.getElementById('current-question-num').textContent = `CÂU ${state.currentQIndex + 1}`;
}

function setupBiddingScreen() {
    updateScoreboardDisplay();
    state.teams.forEach(team => {
        team.currentBid = 0;
        document.getElementById(`bid-t${team.id}-title`).textContent = team.name; const status = document.getElementById(`bid-status-${team.id}`);
        status.textContent = "Chưa đặt cược";
        status.classList.remove('done');

        const card = document.getElementById(`bid-card-${team.id}`); card.querySelectorAll('.bid-btn').forEach(btn => { btn.classList.remove('selected'); const bidVal = parseInt(btn.dataset.value); btn.disabled = (bidVal > team.score); }); });  const startBtn = document.getElementById('start-question-btn'); startBtn.disabled = true; startBtn.classList.add('disabled'); }  function checkAllBidsConfirmed() { const allDone = state.teams.every(t => t.currentBid > 0); const startBtn = document.getElementById('start-question-btn'); if (allDone) { startBtn.disabled = false; startBtn.classList.remove('disabled'); } }  function loadQuestionScreen() { updateScoreboardDisplay(); const q = QUESTION_BANK[state.currentQIndex]; document.getElementById('q-category').textContent = q.category; document.getElementById('q-text').textContent = q.question; document.getElementById('opt-a-text').textContent = q.options.A; document.getElementById('opt-b-text').textContent = q.options.B; document.getElementById('opt-c-text').textContent = q.options.C; document.getElementById('opt-d-text').textContent = q.options.D;  document.querySelectorAll('.answer-card').forEach(card => card.classList.remove('highlight-correct'));  startTimer(30); }  function startTimer(seconds) { stopTimer(); state.timerSeconds = seconds; const timerDisplay = document.getElementById('timer-display'); timerDisplay.textContent = state.timerSeconds; timerDisplay.classList.remove('warning');  state.timerInterval = setInterval(() => { state.timerSeconds--; timerDisplay.textContent = state.timerSeconds; sounds.playTick();  if (state.timerSeconds <= 5) { timerDisplay.classList.add('warning'); }  if (state.timerSeconds <= 0) { stopTimer(); } }, 1000); }  function stopTimer() { if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; } }  function loadResultScreen() { const q = QUESTION_BANK[state.currentQIndex]; document.getElementById('correct-opt-letter').textContent = q.answer; document.getElementById('correct-opt-text').textContent = q.options[q.answer]; document.getElementById('explanation-text').textContent = q.explanation;  // Set referee names & bids state.teams.forEach(team => { document.getElementById(`eval-t${team.id}-name`).textContent = team.name;
        document.getElementById(`eval-t${team.id}-bid`).textContent = team.currentBid;  const card = document.querySelector(`.btn-eval[data-team="${team.id}"]`).closest('.eval-actions');
        card.querySelectorAll('.btn-eval').forEach(b => b.classList.remove('selected'));
    });

    const nextBtn = document.getElementById('next-question-btn');
    nextBtn.disabled = true;
    nextBtn.classList.add('disabled');
}

function checkAllEvaluationsDone() {
    const allEvaluated = state.teams.every(t => t.lastResult !== null);
    const nextBtn = document.getElementById('next-question-btn');
    if (allEvaluated) {
        nextBtn.disabled = false;
        nextBtn.classList.remove('disabled');
    }
}

function loadFinalScreen() {
    sounds.stopBgm();
    sounds.playWin();
    startFireworks();

    const sortedTeams = [...state.teams].sort((a, b) => b.score - a.score);
    const winner = sortedTeams[0];

    document.getElementById('winner-name-display').textContent = `${winner.name} (${winner.score} ĐIỂM)`;

    const ranksContainer = document.getElementById('final-ranks-list');
    ranksContainer.innerHTML = '';

    sortedTeams.forEach((team, idx) => {
        const row = document.createElement('div');
        row.className = `rank-row rank-${idx + 1}`;
        row.innerHTML = `
            <span>HẠNG ${idx + 1}:${team.name}</span>
            <span>${team.score} ĐIỂM</span>
        `;
        ranksContainer.appendChild(row);
    });
}

// --- CANVA FIREWORKS EFFECT ---
function startFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const particles = [];
    const colors = ['#ffd700', '#ef4444', '#3b82f6', '#10b981', '#ffffff'];

    function createParticle(x, y) {
        for (let i = 0; i < 30; i++) {
            particles.push({
                x: x,
                y: y,
                dx: (Math.random() - 0.5) * 8,
                dy: (Math.random() - 0.5) * 8,
                radius: Math.random() * 3 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: Math.random() * 0.02 + 0.015
            });
        }
    }

    let interval = setInterval(() => {
        createParticle(
            Math.random() * canvas.width,
            Math.random() * (canvas.height * 0.6)
        );
    }, 400);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, index) => {
            p.x += p.dx;
            p.y += p.dy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                particles.splice(index, 1);
            } else {
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.restore();
            }
        });

        if (document.getElementById('screen-final').classList.contains('active')) {
            requestAnimationFrame(animate);
        } else {
            clearInterval(interval);
        }
    }

    animate();
}