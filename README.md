<div align="center">
  <img src="public/automata-logo.png" alt="Automates Logo" width="320" />

  <h1>AUTOMATES</h1>
  <p><strong>DFA Verifier & Visual Tracer</strong></p>

  <p>
    An interactive web application for simulating, visualizing, and verifying Deterministic Finite Automata (DFA) and Pushdown Automata (PDA) derived from two regular expression patterns. Built as a formal language theory learning tool with step-by-step animation, batch input testing, CFG tracing, and transition matrix inspection.
  </p>

  <p>
    <a href="https://automates-sand.vercel.app" target="_blank"><strong>Live Demo → automates-sand.vercel.app</strong></a>
  </p>
</div>

---

## Features

### DFA Simulation
- **Two DFA configurations** — one per regex pattern, switchable via tab
- **Step-by-step visual tracer** — animate input string processing character by character
- **Autoplay with speed control** — Slow (2s), Normal (1s), Fast (0.6s), Blazing (0.3s)
- **Breadcrumb trace path** — live highlight of state transitions as the tape feeds
- **Accept / Reject verdict** — final result displayed after the full string is consumed

### PDA Flowchart Tracer
- Toggle between **DFA Automaton** and **PDA Flowchart** view on the same canvas
- Animated node traversal through the pushdown automaton graph
- PDA reference image popup for **Regex 1** (`pda11.png`) and **Regex 2** (`pda22.png`)

### Batch Testing Panel
- **5 input slots** per DFA tab for testing multiple strings at once
- Inline Accept / Reject status per field with color-coded validation
- One-click **⟶ Trace** to feed any batch input into the step simulator
- **Clear all** button to reset the batch panel

### Context-Free Grammar (CFG)
- View the formal **CFG production rules** for each language
- **Leftmost derivation tracer** — step-by-step derivation of a traced string through the grammar
- Copy grammar rules to clipboard

### Transition Table Matrix
- Full δ-function matrix for all DFA states
- Highlights the currently active state in real time during tracing
- Shows start state, accepting states, and dead trap nodes

### State Meanings Dictionary
- Human-readable semantic description for every DFA state
- Highlights the active state during tracing

---

## Regex Patterns

| Tab | Regex | Alphabet | Min Accepting String |
|-----|-------|----------|----------------------|
| DFA 1 | `(bab)* (b + a) (bab + aba) (a + b)* (aa + bb)* (b + a + bb) (a + b)* (aa + bb)` | `{a, b}` | `"aabaaaa"` (length 7) |
| DFA 2 | `(1+0)*(11+00)(00+11)*(1+0+11)(1+0+11)*(101+111)(101+111)*(1+0*+11)(1+0*+11)*` | `{0, 1}` | `"00101"` (length 5) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Animations | Motion (Framer Motion) |
| Deployment | Vercel |

---

## Getting Started

**Prerequisites:** Node.js 18+

1. Clone the repository:
   ```bash
   git clone https://github.com/nichoq/AUTOMATES.git
   cd AUTOMATES
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app runs at `http://localhost:3000`.

4. Build for production:
   ```bash
   npm run build
   ```

---

## Project Structure

```
AUTOMATES/
├── public/                  # Static assets served by Vite
│   ├── automata-logo 1.png  # App logo (favicon + header)
│   ├── pda11.png            # PDA reference diagram for Regex 1
│   └── pda22.png            # PDA reference diagram for Regex 2
├── src/
│   ├── components/
│   │   ├── DfaCanvas.tsx    # SVG/canvas DFA state graph renderer
│   │   └── PdaCanvas.tsx    # PDA flowchart node renderer
│   ├── App.tsx              # Main application — all UI, state, and logic
│   ├── dfaData.ts           # DFA transition tables, labels, and state metadata
│   ├── cfgTracer.ts         # CFG parsing and leftmost derivation generators
│   ├── types.ts             # Shared TypeScript interfaces
│   └── main.tsx             # React entry point
├── index.html
├── vite.config.ts
└── package.json
```

---

## Deployment

The app is deployed on **Vercel** and available at:

**[https://automates-sand.vercel.app](https://automates-sand.vercel.app)**

To deploy your own instance, import the repository in the [Vercel dashboard](https://vercel.com) — no extra configuration required. Vite is auto-detected.

---

## License

This project is for academic and educational purposes.
