import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Check,
  X,
  ArrowRight,
  Info,
  Menu,
  ChevronLeft,
  ChevronRight,
  FileCode,
  Trash2,
  Settings,
  Sparkles,
  RefreshCw,
  Copy,
  CheckCircle,
  HelpCircle,
  Database,
  Table
} from "lucide-react";
import { DFA_DATA } from "./dfaData";
import { DfaCanvas } from "./components/DfaCanvas";
import { PdaCanvas } from "./components/PdaCanvas";
import { 
  parseCFG1, 
  generateCFG1Derivation, 
  parseCFG2, 
  generateCFG2Derivation 
} from "./cfgTracer";

interface PdaStep {
  nodeId: string;
  charIdx: number;
  consumedChar: string | null;
}

export function getPdaTracePath(tabIdx: number, input: string): PdaStep[] {
  const steps: PdaStep[] = [];
  
  if (tabIdx === 0) {
    let currentNode = 'start';
    let charIdx = 0;
    
    steps.push({
      nodeId: currentNode,
      charIdx: 0,
      consumedChar: null,
    });
    
    currentNode = 'n1';
    steps.push({
      nodeId: currentNode,
      charIdx: 0,
      consumedChar: null,
    });

    while (charIdx < input.length) {
      const char = input[charIdx];
      let nextNode = '';

      if (currentNode === 'n1') {
        if (char === 'a') nextNode = 'n2';
        else if (char === 'b') nextNode = 'n3';
      } 
      else if (currentNode === 'n2') {
        if (char === 'a') nextNode = 'n4';
        else if (char === 'b') nextNode = 'n5';
      } 
      else if (currentNode === 'n3') {
        if (char === 'a') nextNode = 'n6';
        else if (char === 'b') nextNode = 'n5';
      } 
      else if (currentNode === 'n4') {
        if (char === 'a') nextNode = 'rej1';
        else if (char === 'b') nextNode = 'n7';
      } 
      else if (currentNode === 'n5') {
        if (char === 'b') nextNode = 'rej2';
        else if (char === 'a') nextNode = 'n9';
      } 
      else if (currentNode === 'n6') {
        if (char === 'a') nextNode = 'rej3';
        else if (char === 'b') nextNode = 'n8';
      } 
      else if (currentNode === 'n7') {
        if (char === 'b') nextNode = 'rej1';
        else if (char === 'a') nextNode = 'n10';
      } 
      else if (currentNode === 'n8') {
        if (char === 'b') nextNode = 'n3';
        else if (char === 'a') nextNode = 'n9';
      } 
      else if (currentNode === 'n9') {
        if (char === 'a') nextNode = 'rej2';
        else if (char === 'b') nextNode = 'n10';
      } 
      else if (currentNode === 'n10') {
        if (char === 'a' || char === 'b') nextNode = 'n11';
      } 
      else if (currentNode === 'n11') {
        if (char === 'a') nextNode = 'n12';
        else if (char === 'b') nextNode = 'n13';
      } 
      else if (currentNode === 'n12') {
        if (char === 'a') nextNode = 'n14';
        else if (char === 'b') nextNode = 'n13';
      } 
      else if (currentNode === 'n13') {
        if (char === 'a') nextNode = 'n12';
        else if (char === 'b') nextNode = 'n15';
      } 
      else if (currentNode === 'n14') {
        if (char === 'a') nextNode = 'n14';
        else if (char === 'b') nextNode = 'n13';
      } 
      else if (currentNode === 'n15') {
        if (char === 'b') nextNode = 'n15';
        else if (char === 'a') nextNode = 'n12';
      }

      if (!nextNode) {
        if (currentNode.startsWith('rej') || currentNode.startsWith('acc')) {
          break; 
        }
        nextNode = 'rej2';
      }

      currentNode = nextNode;
      charIdx++;
      steps.push({
        nodeId: currentNode,
        charIdx,
        consumedChar: char,
      });

      if (currentNode.startsWith('rej')) {
        break;
      }
    }

    if (charIdx === input.length) {
      if (currentNode === 'n14') {
        steps.push({
          nodeId: 'acc1',
          charIdx,
          consumedChar: 'Δ',
        });
      } else if (currentNode === 'n15') {
        steps.push({
          nodeId: 'acc2',
          charIdx,
          consumedChar: 'Δ',
        });
      }
    }
  } else {
    // tabIdx === 1 (Regex 2 and DFA 2)
    let currentNode = 'start_2';
    let charIdx = 0;
    
    steps.push({
      nodeId: currentNode,
      charIdx: 0,
      consumedChar: null,
    });
    
    currentNode = 'n2_1';
    steps.push({
      nodeId: currentNode,
      charIdx: 0,
      consumedChar: null,
    });

    while (charIdx < input.length) {
      const char = input[charIdx];
      let nextNode = '';

      if (currentNode === 'n2_1') {
        if (char === '0') nextNode = 'n2_2';
        else if (char === '1') nextNode = 'n2_3';
      } 
      else if (currentNode === 'n2_2') {
        if (char === '0') nextNode = 'n2_4';
        else if (char === '1') nextNode = 'n2_3';
      } 
      else if (currentNode === 'n2_3') {
        if (char === '0') nextNode = 'n2_2';
        else if (char === '1') nextNode = 'n2_4';
      } 
      else if (currentNode === 'n2_4') {
        if (char === '0' || char === '1') nextNode = 'n2_5';
      } 
      else if (currentNode === 'n2_5') {
        if (char === '0') nextNode = 'n2_5';
        else if (char === '1') nextNode = 'n2_6';
      } 
      else if (currentNode === 'n2_6') {
        if (char === '0') nextNode = 'n2_7';
        else if (char === '1') nextNode = 'n2_8';
      } 
      else if (currentNode === 'n2_7') {
        if (char === '0') nextNode = 'n2_5';
        else if (char === '1') nextNode = 'acc_2';
      } 
      else if (currentNode === 'n2_8') {
        if (char === '0') nextNode = 'n2_7';
        else if (char === '1') nextNode = 'acc_2';
      } 
      else if (currentNode === 'acc_2') {
        if (char === '0' || char === '1') nextNode = 'acc_2';
      }

      if (!nextNode) {
        break; 
      }

      currentNode = nextNode;
      charIdx++;
      steps.push({
        nodeId: currentNode,
        charIdx,
        consumedChar: char,
      });
    }
  }

  return steps;
}

export default function App() {
  const [tabIdx, setTabIdx] = useState<number>(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // Batch testing inputs (5 fields per Tab)
  const [inputs, setInputs] = useState<string[][]>([
    ["", "", "", "", ""], // Tab 0 initial values
    ["", "", "", "", ""], // Tab 1 initial values
  ]);
  
  // Selected input strings for tracing
  const [selectedInpIdx, setSelectedInpIdx] = useState<number | null>(null);
  const [customInput, setCustomInput] = useState<string>("");

  // Autoplay and interactive player states
  const [traceStr, setTraceStr] = useState<string>("");
  const [stepIdx, setStepIdx] = useState<number>(0); // how many characters have been consumed
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playIntervalMs, setPlayIntervalMs] = useState<number>(1000);
  
  // Machine View Toggle (DFA / PDA)
  const [viewMode, setViewMode] = useState<"dfa" | "pda">("dfa");
  
  // Code Copy Notification States
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showCodeHelper, setShowCodeHelper] = useState<boolean>(false);
  const [showCfgPopup, setShowCfgPopup] = useState<boolean>(false);
  const [showCfgTracePopup, setShowCfgTracePopup] = useState<boolean>(false);
  const [showPdaPopup, setShowPdaPopup] = useState<boolean>(false);
  const [showStateMeaningsPopup, setShowStateMeaningsPopup] = useState<boolean>(false);
  const [showTransitionsPopup, setShowTransitionsPopup] = useState<boolean>(false);
  const [copiedCfg, setCopiedCfg] = useState<boolean>(false);

  const handleCopyCfg = (rules: string) => {
    navigator.clipboard.writeText(rules).then(() => {
      setCopiedCfg(true);
      setTimeout(() => setCopiedCfg(false), 2000);
    });
  };

  const activeDfa = DFA_DATA[tabIdx];

  // Run validation on any string over the chosen DFA configuration
  const validateString = (tab: number, str: string): boolean => {
    const dfa = DFA_DATA[tab];
    let cur = dfa.START;
    for (const ch of str) {
      const next = dfa.T[cur]?.[ch];
      if (next === undefined) return false;
      cur = next;
    }
    return dfa.ACC.has(cur);
  };

  // Run full simulation to extract entire path transitions
  const simulateString = (tab: number, str: string): number[] => {
    const dfa = DFA_DATA[tab];
    let cur = dfa.START;
    const path: number[] = [cur];
    for (const ch of str) {
      const next = dfa.T[cur]?.[ch];
      if (next === undefined) break;
      cur = next;
      path.push(cur);
    }
    return path;
  };

  const path = simulateString(tabIdx, traceStr);
  const currentActiveState = path[stepIdx] !== undefined ? path[stepIdx] : activeDfa.START;

  // Memoize PDA tracing paths dynamically
  const pdaPath = useMemo(() => {
    return getPdaTracePath(tabIdx, traceStr);
  }, [tabIdx, traceStr]);

  // Handle auto-play stepping
  useEffect(() => {
    let timer: any = null;
    const maxSteps = viewMode === "pda" ? pdaPath.length - 1 : traceStr.length;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIdx((prev) => {
          if (prev >= maxSteps) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playIntervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, playIntervalMs, traceStr, viewMode, pdaPath]);

  // Sync state trace whenever selected input changes
  useEffect(() => {
    setStepIdx(0);
  }, [traceStr, viewMode]);

  // Handle Tab Switch
  const handleTabSwitch = (idx: number) => {
    setTabIdx(idx);
    setViewMode("dfa"); // Reset back to DFA on tab switch
    setIsPlaying(false);
    setSelectedInpIdx(null);
    setTraceStr("");
    setCustomInput("");
  };

  // Handle Sidebar batch field modifications
  const handleInputChange = (fieldIdx: number, val: string) => {
    // Sanitize values to only include allowed alphabets in bounds
    const sanitized = tabIdx === 0 
      ? val.toLowerCase().replace(/[^ab]/g, "") 
      : val.replace(/[^01]/g, "");
    
    const nextInputs = [...inputs];
    nextInputs[tabIdx][fieldIdx] = sanitized;
    setInputs(nextInputs);

    // If typing inside the currently traced index field, sync active string
    if (selectedInpIdx === fieldIdx) {
      setTraceStr(sanitized);
    }
  };

  const handleCustomInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = tabIdx === 0 
      ? customInput.toLowerCase().replace(/[^ab]/g, "") 
      : customInput.replace(/[^01]/g, "");
    
    if (sanitized) {
      setTraceStr(sanitized);
      setSelectedInpIdx(null); // Deselect canned slots
      setCustomInput("");
    }
  };

  // Reset Visual Tracker values
  const handleResetTrace = () => {
    setStepIdx(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    const maxSteps = viewMode === "pda" ? pdaPath.length - 1 : traceStr.length;
    if (stepIdx < maxSteps) {
      setStepIdx(stepIdx + 1);
    }
  };

  const handleStepBackward = () => {
    if (stepIdx > 0) {
      setStepIdx(stepIdx - 1);
    }
  };

  const handleAutoplayToggle = () => {
    const maxSteps = viewMode === "pda" ? pdaPath.length - 1 : traceStr.length;
    if (stepIdx >= maxSteps) {
      // Loop around if at the end of tape
      setStepIdx(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleCannedTrace = (val: string, index: number) => {
    setTraceStr(val);
    setSelectedInpIdx(index);
    setStepIdx(0);
    setIsPlaying(true);
  };

  const handleClearInputs = () => {
    const nextInputs = [...inputs];
    nextInputs[tabIdx] = ["", "", "", "", ""];
    setInputs(nextInputs);
    setTraceStr("");
    setSelectedInpIdx(null);
    setStepIdx(0);
    setIsPlaying(false);
  };

  // Generate PDA Breadcrumbs sequence
  const renderedPdaTracePath = () => {
    if (!traceStr || pdaPath.length === 0) return null;
    
    const elements: React.ReactNode[] = [];
    pdaPath.slice(0, stepIdx + 1).forEach((step, idx) => {
      const isLast = idx === stepIdx;
      // Map node name for display cleanly
      let displayLabel = step.nodeId.toUpperCase();
      if (step.nodeId.startsWith('acc')) {
        displayLabel = "ACCEPT";
      } else if (step.nodeId.startsWith('rej')) {
        displayLabel = "REJECT";
      } else if (step.nodeId === "n10") {
        displayLabel = "JUNCTION";
      } else if (step.nodeId.startsWith('n2_')) {
        displayLabel = `READ ${step.nodeId.substring(3)}`;
      } else if (step.nodeId.startsWith('n')) {
        displayLabel = `READ ${step.nodeId.substring(1)}`;
      }
      
      const isAccept = step.nodeId.startsWith('acc');
      const isReject = step.nodeId.startsWith('rej');
      const isStart = step.nodeId.startsWith('start');
      
      if (idx > 0) {
        elements.push(
          <ChevronRight key={`pda-arrow-${idx}`} size={12} className={`${tabIdx === 1 ? "text-purple-400" : "text-indigo-400"} flex-shrink-0`} />
        );
      }
      
      elements.push(
        <span
          key={`pda-step-${idx}`}
          className={`px-2 py-0.5 rounded border font-bold font-mono text-[9.5px] transition-all flex items-center gap-1 shrink-0 ${
            isLast
              ? isAccept
                ? "bg-emerald-600 text-white border-emerald-700 font-sans px-2.5"
                : isReject
                ? "bg-rose-600 text-white border-rose-700 font-sans px-2.5"
                : (tabIdx === 1 ? "bg-purple-600 text-white border-purple-700" : "bg-indigo-600 text-white border-indigo-700")
              : isAccept
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-sans"
              : isReject
              ? "bg-rose-50 text-rose-700 border-rose-200 font-sans"
              : isStart
              ? "bg-slate-100 text-slate-500 border-slate-200"
              : (tabIdx === 1 ? "bg-purple-50 text-purple-700 border-purple-100" : "bg-indigo-50 text-indigo-700 border-indigo-100")
          }`}
        >
          {isAccept && <Check size={10} strokeWidth={3} />}
          {isReject && <X size={10} strokeWidth={3} />}
          {displayLabel}
          {step.consumedChar && (
            <span className={`ml-1 px-1 py-[0.5px] text-[8.5px] font-black rounded ${
              isLast 
                ? (tabIdx === 1 ? "bg-purple-900 text-purple-200" : "bg-indigo-900 text-indigo-205") 
                : (tabIdx === 1 ? "bg-purple-100 text-purple-800" : "bg-indigo-100 text-indigo-800")
            }`}>
              {step.consumedChar}
            </span>
          )}
        </span>
      );
    });

    return elements;
  };

  // Generate Breadcrumbs Trace path sequence
  const renderedTracePath = () => {
    if (!traceStr) return null;
    if (viewMode === "pda") {
      return renderedPdaTracePath();
    }
    
    const elements: React.ReactNode[] = [];
    
    // Starting Node
    const startVal = path[0];
    const isFirstActive = stepIdx === 0;
    elements.push(
      <span
        key="state-0"
        className={`px-3 py-1 rounded border font-bold text-xs transition-colors duration-200 ${
          isFirstActive
            ? (tabIdx === 1 
                ? "bg-purple-600 text-white border-purple-700 shadow-sm shadow-purple-100" 
                : "bg-indigo-600 text-white border-indigo-700 shadow-sm shadow-indigo-100")
            : (tabIdx === 1
                ? "bg-purple-100 text-[#7c3aed] border-[#cbd5e1]"
                : "bg-[#e0e7ff] text-[#4f46e5] border-[#cbd5e1]")
        }`}
      >
        —
      </span>
    );

    // Iterating step transitions
    for (let i = 0; i < traceStr.length; i++) {
      const activeStateAtStep = path[i + 1];
      const isTraversed = i < stepIdx;
      const isCurrent = i + 1 === stepIdx;
      
      elements.push(
        <ChevronRight
          key={`arrow-${i}`}
          size={12}
          className={`${isTraversed ? (tabIdx === 1 ? "text-purple-500" : "text-indigo-500") : "text-slate-300"}`}
        />
      );

      const label = activeDfa.labels[activeStateAtStep] || `q${activeStateAtStep}`;
      let bgStyle = "bg-slate-100 text-slate-500 border-slate-200";
      if (isCurrent) {
        bgStyle = tabIdx === 1
          ? "bg-purple-600 text-white border-purple-700 shadow-sm shadow-purple-100 animate-pulse"
          : "bg-indigo-600 text-white border-indigo-700 shadow-sm shadow-indigo-100 animate-pulse";
      } else if (isTraversed) {
        if (activeDfa.ACC.has(activeStateAtStep)) {
          bgStyle = "bg-[#d1fae5] text-[#059669] border-[#a7f3d0]";
        } else if (activeDfa.dead.has(activeStateAtStep)) {
          bgStyle = "bg-[#fee2e2] text-[#dc2626] border-[#fca5a5]";
        } else {
          bgStyle = "bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]";
        }
      }

      elements.push(
        <div key={`state-bubble-${i}`} className="flex flex-col items-center">
          <span
            className={`px-2 py-0.5 rounded-sm border font-bold text-[11px] transition-colors duration-200 ${bgStyle}`}
          >
            {label}
          </span>
          <span className="text-[8px] text-slate-400 mt-0.5 max-[500px]:hidden font-mono">
            {traceStr[i]}
          </span>
        </div>
      );
    }

    return elements;
  };

  const copyBeginnerCode = () => {
    const codeString = `/**
 * Custom DFA 1 transition table mapped from DFA diagram.
 * Symbol alphabet: {a, b}
 * '-' maps to state 0 (Start)
 * 'T' maps to states 15/16/17 (Trap states)
 * '+' maps to state 13 (Top Accept with 'a' loop) and 14 (Bottom Accept with 'b' loop)
 */
const transitions = {
  0: { a: 2, b: 1 },     // state 0 (-)
  1: { a: 3, b: 4 },     // state 1 (q1)
  2: { a: 6, b: 4 },     // state 2 (q2)
  3: { a: 15, b: 5 },    // state 3 (q3)
  4: { a: 8, b: 16 },    // state 4 (q4)
  5: { a: 8, b: 1 },     // state 5 (q5)
  6: { a: 17, b: 7 },    // state 6 (q6)
  7: { a: 9, b: 17 },    // state 7 (q7)
  8: { a: 16, b: 9 },    // state 8 (q8)
  9: { a: 10, b: 10 },   // state 9 (q9)
  10: { a: 11, b: 12 },  // state 10 (q10)
  11: { a: 13, b: 12 },  // state 11 (q11)
  12: { a: 11, b: 14 },  // state 12 (q12)
  13: { a: 13, b: 12 },  // state 13 (+) -> Accept Top. Goes to q12 on 'b'
  14: { a: 11, b: 14 },  // state 14 (+) -> Accept Bottom. Goes to q11 on 'a'
  15: { a: 15, b: 15 },  // state 15 (T) -> Top Trap
  16: { a: 16, b: 16 },  // state 16 (T) -> Middle Trap
  17: { a: 17, b: 17 }   // state 17 (T) -> Left Trap
};

const startState = 0;
const finalAcceptingStates = [13, 14];

// Validation function that follows transitions step-by-step
function validateString(input) {
  let currentState = startState;
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    
    // Check if input symbol is legal
    if (char !== "a" && char !== "b") {
      return false; // Illegal symbol
    }
    
    // Move to the next state
    currentState = transitions[currentState][char];
    
    // Early exit if the input reaches T
    if (currentState === 15 || currentState === 16 || currentState === 17) {
      return false; // Trapped
    }
  }
  
  // Return true if final state after full string is accepting
  return finalAcceptingStates.includes(currentState);
}

// Simulation function returning path trace
function simulateString(input) {
  let currentState = startState;
  const path = [currentState];
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char !== "a" && char !== "b") {
      return { path, valid: false, error: "Illegal character" };
    }
    currentState = transitions[currentState][char];
    path.push(currentState);
  }
  
  const valid = finalAcceptingStates.includes(currentState);
  return { path, valid };
}`;

    navigator.clipboard.writeText(codeString)
      .then(() => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans">
      {/* topbar */}
      <header className="h-[55px] flex-shrink-0 bg-white border-b border-slate-200/80 shadow-xs flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 px-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            title="Toggle batch tester side bar panel"
          >
            <Menu size={16} />
          </button>
          <div className="flex flex-col">
            <div className={`text-sm font-display font-extrabold tracking-wide uppercase transition-colors ${
              tabIdx === 1 ? "text-purple-700" : "text-indigo-700"
            }`}>
              AUTOMATES
            </div>
            <div className="text-[10px] text-slate-500 font-medium tracking-wide font-sans">
              DFA Verifier &middot; Batch Test &middot; Visual Tracer
            </div>
          </div>

          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 ml-6">
            <button
              onClick={() => handleTabSwitch(0)}
              className={`px-4 py-1.5 rounded-md text-[10px] font-display font-bold tracking-wider transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                tabIdx === 0
                  ? "bg-white text-indigo-600 shadow-xs border-slate-200"
                  : "text-slate-500 hover:text-indigo-600"
              }`}
            >
              <Sparkles size={11} className={tabIdx === 0 ? "text-indigo-500" : "text-slate-400"} />
              DFA 1 (REGEX 1)
            </button>
            <button
              onClick={() => handleTabSwitch(1)}
              className={`px-4 py-1.5 rounded-md text-[10px] font-display font-bold tracking-wider transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                tabIdx === 1
                  ? "bg-white text-purple-600 shadow-xs border-slate-200"
                  : "text-slate-500 hover:text-purple-600"
              }`}
            >
              <Database size={11} className={tabIdx === 1 ? "text-purple-500" : "text-slate-400"} />
              DFA 2 (REGEX 2)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500 bg-slate-1 w-auto border border-slate-200 rounded px-2.5 py-1 font-semibold font-mono mr-2">
            ALPHABET: {tabIdx === 0 ? "[a, b]" : "[0, 1]"}
          </span>
          <button
            onClick={() => setShowCodeHelper(!showCodeHelper)}
            className={`text-[10px] border font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              tabIdx === 1
                ? "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200/70"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200/70"
            }`}
          >
            <FileCode size={12} />
            Show States &amp; Code
          </button>
          <button
            onClick={() => setShowPdaPopup(true)}
            className="text-[10px] bg-teal-50 text-teal-700 hover:bg-teal-100/80 border border-teal-200/70 font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Database size={11} className="text-teal-600" />
            View PDA Reference
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar for Batch Testing */}
        <aside
          className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 relative shadow-sm z-10 ${
            sidebarCollapsed ? "w-0 overflow-hidden border-r-0" : "w-[300px]"
          }`}
        >
          <div className="w-[300px] flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden p-4 gap-4">
            
            {/* Context Header */}
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold font-sans flex items-center gap-1">
                <span>Batch testing inputs</span>
                <span className="h-px bg-slate-200 flex-1 ml-2" />
              </div>
              <p className="text-[9px] text-slate-400 leading-normal mt-1.5 font-sans">
                Type test inputs below. Tap on <span className={`font-bold ${tabIdx === 1 ? "text-purple-600" : "text-indigo-600"}`}>⟶ Trace</span> to feed that string directly into the step simulator.
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="flex flex-col gap-3">
              {inputs[tabIdx].map((val, idx) => {
                const isValid = validateString(tabIdx, val);
                const hasValue = val.length > 0;
                const isSelected = traceStr === val && selectedInpIdx === idx;

                return (
                  <div key={`input-row-${idx}`} className="flex flex-col gap-1.5 p-2 rounded-md border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-300 font-bold tracking-tight">#{idx + 1}</span>
                      <input
                        type="text"
                        value={val}
                        placeholder={tabIdx === 0 ? "e.g. aabaaaa" : "e.g. 001101"}
                        onChange={(e) => handleInputChange(idx, e.target.value)}
                        className={`flex-1 min-width-0 px-2.5 py-1 text-xs font-mono font-bold border rounded outline-none transition-all ${
                          !hasValue
                            ? "border-slate-200 bg-white"
                            : isValid
                            ? "border-emerald-300 bg-emerald-50/30 text-emerald-800 focus:border-emerald-500"
                            : "border-rose-200 bg-rose-50/20 text-rose-800 focus:border-rose-400"
                        }`}
                      />
                    </div>
                    
                    {/* Input controls & badges */}
                    <div className="flex items-center justify-between pl-6 mt-0.5">
                      {hasValue ? (
                        <span
                          className={`text-[8px] font-bold px-2 py-0.5 rounded border ${
                            isValid
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-rose-50 text-rose-600 border-rose-200"
                          }`}
                        >
                          {isValid ? "✓ ACCEPT" : "✗ REJECT"}
                        </span>
                      ) : (
                        <span className="text-[8px] text-slate-300 font-normal italic">Empty</span>
                      )}

                      {hasValue && (
                        <button
                          onClick={() => handleCannedTrace(val, idx)}
                          className={`text-[9px] px-2.5 py-0.5 rounded font-bold transition-all flex items-center gap-1 border cursor-pointer ${
                            isSelected
                              ? (tabIdx === 1 
                                  ? "bg-purple-600 border-purple-700 text-white shadow-xs" 
                                  : "bg-indigo-600 border-indigo-700 text-white shadow-xs")
                              : (tabIdx === 1
                                  ? "bg-white border-slate-200 text-slate-500 hover:text-purple-600 hover:border-purple-300"
                                  : "bg-white border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300")
                          }`}
                        >
                          ⟶ Trace
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar action buttons */}
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handleClearInputs}
                className="w-full text-[10px] bg-white border border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-600 font-bold py-1.5 rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 size={12} />
                Clear Inputs
              </button>
              <button
                onClick={() => setShowStateMeaningsPopup(true)}
                className={`w-full text-[10.5px] text-white font-extrabold py-2 rounded flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all ${
                  tabIdx === 1 ? "bg-purple-600 hover:bg-purple-700" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                title="View conceptual state definitions"
              >
                <Info size={13} strokeWidth={2.5} />
                State Meanings Dict
              </button>
              <button
                onClick={() => setShowTransitionsPopup(true)}
                className="w-full text-[10.5px] bg-slate-800 hover:bg-slate-900 text-white font-extrabold py-2 rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="View State Transition Table Matrix"
              >
                <Table size={13} strokeWidth={2.5} />
                Transition Table Matrix
              </button>
            </div>

          </div>
        </aside>

        {/* Core Content Layout */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          
          {/* Regex Ribbon strip */}
          <section className="bg-white border-b border-slate-200 p-3 px-4 flex-shrink-0 flex items-center justify-between flex-wrap gap-2 shadow-sm">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Regex Pattern Structure</span>
              <div className="text-sm font-semibold truncate flex items-center gap-3 font-sans mt-0.5">
                {tabIdx === 0 ? (
                  <>
                    <span className="font-mono text-indigo-700 bg-indigo-50/70 border border-indigo-100/60 font-bold px-1.5 py-0.5 rounded tracking-tight">
                      (bab)* (b + a) (bab + aba) (a + b)* (aa + bb)* (b + a + bb) (a + b)* (aa + bb)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-mono text-purple-700 bg-purple-50/70 border border-purple-100/60 font-bold px-1.5 py-0.5 rounded tracking-tight">
                      (1+0)*(11+00)(00+11)*(1+0+11)(1+0+11)*(101+111)(101+111)*(1+0*+11)(1+0*+11)*
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-center">
              <span className="text-[9px] text-slate-400 font-sans font-semibold">Shortest Acceptance Size:</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 font-bold rounded">
                {tabIdx === 0 ? '7 ("aabaaaa")' : '5 ("00101")'}
              </span>
            </div>
          </section>

          {/* Trace tape panel with step visualization */}
          <section className="bg-[#f1f3fa] border-b border-slate-200 p-3 px-4 flex-shrink-0 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Dynamic Trace tape</span>
                  <span className="text-[9.5px] bg-slate-200 text-slate-600 px-1.5 py-0.5 font-bold rounded shadow-sm font-mono">
                    {viewMode === "pda" ? (pdaPath[stepIdx]?.consumedChar === 'Δ' || stepIdx === pdaPath.length - 1 ? traceStr.length : Math.max(0, pdaPath[stepIdx]?.charIdx || 0)) : stepIdx} / {traceStr.length} chars
                  </span>
                </div>
                
                {/* Autoplay controllers */}
                <div className="flex items-center gap-1 bg-white border border-slate-205 p-0.5 rounded shadow-xs">
                  <button
                    onClick={handleStepBackward}
                    disabled={stepIdx === 0}
                    className={`p-1 px-1.5 text-slate-500 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors rounded cursor-pointer ${
                      tabIdx === 1 ? "hover:text-purple-600" : "hover:text-indigo-600"
                    }`}
                    title="Step backward"
                  >
                    <SkipBack size={12} />
                  </button>
                  <button
                    onClick={handleAutoplayToggle}
                    className={`p-1 px-2.5 rounded transition-colors cursor-pointer flex items-center justify-center ${
                      tabIdx === 1
                        ? "text-purple-600 hover:bg-purple-50/50"
                        : "text-indigo-600 hover:bg-slate-50"
                    }`}
                    title={isPlaying ? "Pause Trace Animation" : "Resume Trace Animation"}
                  >
                    {isPlaying ? <Pause size={12} fill="currentColor" strokeWidth={2.5} /> : <Play size={12} fill="currentColor" strokeWidth={2.5} />}
                  </button>
                  <button
                    onClick={handleStepForward}
                    disabled={stepIdx >= (viewMode === "pda" ? pdaPath.length - 1 : traceStr.length)}
                    className={`p-1 px-1.5 text-slate-500 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors rounded cursor-pointer ${
                      tabIdx === 1 ? "hover:text-purple-600" : "hover:text-indigo-600"
                    }`}
                    title="Step forward"
                  >
                    <SkipForward size={12} />
                  </button>
                  <button
                    onClick={handleResetTrace}
                    className="p-1 px-1.5 text-slate-500 hover:text-rose-600 transition-colors rounded border-l border-slate-100 cursor-pointer"
                    title="Reset Simulator"
                  >
                    <RotateCcw size={12} />
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded shadow-xs text-[9px] text-slate-400">
                  <span className="font-bold">Speed:</span>
                  <select
                    value={playIntervalMs}
                    onChange={(e) => setPlayIntervalMs(Number(e.target.value))}
                    className={`border-none bg-none outline-none font-extrabold cursor-pointer ${
                      tabIdx === 1 ? "text-purple-700" : "text-indigo-700"
                    }`}
                  >
                    <option value="2000">Slow (2s)</option>
                    <option value="1000">Normal (1s)</option>
                    <option value="600">Fast (0.6s)</option>
                    <option value="300">Blazing (0.3s)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isPlaying && (
                  <span className={`text-[8px] border px-1.5 py-0.5 font-extrabold rounded animate-pulse flex items-center gap-1.5 ${
                    tabIdx === 1
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "bg-indigo-50 text-indigo-700 border-indigo-200"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full animate-ping ${
                      tabIdx === 1 ? "bg-purple-600" : "bg-indigo-600"
                    }`} />
                    ANIMATING...
                  </span>
                )}

                {traceStr && (
                  <button
                    onClick={() => setShowCfgTracePopup(true)}
                    className="text-[10px] bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border border-amber-300/60 font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    title="Simulate this string's decomposition and leftmost derivation in the grammar"
                  >
                    <Sparkles size={11} className="text-amber-500" />
                    Trace on CFG
                  </button>
                )}

                <button
                  onClick={() => setShowCfgPopup(true)}
                  className="text-[10px] bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border border-amber-300/60 font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Sparkles size={11} className="text-amber-500" />
                  View CFG
                </button>
              </div>
            </div>

            {/* Breadcrumb representation of parsed tape nodes */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-2.5 border border-slate-200 flex-wrap overflow-x-auto min-h-[46px]">
              {renderedTracePath() || (
                <div className="text-[10px] text-slate-400 italic font-medium w-full text-center py-1">
                  &mdash; Type or select a string from the left sidebar to run the visual step simulator &mdash;
                </div>
              )}
            </div>

            {/* Final Outcome details */}
            {traceStr && (
              <div className="flex items-center justify-between text-[10.5px] border-t border-slate-200/60 pt-2 px-1 font-sans">
                <div className="flex items-center gap-1 text-slate-500 overflow-hidden text-ellipsis mr-2 whitespace-nowrap min-w-0">
                  <span>Current Path:</span> 
                  <span className={`font-bold font-mono ${
                    tabIdx === 1 ? "text-purple-600" : "text-indigo-600"
                  }`}>
                    {viewMode === "pda"
                      ? `→ ` + pdaPath.slice(0, stepIdx + 1).map(step => step.nodeId.toUpperCase().replace(/^N/, "READ ")).join(" → ")
                      : `→ ` + path.slice(0, stepIdx + 1).map(s => activeDfa.labels[s]).join(" → ")
                    }
                  </span>
                </div>
                
                <div className="flex-shrink-0">
                  {(stepIdx >= (viewMode === "pda" ? pdaPath.length - 1 : traceStr.length)) ? (
                    <div className="flex items-center gap-1 font-mono">
                      <span className="text-[9px] text-slate-400 font-bold uppercase mr-1 font-sans">Final Result:</span>
                      {(viewMode === "pda" ? pdaPath[stepIdx]?.nodeId.startsWith("acc") : activeDfa.ACC.has(currentActiveState)) ? (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded px-2 py-0.5 flex items-center gap-1">
                          <Check size={11} strokeWidth={3} /> ACCEPTED
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-800 border border-rose-300 font-bold rounded px-2 py-0.5 flex items-center gap-1">
                          <X size={11} strokeWidth={3} /> REJECTED
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-400 italic">
                      <RefreshCw size={10} className={`animate-spin ${
                        tabIdx === 1 ? "text-purple-500" : "text-indigo-500"
                      }`} />
                      <span>Feeding tape input... Click Auto Play or Step Forward</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Graphical row for Canvas */}
          <section className="flex-1 flex overflow-hidden min-h-0 relative min-w-0">
            {/* React state visual simulation canvas */}
            <div className="flex-1 relative h-full">
              
              {/* Floating Selector control to toggle between DFA and PDA */}
              <div className="absolute top-3 left-4 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-lg border border-slate-200 shadow-md z-20 flex items-center gap-1 font-sans">
                <button
                  onClick={() => setViewMode("dfa")}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    viewMode === "dfa"
                      ? (tabIdx === 1 ? "bg-purple-600 text-white shadow-xs" : "bg-indigo-600 text-white shadow-xs")
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  DFA Automaton
                </button>
                <button
                  onClick={() => setViewMode("pda")}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    viewMode === "pda"
                      ? (tabIdx === 1 ? "bg-purple-600 text-white shadow-xs" : "bg-indigo-600 text-white shadow-xs")
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                  title="Switch to PDA Flowchart Tracer"
                >
                  PDA Flowchart
                </button>
              </div>

              {viewMode === "pda" ? (
                <PdaCanvas
                  traceStr={traceStr}
                  stepIdx={stepIdx}
                  pdaPath={pdaPath}
                  isPlaying={isPlaying}
                  tabIdx={tabIdx}
                />
              ) : (
                <>
                  <DfaCanvas
                    dfa={activeDfa}
                    tabIdx={tabIdx}
                    activeState={currentActiveState}
                    path={path}
                    stepIdx={stepIdx}
                  />

                  {/* Float Legend Overlay on the Canvas */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md border border-slate-200/80 p-2.5 rounded-lg shadow-md max-w-[150px] font-sans flex flex-col gap-1.5 pointer-events-none select-none z-10">
                    <span className="text-[8px] text-slate-400 uppercase tracking-widest font-extrabold font-display">Legend colors</span>
                    <div className="flex flex-col gap-1 text-[9px]">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full border shadow-xs animate-pulse ${
                          tabIdx === 1 ? "bg-purple-600 border-purple-700" : "bg-indigo-600 border-indigo-700"
                         }`} />
                        <span className="font-bold text-slate-700">Active State</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-200 border border-emerald-600" />
                        <span className="text-slate-700 font-bold">Accepting State</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-rose-200 border border-rose-600" />
                        <span className="text-slate-700 font-bold">Trap Node</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[8.5px]">
                        <span className={`h-2 w-2 rounded-full border ${
                          tabIdx === 1 ? "bg-purple-100 border-purple-500" : "bg-[#e0e7ff] border-indigo-505"
                        }`} />
                        <span className="text-slate-500 font-medium">Input Start —</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

        </main>

      </div>

      {/* Code Export / Copy States Helper Drawer Sheet Modal */}
      {showCodeHelper && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full flex flex-col h-[80vh] overflow-hidden font-sans">
            <div className="p-4 px-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileCode size={18} className={tabIdx === 1 ? "text-purple-600" : "text-indigo-600"} />
                <h3 className="font-sans font-bold text-slate-800 text-[14px]">
                  Custom DFA Transition States &amp; Code Exports
                </h3>
              </div>
              <button
                onClick={() => setShowCodeHelper(false)}
                className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-600 transition"
                title="Close overlay popup"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 text-xs flex flex-col gap-4 font-sans text-slate-600 leading-relaxed">
              
              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-900 font-medium">
                <strong>📝 Important diagram correction applied:</strong>
                <ul className="list-disc pl-5 mt-1.5 flex flex-col gap-1 text-[11px]">
                  <li>State q9 labeled &apos;a&apos; is mapped internally to <code className="font-mono bg-amber-100 p-0.5 rounded font-bold">state 9</code>.</li>
                  <li>State q10 labeled &apos;b&apos; is mapped internally to <code className="font-mono bg-amber-100 p-0.5 rounded font-bold">state 10</code>.</li>
                  <li>The accepting state with continuous loop &apos;a&apos; maps to <code className="font-mono bg-amber-100 p-0.5 rounded font-bold">state 12</code> (+) and has a transition to state 10 (q10) labeled &apos;b&apos;.</li>
                  <li>The accepting state with continuous loop &apos;b&apos; maps to <code className="font-mono bg-amber-100 p-0.5 rounded font-bold">state 13</code> (+) and has a transition to state 9 (q9) labeled &apos;a&apos;.</li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-slate-800 text-[12px] mb-1 font-mono">DFA Transition representation (object table format)</p>
                <p className="text-[11px] mb-3 text-slate-500">
                  You can easily copy this transition layout and paste it into your homework, assignments, or existing simulator website scripts.
                </p>
                
                <div className="relative">
                  <pre className="p-3 bg-slate-900 text-slate-300 rounded font-mono text-[9.5px] leading-relaxed overflow-x-auto max-h-[350px]">
                    {`const dfaStates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const startState = 0;
const finalStates = [12, 13];

const transitions = {
  0: { a: 2, b: 1 },    // state 0 (-)
  1: { a: 3, b: 5 },    // state 1 (q1)
  2: { a: 2, b: 5 },    // state 2 (q2)
  3: { a: 11, b: 4 },   // state 3 (q3)
  4: { a: 7, b: 1 },    // state 4 (q4)
  5: { a: 6, b: 14 },   // state 5 (q5)
  6: { a: 8, b: 7 },    // state 6 (q6)
  7: { a: 8, b: 8 },    // state 7 (q7)
  8: { a: 9, b: 10 },   // state 8 (q8)
  9: { a: 12, b: 10 },  // state 9 (q9)
  10: { a: 9, b: 13 },  // state 10 (q10)
  11: { a: 11, b: 11 }, // state 11 (T1) -> Trap
  12: { a: 12, b: 10 }, // state 12 (+) -> Accept A. Traverses down to q10 on 'b'
  13: { a: 9, b: 13 },  // state 13 (+) -> Accept B. Traverses up to q9 on 'a'
  14: { a: 14, b: 14 }  // state 14 (T2) -> Trap
};`}
                  </pre>

                  <button
                    onClick={copyBeginnerCode}
                    className="absolute top-2 right-2 flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded px-2.5 py-1 z-10 transition border border-slate-700"
                    title="Copy snippet"
                  >
                    {copiedCode ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copiedCode ? "Copied!" : "Copy Code"}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 px-5 border-t border-slate-200 flex-shrink-0 flex justify-end">
              <button
                onClick={() => setShowCodeHelper(false)}
                className={`text-white text-xs font-bold px-4 py-2 rounded transition shadow-xs cursor-pointer ${
                  tabIdx === 1 ? "bg-purple-600 hover:bg-purple-700" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conceptual State Meanings Dictionary Modal Popup */}
      {showStateMeaningsPopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full flex flex-col max-h-[85vh] overflow-hidden font-sans">
            <div className="p-4 px-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Info size={18} className={tabIdx === 1 ? "text-purple-600" : "text-indigo-600"} />
                <h3 className="font-sans font-extrabold text-slate-800 text-[14px] uppercase tracking-wide">
                  Conceptual State Meanings &mdash; {tabIdx === 0 ? "DFA 1" : "DFA 2"}
                </h3>
              </div>
              <button
                onClick={() => setShowStateMeaningsPopup(false)}
                className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-600 transition cursor-pointer"
                title="Close dictionary"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 text-xs flex flex-col gap-3 font-sans text-slate-600 leading-relaxed">
              <div className="bg-purple-50 border border-purple-150 rounded-lg p-3 text-purple-900 font-medium">
                <strong>💡 State Ingestion & Semantic Meaning:</strong>
                <p className="text-[11px] mt-1 leading-normal">
                  In formal automata theory, each state denotes a specific substring pattern matched so far. Review the semantic meanings below to understand how the DFA processes characters sequentially.
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                {activeDfa.DESC.map((meaning, id) => {
                  const isAccepting = activeDfa.ACC.has(id);
                  const isDead = activeDfa.dead.has(id);
                  const isStart = id === activeDfa.START;
                  const isActive = currentActiveState === id;

                  return (
                    <div 
                      key={`modal-meaning-${id}`}
                      className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                        isActive 
                          ? "bg-purple-100 border-purple-400 ring-2 ring-purple-500/15" 
                          : "bg-purple-50/20 border-purple-200"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className={`h-8 w-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                          isActive 
                            ? "bg-purple-600 text-white shadow-xs font-black" 
                            : isAccepting 
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                            : isDead 
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : "bg-white text-purple-800 border border-purple-150"
                        }`}>
                          {activeDfa.labels[id]}
                        </span>
                        {isActive && (
                          <span className="text-[7.5px] text-purple-600 font-extrabold uppercase animate-pulse mt-0.5">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-[10px] text-purple-400 font-bold">Node #{id}</span>
                          {isStart && (
                            <span className="text-[8px] bg-purple-100 text-purple-800 font-extrabold px-1.5 py-0.2 rounded border border-purple-200 uppercase scale-90">
                              Start State
                            </span>
                          )}
                          {isAccepting && (
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded border border-emerald-300 uppercase scale-90 flex items-center gap-0.5 animate-pulse">
                              ⭐ Accepting
                            </span>
                          )}
                          {isDead && (
                            <span className="text-[8px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.2 rounded border border-rose-350 uppercase scale-90">
                              Dead Trap
                            </span>
                          )}
                        </div>
                        <p className={`text-[11.5px] leading-relaxed ${isActive ? "text-purple-950 font-black" : "text-slate-600 font-medium"}`}>
                          {meaning}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 px-5 border-t border-slate-200 flex-shrink-0 flex justify-end bg-slate-50">
              <button
                onClick={() => setShowStateMeaningsPopup(false)}
                className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded transition shadow-xs cursor-pointer"
              >
                Close Dictionary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transitions Table Modal Matrix */}
      {showTransitionsPopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden font-sans">
            <div className="p-4 px-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Table size={18} className={tabIdx === 1 ? "text-purple-600" : "text-indigo-600"} />
                <h3 className="font-sans font-extrabold text-slate-800 text-[13px] uppercase tracking-wider">
                  Transition Matrix (δ) &mdash; {tabIdx === 0 ? "DFA 1 (REGEX 1)" : "DFA 2 (REGEX 2)"}
                </h3>
              </div>
              <button
                onClick={() => setShowTransitionsPopup(false)}
                className="p-1 rounded bg-slate-250 hover:bg-slate-300 text-slate-600 transition cursor-pointer"
                title="Close table"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 text-xs flex flex-col gap-4 font-sans text-slate-600 leading-relaxed">
              <div className={`border rounded-lg p-3 font-medium text-[11px] leading-relaxed flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-xs ${
                tabIdx === 1 ? "bg-purple-50 border-purple-150 text-purple-950" : "bg-indigo-50 border-indigo-150 text-indigo-950"
              }`}>
                <div>
                  <strong>⚡ Dynamic Transition Tracker:</strong>
                  <p className="mt-0.5 text-slate-600">
                    This table maps out how each state moves to the next depending on the input character.
                  </p>
                </div>
                <div className={`flex-shrink-0 flex items-center gap-1.5 bg-white border px-2.5 py-1 rounded-md shadow-xs ${
                  tabIdx === 1 ? "border-purple-250" : "border-indigo-250"
                }`}>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active State:</span>
                  <span className={`px-1.5 py-0.5 rounded text-white font-extrabold font-mono text-xs ${
                    tabIdx === 1 ? "bg-purple-600" : "bg-indigo-600"
                  }`}>{activeDfa.labels[currentActiveState]}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg shadow-sm relative overflow-auto max-h-[420px] sm:max-h-[480px]">
                <table className="w-full border-collapse text-left text-xs bg-white relative">
                  <thead className="sticky top-0 z-20 bg-slate-900">
                    <tr className="bg-slate-900 text-slate-200 text-[10px] border-b border-slate-800 font-bold uppercase tracking-wider font-display">
                      <th className="p-3 text-center w-24 border-r border-slate-800">State (q)</th>
                      <th className="p-3 text-center border-r border-slate-800 w-1/3">Input option δ({activeDfa.alpha[0]})</th>
                      <th className="p-3 text-center border-r border-slate-800 w-1/3">Input option δ({activeDfa.alpha[1]})</th>
                      <th className="p-3 text-center w-32">Accepts (F)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 font-mono text-[11px]">
                    {activeDfa.DESC.map((meaning, id) => {
                      const isActive = currentActiveState === id;
                      const isAccepting = activeDfa.ACC.has(id);
                      const isDead = activeDfa.dead.has(id);
                      const isStart = id === activeDfa.START;

                      const nextCh0Idx = activeDfa.T[id]?.[activeDfa.alpha[0]];
                      const nextCh0 = nextCh0Idx !== undefined 
                        ? `${activeDfa.labels[nextCh0Idx] || `q${nextCh0Idx}`}`
                        : "—";

                      const nextCh1Idx = activeDfa.T[id]?.[activeDfa.alpha[1]];
                      const nextCh1 = nextCh1Idx !== undefined 
                        ? `${activeDfa.labels[nextCh1Idx] || `q${nextCh1Idx}`}`
                        : "—";

                      return (
                        <tr
                          key={`modal-row-state-${id}`}
                          className={`transition-all duration-150 ${
                            isActive 
                              ? (tabIdx === 1 ? "bg-purple-100/60 border-l-4 border-l-purple-600 font-extrabold relative z-10" : "bg-indigo-50 border-l-4 border-l-indigo-600 font-extrabold relative z-10") 
                              : "text-slate-700 border-l-4 border-l-transparent"
                          }`}
                        >
                          <td className={`p-3 text-center border-r border-slate-200/65 font-mono text-[11.5px] ${isActive ? (tabIdx === 1 ? "text-purple-900 font-black" : "text-indigo-900 font-black") : "text-slate-800 font-semibold"}`}>
                            <div className="flex items-center justify-center gap-1.5">
                              {isStart && <span className={`text-[7.5px] px-1.5 py-0.2 rounded font-sans font-black border uppercase ${tabIdx === 1 ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-indigo-100 text-indigo-700 border-indigo-200"}`}>START</span>}
                              <span>{activeDfa.labels[id]}</span>
                            </div>
                          </td>
                          <td className={`p-3 text-center font-mono border-r border-slate-200/65 ${isActive ? (tabIdx === 1 ? "bg-purple-100/15 text-purple-900" : "bg-indigo-100/20 text-indigo-900") : "text-slate-600"}`}>
                            <span className={`px-3 py-0.5 rounded text-[11px] ${isActive ? (tabIdx === 1 ? "bg-purple-200 text-purple-900 border border-purple-300 font-extrabold" : "bg-indigo-200 text-indigo-900 border border-indigo-300 font-extrabold") : "bg-slate-50 text-slate-700 border border-slate-200"}`}>{nextCh0}</span>
                          </td>
                          <td className={`p-3 text-center font-mono border-r border-slate-200/65 ${isActive ? (tabIdx === 1 ? "bg-purple-100/15 text-purple-900" : "bg-indigo-100/20 text-indigo-900") : "text-slate-600"}`}>
                            <span className={`px-3 py-0.5 rounded text-[11px] ${isActive ? (tabIdx === 1 ? "bg-purple-200 text-purple-900 border border-purple-300 font-extrabold" : "bg-indigo-200 text-indigo-900 border border-indigo-300 font-extrabold") : "bg-slate-50 text-slate-700 border border-slate-200"}`}>{nextCh1}</span>
                          </td>
                          <td className="p-3 text-center font-sans">
                            {isAccepting ? (
                              <span className="inline-flex items-center gap-1 text-[8.5px] text-emerald-700 font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 shadow-xs animate-pulse">
                                ⭐ ACCEPT
                              </span>
                            ) : isDead ? (
                              <span className="inline-flex items-center gap-0.5 text-[8.5px] text-rose-600 font-bold px-1.5 py-0.2 rounded bg-rose-50 border border-rose-100">
                                DEAD NODE
                              </span>
                            ) : (
                              <span className="text-slate-300 font-normal font-mono">&mdash;</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="text-[10px] text-slate-400 text-center font-medium mt-1">
                Showing all {activeDfa.DESC.length} states. Scroll down to view the full matrix!
              </div>
            </div>

            <div className="p-4 px-5 border-t border-slate-200 flex-shrink-0 flex justify-end bg-slate-50">
              <button
                onClick={() => setShowTransitionsPopup(false)}
                className={`text-white text-xs font-bold px-4 py-2 rounded transition shadow-xs cursor-pointer ${
                  tabIdx === 1 ? "bg-purple-600 hover:bg-purple-700" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                Close Table Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CFG Modal Popup */}
      {showCfgPopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full flex flex-col max-h-[85vh] overflow-hidden font-sans">
            <div className="p-4 px-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                <h3 className="font-sans font-extrabold text-slate-800 text-[14px] uppercase tracking-wide">
                  Context-Free Grammar (CFG) &mdash; {tabIdx === 0 ? "DFA 1" : "DFA 2"}
                </h3>
              </div>
              <button
                onClick={() => setShowCfgPopup(false)}
                className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-600 transition"
                title="Close overlay popup"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 text-xs flex flex-col gap-4 font-sans text-slate-600 leading-relaxed">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900 font-medium">
                <strong>📝 Formal Grammar Definitions:</strong>
                <p className="text-[11px] mt-1 leading-normal">
                  Context-Free Grammars generate strings of the respective language of the regex. This grammar produces the set of strings accepted by {tabIdx === 0 ? "DFA 1 (Regex 1)" : "DFA 2 (Regex 2)"}.
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-800 text-[12px] mb-2 font-mono">Production Rules:</p>
                <div className="relative">
                  <pre className="p-4 bg-slate-900 text-slate-300 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto">
                    {tabIdx === 0 ? (
`S → ABCDEF 
A → babA | ε 
B → a | b 
C → bab | aba 
D → aD | bD | ε 
E → a | b | bb 
F → aF | bF | aa | bb`
                    ) : (
`S → ABCDE
A → 0A | 1A | ε
B → 00B | 11B | 00 | 11
C → 0C | 1C | 0 | 1
D → 101D | 111D | 101 | 111
E → 0E | 1E | ε`
                    )}
                  </pre>

                  <button
                    onClick={() => handleCopyCfg(tabIdx === 0 ? 
`S → ABCDEF 
A → babA | ε 
B → a | b 
C → bab | aba 
D → aD | bD | ε 
E → a | b | bb 
F → aF | bF | aa | bb` :
`S → ABCDE
A → 0A | 1A | ε
B → 00B | 11B | 00 | 11
C → 0C | 1C | 0 | 1
D → 101D | 111D | 101 | 111
E → 0E | 1E | ε`
                    )}
                    className="absolute top-2.5 right-2.5 flex items-center gap-1.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded px-2.5 py-1 z-10 transition border border-slate-700 cursor-pointer"
                    title="Copy configuration rules"
                  >
                    {copiedCfg ? <CheckCircle size={12} className="text-emerald-400" /> : <Copy size={11} />}
                    {copiedCfg ? "Copied!" : "Copy Grammar"}
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded p-3 text-[11px] text-slate-500">
                <span className="font-bold text-slate-700 block mb-1">Grammar Breakdown:</span>
                {tabIdx === 0 ? (
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong className="font-mono text-indigo-750">A</strong> produces any repeat of the <code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">bab</code> sequences.</li>
                    <li><strong className="font-mono text-indigo-750">B</strong> represents the single-character transition option <code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">a</code> or <code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">b</code>.</li>
                    <li><strong className="font-mono text-indigo-750">C</strong> generates the required matching patterns <code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">bab</code> or <code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">aba</code>.</li>
                    <li><strong className="font-mono text-indigo-750">D, E, F</strong> generate continuous loops, intermediate options, and double-run suffixes <code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">aa</code> or <code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">bb</code>.</li>
                  </ul>
                ) : (
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong className="font-mono text-purple-750">A, E</strong> allow arbitrary loops of <code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">0</code>s and <code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">1</code>s (<code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">(0+1)*</code> equivalent) at the start/ends.</li>
                    <li><strong className="font-mono text-purple-750">B</strong> yields mandatory initial matching runs <code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">00</code> or <code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">11</code>.</li>
                    <li><strong className="font-mono text-purple-750">C</strong> generates a single middle element spacer <code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">0</code> or <code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">1</code>.</li>
                    <li><strong className="font-mono text-purple-750">D</strong> generates mandatory target combinations of <code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">101</code> and <code className="bg-slate-100 font-mono text-slate-700 px-0.5 rounded">111</code>.</li>
                  </ul>
                )}
              </div>
            </div>

            <div className="p-4 px-5 border-t border-slate-200 flex-shrink-0 flex justify-end bg-slate-50">
              <button
                onClick={() => setShowCfgPopup(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded transition shadow-xs cursor-pointer"
              >
                Close Grammar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CFG Tracing Modal Popup */}
      {showCfgTracePopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden font-sans animate-fade-in">
            <div className="p-4 px-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className={tabIdx === 1 ? "text-purple-600" : "text-indigo-600"} />
                <h3 className="font-sans font-extrabold text-slate-800 text-[14px] uppercase tracking-wide">
                  Context-Free Grammar Tracing Tracer &mdash; {tabIdx === 0 ? "DFA 1 (CFG 1)" : "DFA 2 (CFG 2)"}
                </h3>
              </div>
              <button
                onClick={() => setShowCfgTracePopup(false)}
                className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-600 transition cursor-pointer"
                title="Close overlay popup"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 text-xs flex flex-col gap-4 font-sans text-slate-600 leading-relaxed">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-1.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-700 text-[11px]">Traced Tape String:</span>
                    <span className={`font-mono font-extrabold px-2 py-0.5 rounded text-[11px] shadow-2xs ${
                      tabIdx === 1 ? "bg-purple-50 text-purple-700 border border-purple-100" : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                    }`}>
                      {traceStr || "ε (Empty)"}
                    </span>
                  </div>
                  <div>
                    {traceStr ? (
                      validateString(tabIdx, traceStr) ? (
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-0.5 rounded text-[9px]">
                          ✓ member of regular language
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-800 border border-rose-300 font-bold px-2.5 py-0.5 rounded text-[9px]">
                          ✗ not in regular language
                        </span>
                      )
                    ) : (
                      <span className="bg-slate-100 text-slate-600 border border-slate-300 font-semibold px-2.5 py-0.5 rounded text-[9px]">
                        Empty
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {!traceStr ? (
                <div className="text-center py-10 text-slate-400 font-medium">
                  Please provide or select a test input string from the sidebar first to run the CFG mapping tracer!
                </div>
              ) : tabIdx === 0 ? (() => {
                const parsed = parseCFG1(traceStr);
                if (!parsed) {
                  return (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800 flex flex-col gap-2">
                      <strong className="text-[12px]">⚠️ No valid CFG Derivation found:</strong>
                      <p className="text-[11px] leading-normal">
                        This input string is rejected by the DFA, and is also not generated by the CFG production rules:
                        <code className="block bg-rose-100 p-1.5 rounded font-mono text-[10.5px] mt-1.5 max-w-max text-rose-900 border border-rose-200">
                          S → ABCDEF
                        </code>
                      </p>
                    </div>
                  );
                }

                const steps = generateCFG1Derivation(parsed);

                return (
                  <div className="flex flex-col gap-5">
                    {/* Partition block */}
                    <div>
                      <h4 className="font-bold text-slate-800 text-[11.5px] uppercase tracking-wider mb-2">
                        1. Context-Free Parsing & Substring Mapping
                      </h4>
                      <p className="text-[11px] text-slate-500 mb-3">
                        The string has been successfully decomposed into variables of the grammar layout <code className="bg-slate-100 font-mono px-1 rounded text-indigo-700 font-semibold">S → ABCDEF</code>:
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                        {[
                          { var: "A", desc: "bab repetition cycle (bab)*", val: parsed.A || "ε" },
                          { var: "B", desc: "Prefix separator (a | b)", val: parsed.B },
                          { var: "C", desc: "Core pattern choice (bab | aba)", val: parsed.C },
                          { var: "D", desc: "Middle loop sequence (a | b)*", val: parsed.D || "ε" },
                          { var: "E", desc: "Suffix spacer (a | b | bb)", val: parsed.E },
                          { var: "F", desc: "Final run (a | b)*(aa | bb)", val: parsed.F }
                        ].map((item, idx) => (
                          <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-lg p-2.5 flex flex-col gap-1 shadow-2xs hover:border-indigo-300 transition-colors">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-black text-indigo-600 text-xs bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5">{item.var}</span>
                              <span className={`font-mono text-xs font-bold px-1.5 py-0.2 rounded ${item.val === "ε" ? "text-slate-400 italic bg-slate-100" : "text-emerald-700 bg-emerald-50 border border-emerald-100"}`}>{item.val}</span>
                            </div>
                            <span className="text-[9.5px] text-slate-400 font-sans tracking-tight leading-tight mt-0.5">{item.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step-by-step Leftmost Derivation path */}
                    <div>
                      <h4 className="font-bold text-slate-800 text-[11.5px] uppercase tracking-wider mb-2">
                        2. Leftmost CFG Derivation Steps
                      </h4>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Each line replaces the leftmost variable using the active CFG rules to finally generate the target string:
                      </p>

                      <div className="bg-slate-900 rounded-lg p-3 text-slate-300 font-mono text-[11px] overflow-auto max-h-[300px] flex flex-col gap-1.5 shadow-md">
                        {steps.map((step, idx) => (
                          <div key={idx} className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 last:border-0 last:pb-0 gap-4">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-slate-600 select-none text-[9.5px] w-6 text-right">#{idx}</span>
                              {idx > 0 && <span className="text-indigo-400 select-none">↳</span>}
                              <span className="font-medium truncate text-slate-200 tracking-wide">{step.sententialForm}</span>
                            </div>
                            <span className="text-[10px] text-amber-400/90 font-bold whitespace-nowrap bg-slate-800/80 px-2 py-0.5 rounded border border-slate-800">
                              {step.ruleApplied}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })() : (() => {
                const parsed = parseCFG2(traceStr);
                if (!parsed) {
                  return (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800 flex flex-col gap-2">
                      <strong className="text-[12px]">⚠️ No valid CFG Derivation found:</strong>
                      <p className="text-[11px] leading-normal">
                        This input string is rejected by the DFA, and is also not generated by the CFG production rules:
                        <code className="block bg-rose-100 p-1.5 rounded font-mono text-[10.5px] mt-1.5 max-w-max text-rose-900 border border-rose-200">
                          S → ABCDE
                        </code>
                      </p>
                    </div>
                  );
                }

                const steps = generateCFG2Derivation(parsed);

                return (
                  <div className="flex flex-col gap-5">
                    {/* Partition block */}
                    <div>
                      <h4 className="font-bold text-slate-800 text-[11.5px] uppercase tracking-wider mb-2">
                        1. Context-Free Parsing & Substring Mapping
                      </h4>
                      <p className="text-[11px] text-slate-500 mb-3">
                        The string has been successfully decomposed into variables of the grammar layout <code className="bg-slate-100 font-mono px-1 rounded text-purple-700 font-semibold">S → ABCDE</code>:
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                        {[
                          { var: "A", desc: "Unbounded prefix loop (0 | 1)*", val: parsed.A || "ε" },
                          { var: "B", desc: "Even double-pair run (00 | 11)+", val: parsed.B },
                          { var: "C", desc: "Single/odd bit spacer (0 | 1)+", val: parsed.C },
                          { var: "D", desc: "Target chunk combination (101 | 111)+", val: parsed.D },
                          { var: "E", desc: "Unbounded suffix loop (0 | 1)*", val: parsed.E || "ε" }
                        ].map((item, idx) => (
                          <div key={idx} className="bg-slate-50/70 border border-slate-200 rounded-lg p-2.5 flex flex-col gap-1 shadow-2xs hover:border-purple-300 transition-colors">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-black text-purple-600 text-xs bg-purple-50 border border-purple-100 rounded px-1.5 py-0.5">{item.var}</span>
                              <span className={`font-mono text-xs font-bold px-1.5 py-0.2 rounded ${item.val === "ε" ? "text-slate-400 italic bg-slate-100" : "text-emerald-700 bg-emerald-50 border border-emerald-100"}`}>{item.val}</span>
                            </div>
                            <span className="text-[9.5px] text-slate-400 font-sans tracking-tight leading-tight mt-0.5">{item.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step-by-step Leftmost Derivation path */}
                    <div>
                      <h4 className="font-bold text-slate-800 text-[11.5px] uppercase tracking-wider mb-2">
                        2. Leftmost CFG Derivation Steps
                      </h4>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Each line replaces the leftmost variable using the active CFG rules to finally generate the target string:
                      </p>

                      <div className="bg-slate-900 rounded-lg p-3 text-slate-300 font-mono text-[11px] overflow-auto max-h-[300px] flex flex-col gap-1.5 shadow-md">
                        {steps.map((step, idx) => (
                          <div key={idx} className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 last:border-0 last:pb-0 gap-4">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-slate-600 select-none text-[9.5px] w-6 text-right">#{idx}</span>
                              {idx > 0 && <span className="text-purple-400 select-none">↳</span>}
                              <span className="font-medium truncate text-slate-200 tracking-wide">{step.sententialForm}</span>
                            </div>
                            <span className="text-[10px] text-amber-400/90 font-bold whitespace-nowrap bg-slate-800/80 px-2 py-0.5 rounded border border-slate-800">
                              {step.ruleApplied}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-4 px-5 border-t border-slate-200 flex-shrink-0 flex justify-end bg-slate-50">
              <button
                onClick={() => setShowCfgTracePopup(false)}
                className={`text-white text-xs font-bold px-4 py-2 rounded transition shadow-xs cursor-pointer ${
                  tabIdx === 1 ? "bg-purple-600 hover:bg-purple-700" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDA Modal Popup */}
      {showPdaPopup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden font-sans">
            <div className="p-4 px-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Database size={18} className="text-teal-600" />
                <h3 className="font-sans font-extrabold text-slate-800 text-[14px] uppercase tracking-wide">
                  Pushdown Automaton (PDA) Reference Image &mdash; {tabIdx === 0 ? "DFA 1" : "DFA 2"}
                </h3>
              </div>
              <button
                onClick={() => setShowPdaPopup(false)}
                className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-600 transition"
                title="Close overlay popup"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 text-xs flex flex-col gap-4 font-sans text-slate-600 leading-relaxed">
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">PDA Schema Diagram Overview</span>
                  <span className="text-[12px] font-bold text-slate-800">
                    Nondeterministic Pushdown Automaton (NPDA) Equivalency
                  </span>
                </div>
                <span className="text-[9px] bg-teal-50 text-teal-700 border border-teal-200 font-bold px-2 py-0.5 rounded uppercase font-mono">
                  Stack Alphabets: &#123;A, B, Z, $&#125;
                </span>
              </div>

              {/* Image Reference inside modal */}
              <div className="relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200 p-4 flex items-center justify-center min-h-[220px]">
                <img
                  src={tabIdx === 0 ? "PDA1.png" : "PDA2.png"}
                  alt={`PDA Reference Diagram ${tabIdx + 1}`}
                  draggable="false"
                  className="max-h-[280px] max-w-full object-contain select-none shadow-sm rounded bg-white p-2"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                    const fallback = document.getElementById(`pda-modal-fallback-${tabIdx}`);
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div
                  id={`pda-modal-fallback-${tabIdx}`}
                  style={{ display: "none" }}
                  className="text-center p-5 text-[11px] text-slate-400 flex flex-col items-center justify-center gap-2.5 bg-slate-50/80 rounded select-none absolute inset-4 border border-dashed border-slate-300"
                >
                  <HelpCircle size={26} className="text-amber-500" />
                  <div>
                    <span className="font-bold text-slate-700 block text-[12px] mb-1">Missing Graphic File (PDA{tabIdx + 1}.png)</span>
                    Upload or rename your PDA diagram file to <code className="font-mono bg-slate-150 p-1.5 rounded text-indigo-700 font-bold text-[10px]">PDA{tabIdx + 1}.png</code> inside the repo to visual-render the PDF/PNG scan here.
                  </div>
                </div>
              </div>

              {/* Educational breakdown */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 text-slate-500 leading-relaxed text-[11px]">
                <h4 className="font-sans font-bold text-slate-700 uppercase text-[10px] tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Info size={13} className="text-teal-600" />
                  Formal Automaton Mapping
                </h4>
                {tabIdx === 0 ? (
                  <p>
                    This Pushdown Automaton (PDA) accepts the language <strong className="font-mono text-teal-700">L1</strong> matching the Regex 1 pattern structure.
                    By pushing placeholders (like <code className="font-mono bg-white px-1 py-0.5 border border-slate-200 rounded">A</code>) onto the memory stack tape when seeing specific symbols, it retains state across deterministic repeating cycles (<code className="font-mono bg-white px-1 py-0.5 border border-slate-200 rounded">(bab)*</code>) and checks remaining patterns with pop transitions. Finally, it accepts if the input is successfully read and the stack contains the initial bottom marker symbol <code className="font-mono bg-white px-1 py-0.5 border border-slate-200">Z</code> or is completely empty.
                  </p>
                ) : (
                  <p>
                    This PDA evaluates bitstreams of <strong className="font-mono text-teal-700">L2</strong> (Regex 2 mapping).
                    The stack is leveraged to verify exact repetitions of consecutive run pairs (<code className="font-mono bg-white px-1 py-0.5 border border-slate-200 rounded">00</code> and <code className="font-mono bg-white px-1 py-0.5 border border-slate-200 rounded">11</code>) using simple stack flags. Crucially, the automaton then tracks the trailing sequences <code className="font-mono bg-white px-1 py-0.5 border border-slate-200 rounded">101/111</code> as deterministic terminal transition patterns to reach final acceptance configurations.
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 px-5 border-t border-slate-200 flex-shrink-0 flex justify-end bg-slate-50">
              <button
                onClick={() => setShowPdaPopup(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded transition shadow-xs cursor-pointer"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
