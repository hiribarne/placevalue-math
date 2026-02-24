const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { loadAddition, loadSubtraction } = require('./setup');

describe('Addition — Guide Mode prompts', () => {
  function setupGuide(num1, num2) {
    const win = loadAddition();
    const d1 = win.digits(num1), d2 = win.digits(num2);
    const dd1 = win.digitDisplay(d1), dd2 = win.digitDisplay(d2);
    win.document.getElementById('g-a1-h').value = dd1.hundreds;
    win.document.getElementById('g-a1-t').value = dd1.tens;
    win.document.getElementById('g-a1-o').value = dd1.ones;
    win.document.getElementById('g-a2-h').value = dd2.hundreds;
    win.document.getElementById('g-a2-t').value = dd2.tens;
    win.document.getElementById('g-a2-o').value = dd2.ones;
    win.syncStateFromGalera();
    return win;
  }

  it('ones prompt: 57 + 35', () => {
    const win = setupGuide(57, 35);
    const prompt = win.getGuidePrompt();
    assert.match(prompt, /Ones/);
    assert.match(prompt, /7/);
    assert.match(prompt, /5/);
    assert.match(prompt, /\?/);
  });

  it('ones prompt includes carry when present', () => {
    const win = setupGuide(57, 35);
    // First step is ones (no carry from previous), so carry should be 0
    const steps = win.getAdditionSteps();
    assert.equal(steps.ones.carry, 0);
  });

  it('tens step has carry from ones', () => {
    const win = setupGuide(57, 35);
    const steps = win.getAdditionSteps();
    assert.equal(steps.tens.carry, 1);
  });
});

describe('Subtraction — Guide Mode prompts', () => {
  function setupGuide(num1, num2) {
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
    return win;
  }

  it('borrow prompt when ones < subtrahend', () => {
    const win = setupGuide(52, 37);
    const prompt = win.getGuidePrompt();
    // Should show "Need to borrow!" since 2 < 7
    assert.match(prompt, /borrow/i);
  });

  it('normal prompt when no borrow', () => {
    const win = setupGuide(87, 23);
    const prompt = win.getGuidePrompt();
    // Should show subtraction: "Ones: 7 - 3 = ?"
    assert.match(prompt, /Ones/);
    assert.match(prompt, /7/);
    assert.match(prompt, /3/);
    assert.match(prompt, /\?/);
  });

  it('guideBorrowsPending is set for borrow problems', () => {
    const win = setupGuide(52, 37);
    // After syncStateFromGalera, guideBorrowsPending should be set
    // We need to check via the guide borrow button visibility
    const borrowBtn = win.document.getElementById('guideBorrowBtn');
    assert.equal(borrowBtn.style.display, 'inline-block');
  });

  it('guideBorrowsPending is null for no-borrow problems', () => {
    const win = setupGuide(87, 23);
    const borrowBtn = win.document.getElementById('guideBorrowBtn');
    assert.equal(borrowBtn.style.display, 'none');
  });
});

describe('Addition — Guide input validation', () => {
  it('guide input only accepts digits up to 2 chars', () => {
    const win = loadAddition();
    const guideInput = win.document.getElementById('guideInput');
    guideInput.value = 'abc123def';
    guideInput.dispatchEvent(new win.Event('input'));
    // After filtering, should be at most 2 digits
    assert.ok(guideInput.value.length <= 2);
    assert.match(guideInput.value, /^\d*$/);
  });
});
