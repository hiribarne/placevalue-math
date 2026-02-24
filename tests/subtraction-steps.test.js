const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { loadSubtraction } = require('./setup');

describe('getSubtractionSteps()', () => {
  function getSteps(num1, num2) {
    const win = loadSubtraction();
    const d1 = win.digits(num1), d2 = win.digits(num2);
    const dd1 = win.digitDisplay(d1), dd2 = win.digitDisplay(d2);
    win.document.getElementById('g-a1-h').value = dd1.hundreds;
    win.document.getElementById('g-a1-t').value = dd1.tens;
    win.document.getElementById('g-a1-o').value = dd1.ones;
    win.document.getElementById('g-a2-h').value = dd2.hundreds;
    win.document.getElementById('g-a2-t').value = dd2.tens;
    win.document.getElementById('g-a2-o').value = dd2.ones;
    win.syncStateFromGalera();
    return win.getSubtractionSteps();
  }

  it('no borrow: 87 - 23 = 64', () => {
    const steps = getSteps(87, 23);
    // Ones: 7 - 3 = 4
    assert.equal(steps.ones.a, 7);
    assert.equal(steps.ones.b, 3);
    assert.equal(steps.ones.result, 4);
    assert.equal(steps.ones.borrowed, false);
    assert.equal(steps.ones.borrows.length, 0);
    // Tens: 8 - 2 = 6
    assert.equal(steps.tens.a, 8);
    assert.equal(steps.tens.b, 2);
    assert.equal(steps.tens.result, 6);
    assert.equal(steps.tens.borrowed, false);
    assert.equal(steps.tens.borrows.length, 0);
  });

  it('borrow from tens: 52 - 37 = 15', () => {
    const steps = getSteps(52, 37);
    // Ones: need borrow because 2 < 7
    assert.equal(steps.ones.borrowed, true);
    assert.equal(steps.ones.borrows.length, 1);
    assert.equal(steps.ones.borrows[0].src, 'g-a1-t');
    assert.equal(steps.ones.borrows[0].newDigit, 4); // 5 - 1
    assert.equal(steps.ones.borrows[0].destMinuend, 'g-a1-o');
    // After borrow: 12 - 7 = 5
    assert.equal(steps.ones.a, 12);
    assert.equal(steps.ones.result, 5);
    // Tens: 4 - 3 = 1
    assert.equal(steps.tens.a, 4);
    assert.equal(steps.tens.b, 3);
    assert.equal(steps.tens.result, 1);
  });

  it('borrow from hundreds: 432 - 261 = 171', () => {
    const steps = getSteps(432, 261);
    // Ones: 2 < 1? No, 2 >= 1 → no borrow
    assert.equal(steps.ones.borrowed, false);
    assert.equal(steps.ones.result, 1); // 2 - 1
    // Tens: 3 < 6 → need borrow from hundreds
    assert.equal(steps.tens.borrowed, true);
    assert.equal(steps.tens.borrows.length, 1);
    assert.equal(steps.tens.borrows[0].src, 'g-a1-h');
    assert.equal(steps.tens.borrows[0].newDigit, 3); // 4 - 1
    // After borrow: 13 - 6 = 7
    assert.equal(steps.tens.a, 13);
    assert.equal(steps.tens.result, 7);
    // Hundreds: 3 - 2 = 1
    assert.equal(steps.hundreds.a, 3);
    assert.equal(steps.hundreds.result, 1);
  });

  it('chain borrow: 300 - 178 = 122', () => {
    const steps = getSteps(300, 178);
    // Ones: 0 < 8, tens is 0, so chain borrow
    assert.equal(steps.ones.borrowed, true);
    assert.equal(steps.ones.borrows.length, 2);
    // First borrow: hundreds → tens (3→2, tens gets 10... shown as 9 because then tens→ones)
    assert.equal(steps.ones.borrows[0].src, 'g-a1-h');
    assert.equal(steps.ones.borrows[0].newDigit, 2);
    assert.equal(steps.ones.borrows[0].destMinuend, 'g-a1-t');
    // Second borrow: tens → ones
    assert.equal(steps.ones.borrows[1].src, 'g-a1-t');
    assert.equal(steps.ones.borrows[1].newDigit, 9);
    assert.equal(steps.ones.borrows[1].destMinuend, 'g-a1-o');
    // After borrow: ones = 10, 10 - 8 = 2
    assert.equal(steps.ones.a, 10);
    assert.equal(steps.ones.result, 2);
    // Tens: 9 - 7 = 2 (after chain borrow, tens became 9)
    assert.equal(steps.tens.a, 9);
    assert.equal(steps.tens.result, 2);
    // Hundreds: 2 - 1 = 1
    assert.equal(steps.hundreds.a, 2);
    assert.equal(steps.hundreds.result, 1);
  });

  it('simple subtraction: 9 - 4 = 5', () => {
    const steps = getSteps(9, 4);
    assert.equal(steps.ones.result, 5);
    assert.equal(steps.ones.borrowed, false);
  });

  it('borrow with zero result: 10 - 5 = 5', () => {
    const steps = getSteps(10, 5);
    // Ones: 0 < 5 → borrow from tens
    assert.equal(steps.ones.borrowed, true);
    assert.equal(steps.ones.borrows.length, 1);
    assert.equal(steps.ones.a, 10);
    assert.equal(steps.ones.result, 5);
    // Tens: 0 - 0 = 0
    assert.equal(steps.tens.result, 0);
  });

  it('needsHundreds is true for 3-digit numbers', () => {
    const steps = getSteps(432, 261);
    assert.equal(steps.needsHundreds, true);
  });

  it('needsHundreds is false for 2-digit numbers', () => {
    const steps = getSteps(52, 37);
    assert.equal(steps.needsHundreds, false);
  });
});

describe('needsBorrowCheck()', () => {
  const win = loadSubtraction();

  it('returns false when no borrow needed', () => {
    assert.equal(win.needsBorrowCheck(87, 23), false);
  });

  it('returns true when ones borrow needed', () => {
    assert.equal(win.needsBorrowCheck(52, 37), true);
  });

  it('returns true when tens borrow needed', () => {
    assert.equal(win.needsBorrowCheck(432, 261), true);
  });
});

describe('borrowCount()', () => {
  const win = loadSubtraction();

  it('returns 0 for no borrows', () => {
    assert.equal(win.borrowCount(87, 23), 0);
  });

  it('returns 1 for single borrow', () => {
    assert.equal(win.borrowCount(52, 37), 1);
  });

  it('returns 2 for double borrow', () => {
    assert.equal(win.borrowCount(300, 178), 2);
  });
});

describe('determineBorrowPhase()', () => {
  const win = loadSubtraction();

  it('returns ready when no borrow needed', () => {
    assert.equal(win.determineBorrowPhase({ ones: 7, tens: 8, hundreds: 3 }, { ones: 3, tens: 2, hundreds: 1 }), 'ready');
  });

  it('returns borrowing-ones when ones insufficient and tens available', () => {
    assert.equal(win.determineBorrowPhase({ ones: 2, tens: 5, hundreds: 0 }, { ones: 7, tens: 3, hundreds: 0 }), 'borrowing-ones');
  });

  it('returns borrowing-tens for cascade when ones insufficient and tens zero', () => {
    assert.equal(win.determineBorrowPhase({ ones: 0, tens: 0, hundreds: 3 }, { ones: 8, tens: 7, hundreds: 1 }), 'borrowing-tens');
  });

  it('returns borrowing-tens when tens insufficient', () => {
    assert.equal(win.determineBorrowPhase({ ones: 5, tens: 2, hundreds: 4 }, { ones: 3, tens: 6, hundreds: 1 }), 'borrowing-tens');
  });
});
