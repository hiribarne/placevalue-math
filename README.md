# Place Value Math

An interactive web tool for learning addition and subtraction using the **column method** (galera) alongside **base-10 blocks** (flats, rods, units). Designed for primary school students working through homework or practicing place value concepts.

**[Try it live](https://hiribarne.github.io/placevalue-math/)**

## What It Does

Students solve addition and subtraction problems in a familiar columnar layout (hundreds, tens, ones) while a visual mat of base-10 blocks shows what the numbers actually look like. The two representations — symbolic and concrete — stay in sync, bridging the gap between procedure and understanding.

### Addition
- Enter two numbers and see their block representations
- **Combine** blocks to visualize the total
- **Regroup** when a column has 10+ blocks (10 units become 1 rod, 10 rods become 1 flat)
- Watch the carry animate from the result cell up to the carry row

### Subtraction
- Enter minuend and subtrahend
- **Borrow** when a column doesn't have enough — see a flat break into 10 rods, or a rod into 10 units
- Strikethrough and borrow indicators show the regrouping directly on the digits, matching the pen-and-paper method
- **Take Away** blocks to reveal the result

## Guide Mode

Guide mode walks students through each column step-by-step:

1. A purple prompt asks the column question (e.g., "Ones: 7 + 5 = ?")
2. The student types the **full answer** in a dedicated input field (e.g., "12")
3. On correct answer:
   - The result digit appears in the galera (e.g., "2")
   - The carry "1" animates flying up to the carry cell (addition)
   - Or borrow animations play with strikethrough and indicators (subtraction)
4. The guide advances to the next column automatically

For subtraction, when borrowing is needed:
- The prompt shows "Ones: 0 < 7 — Need to borrow!" with a **Borrow** button
- The student clicks Borrow, watches the animation, then solves the resulting subtraction
- A small "1" appears in the upper-left corner of the receiving cell (e.g., making "0" read as "10"), matching the traditional notation

## Fast Number Entry

Designed for doing many homework problems in sequence:

- **Clear** resets the galera and focuses the ones cell of the first number
- **Type digits** and they shift left through O → T → H, like a calculator
- Press **Enter**, **Tab**, **+** (addition) or **-** (subtraction) to jump to the second number
- Press **Enter** again to start solving
- Backspace removes the last digit

## Pedagogical Approach

This tool follows the **Concrete → Pictorial → Abstract** (CPA) progression:

| Layer | What the student sees |
|---|---|
| **Concrete** | Base-10 blocks (flats = 100, rods = 10, units = 1) on the visual mat |
| **Pictorial** | Animated regrouping — blocks shrink, move, and transform between columns |
| **Abstract** | The column method (galera) with carries, borrows, and strikethroughs |

The visual blocks section is collapsible — students who are comfortable with the abstract method can hide it, while those who need support can open it at any time.

### Difficulty Levels

- **Easy** — No carrying/borrowing required
- **Medium** — One carry or borrow
- **Hard** — Multiple carries/borrows, larger numbers

## How to Use in the Classroom

1. **Introduce a concept** (e.g., borrowing) using the visual blocks with the mat expanded
2. **Practice with Guide mode on** — the step-by-step prompts scaffold the process
3. **Turn Guide mode off** — students solve independently, using the visual blocks if needed
4. **Collapse the visual blocks** — students work purely with the column method
5. **Homework mode** — Clear, type the problem, solve with or without guide, repeat

## Running Locally

No build step — just open `index.html` in a browser, or serve with any static file server:

```
npx serve .
```

## Tech

Pure HTML, CSS, and JavaScript. No dependencies. Each page is a single self-contained HTML file. Works on desktop and mobile (touch-friendly, large tap targets).
