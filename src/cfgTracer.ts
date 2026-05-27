export interface Cfg1TraceResult {
  A: string;
  B: string;
  C: string;
  D: string;
  E: string;
  F: string;
}

export interface Cfg2TraceResult {
  A: string;
  B: string;
  C: string;
  D: string;
  E: string;
}

export interface CfgDerivationStep {
  sententialForm: string;
  ruleApplied: string;
  replacing: string;
}

// DFA 1 / CFG 1 Helper validations
function matchesA1(str: string): boolean {
  if (str.length % 3 !== 0) return false;
  for (let i = 0; i < str.length; i += 3) {
    if (str.substring(i, i + 3) !== "bab") return false;
  }
  return true;
}

function matchesB1(str: string): boolean {
  return str === "a" || str === "b";
}

function matchesC1(str: string): boolean {
  return str === "bab" || str === "aba";
}

function matchesD1(str: string): boolean {
  // Always matches any (a|b)* string.
  return true;
}

function matchesE1(str: string): boolean {
  return str === "a" || str === "b" || str === "bb";
}

function matchesF1(str: string): boolean {
  if (str.length < 2) return false;
  return str.endsWith("aa") || str.endsWith("bb");
}

// Backward-parsing search for DFA 1 CFG
export function parseCFG1(str: string): Cfg1TraceResult | null {
  const n = str.length;

  // S -> A B C D E F
  // Iterate all possible partition lengths
  for (let lenA = 0; lenA <= n; lenA += 3) {
    const part_A = str.substring(0, lenA);
    if (!matchesA1(part_A)) continue;

    for (let lenB = 1; lenB <= 1 && lenA + lenB <= n; lenB++) {
      const part_B = str.substring(lenA, lenA + lenB);
      if (!matchesB1(part_B)) continue;

      for (let lenC = 3; lenC <= 3 && lenA + lenB + lenC <= n; lenC++) {
        const part_C = str.substring(lenA + lenB, lenA + lenB + lenC);
        if (!matchesC1(part_C)) continue;

        for (let lenD = 0; lenA + lenB + lenC + lenD <= n; lenD++) {
          const part_D = str.substring(lenA + lenB + lenC, lenA + lenB + lenC + lenD);
          if (!matchesD1(part_D)) continue;

          for (let lenE = 1; lenE <= 2 && lenA + lenB + lenC + lenD + lenE <= n; lenE++) {
            const part_E = str.substring(lenA + lenB + lenC + lenD, lenA + lenB + lenC + lenD + lenE);
            if (!matchesE1(part_E)) continue;

            const part_F = str.substring(lenA + lenB + lenC + lenD + lenE);
            if (matchesF1(part_F)) {
              // Found a valid decomposition!
              return {
                A: part_A,
                B: part_B,
                C: part_C,
                D: part_D,
                E: part_E,
                F: part_F,
              };
            }
          }
        }
      }
    }
  }

  return null;
}

export function generateCFG1Derivation(parts: Cfg1TraceResult): CfgDerivationStep[] {
  const steps: CfgDerivationStep[] = [];

  // Start symbol S
  steps.push({
    sententialForm: "S",
    ruleApplied: "Start",
    replacing: "S",
  });

  // S -> A B C D E F
  steps.push({
    sententialForm: "A B C D E F",
    ruleApplied: "S → A B C D E F",
    replacing: "S",
  });

  let derived = "";

  // 1. Expand A
  const repeatCountA = parts.A.length / 3;
  for (let i = 0; i < repeatCountA; i++) {
    steps.push({
      sententialForm: derived + "bab A B C D E F",
      ruleApplied: "A → babA",
      replacing: "A",
    });
    derived += "bab";
  }
  steps.push({
    sententialForm: derived + " B C D E F",
    ruleApplied: "A → ε",
    replacing: "A",
  });

  // 2. Expand B
  steps.push({
    sententialForm: derived + ` ${parts.B} C D E F`,
    ruleApplied: `B → ${parts.B}`,
    replacing: "B",
  });
  derived += parts.B;

  // 3. Expand C
  steps.push({
    sententialForm: derived + ` ${parts.C} D E F`,
    ruleApplied: `C → ${parts.C}`,
    replacing: "C",
  });
  derived += parts.C;

  // 4. Expand D
  const lenD = parts.D.length;
  for (let i = 0; i < lenD; i++) {
    const ch = parts.D[i];
    steps.push({
      sententialForm: derived + ` ${ch}D E F`,
      ruleApplied: `D → ${ch}D`,
      replacing: "D",
    });
    derived += ch;
  }
  steps.push({
    sententialForm: derived + " E F",
    ruleApplied: "D → ε",
    replacing: "D",
  });

  // 5. Expand E
  steps.push({
    sententialForm: derived + ` ${parts.E} F`,
    ruleApplied: `E → ${parts.E}`,
    replacing: "E",
  });
  derived += parts.E;

  // 6. Expand F
  const fPrefix = parts.F.substring(0, parts.F.length - 2);
  const fSuffix = parts.F.substring(parts.F.length - 2);

  for (let i = 0; i < fPrefix.length; i++) {
    const ch = fPrefix[i];
    steps.push({
      sententialForm: derived + ` ${ch}F`,
      ruleApplied: `F → ${ch}F`,
      replacing: "F",
    });
    derived += ch;
  }
  steps.push({
    sententialForm: derived + ` ${fSuffix}`,
    ruleApplied: `F → ${fSuffix}`,
    replacing: "F",
  });

  return steps;
}


// DFA 2 / CFG 2 Helper validations
function matchesA2(str: string): boolean {
  // Always matches any (0|1)* string
  return true;
}

function matchesB2(str: string): boolean {
  if (str.length < 2 || str.length % 2 !== 0) return false;
  for (let i = 0; i < str.length; i += 2) {
    if (str[i] !== str[i+1]) return false;
  }
  return true;
}

function matchesC2(str: string): boolean {
  return str.length >= 1;
}

function matchesD2(str: string): boolean {
  if (str.length < 3 || str.length % 3 !== 0) return false;
  for (let i = 0; i < str.length; i += 3) {
    const trip = str.substring(i, i + 3);
    if (trip !== "101" && trip !== "111") return false;
  }
  return true;
}

function matchesE2(str: string): boolean {
  // Always matches any (0|1)* string
  return true;
}

// Backward-parsing search for DFA 2 CFG
export function parseCFG2(str: string): Cfg2TraceResult | null {
  const n = str.length;

  // S -> A B C D E
  for (let lenA = 0; lenA <= n; lenA++) {
    const part_A = str.substring(0, lenA);
    if (!matchesA2(part_A)) continue;

    for (let lenB = 2; lenA + lenB <= n; lenB += 2) {
      const part_B = str.substring(lenA, lenA + lenB);
      if (!matchesB2(part_B)) continue;

      for (let lenC = 1; lenA + lenB + lenC <= n; lenC++) {
        const part_C = str.substring(lenA + lenB, lenA + lenB + lenC);
        if (!matchesC2(part_C)) continue;

        for (let lenD = 3; lenA + lenB + lenC + lenD <= n; lenD += 3) {
          const part_D = str.substring(lenA + lenB + lenC, lenA + lenB + lenC + lenD);
          if (!matchesD2(part_D)) continue;

          const part_E = str.substring(lenA + lenB + lenC + lenD);
          if (matchesE2(part_E)) {
            // Found a valid decomposition!
            return {
              A: part_A,
              B: part_B,
              C: part_C,
              D: part_D,
              E: part_E,
            };
          }
        }
      }
    }
  }

  return null;
}

export function generateCFG2Derivation(parts: Cfg2TraceResult): CfgDerivationStep[] {
  const steps: CfgDerivationStep[] = [];

  // Start symbol S
  steps.push({
    sententialForm: "S",
    ruleApplied: "Start",
    replacing: "S",
  });

  // S -> A B C D E
  steps.push({
    sententialForm: "A B C D E",
    ruleApplied: "S → A B C D E",
    replacing: "S",
  });

  let derived = "";

  // 1. Expand A
  const lenA = parts.A.length;
  for (let i = 0; i < lenA; i++) {
    const ch = parts.A[i];
    steps.push({
      sententialForm: derived + `${ch}A B C D E`,
      ruleApplied: `A → ${ch}A`,
      replacing: "A",
    });
    derived += ch;
  }
  steps.push({
    sententialForm: derived + " B C D E",
    ruleApplied: "A → ε",
    replacing: "A",
  });

  // 2. Expand B
  const bChunksCount = parts.B.length / 2;
  for (let i = 0; i < bChunksCount; i++) {
    const chunk = parts.B.substring(i * 2, i * 2 + 2);
    if (i < bChunksCount - 1) {
      steps.push({
        sententialForm: derived + `${chunk}B C D E`,
        ruleApplied: `B → ${chunk}B`,
        replacing: "B",
      });
    } else {
      steps.push({
        sententialForm: derived + `${chunk} C D E`,
        ruleApplied: `B → ${chunk}`,
        replacing: "B",
      });
    }
    derived += chunk;
  }

  // 3. Expand C
  const cPrefix = parts.C.substring(0, parts.C.length - 1);
  const cSuffix = parts.C.substring(parts.C.length - 1);

  for (let i = 0; i < cPrefix.length; i++) {
    const ch = cPrefix[i];
    steps.push({
      sententialForm: derived + `${ch}C D E`,
      ruleApplied: `C → ${ch}C`,
      replacing: "C",
    });
    derived += ch;
  }
  steps.push({
    sententialForm: derived + `${cSuffix} D E`,
    ruleApplied: `C → ${cSuffix}`,
    replacing: "C",
  });
  derived += cSuffix;

  // 4. Expand D
  const dChunksCount = parts.D.length / 3;
  for (let i = 0; i < dChunksCount; i++) {
    const chunk = parts.D.substring(i * 3, i * 3 + 3);
    if (i < dChunksCount - 1) {
      steps.push({
        sententialForm: derived + `${chunk}D E`,
        ruleApplied: `D → ${chunk}D`,
        replacing: "D",
      });
    } else {
      steps.push({
        sententialForm: derived + `${chunk} E`,
        ruleApplied: `D → ${chunk}`,
        replacing: "D",
      });
    }
    derived += chunk;
  }

  // 5. Expand E
  const lenE = parts.E.length;
  for (let i = 0; i < lenE; i++) {
    const ch = parts.E[i];
    steps.push({
      sententialForm: derived + `${ch}E`,
      ruleApplied: `E → ${ch}E`,
      replacing: "E",
    });
    derived += ch;
  }
  steps.push({
    sententialForm: derived,
    ruleApplied: "E → ε",
    replacing: "E",
  });

  return steps;
}
