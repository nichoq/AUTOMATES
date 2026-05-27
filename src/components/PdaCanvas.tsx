import React from "react";
import { ChevronRight, Check, X } from "lucide-react";

interface PdaStep {
  nodeId: string;
  charIdx: number;
  consumedChar: string | null;
}

interface PdaCanvasProps {
  traceStr: string;
  stepIdx: number;
  pdaPath: PdaStep[];
  isPlaying: boolean;
  tabIdx: number;
}

export const PdaCanvas: React.FC<PdaCanvasProps> = ({
  traceStr,
  stepIdx,
  pdaPath,
  isPlaying,
  tabIdx,
}) => {
  const activeStep = pdaPath[stepIdx] || { nodeId: tabIdx === 0 ? "start" : "start_2", charIdx: 0, consumedChar: null };
  const activeNodeId = activeStep.nodeId;

  // Nodes metadata for rendering based on tabIdx
  const nodes = tabIdx === 0 ? [
    // Left Half - Regex 1 sequence
    { id: "start", type: "start", label: "START", x: 260, y: 50 },
    { id: "n1", type: "read", label: "READ", x: 260, y: 120 },
    { id: "n2", type: "read", label: "READ", x: 170, y: 210 },
    { id: "n3", type: "read", label: "READ", x: 260, y: 210 },
    { id: "n4", type: "read", label: "READ", x: 120, y: 290 },
    { id: "n5", type: "read", label: "READ", x: 215, y: 290 },
    { id: "n6", type: "read", label: "READ", x: 350, y: 210 },
    { id: "n8", type: "read", label: "READ", x: 350, y: 290 },
    { id: "n9", type: "read", label: "READ", x: 350, y: 360 },
    { id: "n7", type: "read", label: "READ", x: 120, y: 440 },
    { id: "n10", type: "read", label: "READ", x: 430, y: 360 },
    
    // Reject nodes of left half
    { id: "rej1", type: "reject", label: "REJECT", x: 45, y: 360 },
    { id: "rej2", type: "reject", label: "REJECT", x: 215, y: 360 },
    { id: "rej3", type: "reject", label: "REJECT", x: 450, y: 210 },

    // Right Half - Trailing trailing pairs checking
    { id: "n11", type: "read", label: "READ", x: 530, y: 360 },
    { id: "n12", type: "read", label: "READ", x: 620, y: 290 },
    { id: "n13", type: "read", label: "READ", x: 620, y: 360 },
    { id: "n14", type: "read", label: "READ", x: 620, y: 200 },
    { id: "n15", type: "read", label: "READ", x: 740, y: 360 },

    // Accept nodes
    { id: "acc1", type: "accept", label: "ACCEPT", x: 620, y: 100 },
    { id: "acc2", type: "accept", label: "ACCEPT", x: 860, y: 360 },
  ] : [
    // Regex 2 sequence from user diagram
    { id: "start_2", type: "start", label: "START", x: 110, y: 60 },
    { id: "n2_1", type: "read", label: "READ", x: 110, y: 140 },
    { id: "n2_2", type: "read", label: "READ", x: 110, y: 235 },
    { id: "n2_3", type: "read", label: "READ", x: 110, y: 330 },
    { id: "n2_4", type: "read", label: "READ", x: 240, y: 330 },
    { id: "n2_5", type: "read", label: "READ", x: 400, y: 330 },
    { id: "n2_6", type: "read", label: "READ", x: 530, y: 330 },
    { id: "n2_7", type: "read", label: "READ", x: 660, y: 330 },
    { id: "n2_8", type: "read", label: "READ", x: 790, y: 330 },
    { id: "acc_2", type: "accept", label: "ACCEPT", x: 910, y: 330 },
  ];

  const getStrokeAndFill = (id: string) => {
    const isActive = activeNodeId === id;
    if (id.startsWith("acc")) {
      return {
        fill: isActive ? "#10b981" : "#a7f3d0",
        stroke: "#047857",
        strokeWidth: isActive ? 4 : 2,
        textColor: isActive ? "#ffffff" : "#064e3b",
      };
    }
    if (id.startsWith("rej")) {
      return {
        fill: isActive ? "#ef4444" : "#fecaca",
        stroke: "#b91c1c",
        strokeWidth: isActive ? 4 : 2,
        textColor: isActive ? "#ffffff" : "#7f1d1d",
      };
    }
    if (id.startsWith("start")) {
      return {
        fill: isActive ? (tabIdx === 0 ? "#6366f1" : "#a855f7") : "#e2e8f0",
        stroke: tabIdx === 0 ? "#475569" : "#6b21a8",
        strokeWidth: isActive ? 4 : 2.5,
        textColor: isActive ? "#ffffff" : "#1e293b",
      };
    }
    // READ nodes
    return {
      fill: isActive ? (tabIdx === 0 ? "#4f46e5" : "#a855f7") : "#f8fafc",
      stroke: isActive ? (tabIdx === 0 ? "#312e81" : "#581c87") : "#94a3b8",
      strokeWidth: isActive ? 4 : 2,
      textColor: isActive ? "#ffffff" : "#334155",
    };
  };

  // Helper to determine if a transition edge is active
  const isTransitionActive = (from: string, to: string) => {
    if (stepIdx === 0) return false;
    for (let i = 0; i < stepIdx; i++) {
      if (pdaPath[i]?.nodeId === from && pdaPath[i + 1]?.nodeId === to) {
        return true;
      }
    }
    return false;
  };

  // Helper to draw links with active state highlights
  const renderLink = (
    from: string,
    to: string,
    pathD: string,
    label: string,
    lblX: number,
    lblY: number,
    markerId = "arrow"
  ) => {
    const isActive = isTransitionActive(from, to);
    const activeColor = tabIdx === 0 ? "#4f46e5" : "#a855f7";
    const glowColor = tabIdx === 0 ? "#c7d2fe" : "#f3e8ff";
    return (
      <g key={`link-${from}-${to}-${label}`} className="transition-all duration-250">
        {/* Glow behind when active */}
        {isActive && (
          <path
            d={pathD}
            fill="none"
            stroke={glowColor}
            strokeWidth={6}
            strokeLinecap="round"
            className="animate-pulse"
          />
        )}
        {/* Real path */}
        <path
          d={pathD}
          fill="none"
          stroke={isActive ? activeColor : "#cbd5e1"}
          strokeWidth={isActive ? 3.5 : 1.8}
          strokeLinecap="round"
          markerEnd={markerId ? `url(#${markerId}-${isActive ? "active" : "normal"})` : undefined}
        />
        {/* Label block centered */}
        {label && (
          <g transform={`translate(${lblX}, ${lblY})`}>
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={11}
              fontWeight="900"
              fontFamily="'JetBrains Mono', monospace"
              fill={isActive ? activeColor : "#475569"}
            >
              {label}
            </text>
          </g>
        )}
      </g>
    );
  };

  const activeDescription = () => {
    if (tabIdx === 0) {
      if (activeNodeId === "start") return "Initial entry state of the PDA device";
      if (activeNodeId === "n1") return "Top junction: consumes 'a' to read left-bound run, 'b' for middle checks";
      if (activeNodeId === "n2") return "Checking 'a' prefix iterations — next expected is 'a' or 'b' spacer";
      if (activeNodeId === "n3") return "Transition spacer — looking for 'a' center pairs or 'b' loopback patterns";
      if (activeNodeId.startsWith("rej")) return "REJECT STATE - The input string failed the matching criteria at this step";
      if (activeNodeId.startsWith("acc")) return "ACCEPT STATE - The input string has been fully recognized by the PDA!";
      if (activeNodeId === "n10") return "Middle junction block - successfully routed first grammar section. Transitioning to trailing pair verification";
      if (activeNodeId === "n11") return "Stage 2: Initiating trailing pair checks. Need ending with 'aa' or 'bb'";
      if (activeNodeId === "n12") return "State representing tracking for trailing 'aa' matching";
      if (activeNodeId === "n13") return "State representing tracking for trailing 'bb' matching";
      if (activeNodeId === "n14") return "Trailing 'aa' pattern matched! Read to accept on empty tape (Δ)";
      if (activeNodeId === "n15") return "Trailing 'bb' pattern matched! Read to accept on empty tape (Δ)";
    } else {
      if (activeNodeId === "start_2") return "Initial entry state of PDA 2";
      if (activeNodeId === "n2_1") return "Start sequence tracking: looking for first duplicate sequence of consecutive runs";
      if (activeNodeId === "n2_2") return "Saw a '0'. Transition to matches '00' or shifts check to single '1'";
      if (activeNodeId === "n2_3") return "Saw a '1'. Transition to matches '11' or shifts check to single '0'";
      if (activeNodeId === "n2_4") return "Consecutive runs pairs matched! Consumes next character to transition to the suffix tracking";
      if (activeNodeId === "n2_5") return "Suffix hunt state: loops on any sequences of '0' waiting to see a '1' to start matching 101/111";
      if (activeNodeId === "n2_6") return "First '1' of matching sequence seen. Need '0' or '1' next";
      if (activeNodeId === "n2_7") return "Matched pattern prefix '10'. Looking for '1' to reach ACCEPT, or loops back to search on '0'";
      if (activeNodeId === "n2_8") return "Matched pattern prefix '11'. Looking for '1' to reach ACCEPT, or falls back to '10' tracking on '0'";
      if (activeNodeId === "acc_2") return "ACCEPT STATE - Regex 2 sequence successfully fully recognized!";
    }
    return "Reading symbol and transitioning down decision tree";
  };

  const getActiveNodeDisplay = () => {
    if (activeNodeId === "start_2") return "START";
    if (activeNodeId === "acc_2") return "ACCEPT";
    return activeNodeId.toUpperCase().replace(/^N2_/, "READ ").replace(/^N/, "READ ");
  };

  return (
    <div className="relative w-full h-full bg-[#f8fafc] flex flex-col min-h-0 overflow-hidden">
      {/* State Info Overlay */}
      <div className="absolute top-3 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-slate-200 shadow-sm text-[10px] text-slate-500 font-mono z-10 flex flex-col gap-0.5 pointer-events-none select-none max-w-[250px]">
        <div>
          Active Node:{" "}
          <span className={`font-extrabold px-1.5 py-0.5 rounded border uppercase ${
            tabIdx === 0
              ? "text-indigo-600 bg-indigo-50 border-indigo-200"
              : "text-purple-600 bg-purple-50 border-purple-200"
          }`}>
            {getActiveNodeDisplay()}
          </span>
        </div>
        <div className="text-[9px] text-slate-400 mt-1 leading-normal">
          {activeDescription()}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 flex items-center justify-center min-h-0">
        <svg
          viewBox={tabIdx === 0 ? "0 0 920 520" : "0 0 980 480"}
          className="w-full max-h-[460px] md:max-h-[490px] select-none h-auto block"
        >
          {/* Defined marker arrows for standard/highlight states */}
          <defs>
            <marker
              id="arrow-normal"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#cbd5e1" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={tabIdx === 0 ? "#4f46e5" : "#a855f7"} />
            </marker>
          </defs>

          {/* Render background grid dots for aesthetic parity with DFA diagram */}
          <g fill={tabIdx === 0 ? "rgba(79, 70, 229, 0.04)" : "rgba(168, 85, 247, 0.04)"}>
            {Array.from({ length: 30 }).map((_, xi) => (
              <g key={`grid-col-${xi}`}>
                {Array.from({ length: 18 }).map((_, yi) => (
                  <circle key={`grid-dot-${xi}-${yi}`} cx={20 + xi * 32} cy={20 + yi * 28} r={1.2} />
                ))}
              </g>
            ))}
          </g>

          {/* Links Rendering */}
          {tabIdx === 0 ? (
            <>
              {/* Links: Left Half (First Section) */}
              {renderLink("start", "n1", "M 260,65 L 260,100", "", 260, 80)}
              {renderLink("n1", "n2", "M 240,130 L 190,195", "a", 215, 155)}
              {renderLink("n1", "n3", "M 260,140 L 260,190", "b", 270, 160)}
              {renderLink("n2", "n4", "M 162,225 L 132,275", "a", 143, 245)}
              {renderLink("n2", "n5", "M 183,222 L 205,274", "b", 200, 245)}
              {renderLink("n3", "n6", "M 280,210 L 330,210", "a", 305, 198)}
              {renderLink("n3", "n5", "M 252,223 L 226,275", "b", 232, 245)}
              
              {/* Route from center read-junction n5 to bottom-right read-junction n9 */}
              {renderLink("n5", "n9", "M 230,300 L 330,360", "a", 280, 325)}
              
              {/* Straight and left links around n4 */}
              {renderLink("n4", "rej1", "M 100,290 H 45 V 345", "a", 65, 278)}
              {renderLink("n4", "n7", "M 120,310 L 120,420", "b", 110, 360)}
              {renderLink("n5", "rej2", "M 215,310 L 215,345", "b", 225, 325)}
              
              {/* Curve and right links around n6 */}
              {renderLink("n6", "rej3", "M 370,210 L 411,210", "a", 395, 198)}
              {renderLink("n6", "n8", "M 350,230 L 350,270", "b", 360, 245)}
              
              {/* Re-entry loop from n8 up to n3 */}
              {renderLink("n8", "n3", "M 335,278 L 275,225", "b", 305, 251)}
              
              {/* Transition down into n9 and n10 */}
              {renderLink("n8", "n9", "M 350,310 L 350,340", "a", 360, 325)}
              {renderLink("n9", "rej2", "M 330,360 L 254,360", "a", 280, 348)}
              {renderLink("n9", "n10", "M 370,360 L 410,360", "b", 390, 348)}
              {renderLink("n7", "rej1", "M 100,440 H 45 V 375", "b", 65, 452)}
              
              {/* Bottom-left long line feedback to junction n10 */}
              {renderLink("n7", "n10", "M 140,440 H 430 V 380", "a", 170, 428)}

              {/* Links: Junction from left half to right half */}
              {renderLink("n10", "n11", "M 450,360 L 510,360", "a,b", 480, 348)}

              {/* Links: Right Half (Second Section) */}
              {renderLink("n11", "n12", "M 545,345 L 605,305", "a", 570, 310)}
              {renderLink("n11", "n13", "M 550,360 L 600,360", "b", 575, 348)}
              
              {/* Trailing aa-bb ping-pong track links */}
              {renderLink("n12", "n14", "M 620,270 L 620,220", "a", 610, 245)}
              {renderLink("n12", "n13", "M 614,310 L 614,340", "b", 604, 325)}
              {renderLink("n13", "n12", "M 626,340 L 626,310", "a", 636, 325)}
              {renderLink("n13", "n15", "M 640,360 L 720,360", "b", 680, 348)}

              {/* Right outputs to accept states */}
              {renderLink("n14", "acc1", "M 620,180 L 620,115", "Δ", 632, 148)}
              
              {/* Loop paths */}
              {renderLink("n14", "n14", "M 610,190 C 570,175 570,225 610,210", "a", 565, 200, undefined)}
              {renderLink("n14", "n13", "M 640,200 H 770 V 410 H 620 V 380", "b", 755, 230)}

              {/* Bottom-right loops & exits */}
              {renderLink("n15", "acc2", "M 760,360 L 821,360", "Δ", 800, 348)}
              {renderLink("n15", "n15", "M 730,380 C 700,410 780,410 750,380", "b", 740, 412, undefined)}
              {renderLink("n15", "n12", "M 740,340 V 290 H 640", "a", 710, 278)}
            </>
          ) : (
            <>
              {/* Links: Regex 2 sequence */}
              {/* START -> n2_1 */}
              {renderLink("start_2", "n2_1", "M 110,75 L 110,120", "", 110, 95)}

              {/* n2_1 -> n2_2 on 0 */}
              {renderLink("n2_1", "n2_2", "M 110,160 L 110,215", "0", 100, 185)}

              {/* n2_1 -> n2_3 on 1 (long left side loop) */}
              {renderLink("n2_1", "n2_3", "M 90,140 H 40 V 330 H 90", "1", 52, 235)}

              {/* n2_2 -> n2_4 on 0 (curved right then down) */}
              {renderLink("n2_2", "n2_4", "M 130,235 H 240 V 310", "0", 185, 245)}

              {/* n2_2 -> n2_3 on 1 (offset right vertical) */}
              {renderLink("n2_2", "n2_3", "M 120,255 L 120,310", "1", 130, 282)}

              {/* n2_3 -> n2_2 on 0 (offset left vertical) */}
              {renderLink("n2_3", "n2_2", "M 100,310 L 100,255", "0", 90, 282)}

              {/* n2_3 -> n2_4 on 1 (horizontal right) */}
              {renderLink("n2_3", "n2_4", "M 130,330 L 220,330", "1", 175, 342)}

              {/* n2_4 -> n2_5 on 0,1 (horizontal right) */}
              {renderLink("n2_4", "n2_5", "M 260,330 L 380,330", "0,1", 320, 318)}

              {/* n2_5 -> n2_5 (self-loop on top on 0) */}
              {renderLink("n2_5", "n2_5", "M 390,312 C 370,265 430,265 410,312", "0", 400, 260)}

              {/* n2_5 -> n2_6 on 1 (horizontal right) */}
              {renderLink("n2_5", "n2_6", "M 420,330 L 510,330", "1", 465, 318)}

              {/* n2_6 -> n2_7 on 0 (horizontal right) */}
              {renderLink("n2_6", "n2_7", "M 550,330 L 640,330", "0", 595, 318)}

              {/* n2_6 -> n2_8 on 1 (top raised loop arch over node 7) */}
              {renderLink("n2_6", "n2_8", "M 530,310 C 580,225 740,225 790,310", "1", 660, 245)}

              {/* n2_8 -> n2_7 on 0 (pointing left) */}
              {renderLink("n2_8", "n2_7", "M 770,330 L 680,330", "0", 725, 318)}

              {/* n2_7 -> n2_5 on 0 (bottom horizontal feedback loop going left) */}
              {renderLink("n2_7", "n2_5", "M 660,350 V 400 H 400 V 350", "0", 530, 412)}

              {/* n2_7 -> acc_2 on 1 (bottom horizontal exit loop to ACCEPT) */}
              {renderLink("n2_7", "acc_2", "M 660,350 V 430 H 910 V 345", "1", 785, 418)}

              {/* n2_8 -> acc_2 on 1 (horizontal right) */}
              {renderLink("n2_8", "acc_2", "M 810,330 L 871,330", "1", 840, 318)}

              {/* acc_2 -> acc_2 loop (on 0,1) */}
              {renderLink("acc_2", "acc_2", "M 900,315 C 875,260 945,260 920,315", "0,1", 910, 260)}
            </>
          )}


          {/* ════ Render Graphic Elements (Diamonds and Capsules) ════ */}
          {nodes.map((n) => {
            const colors = getStrokeAndFill(n.id);
            const isActive = activeNodeId === n.id;

            if (n.type === "read") {
              // Custom styled high fidelity Diamond shape
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x}, ${n.y})`}
                  className="cursor-default"
                >
                  {/* Subtle hover/active shadows */}
                  <polygon
                    points="0,-20 20,0 0,20 -20,0"
                    fill="#151b2e"
                    opacity={isActive ? 0.35 : 0}
                    transform="scale(1.2) translate(0, 3)"
                  />
                  {/* Real Diamond */}
                  <polygon
                    points="0,-20 20,0 0,20 -20,0"
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={colors.strokeWidth}
                    className="transition-all duration-200"
                  />
                  {/* Label */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={8.5}
                    fontWeight="900"
                    fontFamily="sans-serif"
                    fill={colors.textColor}
                    className="tracking-wider"
                  >
                    {n.label}
                  </text>
                  {/* Active highlight breathing circle anchor */}
                  {isActive && (
                    <circle
                      cx={0}
                      cy={0}
                      r={24}
                      fill={tabIdx === 0 ? "#818cf8" : "#c084fc"}
                      strokeWidth={1.5}
                      className="animate-ping"
                      opacity={0.5}
                    />
                  )}
                </g>
              );
            }

            // Render Capsules (START, REJECT, ACCEPT)
            const isStart = n.id.startsWith("start");
            const width = isStart ? 65 : 78;
            const height = 30;

            return (
              <g
                key={n.id}
                transform={`translate(${n.x - width / 2}, ${n.y - height / 2})`}
                className="cursor-default"
              >
                {/* Visual shadow */}
                <rect
                  width={width}
                  height={height}
                  rx={isActive ? 12 : 8}
                  ry={isActive ? 12 : 8}
                  fill="#0f172a"
                  opacity={isActive ? 0.4 : 0.08}
                  transform="translate(1, 2.5)"
                />
                {/* Node Box */}
                <rect
                  width={width}
                  height={height}
                  rx={isActive ? 12 : 8}
                  ry={isActive ? 12 : 8}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={colors.strokeWidth}
                  className="transition-all duration-200"
                />
                {/* Node Text */}
                <text
                  x={width / 2}
                  y={height / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={10}
                  fontWeight="900"
                  fontFamily="sans-serif"
                  fill={colors.textColor}
                  className="tracking-wider"
                >
                  {n.label}
                </text>
                {/* Outer satellite radar focus for actives */}
                {isActive && (
                  <rect
                    x={-5}
                    y={-5}
                    width={width + 10}
                    height={height + 10}
                    rx={14}
                    ry={14}
                    fill="none"
                    stroke={tabIdx === 0 ? "#818cf8" : "#c084fc"}
                    strokeWidth={1.5}
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Segment Legend */}
      <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-md border border-slate-250 py-2.5 px-3 rounded-lg shadow-sm max-w-[170px] z-10 flex flex-col gap-1.5 select-none pointer-events-none">
        <span className="text-[8px] text-slate-400 uppercase tracking-widest font-black">Legend Map</span>
        <div className="flex flex-col gap-1.5 text-[9px] text-slate-600 font-sans">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-1.5 border rounded-xs inline-block ${
              tabIdx === 0 ? "border-slate-450 bg-slate-150" : "border-purple-300 bg-purple-50"
            }`} />
            <span className="font-bold text-slate-700">START (entry phase)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 flex items-center justify-center">
              <span className={`w-1.5 h-1.5 border rotate-45 block transform ${
                tabIdx === 0 ? "border-slate-450 bg-white" : "border-purple-300 bg-white"
              }`} />
            </div>
            <span className="font-bold text-slate-700">READ (character node)</span>
          </div>
          {tabIdx === 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-1.5 border border-rose-500 bg-rose-200 rounded-xs inline-block" />
              <span className="font-bold text-rose-800">REJECT (fail trap)</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-1.5 border border-emerald-500 bg-emerald-200 rounded-xs inline-block" />
            <span className="font-bold text-emerald-800">ACCEPT (match done)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
