# Place Value Math — Roadmap

Staged improvement plan for the Place Value Math educational tool.
Each stage builds on the previous one. Tests are written alongside each feature.

---

## Current Features (Implemented)

- [x] Addition with carrying and regrouping (galera + visual blocks)
- [x] Subtraction with borrowing and decomposing
- [x] Guide mode with step-by-step prompts and answer input
- [x] Animated carry fly-up (addition) and borrow animations (subtraction)
- [x] Borrow button in guide mode (student-initiated)
- [x] Borrow indicator ("1") inside minuend cell (pen-and-paper style)
- [x] Calculator-style number entry (shift-left digits, Enter/Tab/+/- to jump)
- [x] Collapsible visual blocks section
- [x] Block counting (click to count, totals displayed)
- [x] Difficulty levels (Easy, Medium, Hard)
- [x] CPA narration system with step-by-step explanations
- [x] Confetti celebration on correct answers
- [x] Mobile-friendly design with large tap targets

---

## Stage 1 — Code Quality & Core UX ✓

**Goal:** Reduce duplication, improve correctness feedback, speed up workflows.

- [ ] **Extract shared CSS/JS into common files** *(deferred — large refactor, lower priority)*
  - Create `shared.css` with common styles (header, galera, mat, feedback, confetti, etc.)
  - Create `shared.js` with common functions (digits, digitDisplay, wait, blocks, confetti, hints, calculator entry)
  - Reduces maintenance burden and keeps addition/subtraction in sync
  - Each HTML file keeps only its operation-specific logic

- [x] **Validate carries on Check (Addition)**
  - When checking answer, also validate carry cells
  - Shows which carries are correct/incorrect alongside result digits
  - Teaches students that carries are part of the answer, not just scaffolding

- [x] **Enter-to-check in result row**
  - Pressing Enter while focused on any result cell triggers Check Answer
  - Faster workflow for keyboard-oriented usage
  - Implemented in both addition and subtraction

- [x] **Fix deployment filtering**
  - Updated `.github/workflows/pages.yml` to only deploy HTML files and LICENSE
  - Excludes tests/, node_modules/, ROADMAP.md, and dev files from deployed site

- [x] **Fix subtraction zero-result bug**
  - Entering "0" for a zero result (e.g. 50 − 50) was marked incorrect
  - Changed string comparison to numeric (`parseInt||0`)

---

## Stage 2 — Accessibility & Polish ✓

**Goal:** Make the tool more approachable and accessible.

- [x] **Kid-friendly mat labels**
  - Replaced "Minuend"/"Subtrahend"/"Addend 1"/"Addend 2" with "First Number"/"Second Number"

- [x] **Start mat expanded on first visit**
  - Defaults to expanded; localStorage persists collapse preference across visits

- [x] **Problem counter / session tracker**
  - Shows "Solved: N" in the header, increments on each correct answer
  - Resets on page reload

- [x] **Hint toast nowrap fix**
  - Changed to `white-space: normal; max-width: 90vw;` so text wraps on narrow screens

- [x] **ARIA live regions**
  - `aria-live="polite"` on narration bar and guide prompt
  - `role="alert" aria-live="assertive"` on feedback overlay

---

## Stage 3 — Engagement & Resilience

**Goal:** Keep students engaged and support offline/repeated use.

- [ ] **Offline support (Service Worker)**
  - Add a `sw.js` that caches all HTML/CSS/JS files
  - Enables usage without internet (tablet at home, classroom without wifi)
  - Register from index.html

- [ ] **Discoverable "enter your own" mode**
  - Add a small label/hint near the galera: "Type your own problem or press New"
  - Many users may not realize they can type custom numbers
  - Show on first visit, hide after first custom entry (localStorage)

- [ ] **Undo/confirm on destructive actions**
  - "New Problem" and "Clear" can lose student work
  - Add a brief undo toast: "Problem cleared. Undo?" (3 second window)
  - Or require confirmation if student has partially filled answers

---

## Stage 4 — Pedagogical Extensions

**Goal:** Deepen learning with additional representations and adaptive support.

- [ ] **Number line visualization**
  - Add a collapsible number line that shows the operation as jumps
  - Addition: start at first number, jump by second number
  - Subtraction: start at first number, jump back by second number
  - Bridges between CPA and more abstract representations

- [ ] **Expanded notation display**
  - Show numbers in expanded form alongside the galera
  - Example: 345 = 300 + 40 + 5
  - Helps students understand place value decomposition
  - Toggle on/off independently

- [ ] **Adaptive difficulty**
  - Track correct/incorrect ratio per session
  - Suggest easier difficulty after 3+ consecutive wrong answers
  - Suggest harder difficulty after 5+ consecutive correct answers
  - Non-intrusive: suggestion banner, not forced change

- [ ] **Estimation prompts**
  - Before solving, ask "About how much do you think the answer will be?"
  - Accept any answer within a reasonable range
  - Builds number sense and metacognitive skills

---

## Test Coverage Plan

Tests live in `tests/` directory and run via Node.js with jsdom.

### Test Files (110 tests)
- `tests/helpers.test.js` — digits(), digitDisplay(), randInt() (17 tests)
- `tests/addition-steps.test.js` — getAdditionSteps(), needsCarry(), carryCount() (14 tests)
- `tests/subtraction-steps.test.js` — getSubtractionSteps(), needsBorrowCheck(), borrowCount(), determineBorrowPhase() (20 tests)
- `tests/calculator-entry.test.js` — pushDigit(), popDigit(), shiftDigitLeft(), shiftDigitRight() (13 tests)
- `tests/problem-generator.test.js` — generateProblem() difficulty constraints (6 tests)
- `tests/check-answer.test.js` — checkAnswer() for both operations (11 tests)
- `tests/guide-mode.test.js` — guide prompts, borrow pending state, input validation (8 tests)
- `tests/stage1-improvements.test.js` — Enter-to-check, carry validation (7 tests)
- `tests/stage2-improvements.test.js` — labels, mat expand, counter, hint fix, ARIA (16 tests)

---

## Running Tests

```bash
npm test
```

Requires Node.js 18+. No other dependencies needed (uses built-in test runner + jsdom).
