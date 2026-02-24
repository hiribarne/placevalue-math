const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { loadAddition, loadSubtraction } = require('./setup');

describe('Addition — generateProblem()', () => {
  it('easy: no carrying, sum <= 999', () => {
    const win = loadAddition();
    // Override difficulty
    // state is const but we can call generateProblem which uses state.difficulty
    // State was set to 'medium' by default via newProblem(). We need to change it.
    // Since state is a closure const, we set difficulty via the select.
    win.document.getElementById('difficultySelect').value = 'easy';
    win.document.getElementById('difficultySelect').dispatchEvent(new win.Event('change'));

    for (let i = 0; i < 50; i++) {
      const { a, b } = win.generateProblem();
      assert.ok(a >= 1 && a <= 99, `a=${a} should be 1-99`);
      assert.ok(b >= 1 && b <= 99, `b=${b} should be 1-99`);
      assert.ok(a + b <= 999, `sum ${a+b} should be <= 999`);
      assert.equal(win.needsCarry(a, b), false, `${a} + ${b} should not need carry`);
    }
  });

  it('medium: at most 1 carry, sum <= 999', () => {
    const win = loadAddition();
    win.document.getElementById('difficultySelect').value = 'medium';
    win.document.getElementById('difficultySelect').dispatchEvent(new win.Event('change'));

    for (let i = 0; i < 50; i++) {
      const { a, b } = win.generateProblem();
      assert.ok(a + b <= 999, `sum ${a+b} should be <= 999`);
      assert.ok(win.carryCount(a, b) <= 1, `${a} + ${b} should have at most 1 carry`);
    }
  });

  it('hard: both 3-digit numbers, sum <= 999', () => {
    const win = loadAddition();
    win.document.getElementById('difficultySelect').value = 'hard';
    win.document.getElementById('difficultySelect').dispatchEvent(new win.Event('change'));

    for (let i = 0; i < 50; i++) {
      const { a, b } = win.generateProblem();
      assert.ok(a >= 100 && a <= 999, `a=${a} should be 100-999`);
      assert.ok(b >= 100 && b <= 999, `b=${b} should be 100-999`);
      assert.ok(a + b <= 999, `sum ${a+b} should be <= 999`);
    }
  });
});

describe('Subtraction — generateProblem()', () => {
  it('easy: no borrowing, a >= b', () => {
    const win = loadSubtraction();
    win.document.getElementById('difficultySelect').value = 'easy';
    win.document.getElementById('difficultySelect').dispatchEvent(new win.Event('change'));

    for (let i = 0; i < 50; i++) {
      const { a, b } = win.generateProblem();
      assert.ok(a > b, `a=${a} should be > b=${b}`);
      assert.equal(win.needsBorrowCheck(a, b), false, `${a} - ${b} should not need borrow`);
    }
  });

  it('medium: exactly 1 borrow, a >= b', () => {
    const win = loadSubtraction();
    win.document.getElementById('difficultySelect').value = 'medium';
    win.document.getElementById('difficultySelect').dispatchEvent(new win.Event('change'));

    for (let i = 0; i < 50; i++) {
      const { a, b } = win.generateProblem();
      assert.ok(a > b, `a=${a} should be > b=${b}`);
      assert.ok(win.borrowCount(a, b) <= 1, `${a} - ${b} should have at most 1 borrow`);
      assert.ok(win.needsBorrowCheck(a, b), `${a} - ${b} should need at least 1 borrow`);
    }
  });

  it('hard: at least 1 borrow', () => {
    const win = loadSubtraction();
    win.document.getElementById('difficultySelect').value = 'hard';
    win.document.getElementById('difficultySelect').dispatchEvent(new win.Event('change'));

    for (let i = 0; i < 50; i++) {
      const { a, b } = win.generateProblem();
      assert.ok(a >= b, `a=${a} should be >= b=${b}`);
      assert.ok(win.borrowCount(a, b) >= 1, `${a} - ${b} should have at least 1 borrow`);
    }
  });
});
