const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { loadAddition } = require('./setup');

describe('getAdditionSteps()', () => {
  // Each test loads a fresh DOM to set different num1/num2
  function getSteps(num1, num2) {
    const win = loadAddition();
    // Set state via the galera inputs and sync
    const d1 = win.digits(num1), d2 = win.digits(num2);
    const dd1 = win.digitDisplay(d1), dd2 = win.digitDisplay(d2);
    win.document.getElementById('g-a1-h').value = dd1.hundreds;
    win.document.getElementById('g-a1-t').value = dd1.tens;
    win.document.getElementById('g-a1-o').value = dd1.ones;
    win.document.getElementById('g-a2-h').value = dd2.hundreds;
    win.document.getElementById('g-a2-t').value = dd2.tens;
    win.document.getElementById('g-a2-o').value = dd2.ones;
    win.syncStateFromGalera();
    return win.getAdditionSteps();
  }

  it('no carry: 23 + 14 = 37', () => {
    const steps = getSteps(23, 14);
    // Ones: 3 + 4 = 7
    assert.equal(steps.ones.a, 3);
    assert.equal(steps.ones.b, 4);
    assert.equal(steps.ones.carry, 0);
    assert.equal(steps.ones.result, 7);
    assert.equal(steps.ones.fullSum, 7);
    // Tens: 2 + 1 = 3
    assert.equal(steps.tens.a, 2);
    assert.equal(steps.tens.b, 1);
    assert.equal(steps.tens.carry, 0);
    assert.equal(steps.tens.result, 3);
    assert.equal(steps.tens.fullSum, 3);
  });

  it('carry from ones: 57 + 35 = 92', () => {
    const steps = getSteps(57, 35);
    // Ones: 7 + 5 = 12 → result 2, carry 1
    assert.equal(steps.ones.a, 7);
    assert.equal(steps.ones.b, 5);
    assert.equal(steps.ones.carry, 0);
    assert.equal(steps.ones.result, 2);
    assert.equal(steps.ones.fullSum, 12);
    // Tens: 5 + 3 + 1 = 9
    assert.equal(steps.tens.a, 5);
    assert.equal(steps.tens.b, 3);
    assert.equal(steps.tens.carry, 1);
    assert.equal(steps.tens.result, 9);
    assert.equal(steps.tens.fullSum, 9);
  });

  it('carry from tens: 180 + 150 = 330', () => {
    const steps = getSteps(180, 150);
    // Ones: 0 + 0 = 0
    assert.equal(steps.ones.fullSum, 0);
    assert.equal(steps.ones.result, 0);
    // Tens: 8 + 5 = 13 → result 3, carry 1
    assert.equal(steps.tens.a, 8);
    assert.equal(steps.tens.b, 5);
    assert.equal(steps.tens.carry, 0);
    assert.equal(steps.tens.result, 3);
    assert.equal(steps.tens.fullSum, 13);
    // Hundreds: 1 + 1 + 1 = 3
    assert.equal(steps.hundreds.a, 1);
    assert.equal(steps.hundreds.b, 1);
    assert.equal(steps.hundreds.carry, 1);
    assert.equal(steps.hundreds.result, 3);
  });

  it('double carry: 187 + 345 = 532', () => {
    const steps = getSteps(187, 345);
    // Ones: 7 + 5 = 12
    assert.equal(steps.ones.fullSum, 12);
    assert.equal(steps.ones.result, 2);
    // Tens: 8 + 4 + 1 = 13
    assert.equal(steps.tens.fullSum, 13);
    assert.equal(steps.tens.result, 3);
    assert.equal(steps.tens.carry, 1);
    // Hundreds: 1 + 3 + 1 = 5
    assert.equal(steps.hundreds.result, 5);
    assert.equal(steps.hundreds.carry, 1);
  });

  it('needsHundreds is false for small sums', () => {
    const steps = getSteps(3, 4);
    assert.equal(steps.needsHundreds, false);
  });

  it('needsHundreds is true when hundreds digit exists', () => {
    const steps = getSteps(100, 200);
    assert.equal(steps.needsHundreds, true);
  });

  it('all zeros: 0 + 0', () => {
    const steps = getSteps(0, 0);
    assert.equal(steps.ones.fullSum, 0);
    assert.equal(steps.tens.fullSum, 0);
    assert.equal(steps.hundreds.fullSum, 0);
  });

  it('carry cascading 99 + 1 = 100', () => {
    const steps = getSteps(99, 1);
    // Ones: 9 + 1 = 10
    assert.equal(steps.ones.fullSum, 10);
    assert.equal(steps.ones.result, 0);
    // Tens: 9 + 0 + 1 = 10
    assert.equal(steps.tens.fullSum, 10);
    assert.equal(steps.tens.result, 0);
    assert.equal(steps.tens.carry, 1);
    // Hundreds: 0 + 0 + 1 = 1
    assert.equal(steps.hundreds.result, 1);
  });
});

describe('needsCarry()', () => {
  const win = loadAddition();

  it('returns false when no carry needed', () => {
    assert.equal(win.needsCarry(23, 14), false);
  });

  it('returns true when ones carry needed', () => {
    assert.equal(win.needsCarry(57, 35), true);
  });

  it('returns true when tens carry needed', () => {
    assert.equal(win.needsCarry(180, 150), true);
  });
});

describe('carryCount()', () => {
  const win = loadAddition();

  it('returns 0 for no carries', () => {
    assert.equal(win.carryCount(23, 14), 0);
  });

  it('returns 1 for single carry', () => {
    assert.equal(win.carryCount(57, 35), 1);
  });

  it('returns 2 for double carry', () => {
    assert.equal(win.carryCount(187, 345), 2);
  });
});
