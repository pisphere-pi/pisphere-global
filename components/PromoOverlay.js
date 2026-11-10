import React, { useEffect, useRef, useState } from "react";

const MULTI_LANG_TITLES = [
  "PiSphere • ग्लोबल क्लाउड",
  "PiSphere • Global Web3 Cloud",
  "PiSphere • 全球云会议生态",
  "PiSphere • سحابة عالمية",
  "PiSphere • Глобальное Облако"
];

export default function PromoOverlay({ onFinish }) {
  const canvasRef = useRef(null);
  const [titleIndex, setTitleIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const titleInterval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % MULTI_LANG_TITLES.length);
    }, 1000);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // 72 AI Human Face Nodes flying in and sticking onto a 3D Rotating Globe
    const faceNodes = Array.from({ length: 72 }, (_, i) => {
      const phi = Math.acos(-1 + (2 * i) / 72);
      const theta = Math.sqrt(72 * Math.PI) * phi;
      const startAngle = (i / 72) * Math.PI * 2 * 3;
      const startDist = 340 + (i % 5) * 90;
      return {
        id: i,
        sx: Math.cos(startAngle) * startDist,
        sy: Math.sin(startAngle) * startDist,
        phi,
        theta,
        skinColor: i % 3 === 0 ? "#fcd34d" : i % 2 === 0 ? "#fDBA74" : "#e9d5ff",
        ringColor: i % 2 === 0 ? "#e2be5a" : "#a855f7"
      };
    });

    let frame = 0;
    const maxFrames = 330; // ~5.5 seconds automatic intro
    let animId;

    const drawHumanAvatar = (x, y, radius, skin, ring) => {
      // Outer glowing avatar ring
      ctx.beginPath();
      ctx.arc(x, y, radius + 2, 0, Math.PI * 2);
      ctx.strokeStyle = ring;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Avatar circle background
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#18112c";
      ctx.fill();

      // AI Human Head
      ctx.beginPath();
      ctx.arc(x, y - radius * 0.22, radius * 0.36, 0, Math.PI * 2);
      ctx.fillStyle = skin;
      ctx.fill();

      // AI Human Shoulders
      ctx.beginPath();
      ctx.arc(x, y + radius * 0.65, radius * 0.55, Math.PI * 1.15, Math.PI * 1.85);
      ctx.fillStyle = skin;
      ctx.fill();
    };

    const render = () => {
      frame++;
      const p = Math.min(1, frame / maxFrames);
      setProgress(Math.floor(p * 100));

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2 - 20;
      const globeRadius = Math.min(w, h) * 0.29;

      ctx.fillStyle = "rgba(7, 4, 16, 0.38)";
      ctx.fillRect(0, 0, w, h);

      const ease = p < 0.45 ? 2 * p * p : 1;
      const rotY = frame * 0.022;

      // Draw 3D Wireframe Globe Latitude/Longitude Rings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = "rgba(226, 190, 90, 0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, globeRadius, 0, Math.PI * 2);
      ctx.stroke();

      for (let r = 1; r <= 3; r++) {
        ctx.beginPath();
        ctx.ellipse(0, 0, globeRadius * (r / 3), globeRadius, rotY * 0.3, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Project AI Human Faces sticking onto the rotating 3D Globe
      faceNodes.forEach((node) => {
        const gx3d = globeRadius * Math.sin(node.phi) * Math.cos(node.theta + rotY);
        const gy3d = globeRadius * Math.cos(node.phi);
        const gz3d = globeRadius * Math.sin(node.phi) * Math.sin(node.theta + rotY);

        const targetX = cx + gx3d;
        const targetY = cy + gy3d;

        const curX = cx + node.sx * (1 - ease) + (targetX - cx) * ease;
        const curY = cy + node.sy * (1 - ease) + (targetY - cy) * ease;

        // Depth scaling on 3D globe
        const depthScale = gz3d > 0 ? 1.15 : 0.65;
        if (gz3d > -globeRadius * 0.65 || ease < 0.8) {
          drawHumanAvatar(curX, curY, 6.5 * depthScale, node.skinColor, node.ringColor);
        }
      });

      if (frame >= maxFrames) {
        onFinish();
        return;
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      clearInterval(titleInterval);
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#070412] flex flex-col items-center justify-between p-6 select-none pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Top Status Pill */}
      <div className="relative z-10 pt-3">
        <div className="bg-purple-950/85 border border-[#e2be5a]/40 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#e2be5a] animate-ping" />
          <span className="text-[11px] font-bold tracking-wider text-[#f3d98b]">
            AI HUMAN GLOBAL CLOUD CONVERGENCE
          </span>
        </div>
      </div>

      {/* Center Rotating Globe Brand Projection */}
      <div className="relative z-10 text-center my-auto pt-36">
        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          Pi<span className="text-[#e2be5a]">Sphere</span>
        </h1>
        <p className="text-xs font-bold text-[#f3d98b] mt-1.5 bg-black/75 px-4 py-1.5 rounded-full border border-[#e2be5a]/40 transition-all">
          {MULTI_LANG_TITLES[titleIndex]}
        </p>
      </div>

      {/* Bottom Official Copyright Logo & Smooth Progress Bar */}
      <div className="relative z-10 w-full max-w-xs pb-3 flex flex-col items-center gap-2.5">
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className="soft-gold-btn h-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-2 bg-black/70 px-3.5 py-1.5 rounded-full border border-[#e2be5a]/30">
          <img src="/logo.png" alt="PiSphere Copyright Logo" className="w-5 h-5 rounded-full object-cover" />
          <span className="text-[10px] font-bold text-gray-300 tracking-wide">
            © 2026 PiSphere Official Brand • All Rights Reserved
          </span>
        </div>
      </div>
    </div>
  );
}
Displaying 1000467041.png. 
