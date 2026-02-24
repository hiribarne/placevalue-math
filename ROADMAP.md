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

## Stage 1 — Code Quality & Core UX

**Goal:** Reduce duplication, improve correctness feedback, speed up workflows.

- [ ] **Extract shared CSS/JS into common files**
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

---

## Stage 2 — Accessibility & Polish

**Goal:** Make the tool more approachable and accessible.

- [ ] **Kid-friendly mat labels**
  - Replace "Minuend" / "Subtrahend" / "Addend 1" / "Addend 2" with simpler labels
  - Options: "Top Number" / "Bottom Number", or use the actual numbers, or just "First" / "Second"

- [ ] **Start mat expanded on first visit**
  - Use localStorage to remember collapse preference
  - Default to expanded on first visit so new users discover the visual blocks
  - Collapsed state persists across problems but resets on page reload (or remember via localStorage)

- [ ] **Problem counter / session tracker**
  - Show "Problems solved: 3" in the header or below the galera
  - Motivates continued practice and gives parents/teachers a quick metric
  - Reset on page reload

- [ ] **Hint toast nowrap fix**
  - Hint toast text currently can overflow on narrow screens
  - Add `white-space: normal; max-width: 90vw;` to `.hint-toast`

- [ ] **ARIA live regions**
  - Add `aria-live="polite"` to narration bar, guide prompt, and feedback overlay
  - Ensures screen readers announce guide prompts and results
  - Add `role="alert"` for error feedback (incorrect answers)

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

### Existing Feature Tests
- `tests/test-helpers.js` — digits(), digitDisplay(), wait(), randInt()
- `tests/test-addition-steps.js` — getAdditionSteps() for various cases (no carry, one carry, two carries)
- `tests/test-subtraction-steps.js` — getSubtractionSteps() for various cases (no borrow, one borrow, chain borrow)
- `tests/test-calculator-entry.js` — pushDigit(), popDigit(), shiftDigitLeft(), shiftDigitRight()
- `tests/test-problem-generator.js` — generateProblem() respects difficulty constraints
- `tests/test-check-answer.js` — checkAnswer() validates result digits correctly

### New Feature Tests (added with each stage)
- Stage 1: carry/borrow validation, Enter-to-check
- Stage 2: localStorage persistence, ARIA attributes present
- Stage 3: Service worker registration, undo mechanism
- Stage 4: expanded notation formatting, adaptive difficulty logic

---

## Running Tests

```bash
npm test
```

Requires Node.js 18+. No other dependencies needed (uses built-in test runner + jsdom).
