// ==========================================
// PISPHERE 3D ZOOM-OUT CROWD TO CLOUD MEETING PROMO
// Zero External Video Bandwidth • Pure HTML5 Canvas + WebAudio
// ==========================================

const PromoEngine = {
  canvas: null,
  ctx: null,
  particles: [],
  frame: 0,
  maxFrames: 420, // ~7 seconds smooth intro
  isPlaying: true,
  soundEnabled: true,
  audioCtx: null,

  init: function () {
    this.canvas = document.getElementById("promo-canvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());

    // Create 100 Global Pioneer Nodes zooming out from deep space into a Meeting Grid
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2 * 5;
      const radius = 300 + Math.random() * 600;
      this.particles.push({
        id: i,
        startX: Math.cos(angle) * radius,
        startY: Math.sin(angle) * radius,
        gridX: ((i % 10) - 4.5) * 32,
        gridY: (Math.floor(i / 10) - 4.5) * 32,
        color: i % 3 === 0 ? "#fbbf24" : i % 2 === 0 ? "#a855f7" : "#38bdf8",
        size: 3 + (i % 4)
      });
    }

    this.animate();
  },

  resize: function () {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  playChime: function () {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(528, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.4);
    } catch (e) {}
  },

  toggleSound: function () {
    this.soundEnabled = !this.soundEnabled;
    const icon = document.getElementById("promo-sound-icon");
    const text = document.getElementById("promo-sound-text");
    if (this.soundEnabled) {
      icon.className = "fa-solid fa-volume-high text-amber-400";
      text.innerText = "Sound ON";
      this.playChime();
    } else {
      icon.className = "fa-solid fa-volume-xmark text-gray-400";
      text.innerText = "Muted";
    }
  },

  animate: function () {
    if (!this.isPlaying) return;
    this.frame++;

    const progress = Math.min(1, this.frame / this.maxFrames);
    const progBar = document.getElementById("promo-progress");
    if (progBar) progBar.style.width = Math.floor(progress * 100) + "%";

    // Update dynamic promo captions
    const caption = document.getElementById("promo-caption");
    if (caption) {
      if (progress < 0.35) {
        caption.innerText = "1/3: Unzählige Pioneers zooming in from around the globe...";
      } else if (progress < 0.72) {
        caption.innerText = "2/3: Forming 100-User HD Cloud Meeting & Live Chat Grid...";
      } else {
        caption.innerText = "3/3: AI Meeting Summaries & Local Business Ads Powered by Pi!";
      }
    }

    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    this.ctx.fillStyle = "rgba(7, 4, 16, 0.28)";
    this.ctx.fillRect(0, 0, w, h);

    // Smooth ease-in-out convergence from scattered crowd to 10x10 Cloud Meeting Screen
    const ease = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    this.particles.forEach((p) => {
      const curX = cx + p.startX * (1 - ease) + p.gridX * ease;
      const curY = cy + p.startY * (1 - ease) + p.gridY * ease;

      // Draw glowing connection lines when converging
      if (ease > 0.4 && p.id % 5 === 0) {
        this.ctx.beginPath();
        this.ctx.moveTo(curX, curY);
        this.ctx.lineTo(cx, cy);
        this.ctx.strokeStyle = "rgba(168, 85, 247, 0.12)";
        this.ctx.stroke();
      }

      // Draw avatar node
      this.ctx.beginPath();
      this.ctx.arc(curX, curY, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    });

    if (this.frame >= this.maxFrames) {
      this.skipPromo();
      return;
    }

    requestAnimationFrame(() => this.animate());
  },

  skipPromo: function () {
    this.isPlaying = false;
    const overlay = document.getElementById("promo-overlay");
    if (overlay) {
      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.4s ease";
      setTimeout(() => {
        overlay.classList.add("hidden");
        AppShell.checkLegalConsent();
      }, 400);
    }
  }
};

window.addEventListener("DOMContentLoaded", () => {
  PromoEngine.init();
});

