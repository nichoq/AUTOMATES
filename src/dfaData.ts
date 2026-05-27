import { DFAConfig } from "./types";

export const DFA_DATA: DFAConfig[] = [
  // DFA 1 (Regex 1) updated to match the new image provided by the user exactly
  {
    n: 18,
    START: 0,
    ACC: new Set([13, 14]),
    T: [
      { a: 2, b: 1 },    // 0: -
      { a: 3, b: 4 },    // 1: q1
      { a: 6, b: 4 },    // 2: q2
      { a: 15, b: 5 },   // 3: q3 -> a to Top Trap, b to q5
      { a: 8, b: 16 },   // 4: q4 -> a to q8, b to Middle Trap
      { a: 9, b: 1 },    // 5: q5 -> a to q9, b to q1
      { a: 17, b: 7 },   // 6: q6 -> a to Left Trap, b to q7
      { a: 9, b: 17 },   // 7: q7 -> a to q9, b to Left Trap
      { a: 16, b: 9 },   // 8: q8 -> a to Middle Trap, b to q9
      { a: 10, b: 10 },  // 9: q9 -> a, b to q10
      { a: 11, b: 12 },  // 10: q10 -> a to q11, b to q12
      { a: 13, b: 12 },  // 11: q11 -> a to Top Final +, b to q12
      { a: 11, b: 14 },  // 12: q12 -> a to q11, b to Bottom Final +
      { a: 13, b: 12 },  // 13: + (Top Accepting) -> a to itself, b to q12
      { a: 11, b: 14 },  // 14: + (Bottom Accepting) -> a to q11, b to itself
      { a: 15, b: 15 },  // 15: T (Top Trap next to q3)
      { a: 16, b: 16 },  // 16: T (Middle Trap under q4)
      { a: 17, b: 17 }   // 17: T (Left Trap next to q6/q7)
    ],
    alpha: ["a", "b"],
    dead: new Set([15, 16, 17]),
    labels: [
      "—",    // 0
      "q1",   // 1
      "q2",   // 2
      "q3",   // 3
      "q4",   // 4
      "q5",   // 5
      "q6",   // 6
      "q7",   // 7
      "q8",   // 8
      "q9",   // 9
      "q10",  // 10
      "q11",  // 11
      "q12",  // 12
      "+",    // 13 (Top accepting)
      "+",    // 14 (Bottom accepting)
      "T",    // 15 (Top Trap)
      "T",    // 16 (Middle Trap)
      "T"     // 17 (Left Trap)
    ],
    DESC: [
      "Start State (—) — prefix analysis",
      "Prefix: state q1 (reached on reading 'b')",
      "Prefix: state q2 (reached on reading 'a')",
      "Prefix: state q3 (matched 'ba' from q1)",
      "Prefix: state q4 (cycle helper, reached on 'b' from q1 or q2)",
      "Middle Phase: q5 reached from q3 on 'b'",
      "Suffix: key checkpoint q6 reached from q2 on reading 'a'",
      "Suffix: key checkpoint q7 reached from q6 on reading 'b'",
      "Suffix: q8 sequence completed from q4 or q5",
      "Checkpoint state q9 — transition helper state to trailing pairs",
      "Checkpoint state q10 — root ending strings pattern tracker",
      "Ending tracker state q11 — last parsed character is 'a'",
      "Ending tracker state q12 — last parsed character is 'b'",
      "★ ACCEPT (Top Final) — sequence successfully matches ending with 'aa'",
      "★ ACCEPT (Bottom Final) — sequence successfully matches ending with 'bb'",
      "DEAD State — Top Trap state entered on invalid sequence path from q3",
      "DEAD State — Middle Trap state entered on invalid sequence path from q4 or q8",
      "DEAD State — Left Trap state entered on invalid sequence path from q6 or q7"
    ],
    pos: [
      [90, 100],    // 0: -
      [210, 100],   // 1: q1
      [90, 240],    // 2: q2
      [330, 100],   // 3: q3
      [210, 240],   // 4: q4
      [330, 240],   // 5: q5
      [90, 380],    // 6: q6
      [90, 520],    // 7: q7
      [330, 380],   // 8: q8
      [450, 380],   // 9: q9
      [570, 380],   // 10: q10
      [690, 280],   // 11: q11
      [690, 480],   // 12: q12
      [810, 280],   // 13: + (Top Accepting)
      [810, 480],   // 14: + (Bottom Accepting)
      [450, 100],   // 15: T (Top Trap next to q3)
      [210, 380],   // 16: T (Middle Trap under q4)
      [30, 450]     // 17: T (Left Trap next to q6/q7)
    ],
    W: 870,
    H: 580,
    R: 24
  },
  // DFA 2 (Regex 2) matches index 1 in standard HTML definition
  {
    n: 9,
    START: 0,
    ACC: new Set([1]),
    T: [
      { "0": 7, "1": 4 }, // 0
      { "0": 1, "1": 1 }, // 1
      { "0": 3, "1": 3 }, // 2
      { "0": 3, "1": 5 }, // 3
      { "0": 7, "1": 2 }, // 4
      { "0": 6, "1": 8 }, // 5
      { "0": 3, "1": 1 }, // 6
      { "0": 2, "1": 4 }, // 7
      { "0": 6, "1": 1 }  // 8
    ],
    alpha: ["0", "1"],
    dead: new Set([]),
    labels: ["-", "+", "q3", "q4", "q2", "q5", "q6", "q1", "q7"],
    DESC: [
      "Start — no matching pair seen",
      "★ ACCEPT — valid string parsed",
      "Pair 00 complete (last state saw 0)",
      "Post-pair state, continuing sequence (last read 0)",
      "Continuing traversal (last read 1)",
      "Post-pair state, continuing sequence (last read 1)",
      "Post-pair state, matched '10'",
      "Continuing traversal (last read 0)",
      "Post-pair state, matched '11'"
    ],
    pos: [
      [80, 200],   // 0: -
      [880, 300],  // 1: +
      [400, 200],  // 2: q3
      [560, 200],  // 3: q4
      [240, 300],  // 4: q2
      [720, 100],  // 5: q5
      [720, 300],  // 6: q6
      [240, 100],  // 7: q1
      [880, 100]   // 8: q7
    ],
    W: 900,
    H: 400,
    R: 26
  }
];
