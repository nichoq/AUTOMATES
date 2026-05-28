import React, { useRef, useEffect } from "react";
import { DFAConfig } from "../types";

interface DfaCanvasProps {
  dfa: DFAConfig;
  tabIdx: number;
  activeState: number;
  path: number[];
  stepIdx: number;
}

export const DfaCanvas: React.FC<DfaCanvasProps> = ({
  dfa,
  tabIdx,
  activeState,
  path,
  stepIdx,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const lastTabRef = useRef<number>(tabIdx);
  const lastDfaRef = useRef<DFAConfig>(dfa);
  const currentXRef = useRef<number | null>(null);
  const currentYRef = useRef<number | null>(null);

  // Helper to determine background colors
  const getNodeColor = (id: number, current: number) => {
    if (id === current) return "#4f46e5"; // Active accent (indigo)
    if (dfa.ACC.has(id)) return "#d1fae5"; // Accept green
    if (dfa.dead.has(id)) return "#fee2e2"; // Trap red
    if (id === dfa.START) return "#e0e7ff"; // Start light indigo
    return "#f8fafc"; // Default slate
  };

  // Helper to determine border colors
  const getBorderColor = (id: number, current: number) => {
    if (id === current) return "#4338ca";
    if (dfa.ACC.has(id)) return "#059669";
    if (dfa.dead.has(id)) return "#dc2626";
    if (id === dfa.START) return "#4f46e5";
    return "#cbd5e1";
  };

  // Check if a transition between two states is active in the current path
  const isEdgeActive = (from: number, to: number): boolean => {
    if (path.length < 2) return false;
    for (let i = 0; i < stepIdx; i++) {
      if (path[i] === from && path[i + 1] === to) {
        return true;
      }
    }
    return false;
  };

  const getEdgeColor = (from: number, to: number) => {
    return isEdgeActive(from, to) ? "#4f46e5" : "#cbd5e1";
  };

  const getEdgeWidth = (from: number, to: number) => {
    return isEdgeActive(from, to) ? 4.5 : 2.2;
  };

  useEffect(() => {
    if (lastTabRef.current !== tabIdx || lastDfaRef.current !== dfa) {
      currentXRef.current = null;
      currentYRef.current = null;
      lastTabRef.current = tabIdx;
      lastDfaRef.current = dfa;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || dfa.W;
    const height = rect.height || dfa.H;

    // Support high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Determine scale and offset to center the DFA using exact coordinates bounding box (magnifying and centering perfectly!)
    const xCoords = dfa.pos.map(p => p[0]);
    const yCoords = dfa.pos.map(p => p[1]);
    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);

    const dfaWidth = maxX - minX || 1;
    const dfaHeight = maxY - minY || 1;

    // Use a comfortable padding to make DFA fill the screen beautifully and fit nicely
    const paddingX = 75;
    const paddingY = 75;

    let scale = Math.min(
      (width - paddingX * 2) / dfaWidth,
      (height - paddingY * 2) / dfaHeight,
      1.25 // Slightly lower max scale to make it nice and smaller
    );

    // Ensure it scales correctly on different containers
    if (scale < 0.6) scale = 0.6;
    if (scale > 1.25) scale = 1.25;

    // Center the exact bounding box in the center of the canvas
    const boundCenterX = minX + dfaWidth / 2;
    const boundCenterY = minY + dfaHeight / 2;

    const offsetX = width / 2 - boundCenterX * scale;
    const offsetY = height / 2 - boundCenterY * scale;

    const pos = dfa.pos;
    const R = dfa.R;

    const [targetX, targetY] = pos[activeState];
    if (currentXRef.current === null || currentYRef.current === null) {
      currentXRef.current = targetX;
      currentYRef.current = targetY;
    }

    // Helper: draw arrow head
    const drawArrowHead = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      angle: number
    ) => {
      const size = 11;
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(-size, -size * 0.46);
      context.lineTo(-size, size * 0.46);
      context.closePath();
      context.fill();
      context.restore();
    };

    // Helper: find contact point on circle perimeter
    const getContactPoint = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      isTarget: boolean,
      radius: number
    ): [number, number] => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const factor = (isTarget ? dist - radius - 3 : radius + 3) / dist;
      return [x1 + dx * factor, y1 + dy * factor];
    };

    // Draw transition arrow
    const drawEdge = (
      from: number,
      to: number,
      lbl: string,
      curveVal = 0,
      labelOffset?: [number, number],
      lateralShift = 0
    ) => {
      const [x1, y1] = pos[from];
      const [x2, y2] = pos[to];
      const color = getEdgeColor(from, to);
      const lineWidth = getEdgeWidth(from, to);

      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = lineWidth;

      let sx, sy, ex, ey, lx, ly;

      if (curveVal === 0) {
        // Straight line with optional horizontal/vertical parallel lateralShift
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / dist;
        const uy = dy / dist;

        // Orthogonal vector (pointing to the right of direction of travel)
        const nx = -uy;
        const ny = ux;

        const lx1 = x1 + nx * lateralShift;
        const ly1 = y1 + ny * lateralShift;
        const lx2 = x2 + nx * lateralShift;
        const ly2 = y2 + ny * lateralShift;

        const contactDist = Math.sqrt(R * R - lateralShift * lateralShift);
        const startOfs = contactDist + 3;
        const endOfs = contactDist + 3;

        sx = lx1 + ux * startOfs;
        sy = ly1 + uy * startOfs;
        ex = lx2 - ux * endOfs;
        ey = ly2 - uy * endOfs;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        lx = (sx + ex) / 2 + (labelOffset ? labelOffset[0] : 0);
        ly = (sy + ey) / 2 + (labelOffset ? labelOffset[1] : 0);

        drawArrowHead(ctx, ex, ey, Math.atan2(ey - sy, ex - sx));
      } else {
        // Quadratic curve
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const cpx = mx - (curveVal * dy) / dist;
        const cpy = my + (curveVal * dx) / dist;

        const a1 = Math.atan2(cpy - y1, cpx - x1);
        const a2 = Math.atan2(y2 - cpy, x2 - cpx);

        sx = x1 + (R + 2) * Math.cos(a1);
        sy = y1 + (R + 2) * Math.sin(a1);
        ex = x2 - (R + 3) * Math.cos(a2);
        ey = y2 - (R + 3) * Math.sin(a2);

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(cpx, cpy, ex, ey);
        ctx.stroke();

        drawArrowHead(ctx, ex, ey, a2);

        lx = cpx + (labelOffset ? labelOffset[0] : 0);
        ly = cpy + (labelOffset ? labelOffset[1] : 0);
      }

      // Draw label background
      ctx.fillStyle = "rgba(248, 249, 254, 0.85)";
      const labelTextWidth = ctx.measureText(lbl).width + 6;
      ctx.fillRect(lx - labelTextWidth / 2, ly - 8, labelTextWidth, 15);

      // Label text
      ctx.fillStyle = isEdgeActive(from, to) ? "#4f46e5" : "#475569";
      ctx.font = "800 12px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(lbl, lx, ly);

      ctx.restore();
    };

    // Draw self loop
    const drawSelfLoop = (
      id: number,
      lbl: string,
      dx: number,
      dy: number,
      loopRadius = 14
    ) => {
      const [x, y] = pos[id];
      const lx = x + dx;
      const ly = y + dy;
      const color = getEdgeColor(id, id);
      const lineWidth = getEdgeWidth(id, id);

      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = lineWidth;

      ctx.beginPath();
      ctx.arc(lx, ly, loopRadius, 0, Math.PI * 2);
      ctx.stroke();

      const ang = Math.atan2(ly - y, lx - x) + Math.PI;
      const ex = lx + loopRadius * Math.cos(ang + 0.4);
      const ey = ly + loopRadius * Math.sin(ang + 0.4);

      drawArrowHead(ctx, ex, ey, ang + 0.4);

      // Label
      const txtX = lx + (lx - x) * 0.55;
      const txtY = ly + (ly - y) * 0.55;

      ctx.fillStyle = "rgba(248, 249, 254, 0.85)";
      const labelTextWidth = ctx.measureText(lbl).width + 4;
      ctx.fillRect(txtX - labelTextWidth / 2, txtY - 6, labelTextWidth, 12);

      ctx.fillStyle = isEdgeActive(id, id) ? "#4f46e5" : "#475569";
      ctx.font = "800 11px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(lbl, txtX, txtY);

      ctx.restore();
    };

    let animFrameId: number;

    const tick = () => {
      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Draw grid background dots to match DFA 1 style beautifully
      ctx.fillStyle = tabIdx === 1 ? "rgba(168, 85, 247, 0.05)" : "rgba(79, 70, 229, 0.05)";
      for (let gx = 20; gx < width; gx += 30) {
        for (let gy = 20; gy < height; gy += 30) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      // Interpolate animated coordinates toward activeState target
      const cx = currentXRef.current ?? targetX;
      const cy = currentYRef.current ?? targetY;
      const dx = targetX - cx;
      const dy = targetY - cy;

      // Soft easing physical travel
      currentXRef.current = cx + dx * 0.15;
      currentYRef.current = cy + dy * 0.15;

      const animX = currentXRef.current;
      const animY = currentYRef.current;

      // Render edges depending on active Tab Index
      if (tabIdx === 0) {
        // ════ TAB 0 (DFA 1): New Custom DFA drawing matching the user's uploaded diagram exactly ════
        // State 0: -
        drawEdge(0, 2, "a", 0, [-12, 0]);
        drawEdge(0, 1, "b", 0, [0, -12]);

        // State 1: q1
        drawEdge(1, 3, "a", 0, [0, -12]);
        drawEdge(1, 4, "b", 0, [-12, 0]);

        // State 2: q2
        drawEdge(2, 6, "a", 0, [-12, 0]);
        drawEdge(2, 4, "b", 0, [0, 12]);

        // State 3: q3
        drawEdge(3, 15, "a", 0, [0, -12]);
        drawEdge(3, 5, "b", 0, [12, 0]);

        // State 4: q4
        drawEdge(4, 16, "b", 0, [12, 0]);
        drawEdge(4, 8, "a", 0, [0, -12]);

        // State 5: q5
        drawEdge(5, 9, "a", 0, [0, -12]);
        drawEdge(5, 1, "b", 0, [-12, -12]);

        // State 6: q6
        drawEdge(6, 17, "a", 0, [-12, 12]);
        drawEdge(6, 7, "b", 0, [-12, 0]);

        // State 7: q7
        drawEdge(7, 9, "a", 30, [0, 15]); // Curved underneath
        drawEdge(7, 17, "b", 0, [-12, -12]);

        // State 8: q8
        drawEdge(8, 16, "a", 0, [12, 0]);
        drawEdge(8, 9, "b", 0, [0, -12]);

        // State 9: q9
        drawEdge(9, 10, "a,b", 0, [0, -12]);

        // State 10: q10
        drawEdge(10, 11, "a", 0, [-12, -12]);
        drawEdge(10, 12, "b", 0, [-12, 12]);

        // State 11: q11
        drawEdge(11, 13, "a", 0, [0, -12]);
        drawEdge(11, 12, "b", -15, [15, 0]); // Anti-parallel curve going down with label outside (right)

        // State 12: q12
        drawEdge(12, 11, "a", -15, [-15, 0]); // Anti-parallel curve going up with label outside (left)
        drawEdge(12, 14, "b", 0, [0, 12]);

        // State 13: + (Top Accepting)
        drawSelfLoop(13, "a", 35, -15, 14);
        drawEdge(13, 12, "b", 0, [-12, 45]); // Shifted closer to the bottom arrow (q12) but not entirely at the bottom

        // State 14: + (Bottom Accepting)
        drawSelfLoop(14, "b", 35, 15, 14);
        drawEdge(14, 11, "a", 0, [-12, -45]); // Shifted closer to the top arrow (q11) but not entirely at the top

        // Trap state self-loops
        drawSelfLoop(15, "a,b", 0, -40, 14); // Trap Top
        drawSelfLoop(16, "a,b", 0, 40, 14);  // Trap Mid
        drawSelfLoop(17, "a,b", -40, 0, 14); // Trap Left
      } else {
        // ════ TAB 1 (DFA 2): states 0=-, 1=q1, 2=q2, 3=q3, 4=q4, 5=q5, 6=q6, 7=q7, 8=+ ════
        drawEdge(0, 1, "0", 0, [-12, -12]);  // - to q1
        drawEdge(0, 2, "1", 0, [-12, 12]);   // - to q2
        drawEdge(1, 2, "1", 0, [-18, 0], 14); // q1 to q2 (vertical, shifted left)
        drawEdge(2, 1, "0", 0, [18, 0], 14);  // q2 to q1 (vertical, shifted right)
        drawEdge(1, 3, "0", 0, [12, -12]);   // q1 to q3
        drawEdge(2, 3, "1", 0, [12, 12]);    // q2 to q3
        drawEdge(3, 4, "0,1", 0, [0, -14]);  // q3 to q4
        drawSelfLoop(4, "0", 0, -42, 14);    // q4 self-loop ABOVE
        drawEdge(4, 5, "1", 0, [-12, -12]);  // q4 to q5
        drawEdge(5, 6, "0", 0, [-12, 0]);    // q5 to q6
        drawEdge(5, 7, "1", 0, [0, -14]);    // q5 to q7
        drawEdge(6, 4, "0", 0, [14, 14]);    // q6 to q4
        drawEdge(7, 6, "0", 0, [14, -14]);   // q7 to q6
        drawEdge(7, 8, "1", 0, [14, 0]);     // q7 to +
        drawEdge(6, 8, "1", 0, [0, 14]);     // q6 to +
        drawSelfLoop(8, "0,1", 0, 42, 14);   // + self-loop BELOW
      }

      // Draw Start State Arrow (represented with dotted or dash parameters)
      ctx.save();
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1.6;
      ctx.setLineDash([3, 3]);
      const startPos = pos[dfa.START];
      ctx.beginPath();
      ctx.moveTo(startPos[0] - 50, startPos[1]);
      ctx.lineTo(startPos[0] - R - 4, startPos[1]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#cbd5e1";
      drawArrowHead(ctx, startPos[0] - R - 4, startPos[1], 0);
      ctx.restore();

      // Draw Node Circles and Labels
      for (let id = 0; id < dfa.n; id++) {
        const [nx, ny] = pos[id];

        // Double-circle for accepting nodes
        if (dfa.ACC.has(id)) {
          ctx.save();
          ctx.strokeStyle = tabIdx === 1 ? "#7c3aed" : "#059669";
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          ctx.arc(nx, ny, R + 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Draw a beautiful miniature 5-point gold star just above the accepting state node
          ctx.save();
          ctx.fillStyle = "#eab308"; // Gold star fill
          ctx.strokeStyle = "#b45309"; // Dark gold border
          ctx.lineWidth = 1.2;
          const starX = nx;
          const starY = ny - R - 13;
          ctx.beginPath();
          let rot = (Math.PI / 2) * 3;
          const step = Math.PI / 5;
          const outerR = 6.5;
          const innerR = 2.8;
          ctx.moveTo(starX, starY - outerR);
          for (let i = 0; i < 5; i++) {
            let sx = starX + Math.cos(rot) * outerR;
            let sy = starY + Math.sin(rot) * outerR;
            ctx.lineTo(sx, sy);
            rot += step;

            sx = starX + Math.cos(rot) * innerR;
            sy = starY + Math.sin(rot) * innerR;
            ctx.lineTo(sx, sy);
            rot += step;
          }
          ctx.lineTo(starX, starY - outerR);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }

        // Main Node Circle
        ctx.beginPath();
        ctx.arc(nx, ny, R, 0, Math.PI * 2);
        ctx.fillStyle = getNodeColor(id, activeState);
        ctx.fill();

        ctx.strokeStyle = getBorderColor(id, activeState);
        ctx.lineWidth = id === dfa.START ? 4.5 : 3.0;
        ctx.stroke();

        // Node text label
        const isQState = dfa.labels[id] !== "-" && dfa.labels[id] !== "+";
        
        ctx.fillStyle = dfa.ACC.has(id)
          ? (tabIdx === 1 ? "#6d28d9" : "#065f46")
          : id === activeState
          ? "#ffffff"
          : dfa.dead.has(id)
          ? "#dc2626"
          : "#1e293b";

        ctx.font = "800 13px 'JetBrains Mono', monospace";

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(dfa.labels[id], nx, ny);
      }

      // ════ Draw Animated Floating Focal Halo ════
      // This slides smoothly between nodes and gently breathes when stationary.
      ctx.save();
      const time = Date.now() / 150; // Breathing speed factor
      const pulseExpansion = Math.sin(time) * 2.5; // Breath offset
      const outerRadius = R + 14 + pulseExpansion;

      // Glow Gradient
      const pulseGlow = ctx.createRadialGradient(animX, animY, R - 1, animX, animY, outerRadius);
      const activeColor = tabIdx === 1 ? "rgba(139, 92, 246, " : "rgba(79, 70, 229, ";
      pulseGlow.addColorStop(0, activeColor + "0.35)");       // Active translucent core
      pulseGlow.addColorStop(0.4, activeColor + "0.15)");     // Fading outer
      pulseGlow.addColorStop(1, activeColor + "0)");           // Fully transparent edge
      ctx.fillStyle = pulseGlow;
      ctx.beginPath();
      ctx.arc(animX, animY, outerRadius, 0, Math.PI * 2);
      ctx.fill();

      // Sharp central accent focus ring
      ctx.strokeStyle = tabIdx === 1 ? "#8b5cf6" : "#4f46e5"; // Purple or Indigo anchor border
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(animX, animY, R + 3, 0, Math.PI * 2);
      ctx.stroke();

      // Outer satellite dashed ring that rotates slowly for a cool tech feeling
      ctx.strokeStyle = tabIdx === 1 ? "rgba(139, 92, 246, 0.4)" : "rgba(79, 70, 229, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(animX, animY, R + 9, time * 0.1, time * 0.1 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      ctx.restore(); // for translation & scale scale context save
      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [dfa, tabIdx, activeState, path, stepIdx]);

  return (
    <div className="relative w-full h-full bg-[#f8fafc]">
      {/* State Info Overlay */}
      <div className="absolute top-3 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-slate-200 shadow-sm text-[10px] text-slate-500 font-mono z-10 flex flex-col gap-0.5 pointer-events-none select-none">
        <div>
          Active Tracker:{" "}
          <span
            className={`font-extrabold px-1.5 py-0.5 rounded border ${
              tabIdx === 1
                ? "text-purple-700 bg-purple-50 border-purple-200"
                : "text-indigo-600 bg-indigo-50 border-indigo-200"
            }`}
          >
            {dfa.labels[activeState]}
          </span>
        </div>
        <div className="text-[9px] max-w-[210px] text-slate-400 mt-0.5 leading-normal">
          {dfa.DESC[activeState]}
        </div>
      </div>

      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
